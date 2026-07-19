import "server-only";

import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/database/prisma";

export type SessionRepositoryClient =
  | typeof prisma
  | Prisma.TransactionClient;

export interface CreateSessionRepositoryInput {
  userId: string;

  /*
   * Debe recibirse únicamente el hash SHA-256 del token.
   * El token original permanece en la cookie del navegador.
   */
  tokenHash: string;

  ipHash?:
    | string
    | null;

  userAgent?:
    | string
    | null;

  deviceName?:
    | string
    | null;

  rememberMe?: boolean;

  expiresAt: Date;

  lastSeenAt?: Date;
}

export interface UpdateSessionMetadataRepositoryInput {
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

export interface RefreshSessionRepositoryInput {
  expiresAt?: Date;

  lastSeenAt?: Date;

  metadata?:
    UpdateSessionMetadataRepositoryInput;
}

export interface FindUserSessionsRepositoryInput {
  userId: string;

  includeExpired?: boolean;
  includeRevoked?: boolean;

  page?: number;
  pageSize?: number;

  now?: Date;
}

export interface UserSessionsPageRepositoryResult {
  sessions:
    PublicSessionRecord[];

  pagination: {
    page: number;
    pageSize: number;

    totalItems: number;
    totalPages: number;

    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface RevokeUserSessionsRepositoryInput {
  userId: string;

  revokedAt?: Date;

  /*
   * Permite conservar la sesión actual al cerrar
   * todas las demás sesiones del usuario.
   */
  exceptTokenHash?: string;
}

export interface CleanupSessionsRepositoryInput {
  now?: Date;

  /*
   * Las sesiones revocadas antes de esta fecha
   * también serán eliminadas.
   */
  revokedBefore?: Date;
}

export interface CleanupSessionsRepositoryResult {
  expiredSessionsDeleted: number;
  revokedSessionsDeleted: number;

  totalDeleted: number;
}

/*
 * Selector interno.
 *
 * Contiene tokenHash e ipHash y solamente debe utilizarse
 * dentro del servidor.
 */
export const SESSION_INTERNAL_SELECT = {
  id: true,

  userId: true,

  tokenHash: true,
  ipHash: true,

  userAgent: true,
  deviceName: true,

  rememberMe: true,

  expiresAt: true,
  lastSeenAt: true,
  revokedAt: true,

  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.SessionSelect;

/*
 * Selector público.
 *
 * No contiene:
 * - tokenHash
 * - ipHash
 */
export const SESSION_PUBLIC_SELECT = {
  id: true,

  userId: true,

  userAgent: true,
  deviceName: true,

  rememberMe: true,

  expiresAt: true,
  lastSeenAt: true,
  revokedAt: true,

  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.SessionSelect;

/*
 * Datos del usuario necesarios para validar una sesión.
 *
 * No incluye passwordHash.
 */
export const SESSION_USER_SELECT = {
  id: true,

  firstName: true,
  lastName: true,
  displayName: true,

  email: true,
  avatarUrl: true,

  role: true,
  status: true,

  preferredLanguage: true,
  preferredTheme: true,

  emailVerifiedAt: true,
  lockedUntil: true,

  lastLoginAt: true,
  passwordChangedAt: true,

  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;

export const SESSION_WITH_USER_SELECT = {
  ...SESSION_INTERNAL_SELECT,

  user: {
    select:
      SESSION_USER_SELECT,
  },
} as const satisfies Prisma.SessionSelect;

export type InternalSessionRecord =
  Prisma.SessionGetPayload<{
    select:
      typeof SESSION_INTERNAL_SELECT;
  }>;

export type PublicSessionRecord =
  Prisma.SessionGetPayload<{
    select:
      typeof SESSION_PUBLIC_SELECT;
  }>;

export type SessionWithUserRecord =
  Prisma.SessionGetPayload<{
    select:
      typeof SESSION_WITH_USER_SELECT;
  }>;

const TOKEN_HASH_PATTERN =
  /^[a-f0-9]{64}$/i;

const OPTIONAL_HASH_PATTERN =
  /^[a-f0-9]{64}$/i;

const DEFAULT_PAGE =
  1;

const DEFAULT_PAGE_SIZE =
  20;

const MAXIMUM_PAGE_SIZE =
  100;

const MAXIMUM_USER_AGENT_LENGTH =
  500;

const MAXIMUM_DEVICE_NAME_LENGTH =
  160;

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

export function normalizeSessionTokenHash(
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
    !TOKEN_HASH_PATTERN.test(
      normalizedHash,
    )
  ) {
    return null;
  }

  return normalizedHash;
}

function normalizeOptionalHash(
  value: unknown,
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

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

  return OPTIONAL_HASH_PATTERN.test(
    normalizedHash,
  )
    ? normalizedHash
    : null;
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

function normalizePage(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return DEFAULT_PAGE;
  }

  return Math.max(
    1,
    Math.floor(value),
  );
}

function normalizePageSize(
  value: number | undefined,
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(
    MAXIMUM_PAGE_SIZE,
    Math.max(
      1,
      Math.floor(value),
    ),
  );
}

function requireUserId(
  userId: string,
): string {
  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (!normalizedUserId) {
    throw new TypeError(
      "El identificador del usuario es obligatorio.",
    );
  }

  return normalizedUserId;
}

function requireTokenHash(
  tokenHash: string,
): string {
  const normalizedTokenHash =
    normalizeSessionTokenHash(
      tokenHash,
    );

  if (!normalizedTokenHash) {
    throw new TypeError(
      "El hash del token de sesión no es válido.",
    );
  }

  return normalizedTokenHash;
}

function createSessionMetadataData(
  input:
    UpdateSessionMetadataRepositoryInput,
): Prisma.SessionUpdateInput {
  const data:
    Prisma.SessionUpdateInput = {};

  if (
    input.ipHash !==
    undefined
  ) {
    data.ipHash =
      normalizeOptionalHash(
        input.ipHash,
      );
  }

  if (
    input.userAgent !==
    undefined
  ) {
    data.userAgent =
      normalizeOptionalText(
        input.userAgent,
        MAXIMUM_USER_AGENT_LENGTH,
      );
  }

  if (
    input.deviceName !==
    undefined
  ) {
    data.deviceName =
      normalizeOptionalText(
        input.deviceName,
        MAXIMUM_DEVICE_NAME_LENGTH,
      );
  }

  return data;
}

/**
 * Crea una sesión almacenando únicamente el hash
 * del token opaco.
 */
export async function createSession(
  input:
    CreateSessionRepositoryInput,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<InternalSessionRecord> {
  const userId =
    requireUserId(
      input.userId,
    );

  const tokenHash =
    requireTokenHash(
      input.tokenHash,
    );

  const expiresAt =
    requireValidDate(
      input.expiresAt,
      "expiresAt",
    );

  const lastSeenAt =
    input.lastSeenAt
      ? requireValidDate(
          input.lastSeenAt,
          "lastSeenAt",
        )
      : new Date();

  return client.session.create({
    data: {
      userId,

      tokenHash,

      ipHash:
        normalizeOptionalHash(
          input.ipHash,
        ),

      userAgent:
        normalizeOptionalText(
          input.userAgent,
          MAXIMUM_USER_AGENT_LENGTH,
        ),

      deviceName:
        normalizeOptionalText(
          input.deviceName,
          MAXIMUM_DEVICE_NAME_LENGTH,
        ),

      rememberMe:
        input.rememberMe ??
        false,

      expiresAt,
      lastSeenAt,
    },

    select:
      SESSION_INTERNAL_SELECT,
  });
}

/**
 * Busca una sesión mediante su identificador.
 */
export async function findSessionById(
  sessionId: string,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<InternalSessionRecord | null> {
  const normalizedSessionId =
    normalizeIdentifier(
      sessionId,
    );

  if (!normalizedSessionId) {
    return null;
  }

  return client.session.findUnique({
    where: {
      id:
        normalizedSessionId,
    },

    select:
      SESSION_INTERNAL_SELECT,
  });
}

/**
 * Busca una sesión mediante el hash del token.
 *
 * Puede devolver sesiones vencidas o revocadas.
 */
export async function findSessionByTokenHash(
  tokenHash: string,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<InternalSessionRecord | null> {
  const normalizedTokenHash =
    normalizeSessionTokenHash(
      tokenHash,
    );

  if (!normalizedTokenHash) {
    return null;
  }

  return client.session.findUnique({
    where: {
      tokenHash:
        normalizedTokenHash,
    },

    select:
      SESSION_INTERNAL_SELECT,
  });
}

/**
 * Busca una sesión y su usuario mediante el hash.
 *
 * Puede devolver sesiones vencidas o revocadas.
 */
export async function findSessionWithUserByTokenHash(
  tokenHash: string,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<SessionWithUserRecord | null> {
  const normalizedTokenHash =
    normalizeSessionTokenHash(
      tokenHash,
    );

  if (!normalizedTokenHash) {
    return null;
  }

  return client.session.findUnique({
    where: {
      tokenHash:
        normalizedTokenHash,
    },

    select:
      SESSION_WITH_USER_SELECT,
  });
}

/**
 * Busca únicamente sesiones no revocadas y no vencidas.
 */
export async function findActiveSessionByTokenHash(
  tokenHash: string,
  now:
    Date = new Date(),
  client:
    SessionRepositoryClient =
    prisma,
): Promise<InternalSessionRecord | null> {
  const normalizedTokenHash =
    normalizeSessionTokenHash(
      tokenHash,
    );

  if (!normalizedTokenHash) {
    return null;
  }

  const validNow =
    requireValidDate(
      now,
      "now",
    );

  return client.session.findFirst({
    where: {
      tokenHash:
        normalizedTokenHash,

      revokedAt:
        null,

      expiresAt: {
        gt:
          validNow,
      },
    },

    select:
      SESSION_INTERNAL_SELECT,
  });
}

/**
 * Busca una sesión activa junto con los datos necesarios
 * del usuario.
 */
export async function findActiveSessionWithUserByTokenHash(
  tokenHash: string,
  now:
    Date = new Date(),
  client:
    SessionRepositoryClient =
    prisma,
): Promise<SessionWithUserRecord | null> {
  const normalizedTokenHash =
    normalizeSessionTokenHash(
      tokenHash,
    );

  if (!normalizedTokenHash) {
    return null;
  }

  const validNow =
    requireValidDate(
      now,
      "now",
    );

  return client.session.findFirst({
    where: {
      tokenHash:
        normalizedTokenHash,

      revokedAt:
        null,

      expiresAt: {
        gt:
          validNow,
      },
    },

    select:
      SESSION_WITH_USER_SELECT,
  });
}

export async function sessionTokenHashExists(
  tokenHash: string,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<boolean> {
  const normalizedTokenHash =
    normalizeSessionTokenHash(
      tokenHash,
    );

  if (!normalizedTokenHash) {
    return false;
  }

  const session =
    await client.session.findUnique({
      where: {
        tokenHash:
          normalizedTokenHash,
      },

      select: {
        id: true,
      },
    });

  return session !== null;
}

/**
 * Actualiza la fecha de actividad de una sesión activa.
 */
export async function touchSession(
  sessionId: string,
  lastSeenAt:
    Date = new Date(),
  client:
    SessionRepositoryClient =
    prisma,
): Promise<InternalSessionRecord | null> {
  const normalizedSessionId =
    normalizeIdentifier(
      sessionId,
    );

  if (!normalizedSessionId) {
    return null;
  }

  const validLastSeenAt =
    requireValidDate(
      lastSeenAt,
      "lastSeenAt",
    );

  const updated =
    await client.session.updateMany({
      where: {
        id:
          normalizedSessionId,

        revokedAt:
          null,

        expiresAt: {
          gt:
            validLastSeenAt,
        },
      },

      data: {
        lastSeenAt:
          validLastSeenAt,
      },
    });

  if (
    updated.count ===
    0
  ) {
    return null;
  }

  return findSessionById(
    normalizedSessionId,
    client,
  );
}

/**
 * Renueva el vencimiento, actividad y metadatos de una
 * sesión que todavía permanece activa.
 */
export async function refreshSession(
  sessionId: string,
  {
    expiresAt,

    lastSeenAt =
      new Date(),

    metadata,
  }: RefreshSessionRepositoryInput,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<InternalSessionRecord | null> {
  const normalizedSessionId =
    normalizeIdentifier(
      sessionId,
    );

  if (!normalizedSessionId) {
    return null;
  }

  const validLastSeenAt =
    requireValidDate(
      lastSeenAt,
      "lastSeenAt",
    );

  const data:
    Prisma.SessionUpdateManyMutationInput = {
      lastSeenAt:
        validLastSeenAt,
    };

  if (
    expiresAt !==
    undefined
  ) {
    data.expiresAt =
      requireValidDate(
        expiresAt,
        "expiresAt",
      );
  }

  if (metadata) {
    const metadataData =
      createSessionMetadataData(
        metadata,
      );

    if (
      metadataData.ipHash !==
      undefined
    ) {
      data.ipHash =
        metadataData.ipHash;
    }

    if (
      metadataData.userAgent !==
      undefined
    ) {
      data.userAgent =
        metadataData.userAgent;
    }

    if (
      metadataData.deviceName !==
      undefined
    ) {
      data.deviceName =
        metadataData.deviceName;
    }
  }

  const updated =
    await client.session.updateMany({
      where: {
        id:
          normalizedSessionId,

        revokedAt:
          null,

        expiresAt: {
          gt:
            validLastSeenAt,
        },
      },

      data,
    });

  if (
    updated.count ===
    0
  ) {
    return null;
  }

  return findSessionById(
    normalizedSessionId,
    client,
  );
}

/**
 * Actualiza solamente los metadatos técnicos.
 */
export async function updateSessionMetadata(
  sessionId: string,
  input:
    UpdateSessionMetadataRepositoryInput,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<InternalSessionRecord | null> {
  const normalizedSessionId =
    normalizeIdentifier(
      sessionId,
    );

  if (!normalizedSessionId) {
    return null;
  }

  const updated =
    await client.session.updateMany({
      where: {
        id:
          normalizedSessionId,
      },

      data:
        createSessionMetadataData(
          input,
        ),
    });

  if (
    updated.count ===
    0
  ) {
    return null;
  }

  return findSessionById(
    normalizedSessionId,
    client,
  );
}

/**
 * Revoca una sesión mediante su ID.
 *
 * Devuelve true cuando la sesión fue revocada.
 */
export async function revokeSessionById(
  sessionId: string,
  revokedAt:
    Date = new Date(),
  client:
    SessionRepositoryClient =
    prisma,
): Promise<boolean> {
  const normalizedSessionId =
    normalizeIdentifier(
      sessionId,
    );

  if (!normalizedSessionId) {
    return false;
  }

  const validRevokedAt =
    requireValidDate(
      revokedAt,
      "revokedAt",
    );

  const result =
    await client.session.updateMany({
      where: {
        id:
          normalizedSessionId,

        revokedAt:
          null,
      },

      data: {
        revokedAt:
          validRevokedAt,
      },
    });

  return result.count > 0;
}

/**
 * Revoca una sesión utilizando el hash del token.
 */
export async function revokeSessionByTokenHash(
  tokenHash: string,
  revokedAt:
    Date = new Date(),
  client:
    SessionRepositoryClient =
    prisma,
): Promise<boolean> {
  const normalizedTokenHash =
    normalizeSessionTokenHash(
      tokenHash,
    );

  if (!normalizedTokenHash) {
    return false;
  }

  const validRevokedAt =
    requireValidDate(
      revokedAt,
      "revokedAt",
    );

  const result =
    await client.session.updateMany({
      where: {
        tokenHash:
          normalizedTokenHash,

        revokedAt:
          null,
      },

      data: {
        revokedAt:
          validRevokedAt,
      },
    });

  return result.count > 0;
}

/**
 * Revoca todas las sesiones activas de un usuario.
 *
 * Puede conservar una sesión concreta mediante
 * exceptTokenHash.
 */
export async function revokeUserSessions(
  {
    userId,

    revokedAt =
      new Date(),

    exceptTokenHash,
  }: RevokeUserSessionsRepositoryInput,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<number> {
  const normalizedUserId =
    requireUserId(
      userId,
    );

  const validRevokedAt =
    requireValidDate(
      revokedAt,
      "revokedAt",
    );

  const normalizedExceptionHash =
    exceptTokenHash
      ? requireTokenHash(
          exceptTokenHash,
        )
      : null;

  const result =
    await client.session.updateMany({
      where: {
        userId:
          normalizedUserId,

        revokedAt:
          null,

        ...(normalizedExceptionHash
          ? {
              tokenHash: {
                not:
                  normalizedExceptionHash,
              },
            }
          : {}),
      },

      data: {
        revokedAt:
          validRevokedAt,
      },
    });

  return result.count;
}

/**
 * Alias para cerrar todas las sesiones excepto la actual.
 */
export async function revokeOtherUserSessions(
  userId: string,
  currentTokenHash: string,
  revokedAt:
    Date = new Date(),
  client:
    SessionRepositoryClient =
    prisma,
): Promise<number> {
  return revokeUserSessions(
    {
      userId,

      exceptTokenHash:
        currentTokenHash,

      revokedAt,
    },
    client,
  );
}

/**
 * Lista las sesiones del usuario sin exponer hashes.
 */
export async function findUserSessions(
  {
    userId,

    includeExpired = false,
    includeRevoked = false,

    page:
      requestedPage,

    pageSize:
      requestedPageSize,

    now =
      new Date(),
  }: FindUserSessionsRepositoryInput,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<UserSessionsPageRepositoryResult> {
  const normalizedUserId =
    requireUserId(
      userId,
    );

  const validNow =
    requireValidDate(
      now,
      "now",
    );

  const page =
    normalizePage(
      requestedPage,
    );

  const pageSize =
    normalizePageSize(
      requestedPageSize,
    );

  const where:
    Prisma.SessionWhereInput = {
      userId:
        normalizedUserId,

      ...(!includeRevoked
        ? {
            revokedAt:
              null,
          }
        : {}),

      ...(!includeExpired
        ? {
            expiresAt: {
              gt:
                validNow,
            },
          }
        : {}),
    };

  const [
    totalItems,
    sessions,
  ] = await Promise.all([
    client.session.count({
      where,
    }),

    client.session.findMany({
      where,

      select:
        SESSION_PUBLIC_SELECT,

      orderBy: [
        {
          lastSeenAt:
            "desc",
        },

        {
          createdAt:
            "desc",
        },
      ],

      skip:
        (
          page -
          1
        ) *
        pageSize,

      take:
        pageSize,
    }),
  ]);

  const totalPages =
    totalItems === 0
      ? 0
      : Math.ceil(
          totalItems /
            pageSize,
        );

  return {
    sessions,

    pagination: {
      page,
      pageSize,

      totalItems,
      totalPages,

      hasPreviousPage:
        page > 1,

      hasNextPage:
        page <
        totalPages,
    },
  };
}

export async function countActiveUserSessions(
  userId: string,
  now:
    Date = new Date(),
  client:
    SessionRepositoryClient =
    prisma,
): Promise<number> {
  const normalizedUserId =
    requireUserId(
      userId,
    );

  const validNow =
    requireValidDate(
      now,
      "now",
    );

  return client.session.count({
    where: {
      userId:
        normalizedUserId,

      revokedAt:
        null,

      expiresAt: {
        gt:
          validNow,
      },
    },
  });
}

/**
 * Elimina sesiones vencidas.
 */
export async function deleteExpiredSessions(
  now:
    Date = new Date(),
  client:
    SessionRepositoryClient =
    prisma,
): Promise<number> {
  const validNow =
    requireValidDate(
      now,
      "now",
    );

  const result =
    await client.session.deleteMany({
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
 * Elimina sesiones revocadas antes de la fecha indicada.
 */
export async function deleteRevokedSessions(
  revokedBefore:
    Date = new Date(),
  client:
    SessionRepositoryClient =
    prisma,
): Promise<number> {
  const validRevokedBefore =
    requireValidDate(
      revokedBefore,
      "revokedBefore",
    );

  const result =
    await client.session.deleteMany({
      where: {
        revokedAt: {
          not:
            null,

          lte:
            validRevokedBefore,
        },
      },
    });

  return result.count;
}

/**
 * Limpia sesiones vencidas y sesiones revocadas antiguas.
 */
export async function cleanupSessions(
  {
    now =
      new Date(),

    revokedBefore =
      now,
  }: CleanupSessionsRepositoryInput = {},
  client:
    SessionRepositoryClient =
    prisma,
): Promise<CleanupSessionsRepositoryResult> {
  const validNow =
    requireValidDate(
      now,
      "now",
    );

  const validRevokedBefore =
    requireValidDate(
      revokedBefore,
      "revokedBefore",
    );

  /*
   * Primero se eliminan las vencidas. Después, las
   * revocadas restantes para evitar contar dos veces
   * una misma sesión.
   */
  const expiredSessionsDeleted =
    await deleteExpiredSessions(
      validNow,
      client,
    );

  const revokedSessionsDeleted =
    await deleteRevokedSessions(
      validRevokedBefore,
      client,
    );

  return {
    expiredSessionsDeleted,
    revokedSessionsDeleted,

    totalDeleted:
      expiredSessionsDeleted +
      revokedSessionsDeleted,
  };
}

/**
 * Elimina físicamente una sesión concreta.
 *
 * Normalmente debe preferirse la revocación. Esta función
 * se reserva para limpieza o mantenimiento.
 */
export async function deleteSessionById(
  sessionId: string,
  client:
    SessionRepositoryClient =
    prisma,
): Promise<boolean> {
  const normalizedSessionId =
    normalizeIdentifier(
      sessionId,
    );

  if (!normalizedSessionId) {
    return false;
  }

  const result =
    await client.session.deleteMany({
      where: {
        id:
          normalizedSessionId,
      },
    });

  return result.count > 0;
}

/**
 * Alias semánticos utilizados por los servicios.
 */
export const findAuthenticatedSessionByTokenHash =
  findActiveSessionWithUserByTokenHash;

export const findValidSessionByTokenHash =
  findActiveSessionByTokenHash;

export const revokeAllUserSessions =
  revokeUserSessions;

export const updateSessionActivity =
  touchSession;