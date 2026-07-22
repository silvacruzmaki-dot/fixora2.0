"use client";

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

import type {
  CreativeContentType,
} from "@/types/creative/creative-item.types";

/* =========================================================
   TIPOS
   ========================================================= */

export type CreativeViewerMediaLanguage =
  | "es"
  | "en";

export type CreativeViewerMediaSize =
  | "default"
  | "large"
  | "fullscreen";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeViewerMediaProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "title"
  > {
  itemId:
    string;

  title:
    string;

  previewUrl?:
    string | null;

  previewAlt?:
    string | null;

  contentType:
    CreativeContentType;

  language?:
    CreativeViewerMediaLanguage;

  size?:
    CreativeViewerMediaSize;

  visible?:
    boolean;

  loading?:
    boolean;

  error?:
    string | null;

  scale?:
    number;

  defaultScale?:
    number;

  minimumScale?:
    number;

  maximumScale?:
    number;

  zoomStep?:
    number;

  onScaleChange?:
    (
      scale:
        number,
    ) => void;

  enableWheelZoom?:
    boolean;

  enablePinchZoom?:
    boolean;

  enableDrag?:
    boolean;

  enableDoubleClickZoom?:
    boolean;

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

  allowFullscreen?:
    boolean;

  onFullscreenChange?:
    (
      fullscreen:
        boolean,
    ) => void;

  protectPreview?:
    boolean;

  showWatermark?:
    boolean;

  watermarkLabel?:
    string | null;

  showToolbar?:
    boolean;

  showNavigation?:
    boolean;

  showZoomControls?:
    boolean;

  showFullscreenButton?:
    boolean;

  showBackButton?:
    boolean;

  showCloseButton?:
    boolean;

  showHelp?:
    boolean;

  overlayContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  toolbarClassName?:
    string;

  viewportClassName?:
    string;

  imageClassName?:
    string;

  footerClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_VIEWER_MEDIA_COPY = {
  es: {
    media:
      "Vista previa del diseño",

    loading:
      "Cargando vista previa...",

    error:
      "No se pudo cargar la vista previa.",

    unavailable:
      "Vista previa no disponible",

    back:
      "Volver",

    close:
      "Cerrar visor",

    previous:
      "Diseño anterior",

    next:
      "Diseño siguiente",

    zoomOut:
      "Alejar",

    zoomIn:
      "Acercar",

    reset:
      "Restablecer zoom",

    enterFullscreen:
      "Pantalla completa",

    exitFullscreen:
      "Salir de pantalla completa",

    protected:
      "Vista previa protegida",

    help:
      "Usa la rueda o el gesto de pellizco para acercar. Arrastra la imagen cuando esté ampliada.",

    watermark:
      "FIXORA PREVIEW",

    free:
      "Gratis",

    paid:
      "Premium",

    portfolio:
      "Portafolio",
  },

  en: {
    media:
      "Design preview",

    loading:
      "Loading preview...",

    error:
      "The preview could not be loaded.",

    unavailable:
      "Preview unavailable",

    back:
      "Back",

    close:
      "Close viewer",

    previous:
      "Previous design",

    next:
      "Next design",

    zoomOut:
      "Zoom out",

    zoomIn:
      "Zoom in",

    reset:
      "Reset zoom",

    enterFullscreen:
      "Enter fullscreen",

    exitFullscreen:
      "Exit fullscreen",

    protected:
      "Protected preview",

    help:
      "Use the mouse wheel or pinch gesture to zoom. Drag the image when enlarged.",

    watermark:
      "FIXORA PREVIEW",

    free:
      "Free",

    paid:
      "Premium",

    portfolio:
      "Portfolio",
  },
} as const;

/* =========================================================
   CLASES
   ========================================================= */

const CREATIVE_VIEWER_MEDIA_SIZE_CLASSES = {
  default:
    "min-h-[520px]",

  large:
    "min-h-[680px]",

  fullscreen:
    "min-h-screen",
} as const satisfies Record<
  CreativeViewerMediaSize,
  string
>;

const CREATIVE_VIEWER_MEDIA_TYPE_CLASSES = {
  FREE:
    "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",

  PAID:
    "border-amber-400/25 bg-amber-400/10 text-amber-300",

  PORTFOLIO:
    "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
} as const satisfies Record<
  CreativeContentType,
  string
>;

const CREATIVE_VIEWER_MEDIA_BUTTON_CLASSES = [
  "inline-flex",
  "h-10",
  "min-w-10",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-xl",
  "border",
  "border-white/10",
  "bg-black/45",
  "px-3",
  "text-xs",
  "font-bold",
  "text-white",
  "outline-none",
  "backdrop-blur-xl",
  "transition-all",
  "duration-200",

  "enabled:hover:border-emerald-400/30",
  "enabled:hover:bg-emerald-400/15",
  "enabled:hover:text-emerald-200",

  "enabled:active:scale-[0.97]",

  "focus-visible:ring-2",
  "focus-visible:ring-emerald-400/60",

  "disabled:cursor-not-allowed",
  "disabled:opacity-40",
].join(
  " ",
);

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeViewerMediaClasses(
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

function normalizeCreativeViewerMediaText(
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

function normalizeCreativeViewerMediaScale(
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

function clampCreativeViewerMediaScale(
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

interface CreativeViewerMediaPointerPosition {
  x:
    number;

  y:
    number;
}

function getCreativeViewerMediaDistance(
  first:
    CreativeViewerMediaPointerPosition,
  second:
    CreativeViewerMediaPointerPosition,
): number {
  return Math.hypot(
    second.x -
      first.x,
    second.y -
      first.y,
  );
}

function getCreativeViewerMediaTypeLabel(
  contentType:
    CreativeContentType,
  language:
    CreativeViewerMediaLanguage,
): string {
  const copy =
    CREATIVE_VIEWER_MEDIA_COPY[
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

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeViewerMediaBackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M16 10H4" />

      <path d="m8 6-4 4 4 4" />
    </svg>
  );
}

function CreativeViewerMediaCloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m5 5 10 10" />

      <path d="m15 5-10 10" />
    </svg>
  );
}

function CreativeViewerMediaPreviousIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="m12 5-5 5 5 5" />
    </svg>
  );
}

function CreativeViewerMediaNextIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="m8 5 5 5-5 5" />
    </svg>
  );
}

function CreativeViewerMediaZoomOutIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle
        cx="9"
        cy="9"
        r="5"
      />

      <path d="m13 13 4 4" />

      <path d="M7 9h4" />
    </svg>
  );
}

function CreativeViewerMediaZoomInIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle
        cx="9"
        cy="9"
        r="5"
      />

      <path d="m13 13 4 4" />

      <path d="M7 9h4" />

      <path d="M9 7v4" />
    </svg>
  );
}

function CreativeViewerMediaResetIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M3 10a7 7 0 1 0 2-4.9" />

      <path d="M3 3v5h5" />
    </svg>
  );
}

function CreativeViewerMediaFullscreenIcon({
  active,
}: {
  active:
    boolean;
}) {
  if (
    active
  ) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M7 3v4H3" />

        <path d="M13 3v4h4" />

        <path d="M7 17v-4H3" />

        <path d="M13 17v-4h4" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M7 3H3v4" />

      <path d="M13 3h4v4" />

      <path d="M7 17H3v-4" />

      <path d="M13 17h4v-4" />
    </svg>
  );
}

function CreativeViewerMediaImageIcon() {
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

function CreativeViewerMediaErrorIcon() {
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

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeViewerMedia({
  itemId,

  title,

  previewUrl =
    null,

  previewAlt =
    null,

  contentType,

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

  scale,

  defaultScale =
    1,

  minimumScale =
    0.5,

  maximumScale =
    4,

  zoomStep =
    0.25,

  onScaleChange,

  enableWheelZoom =
    true,

  enablePinchZoom =
    true,

  enableDrag =
    true,

  enableDoubleClickZoom =
    true,

  hasPrevious =
    false,

  hasNext =
    false,

  onPrevious,

  onNext,

  onBack,

  onClose,

  allowFullscreen =
    true,

  onFullscreenChange,

  protectPreview =
    true,

  showWatermark =
    true,

  watermarkLabel =
    null,

  showToolbar =
    true,

  showNavigation =
    true,

  showZoomControls =
    true,

  showFullscreenButton =
    true,

  showBackButton =
    true,

  showCloseButton =
    true,

  showHelp =
    true,

  overlayContent =
    null,

  footerContent =
    null,

  toolbarClassName,

  viewportClassName,

  imageClassName,

  footerClassName,

  className,

  "aria-label":
    ariaLabel,

  ...containerProps
}: CreativeViewerMediaProps) {
  const generatedId =
    useId();

  const rootRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const activePointersRef =
    useRef<
      Map<
        number,
        CreativeViewerMediaPointerPosition
      >
    >(
      new Map(),
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

  const pinchOriginRef =
    useRef({
      distance:
        0,

      scale:
        1,
    });

  const copy =
    CREATIVE_VIEWER_MEDIA_COPY[
      language
    ];

  const normalizedMinimumScale =
    normalizeCreativeViewerMediaScale(
      minimumScale,
      0.5,
    );

  const normalizedMaximumScale =
    Math.max(
      normalizedMinimumScale,
      normalizeCreativeViewerMediaScale(
        maximumScale,
        4,
      ),
    );

  const normalizedDefaultScale =
    clampCreativeViewerMediaScale(
      normalizeCreativeViewerMediaScale(
        defaultScale,
        1,
      ),
      normalizedMinimumScale,
      normalizedMaximumScale,
    );

  const normalizedZoomStep =
    normalizeCreativeViewerMediaScale(
      zoomStep,
      0.25,
    );

  const [
    internalScale,
    setInternalScale,
  ] =
    useState<number>(
      normalizedDefaultScale,
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

  const [
    activePointerCount,
    setActivePointerCount,
  ] =
    useState<number>(
      0,
    );

  const currentScale =
    scale ===
    undefined
      ? internalScale
      : clampCreativeViewerMediaScale(
          scale,
          normalizedMinimumScale,
          normalizedMaximumScale,
        );

  const normalizedTitle =
    normalizeCreativeViewerMediaText(
      title,
    ) ||
    "FIXORA";

  const normalizedPreviewUrl =
    normalizeCreativeViewerMediaText(
      previewUrl,
    );

  const normalizedPreviewAlt =
    normalizeCreativeViewerMediaText(
      previewAlt,
    ) ||
    normalizedTitle;

  const normalizedError =
    normalizeCreativeViewerMediaText(
      error,
    );

  const normalizedWatermarkLabel =
    normalizeCreativeViewerMediaText(
      watermarkLabel,
    ) ||
    copy.watermark;

  const protectedContent =
    protectPreview &&
    contentType !==
      "FREE";

  const shouldShowWatermark =
    showWatermark &&
    protectedContent &&
    Boolean(
      normalizedPreviewUrl,
    );

  const canZoomOut =
    currentScale >
    normalizedMinimumScale;

  const canZoomIn =
    currentScale <
    normalizedMaximumScale;

  const canReset =
    currentScale !==
      normalizedDefaultScale ||
    offset.x !==
      0 ||
    offset.y !==
      0;

  const typeLabel =
    getCreativeViewerMediaTypeLabel(
      contentType,
      language,
    );

  const helpId =
    `creative-viewer-media-help-${generatedId}`;

  const updateScale =
    (
      nextScale:
        number,
    ): void => {
      const nextNormalizedScale =
        clampCreativeViewerMediaScale(
          nextScale,
          normalizedMinimumScale,
          normalizedMaximumScale,
        );

      if (
        scale ===
        undefined
      ) {
        setInternalScale(
          nextNormalizedScale,
        );
      }

      onScaleChange?.(
        nextNormalizedScale,
      );

      if (
        nextNormalizedScale <=
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
      updateScale(
        currentScale -
        normalizedZoomStep,
      );
    };

  const handleZoomIn =
    (): void => {
      updateScale(
        currentScale +
        normalizedZoomStep,
      );
    };

  const handleReset =
    (): void => {
      if (
        scale ===
        undefined
      ) {
        setInternalScale(
          normalizedDefaultScale,
        );
      }

      onScaleChange?.(
        normalizedDefaultScale,
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

      const direction =
        event.deltaY <
        0
          ? 1
          : -1;

      updateScale(
        currentScale +
        direction *
        normalizedZoomStep,
      );
    };

  const handleDoubleClick =
    (): void => {
      if (
        !enableDoubleClickZoom ||
        loading ||
        !normalizedPreviewUrl
      ) {
        return;
      }

      if (
        currentScale >
        1
      ) {
        handleReset();

        return;
      }

      updateScale(
        Math.min(
          2,
          normalizedMaximumScale,
        ),
      );
    };

  const handlePointerDown =
    (
      event:
        ReactPointerEvent<HTMLDivElement>,
    ): void => {
      if (
        loading ||
        !normalizedPreviewUrl
      ) {
        return;
      }

      activePointersRef.current.set(
        event.pointerId,
        {
          x:
            event.clientX,

          y:
            event.clientY,
        },
      );

      event.currentTarget.setPointerCapture(
        event.pointerId,
      );

      const activePointers =
        Array.from(
          activePointersRef.current.values(),
        );

      setActivePointerCount(
        activePointers.length,
      );

      if (
        enablePinchZoom &&
        activePointers.length ===
          2
      ) {
        const firstPointer =
          activePointers[0];

        const secondPointer =
          activePointers[1];

        if (
          firstPointer &&
          secondPointer
        ) {
          pinchOriginRef.current = {
            distance:
              getCreativeViewerMediaDistance(
                firstPointer,
                secondPointer,
              ),

            scale:
              currentScale,
          };
        }

        setDragging(
          false,
        );

        return;
      }

      if (
        enableDrag &&
        currentScale >
          1 &&
        activePointers.length ===
          1
      ) {
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
      }
    };

  const handlePointerMove =
    (
      event:
        ReactPointerEvent<HTMLDivElement>,
    ): void => {
      if (
        !activePointersRef.current.has(
          event.pointerId,
        )
      ) {
        return;
      }

      activePointersRef.current.set(
        event.pointerId,
        {
          x:
            event.clientX,

          y:
            event.clientY,
        },
      );

      const activePointers =
        Array.from(
          activePointersRef.current.values(),
        );

      if (
        enablePinchZoom &&
        activePointers.length ===
          2 &&
        pinchOriginRef.current.distance >
          0
      ) {
        const firstPointer =
          activePointers[0];

        const secondPointer =
          activePointers[1];

        if (
          firstPointer &&
          secondPointer
        ) {
          const currentDistance =
            getCreativeViewerMediaDistance(
              firstPointer,
              secondPointer,
            );

          const scaleRatio =
            currentDistance /
            pinchOriginRef.current.distance;

          updateScale(
            pinchOriginRef.current.scale *
            scaleRatio,
          );
        }

        return;
      }

      if (
        dragging &&
        enableDrag &&
        activePointers.length ===
          1
      ) {
        setOffset({
          x:
            dragOriginRef.current.offsetX +
            event.clientX -
            dragOriginRef.current.pointerX,

          y:
            dragOriginRef.current.offsetY +
            event.clientY -
            dragOriginRef.current.pointerY,
        });
      }
    };

  const handlePointerEnd =
    (
      event:
        ReactPointerEvent<HTMLDivElement>,
    ): void => {
      activePointersRef.current.delete(
        event.pointerId,
      );

      if (
        event.currentTarget.hasPointerCapture(
          event.pointerId,
        )
      ) {
        event.currentTarget.releasePointerCapture(
          event.pointerId,
        );
      }

      const remainingPointerCount =
        activePointersRef.current.size;

      setActivePointerCount(
        remainingPointerCount,
      );

      if (
        remainingPointerCount <
        2
      ) {
        pinchOriginRef.current.distance =
          0;
      }

      if (
        remainingPointerCount ===
        0
      ) {
        setDragging(
          false,
        );
      }
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

  const handleContextMenu =
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

  /* =======================================================
     EVENTO DE PANTALLA COMPLETA
     ======================================================= */

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

  /* =======================================================
     CONTROLES DEL TECLADO
     ======================================================= */

  useEffect(
    () => {
      if (
        !visible
      ) {
        return;
      }

      const applyKeyboardScale =
        (
          nextScale:
            number,
        ): void => {
          const nextNormalizedScale =
            clampCreativeViewerMediaScale(
              nextScale,
              normalizedMinimumScale,
              normalizedMaximumScale,
            );

          if (
            scale ===
            undefined
          ) {
            setInternalScale(
              nextNormalizedScale,
            );
          }

          onScaleChange?.(
            nextNormalizedScale,
          );

          if (
            nextNormalizedScale <=
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

      const resetKeyboardScale =
        (): void => {
          if (
            scale ===
            undefined
          ) {
            setInternalScale(
              normalizedDefaultScale,
            );
          }

          onScaleChange?.(
            normalizedDefaultScale,
          );

          setOffset({
            x:
              0,

            y:
              0,
          });
        };

      const handleKeyDown =
        (
          event:
            KeyboardEvent,
        ): void => {
          const target =
            event.target as
              | HTMLElement
              | null;

          const editableTarget =
            target?.tagName ===
              "INPUT" ||
            target?.tagName ===
              "TEXTAREA" ||
            target?.tagName ===
              "SELECT" ||
            target?.isContentEditable;

          if (
            editableTarget
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

            return;
          }

          if (
            event.key ===
              "+" ||
            event.key ===
              "="
          ) {
            event.preventDefault();

            applyKeyboardScale(
              currentScale +
              normalizedZoomStep,
            );

            return;
          }

          if (
            event.key ===
            "-"
          ) {
            event.preventDefault();

            applyKeyboardScale(
              currentScale -
              normalizedZoomStep,
            );

            return;
          }

          if (
            event.key ===
            "0"
          ) {
            event.preventDefault();

            resetKeyboardScale();

            return;
          }

          if (
            event.key ===
              "Escape" &&
            onClose &&
            !document.fullscreenElement
          ) {
            event.preventDefault();

            onClose();
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
      currentScale,
      hasNext,
      hasPrevious,
      normalizedDefaultScale,
      normalizedMaximumScale,
      normalizedMinimumScale,
      normalizedZoomStep,
      onClose,
      onNext,
      onPrevious,
      onScaleChange,
      scale,
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
      role="region"
      aria-label={
        ariaLabel ??
        `${copy.media}: ${normalizedTitle}`
      }
      aria-describedby={
        showHelp
          ? helpId
          : undefined
      }
      aria-busy={
        loading ||
        undefined
      }
      data-creative-viewer-media=""
      data-item-id={
        itemId
      }
      data-content-type={
        contentType
      }
      data-scale={
        currentScale
      }
      data-fullscreen={
        fullscreen
          ? "true"
          : "false"
      }
      className={
        joinCreativeViewerMediaClasses(
          "relative isolate flex w-full flex-col overflow-hidden",
          "border border-white/10",
          "bg-black text-white",
          "shadow-[0_24px_70px_rgba(0,0,0,0.42)]",

          fullscreen
            ? "h-screen rounded-none"
            : "rounded-3xl",

          CREATIVE_VIEWER_MEDIA_SIZE_CLASSES[
            size
          ],

          className,
        )
      }
    >
      {showToolbar ? (
        <div
          className={
            joinCreativeViewerMediaClasses(
              "absolute inset-x-0 top-0 z-40",
              "flex flex-wrap items-center justify-between gap-3",
              "bg-gradient-to-b from-black/75 via-black/35 to-transparent",
              "p-3 pb-10 sm:p-4 sm:pb-12",

              toolbarClassName,
            )
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            {showBackButton &&
            onBack ? (
              <button
                type="button"
                aria-label={
                  copy.back
                }
                title={
                  copy.back
                }
                onClick={
                  onBack
                }
                className={
                  CREATIVE_VIEWER_MEDIA_BUTTON_CLASSES
                }
              >
                <CreativeViewerMediaBackIcon />

                <span className="hidden sm:inline">
                  {copy.back}
                </span>
              </button>
            ) : null}

            <span
              className={
                joinCreativeViewerMediaClasses(
                  "inline-flex h-10 items-center rounded-xl border",
                  "px-3 text-[10px] font-black uppercase tracking-[0.1em]",
                  "backdrop-blur-xl",

                  CREATIVE_VIEWER_MEDIA_TYPE_CLASSES[
                    contentType
                  ],
                )
              }
            >
              {typeLabel}
            </span>

            {protectedContent ? (
              <span className="hidden h-10 items-center rounded-xl border border-white/10 bg-black/45 px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white/70 backdrop-blur-xl sm:inline-flex">
                {copy.protected}
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {showZoomControls ? (
              <>
                <button
                  type="button"
                  aria-label={
                    copy.zoomOut
                  }
                  title={
                    copy.zoomOut
                  }
                  disabled={
                    loading ||
                    !canZoomOut
                  }
                  onClick={
                    handleZoomOut
                  }
                  className={
                    CREATIVE_VIEWER_MEDIA_BUTTON_CLASSES
                  }
                >
                  <CreativeViewerMediaZoomOutIcon />
                </button>

                <span className="inline-flex h-10 min-w-[72px] items-center justify-center rounded-xl border border-white/10 bg-black/45 px-3 text-xs font-black tabular-nums text-white backdrop-blur-xl">
                  {Math.round(
                    currentScale *
                    100,
                  )}
                  %
                </span>

                <button
                  type="button"
                  aria-label={
                    copy.zoomIn
                  }
                  title={
                    copy.zoomIn
                  }
                  disabled={
                    loading ||
                    !canZoomIn
                  }
                  onClick={
                    handleZoomIn
                  }
                  className={
                    CREATIVE_VIEWER_MEDIA_BUTTON_CLASSES
                  }
                >
                  <CreativeViewerMediaZoomInIcon />
                </button>

                <button
                  type="button"
                  aria-label={
                    copy.reset
                  }
                  title={
                    copy.reset
                  }
                  disabled={
                    loading ||
                    !canReset
                  }
                  onClick={
                    handleReset
                  }
                  className={
                    CREATIVE_VIEWER_MEDIA_BUTTON_CLASSES
                  }
                >
                  <CreativeViewerMediaResetIcon />
                </button>
              </>
            ) : null}

            {showFullscreenButton &&
            allowFullscreen ? (
              <button
                type="button"
                aria-label={
                  fullscreen
                    ? copy.exitFullscreen
                    : copy.enterFullscreen
                }
                title={
                  fullscreen
                    ? copy.exitFullscreen
                    : copy.enterFullscreen
                }
                disabled={
                  loading
                }
                onClick={
                  handleToggleFullscreen
                }
                className={
                  CREATIVE_VIEWER_MEDIA_BUTTON_CLASSES
                }
              >
                <CreativeViewerMediaFullscreenIcon
                  active={
                    fullscreen
                  }
                />
              </button>
            ) : null}

            {showCloseButton &&
            onClose ? (
              <button
                type="button"
                aria-label={
                  copy.close
                }
                title={
                  copy.close
                }
                onClick={
                  onClose
                }
                className={
                  CREATIVE_VIEWER_MEDIA_BUTTON_CLASSES
                }
              >
                <CreativeViewerMediaCloseIcon />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        onWheel={
          handleWheel
        }
        onDoubleClick={
          handleDoubleClick
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
          handleContextMenu
        }
        className={
          joinCreativeViewerMediaClasses(
            "relative flex min-h-0 flex-1 touch-none select-none",
            "items-center justify-center overflow-hidden",

            currentScale >
              1 &&
            enableDrag
              ? dragging
                ? "cursor-grabbing"
                : "cursor-grab"
              : enableDoubleClickZoom
                ? "cursor-zoom-in"
                : "cursor-default",

            viewportClassName,
          )
        }
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <span
              aria-hidden="true"
              className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-400/20 border-r-emerald-400"
            />

            <p className="text-sm font-semibold text-zinc-400">
              {copy.loading}
            </p>
          </div>
        ) : normalizedError ? (
          <div
            role="alert"
            className="flex max-w-xl flex-col items-center justify-center px-6 text-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl border border-red-400/20 bg-red-400/10 text-red-300">
              <CreativeViewerMediaErrorIcon />
            </span>

            <p className="mt-5 text-lg font-black">
              {copy.error}
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              {normalizedError}
            </p>
          </div>
        ) : normalizedPreviewUrl ? (
          <div
            className="relative h-full min-h-[inherit] w-full will-change-transform"
            style={{
              transform:
                `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${currentScale})`,

              transition:
                dragging ||
                activePointerCount >
                  1
                  ? "none"
                  : "transform 150ms ease-out",
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
              className={
                joinCreativeViewerMediaClasses(
                  "pointer-events-none object-contain",

                  imageClassName,
                )
              }
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-zinc-600">
            <CreativeViewerMediaImageIcon />

            <p className="text-sm font-semibold">
              {copy.unavailable}
            </p>
          </div>
        )}

        {shouldShowWatermark ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-[0.16]"
          >
            <div className="absolute inset-[-30%] grid rotate-[-24deg] grid-cols-3 content-center gap-x-14 gap-y-20">
              {Array.from({
                length:
                  18,
              }).map(
                (
                  _,
                  watermarkIndex,
                ) => (
                  <span
                    key={
                      `creative-viewer-media-watermark-${watermarkIndex}`
                    }
                    className="whitespace-nowrap text-center text-sm font-black uppercase tracking-[0.25em] text-white"
                  >
                    {normalizedWatermarkLabel}
                  </span>
                ),
              )}
            </div>
          </div>
        ) : null}

        {showNavigation &&
        hasPrevious &&
        onPrevious ? (
          <button
            type="button"
            aria-label={
              copy.previous
            }
            title={
              copy.previous
            }
            disabled={
              loading
            }
            onClick={
              onPrevious
            }
            className="absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-black/45 text-white outline-none backdrop-blur-xl transition-all duration-200 enabled:hover:border-emerald-400/30 enabled:hover:bg-emerald-400/15 enabled:hover:text-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:cursor-not-allowed disabled:opacity-40 sm:left-4"
          >
            <CreativeViewerMediaPreviousIcon />
          </button>
        ) : null}

        {showNavigation &&
        hasNext &&
        onNext ? (
          <button
            type="button"
            aria-label={
              copy.next
            }
            title={
              copy.next
            }
            disabled={
              loading
            }
            onClick={
              onNext
            }
            className="absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-black/45 text-white outline-none backdrop-blur-xl transition-all duration-200 enabled:hover:border-emerald-400/30 enabled:hover:bg-emerald-400/15 enabled:hover:text-emerald-200 focus-visible:ring-2 focus-visible:ring-emerald-400/60 disabled:cursor-not-allowed disabled:opacity-40 sm:right-4"
          >
            <CreativeViewerMediaNextIcon />
          </button>
        ) : null}

        {overlayContent}
      </div>

      {showHelp ||
      footerContent ? (
        <footer
          className={
            joinCreativeViewerMediaClasses(
              "relative z-30 flex flex-wrap items-center justify-between gap-3",
              "border-t border-white/10",
              "bg-zinc-950/90 px-4 py-3",
              "backdrop-blur-xl",

              footerClassName,
            )
          }
        >
          {showHelp ? (
            <p
              id={
                helpId
              }
              className="max-w-3xl text-xs leading-5 text-zinc-400"
            >
              {copy.help}
            </p>
          ) : (
            <span />
          )}

          {footerContent}
        </footer>
      ) : null}
    </div>
  );
}

export default CreativeViewerMedia;