"use client";

/*
 * Filtros controlados para el catálogo Diseño / Creative.
 *
 * Responsabilidades:
 * - Filtrar por FREE, PAID y PORTFOLIO.
 * - Filtrar por categoría.
 * - Filtrar por herramientas.
 * - Filtrar publicaciones destacadas.
 * - Mostrar cantidades opcionales.
 * - Limpiar todos los filtros.
 *
 * Todos los valores son controlados por el componente padre.
 */

import type {
  HTMLAttributes,
} from "react";

import {
  CreativeTag,
} from "@/components/atoms/creative/CreativeTag";

import type {
  CreativeContentType,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeCatalogFiltersLanguage =
  | "es"
  | "en";

/* =========================================================
   FILTRO DE TIPO
   ========================================================= */

export type CreativeCatalogContentTypeFilter =
  | "ALL"
  | CreativeContentType;

/* =========================================================
   OPCIÓN DE FILTRO
   ========================================================= */

export interface CreativeCatalogFilterOption {
  id:
    string;

  label:
    string;

  count?:
    number | null;

  disabled?:
    boolean;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeCatalogFiltersProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children" | "onChange" | "title"
  > {
  language?:
    CreativeCatalogFiltersLanguage;

  title?:
    string | null;

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

  onClear?:
    () => void;

  disabled?:
    boolean;

  showContentTypes?:
    boolean;

  showCategories?:
    boolean;

  showTools?:
    boolean;

  showFeatured?:
    boolean;

  showClearButton?:
    boolean;

  showCounts?:
    boolean;

  activeFilterCount?:
    number | null;

  compact?:
    boolean;

  headerClassName?:
    string;

  sectionClassName?:
    string;

  optionsClassName?:
    string;

  clearButtonClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_CATALOG_FILTERS_COPY = {
  es: {
    title:
      "Filtrar diseños",

    contentType:
      "Tipo de contenido",

    all:
      "Todos",

    free:
      "Gratis",

    paid:
      "De pago",

    portfolio:
      "Portafolio",

    categories:
      "Categorías",

    allCategories:
      "Todas las categorías",

    tools:
      "Herramientas",

    featured:
      "Solo destacados",

    clear:
      "Limpiar filtros",

    active:
      "filtros activos",

    activeSingular:
      "filtro activo",

    noCategories:
      "No hay categorías disponibles.",

    noTools:
      "No hay herramientas disponibles.",
  },

  en: {
    title:
      "Filter designs",

    contentType:
      "Content type",

    all:
      "All",

    free:
      "Free",

    paid:
      "Paid",

    portfolio:
      "Portfolio",

    categories:
      "Categories",

    allCategories:
      "All categories",

    tools:
      "Tools",

    featured:
      "Featured only",

    clear:
      "Clear filters",

    active:
      "active filters",

    activeSingular:
      "active filter",

    noCategories:
      "No categories available.",

    noTools:
      "No tools available.",
  },
} as const;

/* =========================================================
   TIPOS DE CONTENIDO
   ========================================================= */

const CREATIVE_CONTENT_TYPE_FILTERS = [
  "ALL",
  "FREE",
  "PAID",
  "PORTFOLIO",
] as const satisfies readonly CreativeCatalogContentTypeFilter[];

/* =========================================================
   VARIANTES DE ETIQUETAS
   ========================================================= */

const CREATIVE_CONTENT_TYPE_VARIANTS = {
  ALL:
    "neutral",

  FREE:
    "success",

  PAID:
    "warning",

  PORTFOLIO:
    "info",
} as const;

/* =========================================================
   CLASES
   ========================================================= */

const CREATIVE_CATALOG_FILTERS_BASE_CLASSES = [
  "w-full",
  "rounded-3xl",
  "border",
  "border-zinc-200/80",
  "bg-white/85",
  "shadow-[0_16px_45px_rgba(15,23,42,0.07)]",
  "backdrop-blur-xl",

  "dark:border-white/10",
  "dark:bg-zinc-950/80",
  "dark:shadow-[0_18px_50px_rgba(0,0,0,0.26)]",
].join(
  " ",
);

const CREATIVE_CATALOG_FILTER_SECTION_CLASSES = [
  "space-y-3",
  "border-t",
  "border-zinc-200/80",
  "pt-5",

  "first:border-t-0",
  "first:pt-0",

  "dark:border-white/10",
].join(
  " ",
);

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeCatalogFiltersClasses(
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

function normalizeCreativeCatalogFilterText(
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
   NORMALIZAR IDENTIFICADOR
   ========================================================= */

function normalizeCreativeCatalogFilterId(
  value:
    string | null | undefined,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value.trim();
}

/* =========================================================
   NORMALIZAR CONTADOR
   ========================================================= */

function normalizeCreativeCatalogFilterCount(
  value:
    number | null | undefined,
): number | null {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    )
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.trunc(
      value,
    ),
  );
}

/* =========================================================
   NORMALIZAR OPCIONES
   ========================================================= */

function normalizeCreativeCatalogFilterOptions(
  options:
    CreativeCatalogFilterOption[] | null | undefined,
): CreativeCatalogFilterOption[] {
  if (
    !Array.isArray(
      options,
    )
  ) {
    return [];
  }

  const normalizedOptions:
    CreativeCatalogFilterOption[] =
      [];

  const usedIds =
    new Set<string>();

  for (
    const option of
    options
  ) {
    const normalizedId =
      normalizeCreativeCatalogFilterId(
        option.id,
      );

    const normalizedLabel =
      normalizeCreativeCatalogFilterText(
        option.label,
      );

    if (
      !normalizedId ||
      !normalizedLabel ||
      usedIds.has(
        normalizedId,
      )
    ) {
      continue;
    }

    usedIds.add(
      normalizedId,
    );

    normalizedOptions.push({
      id:
        normalizedId,

      label:
        normalizedLabel,

      count:
        normalizeCreativeCatalogFilterCount(
          option.count,
        ),

      disabled:
        Boolean(
          option.disabled,
        ),
    });
  }

  return normalizedOptions;
}

/* =========================================================
   NORMALIZAR HERRAMIENTAS SELECCIONADAS
   ========================================================= */

function normalizeCreativeSelectedToolIds(
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
        normalizeCreativeCatalogFilterId,
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
   ETIQUETA DE TIPO
   ========================================================= */

function getCreativeContentTypeFilterLabel(
  contentType:
    CreativeCatalogContentTypeFilter,
  language:
    CreativeCatalogFiltersLanguage,
): string {
  const copy =
    CREATIVE_CATALOG_FILTERS_COPY[
      language
    ];

  switch (
    contentType
  ) {
    case "FREE":
      return copy.free;

    case "PAID":
      return copy.paid;

    case "PORTFOLIO":
      return copy.portfolio;

    default:
      return copy.all;
  }
}

/* =========================================================
   ICONO DE FILTRO
   ========================================================= */

function CreativeCatalogFilterIcon() {
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
      <path d="M4 6h16" />

      <path d="M7 12h10" />

      <path d="M10 18h4" />
    </svg>
  );
}

/* =========================================================
   ICONO DE LIMPIEZA
   ========================================================= */

function CreativeCatalogClearIcon() {
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
      <path d="M3 12a9 9 0 1 0 3-6.7" />

      <path d="M3 4v6h6" />
    </svg>
  );
}

/* =========================================================
   TÍTULO DE SECCIÓN
   ========================================================= */

interface CreativeCatalogFilterSectionTitleProps {
  children:
    string;
}

function CreativeCatalogFilterSectionTitle({
  children,
}: CreativeCatalogFilterSectionTitleProps) {
  return (
    <h3
      className={[
        "text-xs",
        "font-bold",
        "uppercase",
        "tracking-[0.12em]",
        "text-zinc-500",

        "dark:text-zinc-400",
      ].join(
        " ",
      )}
    >
      {children}
    </h3>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeCatalogFilters({
  language =
    "es",

  title =
    null,

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

  onClear,

  disabled =
    false,

  showContentTypes =
    true,

  showCategories =
    true,

  showTools =
    true,

  showFeatured =
    true,

  showClearButton =
    true,

  showCounts =
    true,

  activeFilterCount =
    null,

  compact =
    false,

  headerClassName,

  sectionClassName,

  optionsClassName,

  clearButtonClassName,

  className,

  ...containerProps
}: CreativeCatalogFiltersProps) {
  const copy =
    CREATIVE_CATALOG_FILTERS_COPY[
      language
    ];

  const normalizedTitle =
    normalizeCreativeCatalogFilterText(
      title,
    ) ||
    copy.title;

  const normalizedCategoryId =
    normalizeCreativeCatalogFilterId(
      selectedCategoryId,
    );

  const normalizedCategories =
    normalizeCreativeCatalogFilterOptions(
      categories,
    );

  const normalizedTools =
    normalizeCreativeCatalogFilterOptions(
      tools,
    );

  const normalizedToolIds =
    normalizeCreativeSelectedToolIds(
      selectedToolIds,
    );

  const selectedToolIdSet =
    new Set(
      normalizedToolIds,
    );

  const calculatedActiveFilterCount =
    (
      contentType !==
      "ALL"
        ? 1
        : 0
    ) +
    (
      normalizedCategoryId
        ? 1
        : 0
    ) +
    normalizedToolIds.length +
    (
      featuredOnly
        ? 1
        : 0
    );

  const normalizedProvidedCount =
    normalizeCreativeCatalogFilterCount(
      activeFilterCount,
    );

  const resolvedActiveFilterCount =
    normalizedProvidedCount ??
    calculatedActiveFilterCount;

  const hasActiveFilters =
    resolvedActiveFilterCount >
    0;

  const activeFilterLabel =
    resolvedActiveFilterCount ===
      1
      ? copy.activeSingular
      : copy.active;

  const handleClear =
    (): void => {
      if (
        disabled
      ) {
        return;
      }

      onClear?.();
    };

  return (
    <div
      {...containerProps}
      data-creative-catalog-filters=""
      data-active-filter-count={
        resolvedActiveFilterCount
      }
      data-disabled={
        disabled
          ? "true"
          : "false"
      }
      className={
        joinCreativeCatalogFiltersClasses(
          CREATIVE_CATALOG_FILTERS_BASE_CLASSES,

          compact
            ? "space-y-4 p-4"
            : "space-y-5 p-5 sm:p-6",

          disabled &&
            "pointer-events-none opacity-60",

          className,
        )
      }
    >
      <div
        className={
          joinCreativeCatalogFiltersClasses(
            "flex flex-wrap items-center justify-between gap-3",

            headerClassName,
          )
        }
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className={[
              "flex",
              "h-10",
              "w-10",
              "shrink-0",
              "items-center",
              "justify-center",
              "rounded-xl",
              "border",
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
            <CreativeCatalogFilterIcon />
          </span>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-zinc-950 dark:text-white">
              {normalizedTitle}
            </h2>

            {hasActiveFilters ? (
              <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {resolvedActiveFilterCount}{" "}
                {activeFilterLabel}
              </p>
            ) : null}
          </div>
        </div>

        {showClearButton ? (
          <button
            type="button"
            disabled={
              disabled ||
              !hasActiveFilters ||
              !onClear
            }
            onClick={
              handleClear
            }
            className={
              joinCreativeCatalogFiltersClasses(
                "inline-flex min-h-9 items-center justify-center gap-2",
                "rounded-xl border border-zinc-200",
                "bg-zinc-100/80 px-3 py-2",
                "text-xs font-semibold text-zinc-700",
                "outline-none transition-all duration-200",

                "enabled:hover:border-red-500/25",
                "enabled:hover:bg-red-500/10",
                "enabled:hover:text-red-700",

                "focus-visible:ring-2",
                "focus-visible:ring-red-500/50",
                "focus-visible:ring-offset-2",

                "disabled:cursor-not-allowed",
                "disabled:opacity-40",

                "dark:border-white/10",
                "dark:bg-white/[0.06]",
                "dark:text-zinc-300",

                "dark:enabled:hover:border-red-400/25",
                "dark:enabled:hover:bg-red-400/10",
                "dark:enabled:hover:text-red-300",

                clearButtonClassName,
              )
            }
          >
            <CreativeCatalogClearIcon />

            <span>
              {copy.clear}
            </span>
          </button>
        ) : null}
      </div>

      {showContentTypes ? (
        <section
          aria-labelledby="creative-content-type-filter-title"
          className={
            joinCreativeCatalogFiltersClasses(
              CREATIVE_CATALOG_FILTER_SECTION_CLASSES,

              sectionClassName,
            )
          }
        >
          <div id="creative-content-type-filter-title">
            <CreativeCatalogFilterSectionTitle>
              {copy.contentType}
            </CreativeCatalogFilterSectionTitle>
          </div>

          <div
            className={
              joinCreativeCatalogFiltersClasses(
                "flex flex-wrap gap-2",

                optionsClassName,
              )
            }
          >
            {CREATIVE_CONTENT_TYPE_FILTERS.map(
              (
                filterValue,
              ) => (
                <CreativeTag
                  key={
                    filterValue
                  }
                  label={
                    getCreativeContentTypeFilterLabel(
                      filterValue,
                      language,
                    )
                  }
                  size={
                    compact
                      ? "sm"
                      : "md"
                  }
                  variant={
                    CREATIVE_CONTENT_TYPE_VARIANTS[
                      filterValue
                    ]
                  }
                  selected={
                    contentType ===
                    filterValue
                  }
                  disabled={
                    disabled ||
                    !onContentTypeChange
                  }
                  onPress={
                    () => {
                      onContentTypeChange?.(
                        filterValue,
                      );
                    }
                  }
                />
              ),
            )}
          </div>
        </section>
      ) : null}

      {showCategories ? (
        <section
          aria-labelledby="creative-category-filter-title"
          className={
            joinCreativeCatalogFiltersClasses(
              CREATIVE_CATALOG_FILTER_SECTION_CLASSES,

              sectionClassName,
            )
          }
        >
          <div id="creative-category-filter-title">
            <CreativeCatalogFilterSectionTitle>
              {copy.categories}
            </CreativeCatalogFilterSectionTitle>
          </div>

          <div
            className={
              joinCreativeCatalogFiltersClasses(
                "flex flex-wrap gap-2",

                optionsClassName,
              )
            }
          >
            <CreativeTag
              label={
                copy.allCategories
              }
              size={
                compact
                  ? "sm"
                  : "md"
              }
              variant="neutral"
              selected={
                !normalizedCategoryId
              }
              disabled={
                disabled ||
                !onCategoryChange
              }
              onPress={
                () => {
                  onCategoryChange?.(
                    null,
                  );
                }
              }
            />

            {normalizedCategories.map(
              (
                category,
              ) => (
                <CreativeTag
                  key={
                    category.id
                  }
                  label={
                    category.label
                  }
                  count={
                    showCounts
                      ? category.count
                      : null
                  }
                  size={
                    compact
                      ? "sm"
                      : "md"
                  }
                  variant="primary"
                  selected={
                    normalizedCategoryId ===
                    category.id
                  }
                  disabled={
                    disabled ||
                    category.disabled ||
                    !onCategoryChange
                  }
                  onPress={
                    () => {
                      onCategoryChange?.(
                        category.id,
                      );
                    }
                  }
                />
              ),
            )}
          </div>

          {normalizedCategories.length ===
          0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {copy.noCategories}
            </p>
          ) : null}
        </section>
      ) : null}

      {showTools ? (
        <section
          aria-labelledby="creative-tool-filter-title"
          className={
            joinCreativeCatalogFiltersClasses(
              CREATIVE_CATALOG_FILTER_SECTION_CLASSES,

              sectionClassName,
            )
          }
        >
          <div id="creative-tool-filter-title">
            <CreativeCatalogFilterSectionTitle>
              {copy.tools}
            </CreativeCatalogFilterSectionTitle>
          </div>

          <div
            className={
              joinCreativeCatalogFiltersClasses(
                "flex flex-wrap gap-2",

                optionsClassName,
              )
            }
          >
            {normalizedTools.map(
              (
                tool,
              ) => (
                <CreativeTag
                  key={
                    tool.id
                  }
                  label={
                    tool.label
                  }
                  count={
                    showCounts
                      ? tool.count
                      : null
                  }
                  size={
                    compact
                      ? "sm"
                      : "md"
                  }
                  variant="violet"
                  selected={
                    selectedToolIdSet.has(
                      tool.id,
                    )
                  }
                  disabled={
                    disabled ||
                    tool.disabled ||
                    !onToolToggle
                  }
                  onPress={
                    () => {
                      onToolToggle?.(
                        tool.id,
                      );
                    }
                  }
                />
              ),
            )}
          </div>

          {normalizedTools.length ===
          0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {copy.noTools}
            </p>
          ) : null}
        </section>
      ) : null}

      {showFeatured ? (
        <section
          aria-labelledby="creative-featured-filter-title"
          className={
            joinCreativeCatalogFiltersClasses(
              CREATIVE_CATALOG_FILTER_SECTION_CLASSES,

              sectionClassName,
            )
          }
        >
          <div id="creative-featured-filter-title">
            <CreativeCatalogFilterSectionTitle>
              {copy.featured}
            </CreativeCatalogFilterSectionTitle>
          </div>

          <CreativeTag
            label={
              copy.featured
            }
            size={
              compact
                ? "sm"
                : "md"
            }
            variant="warning"
            selected={
              featuredOnly
            }
            disabled={
              disabled ||
              !onFeaturedChange
            }
            onPress={
              () => {
                onFeaturedChange?.(
                  !featuredOnly,
                );
              }
            }
          />
        </section>
      ) : null}
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeCatalogFilters;