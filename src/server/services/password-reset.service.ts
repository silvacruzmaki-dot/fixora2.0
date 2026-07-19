import "server-only";

import {
  AUTH_CODE_PURPOSES,
  AUTH_CODE_RESEND_COOLDOWN_SECONDS,
  AUTH_LANGUAGES,
  AUTH_PASSWORD_RESET_CODE_EXPIRATION_SECONDS,
  AUTH_USER_STATUSES,
  isAuthRole,
  isAuthUserStatus,
  type AuthLanguage,
  type AuthRole,
  type AuthUserStatus,
} from "@/constants/auth/auth.constants";

import {
  createAuthCodeLifetime,
  createAuthCodePair,
  getAuthCodeAttemptState,
  getAuthCodeCooldownState,
  getAuthCodeRemainingSeconds,
  getAuthCodeResendState,
  isAuthCodeExpired,
  verifyAuthCodeHash,
} from "@/lib/auth/codes";

import {
  safeMaskEmailAddress,
} from "@/lib/auth/email-mask";

import {
  hashPassword,
  verifyPassword,
} from "@/lib/auth/password";

import {
  prisma,
} from "@/lib/database/prisma";

import {
  sendEmailSafely,
} from "@/lib/email/email.service";

import {
  createResetPasswordTemplate,
} from "@/lib/email/templates/reset-password.template";

import {
  forgotPasswordSchema,
  verifyPasswordResetCodeSchema,
  type ForgotPasswordSchemaOutput,
  type VerifyPasswordResetCodeSchemaOutput,
} from "@/schemas/auth/forgot-password.schema";

import {
  resetPasswordSchema,
  type ResetPasswordSchemaOutput,
} from "@/schemas/auth/reset-password.schema";

import {
  createAuditLogSafely,
} from "@/server/repositories/audit-log.repository";

import {
  consumeAuthCode,
  findLatestAuthCodeWithUserByEmailAndPurpose,
  incrementAuthCodeAttemptCount,
  invalidateAuthCodes,
  replaceAuthCodeForResend,
  replaceUserAuthCode,
} from "@/server/repositories/auth-code.repository";

import {
  createNotification,
} from "@/server/repositories/notification.repository";

import {
  revokeUserSessions,
} from "@/server/repositories/session.repository";

import {
  findUserByEmail,
  findUserForAuthenticationByEmail,
  updateUserPassword,
} from "@/server/repositories/user.repository";

export type PasswordResetServiceErrorCode =
  | "PASSWORD_RESET_REQUEST_FAILED"
  | "PASSWORD_RESET_VERIFICATION_FAILED"
  | "PASSWORD_RESET_FAILED"
  | "PASSWORD_RESET_CONFIGURATION_ERROR";

export type RequestPasswordResetStatus =
  | "sent"
  | "cooldown"
  | "resend-limit-exceeded";

export type VerifyPasswordResetCodeStatus =
  | "verified"
  | "code-expired"
  | "attempts-exceeded"
  | "invalid-code"
  | "account-unavailable"
  | "not-found";

export type ResetPasswordStatus =
  | "password-reset"
  | "password-reused"
  | "code-expired"
  | "attempts-exceeded"
  | "invalid-code"
  | "account-unavailable"
  | "not-found";

export interface PasswordResetRequestMetadata {
  identifierHash?:
    | string
    | null;

  ipHash?:
    | string
    | null;

  userAgent?:
    | string
    | null;
}

export interface PasswordResetUser {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  avatarUrl:
    | string
    | null;

  role: AuthRole;
  status: AuthUserStatus;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerifiedAt:
    | Date
    | null;

  lockedUntil:
    | Date
    | null;

  lastLoginAt:
    | Date
    | null;

  passwordChangedAt:
    | Date
    | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordResetCodeSentResult {
  status:
    "sent";

  maskedEmail: string;

  resetExpiresInSeconds:
    number;

  recoveryExpiresInSeconds:
    number;

  verificationExpiresInSeconds:
    number;

  resendAvailableInSeconds:
    number;

  /*
   * Este campo es útil para registros internos.
   *
   * La ruta pública puede omitirlo para no revelar
   * si una cuenta existe.
   */
  emailSent: boolean;
}

export interface PasswordResetCooldownResult {
  status:
    "cooldown";

  maskedEmail: string;

  retryAfterSeconds:
    number;

  resendAvailableInSeconds:
    number;
}

export interface PasswordResetResendLimitResult {
  status:
    "resend-limit-exceeded";

  maskedEmail: string;

  remainingResends:
    0;

  resendAvailableInSeconds:
    number;
}

export type RequestPasswordResetResult =
  | PasswordResetCodeSentResult
  | PasswordResetCooldownResult
  | PasswordResetResendLimitResult;

export interface PasswordResetCodeVerifiedResult {
  status:
    "verified";

  maskedEmail: string;

  expiresAt: Date;

  remainingSeconds:
    number;
}

export interface PasswordResetCodeExpiredResult {
  status:
    "code-expired";

  maskedEmail: string;

  resendAvailableInSeconds:
    number;
}

export interface PasswordResetAttemptsExceededResult {
  status:
    "attempts-exceeded";

  maskedEmail: string;

  attemptsRemaining:
    0;

  resendAvailableInSeconds:
    number;
}

export interface PasswordResetInvalidCodeResult {
  status:
    "invalid-code";

  maskedEmail: string;

  attemptsRemaining:
    number;
}

export interface PasswordResetAccountUnavailableResult {
  status:
    "account-unavailable";

  maskedEmail: string;
}

export interface PasswordResetCodeNotFoundResult {
  status:
    "not-found";

  maskedEmail: string;
}

export type VerifyPasswordResetCodeResult =
  | PasswordResetCodeVerifiedResult
  | PasswordResetCodeExpiredResult
  | PasswordResetAttemptsExceededResult
  | PasswordResetInvalidCodeResult
  | PasswordResetAccountUnavailableResult
  | PasswordResetCodeNotFoundResult;

export interface PasswordResetCompletedResult {
  status:
    "password-reset";

  user:
    PasswordResetUser;

  maskedEmail: string;

  revokedSessions:
    number;

  sessionsRevoked:
    number;

  notificationCreated:
    boolean;
}

export interface PasswordReusedResult {
  status:
    "password-reused";

  maskedEmail: string;
}

export type ResetPasswordResult =
  | PasswordResetCompletedResult
  | PasswordReusedResult
  | PasswordResetCodeExpiredResult
  | PasswordResetAttemptsExceededResult
  | PasswordResetInvalidCodeResult
  | PasswordResetAccountUnavailableResult
  | PasswordResetCodeNotFoundResult;

export class PasswordResetServiceError extends Error {
  readonly code:
    PasswordResetServiceErrorCode;

  constructor(
    code:
      PasswordResetServiceErrorCode,
    message: string,
    options?: {
      cause?: unknown;
    },
  ) {
    super(
      message,
      {
        cause:
          options?.cause,
      },
    );

    this.name =
      "PasswordResetServiceError";

    this.code =
      code;
  }
}

class PasswordResetCodeUnavailableError extends Error {
  constructor() {
    super(
      "El código de recuperación ya no se encuentra disponible.",
    );

    this.name =
      "PasswordResetCodeUnavailableError";
  }
}

const HASH_PATTERN =
  /^[a-f0-9]{64}$/i;

const MAXIMUM_USER_AGENT_LENGTH =
  500;

function normalizeOptionalHash(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  const normalizedHash =
    value
      .trim()
      .toLowerCase();

  return HASH_PATTERN.test(
    normalizedHash,
  )
    ? normalizedHash
    : null;
}

function resolveMetadataIpHash(
  metadata:
    PasswordResetRequestMetadata,
): string | null {
  return (
    normalizeOptionalHash(
      metadata.ipHash,
    ) ??
    normalizeOptionalHash(
      metadata.identifierHash,
    )
  );
}

function normalizeUserAgent(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  const normalizedValue =
    value
      .replace(
        /[\u0000-\u001F\u007F]+/g,
        " ",
      )
      .trim()
      .replace(
        /\s+/g,
        " ",
      )
      .slice(
        0,
        MAXIMUM_USER_AGENT_LENGTH,
      );

  return (
    normalizedValue ||
    null
  );
}

function resolveLanguage(
  value: unknown,
): AuthLanguage {
  return value ===
    AUTH_LANGUAGES.ENGLISH
    ? AUTH_LANGUAGES.ENGLISH
    : AUTH_LANGUAGES.SPANISH;
}

/*
 * Comprueba si una cuenta puede utilizar el proceso
 * de recuperación de contraseña.
 *
 * Devuelve un booleano normal porque una respuesta
 * false también puede representar una cuenta existente
 * que está deshabilitada o pendiente de verificación.
 */
function accountCanResetPassword(
  user:
    | {
        status: string;

        emailVerifiedAt:
          | Date
          | null;
      }
    | null
    | undefined,
): boolean {
  if (!user) {
    return false;
  }

  if (
    user.emailVerifiedAt ===
    null
  ) {
    return false;
  }

  if (
    user.status ===
      AUTH_USER_STATUSES.DISABLED ||
    user.status ===
      AUTH_USER_STATUSES.PENDING_VERIFICATION
  ) {
    return false;
  }

  /*
   * Las cuentas LOCKED sí pueden recuperar la contraseña.
   * Al terminar correctamente, updateUserPassword()
   * restablece su estado a ACTIVE.
   */
  return (
    user.status ===
      AUTH_USER_STATUSES.ACTIVE ||
    user.status ===
      AUTH_USER_STATUSES.LOCKED
  );
}

function normalizePasswordResetRole(
  value: unknown,
): AuthRole {
  if (
    isAuthRole(
      value,
    )
  ) {
    return value;
  }

  throw new PasswordResetServiceError(
    "PASSWORD_RESET_FAILED",
    "El rol de la cuenta no es válido.",
  );
}

function normalizePasswordResetStatus(
  value: unknown,
): AuthUserStatus {
  if (
    isAuthUserStatus(
      value,
    )
  ) {
    return value;
  }

  throw new PasswordResetServiceError(
    "PASSWORD_RESET_FAILED",
    "El estado de la cuenta no es válido.",
  );
}

function toPasswordResetUser(
  user: {
    id: string;

    firstName: string;
    lastName: string;
    displayName: string;

    email: string;

    avatarUrl:
      | string
      | null;

    role: unknown;
    status: unknown;

    preferredLanguage: string;
    preferredTheme: string;

    emailVerifiedAt:
      | Date
      | null;

    lockedUntil:
      | Date
      | null;

    lastLoginAt:
      | Date
      | null;

    passwordChangedAt:
      | Date
      | null;

    createdAt: Date;
    updatedAt: Date;
  },
): PasswordResetUser {
  return {
    id:
      user.id,

    firstName:
      user.firstName,

    lastName:
      user.lastName,

    displayName:
      user.displayName,

    email:
      user.email,

    avatarUrl:
      user.avatarUrl,

    role:
      normalizePasswordResetRole(
        user.role,
      ),

    status:
      normalizePasswordResetStatus(
        user.status,
      ),

    preferredLanguage:
      user.preferredLanguage,

    preferredTheme:
      user.preferredTheme,

    emailVerifiedAt:
      user.emailVerifiedAt,

    lockedUntil:
      user.lockedUntil,

    lastLoginAt:
      user.lastLoginAt,

    passwordChangedAt:
      user.passwordChangedAt,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
}

async function recordPasswordResetAudit(
  {
    actorUserId,
    subjectUserId,

    action,

    entityId,

    metadata,

    details,
  }: {
    actorUserId?:
      | string
      | null;

    subjectUserId?:
      | string
      | null;

    action: string;

    entityId?:
      | string
      | null;

    metadata:
      PasswordResetRequestMetadata;

    details?: unknown;
  },
): Promise<void> {
  await createAuditLogSafely({
    actorUserId:
      actorUserId ??
      null,

    subjectUserId:
      subjectUserId ??
      null,

    action,

    entityType:
      "PASSWORD_RESET",

    entityId:
      entityId ??
      null,

    ipHash:
      resolveMetadataIpHash(
        metadata,
      ),

    userAgent:
      normalizeUserAgent(
        metadata.userAgent,
      ),

    details,
  });
}

async function sendPasswordResetEmail(
  {
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

    expiresInSeconds:
      number;
  },
): Promise<boolean> {
  const template =
    createResetPasswordTemplate({
      code,

      displayName,

      language:
        resolveLanguage(
          preferredLanguage,
        ),

      expiresInMinutes:
        Math.ceil(
          expiresInSeconds /
            60,
        ),

      supportEmail:
        process.env
          .SMTP_REPLY_TO ??
        process.env
          .EMAIL_REPLY_TO ??
        null,
    });

  const delivery =
    await sendEmailSafely({
      to: {
        email,
        name:
          displayName,
      },

      subject:
        template.subject,

      text:
        template.text,

      html:
        template.html,

      category:
        "password-reset",
    });

  return delivery.ok;
}

function createGenericPasswordResetSentResult(
  maskedEmail: string,
  emailSent: boolean,
): PasswordResetCodeSentResult {
  return {
    status:
      "sent",

    maskedEmail,

    resetExpiresInSeconds:
      AUTH_PASSWORD_RESET_CODE_EXPIRATION_SECONDS,

    recoveryExpiresInSeconds:
      AUTH_PASSWORD_RESET_CODE_EXPIRATION_SECONDS,

    verificationExpiresInSeconds:
      AUTH_PASSWORD_RESET_CODE_EXPIRATION_SECONDS,

    resendAvailableInSeconds:
      AUTH_CODE_RESEND_COOLDOWN_SECONDS,

    emailSent,
  };
}

/**
 * Solicita o reenvía un código de recuperación.
 *
 * Cuando la cuenta no existe o no está disponible,
 * devuelve una respuesta genérica para reducir la
 * enumeración de correos.
 */
export async function requestPasswordReset(
  input:
    ForgotPasswordSchemaOutput,
  metadata:
    PasswordResetRequestMetadata = {},
): Promise<RequestPasswordResetResult> {
  const data =
    forgotPasswordSchema.parse(
      input,
    );

  const maskedEmail =
    safeMaskEmailAddress(
      data.email,
    );

  let user;

  try {
    user =
      await findUserByEmail(
        data.email,
      );
  } catch (error) {
    throw new PasswordResetServiceError(
      "PASSWORD_RESET_REQUEST_FAILED",
      "No fue posible procesar la solicitud de recuperación.",
      {
        cause:
          error,
      },
    );
  }

  if (
    !user ||
    !accountCanResetPassword(
      user,
    )
  ) {
    await recordPasswordResetAudit({
      subjectUserId:
        user?.id ??
        null,

      action:
        "PASSWORD_RESET_REQUEST_ACCEPTED",

      entityId:
        user?.id ??
        null,

      metadata,

      details: {
        deliveryAttempted:
          false,

        accountAvailable:
          false,
      },
    });

    /*
     * La respuesta pública mantiene el mismo formato
     * aunque el correo no corresponda a una cuenta.
     */
    return createGenericPasswordResetSentResult(
      maskedEmail,
      false,
    );
  }

  const purpose =
    AUTH_CODE_PURPOSES.PASSWORD_RESET;

  let latestAuthCode;

  try {
    latestAuthCode =
      await findLatestAuthCodeWithUserByEmailAndPurpose({
        email:
          user.email,

        purpose,
      });
  } catch (error) {
    throw new PasswordResetServiceError(
      "PASSWORD_RESET_REQUEST_FAILED",
      "No fue posible consultar la solicitud de recuperación.",
      {
        cause:
          error,
      },
    );
  }

  if (latestAuthCode) {
    const resendState =
      getAuthCodeResendState(
        latestAuthCode.resendCount,
      );

    if (
      resendState.hasReachedLimit
    ) {
      await recordPasswordResetAudit({
        subjectUserId:
          user.id,

        action:
          "PASSWORD_RESET_RESEND_LIMIT_EXCEEDED",

        entityId:
          latestAuthCode.id,

        metadata,

        details: {
          resendCount:
            latestAuthCode.resendCount,

          maximumResends:
            resendState.maximumResends,
        },
      });

      return {
        status:
          "resend-limit-exceeded",

        maskedEmail:
          safeMaskEmailAddress(
            user.email,
          ),

        remainingResends:
          0,

        resendAvailableInSeconds:
          AUTH_CODE_RESEND_COOLDOWN_SECONDS,
      };
    }

    const cooldownState =
      getAuthCodeCooldownState(
        latestAuthCode.lastSentAt,
        latestAuthCode.resendCount,
      );

    if (
      !cooldownState.canResend &&
      cooldownState.remainingSeconds >
        0
    ) {
      return {
        status:
          "cooldown",

        maskedEmail:
          safeMaskEmailAddress(
            user.email,
          ),

        retryAfterSeconds:
          cooldownState.remainingSeconds,

        resendAvailableInSeconds:
          cooldownState.remainingSeconds,
      };
    }
  }

  const lifetime =
    createAuthCodeLifetime(
      purpose,
    );

  const {
    code,
    codeHash,
  } =
    createAuthCodePair(
      purpose,
      user.id,
    );

  try {
    if (
      latestAuthCode &&
      latestAuthCode.consumedAt ===
        null
    ) {
      const replacedCode =
        await replaceAuthCodeForResend({
          authCodeId:
            latestAuthCode.id,

          codeHash,

          expiresAt:
            lifetime.expiresAt,

          sentAt:
            lifetime.createdAt,
        });

      if (!replacedCode) {
        throw new PasswordResetCodeUnavailableError();
      }
    } else {
      await replaceUserAuthCode({
        userId:
          user.id,

        purpose,

        codeHash,

        expiresAt:
          lifetime.expiresAt,

        lastSentAt:
          lifetime.createdAt,

        attemptCount:
          0,

        resendCount:
          latestAuthCode
            ? latestAuthCode.resendCount +
              1
            : 0,
      });
    }

    const emailSent =
      await sendPasswordResetEmail({
        email:
          user.email,

        displayName:
          user.displayName,

        preferredLanguage:
          user.preferredLanguage,

        code,

        expiresInSeconds:
          lifetime.durationSeconds,
      });

    await recordPasswordResetAudit({
      subjectUserId:
        user.id,

      action:
        emailSent
          ? "PASSWORD_RESET_CODE_SENT"
          : "PASSWORD_RESET_EMAIL_SEND_FAILED",

      entityId:
        user.id,

      metadata,

      details: {
        emailSent,

        expiresAt:
          lifetime.expiresAt
            .toISOString(),

        resendCount:
          latestAuthCode
            ? latestAuthCode.resendCount +
              1
            : 0,
      },
    });

    return {
      status:
        "sent",

      maskedEmail:
        safeMaskEmailAddress(
          user.email,
        ),

      resetExpiresInSeconds:
        lifetime.durationSeconds,

      recoveryExpiresInSeconds:
        lifetime.durationSeconds,

      verificationExpiresInSeconds:
        lifetime.durationSeconds,

      resendAvailableInSeconds:
        AUTH_CODE_RESEND_COOLDOWN_SECONDS,

      emailSent,
    };
  } catch (error) {
    throw new PasswordResetServiceError(
      "PASSWORD_RESET_REQUEST_FAILED",
      "No fue posible generar el código de recuperación.",
      {
        cause:
          error,
      },
    );
  }
}

/**
 * Verifica el código antes de mostrar el formulario
 * para establecer una contraseña nueva.
 *
 * El código todavía no se consume en esta etapa.
 */
export async function verifyPasswordResetCode(
  input:
    VerifyPasswordResetCodeSchemaOutput,
  metadata:
    PasswordResetRequestMetadata = {},
): Promise<VerifyPasswordResetCodeResult> {
  const data =
    verifyPasswordResetCodeSchema.parse(
      input,
    );

  const maskedEmail =
    safeMaskEmailAddress(
      data.email,
    );

  const purpose =
    AUTH_CODE_PURPOSES.PASSWORD_RESET;

  let authCode;

  try {
    authCode =
      await findLatestAuthCodeWithUserByEmailAndPurpose({
        email:
          data.email,

        purpose,
      });
  } catch (error) {
    throw new PasswordResetServiceError(
      "PASSWORD_RESET_VERIFICATION_FAILED",
      "No fue posible consultar el código de recuperación.",
      {
        cause:
          error,
      },
    );
  }

  if (!authCode) {
    await recordPasswordResetAudit({
      action:
        "PASSWORD_RESET_CODE_NOT_FOUND",

      metadata,

      details: {
        reason:
          "ACCOUNT_OR_CODE_NOT_FOUND",
      },
    });

    return {
      status:
        "not-found",

      maskedEmail,
    };
  }

  const user =
    authCode.user;

  const resolvedMaskedEmail =
    safeMaskEmailAddress(
      user.email,
    );

  if (
    !accountCanResetPassword(
      user,
    )
  ) {
    await recordPasswordResetAudit({
      subjectUserId:
        user.id,

      action:
        "PASSWORD_RESET_ACCOUNT_UNAVAILABLE",

      entityId:
        authCode.id,

      metadata,

      details: {
        accountStatus:
          user.status,

        emailVerified:
          user.emailVerifiedAt !==
          null,
      },
    });

    return {
      status:
        "account-unavailable",

      maskedEmail:
        resolvedMaskedEmail,
    };
  }

  const attemptState =
    getAuthCodeAttemptState(
      authCode.attemptCount,
    );

  if (
    attemptState.hasReachedLimit
  ) {
    return {
      status:
        "attempts-exceeded",

      maskedEmail:
        resolvedMaskedEmail,

      attemptsRemaining:
        0,

      resendAvailableInSeconds:
        AUTH_CODE_RESEND_COOLDOWN_SECONDS,
    };
  }

  if (
    authCode.consumedAt !==
      null
  ) {
    return {
      status:
        "invalid-code",

      maskedEmail:
        resolvedMaskedEmail,

      attemptsRemaining:
        attemptState.remainingAttempts,
    };
  }

  if (
    isAuthCodeExpired(
      authCode.expiresAt,
    )
  ) {
    await recordPasswordResetAudit({
      subjectUserId:
        user.id,

      action:
        "PASSWORD_RESET_CODE_EXPIRED",

      entityId:
        authCode.id,

      metadata,

      details: {
        expiredAt:
          authCode.expiresAt
            .toISOString(),
      },
    });

    return {
      status:
        "code-expired",

      maskedEmail:
        resolvedMaskedEmail,

      resendAvailableInSeconds:
        0,
    };
  }

  const codeMatches =
    verifyAuthCodeHash(
      data.code,
      authCode.codeHash,
      purpose,
      user.id,
    );

  if (!codeMatches) {
    let updatedAuthCode;

    try {
      updatedAuthCode =
        await incrementAuthCodeAttemptCount(
          authCode.id,
        );
    } catch (error) {
      throw new PasswordResetServiceError(
        "PASSWORD_RESET_VERIFICATION_FAILED",
        "No fue posible registrar el intento de recuperación.",
        {
          cause:
            error,
        },
      );
    }

    const updatedAttemptState =
      getAuthCodeAttemptState(
        updatedAuthCode?.attemptCount ??
          authCode.attemptCount +
            1,
      );

    await recordPasswordResetAudit({
      subjectUserId:
        user.id,

      action:
        updatedAttemptState.hasReachedLimit
          ? "PASSWORD_RESET_ATTEMPTS_EXCEEDED"
          : "PASSWORD_RESET_CODE_INVALID",

      entityId:
        authCode.id,

      metadata,

      details: {
        attemptsRemaining:
          updatedAttemptState.remainingAttempts,

        attemptCount:
          updatedAuthCode?.attemptCount ??
          authCode.attemptCount +
            1,
      },
    });

    if (
      updatedAttemptState.hasReachedLimit
    ) {
      return {
        status:
          "attempts-exceeded",

        maskedEmail:
          resolvedMaskedEmail,

        attemptsRemaining:
          0,

        resendAvailableInSeconds:
          AUTH_CODE_RESEND_COOLDOWN_SECONDS,
      };
    }

    return {
      status:
        "invalid-code",

      maskedEmail:
        resolvedMaskedEmail,

      attemptsRemaining:
        updatedAttemptState.remainingAttempts,
    };
  }

  const remainingSeconds =
    getAuthCodeRemainingSeconds(
      authCode.expiresAt,
    );

  await recordPasswordResetAudit({
    subjectUserId:
      user.id,

    action:
      "PASSWORD_RESET_CODE_VERIFIED",

    entityId:
      authCode.id,

    metadata,

    details: {
      remainingSeconds,
    },
  });

  return {
    status:
      "verified",

    maskedEmail:
      resolvedMaskedEmail,

    expiresAt:
      authCode.expiresAt,

    remainingSeconds,
  };
}

/**
 * Establece la nueva contraseña.
 *
 * La operación principal es atómica:
 *
 * - Consume el código.
 * - Actualiza el hash Argon2id.
 * - Invalida otros códigos.
 * - Revoca todas las sesiones anteriores.
 */
export async function resetPassword(
  input:
    ResetPasswordSchemaOutput,
  metadata:
    PasswordResetRequestMetadata = {},
): Promise<ResetPasswordResult> {
  const data =
    resetPasswordSchema.parse(
      input,
    );

  const maskedEmail =
    safeMaskEmailAddress(
      data.email,
    );

  const purpose =
    AUTH_CODE_PURPOSES.PASSWORD_RESET;

  let authCode;

  try {
    authCode =
      await findLatestAuthCodeWithUserByEmailAndPurpose({
        email:
          data.email,

        purpose,
      });
  } catch (error) {
    throw new PasswordResetServiceError(
      "PASSWORD_RESET_FAILED",
      "No fue posible consultar el código de recuperación.",
      {
        cause:
          error,
      },
    );
  }

  if (!authCode) {
    return {
      status:
        "not-found",

      maskedEmail,
    };
  }

  const user =
    authCode.user;

  const resolvedMaskedEmail =
    safeMaskEmailAddress(
      user.email,
    );

  if (
    !accountCanResetPassword(
      user,
    )
  ) {
    return {
      status:
        "account-unavailable",

      maskedEmail:
        resolvedMaskedEmail,
    };
  }

  const attemptState =
    getAuthCodeAttemptState(
      authCode.attemptCount,
    );

  if (
    attemptState.hasReachedLimit
  ) {
    return {
      status:
        "attempts-exceeded",

      maskedEmail:
        resolvedMaskedEmail,

      attemptsRemaining:
        0,

      resendAvailableInSeconds:
        AUTH_CODE_RESEND_COOLDOWN_SECONDS,
    };
  }

  if (
    authCode.consumedAt !==
      null
  ) {
    return {
      status:
        "invalid-code",

      maskedEmail:
        resolvedMaskedEmail,

      attemptsRemaining:
        attemptState.remainingAttempts,
    };
  }

  if (
    isAuthCodeExpired(
      authCode.expiresAt,
    )
  ) {
    return {
      status:
        "code-expired",

      maskedEmail:
        resolvedMaskedEmail,

      resendAvailableInSeconds:
        0,
    };
  }

  const codeMatches =
    verifyAuthCodeHash(
      data.code,
      authCode.codeHash,
      purpose,
      user.id,
    );

  if (!codeMatches) {
    let updatedAuthCode;

    try {
      updatedAuthCode =
        await incrementAuthCodeAttemptCount(
          authCode.id,
        );
    } catch (error) {
      throw new PasswordResetServiceError(
        "PASSWORD_RESET_FAILED",
        "No fue posible registrar el intento de recuperación.",
        {
          cause:
            error,
        },
      );
    }

    const updatedAttemptState =
      getAuthCodeAttemptState(
        updatedAuthCode?.attemptCount ??
          authCode.attemptCount +
            1,
      );

    await recordPasswordResetAudit({
      subjectUserId:
        user.id,

      action:
        updatedAttemptState.hasReachedLimit
          ? "PASSWORD_RESET_ATTEMPTS_EXCEEDED"
          : "PASSWORD_RESET_CODE_INVALID",

      entityId:
        authCode.id,

      metadata,

      details: {
        attemptCount:
          updatedAuthCode?.attemptCount ??
          authCode.attemptCount +
            1,

        attemptsRemaining:
          updatedAttemptState.remainingAttempts,
      },
    });

    if (
      updatedAttemptState.hasReachedLimit
    ) {
      return {
        status:
          "attempts-exceeded",

        maskedEmail:
          resolvedMaskedEmail,

        attemptsRemaining:
          0,

        resendAvailableInSeconds:
          AUTH_CODE_RESEND_COOLDOWN_SECONDS,
      };
    }

    return {
      status:
        "invalid-code",

      maskedEmail:
        resolvedMaskedEmail,

      attemptsRemaining:
        updatedAttemptState.remainingAttempts,
    };
  }

  const authenticationUser =
    await findUserForAuthenticationByEmail(
      user.email,
    );

  if (
    !authenticationUser ||
    authenticationUser.id !==
      user.id ||
    !accountCanResetPassword(
      authenticationUser,
    )
  ) {
    return {
      status:
        "account-unavailable",

      maskedEmail:
        resolvedMaskedEmail,
    };
  }

  let passwordWasReused:
    boolean;

  try {
    passwordWasReused =
      await verifyPassword(
        data.newPassword,
        authenticationUser.passwordHash,
      );
  } catch (error) {
    throw new PasswordResetServiceError(
      "PASSWORD_RESET_FAILED",
      "No fue posible validar la nueva contraseña.",
      {
        cause:
          error,
      },
    );
  }

  if (passwordWasReused) {
    await recordPasswordResetAudit({
      subjectUserId:
        user.id,

      action:
        "PASSWORD_RESET_PASSWORD_REUSED",

      entityId:
        authCode.id,

      metadata,
    });

    return {
      status:
        "password-reused",

      maskedEmail:
        resolvedMaskedEmail,
    };
  }

  let newPasswordHash:
    string;

  try {
    newPasswordHash =
      await hashPassword(
        data.newPassword,
      );
  } catch (error) {
    throw new PasswordResetServiceError(
      "PASSWORD_RESET_FAILED",
      "No fue posible proteger la nueva contraseña.",
      {
        cause:
          error,
      },
    );
  }

  try {
    const transactionResult =
      await prisma.$transaction(
        async (
          transaction,
        ) => {
          /*
           * Consumir primero evita que dos solicitudes
           * simultáneas utilicen el mismo código.
           */
          const consumedCode =
            await consumeAuthCode(
              authCode.id,
              new Date(),
              transaction,
            );

          if (!consumedCode) {
            throw new PasswordResetCodeUnavailableError();
          }

          const updatedUser =
            await updateUserPassword(
              user.id,
              newPasswordHash,
              new Date(),
              transaction,
            );

          await invalidateAuthCodes(
            {
              userId:
                user.id,

              purpose,

              exceptAuthCodeId:
                authCode.id,
            },
            transaction,
          );

          const revokedSessions =
            await revokeUserSessions(
              {
                userId:
                  user.id,

                revokedAt:
                  new Date(),
              },
              transaction,
            );

          return {
            updatedUser,
            revokedSessions,
          };
        },
      );

    let notificationCreated =
      false;

    try {
      await createNotification({
        userId:
          user.id,

        type:
          "SECURITY",

        titleEs:
          "Contraseña restablecida",

        titleEn:
          "Password reset",

        messageEs:
          "Tu contraseña fue actualizada y todas tus sesiones anteriores fueron cerradas por seguridad.",

        messageEn:
          "Your password was updated and all previous sessions were closed for security reasons.",

        actionUrl:
          "/iniciar-sesion",
      });

      notificationCreated =
        true;
    } catch {
      /*
       * El cambio de contraseña ya fue confirmado.
       * Un fallo de notificación no debe revertirlo.
       */
      notificationCreated =
        false;
    }

    await recordPasswordResetAudit({
      actorUserId:
        user.id,

      subjectUserId:
        user.id,

      action:
        "PASSWORD_RESET_COMPLETED",

      entityId:
        authCode.id,

      metadata,

      details: {
        revokedSessions:
          transactionResult.revokedSessions,

        notificationCreated,
      },
    });

    const safeUser =
      toPasswordResetUser(
        transactionResult.updatedUser,
      );

    return {
      status:
        "password-reset",

      user:
        safeUser,

      maskedEmail:
        safeMaskEmailAddress(
          safeUser.email,
        ),

      revokedSessions:
        transactionResult.revokedSessions,

      sessionsRevoked:
        transactionResult.revokedSessions,

      notificationCreated,
    };
  } catch (error) {
    if (
      error instanceof
      PasswordResetCodeUnavailableError
    ) {
      return {
        status:
          "invalid-code",

        maskedEmail:
          resolvedMaskedEmail,

        attemptsRemaining:
          0,
      };
    }

    if (
      error instanceof
      PasswordResetServiceError
    ) {
      throw error;
    }

    throw new PasswordResetServiceError(
      "PASSWORD_RESET_FAILED",
      "No fue posible restablecer la contraseña.",
      {
        cause:
          error,
      },
    );
  }
}

export function isPasswordResetServiceError(
  error: unknown,
): error is PasswordResetServiceError {
  return (
    error instanceof
    PasswordResetServiceError
  );
}

/**
 * Alias compatibles con rutas y componentes existentes.
 */
export const requestPasswordRecovery =
  requestPasswordReset;

export const requestRecoveryCode =
  requestPasswordReset;

export const sendPasswordResetCode =
  requestPasswordReset;

export const verifyRecoveryCode =
  verifyPasswordResetCode;

export const verifyResetCode =
  verifyPasswordResetCode;

export const completePasswordReset =
  resetPassword;

export const restorePassword =
  resetPassword;

export const changePasswordWithRecoveryCode =
  resetPassword;

export type RequestPasswordResetInput =
  ForgotPasswordSchemaOutput;

export type VerifyPasswordResetCodeInput =
  VerifyPasswordResetCodeSchemaOutput;

export type ResetPasswordInput =
  ResetPasswordSchemaOutput;