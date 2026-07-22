/*
 * Indicador de carga reutilizable del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar estados de carga.
 * - Mantener accesibilidad mediante role="status".
 * - Admitir diferentes tamaños y variantes visuales.
 * - Mostrar opcionalmente una etiqueta.
 * - Funcionar en tarjetas, visor, formularios y administración.
 *
 * No contiene:
 * - Estado React.
 * - Solicitudes HTTP.
 * - Navegación.
 * - Lógica de negocio.
 */

import {
  forwardRef,
} from "react";

import type {
  HTMLAttributes,
} from "react";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeSpinnerSize =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeSpinnerVariant =
  | "primary"
  | "neutral"
  | "light"
  | "success"
  | "warning"
  | "danger";

/* =========================================================
   POSICIÓN DE LA ETIQUETA
   ========================================================= */

export type CreativeSpinnerLabelPosition =
  | "right"
  | "bottom";

/* =========================================================
   VELOCIDAD
   ========================================================= */

export type CreativeSpinnerSpeed =
  | "slow"
  | "normal"
  | "fast";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeSpinnerProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    "children"
  > {
  /*
   * Tamaño del indicador.
   */
  size?:
    CreativeSpinnerSize;

  /*
   * Variante visual.
   */
  variant?:
    CreativeSpinnerVariant;

  /*
   * Texto accesible.
   */
  label?:
    string;

  /*
   * Muestra la etiqueta visualmente.
   *
   * Cuando es false, continúa disponible
   * para lectores de pantalla.
   */
  showLabel?:
    boolean;

  /*
   * Posición de la etiqueta visible.
   */
  labelPosition?:
    CreativeSpinnerLabelPosition;

  /*
   * Velocidad de rotación.
   */
  speed?:
    CreativeSpinnerSpeed;

  /*
   * Cuando es true, el spinner se considera decorativo
   * y no se anuncia mediante lectores de pantalla.
   */
  decorative?:
    boolean;

  /*
   * Clases adicionales del círculo.
   */
  spinnerClassName?:
    string;

  /*
   * Clases adicionales de la etiqueta.
   */
  labelClassName?:
    string;
}

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_SPINNER_WRAPPER_BASE_CLASSES = [
  "inline-flex",
  "max-w-full",
  "items-center",
  "justify-center",
  "font-medium",
  "leading-none",
].join(
  " ",
);

/* =========================================================
   DISTRIBUCIÓN DE LA ETIQUETA
   ========================================================= */

const CREATIVE_SPINNER_LABEL_POSITION_CLASSES = {
  right: [
    "flex-row",
    "gap-2.5",
  ].join(
    " ",
  ),

  bottom: [
    "flex-col",
    "gap-2",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeSpinnerLabelPosition,
  string
>;

/* =========================================================
   TAMAÑOS DEL CÍRCULO
   ========================================================= */

const CREATIVE_SPINNER_SIZE_CLASSES = {
  xs: [
    "h-3",
    "w-3",
    "border-[1.5px]",
  ].join(
    " ",
  ),

  sm: [
    "h-4",
    "w-4",
    "border-2",
  ].join(
    " ",
  ),

  md: [
    "h-5",
    "w-5",
    "border-2",
  ].join(
    " ",
  ),

  lg: [
    "h-7",
    "w-7",
    "border-[3px]",
  ].join(
    " ",
  ),

  xl: [
    "h-10",
    "w-10",
    "border-4",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeSpinnerSize,
  string
>;

/* =========================================================
   TAMAÑOS DE LA ETIQUETA
   ========================================================= */

const CREATIVE_SPINNER_LABEL_SIZE_CLASSES = {
  xs:
    "text-[10px]",

  sm:
    "text-xs",

  md:
    "text-sm",

  lg:
    "text-sm",

  xl:
    "text-base",
} as const satisfies Record<
  CreativeSpinnerSize,
  string
>;

/* =========================================================
   VARIANTES VISUALES
   ========================================================= */

const CREATIVE_SPINNER_VARIANT_CLASSES = {
  primary: [
    "border-emerald-500/25",
    "border-t-emerald-600",
    "text-emerald-700",

    "dark:border-emerald-400/20",
    "dark:border-t-emerald-300",
    "dark:text-emerald-300",
  ].join(
    " ",
  ),

  neutral: [
    "border-zinc-400/25",
    "border-t-zinc-700",
    "text-zinc-700",

    "dark:border-zinc-400/20",
    "dark:border-t-zinc-200",
    "dark:text-zinc-300",
  ].join(
    " ",
  ),

  light: [
    "border-white/30",
    "border-t-white",
    "text-white",
  ].join(
    " ",
  ),

  success: [
    "border-green-500/25",
    "border-t-green-600",
    "text-green-700",

    "dark:border-green-400/20",
    "dark:border-t-green-300",
    "dark:text-green-300",
  ].join(
    " ",
  ),

  warning: [
    "border-amber-500/25",
    "border-t-amber-600",
    "text-amber-700",

    "dark:border-amber-400/20",
    "dark:border-t-amber-300",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  danger: [
    "border-red-500/25",
    "border-t-red-600",
    "text-red-700",

    "dark:border-red-400/20",
    "dark:border-t-red-300",
    "dark:text-red-300",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeSpinnerVariant,
  string
>;

/* =========================================================
   VELOCIDADES
   ========================================================= */

const CREATIVE_SPINNER_SPEED_CLASSES = {
  slow:
    "[animation-duration:1.35s]",

  normal:
    "[animation-duration:0.85s]",

  fast:
    "[animation-duration:0.55s]",
} as const satisfies Record<
  CreativeSpinnerSpeed,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeSpinnerClasses(
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

function normalizeCreativeSpinnerLabel(
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
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativeSpinner =
  forwardRef<
    HTMLSpanElement,
    CreativeSpinnerProps
  >(
    function CreativeSpinner(
      {
        size =
          "md",

        variant =
          "primary",

        label =
          "Cargando...",

        showLabel =
          false,

        labelPosition =
          "right",

        speed =
          "normal",

        decorative =
          false,

        spinnerClassName,

        labelClassName,

        className,

        title,

        role,

        "aria-label":
          ariaLabel,

        "aria-live":
          ariaLive,

        ...spanProps
      },
      ref,
    ) {
      const normalizedLabel =
        normalizeCreativeSpinnerLabel(
          label,
        ) ||
        "Cargando...";

      const resolvedAccessibleLabel =
        ariaLabel ??
        normalizedLabel;

      return (
        <span
          {...spanProps}
          ref={ref}
          role={
            decorative
              ? undefined
              : role ??
                "status"
          }
          aria-label={
            decorative
              ? undefined
              : resolvedAccessibleLabel
          }
          aria-live={
            decorative
              ? undefined
              : ariaLive ??
                "polite"
          }
          aria-hidden={
            decorative
              ? true
              : undefined
          }
          title={
            title ??
            (
              showLabel
                ? undefined
                : normalizedLabel
            )
          }
          data-creative-spinner=""
          data-size={
            size
          }
          data-variant={
            variant
          }
          data-speed={
            speed
          }
          className={
            joinCreativeSpinnerClasses(
              CREATIVE_SPINNER_WRAPPER_BASE_CLASSES,

              CREATIVE_SPINNER_LABEL_POSITION_CLASSES[
                labelPosition
              ],

              CREATIVE_SPINNER_VARIANT_CLASSES[
                variant
              ],

              className,
            )
          }
        >
          <span
            aria-hidden="true"
            className={
              joinCreativeSpinnerClasses(
                "inline-block shrink-0 animate-spin rounded-full",

                CREATIVE_SPINNER_SIZE_CLASSES[
                  size
                ],

                CREATIVE_SPINNER_SPEED_CLASSES[
                  speed
                ],

                spinnerClassName,
              )
            }
          />

          {showLabel ? (
            <span
              className={
                joinCreativeSpinnerClasses(
                  "max-w-full text-current",

                  CREATIVE_SPINNER_LABEL_SIZE_CLASSES[
                    size
                  ],

                  labelPosition ===
                    "bottom" &&
                    "text-center",

                  labelClassName,
                )
              }
            >
              {normalizedLabel}
            </span>
          ) : (
            <span className="sr-only">
              {normalizedLabel}
            </span>
          )}
        </span>
      );
    },
  );

CreativeSpinner.displayName =
  "CreativeSpinner";

/* =========================================================
   SPINNER DE PANTALLA COMPLETA
   ========================================================= */

export interface CreativeFullscreenSpinnerProps
  extends CreativeSpinnerProps {
  overlayClassName?:
    string;
}

export function CreativeFullscreenSpinner({
  overlayClassName,

  size =
    "xl",

  variant =
    "light",

  label =
    "Cargando diseño...",

  showLabel =
    true,

  labelPosition =
    "bottom",

  ...spinnerProps
}: CreativeFullscreenSpinnerProps) {
  return (
    <div
      role="presentation"
      data-creative-spinner-overlay=""
      className={
        joinCreativeSpinnerClasses(
          "absolute inset-0 z-50",
          "flex items-center justify-center",
          "bg-black/65",
          "backdrop-blur-sm",

          overlayClassName,
        )
      }
    >
      <CreativeSpinner
        {...spinnerProps}
        size={size}
        variant={variant}
        label={label}
        showLabel={showLabel}
        labelPosition={
          labelPosition
        }
      />
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeSpinner;