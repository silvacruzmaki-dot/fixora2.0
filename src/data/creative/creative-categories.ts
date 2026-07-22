/*
 * Catálogo oficial de categorías del módulo Diseño / Creative.
 *
 * Este archivo contiene:
 * - Definiciones completas de las categorías.
 * - Orden oficial para mostrarlas.
 * - Claves de iconos.
 * - Búsqueda y validación de categorías.
 * - Conversión de categorías al idioma actual.
 * - Agrupación recomendada para catálogo y administración.
 *
 * No contiene:
 * - Componentes React.
 * - Iconos importados.
 * - Acceso a Prisma.
 * - Llamadas HTTP.
 * - Lógica de permisos.
 */

import {
  CREATIVE_CATEGORY_IDS,
} from "@/constants/creative/creative.constants";

import {
  CREATIVE_CATEGORY_COPY,
} from "@/constants/creative/creative.copy";

import type {
  CreativeCopyLanguage,
} from "@/constants/creative/creative.copy";

import type {
  CreativeCategoryDefinition,
  CreativeCategoryId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   CLAVES DE ICONOS
   ========================================================= */

/*
 * Las claves no importan directamente una librería de iconos.
 *
 * Más adelante, el componente visual decidirá qué icono
 * corresponde a cada clave mediante React Icons.
 */
export type CreativeCategoryIconKey =
  | "brand"
  | "flyer"
  | "illustration"
  | "photo-editing"
  | "social-media"
  | "branding"
  | "poster"
  | "business-card"
  | "brochure"
  | "banner"
  | "photography"
  | "other";

/* =========================================================
   ICONO POR CATEGORÍA
   ========================================================= */

export const CREATIVE_CATEGORY_ICON_KEYS = {
  logo:
    "brand",

  flyer:
    "flyer",

  illustration:
    "illustration",

  "photo-editing":
    "photo-editing",

  "social-media":
    "social-media",

  branding:
    "branding",

  poster:
    "poster",

  "business-card":
    "business-card",

  brochure:
    "brochure",

  banner:
    "banner",

  photography:
    "photography",

  other:
    "other",
} as const satisfies Record<
  CreativeCategoryId,
  CreativeCategoryIconKey
>;

/* =========================================================
   CATEGORÍAS HABILITADAS
   ========================================================= */

/*
 * Todas las categorías se crean habilitadas inicialmente.
 *
 * En una etapa posterior, el administrador podrá tener
 * configuración dinámica almacenada en la base de datos.
 */
export const CREATIVE_CATEGORY_ENABLED_STATE = {
  logo:
    true,

  flyer:
    true,

  illustration:
    true,

  "photo-editing":
    true,

  "social-media":
    true,

  branding:
    true,

  poster:
    true,

  "business-card":
    true,

  brochure:
    true,

  banner:
    true,

  photography:
    true,

  other:
    true,
} as const satisfies Record<
  CreativeCategoryId,
  boolean
>;

/* =========================================================
   ORDEN OFICIAL
   ========================================================= */

export const CREATIVE_CATEGORY_ORDER = {
  logo:
    1,

  flyer:
    2,

  illustration:
    3,

  "photo-editing":
    4,

  "social-media":
    5,

  branding:
    6,

  poster:
    7,

  "business-card":
    8,

  brochure:
    9,

  banner:
    10,

  photography:
    11,

  other:
    12,
} as const satisfies Record<
  CreativeCategoryId,
  number
>;

/* =========================================================
   DEFINICIONES COMPLETAS
   ========================================================= */

export const CREATIVE_CATEGORIES:
  readonly CreativeCategoryDefinition[] =
    CREATIVE_CATEGORY_IDS
      .map(
        (
          categoryId,
        ): CreativeCategoryDefinition => ({
          id:
            categoryId,

          nameEs:
            CREATIVE_CATEGORY_COPY[
              categoryId
            ].name.es,

          nameEn:
            CREATIVE_CATEGORY_COPY[
              categoryId
            ].name.en,

          descriptionEs:
            CREATIVE_CATEGORY_COPY[
              categoryId
            ].description.es,

          descriptionEn:
            CREATIVE_CATEGORY_COPY[
              categoryId
            ].description.en,

          iconKey:
            CREATIVE_CATEGORY_ICON_KEYS[
              categoryId
            ],

          enabled:
            CREATIVE_CATEGORY_ENABLED_STATE[
              categoryId
            ],

          order:
            CREATIVE_CATEGORY_ORDER[
              categoryId
            ],
        }),
      )
      .sort(
        (
          firstCategory,
          secondCategory,
        ) =>
          firstCategory.order -
          secondCategory.order,
      );

/* =========================================================
   MAPA POR IDENTIFICADOR
   ========================================================= */

export const CREATIVE_CATEGORY_BY_ID:
  Readonly<
    Record<
      CreativeCategoryId,
      CreativeCategoryDefinition
    >
  > =
    CREATIVE_CATEGORIES.reduce(
      (
        accumulator,
        category,
      ) => {
        accumulator[
          category.id
        ] =
          category;

        return accumulator;
      },
      {} as Record<
        CreativeCategoryId,
        CreativeCategoryDefinition
      >,
    );

/* =========================================================
   CATEGORÍAS DESTACADAS
   ========================================================= */

/*
 * Se utilizarán para:
 * - Accesos rápidos del hero.
 * - Filtros sugeridos.
 * - Tarjetas promocionales.
 */
export const CREATIVE_FEATURED_CATEGORY_IDS =
  [
    "logo",
    "flyer",
    "illustration",
    "photo-editing",
    "branding",
    "photography",
  ] as const satisfies readonly CreativeCategoryId[];

/* =========================================================
   CATEGORÍAS ORIENTADAS A NEGOCIOS
   ========================================================= */

export const CREATIVE_BUSINESS_CATEGORY_IDS =
  [
    "logo",
    "branding",
    "business-card",
    "brochure",
    "banner",
    "flyer",
    "social-media",
  ] as const satisfies readonly CreativeCategoryId[];

/* =========================================================
   CATEGORÍAS VISUALES Y ARTÍSTICAS
   ========================================================= */

export const CREATIVE_ARTISTIC_CATEGORY_IDS =
  [
    "illustration",
    "photo-editing",
    "photography",
    "poster",
  ] as const satisfies readonly CreativeCategoryId[];

/* =========================================================
   CATEGORÍAS PARA SOLICITUDES PERSONALIZADAS
   ========================================================= */

export const CREATIVE_CUSTOM_REQUEST_CATEGORY_IDS =
  [
    "logo",
    "flyer",
    "photo-editing",
    "social-media",
    "branding",
    "poster",
    "business-card",
    "brochure",
    "banner",
    "illustration",
    "other",
  ] as const satisfies readonly CreativeCategoryId[];

/* =========================================================
   CATEGORÍA RESUELTA PARA LA INTERFAZ
   ========================================================= */

export interface CreativeResolvedCategory {
  id:
    CreativeCategoryId;

  name:
    string;

  description:
    string;

  iconKey:
    CreativeCategoryIconKey;

  enabled:
    boolean;

  order:
    number;
}

/* =========================================================
   OBTENER UNA CATEGORÍA
   ========================================================= */

export function getCreativeCategoryById(
  categoryId:
    CreativeCategoryId,
): CreativeCategoryDefinition {
  return CREATIVE_CATEGORY_BY_ID[
    categoryId
  ];
}

/* =========================================================
   BUSCAR UNA CATEGORÍA SIN CONFIAR EN EL VALOR
   ========================================================= */

export function findCreativeCategoryById(
  categoryId:
    string | null | undefined,
): CreativeCategoryDefinition | null {
  if (
    !categoryId ||
    !isCreativeCategoryId(
      categoryId,
    )
  ) {
    return null;
  }

  return CREATIVE_CATEGORY_BY_ID[
    categoryId
  ];
}

/* =========================================================
   VALIDAR IDENTIFICADOR
   ========================================================= */

export function isCreativeCategoryId(
  value:
    unknown,
): value is CreativeCategoryId {
  return (
    typeof value ===
      "string" &&
    CREATIVE_CATEGORY_IDS.includes(
      value as CreativeCategoryId,
    )
  );
}

/* =========================================================
   CATEGORÍAS HABILITADAS
   ========================================================= */

export function getEnabledCreativeCategories():
  CreativeCategoryDefinition[] {
  return CREATIVE_CATEGORIES.filter(
    (
      category,
    ) =>
      category.enabled,
  );
}

/* =========================================================
   CATEGORÍAS DESTACADAS
   ========================================================= */

export function getFeaturedCreativeCategories():
  CreativeCategoryDefinition[] {
  return CREATIVE_FEATURED_CATEGORY_IDS
    .map(
      (
        categoryId,
      ) =>
        CREATIVE_CATEGORY_BY_ID[
          categoryId
        ],
    )
    .filter(
      (
        category,
      ) =>
        category.enabled,
    );
}

/* =========================================================
   CATEGORÍAS PARA EMPRESAS
   ========================================================= */

export function getBusinessCreativeCategories():
  CreativeCategoryDefinition[] {
  return CREATIVE_BUSINESS_CATEGORY_IDS
    .map(
      (
        categoryId,
      ) =>
        CREATIVE_CATEGORY_BY_ID[
          categoryId
        ],
    )
    .filter(
      (
        category,
      ) =>
        category.enabled,
    );
}

/* =========================================================
   CATEGORÍAS ARTÍSTICAS
   ========================================================= */

export function getArtisticCreativeCategories():
  CreativeCategoryDefinition[] {
  return CREATIVE_ARTISTIC_CATEGORY_IDS
    .map(
      (
        categoryId,
      ) =>
        CREATIVE_CATEGORY_BY_ID[
          categoryId
        ],
    )
    .filter(
      (
        category,
      ) =>
        category.enabled,
    );
}

/* =========================================================
   CATEGORÍAS PARA SOLICITUDES
   ========================================================= */

export function getCreativeCustomRequestCategories():
  CreativeCategoryDefinition[] {
  return CREATIVE_CUSTOM_REQUEST_CATEGORY_IDS
    .map(
      (
        categoryId,
      ) =>
        CREATIVE_CATEGORY_BY_ID[
          categoryId
        ],
    )
    .filter(
      (
        category,
      ) =>
        category.enabled,
    );
}

/* =========================================================
   RESOLVER UNA CATEGORÍA EN EL IDIOMA ACTUAL
   ========================================================= */

export function resolveCreativeCategory(
  category:
    CreativeCategoryDefinition,
  language:
    CreativeCopyLanguage,
): CreativeResolvedCategory {
  return {
    id:
      category.id,

    name:
      language ===
        "en"
        ? category.nameEn
        : category.nameEs,

    description:
      language ===
        "en"
        ? category.descriptionEn
        : category.descriptionEs,

    iconKey:
      category.iconKey as CreativeCategoryIconKey,

    enabled:
      category.enabled,

    order:
      category.order,
  };
}

/* =========================================================
   RESOLVER TODAS LAS CATEGORÍAS
   ========================================================= */

export function resolveCreativeCategories(
  language:
    CreativeCopyLanguage,
  options: {
    includeDisabled?:
      boolean;

    featuredOnly?:
      boolean;
  } = {},
): CreativeResolvedCategory[] {
  const {
    includeDisabled =
      false,

    featuredOnly =
      false,
  } =
    options;

  const sourceCategories =
    featuredOnly
      ? getFeaturedCreativeCategories()
      : CREATIVE_CATEGORIES;

  return sourceCategories
    .filter(
      (
        category,
      ) =>
        includeDisabled ||
        category.enabled,
    )
    .map(
      (
        category,
      ) =>
        resolveCreativeCategory(
          category,
          language,
        ),
    )
    .sort(
      (
        firstCategory,
        secondCategory,
      ) =>
        firstCategory.order -
        secondCategory.order,
    );
}

/* =========================================================
   BUSCAR CATEGORÍAS POR TEXTO
   ========================================================= */

export function searchCreativeCategories(
  search:
    string,
  language:
    CreativeCopyLanguage,
): CreativeResolvedCategory[] {
  const normalizedSearch =
    search
      .trim()
      .toLocaleLowerCase(
        language ===
          "en"
          ? "en-US"
          : "es-PE",
      );

  const categories =
    resolveCreativeCategories(
      language,
    );

  if (!normalizedSearch) {
    return categories;
  }

  return categories.filter(
    (
      category,
    ) => {
      const originalCopy =
        CREATIVE_CATEGORY_COPY[
          category.id
        ];

      const searchableText =
        [
          category.id,
          category.name,
          category.description,
          originalCopy.searchKeywords.es,
          originalCopy.searchKeywords.en,
        ]
          .join(
            " ",
          )
          .toLocaleLowerCase(
            language ===
              "en"
              ? "en-US"
              : "es-PE",
          );

      return searchableText.includes(
        normalizedSearch,
      );
    },
  );
}

/* =========================================================
   OBTENER NOMBRE LOCALIZADO
   ========================================================= */

export function getCreativeCategoryLocalizedName(
  categoryId:
    CreativeCategoryId,
  language:
    CreativeCopyLanguage,
): string {
  const category =
    CREATIVE_CATEGORY_BY_ID[
      categoryId
    ];

  return language ===
    "en"
    ? category.nameEn
    : category.nameEs;
}

/* =========================================================
   OBTENER DESCRIPCIÓN LOCALIZADA
   ========================================================= */

export function getCreativeCategoryLocalizedDescription(
  categoryId:
    CreativeCategoryId,
  language:
    CreativeCopyLanguage,
): string {
  const category =
    CREATIVE_CATEGORY_BY_ID[
      categoryId
    ];

  return language ===
    "en"
    ? category.descriptionEn
    : category.descriptionEs;
}

/* =========================================================
   COMPROBAR SI ES DESTACADA
   ========================================================= */

export function isFeaturedCreativeCategory(
  categoryId:
    CreativeCategoryId,
): boolean {
  return CREATIVE_FEATURED_CATEGORY_IDS.includes(
    categoryId as
      typeof CREATIVE_FEATURED_CATEGORY_IDS[number],
  );
}

/* =========================================================
   COMPROBAR SI ADMITE SOLICITUD PERSONALIZADA
   ========================================================= */

export function supportsCreativeCustomRequest(
  categoryId:
    CreativeCategoryId,
): boolean {
  return CREATIVE_CUSTOM_REQUEST_CATEGORY_IDS.includes(
    categoryId as
      typeof CREATIVE_CUSTOM_REQUEST_CATEGORY_IDS[number],
  );
}

/* =========================================================
   ESTADÍSTICAS ESTÁTICAS
   ========================================================= */

export const CREATIVE_CATEGORY_STATIC_STATISTICS = {
  total:
    CREATIVE_CATEGORIES.length,

  enabled:
    CREATIVE_CATEGORIES.filter(
      (
        category,
      ) =>
        category.enabled,
    ).length,

  featured:
    CREATIVE_FEATURED_CATEGORY_IDS.length,

  business:
    CREATIVE_BUSINESS_CATEGORY_IDS.length,

  artistic:
    CREATIVE_ARTISTIC_CATEGORY_IDS.length,

  customRequest:
    CREATIVE_CUSTOM_REQUEST_CATEGORY_IDS.length,
} as const;