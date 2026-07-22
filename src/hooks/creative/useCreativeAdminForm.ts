"use client";

/*
 * Hook del formulario administrativo Diseño / Creative.
 *
 * Responsabilidades:
 * - Crear publicaciones nuevas.
 * - Editar publicaciones existentes.
 * - Administrar todos los campos del diseño.
 * - Generar automáticamente el slug.
 * - Validar los datos antes de enviarlos.
 * - Aplicar reglas según FREE, PAID o PORTFOLIO.
 * - Administrar herramientas y etiquetas.
 * - Detectar cambios sin guardar.
 * - Interpretar errores de validación del servidor.
 * - Cancelar solicitudes antiguas.
 * - Evitar envíos duplicados.
 *
 * No contiene:
 * - Componentes visuales.
 * - Acceso directo a Prisma.
 * - Subida física de imágenes.
 * - Administración de comentarios.
 * - Confirmación de pagos.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  CreativeCategoryId,
  CreativeContentType,
  CreativeCurrency,
  CreativeDownloadPolicy,
  CreativeImageFormat,
  CreativeItemStatus,
  CreativeLicenseType,
  CreativeOriginalFileFormat,
  CreativeOrientation,
  CreativePaymentMethod,
  CreativeRequestKind,
  CreativeToolId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   MODO DEL FORMULARIO
   ========================================================= */

export type CreativeAdminFormMode =
  | "CREATE"
  | "EDIT";

/* =========================================================
   ESTADO DEL ENVÍO
   ========================================================= */

export type CreativeAdminFormSubmitStatus =
  | "IDLE"
  | "VALIDATING"
  | "SUBMITTING"
  | "SUCCESS"
  | "CANCELLED"
  | "ERROR";

/* =========================================================
   VALORES DEL FORMULARIO
   ========================================================= */

export interface CreativeAdminFormValues {
  itemId:
    string | null;

  slug:
    string;

  titleEs:
    string;

  titleEn:
    string;

  shortDescriptionEs:
    string;

  shortDescriptionEn:
    string;

  descriptionEs:
    string;

  descriptionEn:
    string;

  contentType:
    CreativeContentType;

  status:
    CreativeItemStatus;

  categoryId:
    CreativeCategoryId | null;

  toolIds:
    CreativeToolId[];

  tags:
    string[];

  featured:
    boolean;

  allowComments:
    boolean;

  priceInput:
    string;

  currency:
    CreativeCurrency;

  paymentMethod:
    CreativePaymentMethod;

  licenseType:
    CreativeLicenseType;

  downloadPolicy:
    CreativeDownloadPolicy;

  requestKind:
    CreativeRequestKind | null;

  requestButtonLabelEs:
    string;

  requestButtonLabelEn:
    string;

  imageAltEs:
    string;

  imageAltEn:
    string;

  orientation:
    CreativeOrientation | null;

  imageFormat:
    CreativeImageFormat | null;

  originalFileFormat:
    CreativeOriginalFileFormat | null;

  watermarkEnabled:
    boolean;

  watermarkOpacity:
    number;
}

/* =========================================================
   NOMBRES DE CAMPOS
   ========================================================= */

export type CreativeAdminFormFieldName =
  keyof CreativeAdminFormValues;

/* =========================================================
   ERRORES POR CAMPO
   ========================================================= */

export type CreativeAdminFormFieldErrors =
  Partial<
    Record<
      CreativeAdminFormFieldName,
      string
    >
  >;

/* =========================================================
   CAMPOS TOCADOS
   ========================================================= */

export type CreativeAdminFormTouchedFields =
  Partial<
    Record<
      CreativeAdminFormFieldName,
      boolean
    >
  >;

/* =========================================================
   DATOS ENVIADOS A LA API
   ========================================================= */

export interface CreativeAdminFormPayload {
  slug:
    string;

  titleEs:
    string;

  titleEn:
    string;

  shortDescriptionEs:
    string;

  shortDescriptionEn:
    string;

  descriptionEs:
    string;

  descriptionEn:
    string;

  contentType:
    CreativeContentType;

  status:
    CreativeItemStatus;

  categoryId:
    CreativeCategoryId;

  toolIds:
    CreativeToolId[];

  tags:
    string[];

  featured:
    boolean;

  allowComments:
    boolean;

  price:
    number | null;

  currency:
    CreativeCurrency;

  paymentMethod:
    CreativePaymentMethod | null;

  licenseType:
    CreativeLicenseType;

  downloadPolicy:
    CreativeDownloadPolicy;

  requestKind:
    CreativeRequestKind | null;

  requestButtonLabelEs:
    string | null;

  requestButtonLabelEn:
    string | null;

  imageAltEs:
    string | null;

  imageAltEn:
    string | null;

  orientation:
    CreativeOrientation | null;

  imageFormat:
    CreativeImageFormat | null;

  originalFileFormat:
    CreativeOriginalFileFormat | null;

  watermarkEnabled:
    boolean;

  watermarkOpacity:
    number;
}

/* =========================================================
   PUBLICACIÓN GUARDADA
   ========================================================= */

export interface CreativeAdminSavedItem {
  id:
    string;

  slug:
    string;

  titleEs:
    string | null;

  titleEn:
    string | null;

  status:
    string | null;

  contentType:
    string | null;

  updatedAt:
    string | null;
}

/* =========================================================
   RESULTADO DE VALIDACIÓN
   ========================================================= */

export interface CreativeAdminFormValidationResult {
  valid:
    boolean;

  errors:
    CreativeAdminFormFieldErrors;

  errorCount:
    number;
}

/* =========================================================
   EVENTO DE ÉXITO
   ========================================================= */

export interface CreativeAdminFormSuccessEvent {
  mode:
    CreativeAdminFormMode;

  item:
    CreativeAdminSavedItem;

  values:
    CreativeAdminFormValues;

  payload:
    CreativeAdminFormPayload;

  savedAt:
    number;
}

/* =========================================================
   EVENTO DE ERROR
   ========================================================= */

export interface CreativeAdminFormErrorEvent {
  mode:
    CreativeAdminFormMode;

  message:
    string;

  fieldErrors:
    CreativeAdminFormFieldErrors;

  statusCode:
    number | null;

  error:
    unknown;
}

/* =========================================================
   OPCIONES DEL HOOK
   ========================================================= */

export interface UseCreativeAdminFormOptions {
  mode?:
    CreativeAdminFormMode;

  itemId?:
    string | null;

  initialValues?:
    Partial<CreativeAdminFormValues>;

  language?:
    "es" | "en";

  enabled?:
    boolean;

  /*
   * Endpoint utilizado para crear.
   */
  createEndpoint?:
    string;

  /*
   * Endpoint utilizado para editar.
   *
   * Cuando no se proporciona, se construye usando itemId.
   */
  updateEndpoint?:
    string | null;

  onSuccess?:
    (
      event:
        CreativeAdminFormSuccessEvent,
    ) => void | Promise<void>;

  onError?:
    (
      event:
        CreativeAdminFormErrorEvent,
    ) => void;

  onAuthenticationRequired?:
    () => void;

  onForbidden?:
    () => void;
}

/* =========================================================
   RESULTADO DEL HOOK
   ========================================================= */

export interface UseCreativeAdminFormResult {
  mode:
    CreativeAdminFormMode;

  values:
    CreativeAdminFormValues;

  baselineValues:
    CreativeAdminFormValues;

  errors:
    CreativeAdminFormFieldErrors;

  validationErrors:
    CreativeAdminFormFieldErrors;

  touched:
    CreativeAdminFormTouchedFields;

  submitStatus:
    CreativeAdminFormSubmitStatus;

  submitting:
    boolean;

  validating:
    boolean;

  succeeded:
    boolean;

  cancelled:
    boolean;

  hasError:
    boolean;

  errorMessage:
    string | null;

  isDirty:
    boolean;

  isValid:
    boolean;

  canSubmit:
    boolean;

  errorCount:
    number;

  lastSavedAt:
    number | null;

  savedItem:
    CreativeAdminSavedItem | null;

  payload:
    CreativeAdminFormPayload | null;

  setField:
    <
      TField extends CreativeAdminFormFieldName,
    >(
      field:
        TField,
      value:
        CreativeAdminFormValues[TField],
    ) => void;

  setTextField:
    (
      field:
        CreativeAdminFormFieldName,
      value:
        string,
    ) => void;

  markFieldTouched:
    (
      field:
        CreativeAdminFormFieldName,
    ) => void;

  clearFieldError:
    (
      field:
        CreativeAdminFormFieldName,
    ) => void;

  setContentType:
    (
      contentType:
        CreativeContentType,
    ) => void;

  generateSlug:
    (
      source?:
        string,
    ) => string;

  toggleTool:
    (
      toolId:
        CreativeToolId,
    ) => void;

  setTools:
    (
      toolIds:
        readonly CreativeToolId[],
    ) => void;

  addTag:
    (
      tag:
        string,
    ) => boolean;

  removeTag:
    (
      tag:
        string,
    ) => void;

  setTags:
    (
      tags:
        readonly string[],
    ) => void;

  setTagsFromText:
    (
      value:
        string,
    ) => void;

  validate:
    () => CreativeAdminFormValidationResult;

  submit:
    () => Promise<CreativeAdminSavedItem | null>;

  retry:
    () => Promise<CreativeAdminSavedItem | null>;

  cancelSubmit:
    () => void;

  reset:
    () => void;

  replaceValues:
    (
      values:
        Partial<CreativeAdminFormValues>,
      setAsBaseline?:
        boolean,
    ) => void;

  clearErrors:
    () => void;

  resetSubmitStatus:
    () => void;
}

/* =========================================================
   LÍMITES DEL FORMULARIO
   ========================================================= */

const CREATIVE_ADMIN_FORM_LIMITS = {
  SLUG_MAX_LENGTH:
    120,

  TITLE_MAX_LENGTH:
    140,

  SHORT_DESCRIPTION_MAX_LENGTH:
    280,

  DESCRIPTION_MAX_LENGTH:
    20_000,

  TAG_MAX_LENGTH:
    40,

  TAGS_MAXIMUM:
    20,

  REQUEST_BUTTON_MAX_LENGTH:
    80,

  ALT_TEXT_MAX_LENGTH:
    240,

  PRICE_MAXIMUM:
    999_999.99,

  WATERMARK_MINIMUM_OPACITY:
    0.1,

  WATERMARK_MAXIMUM_OPACITY:
    0.5,
} as const;

/* =========================================================
   CAMPOS OFICIALES
   ========================================================= */

const CREATIVE_ADMIN_FORM_FIELDS =
  [
    "itemId",
    "slug",
    "titleEs",
    "titleEn",
    "shortDescriptionEs",
    "shortDescriptionEn",
    "descriptionEs",
    "descriptionEn",
    "contentType",
    "status",
    "categoryId",
    "toolIds",
    "tags",
    "featured",
    "allowComments",
    "priceInput",
    "currency",
    "paymentMethod",
    "licenseType",
    "downloadPolicy",
    "requestKind",
    "requestButtonLabelEs",
    "requestButtonLabelEn",
    "imageAltEs",
    "imageAltEn",
    "orientation",
    "imageFormat",
    "originalFileFormat",
    "watermarkEnabled",
    "watermarkOpacity",
  ] as const satisfies readonly CreativeAdminFormFieldName[];

/* =========================================================
   VALORES PREDETERMINADOS
   ========================================================= */

export const DEFAULT_CREATIVE_ADMIN_FORM_VALUES:
  CreativeAdminFormValues = {
    itemId:
      null,

    slug:
      "",

    titleEs:
      "",

    titleEn:
      "",

    shortDescriptionEs:
      "",

    shortDescriptionEn:
      "",

    descriptionEs:
      "",

    descriptionEn:
      "",

    contentType:
      "PORTFOLIO" as CreativeContentType,

    status:
      "DRAFT" as CreativeItemStatus,

    categoryId:
      null,

    toolIds:
      [],

    tags:
      [],

    featured:
      false,

    allowComments:
      true,

    priceInput:
      "",

    currency:
      "PEN" as CreativeCurrency,

    paymentMethod:
      "YAPE" as CreativePaymentMethod,

    licenseType:
      "PERSONAL_USE" as CreativeLicenseType,

    downloadPolicy:
      "DISABLED" as CreativeDownloadPolicy,

    requestKind:
      null,

    requestButtonLabelEs:
      "Solicitar un trabajo similar",

    requestButtonLabelEn:
      "Request a similar design",

    imageAltEs:
      "",

    imageAltEn:
      "",

    orientation:
      null,

    imageFormat:
      null,

    originalFileFormat:
      null,

    watermarkEnabled:
      true,

    watermarkOpacity:
      0.22,
  };

/* =========================================================
   COMPROBAR OBJETO
   ========================================================= */

function isCreativeAdminRecord(
  value:
    unknown,
): value is Record<string, unknown> {
  return (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value,
    )
  );
}

/* =========================================================
   NORMALIZAR TEXTO
   ========================================================= */

function normalizeCreativeAdminText(
  value:
    string | null | undefined,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value
    .replace(
      /\r\n/g,
      "\n",
    )
    .trim();
}

/* =========================================================
   NORMALIZAR TEXTO EN UNA LÍNEA
   ========================================================= */

function normalizeCreativeAdminSingleLine(
  value:
    string | null | undefined,
): string {
  return normalizeCreativeAdminText(
    value,
  )
    .replace(
      /\s+/g,
      " ",
    );
}

/* =========================================================
   CREAR SLUG
   ========================================================= */

export function createCreativeAdminSlug(
  value:
    string,
): string {
  return value
    .normalize(
      "NFD",
    )
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    )
    .replace(
      /-{2,}/g,
      "-",
    )
    .slice(
      0,
      CREATIVE_ADMIN_FORM_LIMITS
        .SLUG_MAX_LENGTH,
    )
    .replace(
      /-+$/g,
      "",
    );
}

/* =========================================================
   NORMALIZAR ETIQUETA
   ========================================================= */

function normalizeCreativeAdminTag(
  value:
    string,
): string {
  return value
    .replace(
      /^#+/,
      "",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim()
    .slice(
      0,
      CREATIVE_ADMIN_FORM_LIMITS
        .TAG_MAX_LENGTH,
    );
}

/* =========================================================
   NORMALIZAR ETIQUETAS
   ========================================================= */

function normalizeCreativeAdminTags(
  values:
    readonly string[],
): string[] {
  const normalizedTags:
    string[] = [];

  const normalizedKeys =
    new Set<string>();

  for (
    const value
    of values
  ) {
    const tag =
      normalizeCreativeAdminTag(
        value,
      );

    if (
      !tag
    ) {
      continue;
    }

    const comparisonKey =
      tag.toLocaleLowerCase(
        "es-PE",
      );

    if (
      normalizedKeys.has(
        comparisonKey,
      )
    ) {
      continue;
    }

    normalizedKeys.add(
      comparisonKey,
    );

    normalizedTags.push(
      tag,
    );

    if (
      normalizedTags.length >=
      CREATIVE_ADMIN_FORM_LIMITS
        .TAGS_MAXIMUM
    ) {
      break;
    }
  }

  return normalizedTags;
}

/* =========================================================
   NORMALIZAR HERRAMIENTAS
   ========================================================= */

function normalizeCreativeAdminTools(
  values:
    readonly CreativeToolId[],
): CreativeToolId[] {
  return Array.from(
    new Set(
      values,
    ),
  );
}

/* =========================================================
   NORMALIZAR OPACIDAD
   ========================================================= */

function normalizeCreativeWatermarkOpacity(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 0.22;
  }

  return Math.min(
    CREATIVE_ADMIN_FORM_LIMITS
      .WATERMARK_MAXIMUM_OPACITY,
    Math.max(
      CREATIVE_ADMIN_FORM_LIMITS
        .WATERMARK_MINIMUM_OPACITY,
      value,
    ),
  );
}

/* =========================================================
   CREAR VALORES DEL FORMULARIO
   ========================================================= */

function createCreativeAdminFormValues(
  values:
    Partial<CreativeAdminFormValues> = {},
  itemId?:
    string | null,
): CreativeAdminFormValues {
  const mergedValues:
    CreativeAdminFormValues = {
      ...DEFAULT_CREATIVE_ADMIN_FORM_VALUES,
      ...values,

      itemId:
        itemId ??
        values.itemId ??
        null,

      toolIds:
        normalizeCreativeAdminTools(
          values.toolIds ??
          DEFAULT_CREATIVE_ADMIN_FORM_VALUES
            .toolIds,
        ),

      tags:
        normalizeCreativeAdminTags(
          values.tags ??
          DEFAULT_CREATIVE_ADMIN_FORM_VALUES
            .tags,
        ),

      watermarkOpacity:
        normalizeCreativeWatermarkOpacity(
          values.watermarkOpacity ??
          DEFAULT_CREATIVE_ADMIN_FORM_VALUES
            .watermarkOpacity,
        ),
    };

  return mergedValues;
}

/* =========================================================
   NORMALIZAR TODOS LOS VALORES
   ========================================================= */

function normalizeCreativeAdminFormValues(
  values:
    CreativeAdminFormValues,
): CreativeAdminFormValues {
  return {
    ...values,

    itemId:
      normalizeCreativeAdminSingleLine(
        values.itemId,
      ) ||
      null,

    slug:
      createCreativeAdminSlug(
        values.slug,
      ),

    titleEs:
      normalizeCreativeAdminSingleLine(
        values.titleEs,
      ),

    titleEn:
      normalizeCreativeAdminSingleLine(
        values.titleEn,
      ),

    shortDescriptionEs:
      normalizeCreativeAdminSingleLine(
        values.shortDescriptionEs,
      ),

    shortDescriptionEn:
      normalizeCreativeAdminSingleLine(
        values.shortDescriptionEn,
      ),

    descriptionEs:
      normalizeCreativeAdminText(
        values.descriptionEs,
      ),

    descriptionEn:
      normalizeCreativeAdminText(
        values.descriptionEn,
      ),

    toolIds:
      normalizeCreativeAdminTools(
        values.toolIds,
      ),

    tags:
      normalizeCreativeAdminTags(
        values.tags,
      ),

    priceInput:
      normalizeCreativeAdminSingleLine(
        values.priceInput,
      ),

    requestButtonLabelEs:
      normalizeCreativeAdminSingleLine(
        values.requestButtonLabelEs,
      ),

    requestButtonLabelEn:
      normalizeCreativeAdminSingleLine(
        values.requestButtonLabelEn,
      ),

    imageAltEs:
      normalizeCreativeAdminSingleLine(
        values.imageAltEs,
      ),

    imageAltEn:
      normalizeCreativeAdminSingleLine(
        values.imageAltEn,
      ),

    watermarkOpacity:
      normalizeCreativeWatermarkOpacity(
        values.watermarkOpacity,
      ),
  };
}

/* =========================================================
   ANALIZAR PRECIO
   ========================================================= */

function parseCreativeAdminPrice(
  priceInput:
    string,
): number | null {
  const normalizedPrice =
    priceInput
      .trim()
      .replace(
        ",",
        ".",
      );

  if (
    !normalizedPrice
  ) {
    return null;
  }

  const parsedPrice =
    Number(
      normalizedPrice,
    );

  if (
    !Number.isFinite(
      parsedPrice,
    )
  ) {
    return null;
  }

  return Math.round(
    parsedPrice *
    100,
  ) /
  100;
}

/* =========================================================
   CONFIGURACIÓN POR TIPO
   ========================================================= */

function getCreativeAdminContentTypeConfiguration(
  contentType:
    CreativeContentType,
): Pick<
  CreativeAdminFormValues,
  | "downloadPolicy"
  | "watermarkEnabled"
  | "priceInput"
  | "requestKind"
> {
  switch (
    contentType
  ) {
    case "FREE":
      return {
        downloadPolicy:
          "PUBLIC" as CreativeDownloadPolicy,

        watermarkEnabled:
          false,

        priceInput:
          "",

        requestKind:
          null,
      };

    case "PAID":
      return {
        downloadPolicy:
          "AFTER_APPROVED_PAYMENT" as CreativeDownloadPolicy,

        watermarkEnabled:
          true,

        priceInput:
          "",

        requestKind:
          null,
      };

    case "PORTFOLIO":
      return {
        downloadPolicy:
          "DISABLED" as CreativeDownloadPolicy,

        watermarkEnabled:
          true,

        priceInput:
          "",

        requestKind:
          null,
      };
  }
}

/* =========================================================
   CREAR PAYLOAD
   ========================================================= */

export function createCreativeAdminFormPayload(
  values:
    CreativeAdminFormValues,
): CreativeAdminFormPayload | null {
  const normalizedValues =
    normalizeCreativeAdminFormValues(
      values,
    );

  if (
    !normalizedValues.categoryId
  ) {
    return null;
  }

  const paidContent =
    normalizedValues.contentType ===
    "PAID";

  const portfolioContent =
    normalizedValues.contentType ===
    "PORTFOLIO";

  return {
    slug:
      normalizedValues.slug,

    titleEs:
      normalizedValues.titleEs,

    titleEn:
      normalizedValues.titleEn,

    shortDescriptionEs:
      normalizedValues
        .shortDescriptionEs,

    shortDescriptionEn:
      normalizedValues
        .shortDescriptionEn,

    descriptionEs:
      normalizedValues.descriptionEs,

    descriptionEn:
      normalizedValues.descriptionEn,

    contentType:
      normalizedValues.contentType,

    status:
      normalizedValues.status,

    categoryId:
      normalizedValues.categoryId,

    toolIds: [
      ...normalizedValues.toolIds,
    ],

    tags: [
      ...normalizedValues.tags,
    ],

    featured:
      normalizedValues.featured,

    allowComments:
      normalizedValues.allowComments,

    price:
      paidContent
        ? parseCreativeAdminPrice(
            normalizedValues.priceInput,
          )
        : null,

    currency:
      normalizedValues.currency,

    paymentMethod:
      paidContent
        ? normalizedValues.paymentMethod
        : null,

    licenseType:
      normalizedValues.licenseType,

    downloadPolicy:
      normalizedValues.downloadPolicy,

    requestKind:
      portfolioContent
        ? normalizedValues.requestKind
        : null,

    requestButtonLabelEs:
      portfolioContent
        ? normalizedValues
            .requestButtonLabelEs ||
          null
        : null,

    requestButtonLabelEn:
      portfolioContent
        ? normalizedValues
            .requestButtonLabelEn ||
          null
        : null,

    imageAltEs:
      normalizedValues.imageAltEs ||
      null,

    imageAltEn:
      normalizedValues.imageAltEn ||
      null,

    orientation:
      normalizedValues.orientation,

    imageFormat:
      normalizedValues.imageFormat,

    originalFileFormat:
      normalizedValues
        .originalFileFormat,

    watermarkEnabled:
      normalizedValues.watermarkEnabled,

    watermarkOpacity:
      normalizedValues.watermarkOpacity,
  };
}

/* =========================================================
   MENSAJES
   ========================================================= */

function getCreativeAdminRequiredMessage(
  language:
    "es" | "en",
): string {
  return language ===
    "en"
    ? "This field is required."
    : "Este campo es obligatorio.";
}

function getCreativeAdminMaximumMessage(
  maximum:
    number,
  language:
    "es" | "en",
): string {
  return language ===
    "en"
    ? `This field cannot exceed ${maximum} characters.`
    : `Este campo no puede superar los ${maximum} caracteres.`;
}

/* =========================================================
   VALIDAR FORMULARIO
   ========================================================= */

export function validateCreativeAdminFormValues(
  values:
    CreativeAdminFormValues,
  language:
    "es" | "en",
): CreativeAdminFormValidationResult {
  const normalizedValues =
    normalizeCreativeAdminFormValues(
      values,
    );

  const errors:
    CreativeAdminFormFieldErrors = {};

  const requiredMessage =
    getCreativeAdminRequiredMessage(
      language,
    );

  /* -------------------------------------------------------
     SLUG
     ------------------------------------------------------- */

  if (
    !normalizedValues.slug
  ) {
    errors.slug =
      requiredMessage;
  } else if (
    normalizedValues.slug.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .SLUG_MAX_LENGTH
  ) {
    errors.slug =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .SLUG_MAX_LENGTH,
        language,
      );
  } else if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
      normalizedValues.slug,
    )
  ) {
    errors.slug =
      language ===
        "en"
        ? "Use only lowercase letters, numbers, and hyphens."
        : "Usa solamente letras minúsculas, números y guiones.";
  }

  /* -------------------------------------------------------
     TÍTULOS
     ------------------------------------------------------- */

  if (
    !normalizedValues.titleEs
  ) {
    errors.titleEs =
      requiredMessage;
  } else if (
    normalizedValues.titleEs.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .TITLE_MAX_LENGTH
  ) {
    errors.titleEs =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .TITLE_MAX_LENGTH,
        language,
      );
  }

  if (
    !normalizedValues.titleEn
  ) {
    errors.titleEn =
      requiredMessage;
  } else if (
    normalizedValues.titleEn.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .TITLE_MAX_LENGTH
  ) {
    errors.titleEn =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .TITLE_MAX_LENGTH,
        language,
      );
  }

  /* -------------------------------------------------------
     DESCRIPCIONES CORTAS
     ------------------------------------------------------- */

  if (
    !normalizedValues.shortDescriptionEs
  ) {
    errors.shortDescriptionEs =
      requiredMessage;
  } else if (
    normalizedValues
      .shortDescriptionEs.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .SHORT_DESCRIPTION_MAX_LENGTH
  ) {
    errors.shortDescriptionEs =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .SHORT_DESCRIPTION_MAX_LENGTH,
        language,
      );
  }

  if (
    !normalizedValues.shortDescriptionEn
  ) {
    errors.shortDescriptionEn =
      requiredMessage;
  } else if (
    normalizedValues
      .shortDescriptionEn.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .SHORT_DESCRIPTION_MAX_LENGTH
  ) {
    errors.shortDescriptionEn =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .SHORT_DESCRIPTION_MAX_LENGTH,
        language,
      );
  }

  /* -------------------------------------------------------
     DESCRIPCIONES COMPLETAS
     ------------------------------------------------------- */

  if (
    !normalizedValues.descriptionEs
  ) {
    errors.descriptionEs =
      requiredMessage;
  } else if (
    normalizedValues.descriptionEs.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .DESCRIPTION_MAX_LENGTH
  ) {
    errors.descriptionEs =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .DESCRIPTION_MAX_LENGTH,
        language,
      );
  }

  if (
    !normalizedValues.descriptionEn
  ) {
    errors.descriptionEn =
      requiredMessage;
  } else if (
    normalizedValues.descriptionEn.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .DESCRIPTION_MAX_LENGTH
  ) {
    errors.descriptionEn =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .DESCRIPTION_MAX_LENGTH,
        language,
      );
  }

  /* -------------------------------------------------------
     CATEGORÍA
     ------------------------------------------------------- */

  if (
    !normalizedValues.categoryId
  ) {
    errors.categoryId =
      language ===
        "en"
        ? "Select a category."
        : "Selecciona una categoría.";
  }

  /* -------------------------------------------------------
     ETIQUETAS
     ------------------------------------------------------- */

  if (
    normalizedValues.tags.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .TAGS_MAXIMUM
  ) {
    errors.tags =
      language ===
        "en"
        ? `You can add up to ${CREATIVE_ADMIN_FORM_LIMITS.TAGS_MAXIMUM} tags.`
        : `Puedes agregar hasta ${CREATIVE_ADMIN_FORM_LIMITS.TAGS_MAXIMUM} etiquetas.`;
  }

  /* -------------------------------------------------------
     PUBLICACIÓN DE PAGO
     ------------------------------------------------------- */

  if (
    normalizedValues.contentType ===
    "PAID"
  ) {
    const price =
      parseCreativeAdminPrice(
        normalizedValues.priceInput,
      );

    if (
      price ===
      null
    ) {
      errors.priceInput =
        language ===
          "en"
          ? "Enter a valid price."
          : "Ingresa un precio válido.";
    } else if (
      price <=
      0
    ) {
      errors.priceInput =
        language ===
          "en"
          ? "The price must be greater than zero."
          : "El precio debe ser mayor que cero.";
    } else if (
      price >
      CREATIVE_ADMIN_FORM_LIMITS
        .PRICE_MAXIMUM
    ) {
      errors.priceInput =
        language ===
          "en"
          ? `The price cannot exceed ${CREATIVE_ADMIN_FORM_LIMITS.PRICE_MAXIMUM}.`
          : `El precio no puede superar ${CREATIVE_ADMIN_FORM_LIMITS.PRICE_MAXIMUM}.`;
    }

    if (
      normalizedValues.downloadPolicy !==
      (
        "AFTER_APPROVED_PAYMENT" as
          CreativeDownloadPolicy
      )
    ) {
      errors.downloadPolicy =
        language ===
          "en"
          ? "Paid content must be downloaded only after payment approval."
          : "El contenido de pago solo puede descargarse después de aprobar el pago.";
    }
  }

  /* -------------------------------------------------------
     PUBLICACIÓN GRATUITA
     ------------------------------------------------------- */

  if (
    normalizedValues.contentType ===
      "FREE" &&
    normalizedValues.downloadPolicy !==
      (
        "PUBLIC" as
          CreativeDownloadPolicy
      )
  ) {
    errors.downloadPolicy =
      language ===
        "en"
        ? "Free content must allow public downloads."
        : "El contenido gratuito debe permitir la descarga pública.";
  }

  /* -------------------------------------------------------
     PORTAFOLIO
     ------------------------------------------------------- */

  if (
    normalizedValues.contentType ===
    "PORTFOLIO"
  ) {
    if (
      normalizedValues.downloadPolicy !==
      (
        "DISABLED" as
          CreativeDownloadPolicy
      )
    ) {
      errors.downloadPolicy =
        language ===
          "en"
          ? "Portfolio content cannot be downloaded."
          : "El contenido de portafolio no puede descargarse.";
    }

    if (
      !normalizedValues.requestKind
    ) {
      errors.requestKind =
        language ===
          "en"
          ? "Select the type of custom request."
          : "Selecciona el tipo de solicitud personalizada.";
    }

    if (
      !normalizedValues.requestButtonLabelEs
    ) {
      errors.requestButtonLabelEs =
        requiredMessage;
    }

    if (
      !normalizedValues.requestButtonLabelEn
    ) {
      errors.requestButtonLabelEn =
        requiredMessage;
    }
  }

  /* -------------------------------------------------------
     ETIQUETAS DE SOLICITUD
     ------------------------------------------------------- */

  if (
    normalizedValues
      .requestButtonLabelEs.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .REQUEST_BUTTON_MAX_LENGTH
  ) {
    errors.requestButtonLabelEs =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .REQUEST_BUTTON_MAX_LENGTH,
        language,
      );
  }

  if (
    normalizedValues
      .requestButtonLabelEn.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .REQUEST_BUTTON_MAX_LENGTH
  ) {
    errors.requestButtonLabelEn =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .REQUEST_BUTTON_MAX_LENGTH,
        language,
      );
  }

  /* -------------------------------------------------------
     TEXTOS ALTERNATIVOS
     ------------------------------------------------------- */

  if (
    normalizedValues.imageAltEs.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .ALT_TEXT_MAX_LENGTH
  ) {
    errors.imageAltEs =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .ALT_TEXT_MAX_LENGTH,
        language,
      );
  }

  if (
    normalizedValues.imageAltEn.length >
    CREATIVE_ADMIN_FORM_LIMITS
      .ALT_TEXT_MAX_LENGTH
  ) {
    errors.imageAltEn =
      getCreativeAdminMaximumMessage(
        CREATIVE_ADMIN_FORM_LIMITS
          .ALT_TEXT_MAX_LENGTH,
        language,
      );
  }

  const errorCount =
    Object.keys(
      errors,
    ).length;

  return {
    valid:
      errorCount ===
      0,

    errors,

    errorCount,
  };
}

/* =========================================================
   SERIALIZACIÓN PARA DETECTAR CAMBIOS
   ========================================================= */

function serializeCreativeAdminFormValues(
  values:
    CreativeAdminFormValues,
): string {
  const normalizedValues =
    normalizeCreativeAdminFormValues(
      values,
    );

  return JSON.stringify({
    ...normalizedValues,

    toolIds: [
      ...normalizedValues.toolIds,
    ].sort(),

    tags: [
      ...normalizedValues.tags,
    ].sort(
      (
        firstTag,
        secondTag,
      ) =>
        firstTag.localeCompare(
          secondTag,
          "es",
        ),
    ),
  });
}

/* =========================================================
   VALIDAR NOMBRE DE CAMPO
   ========================================================= */

function isCreativeAdminFormFieldName(
  value:
    unknown,
): value is CreativeAdminFormFieldName {
  return (
    typeof value ===
      "string" &&
    CREATIVE_ADMIN_FORM_FIELDS.includes(
      value as CreativeAdminFormFieldName,
    )
  );
}

/* =========================================================
   LEER MENSAJE LOCALIZADO
   ========================================================= */

function readCreativeAdminLocalizedMessage(
  value:
    unknown,
  language:
    "es" | "en",
): string {
  if (
    typeof value ===
    "string"
  ) {
    return value.trim();
  }

  if (
    !isCreativeAdminRecord(
      value,
    )
  ) {
    return "";
  }

  const selectedMessage =
    value[
      language
    ];

  if (
    typeof selectedMessage ===
    "string"
  ) {
    return selectedMessage.trim();
  }

  const spanishMessage =
    value.es;

  if (
    typeof spanishMessage ===
    "string"
  ) {
    return spanishMessage.trim();
  }

  const englishMessage =
    value.en;

  return typeof englishMessage ===
    "string"
    ? englishMessage.trim()
    : "";
}

/* =========================================================
   EXTRAER ERRORES DE CAMPOS
   ========================================================= */

function extractCreativeAdminFieldErrors(
  payload:
    unknown,
  language:
    "es" | "en",
): CreativeAdminFormFieldErrors {
  if (
    !isCreativeAdminRecord(
      payload,
    )
  ) {
    return {};
  }

  const candidateCollections =
    [
      payload.issues,
      payload.validationIssues,
      payload.errors,
    ];

  const fieldErrors:
    CreativeAdminFormFieldErrors = {};

  for (
    const collection
    of candidateCollections
  ) {
    if (
      !Array.isArray(
        collection,
      )
    ) {
      continue;
    }

    for (
      const issue
      of collection
    ) {
      if (
        !isCreativeAdminRecord(
          issue,
        )
      ) {
        continue;
      }

      const fieldCandidate =
        issue.field ??
        issue.path;

      const field =
        Array.isArray(
          fieldCandidate,
        )
          ? fieldCandidate[0]
          : fieldCandidate;

      if (
        !isCreativeAdminFormFieldName(
          field,
        )
      ) {
        continue;
      }

      const message =
        readCreativeAdminLocalizedMessage(
          issue.message,
          language,
        );

      if (
        message &&
        !fieldErrors[field]
      ) {
        fieldErrors[field] =
          message;
      }
    }
  }

  return fieldErrors;
}

/* =========================================================
   EXTRAER PUBLICACIÓN GUARDADA
   ========================================================= */

function extractCreativeAdminSavedItem(
  payload:
    unknown,
  fallbackValues:
    CreativeAdminFormValues,
): CreativeAdminSavedItem | null {
  if (
    !isCreativeAdminRecord(
      payload,
    )
  ) {
    return null;
  }

  const data =
    isCreativeAdminRecord(
      payload.data,
    )
      ? payload.data
      : payload;

  const itemCandidate =
    isCreativeAdminRecord(
      data.item,
    )
      ? data.item
      : isCreativeAdminRecord(
            data.creativeItem,
          )
        ? data.creativeItem
        : data;

  const id =
    typeof itemCandidate.id ===
      "string"
      ? itemCandidate.id.trim()
      : fallbackValues.itemId ??
        "";

  const slug =
    typeof itemCandidate.slug ===
      "string"
      ? itemCandidate.slug.trim()
      : fallbackValues.slug;

  if (
    !id ||
    !slug
  ) {
    return null;
  }

  return {
    id,

    slug,

    titleEs:
      typeof itemCandidate.titleEs ===
        "string"
        ? itemCandidate.titleEs
        : fallbackValues.titleEs ||
          null,

    titleEn:
      typeof itemCandidate.titleEn ===
        "string"
        ? itemCandidate.titleEn
        : fallbackValues.titleEn ||
          null,

    status:
      typeof itemCandidate.status ===
        "string"
        ? itemCandidate.status
        : fallbackValues.status,

    contentType:
      typeof itemCandidate.contentType ===
        "string"
        ? itemCandidate.contentType
        : typeof itemCandidate.type ===
            "string"
          ? itemCandidate.type
          : fallbackValues.contentType,

    updatedAt:
      typeof itemCandidate.updatedAt ===
        "string"
        ? itemCandidate.updatedAt
        : null,
  };
}

/* =========================================================
   DETECTAR CANCELACIÓN
   ========================================================= */

function isCreativeAdminFormAbortError(
  error:
    unknown,
): boolean {
  return (
    error instanceof
      DOMException &&
    error.name ===
      "AbortError"
  );
}

/* =========================================================
   HOOK PRINCIPAL
   ========================================================= */

export function useCreativeAdminForm(
  options:
    UseCreativeAdminFormOptions = {},
): UseCreativeAdminFormResult {
  const {
    mode:
      requestedMode,

    itemId =
      null,

    initialValues =
      {},

    language =
      "es",

    enabled =
      true,

    createEndpoint =
      "/api/creative/admin/items",

    updateEndpoint =
      null,

    onSuccess,

    onError,

    onAuthenticationRequired,

    onForbidden,
  } =
    options;

  const normalizedItemId =
    normalizeCreativeAdminSingleLine(
      itemId,
    ) ||
    null;

  const mode:
    CreativeAdminFormMode =
      requestedMode ??
      (
        normalizedItemId
          ? "EDIT"
          : "CREATE"
      );

  const initialFormValues =
    createCreativeAdminFormValues(
      initialValues,
      normalizedItemId,
    );

  /* =======================================================
     VALORES Y LÍNEA BASE
     ======================================================= */

  const [
    values,
    setValues,
  ] =
    useState<CreativeAdminFormValues>(
      () =>
        initialFormValues,
    );

  const valuesRef =
    useRef<CreativeAdminFormValues>(
      initialFormValues,
    );

  const [
    baselineValues,
    setBaselineValues,
  ] =
    useState<CreativeAdminFormValues>(
      () =>
        initialFormValues,
    );

  const baselineValuesRef =
    useRef<CreativeAdminFormValues>(
      initialFormValues,
    );

  /* =======================================================
     ERRORES Y CAMPOS TOCADOS
     ======================================================= */

  const [
    errors,
    setErrors,
  ] =
    useState<CreativeAdminFormFieldErrors>(
      {},
    );

  const [
    touched,
    setTouched,
  ] =
    useState<CreativeAdminFormTouchedFields>(
      {},
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<
      string | null
    >(
      null,
    );

  /* =======================================================
     ENVÍO
     ======================================================= */

  const [
    submitStatus,
    setSubmitStatus,
  ] =
    useState<CreativeAdminFormSubmitStatus>(
      "IDLE",
    );

  const [
    lastSavedAt,
    setLastSavedAt,
  ] =
    useState<
      number | null
    >(
      null,
    );

  const [
    savedItem,
    setSavedItem,
  ] =
    useState<
      CreativeAdminSavedItem | null
    >(
      null,
    );

  /* =======================================================
     CONTROL DE SOLICITUD
     ======================================================= */

  const abortControllerRef =
    useRef<
      AbortController | null
    >(
      null,
    );

  const requestSequenceRef =
    useRef<number>(
      0,
    );

  /* =======================================================
     VALIDACIÓN ACTUAL
     ======================================================= */

  const validationResult =
    useMemo(
      () =>
        validateCreativeAdminFormValues(
          values,
          language,
        ),
      [
        values,
        language,
      ],
    );

  const payload =
    useMemo(
      () =>
        validationResult.valid
          ? createCreativeAdminFormPayload(
              values,
            )
          : null,
      [
        validationResult.valid,
        values,
      ],
    );

  /* =======================================================
     DETECTAR CAMBIOS
     ======================================================= */

  const isDirty =
    useMemo(
      () =>
        serializeCreativeAdminFormValues(
          values,
        ) !==
        serializeCreativeAdminFormValues(
          baselineValues,
        ),
      [
        baselineValues,
        values,
      ],
    );

  /* =======================================================
     LIMPIAR ERROR DE UN CAMPO
     ======================================================= */

  const clearFieldError =
    useCallback(
      (
        field:
          CreativeAdminFormFieldName,
      ): void => {
        setErrors(
          (
            currentErrors,
          ) => {
            if (
              !currentErrors[field]
            ) {
              return currentErrors;
            }

            const nextErrors = {
              ...currentErrors,
            };

            delete nextErrors[
              field
            ];

            return nextErrors;
          },
        );
      },
      [],
    );

  /* =======================================================
     CAMBIAR CAMPO
     ======================================================= */

  const setField =
    useCallback(
      <
        TField extends
          CreativeAdminFormFieldName,
      >(
        field:
          TField,
        value:
          CreativeAdminFormValues[TField],
      ): void => {
        setValues(
          (
            currentValues,
          ) => {
            const nextValues = {
              ...currentValues,

              [field]:
                value,
            } as CreativeAdminFormValues;

            valuesRef.current =
              nextValues;

            return nextValues;
          },
        );

        clearFieldError(
          field,
        );

        setErrorMessage(
          null,
        );

        setSubmitStatus(
          (
            currentStatus,
          ) =>
            currentStatus ===
              "SUCCESS" ||
            currentStatus ===
              "ERROR" ||
            currentStatus ===
              "CANCELLED"
              ? "IDLE"
              : currentStatus,
        );
      },
      [
        clearFieldError,
      ],
    );

  /* =======================================================
     CAMBIAR CAMPO DE TEXTO
     ======================================================= */

  const setTextField =
    useCallback(
      (
        field:
          CreativeAdminFormFieldName,
        value:
          string,
      ): void => {
        const currentValue =
          valuesRef.current[
            field
          ];

        if (
          typeof currentValue !==
          "string" &&
          currentValue !==
          null
        ) {
          return;
        }

        setField(
          field,
          value as never,
        );
      },
      [
        setField,
      ],
    );

  /* =======================================================
     MARCAR CAMPO COMO TOCADO
     ======================================================= */

  const markFieldTouched =
    useCallback(
      (
        field:
          CreativeAdminFormFieldName,
      ): void => {
        setTouched(
          (
            currentTouched,
          ) => ({
            ...currentTouched,

            [field]:
              true,
          }),
        );
      },
      [],
    );

  /* =======================================================
     CAMBIAR TIPO DE CONTENIDO
     ======================================================= */

  const setContentType =
    useCallback(
      (
        contentType:
          CreativeContentType,
      ): void => {
        const configuration =
          getCreativeAdminContentTypeConfiguration(
            contentType,
          );

        setValues(
          (
            currentValues,
          ) => {
            const nextValues:
              CreativeAdminFormValues = {
                ...currentValues,

                contentType,

                downloadPolicy:
                  configuration
                    .downloadPolicy,

                watermarkEnabled:
                  configuration
                    .watermarkEnabled,

                priceInput:
                  contentType ===
                    "PAID"
                    ? currentValues
                        .priceInput
                    : configuration
                        .priceInput,

                requestKind:
                  contentType ===
                    "PORTFOLIO"
                    ? currentValues
                        .requestKind
                    : configuration
                        .requestKind,
              };

            valuesRef.current =
              nextValues;

            return nextValues;
          },
        );

        setErrors(
          (
            currentErrors,
          ) => {
            const nextErrors = {
              ...currentErrors,
            };

            delete nextErrors
              .contentType;

            delete nextErrors
              .downloadPolicy;

            delete nextErrors
              .priceInput;

            delete nextErrors
              .requestKind;

            delete nextErrors
              .requestButtonLabelEs;

            delete nextErrors
              .requestButtonLabelEn;

            return nextErrors;
          },
        );

        setErrorMessage(
          null,
        );
      },
      [],
    );

  /* =======================================================
     GENERAR SLUG
     ======================================================= */

  const generateSlug =
    useCallback(
      (
        source?:
          string,
      ): string => {
        const resolvedSource =
          source ??
          valuesRef.current.titleEs ??
          "";

        const nextSlug =
          createCreativeAdminSlug(
            resolvedSource,
          );

        setField(
          "slug",
          nextSlug,
        );

        return nextSlug;
      },
      [
        setField,
      ],
    );

  /* =======================================================
     HERRAMIENTAS
     ======================================================= */

  const toggleTool =
    useCallback(
      (
        toolId:
          CreativeToolId,
      ): void => {
        const currentTools =
          valuesRef.current
            .toolIds;

        const nextTools =
          currentTools.includes(
            toolId,
          )
            ? currentTools.filter(
                (
                  currentToolId,
                ) =>
                  currentToolId !==
                  toolId,
              )
            : [
                ...currentTools,
                toolId,
              ];

        setField(
          "toolIds",
          normalizeCreativeAdminTools(
            nextTools,
          ),
        );
      },
      [
        setField,
      ],
    );

  const setTools =
    useCallback(
      (
        toolIds:
          readonly CreativeToolId[],
      ): void => {
        setField(
          "toolIds",
          normalizeCreativeAdminTools(
            toolIds,
          ),
        );
      },
      [
        setField,
      ],
    );

  /* =======================================================
     ETIQUETAS
     ======================================================= */

  const addTag =
    useCallback(
      (
        tag:
          string,
      ): boolean => {
        const normalizedTag =
          normalizeCreativeAdminTag(
            tag,
          );

        if (
          !normalizedTag
        ) {
          return false;
        }

        const currentTags =
          valuesRef.current.tags;

        const alreadyExists =
          currentTags.some(
            (
              currentTag,
            ) =>
              currentTag
                .toLocaleLowerCase(
                  "es-PE",
                ) ===
              normalizedTag
                .toLocaleLowerCase(
                  "es-PE",
                ),
          );

        if (
          alreadyExists ||
          currentTags.length >=
          CREATIVE_ADMIN_FORM_LIMITS
            .TAGS_MAXIMUM
        ) {
          return false;
        }

        setField(
          "tags",
          [
            ...currentTags,
            normalizedTag,
          ],
        );

        return true;
      },
      [
        setField,
      ],
    );

  const removeTag =
    useCallback(
      (
        tag:
          string,
      ): void => {
        const normalizedTag =
          tag
            .trim()
            .toLocaleLowerCase(
              "es-PE",
            );

        const nextTags =
          valuesRef.current.tags.filter(
            (
              currentTag,
            ) =>
              currentTag
                .toLocaleLowerCase(
                  "es-PE",
                ) !==
              normalizedTag,
          );

        setField(
          "tags",
          nextTags,
        );
      },
      [
        setField,
      ],
    );

  const setTags =
    useCallback(
      (
        tags:
          readonly string[],
      ): void => {
        setField(
          "tags",
          normalizeCreativeAdminTags(
            tags,
          ),
        );
      },
      [
        setField,
      ],
    );

  const setTagsFromText =
    useCallback(
      (
        value:
          string,
      ): void => {
        const tags =
          value.split(
            /[,;\n]+/,
          );

        setTags(
          tags,
        );
      },
      [
        setTags,
      ],
    );

  /* =======================================================
     VALIDAR MANUALMENTE
     ======================================================= */

  const validate =
    useCallback(
      (): CreativeAdminFormValidationResult => {
        const result =
          validateCreativeAdminFormValues(
            valuesRef.current,
            language,
          );

        setErrors(
          result.errors,
        );

        const touchedFields:
          CreativeAdminFormTouchedFields = {};

        CREATIVE_ADMIN_FORM_FIELDS.forEach(
          (
            field,
          ) => {
            touchedFields[field] =
              true;
          },
        );

        setTouched(
          touchedFields,
        );

        return result;
      },
      [
        language,
      ],
    );

  /* =======================================================
     CANCELAR ENVÍO
     ======================================================= */

  const cancelSubmit =
    useCallback(
      (): void => {
        abortControllerRef.current?.abort();

        abortControllerRef.current =
          null;

        requestSequenceRef.current +=
          1;

        setSubmitStatus(
          "CANCELLED",
        );

        setErrorMessage(
          null,
        );
      },
      [],
    );

  /* =======================================================
     ENVIAR FORMULARIO
     ======================================================= */

  const submit =
    useCallback(
      async (): Promise<
        CreativeAdminSavedItem | null
      > => {
        if (
          !enabled ||
          abortControllerRef.current
        ) {
          return null;
        }

        setSubmitStatus(
          "VALIDATING",
        );

        setErrorMessage(
          null,
        );

        const currentValues =
          valuesRef.current;

        const validation =
          validateCreativeAdminFormValues(
            currentValues,
            language,
          );

        setErrors(
          validation.errors,
        );

        if (
          !validation.valid
        ) {
          const touchedFields:
            CreativeAdminFormTouchedFields = {};

          CREATIVE_ADMIN_FORM_FIELDS.forEach(
            (
              field,
            ) => {
              touchedFields[field] =
                true;
            },
          );

          setTouched(
            touchedFields,
          );

          const message =
            language ===
              "en"
              ? "Review the highlighted fields before saving."
              : "Revisa los campos marcados antes de guardar.";

          setErrorMessage(
            message,
          );

          setSubmitStatus(
            "ERROR",
          );

          return null;
        }

        const normalizedValues =
          normalizeCreativeAdminFormValues(
            currentValues,
          );

        const requestPayload =
          createCreativeAdminFormPayload(
            normalizedValues,
          );

        if (
          !requestPayload
        ) {
          const message =
            language ===
              "en"
              ? "The form could not be prepared."
              : "No fue posible preparar el formulario.";

          setErrorMessage(
            message,
          );

          setSubmitStatus(
            "ERROR",
          );

          return null;
        }

        const resolvedItemId =
          normalizedValues.itemId ??
          normalizedItemId;

        const resolvedEndpoint =
          mode ===
          "CREATE"
            ? createEndpoint
            : updateEndpoint ??
              (
                resolvedItemId
                  ? `/api/creative/admin/items/${encodeURIComponent(resolvedItemId)}`
                  : ""
              );

        if (
          !resolvedEndpoint
        ) {
          const message =
            language ===
              "en"
              ? "A valid item identifier is required to edit this design."
              : "Se necesita un identificador válido para editar este diseño.";

          setErrorMessage(
            message,
          );

          setSubmitStatus(
            "ERROR",
          );

          return null;
        }

        const controller =
          new AbortController();

        abortControllerRef.current =
          controller;

        const sequence =
          requestSequenceRef.current +
          1;

        requestSequenceRef.current =
          sequence;

        setSubmitStatus(
          "SUBMITTING",
        );

        try {
          const response =
            await fetch(
              resolvedEndpoint,
              {
                method:
                  mode ===
                  "CREATE"
                    ? "POST"
                    : "PATCH",

                headers: {
                  Accept:
                    "application/json",

                  "Content-Type":
                    "application/json",
                },

                credentials:
                  "same-origin",

                cache:
                  "no-store",

                body:
                  JSON.stringify(
                    requestPayload,
                  ),

                signal:
                  controller.signal,
              },
            );

          const responsePayload:
            unknown =
              await response
                .json()
                .catch(
                  () =>
                    null,
                );

          if (
            sequence !==
            requestSequenceRef.current
          ) {
            return null;
          }

          if (
            response.status ===
            401
          ) {
            setSubmitStatus(
              "ERROR",
            );

            const message =
              language ===
                "en"
                ? "Your administrator session has expired."
                : "Tu sesión de administrador ha vencido.";

            setErrorMessage(
              message,
            );

            onAuthenticationRequired?.();

            return null;
          }

          if (
            response.status ===
            403
          ) {
            setSubmitStatus(
              "ERROR",
            );

            const message =
              language ===
                "en"
                ? "You do not have permission to perform this action."
                : "No tienes permiso para realizar esta acción.";

            setErrorMessage(
              message,
            );

            onForbidden?.();

            return null;
          }

          if (
            !response.ok
          ) {
            const serverFieldErrors =
              extractCreativeAdminFieldErrors(
                responsePayload,
                language,
              );

            const responseRecord =
              isCreativeAdminRecord(
                responsePayload,
              )
                ? responsePayload
                : null;

            const serverMessage =
              readCreativeAdminLocalizedMessage(
                responseRecord
                  ?.message,
                language,
              );

            const fallbackMessage =
              language ===
                "en"
                ? "The design could not be saved."
                : "No fue posible guardar el diseño.";

            const resolvedMessage =
              serverMessage ||
              fallbackMessage;

            setErrors(
              serverFieldErrors,
            );

            setErrorMessage(
              resolvedMessage,
            );

            setSubmitStatus(
              "ERROR",
            );

            onError?.({
              mode,

              message:
                resolvedMessage,

              fieldErrors:
                serverFieldErrors,

              statusCode:
                response.status,

              error:
                responsePayload,
            });

            return null;
          }

          const nextSavedItem =
            extractCreativeAdminSavedItem(
              responsePayload,
              normalizedValues,
            );

          if (
            !nextSavedItem
          ) {
            throw new Error(
              language ===
                "en"
                ? "The server response does not contain the saved design."
                : "La respuesta del servidor no contiene el diseño guardado.",
            );
          }

          const definitiveValues:
            CreativeAdminFormValues = {
              ...normalizedValues,

              itemId:
                nextSavedItem.id,

              slug:
                nextSavedItem.slug,
            };

          valuesRef.current =
            definitiveValues;

          baselineValuesRef.current =
            definitiveValues;

          setValues(
            definitiveValues,
          );

          setBaselineValues(
            definitiveValues,
          );

          setErrors(
            {},
          );

          setTouched(
            {},
          );

          setErrorMessage(
            null,
          );

          setSavedItem(
            nextSavedItem,
          );

          const savedAt =
            Date.now();

          setLastSavedAt(
            savedAt,
          );

          setSubmitStatus(
            "SUCCESS",
          );

          if (
            onSuccess
          ) {
            try {
              await onSuccess({
                mode,

                item:
                  nextSavedItem,

                values:
                  definitiveValues,

                payload:
                  requestPayload,

                savedAt,
              });
            } catch {
              /*
               * El diseño ya fue guardado correctamente.
               * Un error del callback no revierte la operación.
               */
            }
          }

          return nextSavedItem;
        } catch (
          error
        ) {
          if (
            isCreativeAdminFormAbortError(
              error,
            )
          ) {
            if (
              sequence ===
              requestSequenceRef.current
            ) {
              setSubmitStatus(
                "CANCELLED",
              );

              setErrorMessage(
                null,
              );
            }

            return null;
          }

          if (
            sequence !==
            requestSequenceRef.current
          ) {
            return null;
          }

          const fallbackMessage =
            language ===
              "en"
              ? "The design could not be saved."
              : "No fue posible guardar el diseño.";

          const resolvedMessage =
            error instanceof
              Error &&
            error.message.trim()
              ? error.message
              : fallbackMessage;

          setSubmitStatus(
            "ERROR",
          );

          setErrorMessage(
            resolvedMessage,
          );

          onError?.({
            mode,

            message:
              resolvedMessage,

            fieldErrors:
              {},

            statusCode:
              null,

            error,
          });

          return null;
        } finally {
          if (
            sequence ===
              requestSequenceRef.current &&
            abortControllerRef.current ===
              controller
          ) {
            abortControllerRef.current =
              null;
          }
        }
      },
      [
        createEndpoint,
        enabled,
        language,
        mode,
        normalizedItemId,
        onAuthenticationRequired,
        onError,
        onForbidden,
        onSuccess,
        updateEndpoint,
      ],
    );

  /* =======================================================
     REINTENTAR
     ======================================================= */

  const retry =
    useCallback(
      async (): Promise<
        CreativeAdminSavedItem | null
      > => {
        return submit();
      },
      [
        submit,
      ],
    );

  /* =======================================================
     REEMPLAZAR VALORES
     ======================================================= */

  const replaceValues =
    useCallback(
      (
        nextValues:
          Partial<CreativeAdminFormValues>,
        setAsBaseline =
          true,
      ): void => {
        abortControllerRef.current?.abort();

        abortControllerRef.current =
          null;

        requestSequenceRef.current +=
          1;

        const mergedValues =
          createCreativeAdminFormValues(
            {
              ...valuesRef.current,
              ...nextValues,
            },
            nextValues.itemId ??
            normalizedItemId,
          );

        valuesRef.current =
          mergedValues;

        setValues(
          mergedValues,
        );

        if (
          setAsBaseline
        ) {
          baselineValuesRef.current =
            mergedValues;

          setBaselineValues(
            mergedValues,
          );
        }

        setErrors(
          {},
        );

        setTouched(
          {},
        );

        setErrorMessage(
          null,
        );

        setSavedItem(
          null,
        );

        setSubmitStatus(
          "IDLE",
        );
      },
      [
        normalizedItemId,
      ],
    );

  /* =======================================================
     RESTABLECER
     ======================================================= */

  const reset =
    useCallback(
      (): void => {
        abortControllerRef.current?.abort();

        abortControllerRef.current =
          null;

        requestSequenceRef.current +=
          1;

        const resetValues = {
          ...baselineValuesRef.current,

          toolIds: [
            ...baselineValuesRef.current
              .toolIds,
          ],

          tags: [
            ...baselineValuesRef.current
              .tags,
          ],
        };

        valuesRef.current =
          resetValues;

        setValues(
          resetValues,
        );

        setErrors(
          {},
        );

        setTouched(
          {},
        );

        setErrorMessage(
          null,
        );

        setSavedItem(
          null,
        );

        setSubmitStatus(
          "IDLE",
        );
      },
      [],
    );

  /* =======================================================
     LIMPIAR ERRORES
     ======================================================= */

  const clearErrors =
    useCallback(
      (): void => {
        setErrors(
          {},
        );

        setErrorMessage(
          null,
        );

        setSubmitStatus(
          (
            currentStatus,
          ) =>
            currentStatus ===
            "ERROR"
              ? "IDLE"
              : currentStatus,
        );
      },
      [],
    );

  /* =======================================================
     RESTABLECER ESTADO DEL ENVÍO
     ======================================================= */

  const resetSubmitStatus =
    useCallback(
      (): void => {
        if (
          abortControllerRef.current
        ) {
          return;
        }

        setSubmitStatus(
          "IDLE",
        );

        setErrorMessage(
          null,
        );
      },
      [],
    );

  /* =======================================================
     CANCELAR AL DESMONTAR
     ======================================================= */

  useEffect(
    () => {
      return () => {
        abortControllerRef.current?.abort();
      };
    },
    [],
  );

  /* =======================================================
     INFORMACIÓN DERIVADA
     ======================================================= */

  const submitting =
    submitStatus ===
    "SUBMITTING";

  const validating =
    submitStatus ===
    "VALIDATING";

  const succeeded =
    submitStatus ===
    "SUCCESS";

  const cancelled =
    submitStatus ===
    "CANCELLED";

  const hasError =
    submitStatus ===
      "ERROR" ||
    errorMessage !==
      null;

  const isValid =
    validationResult.valid;

  const errorCount =
    validationResult.errorCount;

  const canSubmit =
    enabled &&
    !submitting &&
    !validating &&
    isValid &&
    (
      mode ===
        "CREATE" ||
      isDirty
    );

  /* =======================================================
     RETORNO
     ======================================================= */

  return {
    mode,

    values,

    baselineValues,

    errors,

    validationErrors:
      validationResult.errors,

    touched,

    submitStatus,

    submitting,

    validating,

    succeeded,

    cancelled,

    hasError,

    errorMessage,

    isDirty,

    isValid,

    canSubmit,

    errorCount,

    lastSavedAt,

    savedItem,

    payload,

    setField,

    setTextField,

    markFieldTouched,

    clearFieldError,

    setContentType,

    generateSlug,

    toggleTool,

    setTools,

    addTag,

    removeTag,

    setTags,

    setTagsFromText,

    validate,

    submit,

    retry,

    cancelSubmit,

    reset,

    replaceValues,

    clearErrors,

    resetSubmitStatus,
  };
}

export default useCreativeAdminForm;