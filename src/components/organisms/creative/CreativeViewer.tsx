"use client";

/*
 * Visor premium del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar la vista previa del diseño.
 * - Ocultar visualmente la navegación principal mediante overlay.
 * - Permitir zoom entre 50 % y 400 %.
 * - Permitir desplazamiento de la imagen ampliada.
 * - Permitir navegación anterior y siguiente.
 * - Permitir pantalla completa.
 * - Cerrar mediante la tecla Escape.
 * - Mostrar detalles, herramientas, etiquetas y licencia.
 * - Mostrar interacciones.
 * - Mostrar descarga, compra o solicitud según el tipo.
 * - Mostrar controles administrativos cuando corresponda.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Acceso directo a Prisma.
 * - Confirmaciones administrativas.
 *
 * Todas las operaciones externas son controladas por el padre.
 */

import Image from "next/image";

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type {
  HTMLAttributes,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  WheelEvent as ReactWheelEvent,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

import {
  CreativeAdminActions,
} from "@/components/molecules/creative/CreativeAdminActions";

import type {
  CreativeAdminLoadingAction,
} from "@/components/molecules/creative/CreativeAdminActions";

import {
  CreativeInteractionBar,
} from "@/components/molecules/creative/CreativeInteractionBar";

import type {
  CreativeInteractionLoadingAction,
} from "@/components/molecules/creative/CreativeInteractionBar";

import {
  CreativePurchaseCard,
} from "@/components/molecules/creative/CreativePurchaseCard";

import type {
  CreativePurchaseLoadingAction,
  CreativePurchaseStatus,
} from "@/components/molecules/creative/CreativePurchaseCard";

import {
  CreativeRequestCard,
} from "@/components/molecules/creative/CreativeRequestCard";

import type {
  CreativeRequestLoadingAction,
  CreativeRequestStatus,
  CreativeRequestValues,
} from "@/components/molecules/creative/CreativeRequestCard";

import {
  CreativeViewerToolbar,
} from "@/components/molecules/creative/CreativeViewerToolbar";

import type {
  CreativeContentType,
  CreativeCurrency,
  CreativeItemStatus,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeViewerLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeViewerSize =
  | "default"
  | "wide";

/* =========================================================
   ELEMENTO DEL VISOR
   ========================================================= */

export interface CreativeViewerItem {
  id:
    string;

  slug?:
    string | null;

  title:
    string;

  description?:
    string | null;

  previewUrl?:
    string | null;

  previewAlt?:
    string | null;

  contentType:
    CreativeContentType;

  status?:
    CreativeItemStatus;

  categoryLabel?:
    string | null;

  authorName?:
    string | null;

  publishedAtLabel?:
    string | null;

  resolution?:
    string | null;

  format?:
    string | null;

  license?:
    string | null;

  price?:
    number | null;

  currency?:
    CreativeCurrency | null;

  tags?:
    string[];

  tools?:
    string[];

  featured?:
    boolean;

  liked?:
    boolean;

  favorited?:
    boolean;

  viewCount?:
    number | null;

  likeCount?:
    number | null;

  favoriteCount?:
    number | null;

  commentCount?:
    number | null;

  shareCount?:
    number | null;

  watermarkLabel?:
    string | null;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeViewerProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  item:
    CreativeViewerItem;

  language?:
    CreativeViewerLanguage;

  size?:
    CreativeViewerSize;

  visible?:
    boolean;

  loading?:
    boolean;

  error?:
    string | null;

  /*
   * Navegación.
   */
  hasPrevious?:
    boolean;

  hasNext?:
    boolean;

  onPrevious?:
    () => void;

  onNext?:
    () => void;

  onBack?:
    () => void;

  onClose?:
    () => void;

  enableKeyboardNavigation?:
    boolean;

  /*
   * Zoom.
   */
  initialScale?:
    number;

  minimumScale?:
    number;

  maximumScale?:
    number;

  zoomStep?:
    number;

  enableWheelZoom?:
    boolean;

  enableDrag?:
    boolean;

  /*
   * Pantalla completa.
   */
  allowFullscreen?:
    boolean;

  onFullscreenChange?:
    (
      fullscreen:
        boolean,
    ) => void;

  /*
   * Protección visual.
   */
  protectPreview?:
    boolean;

  showWatermark?:
    boolean;

  /*
   * Interacciones.
   */
  interactionLoadingAction?:
    CreativeInteractionLoadingAction;

  canLike?:
    boolean;

  canFavorite?:
    boolean;

  canComment?:
    boolean;

  canShare?:
    boolean;

  canReport?:
    boolean;

  onLike?:
    () => void | Promise<void>;

  onFavorite?:
    () => void | Promise<void>;

  onComments?:
    () => void | Promise<void>;

  onShare?:
    () => void | Promise<void>;

  onReport?:
    () => void | Promise<void>;

  /*
   * Descarga gratuita.
   */
  primaryActionLoading?:
    boolean;

  canDownload?:
    boolean;

  onDownload?:
    () => void | Promise<void>;

  /*
   * Compra.
   */
  authenticated?:
    boolean;

  purchaseStatus?:
    CreativePurchaseStatus;

  purchaseLoadingAction?:
    CreativePurchaseLoadingAction;

  paymentPhone?:
    string | null;

  paymentHolder?:
    string | null;

  paymentQrContent?:
    ReactNode;

  paymentInstructions?:
    string | null;

  paymentReference?:
    string | null;

  canPurchase?:
    boolean;

  canRetryPurchase?:
    boolean;

  canCancelPurchase?:
    boolean;

  canDownloadPurchase?:
    boolean;

  onRequireAuthentication?:
    () => void | Promise<void>;

  onPurchase?:
    () => void | Promise<void>;

  onRetryPurchase?:
    () => void | Promise<void>;

  onCancelPurchase?:
    () => void | Promise<void>;

  onCopyPaymentPhone?:
    (
      paymentPhone:
        string,
    ) => void | Promise<void>;

  /*
   * Solicitud personalizada.
   */
  requestStatus?:
    CreativeRequestStatus;

  requestLoadingAction?:
    CreativeRequestLoadingAction;

  requestValues?:
    CreativeRequestValues;

  defaultRequestValues?:
    Partial<CreativeRequestValues>;

  onRequestValuesChange?:
    (
      values:
        CreativeRequestValues,
    ) => void;

  canSubmitRequest?:
    boolean;

  canRetryRequest?:
    boolean;

  canCancelRequest?:
    boolean;

  onSubmitRequest?:
    (
      values:
        CreativeRequestValues,
    ) => void | Promise<void>;

  onRetryRequest?:
    () => void | Promise<void>;

  onCancelRequest?:
    () => void | Promise<void>;

  /*
   * Administración.
   */
  isAdmin?:
    boolean;

  adminLoadingAction?:
    CreativeAdminLoadingAction;

  canEdit?:
    boolean;

  canPublish?:
    boolean;

  canHide?:
    boolean;

  canRestore?:
    boolean;

  canArchive?:
    boolean;

  canDeletePermanently?:
    boolean;

  onEdit?:
    () => void | Promise<void>;

  onPublish?:
    () => void | Promise<void>;

  onHide?:
    () => void | Promise<void>;

  onRestore?:
    () => void | Promise<void>;

  onArchive?:
    () => void | Promise<void>;

  onDeletePermanently?:
    () => void | Promise<void>;

  /*
   * Secciones.
   */
  showDetails?:
    boolean;

  showInteractions?:
    boolean;

  showPrimaryAction?:
    boolean;

  showComments?:
    boolean;

  commentsContent?:
    ReactNode;

  additionalDetailsContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  /*
   * Clases adicionales.
   */
  mediaClassName?:
    string;

  panelClassName?:
    string;

  detailsClassName?:
    string;

  commentsClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_VIEWER_COPY = {
  es: {
    viewer:
      "Visor de diseño",

    loading:
      "Cargando diseño...",

    errorTitle:
      "No se pudo mostrar el diseño",

    errorDescription:
      "Ocurrió un problema al cargar la vista previa.",

    previewUnavailable:
      "Vista previa no disponible",

    details:
      "Detalles del diseño",

    type:
      "Tipo",

    category:
      "Categoría",

    author:
      "Autor",

    published:
      "Publicado",

    resolution:
      "Resolución",

    format:
      "Formato",

    status:
      "Estado",

    license:
      "Licencia",

    tools:
      "Herramientas",

    tags:
      "Etiquetas",

    free:
      "Gratis",

    paid:
      "Premium",

    portfolio:
      "Portafolio",

    draft:
      "Borrador",

    publishedStatus:
      "Publicado",

    hidden:
      "Oculto",

    archived:
      "Archivado",

    download:
      "Descargar diseño",

    downloading:
      "Preparando descarga...",

    comments:
      "Comentarios",

    featured:
      "Destacado",

    protectedPreview:
      "Vista previa protegida",

    dragHelp:
      "Arrastra para mover la imagen ampliada.",

    zoomHelp:
      "Usa la rueda del mouse para acercar o alejar.",

    watermark:
      "FIXORA PREVIEW",
  },

  en: {
    viewer:
      "Design viewer",

    loading:
      "Loading design...",

    errorTitle:
      "The design could not be displayed",

    errorDescription:
      "A problem occurred while loading the preview.",

    previewUnavailable:
      "Preview unavailable",

    details:
      "Design details",

    type:
      "Type",

    category:
      "Category",

    author:
      "Author",

    published:
      "Published",

    resolution:
      "Resolution",

    format:
      "Format",

    status:
      "Status",

    license:
      "License",

    tools:
      "Tools",

    tags:
      "Tags",

    free:
      "Free",

    paid:
      "Premium",

    portfolio:
      "Portfolio",

    draft:
      "Draft",

    publishedStatus:
      "Published",

    hidden:
      "Hidden",

    archived:
      "Archived",

    download:
      "Download design",

    downloading:
      "Preparing download...",

    comments:
      "Comments",

    featured:
      "Featured",

    protectedPreview:
      "Protected preview",

    dragHelp:
      "Drag to move the enlarged image.",

    zoomHelp:
      "Use the mouse wheel to zoom in or out.",

    watermark:
      "FIXORA PREVIEW",
  },
} as const;

/* =========================================================
   CLASES
   ========================================================= */

const CREATIVE_VIEWER_SIZE_CLASSES = {
  default:
    "max-w-[1500px]",

  wide:
    "max-w-[1800px]",
} as const satisfies Record<
  CreativeViewerSize,
  string
>;

const CREATIVE_VIEWER_TYPE_CLASSES = {
  FREE: [
    "border-emerald-400/25",
    "bg-emerald-400/10",
    "text-emerald-300",
  ].join(
    " ",
  ),

  PAID: [
    "border-amber-400/25",
    "bg-amber-400/10",
    "text-amber-300",
  ].join(
    " ",
  ),

  PORTFOLIO: [
    "border-cyan-400/25",
    "bg-cyan-400/10",
    "text-cyan-300",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeContentType,
  string
>;

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeViewerClasses(
  ...classes:
    Array<
      string | false | null | undefined
    >
): string {
  return classes
    .filter(
      Boolean,
    )
    .join(
      " ",
    );
}

function normalizeCreativeViewerText(
  value:
    string | null | undefined,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function normalizeCreativeViewerCount(
  value:
    number | null | undefined,
): number {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.trunc(
      value,
    ),
  );
}

function normalizeCreativeViewerList(
  values:
    string[] | null | undefined,
): string[] {
  if (
    !Array.isArray(
      values,
    )
  ) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map(
          normalizeCreativeViewerText,
        )
        .filter(
          Boolean,
        ),
    ),
  );
}

function normalizeCreativeViewerScale(
  value:
    number,
  fallback:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <=
      0
  ) {
    return fallback;
  }

  return value;
}

function clampCreativeViewerScale(
  value:
    number,
  minimum:
    number,
  maximum:
    number,
): number {
  return Math.min(
    maximum,
    Math.max(
      minimum,
      value,
    ),
  );
}

export function formatCreativeViewerCount(
  value:
    number | null | undefined,
): string {
  const normalizedValue =
    normalizeCreativeViewerCount(
      value,
    );

  if (
    normalizedValue <
    1_000
  ) {
    return String(
      normalizedValue,
    );
  }

  if (
    normalizedValue <
    1_000_000
  ) {
    const compactValue =
      Math.round(
        (
          normalizedValue /
          1_000
        ) *
        10,
      ) /
      10;

    return `${compactValue}K`;
  }

  const compactValue =
    Math.round(
      (
        normalizedValue /
        1_000_000
      ) *
        10,
    ) /
    10;

  return `${compactValue}M`;
}

function runCreativeViewerAction(
  action:
    (() => void | Promise<void>) |
    undefined,
): void {
  void action?.();
}

/* =========================================================
   ETIQUETAS
   ========================================================= */

function getCreativeViewerTypeLabel(
  contentType:
    CreativeContentType,
  language:
    CreativeViewerLanguage,
): string {
  const copy =
    CREATIVE_VIEWER_COPY[
      language
    ];

  if (
    contentType ===
    "FREE"
  ) {
    return copy.free;
  }

  if (
    contentType ===
    "PAID"
  ) {
    return copy.paid;
  }

  return copy.portfolio;
}

function getCreativeViewerStatusLabel(
  status:
    CreativeItemStatus,
  language:
    CreativeViewerLanguage,
): string {
  const copy =
    CREATIVE_VIEWER_COPY[
      language
    ];

  if (
    status ===
    "DRAFT"
  ) {
    return copy.draft;
  }

  if (
    status ===
    "HIDDEN"
  ) {
    return copy.hidden;
  }

  if (
    status ===
    "ARCHIVED"
  ) {
    return copy.archived;
  }

  return copy.publishedStatus;
}

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeViewerImageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
      />

      <circle
        cx="9"
        cy="9"
        r="1.5"
      />

      <path d="m5 17 5-5 4 4 2-2 3 3" />
    </svg>
  );
}

function CreativeViewerErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 7v6" />

      <path d="M12 17h.01" />
    </svg>
  );
}

function CreativeViewerDownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
    >
      <path d="M12 3v12" />

      <path d="m7 10 5 5 5-5" />

      <path d="M5 21h14" />
    </svg>
  );
}

/* =========================================================
   DETALLE
   ========================================================= */

interface CreativeViewerDetailProps {
  label:
    string;

  value:
    ReactNode;
}

function CreativeViewerDetail({
  label,
  value,
}: CreativeViewerDetailProps) {
  return (
    <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </dt>

      <dd className="mt-1 break-words text-sm font-semibold text-zinc-200">
        {value}
      </dd>
    </div>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeViewer({
  item,

  language =
    "es",

  size =
    "default",

  visible =
    true,

  loading =
    false,

  error =
    null,

  hasPrevious =
    false,

  hasNext =
    false,

  onPrevious,

  onNext,

  onBack,

  onClose,

  enableKeyboardNavigation =
    true,

  initialScale =
    1,

  minimumScale =
    0.5,

  maximumScale =
    4,

  zoomStep =
    0.25,

  enableWheelZoom =
    true,

  enableDrag =
    true,

  allowFullscreen =
    true,

  onFullscreenChange,

  protectPreview =
    true,

  showWatermark =
    true,

  interactionLoadingAction =
    null,

  canLike =
    true,

  canFavorite =
    true,

  canComment =
    true,

  canShare =
    true,

  canReport =
    true,

  onLike,

  onFavorite,

  onComments,

  onShare,

  onReport,

  primaryActionLoading =
    false,

  canDownload =
    true,

  onDownload,

  authenticated =
    false,

  purchaseStatus =
    "IDLE",

  purchaseLoadingAction =
    null,

  paymentPhone =
    null,

  paymentHolder =
    null,

  paymentQrContent =
    null,

  paymentInstructions =
    null,

  paymentReference =
    null,

  canPurchase =
    true,

  canRetryPurchase =
    true,

  canCancelPurchase =
    true,

  canDownloadPurchase =
    false,

  onRequireAuthentication,

  onPurchase,

  onRetryPurchase,

  onCancelPurchase,

  onCopyPaymentPhone,

  requestStatus =
    "IDLE",

  requestLoadingAction =
    null,

  requestValues,

  defaultRequestValues =
    {},

  onRequestValuesChange,

  canSubmitRequest =
    true,

  canRetryRequest =
    true,

  canCancelRequest =
    true,

  onSubmitRequest,

  onRetryRequest,

  onCancelRequest,

  isAdmin =
    false,

  adminLoadingAction =
    null,

  canEdit =
    true,

  canPublish =
    true,

  canHide =
    true,

  canRestore =
    true,

  canArchive =
    true,

  canDeletePermanently =
    false,

  onEdit,

  onPublish,

  onHide,

  onRestore,

  onArchive,

  onDeletePermanently,

  showDetails =
    true,

  showInteractions =
    true,

  showPrimaryAction =
    true,

  showComments =
    true,

  commentsContent =
    null,

  additionalDetailsContent =
    null,

  footerContent =
    null,

  mediaClassName,

  panelClassName,

  detailsClassName,

  commentsClassName,

  className,

  "aria-label":
    ariaLabel,

  ...containerProps
}: CreativeViewerProps) {
  const generatedId =
    useId();

  const rootRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const commentsRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const dragOriginRef =
    useRef({
      pointerX:
        0,

      pointerY:
        0,

      offsetX:
        0,

      offsetY:
        0,
    });

  const copy =
    CREATIVE_VIEWER_COPY[
      language
    ];

  const normalizedMinimumScale =
    normalizeCreativeViewerScale(
      minimumScale,
      0.5,
    );

  const normalizedMaximumScale =
    Math.max(
      normalizedMinimumScale,
      normalizeCreativeViewerScale(
        maximumScale,
        4,
      ),
    );

  const normalizedInitialScale =
    clampCreativeViewerScale(
      normalizeCreativeViewerScale(
        initialScale,
        1,
      ),
      normalizedMinimumScale,
      normalizedMaximumScale,
    );

  const normalizedZoomStep =
    normalizeCreativeViewerScale(
      zoomStep,
      0.25,
    );

  const [
    scale,
    setScale,
  ] =
    useState<number>(
      normalizedInitialScale,
    );

  const [
    offset,
    setOffset,
  ] =
    useState({
      x:
        0,

      y:
        0,
    });

  const [
    dragging,
    setDragging,
  ] =
    useState<boolean>(
      false,
    );

  const [
    fullscreen,
    setFullscreen,
  ] =
    useState<boolean>(
      false,
    );

  const normalizedTitle =
    normalizeCreativeViewerText(
      item.title,
    ) ||
    "FIXORA";

  const normalizedDescription =
    normalizeCreativeViewerText(
      item.description,
    );

  const normalizedPreviewUrl =
    normalizeCreativeViewerText(
      item.previewUrl,
    );

  const normalizedPreviewAlt =
    normalizeCreativeViewerText(
      item.previewAlt,
    ) ||
    normalizedTitle;

  const normalizedCategory =
    normalizeCreativeViewerText(
      item.categoryLabel,
    );

  const normalizedAuthor =
    normalizeCreativeViewerText(
      item.authorName,
    );

  const normalizedPublishedAt =
    normalizeCreativeViewerText(
      item.publishedAtLabel,
    );

  const normalizedResolution =
    normalizeCreativeViewerText(
      item.resolution,
    );

  const normalizedFormat =
    normalizeCreativeViewerText(
      item.format,
    );

  const normalizedLicense =
    normalizeCreativeViewerText(
      item.license,
    );

  const normalizedTags =
    normalizeCreativeViewerList(
      item.tags,
    );

  const normalizedTools =
    normalizeCreativeViewerList(
      item.tools,
    );

  const normalizedError =
    normalizeCreativeViewerText(
      error,
    );

  const normalizedWatermarkLabel =
    normalizeCreativeViewerText(
      item.watermarkLabel,
    ) ||
    copy.watermark;

  const itemStatus =
    item.status ??
    "PUBLISHED";

  const typeLabel =
    getCreativeViewerTypeLabel(
      item.contentType,
      language,
    );

  const statusLabel =
    getCreativeViewerStatusLabel(
      itemStatus,
      language,
    );

  const protectedContent =
    protectPreview &&
    item.contentType !==
      "FREE";

  const shouldShowWatermark =
    showWatermark &&
    item.contentType !==
      "FREE";

  const canZoomOut =
    scale >
    normalizedMinimumScale;

  const canZoomIn =
    scale <
    normalizedMaximumScale;

  const canResetZoom =
    scale !==
      normalizedInitialScale ||
    offset.x !==
      0 ||
    offset.y !==
      0;

  const viewerTitleId =
    `creative-viewer-title-${generatedId}`;

  const viewerDescriptionId =
    `creative-viewer-description-${generatedId}`;

  const applyScale =
    (
      nextScale:
        number,
    ): void => {
      const clampedScale =
        clampCreativeViewerScale(
          nextScale,
          normalizedMinimumScale,
          normalizedMaximumScale,
        );

      setScale(
        clampedScale,
      );

      if (
        clampedScale <=
        1
      ) {
        setOffset({
          x:
            0,

          y:
            0,
        });
      }
    };

  const handleZoomOut =
    (): void => {
      applyScale(
        scale -
        normalizedZoomStep,
      );
    };

  const handleZoomIn =
    (): void => {
      applyScale(
        scale +
        normalizedZoomStep,
      );
    };

  const handleResetZoom =
    (): void => {
      setScale(
        normalizedInitialScale,
      );

      setOffset({
        x:
          0,

        y:
          0,
      });
    };

  const handleWheel =
    (
      event:
        ReactWheelEvent<HTMLDivElement>,
    ): void => {
      if (
        !enableWheelZoom ||
        loading ||
        !normalizedPreviewUrl
      ) {
        return;
      }

      event.preventDefault();

      if (
        event.deltaY <
        0
      ) {
        handleZoomIn();

        return;
      }

      if (
        event.deltaY >
        0
      ) {
        handleZoomOut();
      }
    };

  const handlePointerDown =
    (
      event:
        ReactPointerEvent<HTMLDivElement>,
    ): void => {
      if (
        !enableDrag ||
        scale <=
          1 ||
        event.button !==
          0
      ) {
        return;
      }

      event.currentTarget.setPointerCapture(
        event.pointerId,
      );

      dragOriginRef.current = {
        pointerX:
          event.clientX,

        pointerY:
          event.clientY,

        offsetX:
          offset.x,

        offsetY:
          offset.y,
      };

      setDragging(
        true,
      );
    };

  const handlePointerMove =
    (
      event:
        ReactPointerEvent<HTMLDivElement>,
    ): void => {
      if (
        !dragging ||
        !enableDrag
      ) {
        return;
      }

      const movementX =
        event.clientX -
        dragOriginRef.current.pointerX;

      const movementY =
        event.clientY -
        dragOriginRef.current.pointerY;

      setOffset({
        x:
          dragOriginRef.current.offsetX +
          movementX,

        y:
          dragOriginRef.current.offsetY +
          movementY,
      });
    };

  const handlePointerEnd =
    (
      event:
        ReactPointerEvent<HTMLDivElement>,
    ): void => {
      if (
        event.currentTarget.hasPointerCapture(
          event.pointerId,
        )
      ) {
        event.currentTarget.releasePointerCapture(
          event.pointerId,
        );
      }

      setDragging(
        false,
      );
    };

  const handleToggleFullscreen =
    (): void => {
      if (
        !allowFullscreen ||
        !rootRef.current
      ) {
        return;
      }

      if (
        document.fullscreenElement
      ) {
        void document
          .exitFullscreen()
          .catch(
            () => undefined,
          );

        return;
      }

      void rootRef.current
        .requestFullscreen()
        .catch(
          () => undefined,
        );
    };

  const handleClose =
    (): void => {
      if (
        document.fullscreenElement ===
        rootRef.current
      ) {
        void document
          .exitFullscreen()
          .catch(
            () => undefined,
          )
          .finally(
            () => {
              onClose?.();
            },
          );

        return;
      }

      onClose?.();
    };

  const handleComments =
    (): void => {
      if (
        onComments
      ) {
        runCreativeViewerAction(
          onComments,
        );

        return;
      }

      commentsRef.current?.scrollIntoView({
        behavior:
          "smooth",

        block:
          "start",
      });
    };

  const handleProtectedContextMenu =
    (
      event:
        ReactMouseEvent<HTMLDivElement>,
    ): void => {
      if (
        protectedContent
      ) {
        event.preventDefault();
      }
    };

  useEffect(
    () => {
      const handleFullscreenChange =
        (): void => {
          const nextFullscreen =
            document.fullscreenElement ===
            rootRef.current;

          setFullscreen(
            nextFullscreen,
          );

          onFullscreenChange?.(
            nextFullscreen,
          );
        };

      document.addEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );

      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange,
        );
      };
    },
    [
      onFullscreenChange,
    ],
  );

  useEffect(
    () => {
      if (
        !enableKeyboardNavigation ||
        !visible
      ) {
        return;
      }

      const handleKeyDown =
        (
          event:
            KeyboardEvent,
        ): void => {
          if (
            event.defaultPrevented
          ) {
            return;
          }

          if (
            event.key ===
            "Escape"
          ) {
            event.preventDefault();

            onClose?.();

            return;
          }

          const target =
            event.target as
              | HTMLElement
              | null;

          const targetIsEditable =
            target?.tagName ===
              "INPUT" ||
            target?.tagName ===
              "TEXTAREA" ||
            target?.tagName ===
              "SELECT" ||
            target?.isContentEditable;

          if (
            targetIsEditable
          ) {
            return;
          }

          if (
            event.key ===
              "ArrowLeft" &&
            hasPrevious &&
            onPrevious
          ) {
            event.preventDefault();

            onPrevious();

            return;
          }

          if (
            event.key ===
              "ArrowRight" &&
            hasNext &&
            onNext
          ) {
            event.preventDefault();

            onNext();
          }
        };

      window.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    },
    [
      enableKeyboardNavigation,
      hasNext,
      hasPrevious,
      onClose,
      onNext,
      onPrevious,
      visible,
    ],
  );

  if (
    !visible
  ) {
    return null;
  }

  return (
    <div
      {...containerProps}
      ref={
        rootRef
      }
      role="dialog"
      aria-modal="true"
      aria-label={
        ariaLabel ??
        copy.viewer
      }
      aria-labelledby={
        viewerTitleId
      }
      aria-describedby={
        viewerDescriptionId
      }
      aria-busy={
        loading ||
        undefined
      }
      data-creative-viewer=""
      data-content-type={
        item.contentType
      }
      data-status={
        itemStatus
      }
      data-fullscreen={
        fullscreen
          ? "true"
          : "false"
      }
      data-scale={
        scale
      }
      className={
        joinCreativeViewerClasses(
          "fixed inset-0 z-[500]",
          "overflow-y-auto",
          "bg-zinc-950",
          "text-white",

          className,
        )
      }
    >
      <div
        className={
          joinCreativeViewerClasses(
            "mx-auto flex min-h-screen w-full flex-col",

            CREATIVE_VIEWER_SIZE_CLASSES[
              size
            ],
          )
        }
      >
        <div className="sticky top-0 z-40 p-3 sm:p-4">
          <CreativeViewerToolbar
            language={
              language
            }
            size="md"
            variant="dark"
            position="top"
            disabled={
              loading
            }
            scale={
              scale
            }
            minimumScale={
              normalizedMinimumScale
            }
            maximumScale={
              normalizedMaximumScale
            }
            defaultScale={
              normalizedInitialScale
            }
            canZoomOut={
              canZoomOut
            }
            canZoomIn={
              canZoomIn
            }
            canResetZoom={
              canResetZoom
            }
            onZoomOut={
              handleZoomOut
            }
            onZoomIn={
              handleZoomIn
            }
            onResetZoom={
              handleResetZoom
            }
            hasPrevious={
              hasPrevious
            }
            hasNext={
              hasNext
            }
            onPrevious={
              onPrevious
            }
            onNext={
              onNext
            }
            fullscreen={
              fullscreen
            }
            canToggleFullscreen={
              allowFullscreen
            }
            onToggleFullscreen={
              handleToggleFullscreen
            }
            onBack={
              onBack
            }
            onClose={
              handleClose
            }
            showBack={
              Boolean(
                onBack,
              )
            }
            showClose={
              Boolean(
                onClose,
              )
            }
            showNavigation
            showZoomControls
            showZoomIndicator
            showFullscreen={
              allowFullscreen
            }
          />
        </div>

        {loading ? (
          <div className="flex min-h-[70vh] flex-1 flex-col items-center justify-center gap-4 px-6 py-12">
            <CreativeSpinner
              decorative
              size="lg"
              variant="primary"
            />

            <p className="text-sm font-semibold text-zinc-400">
              {copy.loading}
            </p>
          </div>
        ) : normalizedError ? (
          <div
            role="alert"
            className="flex min-h-[70vh] flex-1 flex-col items-center justify-center px-6 py-12 text-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-400/10 text-red-300">
              <CreativeViewerErrorIcon />
            </span>

            <h2 className="mt-6 text-2xl font-black">
              {copy.errorTitle}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              {normalizedError ||
              copy.errorDescription}
            </p>
          </div>
        ) : (
          <div className="grid flex-1 gap-0 lg:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.85fr)]">
            <main
              className={
                joinCreativeViewerClasses(
                  "relative flex min-h-[60vh] items-center justify-center",
                  "overflow-hidden",
                  "border-y border-white/10",
                  "bg-black",

                  "lg:min-h-[calc(100vh-86px)]",
                  "lg:border-r",
                  "lg:border-t-0",

                  mediaClassName,
                )
              }
            >
              <div
                onWheel={
                  handleWheel
                }
                onPointerDown={
                  handlePointerDown
                }
                onPointerMove={
                  handlePointerMove
                }
                onPointerUp={
                  handlePointerEnd
                }
                onPointerCancel={
                  handlePointerEnd
                }
                onContextMenu={
                  handleProtectedContextMenu
                }
                className={
                  joinCreativeViewerClasses(
                    "relative flex h-full min-h-[60vh] w-full",
                    "touch-none select-none",
                    "items-center justify-center",
                    "overflow-hidden",

                    scale >
                      1 &&
                    enableDrag
                      ? dragging
                        ? "cursor-grabbing"
                        : "cursor-grab"
                      : "cursor-default",
                  )
                }
              >
                {normalizedPreviewUrl ? (
                  <div
                    className="relative h-full min-h-[60vh] w-full transition-transform duration-150 ease-out"
                    style={{
                      transform:
                        `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                    }}
                  >
                    <Image
                      fill
                      priority
                      unoptimized
                      draggable={
                        false
                      }
                      src={
                        normalizedPreviewUrl
                      }
                      alt={
                        normalizedPreviewAlt
                      }
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      className="pointer-events-none object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 text-zinc-600">
                    <CreativeViewerImageIcon />

                    <p className="text-sm font-semibold">
                      {copy.previewUnavailable}
                    </p>
                  </div>
                )}

                {shouldShowWatermark &&
                normalizedPreviewUrl ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-[0.18]"
                  >
                    <div className="absolute inset-[-25%] grid rotate-[-25deg] grid-cols-3 content-center gap-x-16 gap-y-24">
                      {Array.from({
                        length:
                          15,
                      }).map(
                        (
                          _,
                          watermarkIndex,
                        ) => (
                          <span
                            key={
                              `creative-watermark-${watermarkIndex}`
                            }
                            className="whitespace-nowrap text-center text-sm font-black uppercase tracking-[0.28em] text-white sm:text-base"
                          >
                            {normalizedWatermarkLabel}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-4 pt-16">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={
                        joinCreativeViewerClasses(
                          "inline-flex rounded-full border px-3 py-1.5",
                          "text-[10px] font-black uppercase tracking-[0.1em]",
                          "backdrop-blur-md",

                          CREATIVE_VIEWER_TYPE_CLASSES[
                            item.contentType
                          ],
                        )
                      }
                    >
                      {typeLabel}
                    </span>

                    {item.featured ? (
                      <span className="inline-flex rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-violet-300 backdrop-blur-md">
                        {copy.featured}
                      </span>
                    ) : null}

                    {protectedContent ? (
                      <span className="inline-flex rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white/75 backdrop-blur-md">
                        {copy.protectedPreview}
                      </span>
                    ) : null}
                  </div>

                  <div className="text-right text-[11px] text-white/60">
                    {enableDrag &&
                    scale >
                      1 ? (
                      <p>
                        {copy.dragHelp}
                      </p>
                    ) : null}

                    {enableWheelZoom ? (
                      <p>
                        {copy.zoomHelp}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </main>

            <aside
              className={
                joinCreativeViewerClasses(
                  "min-w-0 bg-zinc-950",
                  "lg:max-h-[calc(100vh-86px)]",
                  "lg:overflow-y-auto",

                  panelClassName,
                )
              }
            >
              <div className="space-y-6 p-4 sm:p-6">
                <header>
                  <h1
                    id={
                      viewerTitleId
                    }
                    className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl"
                  >
                    {normalizedTitle}
                  </h1>

                  <p
                    id={
                      viewerDescriptionId
                    }
                    className="mt-3 text-sm leading-7 text-zinc-400"
                  >
                    {normalizedDescription}
                  </p>
                </header>

                {showInteractions ? (
                  <CreativeInteractionBar
                    language={
                      language
                    }
                    size="md"
                    variant="dark"
                    orientation="horizontal"
                    liked={
                      Boolean(
                        item.liked,
                      )
                    }
                    favorited={
                      Boolean(
                        item.favorited,
                      )
                    }
                    viewCount={
                      item.viewCount
                    }
                    likeCount={
                      item.likeCount
                    }
                    favoriteCount={
                      item.favoriteCount
                    }
                    commentCount={
                      item.commentCount
                    }
                    shareCount={
                      item.shareCount
                    }
                    loadingAction={
                      interactionLoadingAction
                    }
                    showViews
                    showLike={
                      Boolean(
                        onLike,
                      )
                    }
                    showFavorite={
                      Boolean(
                        onFavorite,
                      )
                    }
                    showComments={
                      Boolean(
                        onComments ||
                        commentsContent,
                      )
                    }
                    showShare={
                      Boolean(
                        onShare,
                      )
                    }
                    showReport={
                      Boolean(
                        onReport,
                      )
                    }
                    canLike={
                      canLike
                    }
                    canFavorite={
                      canFavorite
                    }
                    canComment={
                      canComment
                    }
                    canShare={
                      canShare
                    }
                    canReport={
                      canReport
                    }
                    onLike={
                      onLike
                    }
                    onFavorite={
                      onFavorite
                    }
                    onComments={
                      handleComments
                    }
                    onShare={
                      onShare
                    }
                    onReport={
                      onReport
                    }
                  />
                ) : null}

                {showDetails ? (
                  <section
                    className={
                      joinCreativeViewerClasses(
                        "rounded-2xl border border-white/10",
                        "bg-white/[0.03] p-4",

                        detailsClassName,
                      )
                    }
                  >
                    <h2 className="text-sm font-black uppercase tracking-[0.1em] text-white">
                      {copy.details}
                    </h2>

                    <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      <CreativeViewerDetail
                        label={
                          copy.type
                        }
                        value={
                          typeLabel
                        }
                      />

                      <CreativeViewerDetail
                        label={
                          copy.status
                        }
                        value={
                          statusLabel
                        }
                      />

                      {normalizedCategory ? (
                        <CreativeViewerDetail
                          label={
                            copy.category
                          }
                          value={
                            normalizedCategory
                          }
                        />
                      ) : null}

                      {normalizedAuthor ? (
                        <CreativeViewerDetail
                          label={
                            copy.author
                          }
                          value={
                            normalizedAuthor
                          }
                        />
                      ) : null}

                      {normalizedPublishedAt ? (
                        <CreativeViewerDetail
                          label={
                            copy.published
                          }
                          value={
                            normalizedPublishedAt
                          }
                        />
                      ) : null}

                      {normalizedResolution ? (
                        <CreativeViewerDetail
                          label={
                            copy.resolution
                          }
                          value={
                            normalizedResolution
                          }
                        />
                      ) : null}

                      {normalizedFormat ? (
                        <CreativeViewerDetail
                          label={
                            copy.format
                          }
                          value={
                            normalizedFormat
                          }
                        />
                      ) : null}

                      {normalizedLicense ? (
                        <CreativeViewerDetail
                          label={
                            copy.license
                          }
                          value={
                            normalizedLicense
                          }
                        />
                      ) : null}
                    </dl>

                    {normalizedTools.length >
                    0 ? (
                      <div className="mt-5">
                        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                          {copy.tools}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {normalizedTools.map(
                            (
                              tool,
                            ) => (
                              <span
                                key={
                                  tool
                                }
                                className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-semibold text-cyan-300"
                              >
                                {tool}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    ) : null}

                    {normalizedTags.length >
                    0 ? (
                      <div className="mt-5">
                        <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                          {copy.tags}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {normalizedTags.map(
                            (
                              tag,
                            ) => (
                              <span
                                key={
                                  tag
                                }
                                className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-zinc-300"
                              >
                                #{tag}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    ) : null}

                    {additionalDetailsContent ? (
                      <div className="mt-5">
                        {additionalDetailsContent}
                      </div>
                    ) : null}
                  </section>
                ) : null}

                {showPrimaryAction &&
                item.contentType ===
                  "FREE" ? (
                  <button
                    type="button"
                    aria-busy={
                      primaryActionLoading ||
                      undefined
                    }
                    disabled={
                      primaryActionLoading ||
                      !canDownload ||
                      !onDownload
                    }
                    onClick={
                      () => {
                        runCreativeViewerAction(
                          onDownload,
                        );
                      }
                    }
                    className={[
                      "inline-flex min-h-12 w-full",
                      "items-center justify-center gap-3",
                      "rounded-2xl border",
                      "border-emerald-400/25",
                      "bg-gradient-to-r",
                      "from-emerald-500",
                      "to-green-600",
                      "px-5 py-3",
                      "text-sm font-black text-white",
                      "outline-none transition-all duration-200",

                      "enabled:hover:-translate-y-0.5",
                      "enabled:hover:from-emerald-400",
                      "enabled:hover:to-emerald-600",
                      "enabled:hover:shadow-[0_14px_34px_rgba(16,185,129,0.25)]",

                      "focus-visible:ring-2",
                      "focus-visible:ring-emerald-400/60",

                      "disabled:cursor-not-allowed",
                      "disabled:opacity-45",
                    ].join(
                      " ",
                    )}
                  >
                    {primaryActionLoading ? (
                      <CreativeSpinner
                        decorative
                        size="sm"
                        variant="light"
                      />
                    ) : (
                      <CreativeViewerDownloadIcon />
                    )}

                    <span>
                      {primaryActionLoading
                        ? copy.downloading
                        : copy.download}
                    </span>
                  </button>
                ) : null}

                {showPrimaryAction &&
                item.contentType ===
                  "PAID" ? (
                  <CreativePurchaseCard
                    creativeItemId={
                      item.id
                    }
                    designTitle={
                      normalizedTitle
                    }
                    price={
                      item.price ??
                      0
                    }
                    currency={
                      item.currency ??
                      (
                        "PEN" as CreativeCurrency
                      )
                    }
                    language={
                      language
                    }
                    size="md"
                    variant="dark"
                    paymentPhone={
                      paymentPhone
                    }
                    paymentHolder={
                      paymentHolder
                    }
                    paymentQrContent={
                      paymentQrContent
                    }
                    paymentInstructions={
                      paymentInstructions
                    }
                    paymentReference={
                      paymentReference
                    }
                    authenticated={
                      authenticated
                    }
                    purchaseStatus={
                      purchaseStatus
                    }
                    loadingAction={
                      purchaseLoadingAction
                    }
                    canPurchase={
                      canPurchase
                    }
                    canRetry={
                      canRetryPurchase
                    }
                    canCancel={
                      canCancelPurchase
                    }
                    canDownload={
                      canDownloadPurchase
                    }
                    canCopyPaymentPhone={
                      Boolean(
                        onCopyPaymentPhone,
                      )
                    }
                    onRequireAuthentication={
                      onRequireAuthentication
                    }
                    onPurchase={
                      onPurchase
                    }
                    onRetry={
                      onRetryPurchase
                    }
                    onCancelPurchase={
                      onCancelPurchase
                    }
                    onDownload={
                      onDownload
                    }
                    onCopyPaymentPhone={
                      onCopyPaymentPhone
                    }
                  />
                ) : null}

                {showPrimaryAction &&
                item.contentType ===
                  "PORTFOLIO" ? (
                  <CreativeRequestCard
                    creativeItemId={
                      item.id
                    }
                    designTitle={
                      normalizedTitle
                    }
                    language={
                      language
                    }
                    size="md"
                    variant="dark"
                    values={
                      requestValues
                    }
                    defaultValues={
                      defaultRequestValues
                    }
                    onValuesChange={
                      onRequestValuesChange
                    }
                    authenticated={
                      authenticated
                    }
                    requestStatus={
                      requestStatus
                    }
                    loadingAction={
                      requestLoadingAction
                    }
                    canSubmit={
                      canSubmitRequest
                    }
                    canRetry={
                      canRetryRequest
                    }
                    canCancel={
                      canCancelRequest
                    }
                    onRequireAuthentication={
                      onRequireAuthentication
                    }
                    onSubmitRequest={
                      onSubmitRequest
                    }
                    onRetry={
                      onRetryRequest
                    }
                    onCancelRequest={
                      onCancelRequest
                    }
                  />
                ) : null}

                {isAdmin ? (
                  <CreativeAdminActions
                    status={
                      itemStatus
                    }
                    language={
                      language
                    }
                    size="md"
                    variant="dark"
                    loadingAction={
                      adminLoadingAction
                    }
                    canEdit={
                      canEdit
                    }
                    canPublish={
                      canPublish
                    }
                    canHide={
                      canHide
                    }
                    canRestore={
                      canRestore
                    }
                    canArchive={
                      canArchive
                    }
                    canDeletePermanently={
                      canDeletePermanently
                    }
                    onEdit={
                      onEdit
                    }
                    onPublish={
                      onPublish
                    }
                    onHide={
                      onHide
                    }
                    onRestore={
                      onRestore
                    }
                    onArchive={
                      onArchive
                    }
                    onDeletePermanently={
                      onDeletePermanently
                    }
                  />
                ) : null}

                {showComments &&
                commentsContent ? (
                  <section
                    ref={
                      commentsRef
                    }
                    className={
                      joinCreativeViewerClasses(
                        "scroll-mt-24 rounded-2xl",
                        "border border-white/10",
                        "bg-white/[0.03] p-4",

                        commentsClassName,
                      )
                    }
                  >
                    <h2 className="text-sm font-black uppercase tracking-[0.1em] text-white">
                      {copy.comments}
                    </h2>

                    <div className="mt-4">
                      {commentsContent}
                    </div>
                  </section>
                ) : null}

                {footerContent}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeViewer;