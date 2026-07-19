import "server-only";

import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/database/prisma";

export type AuditLogRepositoryClient =
  | typeof prisma
  | Prisma.TransactionClient;

export type AuditDetailsPrimitive =
  | string
  | number
  | boolean
  | null;

export type AuditDetailsValue =
  | AuditDetailsPrimitive
  | AuditDetailsValue[]
  | {
      [key: string]:
        AuditDetailsValue;
    };

export interface CreateAuditLogRepositoryInput {
  /*
   * Usuario que realizó la acción.
   *
   * Puede ser null para eventos como:
   * - Intento de inicio de sesión fallido.
   * - Recuperación de contraseña no autenticada.
   * - Operación automática del sistema.
   */
  actorUserId?:
    | string
    | null;

  /*
   * Usuario afectado por la acción.
   *
   * Por ejemplo:
   * - Usuario bloqueado.
   * - Usuario actualizado por un administrador.
   * - Usuario que restableció su contraseña.
   */
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

  /*
   * Debe recibirse únicamente un hash de la IP.
   * La dirección IP original no debe almacenarse.
   */
  ipHash?:
    | string
    | null;

  userAgent?:
    | string
    | null;

  /*
   * Información adicional que será:
   * - Sanitizada.
   * - Redactada.
   * - Convertida a JSON.
   * - Guardada en detailsText.
   */
  details?: unknown;

  createdAt?: Date;
}

export interface CreateManyAuditLogsRepositoryInput {
  auditLogs:
    readonly CreateAuditLogRepositoryInput[];
}

export interface FindAuditLogsPageRepositoryInput {
  page?: number;
  pageSize?: number;

  actorUserId?:
    | string
    | null;

  subjectUserId?:
    | string
    | null;

  action?:
    | string
    | null;

  entityType?:
    | string
    | null;

  entityId?:
    | string
    | null;

  search?:
    | string
    | null;

  createdFrom?:
    | Date
    | null;

  createdTo?:
    | Date
    | null;

  orderDirection?:
    | "asc"
    | "desc";
}

export interface FindEntityAuditLogsRepositoryInput {
  entityType: string;
  entityId: string;

  page?: number;
  pageSize?: number;

  orderDirection?:
    | "asc"
    | "desc";
}

export interface AuditLogsPageRepositoryResult {
  auditLogs:
    AuditLogRecord[];

  pagination: {
    page: number;
    pageSize: number;

    totalItems: number;
    totalPages: number;

    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };

  filters: {
    actorUserId: string | null;
    subjectUserId: string | null;

    action: string | null;

    entityType: string | null;
    entityId: string | null;

    search: string | null;

    createdFrom: Date | null;
    createdTo: Date | null;

    orderDirection:
      | "asc"
      | "desc";
  };
}

export interface DeleteAuditLogsBeforeRepositoryInput {
  createdBefore: Date;

  action?:
    | string
    | null;

  entityType?:
    | string
    | null;
}

export interface AuditLogRecord {
  id: string;

  actorUserId:
    | string
    | null;

  subjectUserId:
    | string
    | null;

  action: string;

  entityType:
    | string
    | null;

  entityId:
    | string
    | null;

  ipHash:
    | string
    | null;

  userAgent:
    | string
    | null;

  detailsText:
    | string
    | null;

  details:
    AuditDetailsValue
    | null;

  createdAt: Date;

  actorUser:
    AuditLogUserRecord
    | null;

  subjectUser:
    AuditLogUserRecord
    | null;
}

export interface AuditLogUserRecord {
  id: string;

  displayName: string;
  email: string;

  avatarUrl:
    | string
    | null;

  role: string;
  status: string;
}

/*
 * Datos mínimos del usuario relacionados con el
 * registro de auditoría.
 *
 * No contiene:
 * - passwordHash
 * - failedLoginAttempts
 * - lockedUntil
 */
export const AUDIT_LOG_USER_SELECT = {
  id: true,

  displayName: true,
  email: true,
  avatarUrl: true,

  role: true,
  status: true,
} as const satisfies Prisma.UserSelect;

/*
 * Selector interno completo del registro.
 *
 * El modelo AuditLog utiliza detailsText.
 * No utiliza metadataJson ni detailsJson.
 */
export const AUDIT_LOG_SELECT = {
  id: true,

  actorUserId: true,
  subjectUserId: true,

  action: true,

  entityType: true,
  entityId: true,

  ipHash: true,
  userAgent: true,

  detailsText: true,

  createdAt: true,

  actorUser: {
    select:
      AUDIT_LOG_USER_SELECT,
  },

  subjectUser: {
    select:
      AUDIT_LOG_USER_SELECT,
  },
} as const satisfies Prisma.AuditLogSelect;

export type StoredAuditLogRecord =
  Prisma.AuditLogGetPayload<{
    select:
      typeof AUDIT_LOG_SELECT;
  }>;

const DEFAULT_PAGE =
  1;

const DEFAULT_PAGE_SIZE =
  20;

const MAXIMUM_PAGE_SIZE =
  100;

const MAXIMUM_ACTION_LENGTH =
  120;

const MAXIMUM_ENTITY_TYPE_LENGTH =
  80;

const MAXIMUM_ENTITY_ID_LENGTH =
  120;

const MAXIMUM_USER_AGENT_LENGTH =
  500;

const MAXIMUM_SEARCH_LENGTH =
  160;

const MAXIMUM_DETAILS_TEXT_LENGTH =
  50_000;

const MAXIMUM_DETAIL_STRING_LENGTH =
  2_000;

const MAXIMUM_DETAIL_OBJECT_KEYS =
  100;

const MAXIMUM_DETAIL_ARRAY_ITEMS =
  100;

const MAXIMUM_DETAIL_DEPTH =
  8;

const AUDIT_ACTION_PATTERN =
  /^[A-Z0-9:_-]+$/;

const AUDIT_ENTITY_TYPE_PATTERN =
  /^[A-Z0-9:_-]+$/;

const HASH_PATTERN =
  /^[a-f0-9]{64}$/i;

/*
 * Propiedades que jamás deben almacenarse dentro
 * de detailsText.
 */
const SENSITIVE_DETAIL_KEY_PATTERN =
  /(?:password|contrase(?:ñ|n)a|passphrase|secret|token|cookie|authorization|api[-_]?key|access[-_]?key|private[-_]?key|codeHash|tokenHash|passwordHash|sessionToken|verificationCode|recoveryCode|resetCode|smtpPassword)/i;

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

  return (
    normalizedValue ||
    null
  );
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

export function normalizeAuditAction(
  value: unknown,
): string | null {
  if (
    typeof value !==
      "string"
  ) {
    return null;
  }

  const normalizedAction =
    value
      .trim()
      .toUpperCase();

  if (
    normalizedAction.length ===
      0 ||
    normalizedAction.length >
      MAXIMUM_ACTION_LENGTH ||
    !AUDIT_ACTION_PATTERN.test(
      normalizedAction,
    )
  ) {
    return null;
  }

  return normalizedAction;
}

function requireAuditAction(
  value: unknown,
): string {
  const normalizedAction =
    normalizeAuditAction(
      value,
    );

  if (!normalizedAction) {
    throw new TypeError(
      "La acción del registro de auditoría no es válida.",
    );
  }

  return normalizedAction;
}

export function normalizeAuditEntityType(
  value: unknown,
): string | null {
  if (
    value === null ||
    value === undefined ||
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

  const normalizedType =
    value
      .trim()
      .toUpperCase();

  if (
    normalizedType.length ===
      0 ||
    normalizedType.length >
      MAXIMUM_ENTITY_TYPE_LENGTH ||
    !AUDIT_ENTITY_TYPE_PATTERN.test(
      normalizedType,
    )
  ) {
    return null;
  }

  return normalizedType;
}

function requireAuditEntityType(
  value: unknown,
): string {
  const normalizedType =
    normalizeAuditEntityType(
      value,
    );

  if (!normalizedType) {
    throw new TypeError(
      "El tipo de entidad del registro de auditoría no es válido.",
    );
  }

  return normalizedType;
}

export function normalizeAuditEntityId(
  value: unknown,
): string | null {
  if (
    value === null ||
    value === undefined ||
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

  const normalizedEntityId =
    value.trim();

  if (
    normalizedEntityId.length ===
      0 ||
    normalizedEntityId.length >
      MAXIMUM_ENTITY_ID_LENGTH ||
    /[\u0000-\u001F\u007F]/.test(
      normalizedEntityId,
    )
  ) {
    return null;
  }

  return normalizedEntityId;
}

function requireAuditEntityId(
  value: unknown,
): string {
  const normalizedEntityId =
    normalizeAuditEntityId(
      value,
    );

  if (!normalizedEntityId) {
    throw new TypeError(
      "El identificador de la entidad del registro de auditoría no es válido.",
    );
  }

  return normalizedEntityId;
}

export function normalizeAuditIpHash(
  value: unknown,
): string | null {
  if (
    value === null ||
    value === undefined ||
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

  return HASH_PATTERN.test(
    normalizedHash,
  )
    ? normalizedHash
    : null;
}

function requireValidAuditIpHash(
  value: unknown,
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const normalizedHash =
    normalizeAuditIpHash(
      value,
    );

  if (!normalizedHash) {
    throw new TypeError(
      "El hash de la dirección IP no es válido.",
    );
  }

  return normalizedHash;
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

  const normalizedUserAgent =
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
    normalizedUserAgent ||
    null
  );
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

function normalizeOptionalDate(
  value:
    | Date
    | null
    | undefined,
  fieldName: string,
): Date | null {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  return requireValidDate(
    value,
    fieldName,
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

function normalizeSearch(
  value:
    | string
    | null
    | undefined,
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

  return (
    normalizedSearch ||
    null
  );
}

function normalizeOptionalFilterIdentifier(
  value:
    | string
    | null
    | undefined,
  fieldName: string,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return requireIdentifier(
    value,
    fieldName,
  );
}

function normalizeOptionalActionFilter(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return requireAuditAction(
    value,
  );
}

function normalizeOptionalEntityTypeFilter(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return requireAuditEntityType(
    value,
  );
}

function normalizeOptionalEntityIdFilter(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return requireAuditEntityId(
    value,
  );
}

function sanitizeAuditDetailValue(
  value: unknown,
  {
    depth,
    visited,
  }: {
    depth: number;
    visited: WeakSet<object>;
  },
): AuditDetailsValue {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (
    typeof value ===
      "string"
  ) {
    return value.slice(
      0,
      MAXIMUM_DETAIL_STRING_LENGTH,
    );
  }

  if (
    typeof value ===
      "boolean"
  ) {
    return value;
  }

  if (
    typeof value ===
      "number"
  ) {
    return Number.isFinite(
      value,
    )
      ? value
      : null;
  }

  if (
    typeof value ===
      "bigint"
  ) {
    return String(value);
  }

  if (
    typeof value ===
      "symbol" ||
    typeof value ===
      "function"
  ) {
    return null;
  }

  if (
    value instanceof Date
  ) {
    return Number.isNaN(
      value.getTime(),
    )
      ? null
      : value.toISOString();
  }

  if (
    value instanceof URL
  ) {
    return value.toString()
      .slice(
        0,
        MAXIMUM_DETAIL_STRING_LENGTH,
      );
  }

  if (
    value instanceof Uint8Array
  ) {
    return "[BINARY_DATA_REDACTED]";
  }

  if (
    depth >=
    MAXIMUM_DETAIL_DEPTH
  ) {
    return "[MAXIMUM_DEPTH_REACHED]";
  }

  if (
    typeof value ===
      "object"
  ) {
    if (
      visited.has(
        value,
      )
    ) {
      return "[CIRCULAR_REFERENCE]";
    }

    visited.add(
      value,
    );

    if (
      Array.isArray(value)
    ) {
      const sanitizedArray =
        value
          .slice(
            0,
            MAXIMUM_DETAIL_ARRAY_ITEMS,
          )
          .map(
            (
              item,
            ) =>
              sanitizeAuditDetailValue(
                item,
                {
                  depth:
                    depth + 1,

                  visited,
                },
              ),
          );

      visited.delete(
        value,
      );

      return sanitizedArray;
    }

    const sanitizedObject:
      Record<
        string,
        AuditDetailsValue
      > = {};

    const entries =
      Object.entries(
        value,
      ).slice(
        0,
        MAXIMUM_DETAIL_OBJECT_KEYS,
      );

    for (
      const [
        rawKey,
        rawValue,
      ] of entries
    ) {
      const key =
        rawKey
          .trim()
          .slice(
            0,
            120,
          );

      if (!key) {
        continue;
      }

      if (
        SENSITIVE_DETAIL_KEY_PATTERN.test(
          key,
        )
      ) {
        sanitizedObject[
          key
        ] =
          "[REDACTED]";

        continue;
      }

      sanitizedObject[
        key
      ] =
        sanitizeAuditDetailValue(
          rawValue,
          {
            depth:
              depth + 1,

            visited,
          },
        );
    }

    visited.delete(
      value,
    );

    return sanitizedObject;
  }

  return null;
}

/**
 * Elimina información sensible y convierte los detalles
 * en una estructura compatible con JSON.
 */
export function sanitizeAuditDetails(
  details: unknown,
): AuditDetailsValue | null {
  if (
    details === undefined ||
    details === null
  ) {
    return null;
  }

  return sanitizeAuditDetailValue(
    details,
    {
      depth: 0,

      visited:
        new WeakSet<object>(),
    },
  );
}

/**
 * Convierte los detalles sanitizados al campo detailsText.
 */
export function serializeAuditDetails(
  details: unknown,
): string | null {
  const sanitizedDetails =
    sanitizeAuditDetails(
      details,
    );

  if (
    sanitizedDetails ===
    null
  ) {
    return null;
  }

  let serializedDetails:
    string;

  try {
    serializedDetails =
      JSON.stringify(
        sanitizedDetails,
      );
  } catch {
    return JSON.stringify({
      error:
        "AUDIT_DETAILS_SERIALIZATION_FAILED",
    });
  }

  if (
    serializedDetails.length <=
    MAXIMUM_DETAILS_TEXT_LENGTH
  ) {
    return serializedDetails;
  }

  return JSON.stringify({
    truncated: true,

    originalLength:
      serializedDetails.length,

    message:
      "Los detalles superaron el tamaño máximo permitido.",
  });
}

/**
 * Convierte detailsText nuevamente en un objeto.
 */
export function parseAuditDetailsText(
  detailsText:
    | string
    | null
    | undefined,
): AuditDetailsValue | null {
  if (
    typeof detailsText !==
      "string" ||
    detailsText.trim().length ===
      0
  ) {
    return null;
  }

  try {
    return JSON.parse(
      detailsText,
    ) as AuditDetailsValue;
  } catch {
    return null;
  }
}

function toAuditLogRecord(
  auditLog:
    StoredAuditLogRecord,
): AuditLogRecord {
  return {
    id:
      auditLog.id,

    actorUserId:
      auditLog.actorUserId,

    subjectUserId:
      auditLog.subjectUserId,

    action:
      auditLog.action,

    entityType:
      auditLog.entityType,

    entityId:
      auditLog.entityId,

    ipHash:
      auditLog.ipHash,

    userAgent:
      auditLog.userAgent,

    detailsText:
      auditLog.detailsText,

    details:
      parseAuditDetailsText(
        auditLog.detailsText,
      ),

    createdAt:
      auditLog.createdAt,

    actorUser:
      auditLog.actorUser,

    subjectUser:
      auditLog.subjectUser,
  };
}

function createAuditLogData(
  input:
    CreateAuditLogRepositoryInput,
): Prisma.AuditLogUncheckedCreateInput {
  const actorUserId =
    normalizeIdentifier(
      input.actorUserId,
    );

  const subjectUserId =
    normalizeIdentifier(
      input.subjectUserId,
    );

  const action =
    requireAuditAction(
      input.action,
    );

  const entityType =
    input.entityType ===
      undefined ||
    input.entityType ===
      null ||
    input.entityType ===
      ""
      ? null
      : requireAuditEntityType(
          input.entityType,
        );

  const entityId =
    input.entityId ===
      undefined ||
    input.entityId ===
      null ||
    input.entityId ===
      ""
      ? null
      : requireAuditEntityId(
          input.entityId,
        );

  const createdAt =
    input.createdAt
      ? requireValidDate(
          input.createdAt,
          "createdAt",
        )
      : new Date();

  return {
    actorUserId,
    subjectUserId,

    action,

    entityType,
    entityId,

    ipHash:
      requireValidAuditIpHash(
        input.ipHash,
      ),

    userAgent:
      normalizeUserAgent(
        input.userAgent,
      ),

    detailsText:
      serializeAuditDetails(
        input.details,
      ),

    createdAt,
  };
}

/**
 * Crea un registro de auditoría.
 *
 * Los registros de auditoría son inmutables.
 * Este repositorio no incluye operaciones de actualización.
 */
export async function createAuditLog(
  input:
    CreateAuditLogRepositoryInput,
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<AuditLogRecord> {
  const storedAuditLog =
    await client.auditLog.create({
      data:
        createAuditLogData(
          input,
        ),

      select:
        AUDIT_LOG_SELECT,
    });

  return toAuditLogRecord(
    storedAuditLog,
  );
}

/**
 * Variante que no interrumpe la operación principal cuando
 * el registro de auditoría falla.
 *
 * Los servicios podrán decidir si una acción concreta debe
 * exigir obligatoriamente el registro.
 */
export async function createAuditLogSafely(
  input:
    CreateAuditLogRepositoryInput,
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<AuditLogRecord | null> {
  try {
    return await createAuditLog(
      input,
      client,
    );
  } catch {
    return null;
  }
}

/**
 * Crea varios registros de auditoría.
 */
export async function createManyAuditLogs(
  {
    auditLogs,
  }: CreateManyAuditLogsRepositoryInput,
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<number> {
  if (
    auditLogs.length ===
    0
  ) {
    return 0;
  }

  const result =
    await client.auditLog.createMany({
      data:
        auditLogs.map(
          createAuditLogData,
        ),
    });

  return result.count;
}

/**
 * Busca un registro mediante su ID.
 */
export async function findAuditLogById(
  auditLogId: string,
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<AuditLogRecord | null> {
  const normalizedAuditLogId =
    normalizeIdentifier(
      auditLogId,
    );

  if (!normalizedAuditLogId) {
    return null;
  }

  const auditLog =
    await client.auditLog.findUnique({
      where: {
        id:
          normalizedAuditLogId,
      },

      select:
        AUDIT_LOG_SELECT,
    });

  return auditLog
    ? toAuditLogRecord(
        auditLog,
      )
    : null;
}

/**
 * Devuelve registros paginados para el panel
 * administrativo.
 */
export async function findAuditLogsPage(
  {
    page:
      requestedPage,

    pageSize:
      requestedPageSize,

    actorUserId:
      requestedActorUserId,

    subjectUserId:
      requestedSubjectUserId,

    action:
      requestedAction,

    entityType:
      requestedEntityType,

    entityId:
      requestedEntityId,

    search:
      requestedSearch,

    createdFrom:
      requestedCreatedFrom,

    createdTo:
      requestedCreatedTo,

    orderDirection:
      requestedOrderDirection =
      "desc",
  }: FindAuditLogsPageRepositoryInput = {},
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<AuditLogsPageRepositoryResult> {
  const page =
    normalizePage(
      requestedPage,
    );

  const pageSize =
    normalizePageSize(
      requestedPageSize,
    );

  const actorUserId =
    normalizeOptionalFilterIdentifier(
      requestedActorUserId,
      "actorUserId",
    );

  const subjectUserId =
    normalizeOptionalFilterIdentifier(
      requestedSubjectUserId,
      "subjectUserId",
    );

  const action =
    normalizeOptionalActionFilter(
      requestedAction,
    );

  const entityType =
    normalizeOptionalEntityTypeFilter(
      requestedEntityType,
    );

  const entityId =
    normalizeOptionalEntityIdFilter(
      requestedEntityId,
    );

  const search =
    normalizeSearch(
      requestedSearch,
    );

  const createdFrom =
    normalizeOptionalDate(
      requestedCreatedFrom,
      "createdFrom",
    );

  const createdTo =
    normalizeOptionalDate(
      requestedCreatedTo,
      "createdTo",
    );

  if (
    createdFrom &&
    createdTo &&
    createdFrom.getTime() >
      createdTo.getTime()
  ) {
    throw new RangeError(
      "La fecha inicial no puede ser posterior a la fecha final.",
    );
  }

  const orderDirection:
    "asc" | "desc" =
    requestedOrderDirection ===
      "asc"
      ? "asc"
      : "desc";

  const where:
    Prisma.AuditLogWhereInput = {
    ...(actorUserId
      ? {
          actorUserId,
        }
      : {}),

    ...(subjectUserId
      ? {
          subjectUserId,
        }
      : {}),

    ...(action
      ? {
          action,
        }
      : {}),

    ...(entityType
      ? {
          entityType,
        }
      : {}),

    ...(entityId
      ? {
          entityId,
        }
      : {}),

    ...(
      createdFrom ||
      createdTo
        ? {
            createdAt: {
              ...(createdFrom
                ? {
                    gte:
                      createdFrom,
                  }
                : {}),

              ...(createdTo
                ? {
                    lte:
                      createdTo,
                  }
                : {}),
            },
          }
        : {}
    ),

    ...(search
      ? {
          OR: [
            {
              action: {
                contains:
                  search,
              },
            },

            {
              entityType: {
                contains:
                  search,
              },
            },

            {
              entityId: {
                contains:
                  search,
              },
            },

            {
              actorUser: {
                is: {
                  OR: [
                    {
                      displayName: {
                        contains:
                          search,
                      },
                    },

                    {
                      email: {
                        contains:
                          search.toLowerCase(),
                      },
                    },
                  ],
                },
              },
            },

            {
              subjectUser: {
                is: {
                  OR: [
                    {
                      displayName: {
                        contains:
                          search,
                      },
                    },

                    {
                      email: {
                        contains:
                          search.toLowerCase(),
                      },
                    },
                  ],
                },
              },
            },
          ],
        }
      : {}),
  };

  const [
    totalItems,
    storedAuditLogs,
  ] = await Promise.all([
    client.auditLog.count({
      where,
    }),

    client.auditLog.findMany({
      where,

      select:
        AUDIT_LOG_SELECT,

      orderBy: [
        {
          createdAt:
            orderDirection,
        },

        {
          id:
            orderDirection,
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
    auditLogs:
      storedAuditLogs.map(
        toAuditLogRecord,
      ),

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

    filters: {
      actorUserId,
      subjectUserId,

      action,

      entityType,
      entityId,

      search,

      createdFrom,
      createdTo,

      orderDirection,
    },
  };
}

/**
 * Obtiene registros de una entidad concreta.
 */
export async function findEntityAuditLogs(
  {
    entityType,
    entityId,

    page,
    pageSize,

    orderDirection =
      "desc",
  }: FindEntityAuditLogsRepositoryInput,
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<AuditLogsPageRepositoryResult> {
  return findAuditLogsPage(
    {
      entityType:
        requireAuditEntityType(
          entityType,
        ),

      entityId:
        requireAuditEntityId(
          entityId,
        ),

      page,
      pageSize,

      orderDirection,
    },
    client,
  );
}

/**
 * Obtiene acciones realizadas por un usuario.
 */
export async function findAuditLogsByActorUserId(
  actorUserId: string,
  {
    page,
    pageSize,

    orderDirection =
      "desc",
  }: Pick<
    FindAuditLogsPageRepositoryInput,
    | "page"
    | "pageSize"
    | "orderDirection"
  > = {},
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<AuditLogsPageRepositoryResult> {
  return findAuditLogsPage(
    {
      actorUserId:
        requireIdentifier(
          actorUserId,
          "actorUserId",
        ),

      page,
      pageSize,

      orderDirection,
    },
    client,
  );
}

/**
 * Obtiene acciones que afectaron a un usuario.
 */
export async function findAuditLogsBySubjectUserId(
  subjectUserId: string,
  {
    page,
    pageSize,

    orderDirection =
      "desc",
  }: Pick<
    FindAuditLogsPageRepositoryInput,
    | "page"
    | "pageSize"
    | "orderDirection"
  > = {},
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<AuditLogsPageRepositoryResult> {
  return findAuditLogsPage(
    {
      subjectUserId:
        requireIdentifier(
          subjectUserId,
          "subjectUserId",
        ),

      page,
      pageSize,

      orderDirection,
    },
    client,
  );
}

/**
 * Cuenta registros usando los mismos filtros principales.
 */
export async function countAuditLogs(
  {
    actorUserId,
    subjectUserId,

    action,

    entityType,
    entityId,

    createdFrom,
    createdTo,
  }: Omit<
    FindAuditLogsPageRepositoryInput,
    | "page"
    | "pageSize"
    | "search"
    | "orderDirection"
  > = {},
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<number> {
  const normalizedActorUserId =
    normalizeOptionalFilterIdentifier(
      actorUserId,
      "actorUserId",
    );

  const normalizedSubjectUserId =
    normalizeOptionalFilterIdentifier(
      subjectUserId,
      "subjectUserId",
    );

  const normalizedAction =
    normalizeOptionalActionFilter(
      action,
    );

  const normalizedEntityType =
    normalizeOptionalEntityTypeFilter(
      entityType,
    );

  const normalizedEntityId =
    normalizeOptionalEntityIdFilter(
      entityId,
    );

  const normalizedCreatedFrom =
    normalizeOptionalDate(
      createdFrom,
      "createdFrom",
    );

  const normalizedCreatedTo =
    normalizeOptionalDate(
      createdTo,
      "createdTo",
    );

  if (
    normalizedCreatedFrom &&
    normalizedCreatedTo &&
    normalizedCreatedFrom.getTime() >
      normalizedCreatedTo.getTime()
  ) {
    throw new RangeError(
      "La fecha inicial no puede ser posterior a la fecha final.",
    );
  }

  return client.auditLog.count({
    where: {
      ...(normalizedActorUserId
        ? {
            actorUserId:
              normalizedActorUserId,
          }
        : {}),

      ...(normalizedSubjectUserId
        ? {
            subjectUserId:
              normalizedSubjectUserId,
          }
        : {}),

      ...(normalizedAction
        ? {
            action:
              normalizedAction,
          }
        : {}),

      ...(normalizedEntityType
        ? {
            entityType:
              normalizedEntityType,
          }
        : {}),

      ...(normalizedEntityId
        ? {
            entityId:
              normalizedEntityId,
          }
        : {}),

      ...(
        normalizedCreatedFrom ||
        normalizedCreatedTo
          ? {
              createdAt: {
                ...(normalizedCreatedFrom
                  ? {
                      gte:
                        normalizedCreatedFrom,
                    }
                  : {}),

                ...(normalizedCreatedTo
                  ? {
                      lte:
                        normalizedCreatedTo,
                    }
                  : {}),
              },
            }
          : {}
      ),
    },
  });
}

/**
 * Elimina registros antiguos según una política explícita
 * de conservación.
 *
 * Esta función debe utilizarse únicamente desde procesos
 * administrativos o tareas de mantenimiento.
 */
export async function deleteAuditLogsBefore(
  {
    createdBefore,

    action:
      requestedAction,

    entityType:
      requestedEntityType,
  }: DeleteAuditLogsBeforeRepositoryInput,
  client:
    AuditLogRepositoryClient =
    prisma,
): Promise<number> {
  const validCreatedBefore =
    requireValidDate(
      createdBefore,
      "createdBefore",
    );

  const action =
    normalizeOptionalActionFilter(
      requestedAction,
    );

  const entityType =
    normalizeOptionalEntityTypeFilter(
      requestedEntityType,
    );

  const result =
    await client.auditLog.deleteMany({
      where: {
        createdAt: {
          lt:
            validCreatedBefore,
        },

        ...(action
          ? {
              action,
            }
          : {}),

        ...(entityType
          ? {
              entityType,
            }
          : {}),
      },
    });

  return result.count;
}

/**
 * Alias semánticos utilizados por los servicios.
 */
export const recordAuditLog =
  createAuditLog;

export const recordAuditLogSafely =
  createAuditLogSafely;

export const getAuditLogById =
  findAuditLogById;

export const getAuditLogsPage =
  findAuditLogsPage;

export const getEntityAuditLogs =
  findEntityAuditLogs;

export const removeOldAuditLogs =
  deleteAuditLogsBefore;