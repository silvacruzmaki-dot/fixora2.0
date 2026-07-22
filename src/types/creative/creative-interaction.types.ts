/*
 * Tipos de interacciones del módulo Diseño / Creative.
 *
 * Este archivo define:
 * - Visualizaciones.
 * - Me gusta.
 * - Favoritos.
 * - Compartidos.
 * - Acciones optimistas de la interfaz.
 * - Permisos de interacción.
 * - Identificación del visitante.
 * - Contadores públicos.
 * - Eventos internos de interacción.
 *
 * No contiene:
 * - Acceso a Prisma.
 * - Componentes React.
 * - Llamadas HTTP.
 * - Lógica de negocio.
 */

import type {
  CreativeDateValue,
  CreativeItemId,
  CreativeUserId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDENTIFICADORES
   ========================================================= */

export type CreativeInteractionId =
  string;

export type CreativeInteractionSessionId =
  string;

export type CreativeInteractionVisitorId =
  string;

/* =========================================================
   TIPOS DE INTERACCIÓN
   ========================================================= */

export type CreativeInteractionType =
  | "VIEW"
  | "LIKE"
  | "FAVORITE"
  | "SHARE"
  | "DOWNLOAD"
  | "PURCHASE_INTENT"
  | "REQUEST_INTENT"
  | "COMMENT";

/* =========================================================
   ROLES DE QUIEN INTERACTÚA
   ========================================================= */

export type CreativeInteractionActorRole =
  | "GUEST"
  | "USER"
  | "ADMIN";

/* =========================================================
   ORIGEN DE LA INTERACCIÓN
   ========================================================= */

export type CreativeInteractionSource =
  | "CATALOG"
  | "VIEWER"
  | "RELATED_ITEM"
  | "DIRECT_LINK"
  | "SHARED_LINK"
  | "FAVORITES"
  | "PROFILE"
  | "ADMIN_PANEL"
  | "SEARCH"
  | "UNKNOWN";

/* =========================================================
   CANALES PARA COMPARTIR
   ========================================================= */

export type CreativeShareChannel =
  | "COPY_LINK"
  | "NATIVE_SHARE"
  | "WHATSAPP"
  | "FACEBOOK"
  | "X"
  | "EMAIL"
  | "OTHER";

/* =========================================================
   ESTADO DE UNA OPERACIÓN
   ========================================================= */

export type CreativeInteractionOperationStatus =
  | "IDLE"
  | "PENDING"
  | "SUCCESS"
  | "ERROR";

/* =========================================================
   ACCIONES DE CAMBIO
   ========================================================= */

export type CreativeInteractionToggleAction =
  | "ADD"
  | "REMOVE";

/* =========================================================
   MOTIVOS DE RECHAZO
   ========================================================= */

export type CreativeInteractionBlockReason =
  | "AUTHENTICATION_REQUIRED"
  | "ITEM_NOT_FOUND"
  | "ITEM_UNAVAILABLE"
  | "ITEM_ARCHIVED"
  | "INTERACTION_DISABLED"
  | "ACCOUNT_UNAVAILABLE"
  | "RATE_LIMITED"
  | "UNTRUSTED_ORIGIN"
  | "INVALID_REQUEST"
  | "INTERNAL_ERROR";

/* =========================================================
   ACTOR DE LA INTERACCIÓN
   ========================================================= */

export interface CreativeInteractionActor {
  userId:
    CreativeUserId | null;

  visitorId:
    CreativeInteractionVisitorId | null;

  sessionId:
    CreativeInteractionSessionId | null;

  role:
    CreativeInteractionActorRole;

  authenticated:
    boolean;
}

/* =========================================================
   CONTEXTO TÉCNICO
   ========================================================= */

/*
 * Esta información se utiliza en el servidor para:
 * - Auditoría.
 * - Prevención de abuso.
 * - Rate limiting.
 * - Registro de origen.
 *
 * No debe exponerse completa al navegador.
 */
export interface CreativeInteractionRequestContext {
  ipHash:
    string | null;

  userAgent:
    string | null;

  referer:
    string | null;

  source:
    CreativeInteractionSource;

  requestId:
    string | null;
}

/* =========================================================
   CONTADORES PÚBLICOS
   ========================================================= */

export interface CreativeInteractionCounters {
  viewsCount:
    number;

  likesCount:
    number;

  favoritesCount:
    number;

  sharesCount:
    number;

  commentsCount:
    number;

  downloadsCount:
    number;

  purchasesCount:
    number;

  requestsCount:
    number;
}

/* =========================================================
   ESTADO DEL USUARIO ACTUAL
   ========================================================= */

export interface CreativeCurrentInteractionState {
  liked:
    boolean;

  favorited:
    boolean;

  viewed:
    boolean;

  shared:
    boolean;

  downloaded:
    boolean;

  purchased:
    boolean;

  approvedPurchase:
    boolean;

  pendingPurchase:
    boolean;

  requestedService:
    boolean;

  commented:
    boolean;
}

/* =========================================================
   ESTADO COMPLETO DE INTERACCIONES
   ========================================================= */

export interface CreativeItemInteractionState {
  itemId:
    CreativeItemId;

  actor:
    CreativeInteractionActor;

  current:
    CreativeCurrentInteractionState;

  counters:
    CreativeInteractionCounters;
}

/* =========================================================
   PERMISOS DE INTERACCIÓN
   ========================================================= */

export interface CreativeInteractionPermissions {
  canView:
    boolean;

  canLike:
    boolean;

  canFavorite:
    boolean;

  canShare:
    boolean;

  canComment:
    boolean;

  canDownload:
    boolean;

  canPurchase:
    boolean;

  canRequest:
    boolean;

  canReport:
    boolean;

  requiresAuthenticationForLike:
    boolean;

  requiresAuthenticationForFavorite:
    boolean;

  requiresAuthenticationForComment:
    boolean;

  requiresAuthenticationForPurchase:
    boolean;

  requiresAuthenticationForRequest:
    boolean;
}

/* =========================================================
   RESULTADO DE VALIDACIÓN DE PERMISOS
   ========================================================= */

export interface CreativeInteractionPermissionResult {
  allowed:
    boolean;

  reason:
    CreativeInteractionBlockReason | null;

  redirectTo:
    string | null;

  returnTo:
    string | null;
}

/* =========================================================
   REGISTRO DE VISUALIZACIONES
   ========================================================= */

export interface CreativeViewInteractionInput {
  itemId:
    CreativeItemId;

  source:
    CreativeInteractionSource;

  visitorId?:
    CreativeInteractionVisitorId | null;

  sessionId?:
    CreativeInteractionSessionId | null;
}

export interface CreativeViewInteractionResult {
  itemId:
    CreativeItemId;

  registered:
    boolean;

  duplicated:
    boolean;

  viewsCount:
    number;

  viewedAt:
    CreativeDateValue;
}

/* =========================================================
   CONFIGURACIÓN DE VISUALIZACIONES
   ========================================================= */

/*
 * Permite evitar que una misma persona aumente el contador
 * cada vez que abre y cierra el visor repetidamente.
 */
export interface CreativeViewDeduplicationSettings {
  enabled:
    boolean;

  windowMs:
    number;

  useUserId:
    boolean;

  useVisitorId:
    boolean;

  useSessionId:
    boolean;

  useIpHash:
    boolean;
}

/* =========================================================
   ME GUSTA
   ========================================================= */

export interface CreativeLikeInteractionInput {
  itemId:
    CreativeItemId;

  action?:
    CreativeInteractionToggleAction;
}

export interface CreativeLikeInteractionResult {
  itemId:
    CreativeItemId;

  liked:
    boolean;

  action:
    CreativeInteractionToggleAction;

  likesCount:
    number;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   FAVORITOS
   ========================================================= */

export interface CreativeFavoriteInteractionInput {
  itemId:
    CreativeItemId;

  action?:
    CreativeInteractionToggleAction;
}

export interface CreativeFavoriteInteractionResult {
  itemId:
    CreativeItemId;

  favorited:
    boolean;

  action:
    CreativeInteractionToggleAction;

  favoritesCount:
    number;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   COMPARTIDOS
   ========================================================= */

export interface CreativeShareInteractionInput {
  itemId:
    CreativeItemId;

  channel:
    CreativeShareChannel;

  source:
    CreativeInteractionSource;
}

export interface CreativeShareInteractionResult {
  itemId:
    CreativeItemId;

  registered:
    boolean;

  channel:
    CreativeShareChannel;

  shareUrl:
    string;

  sharesCount:
    number;

  sharedAt:
    CreativeDateValue;
}

/* =========================================================
   DESCARGAS
   ========================================================= */

export type CreativeDownloadInteractionStatus =
  | "AVAILABLE"
  | "AUTHENTICATION_REQUIRED"
  | "PURCHASE_REQUIRED"
  | "PAYMENT_PENDING"
  | "DISABLED"
  | "FILE_UNAVAILABLE";

export interface CreativeDownloadInteractionInput {
  itemId:
    CreativeItemId;

  source:
    CreativeInteractionSource;
}

export interface CreativeDownloadInteractionResult {
  itemId:
    CreativeItemId;

  status:
    CreativeDownloadInteractionStatus;

  registered:
    boolean;

  downloadsCount:
    number;

  downloadUrl:
    string | null;

  fileName:
    string | null;

  expiresAt:
    CreativeDateValue | null;

  redirectTo:
    string | null;
}

/* =========================================================
   INTENCIÓN DE COMPRA
   ========================================================= */

export interface CreativePurchaseIntentInteractionInput {
  itemId:
    CreativeItemId;

  source:
    CreativeInteractionSource;

  returnTo:
    string | null;
}

export interface CreativePurchaseIntentInteractionResult {
  itemId:
    CreativeItemId;

  registered:
    boolean;

  orderId:
    string | null;

  redirectTo:
    string | null;

  createdAt:
    CreativeDateValue;
}

/* =========================================================
   INTENCIÓN DE SOLICITUD
   ========================================================= */

export interface CreativeRequestIntentInteractionInput {
  itemId:
    CreativeItemId;

  source:
    CreativeInteractionSource;

  returnTo:
    string | null;
}

export interface CreativeRequestIntentInteractionResult {
  itemId:
    CreativeItemId;

  registered:
    boolean;

  requestId:
    string | null;

  redirectTo:
    string | null;

  createdAt:
    CreativeDateValue;
}

/* =========================================================
   ACCIONES OPTIMISTAS
   ========================================================= */

/*
 * Una actualización optimista modifica primero la interfaz
 * y luego espera la respuesta del servidor.
 *
 * Ejemplo:
 * Al pulsar Me gusta, el corazón cambia inmediatamente.
 * Si la API falla, se revierte el estado anterior.
 */
export interface CreativeOptimisticInteractionState {
  operation:
    CreativeInteractionType | null;

  status:
    CreativeInteractionOperationStatus;

  itemId:
    CreativeItemId | null;

  previousState:
    CreativeCurrentInteractionState | null;

  previousCounters:
    CreativeInteractionCounters | null;

  errorMessage:
    string | null;
}

/* =========================================================
   MUTACIÓN OPTIMISTA DE ME GUSTA
   ========================================================= */

export interface CreativeOptimisticLikeMutation {
  previousLiked:
    boolean;

  nextLiked:
    boolean;

  previousLikesCount:
    number;

  nextLikesCount:
    number;
}

/* =========================================================
   MUTACIÓN OPTIMISTA DE FAVORITO
   ========================================================= */

export interface CreativeOptimisticFavoriteMutation {
  previousFavorited:
    boolean;

  nextFavorited:
    boolean;

  previousFavoritesCount:
    number;

  nextFavoritesCount:
    number;
}

/* =========================================================
   EVENTO INTERNO DE INTERACCIÓN
   ========================================================= */

export interface CreativeInteractionEvent {
  id:
    CreativeInteractionId;

  itemId:
    CreativeItemId;

  type:
    CreativeInteractionType;

  actor:
    CreativeInteractionActor;

  source:
    CreativeInteractionSource;

  createdAt:
    CreativeDateValue;
}

/* =========================================================
   REGISTRO DE INTERACCIÓN PARA REPOSITORIO
   ========================================================= */

/*
 * Representación interna utilizada por repositorios.
 * No debe enviarse directamente al navegador.
 */
export interface CreativeInteractionRecord {
  id:
    CreativeInteractionId;

  itemId:
    CreativeItemId;

  userId:
    CreativeUserId | null;

  visitorId:
    CreativeInteractionVisitorId | null;

  sessionId:
    CreativeInteractionSessionId | null;

  type:
    CreativeInteractionType;

  active:
    boolean;

  source:
    CreativeInteractionSource;

  ipHash:
    string | null;

  userAgent:
    string | null;

  createdAt:
    CreativeDateValue;

  updatedAt:
    CreativeDateValue;
}

/* =========================================================
   DATOS PARA CREAR UNA INTERACCIÓN
   ========================================================= */

export interface CreateCreativeInteractionInput {
  itemId:
    CreativeItemId;

  userId:
    CreativeUserId | null;

  visitorId:
    CreativeInteractionVisitorId | null;

  sessionId:
    CreativeInteractionSessionId | null;

  type:
    CreativeInteractionType;

  active:
    boolean;

  source:
    CreativeInteractionSource;

  ipHash:
    string | null;

  userAgent:
    string | null;
}

/* =========================================================
   DATOS PARA ACTUALIZAR UNA INTERACCIÓN
   ========================================================= */

export interface UpdateCreativeInteractionInput {
  active?:
    boolean;

  source?:
    CreativeInteractionSource;

  ipHash?:
    string | null;

  userAgent?:
    string | null;
}

/* =========================================================
   CONSULTA DE INTERACCIONES
   ========================================================= */

export interface CreativeInteractionQuery {
  itemId?:
    CreativeItemId;

  userId?:
    CreativeUserId;

  visitorId?:
    CreativeInteractionVisitorId;

  sessionId?:
    CreativeInteractionSessionId;

  types?:
    CreativeInteractionType[];

  active?:
    boolean;

  source?:
    CreativeInteractionSource;

  createdFrom?:
    CreativeDateValue;

  createdTo?:
    CreativeDateValue;
}

/* =========================================================
   RESUMEN ADMINISTRATIVO
   ========================================================= */

export interface CreativeInteractionAdminSummary {
  itemId:
    CreativeItemId;

  counters:
    CreativeInteractionCounters;

  uniqueAuthenticatedViewers:
    number;

  uniqueGuestViewers:
    number;

  uniqueTotalViewers:
    number;

  interactionRate:
    number;

  conversionRate:
    number;

  lastInteractionAt:
    CreativeDateValue | null;
}

/* =========================================================
   ESTADÍSTICAS POR PERÍODO
   ========================================================= */

export interface CreativeInteractionPeriodStatistics {
  periodStart:
    CreativeDateValue;

  periodEnd:
    CreativeDateValue;

  views:
    number;

  likes:
    number;

  favorites:
    number;

  shares:
    number;

  comments:
    number;

  downloads:
    number;

  purchaseIntents:
    number;

  requestIntents:
    number;
}

/* =========================================================
   CONTROLADOR DE INTERACCIONES
   ========================================================= */

export interface CreativeInteractionController {
  state:
    CreativeItemInteractionState;

  permissions:
    CreativeInteractionPermissions;

  optimistic:
    CreativeOptimisticInteractionState;

  registerView:
    (
      input:
        CreativeViewInteractionInput,
    ) => Promise<CreativeViewInteractionResult>;

  toggleLike:
    (
      input:
        CreativeLikeInteractionInput,
    ) => Promise<CreativeLikeInteractionResult>;

  toggleFavorite:
    (
      input:
        CreativeFavoriteInteractionInput,
    ) => Promise<CreativeFavoriteInteractionResult>;

  registerShare:
    (
      input:
        CreativeShareInteractionInput,
    ) => Promise<CreativeShareInteractionResult>;

  requestDownload:
    (
      input:
        CreativeDownloadInteractionInput,
    ) => Promise<CreativeDownloadInteractionResult>;

  registerPurchaseIntent:
    (
      input:
        CreativePurchaseIntentInteractionInput,
    ) => Promise<CreativePurchaseIntentInteractionResult>;

  registerRequestIntent:
    (
      input:
        CreativeRequestIntentInteractionInput,
    ) => Promise<CreativeRequestIntentInteractionResult>;

  refresh:
    () => Promise<void>;
}

/* =========================================================
   VALORES INICIALES
   ========================================================= */

export const EMPTY_CREATIVE_INTERACTION_COUNTERS:
  CreativeInteractionCounters = {
    viewsCount: 0,
    likesCount: 0,
    favoritesCount: 0,
    sharesCount: 0,
    commentsCount: 0,
    downloadsCount: 0,
    purchasesCount: 0,
    requestsCount: 0,
  };

export const EMPTY_CREATIVE_CURRENT_INTERACTION_STATE:
  CreativeCurrentInteractionState = {
    liked: false,
    favorited: false,
    viewed: false,
    shared: false,
    downloaded: false,
    purchased: false,
    approvedPurchase: false,
    pendingPurchase: false,
    requestedService: false,
    commented: false,
  };

export const EMPTY_CREATIVE_OPTIMISTIC_INTERACTION_STATE:
  CreativeOptimisticInteractionState = {
    operation: null,
    status: "IDLE",
    itemId: null,
    previousState: null,
    previousCounters: null,
    errorMessage: null,
  };