/*
 * Constantes técnicas centrales del módulo Diseño / Creative.
 *
 * Este archivo reúne:
 * - Tipos y estados admitidos.
 * - Límites de archivos.
 * - Configuración del visor.
 * - Límites de textos.
 * - Paginación.
 * - Comentarios.
 * - Marca de agua.
 * - Compras y solicitudes.
 * - Claves de almacenamiento local.
 *
 * No contiene:
 * - Textos traducidos para la interfaz.
 * - Rutas del módulo.
 * - Componentes React.
 * - Acceso a Prisma.
 * - Lógica de negocio.
 */

import type {
  CreativeCategoryId,
  CreativeContentType,
  CreativeCurrency,
  CreativeDownloadPolicy,
  CreativeImageFormat,
  CreativeItemStatus,
  CreativeLicenseType,
  CreativeOriginalFileFormat,
  CreativeOrientation,
  CreativePaymentMethod,
  CreativeRequestKind,
  CreativeToolId,
} from "@/types/creative/creative-item.types";

import type {
  CreativeCatalogSort,
} from "@/types/creative/creative-api.types";

import type {
  CreativeViewerZoomLimits,
} from "@/types/creative/creative-viewer.types";

/* =========================================================
   AYUDANTES NUMÉRICOS
   ========================================================= */

export const CREATIVE_BYTES = {
  KILOBYTE:
    1024,

  MEGABYTE:
    1024 * 1024,

  GIGABYTE:
    1024 * 1024 * 1024,
} as const;

/* =========================================================
   TIPOS COMERCIALES
   ========================================================= */

export const CREATIVE_CONTENT_TYPES = [
  "FREE",
  "PAID",
  "PORTFOLIO",
] as const satisfies readonly CreativeContentType[];

/* =========================================================
   ESTADOS DE PUBLICACIÓN
   ========================================================= */

export const CREATIVE_ITEM_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "HIDDEN",
  "ARCHIVED",
] as const satisfies readonly CreativeItemStatus[];

/* =========================================================
   CATEGORÍAS
   ========================================================= */

export const CREATIVE_CATEGORY_IDS = [
  "logo",
  "flyer",
  "illustration",
  "photo-editing",
  "social-media",
  "branding",
  "poster",
  "business-card",
  "brochure",
  "banner",
  "photography",
  "other",
] as const satisfies readonly CreativeCategoryId[];

/* =========================================================
   HERRAMIENTAS
   ========================================================= */

export const CREATIVE_TOOL_IDS = [
  "adobe-illustrator",
  "adobe-photoshop",
  "adobe-lightroom",
  "adobe-indesign",
  "figma",
  "canva",
  "other",
] as const satisfies readonly CreativeToolId[];

/* =========================================================
   FORMATOS DE IMAGEN
   ========================================================= */

export const CREATIVE_IMAGE_FORMATS = [
  "JPEG",
  "PNG",
  "WEBP",
] as const satisfies readonly CreativeImageFormat[];

/* =========================================================
   FORMATOS DE ARCHIVO ORIGINAL
   ========================================================= */

export const CREATIVE_ORIGINAL_FILE_FORMATS = [
  "AI",
  "PSD",
  "PDF",
  "SVG",
  "EPS",
  "INDD",
  "JPEG",
  "PNG",
  "WEBP",
  "ZIP",
  "OTHER",
] as const satisfies readonly CreativeOriginalFileFormat[];

/* =========================================================
   ORIENTACIONES
   ========================================================= */

export const CREATIVE_ORIENTATIONS = [
  "SQUARE",
  "PORTRAIT",
  "LANDSCAPE",
  "PANORAMIC",
] as const satisfies readonly CreativeOrientation[];

/* =========================================================
   LICENCIAS
   ========================================================= */

export const CREATIVE_LICENSE_TYPES = [
  "PERSONAL_USE",
  "COMMERCIAL_USE",
  "EDITORIAL_USE",
  "CUSTOM_TERMS",
] as const satisfies readonly CreativeLicenseType[];

/* =========================================================
   MÉTODOS DE PAGO
   ========================================================= */

export const CREATIVE_PAYMENT_METHODS = [
  "YAPE",
] as const satisfies readonly CreativePaymentMethod[];

export const CREATIVE_DEFAULT_PAYMENT_METHOD:
  CreativePaymentMethod =
    "YAPE";

export const CREATIVE_DEFAULT_CURRENCY:
  CreativeCurrency =
    "PEN";

/* =========================================================
   POLÍTICAS DE DESCARGA
   ========================================================= */

export const CREATIVE_DOWNLOAD_POLICIES = [
  "PUBLIC",
  "AFTER_APPROVED_PAYMENT",
  "DISABLED",
] as const satisfies readonly CreativeDownloadPolicy[];

/* =========================================================
   TIPOS DE SOLICITUD
   ========================================================= */

export const CREATIVE_REQUEST_KINDS = [
  "SIMILAR_DESIGN",
  "CUSTOM_LOGO",
  "CUSTOM_FLYER",
  "CUSTOM_PHOTO_EDIT",
  "CUSTOM_BRANDING",
  "CUSTOM_SOCIAL_MEDIA_DESIGN",
  "CUSTOM_OTHER",
] as const satisfies readonly CreativeRequestKind[];

/* =========================================================
   ORDENAMIENTO DEL CATÁLOGO
   ========================================================= */

export const CREATIVE_CATALOG_SORT_VALUES = [
  "newest",
  "oldest",
  "most-viewed",
  "most-liked",
  "most-downloaded",
  "most-popular",
  "price-low-to-high",
  "price-high-to-low",
] as const satisfies readonly CreativeCatalogSort[];

export const CREATIVE_DEFAULT_CATALOG_SORT:
  CreativeCatalogSort =
    "newest";

/* =========================================================
   PAGINACIÓN
   ========================================================= */

export const CREATIVE_PAGINATION = {
  DEFAULT_PAGE:
    1,

  DEFAULT_PAGE_SIZE:
    12,

  MINIMUM_PAGE_SIZE:
    1,

  MAXIMUM_PAGE_SIZE:
    48,

  ADMIN_DEFAULT_PAGE_SIZE:
    20,

  COMMENTS_DEFAULT_PAGE_SIZE:
    10,

  COMMENTS_MAXIMUM_PAGE_SIZE:
    50,

  RELATED_ITEMS_LIMIT:
    6,
} as const;

/* =========================================================
   CONFIGURACIÓN DEL VISOR
   ========================================================= */

export const CREATIVE_VIEWER_ZOOM_LIMITS:
  CreativeViewerZoomLimits = {
    minimum:
      0.5,

    maximum:
      4,

    step:
      0.25,

    defaultScale:
      1,
  };

export const CREATIVE_VIEWER = {
  ZOOM:
    CREATIVE_VIEWER_ZOOM_LIMITS,

  DOUBLE_CLICK_ZOOM:
    2,

  DOUBLE_TAP_DELAY_MS:
    300,

  WHEEL_ZOOM_SENSITIVITY:
    0.0015,

  MINIMUM_DRAG_DISTANCE_PX:
    4,

  TRANSITION_DURATION_MS:
    180,

  CLOSE_TRANSITION_DURATION_MS:
    220,

  NAVIGATION_TRANSITION_DURATION_MS:
    200,

  FULLSCREEN_TRANSITION_DURATION_MS:
    250,

  IMAGE_LOAD_TIMEOUT_MS:
    20_000,

  SIDEBAR_DESKTOP_WIDTH_PX:
    430,

  SIDEBAR_TABLET_WIDTH_PX:
    380,

  MOBILE_BREAKPOINT_PX:
    768,

  DESKTOP_BREAKPOINT_PX:
    1024,

  TOOLBAR_AUTO_HIDE_DELAY_MS:
    3_500,

  REGISTER_VIEW_DELAY_MS:
    1_500,
} as const;

/* =========================================================
   ATAJOS DE TECLADO DEL VISOR
   ========================================================= */

export const CREATIVE_VIEWER_KEYS = {
  CLOSE:
    "Escape",

  ZOOM_IN:
    "+",

  ZOOM_IN_ALTERNATIVE:
    "=",

  ZOOM_OUT:
    "-",

  RESET:
    "0",

  PREVIOUS:
    "ArrowLeft",

  NEXT:
    "ArrowRight",

  FULLSCREEN:
    "f",
} as const;

/* =========================================================
   LÍMITES DE TEXTO
   ========================================================= */

export const CREATIVE_TEXT_LIMITS = {
  SLUG_MIN_LENGTH:
    3,

  SLUG_MAX_LENGTH:
    120,

  TITLE_MIN_LENGTH:
    3,

  TITLE_MAX_LENGTH:
    160,

  SHORT_DESCRIPTION_MIN_LENGTH:
    10,

  SHORT_DESCRIPTION_MAX_LENGTH:
    300,

  DESCRIPTION_MIN_LENGTH:
    20,

  DESCRIPTION_MAX_LENGTH:
    10_000,

  TAG_MIN_LENGTH:
    2,

  TAG_MAX_LENGTH:
    40,

  MAXIMUM_TAGS:
    20,

  AUTHOR_DISPLAY_NAME_MAX_LENGTH:
    120,

  FILE_NAME_MAX_LENGTH:
    180,

  LICENSE_DESCRIPTION_MAX_LENGTH:
    2_000,

  REQUEST_BUTTON_LABEL_MAX_LENGTH:
    80,

  WATERMARK_TEXT_MAX_LENGTH:
    100,

  COMMENT_MIN_LENGTH:
    1,

  COMMENT_MAX_LENGTH:
    2_000,

  COMMENT_REPLY_MAX_DEPTH:
    3,

  REQUEST_SUBJECT_MAX_LENGTH:
    160,

  REQUEST_MESSAGE_MIN_LENGTH:
    10,

  REQUEST_MESSAGE_MAX_LENGTH:
    5_000,

  ADMIN_INTERNAL_NOTE_MAX_LENGTH:
    5_000,

  ORDER_BUYER_NOTE_MAX_LENGTH:
    1_000,

  PAYMENT_OPERATION_NUMBER_MAX_LENGTH:
    80,
} as const;

/* =========================================================
   LÍMITES DE ARCHIVOS
   ========================================================= */

export const CREATIVE_FILE_SIZE_LIMITS = {
  /*
   * Imágenes visibles en el catálogo y visor.
   */
  PREVIEW_IMAGE:
    10 *
    CREATIVE_BYTES.MEGABYTE,

  /*
   * Miniatura optimizada.
   */
  THUMBNAIL_IMAGE:
    5 *
    CREATIVE_BYTES.MEGABYTE,

  /*
   * Archivos editables como AI, PSD o ZIP.
   */
  ORIGINAL_FILE:
    250 *
    CREATIVE_BYTES.MEGABYTE,

  /*
   * Paquete entregable para descargas gratuitas o pagadas.
   */
  DOWNLOAD_FILE:
    500 *
    CREATIVE_BYTES.MEGABYTE,

  /*
   * Captura o comprobante enviado por el comprador.
   */
  PAYMENT_PROOF:
    10 *
    CREATIVE_BYTES.MEGABYTE,

  /*
   * Archivo enviado con una solicitud personalizada.
   */
  REQUEST_ATTACHMENT:
    25 *
    CREATIVE_BYTES.MEGABYTE,

  /*
   * Total permitido por solicitud multipart.
   * Se deja un margen para campos y encabezados.
   */
  REQUEST_OVERHEAD:
    2 *
    CREATIVE_BYTES.MEGABYTE,
} as const;

/* =========================================================
   CANTIDAD DE ARCHIVOS
   ========================================================= */

export const CREATIVE_FILE_COUNT_LIMITS = {
  PREVIEW_IMAGES:
    1,

  THUMBNAIL_IMAGES:
    1,

  ORIGINAL_FILES:
    1,

  DOWNLOAD_FILES:
    1,

  PAYMENT_PROOFS_PER_ORDER:
    5,

  REQUEST_ATTACHMENTS:
    5,

  INCLUDED_FILES_DESCRIPTIONS:
    50,
} as const;

/* =========================================================
   MIME TYPES DE IMÁGENES
   ========================================================= */

export const CREATIVE_ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type CreativeAllowedImageMimeType =
  typeof CREATIVE_ALLOWED_IMAGE_MIME_TYPES[number];

/* =========================================================
   MIME TYPES DE COMPROBANTES
   ========================================================= */

export const CREATIVE_ALLOWED_PAYMENT_PROOF_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export type CreativeAllowedPaymentProofMimeType =
  typeof CREATIVE_ALLOWED_PAYMENT_PROOF_MIME_TYPES[number];

/* =========================================================
   MIME TYPES DE ARCHIVOS ORIGINALES
   ========================================================= */

export const CREATIVE_ALLOWED_ORIGINAL_MIME_TYPES = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/postscript",
  "image/svg+xml",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/octet-stream",
] as const;

export type CreativeAllowedOriginalMimeType =
  typeof CREATIVE_ALLOWED_ORIGINAL_MIME_TYPES[number];

/* =========================================================
   EXTENSIONES DE IMAGEN
   ========================================================= */

export const CREATIVE_ALLOWED_IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
] as const;

/* =========================================================
   EXTENSIONES DE ARCHIVOS ORIGINALES
   ========================================================= */

export const CREATIVE_ALLOWED_ORIGINAL_EXTENSIONS = [
  "ai",
  "psd",
  "pdf",
  "svg",
  "eps",
  "indd",
  "jpg",
  "jpeg",
  "png",
  "webp",
  "zip",
] as const;

/* =========================================================
   EXTENSIONES DE COMPROBANTES
   ========================================================= */

export const CREATIVE_ALLOWED_PAYMENT_PROOF_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "pdf",
] as const;

/* =========================================================
   MARCA DE AGUA
   ========================================================= */

export const CREATIVE_WATERMARK = {
  DEFAULT_ENABLED_FOR_FREE:
    false,

  DEFAULT_ENABLED_FOR_PAID:
    true,

  DEFAULT_ENABLED_FOR_PORTFOLIO:
    true,

  DEFAULT_TEXT:
    "FIXORA",

  DEFAULT_OPACITY:
    0.22,

  MINIMUM_OPACITY:
    0.05,

  MAXIMUM_OPACITY:
    0.75,

  DEFAULT_ROTATION_DEGREES:
    -28,

  DEFAULT_GAP_PX:
    140,

  DEFAULT_FONT_SIZE_PX:
    32,
} as const;

/* =========================================================
   CALIDAD Y GENERACIÓN DE IMÁGENES
   ========================================================= */

export const CREATIVE_IMAGE_PROCESSING = {
  THUMBNAIL_MAX_WIDTH:
    720,

  THUMBNAIL_MAX_HEIGHT:
    720,

  PREVIEW_MAX_WIDTH:
    2_400,

  PREVIEW_MAX_HEIGHT:
    2_400,

  JPEG_QUALITY:
    86,

  WEBP_QUALITY:
    84,

  BLUR_DATA_URL_WIDTH:
    24,

  BLUR_DATA_URL_HEIGHT:
    24,
} as const;

/* =========================================================
   PRECIOS
   ========================================================= */

export const CREATIVE_PRICE_LIMITS = {
  MINIMUM_AMOUNT_IN_CENTS:
    100,

  MAXIMUM_AMOUNT_IN_CENTS:
    10_000_000,

  DEFAULT_AMOUNT_IN_CENTS:
    1_000,
} as const;

/* =========================================================
   PEDIDOS
   ========================================================= */

export const CREATIVE_ORDER = {
  DEFAULT_EXPIRATION_HOURS:
    24,

  DOWNLOAD_GRANT_EXPIRATION_DAYS:
    30,

  DEFAULT_MAXIMUM_DOWNLOADS:
    5,

  PAYMENT_REFERENCE_PREFIX:
    "FIX",

  PAYMENT_REFERENCE_LENGTH:
    12,

  MAXIMUM_PENDING_ORDERS_PER_ITEM:
    1,
} as const;

/* =========================================================
   SOLICITUDES PERSONALIZADAS
   ========================================================= */

export const CREATIVE_REQUEST = {
  MAXIMUM_OPEN_REQUESTS_PER_USER:
    10,

  MAXIMUM_OPEN_REQUESTS_PER_ITEM:
    3,

  DEFAULT_ADMIN_PAGE_SIZE:
    20,

  ATTACHMENT_RETENTION_DAYS:
    180,
} as const;

/* =========================================================
   COMENTARIOS
   ========================================================= */

export const CREATIVE_COMMENTS = {
  DEFAULT_ENABLED:
    true,

  DEFAULT_REQUIRE_AUTHENTICATION:
    true,

  DEFAULT_MODERATION_ENABLED:
    false,

  EDIT_WINDOW_MINUTES:
    30,

  DELETE_WINDOW_MINUTES:
    30,

  MAXIMUM_REPLIES_PER_PAGE:
    20,

  MAXIMUM_COMMENTS_PER_MINUTE:
    5,

  MAXIMUM_REPORTS_BEFORE_REVIEW:
    3,
} as const;

/* =========================================================
   DEDUPLICACIÓN DE VISUALIZACIONES
   ========================================================= */

export const CREATIVE_VIEW_DEDUPLICATION = {
  ENABLED:
    true,

  WINDOW_MS:
    30 *
    60 *
    1_000,

  USE_USER_ID:
    true,

  USE_VISITOR_ID:
    true,

  USE_SESSION_ID:
    true,

  USE_IP_HASH:
    false,
} as const;

/* =========================================================
   RATE LIMITS
   ========================================================= */

export const CREATIVE_RATE_LIMITS = {
  CATALOG: {
    LIMIT:
      120,

    WINDOW_MS:
      60 *
      1_000,
  },

  ITEM_DETAIL: {
    LIMIT:
      120,

    WINDOW_MS:
      60 *
      1_000,
  },

  VIEW: {
    LIMIT:
      120,

    WINDOW_MS:
      60 *
      1_000,
  },

  LIKE: {
    LIMIT:
      60,

    WINDOW_MS:
      60 *
      1_000,
  },

  FAVORITE: {
    LIMIT:
      60,

    WINDOW_MS:
      60 *
      1_000,
  },

  SHARE: {
    LIMIT:
      60,

    WINDOW_MS:
      60 *
      1_000,
  },

  COMMENT_CREATE: {
    LIMIT:
      10,

    WINDOW_MS:
      60 *
      1_000,
  },

  COMMENT_REPORT: {
    LIMIT:
      10,

    WINDOW_MS:
      60 *
      60 *
      1_000,
  },

  DOWNLOAD: {
    LIMIT:
      30,

    WINDOW_MS:
      60 *
      60 *
      1_000,
  },

  PURCHASE: {
    LIMIT:
      10,

    WINDOW_MS:
      60 *
      60 *
      1_000,
  },

  REQUEST: {
    LIMIT:
      10,

    WINDOW_MS:
      60 *
      60 *
      1_000,
  },

  ADMIN_MUTATION: {
    LIMIT:
      120,

    WINDOW_MS:
      60 *
      1_000,
  },

  ADMIN_UPLOAD: {
    LIMIT:
      30,

    WINDOW_MS:
      60 *
      60 *
      1_000,
  },
} as const;

/* =========================================================
   ALMACENAMIENTO PÚBLICO
   ========================================================= */

export const CREATIVE_PUBLIC_STORAGE = {
  ROOT_DIRECTORY:
    "public/uploads/creative",

  PREVIEWS_DIRECTORY:
    "public/uploads/creative/previews",

  THUMBNAILS_DIRECTORY:
    "public/uploads/creative/thumbnails",

  PREVIEW_URL_PREFIX:
    "/uploads/creative/previews/",

  THUMBNAIL_URL_PREFIX:
    "/uploads/creative/thumbnails/",
} as const;

/* =========================================================
   ALMACENAMIENTO PRIVADO
   ========================================================= */

export const CREATIVE_PRIVATE_STORAGE = {
  ROOT_DIRECTORY:
    "storage/creative",

  ORIGINALS_DIRECTORY:
    "storage/creative/originals",

  FREE_DOWNLOADS_DIRECTORY:
    "storage/creative/free-downloads",

  PAYMENT_PROOFS_DIRECTORY:
    "storage/creative/payment-proofs",

  REQUEST_ATTACHMENTS_DIRECTORY:
    "storage/creative/request-attachments",

  TEMP_DIRECTORY:
    "storage/creative/temp",
} as const;

/* =========================================================
   CLAVES DE ALMACENAMIENTO DEL NAVEGADOR
   ========================================================= */

export const CREATIVE_BROWSER_STORAGE_KEYS = {
  CATALOG_FILTERS:
    "fixora-creative-catalog-filters",

  CATALOG_SCROLL_POSITION:
    "fixora-creative-catalog-scroll-position",

  VIEWER_PREFERENCES:
    "fixora-creative-viewer-preferences",

  VIEWER_LAST_ZOOM:
    "fixora-creative-viewer-last-zoom",

  GUEST_VISITOR_ID:
    "fixora-creative-visitor-id",

  RECENTLY_VIEWED:
    "fixora-creative-recently-viewed",
} as const;

/* =========================================================
   COOKIES
   ========================================================= */

export const CREATIVE_COOKIE_NAMES = {
  VISITOR_ID:
    "fixora_creative_visitor",

  CATALOG_PREFERENCES:
    "fixora_creative_catalog",
} as const;

/* =========================================================
   EVENTOS DEL NAVEGADOR
   ========================================================= */

export const CREATIVE_BROWSER_EVENTS = {
  ITEM_UPDATED:
    "fixora:creative:item-updated",

  ITEM_DELETED:
    "fixora:creative:item-deleted",

  INTERACTION_UPDATED:
    "fixora:creative:interaction-updated",

  COMMENTS_UPDATED:
    "fixora:creative:comments-updated",

  ORDER_UPDATED:
    "fixora:creative:order-updated",

  REQUEST_UPDATED:
    "fixora:creative:request-updated",

  SESSION_REQUIRED:
    "fixora:creative:session-required",
} as const;

/* =========================================================
   CONFIGURACIÓN GENERAL
   ========================================================= */

export const CREATIVE_MODULE = {
  NAME:
    "Creative",

  DISPLAY_NAME_ES:
    "Diseño",

  DISPLAY_NAME_EN:
    "Creative",

  DEFAULT_LANGUAGE:
    "es",

  DEFAULT_CONTENT_TYPE:
    "FREE" as CreativeContentType,

  DEFAULT_ITEM_STATUS:
    "DRAFT" as CreativeItemStatus,

  DEFAULT_CATEGORY_ID:
    "other" as CreativeCategoryId,

  DEFAULT_DOWNLOAD_POLICY:
    "PUBLIC" as CreativeDownloadPolicy,

  DEFAULT_LICENSE_TYPE:
    "PERSONAL_USE" as CreativeLicenseType,

  DEFAULT_CATALOG_SORT:
    CREATIVE_DEFAULT_CATALOG_SORT,

  DEFAULT_CURRENCY:
    CREATIVE_DEFAULT_CURRENCY,

  DEFAULT_PAYMENT_METHOD:
    CREATIVE_DEFAULT_PAYMENT_METHOD,
} as const;