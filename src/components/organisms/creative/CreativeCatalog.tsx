"use client";

/*
 * Catálogo principal del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Integrar búsqueda, filtros y ordenamiento.
 * - Mostrar publicaciones FREE, PAID y PORTFOLIO.
 * - Mostrar estados de carga, error y catálogo vacío.
 * - Mostrar interacciones y acciones principales.
 * - Abrir una publicación en el visor.
 * - Cargar más resultados.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Acceso directo a Prisma.
 * - Estado de autenticación.
 * - Lógica administrativa.
 *
 * Todos los datos y acciones son controlados
 * por el componente padre.
 */

import Image from "next/image";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

import {
  CreativeCardActions,
} from "@/components/molecules/creative/CreativeCardActions";

import type {
  CreativeCardLoadingAction,
} from "@/components/molecules/creative/CreativeCardActions";

import {
  CreativeCatalogFilters,
} from "@/components/molecules/creative/CreativeCatalogFilters";

import type {
  CreativeCatalogContentTypeFilter,
  CreativeCatalogFilterOption,
} from "@/components/molecules/creative/CreativeCatalogFilters";

import {
  CreativeSearchInput,
} from "@/components/molecules/creative/CreativeSearchInput";

import {
  CreativeSortSelect,
} from "@/components/molecules/creative/CreativeSortSelect";

import type {
  CreativeSortOption,
  CreativeSortValue,
} from "@/components/molecules/creative/CreativeSortSelect";

import type {
  CreativeContentType,
  CreativeCurrency,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeCatalogLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeCatalogSize =
  | "compact"
  | "default"
  | "wide";

/* =========================================================
   ELEMENTO DEL CATÁLOGO
   ========================================================= */

export interface CreativeCatalogItem {
  id:
    string;

  slug:
    string;

  title:
    string;

  description?:
    string | null;

  imageUrl?:
    string | null;

  imageAlt?:
    string | null;

  contentType:
    CreativeContentType;

  price?:
    number | null;

  currency?:
    CreativeCurrency | null;

  categoryId?:
    string | null;

  categoryLabel?:
    string | null;

  toolIds?:
    string[];

  toolLabels?:
    string[];

  tags?:
    string[];

  authorName?:
    string | null;

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

  shareCount?:
    number | null;

  canLike?:
    boolean;

  canFavorite?:
    boolean;

  canShare?:
    boolean;

  canDownload?:
    boolean;

  canPurchase?:
    boolean;

  canRequest?:
    boolean;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeCatalogProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "children"
  > {
  language?:
    CreativeCatalogLanguage;

  size?:
    CreativeCatalogSize;

  heading?:
    string | null;

  description?:
    string | null;

  items?:
    CreativeCatalogItem[];

  totalItems?:
    number | null;

  loading?:
    boolean;

  error?:
    string | null;

  /*
   * Búsqueda.
   */
  searchValue?:
    string;

  onSearchValueChange?:
    (
      value:
        string,
    ) => void;

  onSearch?:
    (
      value:
        string,
    ) => void | Promise<void>;

  onClearSearch?:
    () => void;

  /*
   * Ordenamiento.
   */
  sortValue?:
    CreativeSortValue;

  sortOptions?:
    CreativeSortOption[];

  onSortChange?:
    (
      value:
        CreativeSortValue,
    ) => void;

  /*
   * Filtros.
   */
  contentType?:
    CreativeCatalogContentTypeFilter;

  onContentTypeChange?:
    (
      value:
        CreativeCatalogContentTypeFilter,
    ) => void;

  categories?:
    CreativeCatalogFilterOption[];

  selectedCategoryId?:
    string | null;

  onCategoryChange?:
    (
      categoryId:
        string | null,
    ) => void;

  tools?:
    CreativeCatalogFilterOption[];

  selectedToolIds?:
    string[];

  onToolToggle?:
    (
      toolId:
        string,
    ) => void;

  featuredOnly?:
    boolean;

  onFeaturedChange?:
    (
      featured:
        boolean,
    ) => void;

  activeFilterCount?:
    number | null;

  onClearFilters?:
    () => void;

  /*
   * Acciones de las publicaciones.
   */
  onOpenItem?:
    (
      item:
        CreativeCatalogItem,
    ) => void;

  onLike?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onFavorite?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onShare?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onDownload?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onPurchase?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onRequest?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  loadingActionByItemId?:
    Partial<
      Record<
        string,
        CreativeCardLoadingAction
      >
    >;

  /*
   * Paginación.
   */
  hasMore?:
    boolean;

  loadingMore?:
    boolean;

  onLoadMore?:
    () => void | Promise<void>;

  /*
   * Visibilidad.
   */
  showHeader?:
    boolean;

  showSearch?:
    boolean;

  showSort?:
    boolean;

  showFilters?:
    boolean;

  showResultsCount?:
    boolean;

  showCardInteractions?:
    boolean;

  showPrimaryActions?:
    boolean;

  /*
   * Configuración visual.
   */
  priorityImageCount?:
    number;

  /*
   * Contenido adicional.
   */
  leadingContent?:
    ReactNode;

  trailingContent?:
    ReactNode;

  emptyContent?:
    ReactNode;

  errorContent?:
    ReactNode;

  /*
   * Clases adicionales.
   */
  headerClassName?:
    string;

  toolbarClassName?:
    string;

  filtersClassName?:
    string;

  gridClassName?:
    string;

  cardClassName?:
    string;

  loadMoreClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_CATALOG_COPY = {
  es: {
    heading:
      "Diseño",

    description:
      "Explora trabajos gratuitos, diseños premium y proyectos de portafolio creados por FIXORA.",

    result:
      "resultado",

    results:
      "resultados",

    loading:
      "Cargando diseños...",

    emptyTitle:
      "No encontramos diseños",

    emptyDescription:
      "Prueba cambiando la búsqueda o limpiando los filtros activos.",

    errorTitle:
      "No se pudo cargar el catálogo",

    errorDescription:
      "Ocurrió un problema al cargar los diseños. Intenta nuevamente.",

    loadMore:
      "Cargar más diseños",

    loadingMore:
      "Cargando más diseños...",

    free:
      "Gratis",

    paid:
      "Premium",

    portfolio:
      "Portafolio",

    featured:
      "Destacado",

    by:
      "Por",

    views:
      "visualizaciones",

    noImage:
      "Vista previa no disponible",

    consultPrice:
      "Consultar precio",
  },

  en: {
    heading:
      "Creative",

    description:
      "Explore free work, premium designs and portfolio projects created by FIXORA.",

    result:
      "result",

    results:
      "results",

    loading:
      "Loading designs...",

    emptyTitle:
      "No designs found",

    emptyDescription:
      "Try changing the search or clearing the active filters.",

    errorTitle:
      "The catalog could not be loaded",

    errorDescription:
      "A problem occurred while loading the designs. Please try again.",

    loadMore:
      "Load more designs",

    loadingMore:
      "Loading more designs...",

    free:
      "Free",

    paid:
      "Premium",

    portfolio:
      "Portfolio",

    featured:
      "Featured",

    by:
      "By",

    views:
      "views",

    noImage:
      "Preview not available",

    consultPrice:
      "Request price",
  },
} as const;

/* =========================================================
   CLASES GENERALES
   ========================================================= */

const CREATIVE_CATALOG_SIZE_CLASSES = {
  compact:
    "max-w-6xl",

  default:
    "max-w-7xl",

  wide:
    "max-w-[1600px]",
} as const satisfies Record<
  CreativeCatalogSize,
  string
>;

const CREATIVE_CATALOG_GRID_SIZE_CLASSES = {
  compact: [
    "grid-cols-1",
    "sm:grid-cols-2",
    "lg:grid-cols-3",
  ].join(
    " ",
  ),

  default: [
    "grid-cols-1",
    "sm:grid-cols-2",
    "xl:grid-cols-3",
  ].join(
    " ",
  ),

  wide: [
    "grid-cols-1",
    "sm:grid-cols-2",
    "xl:grid-cols-3",
    "2xl:grid-cols-4",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeCatalogSize,
  string
>;

/* =========================================================
   TIPOS DE CONTENIDO
   ========================================================= */

const CREATIVE_CATALOG_CONTENT_TYPE_CLASSES = {
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

function joinCreativeCatalogClasses(
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

function normalizeCreativeCatalogText(
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

function normalizeCreativeCatalogCount(
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

function normalizeCreativeCatalogPrice(
  value:
    number | null | undefined,
): number | null {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    ) ||
    value <
      0
  ) {
    return null;
  }

  return value;
}

function normalizeCreativeCatalogStringList(
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
        normalizeCreativeCatalogText,
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

function normalizeCreativeCatalogPriorityCount(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 3;
  }

  return Math.max(
    0,
    Math.trunc(
      value,
    ),
  );
}

/* =========================================================
   FORMATEAR CONTADORES
   ========================================================= */

export function formatCreativeCatalogCount(
  value:
    number | null | undefined,
): string {
  const normalizedValue =
    normalizeCreativeCatalogCount(
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

/* =========================================================
   FORMATEAR PRECIO
   ========================================================= */

export function formatCreativeCatalogPrice(
  value:
    number | null | undefined,
  currency:
    CreativeCurrency | null | undefined,
  language:
    CreativeCatalogLanguage,
): string {
  const normalizedPrice =
    normalizeCreativeCatalogPrice(
      value,
    );

  if (
    normalizedPrice ===
    null
  ) {
    return CREATIVE_CATALOG_COPY[
      language
    ].consultPrice;
  }

  if (
    !currency
  ) {
    return normalizedPrice.toFixed(
      2,
    );
  }

  try {
    return new Intl.NumberFormat(
      language ===
        "es"
        ? "es-PE"
        : "en-US",
      {
        style:
          "currency",

        currency,

        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2,
      },
    ).format(
      normalizedPrice,
    );
  } catch {
    return `${currency} ${normalizedPrice.toFixed(2)}`;
  }
}

/* =========================================================
   ETIQUETA DEL TIPO
   ========================================================= */

function getCreativeCatalogTypeLabel(
  contentType:
    CreativeContentType,
  language:
    CreativeCatalogLanguage,
): string {
  const copy =
    CREATIVE_CATALOG_COPY[
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

function CreativeCatalogEmptyIcon() {
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

      <path d="m7 15 3-3 3 3 2-2 3 3" />

      <circle
        cx="9"
        cy="9"
        r="1.5"
      />
    </svg>
  );
}

function CreativeCatalogErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
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

function CreativeCatalogImageIcon() {
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

function CreativeCatalogEyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M2 10s2.8-5 8-5 8 5 8 5-2.8 5-8 5-8-5-8-5Z" />

      <circle
        cx="10"
        cy="10"
        r="2"
      />
    </svg>
  );
}

/* =========================================================
   TARJETA DEL CATÁLOGO
   ========================================================= */

interface CreativeCatalogCardProps {
  item:
    CreativeCatalogItem;

  itemIndex:
    number;

  language:
    CreativeCatalogLanguage;

  priorityImageCount:
    number;

  loadingAction:
    CreativeCardLoadingAction;

  showInteractions:
    boolean;

  showPrimaryActions:
    boolean;

  className?:
    string;

  onOpenItem?:
    (
      item:
        CreativeCatalogItem,
    ) => void;

  onLike?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onFavorite?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onShare?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onDownload?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onPurchase?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;

  onRequest?:
    (
      item:
        CreativeCatalogItem,
    ) => void | Promise<void>;
}

function CreativeCatalogCard({
  item,
  itemIndex,
  language,
  priorityImageCount,
  loadingAction,
  showInteractions,
  showPrimaryActions,
  className,
  onOpenItem,
  onLike,
  onFavorite,
  onShare,
  onDownload,
  onPurchase,
  onRequest,
}: CreativeCatalogCardProps) {
  const copy =
    CREATIVE_CATALOG_COPY[
      language
    ];

  const normalizedTitle =
    normalizeCreativeCatalogText(
      item.title,
    ) ||
    "FIXORA";

  const normalizedDescription =
    normalizeCreativeCatalogText(
      item.description,
    );

  const normalizedImageUrl =
    normalizeCreativeCatalogText(
      item.imageUrl,
    );

  const normalizedImageAlt =
    normalizeCreativeCatalogText(
      item.imageAlt,
    ) ||
    normalizedTitle;

  const normalizedCategoryLabel =
    normalizeCreativeCatalogText(
      item.categoryLabel,
    );

  const normalizedAuthorName =
    normalizeCreativeCatalogText(
      item.authorName,
    );

  const normalizedTags =
    normalizeCreativeCatalogStringList(
      item.tags,
    ).slice(
      0,
      3,
    );

  const normalizedToolLabels =
    normalizeCreativeCatalogStringList(
      item.toolLabels,
    ).slice(
      0,
      3,
    );

  const normalizedViewCount =
    normalizeCreativeCatalogCount(
      item.viewCount,
    );

  const typeLabel =
    getCreativeCatalogTypeLabel(
      item.contentType,
      language,
    );

  const priceLabel =
    item.contentType ===
      "PAID"
      ? formatCreativeCatalogPrice(
          item.price,
          item.currency,
          language,
        )
      : "";

  const primaryActionAvailable =
    item.contentType ===
      "FREE"
      ? Boolean(
          onDownload,
        )
      : item.contentType ===
          "PAID"
        ? Boolean(
            onPurchase,
          )
        : Boolean(
            onRequest,
          );

  const cardMainContent = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {normalizedImageUrl ? (
          <Image
            fill
            unoptimized
            priority={
              itemIndex <
              priorityImageCount
            }
            src={
              normalizedImageUrl
            }
            alt={
              normalizedImageAlt
            }
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-400 dark:text-zinc-600">
            <CreativeCatalogImageIcon />

            <span className="text-xs font-semibold">
              {copy.noImage}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3">
          <span
            className={
              joinCreativeCatalogClasses(
                "inline-flex items-center rounded-full border",
                "px-3 py-1.5 text-[10px] font-black",
                "uppercase tracking-[0.08em]",
                "backdrop-blur-md",

                CREATIVE_CATALOG_CONTENT_TYPE_CLASSES[
                  item.contentType
                ],
              )
            }
          >
            {typeLabel}
          </span>

          {item.featured ? (
            <span
              className={[
                "inline-flex items-center rounded-full",
                "border border-violet-500/25",
                "bg-violet-500/15",
                "px-3 py-1.5",
                "text-[10px] font-black",
                "uppercase tracking-[0.08em]",
                "text-violet-700",
                "backdrop-blur-md",

                "dark:border-violet-400/25",
                "dark:bg-violet-400/15",
                "dark:text-violet-300",
              ].join(
                " ",
              )}
            >
              {copy.featured}
            </span>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/85">
              <CreativeCatalogEyeIcon />

              {formatCreativeCatalogCount(
                normalizedViewCount,
              )}
            </span>

            {priceLabel ? (
              <strong className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-sm font-black text-white backdrop-blur-md">
                {priceLabel}
              </strong>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-base font-black leading-6 text-zinc-950 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
              {normalizedTitle}
            </h3>

            {normalizedCategoryLabel ? (
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-300">
                {normalizedCategoryLabel}
              </p>
            ) : null}
          </div>
        </div>

        {normalizedDescription ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {normalizedDescription}
          </p>
        ) : null}

        {normalizedAuthorName ? (
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            {copy.by}{" "}
            <span className="font-bold text-zinc-700 dark:text-zinc-200">
              {normalizedAuthorName}
            </span>
          </p>
        ) : null}

        {normalizedToolLabels.length >
          0 ||
        normalizedTags.length >
          0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {normalizedToolLabels.map(
              (
                toolLabel,
              ) => (
                <span
                  key={
                    `tool-${toolLabel}`
                  }
                  className={[
                    "inline-flex rounded-full",
                    "border border-cyan-500/20",
                    "bg-cyan-500/[0.07]",
                    "px-2.5 py-1",
                    "text-[10px] font-bold",
                    "text-cyan-700",

                    "dark:border-cyan-400/20",
                    "dark:bg-cyan-400/[0.07]",
                    "dark:text-cyan-300",
                  ].join(
                    " ",
                  )}
                >
                  {toolLabel}
                </span>
              ),
            )}

            {normalizedTags.map(
              (
                tag,
              ) => (
                <span
                  key={
                    `tag-${tag}`
                  }
                  className={[
                    "inline-flex rounded-full",
                    "border border-zinc-200",
                    "bg-zinc-100/80",
                    "px-2.5 py-1",
                    "text-[10px] font-semibold",
                    "text-zinc-600",

                    "dark:border-white/10",
                    "dark:bg-white/[0.06]",
                    "dark:text-zinc-300",
                  ].join(
                    " ",
                  )}
                >
                  #{tag}
                </span>
              ),
            )}
          </div>
        ) : null}
      </div>
    </>
  );

  return (
    <article
      data-creative-catalog-card=""
      data-content-type={
        item.contentType
      }
      data-creative-item-id={
        item.id
      }
      className={
        joinCreativeCatalogClasses(
          "group min-w-0 overflow-hidden rounded-3xl",
          "border border-zinc-200/90",
          "bg-white/90",
          "shadow-[0_16px_46px_rgba(15,23,42,0.08)]",
          "backdrop-blur-xl",
          "transition-all duration-300",

          "hover:-translate-y-1",
          "hover:border-emerald-500/25",
          "hover:shadow-[0_22px_58px_rgba(15,23,42,0.14)]",

          "dark:border-white/10",
          "dark:bg-zinc-950/85",
          "dark:shadow-[0_18px_50px_rgba(0,0,0,0.30)]",

          "dark:hover:border-emerald-400/25",
          "dark:hover:shadow-[0_24px_62px_rgba(0,0,0,0.42)]",

          className,
        )
      }
    >
      {onOpenItem ? (
        <button
          type="button"
          aria-label={
            `${normalizedTitle}: ${typeLabel}`
          }
          onClick={
            () => {
              onOpenItem(
                item,
              );
            }
          }
          className="block w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/60"
        >
          {cardMainContent}
        </button>
      ) : (
        <div>
          {cardMainContent}
        </div>
      )}

      {showInteractions ||
      (
        showPrimaryActions &&
        primaryActionAvailable
      ) ? (
        <div className="border-t border-zinc-200/80 p-4 dark:border-white/10">
          <CreativeCardActions
            contentType={
              item.contentType
            }
            language={
              language
            }
            size="md"
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
            likeCount={
              item.likeCount
            }
            favoriteCount={
              item.favoriteCount
            }
            shareCount={
              item.shareCount
            }
            loadingAction={
              loadingAction
            }
            showLike={
              showInteractions &&
              Boolean(
                onLike,
              )
            }
            showFavorite={
              showInteractions &&
              Boolean(
                onFavorite,
              )
            }
            showShare={
              showInteractions &&
              Boolean(
                onShare,
              )
            }
            showPrimaryAction={
              showPrimaryActions &&
              primaryActionAvailable
            }
            canLike={
              item.canLike !==
                false &&
              Boolean(
                onLike,
              )
            }
            canFavorite={
              item.canFavorite !==
                false &&
              Boolean(
                onFavorite,
              )
            }
            canShare={
              item.canShare !==
                false &&
              Boolean(
                onShare,
              )
            }
            canDownload={
              item.canDownload !==
                false &&
              Boolean(
                onDownload,
              )
            }
            canPurchase={
              item.canPurchase !==
                false &&
              Boolean(
                onPurchase,
              )
            }
            canRequest={
              item.canRequest !==
                false &&
              Boolean(
                onRequest,
              )
            }
            onLike={
              onLike
                ? () =>
                    onLike(
                      item,
                    )
                : undefined
            }
            onFavorite={
              onFavorite
                ? () =>
                    onFavorite(
                      item,
                    )
                : undefined
            }
            onShare={
              onShare
                ? () =>
                    onShare(
                      item,
                    )
                : undefined
            }
            onDownload={
              onDownload
                ? () =>
                    onDownload(
                      item,
                    )
                : undefined
            }
            onPurchase={
              onPurchase
                ? () =>
                    onPurchase(
                      item,
                    )
                : undefined
            }
            onRequest={
              onRequest
                ? () =>
                    onRequest(
                      item,
                    )
                : undefined
            }
          />
        </div>
      ) : null}
    </article>
  );
}

/* =========================================================
   ESQUELETO
   ========================================================= */

function CreativeCatalogSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={[
        "overflow-hidden rounded-3xl",
        "border border-zinc-200/80",
        "bg-white/80",

        "dark:border-white/10",
        "dark:bg-zinc-950/75",
      ].join(
        " ",
      )}
    >
      <div className="aspect-[4/3] animate-pulse bg-zinc-200 dark:bg-zinc-800" />

      <div className="space-y-3 p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />

        <div className="h-3 w-1/3 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />

        <div className="space-y-2 pt-2">
          <div className="h-3 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />

          <div className="h-3 w-5/6 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />

          <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      <div className="border-t border-zinc-200/80 p-4 dark:border-white/10">
        <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeCatalog({
  language =
    "es",

  size =
    "default",

  heading =
    null,

  description =
    null,

  items =
    [],

  totalItems =
    null,

  loading =
    false,

  error =
    null,

  searchValue =
    "",

  onSearchValueChange,

  onSearch,

  onClearSearch,

  sortValue =
    "RELEVANCE",

  sortOptions,

  onSortChange,

  contentType =
    "ALL",

  onContentTypeChange,

  categories =
    [],

  selectedCategoryId =
    null,

  onCategoryChange,

  tools =
    [],

  selectedToolIds =
    [],

  onToolToggle,

  featuredOnly =
    false,

  onFeaturedChange,

  activeFilterCount =
    null,

  onClearFilters,

  onOpenItem,

  onLike,

  onFavorite,

  onShare,

  onDownload,

  onPurchase,

  onRequest,

  loadingActionByItemId =
    {},

  hasMore =
    false,

  loadingMore =
    false,

  onLoadMore,

  showHeader =
    true,

  showSearch =
    true,

  showSort =
    true,

  showFilters =
    true,

  showResultsCount =
    true,

  showCardInteractions =
    true,

  showPrimaryActions =
    true,

  priorityImageCount =
    3,

  leadingContent =
    null,

  trailingContent =
    null,

  emptyContent =
    null,

  errorContent =
    null,

  headerClassName,

  toolbarClassName,

  filtersClassName,

  gridClassName,

  cardClassName,

  loadMoreClassName,

  className,

  "aria-label":
    ariaLabel,

  ...sectionProps
}: CreativeCatalogProps) {
  const copy =
    CREATIVE_CATALOG_COPY[
      language
    ];

  const resolvedHeading =
    normalizeCreativeCatalogText(
      heading,
    ) ||
    copy.heading;

  const resolvedDescription =
    normalizeCreativeCatalogText(
      description,
    ) ||
    copy.description;

  const normalizedError =
    normalizeCreativeCatalogText(
      error,
    );

  const normalizedPriorityImageCount =
    normalizeCreativeCatalogPriorityCount(
      priorityImageCount,
    );

  const normalizedTotalItems =
    totalItems ===
      null
      ? items.length
      : normalizeCreativeCatalogCount(
          totalItems,
        );

  const resultLabel =
    normalizedTotalItems ===
      1
      ? copy.result
      : copy.results;

  const showToolbar =
    showSearch ||
    showSort;

  return (
    <section
      {...sectionProps}
      aria-label={
        ariaLabel ??
        resolvedHeading
      }
      aria-busy={
        loading ||
        loadingMore ||
        undefined
      }
      data-creative-catalog=""
      data-size={
        size
      }
      data-loading={
        loading
          ? "true"
          : "false"
      }
      className={
        joinCreativeCatalogClasses(
          "mx-auto w-full px-4 py-8",
          "sm:px-6 sm:py-10",
          "lg:px-8 lg:py-12",

          CREATIVE_CATALOG_SIZE_CLASSES[
            size
          ],

          className,
        )
      }
    >
      {showHeader ? (
        <header
          className={
            joinCreativeCatalogClasses(
              "flex flex-wrap items-end justify-between gap-5",

              headerClassName,
            )
          }
        >
          <div className="max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              {resolvedHeading}
            </h1>

            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400 sm:text-base">
              {resolvedDescription}
            </p>
          </div>

          {showResultsCount ? (
            <div
              aria-live="polite"
              className={[
                "rounded-2xl border",
                "border-emerald-500/20",
                "bg-emerald-500/[0.07]",
                "px-4 py-3",
                "text-sm font-bold",
                "text-emerald-700",

                "dark:border-emerald-400/20",
                "dark:bg-emerald-400/[0.07]",
                "dark:text-emerald-300",
              ].join(
                " ",
              )}
            >
              {normalizedTotalItems}{" "}
              {resultLabel}
            </div>
          ) : null}
        </header>
      ) : null}

      {leadingContent ? (
        <div className="mt-6">
          {leadingContent}
        </div>
      ) : null}

      {showToolbar ? (
        <div
          className={
            joinCreativeCatalogClasses(
              "mt-7 grid gap-4",

              showSearch &&
              showSort
                ? "lg:grid-cols-[minmax(0,1fr)_280px]"
                : "grid-cols-1",

              toolbarClassName,
            )
          }
        >
          {showSearch ? (
            <CreativeSearchInput
              value={
                searchValue
              }
              language={
                language
              }
              size="lg"
              loading={
                loading
              }
              disabled={
                loading ||
                !onSearchValueChange
              }
              showLabel={
                false
              }
              showSearchButton={
                Boolean(
                  onSearch,
                )
              }
              onValueChange={
                onSearchValueChange
              }
              onSearch={
                onSearch
              }
              onClear={
                onClearSearch
              }
            />
          ) : null}

          {showSort ? (
            <CreativeSortSelect
              value={
                sortValue
              }
              language={
                language
              }
              size="lg"
              loading={
                loading
              }
              disabled={
                loading ||
                !onSortChange
              }
              options={
                sortOptions
              }
              includePriceOptions={
                contentType ===
                  "ALL" ||
                contentType ===
                  "PAID"
              }
              includeDownloadOption={
                contentType ===
                  "ALL" ||
                contentType ===
                  "FREE"
              }
              onValueChange={
                onSortChange
              }
            />
          ) : null}
        </div>
      ) : null}

      {showFilters ? (
        <div
          className={
            joinCreativeCatalogClasses(
              "mt-5",

              filtersClassName,
            )
          }
        >
          <CreativeCatalogFilters
            language={
              language
            }
            contentType={
              contentType
            }
            onContentTypeChange={
              onContentTypeChange
            }
            categories={
              categories
            }
            selectedCategoryId={
              selectedCategoryId
            }
            onCategoryChange={
              onCategoryChange
            }
            tools={
              tools
            }
            selectedToolIds={
              selectedToolIds
            }
            onToolToggle={
              onToolToggle
            }
            featuredOnly={
              featuredOnly
            }
            onFeaturedChange={
              onFeaturedChange
            }
            activeFilterCount={
              activeFilterCount
            }
            onClear={
              onClearFilters
            }
            disabled={
              loading
            }
            compact
          />
        </div>
      ) : null}

      {loading ? (
        <div
          aria-label={
            copy.loading
          }
          className={
            joinCreativeCatalogClasses(
              "mt-8 grid gap-5",

              CREATIVE_CATALOG_GRID_SIZE_CLASSES[
                size
              ],

              gridClassName,
            )
          }
        >
          {Array.from({
            length:
              6,
          }).map(
            (
              _,
              skeletonIndex,
            ) => (
              <CreativeCatalogSkeleton
                key={
                  `creative-catalog-skeleton-${skeletonIndex}`
                }
              />
            ),
          )}
        </div>
      ) : normalizedError ? (
        <div
          role="alert"
          className={[
            "mt-8 flex min-h-72 flex-col",
            "items-center justify-center",
            "rounded-3xl border",
            "border-red-500/20",
            "bg-red-500/[0.04]",
            "px-6 py-10 text-center",

            "dark:border-red-400/20",
            "dark:bg-red-400/[0.04]",
          ].join(
            " ",
          )}
        >
          {errorContent ?? (
            <>
              <span
                aria-hidden="true"
                className={[
                  "flex h-16 w-16 items-center justify-center",
                  "rounded-2xl border",
                  "border-red-500/20",
                  "bg-red-500/10",
                  "text-red-600",

                  "dark:border-red-400/20",
                  "dark:bg-red-400/10",
                  "dark:text-red-300",
                ].join(
                  " ",
                )}
              >
                <CreativeCatalogErrorIcon />
              </span>

              <h2 className="mt-5 text-xl font-black text-zinc-950 dark:text-white">
                {copy.errorTitle}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {normalizedError ||
                copy.errorDescription}
              </p>
            </>
          )}
        </div>
      ) : items.length ===
        0 ? (
        <div
          className={[
            "mt-8 flex min-h-72 flex-col",
            "items-center justify-center",
            "rounded-3xl border",
            "border-zinc-200/90",
            "bg-white/75",
            "px-6 py-10 text-center",
            "shadow-[0_16px_45px_rgba(15,23,42,0.06)]",

            "dark:border-white/10",
            "dark:bg-zinc-950/70",
            "dark:shadow-[0_18px_50px_rgba(0,0,0,0.25)]",
          ].join(
            " ",
          )}
        >
          {emptyContent ?? (
            <>
              <span
                aria-hidden="true"
                className={[
                  "flex h-16 w-16 items-center justify-center",
                  "rounded-2xl border",
                  "border-emerald-500/20",
                  "bg-emerald-500/10",
                  "text-emerald-700",

                  "dark:border-emerald-400/20",
                  "dark:bg-emerald-400/10",
                  "dark:text-emerald-300",
                ].join(
                  " ",
                )}
              >
                <CreativeCatalogEmptyIcon />
              </span>

              <h2 className="mt-5 text-xl font-black text-zinc-950 dark:text-white">
                {copy.emptyTitle}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {copy.emptyDescription}
              </p>
            </>
          )}
        </div>
      ) : (
        <div
          className={
            joinCreativeCatalogClasses(
              "mt-8 grid gap-5",

              CREATIVE_CATALOG_GRID_SIZE_CLASSES[
                size
              ],

              gridClassName,
            )
          }
        >
          {items.map(
            (
              item,
              itemIndex,
            ) => (
              <CreativeCatalogCard
                key={
                  normalizeCreativeCatalogText(
                    item.id,
                  ) ||
                  normalizeCreativeCatalogText(
                    item.slug,
                  ) ||
                  `creative-item-${itemIndex}`
                }
                item={
                  item
                }
                itemIndex={
                  itemIndex
                }
                language={
                  language
                }
                priorityImageCount={
                  normalizedPriorityImageCount
                }
                loadingAction={
                  loadingActionByItemId[
                    item.id
                  ] ??
                  null
                }
                showInteractions={
                  showCardInteractions
                }
                showPrimaryActions={
                  showPrimaryActions
                }
                className={
                  cardClassName
                }
                onOpenItem={
                  onOpenItem
                }
                onLike={
                  onLike
                }
                onFavorite={
                  onFavorite
                }
                onShare={
                  onShare
                }
                onDownload={
                  onDownload
                }
                onPurchase={
                  onPurchase
                }
                onRequest={
                  onRequest
                }
              />
            ),
          )}
        </div>
      )}

      {!loading &&
      !normalizedError &&
      items.length >
        0 &&
      hasMore ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            aria-busy={
              loadingMore ||
              undefined
            }
            disabled={
              loadingMore ||
              !onLoadMore
            }
            onClick={
              () => {
                void onLoadMore?.();
              }
            }
            className={
              joinCreativeCatalogClasses(
                "inline-flex min-h-12 items-center justify-center gap-3",
                "rounded-2xl border",
                "border-emerald-500/25",
                "bg-emerald-500/10",
                "px-6 py-3",
                "text-sm font-black",
                "text-emerald-700",
                "outline-none",
                "transition-all duration-200",

                "enabled:hover:-translate-y-0.5",
                "enabled:hover:border-emerald-500/40",
                "enabled:hover:bg-emerald-500/15",
                "enabled:hover:shadow-[0_12px_30px_rgba(16,185,129,0.15)]",

                "enabled:active:translate-y-0",
                "enabled:active:scale-[0.98]",

                "focus-visible:ring-2",
                "focus-visible:ring-emerald-500/60",
                "focus-visible:ring-offset-2",

                "disabled:cursor-not-allowed",
                "disabled:opacity-50",

                "dark:border-emerald-400/25",
                "dark:bg-emerald-400/10",
                "dark:text-emerald-300",

                "dark:focus-visible:ring-emerald-400/60",
                "dark:focus-visible:ring-offset-zinc-950",

                loadMoreClassName,
              )
            }
          >
            {loadingMore ? (
              <CreativeSpinner
                decorative
                size="sm"
                variant="primary"
              />
            ) : null}

            <span>
              {loadingMore
                ? copy.loadingMore
                : copy.loadMore}
            </span>
          </button>
        </div>
      ) : null}

      {trailingContent ? (
        <div className="mt-8">
          {trailingContent}
        </div>
      ) : null}
    </section>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeCatalog;