import {
  z,
} from "zod";

import {
  creativeCurrencySchema,
  creativeItemIdSchema,
} from "./creative-item.schema";

/* =========================================================
   CONSTANTES
========================================================= */

export const CREATIVE_ORDER_DEFAULT_PAGE_SIZE =
  20;

export const CREATIVE_ORDER_MAX_PAGE_SIZE =
  100;

export const CREATIVE_ORDER_PAYMENT_PROVIDER_MAX_LENGTH =
  60;

export const CREATIVE_ORDER_PAYMENT_REFERENCE_MIN_LENGTH =
  3;

export const CREATIVE_ORDER_PAYMENT_REFERENCE_MAX_LENGTH =
  255;

export const CREATIVE_ORDER_PAYMENT_URL_MAX_LENGTH =
  2_048;

export const CREATIVE_ORDER_SEARCH_MAX_LENGTH =
  160;

export const CREATIVE_ORDER_MAX_AMOUNT =
  9_999_999_999.99;

const CREATIVE_PAYMENT_PROVIDER_PATTERN =
  /^[A-Z0-9_-]+$/;

/* =========================================================
   ESTADOS DE LA COMPRA
========================================================= */

export const creativeOrderStatusSchema =
  z.enum([
    "PENDING",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
    "REFUNDED",
  ]);

/*
 * Alias utilizado por las partes del módulo que denominan
 * la entidad como compra o purchase.
 */
export const creativePurchaseStatusSchema =
  creativeOrderStatusSchema;

/* =========================================================
   ORDENAMIENTO
========================================================= */

export const creativeOrderSortSchema =
  z.enum([
    "NEWEST",
    "OLDEST",
    "AMOUNT_ASC",
    "AMOUNT_DESC",
  ]);

/* =========================================================
   ACCIONES ADMINISTRATIVAS
========================================================= */

export const creativeOrderAdminActionSchema =
  z.enum([
    "APPROVE",
    "REJECT",
    "CANCEL",
    "REFUND",
    "RESET",
  ]);

/* =========================================================
   IDENTIFICADORES
========================================================= */

export const creativeOrderIdSchema =
  z
    .string()
    .trim()
    .uuid(
      "El identificador del pedido no es válido.",
    );

export const creativePurchaseIdSchema =
  creativeOrderIdSchema;

export const creativeOrderUserIdSchema =
  z
    .string()
    .trim()
    .uuid(
      "El identificador del usuario no es válido.",
    );

/* =========================================================
   NORMALIZACIÓN
========================================================= */

function normalizeCreativeOrderOptionalText(
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

function normalizeCreativeOrderNullableText(
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
        /\s+/g,
        " ",
      )
      .trim();

  return normalizedValue ||
    null;
}

function normalizeCreativeOrderInteger(
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

function normalizeCreativeOrderNumber(
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

function normalizeCreativePaymentProvider(
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
    typeof value !==
    "string"
  ) {
    return value;
  }

  const normalizedValue =
    value
      .replace(
        /\s+/g,
        "_",
      )
      .trim()
      .toUpperCase();

  return normalizedValue ||
    undefined;
}

/* =========================================================
   PROVEEDOR DE PAGO
========================================================= */

export const creativePaymentProviderSchema =
  z.preprocess(
    normalizeCreativePaymentProvider,
    z
      .string()
      .min(
        2,
        "El proveedor de pago debe tener al menos 2 caracteres.",
      )
      .max(
        CREATIVE_ORDER_PAYMENT_PROVIDER_MAX_LENGTH,
        `El proveedor de pago no puede superar los ${CREATIVE_ORDER_PAYMENT_PROVIDER_MAX_LENGTH} caracteres.`,
      )
      .regex(
        CREATIVE_PAYMENT_PROVIDER_PATTERN,
        "El proveedor de pago contiene caracteres no permitidos.",
      )
      .default(
        "YAPE",
      ),
  );

/* =========================================================
   REFERENCIA DE PAGO
========================================================= */

export const creativePaymentReferenceSchema =
  z
    .string()
    .transform(
      (
        value,
      ) =>
        value
          .replace(
            /\s+/g,
            " ",
          )
          .trim(),
    )
    .pipe(
      z
        .string()
        .min(
          CREATIVE_ORDER_PAYMENT_REFERENCE_MIN_LENGTH,
          `La referencia de pago debe tener al menos ${CREATIVE_ORDER_PAYMENT_REFERENCE_MIN_LENGTH} caracteres.`,
        )
        .max(
          CREATIVE_ORDER_PAYMENT_REFERENCE_MAX_LENGTH,
          `La referencia de pago no puede superar los ${CREATIVE_ORDER_PAYMENT_REFERENCE_MAX_LENGTH} caracteres.`,
        ),
    );

export const creativeOptionalPaymentReferenceSchema =
  z.preprocess(
    normalizeCreativeOrderNullableText,
    z
      .string()
      .min(
        CREATIVE_ORDER_PAYMENT_REFERENCE_MIN_LENGTH,
        `La referencia de pago debe tener al menos ${CREATIVE_ORDER_PAYMENT_REFERENCE_MIN_LENGTH} caracteres.`,
      )
      .max(
        CREATIVE_ORDER_PAYMENT_REFERENCE_MAX_LENGTH,
        `La referencia de pago no puede superar los ${CREATIVE_ORDER_PAYMENT_REFERENCE_MAX_LENGTH} caracteres.`,
      )
      .nullable()
      .optional(),
  );

/* =========================================================
   URL DEL COMPROBANTE
========================================================= */

export const creativePaymentUrlSchema =
  z.preprocess(
    normalizeCreativeOrderNullableText,
    z
      .string()
      .url(
        "La URL del comprobante de pago no es válida.",
      )
      .max(
        CREATIVE_ORDER_PAYMENT_URL_MAX_LENGTH,
        `La URL del comprobante no puede superar los ${CREATIVE_ORDER_PAYMENT_URL_MAX_LENGTH} caracteres.`,
      )
      .nullable()
      .optional(),
  );

/* =========================================================
   MONTO
========================================================= */

export const creativeOrderAmountSchema =
  z.preprocess(
    normalizeCreativeOrderNumber,
    z
      .number({
        error:
          "El monto debe ser un número válido.",
      })
      .finite(
        "El monto debe ser un número válido.",
      )
      .min(
        0.01,
        "El monto debe ser mayor que cero.",
      )
      .max(
        CREATIVE_ORDER_MAX_AMOUNT,
        "El monto supera el máximo permitido.",
      ),
  );

/* =========================================================
   CREAR PEDIDO
========================================================= */

/*
 * El monto y la moneda no se reciben como datos confiables
 * desde el cliente. El servicio debe obtenerlos directamente
 * de la publicación PAID almacenada en la base de datos.
 */
export const creativeOrderCreateSchema =
  z.object({
    /*
     * Puede llegar en el cuerpo o ser añadido desde el
     * parámetro itemId de la ruta.
     */
    creativeItemId:
      creativeItemIdSchema
        .optional(),

    paymentProvider:
      creativePaymentProviderSchema,
  });

export const creativePurchaseCreateSchema =
  creativeOrderCreateSchema;

/* =========================================================
   REGISTRAR DATOS DEL PAGO
========================================================= */

export const creativeOrderPaymentUpdateSchema =
  z.object({
    paymentProvider:
      creativePaymentProviderSchema,

    paymentReference:
      creativePaymentReferenceSchema,

    paymentUrl:
      creativePaymentUrlSchema,
  });

export const creativePurchasePaymentUpdateSchema =
  creativeOrderPaymentUpdateSchema;

/* =========================================================
   ACTUALIZAR COMPROBANTE SIN MODIFICAR REFERENCIA
========================================================= */

export const creativeOrderPaymentUrlUpdateSchema =
  z.object({
    paymentUrl:
      z.preprocess(
        normalizeCreativeOrderNullableText,
        z
          .string()
          .url(
            "La URL del comprobante de pago no es válida.",
          )
          .max(
            CREATIVE_ORDER_PAYMENT_URL_MAX_LENGTH,
            `La URL del comprobante no puede superar los ${CREATIVE_ORDER_PAYMENT_URL_MAX_LENGTH} caracteres.`,
          )
          .nullable(),
      ),
  });

/* =========================================================
   CANCELAR PEDIDO PROPIO
========================================================= */

export const creativeOrderCancelSchema =
  z.object({
    confirmation:
      z
        .boolean()
        .default(
          true,
        ),
  });

/* =========================================================
   ACTUALIZAR ESTADO DIRECTAMENTE
========================================================= */

export const creativeOrderStatusUpdateSchema =
  z.object({
    status:
      creativeOrderStatusSchema,
  });

/* =========================================================
   EJECUTAR ACCIÓN ADMINISTRATIVA
========================================================= */

export const creativeOrderAdminActionInputSchema =
  z.object({
    action:
      creativeOrderAdminActionSchema,
  });

/* =========================================================
   APROBAR PEDIDO
========================================================= */

export const creativeOrderApproveSchema =
  z.object({
    confirmation:
      z
        .boolean()
        .default(
          true,
        ),
  });

/* =========================================================
   RECHAZAR PEDIDO
========================================================= */

export const creativeOrderRejectSchema =
  z.object({
    confirmation:
      z
        .boolean()
        .default(
          true,
        ),
  });

/* =========================================================
   REEMBOLSAR PEDIDO
========================================================= */

export const creativeOrderRefundSchema =
  z.object({
    confirmation:
      z
        .boolean()
        .default(
          true,
        ),
  });

/* =========================================================
   PARÁMETROS DE RUTA
========================================================= */

export const creativeOrderIdParamsSchema =
  z.object({
    orderId:
      creativeOrderIdSchema,
  });

export const creativePurchaseIdParamsSchema =
  z.object({
    purchaseId:
      creativePurchaseIdSchema,
  });

export const creativeItemOrderParamsSchema =
  z.object({
    itemId:
      creativeItemIdSchema,
  });

/* =========================================================
   PAGINACIÓN
========================================================= */

export const creativeOrderPageSchema =
  z.preprocess(
    normalizeCreativeOrderInteger,
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

export const creativeOrderPageSizeSchema =
  z.preprocess(
    normalizeCreativeOrderInteger,
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
        CREATIVE_ORDER_MAX_PAGE_SIZE,
        `No se pueden solicitar más de ${CREATIVE_ORDER_MAX_PAGE_SIZE} pedidos por página.`,
      )
      .default(
        CREATIVE_ORDER_DEFAULT_PAGE_SIZE,
      ),
  );

/* =========================================================
   BÚSQUEDA
========================================================= */

export const creativeOrderSearchSchema =
  z.preprocess(
    normalizeCreativeOrderOptionalText,
    z
      .string()
      .max(
        CREATIVE_ORDER_SEARCH_MAX_LENGTH,
        `La búsqueda no puede superar los ${CREATIVE_ORDER_SEARCH_MAX_LENGTH} caracteres.`,
      )
      .optional(),
  );

/* =========================================================
   FILTROS DE MONTO
========================================================= */

const creativeOptionalOrderAmountSchema =
  z.preprocess(
    normalizeCreativeOrderNumber,
    z
      .number()
      .finite(
        "El monto debe ser un número válido.",
      )
      .min(
        0,
        "El monto no puede ser negativo.",
      )
      .max(
        CREATIVE_ORDER_MAX_AMOUNT,
        "El monto supera el máximo permitido.",
      )
      .optional(),
  );

/* =========================================================
   FILTROS DE FECHA
========================================================= */

const creativeOptionalOrderDateSchema =
  z.preprocess(
    normalizeCreativeOrderOptionalText,
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
   VALIDAR RANGOS
========================================================= */

interface CreativeOrderQueryRange {
  minimumAmount?:
    number;

  maximumAmount?:
    number;

  createdAfter?:
    string;

  createdBefore?:
    string;
}

function validateCreativeOrderRanges(
  values:
    CreativeOrderQueryRange,
  context:
    z.RefinementCtx,
): void {
  if (
    values.minimumAmount !==
      undefined &&
    values.maximumAmount !==
      undefined &&
    values.minimumAmount >
      values.maximumAmount
  ) {
    context.addIssue({
      code:
        "custom",

      path: [
        "maximumAmount",
      ],

      message:
        "El monto máximo debe ser mayor o igual al monto mínimo.",
    });
  }

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
        "La fecha final debe ser posterior a la fecha inicial.",
    });
  }
}

/* =========================================================
   CONSULTA BASE
========================================================= */

const creativeOrderQueryShape = {
  status:
    creativeOrderStatusSchema
      .optional(),

  currency:
    creativeCurrencySchema
      .optional(),

  search:
    creativeOrderSearchSchema,

  sort:
    creativeOrderSortSchema
      .default(
        "NEWEST",
      ),

  minimumAmount:
    creativeOptionalOrderAmountSchema,

  maximumAmount:
    creativeOptionalOrderAmountSchema,

  createdAfter:
    creativeOptionalOrderDateSchema,

  createdBefore:
    creativeOptionalOrderDateSchema,

  page:
    creativeOrderPageSchema,

  pageSize:
    creativeOrderPageSizeSchema,
};

/* =========================================================
   CONSULTA DEL USUARIO
========================================================= */

export const creativeUserOrdersQuerySchema =
  z
    .object({
      ...creativeOrderQueryShape,
    })
    .superRefine(
      validateCreativeOrderRanges,
    );

export const creativeUserPurchasesQuerySchema =
  creativeUserOrdersQuerySchema;

/* =========================================================
   CONSULTA ADMINISTRATIVA
========================================================= */

export const creativeAdminOrdersQuerySchema =
  z
    .object({
      ...creativeOrderQueryShape,

      creativeItemId:
        creativeItemIdSchema
          .optional(),

      userId:
        creativeOrderUserIdSchema
          .optional(),

      paymentProvider:
        z.preprocess(
          normalizeCreativePaymentProvider,
          z
            .string()
            .max(
              CREATIVE_ORDER_PAYMENT_PROVIDER_MAX_LENGTH,
              `El proveedor de pago no puede superar los ${CREATIVE_ORDER_PAYMENT_PROVIDER_MAX_LENGTH} caracteres.`,
            )
            .regex(
              CREATIVE_PAYMENT_PROVIDER_PATTERN,
              "El proveedor de pago contiene caracteres no permitidos.",
            )
            .optional(),
        ),

      paymentReference:
        z.preprocess(
          normalizeCreativeOrderOptionalText,
          z
            .string()
            .max(
              CREATIVE_ORDER_PAYMENT_REFERENCE_MAX_LENGTH,
              `La referencia de pago no puede superar los ${CREATIVE_ORDER_PAYMENT_REFERENCE_MAX_LENGTH} caracteres.`,
            )
            .optional(),
        ),
    })
    .superRefine(
      validateCreativeOrderRanges,
    );

export const creativeAdminPurchasesQuerySchema =
  creativeAdminOrdersQuerySchema;

/* =========================================================
   ALIAS COMPATIBLES
========================================================= */

export const createCreativeOrderSchema =
  creativeOrderCreateSchema;

export const createCreativePurchaseSchema =
  creativePurchaseCreateSchema;

export const updateCreativeOrderPaymentSchema =
  creativeOrderPaymentUpdateSchema;

export const updateCreativePurchasePaymentSchema =
  creativePurchasePaymentUpdateSchema;

export const cancelCreativeOrderSchema =
  creativeOrderCancelSchema;

export const cancelCreativePurchaseSchema =
  creativeOrderCancelSchema;

export const updateCreativeOrderStatusSchema =
  creativeOrderStatusUpdateSchema;

export const updateCreativePurchaseStatusSchema =
  creativeOrderStatusUpdateSchema;

export const executeCreativeOrderAdminActionSchema =
  creativeOrderAdminActionInputSchema;

export const executeCreativePurchaseAdminActionSchema =
  creativeOrderAdminActionInputSchema;

export const getCreativeOrdersQuerySchema =
  creativeUserOrdersQuerySchema;

export const getCreativePurchasesQuerySchema =
  creativeUserPurchasesQuerySchema;

export const getCreativeAdminOrdersQuerySchema =
  creativeAdminOrdersQuerySchema;

export const getCreativeAdminPurchasesQuerySchema =
  creativeAdminPurchasesQuerySchema;

/* =========================================================
   TIPOS INFERIDOS
========================================================= */

export type CreativeOrderStatusInput =
  z.infer<
    typeof creativeOrderStatusSchema
  >;

export type CreativePurchaseStatusInput =
  CreativeOrderStatusInput;

export type CreativeOrderSortInput =
  z.infer<
    typeof creativeOrderSortSchema
  >;

export type CreativeOrderAdminAction =
  z.infer<
    typeof creativeOrderAdminActionSchema
  >;

export type CreativeOrderCreateInput =
  z.input<
    typeof creativeOrderCreateSchema
  >;

export type CreativeOrderCreateData =
  z.output<
    typeof creativeOrderCreateSchema
  >;

export type CreativePurchaseCreateInput =
  z.input<
    typeof creativePurchaseCreateSchema
  >;

export type CreativePurchaseCreateData =
  z.output<
    typeof creativePurchaseCreateSchema
  >;

export type CreativeOrderPaymentUpdateInput =
  z.input<
    typeof creativeOrderPaymentUpdateSchema
  >;

export type CreativeOrderPaymentUpdateData =
  z.output<
    typeof creativeOrderPaymentUpdateSchema
  >;

export type CreativeOrderCancelInput =
  z.input<
    typeof creativeOrderCancelSchema
  >;

export type CreativeOrderStatusUpdateInput =
  z.input<
    typeof creativeOrderStatusUpdateSchema
  >;

export type CreativeOrderAdminActionInput =
  z.input<
    typeof creativeOrderAdminActionInputSchema
  >;

export type CreativeOrderAdminActionData =
  z.output<
    typeof creativeOrderAdminActionInputSchema
  >;

export type CreativeUserOrdersQueryInput =
  z.input<
    typeof creativeUserOrdersQuerySchema
  >;

export type CreativeUserOrdersQuery =
  z.output<
    typeof creativeUserOrdersQuerySchema
  >;

export type CreativeAdminOrdersQueryInput =
  z.input<
    typeof creativeAdminOrdersQuerySchema
  >;

export type CreativeAdminOrdersQuery =
  z.output<
    typeof creativeAdminOrdersQuerySchema
  >;

export type CreativeOrderIdParams =
  z.infer<
    typeof creativeOrderIdParamsSchema
  >;

export type CreativePurchaseIdParams =
  z.infer<
    typeof creativePurchaseIdParamsSchema
  >;

export type CreativeItemOrderParams =
  z.infer<
    typeof creativeItemOrderParamsSchema
  >;