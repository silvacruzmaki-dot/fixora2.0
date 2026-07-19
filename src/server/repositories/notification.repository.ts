import "server-only";

import type {
  Prisma,
} from "@/generated/prisma/client";

import {
  prisma,
} from "@/lib/database/prisma";

export type NotificationRepositoryClient =
  | typeof prisma
  | Prisma.TransactionClient;

export interface CreateNotificationRepositoryInput {
  userId: string;

  type: string;

  titleEs: string;
  titleEn: string;

  messageEs: string;
  messageEn: string;

  /*
   * Solamente se permiten rutas internas de FIXORA.
   *
   * Ejemplos:
   * /perfil
   * /proyectos/123
   * /notificaciones?tipo=SECURITY
   */
  actionUrl?:
    | string
    | null;
}

export interface CreateManyNotificationsRepositoryInput {
  notifications:
    readonly CreateNotificationRepositoryInput[];
}

export interface FindUserNotificationsPageRepositoryInput {
  userId: string;

  page?: number;
  pageSize?: number;

  unreadOnly?: boolean;

  type?:
    | string
    | null;
}

export interface UserNotificationsPageRepositoryResult {
  notifications:
    NotificationRecord[];

  unreadCount: number;

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
    type: string | null;
  };
}

export interface DeleteReadNotificationsRepositoryInput {
  readBefore: Date;

  userId?: string;
}

export interface NotificationRecord {
  id: string;
  userId: string | null;

  type: string;

  titleEs: string;
  titleEn: string;

  messageEs: string;
  messageEn: string;

  actionUrl: string | null;

  isRead: boolean;
  readAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

/*
 * Selector público.
 *
 * El modelo no necesita un campo isRead en SQL Server,
 * porque se calcula mediante:
 *
 * readAt !== null
 */
export const NOTIFICATION_PUBLIC_SELECT = {
  id: true,
  userId: true,

  type: true,

  titleEs: true,
  titleEn: true,

  messageEs: true,
  messageEn: true,

  actionUrl: true,

  readAt: true,

  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.NotificationSelect;

export type StoredNotificationRecord =
  Prisma.NotificationGetPayload<{
    select:
      typeof NOTIFICATION_PUBLIC_SELECT;
  }>;

const DEFAULT_PAGE =
  1;

const DEFAULT_PAGE_SIZE =
  20;

const MAXIMUM_PAGE_SIZE =
  100;

const MAXIMUM_TYPE_LENGTH =
  60;

const MAXIMUM_TITLE_LENGTH =
  180;

const MAXIMUM_MESSAGE_LENGTH =
  2_000;

const MAXIMUM_ACTION_URL_LENGTH =
  500;

const NOTIFICATION_TYPE_PATTERN =
  /^[A-Z0-9:_-]+$/;

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

export function normalizeNotificationType(
  value: unknown,
): string | null {
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
      MAXIMUM_TYPE_LENGTH ||
    !NOTIFICATION_TYPE_PATTERN.test(
      normalizedType,
    )
  ) {
    return null;
  }

  return normalizedType;
}

function requireNotificationType(
  value: unknown,
): string {
  const normalizedType =
    normalizeNotificationType(
      value,
    );

  if (!normalizedType) {
    throw new TypeError(
      "El tipo de notificación no es válido.",
    );
  }

  return normalizedType;
}

function normalizeNotificationText(
  value: unknown,
  fieldName: string,
  maximumLength: number,
): string {
  if (
    typeof value !==
    "string"
  ) {
    throw new TypeError(
      `El campo "${fieldName}" es obligatorio.`,
    );
  }

  const normalizedValue =
    value
      .replace(
        /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
        "",
      )
      .trim()
      .replace(
        /[ \t]+/g,
        " ",
      );

  if (
    normalizedValue.length ===
    0
  ) {
    throw new TypeError(
      `El campo "${fieldName}" es obligatorio.`,
    );
  }

  if (
    normalizedValue.length >
    maximumLength
  ) {
    throw new RangeError(
      `El campo "${fieldName}" no puede superar ${maximumLength} caracteres.`,
    );
  }

  return normalizedValue;
}

/**
 * Las notificaciones solamente pueden dirigir a rutas
 * internas de la aplicación.
 *
 * Se rechazan:
 *
 * https://sitio-externo.com
 * //sitio-externo.com
 * javascript:alert(1)
 */
export function normalizeNotificationActionUrl(
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

  const normalizedUrl =
    value.trim();

  if (
    normalizedUrl.length ===
      0 ||
    normalizedUrl.length >
      MAXIMUM_ACTION_URL_LENGTH ||
    !normalizedUrl.startsWith(
      "/",
    ) ||
    normalizedUrl.startsWith(
      "//",
    ) ||
    normalizedUrl.includes(
      "\\",
    ) ||
    /[\u0000-\u001F\u007F]/.test(
      normalizedUrl,
    )
  ) {
    return null;
  }

  try {
    const parsedUrl =
      new URL(
        normalizedUrl,
        "https://fixora.local",
      );

    if (
      parsedUrl.origin !==
      "https://fixora.local"
    ) {
      return null;
    }

    return [
      parsedUrl.pathname,
      parsedUrl.search,
      parsedUrl.hash,
    ].join("");
  } catch {
    return null;
  }
}

function requireValidActionUrl(
  value:
    | string
    | null
    | undefined,
): string | null {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return null;
  }

