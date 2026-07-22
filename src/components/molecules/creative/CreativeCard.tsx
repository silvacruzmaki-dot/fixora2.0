"use client";

/*
 * Tarjeta principal del catálogo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar la miniatura de una publicación.
 * - Mostrar tipo FREE, PAID o PORTFOLIO.
 * - Mostrar precio, categoría, autor y etiquetas.
 * - Mostrar métricas públicas.
 * - Abrir el visor mediante onOpen.
 * - Reservar un espacio para CreativeCardActions.
 * - Mantener accesibilidad mediante un botón real.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Lógica de autenticación.
 * - Lógica de compra.
 * - Lógica de descarga.
 * - Lógica interna de Me gusta o favoritos.
 */

import {
  forwardRef,
} from "react";

import type {
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

import {
  CreativeBadge,
  CreativeContentTypeBadge,
} from "@/components/atoms/creative/CreativeBadge";

import {
  CreativeMedia,
} from "@/components/atoms/creative/CreativeMedia";

import type {
  CreativeMediaAspectRatio,
} from "@/components/atoms/creative/CreativeMedia";

import {
  CreativePrice,
} from "@/components/atoms/creative/CreativePrice";

import {
  CreativeTag,
} from "@/components/atoms/creative/CreativeTag";

import type {
  CreativeContentType,
  CreativeCurrency,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeCardLanguage =
  | "es"
  | "en";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeCardVariant =
  | "default"
  | "compact"
  | "featured"
  | "admin";

/* =========================================================
   MÉTRICAS
   ========================================================= */

export interface CreativeCardMetrics {
  views?:
    number | null;

  likes?:
    number | null;

  favorites?:
    number | null;

  comments?:
    number | null;

  downloads?:
    number | null;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeCardProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "children" | "title"
  > {
  /*
   * Identificación.
   */
  itemId:
    string;

  slug:
    string;

  /*
   * Información localizada.
   */
  title:
    string;

  description?:
    string | null;

  categoryName?:
    string | null;

  /*
   * Tipo de publicación.
   */
  contentType:
    CreativeContentType;

  /*
   * Precio.
   */
  price?:
    number | string | null;

  currency?:
    CreativeCurrency;

  /*
   * Imagen.
   */
  imageUrl?:
    string | null;

  imageAlt?:
    string | null;

  imageAspectRatio?:
    CreativeMediaAspectRatio;

  imageBlurDataUrl?:
    string | null;

  priority?:
    boolean;

  /*
   * Protección visual.
   */
  watermark?:
    boolean;

  watermarkText?:
    string;

  /*
   * Datos complementarios.
   */
  authorName?:
    string | null;

  tags?:
    string[];

  tools?:
    string[];

  metrics?:
    CreativeCardMetrics;

  featured?:
    boolean;

  /*
   * Idioma.
   */
  language?:
    CreativeCardLanguage;

  /*
   * Apariencia.
   */
  variant?:
    CreativeCardVariant;

  /*
   * Acción para abrir el visor.
   */
  onOpen?:
    (
      itemId:
        string,
      slug:
        string,
    ) => void;

  /*
   * Acciones externas.
   *
   * Aquí se insertará posteriormente CreativeCardActions.
   */
  actions?:
    ReactNode;

  /*
   * Permite ocultar secciones.
   */
  showDescription?:
    boolean;

  showAuthor?:
    boolean;

  showCategory?:
    boolean;

  showTags?:
    boolean;

  showMetrics?:
    boolean;

  showPrice?:
    boolean;

  /*
   * Límites visuales.
   */
  maximumVisibleTags?:
    number;

  maximumVisibleTools?:
    number;

  /*
   * Clases adicionales.
   */
  mediaClassName?:
    string;

  contentClassName?:
    string;

  footerClassName?:
    string;

  actionsClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_CARD_COPY = {
  es: {
    open:
      "Abrir diseño",

    by:
      "Por",

    views:
      "visualizaciones",

    likes:
      "Me gusta",

    favorites:
      "favoritos",

    comments:
      "comentarios",

    downloads:
      "descargas",

    moreTags:
      "más",

    unknownAuthor:
      "Equipo FIXORA",
  },

  en: {
    open:
      "Open design",

    by:
      "By",

    views:
      "views",

    likes:
      "likes",

    favorites:
      "favorites",

    comments:
      "comments",

    downloads:
      "downloads",

    moreTags:
      "more",

    unknownAuthor:
      "FIXORA team",
  },
} as const;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_CARD_BASE_CLASSES = [
  "group/creative-card",
  "relative",
  "isolate",
  "flex",
  "h-full",
  "min-w-0",
  "flex-col",
  "overflow-hidden",
  "rounded-3xl",
  "border",
  "border-zinc-200/80",
  "bg-white/90",
  "shadow-[0_18px_50px_rgba(15,23,42,0.09)]",
  "backdrop-blur-xl",
  "transition-all",
  "duration-300",
  "ease-out",

  "hover:-translate-y-1",
  "hover:border-emerald-500/25",
  "hover:shadow-[0_26px_70px_rgba(15,23,42,0.14)]",

  "dark:border-white/10",
  "dark:bg-zinc-950/85",
  "dark:shadow-[0_20px_60px_rgba(0,0,0,0.30)]",

  "dark:hover:border-emerald-400/25",
  "dark:hover:shadow-[0_28px_80px_rgba(0,0,0,0.44)]",

  "motion-reduce:transform-none",
  "motion-reduce:transition-none",
].join(
  " ",
);

/* =========================================================
   VARIANTES
   ========================================================= */

const CREATIVE_CARD_VARIANT_CLASSES = {
  default:
    "",

  compact:
    "rounded-2xl",

  featured: [
    "border-emerald-500/25",
    "shadow-[0_22px_65px_rgba(16,185,129,0.12)]",

    "dark:border-emerald-400/25",
    "dark:shadow-[0_24px_70px_rgba(16,185,129,0.10)]",
  ].join(
    " ",
  ),

  admin: [
    "border-dashed",
    "border-zinc-300",

    "dark:border-white/15",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeCardVariant,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeCardClasses(
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
   NORMALIZAR TEXTO
   ========================================================= */

function normalizeCreativeCardText(
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
   NORMALIZAR LISTA
   ========================================================= */

function normalizeCreativeCardList(
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

  const normalizedValues =
    values
      .map(
        normalizeCreativeCardText,
      )
      .filter(
        Boolean,
      );

  return Array.from(
    new Set(
      normalizedValues,
    ),
  );
}

/* =========================================================
   NORMALIZAR LÍMITE
   ========================================================= */

function normalizeCreativeCardLimit(
  value:
    number,
  fallback:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return fallback;
  }

  return Math.max(
    0,
    Math.trunc(
      value,
    ),
  );
}

/* =========================================================
   NORMALIZAR MÉTRICA
   ========================================================= */

function normalizeCreativeCardMetric(
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

/* =========================================================
   FORMATEAR MÉTRICA
   ========================================================= */

export function formatCreativeCardMetric(
  value:
    number,
  language:
    CreativeCardLanguage = "es",
): string {
  const normalizedValue =
    normalizeCreativeCardMetric(
      value,
    );

  const decimalSeparator =
    language ===
      "es"
      ? ","
      : ".";

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

    const formattedValue =
      String(
        compactValue,
      ).replace(
        ".",
        decimalSeparator,
      );

    return language ===
      "es"
      ? `${formattedValue} mil`
      : `${formattedValue}K`;
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

  return `${String(
    compactValue,
  ).replace(
    ".",
    decimalSeparator,
  )}M`;
}

/* =========================================================
   INICIALES DEL AUTOR
   ========================================================= */

function getCreativeCardAuthorInitials(
  authorName:
    string,
): string {
  const nameParts =
    authorName
      .split(
        " ",
      )
      .filter(
        Boolean,
      )
      .slice(
        0,
        2,
      );

  const initials =
    nameParts
      .map(
        (
          part,
        ) =>
          part
            .charAt(
              0,
            )
            .toUpperCase(),
      )
      .join(
        "",
      );

  return initials ||
    "FX";
}

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeCardEyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

function CreativeCardHeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function CreativeCardCommentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    </svg>
  );
}

function CreativeCardDownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M12 3v12" />

      <path d="m7 10 5 5 5-5" />

      <path d="M5 21h14" />
    </svg>
  );
}

/* =========================================================
   MÉTRICA INDIVIDUAL
   ========================================================= */

interface CreativeCardMetricItemProps {
  icon:
    ReactNode;

  value:
    number;

  label:
    string;

  language:
    CreativeCardLanguage;
}

function CreativeCardMetricItem({
  icon,
  value,
  label,
  language,
}: CreativeCardMetricItemProps) {
  const formattedValue =
    formatCreativeCardMetric(
      value,
      language,
    );

  return (
    <span
      title={
        `${value} ${label}`
      }
      aria-label={
        `${value} ${label}`
      }
      className={[
        "inline-flex",
        "items-center",
        "gap-1.5",
        "text-xs",
        "font-medium",
        "text-zinc-500",

        "dark:text-zinc-400",
      ].join(
        " ",
      )}
    >
      <span
        aria-hidden="true"
        className="flex shrink-0 items-center justify-center"
      >
        {icon}
      </span>

      <span className="tabular-nums">
        {formattedValue}
      </span>
    </span>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativeCard =
  forwardRef<
    HTMLElement,
    CreativeCardProps
  >(
    function CreativeCard(
      {
        itemId,

        slug,

        title,

        description =
          null,

        categoryName =
          null,

        contentType,

        price =
          null,

        currency =
          "PEN" as CreativeCurrency,

        imageUrl =
          null,

        imageAlt =
          null,

        imageAspectRatio =
          "landscape",

        imageBlurDataUrl =
          null,

        priority =
          false,

        watermark,

        watermarkText =
          "FIXORA",

        authorName =
          null,

        tags =
          [],

        tools =
          [],

        metrics =
          {},

        featured =
          false,

        language =
          "es",

        variant =
          "default",

        onOpen,

        actions =
          null,

        showDescription =
          true,

        showAuthor =
          true,

        showCategory =
          true,

        showTags =
          true,

        showMetrics =
          true,

        showPrice =
          true,

        maximumVisibleTags =
          3,

        maximumVisibleTools =
          2,

        mediaClassName,

        contentClassName,

        footerClassName,

        actionsClassName,

        className,

        ...articleProps
      },
      ref,
    ) {
      const copy =
        CREATIVE_CARD_COPY[
          language
        ];

      const normalizedItemId =
        normalizeCreativeCardText(
          itemId,
        );

      const normalizedSlug =
        normalizeCreativeCardText(
          slug,
        );

      const normalizedTitle =
        normalizeCreativeCardText(
          title,
        ) ||
        "Creative";

      const normalizedDescription =
        normalizeCreativeCardText(
          description,
        );

      const normalizedCategory =
        normalizeCreativeCardText(
          categoryName,
        );

      const normalizedAuthor =
        normalizeCreativeCardText(
          authorName,
        ) ||
        copy.unknownAuthor;

      const normalizedImageAlt =
        normalizeCreativeCardText(
          imageAlt,
        ) ||
        normalizedTitle;

      const normalizedTags =
        normalizeCreativeCardList(
          tags,
        );

      const normalizedTools =
        normalizeCreativeCardList(
          tools,
        );

      const visibleTagsLimit =
        normalizeCreativeCardLimit(
          maximumVisibleTags,
          3,
        );

      const visibleToolsLimit =
        normalizeCreativeCardLimit(
          maximumVisibleTools,
          2,
        );

      const visibleTags =
        normalizedTags.slice(
          0,
          visibleTagsLimit,
        );

      const visibleTools =
        normalizedTools.slice(
          0,
          visibleToolsLimit,
        );

      const hiddenTagsCount =
        Math.max(
          0,
          normalizedTags.length -
            visibleTags.length,
        );

      const viewCount =
        normalizeCreativeCardMetric(
          metrics.views,
        );

      const likeCount =
        normalizeCreativeCardMetric(
          metrics.likes,
        );

      const favoriteCount =
        normalizeCreativeCardMetric(
          metrics.favorites,
        );

      const commentCount =
        normalizeCreativeCardMetric(
          metrics.comments,
        );

      const downloadCount =
        normalizeCreativeCardMetric(
          metrics.downloads,
        );

      const resolvedWatermark =
        watermark ??
        contentType !==
          "FREE";

      const resolvedVariant =
        featured &&
        variant ===
          "default"
          ? "featured"
          : variant;

      const accessibleOpenLabel =
        `${copy.open}: ${normalizedTitle}`;

      const handleOpen =
        (): void => {
          onOpen?.(
            normalizedItemId,
            normalizedSlug,
          );
        };

      const handleActionsClick =
        (
          event:
            MouseEvent<HTMLDivElement>,
        ): void => {
          event.stopPropagation();
        };

      return (
        <article
          {...articleProps}
          ref={ref}
          data-creative-card=""
          data-item-id={
            normalizedItemId
          }
          data-slug={
            normalizedSlug
          }
          data-content-type={
            contentType
          }
          data-featured={
            featured
              ? "true"
              : "false"
          }
          className={
            joinCreativeCardClasses(
              CREATIVE_CARD_BASE_CLASSES,

              CREATIVE_CARD_VARIANT_CLASSES[
                resolvedVariant
              ],

              className,
            )
          }
        >
          <button
            type="button"
            aria-label={
              accessibleOpenLabel
            }
            title={
              accessibleOpenLabel
            }
            onClick={
              handleOpen
            }
            className={[
              "block",
              "w-full",
              "min-w-0",
              "flex-1",
              "cursor-pointer",
              "text-left",
              "outline-none",

              "focus-visible:ring-2",
              "focus-visible:ring-inset",
              "focus-visible:ring-emerald-500/70",

              "dark:focus-visible:ring-emerald-400/70",
            ].join(
              " ",
            )}
          >
            <div className="relative">
              <CreativeMedia
                src={
                  imageUrl
                }
                alt={
                  normalizedImageAlt
                }
                aspectRatio={
                  imageAspectRatio
                }
                priority={
                  priority
                }
                blurDataURL={
                  imageBlurDataUrl
                }
                watermark={
                  resolvedWatermark
                }
                watermarkText={
                  watermarkText
                }
                interactive
                rounded="none"
                variant="plain"
                className={
                  joinCreativeCardClasses(
                    "border-0",

                    variant ===
                      "compact"
                      ? "min-h-44"
                      : "min-h-52",

                    mediaClassName,
                  )
                }
              />

              <div
                className={[
                  "pointer-events-none",
                  "absolute",
                  "inset-x-0",
                  "top-0",
                  "z-40",
                  "flex",
                  "items-start",
                  "justify-between",
                  "gap-3",
                  "p-4",
                ].join(
                  " ",
                )}
              >
                <CreativeContentTypeBadge
                  contentType={
                    contentType
                  }
                  size="sm"
                />

                {featured ? (
                  <CreativeBadge
                    kind="FEATURED"
                    size="sm"
                  />
                ) : null}
              </div>

              <span
                aria-hidden="true"
                className={[
                  "pointer-events-none",
                  "absolute",
                  "inset-0",
                  "z-[35]",
                  "bg-gradient-to-t",
                  "from-black/35",
                  "via-transparent",
                  "to-transparent",
                  "opacity-70",
                ].join(
                  " ",
                )}
              />
            </div>

            <div
              className={
                joinCreativeCardClasses(
                  variant ===
                    "compact"
                    ? "space-y-3 p-4"
                    : "space-y-4 p-5",

                  contentClassName,
                )
              }
            >
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {showCategory &&
                  normalizedCategory ? (
                    <p
                      className={[
                        "mb-2",
                        "truncate",
                        "text-[11px]",
                        "font-bold",
                        "uppercase",
                        "tracking-[0.12em]",
                        "text-emerald-600",

                        "dark:text-emerald-400",
                      ].join(
                        " ",
                      )}
                    >
                      {normalizedCategory}
                    </p>
                  ) : null}

                  <h3
                    className={[
                      "line-clamp-2",
                      "text-lg",
                      "font-bold",
                      "leading-snug",
                      "tracking-[-0.02em]",
                      "text-zinc-950",

                      "transition-colors",
                      "duration-200",

                      "group-hover/creative-card:text-emerald-700",

                      "dark:text-white",
                      "dark:group-hover/creative-card:text-emerald-300",
                    ].join(
                      " ",
                    )}
                  >
                    {normalizedTitle}
                  </h3>
                </div>

                {showPrice ? (
                  <CreativePrice
                    contentType={
                      contentType
                    }
                    price={
                      price
                    }
                    currency={
                      currency
                    }
                    language={
                      language
                    }
                    size="sm"
                    align="end"
                    className="shrink-0"
                  />
                ) : null}
              </div>

              {showDescription &&
              normalizedDescription ? (
                <p
                  className={[
                    "line-clamp-2",
                    "text-sm",
                    "leading-6",
                    "text-zinc-600",

                    "dark:text-zinc-400",
                  ].join(
                    " ",
                  )}
                >
                  {normalizedDescription}
                </p>
              ) : null}

              {showAuthor ? (
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={[
                      "flex",
                      "h-8",
                      "w-8",
                      "shrink-0",
                      "items-center",
                      "justify-center",
                      "rounded-full",
                      "border",
                      "border-emerald-500/20",
                      "bg-emerald-500/10",
                      "text-[10px]",
                      "font-black",
                      "uppercase",
                      "text-emerald-700",

                      "dark:border-emerald-400/20",
                      "dark:bg-emerald-400/10",
                      "dark:text-emerald-300",
                    ].join(
                      " ",
                    )}
                  >
                    {getCreativeCardAuthorInitials(
                      normalizedAuthor,
                    )}
                  </span>

                  <span className="min-w-0 text-xs text-zinc-500 dark:text-zinc-400">
                    <span>
                      {copy.by}
                    </span>{" "}

                    <span className="truncate font-semibold text-zinc-700 dark:text-zinc-200">
                      {normalizedAuthor}
                    </span>
                  </span>
                </div>
              ) : null}

              {showTags &&
              (
                visibleTags.length >
                  0 ||
                visibleTools.length >
                  0
              ) ? (
                <div className="flex flex-wrap gap-2">
                  {visibleTools.map(
                    (
                      tool,
                    ) => (
                      <CreativeTag
                        key={
                          `tool-${tool}`
                        }
                        label={
                          tool
                        }
                        size="sm"
                        variant="primary"
                      />
                    ),
                  )}

                  {visibleTags.map(
                    (
                      tag,
                    ) => (
                      <CreativeTag
                        key={
                          `tag-${tag}`
                        }
                        label={
                          tag
                        }
                        size="sm"
                        variant="neutral"
                      />
                    ),
                  )}

                  {hiddenTagsCount >
                  0 ? (
                    <CreativeTag
                      label={
                        `+${hiddenTagsCount} ${copy.moreTags}`
                      }
                      size="sm"
                      variant="neutral"
                    />
                  ) : null}
                </div>
              ) : null}

              {showMetrics ? (
                <div
                  className={
                    joinCreativeCardClasses(
                      "flex flex-wrap items-center gap-x-4 gap-y-2",
                      "border-t border-zinc-200/80 pt-4",

                      "dark:border-white/10",

                      footerClassName,
                    )
                  }
                >
                  <CreativeCardMetricItem
                    icon={
                      <CreativeCardEyeIcon />
                    }
                    value={
                      viewCount
                    }
                    label={
                      copy.views
                    }
                    language={
                      language
                    }
                  />

                  <CreativeCardMetricItem
                    icon={
                      <CreativeCardHeartIcon />
                    }
                    value={
                      likeCount
                    }
                    label={
                      copy.likes
                    }
                    language={
                      language
                    }
                  />

                  {favoriteCount >
                  0 ? (
                    <CreativeCardMetricItem
                      icon={
                        <CreativeCardHeartIcon />
                      }
                      value={
                        favoriteCount
                      }
                      label={
                        copy.favorites
                      }
                      language={
                        language
                      }
                    />
                  ) : null}

                  <CreativeCardMetricItem
                    icon={
                      <CreativeCardCommentIcon />
                    }
                    value={
                      commentCount
                    }
                    label={
                      copy.comments
                    }
                    language={
                      language
                    }
                  />

                  {contentType ===
                    "FREE" ? (
                    <CreativeCardMetricItem
                      icon={
                        <CreativeCardDownloadIcon />
                      }
                      value={
                        downloadCount
                      }
                      label={
                        copy.downloads
                      }
                      language={
                        language
                      }
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          </button>

          {actions ? (
            <div
              onClick={
                handleActionsClick
              }
              className={
                joinCreativeCardClasses(
                  "relative z-50",
                  "border-t border-zinc-200/80",
                  "px-4 py-3",

                  "dark:border-white/10",

                  actionsClassName,
                )
              }
            >
              {actions}
            </div>
          ) : null}
        </article>
      );
    },
  );

CreativeCard.displayName =
  "CreativeCard";

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeCard;