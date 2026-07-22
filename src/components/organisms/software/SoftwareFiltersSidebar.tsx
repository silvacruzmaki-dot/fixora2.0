"use client";

import { FiRotateCcw } from "react-icons/fi";

import {
  softwareCategories,
  softwarePriceLimits,
  softwareProducts,
} from "@/data/software";

import {
  countSoftwareProductsByCategory,
  countSoftwareProductsByLicenseType,
} from "@/lib/software";

import {
  SoftwareFilterGroup,
  SoftwareSearch,
} from "@/components/molecules/software";

import type {
  SoftwareCategoryId,
  SoftwareFilters,
  SoftwareLicenseType,
} from "@/types/software";

interface SoftwareFiltersSidebarProps {
  filters: SoftwareFilters;
  onSearchChange: (value: string) => void;
  onToggleCategory: (
    categoryId: SoftwareCategoryId,
  ) => void;
  onToggleLicenseType: (
    licenseType: SoftwareLicenseType,
  ) => void;
  onSetMinimumPrice: (price: number) => void;
  onSetMaximumPrice: (price: number) => void;
  onClearFilters: () => void;
  className?: string;
}

const licenseTypeLabels: Record<
  SoftwareLicenseType,
  string
> = {
  subscription: "Suscripción",
  permanent: "Permanente",
  academic: "Académica",
  business: "Empresarial",
};

const licenseTypes: SoftwareLicenseType[] = [
  "subscription",
  "permanent",
  "academic",
  "business",
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function SoftwareFiltersSidebar({
  filters,
  onSearchChange,
  onToggleCategory,
  onToggleLicenseType,
  onSetMinimumPrice,
  onSetMaximumPrice,
  onClearFilters,
  className = "",
}: SoftwareFiltersSidebarProps) {
  const activeFiltersCount =
    filters.categoryIds.length +
    filters.licenseTypes.length +
    (filters.search.trim() ? 1 : 0) +
    (filters.minPrice >
    softwarePriceLimits.minimumPrice
      ? 1
      : 0) +
    (filters.maxPrice <
    softwarePriceLimits.maximumPrice
      ? 1
      : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <aside
      aria-label="Filtros del catálogo de software"
      className={[
        "h-fit rounded-2xl border border-white/10",
        "bg-[#0D1720]/90 p-5 backdrop-blur-xl",
        "shadow-[0_24px_65px_rgba(0,0,0,0.3)]",
        "lg:sticky lg:top-28",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">
            Filtros
          </h2>

          <p className="mt-1 text-xs text-white/45">
            Refina los resultados del catálogo
          </p>
        </div>

        {activeFiltersCount > 0 && (
          <span
            className={[
              "inline-flex min-h-7 min-w-7 items-center",
              "justify-center rounded-full",
              "border border-[#62C945]/30",
              "bg-[#62C945]/10 px-2",
              "text-xs font-bold text-[#72D653]",
            ].join(" ")}
          >
            {activeFiltersCount}
          </span>
        )}
      </div>

      <div className="mt-5">
        <SoftwareSearch
          value={filters.search}
          onChange={onSearchChange}
        />
      </div>

      <div className="mt-6 space-y-6">
        <SoftwareFilterGroup title="Categoría">
          <div className="space-y-3">
            {softwareCategories.map((category) => {
              const productCount =
                countSoftwareProductsByCategory(
                  softwareProducts,
                  category.id,
                );

              const isChecked =
                filters.categoryIds.includes(
                  category.id,
                );

              return (
                <label
                  key={category.id}
                  className={[
                    "group flex cursor-pointer items-center",
                    "justify-between gap-3 rounded-lg px-2 py-1.5",
                    "transition-colors duration-200",
                    "hover:bg-white/5",
                  ].join(" ")}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        onToggleCategory(category.id)
                      }
                      className={[
                        "h-4 w-4 shrink-0 cursor-pointer",
                        "accent-[#62C945]",
                      ].join(" ")}
                    />

                    <span
                      className={[
                        "truncate text-sm",
                        isChecked
                          ? "font-semibold text-[#72D653]"
                          : "text-white/65 group-hover:text-white",
                      ].join(" ")}
                    >
                      {category.name}
                    </span>
                  </span>

                  <span className="text-xs text-white/35">
                    {productCount}
                  </span>
                </label>
              );
            })}
          </div>
        </SoftwareFilterGroup>

        <SoftwareFilterGroup title="Rango de precio">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-2">
                <span className="text-xs font-medium text-white/45">
                  Mínimo
                </span>

                <input
                  type="number"
                  min={
                    softwarePriceLimits.minimumPrice
                  }
                  max={filters.maxPrice}
                  step={10}
                  value={filters.minPrice}
                  onChange={(event) =>
                    onSetMinimumPrice(
                      Number(event.target.value),
                    )
                  }
                  className={[
                    "min-h-10 w-full rounded-lg border",
                    "border-white/10 bg-[#071018]",
                    "px-3 text-sm font-semibold text-white",
                    "outline-none transition-all duration-200",
                    "focus:border-[#62C945]/60",
                    "focus:ring-2 focus:ring-[#62C945]/15",
                  ].join(" ")}
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium text-white/45">
                  Máximo
                </span>

                <input
                  type="number"
                  min={filters.minPrice}
                  max={
                    softwarePriceLimits.maximumPrice
                  }
                  step={10}
                  value={filters.maxPrice}
                  onChange={(event) =>
                    onSetMaximumPrice(
                      Number(event.target.value),
                    )
                  }
                  className={[
                    "min-h-10 w-full rounded-lg border",
                    "border-white/10 bg-[#071018]",
                    "px-3 text-sm font-semibold text-white",
                    "outline-none transition-all duration-200",
                    "focus:border-[#62C945]/60",
                    "focus:ring-2 focus:ring-[#62C945]/15",
                  ].join(" ")}
                />
              </label>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between text-xs">
                <span className="text-white/45">
                  {formatPrice(filters.minPrice)}
                </span>

                <span className="font-semibold text-[#72D653]">
                  {formatPrice(filters.maxPrice)}
                </span>
              </div>

              <label className="block">
                <span className="sr-only">
                  Precio máximo
                </span>

                <input
                  type="range"
                  min={
                    softwarePriceLimits.minimumPrice
                  }
                  max={
                    softwarePriceLimits.maximumPrice
                  }
                  step={10}
                  value={filters.maxPrice}
                  onChange={(event) =>
                    onSetMaximumPrice(
                      Number(event.target.value),
                    )
                  }
                  className={[
                    "h-2 w-full cursor-pointer",
                    "accent-[#62C945]",
                  ].join(" ")}
                />
              </label>
            </div>
          </div>
        </SoftwareFilterGroup>

        <SoftwareFilterGroup title="Tipo de licencia">
          <div className="space-y-3">
            {licenseTypes.map((licenseType) => {
              const productCount =
                countSoftwareProductsByLicenseType(
                  softwareProducts,
                  licenseType,
                );

              const isChecked =
                filters.licenseTypes.includes(
                  licenseType,
                );

              return (
                <label
                  key={licenseType}
                  className={[
                    "group flex cursor-pointer items-center",
                    "justify-between gap-3 rounded-lg px-2 py-1.5",
                    "transition-colors duration-200",
                    "hover:bg-white/5",
                  ].join(" ")}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() =>
                        onToggleLicenseType(
                          licenseType,
                        )
                      }
                      className="h-4 w-4 shrink-0 cursor-pointer accent-[#62C945]"
                    />

                    <span
                      className={[
                        "truncate text-sm",
                        isChecked
                          ? "font-semibold text-[#72D653]"
                          : "text-white/65 group-hover:text-white",
                      ].join(" ")}
                    >
                      {licenseTypeLabels[licenseType]}
                    </span>
                  </span>

                  <span className="text-xs text-white/35">
                    {productCount}
                  </span>
                </label>
              );
            })}
          </div>
        </SoftwareFilterGroup>
      </div>

      <button
        type="button"
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
        className={[
          "mt-6 inline-flex min-h-11 w-full",
          "items-center justify-center gap-2 rounded-xl",
          "border border-white/10 bg-white/5 px-4",
          "text-sm font-bold text-white/65",
          "transition-all duration-300",
          "enabled:hover:border-[#62C945]/40",
          "enabled:hover:bg-[#62C945]/10",
          "enabled:hover:text-[#72D653]",
          "disabled:cursor-not-allowed",
          "disabled:opacity-35",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[#62C945]",
        ].join(" ")}
      >
        <FiRotateCcw
          aria-hidden="true"
          className="h-4 w-4"
        />

        Limpiar filtros
      </button>
    </aside>
  );
}