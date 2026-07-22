import type { IconType } from "react-icons";

/* =========================================================
   IDENTIFICADORES DE CATEGORÍAS
   ========================================================= */

export type SoftwareCategoryId =
  | "productivity"
  | "security"
  | "design"
  | "management"
  | "education"
  | "development";

/* =========================================================
   TIPOS DE LICENCIA
   ========================================================= */

export type SoftwareLicenseType =
  | "subscription"
  | "permanent"
  | "academic"
  | "business";

/* =========================================================
   DISPONIBILIDAD DEL PRODUCTO
   ========================================================= */

export type SoftwareAvailability =
  | "in-stock"
  | "on-request";

/* =========================================================
   ETIQUETAS COMERCIALES
   ========================================================= */

export type SoftwareBadgeType =
  | "best-seller"
  | "offer"
  | "new"
  | "perpetual-license";

/* =========================================================
   COLORES VISUALES
   ========================================================= */

export type SoftwareAccent =
  | "green"
  | "cyan"
  | "blue"
  | "violet"
  | "lime"
  | "amber";

/* =========================================================
   OPCIONES DE ORDENAMIENTO
   ========================================================= */

export type SoftwareSortOption =
  | "recommended"
  | "price-ascending"
  | "price-descending"
  | "name-ascending";

/* =========================================================
   CATEGORÍA DE SOFTWARE
   ========================================================= */

export interface SoftwareCategory {
  id: SoftwareCategoryId;
  name: string;
  description: string;
  icon: IconType;
  accent: SoftwareAccent;
}

/* =========================================================
   BENEFICIO O GARANTÍA DE COMPRA
   ========================================================= */

export interface SoftwareBenefit {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  accent: SoftwareAccent;
}

/* =========================================================
   PRODUCTO DE SOFTWARE
   ========================================================= */

export interface SoftwareProduct {
  id: string;
  slug: string;

  name: string;
  shortDescription: string;
  fullDescription: string;

  categoryId: SoftwareCategoryId;
  licenseType: SoftwareLicenseType;
  availability: SoftwareAvailability;

  imageUrl: string;
  imageAlt: string;

  features: string[];
  requirements?: string[];

  price: number;
  previousPrice?: number;
  currency: "PEN";
  priceDetail: string;

  badge?: SoftwareBadgeType;
  discountPercentage?: number;

  rating?: number;
  reviewCount?: number;

  featured: boolean;
}

/* =========================================================
   FILTROS DEL CATÁLOGO
   ========================================================= */

export interface SoftwareFilters {
  search: string;
  categoryIds: SoftwareCategoryId[];
  licenseTypes: SoftwareLicenseType[];
  minPrice: number;
  maxPrice: number;
}

/* =========================================================
   ESTADO INICIAL DE LOS FILTROS
   ========================================================= */

export interface SoftwareFilterLimits {
  minimumPrice: number;
  maximumPrice: number;
}

/* =========================================================
   OPCIÓN DEL SELECTOR DE ORDENAMIENTO
   ========================================================= */

export interface SoftwareSortItem {
  value: SoftwareSortOption;
  label: string;
}

/* =========================================================
   CONFIGURACIÓN COMERCIAL
   ========================================================= */

export interface SoftwareStoreSettings {
  whatsappNumber: string;
  quotationMessage: string;
  customSoftwareMessage: string;
  initialVisibleProducts: number;
  productsPerLoad: number;
}

/* =========================================================
   PRODUCTO SELECCIONADO PARA EL MODAL
   ========================================================= */

export type SelectedSoftwareProduct =
  | SoftwareProduct
  | null;