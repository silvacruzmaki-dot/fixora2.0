import {
  z,
} from "zod";

import {
  creativeCategoryIdSchema,
  creativeItemStatusSchema,
  creativePublicationTypeSchema,
} from "./creative-item.schema";

/* =========================================================
   ORDENAMIENTO
   ========================================================= */

export const creativeSortSchema =
  z.enum([
    "RELEVANCE",
    "NEWEST",
    "OLDEST",
    "TITLE_ASC",
    "TITLE_DESC",
    "VIEWS_DESC",
    "LIKES_DESC",
    "DOWNLOADS_DESC",
    "PRICE_ASC",
    "PRICE_DESC",
  ]);

/* =========================================================
   DIRECCIÓN
   ========================================================= */

export const creativeSortDirectionSchema =
  z.enum([
    "ASC",
    "DESC",
  ]);

/* =========================================================
   VISIBILIDAD ADMINISTRATIVA
   ========================================================= */

export const creativeManagementScopeSchema =
  z.enum([
    "ALL",
    "ACTIVE",
    "TRASH",
  ]);

/* =========================================================
   UTILIDADES DE NORMALIZACIÓN
   ========================================================= */

function normalizeOptionalText(
  value:
    unknown,
): unknown {
  if (
    value ===
      null ||
    value ===
      undefined
  ) {
    return undefined;
  }

  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  const normalizedValue =
    value
      .replace(
        /\s+/g,
        " ",
      )
      .trim();

  return normalizedValue ||
    undefined;
}

function normalizeOptionalInteger(
  value:
    unknown,
): unknown {
  if (
    value ===
      "" ||
    value ===
      null ||
    value ===
      undefined
  ) {
    return undefined;
  }

  if (
    typeof value ===
    "string"
  ) {
    const normalizedValue =
      value.trim();

    if (
      normalizedValue ===
      ""
    ) {
      return undefined;
    }

    return Number(
      normalizedValue,
    );
  }

  return value;
}

function normalizeOptionalNumber(
  value:
    unknown,
): unknown {
  if (
    value ===
      "" ||
    value ===
      null ||
    value ===
      undefined
  ) {
    return undefined;
  }

  if (
    typeof value ===
    "string"
  ) {
    const normalizedValue =
      value
        .trim()
        .replace(
          ",",
          ".",
        );

    if (
      normalizedValue ===
      ""
    ) {
      return undefined;
    }

    return Number(
      normalizedValue,
    );
  }

  return value;
}

function normalizeOptionalBoolean(
  value:
    unknown,
): unknown {
  if (
    value ===
      "" ||
    value ===
      null ||
    value ===
      undefined
  ) {
    return undefined;
  }

  if (
    typeof value ===
    "boolean"
  ) {
    return value;
  }

  if (
    typeof value ===
    "number"
  ) {
    if (
      value ===
      1
    ) {
      return true;
    }

    if (
      value ===
      0
    ) {
      return false;
    }

    return value;
  }

  if (
    typeof value ===
    "string"
  ) {
    const normalizedValue =
      value
        .trim()
        .toLowerCase();

    if (
      [
        "true",
        "1",
        "yes",
        "si",
        "sí",
      ].includes(
        normalizedValue,
      )
    ) {
      return true;
    }

    if (
      [
        "false",
        "0",
        "no",
      ].includes(
        normalizedValue,
      )
    ) {
      return false;
    }
  }

  return value;
}

function normalizeOptionalStringList(
  value:
    unknown,
): unknown {
  if (
    value ===
      "" ||
    value ===
      null ||
    value ===
      undefined
  ) {
    return undefined;
  }

  if (
    Array.isArray(
      value,
    )
  ) {
    return value;
  }

  if (
    typeof value ===
    "string"
  ) {
    return value
      .split(
        ",",
      )
      .map(
        (
          item,
        ) =>
          item.trim(),
      )
      .filter(
        Boolean,
      );
  }

  return value;
}

/* =========================================================
   PAGINACIÓN
   ========================================================= */

export const creativePageSchema =
  z.preprocess(
    normalizeOptionalInteger,
    z
      .number()
      .int(
        "La página debe ser un número entero.",
      )
      .min(
        1,
        "La página debe ser mayor o igual a 1.",
      )
      .max(
        1_000_000,
        "La página supera el máximo permitido.",
      )
      .default(
        1,
      ),
  );

export const creativePageSizeSchema =
  z.preprocess(
    normalizeOptionalInteger,
    z
      .number()
      .int(
        "La cantidad por página debe ser un número entero.",
      )
      .min(
        1,
        "La cantidad por página debe ser mayor o igual a 1.",
      )
      .max(
        100,
        "No se pueden solicitar más de 100 registros por página.",
      )
      .default(
        12,
      ),
  );

export const creativePaginationQuerySchema =
  z.object({
    page:
      creativePageSchema,

    pageSize:
      creativePageSizeSchema,
  });

/* =========================================================
   BÚSQUEDA
   ========================================================= */

export const creativeSearchQuerySchema =
  z.preprocess(
    normalizeOptionalText,
    z
      .string()
      .min(
        1,
        "La búsqueda no puede estar vacía.",
      )
      .max(
        160,
        "La búsqueda no puede superar los 160 caracteres.",
      )
      .optional(),
  );

/* =========================================================
   IDENTIFICADORES OPCIONALES
   ========================================================= */

const creativeOptionalCategoryIdSchema =
  z.preprocess(
    normalizeOptionalText,
    creativeCategoryIdSchema
      .optional(),
  );

const creativeOptionalAuthorIdSchema =
  z.preprocess(
    normalizeOptionalText,
    z
      .string()
      .uuid(
        "El identificador del autor no es válido.",
      )
      .optional(),
  );

/* =========================================================
   SLUG DE CATEGORÍA
   ========================================================= */

export const creativeCategorySlugQuerySchema =
  z.preprocess(
    normalizeOptionalText,
    z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "El identificador de la categoría no es válido.",
      )
      .min(
        2,
        "El identificador de la categoría es demasiado corto.",
      )
      .max(
        100,
        "El identificador de la categoría es demasiado largo.",
      )
      .optional(),
  );

/* =========================================================
   HERRAMIENTAS Y ETIQUETAS
   ========================================================= */

const creativeQueryListItemSchema =
  z
    .string()
    .trim()
    .min(
      1,
      "El valor del filtro no puede estar vacío.",
    )
    .max(
      80,
      "El valor del filtro no puede superar los 80 caracteres.",
    );

export const creativeToolsQuerySchema =
  z.preprocess(
    normalizeOptionalStringList,
    z
      .array(
        creativeQueryListItemSchema,
      )
      .max(
        30,
        "No se pueden filtrar más de 30 herramientas.",
      )
      .transform(
        (
          values,
        ) =>
          Array.from(
            new Set(
              values,
            ),
          ),
      )
      .optional(),
  );

export const creativeTagsQuerySchema =
  z.preprocess(
    normalizeOptionalStringList,
    z
      .array(
        creativeQueryListItemSchema,
      )
      .max(
        40,
        "No se pueden filtrar más de 40 etiquetas.",
      )
      .transform(
        (
          values,
        ) =>
          Array.from(
            new Set(
              values,
            ),
          ),
      )
      .optional(),
  );

/* =========================================================
   BOOLEANOS
   ========================================================= */

const creativeOptionalBooleanSchema =
  z.preprocess(
    normalizeOptionalBoolean,
    z
      .boolean()
      .optional(),
  );

/* =========================================================
   PRECIOS
   ========================================================= */

const creativeOptionalPriceSchema =
  z.preprocess(
    normalizeOptionalNumber,
    z
      .number()
      .finite(
        "El precio debe ser un número válido.",
      )
      .min(
        0,
        "El precio no puede ser negativo.",
      )
      .max(
        9_999_999_999.99,
        "El precio supera el máximo permitido.",
      )
      .optional(),
  );

/* =========================================================
   FILTROS DE FECHA
   ========================================================= */

const creativeOptionalDateSchema =
  z.preprocess(
    normalizeOptionalText,
    z
      .string()
      .datetime({
        offset:
          true,

        message:
          "La fecha debe utilizar un formato ISO válido.",
      })
      .optional(),
  );

/* =========================================================
   FORMA BASE DEL CATÁLOGO
   ========================================================= */

const creativeCatalogQueryShape = {
  page:
    creativePageSchema,

  pageSize:
    creativePageSizeSchema,

  search:
    creativeSearchQuerySchema,

  /*
   * Alias compatible con interfaces visuales.
   */
  query:
    creativeSearchQuerySchema,

  publicationType:
    creativePublicationTypeSchema
      .optional(),

  /*
   * Alias utilizado por los componentes.
   */
  contentType:
    creativePublicationTypeSchema
      .optional(),

  categoryId:
    creativeOptionalCategoryIdSchema,

  categorySlug:
    creativeCategorySlugQuerySchema,

  authorId:
    creativeOptionalAuthorIdSchema,

  tools:
    creativeToolsQuerySchema,

  /*
   * Alias compatible con el modelo del servidor.
   */
  softwareUsed:
    creativeToolsQuerySchema,

  tags:
    creativeTagsQuerySchema,

  featured:
    creativeOptionalBooleanSchema,

  minPrice:
    creativeOptionalPriceSchema,

  maxPrice:
    creativeOptionalPriceSchema,

  createdAfter:
    creativeOptionalDateSchema,

  createdBefore:
    creativeOptionalDateSchema,

  publishedAfter:
    creativeOptionalDateSchema,

  publishedBefore:
    creativeOptionalDateSchema,

  sort:
    creativeSortSchema
      .default(
        "RELEVANCE",
      ),

  direction:
    creativeSortDirectionSchema
      .optional(),
};

/* =========================================================
   VALIDACIÓN DE RANGOS
   ========================================================= */

interface CreativePriceRangeValues {
  minPrice?:
    number;

  maxPrice?:
    number;
}

interface CreativeDateRangeValues {
  createdAfter?:
    string;

  createdBefore?:
    string;

  publishedAfter?:
    string;

  publishedBefore?:
    string;
}

function validateCreativePriceRange(
  values:
    CreativePriceRangeValues,
  context:
    z.RefinementCtx,
): void {
  if (
    values.minPrice !==
      undefined &&
    values.maxPrice !==
      undefined &&
    values.minPrice >
      values.maxPrice
  ) {
    context.addIssue({
      code:
        "custom",

      path: [
        "maxPrice",
      ],

      message:
        "El precio máximo debe ser mayor o igual al precio mínimo.",
    });
  }
}

function validateCreativeDateRange(
  values:
    CreativeDateRangeValues,
  context:
    z.RefinementCtx,
): void {
  if (
    values.createdAfter &&
    values.createdBefore &&
    new Date(
      values.createdAfter,
    ).getTime() >
      new Date(
        values.createdBefore,
      ).getTime()
  ) {
    context.addIssue({
      code:
        "custom",

      path: [
        "createdBefore",
      ],

      message:
        "La fecha final de creación debe ser posterior a la fecha inicial.",
    });
  }

  if (
    values.publishedAfter &&
    values.publishedBefore &&
    new Date(
      values.publishedAfter,
    ).getTime() >
      new Date(
        values.publishedBefore,
      ).getTime()
  ) {
    context.addIssue({
      code:
        "custom",

      path: [
        "publishedBefore",
      ],

      message:
        "La fecha final de publicación debe ser posterior a la fecha inicial.",
    });
  }
}

/* =========================================================
   CONSULTA PÚBLICA SIN TRANSFORMAR
   ========================================================= */

const creativeCatalogRawQuerySchema =
  z
    .object(
      creativeCatalogQueryShape,
    )
    .superRefine(
      (
        values,
        context,
      ) => {
        validateCreativePriceRange(
          values,
          context,
        );

        validateCreativeDateRange(
          values,
          context,
        );
      },
    );

/* =========================================================
   CONSULTA PÚBLICA NORMALIZADA
   ========================================================= */

export const creativeCatalogQuerySchema =
  creativeCatalogRawQuerySchema
    .transform(
      (
        values,
      ) => {
        const search =
          values.search ??
          values.query;

        const publicationType =
          values.publicationType ??
          values.contentType;

        const softwareUsed =
          values.softwareUsed ??
          values.tools;

        const defaultDirection =
          values.sort ===
            "TITLE_ASC" ||
          values.sort ===
            "PRICE_ASC"
            ? "ASC"
            : "DESC";

        return {
          page:
            values.page,

          pageSize:
            values.pageSize,

          search,

          query:
            search,

          publicationType,

          contentType:
            publicationType,

          categoryId:
            values.categoryId,

          categorySlug:
            values.categorySlug,

          authorId:
            values.authorId,

          softwareUsed,

          tools:
            softwareUsed,

          tags:
            values.tags,

          featured:
            values.featured,

          minPrice:
            values.minPrice,

          maxPrice:
            values.maxPrice,

          createdAfter:
            values.createdAfter,

          createdBefore:
            values.createdBefore,

          publishedAfter:
            values.publishedAfter,

          publishedBefore:
            values.publishedBefore,

          sort:
            values.sort,

          direction:
            values.direction ??
            defaultDirection,
        };
      },
    );

/* =========================================================
   CONSULTA ADMINISTRATIVA SIN TRANSFORMAR
   ========================================================= */

const creativeAdminRawQuerySchema =
  z
    .object({
      ...creativeCatalogQueryShape,

      status:
        creativeItemStatusSchema
          .optional(),

      statuses:
        z.preprocess(
          normalizeOptionalStringList,
          z
            .array(
              creativeItemStatusSchema,
            )
            .max(
              4,
              "La cantidad de estados solicitados no es válida.",
            )
            .transform(
              (
                values,
              ) =>
                Array.from(
                  new Set(
                    values,
                  ),
                ),
            )
            .optional(),
        ),

      scope:
        creativeManagementScopeSchema
          .default(
            "ALL",
          ),

      includeDrafts:
        creativeOptionalBooleanSchema,

      includeHidden:
        creativeOptionalBooleanSchema,

      includeArchived:
        creativeOptionalBooleanSchema,

      onlyReported:
        creativeOptionalBooleanSchema,

      onlyWithPendingOrders:
        creativeOptionalBooleanSchema,

      onlyWithPendingRequests:
        creativeOptionalBooleanSchema,

      onlyWithPendingComments:
        creativeOptionalBooleanSchema,
    })
    .superRefine(
      (
        values,
        context,
      ) => {
        validateCreativePriceRange(
          values,
          context,
        );

        validateCreativeDateRange(
          values,
          context,
        );
      },
    );

/* =========================================================
   CONSULTA ADMINISTRATIVA NORMALIZADA
   ========================================================= */

export const creativeAdminQuerySchema =
  creativeAdminRawQuerySchema
    .transform(
      (
        values,
      ) => {
        const search =
          values.search ??
          values.query;

        const publicationType =
          values.publicationType ??
          values.contentType;

        const softwareUsed =
          values.softwareUsed ??
          values.tools;

        const statuses =
          values.statuses ??
          (
            values.status
              ? [
                  values.status,
                ]
              : undefined
          );

        const defaultDirection =
          values.sort ===
            "TITLE_ASC" ||
          values.sort ===
            "PRICE_ASC"
            ? "ASC"
            : "DESC";

        return {
          page:
            values.page,

          pageSize:
            values.pageSize,

          search,

          query:
            search,

          publicationType,

          contentType:
            publicationType,

          categoryId:
            values.categoryId,

          categorySlug:
            values.categorySlug,

          authorId:
            values.authorId,

          softwareUsed,

          tools:
            softwareUsed,

          tags:
            values.tags,

          featured:
            values.featured,

          minPrice:
            values.minPrice,

          maxPrice:
            values.maxPrice,

          createdAfter:
            values.createdAfter,

          createdBefore:
            values.createdBefore,

          publishedAfter:
            values.publishedAfter,

          publishedBefore:
            values.publishedBefore,

          sort:
            values.sort,

          direction:
            values.direction ??
            defaultDirection,

          status:
            values.status,

          statuses,

          scope:
            values.scope,

          includeDrafts:
            values.includeDrafts ??
            false,

          includeHidden:
            values.includeHidden ??
            false,

          includeArchived:
            values.includeArchived ??
            false,

          onlyReported:
            values.onlyReported ??
            false,

          onlyWithPendingOrders:
            values.onlyWithPendingOrders ??
            false,

          onlyWithPendingRequests:
            values.onlyWithPendingRequests ??
            false,

          onlyWithPendingComments:
            values.onlyWithPendingComments ??
            false,
        };
      },
    );

/* =========================================================
   CONSULTA PARA ELEMENTOS DESTACADOS
   ========================================================= */

export const creativeFeaturedQuerySchema =
  z.object({
    limit:
      z.preprocess(
        normalizeOptionalInteger,
        z
          .number()
          .int(
            "El límite debe ser un número entero.",
          )
          .min(
            1,
            "El límite debe ser mayor o igual a 1.",
          )
          .max(
            30,
            "No se pueden solicitar más de 30 publicaciones destacadas.",
          )
          .default(
            6,
          ),
      ),

    publicationType:
      creativePublicationTypeSchema
        .optional(),

    categoryId:
      creativeOptionalCategoryIdSchema,
  });

/* =========================================================
   CONSULTA PARA NAVEGACIÓN DEL VISOR
   ========================================================= */

export const creativeViewerNavigationQuerySchema =
  z.object({
    categoryId:
      creativeOptionalCategoryIdSchema,

    publicationType:
      creativePublicationTypeSchema
        .optional(),

    featured:
      creativeOptionalBooleanSchema,

    search:
      creativeSearchQuerySchema,

    sort:
      creativeSortSchema
        .default(
          "NEWEST",
        ),
  });

/* =========================================================
   ALIAS COMPATIBLES
   ========================================================= */

export const creativeQuerySchema =
  creativeCatalogQuerySchema;

export const creativeManagementQuerySchema =
  creativeAdminQuerySchema;

export const getCreativeItemsQuerySchema =
  creativeCatalogQuerySchema;

export const getCreativeAdminItemsQuerySchema =
  creativeAdminQuerySchema;

/* =========================================================
   TIPOS INFERIDOS
   ========================================================= */

export type CreativeSortInput =
  z.infer<
    typeof creativeSortSchema
  >;

export type CreativeSortDirectionInput =
  z.infer<
    typeof creativeSortDirectionSchema
  >;

export type CreativeManagementScopeInput =
  z.infer<
    typeof creativeManagementScopeSchema
  >;

export type CreativePaginationQuery =
  z.infer<
    typeof creativePaginationQuerySchema
  >;

export type CreativeCatalogQueryInput =
  z.input<
    typeof creativeCatalogQuerySchema
  >;

export type CreativeCatalogQuery =
  z.output<
    typeof creativeCatalogQuerySchema
  >;

export type CreativeAdminQueryInput =
  z.input<
    typeof creativeAdminQuerySchema
  >;

export type CreativeAdminQuery =
  z.output<
    typeof creativeAdminQuerySchema
  >;

export type CreativeFeaturedQuery =
  z.infer<
    typeof creativeFeaturedQuerySchema
  >;

export type CreativeViewerNavigationQuery =
  z.infer<
    typeof creativeViewerNavigationQuerySchema
  >;