import {
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

import {
  AUTH_REMEMBERED_SESSION_DURATION_SECONDS,
  AUTH_SESSION_DURATION_SECONDS,
  AUTH_SESSION_REFRESH_THRESHOLD_SECONDS,
  AUTH_SESSION_TOKEN_BYTES,
  AUTH_SESSION_TOKEN_HASH_ALGORITHM,
} from "@/constants/auth/auth.constants";

export type SessionDateInput =
  | Date
  | string
  | number;

export interface SessionTokenPair {
  token: string;
  tokenHash: string;
}

export interface SessionLifetime {
  rememberMe: boolean;

  durationSeconds: number;

  createdAt: Date;
  expiresAt: Date;
}

export interface SessionLifetimeState {
  expiresAt: Date | null;

  remainingSeconds: number;

  isExpired: boolean;
  shouldRefresh: boolean;
}

export type SessionTokenErrorCode =
  | "SESSION_TOKEN_REQUIRED"
  | "SESSION_TOKEN_INVALID_FORMAT";

const EXPECTED_SESSION_TOKEN_LENGTH =
  Math.ceil(
    AUTH_SESSION_TOKEN_BYTES *
      4 /
      3,
  );

const SESSION_TOKEN_PATTERN =
  new RegExp(
    `^[A-Za-z0-9_-]{${EXPECTED_SESSION_TOKEN_LENGTH}}$`,
  );

const SESSION_TOKEN_HASH_LENGTH =
  createHash(
    AUTH_SESSION_TOKEN_HASH_ALGORITHM,
  )
    .digest()
    .length * 2;

const SESSION_TOKEN_HASH_PATTERN =
  new RegExp(
    `^[a-f0-9]{${SESSION_TOKEN_HASH_LENGTH}}$`,
    "i",
  );

export class SessionTokenError extends Error {
  readonly code:
    SessionTokenErrorCode;

  constructor(
    code:
      SessionTokenErrorCode,
  ) {
    super(
      code ===
        "SESSION_TOKEN_REQUIRED"
        ? "El token de sesión es obligatorio."
        : "El token de sesión tiene un formato inválido.",
    );

    this.name =
      "SessionTokenError";

    this.code =
      code;
  }
}

function parseSessionDate(
  value:
    SessionDateInput,
): Date | null {
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

function requireValidDate(
  value:
    SessionDateInput,
  fieldName: string,
): Date {
  const parsedDate =
    parseSessionDate(
      value,
    );

  if (!parsedDate) {
    throw new RangeError(
      `La fecha "${fieldName}" no es válida.`,
    );
  }

  return parsedDate;
}

/**
 * Devuelve la duración correspondiente al tipo de sesión.
 *
 * Sesión normal:
 * 12 horas.
 *
 * Sesión con "recordarme":
 * 30 días.
 */
export function getSessionDurationSeconds(
  rememberMe: boolean,
): number {
  return rememberMe
    ? AUTH_REMEMBERED_SESSION_DURATION_SECONDS
    : AUTH_SESSION_DURATION_SECONDS;
}

/**
 * Crea un token opaco y criptográficamente seguro.
 *
 * El token original solamente debe enviarse al navegador.
 * La base de datos debe almacenar únicamente su hash.
 */
export function generateSessionToken():
  string {
  return randomBytes(
    AUTH_SESSION_TOKEN_BYTES,
  ).toString(
    "base64url",
  );
}

export function isValidSessionToken(
  token: unknown,
): token is string {
  return (
    typeof token ===
      "string" &&
    SESSION_TOKEN_PATTERN.test(
      token,
    )
  );
}

export function assertValidSessionToken(
  token: unknown,
): asserts token is string {
  if (
    typeof token !==
      "string" ||
    token.length === 0
  ) {
    throw new SessionTokenError(
      "SESSION_TOKEN_REQUIRED",
    );
  }

  if (
    !isValidSessionToken(
      token,
    )
  ) {
    throw new SessionTokenError(
      "SESSION_TOKEN_INVALID_FORMAT",
    );
  }
}

/**
 * Genera el hash que se almacenará en SQL Server.
 */
export function hashSessionToken(
  token: string,
): string {
  assertValidSessionToken(
    token,
  );

  return createHash(
    AUTH_SESSION_TOKEN_HASH_ALGORITHM,
  )
    .update(
      token,
      "utf8",
    )
    .digest(
      "hex",
    );
}

/**
 * Variante segura para valores recibidos desde cookies.
 *
 * Devuelve null cuando el token está vacío o mal formado,
 * en lugar de lanzar una excepción.
 */
export function tryHashSessionToken(
  token: unknown,
): string | null {
  if (
    !isValidSessionToken(
      token,
    )
  ) {
    return null;
  }

  return hashSessionToken(
    token,
  );
}

export function isSessionTokenHash(
  tokenHash: unknown,
): tokenHash is string {
  return (
    typeof tokenHash ===
      "string" &&
    SESSION_TOKEN_HASH_PATTERN.test(
      tokenHash,
    )
  );
}

/**
 * Compara el token recibido con el hash almacenado
 * utilizando una comparación de tiempo constante.
 */
export function verifySessionTokenHash(
  token: unknown,
  expectedTokenHash: unknown,
): boolean {
  if (
    !isValidSessionToken(
      token,
    ) ||
    !isSessionTokenHash(
      expectedTokenHash,
    )
  ) {
    return false;
  }

  const receivedTokenHash =
    hashSessionToken(
      token,
    );

  const receivedBuffer =
    Buffer.from(
      receivedTokenHash,
      "hex",
    );

  const expectedBuffer =
    Buffer.from(
      expectedTokenHash,
      "hex",
    );

  if (
    receivedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    receivedBuffer,
    expectedBuffer,
  );
}

/**
 * Crea simultáneamente el token para la cookie y
 * el hash que será guardado en la base de datos.
 */
export function createSessionTokenPair():
  SessionTokenPair {
  const token =
    generateSessionToken();

  return {
    token,

    tokenHash:
      hashSessionToken(
        token,
      ),
  };
}

/**
 * Calcula la fecha de vencimiento de una sesión.
 */
export function createSessionExpiration(
  rememberMe: boolean,
  createdAt:
    SessionDateInput =
    new Date(),
): Date {
  const validCreatedAt =
    requireValidDate(
      createdAt,
      "createdAt",
    );

  const durationSeconds =
    getSessionDurationSeconds(
      rememberMe,
    );

  return new Date(
    validCreatedAt.getTime() +
      durationSeconds *
        1_000,
  );
}

/**
 * Devuelve todos los datos temporales necesarios
 * para crear una sesión en la base de datos.
 */
export function createSessionLifetime(
  rememberMe: boolean,
  createdAt:
    SessionDateInput =
    new Date(),
): SessionLifetime {
  const validCreatedAt =
    requireValidDate(
      createdAt,
      "createdAt",
    );

  const durationSeconds =
    getSessionDurationSeconds(
      rememberMe,
    );

  const expiresAt =
    createSessionExpiration(
      rememberMe,
      validCreatedAt,
    );

  return {
    rememberMe,

    durationSeconds,

    createdAt:
      validCreatedAt,

    expiresAt,
  };
}

/**
 * Calcula los segundos completos restantes.
 *
 * Devuelve cero cuando la sesión ya venció
 * o la fecha es inválida.
 */
export function getSessionRemainingSeconds(
  expiresAt:
    SessionDateInput,
  now:
    SessionDateInput =
    new Date(),
): number {
  const validExpiresAt =
    parseSessionDate(
      expiresAt,
    );

  const validNow =
    parseSessionDate(
      now,
    );

  if (
    !validExpiresAt ||
    !validNow
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil(
      (
        validExpiresAt.getTime() -
        validNow.getTime()
      ) / 1_000,
    ),
  );
}

export function isSessionExpired(
  expiresAt:
    SessionDateInput,
  now:
    SessionDateInput =
    new Date(),
): boolean {
  const validExpiresAt =
    parseSessionDate(
      expiresAt,
    );

  const validNow =
    parseSessionDate(
      now,
    );

  if (
    !validExpiresAt ||
    !validNow
  ) {
    return true;
  }

  return (
    validExpiresAt.getTime() <=
    validNow.getTime()
  );
}

/**
 * Indica si una sesión válida está cerca de vencer.
 *
 * El servidor puede utilizar esta función para renovar
 * la sesión y actualizar posteriormente la cookie.
 */
export function shouldRefreshSession(
  expiresAt:
    SessionDateInput,
  now:
    SessionDateInput =
    new Date(),
  refreshThresholdSeconds =
    AUTH_SESSION_REFRESH_THRESHOLD_SECONDS,
): boolean {
  const safeThreshold =
    Math.max(
      0,
      Math.floor(
        refreshThresholdSeconds,
      ),
    );

  const remainingSeconds =
    getSessionRemainingSeconds(
      expiresAt,
      now,
    );

  return (
    remainingSeconds > 0 &&
    remainingSeconds <=
      safeThreshold
  );
}

export function getSessionLifetimeState(
  expiresAt:
    SessionDateInput,
  now:
    SessionDateInput =
    new Date(),
): SessionLifetimeState {
  const parsedExpiration =
    parseSessionDate(
      expiresAt,
    );

  if (
    !parsedExpiration
  ) {
    return {
      expiresAt: null,

      remainingSeconds: 0,

      isExpired: true,
      shouldRefresh: false,
    };
  }

  const remainingSeconds =
    getSessionRemainingSeconds(
      parsedExpiration,
      now,
    );

  const expired =
    remainingSeconds <= 0;

  return {
    expiresAt:
      parsedExpiration,

    remainingSeconds,

    isExpired:
      expired,

    shouldRefresh:
      !expired &&
      shouldRefreshSession(
        parsedExpiration,
        now,
      ),
  };
}

/**
 * Genera una nueva fecha de vencimiento para una sesión
 * que será renovada en el servidor.
 */
export function createRefreshedSessionExpiration(
  rememberMe: boolean,
  refreshedAt:
    SessionDateInput =
    new Date(),
): Date {
  return createSessionExpiration(
    rememberMe,
    refreshedAt,
  );
}