import "server-only";

import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  isAuthCodePurpose,
  type AuthCodePurpose,
} from "@/constants/auth/auth.constants";

import {
  prisma,
} from "@/lib/database/prisma";

export type AuthCodeRepositoryClient =
  | typeof prisma
  | Prisma.TransactionClient;

export interface CreateAuthCodeRepositoryInput {
  userId: string;

  purpose:
    AuthCodePurpose;

  /*
   * Debe recibirse únicamente el hash HMAC-SHA256.
   * El código numérico original se envía por correo
   * y nunca se almacena en SQL Server.
   */
  codeHash: string;

  expiresAt: Date;

  lastSentAt?: Date;

  attemptCount?: number;
  resendCount?: number;
}

export interface FindAuthCodeRepositoryInput {
  userId: string;

  purpose:
    AuthCodePurpose;
}

export interface FindAuthCodeByEmailRepositoryInput {
  email: string;

  purpose:
    AuthCodePurpose;
}

export interface ReplaceAuthCodeForResendRepositoryInput {
  authCodeId: string;

  codeHash: string;

  expiresAt: Date;

  sentAt?: Date;
}

export interface InvalidateAuthCodesRepositoryInput {
  userId: string;

  purpose?:
    AuthCodePurpose;

  consumedAt?: Date;

  exceptAuthCodeId?: string;
}

export interface DeleteConsumedAuthCodesRepositoryInput {
  consumedBefore: Date;
}

export interface DeleteExpiredAuthCodesRepositoryInput {
  now?: Date;
}

export interface CleanupAuthCodesRepositoryInput {
  now?: Date;

  consumedBefore?: Date;
}

export interface CleanupAuthCodesRepositoryResult {
  expiredCodesDeleted: number;
  consumedCodesDeleted: number;

  totalDeleted: number;
}

/*
 * Selector interno del código.
 *
 * No debe devolverse directamente al navegador porque
 * contiene codeHash.
 */
export const AUTH_CODE_INTERNAL_SELECT = {
  id: true,

  userId: true,

  purpose: true,

  codeHash: true,

  attemptCount: true,
  resendCount: true,

  lastSentAt: true,

  expiresAt: true,
  consumedAt: true,

  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.AuthCodeSelect;

/*
 * Datos del usuario necesarios para los servicios de
 * verificación y recuperación.
 *
 * No contiene passwordHash.
 */
export const AUTH_CODE_USER_SELECT = {
  id: true,

  firstName: true,
  lastName: true,
  displayName: true,

  email: true,

  role: true,
  status: true,

  preferredLanguage: true,
  preferredTheme: true,

  emailVerifiedAt: true,
  lockedUntil: true,

  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;

export const AUTH_CODE_WITH_USER_SELECT = {
  ...AUTH_CODE_INTERNAL_SELECT,

  user: {
    select:
      AUTH_CODE_USER_SELECT,
  },
} as const satisfies Prisma.AuthCodeSelect;

export type InternalAuthCodeRecord =
  Prisma.AuthCodeGetPayload<{
    select:
      typeof AUTH_CODE_INTERNAL_SELECT;
  }>;

export type AuthCodeWithUserRecord =
  Prisma.AuthCodeGetPayload<{
    select:
      typeof AUTH_CODE_WITH_USER_SELECT;
  }>;

const AUTH_CODE_HASH_PATTERN =
  /^[a-f0-9]{64}$/i;

function normalizeIdentifier(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  const normalizedValue =
    value.trim();

  return normalizedValue ||
    null;
}

function requireIdentifier(
  value: unknown,
  fieldName: string,
): string {
  const normalizedValue =
    normalizeIdentifier(
      value,
    );

  if (!normalizedValue) {
    throw new TypeError(
      `El campo "${fieldName}" es obligatorio.`,
    );
  }

  return normalizedValue;
}

export function normalizeAuthCodeHash(
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

  if (
    !AUTH_CODE_HASH_PATTERN.test(
      normalizedHash,
    )
  ) {
    return null;
  }

  return normalizedHash;
}

function requireAuthCodeHash(
  value: unknown,
): string {
  const normalizedHash =
    normalizeAuthCodeHash(
      value,
    );

  if (!normalizedHash) {
    throw new TypeError(
      "El hash del código de autenticación no es válido.",
    );
  }

  return normalizedHash;
}

function requirePurpose(
  value: unknown,
): AuthCodePurpose {
  if (
    !isAuthCodePurpose(
      value,
    )
  ) {
    throw new TypeError(
      "El propósito del código de autenticación no es válido.",
    );
  }

  return value;
}

function requireValidDate(
  value: unknown,
  fieldName: string,
): Date {
  if (
    !(value instanceof Date) ||
    Number.isNaN(
      value.getTime(),
    )
  ) {
    throw new TypeError(
      `La fecha "${fieldName}" no es válida.`,
    );
  }

  return new Date(
    value.getTime(),
  );
}

function normalizeCounter(
  value:
    number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(value),
  );
}

function normalizeEmail(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  const normalizedEmail =
    value
      .trim()
      .toLowerCase();

  return normalizedEmail ||
    null;
}

/**
 * Crea un nuevo código de autenticación.
 *
 * El código numérico original no se recibe ni se guarda.
 */
export async function createAuthCode(
  input:
    CreateAuthCodeRepositoryInput,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<InternalAuthCodeRecord> {
  const userId =
    requireIdentifier(
      input.userId,
      "userId",
    );

  const purpose =
    requirePurpose(
      input.purpose,
    );

  const codeHash =
    requireAuthCodeHash(
      input.codeHash,
    );

  const expiresAt =
    requireValidDate(
      input.expiresAt,
      "expiresAt",
    );

  const lastSentAt =
    input.lastSentAt
      ? requireValidDate(
          input.lastSentAt,
          "lastSentAt",
        )
      : new Date();

  return client.authCode.create({
    data: {
      userId,

      purpose,

      codeHash,

      attemptCount:
        normalizeCounter(
          input.attemptCount,
        ),

      resendCount:
        normalizeCounter(
          input.resendCount,
        ),

      lastSentAt,

      expiresAt,

      consumedAt:
        null,
    },

    select:
      AUTH_CODE_INTERNAL_SELECT,
  });
}

/**
 * Obtiene un código mediante su ID.
 *
 * Puede devolver códigos vencidos o consumidos.
 */
export async function findAuthCodeById(
  authCodeId: string,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<InternalAuthCodeRecord | null> {
  const normalizedAuthCodeId =
    normalizeIdentifier(
      authCodeId,
    );

  if (!normalizedAuthCodeId) {
    return null;
  }

  return client.authCode.findUnique({
    where: {
      id:
        normalizedAuthCodeId,
    },

    select:
      AUTH_CODE_INTERNAL_SELECT,
  });
}

/**
 * Obtiene un código junto con su usuario.
 *
 * Puede devolver códigos vencidos o consumidos.
 */
export async function findAuthCodeWithUserById(
  authCodeId: string,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<AuthCodeWithUserRecord | null> {
  const normalizedAuthCodeId =
    normalizeIdentifier(
      authCodeId,
    );

  if (!normalizedAuthCodeId) {
    return null;
  }

  return client.authCode.findUnique({
    where: {
      id:
        normalizedAuthCodeId,
    },

    select:
      AUTH_CODE_WITH_USER_SELECT,
  });
}

/**
 * Obtiene el código más reciente del usuario y propósito.
 *
 * Puede estar vencido o consumido.
 */
export async function findLatestAuthCodeByUserAndPurpose(
  {
    userId,
    purpose,
  }: FindAuthCodeRepositoryInput,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<InternalAuthCodeRecord | null> {
  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (
    !normalizedUserId ||
    !isAuthCodePurpose(
      purpose,
    )
  ) {
    return null;
  }

  return client.authCode.findFirst({
    where: {
      userId:
        normalizedUserId,

      purpose,
    },

    orderBy: [
      {
        createdAt:
          "desc",
      },

      {
        id:
          "desc",
      },
    ],

    select:
      AUTH_CODE_INTERNAL_SELECT,
  });
}

/**
 * Obtiene únicamente el código vigente y no consumido
 * más reciente del usuario.
 */
export async function findLatestActiveAuthCodeByUserAndPurpose(
  {
    userId,
    purpose,
  }: FindAuthCodeRepositoryInput,
  now:
    Date = new Date(),
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<InternalAuthCodeRecord | null> {
  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (
    !normalizedUserId ||
    !isAuthCodePurpose(
      purpose,
    )
  ) {
    return null;
  }

  const validNow =
    requireValidDate(
      now,
      "now",
    );

  return client.authCode.findFirst({
    where: {
      userId:
        normalizedUserId,

      purpose,

      consumedAt:
        null,

      expiresAt: {
        gt:
          validNow,
      },
    },

    orderBy: [
      {
        createdAt:
          "desc",
      },

      {
        id:
          "desc",
      },
    ],

    select:
      AUTH_CODE_INTERNAL_SELECT,
  });
}

/**
 * Busca el último código mediante el correo del usuario.
 *
 * Esta operación resulta útil en las rutas públicas de:
 * - Verificación de correo.
 * - Recuperación de contraseña.
 */
export async function findLatestAuthCodeWithUserByEmailAndPurpose(
  {
    email,
    purpose,
  }: FindAuthCodeByEmailRepositoryInput,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<AuthCodeWithUserRecord | null> {
  const normalizedEmail =
    normalizeEmail(
      email,
    );

  if (
    !normalizedEmail ||
    !isAuthCodePurpose(
      purpose,
    )
  ) {
    return null;
  }

  return client.authCode.findFirst({
    where: {
      purpose,

      user: {
        email:
          normalizedEmail,
      },
    },

    orderBy: [
      {
        createdAt:
          "desc",
      },

      {
        id:
          "desc",
      },
    ],

    select:
      AUTH_CODE_WITH_USER_SELECT,
  });
}

/**
 * Busca únicamente un código vigente y no consumido
 * mediante el correo del usuario.
 */
export async function findLatestActiveAuthCodeWithUserByEmailAndPurpose(
  {
    email,
    purpose,
  }: FindAuthCodeByEmailRepositoryInput,
  now:
    Date = new Date(),
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<AuthCodeWithUserRecord | null> {
  const normalizedEmail =
    normalizeEmail(
      email,
    );

  if (
    !normalizedEmail ||
    !isAuthCodePurpose(
      purpose,
    )
  ) {
    return null;
  }

  const validNow =
    requireValidDate(
      now,
      "now",
    );

  return client.authCode.findFirst({
    where: {
      purpose,

      consumedAt:
        null,

      expiresAt: {
        gt:
          validNow,
      },

      user: {
        email:
          normalizedEmail,
      },
    },

    orderBy: [
      {
        createdAt:
          "desc",
      },

      {
        id:
          "desc",
      },
    ],

    select:
      AUTH_CODE_WITH_USER_SELECT,
  });
}

/**
 * Incrementa de forma atómica los intentos fallidos.
 *
 * Solamente modifica códigos que todavía no fueron
 * consumidos.
 */
export async function incrementAuthCodeAttemptCount(
  authCodeId: string,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<InternalAuthCodeRecord | null> {
  const normalizedAuthCodeId =
    normalizeIdentifier(
      authCodeId,
    );

  if (!normalizedAuthCodeId) {
    return null;
  }

  const result =
    await client.authCode.updateMany({
      where: {
        id:
          normalizedAuthCodeId,

        consumedAt:
          null,
      },

      data: {
        attemptCount: {
          increment: 1,
        },
      },
    });

  if (
    result.count ===
    0
  ) {
    return null;
  }

  return findAuthCodeById(
    normalizedAuthCodeId,
    client,
  );
}

/**
 * Sustituye el hash y el vencimiento cuando se reenvía
 * un código nuevo.
 *
 * También:
 * - Reinicia attemptCount.
 * - Incrementa resendCount.
 * - Actualiza lastSentAt.
 */
export async function replaceAuthCodeForResend(
  {
    authCodeId,
    codeHash,
    expiresAt,
    sentAt =
      new Date(),
  }: ReplaceAuthCodeForResendRepositoryInput,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<InternalAuthCodeRecord | null> {
  const normalizedAuthCodeId =
    normalizeIdentifier(
      authCodeId,
    );

  if (!normalizedAuthCodeId) {
    return null;
  }

  const normalizedCodeHash =
    requireAuthCodeHash(
      codeHash,
    );

  const validExpiresAt =
    requireValidDate(
      expiresAt,
      "expiresAt",
    );

  const validSentAt =
    requireValidDate(
      sentAt,
      "sentAt",
    );

  const result =
    await client.authCode.updateMany({
      where: {
        id:
          normalizedAuthCodeId,

        consumedAt:
          null,
      },

      data: {
        codeHash:
          normalizedCodeHash,

        attemptCount:
          0,

        resendCount: {
          increment: 1,
        },

        lastSentAt:
          validSentAt,

        expiresAt:
          validExpiresAt,
      },
    });

  if (
    result.count ===
    0
  ) {
    return null;
  }

  return findAuthCodeById(
    normalizedAuthCodeId,
    client,
  );
}

/**
 * Marca el código como utilizado.
 *
 * Un código consumido ya no debe permitir:
 * - Verificación de correo adicional.
 * - Restablecimiento de contraseña adicional.
 */
export async function consumeAuthCode(
  authCodeId: string,
  consumedAt:
    Date = new Date(),
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<InternalAuthCodeRecord | null> {
  const normalizedAuthCodeId =
    normalizeIdentifier(
      authCodeId,
    );

  if (!normalizedAuthCodeId) {
    return null;
  }

  const validConsumedAt =
    requireValidDate(
      consumedAt,
      "consumedAt",
    );

  const result =
    await client.authCode.updateMany({
      where: {
        id:
          normalizedAuthCodeId,

        consumedAt:
          null,
      },

      data: {
        consumedAt:
          validConsumedAt,
      },
    });

  if (
    result.count ===
    0
  ) {
    return null;
  }

  return findAuthCodeById(
    normalizedAuthCodeId,
    client,
  );
}

/**
 * Consume todos los códigos activos del usuario.
 *
 * Puede limitarse a un propósito y conservar un código
 * concreto mediante exceptAuthCodeId.
 */
export async function invalidateAuthCodes(
  {
    userId,

    purpose,

    consumedAt =
      new Date(),

    exceptAuthCodeId,
  }: InvalidateAuthCodesRepositoryInput,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<number> {
  const normalizedUserId =
    requireIdentifier(
      userId,
      "userId",
    );

  const validConsumedAt =
    requireValidDate(
      consumedAt,
      "consumedAt",
    );

  const normalizedExceptionId =
    exceptAuthCodeId
      ? requireIdentifier(
          exceptAuthCodeId,
          "exceptAuthCodeId",
        )
      : null;

  const result =
    await client.authCode.updateMany({
      where: {
        userId:
          normalizedUserId,

        consumedAt:
          null,

        ...(purpose
          ? {
              purpose:
                requirePurpose(
                  purpose,
                ),
            }
          : {}),

        ...(normalizedExceptionId
          ? {
              id: {
                not:
                  normalizedExceptionId,
              },
            }
          : {}),
      },

      data: {
        consumedAt:
          validConsumedAt,
      },
    });

  return result.count;
}

/**
 * Invalida códigos anteriores y crea uno nuevo dentro
 * de la misma transacción.
 */
export async function replaceUserAuthCode(
  input:
    CreateAuthCodeRepositoryInput,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<InternalAuthCodeRecord> {
  const executeReplacement =
    async (
      transaction:
        AuthCodeRepositoryClient,
    ) => {
      await invalidateAuthCodes(
        {
          userId:
            input.userId,

          purpose:
            input.purpose,
        },
        transaction,
      );

      return createAuthCode(
        input,
        transaction,
      );
    };

  /*
   * Cuando ya se recibió un cliente transaccional,
   * se reutiliza directamente.
   */
  if (
    "$transaction" in client
  ) {
    return client.$transaction(
      async (
        transaction,
      ) =>
        executeReplacement(
          transaction,
        ),
    );
  }

  return executeReplacement(
    client,
  );
}

/**
 * Cuenta códigos creados recientemente.
 *
 * Puede utilizarse para aplicar límites por ventana
 * temporal en los reenvíos.
 */
export async function countRecentAuthCodes(
  {
    userId,
    purpose,
  }: FindAuthCodeRepositoryInput,
  createdAfter: Date,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<number> {
  const normalizedUserId =
    requireIdentifier(
      userId,
      "userId",
    );

  const validPurpose =
    requirePurpose(
      purpose,
    );

  const validCreatedAfter =
    requireValidDate(
      createdAfter,
      "createdAfter",
    );

  return client.authCode.count({
    where: {
      userId:
        normalizedUserId,

      purpose:
        validPurpose,

      createdAt: {
        gte:
          validCreatedAfter,
      },
    },
  });
}

/**
 * Elimina códigos vencidos.
 *
 * Esta operación está destinada a mantenimiento.
 */
export async function deleteExpiredAuthCodes(
  now:
    Date = new Date(),
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<number> {
  const validNow =
    requireValidDate(
      now,
      "now",
    );

  const result =
    await client.authCode.deleteMany({
      where: {
        expiresAt: {
          lte:
            validNow,
        },
      },
    });

  return result.count;
}

/**
 * Elimina códigos consumidos antes de una fecha.
 */
export async function deleteConsumedAuthCodes(
  consumedBefore: Date,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<number> {
  const validConsumedBefore =
    requireValidDate(
      consumedBefore,
      "consumedBefore",
    );

    
  const result =
    await client.authCode.deleteMany({
      where: {
        consumedAt: {
          not:
            null,

          lte:
            validConsumedBefore,
        },
      },
    });

  return result.count;
}

/**
 * Limpia códigos vencidos y códigos consumidos antiguos.
 */
export async function cleanupAuthCodes(
  {
    now =
      new Date(),

    consumedBefore =
      now,
  }: CleanupAuthCodesRepositoryInput = {},
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<CleanupAuthCodesRepositoryResult> {
  const validNow =
    requireValidDate(
      now,
      "now",
    );

  const validConsumedBefore =
    requireValidDate(
      consumedBefore,
      "consumedBefore",
    );

  /*
   * Primero se eliminan los vencidos. Después se eliminan
   * los consumidos restantes para no contar dos veces el
   * mismo registro.
   */
  const expiredCodesDeleted =
    await deleteExpiredAuthCodes(
      validNow,
      client,
    );

  const consumedCodesDeleted =
    await deleteConsumedAuthCodes(
      validConsumedBefore,
      client,
    );

  return {
    expiredCodesDeleted,
    consumedCodesDeleted,

    totalDeleted:
      expiredCodesDeleted +
      consumedCodesDeleted,
  };
}

/**
 * Elimina físicamente un código mediante su ID.
 *
 * Normalmente debe preferirse consumeAuthCode().
 */
export async function deleteAuthCodeById(
  authCodeId: string,
  client:
    AuthCodeRepositoryClient =
    prisma,
): Promise<boolean> {
  const normalizedAuthCodeId =
    normalizeIdentifier(
      authCodeId,
    );

  if (!normalizedAuthCodeId) {
    return false;
  }

  const result =
    await client.authCode.deleteMany({
      where: {
        id:
          normalizedAuthCodeId,
      },
    });

  return result.count > 0;
}

/**
 * Alias utilizados por los servicios de autenticación.
 */
export const findLatestVerificationCodeByUserAndPurpose =
  findLatestActiveAuthCodeByUserAndPurpose;

export const findLatestVerificationCodeByEmailAndPurpose =
  findLatestActiveAuthCodeWithUserByEmailAndPurpose;

export const incrementAuthCodeAttempts =
  incrementAuthCodeAttemptCount;

export const resendAuthCode =
  replaceAuthCodeForResend;

export const markAuthCodeAsConsumed =
  consumeAuthCode;

export const invalidateUserAuthCodes =
  invalidateAuthCodes;