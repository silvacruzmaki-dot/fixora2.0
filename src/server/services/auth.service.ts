import "server-only";

import {
  AUTH_CODE_PURPOSES,
  AUTH_CODE_RESEND_COOLDOWN_SECONDS,
  AUTH_EMAIL_VERIFICATION_CODE_EXPIRATION_SECONDS,
  AUTH_LANGUAGES,
  AUTH_ROLES,
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
} from "@/lib/auth/codes";

import {
  safeMaskEmailAddress,
} from "@/lib/auth/email-mask";

import {
  isAuthGuardError,
  requireAuthenticatedUser,
} from "@/lib/auth/guards";

import {
  hashPassword,
  passwordHashNeedsRehash,
  verifyPassword,
} from "@/lib/auth/password";

import {
  createSessionLifetime,
  createSessionTokenPair,
  getSessionRemainingSeconds,
  tryHashSessionToken,
} from "@/lib/auth/session";

import {
  sendEmailSafely,
} from "@/lib/email/email.service";

import {
  createVerifyEmailTemplate,
} from "@/lib/email/templates/verify-email.template";

import {
  prisma,
} from "@/lib/database/prisma";

import {
  loginSchema,
  type LoginSchemaOutput,
} from "@/schemas/auth/login.schema";

import {
  registerSchema,
  type RegisterSchemaOutput,
} from "@/schemas/auth/register.schema";

import {
  createAuditLogSafely,
} from "@/server/repositories/audit-log.repository";

import {
  createAuthCode,
  replaceUserAuthCode,
} from "@/server/repositories/auth-code.repository";

import {
  createSession,
  findSessionWithUserByTokenHash,
  revokeSessionByTokenHash,
  revokeUserSessions,
  touchSession,
} from "@/server/repositories/session.repository";

import {
  createUser,
  findUserByEmail,
  findUserForAuthenticationByEmail,
  incrementUserFailedLoginAttempts,
  lockUserAccount,
  recordSuccessfulUserLogin,
  unlockUserAccount,
} from "@/server/repositories/user.repository";

export type AuthServiceErrorCode =
  | "AUTH_CONFIGURATION_ERROR"
  | "AUTH_REGISTRATION_FAILED"
  | "AUTH_LOGIN_FAILED"
  | "AUTH_SESSION_CREATION_FAILED"
  | "AUTH_SESSION_LOOKUP_FAILED"
  | "AUTH_LOGOUT_FAILED";

export type RegisterUserStatus =
  | "registered"
  | "email-verification-required"
  | "email-already-registered"
  | "account-unavailable";

export type AuthenticateUserStatus =
  | "authenticated"
  | "email-verification-required"
  | "account-locked"
  | "account-disabled"
  | "admin-login-required"
  | "invalid-credentials";

export type UserSessionStatus =
  | "authenticated"
  | "invalid-session"
  | "account-unavailable";

export interface AuthRequestMetadata {
  /*
   * Hash generado previamente por la capa HTTP.
   *
   * Puede provenir del rate limit o de otro sistema
   * de huella tÃ©cnica.
   */
  identifierHash?:
    | string
    | null;

  ipHash?:
    | string
    | null;

  userAgent?:
    | string
    | null;

  deviceName?:
    | string
    | null;
}

export interface AuthServiceUser {
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

export interface RegisterUserResult {
  status: RegisterUserStatus;

  user:
    | AuthServiceUser
    | null;

  maskedEmail: string;

  verificationExpiresInSeconds: number;
  resendAvailableInSeconds: number;

  emailSent: boolean;
}

export interface AuthenticatedUserResult {
  status: "authenticated";

  user:
    AuthServiceUser;

  token: string;
  sessionToken: string;

  expiresAt: Date;
  sessionExpiresAt: Date;

  remainingSeconds: number;

  rememberMe: boolean;

  session: {
    id: string;

    expiresAt: Date;
    lastSeenAt: Date;

    rememberMe: boolean;
  };
}

export interface EmailVerificationRequiredResult {
  status:
    "email-verification-required";

  maskedEmail: string;

  verificationExpiresInSeconds:
    number;

  resendAvailableInSeconds:
    number;
}

export interface AccountLockedResult {
  status:
    "account-locked";

  lockedUntil:
    Date | null;

  retryAfterSeconds:
    number;
}

export interface AccountDisabledResult {
  status:
    "account-disabled";
}

export interface AdminLoginRequiredResult {
  status:
    "admin-login-required";

  adminLoginPath:
    "/admin/iniciar-sesion";
}

export interface InvalidCredentialsResult {
  status:
    "invalid-credentials";
}

export type AuthenticateUserResult =
  | AuthenticatedUserResult
  | EmailVerificationRequiredResult
  | AccountLockedResult
  | AccountDisabledResult
  | AdminLoginRequiredResult
  | InvalidCredentialsResult;

export interface AuthenticatedSessionResult {
  status:
    "authenticated";

  user:
    AuthServiceUser;

  session: {
    id: string;

    expiresAt: Date;
    lastSeenAt: Date;

    rememberMe: boolean;

    remainingSeconds: number;
  };
}

export interface InvalidSessionResult {
  status:
    "invalid-session";
}

export interface AccountUnavailableSessionResult {
  status:
    "account-unavailable";
}

export type UserSessionResult =
  | AuthenticatedSessionResult
  | InvalidSessionResult
  | AccountUnavailableSessionResult;

export interface LogoutUserResult {
  status:
    "signed-out";

  revoked: boolean;
}

export class AuthServiceError extends Error {
  readonly code:
    AuthServiceErrorCode;

  constructor(
    code:
      AuthServiceErrorCode,
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
      "AuthServiceError";

    this.code =
      code;
  }
}

interface UserLikeRecord {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  avatarUrl:
    | string
    | null;

  role: string;
  status: string;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerifiedAt:
    | Date
    | null;

  lockedUntil:
    | Date
    | null;

  lastLoginAt?:
    | Date
    | null;

  passwordChangedAt?:
    | Date
    | null;

  createdAt: Date;
  updatedAt: Date;
}

interface VerificationEmailUser {
  id: string;

  email: string;
  displayName: string;

  preferredLanguage:
    string;
}

interface IssuedVerificationCode {
  code: string;

  expiresAt: Date;

  durationSeconds: number;
}

interface CreatedUserSession {
  token: string;

  session: {
    id: string;

    expiresAt: Date;
    lastSeenAt: Date;

    rememberMe: boolean;
  };

  user:
    AuthServiceUser;
}

const HASH_PATTERN =
  /^[a-f0-9]{64}$/i;

const DEFAULT_MAXIMUM_LOGIN_ATTEMPTS =
  5;

const DEFAULT_ACCOUNT_LOCK_MINUTES =
  15;

const MAXIMUM_LOGIN_ATTEMPTS_LIMIT =
  50;

const MAXIMUM_ACCOUNT_LOCK_MINUTES =
  24 * 60;

const MAXIMUM_USER_AGENT_LENGTH =
  500;

const MAXIMUM_DEVICE_NAME_LENGTH =
  160;

const DUMMY_PASSWORD =
  "FIXORA-Dummy-Password-2026!";

let dummyPasswordHashPromise:
  Promise<string> | null =
  null;

function normalizeOptionalText(
  value: unknown,
  maximumLength: number,
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
        maximumLength,
      );

  return (
    normalizedValue ||
    null
  );
}

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
    AuthRequestMetadata,
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

function normalizeAuthRole(
  role: unknown,
): AuthRole {
  return isAuthRole(role)
    ? role
    : AUTH_ROLES.USER;
}

function normalizeAuthUserStatus(
  status: unknown,
): AuthUserStatus {
  return isAuthUserStatus(
    status,
  )
    ? status
    : AUTH_USER_STATUSES.DISABLED;
}

function toAuthServiceUser(
  user:
    UserLikeRecord,
): AuthServiceUser {
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
      normalizeAuthRole(
        user.role,
      ),

    status:
      normalizeAuthUserStatus(
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
      user.lastLoginAt ??
      null,

    passwordChangedAt:
      user.passwordChangedAt ??
      null,

    createdAt:
      user.createdAt,

    updatedAt:
      user.updatedAt,
  };
}

function resolveAuthLanguage(
  language: unknown,
): AuthLanguage {
  return language ===
    AUTH_LANGUAGES.ENGLISH
    ? AUTH_LANGUAGES.ENGLISH
    : AUTH_LANGUAGES.SPANISH;
}

function readPositiveIntegerEnvironmentVariable(
  name: string,
  defaultValue: number,
  maximumValue: number,
): number {
  const rawValue =
    process.env[name];

  if (
    typeof rawValue !==
      "string" ||
    rawValue.trim() ===
      ""
  ) {
    return defaultValue;
  }

  const parsedValue =
    Number(rawValue);

  if (
    !Number.isInteger(
      parsedValue,
    ) ||
    parsedValue < 1 ||
    parsedValue >
      maximumValue
  ) {
    return defaultValue;
  }

  return parsedValue;
}

function getMaximumLoginAttempts():
  number {
  return readPositiveIntegerEnvironmentVariable(
    "AUTH_MAXIMUM_LOGIN_ATTEMPTS",
    DEFAULT_MAXIMUM_LOGIN_ATTEMPTS,
    MAXIMUM_LOGIN_ATTEMPTS_LIMIT,
  );
}

function getAccountLockDurationMs():
  number {
  const minutes =
    readPositiveIntegerEnvironmentVariable(
      "AUTH_ACCOUNT_LOCK_MINUTES",
      DEFAULT_ACCOUNT_LOCK_MINUTES,
      MAXIMUM_ACCOUNT_LOCK_MINUTES,
    );

  return (
    minutes *
    60 *
    1000
  );
}

function calculateRetryAfterSeconds(
  lockedUntil:
    Date | null,
  now:
    Date = new Date(),
): number {
  if (!lockedUntil) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil(
      (
        lockedUntil.getTime() -
        now.getTime()
      ) / 1000,
    ),
  );
}

function isActiveAccountLock(
  status: unknown,
  lockedUntil:
    Date | null,
  now:
    Date = new Date(),
): boolean {
  if (
    status !==
    AUTH_USER_STATUSES.LOCKED
  ) {
    return false;
  }

  if (!lockedUntil) {
    return true;
  }

  return (
    lockedUntil.getTime() >
    now.getTime()
  );
}

function isUniqueConstraintError(
  error: unknown,
): boolean {
  if (
    typeof error !==
      "object" ||
    error === null ||
    !(
      "code" in error
    )
  ) {
    return false;
  }

  return (
    error.code ===
    "P2002"
  );
}

function getDummyPasswordHash():
  Promise<string> {
  dummyPasswordHashPromise ??=
    hashPassword(
      DUMMY_PASSWORD,
    );

  return dummyPasswordHashPromise;
}

async function performDummyPasswordVerification(
  password: string,
): Promise<void> {
  try {
    const dummyHash =
      await getDummyPasswordHash();

    await verifyPassword(dummyHash, password);
  } catch {
    /*
     * La verificaciÃ³n seÃ±uelo nunca debe cambiar la
     * respuesta pÃºblica del inicio de sesiÃ³n.
     */
  }
}

async function recordAuthAudit(
  {
    actorUserId,
    subjectUserId,

    action,

    entityType,
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

    entityType?:
      | string
      | null;

    entityId?:
      | string
      | null;

    metadata:
      AuthRequestMetadata;

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
      entityType ??
      null,

    entityId:
      entityId ??
      null,

    ipHash:
      resolveMetadataIpHash(
        metadata,
      ),

    userAgent:
      normalizeOptionalText(
        metadata.userAgent,
        MAXIMUM_USER_AGENT_LENGTH,
      ),

    details,
  });
}

async function sendVerificationEmail(
  user:
    VerificationEmailUser,
  issuedCode:
    IssuedVerificationCode,
): Promise<boolean> {
  const template =
    createVerifyEmailTemplate({
      code:
        issuedCode.code,

      displayName:
        user.displayName,

      language:
        resolveAuthLanguage(
          user.preferredLanguage,
        ),

      expiresInMinutes:
        Math.ceil(
          issuedCode.durationSeconds /
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
        email:
          user.email,

        name:
          user.displayName,
      },

      subject:
        template.subject,

      text:
        template.text,

      html:
        template.html,

      category:
        "email-verification",
    });

  return delivery.ok;
}

async function issueVerificationCodeInTransaction(
  user:
    VerificationEmailUser,
  replaceExisting: boolean,
): Promise<IssuedVerificationCode> {
  const purpose =
    AUTH_CODE_PURPOSES.EMAIL_VERIFICATION;

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

  await prisma.$transaction(
    async (
      transaction,
    ) => {
      if (replaceExisting) {
        await replaceUserAuthCode(
          {
            userId:
              user.id,

            purpose,

            codeHash,

            expiresAt:
              lifetime.expiresAt,

            lastSentAt:
              lifetime.createdAt,
          },
          transaction,
        );
      } else {
        await createAuthCode(
          {
            userId:
              user.id,

            purpose,

            codeHash,

            expiresAt:
              lifetime.expiresAt,

            lastSentAt:
              lifetime.createdAt,
          },
          transaction,
        );
      }
    },
  );

  return {
    code,

    expiresAt:
      lifetime.expiresAt,

    durationSeconds:
      lifetime.durationSeconds,
  };
}

async function registerNewUser(
  data:
    RegisterSchemaOutput,
): Promise<{
  user:
    AuthServiceUser;

  issuedCode:
    IssuedVerificationCode;
}> {
  const now =
    new Date();

  const passwordHash =
    await hashPassword(
      data.password,
    );

  const result =
    await prisma.$transaction(
      async (
        transaction,
      ) => {
        const createdUser =
          await createUser(
            {
              firstName:
                data.firstName,

              lastName:
                data.lastName,

              displayName:
                data.displayName,

              email:
                data.email,

              passwordHash,

              role:
                AUTH_ROLES.USER,

              status:
                AUTH_USER_STATUSES.PENDING_VERIFICATION,

              preferredLanguage:
                AUTH_LANGUAGES.SPANISH,

              preferredTheme:
                "system",

              termsAcceptedAt:
                now,

              privacyAcceptedAt:
                now,
            },
            transaction,
          );

        const purpose =
          AUTH_CODE_PURPOSES.EMAIL_VERIFICATION;

        const lifetime =
          createAuthCodeLifetime(
            purpose,
            now,
          );

        const {
          code,
          codeHash,
        } =
          createAuthCodePair(
            purpose,
            createdUser.id,
          );

        await createAuthCode(
          {
            userId:
              createdUser.id,

            purpose,

            codeHash,

            expiresAt:
              lifetime.expiresAt,

            lastSentAt:
              lifetime.createdAt,
          },
          transaction,
        );

        return {
          user:
            toAuthServiceUser(
              createdUser,
            ),

          issuedCode: {
            code,

            expiresAt:
              lifetime.expiresAt,

            durationSeconds:
              lifetime.durationSeconds,
          },
        };
      },
    );

  return result;
}

/**
 * Registra una cuenta pÃºblica con rol USER.
 */
export async function registerUser(
  input:
    RegisterSchemaOutput,
  metadata:
    AuthRequestMetadata = {},
): Promise<RegisterUserResult> {
  const data =
    registerSchema.parse(
      input,
    );

  const maskedEmail =
    safeMaskEmailAddress(
      data.email,
    );

  const existingUser =
    await findUserByEmail(
      data.email,
    );

  if (existingUser) {
    if (
      existingUser.status ===
        AUTH_USER_STATUSES.PENDING_VERIFICATION &&
      existingUser.emailVerifiedAt ===
        null
    ) {
      let emailSent =
        false;

      try {
        const issuedCode =
          await issueVerificationCodeInTransaction(
            existingUser,
            true,
          );

        emailSent =
          await sendVerificationEmail(
            existingUser,
            issuedCode,
          );
      } catch {
        emailSent =
          false;
      }

      await recordAuthAudit({
        subjectUserId:
          existingUser.id,

        action:
          emailSent
            ? "REGISTRATION_VERIFICATION_RESENT"
            : "REGISTRATION_VERIFICATION_RESEND_FAILED",

        entityType:
          "USER",

        entityId:
          existingUser.id,

        metadata,

        details: {
          existingAccount:
            true,

          emailSent,
        },
      });

      return {
        status:
          "email-verification-required",

        user:
          null,

        maskedEmail,

        verificationExpiresInSeconds:
          AUTH_EMAIL_VERIFICATION_CODE_EXPIRATION_SECONDS,

        resendAvailableInSeconds:
          AUTH_CODE_RESEND_COOLDOWN_SECONDS,

        emailSent,
      };
    }

    await recordAuthAudit({
      subjectUserId:
        existingUser.id,

      action:
        "REGISTRATION_EXISTING_EMAIL",

      entityType:
        "USER",

      entityId:
        existingUser.id,

      metadata,

      details: {
        accountStatus:
          existingUser.status,
      },
    });

    return {
      status:
        existingUser.status ===
          AUTH_USER_STATUSES.DISABLED
          ? "account-unavailable"
          : "email-already-registered",

      user:
        null,

      maskedEmail,

      verificationExpiresInSeconds:
        0,

      resendAvailableInSeconds:
        0,

      emailSent:
        false,
    };
  }

  try {
    const {
      user,
      issuedCode,
    } =
      await registerNewUser(
        data,
      );

    const emailSent =
      await sendVerificationEmail(
        user,
        issuedCode,
      );

    await recordAuthAudit({
      actorUserId:
        user.id,

      subjectUserId:
        user.id,

      action:
        "USER_REGISTERED",

      entityType:
        "USER",

      entityId:
        user.id,

      metadata,

      details: {
        emailSent,

        role:
          user.role,

        status:
          user.status,
      },
    });

    if (!emailSent) {
      await recordAuthAudit({
        subjectUserId:
          user.id,

        action:
          "VERIFICATION_EMAIL_SEND_FAILED",

        entityType:
          "USER",

        entityId:
          user.id,

        metadata,
      });
    }

    return {
      status:
        "registered",

      user,

      maskedEmail,

      verificationExpiresInSeconds:
        issuedCode.durationSeconds,

      resendAvailableInSeconds:
        AUTH_CODE_RESEND_COOLDOWN_SECONDS,

      emailSent,
    };
  } catch (error) {
    if (
      isUniqueConstraintError(
        error,
      )
    ) {
      return {
        status:
          "email-already-registered",

        user:
          null,

        maskedEmail,

        verificationExpiresInSeconds:
          0,

        resendAvailableInSeconds:
          0,

        emailSent:
          false,
      };
    }

    throw new AuthServiceError(
      "AUTH_REGISTRATION_FAILED",
      "No fue posible completar el registro.",
      {
        cause:
          error,
      },
    );
  }
}

async function verifyUserPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  try {
    return await verifyPassword(passwordHash, password);
  } catch {
    return false;
  }
}

async function handleInvalidPassword(
  user: {
    id: string;

    failedLoginAttempts: number;

    status: string;
  },
  metadata:
    AuthRequestMetadata,
): Promise<
  | AccountLockedResult
  | InvalidCredentialsResult
> {
  if (
    user.status ===
      AUTH_USER_STATUSES.DISABLED
  ) {
    await recordAuthAudit({
      subjectUserId:
        user.id,

      action:
        "LOGIN_FAILED",

      entityType:
        "AUTHENTICATION",

      entityId:
        user.id,

      metadata,

      details: {
        reason:
          "INVALID_CREDENTIALS",
      },
    });

    return {
      status:
        "invalid-credentials",
    };
  }

  const updatedUser =
    await incrementUserFailedLoginAttempts(
      user.id,
    );

  const maximumAttempts =
    getMaximumLoginAttempts();

  if (
    updatedUser.failedLoginAttempts >=
    maximumAttempts
  ) {
    const lockedUntil =
      new Date(
        Date.now() +
          getAccountLockDurationMs(),
      );

    await lockUserAccount(
      user.id,
      lockedUntil,
    );

    await recordAuthAudit({
      subjectUserId:
        user.id,

      action:
        "ACCOUNT_LOCKED",

      entityType:
        "USER",

      entityId:
        user.id,

      metadata,

      details: {
        reason:
          "MAXIMUM_LOGIN_ATTEMPTS",

        failedLoginAttempts:
          updatedUser.failedLoginAttempts,

        maximumAttempts,

        lockedUntil:
          lockedUntil.toISOString(),
      },
    });

    return {
      status:
        "account-locked",

      lockedUntil,

      retryAfterSeconds:
        calculateRetryAfterSeconds(
          lockedUntil,
        ),
    };
  }

  await recordAuthAudit({
    subjectUserId:
      user.id,

    action:
      "LOGIN_FAILED",

    entityType:
      "AUTHENTICATION",

    entityId:
      user.id,

    metadata,

    details: {
      reason:
        "INVALID_CREDENTIALS",

      failedLoginAttempts:
        updatedUser.failedLoginAttempts,

      remainingAttempts:
        Math.max(
          0,
          maximumAttempts -
            updatedUser.failedLoginAttempts,
        ),
    },
  });

  return {
    status:
      "invalid-credentials",
  };
}

async function createAuthenticatedUserSession(
  user: {
    id: string;
    passwordHash: string;
  },
  password: string,
  rememberMe: boolean,
  metadata:
    AuthRequestMetadata,
): Promise<CreatedUserSession> {
  const now =
    new Date();

  const lifetime =
    createSessionLifetime(
      rememberMe,
      now,
    );

  let updatedPasswordHash:
    string | null =
    null;

  try {
    if (
      passwordHashNeedsRehash(
        user.passwordHash,
      )
    ) {
      updatedPasswordHash =
        await hashPassword(
          password,
        );
    }
  } catch {
    updatedPasswordHash =
      null;
  }

  for (
    let attempt = 0;
    attempt < 2;
    attempt += 1
  ) {
    const {
      token,
      tokenHash,
    } =
      createSessionTokenPair();

    try {
      const transactionResult =
        await prisma.$transaction(
          async (
            transaction,
          ) => {
            if (
              updatedPasswordHash
            ) {
              await transaction.user.update({
                where: {
                  id:
                    user.id,
                },

                data: {
                  passwordHash:
                    updatedPasswordHash,
                },
              });
            }

            const updatedUser =
              await recordSuccessfulUserLogin(
                user.id,
                now,
                transaction,
              );

            const session =
              await createSession(
                {
                  userId:
                    user.id,

                  tokenHash,

                  ipHash:
                    resolveMetadataIpHash(
                      metadata,
                    ),

                  userAgent:
                    normalizeOptionalText(
                      metadata.userAgent,
                      MAXIMUM_USER_AGENT_LENGTH,
                    ),

                  deviceName:
                    normalizeOptionalText(
                      metadata.deviceName,
                      MAXIMUM_DEVICE_NAME_LENGTH,
                    ),

                  rememberMe,

                  expiresAt:
                    lifetime.expiresAt,

                  lastSeenAt:
                    now,
                },
                transaction,
              );

            return {
              user:
                toAuthServiceUser(
                  updatedUser,
                ),

              session,
            };
          },
        );

      return {
        token,

        user:
          transactionResult.user,

        session: {
          id:
            transactionResult
              .session.id,

          expiresAt:
            transactionResult
              .session.expiresAt,

          lastSeenAt:
            transactionResult
              .session.lastSeenAt,

          rememberMe:
            transactionResult
              .session.rememberMe,
        },
      };
    } catch (error) {
      if (
        isUniqueConstraintError(
          error,
        ) &&
        attempt === 0
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new AuthServiceError(
    "AUTH_SESSION_CREATION_FAILED",
    "No fue posible crear una sesiÃ³n segura.",
  );
}

/**
 * Autentica usuarios normales.
 *
 * Las cuentas ADMIN deben utilizar:
 *
 * /admin/iniciar-sesion
 */
export async function authenticateUser(
  input:
    LoginSchemaOutput,
  metadata:
    AuthRequestMetadata = {},
): Promise<AuthenticateUserResult> {
  const data =
    loginSchema.parse(
      input,
    );

  let user =
    await findUserForAuthenticationByEmail(
      data.email,
    );

  if (!user) {
    await performDummyPasswordVerification(
      data.password,
    );

    await recordAuthAudit({
      action:
        "LOGIN_FAILED",

      entityType:
        "AUTHENTICATION",

      metadata,

      details: {
        reason:
          "INVALID_CREDENTIALS",
      },
    });

    return {
      status:
        "invalid-credentials",
    };
  }

  const now =
    new Date();

  const activeLock =
    isActiveAccountLock(
      user.status,
      user.lockedUntil,
      now,
    );

  if (
    user.status ===
      AUTH_USER_STATUSES.LOCKED &&
    !activeLock
  ) {
    user =
      await unlockUserAccount(
        user.id,
      );
  }

  const passwordIsValid =
    await verifyUserPassword(
      data.password,
      user.passwordHash,
    );

  if (!passwordIsValid) {
    if (activeLock) {
      await recordAuthAudit({
        subjectUserId:
          user.id,

        action:
          "LOGIN_FAILED",

        entityType:
          "AUTHENTICATION",

        entityId:
          user.id,

        metadata,

        details: {
          reason:
            "INVALID_CREDENTIALS",
        },
      });

      return {
        status:
          "invalid-credentials",
      };
    }

    return handleInvalidPassword(
      user,
      metadata,
    );
  }

  if (
    activeLock ||
    isActiveAccountLock(
      user.status,
      user.lockedUntil,
      now,
    )
  ) {
    await recordAuthAudit({
      subjectUserId:
        user.id,

      action:
        "LOGIN_BLOCKED_LOCKED_ACCOUNT",

      entityType:
        "AUTHENTICATION",

      entityId:
        user.id,

      metadata,
    });

    return {
      status:
        "account-locked",

      lockedUntil:
        user.lockedUntil,

      retryAfterSeconds:
        calculateRetryAfterSeconds(
          user.lockedUntil,
          now,
        ),
    };
  }

  if (
    user.status ===
      AUTH_USER_STATUSES.DISABLED
  ) {
    await recordAuthAudit({
      subjectUserId:
        user.id,

      action:
        "LOGIN_BLOCKED_DISABLED_ACCOUNT",

      entityType:
        "AUTHENTICATION",

      entityId:
        user.id,

      metadata,
    });

    return {
      status:
        "account-disabled",
    };
  }

  if (
    user.status ===
      AUTH_USER_STATUSES.PENDING_VERIFICATION ||
    user.emailVerifiedAt ===
      null
  ) {
    await recordAuthAudit({
      subjectUserId:
        user.id,

      action:
        "LOGIN_REQUIRES_EMAIL_VERIFICATION",

      entityType:
        "AUTHENTICATION",

      entityId:
        user.id,

      metadata,
    });

    return {
      status:
        "email-verification-required",

      maskedEmail:
        safeMaskEmailAddress(
          user.email,
        ),

      verificationExpiresInSeconds:
        AUTH_EMAIL_VERIFICATION_CODE_EXPIRATION_SECONDS,

      resendAvailableInSeconds:
        AUTH_CODE_RESEND_COOLDOWN_SECONDS,
    };
  }

  if (
    user.role ===
      AUTH_ROLES.ADMIN
  ) {
    await recordAuthAudit({
      subjectUserId:
        user.id,

      action:
        "ADMIN_LOGIN_REQUIRED",

      entityType:
        "AUTHENTICATION",

      entityId:
        user.id,

      metadata,
    });

    return {
      status:
        "admin-login-required",

      adminLoginPath:
        "/admin/iniciar-sesion",
    };
  }

  if (
    user.status !==
      AUTH_USER_STATUSES.ACTIVE
  ) {
    return {
      status:
        "account-disabled",
    };
  }

  try {
    const createdSession =
      await createAuthenticatedUserSession(
        user,
        data.password,
        data.rememberMe,
        metadata,
      );

    await recordAuthAudit({
      actorUserId:
        user.id,

      subjectUserId:
        user.id,

      action:
        "LOGIN_SUCCESS",

      entityType:
        "SESSION",

      entityId:
        createdSession.session.id,

      metadata,

      details: {
        rememberMe:
          data.rememberMe,

        expiresAt:
          createdSession.session
            .expiresAt
            .toISOString(),
      },
    });

    const remainingSeconds =
      getSessionRemainingSeconds(
        createdSession.session
          .expiresAt,
      );

    return {
      status:
        "authenticated",

      user:
        createdSession.user,

      token:
        createdSession.token,

      sessionToken:
        createdSession.token,

      expiresAt:
        createdSession.session
          .expiresAt,

      sessionExpiresAt:
        createdSession.session
          .expiresAt,

      remainingSeconds,

      rememberMe:
        createdSession.session
          .rememberMe,

      session: {
        id:
          createdSession.session.id,

        expiresAt:
          createdSession.session
            .expiresAt,

        lastSeenAt:
          createdSession.session
            .lastSeenAt,

        rememberMe:
          createdSession.session
            .rememberMe,
      },
    };
  } catch (error) {
    if (
      error instanceof
      AuthServiceError
    ) {
      throw error;
    }

    throw new AuthServiceError(
      "AUTH_LOGIN_FAILED",
      "No fue posible iniciar la sesiÃ³n.",
      {
        cause:
          error,
      },
    );
  }
}

/**
 * Obtiene y valida la sesiÃ³n asociada al token opaco.
 */
export async function getAuthenticatedSessionByToken(
  sessionToken: unknown,
): Promise<UserSessionResult> {
  const tokenHash =
    tryHashSessionToken(
      sessionToken,
    );

  if (!tokenHash) {
    return {
      status:
        "invalid-session",
    };
  }

  let sessionRecord;

  try {
    sessionRecord =
      await findSessionWithUserByTokenHash(
        tokenHash,
      );
  } catch (error) {
    throw new AuthServiceError(
      "AUTH_SESSION_LOOKUP_FAILED",
      "No fue posible consultar la sesiÃ³n.",
      {
        cause:
          error,
      },
    );
  }

  if (!sessionRecord) {
    return {
      status:
        "invalid-session",
    };
  }

  const user =
    toAuthServiceUser(
      sessionRecord.user,
    );

  try {
    requireAuthenticatedUser({
      user,

      session:
        sessionRecord,

      requireVerifiedEmail:
        true,
    });
  } catch (error) {
    if (
      isAuthGuardError(
        error,
      )
    ) {
      await revokeSessionByTokenHash(
        tokenHash,
      );

      if (
        error.code ===
          "SESSION_EXPIRED" ||
        error.code ===
          "SESSION_REVOKED" ||
        error.code ===
          "INVALID_SESSION" ||
        error.code ===
          "UNAUTHENTICATED"
      ) {
        return {
          status:
            "invalid-session",
        };
      }

      return {
        status:
          "account-unavailable",
      };
    }

    throw error;
  }

  const updatedSession =
    await touchSession(
      sessionRecord.id,
    );

  if (!updatedSession) {
    return {
      status:
        "invalid-session",
    };
  }

  return {
    status:
      "authenticated",

    user,

    session: {
      id:
        updatedSession.id,

      expiresAt:
        updatedSession.expiresAt,

      lastSeenAt:
        updatedSession.lastSeenAt,

      rememberMe:
        updatedSession.rememberMe,

      remainingSeconds:
        getSessionRemainingSeconds(
          updatedSession.expiresAt,
        ),
    },
  };
}

/**
 * Cierra una sesiÃ³n mediante el token almacenado en
 * la cookie.
 *
 * La operaciÃ³n es idempotente.
 */
export async function logoutUser(
  sessionToken: unknown,
  metadata:
    AuthRequestMetadata = {},
): Promise<LogoutUserResult> {
  const tokenHash =
    tryHashSessionToken(
      sessionToken,
    );

  if (!tokenHash) {
    return {
      status:
        "signed-out",

      revoked:
        false,
    };
  }

  try {
    const existingSession =
      await findSessionWithUserByTokenHash(
        tokenHash,
      );

    const revoked =
      await revokeSessionByTokenHash(
        tokenHash,
      );

    if (
      existingSession &&
      revoked
    ) {
      await recordAuthAudit({
        actorUserId:
          existingSession.user.id,

        subjectUserId:
          existingSession.user.id,

        action:
          "LOGOUT",

        entityType:
          "SESSION",

        entityId:
          existingSession.id,

        metadata,
      });
    }

    return {
      status:
        "signed-out",

      revoked,
    };
  } catch (error) {
    throw new AuthServiceError(
      "AUTH_LOGOUT_FAILED",
      "No fue posible cerrar la sesiÃ³n.",
      {
        cause:
          error,
      },
    );
  }
}

/**
 * Revoca todas las sesiones de un usuario.
 *
 * Se utilizarÃ¡ despuÃ©s de acciones como:
 * - Cambio de contraseÃ±a.
 * - DesactivaciÃ³n de cuenta.
 * - OperaciÃ³n administrativa de seguridad.
 */
export async function revokeAllUserSessionsByUserId(
  userId: string,
  metadata:
    AuthRequestMetadata = {},
): Promise<number> {
  const revokedCount =
    await revokeUserSessions({
      userId,
    });

  await recordAuthAudit({
    actorUserId:
      userId,

    subjectUserId:
      userId,

    action:
      "ALL_SESSIONS_REVOKED",

    entityType:
      "USER",

    entityId:
      userId,

    metadata,

    details: {
      revokedCount,
    },
  });

  return revokedCount;
}

export function isAuthServiceError(
  error: unknown,
): error is AuthServiceError {
  return (
    error instanceof
    AuthServiceError
  );
}

/**
 * Alias compatibles con las rutas ya creadas.
 */
export const getUserSessionByToken =
  getAuthenticatedSessionByToken;

export const getSessionByToken =
  getAuthenticatedSessionByToken;

export const getCurrentUserSession =
  getAuthenticatedSessionByToken;

export const closeUserSession =
  logoutUser;

export const signOutUser =
  logoutUser;

export const closeSession =
  logoutUser;

export type RegisterUserInput =
  RegisterSchemaOutput;

export type AuthenticateUserInput =
  LoginSchemaOutput;
