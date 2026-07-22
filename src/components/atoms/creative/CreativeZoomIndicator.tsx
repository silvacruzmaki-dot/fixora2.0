/*
 * Indicador de zoom reutilizable del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar el porcentaje actual de ampliación.
 * - Mantener el valor dentro de los límites permitidos.
 * - Mostrar opcionalmente una barra de progreso.
 * - Indicar cuando el zoom está en su valor predeterminado.
 * - Funcionar en el visor, herramientas y administración.
 * - Mantener accesibilidad mediante atributos ARIA.
 *
 * No contiene:
 * - Estado React.
 * - Eventos del visor.
 * - Solicitudes HTTP.
 * - Lógica de desplazamiento.
 */

import {
  forwardRef,
} from "react";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeZoomIndicatorSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeZoomIndicatorVariant =
  | "surface"
  | "dark"
  | "primary"
  | "minimal";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeZoomIndicatorProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    "children"
  > {
  /*
   * Escala actual.
   *
   * Ejemplos:
   * 1    = 100 %
   * 1.5  = 150 %
   * 0.5  = 50 %
   */
  scale?:
    number | null;

  /*
   * Porcentaje directo.
   *
   * Tiene prioridad sobre scale.
   */
  percentage?:
    number | null;

  /*
   * Límites expresados como escala.
   */
  minimumScale?:
    number;

  maximumScale?:
    number;

  /*
   * Escala predeterminada.
   */
  defaultScale?:
    number;

  /*
   * Tamaño visual.
   */
  size?:
    CreativeZoomIndicatorSize;

  /*
   * Variante visual.
   */
  variant?:
    CreativeZoomIndicatorVariant;

  /*
   * Texto anterior al porcentaje.
   */
  label?:
    string | null;

  /*
   * Muestra u oculta el texto anterior.
   */
  showLabel?:
    boolean;

  /*
   * Muestra una barra visual del nivel de zoom.
   */
  showProgress?:
    boolean;

  /*
   * Muestra la palabra "Predeterminado" cuando
   * el zoom coincide con defaultScale.
   */
  showDefaultState?:
    boolean;

  /*
   * Texto personalizado del estado predeterminado.
   */
  defaultLabel?:
    string;

  /*
   * Icono opcional.
   */
  icon?:
    ReactNode;

  /*
   * Cantidad de decimales permitidos.
   */
  decimalPlaces?:
    0 | 1 | 2;

  /*
   * Clases adicionales.
   */
  iconClassName?:
    string;

  labelClassName?:
    string;

  valueClassName?:
    string;

  progressClassName?:
    string;

  progressBarClassName?:
    string;
}

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_ZOOM_INDICATOR_BASE_CLASSES = [
  "inline-flex",
  "max-w-full",
  "items-center",
  "font-semibold",
  "leading-none",
  "tabular-nums",
  "transition-colors",
  "duration-200",
  "select-none",
].join(
  " ",
);

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_ZOOM_INDICATOR_SIZE_CLASSES = {
  sm: [
    "min-h-7",
    "gap-1.5",
    "rounded-lg",
    "px-2.5",
    "py-1.5",
    "text-[10px]",
  ].join(
    " ",
  ),

  md: [
    "min-h-9",
    "gap-2",
    "rounded-xl",
    "px-3",
    "py-2",
    "text-xs",
  ].join(
    " ",
  ),

  lg: [
    "min-h-11",
    "gap-2.5",
    "rounded-2xl",
    "px-4",
    "py-2.5",
    "text-sm",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeZoomIndicatorSize,
  string
>;

/* =========================================================
   TAMAÑOS DEL ICONO
   ========================================================= */

const CREATIVE_ZOOM_INDICATOR_ICON_SIZE_CLASSES = {
  sm:
    "[&>svg]:h-3.5 [&>svg]:w-3.5",

  md:
    "[&>svg]:h-4 [&>svg]:w-4",

  lg:
    "[&>svg]:h-[18px] [&>svg]:w-[18px]",
} as const satisfies Record<
  CreativeZoomIndicatorSize,
  string
>;

/* =========================================================
   VARIANTES VISUALES
   ========================================================= */

const CREATIVE_ZOOM_INDICATOR_VARIANT_CLASSES = {
  surface: [
    "border",
    "border-zinc-200/90",
    "bg-white/90",
    "text-zinc-700",
    "shadow-[0_8px_24px_rgba(15,23,42,0.08)]",
    "backdrop-blur-xl",

    "dark:border-white/10",
    "dark:bg-zinc-900/85",
    "dark:text-zinc-200",
    "dark:shadow-[0_8px_24px_rgba(0,0,0,0.30)]",
  ].join(
    " ",
  ),

  dark: [
    "border",
    "border-white/10",
    "bg-black/65",
    "text-white",
    "shadow-[0_8px_24px_rgba(0,0,0,0.30)]",
    "backdrop-blur-xl",
  ].join(
    " ",
  ),

  primary: [
    "border",
    "border-emerald-500/25",
    "bg-emerald-500/10",
    "text-emerald-700",
    "shadow-[0_8px_24px_rgba(16,185,129,0.12)]",

    "dark:border-emerald-400/25",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(
    " ",
  ),

  minimal: [
    "border-transparent",
    "bg-transparent",
    "text-zinc-600",

    "dark:text-zinc-300",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeZoomIndicatorVariant,
  string
>;

/* =========================================================
   BARRA DE PROGRESO
   ========================================================= */

const CREATIVE_ZOOM_INDICATOR_PROGRESS_VARIANT_CLASSES = {
  surface: [
    "bg-zinc-200",
    "dark:bg-white/10",
  ].join(
    " ",
  ),

  dark:
    "bg-white/15",

  primary: [
    "bg-emerald-500/15",
    "dark:bg-emerald-400/15",
  ].join(
    " ",
  ),

  minimal: [
    "bg-zinc-200",
    "dark:bg-white/10",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeZoomIndicatorVariant,
  string
>;

const CREATIVE_ZOOM_INDICATOR_BAR_VARIANT_CLASSES = {
  surface: [
    "bg-emerald-500",
    "dark:bg-emerald-400",
  ].join(
    " ",
  ),

  dark:
    "bg-white",

  primary: [
    "bg-emerald-600",
    "dark:bg-emerald-300",
  ].join(
    " ",
  ),

  minimal: [
    "bg-emerald-500",
    "dark:bg-emerald-400",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeZoomIndicatorVariant,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeZoomIndicatorClasses(
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
   LIMITAR NÚMERO
   ========================================================= */

function clampCreativeZoomValue(
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

/* =========================================================
   NORMALIZAR ESCALA
   ========================================================= */

function normalizeCreativeZoomScale(
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
   NORMALIZAR PORCENTAJE
   ========================================================= */

function normalizeCreativeZoomPercentage(
  percentage:
    number | null | undefined,
  scale:
    number,
): number {
  if (
    typeof percentage ===
      "number" &&
    Number.isFinite(
      percentage,
    )
  ) {
    return Math.max(
      0,
      percentage,
    );
  }

  return Math.max(
    0,
    scale *
    100,
  );
}

/* =========================================================
   NORMALIZAR TEXTO
   ========================================================= */

function normalizeCreativeZoomText(
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
   COMPARAR ESCALAS
   ========================================================= */

function areCreativeZoomValuesEqual(
  firstValue:
    number,
  secondValue:
    number,
): boolean {
  return (
    Math.abs(
      firstValue -
      secondValue,
    ) <=
    0.0001
  );
}

/* =========================================================
   FORMATEAR PORCENTAJE
   ========================================================= */

export function formatCreativeZoomPercentage(
  percentage:
    number,
  decimalPlaces:
    0 | 1 | 2 = 0,
): string {
  const normalizedPercentage =
    Number.isFinite(
      percentage,
    )
      ? Math.max(
          0,
          percentage,
        )
      : 100;

  const formattedValue =
    normalizedPercentage.toFixed(
      decimalPlaces,
    );

  if (
    decimalPlaces ===
    0
  ) {
    return `${formattedValue}%`;
  }

  return `${formattedValue.replace(
    /\.?0+$/,
    "",
  )}%`;
}

/* =========================================================
   CALCULAR PROGRESO
   ========================================================= */

export function calculateCreativeZoomProgress(
  scale:
    number,
  minimumScale:
    number,
  maximumScale:
    number,
): number {
  if (
    maximumScale <=
    minimumScale
  ) {
    return 100;
  }

  const normalizedScale =
    clampCreativeZoomValue(
      scale,
      minimumScale,
      maximumScale,
    );

  return (
    (
      normalizedScale -
      minimumScale
    ) /
    (
      maximumScale -
      minimumScale
    )
  ) *
  100;
}

/* =========================================================
   ICONO PREDETERMINADO
   ========================================================= */

function CreativeZoomIndicatorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />

      <path d="M8 11h6" />

      <path d="M11 8v6" />
    </svg>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativeZoomIndicator =
  forwardRef<
    HTMLSpanElement,
    CreativeZoomIndicatorProps
  >(
    function CreativeZoomIndicator(
      {
        scale =
          1,

        percentage =
          null,

        minimumScale =
          0.5,

        maximumScale =
          4,

        defaultScale =
          1,

        size =
          "md",

        variant =
          "surface",

        label =
          "Zoom",

        showLabel =
          false,

        showProgress =
          false,

        showDefaultState =
          false,

        defaultLabel =
          "Predeterminado",

        icon,

        decimalPlaces =
          0,

        iconClassName,

        labelClassName,

        valueClassName,

        progressClassName,

        progressBarClassName,

        className,

        title,

        "aria-label":
          ariaLabel,

        ...spanProps
      },
      ref,
    ) {
      const normalizedMinimumScale =
        normalizeCreativeZoomScale(
          minimumScale,
          0.5,
        );

      const requestedMaximumScale =
        normalizeCreativeZoomScale(
          maximumScale,
          4,
        );

      const normalizedMaximumScale =
        Math.max(
          normalizedMinimumScale,
          requestedMaximumScale,
        );

      const normalizedDefaultScale =
        clampCreativeZoomValue(
          normalizeCreativeZoomScale(
            defaultScale,
            1,
          ),
          normalizedMinimumScale,
          normalizedMaximumScale,
        );

      const normalizedScale =
        clampCreativeZoomValue(
          normalizeCreativeZoomScale(
            scale,
            normalizedDefaultScale,
          ),
          normalizedMinimumScale,
          normalizedMaximumScale,
        );

      const normalizedPercentage =
        normalizeCreativeZoomPercentage(
          percentage,
          normalizedScale,
        );

      const formattedPercentage =
        formatCreativeZoomPercentage(
          normalizedPercentage,
          decimalPlaces,
        );

      const normalizedLabel =
        normalizeCreativeZoomText(
          label,
        ) ||
        "Zoom";

      const normalizedDefaultLabel =
        normalizeCreativeZoomText(
          defaultLabel,
        ) ||
        "Predeterminado";

      const isDefault =
        areCreativeZoomValuesEqual(
          normalizedScale,
          normalizedDefaultScale,
        );

      const progress =
        calculateCreativeZoomProgress(
          normalizedScale,
          normalizedMinimumScale,
          normalizedMaximumScale,
        );

      const minimumPercentage =
        Math.round(
          normalizedMinimumScale *
          100,
        );

      const maximumPercentage =
        Math.round(
          normalizedMaximumScale *
          100,
        );

      const accessibleLabel =
        ariaLabel ??
        `${normalizedLabel}: ${formattedPercentage}`;

      return (
        <span
          {...spanProps}
          ref={ref}
          role="status"
          aria-label={
            accessibleLabel
          }
          title={
            title ??
            accessibleLabel
          }
          data-creative-zoom-indicator=""
          data-size={
            size
          }
          data-variant={
            variant
          }
          data-default={
            isDefault
              ? "true"
              : "false"
          }
          data-percentage={
            normalizedPercentage
          }
          className={
            joinCreativeZoomIndicatorClasses(
              CREATIVE_ZOOM_INDICATOR_BASE_CLASSES,

              CREATIVE_ZOOM_INDICATOR_SIZE_CLASSES[
                size
              ],

              CREATIVE_ZOOM_INDICATOR_VARIANT_CLASSES[
                variant
              ],

              showProgress &&
                "flex-wrap",

              className,
            )
          }
        >
          <span
            aria-hidden="true"
            className={
              joinCreativeZoomIndicatorClasses(
                "flex shrink-0 items-center justify-center",

                CREATIVE_ZOOM_INDICATOR_ICON_SIZE_CLASSES[
                  size
                ],

                iconClassName,
              )
            }
          >
            {icon ??
            (
              <CreativeZoomIndicatorIcon />
            )}
          </span>

          {showLabel ? (
            <span
              className={
                joinCreativeZoomIndicatorClasses(
                  "font-medium opacity-75",

                  labelClassName,
                )
              }
            >
              {normalizedLabel}
            </span>
          ) : null}

          <span
            className={
              joinCreativeZoomIndicatorClasses(
                "shrink-0 font-bold tabular-nums",

                valueClassName,
              )
            }
          >
            {formattedPercentage}
          </span>

          {showDefaultState &&
          isDefault ? (
            <span
              className={[
                "rounded-full",
                "bg-current/10",
                "px-1.5",
                "py-1",
                "text-[9px]",
                "font-semibold",
                "opacity-80",
              ].join(
                " ",
              )}
            >
              {normalizedDefaultLabel}
            </span>
          ) : null}

          {showProgress ? (
            <span
              role="progressbar"
              aria-label={
                normalizedLabel
              }
              aria-valuemin={
                minimumPercentage
              }
              aria-valuemax={
                maximumPercentage
              }
              aria-valuenow={
                Math.round(
                  normalizedPercentage,
                )
              }
              className={
                joinCreativeZoomIndicatorClasses(
                  "relative h-1.5 w-full basis-full overflow-hidden rounded-full",

                  CREATIVE_ZOOM_INDICATOR_PROGRESS_VARIANT_CLASSES[
                    variant
                  ],

                  progressClassName,
                )
              }
            >
              <span
                aria-hidden="true"
                className={
                  joinCreativeZoomIndicatorClasses(
                    "absolute inset-y-0 left-0 rounded-full",
                    "transition-[width]",
                    "duration-200",
                    "ease-out",
                    "motion-reduce:transition-none",

                    CREATIVE_ZOOM_INDICATOR_BAR_VARIANT_CLASSES[
                      variant
                    ],

                    progressBarClassName,
                  )
                }
                style={{
                  width:
                    `${progress}%`,
                }}
              />
            </span>
          ) : null}
        </span>
      );
    },
  );

CreativeZoomIndicator.displayName =
  "CreativeZoomIndicator";

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeZoomIndicator;