import {
  z,
} from "zod";

import {
  creativeItemIdSchema,
} from "./creative-item.schema";

/* =========================================================
   CONSTANTES
========================================================= */

export const CREATIVE_REQUEST_MESSAGE_MIN_LENGTH =
  10;

export const CREATIVE_REQUEST_MESSAGE_MAX_LENGTH =
  3_000;

export const CREATIVE_REQUEST_COMPANY_MAX_LENGTH =
  160;

export const CREATIVE_REQUEST_PHONE_MAX_LENGTH =
  30;

export const CREATIVE_REQUEST_ADMIN_NOTES_MAX_LENGTH =
  5_000;

export const CREATIVE_REQUEST_SEARCH_MAX_LENGTH =
  160;

export const CREATIVE_REQUEST_DEFAULT_PAGE_SIZE =
  20;

export const CREATIVE_REQUEST_MAX_PAGE_SIZE =
  100;

const CREATIVE_REQUEST_PHONE_PATTERN =
  /^[0-9+()\-\s]+$/;

/* =========================================================
   TIPOS DE SOLICITUD
========================================================= */

export const creativeRequestKindSchema =
  z.enum([
    "LOGO",
    "SIMILAR_DESIGN",
    "CUSTOM_DESIGN",
  ]);

/* =========================================================
   MEDIOS DE CONTACTO
========================================================= */

export const creativeRequestPreferredContactSchema =
  z.enum([
    "EMAIL",
    "PHONE",
    "WHATSAPP",
  ]);

/* =========================================================
   ESTADOS
========================================================= */

export const creativeRequestStatusSchema =
  z.enum([
    "PENDING",
    "IN_REVIEW",
    "CONTACTED",
    "ACCEPTED",
    "REJECTED",
    "COMPLETED",
    "CANCELLED",
  ]);

/* =========================================================
   ORDENAMIENTO
========================================================= */

export const creativeRequestSortSchema =
  z.enum([
    "NEWEST",
    "OLDEST",
  ]);

/* =========================================================
   ACCIONES ADMINISTRATIVAS
========================================================= */

export const creativeRequestAdminActionSchema =
  z.enum([
    "REVIEW",
    "CONTACT",
    "ACCEPT",
    "REJECT",
    "COMPLETE",
    "CANCEL",
    "RESET",
  ]);

/* =========================================================
   IDENTIFICADORES
========================================================= */

export const creativeRequestIdSchema =
  z
    .string()
    .trim()
    .uuid(
      "El identificador de la solicitud no es válido.",
    );

export const creativeRequestUserIdSchema =
  z
    .string()
    .trim()
    .uuid(
      "El identificador del usuario no es válido.",
    );

/* =========================================================
   NORMALIZACIÓN
========================================================= */

function normalizeNullableText(
  value:
    unknown,
): unknown {
  if (
    value ===
    undefined
  ) {
    return undefined;
  }

  if (
    value ===
    null
  ) {
    return null;
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
        /\r\n/g,
        "\n",
      )
      .trim();

  return normalizedValue ||
    null;
}

function normalizeOptionalQueryText(
  value:
    unknown,
): unknown {
  if (
    value ===
      undefined ||
    value ===
      null
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

function normalizeRequestInteger(
  value:
    unknown,
): unknown {
  if (
    value ===
      undefined ||
    value ===
      null ||
    value ===
      ""
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

/* =========================================================
   MENSAJE
========================================================= */

export const creativeRequestMessageSchema =
  z
    .string()
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
          CREATIVE_REQUEST_MESSAGE_MIN_LENGTH,
          `El mensaje debe tener al menos ${CREATIVE_REQUEST_MESSAGE_MIN_LENGTH} caracteres.`,
        )
        .max(
          CREATIVE_REQUEST_MESSAGE_MAX_LENGTH,
          `El mensaje no puede superar los ${CREATIVE_REQUEST_MESSAGE_MAX_LENGTH} caracteres.`,
        ),
    );

/* =========================================================
   EMPRESA
========================================================= */

export const creativeRequestCompanyNameSchema =
  z.preprocess(
    normalizeNullableText,
    z
      .string()
      .max(
        CREATIVE_REQUEST_COMPANY_MAX_LENGTH,
        `El nombre de la empresa no puede superar los ${CREATIVE_REQUEST_COMPANY_MAX_LENGTH} caracteres.`,
      )
      .nullable()
      .optional(),
  );

/* =========================================================
   TELÉFONO
========================================================= */

export const creativeRequestPhoneSchema =
  z.preprocess(
    normalizeNullableText,
    z
      .string()
      .max(
        CREATIVE_REQUEST_PHONE_MAX_LENGTH,
        `El número de teléfono no puede superar los ${CREATIVE_REQUEST_PHONE_MAX_LENGTH} caracteres.`,
      )
      .regex(
        CREATIVE_REQUEST_PHONE_PATTERN,
        "El número de teléfono contiene caracteres no permitidos.",
      )
      .nullable()
      .optional(),
  );

/* =========================================================
   NOTAS ADMINISTRATIVAS
========================================================= */

export const creativeRequestAdminNotesSchema =
  z.preprocess(
    normalizeNullableText,
    z
      .string()
      .max(
        CREATIVE_REQUEST_ADMIN_NOTES_MAX_LENGTH,
        `Las notas administrativas no pueden superar los ${CREATIVE_REQUEST_ADMIN_NOTES_MAX_LENGTH} caracteres.`,
      )
      .nullable()
      .optional(),
  );

/* =========================================================
   VALIDACIÓN DE CONTACTO
========================================================= */

interface CreativeRequestContactValidationValue {
  preferredContact:
    z.infer<
      typeof creativeRequestPreferredContactSchema
    >;

  phone?:
    | string
    | null;
}

function validateCreativeRequestContact(
  values:
    CreativeRequestContactValidationValue,
  context:
    z.RefinementCtx,
): void {
  const requiresPhone =
    values.preferredContact ===
      "PHONE" ||
    values.preferredContact ===
      "WHATSAPP";

  if (
    requiresPhone &&
    !values.phone
  ) {
    context.addIssue({
      code:
        "custom",

      path: [
        "phone",
      ],

      message:
        values.preferredContact ===
        "WHATSAPP"
          ? "Ingresa el número de WhatsApp."
          : "Ingresa el número de teléfono.",
    });
  }
}

/* =========================================================
   CREAR SOLICITUD
========================================================= */

export const creativeRequestCreateSchema =
  z
    .object({
      /*
       * Puede recibirse en el cuerpo o desde el parámetro
       * itemId de la ruta.
       */
      creativeItemId:
        creativeItemIdSchema
          .optional(),

      kind:
        creativeRequestKindSchema,

      message:
        creativeRequestMessageSchema,

      companyName:
        creativeRequestCompanyNameSchema,

      phone:
        creativeRequestPhoneSchema,

      preferredContact:
        creativeRequestPreferredContactSchema
          .default(
            "EMAIL",
          ),
    })
    .superRefine(
      validateCreativeRequestContact,
    );

/* =========================================================
   ACTUALIZAR SOLICITUD PROPIA
========================================================= */

export const creativeRequestUpdateSchema =
  z
    .object({
      kind:
        creativeRequestKindSchema,

      message:
        creativeRequestMessageSchema,

      companyName:
        creativeRequestCompanyNameSchema,

      phone:
        creativeRequestPhoneSchema,

      preferredContact:
        creativeRequestPreferredContactSchema,
    })
    .superRefine(
      validateCreativeRequestContact,
    );

/* =========================================================
   ACTUALIZAR DATOS DE CONTACTO
========================================================= */

export const creativeRequestContactUpdateSchema =
  z
    .object({
      companyName:
        creativeRequestCompanyNameSchema,

      phone:
        creativeRequestPhoneSchema,

      preferredContact:
        creativeRequestPreferredContactSchema,
    })
    .superRefine(
      validateCreativeRequestContact,
    );

/* =========================================================
   CANCELAR SOLICITUD PROPIA
========================================================= */

export const creativeRequestCancelSchema =
  z.object({
    confirmation:
      z
        .boolean()
        .default(
          true,
        ),
  });

/* =========================================================
   ACTUALIZAR NOTAS ADMINISTRATIVAS
========================================================= */

export const creativeRequestAdminNotesUpdateSchema =
  z.object({
    adminNotes:
      creativeRequestAdminNotesSchema,
  });

/* =========================================================
   ACTUALIZAR ESTADO
========================================================= */

export const creativeRequestStatusUpdateSchema =
  z.object({
    status:
      creativeRequestStatusSchema,

    adminNotes:
      creativeRequestAdminNotesSchema,
  });

/* =========================================================
   EJECUTAR ACCIÓN ADMINISTRATIVA
========================================================= */

export const creativeRequestAdminActionInputSchema =
  z.object({
    action:
      creativeRequestAdminActionSchema,

    adminNotes:
      creativeRequestAdminNotesSchema,
  });

/* =========================================================
   PARÁMETROS DE RUTA
========================================================= */

export const creativeRequestIdParamsSchema =
  z.object({
    requestId:
      creativeRequestIdSchema,
  });

export const creativeItemRequestParamsSchema =
  z.object({
    itemId:
      creativeItemIdSchema,
  });

/* =========================================================
   PAGINACIÓN
========================================================= */

export const creativeRequestPageSchema =
  z.preprocess(
    normalizeRequestInteger,
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

export const creativeRequestPageSizeSchema =
  z.preprocess(
    normalizeRequestInteger,
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
        CREATIVE_REQUEST_MAX_PAGE_SIZE,
        `No se pueden solicitar más de ${CREATIVE_REQUEST_MAX_PAGE_SIZE} solicitudes por página.`,
      )
      .default(
        CREATIVE_REQUEST_DEFAULT_PAGE_SIZE,
      ),
  );

/* =========================================================
   BÚSQUEDA
========================================================= */

export const creativeRequestSearchSchema =
  z.preprocess(
    normalizeOptionalQueryText,
    z
      .string()
      .max(
        CREATIVE_REQUEST_SEARCH_MAX_LENGTH,
        `La búsqueda no puede superar los ${CREATIVE_REQUEST_SEARCH_MAX_LENGTH} caracteres.`,
      )
      .optional(),
  );

/* =========================================================
   CONSULTA DE SOLICITUDES DEL USUARIO
========================================================= */

const creativeRequestQueryShape = {
  kind:
    creativeRequestKindSchema
      .optional(),

  status:
    creativeRequestStatusSchema
      .optional(),

  search:
    creativeRequestSearchSchema,

  sort:
    creativeRequestSortSchema
      .default(
        "NEWEST",
      ),

  page:
    creativeRequestPageSchema,

  pageSize:
    creativeRequestPageSizeSchema,
};

export const creativeUserRequestsQuerySchema =
  z.object({
    ...creativeRequestQueryShape,
  });

/* =========================================================
   CONSULTA ADMINISTRATIVA
========================================================= */

export const creativeAdminRequestsQuerySchema =
  z.object({
    ...creativeRequestQueryShape,

    creativeItemId:
      creativeItemIdSchema
        .optional(),

    userId:
      creativeRequestUserIdSchema
        .optional(),

    preferredContact:
      creativeRequestPreferredContactSchema
        .optional(),
  });

/* =========================================================
   ALIAS COMPATIBLES
========================================================= */

export const createCreativeRequestSchema =
  creativeRequestCreateSchema;

export const updateCreativeRequestSchema =
  creativeRequestUpdateSchema;

export const updateCreativeRequestContactSchema =
  creativeRequestContactUpdateSchema;

export const cancelCreativeRequestSchema =
  creativeRequestCancelSchema;

export const updateCreativeRequestAdminNotesSchema =
  creativeRequestAdminNotesUpdateSchema;

export const updateCreativeRequestStatusSchema =
  creativeRequestStatusUpdateSchema;

export const executeCreativeRequestAdminActionSchema =
  creativeRequestAdminActionInputSchema;

export const getCreativeRequestsQuerySchema =
  creativeUserRequestsQuerySchema;

export const getCreativeAdminRequestsQuerySchema =
  creativeAdminRequestsQuerySchema;

/* =========================================================
   TIPOS INFERIDOS
========================================================= */

export type CreativeRequestKindInput =
  z.infer<
    typeof creativeRequestKindSchema
  >;

export type CreativeRequestPreferredContactInput =
  z.infer<
    typeof creativeRequestPreferredContactSchema
  >;

export type CreativeRequestStatusInput =
  z.infer<
    typeof creativeRequestStatusSchema
  >;

export type CreativeRequestSortInput =
  z.infer<
    typeof creativeRequestSortSchema
  >;

export type CreativeRequestAdminActionInput =
  z.infer<
    typeof creativeRequestAdminActionSchema
  >;

export type CreativeRequestCreateInput =
  z.input<
    typeof creativeRequestCreateSchema
  >;

export type CreativeRequestCreateData =
  z.output<
    typeof creativeRequestCreateSchema
  >;

export type CreativeRequestUpdateInput =
  z.input<
    typeof creativeRequestUpdateSchema
  >;

export type CreativeRequestUpdateData =
  z.output<
    typeof creativeRequestUpdateSchema
  >;

export type CreativeRequestContactUpdateInput =
  z.input<
    typeof creativeRequestContactUpdateSchema
  >;

export type CreativeRequestContactUpdateData =
  z.output<
    typeof creativeRequestContactUpdateSchema
  >;

export type CreativeRequestCancelInput =
  z.input<
    typeof creativeRequestCancelSchema
  >;

export type CreativeRequestAdminNotesUpdateInput =
  z.input<
    typeof creativeRequestAdminNotesUpdateSchema
  >;

export type CreativeRequestStatusUpdateInput =
  z.input<
    typeof creativeRequestStatusUpdateSchema
  >;

export type CreativeRequestAdminActionData =
  z.output<
    typeof creativeRequestAdminActionInputSchema
  >;

export type CreativeUserRequestsQueryInput =
  z.input<
    typeof creativeUserRequestsQuerySchema
  >;

export type CreativeUserRequestsQuery =
  z.output<
    typeof creativeUserRequestsQuerySchema
  >;

export type CreativeAdminRequestsQueryInput =
  z.input<
    typeof creativeAdminRequestsQuerySchema
  >;

export type CreativeAdminRequestsQuery =
  z.output<
    typeof creativeAdminRequestsQuerySchema
  >;

export type CreativeRequestIdParams =
  z.infer<
    typeof creativeRequestIdParamsSchema
  >;

export type CreativeItemRequestParams =
  z.infer<
    typeof creativeItemRequestParamsSchema
  >;