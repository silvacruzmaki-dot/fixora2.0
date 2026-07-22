"use client";

/*
 * Barra de herramientas del visor Diseño / Creative.
 *
 * Responsabilidades:
 * - Regresar o cerrar el visor.
 * - Navegar entre publicaciones.
 * - Acercar y alejar la imagen.
 * - Restablecer el zoom.
 * - Mostrar el porcentaje actual.
 * - Activar o desactivar la pantalla completa.
 *
 * No contiene:
 * - Estado interno del zoom.
 * - Solicitudes HTTP.
 * - Navegación de rutas.
 * - Acceso a Prisma.
 *
 * Todas las acciones son controladas por el componente padre.
 */

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  CreativeIconButton,
} from "@/components/atoms/creative/CreativeIconButton";

import type {
  CreativeIconButtonSize,
} from "@/components/atoms/creative/CreativeIconButton";

import {
  CreativeZoomIndicator,
} from "@/components/atoms/creative/CreativeZoomIndicator";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeViewerToolbarLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeViewerToolbarSize =
  | "sm"
  | "md";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeViewerToolbarVariant =
  | "dark"
  | "surface";

/* =========================================================
   POSICIONES
   ========================================================= */

export type CreativeViewerToolbarPosition =
  | "top"
  | "bottom"
  | "floating";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeViewerToolbarProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  /*
   * Idioma de las etiquetas.
   */
  language?:
    CreativeViewerToolbarLanguage;

  /*
   * Tamaño visual.
   */
  size?:
    CreativeViewerToolbarSize;

  /*
   * Variante visual.
   */
  variant?:
    CreativeViewerToolbarVariant;

  /*
   * Posición de la barra.
   */
  position?:
    CreativeViewerToolbarPosition;

  /*
   * Estado general.
   */
  disabled?:
    boolean;

  loading?:
    boolean;

  /*
   * Datos del zoom.
   */
  scale?:
    number;

  minimumScale?:
    number;

  maximumScale?:
    number;

  defaultScale?:
    number;

  /*
   * Disponibilidad de acciones de zoom.
   */
  canZoomOut?:
    boolean;

  canZoomIn?:
    boolean;

  canResetZoom?:
    boolean;

  /*
   * Acciones de zoom.
   */
  onZoomOut?:
    () => void;

  onZoomIn?:
    () => void;

  onResetZoom?:
    () => void;

  /*
   * Navegación entre publicaciones.
   */
  hasPrevious?:
    boolean;

  hasNext?:
    boolean;

  onPrevious?:
    () => void;

  onNext?:
    () => void;

  /*
   * Pantalla completa.
   */
  fullscreen?:
    boolean;

  canToggleFullscreen?:
    boolean;

  onToggleFullscreen?:
    () => void;

  /*
   * Salida del visor.
   */
  onBack?:
    () => void;

  onClose?:
    () => void;

  /*
   * Visibilidad de grupos.
   */
  showBack?:
    boolean;

  showClose?:
    boolean;

  showNavigation?:
    boolean;

  showZoomControls?:
    boolean;

  showZoomIndicator?:
    boolean;

  showFullscreen?:
    boolean;

  /*
   * Contenido adicional.
   */
  leadingContent?:
    ReactNode;

  centerContent?:
    ReactNode;

  trailingContent?:
    ReactNode;

  /*
   * Clases adicionales.
   */
  leadingClassName?:
    string;

  centerClassName?:
    string;

  trailingClassName?:
    string;

  groupClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_VIEWER_TOOLBAR_COPY = {
  es: {
    toolbar:
      "Herramientas del visor de diseños",

    back:
      "Regresar al catálogo",

    close:
      "Cerrar visor",

    previous:
      "Diseño anterior",

    next:
      "Diseño siguiente",

    zoomOut:
      "Alejar imagen",

    zoomIn:
      "Acercar imagen",

    resetZoom:
      "Restablecer zoom",

    enterFullscreen:
      "Activar pantalla completa",

    exitFullscreen:
      "Salir de pantalla completa",
  },

  en: {
    toolbar:
      "Design viewer tools",

    back:
      "Return to catalog",

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

    resetZoom:
      "Reset zoom",

    enterFullscreen:
      "Enter fullscreen",

    exitFullscreen:
      "Exit fullscreen",
  },
} as const;

/* =========================================================
   TAMAÑO DE BOTONES
   ========================================================= */

const CREATIVE_VIEWER_TOOLBAR_ICON_SIZE = {
  sm:
    "sm",

  md:
    "md",
} as const satisfies Record<
  CreativeViewerToolbarSize,
  CreativeIconButtonSize
>;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_VIEWER_TOOLBAR_BASE_CLASSES = [
  "flex",
  "w-full",
  "min-w-0",
  "items-center",
  "justify-between",
  "gap-3",
  "border",
  "backdrop-blur-xl",
  "transition-colors",
  "duration-200",
].join(
  " ",
);

/* =========================================================
   VARIANTES
   ========================================================= */

const CREATIVE_VIEWER_TOOLBAR_VARIANT_CLASSES = {
  dark: [
    "border-white/10",
    "bg-black/65",
    "text-white",
    "shadow-[0_16px_50px_rgba(0,0,0,0.35)]",
  ].join(
    " ",
  ),

  surface: [
    "border-zinc-200/85",
    "bg-white/90",
    "text-zinc-800",
    "shadow-[0_16px_45px_rgba(15,23,42,0.10)]",

    "dark:border-white/10",
    "dark:bg-zinc-950/85",
    "dark:text-white",
    "dark:shadow-[0_18px_50px_rgba(0,0,0,0.32)]",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeViewerToolbarVariant,
  string
>;

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_VIEWER_TOOLBAR_SIZE_CLASSES = {
  sm:
    "min-h-12 rounded-2xl px-2.5 py-2",

  md:
    "min-h-14 rounded-2xl px-3 py-2.5",
} as const satisfies Record<
  CreativeViewerToolbarSize,
  string
>;

/* =========================================================
   POSICIONES
   ========================================================= */

const CREATIVE_VIEWER_TOOLBAR_POSITION_CLASSES = {
  top:
    "",

  bottom:
    "",

  floating: [
    "fixed",
    "bottom-4",
    "left-1/2",
    "z-[120]",
    "w-[calc(100%-2rem)]",
    "max-w-4xl",
    "-translate-x-1/2",

    "sm:bottom-6",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeViewerToolbarPosition,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeViewerToolbarClasses(
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

/* =========================================================
   NORMALIZAR ESCALA
   ========================================================= */

function normalizeCreativeViewerScale(
  value:
    number | null | undefined,
  fallback:
    number,
): number {
  if (
    typeof value !==
      "number" ||
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

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeViewerBackIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />

      <path d="M9 12h11" />
    </svg>
  );
}

function CreativeViewerCloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6l12 12" />

      <path d="M18 6 6 18" />
    </svg>
  );
}

function CreativeViewerPreviousIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function CreativeViewerNextIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CreativeViewerZoomOutIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="M8 11h6" />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function CreativeViewerZoomInIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="M8 11h6" />

      <path d="M11 8v6" />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function CreativeViewerResetIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />

      <path d="M3 4v6h6" />
    </svg>
  );
}

function CreativeViewerEnterFullscreenIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3H3v5" />

      <path d="M16 3h5v5" />

      <path d="M8 21H3v-5" />

      <path d="M16 21h5v-5" />
    </svg>
  );
}

function CreativeViewerExitFullscreenIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 8H3V3" />

      <path d="M16 8h5V3" />

      <path d="M8 16H3v5" />

      <path d="M16 16h5v5" />
    </svg>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeViewerToolbar({
  language =
    "es",

  size =
    "md",

  variant =
    "dark",

  position =
    "top",

  disabled =
    false,

  loading =
    false,

  scale =
    1,

  minimumScale =
    0.5,

  maximumScale =
    4,

  defaultScale =
    1,

  canZoomOut =
    true,

  canZoomIn =
    true,

  canResetZoom =
    true,

  onZoomOut,

  onZoomIn,

  onResetZoom,

  hasPrevious =
    false,

  hasNext =
    false,

  onPrevious,

  onNext,

  fullscreen =
    false,

  canToggleFullscreen =
    true,

  onToggleFullscreen,

  onBack,

  onClose,

  showBack =
    true,

  showClose =
    true,

  showNavigation =
    true,

  showZoomControls =
    true,

  showZoomIndicator =
    true,

  showFullscreen =
    true,

  leadingContent =
    null,

  centerContent =
    null,

  trailingContent =
    null,

  leadingClassName,

  centerClassName,

  trailingClassName,

  groupClassName,

  className,

  "aria-label":
    ariaLabel,

  ...containerProps
}: CreativeViewerToolbarProps) {
  const copy =
    CREATIVE_VIEWER_TOOLBAR_COPY[
      language
    ];

  const normalizedMinimumScale =
    normalizeCreativeViewerScale(
      minimumScale,
      0.5,
    );

  const requestedMaximumScale =
    normalizeCreativeViewerScale(
      maximumScale,
      4,
    );

  const normalizedMaximumScale =
    Math.max(
      normalizedMinimumScale,
      requestedMaximumScale,
    );

  const normalizedDefaultScale =
    Math.min(
      normalizedMaximumScale,
      Math.max(
        normalizedMinimumScale,
        normalizeCreativeViewerScale(
          defaultScale,
          1,
        ),
      ),
    );

  const normalizedScale =
    Math.min(
      normalizedMaximumScale,
      Math.max(
        normalizedMinimumScale,
        normalizeCreativeViewerScale(
          scale,
          normalizedDefaultScale,
        ),
      ),
    );

  const interactionDisabled =
    disabled ||
    loading;

  const buttonSize =
    CREATIVE_VIEWER_TOOLBAR_ICON_SIZE[
      size
    ];

  const iconButtonVariant =
    variant ===
      "dark"
      ? "ghost"
      : "surface";

  return (
    <div
      {...containerProps}
      role="toolbar"
      aria-label={
        ariaLabel ??
        copy.toolbar
      }
      aria-disabled={
        interactionDisabled ||
        undefined
      }
      aria-busy={
        loading ||
        undefined
      }
      data-creative-viewer-toolbar=""
      data-size={
        size
      }
      data-variant={
        variant
      }
      data-position={
        position
      }
      className={
        joinCreativeViewerToolbarClasses(
          CREATIVE_VIEWER_TOOLBAR_BASE_CLASSES,

          CREATIVE_VIEWER_TOOLBAR_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_VIEWER_TOOLBAR_SIZE_CLASSES[
            size
          ],

          CREATIVE_VIEWER_TOOLBAR_POSITION_CLASSES[
            position
          ],

          interactionDisabled &&
            "opacity-70",

          className,
        )
      }
    >
      <div
        className={
          joinCreativeViewerToolbarClasses(
            "flex shrink-0 items-center gap-2",

            leadingClassName,
          )
        }
      >
        {showBack ? (
          <CreativeIconButton
            icon={
              <CreativeViewerBackIcon />
            }
            label={
              copy.back
            }
            size={
              buttonSize
            }
            variant={
              iconButtonVariant
            }
            disabled={
              interactionDisabled ||
              !onBack
            }
            onClick={
              onBack
            }
          />
        ) : null}

        {leadingContent}

        {showNavigation ? (
          <div
            role="group"
            aria-label={
              language ===
                "es"
                ? "Navegación entre diseños"
                : "Design navigation"
            }
            className={
              joinCreativeViewerToolbarClasses(
                "flex items-center gap-1.5",

                groupClassName,
              )
            }
          >
            <CreativeIconButton
              icon={
                <CreativeViewerPreviousIcon />
              }
              label={
                copy.previous
              }
              size={
                buttonSize
              }
              variant={
                iconButtonVariant
              }
              disabled={
                interactionDisabled ||
                !hasPrevious ||
                !onPrevious
              }
              onClick={
                onPrevious
              }
            />

            <CreativeIconButton
              icon={
                <CreativeViewerNextIcon />
              }
              label={
                copy.next
              }
              size={
                buttonSize
              }
              variant={
                iconButtonVariant
              }
              disabled={
                interactionDisabled ||
                !hasNext ||
                !onNext
              }
              onClick={
                onNext
              }
            />
          </div>
        ) : null}
      </div>

      <div
        className={
          joinCreativeViewerToolbarClasses(
            "flex min-w-0 flex-1 items-center justify-center gap-2",

            centerClassName,
          )
        }
      >
        {centerContent}

        {showZoomControls ? (
          <div
            role="group"
            aria-label={
              language ===
                "es"
                ? "Controles de zoom"
                : "Zoom controls"
            }
            className={
              joinCreativeViewerToolbarClasses(
                "flex items-center gap-1.5",

                groupClassName,
              )
            }
          >
            <CreativeIconButton
              icon={
                <CreativeViewerZoomOutIcon />
              }
              label={
                copy.zoomOut
              }
              size={
                buttonSize
              }
              variant={
                iconButtonVariant
              }
              disabled={
                interactionDisabled ||
                !canZoomOut ||
                !onZoomOut
              }
              onClick={
                onZoomOut
              }
            />

            {showZoomIndicator ? (
              <CreativeZoomIndicator
                scale={
                  normalizedScale
                }
                minimumScale={
                  normalizedMinimumScale
                }
                maximumScale={
                  normalizedMaximumScale
                }
                defaultScale={
                  normalizedDefaultScale
                }
                size={
                  size ===
                    "sm"
                    ? "sm"
                    : "md"
                }
                variant={
                  variant ===
                    "dark"
                    ? "dark"
                    : "surface"
                }
                showDefaultState
                className="hidden sm:inline-flex"
              />
            ) : null}

            <CreativeIconButton
              icon={
                <CreativeViewerZoomInIcon />
              }
              label={
                copy.zoomIn
              }
              size={
                buttonSize
              }
              variant={
                iconButtonVariant
              }
              disabled={
                interactionDisabled ||
                !canZoomIn ||
                !onZoomIn
              }
              onClick={
                onZoomIn
              }
            />

            <CreativeIconButton
              icon={
                <CreativeViewerResetIcon />
              }
              label={
                copy.resetZoom
              }
              size={
                buttonSize
              }
              variant={
                iconButtonVariant
              }
              disabled={
                interactionDisabled ||
                !canResetZoom ||
                !onResetZoom
              }
              onClick={
                onResetZoom
              }
            />
          </div>
        ) : null}
      </div>

      <div
        className={
          joinCreativeViewerToolbarClasses(
            "flex shrink-0 items-center gap-2",

            trailingClassName,
          )
        }
      >
        {trailingContent}

        {showFullscreen ? (
          <CreativeIconButton
            icon={
              fullscreen
                ? (
                    <CreativeViewerExitFullscreenIcon />
                  )
                : (
                    <CreativeViewerEnterFullscreenIcon />
                  )
            }
            label={
              fullscreen
                ? copy.exitFullscreen
                : copy.enterFullscreen
            }
            size={
              buttonSize
            }
            variant={
              iconButtonVariant
            }
            active={
              fullscreen
            }
            pressed={
              fullscreen
            }
            disabled={
              interactionDisabled ||
              !canToggleFullscreen ||
              !onToggleFullscreen
            }
            onClick={
              onToggleFullscreen
            }
          />
        ) : null}

        {showClose ? (
          <CreativeIconButton
            icon={
              <CreativeViewerCloseIcon />
            }
            label={
              copy.close
            }
            size={
              buttonSize
            }
            variant="danger"
            disabled={
              interactionDisabled ||
              !onClose
            }
            onClick={
              onClose
            }
          />
        ) : null}
      </div>
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeViewerToolbar;