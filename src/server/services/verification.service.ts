import "server-only";

import {
  AUTH_CODE_PURPOSES,
  AUTH_CODE_RESEND_COOLDOWN_SECONDS,
  AUTH_LANGUAGES,
  AUTH_USER_STATUSES,
  type AuthLanguage,
} from "@/constants/auth/auth.constants";

import {
  createAuthCodeLifetime,
  createAuthCodePair,
  getAuthCodeAttemptState,
  getAuthCodeCooldownState,
  getAuthCodeResendState,
  isAuthCodeExpired,
  verifyAuthCodeHash,
} from "@/lib/auth/codes";

import { safeMaskEmailAddress } from "@/lib/auth/email-mask";

import { sendEmailSafely } from "@/lib/email/email.service";

import { createVerifyEmailTemplate } from "@/lib/email/templates/verify-email.template";

import { prisma } from "@/lib/database/prisma";

import {
  resendVerificationCodeSchema,
  verifyEmailSchema,
  type ResendVerificationCodeSchemaOutput,
  type VerifyEmailSchemaOutput,
} from "@/schemas/auth/verify-email.schema";

import { createAuditLogSafely } from "@/server/repositories/audit-log.repository";

import {
  consumeAuthCode,
  findLatestAuthCodeWithUserByEmailAndPurpose,
  incrementAuthCodeAttemptCount,
  invalidateAuthCodes,
  replaceAuthCodeForResend,
  replaceUserAuthCode,
} from "@/server/repositories/auth-code.repository";

import { createNotification } from "@/server/repositories/notification.repository";

import { markUserEmailAsVerified } from "@/server/repositories/user.repository";

export type VerificationServiceErrorCode =
  | "VERIFICATION_FAILED"
  | "VERIFICATION_RESEND_FAILED"
  | "VERIFICATION_CONFIGURATION_ERROR";

export type VerifyEmailCodeStatus =
  | "verified"
  | "already-verified"
  | "code-expired"
  | "attempts-exceeded"
  | "invalid-code"
  | "not-found";

export type ResendVerificationCodeStatus =
  | "sent"
  | "cooldown"
  | "resend-limit-exceeded"
  | "already-verified"
  | "not-found";

export interface VerificationRequestMetadata {
  identifierHash?: string | null;
  ipHash?: string | null;
  userAgent?: string | null;
}

export interface VerifiedEmailUser {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  avatarUrl: string | null;

  role: string;
  status: string;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerifiedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface VerifyEmailSuccessResult {
  status: "verified";

  user: VerifiedEmailUser;

  maskedEmail: string;

  notificationCreated: boolean;
}

export interface VerifyEmailAlreadyVerifiedResult {
  status: "already-verified";

  maskedEmail: string;
}

export interface VerifyEmailCodeExpiredResult {
  status: "code-expired";

  maskedEmail: string;

  resendAvailableInSeconds: number;
}

export interface VerifyEmailAttemptsExceededResult {
  status: "attempts-exceeded";

  maskedEmail: string;

  attemptsRemaining: 0;

  resendAvailableInSeconds: number;
}

export interface VerifyEmailInvalidCodeResult {
  status: "invalid-code";

  maskedEmail: string;

  attemptsRemaining: number;
}

export interface VerifyEmailNotFoundResult {
  status: "not-found";

  maskedEmail: string;
}

export type VerifyEmailCodeResult =
  | VerifyEmailSuccessResult
  | VerifyEmailAlreadyVerifiedResult
  | VerifyEmailCodeExpiredResult
  | VerifyEmailAttemptsExceededResult
  | VerifyEmailInvalidCodeResult
  | VerifyEmailNotFoundResult;

export interface VerificationCodeSentResult {
  status: "sent";

  maskedEmail: string;

  verificationExpiresInSeconds: number;

  resendAvailableInSeconds: number;

  emailSent: boolean;
}

export interface VerificationCodeCooldownResult {
  status: "cooldown";

  maskedEmail: string;

  retryAfterSeconds: number;

  resendAvailableInSeconds: number;
}

export interface VerificationCodeResendLimitResult {
  status: "resend-limit-exceeded";

  maskedEmail: string;

  remainingResends: 0;

  resendAvailableInSeconds: number;
}

export interface VerificationCodeAlreadyVerifiedResult {
  status: "already-verified";

  maskedEmail: string;
}

export interface VerificationCodeNotFoundResult {
  status: "not-found";

  maskedEmail: string;
}

export type ResendVerificationCodeResult =
  | VerificationCodeSentResult
  | VerificationCodeCooldownResult
  | VerificationCodeResendLimitResult
  | VerificationCodeAlreadyVerifiedResult
  | VerificationCodeNotFoundResult;

export class VerificationServiceError extends Error {
  readonly code: VerificationServiceErrorCode;

  constructor(
    code: VerificationServiceErrorCode,
    message: string,
    options?: {
      cause?: unknown;
    },
  ) {
    super(message, {
      cause: options?.cause,
    });

    this.name = "VerificationServiceError";
    this.code = code;
  }
}

const HASH_PATTERN = /^[a-f0-9]{64}$/i;

const MAXIMUM_USER_AGENT_LENGTH = 500;

function normalizeOptionalHash(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedHash = value.trim().toLowerCase();

  return HASH_PATTERN.test(normalizedHash) ? normalizedHash : null;
}

function resolveMetadataIpHash(
  metadata: VerificationRequestMetadata,
): string | null {
  return (
    normalizeOptionalHash(metadata.ipHash) ??
    normalizeOptionalHash(metadata.identifierHash)
  );
}

function normalizeUserAgent(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAXIMUM_USER_AGENT_LENGTH);

  return normalizedValue || null;
}

function resolveLanguage(value: unknown): AuthLanguage {
  return value === AUTH_LANGUAGES.ENGLISH
    ? AUTH_LANGUAGES.ENGLISH
    : AUTH_LANGUAGES.SPANISH;
}

function toVerifiedEmailUser(user: {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  avatarUrl: string | null;

  role: string;
  status: string;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerifiedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}): VerifiedEmailUser {
  return {
    id: user.id,

    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,

    email: user.email,

    avatarUrl: user.avatarUrl,

    role: user.role,
    status: user.status,

    preferredLanguage: user.preferredLanguage,
    preferredTheme: user.preferredTheme,

    emailVerifiedAt: user.emailVerifiedAt,

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function recordVerificationAudit({
  actorUserId,
  subjectUserId,

  action,

  entityId,

  metadata,

  details,
}: {
  actorUserId?: string | null;

  subjectUserId?: string | null;

  action: string;

  entityId?: string | null;

  metadata: VerificationRequestMetadata;

  details?: unknown;
}): Promise<void> {
  await createAuditLogSafely({
    actorUserId: actorUserId ?? null,

    subjectUserId: subjectUserId ?? null,

    action,

    entityType: "EMAIL_VERIFICATION",

    entityId: entityId ?? null,

    ipHash: resolveMetadataIpHash(metadata),

    userAgent: normalizeUserAgent(metadata.userAgent),

    details,
  });
}

async function sendVerificationEmail({
  email,
  displayName,
  preferredLanguage,
  code,
  expiresInSeconds,
}: {
  email: string;
  displayName: string;
  preferredLanguage: string;

  code: string;

  expiresInSeconds: number;
}): Promise<boolean> {
  const template = createVerifyEmailTemplate({
    code,

    displayName,

    language: resolveLanguage(preferredLanguage),

    expiresInMinutes: Math.ceil(expiresInSeconds / 60),

    supportEmail:
      process.env.SMTP_REPLY_TO ?? process.env.EMAIL_REPLY_TO ?? null,
  });

  const delivery = await sendEmailSafely({
    to: {
      email,
      name: displayName,
    },

    subject: template.subject,

    text: template.text,

    html: template.html,

    category: "email-verification",
  });

  return delivery.ok;
}

/**
 * Verifica el código enviado al correo del usuario.
 */
export async function verifyEmailCode(
  input: VerifyEmailSchemaOutput,
  metadata: VerificationRequestMetadata = {},
): Promise<VerifyEmailCodeResult> {
  const data = verifyEmailSchema.parse(input);

  const maskedEmail = safeMaskEmailAddress(data.email);

  const purpose = AUTH_CODE_PURPOSES.EMAIL_VERIFICATION;

  let authCode;

  try {
    authCode = await findLatestAuthCodeWithUserByEmailAndPurpose({
      email: data.email,
      purpose,
    });
  } catch (error) {
    throw new VerificationServiceError(
      "VERIFICATION_FAILED",
      "No fue posible consultar el código de verificación.",
      {
        cause: error,
      },
    );
  }

  if (!authCode) {
    await recordVerificationAudit({
      action: "EMAIL_VERIFICATION_NOT_FOUND",

      metadata,

      details: {
        reason: "ACCOUNT_OR_CODE_NOT_FOUND",
      },
    });

    return {
      status: "not-found",
      maskedEmail,
    };
  }

  const user = authCode.user;

  if (
    user.emailVerifiedAt !== null ||
    user.status === AUTH_USER_STATUSES.ACTIVE
  ) {
    return {
      status: "already-verified",
      maskedEmail: safeMaskEmailAddress(user.email),
    };
  }

  const attemptState = getAuthCodeAttemptState(authCode.attemptCount);

  if (attemptState.hasReachedLimit) {
    await recordVerificationAudit({
      subjectUserId: user.id,

      action: "EMAIL_VERIFICATION_ATTEMPTS_EXCEEDED",

      entityId: authCode.id,

      metadata,

      details: {
        attemptCount: authCode.attemptCount,
        maximumAttempts: attemptState.maximumAttempts,
      },
    });

    return {
      status: "attempts-exceeded",

      maskedEmail: safeMaskEmailAddress(user.email),

      attemptsRemaining: 0,

      resendAvailableInSeconds: AUTH_CODE_RESEND_COOLDOWN_SECONDS,
    };
  }

  if (authCode.consumedAt !== null) {
    await recordVerificationAudit({
      subjectUserId: user.id,

      action: "EMAIL_VERIFICATION_CODE_ALREADY_USED",

      entityId: authCode.id,

      metadata,
    });

    return {
      status: "invalid-code",

      maskedEmail: safeMaskEmailAddress(user.email),

      attemptsRemaining: attemptState.remainingAttempts,
    };
  }

  if (isAuthCodeExpired(authCode.expiresAt)) {
    await recordVerificationAudit({
      subjectUserId: user.id,

      action: "EMAIL_VERIFICATION_CODE_EXPIRED",

      entityId: authCode.id,

      metadata,

      details: {
        expiredAt: authCode.expiresAt.toISOString(),
      },
    });

    return {
      status: "code-expired",

      maskedEmail: safeMaskEmailAddress(user.email),

      resendAvailableInSeconds: 0,
    };
  }

  const codeMatches = verifyAuthCodeHash(
    data.code,
    authCode.codeHash,
    purpose,
    user.id,
  );

  if (!codeMatches) {
    let updatedAuthCode;

    try {
      updatedAuthCode = await incrementAuthCodeAttemptCount(authCode.id);
    } catch (error) {
      throw new VerificationServiceError(
        "VERIFICATION_FAILED",
        "No fue posible registrar el intento de verificación.",
        {
          cause: error,
        },
      );
    }

    const updatedAttemptCount =
      updatedAuthCode?.attemptCount ?? authCode.attemptCount + 1;

    const updatedAttemptState =
      getAuthCodeAttemptState(updatedAttemptCount);

    await recordVerificationAudit({
      subjectUserId: user.id,

      action: updatedAttemptState.hasReachedLimit
        ? "EMAIL_VERIFICATION_ATTEMPTS_EXCEEDED"
        : "EMAIL_VERIFICATION_CODE_INVALID",

      entityId: authCode.id,

      metadata,

      details: {
        attemptCount: updatedAttemptCount,
        remainingAttempts: updatedAttemptState.remainingAttempts,
      },
    });

    if (updatedAttemptState.hasReachedLimit) {
      return {
        status: "attempts-exceeded",

        maskedEmail: safeMaskEmailAddress(user.email),

        attemptsRemaining: 0,

        resendAvailableInSeconds: AUTH_CODE_RESEND_COOLDOWN_SECONDS,
      };
    }

    return {
      status: "invalid-code",

      maskedEmail: safeMaskEmailAddress(user.email),

      attemptsRemaining: updatedAttemptState.remainingAttempts,
    };
  }

  try {
    const transactionResult = await prisma.$transaction(
      async (transaction) => {
        const consumedCode = await consumeAuthCode(
          authCode.id,
          new Date(),
          transaction,
        );

        if (!consumedCode) {
          throw new VerificationServiceError(
            "VERIFICATION_FAILED",
            "El código ya no se encuentra disponible.",
          );
        }

        const verifiedUser = await markUserEmailAsVerified(
          user.id,
          new Date(),
          transaction,
        );

        await invalidateAuthCodes(
          {
            userId: user.id,
            purpose,
            exceptAuthCodeId: authCode.id,
          },
          transaction,
        );

        let notificationCreated = false;

        try {
          await createNotification(
            {
              userId: user.id,

              type: "SECURITY",

              titleEs: "Correo verificado",

              titleEn: "Email verified",

              messageEs:
                "Tu correo electrónico fue verificado correctamente.",

              messageEn:
                "Your email address was verified successfully.",

              actionUrl: "/perfil",
            },
            transaction,
          );

          notificationCreated = true;
        } catch {
          /*
           * La verificación no debe revertirse únicamente
           * porque la notificación no pudo crearse.
           */
          notificationCreated = false;
        }

        return {
          verifiedUser,
          notificationCreated,
        };
      },
    );

    await recordVerificationAudit({
      actorUserId: user.id,

      subjectUserId: user.id,

      action: "EMAIL_VERIFIED",

      entityId: authCode.id,

      metadata,

      details: {
        notificationCreated: transactionResult.notificationCreated,
      },
    });

    return {
      status: "verified",

      user: toVerifiedEmailUser(transactionResult.verifiedUser),

      maskedEmail: safeMaskEmailAddress(
        transactionResult.verifiedUser.email,
      ),

      notificationCreated: transactionResult.notificationCreated,
    };
  } catch (error) {
    if (error instanceof VerificationServiceError) {
      throw error;
    }

    throw new VerificationServiceError(
      "VERIFICATION_FAILED",
      "No fue posible completar la verificación del correo.",
      {
        cause: error,
      },
    );
  }
}

/**
 * Genera y envía un código nuevo respetando:
 *
 * - Tiempo de espera.
 * - Límite de reenvíos.
 * - Código de un solo uso.
 */
export async function resendVerificationCode(
  input: ResendVerificationCodeSchemaOutput,
  metadata: VerificationRequestMetadata = {},
): Promise<ResendVerificationCodeResult> {
  const data = resendVerificationCodeSchema.parse(input);

  const maskedEmail = safeMaskEmailAddress(data.email);

  const purpose = AUTH_CODE_PURPOSES.EMAIL_VERIFICATION;

  let latestAuthCode;

  try {
    latestAuthCode =
      await findLatestAuthCodeWithUserByEmailAndPurpose({
        email: data.email,
        purpose,
      });
  } catch (error) {
    throw new VerificationServiceError(
      "VERIFICATION_RESEND_FAILED",
      "No fue posible consultar el código de verificación.",
      {
        cause: error,
      },
    );
  }

  if (!latestAuthCode) {
    await recordVerificationAudit({
      action: "EMAIL_VERIFICATION_RESEND_NOT_FOUND",

      metadata,

      details: {
        reason: "ACCOUNT_OR_CODE_NOT_FOUND",
      },
    });

    return {
      status: "not-found",
      maskedEmail,
    };
  }

  const user = latestAuthCode.user;

  const resolvedMaskedEmail = safeMaskEmailAddress(user.email);

  if (
    user.emailVerifiedAt !== null ||
    user.status === AUTH_USER_STATUSES.ACTIVE
  ) {
    return {
      status: "already-verified",
      maskedEmail: resolvedMaskedEmail,
    };
  }

  const resendState = getAuthCodeResendState(
    latestAuthCode.resendCount,
  );

  if (resendState.hasReachedLimit) {
    await recordVerificationAudit({
      subjectUserId: user.id,

      action: "EMAIL_VERIFICATION_RESEND_LIMIT_EXCEEDED",

      entityId: latestAuthCode.id,

      metadata,

      details: {
        resendCount: latestAuthCode.resendCount,
        maximumResends: resendState.maximumResends,
      },
    });

    return {
      status: "resend-limit-exceeded",

      maskedEmail: resolvedMaskedEmail,

      remainingResends: 0,

      resendAvailableInSeconds: AUTH_CODE_RESEND_COOLDOWN_SECONDS,
    };
  }

  const cooldownState = getAuthCodeCooldownState(
    latestAuthCode.lastSentAt,
    latestAuthCode.resendCount,
  );

  if (
    !cooldownState.canResend &&
    cooldownState.remainingSeconds > 0
  ) {
    return {
      status: "cooldown",

      maskedEmail: resolvedMaskedEmail,

      retryAfterSeconds: cooldownState.remainingSeconds,

      resendAvailableInSeconds: cooldownState.remainingSeconds,
    };
  }

  const lifetime = createAuthCodeLifetime(purpose);

  const { code, codeHash } = createAuthCodePair(
    purpose,
    user.id,
  );

  try {
    if (latestAuthCode.consumedAt === null) {
      const replacedCode = await replaceAuthCodeForResend({
        authCodeId: latestAuthCode.id,

        codeHash,

        expiresAt: lifetime.expiresAt,

        sentAt: lifetime.createdAt,
      });

      if (!replacedCode) {
        throw new VerificationServiceError(
          "VERIFICATION_RESEND_FAILED",
          "El código ya no se encuentra disponible para reenvío.",
        );
      }
    } else {
      await replaceUserAuthCode({
        userId: user.id,

        purpose,

        codeHash,

        expiresAt: lifetime.expiresAt,

        lastSentAt: lifetime.createdAt,

        attemptCount: 0,

        resendCount: latestAuthCode.resendCount + 1,
      });
    }

    const emailSent = await sendVerificationEmail({
      email: user.email,

      displayName: user.displayName,

      preferredLanguage: user.preferredLanguage,

      code,

      expiresInSeconds: lifetime.durationSeconds,
    });

    await recordVerificationAudit({
      subjectUserId: user.id,

      action: emailSent
        ? "EMAIL_VERIFICATION_CODE_RESENT"
        : "EMAIL_VERIFICATION_EMAIL_SEND_FAILED",

      entityId: latestAuthCode.id,

      metadata,

      details: {
        emailSent,

        expiresAt: lifetime.expiresAt.toISOString(),

        resendCount: latestAuthCode.resendCount + 1,
      },
    });

    return {
      status: "sent",

      maskedEmail: resolvedMaskedEmail,

      verificationExpiresInSeconds: lifetime.durationSeconds,

      resendAvailableInSeconds: AUTH_CODE_RESEND_COOLDOWN_SECONDS,

      emailSent,
    };
  } catch (error) {
    if (error instanceof VerificationServiceError) {
      throw error;
    }

    throw new VerificationServiceError(
      "VERIFICATION_RESEND_FAILED",
      "No fue posible reenviar el código de verificación.",
      {
        cause: error,
      },
    );
  }
}

export function isVerificationServiceError(
  error: unknown,
): error is VerificationServiceError {
  return error instanceof VerificationServiceError;
}

/**
 * Alias compatibles con las rutas y servicios existentes.
 */
export const verifyEmail = verifyEmailCode;

export const confirmEmailCode = verifyEmailCode;

export const confirmEmailVerification = verifyEmailCode;

export const resendEmailVerificationCode =
  resendVerificationCode;

export const resendEmailVerification =
  resendVerificationCode;

export const requestNewVerificationCode =
  resendVerificationCode;

export type VerifyEmailCodeInput = VerifyEmailSchemaOutput;

export type ResendVerificationCodeInput =
  ResendVerificationCodeSchemaOutput;