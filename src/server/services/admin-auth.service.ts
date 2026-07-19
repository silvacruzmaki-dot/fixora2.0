import "server-only";

import {
  AUTH_CODE_RESEND_COOLDOWN_SECONDS,
  AUTH_EMAIL_VERIFICATION_CODE_EXPIRATION_SECONDS,
  AUTH_ROLES,
  AUTH_USER_STATUSES,
  isAuthRole,
  isAuthUserStatus,
  type AuthRole,
  type AuthUserStatus,
} from "@/constants/auth/auth.constants";

import {
  safeMaskEmailAddress,
} from "@/lib/auth/email-mask";

import {
  hashPassword,
  passwordHashNeedsRehash,
  verifyPassword,
} from "@/lib/auth/password";

import {
  createSessionLifetime,
  createSessionTokenPair,
  getSessionRemainingSeconds,
} from "@/lib/auth/session";

import {
  prisma,
} from "@/lib/database/prisma";

import {
  loginSchema,
  type LoginSchemaOutput,
} from "@/schemas/auth/login.schema";

import {
  createAuditLogSafely,
} from "@/server/repositories/audit-log.repository";

import {
  createSession,
  revokeUserSessions,
} from "@/server/repositories/session.repository";

import {
  countActiveUsers,
  countAdministrators,
  countUsers,
  findAdminUserById,
  findUserForAuthenticationByEmail,
  findUsersPage,
  incrementUserFailedLoginAttempts,
  lockUserAccount,
  recordSuccessfulUserLogin,
  unlockUserAccount,
  updateManagedUser,
  type AdminUserRecord,
  type FindUsersPageRepositoryInput,
  type UsersPageRepositoryResult,
} from "@/server/repositories/user.repository";

import {
  getAuthenticatedSessionByToken,
  type AuthRequestMetadata,
  type AuthServiceUser,
} from "@/server/services/auth.service";

export type AdminAuthServiceErrorCode =
  | "ADMIN_AUTH_CONFIGURATION_ERROR"
  | "ADMIN_LOGIN_FAILED"
  | "ADMIN_SESSION_CREATION_FAILED"
  | "ADMIN_SESSION_LOOKUP_FAILED"
  | "ADMIN_USERS_LIST_FAILED"
  | "ADMIN_USER_UPDATE_FAILED"
  | "ADMIN_INPUT_INVALID";

export type AuthenticateAdministratorStatus =
  | "authenticated"
  | "email-verification-required"
  | "account-locked"
  | "account-disabled"
  | "insufficient-permissions"
  | "invalid-credentials";

export type AdministratorSessionStatus =
  | "authenticated"
  | "insufficient-permissions"
  | "invalid-session"
  | "account-unavailable";

export type UpdateManagedUserStatus =
  | "updated"
  | "no-changes"
  | "not-found"
  | "self-protection"
  | "last-administrator-protected"
  | "insufficient-permissions"
  | "invalid-session"
  | "account-unavailable";

export type AdminAuthRequestMetadata =
  AuthRequestMetadata;

export interface AdministratorUser
  extends AuthServiceUser {
  role:
    typeof AUTH_ROLES.ADMIN;
}

export interface AuthenticatedAdministratorResult {
  status:
    "authenticated";

  administrator:
    AdministratorUser;

  user:
    AdministratorUser;

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

    remainingSeconds: number;
  };
}

export interface AdministratorEmailVerificationRequiredResult {
  status:
    "email-verification-required";

  maskedEmail: string;

  verificationExpiresInSeconds:
    number;

  resendAvailableInSeconds:
    number;
}

export interface AdministratorAccountLockedResult {
  status:
    "account-locked";

  lockedUntil:
    | Date
    | null;

  retryAfterSeconds:
    number;
}

export interface AdministratorAccountDisabledResult {
  status:
    "account-disabled";
}

export interface AdministratorInsufficientPermissionsResult {
  status:
    "insufficient-permissions";

  requiredRole:
    typeof AUTH_ROLES.ADMIN;
}

export interface AdministratorInvalidCredentialsResult {
  status:
    "invalid-credentials";
}

export type AuthenticateAdministratorResult =
  | AuthenticatedAdministratorResult
  | AdministratorEmailVerificationRequiredResult
  | AdministratorAccountLockedResult
  | AdministratorAccountDisabledResult
  | AdministratorInsufficientPermissionsResult
  | AdministratorInvalidCredentialsResult;

export interface AuthenticatedAdministratorSessionResult {
  status:
    "authenticated";

  administrator:
    AdministratorUser;

  user:
    AdministratorUser;

  session: {
    id: string;

    expiresAt: Date;
    lastSeenAt: Date;

    rememberMe: boolean;

    remainingSeconds: number;
  };
}

export interface InvalidAdministratorSessionResult {
  status:
    "invalid-session";

  administrator:
    null;

  user:
    null;
}

export interface UnavailableAdministratorAccountResult {
  status:
    "account-unavailable";

  administrator:
    null;

  user:
    null;
}

export type GetAdministratorSessionResult =
  | AuthenticatedAdministratorSessionResult
  | AdministratorInsufficientPermissionsResult
  | InvalidAdministratorSessionResult
  | UnavailableAdministratorAccountResult;

export interface AdministratorDashboardSummary {
  totalUsers: number;
  activeUsers: number;
  administrators: number;
}

export interface AuthenticatedAdministratorDashboardResult {
  status:
    "authenticated";

  administrator:
    AdministratorUser;

  summary:
    AdministratorDashboardSummary;
}

export type AdministratorDashboardResult =
  | AuthenticatedAdministratorDashboardResult
  | AdministratorInsufficientPermissionsResult
  | InvalidAdministratorSessionResult
  | UnavailableAdministratorAccountResult;

export interface AdministratorUsersPageInput {
  page?: unknown;
  pageSize?: unknown;

  search?: unknown;

  role?: unknown;
  status?: unknown;

  orderBy?: unknown;
  orderDirection?: unknown;
}

export interface AdministratorUsersPageCommand
  extends AdministratorUsersPageInput {
  sessionToken?: unknown;
  token?: unknown;

  query?:
    | AdministratorUsersPageInput
    | URLSearchParams;

  filters?:
    | AdministratorUsersPageInput
    | URLSearchParams;
}

export interface AuthenticatedAdministratorUsersPageResult {
  status:
    "authenticated";

  administrator:
    AdministratorUser;

  users:
    AdminUserRecord[];

  pagination:
    UsersPageRepositoryResult["pagination"];

  filters: {
    search:
      string | null;

    role:
      AuthRole | null;

    status:
      AuthUserStatus | null;

    orderBy:
      NonNullable<
        FindUsersPageRepositoryInput["orderBy"]
      >;

    orderDirection:
      NonNullable<
        FindUsersPageRepositoryInput["orderDirection"]
      >;
  };

  summary:
    AdministratorDashboardSummary;
}

export type AdministratorUsersPageResult =
  | AuthenticatedAdministratorUsersPageResult
  | AdministratorInsufficientPermissionsResult
  | InvalidAdministratorSessionResult
  | UnavailableAdministratorAccountResult;

export interface UpdateManagedUserInput {
  role?: unknown;
  status?: unknown;

  lockedUntil?: unknown;
}

export interface UpdateManagedUserCommand
  extends UpdateManagedUserInput {
  sessionToken?: unknown;
  token?: unknown;

  userId?: unknown;
  managedUserId?: unknown;
  targetUserId?: unknown;

  data?:
    UpdateManagedUserInput;

  updates?:
    UpdateManagedUserInput;

  metadata?:
    AdminAuthRequestMetadata;
}

export interface ManagedUserUpdatedResult {
  status:
    "updated";

  user:
    AdminUserRecord;

  managedUser:
    AdminUserRecord;

  updated:
    true;

  noChanges:
    false;

  updatedFields:
    string[];

  revokedSessions:
    number;
}

export interface ManagedUserNoChangesResult {
  status:
    "no-changes";

  user:
    AdminUserRecord;

  managedUser:
    AdminUserRecord;

  updated:
    false;

  noChanges:
    true;

  updatedFields:
    [];

  revokedSessions:
    0;
}

export interface ManagedUserNotFoundResult {
  status:
    "not-found";

  user:
    null;

  managedUser:
    null;
}

export interface ManagedUserSelfProtectionResult {
  status:
    "self-protection";

  user:
    AdminUserRecord;

  managedUser:
    AdminUserRecord;

  message:
    string;
}

export interface LastAdministratorProtectedResult {
  status:
    "last-administrator-protected";

  user:
    AdminUserRecord;

  managedUser:
    AdminUserRecord;

  message:
    string;
}

export type UpdateManagedUserResult =
  | ManagedUserUpdatedResult
  | ManagedUserNoChangesResult
  | ManagedUserNotFoundResult
  | ManagedUserSelfProtectionResult
  | LastAdministratorProtectedResult
  | AdministratorInsufficientPermissionsResult
  | InvalidAdministratorSessionResult
  | UnavailableAdministratorAccountResult;

export class AdminAuthServiceError extends Error {
  readonly code:
    AdminAuthServiceErrorCode;

  readonly httpStatus:
    number;

  constructor(
    code:
      AdminAuthServiceErrorCode,
    message: string,
    options?: {
      cause?: unknown;

      httpStatus?: number;
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
      "AdminAuthServiceError";

    this.code =
      code;

    this.httpStatus =
      options?.httpStatus ??
      (
        code ===
        "ADMIN_INPUT_INVALID"
          ? 400
          : 500
      );
  }
}

interface CreatedAdministratorSession {
  token: string;

  administrator:
    AdministratorUser;

  session: {
    id: string;

    expiresAt: Date;
    lastSeenAt: Date;

    rememberMe: boolean;
  };
}

interface NormalizedManagedUserUpdate {
  role?:
    AuthRole;

  status?:
    AuthUserStatus;

  lockedUntil?:
    | Date
    | null;
}

interface ResolvedAdministratorUsersPageArguments {
  sessionToken: unknown;

  input:
    | AdministratorUsersPageInput
    | URLSearchParams;
}

interface ResolvedManagedUserArguments {
  sessionToken: unknown;

  userId: unknown;

  input: unknown;

  metadata:
    AdminAuthRequestMetadata;
}

const DEFAULT_MAXIMUM_LOGIN_ATTEMPTS =
  5;

const DEFAULT_ACCOUNT_LOCK_MINUTES =
  15;

const MAXIMUM_LOGIN_ATTEMPTS_LIMIT =
  50;

const MAXIMUM_ACCOUNT_LOCK_MINUTES =
  24 * 60;

const DEFAULT_PAGE =
  1;

const DEFAULT_PAGE_SIZE =
  20;

const MAXIMUM_PAGE_SIZE =
  100;

const MAXIMUM_SEARCH_LENGTH =
  160;

const MAXIMUM_IDENTIFIER_LENGTH =
  120;

const MAXIMUM_USER_AGENT_LENGTH =
  500;

const MAXIMUM_DEVICE_NAME_LENGTH =
  160;

const HASH_PATTERN =
  /^[a-f0-9]{64}$/i;

const DUMMY_ADMIN_PASSWORD =
  "FIXORA-Admin-Dummy-Password-2026!";

let dummyAdminPasswordHashPromise:
  Promise<string> | null =
  null;

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    ) &&
    !(
      value instanceof
      URLSearchParams
    )
  );
}

function isUrlSearchParams(
  value: unknown,
): value is URLSearchParams {
  return (
    typeof URLSearchParams !==
      "undefined" &&
    value instanceof
      URLSearchParams
  );
}

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

  return normalizedValue ||
    null;
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
    AdminAuthRequestMetadata,
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

function normalizeIdentifier(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  const normalizedIdentifier =
    value.trim();

  if (
    normalizedIdentifier.length ===
      0 ||
    normalizedIdentifier.length >
      MAXIMUM_IDENTIFIER_LENGTH ||
    /[\u0000-\u001F\u007F]/.test(
      normalizedIdentifier,
    )
  ) {
    return null;
  }

  return normalizedIdentifier;
}

function requireIdentifier(
  value: unknown,
  fieldName: string,
): string {
  const normalizedIdentifier =
    normalizeIdentifier(
      value,
    );

  if (!normalizedIdentifier) {
    throw new AdminAuthServiceError(
      "ADMIN_INPUT_INVALID",
      `El campo "${fieldName}" no es vÃ¡lido.`,
      {
        httpStatus:
          400,
      },
    );
  }

  return normalizedIdentifier;
}

function normalizeAdministratorRole(
  role: unknown,
): AuthRole {
  return isAuthRole(
    role,
  )
    ? role
    : AUTH_ROLES.USER;
}

function normalizeAdministratorStatus(
  status: unknown,
): AuthUserStatus {
  return isAuthUserStatus(
    status,
  )
    ? status
    : AUTH_USER_STATUSES.DISABLED;
}

function toAuthServiceUser(
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
      normalizeAdministratorRole(
        user.role,
      ),

    status:
      normalizeAdministratorStatus(
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

function toAdministratorUser(
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
): AdministratorUser {
  const normalizedUser =
    toAuthServiceUser(
      user,
    );

  if (
    normalizedUser.role !==
    AUTH_ROLES.ADMIN
  ) {
    throw new AdminAuthServiceError(
      "ADMIN_SESSION_LOOKUP_FAILED",
      "La cuenta no posee permisos administrativos.",
      {
        httpStatus:
          403,
      },
    );
  }

  return {
    ...normalizedUser,

    role:
      AUTH_ROLES.ADMIN,
  };
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
  const lockMinutes =
    readPositiveIntegerEnvironmentVariable(
      "AUTH_ACCOUNT_LOCK_MINUTES",
      DEFAULT_ACCOUNT_LOCK_MINUTES,
      MAXIMUM_ACCOUNT_LOCK_MINUTES,
    );

  return (
    lockMinutes *
    60 *
    1000
  );
}

function calculateRetryAfterSeconds(
  lockedUntil:
    | Date
    | null,
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
    | Date
    | null,
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

function getDummyAdminPasswordHash():
  Promise<string> {
  dummyAdminPasswordHashPromise ??=
    hashPassword(
      DUMMY_ADMIN_PASSWORD,
    );

  return dummyAdminPasswordHashPromise;
}

async function performDummyAdminPasswordVerification(
  password: string,
): Promise<void> {
  try {
    const dummyHash =
      await getDummyAdminPasswordHash();

    await verifyPassword(dummyHash, password);
  } catch {
    /*
     * La verificaciÃ³n seÃ±uelo nunca debe modificar
     * la respuesta pÃºblica.
     */
  }
}

async function verifyAdministratorPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  try {
    return await verifyPassword(passwordHash, password);
  } catch {
    return false;
  }
}

async function recordAdministratorAudit(
  {
    actorUserId,
    subjectUserId,

    action,

    entityType =
      "ADMIN_AUTHENTICATION",

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
      string;

    entityId?:
      | string
      | null;

    metadata:
      AdminAuthRequestMetadata;

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

    entityType,

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

async function handleInvalidAdministratorPassword(
  user: {
    id: string;

    failedLoginAttempts: number;

    status: string;
  },
  metadata:
    AdminAuthRequestMetadata,
): Promise<
  | AdministratorAccountLockedResult
  | AdministratorInvalidCredentialsResult
> {
  if (
    user.status ===
    AUTH_USER_STATUSES.DISABLED
  ) {
    await recordAdministratorAudit({
      subjectUserId:
        user.id,

      action:
        "ADMIN_LOGIN_FAILED",

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

    await recordAdministratorAudit({
      subjectUserId:
        user.id,

      action:
        "ADMIN_ACCOUNT_LOCKED",

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

  await recordAdministratorAudit({
    subjectUserId:
      user.id,

    action:
      "ADMIN_LOGIN_FAILED",

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

async function createAdministratorSession(
  user: {
    id: string;

    passwordHash: string;
  },
  password: string,
  rememberMe: boolean,
  metadata:
    AdminAuthRequestMetadata,
): Promise<CreatedAdministratorSession> {
  const now =
    new Date();

  const lifetime =
    createSessionLifetime(
      rememberMe,
      now,
    );

  let refreshedPasswordHash:
    | string
    | null =
    null;

  try {
    if (
      passwordHashNeedsRehash(
        user.passwordHash,
      )
    ) {
      refreshedPasswordHash =
        await hashPassword(
          password,
        );
    }
  } catch {
    refreshedPasswordHash =
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
      const result =
        await prisma.$transaction(
          async (
            transaction,
          ) => {
            if (
              refreshedPasswordHash
            ) {
              await transaction.user.update({
                where: {
                  id:
                    user.id,
                },

                data: {
                  passwordHash:
                    refreshedPasswordHash,
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
              administrator:
                toAdministratorUser(
                  updatedUser,
                ),

              session,
            };
          },
        );

      return {
        token,

        administrator:
          result.administrator,

        session: {
          id:
            result.session.id,

          expiresAt:
            result.session.expiresAt,

          lastSeenAt:
            result.session.lastSeenAt,

          rememberMe:
            result.session.rememberMe,
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

  throw new AdminAuthServiceError(
    "ADMIN_SESSION_CREATION_FAILED",
    "No fue posible crear la sesiÃ³n administrativa.",
  );
}

/**
 * Inicia sesiÃ³n exclusivamente para cuentas ADMIN.
 */
export async function authenticateAdministrator(
  input:
    LoginSchemaOutput,
  metadata:
    AdminAuthRequestMetadata = {},
): Promise<AuthenticateAdministratorResult> {
  const data =
    loginSchema.parse(
      input,
    );

  let user =
    await findUserForAuthenticationByEmail(
      data.email,
    );

  if (!user) {
    await performDummyAdminPasswordVerification(
      data.password,
    );

    await recordAdministratorAudit({
      action:
        "ADMIN_LOGIN_FAILED",

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
    await verifyAdministratorPassword(
      data.password,
      user.passwordHash,
    );

  if (!passwordIsValid) {
    if (activeLock) {
      await recordAdministratorAudit({
        subjectUserId:
          user.id,

        action:
          "ADMIN_LOGIN_FAILED",

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

    return handleInvalidAdministratorPassword(
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
    await recordAdministratorAudit({
      subjectUserId:
        user.id,

      action:
        "ADMIN_LOGIN_BLOCKED_LOCKED_ACCOUNT",

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
    await recordAdministratorAudit({
      subjectUserId:
        user.id,

      action:
        "ADMIN_LOGIN_BLOCKED_DISABLED_ACCOUNT",

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
    user.role !==
    AUTH_ROLES.ADMIN
  ) {
    await recordAdministratorAudit({
      subjectUserId:
        user.id,

      action:
        "ADMIN_LOGIN_INSUFFICIENT_PERMISSIONS",

      entityType:
        "USER",

      entityId:
        user.id,

      metadata,

      details: {
        currentRole:
          user.role,

        requiredRole:
          AUTH_ROLES.ADMIN,
      },
    });

    return {
      status:
        "insufficient-permissions",

      requiredRole:
        AUTH_ROLES.ADMIN,
    };
  }

  if (
    user.status ===
      AUTH_USER_STATUSES.PENDING_VERIFICATION ||
    user.emailVerifiedAt ===
      null
  ) {
    await recordAdministratorAudit({
      subjectUserId:
        user.id,

      action:
        "ADMIN_LOGIN_REQUIRES_EMAIL_VERIFICATION",

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
      await createAdministratorSession(
        user,
        data.password,
        data.rememberMe,
        metadata,
      );

    const remainingSeconds =
      getSessionRemainingSeconds(
        createdSession.session
          .expiresAt,
      );

    await recordAdministratorAudit({
      actorUserId:
        createdSession
          .administrator.id,

      subjectUserId:
        createdSession
          .administrator.id,

      action:
        "ADMIN_LOGIN_SUCCESS",

      entityType:
        "SESSION",

      entityId:
        createdSession.session.id,

      metadata,

      details: {
        rememberMe:
          createdSession.session
            .rememberMe,

        expiresAt:
          createdSession.session
            .expiresAt
            .toISOString(),
      },
    });

    return {
      status:
        "authenticated",

      administrator:
        createdSession
          .administrator,

      user:
        createdSession
          .administrator,

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

        remainingSeconds,
      },
    };
  } catch (error) {
    if (
      error instanceof
      AdminAuthServiceError
    ) {
      throw error;
    }

    throw new AdminAuthServiceError(
      "ADMIN_LOGIN_FAILED",
      "No fue posible iniciar la sesiÃ³n administrativa.",
      {
        cause:
          error,
      },
    );
  }
}

/**
 * Valida una sesiÃ³n y comprueba que pertenezca a ADMIN.
 */
export async function getAdministratorSessionByToken(
  sessionToken: unknown,
): Promise<GetAdministratorSessionResult> {
  try {
    const sessionResult =
      await getAuthenticatedSessionByToken(
        sessionToken,
      );

    if (
      sessionResult.status ===
      "invalid-session"
    ) {
      return {
        status:
          "invalid-session",

        administrator:
          null,

        user:
          null,
      };
    }

    if (
      sessionResult.status ===
      "account-unavailable"
    ) {
      return {
        status:
          "account-unavailable",

        administrator:
          null,

        user:
          null,
      };
    }

    if (
      sessionResult.user.role !==
      AUTH_ROLES.ADMIN
    ) {
      return {
        status:
          "insufficient-permissions",

        requiredRole:
          AUTH_ROLES.ADMIN,
      };
    }

    const administrator =
      toAdministratorUser(
        sessionResult.user,
      );

    return {
      status:
        "authenticated",

      administrator,

      user:
        administrator,

      session: {
        id:
          sessionResult.session.id,

        expiresAt:
          sessionResult.session
            .expiresAt,

        lastSeenAt:
          sessionResult.session
            .lastSeenAt,

        rememberMe:
          sessionResult.session
            .rememberMe,

        remainingSeconds:
          sessionResult.session
            .remainingSeconds,
      },
    };
  } catch (error) {
    if (
      error instanceof
      AdminAuthServiceError
    ) {
      throw error;
    }

    throw new AdminAuthServiceError(
      "ADMIN_SESSION_LOOKUP_FAILED",
      "No fue posible consultar la sesiÃ³n administrativa.",
      {
        cause:
          error,
      },
    );
  }
}

async function getAdministratorSummary():
  Promise<AdministratorDashboardSummary> {
  const [
    totalUsers,
    activeUsers,
    administrators,
  ] = await Promise.all([
    countUsers(),

    countActiveUsers(),

    countAdministrators(),
  ]);

  return {
    totalUsers,
    activeUsers,
    administrators,
  };
}

/**
 * Obtiene los indicadores bÃ¡sicos del panel.
 */
export async function getAdministratorDashboardByToken(
  sessionToken: unknown,
): Promise<AdministratorDashboardResult> {
  const sessionResult =
    await getAdministratorSessionByToken(
      sessionToken,
    );

  if (
    sessionResult.status !==
    "authenticated"
  ) {
    return sessionResult;
  }

  try {
    const summary =
      await getAdministratorSummary();

    return {
      status:
        "authenticated",

      administrator:
        sessionResult.administrator,

      summary,
    };
  } catch (error) {
    throw new AdminAuthServiceError(
      "ADMIN_USERS_LIST_FAILED",
      "No fue posible obtener el resumen administrativo.",
      {
        cause:
          error,
      },
    );
  }
}

function readListInputValue(
  input:
    | AdministratorUsersPageInput
    | URLSearchParams,
  key:
    keyof AdministratorUsersPageInput,
): unknown {
  if (
    isUrlSearchParams(
      input,
    )
  ) {
    const directValue =
      input.get(
        key,
      );

    if (
      directValue !==
      null
    ) {
      return directValue;
    }

    if (
      key ===
      "pageSize"
    ) {
      return input.get(
        "page_size",
      );
    }

    if (
      key ===
      "orderBy"
    ) {
      return input.get(
        "order_by",
      );
    }

    if (
      key ===
      "orderDirection"
    ) {
      return input.get(
        "order_direction",
      );
    }

    return null;
  }

  return input[key];
}

function normalizePositiveInteger(
  value: unknown,
  defaultValue: number,
  maximumValue:
    number = Number.MAX_SAFE_INTEGER,
): number {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return defaultValue;
  }

  const parsedValue =
    typeof value ===
      "number"
      ? value
      : Number(
          String(value).trim(),
        );

  if (
    !Number.isFinite(
      parsedValue,
    )
  ) {
    return defaultValue;
  }

  return Math.min(
    maximumValue,
    Math.max(
      1,
      Math.floor(
        parsedValue,
      ),
    ),
  );
}

function normalizeSearch(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  const normalizedSearch =
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
        MAXIMUM_SEARCH_LENGTH,
      );

  return normalizedSearch ||
    null;
}

function normalizeOptionalRole(
  value: unknown,
): AuthRole | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const normalizedValue =
    typeof value ===
      "string"
      ? value
          .trim()
          .toUpperCase()
      : value;

  return isAuthRole(
    normalizedValue,
  )
    ? normalizedValue
    : null;
}

function normalizeOptionalStatus(
  value: unknown,
): AuthUserStatus | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const normalizedValue =
    typeof value ===
      "string"
      ? value
          .trim()
          .toUpperCase()
      : value;

  return isAuthUserStatus(
    normalizedValue,
  )
    ? normalizedValue
    : null;
}

function normalizeUsersOrderBy(
  value: unknown,
): NonNullable<
  FindUsersPageRepositoryInput["orderBy"]
> {
  if (
    value ===
      "displayName" ||
    value ===
      "email" ||
    value ===
      "lastLoginAt" ||
    value ===
      "createdAt"
  ) {
    return value;
  }

  return "createdAt";
}

function normalizeOrderDirection(
  value: unknown,
): NonNullable<
  FindUsersPageRepositoryInput["orderDirection"]
> {
  return value ===
    "asc"
    ? "asc"
    : "desc";
}

function resolveAdministratorUsersPageArguments(
  sessionTokenOrCommand:
    unknown,
  input:
    | AdministratorUsersPageInput
    | URLSearchParams = {},
): ResolvedAdministratorUsersPageArguments {
  if (
    isPlainObject(
      sessionTokenOrCommand,
    ) &&
    (
      "sessionToken" in
        sessionTokenOrCommand ||
      "token" in
        sessionTokenOrCommand
    )
  ) {
    const command =
      sessionTokenOrCommand as AdministratorUsersPageCommand;

    return {
      sessionToken:
        command.sessionToken ??
        command.token,

      input:
        command.query ??
        command.filters ??
        command,
    };
  }

  return {
    sessionToken:
      sessionTokenOrCommand,

    input,
  };
}

/**
 * Devuelve usuarios paginados Ãºnicamente cuando la sesiÃ³n
 * pertenece a una cuenta ADMIN.
 */
export async function getAdministratorUsersPageByToken(
  sessionTokenOrCommand:
    unknown,
  input:
    | AdministratorUsersPageInput
    | URLSearchParams = {},
): Promise<AdministratorUsersPageResult> {
  const resolvedArguments =
    resolveAdministratorUsersPageArguments(
      sessionTokenOrCommand,
      input,
    );

  const sessionResult =
    await getAdministratorSessionByToken(
      resolvedArguments.sessionToken,
    );

  if (
    sessionResult.status !==
    "authenticated"
  ) {
    return sessionResult;
  }

  const page =
    normalizePositiveInteger(
      readListInputValue(
        resolvedArguments.input,
        "page",
      ),
      DEFAULT_PAGE,
    );

  const pageSize =
    normalizePositiveInteger(
      readListInputValue(
        resolvedArguments.input,
        "pageSize",
      ),
      DEFAULT_PAGE_SIZE,
      MAXIMUM_PAGE_SIZE,
    );

  const search =
    normalizeSearch(
      readListInputValue(
        resolvedArguments.input,
        "search",
      ),
    );

  const role =
    normalizeOptionalRole(
      readListInputValue(
        resolvedArguments.input,
        "role",
      ),
    );

  const status =
    normalizeOptionalStatus(
      readListInputValue(
        resolvedArguments.input,
        "status",
      ),
    );

  const orderBy =
    normalizeUsersOrderBy(
      readListInputValue(
        resolvedArguments.input,
        "orderBy",
      ),
    );

  const orderDirection =
    normalizeOrderDirection(
      readListInputValue(
        resolvedArguments.input,
        "orderDirection",
      ),
    );

  try {
    const [
      usersPage,
      summary,
    ] = await Promise.all([
      findUsersPage({
        page,
        pageSize,

        search:
          search ??
          undefined,

        role:
          role ??
          undefined,

        status:
          status ??
          undefined,

        orderBy,
        orderDirection,
      }),

      getAdministratorSummary(),
    ]);

    return {
      status:
        "authenticated",

      administrator:
        sessionResult.administrator,

      users:
        usersPage.users,

      pagination:
        usersPage.pagination,

      filters: {
        search,
        role,
        status,

        orderBy,
        orderDirection,
      },

      summary,
    };
  } catch (error) {
    throw new AdminAuthServiceError(
      "ADMIN_USERS_LIST_FAILED",
      "No fue posible obtener los usuarios.",
      {
        cause:
          error,
      },
    );
  }
}

function parseOptionalDate(
  value: unknown,
): Date | null | undefined {
  if (
    value === undefined
  ) {
    return undefined;
  }

  if (
    value === null ||
    value === ""
  ) {
    return null;
  }

  const parsedDate =
    value instanceof
      Date
      ? new Date(
          value.getTime(),
        )
      : typeof value ===
          "string"
        ? new Date(
            value,
          )
        : null;

  if (
    !parsedDate ||
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    throw new AdminAuthServiceError(
      "ADMIN_INPUT_INVALID",
      "La fecha de bloqueo no es vÃ¡lida.",
      {
        httpStatus:
          400,
      },
    );
  }

  return parsedDate;
}

function normalizeManagedUserUpdate(
  input: unknown,
): NormalizedManagedUserUpdate {
  if (
    !isPlainObject(
      input,
    )
  ) {
    throw new AdminAuthServiceError(
      "ADMIN_INPUT_INVALID",
      "Los datos de administraciÃ³n del usuario no son vÃ¡lidos.",
      {
        httpStatus:
          400,
      },
    );
  }

  const normalizedInput = {
    ...input,
  };

  if (
    normalizedInput.role ===
      undefined
  ) {
    normalizedInput.role =
      normalizedInput.userRole ??
      normalizedInput.user_role;
  }

  if (
    normalizedInput.status ===
      undefined
  ) {
    normalizedInput.status =
      normalizedInput.userStatus ??
      normalizedInput.user_status;
  }

  if (
    normalizedInput.lockedUntil ===
      undefined
  ) {
    normalizedInput.lockedUntil =
      normalizedInput.locked_until;
  }

  delete normalizedInput.userRole;
  delete normalizedInput.user_role;

  delete normalizedInput.userStatus;
  delete normalizedInput.user_status;

  delete normalizedInput.locked_until;

  const allowedKeys =
    new Set([
      "role",
      "status",
      "lockedUntil",
    ]);

  const unknownKeys =
    Object.keys(
      normalizedInput,
    ).filter(
      (key) =>
        !allowedKeys.has(
          key,
        ),
    );

  if (
    unknownKeys.length >
    0
  ) {
    throw new AdminAuthServiceError(
      "ADMIN_INPUT_INVALID",
      `La solicitud contiene campos no permitidos: ${unknownKeys.join(", ")}.`,
      {
        httpStatus:
          400,
      },
    );
  }

  const result:
    NormalizedManagedUserUpdate = {};

  if (
    normalizedInput.role !==
      undefined
  ) {
    const normalizedRole =
      typeof normalizedInput.role ===
        "string"
        ? normalizedInput.role
            .trim()
            .toUpperCase()
        : normalizedInput.role;

    if (
      !isAuthRole(
        normalizedRole,
      )
    ) {
      throw new AdminAuthServiceError(
        "ADMIN_INPUT_INVALID",
        "El rol seleccionado no es vÃ¡lido.",
        {
          httpStatus:
            400,
        },
      );
    }

    result.role =
      normalizedRole;
  }

  if (
    normalizedInput.status !==
      undefined
  ) {
    const normalizedStatus =
      typeof normalizedInput.status ===
        "string"
        ? normalizedInput.status
            .trim()
            .toUpperCase()
        : normalizedInput.status;

    if (
      !isAuthUserStatus(
        normalizedStatus,
      )
    ) {
      throw new AdminAuthServiceError(
        "ADMIN_INPUT_INVALID",
        "El estado seleccionado no es vÃ¡lido.",
        {
          httpStatus:
            400,
        },
      );
    }

    result.status =
      normalizedStatus;
  }

  result.lockedUntil =
    parseOptionalDate(
      normalizedInput.lockedUntil,
    );

  if (
    result.lockedUntil instanceof
      Date &&
    result.status ===
      undefined
  ) {
    result.status =
      AUTH_USER_STATUSES.LOCKED;
  }

  if (
    result.status ===
      AUTH_USER_STATUSES.LOCKED &&
    result.lockedUntil ===
      undefined
  ) {
    result.lockedUntil =
      new Date(
        Date.now() +
          getAccountLockDurationMs(),
      );
  }

  if (
    result.status ===
      AUTH_USER_STATUSES.ACTIVE ||
    result.status ===
      AUTH_USER_STATUSES.DISABLED
  ) {
    result.lockedUntil =
      null;
  }

  return result;
}

function resolveManagedUserArguments(
  sessionTokenOrCommand:
    unknown,
  userId?: unknown,
  input?: unknown,
  metadata:
    AdminAuthRequestMetadata = {},
): ResolvedManagedUserArguments {
  if (
    isPlainObject(
      sessionTokenOrCommand,
    ) &&
    (
      "sessionToken" in
        sessionTokenOrCommand ||
      "token" in
        sessionTokenOrCommand
    )
  ) {
    const command =
      sessionTokenOrCommand as UpdateManagedUserCommand;

    return {
      sessionToken:
        command.sessionToken ??
        command.token,

      userId:
        command.userId ??
        command.managedUserId ??
        command.targetUserId ??
        userId,

      input:
        command.data ??
        command.updates ??
        {
          role:
            command.role,

          status:
            command.status,

          lockedUntil:
            command.lockedUntil,
        },

      metadata:
        command.metadata ??
        metadata,
    };
  }

  return {
    sessionToken:
      sessionTokenOrCommand,

    userId,

    input:
      input ??
      {},

    metadata,
  };
}

function hasMeaningfulManagedUserChanges(
  currentUser:
    AdminUserRecord,
  input:
    NormalizedManagedUserUpdate,
): {
  hasChanges: boolean;

  updatedFields:
    string[];

  effectiveRole:
    AuthRole;

  effectiveStatus:
    AuthUserStatus;

  effectiveLockedUntil:
    | Date
    | null;
} {
  const currentRole =
    normalizeAdministratorRole(
      currentUser.role,
    );

  const currentStatus =
    normalizeAdministratorStatus(
      currentUser.status,
    );

  const effectiveRole =
    input.role ??
    currentRole;

  const effectiveStatus =
    input.status ??
    currentStatus;

  const effectiveLockedUntil =
    input.lockedUntil !==
      undefined
      ? input.lockedUntil
      : currentUser.lockedUntil;

  const updatedFields:
    string[] = [];

  if (
    effectiveRole !==
    currentRole
  ) {
    updatedFields.push(
      "role",
    );
  }

  if (
    effectiveStatus !==
    currentStatus
  ) {
    updatedFields.push(
      "status",
    );
  }

  const currentLockedAt =
    currentUser.lockedUntil
      ?.getTime() ??
    null;

  const effectiveLockedAt =
    effectiveLockedUntil
      ?.getTime() ??
    null;

  if (
    effectiveLockedAt !==
    currentLockedAt
  ) {
    updatedFields.push(
      "lockedUntil",
    );
  }

  return {
    hasChanges:
      updatedFields.length >
      0,

    updatedFields,

    effectiveRole,

    effectiveStatus,

    effectiveLockedUntil,
  };
}

/**
 * Actualiza de forma controlada el rol o estado de otro
 * usuario desde el panel administrativo.
 */
export async function updateManagedUserByAdministrator(
  sessionTokenOrCommand:
    unknown,
  userId?: unknown,
  input?: unknown,
  metadata:
    AdminAuthRequestMetadata = {},
): Promise<UpdateManagedUserResult> {
  const resolvedArguments =
    resolveManagedUserArguments(
      sessionTokenOrCommand,
      userId,
      input,
      metadata,
    );

  const normalizedUserId =
    requireIdentifier(
      resolvedArguments.userId,
      "userId",
    );

  const normalizedUpdate =
    normalizeManagedUserUpdate(
      resolvedArguments.input,
    );

  const sessionResult =
    await getAdministratorSessionByToken(
      resolvedArguments.sessionToken,
    );

  if (
    sessionResult.status !==
    "authenticated"
  ) {
    return sessionResult;
  }

  try {
    const transactionResult =
      await prisma.$transaction(
        async (
          transaction,
        ) => {
          const currentUser =
            await findAdminUserById(
              normalizedUserId,
              transaction,
            );

          if (!currentUser) {
            return {
              status:
                "not-found" as const,
            };
          }

          const changeState =
            hasMeaningfulManagedUserChanges(
              currentUser,
              normalizedUpdate,
            );

          if (
            !changeState.hasChanges
          ) {
            return {
              status:
                "no-changes" as const,

              user:
                currentUser,
            };
          }

          const isCurrentAdministrator =
            currentUser.id ===
            sessionResult.administrator.id;

          const wouldLoseAdministratorAccess =
            changeState.effectiveRole !==
              AUTH_ROLES.ADMIN ||
            changeState.effectiveStatus !==
              AUTH_USER_STATUSES.ACTIVE ||
            (
              changeState.effectiveLockedUntil !==
                null &&
              changeState.effectiveLockedUntil
                .getTime() >
                Date.now()
            );

          if (
            isCurrentAdministrator &&
            wouldLoseAdministratorAccess
          ) {
            return {
              status:
                "self-protection" as const,

              user:
                currentUser,
            };
          }

          const currentlyActiveAdministrator =
            currentUser.role ===
              AUTH_ROLES.ADMIN &&
            currentUser.status ===
              AUTH_USER_STATUSES.ACTIVE;

          const willRemainActiveAdministrator =
            changeState.effectiveRole ===
              AUTH_ROLES.ADMIN &&
            changeState.effectiveStatus ===
              AUTH_USER_STATUSES.ACTIVE &&
            !(
              changeState.effectiveLockedUntil &&
              changeState.effectiveLockedUntil
                .getTime() >
                Date.now()
            );

          if (
            currentlyActiveAdministrator &&
            !willRemainActiveAdministrator
          ) {
            const activeAdministratorCount =
              await countUsers(
                {
                  role:
                    AUTH_ROLES.ADMIN,

                  status:
                    AUTH_USER_STATUSES.ACTIVE,
                },
                transaction,
              );

            if (
              activeAdministratorCount <=
              1
            ) {
              return {
                status:
                  "last-administrator-protected" as const,

                user:
                  currentUser,
              };
            }
          }

          const updatedUser =
            await updateManagedUser(
              currentUser.id,
              {
                role:
                  changeState.effectiveRole,

                status:
                  changeState.effectiveStatus,

                lockedUntil:
                  changeState.effectiveLockedUntil,
              },
              transaction,
            );

          const shouldRevokeSessions =
            changeState.effectiveStatus ===
              AUTH_USER_STATUSES.DISABLED ||
            changeState.effectiveStatus ===
              AUTH_USER_STATUSES.LOCKED ||
            (
              currentUser.role ===
                AUTH_ROLES.ADMIN &&
              changeState.effectiveRole !==
                AUTH_ROLES.ADMIN
            );

          const revokedSessions =
            shouldRevokeSessions
              ? await revokeUserSessions(
                  {
                    userId:
                      currentUser.id,

                    revokedAt:
                      new Date(),
                  },
                  transaction,
                )
              : 0;

          return {
            status:
              "updated" as const,

            previousUser:
              currentUser,

            user:
              updatedUser,

            updatedFields:
              changeState.updatedFields,

            revokedSessions,
          };
        },
      );

    if (
      transactionResult.status ===
      "not-found"
    ) {
      return {
        status:
          "not-found",

        user:
          null,

        managedUser:
          null,
      };
    }

    if (
      transactionResult.status ===
      "self-protection"
    ) {
      return {
        status:
          "self-protection",

        user:
          transactionResult.user,

        managedUser:
          transactionResult.user,

        message:
          "No puedes quitarte permisos administrativos, bloquearte o desactivar tu propia cuenta.",
      };
    }

    if (
      transactionResult.status ===
      "last-administrator-protected"
    ) {
      return {
        status:
          "last-administrator-protected",

        user:
          transactionResult.user,

        managedUser:
          transactionResult.user,

        message:
          "La operaciÃ³n dejarÃ­a el sistema sin un administrador activo.",
      };
    }

    if (
      transactionResult.status ===
      "no-changes"
    ) {
      return {
        status:
          "no-changes",

        user:
          transactionResult.user,

        managedUser:
          transactionResult.user,

        updated:
          false,

        noChanges:
          true,

        updatedFields:
          [],

        revokedSessions:
          0,
      };
    }

    await recordAdministratorAudit({
      actorUserId:
        sessionResult.administrator.id,

      subjectUserId:
        transactionResult.user.id,

      action:
        "ADMIN_USER_UPDATED",

      entityType:
        "USER",

      entityId:
        transactionResult.user.id,

      metadata:
        resolvedArguments.metadata,

      details: {
        updatedFields:
          transactionResult.updatedFields,

        previousRole:
          transactionResult
            .previousUser.role,

        newRole:
          transactionResult
            .user.role,

        previousStatus:
          transactionResult
            .previousUser.status,

        newStatus:
          transactionResult
            .user.status,

        revokedSessions:
          transactionResult
            .revokedSessions,
      },
    });

    return {
      status:
        "updated",

      user:
        transactionResult.user,

      managedUser:
        transactionResult.user,

      updated:
        true,

      noChanges:
        false,

      updatedFields:
        transactionResult.updatedFields,

      revokedSessions:
        transactionResult.revokedSessions,
    };
  } catch (error) {
    if (
      error instanceof
      AdminAuthServiceError
    ) {
      throw error;
    }

    throw new AdminAuthServiceError(
      "ADMIN_USER_UPDATE_FAILED",
      "No fue posible actualizar el usuario.",
      {
        cause:
          error,
      },
    );
  }
}

export function isAdminAuthServiceError(
  error: unknown,
): error is AdminAuthServiceError {
  return (
    error instanceof
    AdminAuthServiceError
  );
}

/**
 * Alias compatibles con las rutas y pÃ¡ginas existentes.
 */
export const authenticateAdmin =
  authenticateAdministrator;

export const loginAdministrator =
  authenticateAdministrator;

export const loginAdmin =
  authenticateAdministrator;

export const getAdminSessionByToken =
  getAdministratorSessionByToken;

export const getAdministratorSession =
  getAdministratorSessionByToken;

export const getCurrentAdministratorSession =
  getAdministratorSessionByToken;

export const getAdminDashboardByToken =
  getAdministratorDashboardByToken;

export const getAdministratorSummaryByToken =
  getAdministratorDashboardByToken;

export const getAdminUsersPageByToken =
  getAdministratorUsersPageByToken;

export const getManagedUsersByAdministrator =
  getAdministratorUsersPageByToken;

export const updateAdminManagedUser =
  updateManagedUserByAdministrator;

export const manageUserByAdministrator =
  updateManagedUserByAdministrator;

export type AuthenticateAdministratorInput =
  LoginSchemaOutput;
