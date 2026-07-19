import {
  AUTH_ROLES,
  AUTH_USER_STATUSES,
  isAuthRole,
  isAuthUserStatus,
  type AuthRole,
  type AuthUserStatus,
} from "@/constants/auth/auth.constants";

import {
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";

import {
  isSessionExpired,
} from "@/lib/auth/session";

export type AuthGuardErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_SESSION"
  | "SESSION_EXPIRED"
  | "SESSION_REVOKED"
  | "ACCOUNT_UNAVAILABLE"
  | "ACCOUNT_PENDING_VERIFICATION"
  | "ACCOUNT_LOCKED"
  | "ACCOUNT_DISABLED"
  | "EMAIL_VERIFICATION_REQUIRED"
  | "INSUFFICIENT_PERMISSIONS";

export interface AuthGuardPublicMessage {
  es: string;
  en: string;
}

export interface AuthGuardUser {
  id: string;

  role: AuthRole;
  status: AuthUserStatus;

  emailVerifiedAt:
    | Date
    | string
    | null;

  lockedUntil?:
    | Date
    | string
    | null;
}

export interface AuthGuardSession {
  id?: string;

  expiresAt:
    | Date
    | string
    | number;

  revokedAt?:
    | Date
    | string
    | null;

  rememberMe?: boolean;
}

export interface AuthGuardInput<
  TUser extends AuthGuardUser =
    AuthGuardUser,
  TSession extends AuthGuardSession =
    AuthGuardSession,
> {
  user:
    | TUser
    | null
    | undefined;

  session:
    | TSession
    | null
    | undefined;

  requireVerifiedEmail?: boolean;

  allowedRoles?: readonly AuthRole[];

  now?:
    | Date
    | string
    | number;
}

export interface AuthGuardContext<
  TUser extends AuthGuardUser =
    AuthGuardUser,
  TSession extends AuthGuardSession =
    AuthGuardSession,
> {
  user: TUser;
  session: TSession;

  isAdministrator: boolean;
}

export interface AuthGuardErrorPayload {
  ok: false;

  code: AuthGuardErrorCode;

  message: AuthGuardPublicMessage;
}

const AUTH_GUARD_MESSAGES: Record<
  AuthGuardErrorCode,
  AuthGuardPublicMessage
> = {
  UNAUTHENTICATED: {
    es:
      "Debes iniciar sesión para continuar.",

    en:
      "You must sign in to continue.",
  },

  INVALID_SESSION: {
    es:
      "La sesión no es válida.",

    en:
      "The session is invalid.",
  },

  SESSION_EXPIRED: {
    es:
      "La sesión ha vencido. Inicia sesión nuevamente.",

    en:
      "The session has expired. Sign in again.",
  },

  SESSION_REVOKED: {
    es:
      "La sesión fue cerrada o revocada.",

    en:
      "The session was closed or revoked.",
  },

  ACCOUNT_UNAVAILABLE: {
    es:
      "La cuenta no está disponible.",

    en:
      "The account is unavailable.",
  },

  ACCOUNT_PENDING_VERIFICATION: {
    es:
      "La cuenta todavía está pendiente de verificación.",

    en:
      "The account is still pending verification.",
  },

  ACCOUNT_LOCKED: {
    es:
      "La cuenta está bloqueada temporalmente.",

    en:
      "The account is temporarily locked.",
  },

  ACCOUNT_DISABLED: {
    es:
      "La cuenta se encuentra desactivada.",

    en:
      "The account is disabled.",
  },

  EMAIL_VERIFICATION_REQUIRED: {
    es:
      "Debes verificar tu correo electrónico para continuar.",

    en:
      "You must verify your email address to continue.",
  },

  INSUFFICIENT_PERMISSIONS: {
    es:
      "No tienes permisos para realizar esta acción.",

    en:
      "You do not have permission to perform this action.",
  },
};

const AUTH_GUARD_HTTP_STATUS: Record<
  AuthGuardErrorCode,
  number
> = {
  UNAUTHENTICATED: 401,

  INVALID_SESSION: 401,

  SESSION_EXPIRED: 401,

  SESSION_REVOKED: 401,

  ACCOUNT_UNAVAILABLE: 403,

  ACCOUNT_PENDING_VERIFICATION:
    403,

  ACCOUNT_LOCKED: 423,

  ACCOUNT_DISABLED: 403,

  EMAIL_VERIFICATION_REQUIRED:
    403,

  INSUFFICIENT_PERMISSIONS:
    403,
};

export class AuthGuardError extends Error {
  readonly code:
    AuthGuardErrorCode;

  readonly httpStatus:
    number;

  readonly publicMessage:
    AuthGuardPublicMessage;

  constructor(
    code:
      AuthGuardErrorCode,
    options?: {
      cause?: unknown;
      message?: string;
    },
  ) {
    const publicMessage =
      AUTH_GUARD_MESSAGES[
        code
      ];

    super(
      options?.message ??
        publicMessage.es,
      {
        cause:
          options?.cause,
      },
    );

    this.name =
      "AuthGuardError";

    this.code =
      code;

    this.httpStatus =
      AUTH_GUARD_HTTP_STATUS[
        code
      ];

    this.publicMessage =
      publicMessage;
  }
}

function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}

function parseGuardDate(
  value:
    | Date
    | string
    | number
    | null
    | undefined,
): Date | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const parsedDate =
    value instanceof Date
      ? new Date(
          value.getTime(),
        )
      : new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return null;
  }

  return parsedDate;
}

function normalizeAllowedRoles(
  roles:
    readonly AuthRole[]
    | undefined,
): AuthRole[] {
  if (!roles) {
    return [];
  }

  return Array.from(
    new Set(
      roles.filter(
        isAuthRole,
      ),
    ),
  );
}

export function isAuthGuardError(
  error: unknown,
): error is AuthGuardError {
  return (
    error instanceof
      AuthGuardError ||
    (
      isRecord(error) &&
      error.name ===
        "AuthGuardError" &&
      typeof error.code ===
        "string" &&
      error.code in
        AUTH_GUARD_MESSAGES
    )
  );
}

export function getAuthGuardMessage(
  code:
    AuthGuardErrorCode,
): AuthGuardPublicMessage {
  return AUTH_GUARD_MESSAGES[
    code
  ];
}

export function getAuthGuardHttpStatus(
  code:
    AuthGuardErrorCode,
): number {
  return AUTH_GUARD_HTTP_STATUS[
    code
  ];
}

export function createAuthGuardErrorPayload(
  error:
    AuthGuardError,
): AuthGuardErrorPayload {
  return {
    ok: false,

    code:
      error.code,

    message:
      error.publicMessage,
  };
}

/**
 * Obtiene el token de sesión desde la cookie.
 *
 * Lanza un error controlado cuando no existe o su
 * formato no es válido.
 */
export function requireSessionToken(
  request:
    | Request
    | Parameters<
        typeof getSessionTokenFromRequest
      >[0],
): string {
  const token =
    getSessionTokenFromRequest(
      request,
    );

  if (!token) {
    throw new AuthGuardError(
      "UNAUTHENTICATED",
    );
  }

  return token;
}

export function assertSessionExists<
  TSession extends AuthGuardSession,
>(
  session:
    | TSession
    | null
    | undefined,
): asserts session is TSession {
  if (!session) {
    throw new AuthGuardError(
      "INVALID_SESSION",
    );
  }
}

export function assertSessionNotRevoked(
  session:
    AuthGuardSession,
): void {
  if (!session.revokedAt) {
    return;
  }

  const revokedAt =
    parseGuardDate(
      session.revokedAt,
    );

  /*
   * Cuando revokedAt contiene un valor, la sesión
   * debe tratarse como revocada incluso si la fecha
   * recibida está dañada.
   */
  if (
    revokedAt ||
    session.revokedAt
  ) {
    throw new AuthGuardError(
      "SESSION_REVOKED",
    );
  }
}

export function assertSessionNotExpired(
  session:
    AuthGuardSession,
  now:
    | Date
    | string
    | number =
    new Date(),
): void {
  if (
    isSessionExpired(
      session.expiresAt,
      now,
    )
  ) {
    throw new AuthGuardError(
      "SESSION_EXPIRED",
    );
  }
}

export function assertSessionActive(
  session:
    AuthGuardSession,
  now:
    | Date
    | string
    | number =
    new Date(),
): void {
  assertSessionNotRevoked(
    session,
  );

  assertSessionNotExpired(
    session,
    now,
  );
}

export function assertUserExists<
  TUser extends AuthGuardUser,
>(
  user:
    | TUser
    | null
    | undefined,
): asserts user is TUser {
  if (!user) {
    throw new AuthGuardError(
      "ACCOUNT_UNAVAILABLE",
    );
  }
}

export function assertValidUserGuardData(
  user:
    AuthGuardUser,
): void {
  if (
    !user.id ||
    !isAuthRole(
      user.role,
    ) ||
    !isAuthUserStatus(
      user.status,
    )
  ) {
    throw new AuthGuardError(
      "ACCOUNT_UNAVAILABLE",
    );
  }
}

export function assertAccountNotLocked(
  user:
    AuthGuardUser,
  now:
    | Date
    | string
    | number =
    new Date(),
): void {
  if (
    user.status !==
    AUTH_USER_STATUSES.LOCKED
  ) {
    return;
  }

  const lockedUntil =
    parseGuardDate(
      user.lockedUntil,
    );

  const currentDate =
    parseGuardDate(
      now,
    ) ??
    new Date();

  /*
   * Una cuenta con estado LOCKED permanece bloqueada
   * cuando no tiene fecha de desbloqueo válida o cuando
   * la fecha todavía no ha pasado.
   *
   * La actualización del estado en la base de datos
   * corresponde al servicio de autenticación.
   */
  if (
    !lockedUntil ||
    lockedUntil.getTime() >
      currentDate.getTime()
  ) {
    throw new AuthGuardError(
      "ACCOUNT_LOCKED",
    );
  }
}

export function assertAccountActive(
  user:
    AuthGuardUser,
  now:
    | Date
    | string
    | number =
    new Date(),
): void {
  assertValidUserGuardData(
    user,
  );

  if (
    user.status ===
    AUTH_USER_STATUSES.DISABLED
  ) {
    throw new AuthGuardError(
      "ACCOUNT_DISABLED",
    );
  }

  if (
    user.status ===
    AUTH_USER_STATUSES.PENDING_VERIFICATION
  ) {
    throw new AuthGuardError(
      "ACCOUNT_PENDING_VERIFICATION",
    );
  }

  assertAccountNotLocked(
    user,
    now,
  );

  if (
    user.status !==
    AUTH_USER_STATUSES.ACTIVE
  ) {
    throw new AuthGuardError(
      "ACCOUNT_UNAVAILABLE",
    );
  }
}

export function assertEmailVerified(
  user:
    AuthGuardUser,
): void {
  const verifiedAt =
    parseGuardDate(
      user.emailVerifiedAt,
    );

  if (!verifiedAt) {
    throw new AuthGuardError(
      "EMAIL_VERIFICATION_REQUIRED",
    );
  }
}

export function userHasAllowedRole(
  user:
    AuthGuardUser,
  allowedRoles:
    readonly AuthRole[],
): boolean {
  const normalizedRoles =
    normalizeAllowedRoles(
      allowedRoles,
    );

  if (
    normalizedRoles.length ===
    0
  ) {
    return true;
  }

  return normalizedRoles.includes(
    user.role,
  );
}

export function assertAllowedRole(
  user:
    AuthGuardUser,
  allowedRoles:
    readonly AuthRole[],
): void {
  if (
    !userHasAllowedRole(
      user,
      allowedRoles,
    )
  ) {
    throw new AuthGuardError(
      "INSUFFICIENT_PERMISSIONS",
    );
  }
}

export function assertAdministrator(
  user:
    AuthGuardUser,
): void {
  assertAllowedRole(
    user,
    [
      AUTH_ROLES.ADMIN,
    ],
  );
}

/**
 * Valida una sesión y una cuenta ya obtenidas desde
 * los repositorios o servicios.
 *
 * Este archivo no consulta directamente SQL Server.
 */
export function requireAuthenticatedUser<
  TUser extends AuthGuardUser,
  TSession extends AuthGuardSession,
>({
  user,
  session,

  requireVerifiedEmail =
    false,

  allowedRoles,

  now = new Date(),
}: AuthGuardInput<
  TUser,
  TSession
>): AuthGuardContext<
  TUser,
  TSession
> {
  assertSessionExists(
    session,
  );

  assertSessionActive(
    session,
    now,
  );

  assertUserExists(
    user,
  );

  assertAccountActive(
    user,
    now,
  );

  if (
    requireVerifiedEmail
  ) {
    assertEmailVerified(
      user,
    );
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0
  ) {
    assertAllowedRole(
      user,
      allowedRoles,
    );
  }

  return {
    user,
    session,

    isAdministrator:
      user.role ===
      AUTH_ROLES.ADMIN,
  };
}

/**
 * Requiere una cuenta activa y un correo verificado.
 */
export function requireVerifiedUser<
  TUser extends AuthGuardUser,
  TSession extends AuthGuardSession,
>(
  input:
    Omit<
      AuthGuardInput<
        TUser,
        TSession
      >,
      "requireVerifiedEmail"
    >,
): AuthGuardContext<
  TUser,
  TSession
> {
  return requireAuthenticatedUser({
    ...input,

    requireVerifiedEmail:
      true,
  });
}

/**
 * Requiere una sesión activa, correo verificado
 * y rol ADMIN.
 */
export function requireAdministrator<
  TUser extends AuthGuardUser,
  TSession extends AuthGuardSession,
>(
  input:
    Omit<
      AuthGuardInput<
        TUser,
        TSession
      >,
      | "requireVerifiedEmail"
      | "allowedRoles"
    >,
): AuthGuardContext<
  TUser,
  TSession
> {
  return requireAuthenticatedUser({
    ...input,

    requireVerifiedEmail:
      true,

    allowedRoles: [
      AUTH_ROLES.ADMIN,
    ],
  });
}

/**
 * Alias semántico para operaciones que requieren
 * cualquier usuario autenticado y verificado.
 */
export const requireUserSession =
  requireVerifiedUser;

/**
 * Alias semántico para operaciones administrativas.
 */
export const requireAdminSession =
  requireAdministrator;