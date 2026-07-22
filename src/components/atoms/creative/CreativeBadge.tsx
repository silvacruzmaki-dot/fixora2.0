/*
 * Insignia reutilizable del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar tipos de contenido.
 * - Mostrar estados administrativos.
 * - Mostrar etiquetas destacadas.
 * - Admitir texto personalizado.
 * - Mantener accesibilidad y consistencia visual.
 * - Funcionar en componentes de servidor y cliente.
 *
 * Este componente no contiene:
 * - Estado React.
 * - Solicitudes HTTP.
 * - Lógica administrativa.
 * - Navegación.
 * - Dependencias externas.
 */

import {
  forwardRef,
} from "react";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeBadgeLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeBadgeSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES VISUALES
   ========================================================= */

export type CreativeBadgeVariant =
  | "neutral"
  | "free"
  | "paid"
  | "portfolio"
  | "featured"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "draft"
  | "published"
  | "hidden"
  | "archived";

/* =========================================================
   TIPOS OFICIALES
   ========================================================= */

export type CreativeBadgeKind =
  | "FREE"
  | "PAID"
  | "PORTFOLIO"
  | "FEATURED"
  | "NEW"
  | "DRAFT"
  | "PUBLISHED"
  | "HIDDEN"
  | "ARCHIVED";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeBadgeProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    "children"
  > {
  /*
   * Tipo oficial de insignia.
   *
   * Cuando se proporciona, determina automáticamente:
   * - Texto.
   * - Variante visual.
   */
  kind?:
    CreativeBadgeKind;

  /*
   * Variante manual.
   *
   * Se utiliza cuando no se proporciona kind.
   */
  variant?:
    CreativeBadgeVariant;

  /*
   * Idioma del texto automático.
   */
  language?:
    CreativeBadgeLanguage;

  /*
   * Texto personalizado.
   *
   * Tiene prioridad sobre el texto automático.
   */
  label?:
    string;

  /*
   * Contenido completamente personalizado.
   *
   * Tiene prioridad sobre label y kind.
   */
  children?:
    ReactNode;

  /*
   * Icono mostrado antes del texto.
   */
  icon?:
    ReactNode;

  /*
   * Muestra un punto de estado.
   */
  showDot?:
    boolean;

  /*
   * Hace que el punto de estado tenga animación.
   */
  pulseDot?:
    boolean;

  /*
   * Tamaño de la insignia.
   */
  size?:
    CreativeBadgeSize;

  /*
   * Convierte visualmente el texto a mayúsculas.
   */
  uppercase?:
    boolean;

  /*
   * Evita que el contenido se extienda demasiado.
   */
  truncate?:
    boolean;
}

/* =========================================================
   TEXTOS AUTOMÁTICOS
   ========================================================= */

const CREATIVE_BADGE_LABELS = {
  FREE: {
    es:
      "Gratis",

    en:
      "Free",
  },

  PAID: {
    es:
      "De pago",

    en:
      "Paid",
  },

  PORTFOLIO: {
    es:
      "Portafolio",

    en:
      "Portfolio",
  },

  FEATURED: {
    es:
      "Destacado",

    en:
      "Featured",
  },

  NEW: {
    es:
      "Nuevo",

    en:
      "New",
  },

  DRAFT: {
    es:
      "Borrador",

    en:
      "Draft",
  },

  PUBLISHED: {
    es:
      "Publicado",

    en:
      "Published",
  },

  HIDDEN: {
    es:
      "Oculto",

    en:
      "Hidden",
  },

  ARCHIVED: {
    es:
      "Archivado",

    en:
      "Archived",
  },
} as const satisfies Record<
  CreativeBadgeKind,
  Record<
    CreativeBadgeLanguage,
    string
  >
>;

/* =========================================================
   VARIANTE POR TIPO
   ========================================================= */

const CREATIVE_BADGE_KIND_VARIANTS = {
  FREE:
    "free",

  PAID:
    "paid",

  PORTFOLIO:
    "portfolio",

  FEATURED:
    "featured",

  NEW:
    "info",

  DRAFT:
    "draft",

  PUBLISHED:
    "published",

  HIDDEN:
    "hidden",

  ARCHIVED:
    "archived",
} as const satisfies Record<
  CreativeBadgeKind,
  CreativeBadgeVariant
>;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_BADGE_BASE_CLASSES = [
  "inline-flex",
  "max-w-full",
  "items-center",
  "justify-center",
  "rounded-full",
  "border",
  "font-semibold",
  "leading-none",
  "whitespace-nowrap",
  "transition-colors",
  "duration-200",
  "select-none",
].join(" ");

/* =========================================================
   CLASES POR TAMAÑO
   ========================================================= */

const CREATIVE_BADGE_SIZE_CLASSES = {
  sm: [
    "min-h-6",
    "gap-1.5",
    "px-2.5",
    "py-1",
    "text-[10px]",
  ].join(" "),

  md: [
    "min-h-7",
    "gap-1.5",
    "px-3",
    "py-1.5",
    "text-xs",
  ].join(" "),

  lg: [
    "min-h-8",
    "gap-2",
    "px-3.5",
    "py-2",
    "text-sm",
  ].join(" "),
} as const satisfies Record<
  CreativeBadgeSize,
  string
>;

/* =========================================================
   CLASES POR VARIANTE
   ========================================================= */

const CREATIVE_BADGE_VARIANT_CLASSES = {
  neutral: [
    "border-zinc-300/80",
    "bg-zinc-100/90",
    "text-zinc-700",
    "dark:border-white/10",
    "dark:bg-white/[0.06]",
    "dark:text-zinc-300",
  ].join(" "),

  free: [
    "border-emerald-500/25",
    "bg-emerald-500/10",
    "text-emerald-700",
    "shadow-[0_0_20px_rgba(16,185,129,0.08)]",
    "dark:border-emerald-400/25",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(" "),

  paid: [
    "border-amber-500/25",
    "bg-amber-500/10",
    "text-amber-700",
    "shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    "dark:border-amber-400/25",
    "dark:bg-amber-400/10",
    "dark:text-amber-300",
  ].join(" "),

  portfolio: [
    "border-cyan-500/25",
    "bg-cyan-500/10",
    "text-cyan-700",
    "shadow-[0_0_20px_rgba(6,182,212,0.08)]",
    "dark:border-cyan-400/25",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
  ].join(" "),

  featured: [
    "border-violet-500/25",
    "bg-violet-500/10",
    "text-violet-700",
    "shadow-[0_0_20px_rgba(139,92,246,0.08)]",
    "dark:border-violet-400/25",
    "dark:bg-violet-400/10",
    "dark:text-violet-300",
  ].join(" "),

  success: [
    "border-green-500/25",
    "bg-green-500/10",
    "text-green-700",
    "dark:border-green-400/25",
    "dark:bg-green-400/10",
    "dark:text-green-300",
  ].join(" "),

  warning: [
    "border-orange-500/25",
    "bg-orange-500/10",
    "text-orange-700",
    "dark:border-orange-400/25",
    "dark:bg-orange-400/10",
    "dark:text-orange-300",
  ].join(" "),

  danger: [
    "border-red-500/25",
    "bg-red-500/10",
    "text-red-700",
    "dark:border-red-400/25",
    "dark:bg-red-400/10",
    "dark:text-red-300",
  ].join(" "),

  info: [
    "border-blue-500/25",
    "bg-blue-500/10",
    "text-blue-700",
    "dark:border-blue-400/25",
    "dark:bg-blue-400/10",
    "dark:text-blue-300",
  ].join(" "),

  draft: [
    "border-slate-400/30",
    "bg-slate-500/10",
    "text-slate-700",
    "dark:border-slate-400/25",
    "dark:bg-slate-400/10",
    "dark:text-slate-300",
  ].join(" "),

  published: [
    "border-emerald-500/25",
    "bg-emerald-500/10",
    "text-emerald-700",
    "dark:border-emerald-400/25",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(" "),

  hidden: [
    "border-yellow-500/25",
    "bg-yellow-500/10",
    "text-yellow-700",
    "dark:border-yellow-400/25",
    "dark:bg-yellow-400/10",
    "dark:text-yellow-300",
  ].join(" "),

  archived: [
    "border-zinc-400/25",
    "bg-zinc-500/10",
    "text-zinc-600",
    "dark:border-zinc-400/20",
    "dark:bg-zinc-400/10",
    "dark:text-zinc-400",
  ].join(" "),
} as const satisfies Record<
  CreativeBadgeVariant,
  string
>;

/* =========================================================
   CLASES DEL PUNTO
   ========================================================= */

const CREATIVE_BADGE_DOT_CLASSES = {
  neutral:
    "bg-zinc-500",

  free:
    "bg-emerald-500",

  paid:
    "bg-amber-500",

  portfolio:
    "bg-cyan-500",

  featured:
    "bg-violet-500",

  success:
    "bg-green-500",

  warning:
    "bg-orange-500",

  danger:
    "bg-red-500",

  info:
    "bg-blue-500",

  draft:
    "bg-slate-500",

  published:
    "bg-emerald-500",

  hidden:
    "bg-yellow-500",

  archived:
    "bg-zinc-500",
} as const satisfies Record<
  CreativeBadgeVariant,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeBadgeClasses(
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
   RESOLVER TEXTO
   ========================================================= */

export function getCreativeBadgeLabel(
  kind:
    CreativeBadgeKind,
  language:
    CreativeBadgeLanguage = "es",
): string {
  return CREATIVE_BADGE_LABELS[
    kind
  ][
    language
  ];
}

/* =========================================================
   RESOLVER VARIANTE
   ========================================================= */

export function getCreativeBadgeVariant(
  kind:
    CreativeBadgeKind,
): CreativeBadgeVariant {
  return CREATIVE_BADGE_KIND_VARIANTS[
    kind
  ];
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativeBadge =
  forwardRef<
    HTMLSpanElement,
    CreativeBadgeProps
  >(
    function CreativeBadge(
      {
        kind,

        variant =
          "neutral",

        language =
          "es",

        label,

        children,

        icon,

        showDot =
          false,

        pulseDot =
          false,

        size =
          "md",

        uppercase =
          false,

        truncate =
          false,

        className,

        title,

        ...spanProps
      },
      ref,
    ) {
      const resolvedVariant =
        kind
          ? getCreativeBadgeVariant(
              kind,
            )
          : variant;

      const automaticLabel =
        kind
          ? getCreativeBadgeLabel(
              kind,
              language,
            )
          : "";

      const resolvedLabel =
        label?.trim() ||
        automaticLabel;

      const resolvedContent =
        children ??
        resolvedLabel;

      const accessibleLabel =
        typeof resolvedContent ===
          "string"
          ? resolvedContent
          : resolvedLabel ||
            undefined;

      return (
        <span
          {...spanProps}
          ref={ref}
          title={
            title ??
            accessibleLabel
          }
          aria-label={
            spanProps[
              "aria-label"
            ] ??
            accessibleLabel
          }
          data-creative-badge=""
          data-kind={
            kind ??
            undefined
          }
          data-variant={
            resolvedVariant
          }
          className={
            joinCreativeBadgeClasses(
              CREATIVE_BADGE_BASE_CLASSES,

              CREATIVE_BADGE_SIZE_CLASSES[
                size
              ],

              CREATIVE_BADGE_VARIANT_CLASSES[
                resolvedVariant
              ],

              uppercase &&
                "uppercase tracking-[0.08em]",

              truncate &&
                "min-w-0 overflow-hidden",

              className,
            )
          }
        >
          {showDot ? (
            <span
              aria-hidden="true"
              className={
                joinCreativeBadgeClasses(
                  "relative inline-flex h-2 w-2 shrink-0 rounded-full",

                  CREATIVE_BADGE_DOT_CLASSES[
                    resolvedVariant
                  ],
                )
              }
            >
              {pulseDot ? (
                <span
                  className={
                    joinCreativeBadgeClasses(
                      "absolute inset-0 rounded-full opacity-70",
                      "animate-ping",
                      CREATIVE_BADGE_DOT_CLASSES[
                        resolvedVariant
                      ],
                    )
                  }
                />
              ) : null}
            </span>
          ) : null}

          {icon ? (
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center justify-center"
            >
              {icon}
            </span>
          ) : null}

          <span
            className={
              truncate
                ? "min-w-0 truncate"
                : undefined
            }
          >
            {resolvedContent}
          </span>
        </span>
      );
    },
  );

CreativeBadge.displayName =
  "CreativeBadge";

/* =========================================================
   INSIGNIA DE TIPO DE CONTENIDO
   ========================================================= */

export type CreativeContentTypeBadgeValue =
  | "FREE"
  | "PAID"
  | "PORTFOLIO";

export interface CreativeContentTypeBadgeProps
  extends Omit<
    CreativeBadgeProps,
    | "kind"
    | "variant"
    | "label"
    | "children"
  > {
  contentType:
    CreativeContentTypeBadgeValue;
}

export function CreativeContentTypeBadge({
  contentType,
  ...badgeProps
}: CreativeContentTypeBadgeProps) {
  return (
    <CreativeBadge
      {...badgeProps}
      kind={contentType}
    />
  );
}

/* =========================================================
   INSIGNIA DE ESTADO ADMINISTRATIVO
   ========================================================= */

export type CreativeStatusBadgeValue =
  | "DRAFT"
  | "PUBLISHED"
  | "HIDDEN"
  | "ARCHIVED";

export interface CreativeStatusBadgeProps
  extends Omit<
    CreativeBadgeProps,
    | "kind"
    | "variant"
    | "label"
    | "children"
  > {
  status:
    CreativeStatusBadgeValue;
}

export function CreativeStatusBadge({
  status,
  showDot =
    true,
  ...badgeProps
}: CreativeStatusBadgeProps) {
  return (
    <CreativeBadge
      {...badgeProps}
      kind={status}
      showDot={showDot}
      pulseDot={
        badgeProps.pulseDot ??
        status ===
          "PUBLISHED"
      }
    />
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeBadge;