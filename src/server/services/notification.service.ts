import "server-only";

import {
  AUTH_LANGUAGES,
  type AuthLanguage,
} from "@/constants/auth/auth.constants";

import {
  prisma,
} from "@/lib/database/prisma";

import {
  createAuditLogSafely,
} from "@/server/repositories/audit-log.repository";

import {
  countUnreadUserNotifications,
  findNotificationByIdForUser,
  findUserNotificationsPage,
  markAllUserNotificationsAsRead,
  markNotificationAsRead,
  normalizeNotificationType,
  type NotificationRecord,
} from "@/server/repositories/notification.repository";

import {
  getAuthenticatedSessionByToken,
  type AuthRequestMetadata,
  type AuthServiceUser,
} from "@/server/services/auth.service";

export type NotificationServiceErrorCode =
  | "NOTIFICATION_INPUT_INVALID"
  | "NOTIFICATION_LIST_FAILED"
  | "NOTIFICATION_READ_FAILED"
  | "NOTIFICATIONS_READ_ALL_FAILED";

export type NotificationLanguage =
  AuthLanguage;

export type NotificationRequestMetadata =
  AuthRequestMetadata;

export interface NotificationListInput {
  page?: unknown;
  pageSize?: unknown;

  unreadOnly?: unknown;

  type?: unknown;

  language?: unknown;
}

export interface NotificationListCommand
  extends NotificationListInput {
  sessionToken?: unknown;
  token?: unknown;

  query?:
    | NotificationListInput
    | URLSearchParams;

  filters?:
    | NotificationListInput
    | URLSearchParams;

  metadata?:
    NotificationRequestMetadata;
}

export interface MarkNotificationAsReadCommand {
  sessionToken?: unknown;
  token?: unknown;

  notificationId?: unknown;
  id?: unknown;

  metadata?:
    NotificationRequestMetadata;
}

export interface MarkAllNotificationsAsReadCommand {
  sessionToken?: unknown;
  token?: unknown;

  metadata?:
    NotificationRequestMetadata;
}

export interface LocalizedNotification {
  id: string;

  userId:
    | string
    | null;

  type: string;

  title: string;
  message: string;

  titleEs: string;
  titleEn: string;

  messageEs: string;
  messageEn: string;

  actionUrl:
    | string
    | null;

  isRead: boolean;

  readAt:
    | Date
    | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationsBySessionResult {
  notifications:
    LocalizedNotification[];

  unreadCount: number;

  language:
    NotificationLanguage;

  pagination: {
    page: number;
    pageSize: number;

    totalItems: number;
    totalPages: number;

    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };

  filters: {
    unreadOnly: boolean;

    type:
      | string
      | null;

    language:
      NotificationLanguage;
  };
}

export interface NotificationMarkedResult {
  status:
    "marked";

  notification:
    LocalizedNotification;

  unreadCount: number;

  marked:
    true;

  updated: boolean;

  alreadyRead: boolean;

  language:
    NotificationLanguage;
}

export interface NotificationNotFoundResult {
  status:
    "not-found";

  notification:
    null;

  unreadCount: number;

  marked:
    false;

  updated:
    false;

  alreadyRead:
    false;

  language:
    NotificationLanguage;
}

export type MarkNotificationAsReadResult =
  | NotificationMarkedResult
  | NotificationNotFoundResult;

export interface AllNotificationsMarkedResult {
  updatedCount: number;
  markedCount: number;

  unreadCount: number;

  updated: boolean;

  noChanges: boolean;
}

export class NotificationServiceError extends Error {
  readonly code:
    NotificationServiceErrorCode;

  readonly httpStatus:
    number;

  constructor(
    code:
      NotificationServiceErrorCode,
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
      "NotificationServiceError";

    this.code =
      code;

    this.httpStatus =
      options?.httpStatus ??
      (
        code ===
        "NOTIFICATION_INPUT_INVALID"
          ? 400
          : 500
      );
  }
}

interface ResolvedNotificationSession {
  user:
    AuthServiceUser;

  language:
    NotificationLanguage;
}

interface ResolvedNotificationListArguments {
  sessionToken: unknown;

  input:
    NotificationListInput
    | URLSearchParams;

  metadata:
    NotificationRequestMetadata;
}

interface ResolvedMarkNotificationArguments {
  sessionToken: unknown;

  notificationId: unknown;

  metadata:
    NotificationRequestMetadata;
}

interface ResolvedMarkAllArguments {
  sessionToken: unknown;

  metadata:
    NotificationRequestMetadata;
}

const DEFAULT_PAGE =
  1;

const DEFAULT_PAGE_SIZE =
  20;

const MAXIMUM_PAGE_SIZE =
  100;

const MAXIMUM_NOTIFICATION_ID_LENGTH =
  120;

const HASH_PATTERN =
  /^[a-f0-9]{64}$/i;

const MAXIMUM_USER_AGENT_LENGTH =
  500;

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

function readInputValue(
  input:
    NotificationListInput
    | URLSearchParams,
  key:
    keyof NotificationListInput,
): unknown {
  if (
    isUrlSearchParams(
      input,
    )
  ) {
    return input.get(
      key,
    );
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

function normalizeBoolean(
  value: unknown,
  defaultValue:
    boolean = false,
): boolean {
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
    return value === 1;
  }

  if (
    typeof value !==
      "string"
  ) {
    return defaultValue;
  }

  const normalizedValue =
    value
      .trim()
      .toLowerCase();

  if (
    [
      "true",
      "1",
      "yes",
      "si",
      "sí",
    ].includes(
      normalizedValue,
    )
  ) {
    return true;
  }

  if (
    [
      "false",
      "0",
      "no",
    ].includes(
      normalizedValue,
    )
  ) {
    return false;
  }

  return defaultValue;
}

function normalizeLanguage(
  requestedLanguage: unknown,
  userLanguage: unknown,
): NotificationLanguage {
  if (
    requestedLanguage ===
      AUTH_LANGUAGES.ENGLISH
  ) {
    return AUTH_LANGUAGES.ENGLISH;
  }

  if (
    requestedLanguage ===
      AUTH_LANGUAGES.SPANISH
  ) {
    return AUTH_LANGUAGES.SPANISH;
  }

  return userLanguage ===
    AUTH_LANGUAGES.ENGLISH
    ? AUTH_LANGUAGES.ENGLISH
    : AUTH_LANGUAGES.SPANISH;
}

function normalizeNotificationId(
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

  if (
    normalizedValue.length ===
      0 ||
    normalizedValue.length >
      MAXIMUM_NOTIFICATION_ID_LENGTH ||
    /[\u0000-\u001F\u007F]/.test(
      normalizedValue,
    )
  ) {
    return null;
  }

  return normalizedValue;
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
    NotificationRequestMetadata,
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

  return normalizedValue ||
    null;
}

function localizeNotification(
  notification:
    NotificationRecord,
  language:
    NotificationLanguage,
): LocalizedNotification {
  const useEnglish =
    language ===
    AUTH_LANGUAGES.ENGLISH;

  return {
    id:
      notification.id,

    userId:
      notification.userId,

    type:
      notification.type,

    title:
      useEnglish
        ? notification.titleEn
        : notification.titleEs,

    message:
      useEnglish
        ? notification.messageEn
        : notification.messageEs,

    titleEs:
      notification.titleEs,

    titleEn:
      notification.titleEn,

    messageEs:
      notification.messageEs,

    messageEn:
      notification.messageEn,

    actionUrl:
      notification.actionUrl,

    isRead:
      notification.isRead,

    readAt:
      notification.readAt,

    createdAt:
      notification.createdAt,

    updatedAt:
      notification.updatedAt,
  };
}

function resolveNotificationListArguments(
  sessionTokenOrCommand:
    unknown,
  input:
    NotificationListInput
    | URLSearchParams = {},
  metadata:
    NotificationRequestMetadata = {},
): ResolvedNotificationListArguments {
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
      sessionTokenOrCommand as NotificationListCommand;

    const commandInput =
      command.query ??
      command.filters ??
      command;

    return {
      sessionToken:
        command.sessionToken ??
        command.token,

      input:
        commandInput,

      metadata:
        command.metadata ??
        metadata,
    };
  }

  return {
    sessionToken:
      sessionTokenOrCommand,

    input,

    metadata,
  };
}

function resolveMarkNotificationArguments(
  sessionTokenOrCommand:
    unknown,
  notificationId?: unknown,
  metadata:
    NotificationRequestMetadata = {},
): ResolvedMarkNotificationArguments {
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
      sessionTokenOrCommand as MarkNotificationAsReadCommand;

    return {
      sessionToken:
        command.sessionToken ??
        command.token,

      notificationId:
        command.notificationId ??
        command.id ??
        notificationId,

      metadata:
        command.metadata ??
        metadata,
    };
  }

  return {
    sessionToken:
      sessionTokenOrCommand,

    notificationId,

    metadata,
  };
}

function resolveMarkAllArguments(
  sessionTokenOrCommand:
    unknown,
  metadata:
    NotificationRequestMetadata = {},
): ResolvedMarkAllArguments {
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
      sessionTokenOrCommand as MarkAllNotificationsAsReadCommand;

    return {
      sessionToken:
        command.sessionToken ??
        command.token,

      metadata:
        command.metadata ??
        metadata,
    };
  }

  return {
    sessionToken:
      sessionTokenOrCommand,

    metadata,
  };
}

async function resolveNotificationSession(
  sessionToken: unknown,
  requestedLanguage?: unknown,
): Promise<
  ResolvedNotificationSession
  | null
> {
  const sessionResult =
    await getAuthenticatedSessionByToken(
      sessionToken,
    );

  if (
    sessionResult.status !==
    "authenticated"
  ) {
    return null;
  }

  return {
    user:
      sessionResult.user,

    language:
      normalizeLanguage(
        requestedLanguage,
        sessionResult.user
          .preferredLanguage,
      ),
  };
}

async function recordNotificationAudit(
  {
    userId,
    action,

    entityType =
      "NOTIFICATION",

    entityId,

    metadata,

    details,
  }: {
    userId: string;

    action: string;

    entityType?:
      string;

    entityId?:
      | string
      | null;

    metadata:
      NotificationRequestMetadata;

    details?: unknown;
  },
): Promise<void> {
  await createAuditLogSafely({
    actorUserId:
      userId,

    subjectUserId:
      userId,

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
      normalizeUserAgent(
        metadata.userAgent,
      ),

    details,
  });
}

/**
 * Obtiene las notificaciones pertenecientes al usuario
 * autenticado.
 *
 * Devuelve null cuando:
 * - La cookie no contiene una sesión válida.
 * - La sesión expiró.
 * - La cuenta ya no está disponible.
 *
 * Este contrato coincide con la ruta:
 *
 * src/app/api/notificaciones/route.ts
 */
export async function getNotificationsBySessionToken(
  sessionTokenOrCommand:
    unknown,
  input:
    NotificationListInput
    | URLSearchParams = {},
  metadata:
    NotificationRequestMetadata = {},
): Promise<
  NotificationsBySessionResult
  | null
> {
  const resolvedArguments =
    resolveNotificationListArguments(
      sessionTokenOrCommand,
      input,
      metadata,
    );

  const requestedLanguage =
    readInputValue(
      resolvedArguments.input,
      "language",
    );

  const sessionContext =
    await resolveNotificationSession(
      resolvedArguments.sessionToken,
      requestedLanguage,
    );

  if (!sessionContext) {
    return null;
  }

  const page =
    normalizePositiveInteger(
      readInputValue(
        resolvedArguments.input,
        "page",
      ),
      DEFAULT_PAGE,
    );

  const pageSize =
    normalizePositiveInteger(
      readInputValue(
        resolvedArguments.input,
        "pageSize",
      ),
      DEFAULT_PAGE_SIZE,
      MAXIMUM_PAGE_SIZE,
    );

  const unreadOnly =
    normalizeBoolean(
      readInputValue(
        resolvedArguments.input,
        "unreadOnly",
      ),
      false,
    );

  const requestedType =
    readInputValue(
      resolvedArguments.input,
      "type",
    );

  const type =
    requestedType
      ? normalizeNotificationType(
          requestedType,
        )
      : null;

  try {
    const result =
      await findUserNotificationsPage({
        userId:
          sessionContext.user.id,

        page,
        pageSize,

        unreadOnly,

        type,
      });

    return {
      notifications:
        result.notifications.map(
          (
            notification,
          ) =>
            localizeNotification(
              notification,
              sessionContext.language,
            ),
        ),

      unreadCount:
        result.unreadCount,

      language:
        sessionContext.language,

      pagination:
        result.pagination,

      filters: {
        unreadOnly:
          result.filters.unreadOnly,

        type:
          result.filters.type,

        language:
          sessionContext.language,
      },
    };
  } catch (error) {
    throw new NotificationServiceError(
      "NOTIFICATION_LIST_FAILED",
      "No fue posible obtener las notificaciones.",
      {
        cause:
          error,
      },
    );
  }
}

/**
 * Marca una notificación concreta como leída.
 *
 * Solamente se modifica cuando pertenece al usuario
 * asociado con la sesión.
 *
 * Estados utilizados por la ruta dinámica:
 *
 * marked
 * not-found
 */
export async function markNotificationAsReadBySessionToken(
  sessionTokenOrCommand:
    unknown,
  notificationId?: unknown,
  metadata:
    NotificationRequestMetadata = {},
): Promise<
  MarkNotificationAsReadResult
  | null
> {
  const resolvedArguments =
    resolveMarkNotificationArguments(
      sessionTokenOrCommand,
      notificationId,
      metadata,
    );

  const normalizedNotificationId =
    normalizeNotificationId(
      resolvedArguments.notificationId,
    );

  if (
    !normalizedNotificationId
  ) {
    throw new NotificationServiceError(
      "NOTIFICATION_INPUT_INVALID",
      "El identificador de la notificación no es válido.",
      {
        httpStatus:
          400,
      },
    );
  }

  const sessionContext =
    await resolveNotificationSession(
      resolvedArguments.sessionToken,
    );

  if (!sessionContext) {
    return null;
  }

  try {
    const transactionResult =
      await prisma.$transaction(
        async (
          transaction,
        ) => {
          const existingNotification =
            await findNotificationByIdForUser(
              normalizedNotificationId,
              sessionContext.user.id,
              transaction,
            );

          if (
            !existingNotification
          ) {
            const unreadCount =
              await countUnreadUserNotifications(
                sessionContext.user.id,
                transaction,
              );

            return {
              notification:
                null,

              unreadCount,

              alreadyRead:
                false,

              updated:
                false,
            };
          }

          const alreadyRead =
            existingNotification.isRead;

          const updatedNotification =
            await markNotificationAsRead(
              normalizedNotificationId,
              sessionContext.user.id,
              new Date(),
              transaction,
            );

          if (
            !updatedNotification
          ) {
            const unreadCount =
              await countUnreadUserNotifications(
                sessionContext.user.id,
                transaction,
              );

            return {
              notification:
                null,

              unreadCount,

              alreadyRead:
                false,

              updated:
                false,
            };
          }

          const unreadCount =
            await countUnreadUserNotifications(
              sessionContext.user.id,
              transaction,
            );

          return {
            notification:
              updatedNotification,

            unreadCount,

            alreadyRead,

            updated:
              !alreadyRead,
          };
        },
      );

    if (
      !transactionResult
        .notification
    ) {
      return {
        status:
          "not-found",

        notification:
          null,

        unreadCount:
          transactionResult
            .unreadCount,

        marked:
          false,

        updated:
          false,

        alreadyRead:
          false,

        language:
          sessionContext.language,
      };
    }

    if (
      transactionResult.updated
    ) {
      await recordNotificationAudit({
        userId:
          sessionContext.user.id,

        action:
          "NOTIFICATION_MARKED_AS_READ",

        entityId:
          transactionResult
            .notification.id,

        metadata:
          resolvedArguments.metadata,

        details: {
          notificationType:
            transactionResult
              .notification.type,
        },
      });
    }

    return {
      status:
        "marked",

      notification:
        localizeNotification(
          transactionResult
            .notification,
          sessionContext.language,
        ),

      unreadCount:
        transactionResult
          .unreadCount,

      marked:
        true,

      updated:
        transactionResult.updated,

      alreadyRead:
        transactionResult.alreadyRead,

      language:
        sessionContext.language,
    };
  } catch (error) {
    if (
      error instanceof
      NotificationServiceError
    ) {
      throw error;
    }

    throw new NotificationServiceError(
      "NOTIFICATION_READ_FAILED",
      "No fue posible marcar la notificación como leída.",
      {
        cause:
          error,
      },
    );
  }
}

