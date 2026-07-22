"use client";

/*
 * Botón de icono reutilizable del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar acciones mediante iconos.
 * - Mantener accesibilidad mediante etiquetas.
 * - Mostrar estados activos, presionados y deshabilitados.
 * - Mostrar un indicador de carga.
 * - Mostrar tooltip.
 * - Mostrar una insignia o contador.
 * - Adaptarse al tema claro y oscuro.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Estado interno.
 * - Navegación.
 * - Lógica de negocio.
 * - Dependencias de librerías de iconos.
 */

import {
  forwardRef,
} from "react";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

/* =========================================================
   VARIANTES VISUALES
   ========================================================= */

export type CreativeIconButtonVariant =
  | "primary"
  | "surface"
  | "soft"
  | "ghost"
  | "success"
  | "warning"
  | "danger";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeIconButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

/* =========================================================
   FORMAS
   ========================================================= */

export type CreativeIconButtonShape =
  | "circle"
  | "rounded"
  | "square";

/* =========================================================
   POSICIONES DEL TOOLTIP
   ========================================================= */

export type CreativeIconButtonTooltipPlacement =
  | "top"
  | "right"
  | "bottom"
  | "left";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeIconButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children"
  > {
  /*
   * Icono principal.
   *
   * Puede utilizar cualquier icono compatible con React,
   * incluyendo React Icons.
   */
  icon:
    ReactNode;

  /*
   * Etiqueta accesible obligatoria.
   */
  label:
    string;

  /*
   * Etiqueta utilizada mientras se procesa una acción.
   */
  loadingLabel?:
    string;

  /*
   * Variante visual del botón.
   */
  variant?:
    CreativeIconButtonVariant;

  /*
   * Tamaño del botón.
   */
  size?:
    CreativeIconButtonSize;

  /*
   * Forma externa.
   */
  shape?:
    CreativeIconButtonShape;

  /*
   * Indica que la acción está activa.
   *
   * Ejemplos:
   * - Diseño con Me gusta.
   * - Diseño guardado.
   * - Pantalla completa activa.
   */
  active?:
    boolean;

  /*
   * Expone aria-pressed cuando se trata de una acción
   * que puede activarse y desactivarse.
   */
  pressed?:
    boolean;

  /*
   * Muestra un indicador de carga.
   */
  loading?:
    boolean;

  /*
   * Contenido mostrado en la esquina superior derecha.
   *
   * Puede ser:
   * - Un número.
   * - Un punto.
   * - Un texto corto.
   * - Un componente personalizado.
   */
  badge?:
    ReactNode;

  /*
   * Etiqueta accesible de la insignia.
   */
  badgeLabel?:
    string;

  /*
   * Texto visual del tooltip.
   *
   * Cuando no se proporciona, se utiliza label.
   */
  tooltip?:
    string;

  /*
   * Permite ocultar el tooltip visual.
   */
  showTooltip?:
    boolean;

  /*
   * Posición del tooltip.
   */
  tooltipPlacement?:
    CreativeIconButtonTooltipPlacement;

  /*
   * Clase adicional para el contenedor externo.
   */
  wrapperClassName?:
    string;

  /*
   * Clase adicional para el icono.
   */
  iconClassName?:
    string;

  /*
   * Clase adicional para el tooltip.
   */
  tooltipClassName?:
    string;
}

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_ICON_BUTTON_BASE_CLASSES = [
  "relative",
  "isolate",
  "inline-flex",
  "shrink-0",
  "items-center",
  "justify-center",
  "border",
  "font-medium",
  "transition-all",
  "duration-200",
  "ease-out",
  "select-none",
  "outline-none",

  "focus-visible:ring-2",
  "focus-visible:ring-emerald-500/70",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white",

  "dark:focus-visible:ring-emerald-400/70",
  "dark:focus-visible:ring-offset-zinc-950",

  "enabled:active:scale-[0.96]",

  "disabled:pointer-events-none",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",

  "motion-reduce:transition-none",
  "motion-reduce:transform-none",
].join(
  " ",
);

/* =========================================================
   CLASES POR TAMAÑO
   ========================================================= */

const CREATIVE_ICON_BUTTON_SIZE_CLASSES = {
  sm: [
    "h-8",
    "w-8",
    "text-sm",
  ].join(
    " ",
  ),

  md: [
    "h-10",
    "w-10",
    "text-base",
  ].join(
    " ",
  ),

  lg: [
    "h-12",
    "w-12",
    "text-lg",
  ].join(
    " ",
  ),

  xl: [
    "h-14",
    "w-14",
    "text-xl",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeIconButtonSize,
  string
>;

/* =========================================================
   CLASES DEL ICONO
   ========================================================= */

const CREATIVE_ICON_BUTTON_ICON_SIZE_CLASSES = {
  sm:
    "[&>svg]:h-4 [&>svg]:w-4",

  md:
    "[&>svg]:h-[18px] [&>svg]:w-[18px]",

  lg:
    "[&>svg]:h-5 [&>svg]:w-5",

  xl:
    "[&>svg]:h-6 [&>svg]:w-6",
} as const satisfies Record<
  CreativeIconButtonSize,
  string
>;

/* =========================================================
   CLASES DEL INDICADOR DE CARGA
   ========================================================= */

const CREATIVE_ICON_BUTTON_SPINNER_SIZE_CLASSES = {
  sm:
    "h-3.5 w-3.5",

  md:
    "h-4 w-4",

  lg:
    "h-5 w-5",

  xl:
    "h-6 w-6",
} as const satisfies Record<
  CreativeIconButtonSize,
  string
>;

/* =========================================================
   CLASES POR FORMA
   ========================================================= */

const CREATIVE_ICON_BUTTON_SHAPE_CLASSES = {
  circle:
    "rounded-full",

  rounded:
    "rounded-xl",

  square:
    "rounded-lg",
} as const satisfies Record<
  CreativeIconButtonShape,
  string
>;

/* =========================================================
   CLASES POR VARIANTE
   ========================================================= */

const CREATIVE_ICON_BUTTON_VARIANT_CLASSES = {
  primary: [
    "border-emerald-500/35",
    "bg-gradient-to-br",
    "from-emerald-500",
    "to-green-600",
    "text-white",
    "shadow-[0_8px_24px_rgba(16,185,129,0.24)]",

    "enabled:hover:-translate-y-0.5",
    "enabled:hover:from-emerald-400",
    "enabled:hover:to-emerald-600",
    "enabled:hover:shadow-[0_12px_30px_rgba(16,185,129,0.32)]",

    "dark:border-emerald-300/25",
    "dark:from-emerald-500",
    "dark:to-green-700",
  ].join(
    " ",
  ),

  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "text-zinc-700",
    "shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
    "backdrop-blur-xl",

    "enabled:hover:-translate-y-0.5",
    "enabled:hover:border-emerald-400/50",
    "enabled:hover:bg-white",
    "enabled:hover:text-emerald-700",
    "enabled:hover:shadow-[0_12px_28px_rgba(15,23,42,0.12)]",

    "dark:border-white/10",
    "dark:bg-zinc-900/80",
    "dark:text-zinc-200",
    "dark:shadow-[0_8px_24px_rgba(0,0,0,0.28)]",

    "dark:enabled:hover:border-emerald-400/35",
    "dark:enabled:hover:bg-zinc-900",
    "dark:enabled:hover:text-emerald-300",
  ].join(
    " ",
  ),

  soft: [
    "border-emerald-500/15",
    "bg-emerald-500/10",
    "text-emerald-700",

    "enabled:hover:-translate-y-0.5",
    "enabled:hover:border-emerald-500/30",
    "enabled:hover:bg-emerald-500/15",

    "dark:border-emerald-400/15",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",

    "dark:enabled:hover:border-emerald-400/30",
    "dark:enabled:hover:bg-emerald-400/15",
  ].join(
    " ",
  ),

  ghost: [
    "border-transparent",
    "bg-transparent",
    "text-zinc-600",

    "enabled:hover:bg-zinc-900/[0.06]",
    "enabled:hover:text-zinc-950",

    "dark:text-zinc-300",
    "dark:enabled:hover:bg-white/[0.08]",
    "dark:enabled:hover:text-white",
  ].join(
    " ",
  ),

  success: [
    "border-green-500/25",
    "bg-green-500/10",
    "text-green-700",

    "enabled:hover:-translate-y-0.5",
    "enabled:hover:bg-green-500/15",
    "enabled:hover:shadow-[0_8px_24px_rgba(34,197,94,0.18)]",

    "dark:border-green-400/25",
    "dark:bg-green-400/10",
    "dark:text-green-300",
  ].join(
    " ",
  ),

  warning: [
    "border-amber-500/25",
    "bg-amber-500/10",
    "text-amber-700",

    "enabled:hover:-translate-y-0.5",
    "enabled:hover:bg-amber-500/15",
    "enabled:hover:shadow-[0_8px_24px_rgba(245,158,11,0.18)]",

    "dark:border-amber-400/25",
    "dark:bg-amber-400/10",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  danger: [
    "border-red-500/25",
    "bg-red-500/10",
    "text-red-700",

    "enabled:hover:-translate-y-0.5",
    "enabled:hover:bg-red-500/15",
    "enabled:hover:shadow-[0_8px_24px_rgba(239,68,68,0.18)]",

    "dark:border-red-400/25",
    "dark:bg-red-400/10",
    "dark:text-red-300",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeIconButtonVariant,
  string
>;

/* =========================================================
   CLASES CUANDO ESTÁ ACTIVO
   ========================================================= */

const CREATIVE_ICON_BUTTON_ACTIVE_CLASSES = {
  primary: [
    "ring-2",
    "ring-emerald-500/30",
    "ring-offset-2",
    "ring-offset-white",

    "dark:ring-emerald-400/30",
    "dark:ring-offset-zinc-950",
  ].join(
    " ",
  ),

  surface: [
    "border-emerald-500/50",
    "bg-emerald-500/10",
    "text-emerald-700",
    "shadow-[0_8px_24px_rgba(16,185,129,0.14)]",

    "dark:border-emerald-400/40",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(
    " ",
  ),

  soft: [
    "border-emerald-500/40",
    "bg-emerald-500/20",
    "text-emerald-800",

    "dark:border-emerald-400/40",
    "dark:bg-emerald-400/20",
    "dark:text-emerald-200",
  ].join(
    " ",
  ),

  ghost: [
    "border-emerald-500/20",
    "bg-emerald-500/10",
    "text-emerald-700",

    "dark:border-emerald-400/20",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(
    " ",
  ),

  success: [
    "border-green-500/40",
    "bg-green-500/20",
    "text-green-800",

    "dark:border-green-400/40",
    "dark:bg-green-400/20",
    "dark:text-green-200",
  ].join(
    " ",
  ),

  warning: [
    "border-amber-500/40",
    "bg-amber-500/20",
    "text-amber-800",

    "dark:border-amber-400/40",
    "dark:bg-amber-400/20",
    "dark:text-amber-200",
  ].join(
    " ",
  ),

  danger: [
    "border-red-500/40",
    "bg-red-500/20",
    "text-red-800",

    "dark:border-red-400/40",
    "dark:bg-red-400/20",
    "dark:text-red-200",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeIconButtonVariant,
  string
>;

/* =========================================================
   POSICIÓN DEL TOOLTIP
   ========================================================= */

const CREATIVE_ICON_BUTTON_TOOLTIP_PLACEMENT_CLASSES = {
  top: [
    "bottom-[calc(100%+0.55rem)]",
    "left-1/2",
    "-translate-x-1/2",
  ].join(
    " ",
  ),

  right: [
    "left-[calc(100%+0.55rem)]",
    "top-1/2",
    "-translate-y-1/2",
  ].join(
    " ",
  ),

  bottom: [
    "left-1/2",
    "top-[calc(100%+0.55rem)]",
    "-translate-x-1/2",
  ].join(
    " ",
  ),

  left: [
    "right-[calc(100%+0.55rem)]",
    "top-1/2",
    "-translate-y-1/2",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeIconButtonTooltipPlacement,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeIconButtonClasses(
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
   NORMALIZAR ETIQUETA
   ========================================================= */

function normalizeCreativeIconButtonLabel(
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

/* =========================================================
   RESOLVER ESTADO
   ========================================================= */

function getCreativeIconButtonState(
  loading:
    boolean,
  disabled:
    boolean,
  active:
    boolean,
): string {
  if (
    loading
  ) {
    return "loading";
  }

  if (
    disabled
  ) {
    return "disabled";
  }

  if (
    active
  ) {
    return "active";
  }

  return "idle";
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativeIconButton =
  forwardRef<
    HTMLButtonElement,
    CreativeIconButtonProps
  >(
    function CreativeIconButton(
      {
        icon,

        label,

        loadingLabel,

        variant =
          "surface",

        size =
          "md",

        shape =
          "circle",

        active =
          false,

        pressed,

        loading =
          false,

        badge,

        badgeLabel,

        tooltip,

        showTooltip =
          true,

        tooltipPlacement =
          "top",

        wrapperClassName,

        iconClassName,

        tooltipClassName,

        className,

        disabled =
          false,

        type =
          "button",

        title,

        "aria-label":
          ariaLabel,

        "aria-pressed":
          ariaPressed,

        ...buttonProps
      },
      ref,
    ) {
      const normalizedLabel =
        normalizeCreativeIconButtonLabel(
          label,
        );

      const normalizedLoadingLabel =
        normalizeCreativeIconButtonLabel(
          loadingLabel,
        );

      const normalizedTooltip =
        normalizeCreativeIconButtonLabel(
          tooltip,
        );

      const resolvedAccessibleLabel =
        loading &&
        normalizedLoadingLabel
          ? normalizedLoadingLabel
          : ariaLabel ||
            normalizedLabel;

      const resolvedTooltip =
        normalizedTooltip ||
        normalizedLabel;

      const buttonDisabled =
        disabled ||
        loading;

      const buttonState =
        getCreativeIconButtonState(
          loading,
          buttonDisabled,
          active,
        );

      const resolvedAriaPressed =
        typeof pressed ===
        "boolean"
          ? pressed
          : ariaPressed;

      return (
        <span
          className={
            joinCreativeIconButtonClasses(
              "group relative inline-flex shrink-0",
              wrapperClassName,
            )
          }
          data-creative-icon-button-wrapper=""
        >
          <button
            {...buttonProps}
            ref={ref}
            type={type}
            disabled={
              buttonDisabled
            }
            title={
              title ??
              (
                showTooltip
                  ? resolvedTooltip
                  : undefined
              )
            }
            aria-label={
              resolvedAccessibleLabel
            }
            aria-pressed={
              resolvedAriaPressed
            }
            aria-busy={
              loading ||
              undefined
            }
            data-creative-icon-button=""
            data-variant={
              variant
            }
            data-size={
              size
            }
            data-state={
              buttonState
            }
            data-active={
              active
                ? "true"
                : "false"
            }
            className={
              joinCreativeIconButtonClasses(
                CREATIVE_ICON_BUTTON_BASE_CLASSES,

                CREATIVE_ICON_BUTTON_SIZE_CLASSES[
                  size
                ],

                CREATIVE_ICON_BUTTON_SHAPE_CLASSES[
                  shape
                ],

                CREATIVE_ICON_BUTTON_VARIANT_CLASSES[
                  variant
                ],

                active &&
                  CREATIVE_ICON_BUTTON_ACTIVE_CLASSES[
                    variant
                  ],

                loading &&
                  "cursor-wait",

                className,
              )
            }
          >
            {loading ? (
              <span
                aria-hidden="true"
                className={
                  joinCreativeIconButtonClasses(
                    "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",

                    CREATIVE_ICON_BUTTON_SPINNER_SIZE_CLASSES[
                      size
                    ],
                  )
                }
              />
            ) : (
              <span
                aria-hidden="true"
                className={
                  joinCreativeIconButtonClasses(
                    "flex shrink-0 items-center justify-center",

                    CREATIVE_ICON_BUTTON_ICON_SIZE_CLASSES[
                      size
                    ],

                    iconClassName,
                  )
                }
              >
                {icon}
              </span>
            )}
          </button>

          {badge !==
          undefined ? (
            <span
              aria-label={
                badgeLabel
              }
              aria-hidden={
                badgeLabel
                  ? undefined
                  : true
              }
              className={
                joinCreativeIconButtonClasses(
                  "pointer-events-none absolute -right-1 -top-1 z-20",
                  "inline-flex min-h-4 min-w-4 items-center justify-center",
                  "rounded-full border border-white",
                  "bg-emerald-500 px-1",
                  "text-[9px] font-bold leading-none text-white",
                  "shadow-[0_4px_12px_rgba(16,185,129,0.35)]",

                  "dark:border-zinc-950",
                  "dark:bg-emerald-400",
                  "dark:text-zinc-950",
                )
              }
            >
              {badge}
            </span>
          ) : null}

          {showTooltip &&
          resolvedTooltip ? (
            <span
              aria-hidden="true"
              role="tooltip"
              className={
                joinCreativeIconButtonClasses(
                  "pointer-events-none absolute z-[90]",
                  "invisible whitespace-nowrap opacity-0",
                  "rounded-lg border border-zinc-200/80",
                  "bg-white/95 px-2.5 py-1.5",
                  "text-xs font-medium text-zinc-700",
                  "shadow-[0_10px_32px_rgba(15,23,42,0.16)]",
                  "backdrop-blur-xl",

                  "transition-all duration-150 ease-out",

                  "group-hover:visible",
                  "group-hover:opacity-100",

                  "group-focus-within:visible",
                  "group-focus-within:opacity-100",

                  "dark:border-white/10",
                  "dark:bg-zinc-950/95",
                  "dark:text-zinc-200",
                  "dark:shadow-[0_12px_36px_rgba(0,0,0,0.45)]",

                  CREATIVE_ICON_BUTTON_TOOLTIP_PLACEMENT_CLASSES[
                    tooltipPlacement
                  ],

                  tooltipClassName,
                )
              }
            >
              {resolvedTooltip}
            </span>
          ) : null}
        </span>
      );
    },
  );

CreativeIconButton.displayName =
  "CreativeIconButton";

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeIconButton;