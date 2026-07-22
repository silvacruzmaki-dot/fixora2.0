import {
  z,
} from "zod";

/* =========================================================
   VALORES PERMITIDOS
   ========================================================= */

export const creativePublicationTypeSchema =
  z.enum([
    "FREE",
    "PORTFOLIO",
    "PAID",
  ]);

export const creativeItemStatusSchema =
  z.enum([
    "DRAFT",
    "PUBLISHED",
    "HIDDEN",
    "ARCHIVED",
  ]);

export const creativeCurrencySchema =
  z.enum([
    "PEN",
    "USD",
  ]);

export const creativeDownloadPolicySchema =
  z.enum([
    "DISABLED",
    "PUBLIC",
    "AUTHENTICATED",
    "PURCHASED",
  ]);

export const creativeWatermarkModeSchema =
  z.enum([
    "NONE",
    "TEXT",
    "IMAGE",
  ]);

/* =========================================================
   VALIDACIONES BÁSICAS
   ========================================================= */

const CREATIVE_SLUG_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const creativeItemIdSchema =
  z
    .string()
    .trim()
    .uuid(
      "El identificador del diseño no es válido.",
    );

export const creativeCategoryIdSchema =
  z
    .string()
    .trim()
    .uuid(
      "El identificador de la categoría no es válido.",
    );

export const creativeItemSlugSchema =
  z
    .string()
    .trim()
    .min(
      3,
      "El identificador de la URL debe tener al menos 3 caracteres.",
    )
    .max(
      120,
      "El identificador de la URL no puede superar los 120 caracteres.",
    )
    .regex(
      CREATIVE_SLUG_PATTERN,
      "La URL solo puede contener letras minúsculas, números y guiones.",
    );

const creativeTitleEsSchema =
  z
    .string()
    .trim()
    .min(
      3,
      "El título en español debe tener al menos 3 caracteres.",
    )
    .max(
      140,
      "El título en español no puede superar los 140 caracteres.",
    );

const creativeTitleEnSchema =
  z
    .string()
    .trim()
    .max(
      140,
      "El título en inglés no puede superar los 140 caracteres.",
    );

const creativeShortDescriptionSchema =
  z
    .string()
    .trim()
    .max(
      280,
      "La descripción corta no puede superar los 280 caracteres.",
    );

const creativeDescriptionEsSchema =
  z
    .string()
    .trim()
    .min(
      10,
      "La descripción en español debe tener al menos 10 caracteres.",
    )
    .max(
      50_000,
      "La descripción en español es demasiado extensa.",
    );

const creativeDescriptionEnSchema =
  z
    .string()
    .trim()
    .max(
      50_000,
      "La descripción en inglés es demasiado extensa.",
    );

const creativeSoftwareNameSchema =
  z
    .string()
    .trim()
    .min(
      1,
      "El nombre de la herramienta no puede estar vacío.",
    )
    .max(
      80,
      "El nombre de la herramienta no puede superar los 80 caracteres.",
    );

const creativeTagSchema =
  z
    .string()
    .trim()
    .min(
      1,
      "La etiqueta no puede estar vacía.",
    )
    .max(
      60,
      "La etiqueta no puede superar los 60 caracteres.",
    );

const creativeSoftwareListSchema =
  z
    .array(
      creativeSoftwareNameSchema,
    )
    .max(
      30,
      "No se pueden registrar más de 30 herramientas.",
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
    );

const creativeTagListSchema =
  z
    .array(
      creativeTagSchema,
    )
    .max(
      40,
      "No se pueden registrar más de 40 etiquetas.",
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
    );

/* =========================================================
   PRECIO
   ========================================================= */

export const creativeItemPriceSchema =
  z.preprocess(
    (
      value,
    ) => {
      if (
        value ===
          "" ||
        value ===
          null ||
        value ===
          undefined
      ) {
        return null;
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
          return null;
        }

        return Number(
          normalizedValue,
        );
      }

      return value;
    },
    z
      .number({
        error:
          "El precio debe ser un número válido.",
      })
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
      .nullable(),
  );

/* =========================================================
   CAMPOS OPCIONALES
   ========================================================= */

const creativeOptionalWatermarkTextSchema =
  z.preprocess(
    (
      value,
    ) => {
      if (
        typeof value ===
        "string"
      ) {
        const normalizedValue =
          value.trim();

        return normalizedValue ||
          null;
      }

      return value;
    },
    z
      .string()
      .max(
        100,
        "El texto de la marca de agua no puede superar los 100 caracteres.",
      )
      .nullable()
      .optional(),
  );

const creativeOptionalMediaIdSchema =
  z.preprocess(
    (
      value,
    ) => {
      if (
        value ===
        ""
      ) {
        return null;
      }

      return value;
    },
    z
      .string()
      .uuid(
        "El identificador de la marca de agua no es válido.",
      )
      .nullable()
      .optional(),
  );

/* =========================================================
   FORMA BASE DE CREACIÓN
   ========================================================= */

const creativeItemCreateBaseSchema =
  z.object({
    categoryId:
      creativeCategoryIdSchema,

    slug:
      creativeItemSlugSchema,

    titleEs:
      creativeTitleEsSchema,

    titleEn:
      creativeTitleEnSchema
        .default(
          "",
        ),

    shortDescriptionEs:
      creativeShortDescriptionSchema
        .optional(),

    shortDescriptionEn:
      creativeShortDescriptionSchema
        .optional(),

    descriptionEs:
      creativeDescriptionEsSchema,

    descriptionEn:
      creativeDescriptionEnSchema
        .default(
          "",
        ),

    publicationType:
      creativePublicationTypeSchema
        .optional(),

    /*
     * Alias utilizado por los componentes visuales.
     */
    contentType:
      creativePublicationTypeSchema
        .optional(),

    status:
      creativeItemStatusSchema
        .default(
          "DRAFT",
        ),

    price:
      creativeItemPriceSchema,

    currency:
      creativeCurrencySchema
        .default(
          "PEN",
        ),

    softwareUsed:
      creativeSoftwareListSchema
        .optional(),

    /*
     * Alias utilizado por CreativeAdminForm.
     */
    tools:
      creativeSoftwareListSchema
        .optional(),

    tags:
      creativeTagListSchema
        .default(
          [],
        ),

    featured:
      z
        .boolean()
        .default(
          false,
        ),

    allowComments:
      z
        .boolean()
        .default(
          true,
        ),

    downloadPolicy:
      creativeDownloadPolicySchema
        .optional(),

    watermarkEnabled:
      z
        .boolean()
        .default(
          false,
        ),

    watermarkMode:
      creativeWatermarkModeSchema
        .default(
          "NONE",
        ),

    watermarkText:
      creativeOptionalWatermarkTextSchema,

    watermarkMediaId:
      creativeOptionalMediaIdSchema,
  });

/* =========================================================
   CREAR PUBLICACIÓN
   ========================================================= */

export const creativeItemCreateSchema =
  creativeItemCreateBaseSchema
    .transform(
      (
        values,
      ) => {
        const {
          contentType,
          tools,
          ...remainingValues
        } =
          values;

        const publicationType =
          values.publicationType ??
          contentType ??
          "PORTFOLIO";

        const softwareUsed =
          values.softwareUsed ??
          tools ??
          [];

        const shortDescriptionEs =
          values.shortDescriptionEs
            ?.trim() ||
          values.descriptionEs
            .trim()
            .slice(
              0,
              280,
            );

        const shortDescriptionEn =
          values.shortDescriptionEn
            ?.trim() ||
          values.descriptionEn
            .trim()
            .slice(
              0,
              280,
            );

        const downloadPolicy =
          publicationType ===
          "FREE"
            ? "PUBLIC"
            : publicationType ===
                "PAID"
              ? "PURCHASED"
              : "DISABLED";

        const price =
          publicationType ===
          "PAID"
            ? values.price
            : null;

        const watermarkEnabled =
          publicationType !==
            "FREE" &&
          values.watermarkEnabled;

        const watermarkMode =
          watermarkEnabled
            ? values.watermarkMode
            : "NONE";

        const watermarkText =
          watermarkEnabled &&
          watermarkMode ===
            "TEXT"
            ? values.watermarkText ??
              null
            : null;

        const watermarkMediaId =
          watermarkEnabled &&
          watermarkMode ===
            "IMAGE"
            ? values.watermarkMediaId ??
              null
            : null;

        return {
          ...remainingValues,

          publicationType,

          shortDescriptionEs,

          shortDescriptionEn,

          price,

          softwareUsed,

          downloadPolicy,

          watermarkEnabled,

          watermarkMode,

          watermarkText,

          watermarkMediaId,
        };
      },
    )
    .superRefine(
      (
        values,
        context,
      ) => {
        if (
          values.publicationType ===
            "PAID" &&
          (
            values.price ===
              null ||
            values.price <=
              0
          )
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "price",
            ],

            message:
              "Las publicaciones premium deben tener un precio mayor que cero.",
          });
        }

        if (
          values.watermarkEnabled &&
          values.watermarkMode ===
            "NONE"
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "watermarkMode",
            ],

            message:
              "Selecciona una modalidad de marca de agua.",
          });
        }

        if (
          values.watermarkEnabled &&
          values.watermarkMode ===
            "TEXT" &&
          !values.watermarkText
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "watermarkText",
            ],

            message:
              "Escribe el texto de la marca de agua.",
          });
        }
      },
    );

/* =========================================================
   FORMA BASE DE ACTUALIZACIÓN
   ========================================================= */

const creativeItemUpdateBaseSchema =
  z.object({
    categoryId:
      creativeCategoryIdSchema
        .optional(),

    slug:
      creativeItemSlugSchema
        .optional(),

    titleEs:
      creativeTitleEsSchema
        .optional(),

    titleEn:
      creativeTitleEnSchema
        .optional(),

    shortDescriptionEs:
      creativeShortDescriptionSchema
        .optional(),

    shortDescriptionEn:
      creativeShortDescriptionSchema
        .optional(),

    descriptionEs:
      creativeDescriptionEsSchema
        .optional(),

    descriptionEn:
      creativeDescriptionEnSchema
        .optional(),

    publicationType:
      creativePublicationTypeSchema
        .optional(),

    contentType:
      creativePublicationTypeSchema
        .optional(),

    status:
      creativeItemStatusSchema
        .optional(),

    price:
      creativeItemPriceSchema
        .optional(),

    currency:
      creativeCurrencySchema
        .optional(),

    softwareUsed:
      creativeSoftwareListSchema
        .optional(),

    tools:
      creativeSoftwareListSchema
        .optional(),

    tags:
      creativeTagListSchema
        .optional(),

    featured:
      z
        .boolean()
        .optional(),

    allowComments:
      z
        .boolean()
        .optional(),

    downloadPolicy:
      creativeDownloadPolicySchema
        .optional(),

    watermarkEnabled:
      z
        .boolean()
        .optional(),

    watermarkMode:
      creativeWatermarkModeSchema
        .optional(),

    watermarkText:
      creativeOptionalWatermarkTextSchema,

    watermarkMediaId:
      creativeOptionalMediaIdSchema,
  });

/* =========================================================
   ACTUALIZAR PUBLICACIÓN
   ========================================================= */

export const creativeItemUpdateSchema =
  creativeItemUpdateBaseSchema
    .transform(
      (
        values,
      ) => {
        const {
          contentType,
          tools,
          ...remainingValues
        } =
          values;

        const publicationType =
          values.publicationType ??
          contentType;

        const softwareUsed =
          values.softwareUsed ??
          tools;

        const normalizedValues = {
          ...remainingValues,

          ...(publicationType
            ? {
                publicationType,
              }
            : {}),

          ...(softwareUsed
            ? {
                softwareUsed,
              }
            : {}),
        };

        if (
          publicationType ===
          "FREE"
        ) {
          return {
            ...normalizedValues,

            publicationType,

            price:
              null,

            downloadPolicy:
              "PUBLIC" as const,

            watermarkEnabled:
              false,

            watermarkMode:
              "NONE" as const,

            watermarkText:
              null,

            watermarkMediaId:
              null,
          };
        }

        if (
          publicationType ===
          "PAID"
        ) {
          return {
            ...normalizedValues,

            publicationType,

            downloadPolicy:
              "PURCHASED" as const,
          };
        }

        if (
          publicationType ===
          "PORTFOLIO"
        ) {
          return {
            ...normalizedValues,

            publicationType,

            price:
              null,

            downloadPolicy:
              "DISABLED" as const,
          };
        }

        if (
          values.watermarkEnabled ===
          false
        ) {
          return {
            ...normalizedValues,

            watermarkEnabled:
              false,

            watermarkMode:
              "NONE" as const,

            watermarkText:
              null,

            watermarkMediaId:
              null,
          };
        }

        return normalizedValues;
      },
    )
    .superRefine(
      (
        values,
        context,
      ) => {
        if (
          values.publicationType ===
            "PAID" &&
          values.price !==
            undefined &&
          (
            values.price ===
              null ||
            values.price <=
              0
          )
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "price",
            ],

            message:
              "Las publicaciones premium deben tener un precio mayor que cero.",
          });
        }

        if (
          values.watermarkEnabled ===
            true &&
          values.watermarkMode ===
            "NONE"
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "watermarkMode",
            ],

            message:
              "Selecciona una modalidad de marca de agua.",
          });
        }

        if (
          values.watermarkEnabled ===
            true &&
          values.watermarkMode ===
            "TEXT" &&
          !values.watermarkText
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "watermarkText",
            ],

            message:
              "Escribe el texto de la marca de agua.",
          });
        }
      },
    )
    .refine(
      (
        values,
      ) =>
        Object.keys(
          values,
        ).length >
        0,
      {
        message:
          "Debes enviar al menos un campo para actualizar.",
      },
    );

/* =========================================================
   PARÁMETROS DE RUTA
   ========================================================= */

export const creativeItemIdParamsSchema =
  z.object({
    itemId:
      creativeItemIdSchema,
  });

export const creativeItemSlugParamsSchema =
  z.object({
    slug:
      creativeItemSlugSchema,
  });

/* =========================================================
   ALIAS COMPATIBLES
   ========================================================= */

export const createCreativeItemSchema =
  creativeItemCreateSchema;

export const updateCreativeItemSchema =
  creativeItemUpdateSchema;

/* =========================================================
   TIPOS INFERIDOS
   ========================================================= */

export type CreativePublicationTypeInput =
  z.infer<
    typeof creativePublicationTypeSchema
  >;

export type CreativeItemStatusInput =
  z.infer<
    typeof creativeItemStatusSchema
  >;

export type CreativeCurrencyInput =
  z.infer<
    typeof creativeCurrencySchema
  >;

export type CreativeDownloadPolicyInput =
  z.infer<
    typeof creativeDownloadPolicySchema
  >;

export type CreativeWatermarkModeInput =
  z.infer<
    typeof creativeWatermarkModeSchema
  >;

export type CreativeItemCreateInput =
  z.input<
    typeof creativeItemCreateSchema
  >;

export type CreativeItemCreateData =
  z.output<
    typeof creativeItemCreateSchema
  >;

export type CreativeItemUpdateInput =
  z.input<
    typeof creativeItemUpdateSchema
  >;

export type CreativeItemUpdateData =
  z.output<
    typeof creativeItemUpdateSchema
  >;

export type CreativeItemIdParams =
  z.infer<
    typeof creativeItemIdParamsSchema
  >;

export type CreativeItemSlugParams =
  z.infer<
    typeof creativeItemSlugParamsSchema
  >;