/**
 * Marca todas las notificaciones pendientes como leídas.
 *
 * Devuelve null cuando la sesión no es válida.
 *
 * Este contrato coincide con:
 *
 * src/app/api/notificaciones/leer-todas/route.ts
 */
export async function markAllNotificationsAsReadBySessionToken(
  sessionTokenOrCommand:
    unknown,
  metadata:
    NotificationRequestMetadata = {},
): Promise<
  AllNotificationsMarkedResult
  | null
> {
  const resolvedArguments =
    resolveMarkAllArguments(
      sessionTokenOrCommand,
      metadata,
    );

  const sessionContext =
    await resolveNotificationSession(
      resolvedArguments.sessionToken,
    );

  if (!sessionContext) {
    return null;
  }

  try {
    const result =
      await prisma.$transaction(
        async (
          transaction,
        ) => {
          const updatedCount =
            await markAllUserNotificationsAsRead(
              sessionContext.user.id,
              new Date(),
              transaction,
            );

          const unreadCount =
            await countUnreadUserNotifications(
              sessionContext.user.id,
              transaction,
            );

          return {
            updatedCount,
            unreadCount,
          };
        },
      );

    if (
      result.updatedCount >
      0
    ) {
      await recordNotificationAudit({
        userId:
          sessionContext.user.id,

        action:
          "ALL_NOTIFICATIONS_MARKED_AS_READ",

        entityType:
          "USER",

        entityId:
          sessionContext.user.id,

        metadata:
          resolvedArguments.metadata,

        details: {
          updatedCount:
            result.updatedCount,
        },
      });
    }

    return {
      updatedCount:
        result.updatedCount,

      markedCount:
        result.updatedCount,

      unreadCount:
        result.unreadCount,

      updated:
        result.updatedCount >
        0,

      noChanges:
        result.updatedCount ===
        0,
    };
  } catch (error) {
    throw new NotificationServiceError(
      "NOTIFICATIONS_READ_ALL_FAILED",
      "No fue posible marcar todas las notificaciones como leídas.",
      {
        cause:
          error,
      },
    );
  }
}

export function isNotificationServiceError(
  error: unknown,
): error is NotificationServiceError {
  return (
    error instanceof
    NotificationServiceError
  );
}

/**
 * Alias compatibles con otros componentes y servicios.
 */
export const getUserNotificationsByToken =
  getNotificationsBySessionToken;

export const getNotificationsForSession =
  getNotificationsBySessionToken;

export const getCurrentUserNotifications =
  getNotificationsBySessionToken;

export const markUserNotificationAsReadByToken =
  markNotificationAsReadBySessionToken;

export const markNotificationReadByToken =
  markNotificationAsReadBySessionToken;

export const readNotificationBySessionToken =
  markNotificationAsReadBySessionToken;

export const markAllUserNotificationsAsReadByToken =
  markAllNotificationsAsReadBySessionToken;

export const markAllNotificationsReadByToken =
  markAllNotificationsAsReadBySessionToken;

export const readAllNotificationsBySessionToken =
  markAllNotificationsAsReadBySessionToken;