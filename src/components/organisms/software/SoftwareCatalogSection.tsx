"use client";

import {
  FiChevronDown,
  FiGrid,
  FiPackage,
  FiSearch,
} from "react-icons/fi";

import {
  SoftwareProductCard,
  SoftwareSort,
} from "@/components/molecules/software";

import type {
  SoftwareProduct,
  SoftwareSortOption,
} from "@/types/software";

interface SoftwareCatalogSectionProps {
  products: SoftwareProduct[];
  totalProducts: number;
  sortOption: SoftwareSortOption;
  hasMoreProducts: boolean;
  onSortChange: (option: SoftwareSortOption) => void;
  onShowMoreProducts: () => void;
  onViewDetails: (product: SoftwareProduct) => void;
  onBuy: (product: SoftwareProduct) => void;
  onRequestQuote: (product: SoftwareProduct) => void;
  onClearFilters: () => void;
  className?: string;
}

export default function SoftwareCatalogSection({
  products,
  totalProducts,
  sortOption,
  hasMoreProducts,
  onSortChange,
  onShowMoreProducts,
  onViewDetails,
  onBuy,
  onRequestQuote,
  onClearFilters,
  className = "",
}: SoftwareCatalogSectionProps) {
  const visibleProductsCount = products.length;

  return (
    <div
      className={[
        "min-w-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "flex flex-col gap-5",
          "rounded-2xl border border-white/10",
          "bg-[#0D1720]/75 p-5",
          "backdrop-blur-xl",
          "sm:p-6",
          "xl:flex-row xl:items-center",
          "xl:justify-between",
        ].join(" ")}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span
              className={[
                "inline-flex h-11 w-11 shrink-0",
                "items-center justify-center rounded-xl",
                "border border-[#62C945]/30",
                "bg-[#62C945]/10 text-[#72D653]",
                "shadow-[0_0_20px_rgba(98,201,69,0.12)]",
              ].join(" ")}
            >
              <FiGrid
                aria-hidden="true"
                className="h-5 w-5"
              />
            </span>

            <div className="min-w-0">
              <h2
                id="software-catalog-products-title"
                className={[
                  "text-2xl font-black tracking-[-0.025em]",
                  "text-white sm:text-3xl",
                ].join(" ")}
              >
                Catálogo de software
              </h2>

              <p className="mt-1 text-sm text-white/50">
                Mostrando{" "}
                <span className="font-bold text-[#72D653]">
                  {visibleProductsCount}
                </span>{" "}
                de{" "}
                <span className="font-bold text-white">
                  {totalProducts}
                </span>{" "}
                productos disponibles
              </p>
            </div>
          </div>
        </div>

        <SoftwareSort
          value={sortOption}
          onChange={onSortChange}
        />
      </div>

      {products.length > 0 ? (
        <>
          <div
            aria-labelledby="software-catalog-products-title"
            className={[
              "mt-6 grid grid-cols-1 gap-6",
              "md:grid-cols-2",
              "2xl:grid-cols-3",
            ].join(" ")}
          >
            {products.map((product) => (
              <SoftwareProductCard
                key={product.id}
                product={product}
                onViewDetails={onViewDetails}
                onBuy={onBuy}
                onRequestQuote={onRequestQuote}
              />
            ))}
          </div>

          {hasMoreProducts && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={onShowMoreProducts}
                className={[
                  "group inline-flex min-h-12",
                  "items-center justify-center gap-2.5",
                  "rounded-xl border border-[#62C945]/35",
                  "bg-[#62C945]/10 px-6",
                  "text-sm font-extrabold text-[#72D653]",
                  "backdrop-blur-md",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:border-[#72D653]/65",
                  "hover:bg-[#62C945]/20",
                  "hover:shadow-[0_0_30px_rgba(98,201,69,0.16)]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#62C945]",
                  "focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-[#071018]",
                ].join(" ")}
              >
                Ver más productos

                <FiChevronDown
                  aria-hidden="true"
                  className={[
                    "h-4 w-4",
                    "transition-transform duration-300",
                    "group-hover:translate-y-1",
                  ].join(" ")}
                />
              </button>
            </div>
          )}

          {!hasMoreProducts && totalProducts > 0 && (
            <div
              className={[
                "mt-10 flex items-center justify-center gap-2",
                "rounded-xl border border-white/10",
                "bg-white/[0.03] px-5 py-4",
                "text-sm text-white/45",
              ].join(" ")}
            >
              <FiPackage
                aria-hidden="true"
                className="h-4 w-4 text-[#72D653]"
              />

              Has llegado al final del catálogo.
            </div>
          )}
        </>
      ) : (
        <div
          className={[
            "mt-6 flex min-h-[360px] flex-col",
            "items-center justify-center rounded-2xl",
            "border border-dashed border-white/15",
            "bg-[#0D1720]/60 px-6 py-12",
            "text-center backdrop-blur-xl",
          ].join(" ")}
        >
          <span
            className={[
              "inline-flex h-16 w-16 items-center",
              "justify-center rounded-2xl",
              "border border-cyan-400/25",
              "bg-cyan-400/10 text-cyan-300",
              "shadow-[0_0_30px_rgba(34,211,238,0.1)]",
            ].join(" ")}
          >
            <FiSearch
              aria-hidden="true"
              className="h-7 w-7"
            />
          </span>

          <h3 className="mt-5 text-xl font-black text-white">
            No encontramos productos
          </h3>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/55">
            No existen productos que coincidan con los filtros
            seleccionados. Prueba con otra categoría, precio o
            término de búsqueda.
          </p>

          <button
            type="button"
            onClick={onClearFilters}
            className={[
              "mt-6 inline-flex min-h-11 items-center",
              "justify-center rounded-xl",
              "bg-[#62C945] px-5",
              "text-sm font-extrabold text-[#071018]",
              "shadow-[0_0_24px_rgba(98,201,69,0.22)]",
              "transition-all duration-300",
              "hover:-translate-y-0.5",
              "hover:bg-[#72D653]",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-[#72D653]",
              "focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[#071018]",
            ].join(" ")}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}