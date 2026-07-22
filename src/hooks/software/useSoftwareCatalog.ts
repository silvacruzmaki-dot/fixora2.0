"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  softwarePriceLimits,
  softwareProducts,
  softwareStoreSettings,
} from "@/data/software";

import { getVisibleSoftwareProducts } from "@/lib/software";

import type {
  SelectedSoftwareProduct,
  SoftwareCategoryId,
  SoftwareFilters,
  SoftwareLicenseType,
  SoftwareProduct,
  SoftwareSortOption,
} from "@/types/software";

/* =========================================================
   CREAR FILTROS INICIALES
   ========================================================= */

function createInitialSoftwareFilters(): SoftwareFilters {
  return {
    search: "",
    categoryIds: [],
    licenseTypes: [],
    minPrice: softwarePriceLimits.minimumPrice,
    maxPrice: softwarePriceLimits.maximumPrice,
  };
}

/* =========================================================
   HOOK PRINCIPAL DEL CATÁLOGO
   ========================================================= */

export function useSoftwareCatalog() {
  const [filters, setFilters] = useState<SoftwareFilters>(
    createInitialSoftwareFilters,
  );

  const [sortOption, setSortOption] =
    useState<SoftwareSortOption>("recommended");

  const [visibleProductCount, setVisibleProductCount] =
    useState(
      softwareStoreSettings.initialVisibleProducts,
    );

  const [selectedProduct, setSelectedProduct] =
    useState<SelectedSoftwareProduct>(null);

  /* =======================================================
     REINICIAR CANTIDAD DE PRODUCTOS VISIBLES
     ======================================================= */

  const resetVisibleProducts = useCallback(() => {
    setVisibleProductCount(
      softwareStoreSettings.initialVisibleProducts,
    );
  }, []);

  /* =======================================================
     PRODUCTOS FILTRADOS Y ORDENADOS
     ======================================================= */

  const filteredProducts = useMemo(() => {
    return getVisibleSoftwareProducts(
      softwareProducts,
      filters,
      sortOption,
    );
  }, [filters, sortOption]);

  /* =======================================================
     PRODUCTOS MOSTRADOS EN PANTALLA
     ======================================================= */

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(
      0,
      visibleProductCount,
    );
  }, [filteredProducts, visibleProductCount]);

  const hasMoreProducts =
    visibleProductCount < filteredProducts.length;

  const totalFilteredProducts =
    filteredProducts.length;

  /* =======================================================
     BUSCADOR
     ======================================================= */

  const setSearch = useCallback(
    (search: string) => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        search,
      }));

      resetVisibleProducts();
    },
    [resetVisibleProducts],
  );

  /* =======================================================
     FILTRO POR CATEGORÍA
     ======================================================= */

  const toggleCategory = useCallback(
    (categoryId: SoftwareCategoryId) => {
      setFilters((currentFilters) => {
        const categoryIsSelected =
          currentFilters.categoryIds.includes(
            categoryId,
          );

        const categoryIds = categoryIsSelected
          ? currentFilters.categoryIds.filter(
              (currentCategoryId) =>
                currentCategoryId !== categoryId,
            )
          : [
              ...currentFilters.categoryIds,
              categoryId,
            ];

        return {
          ...currentFilters,
          categoryIds,
        };
      });

      resetVisibleProducts();
    },
    [resetVisibleProducts],
  );

  const selectSingleCategory = useCallback(
    (categoryId: SoftwareCategoryId) => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        categoryIds: [categoryId],
      }));

      resetVisibleProducts();
    },
    [resetVisibleProducts],
  );

  /* =======================================================
     FILTRO POR TIPO DE LICENCIA
     ======================================================= */

  const toggleLicenseType = useCallback(
    (licenseType: SoftwareLicenseType) => {
      setFilters((currentFilters) => {
        const licenseIsSelected =
          currentFilters.licenseTypes.includes(
            licenseType,
          );

        const licenseTypes = licenseIsSelected
          ? currentFilters.licenseTypes.filter(
              (currentLicenseType) =>
                currentLicenseType !== licenseType,
            )
          : [
              ...currentFilters.licenseTypes,
              licenseType,
            ];

        return {
          ...currentFilters,
          licenseTypes,
        };
      });

      resetVisibleProducts();
    },
    [resetVisibleProducts],
  );

  /* =======================================================
     FILTRO POR PRECIO MÍNIMO
     ======================================================= */

  const setMinimumPrice = useCallback(
    (price: number) => {
      setFilters((currentFilters) => {
        const normalizedPrice = Math.max(
          softwarePriceLimits.minimumPrice,
          Math.min(
            price,
            currentFilters.maxPrice,
          ),
        );

        return {
          ...currentFilters,
          minPrice: normalizedPrice,
        };
      });

      resetVisibleProducts();
    },
    [resetVisibleProducts],
  );

  /* =======================================================
     FILTRO POR PRECIO MÁXIMO
     ======================================================= */

  const setMaximumPrice = useCallback(
    (price: number) => {
      setFilters((currentFilters) => {
        const normalizedPrice = Math.min(
          softwarePriceLimits.maximumPrice,
          Math.max(
            price,
            currentFilters.minPrice,
          ),
        );

        return {
          ...currentFilters,
          maxPrice: normalizedPrice,
        };
      });

      resetVisibleProducts();
    },
    [resetVisibleProducts],
  );

  /* =======================================================
     CAMBIAR TODO EL RANGO DE PRECIO
     ======================================================= */

  const setPriceRange = useCallback(
    (
      minimumPrice: number,
      maximumPrice: number,
    ) => {
      const normalizedMinimum = Math.max(
        softwarePriceLimits.minimumPrice,
        minimumPrice,
      );

      const normalizedMaximum = Math.min(
        softwarePriceLimits.maximumPrice,
        maximumPrice,
      );

      setFilters((currentFilters) => ({
        ...currentFilters,
        minPrice: Math.min(
          normalizedMinimum,
          normalizedMaximum,
        ),
        maxPrice: Math.max(
          normalizedMinimum,
          normalizedMaximum,
        ),
      }));

      resetVisibleProducts();
    },
    [resetVisibleProducts],
  );

  /* =======================================================
     ORDENAMIENTO
     ======================================================= */

  const changeSortOption = useCallback(
    (option: SoftwareSortOption) => {
      setSortOption(option);
      resetVisibleProducts();
    },
    [resetVisibleProducts],
  );

  /* =======================================================
     VER MÁS PRODUCTOS
     ======================================================= */

  const showMoreProducts = useCallback(() => {
    setVisibleProductCount((currentCount) => {
      return (
        currentCount +
        softwareStoreSettings.productsPerLoad
      );
    });
  }, []);

  /* =======================================================
     LIMPIAR FILTROS
     ======================================================= */

  const clearFilters = useCallback(() => {
    setFilters(createInitialSoftwareFilters());
    setSortOption("recommended");

    setVisibleProductCount(
      softwareStoreSettings.initialVisibleProducts,
    );
  }, []);

  /* =======================================================
     MODAL DE DETALLES
     ======================================================= */

  const openProductDetails = useCallback(
    (product: SoftwareProduct) => {
      setSelectedProduct(product);
    },
    [],
  );

  const closeProductDetails = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const isProductDetailsOpen =
    selectedProduct !== null;

  /* =======================================================
     RETORNO DEL HOOK
     ======================================================= */

  return {
    filters,
    sortOption,

    filteredProducts,
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
    setPriceRange,

    changeSortOption,
    showMoreProducts,
    clearFilters,

    openProductDetails,
    closeProductDetails,
  };
}