  const normalizedUrl =
    normalizeNotificationActionUrl(
      value,
    );

  if (!normalizedUrl) {
    throw new TypeError(
      "La ruta de acción de la notificación no es válida.",
    );
  }

  return normalizedUrl;
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

function toNotificationRecord(
  notification:
    StoredNotificationRecord,
): NotificationRecord {
  return {
    id:
      notification.id,

    userId:
      notification.userId,

    type:
      notification.type,

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
      notification.readAt !==
      null,

    readAt:
      notification.readAt,

    createdAt:
      notification.createdAt,

    updatedAt:
      notification.updatedAt,
  };
}

function createNotificationData(
  input:
    CreateNotificationRepositoryInput,
): Prisma.NotificationUncheckedCreateInput {
  return {
    userId:
      requireIdentifier(
        input.userId,
        "userId",
      ),

    type:
      requireNotificationType(
        input.type,
      ),

    titleEs:
      normalizeNotificationText(
        input.titleEs,
        "titleEs",
        MAXIMUM_TITLE_LENGTH,
      ),

    titleEn:
      normalizeNotificationText(
        input.titleEn,
        "titleEn",
        MAXIMUM_TITLE_LENGTH,
      ),

    messageEs:
      normalizeNotificationText(
        input.messageEs,
        "messageEs",
        MAXIMUM_MESSAGE_LENGTH,
      ),

    messageEn:
      normalizeNotificationText(
        input.messageEn,
        "messageEn",
        MAXIMUM_MESSAGE_LENGTH,
      ),

    actionUrl:
      requireValidActionUrl(
        input.actionUrl,
      ),

    readAt:
      null,
  };
}

/**
 * Crea una notificación personal para un usuario.
 */
export async function createNotification(
  input:
    CreateNotificationRepositoryInput,
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<NotificationRecord> {
  const notification =
    await client.notification.create({
      data:
        createNotificationData(
          input,
        ),

      select:
        NOTIFICATION_PUBLIC_SELECT,
    });

  return toNotificationRecord(
    notification,
  );
}

/**
 * Crea varias notificaciones.
 *
 * Devuelve el número de registros insertados.
 */
export async function createManyNotifications(
  {
    notifications,
  }: CreateManyNotificationsRepositoryInput,
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<number> {
  if (
    notifications.length ===
    0
  ) {
    return 0;
  }

  const result =
    await client.notification.createMany({
      data:
        notifications.map(
          createNotificationData,
        ),
    });

  return result.count;
}

/**
 * Busca una notificación que pertenezca al usuario.
 */
export async function findNotificationByIdForUser(
  notificationId: string,
  userId: string,
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<NotificationRecord | null> {
  const normalizedNotificationId =
    normalizeIdentifier(
      notificationId,
    );

  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (
    !normalizedNotificationId ||
    !normalizedUserId
  ) {
    return null;
  }

  const notification =
    await client.notification.findFirst({
      where: {
        id:
          normalizedNotificationId,

        userId:
          normalizedUserId,
      },

      select:
        NOTIFICATION_PUBLIC_SELECT,
    });

  return notification
    ? toNotificationRecord(
        notification,
      )
    : null;
}

/**
 * Lista las notificaciones del usuario.
 *
 * Admite:
 * - Paginación.
 * - Solamente no leídas.
 * - Filtrado por tipo.
 */
export async function findUserNotificationsPage(
  {
    userId,

    page:
      requestedPage,

    pageSize:
      requestedPageSize,

    unreadOnly =
      false,

    type:
      requestedType,
  }: FindUserNotificationsPageRepositoryInput,
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<UserNotificationsPageRepositoryResult> {
  const normalizedUserId =
    requireIdentifier(
      userId,
      "userId",
    );

  const page =
    normalizePage(
      requestedPage,
    );

  const pageSize =
    normalizePageSize(
      requestedPageSize,
    );

  const normalizedType =
    requestedType
      ? normalizeNotificationType(
          requestedType,
        )
      : null;

  const where:
    Prisma.NotificationWhereInput = {
    userId:
      normalizedUserId,

    ...(unreadOnly
      ? {
          readAt:
            null,
        }
      : {}),

    ...(normalizedType
      ? {
          type:
            normalizedType,
        }
      : {}),
  };

  const [
    totalItems,
    unreadCount,
    storedNotifications,
  ] = await Promise.all([
    client.notification.count({
      where,
    }),

    client.notification.count({
      where: {
        userId:
          normalizedUserId,

        readAt:
          null,
      },
    }),

    client.notification.findMany({
      where,

      select:
        NOTIFICATION_PUBLIC_SELECT,

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
    notifications:
      storedNotifications.map(
        toNotificationRecord,
      ),

    unreadCount,

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
      unreadOnly,

      type:
        normalizedType,
    },
  };
}

/**
 * Obtiene el número de notificaciones no leídas.
 */
export async function countUnreadUserNotifications(
  userId: string,
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<number> {
  const normalizedUserId =
    requireIdentifier(
      userId,
      "userId",
    );

  return client.notification.count({
    where: {
      userId:
        normalizedUserId,

      readAt:
        null,
    },
  });
}

/**
 * Marca una notificación del usuario como leída.
 *
 * La operación es idempotente:
 * si ya estaba leída, devuelve el mismo registro.
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string,
  readAt:
    Date = new Date(),
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<NotificationRecord | null> {
  const normalizedNotificationId =
    normalizeIdentifier(
      notificationId,
    );

  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (
    !normalizedNotificationId ||
    !normalizedUserId
  ) {
    return null;
  }

  const validReadAt =
    requireValidDate(
      readAt,
      "readAt",
    );

  await client.notification.updateMany({
    where: {
      id:
        normalizedNotificationId,

      userId:
        normalizedUserId,

      readAt:
        null,
    },

    data: {
      readAt:
        validReadAt,
    },
  });

  return findNotificationByIdForUser(
    normalizedNotificationId,
    normalizedUserId,
    client,
  );
}

/**
 * Marca todas las notificaciones pendientes del usuario
 * como leídas.
 */
export async function markAllUserNotificationsAsRead(
  userId: string,
  readAt:
    Date = new Date(),
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<number> {
  const normalizedUserId =
    requireIdentifier(
      userId,
      "userId",
    );

  const validReadAt =
    requireValidDate(
      readAt,
      "readAt",
    );

  const result =
    await client.notification.updateMany({
      where: {
        userId:
          normalizedUserId,

        readAt:
          null,
      },

      data: {
        readAt:
          validReadAt,
      },
    });

  return result.count;
}

/**
 * Permite volver a marcar una notificación como no leída.
 */
export async function markNotificationAsUnread(
  notificationId: string,
  userId: string,
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<NotificationRecord | null> {
  const normalizedNotificationId =
    normalizeIdentifier(
      notificationId,
    );

  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (
    !normalizedNotificationId ||
    !normalizedUserId
  ) {
    return null;
  }

  const result =
    await client.notification.updateMany({
      where: {
        id:
          normalizedNotificationId,

        userId:
          normalizedUserId,
      },

      data: {
        readAt:
          null,
      },
    });

  if (
    result.count ===
    0
  ) {
    return null;
  }

  return findNotificationByIdForUser(
    normalizedNotificationId,
    normalizedUserId,
    client,
  );
}

/**
 * Elimina una notificación siempre que pertenezca
 * al usuario indicado.
 */
export async function deleteNotificationForUser(
  notificationId: string,
  userId: string,
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<boolean> {
  const normalizedNotificationId =
    normalizeIdentifier(
      notificationId,
    );

  const normalizedUserId =
    normalizeIdentifier(
      userId,
    );

  if (
    !normalizedNotificationId ||
    !normalizedUserId
  ) {
    return false;
  }

  const result =
    await client.notification.deleteMany({
      where: {
        id:
          normalizedNotificationId,

        userId:
          normalizedUserId,
      },
    });

  return result.count > 0;
}

/**
 * Elimina todas las notificaciones de un usuario.
 *
 * Se reserva para eliminación de cuenta o mantenimiento.
 */
export async function deleteAllUserNotifications(
  userId: string,
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<number> {
  const normalizedUserId =
    requireIdentifier(
      userId,
      "userId",
    );

  const result =
    await client.notification.deleteMany({
      where: {
        userId:
          normalizedUserId,
      },
    });

  return result.count;
}

/**
 * Elimina notificaciones leídas antes de una fecha.
 *
 * Puede aplicarse globalmente o únicamente a un usuario.
 */
export async function deleteReadNotificationsBefore(
  {
    readBefore,
    userId,
  }: DeleteReadNotificationsRepositoryInput,
  client:
    NotificationRepositoryClient =
    prisma,
): Promise<number> {
  const validReadBefore =
    requireValidDate(
      readBefore,
      "readBefore",
    );

  const normalizedUserId =
    userId
      ? requireIdentifier(
          userId,
          "userId",
        )
      : null;

  const result =
    await client.notification.deleteMany({
      where: {
        readAt: {
          not:
            null,

          lte:
            validReadBefore,
        },

        ...(normalizedUserId
          ? {
              userId:
                normalizedUserId,
            }
          : {}),
      },
    });

  return result.count;
}

/**
 * Alias utilizados por los servicios y rutas.
 */
export const getUserNotificationsPage =
  findUserNotificationsPage;

export const getUnreadNotificationCount =
  countUnreadUserNotifications;

export const markUserNotificationAsRead =
  markNotificationAsRead;

export const markAllNotificationsAsRead =
  markAllUserNotificationsAsRead;

export const removeUserNotification =
  deleteNotificationForUser;