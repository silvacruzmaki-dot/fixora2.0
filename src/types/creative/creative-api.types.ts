/*
 * Contratos de comunicación del módulo Diseño / Creative.
 *
 * Este archivo define:
 * - Respuestas estándar de la API.
 * - Errores y mensajes localizados.
 * - Paginación.
 * - Consultas del catálogo.
 * - Datos serializados para el navegador.
 * - Información de sesión y permisos.
 * - Respuestas de acciones como descargar, comprar,
 *   solicitar, compartir y registrar visualizaciones.
 *
 * No debe contener acceso a Prisma ni lógica de negocio.
 */

import type {
  CreativeCategoryId,
  CreativeContentType,
  CreativeItem,
  CreativeItemAccess,
  CreativeItemId,
  CreativeItemSlug,
  CreativeItemStatus,
  CreativeItemSummary,
  CreativeToolId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMA DE LA API
   ========================================================= */

export type CreativeApiLanguage =
  | "es"
  | "en";

/* =========================================================
   MENSAJES LOCALIZADOS
   ========================================================= */

export interface CreativeApiLocalizedMessage {
  es: string;
  en: string;
}

/* =========================================================
   ERRORES DE CAMPOS
   ========================================================= */

export type CreativeApiFieldErrors =
  Record<
    string,
    string[]
  >;

/* =========================================================
   ERRORES GENERALES
   ========================================================= */

export interface CreativeApiErrorDetail {
  code: string;

  message:
    CreativeApiLocalizedMessage;

  field:
    string | null;
}

/* =========================================================
   METADATOS DE PETICIÓN
   ========================================================= */

export interface CreativeApiRequestMeta {
  requestId:
    string | null;

  timestamp:
    string;
}

/* =========================================================
   PAGINACIÓN
   ========================================================= */

export interface CreativePagination {
  page:
    number;

  pageSize:
    number;

  totalItems:
    number;

  totalPages:
    number;

  hasPreviousPage:
    boolean;

  hasNextPage:
    boolean;
}

/* =========================================================
   METADATOS DE RESPUESTA
   ========================================================= */

export interface CreativeApiMeta {
  request:
    CreativeApiRequestMeta;

  pagination?:
    CreativePagination;
}

/* =========================================================
   RESPUESTA EXITOSA
   ========================================================= */

export interface CreativeApiSuccessResponse<
  TData,
> {
  ok: true;

  code:
    string;

  message?:
    CreativeApiLocalizedMessage;

  data:
    TData;

  meta?:
    CreativeApiMeta;
}

/* =========================================================
   RESPUESTA FALLIDA
   ========================================================= */

export interface CreativeApiErrorResponse {
  ok: false;

  code:
    string;

  message:
    CreativeApiLocalizedMessage;

  data?:
    null;

  fieldErrors?:
    CreativeApiFieldErrors;

  errors?:
    CreativeApiErrorDetail[];

  meta?:
    CreativeApiMeta;
}

/* =========================================================
   RESPUESTA GENERAL
   ========================================================= */

export type CreativeApiResponse<
  TData,
> =
  | CreativeApiSuccessResponse<TData>
  | CreativeApiErrorResponse;

/* =========================================================
   FECHAS SERIALIZADAS
   ========================================================= */

/*
 * Todas las fechas enviadas al navegador deben estar
 * serializadas como cadenas ISO 8601.
 */
export type CreativeApiDate =
  string;

export type NullableCreativeApiDate =
  | CreativeApiDate
  | null;

/* =========================================================
   SERIALIZACIÓN DE PUBLICACIONES
   ========================================================= */

type SerializeCreativeItemDates<
  TItem extends CreativeItem,
> =
  TItem extends CreativeItem
    ? Omit<
        TItem,
        | "publishedAt"
        | "createdAt"
        | "updatedAt"
      > & {
        publishedAt:
          NullableCreativeApiDate;

        createdAt:
          CreativeApiDate;

        updatedAt:
          CreativeApiDate;
      }
    : never;

export type CreativeApiItem =
  SerializeCreativeItemDates<
    CreativeItem
  >;

export type CreativeApiItemSummary =
  Omit<
    CreativeItemSummary,
    "publishedAt"
  > & {
    publishedAt:
      NullableCreativeApiDate;
  };

/* =========================================================
   ORDENAMIENTO DEL CATÁLOGO
   ========================================================= */

export type CreativeCatalogSort =
  | "newest"
  | "oldest"
  | "most-viewed"
  | "most-liked"
  | "most-downloaded"
  | "most-popular"
  | "price-low-to-high"
  | "price-high-to-low";

/* =========================================================
   CONSULTA DEL CATÁLOGO
   ========================================================= */

export interface CreativeCatalogQuery {
  search?:
    string;

  contentTypes?:
    CreativeContentType[];

  categoryIds?:
    CreativeCategoryId[];

  toolIds?:
    CreativeToolId[];

  featured?:
    boolean;

  sort?:
    CreativeCatalogSort;

  page?:
    number;

  pageSize?:
    number;
}

/* =========================================================
   CONSULTA ADMINISTRATIVA
   ========================================================= */

export interface CreativeAdminCatalogQuery
  extends CreativeCatalogQuery {
  statuses?:
    CreativeItemStatus[];

  authorId?:
    string;

  includeArchived?:
    boolean;
}

/* =========================================================
   FILTROS ACTIVOS
   ========================================================= */

export interface CreativeCatalogActiveFilters {
  search:
    string;

  contentTypes:
    CreativeContentType[];

  categoryIds:
    CreativeCategoryId[];

  toolIds:
    CreativeToolId[];

  featured:
    boolean | null;

  sort:
    CreativeCatalogSort;
}

/* =========================================================
   OPCIONES DISPONIBLES DEL CATÁLOGO
   ========================================================= */

export interface CreativeCatalogFilterOption {
  value:
    string;

  labelEs:
    string;

  labelEn:
    string;

  count:
    number;

  enabled:
    boolean;
}

export interface CreativeCatalogFilterOptions {
  contentTypes:
    CreativeCatalogFilterOption[];

  categories:
    CreativeCatalogFilterOption[];

  tools:
    CreativeCatalogFilterOption[];
}

/* =========================================================
   ESTADÍSTICAS DEL CATÁLOGO
   ========================================================= */

export interface CreativeCatalogStatistics {
  totalPublished:
    number;

  totalFree:
    number;

  totalPaid:
    number;

  totalPortfolio:
    number;
}

/* =========================================================
   RESPUESTA DEL CATÁLOGO
   ========================================================= */

export interface CreativeCatalogApiData {
  items:
    CreativeApiItemSummary[];

  filters:
    CreativeCatalogActiveFilters;

  filterOptions:
    CreativeCatalogFilterOptions;

  statistics:
    CreativeCatalogStatistics;

  pagination:
    CreativePagination;
}

/* =========================================================
   USUARIO ACTUAL DEL VISOR
   ========================================================= */

export type CreativeViewerRole =
  | "GUEST"
  | "USER"
  | "ADMIN";

export interface CreativeViewerUser {
  id:
    string | null;

  displayName:
    string | null;

  avatarUrl:
    string | null;

  role:
    CreativeViewerRole;

  authenticated:
    boolean;
}

/* =========================================================
   INTERACCIONES DEL USUARIO ACTUAL
   ========================================================= */

export interface CreativeViewerInteractionState {
  liked:
    boolean;

  favorited:
    boolean;

  purchased:
    boolean;

  hasApprovedPurchase:
    boolean;

  hasPendingPurchase:
    boolean;

  hasRequestedService:
    boolean;
}

/* =========================================================
   ESTADO DEL VISOR
   ========================================================= */

export interface CreativeViewerState {
  user:
    CreativeViewerUser;

  interaction:
    CreativeViewerInteractionState;

  access:
    CreativeItemAccess;
}

/* =========================================================
   DETALLE DE PUBLICACIÓN
   ========================================================= */

export interface CreativeItemDetailApiData {
  item:
    CreativeApiItem;

  viewer:
    CreativeViewerState;

  relatedItems:
    CreativeApiItemSummary[];
}

/* =========================================================
   DETALLE POR SLUG
   ========================================================= */

export interface CreativeItemBySlugApiData
  extends CreativeItemDetailApiData {
  requestedSlug:
    CreativeItemSlug;
}

/* =========================================================
   REGISTRO DE VISUALIZACIÓN
   ========================================================= */

export interface CreativeViewRegistrationInput {
  source?:
    | "catalog"
    | "direct-link"
    | "related-item"
    | "shared-link"
    | "admin";
}

export interface CreativeViewRegistrationApiData {
  itemId:
    CreativeItemId;

  registered:
    boolean;

  viewsCount:
    number;
}

/* =========================================================
   ME GUSTA
   ========================================================= */

export interface CreativeLikeApiData {
  itemId:
    CreativeItemId;

  liked:
    boolean;

  likesCount:
    number;
}

/* =========================================================
   FAVORITOS
   ========================================================= */

export interface CreativeFavoriteApiData {
  itemId:
    CreativeItemId;

  favorited:
    boolean;

  favoritesCount:
    number;
}

/* =========================================================
   COMPARTIR
   ========================================================= */

export type CreativeShareChannel =
  | "copy-link"
  | "native"
  | "whatsapp"
  | "facebook"
  | "x"
  | "email";

export interface CreativeShareRegistrationInput {
  channel:
    CreativeShareChannel;
}

export interface CreativeShareApiData {
  itemId:
    CreativeItemId;

  registered:
    boolean;

  shareUrl:
    string;
}

/* =========================================================
   DESCARGA
   ========================================================= */

export type CreativeDownloadStatus =
  | "AVAILABLE"
  | "AUTHENTICATION_REQUIRED"
  | "PURCHASE_REQUIRED"
  | "PAYMENT_PENDING"
  | "FILE_UNAVAILABLE"
  | "DISABLED";

export interface CreativeDownloadApiData {
  itemId:
    CreativeItemId;

  status:
    CreativeDownloadStatus;

  downloadUrl:
    string | null;

  fileName:
    string | null;

  expiresAt:
    NullableCreativeApiDate;

  redirectTo:
    string | null;
}

/* =========================================================
   SOLICITUD DE INICIO DE COMPRA
   ========================================================= */

export interface CreativePurchaseStartInput {
  itemId:
    CreativeItemId;

  returnTo?:
    string;
}

export type CreativePurchaseStartStatus =
  | "CREATED"
  | "ALREADY_PENDING"
  | "ALREADY_APPROVED"
  | "AUTHENTICATION_REQUIRED"
  | "ITEM_NOT_PURCHASABLE";

export interface CreativePurchaseStartApiData {
  itemId:
    CreativeItemId;

  orderId:
    string | null;

  status:
    CreativePurchaseStartStatus;

  paymentMethod:
    "YAPE" | null;

  amountInCents:
    number | null;

  currency:
    "PEN" | null;

  redirectTo:
    string | null;
}

/* =========================================================
   COMPROBANTE DE PAGO
   ========================================================= */

export interface CreativePaymentProofApiData {
  orderId:
    string;

  uploaded:
    boolean;

  fileName:
    string | null;

  submittedAt:
    NullableCreativeApiDate;

  status:
    "PENDING_REVIEW";
}

/* =========================================================
   SOLICITUD DE DISEÑO PERSONALIZADO
   ========================================================= */

export interface CreativeRequestStartApiData {
  itemId:
    CreativeItemId;

  requestId:
    string;

  created:
    boolean;

  status:
    "PENDING";

  createdAt:
    CreativeApiDate;
}

/* =========================================================
   REDIRECCIÓN PARA AUTENTICACIÓN
   ========================================================= */

export interface CreativeAuthenticationRedirectData {
  authenticated:
    false;

  redirectTo:
    string;

  returnTo:
    string;
}

/* =========================================================
   ESTADO DE SESIÓN PARA CREATIVE
   ========================================================= */

export interface CreativeSessionApiData {
  authenticated:
    boolean;

  user:
    CreativeViewerUser;
}

/* =========================================================
   ELIMINACIÓN LÓGICA
   ========================================================= */

export interface CreativeArchiveApiData {
  itemId:
    CreativeItemId;

  status:
    "ARCHIVED";

  archivedAt:
    CreativeApiDate;
}

/* =========================================================
   CAMBIO DE ESTADO
   ========================================================= */

export interface CreativeStatusUpdateApiData {
  itemId:
    CreativeItemId;

  previousStatus:
    CreativeItemStatus;

  currentStatus:
    CreativeItemStatus;

  updatedAt:
    CreativeApiDate;
}

/* =========================================================
   BORRADO DEFINITIVO
   ========================================================= */

export interface CreativeDeleteApiData {
  itemId:
    CreativeItemId;

  deleted:
    boolean;

  deletedAt:
    CreativeApiDate;
}

/* =========================================================
   CÓDIGOS ESTÁNDAR DE LA API
   ========================================================= */

export const CREATIVE_API_CODES = {
  CATALOG_LOADED:
    "CREATIVE_CATALOG_LOADED",

  ITEM_LOADED:
    "CREATIVE_ITEM_LOADED",

  ITEM_NOT_FOUND:
    "CREATIVE_ITEM_NOT_FOUND",

  ITEM_UNAVAILABLE:
    "CREATIVE_ITEM_UNAVAILABLE",

  VIEW_REGISTERED:
    "CREATIVE_VIEW_REGISTERED",

  LIKE_UPDATED:
    "CREATIVE_LIKE_UPDATED",

  FAVORITE_UPDATED:
    "CREATIVE_FAVORITE_UPDATED",

  SHARE_REGISTERED:
    "CREATIVE_SHARE_REGISTERED",

  DOWNLOAD_AVAILABLE:
    "CREATIVE_DOWNLOAD_AVAILABLE",

  DOWNLOAD_FORBIDDEN:
    "CREATIVE_DOWNLOAD_FORBIDDEN",

  PURCHASE_CREATED:
    "CREATIVE_PURCHASE_CREATED",

  REQUEST_CREATED:
    "CREATIVE_REQUEST_CREATED",

  AUTHENTICATION_REQUIRED:
    "CREATIVE_AUTHENTICATION_REQUIRED",

  ADMIN_REQUIRED:
    "CREATIVE_ADMIN_REQUIRED",

  VALIDATION_FAILED:
    "CREATIVE_VALIDATION_FAILED",

  RATE_LIMITED:
    "CREATIVE_RATE_LIMITED",

  UNTRUSTED_ORIGIN:
    "CREATIVE_UNTRUSTED_ORIGIN",

  INTERNAL_ERROR:
    "CREATIVE_INTERNAL_ERROR",
} as const;

export type CreativeApiCode =
  typeof CREATIVE_API_CODES[
    keyof typeof CREATIVE_API_CODES
  ];