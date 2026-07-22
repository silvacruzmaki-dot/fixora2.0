import {
  z,
} from "zod";

import {
  creativeItemIdSchema,
} from "./creative-item.schema";

/* =========================================================
   CONSTANTES
   ========================================================= */

export const CREATIVE_COMMENT_MIN_LENGTH =
  2;

export const CREATIVE_COMMENT_MAX_LENGTH =
  1_500;

export const CREATIVE_COMMENT_DEFAULT_PAGE_SIZE =
  20;

export const CREATIVE_COMMENT_MAX_PAGE_SIZE =
  100;

/* =========================================================
   ESTADOS
   ========================================================= */

export const creativeCommentStatusSchema =
  z.enum([
    "PUBLISHED",
    "HIDDEN",
    "DELETED",
  ]);

/* =========================================================
   ORDENAMIENTO
   ========================================================= */

export const creativeCommentSortSchema =
  z.enum([
    "NEWEST",
    "OLDEST",
    "MOST_LIKED",
  ]);

/* =========================================================
   ACCIONES ADMINISTRATIVAS
   ========================================================= */

export const creativeCommentModerationActionSchema =
  z.enum([
    "PUBLISH",
    "HIDE",
    "DELETE",
    "RESTORE",
  ]);

/* =========================================================
   IDENTIFICADORES
   ========================================================= */

export const creativeCommentIdSchema =
  z
    .string()
    .trim()
    .uuid(
      "El identificador del comentario no es válido.",
    );

const creativeOptionalCommentIdSchema =
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

      return value;
    },
    creativeCommentIdSchema
      .nullable(),
  );

/* =========================================================
   CONTENIDO
   ========================================================= */

export const creativeCommentContentSchema =
  z
    .string({
      error:
        "El comentario es obligatorio.",
    })
    .transform(
      (
        value,
      ) =>
        value
          .replace(
            /\r\n/g,
            "\n",
          )
          .trim(),
    )
    .pipe(
      z
        .string()
        .min(
          CREATIVE_COMMENT_MIN_LENGTH,
          `El comentario debe tener al menos ${CREATIVE_COMMENT_MIN_LENGTH} caracteres.`,
        )
        .max(
          CREATIVE_COMMENT_MAX_LENGTH,
          `El comentario no puede superar los ${CREATIVE_COMMENT_MAX_LENGTH} caracteres.`,
        ),
    );

/* =========================================================
   TEXTO OPCIONAL
   ========================================================= */

const creativeOptionalTextSchema =
  (
    maximumLength:
      number,
    maximumLengthMessage:
      string,
  ) =>
    z.preprocess(
      (
        value,
      ) => {
        if (
          typeof value !==
          "string"
        ) {
          return value;
        }

        const normalizedValue =
          value
            .replace(
              /\r\n/g,
              "\n",
            )
            .trim();

        return normalizedValue ||
          null;
      },
      z
        .string()
        .max(
          maximumLength,
          maximumLengthMessage,
        )
        .nullable()
        .optional(),
    );

/* =========================================================
   NÚMEROS DE CONSULTA
   ========================================================= */

function normalizeCreativeCommentInteger(
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

function normalizeCreativeCommentBoolean(
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
      normalizedValue ===
        "true" ||
      normalizedValue ===
        "1"
    ) {
      return true;
    }

    if (
      normalizedValue ===
        "false" ||
      normalizedValue ===
        "0"
    ) {
      return false;
    }
  }

  return value;
}

export const creativeCommentPageSchema =
  z.preprocess(
    normalizeCreativeCommentInteger,
    z
      .number()
      .int(
        "La página debe ser un número entero.",
      )
      .min(
        1,
        "La página debe ser mayor o igual a 1.",
      )
      .default(
        1,
      ),
  );

export const creativeCommentPageSizeSchema =
  z.preprocess(
    normalizeCreativeCommentInteger,
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
        CREATIVE_COMMENT_MAX_PAGE_SIZE,
        `No se pueden solicitar más de ${CREATIVE_COMMENT_MAX_PAGE_SIZE} comentarios por página.`,
      )
      .default(
        CREATIVE_COMMENT_DEFAULT_PAGE_SIZE,
      ),
  );

/* =========================================================
   CREAR COMENTARIO
   ========================================================= */

const creativeCommentCreateBaseSchema =
  z.object({
    creativeItemId:
      creativeItemIdSchema
        .optional(),

    content:
      creativeCommentContentSchema,

    parentId:
      creativeOptionalCommentIdSchema
        .optional(),

    /*
     * Alias utilizado por algunos componentes y solicitudes.
     */
    parentCommentId:
      creativeOptionalCommentIdSchema
        .optional(),
  });

export const creativeCommentCreateSchema =
  creativeCommentCreateBaseSchema
    .transform(
      (
        values,
      ) => {
        const parentId =
          values.parentId ??
          values.parentCommentId ??
          null;

        return {
          ...(values.creativeItemId
            ? {
                creativeItemId:
                  values.creativeItemId,
              }
            : {}),

          content:
            values.content,

          parentId,
        };
      },
    );

/* =========================================================
   ACTUALIZAR COMENTARIO
   ========================================================= */

export const creativeCommentUpdateSchema =
  z.object({
    content:
      creativeCommentContentSchema,
  });

/* =========================================================
   PARÁMETROS DE RUTA
   ========================================================= */

export const creativeCommentIdParamsSchema =
  z.object({
    commentId:
      creativeCommentIdSchema,
  });

export const creativeItemCommentsParamsSchema =
  z.object({
    itemId:
      creativeItemIdSchema,
  });

/* =========================================================
   CONSULTA PÚBLICA DE COMENTARIOS
   ========================================================= */

export const creativeCommentsQuerySchema =
  z.object({
    page:
      creativeCommentPageSchema,

    pageSize:
      creativeCommentPageSizeSchema,

    sort:
      creativeCommentSortSchema
        .default(
          "NEWEST",
        ),

    parentId:
      creativeOptionalCommentIdSchema
        .optional(),

    includeReplies:
      z.preprocess(
        normalizeCreativeCommentBoolean,
        z
          .boolean()
          .default(
            true,
          ),
      ),
  });

/* =========================================================
   CONSULTA ADMINISTRATIVA
   ========================================================= */

export const creativeAdminCommentsQuerySchema =
  z.object({
    page:
      creativeCommentPageSchema,

    pageSize:
      creativeCommentPageSizeSchema,

    sort:
      creativeCommentSortSchema
        .default(
          "NEWEST",
        ),

    status:
      creativeCommentStatusSchema
        .optional(),

    creativeItemId:
      creativeItemIdSchema
        .optional(),

    parentId:
      creativeOptionalCommentIdSchema
        .optional(),

    search:
      z.preprocess(
        (
          value,
        ) => {
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
        },
        z
          .string()
          .max(
            150,
            "La búsqueda no puede superar los 150 caracteres.",
          )
          .optional(),
      ),

    includeDeleted:
      z.preprocess(
        normalizeCreativeCommentBoolean,
        z
          .boolean()
          .default(
            false,
          ),
      ),
  });

/* =========================================================
   MODERACIÓN
   ========================================================= */

export const creativeCommentModerationSchema =
  z
    .object({
      action:
        creativeCommentModerationActionSchema,

      reason:
        creativeOptionalTextSchema(
          500,
          "El motivo de moderación no puede superar los 500 caracteres.",
        ),

      adminNotes:
        creativeOptionalTextSchema(
          1_500,
          "Las notas administrativas no pueden superar los 1500 caracteres.",
        ),
    })
    .superRefine(
      (
        values,
        context,
      ) => {
        if (
          (
            values.action ===
              "HIDE" ||
            values.action ===
              "DELETE"
          ) &&
          !values.reason
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "reason",
            ],

            message:
              "Indica el motivo de la moderación.",
          });
        }
      },
    );

/* =========================================================
   CAMBIAR ESTADO DIRECTAMENTE
   ========================================================= */

export const creativeCommentStatusUpdateSchema =
  z.object({
    status:
      creativeCommentStatusSchema,

    reason:
      creativeOptionalTextSchema(
        500,
        "El motivo no puede superar los 500 caracteres.",
      ),
  });

/* =========================================================
   ELIMINAR COMENTARIO PROPIO
   ========================================================= */

export const creativeCommentDeleteSchema =
  z.object({
    confirmation:
      z
        .boolean()
        .default(
          true,
        ),
  });

/* =========================================================
   ALIAS COMPATIBLES
   ========================================================= */

export const createCreativeCommentSchema =
  creativeCommentCreateSchema;

export const updateCreativeCommentSchema =
  creativeCommentUpdateSchema;

export const deleteCreativeCommentSchema =
  creativeCommentDeleteSchema;

export const moderateCreativeCommentSchema =
  creativeCommentModerationSchema;

export const getCreativeCommentsQuerySchema =
  creativeCommentsQuerySchema;

export const getCreativeAdminCommentsQuerySchema =
  creativeAdminCommentsQuerySchema;

/* =========================================================
   TIPOS INFERIDOS
   ========================================================= */

export type CreativeCommentStatusInput =
  z.infer<
    typeof creativeCommentStatusSchema
  >;

export type CreativeCommentSortInput =
  z.infer<
    typeof creativeCommentSortSchema
  >;

export type CreativeCommentModerationActionInput =
  z.infer<
    typeof creativeCommentModerationActionSchema
  >;

export type CreativeCommentCreateInput =
  z.input<
    typeof creativeCommentCreateSchema
  >;

export type CreativeCommentCreateData =
  z.output<
    typeof creativeCommentCreateSchema
  >;

export type CreativeCommentUpdateInput =
  z.infer<
    typeof creativeCommentUpdateSchema
  >;

export type CreativeCommentsQueryInput =
  z.input<
    typeof creativeCommentsQuerySchema
  >;

export type CreativeCommentsQuery =
  z.output<
    typeof creativeCommentsQuerySchema
  >;

export type CreativeAdminCommentsQueryInput =
  z.input<
    typeof creativeAdminCommentsQuerySchema
  >;

export type CreativeAdminCommentsQuery =
  z.output<
    typeof creativeAdminCommentsQuerySchema
  >;

export type CreativeCommentModerationInput =
  z.infer<
    typeof creativeCommentModerationSchema
  >;

export type CreativeCommentStatusUpdateInput =
  z.infer<
    typeof creativeCommentStatusUpdateSchema
  >;

export type CreativeCommentIdParams =
  z.infer<
    typeof creativeCommentIdParamsSchema
  >;

export type CreativeItemCommentsParams =
  z.infer<
    typeof creativeItemCommentsParamsSchema
  >;