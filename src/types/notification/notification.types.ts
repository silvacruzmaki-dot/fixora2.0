import type {
  AuthLanguage,
} from "@/constants/auth/auth.constants";

import type {
  ApiResponse,
  AuthDateValue,
} from "@/types/auth/auth.types";

/*
 * Las fechas pueden existir como objetos Date dentro del
 * servidor y como cadenas ISO después de serializar una
 * respuesta JSON.
 */
export type NotificationDateValue =
  AuthDateValue;

export type NullableNotificationDateValue =
  | NotificationDateValue
  | null;

export type NotificationLanguage =
  AuthLanguage;

export type NotificationReadStatus =
  | "read"
  | "unread";

export type NotificationMutationStatus =
  | "marked"
  | "not-found";

export type NotificationType =
  string;

/*
 * Representación segura de una notificación.
 *
 * No contiene información sensible de sesión,
 * autenticación ni direcciones IP.
 */
export interface NotificationRecord {
  id: string;

  userId:
    | string
    | null;

  type:
    NotificationType;

  titleEs: string;
  titleEn: string;

  messageEs: string;
  messageEn: string;

  actionUrl:
    | string
    | null;

  isRead: boolean;

  readAt:
    NullableNotificationDateValue;

  createdAt:
    NotificationDateValue;

  updatedAt:
    NotificationDateValue;
}

/*
 * Notificación preparada para mostrarse en el idioma
 * seleccionado por el usuario.
 *
 * Conserva además los textos originales en español e
 * inglés para permitir cambios de idioma inmediatos.
 */
export interface LocalizedNotification
  extends NotificationRecord {
  title: string;
  message: string;
}

export interface NotificationPagination {
  page: number;
  pageSize: number;

  totalItems: number;
  totalPages: number;

  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface NotificationFilters {
  unreadOnly: boolean;

  type:
    | string
    | null;

  language:
    NotificationLanguage;
}

/*
 * Parámetros aceptados por:
 *
 * GET /api/notificaciones
 */
export interface NotificationListRequest {
  page?: number;
  pageSize?: number;

  unreadOnly?: boolean;

  type?:
    | string
    | null;

  language?:
    NotificationLanguage;
}

/*
 * Variante compatible con valores provenientes de
 * URLSearchParams o formularios.
 */
export interface NotificationListQuery {
  page?:
    | string
    | number
    | null;

  pageSize?:
    | string
    | number
    | null;

  unreadOnly?:
    | string
    | number
    | boolean
    | null;

  type?:
    | string
    | null;

  language?:
    | NotificationLanguage
    | string
    | null;
}

/*
 * Resultado de listar notificaciones.
 */
export interface NotificationsResponseData {
  notifications:
    LocalizedNotification[];

  unreadCount: number;

  language:
    NotificationLanguage;

  pagination:
    NotificationPagination;

  filters:
    NotificationFilters;
}

/*
 * Resultado de marcar una notificación concreta.
 */
export interface NotificationMarkedData {
  status:
    "marked";

  notification:
    LocalizedNotification;

  unreadCount: number;

  marked:
    true;

  /*
   * true cuando la operación cambió readAt.
   * false cuando ya estaba leída.
   */
  updated: boolean;

  alreadyRead: boolean;

  language:
    NotificationLanguage;
}

export interface NotificationNotFoundData {
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

export type MarkNotificationAsReadResponseData =
  | NotificationMarkedData
  | NotificationNotFoundData;

/*
 * Resultado de marcar todas las notificaciones pendientes
 * como leídas.
 */
export interface MarkAllNotificationsAsReadResponseData {
  updatedCount: number;

  /*
   * Alias conservado para componentes que utilizan
   * markedCount.
   */
  markedCount: number;

  unreadCount: number;

  updated: boolean;
  noChanges: boolean;
}

/*
 * Cuerpos y parámetros utilizados por las rutas.
 */
export interface MarkNotificationAsReadRequest {
  notificationId: string;
}

export interface NotificationRouteParameters {
  notificationId: string;
}

export interface NotificationCounter {
  unreadCount: number;
}

export interface NotificationSummary {
  id: string;

  type:
    NotificationType;

  title: string;
  message: string;

  actionUrl:
    | string
    | null;

  isRead: boolean;

  createdAt:
    NotificationDateValue;
}

/*
 * Sobres completos de respuestas API.
 */
export type NotificationsApiResponse =
  ApiResponse<NotificationsResponseData>;

export type MarkNotificationAsReadApiResponse =
  ApiResponse<MarkNotificationAsReadResponseData>;

export type MarkAllNotificationsAsReadApiResponse =
  ApiResponse<MarkAllNotificationsAsReadResponseData>;

/*
 * Estado local de la página de notificaciones.
 */
export interface NotificationsPageState {
  notifications:
    LocalizedNotification[];

  unreadCount: number;

  page: number;
  pageSize: number;

  totalItems: number;
  totalPages: number;

  hasPreviousPage: boolean;
  hasNextPage: boolean;

  unreadOnly: boolean;

  type:
    | string
    | null;

  language:
    NotificationLanguage;

  isLoading: boolean;
  isRefreshing: boolean;

  error:
    | string
    | null;
}

export interface NotificationFilterState {
  unreadOnly: boolean;

  type:
    | string
    | null;

  language:
    NotificationLanguage;
}

/*
 * Estado utilizado durante operaciones individuales.
 */
export interface NotificationMutationState {
  notificationId:
    | string
    | null;

  isSubmitting: boolean;

  error:
    | string
    | null;
}

/*
 * Información para indicadores visuales del navbar.
 */
export interface NotificationBadgeData {
  unreadCount: number;

  hasUnreadNotifications:
    boolean;
}

/*
 * Utilizado cuando un componente modifica el contador
 * mediante una función.
 */
export type NotificationCountUpdater =
  | number
  | ((
      currentCount: number,
    ) => number);

/*
 * Parámetros para solicitar otra página.
 */
export interface NotificationPaginationRequest {
  page: number;
  pageSize: number;
}

/*
 * Filtros disponibles para la interfaz.
 */
export interface NotificationTypeOption {
  value:
    | string
    | null;

  label: string;
}

export interface NotificationLanguageOption {
  value:
    NotificationLanguage;

  label: string;
}

/*
 * Datos mínimos para crear enlaces de acción dentro de
 * los componentes.
 */
export interface NotificationAction {
  url:
    | string
    | null;

  isAvailable:
    boolean;
}

/*
 * Resultado genérico de una modificación.
 */
export type NotificationMutationResponseData =
  | MarkNotificationAsReadResponseData
  | MarkAllNotificationsAsReadResponseData;

export type NotificationMutationApiResponse =
  ApiResponse<NotificationMutationResponseData>;

/*
 * Alias compatibles con componentes y páginas anteriores.
 */
export type Notification =
  LocalizedNotification;

export type UserNotification =
  LocalizedNotification;

export type NotificationData =
  LocalizedNotification;

export type NotificationItem =
  LocalizedNotification;

export type StoredNotification =
  NotificationRecord;

export type NotificationsData =
  NotificationsResponseData;

export type NotificationsResponse =
  NotificationsResponseData;

export type NotificationResponse =
  MarkNotificationAsReadResponseData;

export type NotificationApiResponse =
  NotificationsApiResponse;

export type NotificationListData =
  NotificationsResponseData;

export type NotificationListResponse =
  NotificationsResponseData;

export type MarkNotificationReadResponse =
  MarkNotificationAsReadResponseData;

export type MarkAllNotificationsReadResponse =
  MarkAllNotificationsAsReadResponseData;

export type NotificationsFilter =
  NotificationFilters;

export type NotificationsPagination =
  NotificationPagination;

export type UnreadNotificationCount =
  NotificationCounter;