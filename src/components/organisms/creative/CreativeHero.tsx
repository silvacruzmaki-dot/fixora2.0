"use client";

/*
 * Hero principal del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Presentar la sección Diseño.
 * - Mostrar publicaciones FREE, PAID y PORTFOLIO.
 * - Mostrar accesos principales al catálogo y portafolio.
 * - Mostrar características, métricas y trabajos destacados.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Acceso a Prisma.
 * - Navegación interna directa.
 *
 * Las acciones son controladas por el componente padre.
 */

import {
  useId,
} from "react";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type {
  CreativeContentType,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeHeroLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeHeroSize =
  | "default"
  | "wide";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeHeroVariant =
  | "surface"
  | "dark"
  | "minimal";

/* =========================================================
   ACCIONES EN PROCESO
   ========================================================= */

export type CreativeHeroLoadingAction =
  | "PRIMARY"
  | "SECONDARY"
  | null;

/* =========================================================
   MÉTRICA
   ========================================================= */

export interface CreativeHeroMetric {
  id:
    string;

  value:
    string;

  label:
    string;
}

/* =========================================================
   PUBLICACIÓN DESTACADA
   ========================================================= */

export interface CreativeHeroShowcaseItem {
  id:
    string;

  title:
    string;

  subtitle?:
    string | null;

  contentType:
    CreativeContentType;

  badge?:
    string | null;

  preview?:
    ReactNode;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeHeroProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "children"
  > {
  language?:
    CreativeHeroLanguage;

  size?:
    CreativeHeroSize;

  variant?:
    CreativeHeroVariant;

  eyebrow?:
    string | null;

  heading?:
    string | null;

  highlightedText?:
    string | null;

  description?:
    string | null;

  primaryActionLabel?:
    string | null;

  secondaryActionLabel?:
    string | null;

  loadingAction?:
    CreativeHeroLoadingAction;

  disabled?:
    boolean;

  onPrimaryAction?:
    () => void | Promise<void>;

  onSecondaryAction?:
    () => void | Promise<void>;

  highlights?:
    string[];

  metrics?:
    CreativeHeroMetric[];

  showcaseItems?:
    CreativeHeroShowcaseItem[];

  showEyebrow?:
    boolean;

  showHighlights?:
    boolean;

  showMetrics?:
    boolean;

  showShowcase?:
    boolean;

  showPrimaryAction?:
    boolean;

  showSecondaryAction?:
    boolean;

  leadingContent?:
    ReactNode;

  visualContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  contentClassName?:
    string;

  actionsClassName?:
    string;

  highlightsClassName?:
    string;

  metricsClassName?:
    string;

  visualClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_HERO_COPY = {
  es: {
    section:
      "Presentación del módulo Diseño",

    eyebrow:
      "DISEÑO DIGITAL · FIXORA",

    heading:
      "Diseños que convierten ideas en",

    highlightedText:
      "experiencias visuales",

    description:
      "Explora recursos gratuitos, diseños premium y proyectos de portafolio creados para marcas, negocios y creadores.",

    primaryAction:
      "Explorar diseños",

    secondaryAction:
      "Ver portafolio",

    loadingPrimary:
      "Abriendo catálogo...",

    loadingSecondary:
      "Abriendo portafolio...",

    free:
      "Gratis",

    paid:
      "Premium",

    portfolio:
      "Portafolio",

    defaultHighlights: [
      "Descargas gratuitas",
      "Diseños premium",
      "Trabajos personalizados",
    ],

    showcaseTitle:
      "Catálogo creativo",

    showcaseDescription:
      "Recursos para diferentes necesidades visuales.",

    freeCard:
      "Recursos descargables",

    paidCard:
      "Diseños profesionales",

    portfolioCard:
      "Proyectos realizados",
  },

  en: {
    section:
      "Creative module presentation",

    eyebrow:
      "DIGITAL DESIGN · FIXORA",

    heading:
      "Designs that transform ideas into",

    highlightedText:
      "visual experiences",

    description:
      "Explore free resources, premium designs and portfolio projects created for brands, businesses and creators.",

    primaryAction:
      "Explore designs",

    secondaryAction:
      "View portfolio",

    loadingPrimary:
      "Opening catalog...",

    loadingSecondary:
      "Opening portfolio...",

    free:
      "Free",

    paid:
      "Premium",

    portfolio:
      "Portfolio",

    defaultHighlights: [
      "Free downloads",
      "Premium designs",
      "Custom work",
    ],

    showcaseTitle:
      "Creative catalog",

    showcaseDescription:
      "Resources for different visual needs.",

    freeCard:
      "Downloadable resources",

    paidCard:
      "Professional designs",

    portfolioCard:
      "Completed projects",
  },
} as const;

/* =========================================================
   CLASES
   ========================================================= */

const CREATIVE_HERO_SIZE_CLASSES = {
  default:
    "max-w-7xl",

  wide:
    "max-w-[1600px]",
} as const satisfies Record<
  CreativeHeroSize,
  string
>;

const CREATIVE_HERO_VARIANT_CLASSES = {
  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "text-zinc-950",
    "shadow-[0_24px_80px_rgba(15,23,42,0.10)]",
    "backdrop-blur-2xl",

    "dark:border-white/10",
    "dark:bg-zinc-950/88",
    "dark:text-white",
    "dark:shadow-[0_28px_90px_rgba(0,0,0,0.40)]",
  ].join(
    " ",
  ),

  dark: [
    "border-white/10",
    "bg-zinc-950/92",
    "text-white",
    "shadow-[0_28px_90px_rgba(0,0,0,0.46)]",
    "backdrop-blur-2xl",
  ].join(
    " ",
  ),

  minimal: [
    "border-transparent",
    "bg-transparent",
    "text-zinc-950",

    "dark:text-white",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeHeroVariant,
  string
>;

const CREATIVE_HERO_TYPE_CLASSES = {
  FREE: [
    "border-emerald-500/25",
    "bg-emerald-500/10",
    "text-emerald-700",

    "dark:border-emerald-400/25",
    "dark:bg-emerald-400/10",
    "dark:text-emerald-300",
  ].join(
    " ",
  ),

  PAID: [
    "border-amber-500/25",
    "bg-amber-500/10",
    "text-amber-700",

    "dark:border-amber-400/25",
    "dark:bg-amber-400/10",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  PORTFOLIO: [
    "border-cyan-500/25",
    "bg-cyan-500/10",
    "text-cyan-700",

    "dark:border-cyan-400/25",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
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

function joinCreativeHeroClasses(
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

function normalizeCreativeHeroText(
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

function normalizeCreativeHeroList(
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
          normalizeCreativeHeroText,
        )
        .filter(
          Boolean,
        ),
    ),
  );
}

function runCreativeHeroAction(
  action:
    (() => void | Promise<void>) |
    undefined,
): void {
  void action?.();
}

function getCreativeHeroTypeLabel(
  contentType:
    CreativeContentType,
  language:
    CreativeHeroLanguage,
): string {
  const copy =
    CREATIVE_HERO_COPY[
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

function CreativeHeroSparklesIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4Z" />

      <path d="m19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8Z" />

      <path d="m5 14 .6 1.4L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.6Z" />
    </svg>
  );
}

function CreativeHeroArrowIcon() {
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
      <path d="M4 10h12" />

      <path d="m12 6 4 4-4 4" />
    </svg>
  );
}

function CreativeHeroCheckIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m5 10 3 3 7-7" />
    </svg>
  );
}

function CreativeHeroImageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
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

/* =========================================================
   INDICADOR DE CARGA
   ========================================================= */

function CreativeHeroSpinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}

/* =========================================================
   TARJETA DESTACADA
   ========================================================= */

interface CreativeHeroShowcaseCardProps {
  item:
    CreativeHeroShowcaseItem;

  language:
    CreativeHeroLanguage;

  position:
    number;
}

function CreativeHeroShowcaseCard({
  item,
  language,
  position,
}: CreativeHeroShowcaseCardProps) {
  const normalizedTitle =
    normalizeCreativeHeroText(
      item.title,
    ) ||
    "FIXORA";

  const normalizedSubtitle =
    normalizeCreativeHeroText(
      item.subtitle,
    );

  const normalizedBadge =
    normalizeCreativeHeroText(
      item.badge,
    );

  return (
    <article
      data-creative-hero-showcase-card=""
      data-content-type={
        item.contentType
      }
      className={joinCreativeHeroClasses(
        "relative min-w-0 overflow-hidden",
        "rounded-3xl border border-white/10",
        "bg-zinc-900/90",
        "shadow-[0_20px_55px_rgba(0,0,0,0.35)]",
        "backdrop-blur-xl",
        "transition-transform duration-300",

        position ===
          0 &&
          "sm:translate-x-5",

        position ===
          1 &&
          "sm:-translate-x-3",

        position ===
          2 &&
          "sm:translate-x-8",
      )}
    >
      <div className="relative flex min-h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-zinc-950">
        {item.preview ?? (
          <>
            <div className="absolute -left-8 -top-10 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl" />

            <div className="absolute -bottom-12 right-0 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />

            <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-emerald-300">
              <CreativeHeroImageIcon />
            </span>
          </>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span
            className={joinCreativeHeroClasses(
              "rounded-full border px-2.5 py-1",
              "text-[9px] font-black uppercase tracking-[0.08em]",
              "backdrop-blur-md",

              CREATIVE_HERO_TYPE_CLASSES[
                item.contentType
              ],
            )}
          >
            {getCreativeHeroTypeLabel(
              item.contentType,
              language,
            )}
          </span>

          {normalizedBadge ? (
            <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[9px] font-bold text-white/80 backdrop-blur-md">
              {normalizedBadge}
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        <h3 className="truncate text-sm font-black text-white">
          {normalizedTitle}
        </h3>

        {normalizedSubtitle ? (
          <p className="mt-1 truncate text-xs text-zinc-400">
            {normalizedSubtitle}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/* =========================================================
   VISUAL PREDETERMINADO
   ========================================================= */

interface CreativeHeroDefaultVisualProps {
  language:
    CreativeHeroLanguage;
}

function CreativeHeroDefaultVisual({
  language,
}: CreativeHeroDefaultVisualProps) {
  const copy =
    CREATIVE_HERO_COPY[
      language
    ];

  const defaultItems:
    CreativeHeroShowcaseItem[] = [
      {
        id:
          "creative-hero-free",

        title:
          copy.freeCard,

        subtitle:
          copy.free,

        contentType:
          "FREE",
      },
      {
        id:
          "creative-hero-paid",

        title:
          copy.paidCard,

        subtitle:
          copy.paid,

        contentType:
          "PAID",
      },
      {
        id:
          "creative-hero-portfolio",

        title:
          copy.portfolioCard,

        subtitle:
          copy.portfolio,

        contentType:
          "PORTFOLIO",
      },
    ];

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[90px]" />

      <div className="relative rounded-[2rem] border border-white/10 bg-black/25 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.36)] backdrop-blur-2xl sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3 px-1">
          <div>
            <p className="text-sm font-black text-white">
              {copy.showcaseTitle}
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              {copy.showcaseDescription}
            </p>
          </div>

          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <CreativeHeroSparklesIcon />
          </span>
        </div>

        <div className="space-y-3">
          {defaultItems.map(
            (
              item,
              itemIndex,
            ) => (
              <CreativeHeroShowcaseCard
                key={
                  item.id
                }
                item={
                  item
                }
                language={
                  language
                }
                position={
                  itemIndex
                }
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeHero({
  language =
    "es",

  size =
    "default",

  variant =
    "surface",

  eyebrow =
    null,

  heading =
    null,

  highlightedText =
    null,

  description =
    null,

  primaryActionLabel =
    null,

  secondaryActionLabel =
    null,

  loadingAction =
    null,

  disabled =
    false,

  onPrimaryAction,

  onSecondaryAction,

  highlights,

  metrics =
    [],

  showcaseItems =
    [],

  showEyebrow =
    true,

  showHighlights =
    true,

  showMetrics =
    true,

  showShowcase =
    true,

  showPrimaryAction =
    true,

  showSecondaryAction =
    true,

  leadingContent =
    null,

  visualContent =
    null,

  footerContent =
    null,

  contentClassName,

  actionsClassName,

  highlightsClassName,

  metricsClassName,

  visualClassName,

  className,

  "aria-label":
    ariaLabel,

  ...sectionProps
}: CreativeHeroProps) {
  const generatedId =
    useId();

  const copy =
    CREATIVE_HERO_COPY[
      language
    ];

  const resolvedEyebrow =
    normalizeCreativeHeroText(
      eyebrow,
    ) ||
    copy.eyebrow;

  const resolvedHeading =
    normalizeCreativeHeroText(
      heading,
    ) ||
    copy.heading;

  const resolvedHighlightedText =
    normalizeCreativeHeroText(
      highlightedText,
    ) ||
    copy.highlightedText;

  const resolvedDescription =
    normalizeCreativeHeroText(
      description,
    ) ||
    copy.description;

  const resolvedPrimaryActionLabel =
    normalizeCreativeHeroText(
      primaryActionLabel,
    ) ||
    copy.primaryAction;

  const resolvedSecondaryActionLabel =
    normalizeCreativeHeroText(
      secondaryActionLabel,
    ) ||
    copy.secondaryAction;

  const resolvedHighlights =
    highlights ===
    undefined
      ? [
          ...copy.defaultHighlights,
        ]
      : normalizeCreativeHeroList(
          highlights,
        );

  const visibleMetrics =
    metrics.filter(
      (
        metric,
      ) =>
        normalizeCreativeHeroText(
          metric.value,
        ) &&
        normalizeCreativeHeroText(
          metric.label,
        ),
    );

  const visibleShowcaseItems =
    showcaseItems.slice(
      0,
      3,
    );

  const anyLoading =
    loadingAction !==
    null;

  const primaryLoading =
    loadingAction ===
    "PRIMARY";

  const secondaryLoading =
    loadingAction ===
    "SECONDARY";

  const interactionDisabled =
    disabled ||
    anyLoading;

  const headingId =
    `creative-hero-heading-${generatedId}`;

  const descriptionId =
    `creative-hero-description-${generatedId}`;

  return (
    <section
      {...sectionProps}
      aria-label={
        ariaLabel ??
        copy.section
      }
      aria-labelledby={
        headingId
      }
      aria-describedby={
        descriptionId
      }
      aria-busy={
        anyLoading ||
        undefined
      }
      data-creative-hero=""
      data-size={
        size
      }
      data-variant={
        variant
      }
      className={joinCreativeHeroClasses(
        "relative isolate overflow-hidden",
        "border",

        variant !==
          "minimal" &&
          "rounded-[2rem]",

        CREATIVE_HERO_VARIANT_CLASSES[
          variant
        ],

        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-[100px]" />

        <div className="absolute -bottom-40 right-[-80px] h-96 w-96 rounded-full bg-cyan-500/10 blur-[110px]" />

        <div className="absolute left-[45%] top-[15%] h-64 w-64 rounded-full bg-green-400/[0.06] blur-[90px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      </div>

      <div
        className={joinCreativeHeroClasses(
          "relative mx-auto grid min-h-[680px] w-full",
          "items-center gap-12 px-5 py-14",
          "sm:px-8 sm:py-16",
          "lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]",
          "lg:px-12 lg:py-20",

          CREATIVE_HERO_SIZE_CLASSES[
            size
          ],
        )}
      >
        <div
          className={joinCreativeHeroClasses(
            "min-w-0",

            contentClassName,
          )}
        >
          {leadingContent}

          {showEyebrow ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3.5 py-2 text-xs font-black uppercase tracking-[0.12em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/[0.08] dark:text-emerald-300">
              <CreativeHeroSparklesIcon />

              <span>
                {resolvedEyebrow}
              </span>
            </div>
          ) : null}

          <h1
            id={
              headingId
            }
            className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span>
              {resolvedHeading}
            </span>{" "}

            <span className="bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-400 bg-clip-text text-transparent">
              {resolvedHighlightedText}
            </span>
          </h1>

          <p
            id={
              descriptionId
            }
            className="mt-6 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg"
          >
            {resolvedDescription}
          </p>

          {showHighlights &&
          resolvedHighlights.length >
            0 ? (
            <ul
              className={joinCreativeHeroClasses(
                "mt-7 flex flex-wrap gap-x-5 gap-y-3",

                highlightsClassName,
              )}
            >
              {resolvedHighlights.map(
                (
                  highlight,
                ) => (
                  <li
                    key={
                      highlight
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                      <CreativeHeroCheckIcon />
                    </span>

                    <span>
                      {highlight}
                    </span>
                  </li>
                ),
              )}
            </ul>
          ) : null}

          {(
            showPrimaryAction &&
            onPrimaryAction
          ) ||
          (
            showSecondaryAction &&
            onSecondaryAction
          ) ? (
            <div
              className={joinCreativeHeroClasses(
                "mt-8 flex flex-wrap items-center gap-3",

                actionsClassName,
              )}
            >
              {showPrimaryAction &&
              onPrimaryAction ? (
                <button
                  type="button"
                  aria-busy={
                    primaryLoading ||
                    undefined
                  }
                  disabled={
                    interactionDisabled
                  }
                  onClick={
                    () => {
                      runCreativeHeroAction(
                        onPrimaryAction,
                      );
                    }
                  }
                  className={[
                    "inline-flex min-h-12 items-center justify-center gap-2.5",
                    "rounded-2xl border",
                    "border-emerald-500/25",
                    "bg-gradient-to-r",
                    "from-emerald-500",
                    "to-green-600",
                    "px-5 py-3",
                    "text-sm font-black text-white",
                    "outline-none transition-all duration-200",

                    "enabled:hover:-translate-y-0.5",
                    "enabled:hover:from-emerald-400",
                    "enabled:hover:to-emerald-600",
                    "enabled:hover:shadow-[0_14px_34px_rgba(16,185,129,0.28)]",

                    "enabled:active:translate-y-0",
                    "enabled:active:scale-[0.98]",

                    "focus-visible:ring-2",
                    "focus-visible:ring-emerald-500/60",
                    "focus-visible:ring-offset-2",

                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",

                    "dark:focus-visible:ring-offset-zinc-950",
                  ].join(
                    " ",
                  )}
                >
                  {primaryLoading ? (
                    <CreativeHeroSpinner />
                  ) : (
                    <CreativeHeroSparklesIcon />
                  )}

                  <span>
                    {primaryLoading
                      ? copy.loadingPrimary
                      : resolvedPrimaryActionLabel}
                  </span>

                  {!primaryLoading ? (
                    <CreativeHeroArrowIcon />
                  ) : null}
                </button>
              ) : null}

              {showSecondaryAction &&
              onSecondaryAction ? (
                <button
                  type="button"
                  aria-busy={
                    secondaryLoading ||
                    undefined
                  }
                  disabled={
                    interactionDisabled
                  }
                  onClick={
                    () => {
                      runCreativeHeroAction(
                        onSecondaryAction,
                      );
                    }
                  }
                  className={[
                    "inline-flex min-h-12 items-center justify-center gap-2.5",
                    "rounded-2xl border",
                    "border-zinc-200",
                    "bg-white/70",
                    "px-5 py-3",
                    "text-sm font-black text-zinc-800",
                    "outline-none backdrop-blur-xl",
                    "transition-all duration-200",

                    "enabled:hover:-translate-y-0.5",
                    "enabled:hover:border-emerald-500/25",
                    "enabled:hover:bg-emerald-500/[0.07]",
                    "enabled:hover:text-emerald-700",

                    "enabled:active:translate-y-0",
                    "enabled:active:scale-[0.98]",

                    "focus-visible:ring-2",
                    "focus-visible:ring-emerald-500/50",
                    "focus-visible:ring-offset-2",

                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",

                    "dark:border-white/10",
                    "dark:bg-white/[0.06]",
                    "dark:text-white",

                    "dark:enabled:hover:border-emerald-400/25",
                    "dark:enabled:hover:bg-emerald-400/[0.08]",
                    "dark:enabled:hover:text-emerald-300",

                    "dark:focus-visible:ring-offset-zinc-950",
                  ].join(
                    " ",
                  )}
                >
                  {secondaryLoading ? (
                    <CreativeHeroSpinner />
                  ) : null}

                  <span>
                    {secondaryLoading
                      ? copy.loadingSecondary
                      : resolvedSecondaryActionLabel}
                  </span>

                  {!secondaryLoading ? (
                    <CreativeHeroArrowIcon />
                  ) : null}
                </button>
              ) : null}
            </div>
          ) : null}

          {showMetrics &&
          visibleMetrics.length >
            0 ? (
            <dl
              className={joinCreativeHeroClasses(
                "mt-10 grid max-w-2xl gap-3",
                "grid-cols-2 sm:grid-cols-3",

                metricsClassName,
              )}
            >
              {visibleMetrics.map(
                (
                  metric,
                ) => (
                  <div
                    key={
                      metric.id
                    }
                    className="rounded-2xl border border-zinc-200/80 bg-white/55 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <dt className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {metric.label}
                    </dt>

                    <dd className="mt-1 text-xl font-black text-zinc-950 dark:text-white sm:text-2xl">
                      {metric.value}
                    </dd>
                  </div>
                ),
              )}
            </dl>
          ) : null}
        </div>

        {showShowcase ? (
          <div
            className={joinCreativeHeroClasses(
              "relative min-w-0",

              visualClassName,
            )}
          >
            {visualContent ? (
              visualContent
            ) : visibleShowcaseItems.length >
              0 ? (
              <div className="relative mx-auto w-full max-w-xl">
                <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-[90px]" />

                <div className="relative space-y-3 rounded-[2rem] border border-white/10 bg-black/25 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.36)] backdrop-blur-2xl sm:p-5">
                  {visibleShowcaseItems.map(
                    (
                      item,
                      itemIndex,
                    ) => (
                      <CreativeHeroShowcaseCard
                        key={
                          item.id
                        }
                        item={
                          item
                        }
                        language={
                          language
                        }
                        position={
                          itemIndex
                        }
                      />
                    ),
                  )}
                </div>
              </div>
            ) : (
              <CreativeHeroDefaultVisual
                language={
                  language
                }
              />
            )}
          </div>
        ) : null}
      </div>

      {footerContent ? (
        <footer className="relative border-t border-zinc-200/70 px-5 py-5 dark:border-white/10 sm:px-8 lg:px-12">
          {footerContent}
        </footer>
      ) : null}
    </section>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeHero;