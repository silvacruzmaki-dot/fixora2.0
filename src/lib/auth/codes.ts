import {
  createHmac,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

import {
  AUTH_CODE_HASH_ALGORITHM,
  AUTH_CODE_LENGTH,
  AUTH_CODE_PURPOSES,
  AUTH_CODE_RESEND_COOLDOWN_SECONDS,
  AUTH_EMAIL_VERIFICATION_CODE_EXPIRATION_SECONDS,
  AUTH_MAXIMUM_CODE_ATTEMPTS,
  AUTH_MAXIMUM_CODE_RESENDS,
  AUTH_PASSWORD_RESET_CODE_EXPIRATION_SECONDS,
  isAuthCodePurpose,
  type AuthCodePurpose,
} from "@/constants/auth/auth.constants";

export type AuthCodeDateInput =
  | Date
  | string
  | number;

export type AuthCodeErrorCode =
  | "AUTH_CODE_REQUIRED"
  | "AUTH_CODE_INVALID_FORMAT"
  | "AUTH_CODE_SECRET_MISSING"
  | "AUTH_CODE_PURPOSE_INVALID"
  | "AUTH_CODE_DATE_INVALID";

export interface AuthCodePair {
  code: string;
  codeHash: string;
}

export interface AuthCodeLifetime {
  purpose: AuthCodePurpose;

  createdAt: Date;
  expiresAt: Date;

  durationSeconds: number;
}

export interface AuthCodeLifetimeState {
  expiresAt: Date | null;

  remainingSeconds: number;

  isExpired: boolean;
}

export interface AuthCodeAttemptState {
  attempts: number;
  maximumAttempts: number;

  remainingAttempts: number;

  hasReachedLimit: boolean;
}

export interface AuthCodeResendState {
  resendCount: number;
  maximumResends: number;

  remainingResends: number;

  hasReachedLimit: boolean;
}

export interface AuthCodeCooldownState {
  availableAt: Date | null;

  remainingSeconds: number;

  canResend: boolean;
}

export class AuthCodeError extends Error {
  readonly code: AuthCodeErrorCode;

  constructor(
    code: AuthCodeErrorCode,
    message: string,
  ) {
    super(message);

    this.name =
      "AuthCodeError";

    this.code =
      code;
  }
}

const AUTH_CODE_PATTERN =
  new RegExp(
    `^\\d{${AUTH_CODE_LENGTH}}$`,
  );

const AUTH_CODE_HASH_HEX_LENGTH =
  64;

const AUTH_CODE_HASH_PATTERN =
  new RegExp(
    `^[a-f0-9]{${AUTH_CODE_HASH_HEX_LENGTH}}$`,
    "i",
  );

function parseAuthCodeDate(
  value: AuthCodeDateInput,
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
  value: AuthCodeDateInput,
  fieldName: string,
): Date {
  const parsedDate =
    parseAuthCodeDate(
      value,
    );

  if (!parsedDate) {
    throw new AuthCodeError(
      "AUTH_CODE_DATE_INVALID",
      `La fecha "${fieldName}" no es válida.`,
    );
  }

  return parsedDate;
}

function getAuthCodeSecret():
  string {
  const secret =
    process.env.AUTH_CODE_SECRET;

  if (
    typeof secret !== "string" ||
    secret.length < 32
  ) {
    throw new AuthCodeError(
      "AUTH_CODE_SECRET_MISSING",
      "La variable AUTH_CODE_SECRET debe contener al menos 32 caracteres.",
    );
  }

  return secret;
}

function normalizeCounter(
  value: number,
): number {
  if (
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(value),
  );
}

function createAuthCodePayload(
  code: string,
  purpose?: AuthCodePurpose,
  subjectId?: string,
): string {
  return [
    purpose ?? "GENERIC",
    subjectId?.trim() || "GLOBAL",
    code,
  ].join(":");
}

/**
 * Genera un código numérico utilizando un generador
 * criptográficamente seguro.
 */
export function generateAuthCode():
  string {
  const maximum =
    10 ** AUTH_CODE_LENGTH;

  const number =
    randomInt(
      0,
      maximum,
    );

  return String(
    number,
  ).padStart(
    AUTH_CODE_LENGTH,
    "0",
  );
}

export function isValidAuthCode(
  code: unknown,
): code is string {
  return (
    typeof code ===
      "string" &&
    AUTH_CODE_PATTERN.test(
      code,
    )
  );
}

export function assertValidAuthCode(
  code: unknown,
): asserts code is string {
  if (
    typeof code !== "string" ||
    code.length === 0
  ) {
    throw new AuthCodeError(
      "AUTH_CODE_REQUIRED",
      "El código es obligatorio.",
    );
  }

  if (
    !isValidAuthCode(
      code,
    )
  ) {
    throw new AuthCodeError(
      "AUTH_CODE_INVALID_FORMAT",
      `El código debe contener exactamente ${AUTH_CODE_LENGTH} dígitos.`,
    );
  }
}

export function assertValidAuthCodePurpose(
  purpose: unknown,
): asserts purpose is AuthCodePurpose {
  if (
    !isAuthCodePurpose(
      purpose,
    )
  ) {
    throw new AuthCodeError(
      "AUTH_CODE_PURPOSE_INVALID",
      "El propósito del código no es válido.",
    );
  }
}

/**
 * Crea un hash HMAC-SHA256.
 *
 * Se recomienda incluir purpose y subjectId para que el
 * mismo código no produzca un hash reutilizable entre
 * usuarios o procesos diferentes.
 */
export function hashAuthCode(
  code: string,
  purpose?: AuthCodePurpose,
  subjectId?: string,
): string {
  assertValidAuthCode(
    code,
  );

  if (
    purpose !== undefined
  ) {
    assertValidAuthCodePurpose(
      purpose,
    );
  }

  const secret =
    getAuthCodeSecret();

  const payload =
    createAuthCodePayload(
      code,
      purpose,
      subjectId,
    );

  return createHmac(
    AUTH_CODE_HASH_ALGORITHM,
    secret,
  )
    .update(
      payload,
      "utf8",
    )
    .digest(
      "hex",
    );
}

/**
 * Variante segura para valores recibidos desde una
 * solicitud.
 */
export function tryHashAuthCode(
  code: unknown,
  purpose?: AuthCodePurpose,
  subjectId?: string,
): string | null {
  if (
    !isValidAuthCode(
      code,
    )
  ) {
    return null;
  }

  try {
    return hashAuthCode(
      code,
      purpose,
      subjectId,
    );
  } catch {
    return null;
  }
}

export function isAuthCodeHash(
  value: unknown,
): value is string {
  return (
    typeof value ===
      "string" &&
    AUTH_CODE_HASH_PATTERN.test(
      value,
    )
  );
}

/**
 * Compara el código recibido con el hash almacenado
 * utilizando una comparación de tiempo constante.
 */
export function verifyAuthCodeHash(
  code: unknown,
  expectedCodeHash: unknown,
  purpose?: AuthCodePurpose,
  subjectId?: string,
): boolean {
  if (
    !isValidAuthCode(
      code,
    ) ||
    !isAuthCodeHash(
      expectedCodeHash,
    )
  ) {
    return false;
  }

  let receivedCodeHash:
    string;

  try {
    receivedCodeHash =
      hashAuthCode(
        code,
        purpose,
        subjectId,
      );
  } catch {
    return false;
  }

  const receivedBuffer =
    Buffer.from(
      receivedCodeHash,
      "hex",
    );

  const expectedBuffer =
    Buffer.from(
      expectedCodeHash,
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
 * Genera simultáneamente el código que se enviará por
 * correo y el hash que se almacenará en SQL Server.
 */
export function createAuthCodePair(
  purpose?: AuthCodePurpose,
  subjectId?: string,
): AuthCodePair {
  const code =
    generateAuthCode();

  return {
    code,

    codeHash:
      hashAuthCode(
        code,
        purpose,
        subjectId,
      ),
  };
}

export function getAuthCodeDurationSeconds(
  purpose: AuthCodePurpose,
): number {
  assertValidAuthCodePurpose(
    purpose,
  );

  switch (purpose) {
    case AUTH_CODE_PURPOSES.EMAIL_VERIFICATION:
      return AUTH_EMAIL_VERIFICATION_CODE_EXPIRATION_SECONDS;

    case AUTH_CODE_PURPOSES.PASSWORD_RESET:
      return AUTH_PASSWORD_RESET_CODE_EXPIRATION_SECONDS;

    default:
      return AUTH_EMAIL_VERIFICATION_CODE_EXPIRATION_SECONDS;
  }
}

export function createAuthCodeExpiration(
  purpose: AuthCodePurpose,
  createdAt:
    AuthCodeDateInput =
    new Date(),
): Date {
  const validCreatedAt =
    requireValidDate(
      createdAt,
      "createdAt",
    );

  const durationSeconds =
    getAuthCodeDurationSeconds(
      purpose,
    );

  return new Date(
    validCreatedAt.getTime() +
      durationSeconds *
        1_000,
  );
}

export function createAuthCodeLifetime(
  purpose: AuthCodePurpose,
  createdAt:
    AuthCodeDateInput =
    new Date(),
): AuthCodeLifetime {
  const validCreatedAt =
    requireValidDate(
      createdAt,
      "createdAt",
    );

  const durationSeconds =
    getAuthCodeDurationSeconds(
      purpose,
    );

  return {
    purpose,

    createdAt:
      validCreatedAt,

    expiresAt:
      new Date(
        validCreatedAt.getTime() +
          durationSeconds *
            1_000,
      ),

    durationSeconds,
  };
}

export function getAuthCodeRemainingSeconds(
  expiresAt: AuthCodeDateInput,
  now:
    AuthCodeDateInput =
    new Date(),
): number {
  const validExpiresAt =
    parseAuthCodeDate(
      expiresAt,
    );

  const validNow =
    parseAuthCodeDate(
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

export function isAuthCodeExpired(
  expiresAt: AuthCodeDateInput,
  now:
    AuthCodeDateInput =
    new Date(),
): boolean {
  const validExpiresAt =
    parseAuthCodeDate(
      expiresAt,
    );

  const validNow =
    parseAuthCodeDate(
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

export function getAuthCodeLifetimeState(
  expiresAt: AuthCodeDateInput,
  now:
    AuthCodeDateInput =
    new Date(),
): AuthCodeLifetimeState {
  const parsedExpiration =
    parseAuthCodeDate(
      expiresAt,
    );

  if (
    !parsedExpiration
  ) {
    return {
      expiresAt: null,

      remainingSeconds: 0,

      isExpired: true,
    };
  }

  const remainingSeconds =
    getAuthCodeRemainingSeconds(
      parsedExpiration,
      now,
    );

  return {
    expiresAt:
      parsedExpiration,

    remainingSeconds,

    isExpired:
      remainingSeconds <= 0,
  };
}

export function getAuthCodeAttemptState(
  attempts: number,
): AuthCodeAttemptState {
  const normalizedAttempts =
    normalizeCounter(
      attempts,
    );

  const remainingAttempts =
    Math.max(
      0,
      AUTH_MAXIMUM_CODE_ATTEMPTS -
        normalizedAttempts,
    );

  return {
    attempts:
      normalizedAttempts,

    maximumAttempts:
      AUTH_MAXIMUM_CODE_ATTEMPTS,

    remainingAttempts,

    hasReachedLimit:
      normalizedAttempts >=
      AUTH_MAXIMUM_CODE_ATTEMPTS,
  };
}

export function hasReachedAuthCodeAttemptLimit(
  attempts: number,
): boolean {
  return getAuthCodeAttemptState(
    attempts,
  ).hasReachedLimit;
}

export function getAuthCodeResendState(
  resendCount: number,
): AuthCodeResendState {
  const normalizedResendCount =
    normalizeCounter(
      resendCount,
    );

  const remainingResends =
    Math.max(
      0,
      AUTH_MAXIMUM_CODE_RESENDS -
        normalizedResendCount,
    );

  return {
    resendCount:
      normalizedResendCount,

    maximumResends:
      AUTH_MAXIMUM_CODE_RESENDS,

    remainingResends,

    hasReachedLimit:
      normalizedResendCount >=
      AUTH_MAXIMUM_CODE_RESENDS,
  };
}

export function hasReachedAuthCodeResendLimit(
  resendCount: number,
): boolean {
  return getAuthCodeResendState(
    resendCount,
  ).hasReachedLimit;
}

export function createAuthCodeResendAvailability(
  sentAt:
    AuthCodeDateInput =
    new Date(),
): Date {
  const validSentAt =
    requireValidDate(
      sentAt,
      "sentAt",
    );

  return new Date(
    validSentAt.getTime() +
      AUTH_CODE_RESEND_COOLDOWN_SECONDS *
        1_000,
  );
}

export function getAuthCodeResendRemainingSeconds(
  sentAt: AuthCodeDateInput,
  now:
    AuthCodeDateInput =
    new Date(),
): number {
  const validSentAt =
    parseAuthCodeDate(
      sentAt,
    );

  const validNow =
    parseAuthCodeDate(
      now,
    );

  if (
    !validSentAt ||
    !validNow
  ) {
    return 0;
  }

  const availableAt =
    createAuthCodeResendAvailability(
      validSentAt,
    );

  return Math.max(
    0,
    Math.ceil(
      (
        availableAt.getTime() -
        validNow.getTime()
      ) / 1_000,
    ),
  );
}

export function canResendAuthCode(
  sentAt: AuthCodeDateInput,
  resendCount = 0,
  now:
    AuthCodeDateInput =
    new Date(),
): boolean {
  if (
    hasReachedAuthCodeResendLimit(
      resendCount,
    )
  ) {
    return false;
  }

  return (
    getAuthCodeResendRemainingSeconds(
      sentAt,
      now,
    ) <= 0
  );
}

export function getAuthCodeCooldownState(
  sentAt: AuthCodeDateInput,
  resendCount = 0,
  now:
    AuthCodeDateInput =
    new Date(),
): AuthCodeCooldownState {
  const parsedSentAt =
    parseAuthCodeDate(
      sentAt,
    );

  if (
    !parsedSentAt
  ) {
    return {
      availableAt: null,

      remainingSeconds: 0,

      canResend: false,
    };
  }

  const availableAt =
    createAuthCodeResendAvailability(
      parsedSentAt,
    );

  const remainingSeconds =
    getAuthCodeResendRemainingSeconds(
      parsedSentAt,
      now,
    );

  return {
    availableAt,

    remainingSeconds,

    canResend:
      remainingSeconds <= 0 &&
      !hasReachedAuthCodeResendLimit(
        resendCount,
      ),
  };
}