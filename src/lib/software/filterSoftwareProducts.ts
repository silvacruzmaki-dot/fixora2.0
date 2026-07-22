import type {
  SoftwareFilters,
  SoftwareProduct,
  SoftwareSortOption,
} from "@/types/software";

/* =========================================================
   NORMALIZAR TEXTO PARA BÚSQUEDAS
   ========================================================= */

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* =========================================================
   COMPROBAR COINCIDENCIA CON EL BUSCADOR
   ========================================================= */

function matchesSearch(
  product: SoftwareProduct,
  search: string,
): boolean {
  const normalizedSearch = normalizeText(search);

  if (!normalizedSearch) {
    return true;
  }

  const searchableContent = [
    product.name,
    product.shortDescription,
    product.fullDescription,
    product.categoryId,
    product.licenseType,
    product.priceDetail,
    ...product.features,
    ...(product.requirements ?? []),
  ]
    .map(normalizeText)
    .join(" ");

  return searchableContent.includes(normalizedSearch);
}

/* =========================================================
   COMPROBAR CATEGORÍAS SELECCIONADAS
   ========================================================= */

function matchesCategories(
  product: SoftwareProduct,
  filters: SoftwareFilters,
): boolean {
  if (filters.categoryIds.length === 0) {
    return true;
  }

  return filters.categoryIds.includes(product.categoryId);
}

/* =========================================================
   COMPROBAR TIPOS DE LICENCIA
   ========================================================= */

function matchesLicenseTypes(
  product: SoftwareProduct,
  filters: SoftwareFilters,
): boolean {
  if (filters.licenseTypes.length === 0) {
    return true;
  }

  return filters.licenseTypes.includes(product.licenseType);
}

/* =========================================================
   COMPROBAR RANGO DE PRECIO
   ========================================================= */

function matchesPriceRange(
  product: SoftwareProduct,
  filters: SoftwareFilters,
): boolean {
  return (
    product.price >= filters.minPrice &&
    product.price <= filters.maxPrice
  );
}

/* =========================================================
   FILTRAR PRODUCTOS
   ========================================================= */

export function filterSoftwareProducts(
  products: SoftwareProduct[],
  filters: SoftwareFilters,
): SoftwareProduct[] {
  return products.filter((product) => {
    return (
      matchesSearch(product, filters.search) &&
      matchesCategories(product, filters) &&
      matchesLicenseTypes(product, filters) &&
      matchesPriceRange(product, filters)
    );
  });
}

/* =========================================================
   ORDENAR PRODUCTOS
   ========================================================= */

export function sortSoftwareProducts(
  products: SoftwareProduct[],
  sortOption: SoftwareSortOption,
): SoftwareProduct[] {
  const productsCopy = [...products];

  switch (sortOption) {
    case "price-ascending":
      return productsCopy.sort(
        (firstProduct, secondProduct) =>
          firstProduct.price - secondProduct.price,
      );

    case "price-descending":
      return productsCopy.sort(
        (firstProduct, secondProduct) =>
          secondProduct.price - firstProduct.price,
      );

    case "name-ascending":
      return productsCopy.sort((firstProduct, secondProduct) =>
        firstProduct.name.localeCompare(secondProduct.name, "es", {
          sensitivity: "base",
        }),
      );

    case "recommended":
    default:
      return productsCopy.sort((firstProduct, secondProduct) => {
        /*
         * Primero aparecen los productos destacados.
         */
        if (firstProduct.featured !== secondProduct.featured) {
          return Number(secondProduct.featured) -
            Number(firstProduct.featured);
        }

        /*
         * Después aparecen los productos más vendidos.
         */
        const firstIsBestSeller =
          firstProduct.badge === "best-seller";
        const secondIsBestSeller =
          secondProduct.badge === "best-seller";

        if (firstIsBestSeller !== secondIsBestSeller) {
          return Number(secondIsBestSeller) -
            Number(firstIsBestSeller);
        }

        /*
         * Finalmente se ordenan por valoración.
         */
        return (
          (secondProduct.rating ?? 0) -
          (firstProduct.rating ?? 0)
        );
      });
  }
}

/* =========================================================
   FILTRAR Y ORDENAR EN UNA SOLA FUNCIÓN
   ========================================================= */

export function getVisibleSoftwareProducts(
  products: SoftwareProduct[],
  filters: SoftwareFilters,
  sortOption: SoftwareSortOption,
): SoftwareProduct[] {
  const filteredProducts = filterSoftwareProducts(
    products,
    filters,
  );

  return sortSoftwareProducts(
    filteredProducts,
    sortOption,
  );
}

/* =========================================================
   CONTAR PRODUCTOS POR CATEGORÍA
   ========================================================= */

export function countSoftwareProductsByCategory(
  products: SoftwareProduct[],
  categoryId: SoftwareProduct["categoryId"],
): number {
  return products.filter(
    (product) => product.categoryId === categoryId,
  ).length;
}

/* =========================================================
   CONTAR PRODUCTOS POR TIPO DE LICENCIA
   ========================================================= */

export function countSoftwareProductsByLicenseType(
  products: SoftwareProduct[],
  licenseType: SoftwareProduct["licenseType"],
): number {
  return products.filter(
    (product) => product.licenseType === licenseType,
  ).length;
}