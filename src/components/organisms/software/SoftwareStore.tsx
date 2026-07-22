"use client";

import { useCallback } from "react";

import { useSoftwareCatalog } from "@/hooks/software";

import {
  buildSoftwareProductQuotationWhatsAppUrl,
  buildSoftwarePurchaseWhatsAppUrl,
} from "@/lib/software";

import type { SoftwareProduct } from "@/types/software";

import SoftwareCatalogSection from "./SoftwareCatalogSection";
import SoftwareCategoriesSection from "./SoftwareCategoriesSection";
import SoftwareCustomSolutionBanner from "./SoftwareCustomSolutionBanner";
import SoftwareFeaturedSection from "./SoftwareFeaturedSection";
import SoftwareFiltersSidebar from "./SoftwareFiltersSidebar";
import SoftwareHero from "./SoftwareHero";
import SoftwareProductDetailsModal from "./SoftwareProductDetailsModal";
import SoftwareTrustBar from "./SoftwareTrustBar";

function openExternalUrl(url: string): void {
  const openedWindow = window.open(
    url,
    "_blank",
    "noopener,noreferrer",
  );

  if (!openedWindow) {
    window.location.assign(url);
  }
}

export default function SoftwareStore() {
  const {
    filters,
    sortOption,

    visibleProducts,
    totalFilteredProducts,
    hasMoreProducts,

    selectedProduct,
    isProductDetailsOpen,

    setSearch,
    toggleCategory,
    selectSingleCategory,
    toggleLicenseType,

    setMinimumPrice,
    setMaximumPrice,

    changeSortOption,
    showMoreProducts,
    clearFilters,

    openProductDetails,
    closeProductDetails,
  } = useSoftwareCatalog();

  const handleBuy = useCallback(
    (product: SoftwareProduct) => {
      const purchaseUrl =
        buildSoftwarePurchaseWhatsAppUrl(product);

      openExternalUrl(purchaseUrl);
    },
    [],
  );

  const handleRequestQuote = useCallback(
    (product: SoftwareProduct) => {
      const quotationUrl =
        buildSoftwareProductQuotationWhatsAppUrl(product);

      openExternalUrl(quotationUrl);
    },
    [],
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#071018] text-white">
      <SoftwareHero />

      <SoftwareTrustBar />

      <SoftwareCategoriesSection
        selectedCategoryIds={filters.categoryIds}
        onSelectCategory={selectSingleCategory}
      />

      <SoftwareFeaturedSection
        onViewDetails={openProductDetails}
        onBuy={handleBuy}
      />

      <section
        id="software-catalog"
        aria-label="Catálogo y filtros de software"
        className={[
          "relative scroll-mt-24 overflow-hidden",
          "border-b border-white/10",
          "bg-[#071018]",
          "px-5 py-16",
          "sm:px-8 sm:py-20",
          "lg:px-12",
        ].join(" ")}
      >
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0",
            "bg-[radial-gradient(circle_at_15%_20%,rgba(98,201,69,0.07),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(34,211,238,0.06),transparent_34%)]",
          ].join(" ")}
        />

        <div
          className={[
            "relative mx-auto grid w-full max-w-7xl",
            "grid-cols-1 items-start gap-7",
            "lg:grid-cols-[280px_minmax(0,1fr)]",
            "xl:grid-cols-[300px_minmax(0,1fr)]",
          ].join(" ")}
        >
          <SoftwareFiltersSidebar
            filters={filters}
            onSearchChange={setSearch}
            onToggleCategory={toggleCategory}
            onToggleLicenseType={toggleLicenseType}
            onSetMinimumPrice={setMinimumPrice}
            onSetMaximumPrice={setMaximumPrice}
            onClearFilters={clearFilters}
          />

          <SoftwareCatalogSection
            products={visibleProducts}
            totalProducts={totalFilteredProducts}
            sortOption={sortOption}
            hasMoreProducts={hasMoreProducts}
            onSortChange={changeSortOption}
            onShowMoreProducts={showMoreProducts}
            onViewDetails={openProductDetails}
            onBuy={handleBuy}
            onRequestQuote={handleRequestQuote}
            onClearFilters={clearFilters}
          />
        </div>
      </section>

      <SoftwareCustomSolutionBanner />

      <SoftwareProductDetailsModal
        product={selectedProduct}
        isOpen={isProductDetailsOpen}
        onClose={closeProductDetails}
        onBuy={handleBuy}
        onRequestQuote={handleRequestQuote}
      />
    </main>
  );
}