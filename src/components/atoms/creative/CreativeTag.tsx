"use client";

/*
 * Etiqueta reutilizable del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar herramientas, categorías y palabras clave.
 * - Admitir estados seleccionados.
 * - Permitir interacción opcional.
 * - Permitir eliminar una etiqueta.
 * - Mostrar iconos y contadores.
 * - Mantener accesibilidad mediante botones reales.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Navegación.
 * - Acceso a Prisma.
 * - Lógica administrativa.
 */

import {
  forwardRef,
} from "react";

import type {
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeTagSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeTagVariant =
  | "neutral"
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "violet";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeTagProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    "children"
  > {
  /*
   * Texto principal.
   */
  label:
    string;

  /*
   * Icono anterior al texto.
   */
  icon?:
    ReactNode;

  /*
   * Cantidad opcional.
   *
   * Ejemplos:
   * - Número de publicaciones.
   * - Número de resultados.
   */
  count?:
    number | string | null;

  /*
   * Tamaño visual.
   */
  size?:
    CreativeTagSize;

  /*
   * Variante de color.
   */
  variant?:
    CreativeTagVariant;

  /*
   * Estado seleccionado.
   */
  selected?:
    boolean;

  /*
   * Desactiva las acciones.
   */
  disabled?:
    boolean;

  /*
   * Convierte visualmente el texto a mayúsculas.
   */
  uppercase?:
    boolean;

  /*
   * Limita el texto disponible.
   */
  truncate?:
    boolean;

  /*
   * Acción principal opcional.
   *
   * Cuando existe, el contenido se renderiza como botón.
   */
  onPress?:
    () => void;

  /*
   * Permite mostrar el botón para eliminar.
   */
  removable?:
    boolean;

  /*
   * Acción para eliminar.
   */
  onRemove?:
    () => void;

  /*
   * Etiqueta accesible del botón de eliminación.
   */
  removeLabel?:
    string;

  /*
   * Clases adicionales.
   */
  contentClassName?:
    string;

  iconClassName?:
    string;

  labelClassName?:
    string;

  countClassName?:
    string;

  removeButtonClassName?:
    string;
}

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_TAG_BASE_CLASSES = [
  "inline-flex",
  "max-w-full",
  "items-center",
  "overflow-hidden",
  "rounded-full",
  "border",
  "font-medium",
  "leading-none",
  "transition-all",
  "duration-200",
  "ease-out",

  "data-[disabled=true]:pointer-events-none",
  "data-[disabled=true]:cursor-not-allowed",
  "data-[disabled=true]:opacity-50",

  "motion-reduce:transition-none",
].join(
  " ",
);

/* =========================================================
   CLASES DEL CONTENIDO
   ========================================================= */

const CREATIVE_TAG_CONTENT_BASE_CLASSES = [
  "inline-flex",
  "min-w-0",
  "items-center",
  "justify-center",
  "outline-none",

  "focus-visible:ring-2",
  "focus-visible:ring-emerald-500/60",
  "focus-visible:ring-inset",

  "disabled:cursor-not-allowed",
].join(
  " ",
);

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_TAG_SIZE_CLASSES = {
  sm: {
    root:
      "min-h-6 text-[10px]",

    content:
      "gap-1.5 px-2.5 py-1",

    removableContent:
      "pl-2.5 pr-1 py-1",

    icon:
      "[&>svg]:h-3 [&>svg]:w-3",

    remove:
      "mr-1 h-4 w-4",

    count:
      "min-w-4 px-1 text-[9px]",
  },

  md: {
    root:
      "min-h-7 text-xs",

    content:
      "gap-1.5 px-3 py-1.5",

    removableContent:
      "pl-3 pr-1.5 py-1.5",

    icon:
      "[&>svg]:h-3.5 [&>svg]:w-3.5",

    remove:
      "mr-1 h-5 w-5",

    count:
      "min-w-5 px-1.5 text-[10px]",
  },

  lg: {
    root:
      "min-h-9 text-sm",

    content:
      "gap-2 px-3.5 py-2",

    removableContent:
      "pl-3.5 pr-2 py-2",

    icon:
      "[&>svg]:h-4 [&>svg]:w-4",

    remove:
      "mr-1.5 h-6 w-6",

    count:
      "min-w-6 px-1.5 text-xs",
  },
} as const satisfies Record<
  CreativeTagSize,
  {
    root:
      string;

    content:
      string;

    removableContent:
      string;

    icon:
      string;

    remove:
      string;

    count:
      string;
  }
>;

/* =========================================================
   VARIANTES
   ========================================================= */

const CREATIVE_TAG_VARIANT_CLASSES = {
  neutral: [
    "border-zinc-200",
    "bg-zinc-100/90",
    "text-zinc-700",

    "hover:border-zinc-300",
    "hover:bg-zinc-200/80",

    "dark:border-white/10",
    "dark:bg-white/[0.06]",
    "dark:text-zinc-300",

    "dark:hover:border-white/15",
    "dark:hover:bg-white/[0.10]",
  ].join(
    " ",
  ),

  primary: [
    "border-emerald-500/20",
    "bg-emerald-500/10",
    "text-emerald-700",

    "hover:border-emerald-500/35",
    "hover:bg-emerald-500/15",

    "dark:border-emerald-400/20",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",

    "dark:hover:border-emerald-400/35",
    "dark:hover:bg-emerald-400/15",
  ].join(
    " ",
  ),

  success: [
    "border-green-500/20",
    "bg-green-500/10",
    "text-green-700",

    "hover:border-green-500/35",
    "hover:bg-green-500/15",

    "dark:border-green-400/20",
    "dark:bg-green-400/10",
    "dark:text-green-300",
  ].join(
    " ",
  ),

  info: [
    "border-cyan-500/20",
    "bg-cyan-500/10",
    "text-cyan-700",

    "hover:border-cyan-500/35",
    "hover:bg-cyan-500/15",

    "dark:border-cyan-400/20",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
  ].join(
    " ",
  ),

  warning: [
    "border-amber-500/20",
    "bg-amber-500/10",
    "text-amber-700",

    "hover:border-amber-500/35",
    "hover:bg-amber-500/15",

    "dark:border-amber-400/20",
    "dark:bg-amber-400/10",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  danger: [
    "border-red-500/20",
    "bg-red-500/10",
    "text-red-700",

    "hover:border-red-500/35",
    "hover:bg-red-500/15",

    "dark:border-red-400/20",
    "dark:bg-red-400/10",
    "dark:text-red-300",
  ].join(
    " ",
  ),

  violet: [
    "border-violet-500/20",
    "bg-violet-500/10",
    "text-violet-700",

    "hover:border-violet-500/35",
    "hover:bg-violet-500/15",

    "dark:border-violet-400/20",
    "dark:bg-violet-400/10",
    "dark:text-violet-300",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeTagVariant,
  string
>;

/* =========================================================
   ESTADO SELECCIONADO
   ========================================================= */

const CREATIVE_TAG_SELECTED_CLASSES = {
  neutral: [
    "border-zinc-700",
    "bg-zinc-800",
    "text-white",

    "hover:border-zinc-800",
    "hover:bg-zinc-900",

    "dark:border-zinc-200",
    "dark:bg-zinc-100",
    "dark:text-zinc-950",
  ].join(
    " ",
  ),

  primary: [
    "border-emerald-600",
    "bg-emerald-600",
    "text-white",
    "shadow-[0_6px_18px_rgba(16,185,129,0.20)]",

    "hover:border-emerald-700",
    "hover:bg-emerald-700",

    "dark:border-emerald-400",
    "dark:bg-emerald-400",
    "dark:text-zinc-950",
  ].join(
    " ",
  ),

  success: [
    "border-green-600",
    "bg-green-600",
    "text-white",

    "hover:border-green-700",
    "hover:bg-green-700",

    "dark:border-green-400",
    "dark:bg-green-400",
    "dark:text-zinc-950",
  ].join(
    " ",
  ),

  info: [
    "border-cyan-600",
    "bg-cyan-600",
    "text-white",

    "hover:border-cyan-700",
    "hover:bg-cyan-700",

    "dark:border-cyan-400",
    "dark:bg-cyan-400",
    "dark:text-zinc-950",
  ].join(
    " ",
  ),

  warning: [
    "border-amber-500",
    "bg-amber-500",
    "text-zinc-950",

    "hover:border-amber-600",
    "hover:bg-amber-600",

    "dark:border-amber-400",
    "dark:bg-amber-400",
  ].join(
    " ",
  ),

  danger: [
    "border-red-600",
    "bg-red-600",
    "text-white",

    "hover:border-red-700",
    "hover:bg-red-700",

    "dark:border-red-400",
    "dark:bg-red-400",
    "dark:text-zinc-950",
  ].join(
    " ",
  ),

  violet: [
    "border-violet-600",
    "bg-violet-600",
    "text-white",

    "hover:border-violet-700",
    "hover:bg-violet-700",

    "dark:border-violet-400",
    "dark:bg-violet-400",
    "dark:text-zinc-950",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeTagVariant,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeTagClasses(
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

function normalizeCreativeTagLabel(
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
   NORMALIZAR CONTADOR
   ========================================================= */

function normalizeCreativeTagCount(
  value:
    number | string | null | undefined,
): string {
  if (
    typeof value ===
    "number"
  ) {
    if (
      !Number.isFinite(
        value,
      )
    ) {
      return "";
    }

    return String(
      Math.max(
        0,
        Math.trunc(
          value,
        ),
      ),
    );
  }

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
   ICONO PARA ELIMINAR
   ========================================================= */

function CreativeTagRemoveIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
    >
      <path d="M5 5l10 10" />
      <path d="M15 5 5 15" />
    </svg>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativeTag =
  forwardRef<
    HTMLSpanElement,
    CreativeTagProps
  >(
    function CreativeTag(
      {
        label,

        icon,

        count =
          null,

        size =
          "md",

        variant =
          "neutral",

        selected =
          false,

        disabled =
          false,

        uppercase =
          false,

        truncate =
          false,

        onPress,

        removable =
          false,

        onRemove,

        removeLabel,

        contentClassName,

        iconClassName,

        labelClassName,

        countClassName,

        removeButtonClassName,

        className,

        title,

        "aria-label":
          ariaLabel,

        ...spanProps
      },
      ref,
    ) {
      const normalizedLabel =
        normalizeCreativeTagLabel(
          label,
        );

      const normalizedCount =
        normalizeCreativeTagCount(
          count,
        );

      const interactive =
        typeof onPress ===
        "function";

      const canRemove =
        removable &&
        typeof onRemove ===
          "function";

      const resolvedRemoveLabel =
        normalizeCreativeTagLabel(
          removeLabel,
        ) ||
        `Eliminar ${normalizedLabel}`;

      const handleRemove =
        (
          event:
            MouseEvent<HTMLButtonElement>,
        ): void => {
          event.preventDefault();

          event.stopPropagation();

          if (
            disabled ||
            !onRemove
          ) {
            return;
          }

          onRemove();
        };

      const content = (
        <>
          {icon ? (
            <span
              aria-hidden="true"
              className={
                joinCreativeTagClasses(
                  "flex shrink-0 items-center justify-center",

                  CREATIVE_TAG_SIZE_CLASSES[
                    size
                  ].icon,

                  iconClassName,
                )
              }
            >
              {icon}
            </span>
          ) : null}

          <span
            className={
              joinCreativeTagClasses(
                "min-w-0",

                truncate &&
                  "truncate",

                uppercase &&
                  "uppercase tracking-[0.07em]",

                labelClassName,
              )
            }
          >
            {normalizedLabel}
          </span>

          {normalizedCount ? (
            <span
              aria-label={
                `Cantidad: ${normalizedCount}`
              }
              className={
                joinCreativeTagClasses(
                  "inline-flex shrink-0 items-center justify-center",
                  "rounded-full",
                  "bg-black/[0.08]",
                  "font-bold tabular-nums",

                  "dark:bg-white/[0.12]",

                  CREATIVE_TAG_SIZE_CLASSES[
                    size
                  ].count,

                  countClassName,
                )
              }
            >
              {normalizedCount}
            </span>
          ) : null}
        </>
      );

      return (
        <span
          {...spanProps}
          ref={ref}
          title={
            title ??
            normalizedLabel
          }
          aria-label={
            ariaLabel ??
            normalizedLabel
          }
          data-creative-tag=""
          data-size={
            size
          }
          data-variant={
            variant
          }
          data-selected={
            selected
              ? "true"
              : "false"
          }
          data-disabled={
            disabled
              ? "true"
              : "false"
          }
          className={
            joinCreativeTagClasses(
              CREATIVE_TAG_BASE_CLASSES,

              CREATIVE_TAG_SIZE_CLASSES[
                size
              ].root,

              CREATIVE_TAG_VARIANT_CLASSES[
                variant
              ],

              selected &&
                CREATIVE_TAG_SELECTED_CLASSES[
                  variant
                ],

              className,
            )
          }
        >
          {interactive ? (
            <button
              type="button"
              disabled={
                disabled
              }
              aria-pressed={
                selected
              }
              onClick={
                onPress
              }
              className={
                joinCreativeTagClasses(
                  CREATIVE_TAG_CONTENT_BASE_CLASSES,

                  canRemove
                    ? CREATIVE_TAG_SIZE_CLASSES[
                        size
                      ].removableContent
                    : CREATIVE_TAG_SIZE_CLASSES[
                        size
                      ].content,

                  interactive &&
                    "cursor-pointer",

                  contentClassName,
                )
              }
            >
              {content}
            </button>
          ) : (
            <span
              className={
                joinCreativeTagClasses(
                  CREATIVE_TAG_CONTENT_BASE_CLASSES,

                  canRemove
                    ? CREATIVE_TAG_SIZE_CLASSES[
                        size
                      ].removableContent
                    : CREATIVE_TAG_SIZE_CLASSES[
                        size
                      ].content,

                  contentClassName,
                )
              }
            >
              {content}
            </span>
          )}

          {canRemove ? (
            <button
              type="button"
              disabled={
                disabled
              }
              aria-label={
                resolvedRemoveLabel
              }
              title={
                resolvedRemoveLabel
              }
              onClick={
                handleRemove
              }
              className={
                joinCreativeTagClasses(
                  "inline-flex shrink-0 items-center justify-center",
                  "rounded-full",
                  "outline-none",
                  "transition-colors",
                  "duration-150",

                  "hover:bg-black/[0.10]",
                  "focus-visible:ring-2",
                  "focus-visible:ring-current",
                  "focus-visible:ring-offset-1",

                  "dark:hover:bg-white/[0.12]",

                  "disabled:pointer-events-none",
                  "disabled:opacity-50",

                  CREATIVE_TAG_SIZE_CLASSES[
                    size
                  ].remove,

                  removeButtonClassName,
                )
              }
            >
              <CreativeTagRemoveIcon />
            </button>
          ) : null}
        </span>
      );
    },
  );

CreativeTag.displayName =
  "CreativeTag";

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeTag;