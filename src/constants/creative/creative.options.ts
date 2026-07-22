/*
 * Opciones seleccionables del módulo Diseño / Creative.
 *
 * Este archivo centraliza las opciones utilizadas en:
 * - Filtros del catálogo.
 * - Formularios administrativos.
 * - Selectores de categorías.
 * - Selectores de herramientas.
 * - Estados de publicación.
 * - Tipos de contenido.
 * - Licencias.
 * - Políticas de descarga.
 * - Tipos de solicitud.
 * - Formatos de archivos.
 * - Ordenamiento.
 * - Paginación.
 * - Configuración de marca de agua.
 *
 * Los componentes no deben crear manualmente estas opciones.
 * Deben importarlas desde este archivo.
 *
 * No contiene:
 * - Componentes React.
 * - Acceso a Prisma.
 * - Llamadas HTTP.
 * - Lógica de negocio.
 */

import {
  CREATIVE_CATALOG_SORT_VALUES,
  CREATIVE_CATEGORY_IDS,
  CREATIVE_CONTENT_TYPES,
  CREATIVE_DEFAULT_CATALOG_SORT,
  CREATIVE_DEFAULT_CURRENCY,
  CREATIVE_DEFAULT_PAYMENT_METHOD,
  CREATIVE_DOWNLOAD_POLICIES,
  CREATIVE_IMAGE_FORMATS,
  CREATIVE_ITEM_STATUSES,
  CREATIVE_LICENSE_TYPES,
  CREATIVE_ORIENTATIONS,
  CREATIVE_ORIGINAL_FILE_FORMATS,
  CREATIVE_PAGINATION,
  CREATIVE_PAYMENT_METHODS,
  CREATIVE_REQUEST_KINDS,
  CREATIVE_TOOL_IDS,
  CREATIVE_WATERMARK,
} from "@/constants/creative/creative.constants";

import {
  CREATIVE_CATALOG_SORT_COPY,
  CREATIVE_CATEGORY_COPY,
  CREATIVE_CONTENT_TYPE_COPY,
  CREATIVE_DOWNLOAD_POLICY_COPY,
  CREATIVE_ITEM_STATUS_COPY,
  CREATIVE_LICENSE_TYPE_COPY,
  CREATIVE_REQUEST_KIND_COPY,
  CREATIVE_TOOL_COPY,
  getCreativeCopyText,
} from "@/constants/creative/creative.copy";

import type {
  CreativeCatalogSort,
} from "@/types/creative/creative-api.types";

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
  CreativeAdminItemSort,
  CreativeAdminOrderStatus,
  CreativeAdminRequestStatus,
} from "@/types/creative/creative-admin.types";

import type {
  CreativeOrderSort,
  CreativeOrderStatus,
  CreativePaymentProofStatus,
} from "@/types/creative/creative-order.types";

import type {
  CreativeCopyLanguage,
  CreativeLocalizedCopy,
} from "@/constants/creative/creative.copy";

/* =========================================================
   VALORES PERMITIDOS
   ========================================================= */

export type CreativeOptionValue =
  | string
  | number;

/* =========================================================
   OPCIÓN LOCALIZADA
   ========================================================= */

export interface CreativeLocalizedOption<
  TValue extends CreativeOptionValue =
    string,
> {
  value:
    TValue;

  label:
    CreativeLocalizedCopy;

  description?:
    CreativeLocalizedCopy;

  shortLabel?:
    CreativeLocalizedCopy;

  disabled?:
    boolean;

  hidden?:
    boolean;

  order?:
    number;

  keywords?:
    readonly string[];
}

/* =========================================================
   OPCIÓN RESUELTA PARA LA INTERFAZ
   ========================================================= */

export interface CreativeResolvedOption<
  TValue extends CreativeOptionValue =
    string,
> {
  value:
    TValue;

  label:
    string;

  description:
    string | null;

  shortLabel:
    string | null;

  disabled:
    boolean;

  hidden:
    boolean;

  order:
    number;

  keywords:
    readonly string[];
}

/* =========================================================
   GRUPO DE OPCIONES
   ========================================================= */

export interface CreativeOptionGroup<
  TValue extends CreativeOptionValue =
    string,
> {
  id:
    string;

  label:
    CreativeLocalizedCopy;

  description?:
    CreativeLocalizedCopy;

  options:
    readonly CreativeLocalizedOption<TValue>[];
}

/* =========================================================
   GRUPO RESUELTO
   ========================================================= */

export interface CreativeResolvedOptionGroup<
  TValue extends CreativeOptionValue =
    string,
> {
  id:
    string;

  label:
    string;

  description:
    string | null;

  options:
    CreativeResolvedOption<TValue>[];
}

/* =========================================================
   UTILIDAD PARA CREAR TEXTOS
   ========================================================= */

function localized(
  es:
    string,
  en:
    string,
): CreativeLocalizedCopy {
  return {
    es,
    en,
  };
}

/* =========================================================
   TIPOS DE CONTENIDO
   ========================================================= */

export const CREATIVE_CONTENT_TYPE_OPTIONS =
  CREATIVE_CONTENT_TYPES.map(
    (
      contentType,
      index,
    ): CreativeLocalizedOption<CreativeContentType> => ({
      value:
        contentType,

      label:
        CREATIVE_CONTENT_TYPE_COPY[
          contentType
        ].shortName,

      shortLabel:
        CREATIVE_CONTENT_TYPE_COPY[
          contentType
        ].badge,

      description:
        CREATIVE_CONTENT_TYPE_COPY[
          contentType
        ].description,

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        contentType.toLowerCase(),
        CREATIVE_CONTENT_TYPE_COPY[
          contentType
        ].name.es.toLowerCase(),
        CREATIVE_CONTENT_TYPE_COPY[
          contentType
        ].name.en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   ESTADOS DE PUBLICACIÓN
   ========================================================= */

export const CREATIVE_ITEM_STATUS_OPTIONS =
  CREATIVE_ITEM_STATUSES.map(
    (
      status,
      index,
    ): CreativeLocalizedOption<CreativeItemStatus> => ({
      value:
        status,

      label:
        CREATIVE_ITEM_STATUS_COPY[
          status
        ].name,

      description:
        CREATIVE_ITEM_STATUS_COPY[
          status
        ].description,

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        status.toLowerCase(),
        CREATIVE_ITEM_STATUS_COPY[
          status
        ].name.es.toLowerCase(),
        CREATIVE_ITEM_STATUS_COPY[
          status
        ].name.en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   CATEGORÍAS
   ========================================================= */

export const CREATIVE_CATEGORY_OPTIONS =
  CREATIVE_CATEGORY_IDS.map(
    (
      categoryId,
      index,
    ): CreativeLocalizedOption<CreativeCategoryId> => ({
      value:
        categoryId,

      label:
        CREATIVE_CATEGORY_COPY[
          categoryId
        ].name,

      description:
        CREATIVE_CATEGORY_COPY[
          categoryId
        ].description,

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        categoryId,
        CREATIVE_CATEGORY_COPY[
          categoryId
        ].name.es.toLowerCase(),
        CREATIVE_CATEGORY_COPY[
          categoryId
        ].name.en.toLowerCase(),
        CREATIVE_CATEGORY_COPY[
          categoryId
        ].searchKeywords.es.toLowerCase(),
        CREATIVE_CATEGORY_COPY[
          categoryId
        ].searchKeywords.en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   HERRAMIENTAS
   ========================================================= */

export const CREATIVE_TOOL_OPTIONS =
  CREATIVE_TOOL_IDS.map(
    (
      toolId,
      index,
    ): CreativeLocalizedOption<CreativeToolId> => ({
      value:
        toolId,

      label:
        CREATIVE_TOOL_COPY[
          toolId
        ].name,

      shortLabel:
        localized(
          CREATIVE_TOOL_COPY[
            toolId
          ].shortName,
          CREATIVE_TOOL_COPY[
            toolId
          ].shortName,
        ),

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        toolId,
        CREATIVE_TOOL_COPY[
          toolId
        ].name.es.toLowerCase(),
        CREATIVE_TOOL_COPY[
          toolId
        ].name.en.toLowerCase(),
        CREATIVE_TOOL_COPY[
          toolId
        ].shortName.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   LICENCIAS
   ========================================================= */

export const CREATIVE_LICENSE_TYPE_OPTIONS =
  CREATIVE_LICENSE_TYPES.map(
    (
      licenseType,
      index,
    ): CreativeLocalizedOption<CreativeLicenseType> => ({
      value:
        licenseType,

      label:
        CREATIVE_LICENSE_TYPE_COPY[
          licenseType
        ].name,

      shortLabel:
        CREATIVE_LICENSE_TYPE_COPY[
          licenseType
        ].shortDescription,

      description:
        CREATIVE_LICENSE_TYPE_COPY[
          licenseType
        ].description,

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        licenseType.toLowerCase(),
        CREATIVE_LICENSE_TYPE_COPY[
          licenseType
        ].name.es.toLowerCase(),
        CREATIVE_LICENSE_TYPE_COPY[
          licenseType
        ].name.en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   POLÍTICAS DE DESCARGA
   ========================================================= */

export const CREATIVE_DOWNLOAD_POLICY_OPTIONS =
  CREATIVE_DOWNLOAD_POLICIES.map(
    (
      policy,
      index,
    ): CreativeLocalizedOption<CreativeDownloadPolicy> => ({
      value:
        policy,

      label:
        CREATIVE_DOWNLOAD_POLICY_COPY[
          policy
        ].name,

      shortLabel:
        CREATIVE_DOWNLOAD_POLICY_COPY[
          policy
        ].requirement,

      description:
        CREATIVE_DOWNLOAD_POLICY_COPY[
          policy
        ].description,

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        policy.toLowerCase(),
        CREATIVE_DOWNLOAD_POLICY_COPY[
          policy
        ].name.es.toLowerCase(),
        CREATIVE_DOWNLOAD_POLICY_COPY[
          policy
        ].name.en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   TIPOS DE SOLICITUD
   ========================================================= */

export const CREATIVE_REQUEST_KIND_OPTIONS =
  CREATIVE_REQUEST_KINDS.map(
    (
      requestKind,
      index,
    ): CreativeLocalizedOption<CreativeRequestKind> => ({
      value:
        requestKind,

      label:
        CREATIVE_REQUEST_KIND_COPY[
          requestKind
        ].name,

      shortLabel:
        CREATIVE_REQUEST_KIND_COPY[
          requestKind
        ].buttonLabel,

      description:
        CREATIVE_REQUEST_KIND_COPY[
          requestKind
        ].description,

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        requestKind.toLowerCase(),
        CREATIVE_REQUEST_KIND_COPY[
          requestKind
        ].name.es.toLowerCase(),
        CREATIVE_REQUEST_KIND_COPY[
          requestKind
        ].name.en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   ORDENAMIENTO DEL CATÁLOGO
   ========================================================= */

export const CREATIVE_CATALOG_SORT_OPTIONS =
  CREATIVE_CATALOG_SORT_VALUES.map(
    (
      sort,
      index,
    ): CreativeLocalizedOption<CreativeCatalogSort> => ({
      value:
        sort,

      label:
        CREATIVE_CATALOG_SORT_COPY[
          sort
        ],

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        sort,
        CREATIVE_CATALOG_SORT_COPY[
          sort
        ].es.toLowerCase(),
        CREATIVE_CATALOG_SORT_COPY[
          sort
        ].en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   FORMATOS DE IMAGEN
   ========================================================= */

const CREATIVE_IMAGE_FORMAT_LABELS:
  Record<
    CreativeImageFormat,
    CreativeLocalizedCopy
  > = {
    JPEG:
      localized(
        "JPEG",
        "JPEG",
      ),

    PNG:
      localized(
        "PNG",
        "PNG",
      ),

    WEBP:
      localized(
        "WebP",
        "WebP",
      ),
  };

export const CREATIVE_IMAGE_FORMAT_OPTIONS =
  CREATIVE_IMAGE_FORMATS.map(
    (
      format,
      index,
    ): CreativeLocalizedOption<CreativeImageFormat> => ({
      value:
        format,

      label:
        CREATIVE_IMAGE_FORMAT_LABELS[
          format
        ],

      description:
        format ===
          "PNG"
          ? localized(
              "Formato compatible con transparencia.",
              "Format compatible with transparency.",
            )
          : format ===
              "WEBP"
            ? localized(
                "Formato optimizado para la web.",
                "Web-optimized format.",
              )
            : localized(
                "Formato fotográfico de alta compatibilidad.",
                "Highly compatible photographic format.",
              ),

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        format.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   FORMATOS DE ARCHIVO ORIGINAL
   ========================================================= */

const CREATIVE_ORIGINAL_FILE_FORMAT_LABELS:
  Record<
    CreativeOriginalFileFormat,
    CreativeLocalizedCopy
  > = {
    AI:
      localized(
        "Adobe Illustrator (.ai)",
        "Adobe Illustrator (.ai)",
      ),

    PSD:
      localized(
        "Adobe Photoshop (.psd)",
        "Adobe Photoshop (.psd)",
      ),

    PDF:
      localized(
        "Documento PDF (.pdf)",
        "PDF document (.pdf)",
      ),

    SVG:
      localized(
        "Gráfico vectorial SVG (.svg)",
        "SVG vector graphic (.svg)",
      ),

    EPS:
      localized(
        "Gráfico vectorial EPS (.eps)",
        "EPS vector graphic (.eps)",
      ),

    INDD:
      localized(
        "Adobe InDesign (.indd)",
        "Adobe InDesign (.indd)",
      ),

    JPEG:
      localized(
        "Imagen JPEG (.jpg, .jpeg)",
        "JPEG image (.jpg, .jpeg)",
      ),

    PNG:
      localized(
        "Imagen PNG (.png)",
        "PNG image (.png)",
      ),

    WEBP:
      localized(
        "Imagen WebP (.webp)",
        "WebP image (.webp)",
      ),

    ZIP:
      localized(
        "Archivo comprimido ZIP (.zip)",
        "Compressed ZIP file (.zip)",
      ),

    OTHER:
      localized(
        "Otro formato",
        "Other format",
      ),
  };

export const CREATIVE_ORIGINAL_FILE_FORMAT_OPTIONS =
  CREATIVE_ORIGINAL_FILE_FORMATS.map(
    (
      format,
      index,
    ): CreativeLocalizedOption<CreativeOriginalFileFormat> => ({
      value:
        format,

      label:
        CREATIVE_ORIGINAL_FILE_FORMAT_LABELS[
          format
        ],

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        format.toLowerCase(),
        CREATIVE_ORIGINAL_FILE_FORMAT_LABELS[
          format
        ].es.toLowerCase(),
        CREATIVE_ORIGINAL_FILE_FORMAT_LABELS[
          format
        ].en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   ORIENTACIÓN DE LA IMAGEN
   ========================================================= */

const CREATIVE_ORIENTATION_LABELS:
  Record<
    CreativeOrientation,
    CreativeLocalizedCopy
  > = {
    SQUARE:
      localized(
        "Cuadrada",
        "Square",
      ),

    PORTRAIT:
      localized(
        "Vertical",
        "Portrait",
      ),

    LANDSCAPE:
      localized(
        "Horizontal",
        "Landscape",
      ),

    PANORAMIC:
      localized(
        "Panorámica",
        "Panoramic",
      ),
  };

const CREATIVE_ORIENTATION_DESCRIPTIONS:
  Record<
    CreativeOrientation,
    CreativeLocalizedCopy
  > = {
    SQUARE:
      localized(
        "La imagen tiene el mismo ancho y alto.",
        "The image has the same width and height.",
      ),

    PORTRAIT:
      localized(
        "La altura de la imagen es mayor que su ancho.",
        "The image height is greater than its width.",
      ),

    LANDSCAPE:
      localized(
        "El ancho de la imagen es mayor que su altura.",
        "The image width is greater than its height.",
      ),

    PANORAMIC:
      localized(
        "Imagen horizontal con una proporción especialmente amplia.",
        "Horizontal image with an especially wide aspect ratio.",
      ),
  };

export const CREATIVE_ORIENTATION_OPTIONS =
  CREATIVE_ORIENTATIONS.map(
    (
      orientation,
      index,
    ): CreativeLocalizedOption<CreativeOrientation> => ({
      value:
        orientation,

      label:
        CREATIVE_ORIENTATION_LABELS[
          orientation
        ],

      description:
        CREATIVE_ORIENTATION_DESCRIPTIONS[
          orientation
        ],

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        orientation.toLowerCase(),
        CREATIVE_ORIENTATION_LABELS[
          orientation
        ].es.toLowerCase(),
        CREATIVE_ORIENTATION_LABELS[
          orientation
        ].en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   MÉTODOS DE PAGO
   ========================================================= */

const CREATIVE_PAYMENT_METHOD_LABELS:
  Record<
    CreativePaymentMethod,
    CreativeLocalizedCopy
  > = {
    YAPE:
      localized(
        "Yape",
        "Yape",
      ),
  };

export const CREATIVE_PAYMENT_METHOD_OPTIONS =
  CREATIVE_PAYMENT_METHODS.map(
    (
      paymentMethod,
      index,
    ): CreativeLocalizedOption<CreativePaymentMethod> => ({
      value:
        paymentMethod,

      label:
        CREATIVE_PAYMENT_METHOD_LABELS[
          paymentMethod
        ],

      description:
        localized(
          "Pago móvil sujeto a confirmación administrativa.",
          "Mobile payment subject to administrative approval.",
        ),

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        paymentMethod.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   MONEDAS
   ========================================================= */

export const CREATIVE_CURRENCY_OPTIONS:
  readonly CreativeLocalizedOption<CreativeCurrency>[] = [
    {
      value:
        "PEN",

      label:
        localized(
          "Soles peruanos (PEN)",
          "Peruvian soles (PEN)",
        ),

      shortLabel:
        localized(
          "S/",
          "S/",
        ),

      description:
        localized(
          "Moneda oficial utilizada para las compras del módulo.",
          "Official currency used for purchases in this module.",
        ),

      disabled:
        false,

      hidden:
        false,

      order:
        1,

      keywords: [
        "pen",
        "sol",
        "soles",
        "peru",
        "perú",
      ],
    },
  ];

/* =========================================================
   TAMAÑOS DE PÁGINA DEL CATÁLOGO
   ========================================================= */

export const CREATIVE_CATALOG_PAGE_SIZE_OPTIONS:
  readonly CreativeLocalizedOption<number>[] = [
    {
      value:
        8,

      label:
        localized(
          "8 diseños",
          "8 designs",
        ),

      order:
        1,
    },
    {
      value:
        12,

      label:
        localized(
          "12 diseños",
          "12 designs",
        ),

      order:
        2,
    },
    {
      value:
        24,

      label:
        localized(
          "24 diseños",
          "24 designs",
        ),

      order:
        3,
    },
    {
      value:
        36,

      label:
        localized(
          "36 diseños",
          "36 designs",
        ),

      order:
        4,
    },
    {
      value:
        48,

      label:
        localized(
          "48 diseños",
          "48 designs",
        ),

      order:
        5,
    },
  ];

/* =========================================================
   TAMAÑOS DE PÁGINA DEL PANEL ADMINISTRATIVO
   ========================================================= */

export const CREATIVE_ADMIN_PAGE_SIZE_OPTIONS:
  readonly CreativeLocalizedOption<number>[] = [
    {
      value:
        10,

      label:
        localized(
          "10 elementos",
          "10 items",
        ),

      order:
        1,
    },
    {
      value:
        20,

      label:
        localized(
          "20 elementos",
          "20 items",
        ),

      order:
        2,
    },
    {
      value:
        30,

      label:
        localized(
          "30 elementos",
          "30 items",
        ),

      order:
        3,
    },
    {
      value:
        50,

      label:
        localized(
          "50 elementos",
          "50 items",
        ),

      order:
        4,
    },
  ];

/* =========================================================
   TAMAÑOS DE PÁGINA DE COMENTARIOS
   ========================================================= */

export const CREATIVE_COMMENT_PAGE_SIZE_OPTIONS:
  readonly CreativeLocalizedOption<number>[] = [
    {
      value:
        5,

      label:
        localized(
          "5 comentarios",
          "5 comments",
        ),

      order:
        1,
    },
    {
      value:
        10,

      label:
        localized(
          "10 comentarios",
          "10 comments",
        ),

      order:
        2,
    },
    {
      value:
        20,

      label:
        localized(
          "20 comentarios",
          "20 comments",
        ),

      order:
        3,
    },
    {
      value:
        50,

      label:
        localized(
          "50 comentarios",
          "50 comments",
        ),

      order:
        4,
    },
  ];

/* =========================================================
   ORDENAMIENTO ADMINISTRATIVO DE PUBLICACIONES
   ========================================================= */

export const CREATIVE_ADMIN_ITEM_SORT_OPTIONS:
  readonly CreativeLocalizedOption<CreativeAdminItemSort>[] = [
    {
      value:
        "NEWEST",

      label:
        localized(
          "Más recientes",
          "Newest",
        ),

      order:
        1,
    },
    {
      value:
        "OLDEST",

      label:
        localized(
          "Más antiguos",
          "Oldest",
        ),

      order:
        2,
    },
    {
      value:
        "LAST_UPDATED",

      label:
        localized(
          "Actualizados recientemente",
          "Recently updated",
        ),

      order:
        3,
    },
    {
      value:
        "TITLE_ASC",

      label:
        localized(
          "Título: A–Z",
          "Title: A–Z",
        ),

      order:
        4,
    },
    {
      value:
        "TITLE_DESC",

      label:
        localized(
          "Título: Z–A",
          "Title: Z–A",
        ),

      order:
        5,
    },
    {
      value:
        "MOST_VIEWED",

      label:
        localized(
          "Más vistos",
          "Most viewed",
        ),

      order:
        6,
    },
    {
      value:
        "MOST_LIKED",

      label:
        localized(
          "Más gustados",
          "Most liked",
        ),

      order:
        7,
    },
    {
      value:
        "MOST_DOWNLOADED",

      label:
        localized(
          "Más descargados",
          "Most downloaded",
        ),

      order:
        8,
    },
    {
      value:
        "MOST_PURCHASED",

      label:
        localized(
          "Más comprados",
          "Most purchased",
        ),

      order:
        9,
    },
  ];

/* =========================================================
   ESTADOS DE PEDIDOS
   ========================================================= */

const CREATIVE_ORDER_STATUS_LABELS:
  Record<
    CreativeOrderStatus,
    CreativeLocalizedCopy
  > = {
    PENDING_PAYMENT:
      localized(
        "Pendiente de pago",
        "Pending payment",
      ),

    PAYMENT_SUBMITTED:
      localized(
        "Comprobante enviado",
        "Payment proof submitted",
      ),

    PAYMENT_APPROVED:
      localized(
        "Pago aprobado",
        "Payment approved",
      ),

    PAYMENT_REJECTED:
      localized(
        "Pago rechazado",
        "Payment rejected",
      ),

    COMPLETED:
      localized(
        "Completado",
        "Completed",
      ),

    CANCELLED:
      localized(
        "Cancelado",
        "Cancelled",
      ),

    EXPIRED:
      localized(
        "Vencido",
        "Expired",
      ),

    REFUNDED:
      localized(
        "Reembolsado",
        "Refunded",
      ),
  };

export const CREATIVE_ORDER_STATUS_OPTIONS =
  (
    Object.keys(
      CREATIVE_ORDER_STATUS_LABELS,
    ) as CreativeOrderStatus[]
  ).map(
    (
      status,
      index,
    ): CreativeLocalizedOption<CreativeOrderStatus> => ({
      value:
        status,

      label:
        CREATIVE_ORDER_STATUS_LABELS[
          status
        ],

      disabled:
        false,

      hidden:
        false,

      order:
        index + 1,

      keywords: [
        status.toLowerCase(),
        CREATIVE_ORDER_STATUS_LABELS[
          status
        ].es.toLowerCase(),
        CREATIVE_ORDER_STATUS_LABELS[
          status
        ].en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   ESTADOS ADMINISTRATIVOS DE PEDIDOS
   ========================================================= */

const CREATIVE_ADMIN_ORDER_STATUS_LABELS:
  Record<
    CreativeAdminOrderStatus,
    CreativeLocalizedCopy
  > = {
    PENDING_PAYMENT:
      localized(
        "Pendiente de pago",
        "Pending payment",
      ),

    PAYMENT_SUBMITTED:
      localized(
        "Pendiente de revisión",
        "Pending review",
      ),

    PAYMENT_APPROVED:
      localized(
        "Pago aprobado",
        "Payment approved",
      ),

    PAYMENT_REJECTED:
      localized(
        "Pago rechazado",
        "Payment rejected",
      ),

    COMPLETED:
      localized(
        "Completado",
        "Completed",
      ),

    CANCELLED:
      localized(
        "Cancelado",
        "Cancelled",
      ),

    REFUNDED:
      localized(
        "Reembolsado",
        "Refunded",
      ),
  };

export const CREATIVE_ADMIN_ORDER_STATUS_OPTIONS =
  (
    Object.keys(
      CREATIVE_ADMIN_ORDER_STATUS_LABELS,
    ) as CreativeAdminOrderStatus[]
  ).map(
    (
      status,
      index,
    ): CreativeLocalizedOption<CreativeAdminOrderStatus> => ({
      value:
        status,

      label:
        CREATIVE_ADMIN_ORDER_STATUS_LABELS[
          status
        ],

      order:
        index + 1,

      keywords: [
        status.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   ESTADOS DE COMPROBANTES
   ========================================================= */

const CREATIVE_PAYMENT_PROOF_STATUS_LABELS:
  Record<
    CreativePaymentProofStatus,
    CreativeLocalizedCopy
  > = {
    PENDING_REVIEW:
      localized(
        "Pendiente de revisión",
        "Pending review",
      ),

    APPROVED:
      localized(
        "Aprobado",
        "Approved",
      ),

    REJECTED:
      localized(
        "Rechazado",
        "Rejected",
      ),

    REPLACED:
      localized(
        "Reemplazado",
        "Replaced",
      ),

    REMOVED:
      localized(
        "Eliminado",
        "Removed",
      ),
  };

export const CREATIVE_PAYMENT_PROOF_STATUS_OPTIONS =
  (
    Object.keys(
      CREATIVE_PAYMENT_PROOF_STATUS_LABELS,
    ) as CreativePaymentProofStatus[]
  ).map(
    (
      status,
      index,
    ): CreativeLocalizedOption<CreativePaymentProofStatus> => ({
      value:
        status,

      label:
        CREATIVE_PAYMENT_PROOF_STATUS_LABELS[
          status
        ],

      order:
        index + 1,

      keywords: [
        status.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   ORDENAMIENTO DE PEDIDOS
   ========================================================= */

export const CREATIVE_ORDER_SORT_OPTIONS:
  readonly CreativeLocalizedOption<CreativeOrderSort>[] = [
    {
      value:
        "NEWEST",

      label:
        localized(
          "Más recientes",
          "Newest",
        ),

      order:
        1,
    },
    {
      value:
        "OLDEST",

      label:
        localized(
          "Más antiguos",
          "Oldest",
        ),

      order:
        2,
    },
    {
      value:
        "LAST_UPDATED",

      label:
        localized(
          "Actualizados recientemente",
          "Recently updated",
        ),

      order:
        3,
    },
    {
      value:
        "AMOUNT_ASC",

      label:
        localized(
          "Monto: menor a mayor",
          "Amount: low to high",
        ),

      order:
        4,
    },
    {
      value:
        "AMOUNT_DESC",

      label:
        localized(
          "Monto: mayor a menor",
          "Amount: high to low",
        ),

      order:
        5,
    },
    {
      value:
        "PAYMENT_SUBMITTED_FIRST",

      label:
        localized(
          "Comprobantes enviados primero",
          "Submitted proofs first",
        ),

      order:
        6,
    },
    {
      value:
        "PENDING_REVIEW_FIRST",

      label:
        localized(
          "Pendientes de revisión primero",
          "Pending review first",
        ),

      order:
        7,
    },
  ];

/* =========================================================
   ESTADOS DE SOLICITUDES
   ========================================================= */

const CREATIVE_ADMIN_REQUEST_STATUS_LABELS:
  Record<
    CreativeAdminRequestStatus,
    CreativeLocalizedCopy
  > = {
    PENDING:
      localized(
        "Pendiente",
        "Pending",
      ),

    CONTACTED:
      localized(
        "Cliente contactado",
        "Customer contacted",
      ),

    IN_PROGRESS:
      localized(
        "En proceso",
        "In progress",
      ),

    AWAITING_CLIENT:
      localized(
        "Esperando al cliente",
        "Awaiting customer",
      ),

    COMPLETED:
      localized(
        "Completada",
        "Completed",
      ),

    CANCELLED:
      localized(
        "Cancelada",
        "Cancelled",
      ),

    REJECTED:
      localized(
        "Rechazada",
        "Rejected",
      ),
  };

export const CREATIVE_ADMIN_REQUEST_STATUS_OPTIONS =
  (
    Object.keys(
      CREATIVE_ADMIN_REQUEST_STATUS_LABELS,
    ) as CreativeAdminRequestStatus[]
  ).map(
    (
      status,
      index,
    ): CreativeLocalizedOption<CreativeAdminRequestStatus> => ({
      value:
        status,

      label:
        CREATIVE_ADMIN_REQUEST_STATUS_LABELS[
          status
        ],

      order:
        index + 1,

      keywords: [
        status.toLowerCase(),
        CREATIVE_ADMIN_REQUEST_STATUS_LABELS[
          status
        ].es.toLowerCase(),
        CREATIVE_ADMIN_REQUEST_STATUS_LABELS[
          status
        ].en.toLowerCase(),
      ],
    }),
  );

/* =========================================================
   OPACIDAD DE MARCA DE AGUA
   ========================================================= */

export const CREATIVE_WATERMARK_OPACITY_OPTIONS:
  readonly CreativeLocalizedOption<number>[] = [
    {
      value:
        0.1,

      label:
        localized(
          "10 % — Muy suave",
          "10% — Very subtle",
        ),

      order:
        1,
    },
    {
      value:
        0.15,

      label:
        localized(
          "15 % — Suave",
          "15% — Subtle",
        ),

      order:
        2,
    },
    {
      value:
        CREATIVE_WATERMARK.DEFAULT_OPACITY,

      label:
        localized(
          "22 % — Recomendado",
          "22% — Recommended",
        ),

      order:
        3,
    },
    {
      value:
        0.3,

      label:
        localized(
          "30 % — Visible",
          "30% — Visible",
        ),

      order:
        4,
    },
    {
      value:
        0.4,

      label:
        localized(
          "40 % — Intenso",
          "40% — Strong",
        ),

      order:
        5,
    },
    {
      value:
        0.5,

      label:
        localized(
          "50 % — Muy intenso",
          "50% — Very strong",
        ),

      order:
        6,
    },
  ];

/* =========================================================
   VALORES PREDETERMINADOS
   ========================================================= */

export const CREATIVE_DEFAULT_OPTIONS = {
  CONTENT_TYPE:
    "FREE" as CreativeContentType,

  ITEM_STATUS:
    "DRAFT" as CreativeItemStatus,

  CATEGORY:
    "other" as CreativeCategoryId,

  CATALOG_SORT:
    CREATIVE_DEFAULT_CATALOG_SORT,

  CATALOG_PAGE_SIZE:
    CREATIVE_PAGINATION.DEFAULT_PAGE_SIZE,

  ADMIN_PAGE_SIZE:
    CREATIVE_PAGINATION.ADMIN_DEFAULT_PAGE_SIZE,

  COMMENTS_PAGE_SIZE:
    CREATIVE_PAGINATION.COMMENTS_DEFAULT_PAGE_SIZE,

  PAYMENT_METHOD:
    CREATIVE_DEFAULT_PAYMENT_METHOD,

  CURRENCY:
    CREATIVE_DEFAULT_CURRENCY,

  LICENSE_TYPE:
    "PERSONAL_USE" as CreativeLicenseType,

  FREE_DOWNLOAD_POLICY:
    "PUBLIC" as CreativeDownloadPolicy,

  PAID_DOWNLOAD_POLICY:
    "AFTER_APPROVED_PAYMENT" as CreativeDownloadPolicy,

  PORTFOLIO_DOWNLOAD_POLICY:
    "DISABLED" as CreativeDownloadPolicy,

  WATERMARK_OPACITY:
    CREATIVE_WATERMARK.DEFAULT_OPACITY,
} as const;

/* =========================================================
   OPCIONES AGRUPADAS DEL FORMULARIO
   ========================================================= */

export const CREATIVE_ADMIN_FORM_OPTION_GROUPS = {
  CONTENT:
    {
      id:
        "content",

      label:
        localized(
          "Contenido",
          "Content",
        ),

      description:
        localized(
          "Configuración principal de la publicación.",
          "Main publication settings.",
        ),

      options:
        CREATIVE_CONTENT_TYPE_OPTIONS,
    } satisfies CreativeOptionGroup<CreativeContentType>,

  PUBLICATION:
    {
      id:
        "publication",

      label:
        localized(
          "Publicación",
          "Publication",
        ),

      description:
        localized(
          "Estado y visibilidad dentro del catálogo.",
          "Status and visibility within the catalog.",
        ),

      options:
        CREATIVE_ITEM_STATUS_OPTIONS,
    } satisfies CreativeOptionGroup<CreativeItemStatus>,

  CATEGORY:
    {
      id:
        "category",

      label:
        localized(
          "Categoría",
          "Category",
        ),

      description:
        localized(
          "Clasificación principal del trabajo.",
          "Main classification of the work.",
        ),

      options:
        CREATIVE_CATEGORY_OPTIONS,
    } satisfies CreativeOptionGroup<CreativeCategoryId>,

  TOOLS:
    {
      id:
        "tools",

      label:
        localized(
          "Herramientas",
          "Tools",
        ),

      description:
        localized(
          "Programas utilizados para crear el diseño.",
          "Programs used to create the design.",
        ),

      options:
        CREATIVE_TOOL_OPTIONS,
    } satisfies CreativeOptionGroup<CreativeToolId>,

  LICENSE:
    {
      id:
        "license",

      label:
        localized(
          "Licencia",
          "License",
        ),

      description:
        localized(
          "Condiciones permitidas para utilizar el archivo.",
          "Conditions allowed for using the file.",
        ),

      options:
        CREATIVE_LICENSE_TYPE_OPTIONS,
    } satisfies CreativeOptionGroup<CreativeLicenseType>,
} as const;

/* =========================================================
   RESOLVER UNA OPCIÓN
   ========================================================= */

export function resolveCreativeOption<
  TValue extends CreativeOptionValue,
>(
  option:
    CreativeLocalizedOption<TValue>,
  language:
    CreativeCopyLanguage,
): CreativeResolvedOption<TValue> {
  return {
    value:
      option.value,

    label:
      getCreativeCopyText(
        option.label,
        language,
      ),

    description:
      option.description
        ? getCreativeCopyText(
            option.description,
            language,
          )
        : null,

    shortLabel:
      option.shortLabel
        ? getCreativeCopyText(
            option.shortLabel,
            language,
          )
        : null,

    disabled:
      option.disabled ??
      false,

    hidden:
      option.hidden ??
      false,

    order:
      option.order ??
      0,

    keywords:
      option.keywords ??
      [],
  };
}

/* =========================================================
   RESOLVER UNA LISTA DE OPCIONES
   ========================================================= */

export function resolveCreativeOptions<
  TValue extends CreativeOptionValue,
>(
  options:
    readonly CreativeLocalizedOption<TValue>[],
  language:
    CreativeCopyLanguage,
  settings: {
    includeHidden?:
      boolean;

    includeDisabled?:
      boolean;

    sortByOrder?:
      boolean;
  } = {},
): CreativeResolvedOption<TValue>[] {
  const {
    includeHidden =
      false,

    includeDisabled =
      true,

    sortByOrder =
      true,
  } =
    settings;

  const resolvedOptions =
    options
      .map(
        (
          option,
        ) =>
          resolveCreativeOption(
            option,
            language,
          ),
      )
      .filter(
        (
          option,
        ) =>
          includeHidden ||
          !option.hidden,
      )
      .filter(
        (
          option,
        ) =>
          includeDisabled ||
          !option.disabled,
      );

  if (
    sortByOrder
  ) {
    resolvedOptions.sort(
      (
        first,
        second,
      ) =>
        first.order -
        second.order,
    );
  }

  return resolvedOptions;
}

/* =========================================================
   RESOLVER UN GRUPO
   ========================================================= */

export function resolveCreativeOptionGroup<
  TValue extends CreativeOptionValue,
>(
  group:
    CreativeOptionGroup<TValue>,
  language:
    CreativeCopyLanguage,
): CreativeResolvedOptionGroup<TValue> {
  return {
    id:
      group.id,

    label:
      getCreativeCopyText(
        group.label,
        language,
      ),

    description:
      group.description
        ? getCreativeCopyText(
            group.description,
            language,
          )
        : null,

    options:
      resolveCreativeOptions(
        group.options,
        language,
      ),
  };
}

/* =========================================================
   BUSCAR UNA OPCIÓN
   ========================================================= */

export function findCreativeOption<
  TValue extends CreativeOptionValue,
>(
  options:
    readonly CreativeLocalizedOption<TValue>[],
  value:
    TValue | null | undefined,
): CreativeLocalizedOption<TValue> | null {
  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return null;
  }

  return (
    options.find(
      (
        option,
      ) =>
        option.value ===
        value,
    ) ??
    null
  );
}

/* =========================================================
   OBTENER LA ETIQUETA DE UNA OPCIÓN
   ========================================================= */

export function getCreativeOptionLabel<
  TValue extends CreativeOptionValue,
>(
  options:
    readonly CreativeLocalizedOption<TValue>[],
  value:
    TValue | null | undefined,
  language:
    CreativeCopyLanguage,
  fallback =
    "",
): string {
  const option =
    findCreativeOption(
      options,
      value,
    );

  if (!option) {
    return fallback;
  }

  return getCreativeCopyText(
    option.label,
    language,
  );
}

/* =========================================================
   VALIDAR UN VALOR
   ========================================================= */

export function isCreativeOptionValue<
  TValue extends CreativeOptionValue,
>(
  options:
    readonly CreativeLocalizedOption<TValue>[],
  value:
    unknown,
): value is TValue {
  return options.some(
    (
      option,
    ) =>
      option.value ===
      value,
  );
}

/* =========================================================
   FILTRAR OPCIONES MEDIANTE TEXTO
   ========================================================= */

export function searchCreativeOptions<
  TValue extends CreativeOptionValue,
>(
  options:
    readonly CreativeLocalizedOption<TValue>[],
  search:
    string,
  language:
    CreativeCopyLanguage,
): CreativeResolvedOption<TValue>[] {
  const normalizedSearch =
    search
      .trim()
      .toLocaleLowerCase(
        language ===
          "es"
          ? "es-PE"
          : "en-US",
      );

  const resolvedOptions =
    resolveCreativeOptions(
      options,
      language,
    );

  if (
    !normalizedSearch
  ) {
    return resolvedOptions;
  }

  return resolvedOptions.filter(
    (
      option,
    ) => {
      const searchableText =
        [
          option.label,
          option.shortLabel ??
            "",
          option.description ??
            "",
          ...option.keywords,
        ]
          .join(
            " ",
          )
          .toLocaleLowerCase(
            language ===
              "es"
              ? "es-PE"
              : "en-US",
          );

      return searchableText.includes(
        normalizedSearch,
      );
    },
  );
}

/* =========================================================
   OPCIONES SEGÚN EL TIPO DE CONTENIDO
   ========================================================= */

export function getCreativeDownloadPolicyForContentType(
  contentType:
    CreativeContentType,
): CreativeDownloadPolicy {
  switch (
    contentType
  ) {
    case "FREE":
      return "PUBLIC";

    case "PAID":
      return "AFTER_APPROVED_PAYMENT";

    case "PORTFOLIO":
      return "DISABLED";
  }
}

/* =========================================================
   OPCIONES DE FORMULARIO SEGÚN EL CONTENIDO
   ========================================================= */

export interface CreativeContentTypeFormOptions {
  showPrice:
    boolean;

  showPaymentMethods:
    boolean;

  showRequestKind:
    boolean;

  showRequestButtonLabels:
    boolean;

  showDownloadFile:
    boolean;

  showOriginalFile:
    boolean;

  showWatermark:
    boolean;

  downloadPolicy:
    CreativeDownloadPolicy;
}

export function getCreativeContentTypeFormOptions(
  contentType:
    CreativeContentType,
): CreativeContentTypeFormOptions {
  switch (
    contentType
  ) {
    case "FREE":
      return {
        showPrice:
          false,

        showPaymentMethods:
          false,

        showRequestKind:
          false,

        showRequestButtonLabels:
          false,

        showDownloadFile:
          true,

        showOriginalFile:
          true,

        showWatermark:
          false,

        downloadPolicy:
          "PUBLIC",
      };

    case "PAID":
      return {
        showPrice:
          true,

        showPaymentMethods:
          true,

        showRequestKind:
          false,

        showRequestButtonLabels:
          false,

        showDownloadFile:
          true,

        showOriginalFile:
          true,

        showWatermark:
          true,

        downloadPolicy:
          "AFTER_APPROVED_PAYMENT",
      };

    case "PORTFOLIO":
      return {
        showPrice:
          false,

        showPaymentMethods:
          false,

        showRequestKind:
          true,

        showRequestButtonLabels:
          true,

        showDownloadFile:
          false,

        showOriginalFile:
          false,

        showWatermark:
          true,

        downloadPolicy:
          "DISABLED",
      };
  }
}