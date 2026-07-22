"use client";

/*
 * Formulario administrativo del módulo Diseño / Creative.
 *
 * Permite:
 * - Crear y editar publicaciones.
 * - Registrar información en español e inglés.
 * - Elegir FREE, PAID o PORTFOLIO.
 * - Configurar precio, categoría, herramientas y etiquetas.
 * - Subir vista previa y archivo original.
 * - Configurar marca de agua y estado de publicación.
 *
 * No contiene solicitudes HTTP ni acceso directo a Prisma.
 * El componente padre controla el guardado definitivo.
 */

import {
  useId,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

import {
  CreativeUploadField,
} from "@/components/molecules/creative/CreativeUploadField";

import type {
  CreativeContentType,
  CreativeCurrency,
  CreativeItemStatus,
} from "@/types/creative/creative-item.types";

/* =========================================================
   TIPOS GENERALES
   ========================================================= */

export type CreativeAdminFormLanguage =
  | "es"
  | "en";

export type CreativeAdminFormMode =
  | "CREATE"
  | "EDIT";

export type CreativeAdminFormSize =
  | "md"
  | "lg";

export type CreativeAdminFormVariant =
  | "surface"
  | "dark";

/* =========================================================
   OPCIONES
   ========================================================= */

export interface CreativeAdminFormOption {
  value:
    string;

  label:
    string;

  disabled?:
    boolean;
}

/* =========================================================
   VALORES DEL FORMULARIO
   ========================================================= */

export interface CreativeAdminFormValues {
  titleEs:
    string;

  titleEn:
    string;

  descriptionEs:
    string;

  descriptionEn:
    string;

  slug:
    string;

  contentType:
    CreativeContentType;

  status:
    CreativeItemStatus;

  categoryId:
    string;

  authorName:
    string;

  price:
    string;

  currency:
    CreativeCurrency;

  resolution:
    string;

  formats:
    string;

  license:
    string;

  tools:
    string[];

  tags:
    string;

  featured:
    boolean;

  watermarkEnabled:
    boolean;

  downloadEnabled:
    boolean;

  requestEnabled:
    boolean;
}

/* =========================================================
   ERRORES
   ========================================================= */

export interface CreativeAdminFormErrors {
  titleEs?:
    string;

  descriptionEs?:
    string;

  categoryId?:
    string;

  price?:
    string;

  previewFiles?:
    string;

  originalFiles?:
    string;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeAdminFormProps
  extends Omit<
    HTMLAttributes<HTMLFormElement>,
    "children" | "onSubmit"
  > {
  mode?:
    CreativeAdminFormMode;

  language?:
    CreativeAdminFormLanguage;

  size?:
    CreativeAdminFormSize;

  variant?:
    CreativeAdminFormVariant;

  values?:
    CreativeAdminFormValues;

  defaultValues?:
    Partial<CreativeAdminFormValues>;

  onValuesChange?:
    (
      values:
        CreativeAdminFormValues,
    ) => void;

  onSubmitForm?:
    (
      values:
        CreativeAdminFormValues,
      files: {
        previewFiles:
          File[];

        originalFiles:
          File[];
      },
    ) => void | Promise<void>;

  onSubmitted?:
    () => void;

  onSubmitError?:
    (
      error:
        unknown,
    ) => void;

  categories?:
    CreativeAdminFormOption[];

  toolOptions?:
    CreativeAdminFormOption[];

  previewFiles?:
    File[];

  originalFiles?:
    File[];

  onPreviewFilesChange?:
    (
      files:
        File[],
    ) => void;

  onOriginalFilesChange?:
    (
      files:
        File[],
    ) => void;

  submitting?:
    boolean;

  disabled?:
    boolean;

  readOnly?:
    boolean;

  requireCategory?:
    boolean;

  requirePreviewFile?:
    boolean;

  requireOriginalFile?:
    boolean;

  showOriginalUpload?:
    boolean;

  showAdvancedSettings?:
    boolean;

  heading?:
    string | null;

  description?:
    string | null;

  submitLabel?:
    string | null;

  cancelLabel?:
    string | null;

  error?:
    string | null;

  successMessage?:
    string | null;

  onCancel?:
    () => void;

  headerContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  headerClassName?:
    string;

  contentClassName?:
    string;

  sectionClassName?:
    string;

  actionsClassName?:
    string;

  submitButtonClassName?:
    string;

  cancelButtonClassName?:
    string;
}

/* =========================================================
   VALORES PREDETERMINADOS
   ========================================================= */

const CREATIVE_ADMIN_FORM_DEFAULT_VALUES:
  CreativeAdminFormValues = {
    titleEs:
      "",

    titleEn:
      "",

    descriptionEs:
      "",

    descriptionEn:
      "",

    slug:
      "",

    contentType:
      "FREE",

    status:
      "DRAFT",

    categoryId:
      "",

    authorName:
      "FIXORA",

    price:
      "",

    currency:
      "PEN" as CreativeCurrency,

    resolution:
      "",

    formats:
      "",

    license:
      "",

    tools:
      [],

    tags:
      "",

    featured:
      false,

    watermarkEnabled:
      false,

    downloadEnabled:
      true,

    requestEnabled:
      false,
  };

/* =========================================================
   VALORES PERMITIDOS
   ========================================================= */

const CREATIVE_CONTENT_TYPES = [
  "FREE",
  "PAID",
  "PORTFOLIO",
] as const satisfies readonly CreativeContentType[];

const CREATIVE_ITEM_STATUSES = [
  "DRAFT",
  "PUBLISHED",
  "HIDDEN",
  "ARCHIVED",
] as const satisfies readonly CreativeItemStatus[];

const CREATIVE_CURRENCIES = [
  "PEN",
  "USD",
] as const;

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_ADMIN_FORM_COPY = {
  es: {
    createHeading:
      "Agregar nuevo diseño",

    editHeading:
      "Editar diseño",

    createDescription:
      "Completa la información para registrar una nueva publicación en el catálogo.",

    editDescription:
      "Actualiza la información, archivos y configuración de la publicación.",

    basicInformation:
      "Información principal",

    publicationSettings:
      "Configuración de publicación",

    files:
      "Archivos del diseño",

    advanced:
      "Configuración adicional",

    titleEs:
      "Título en español",

    titleEn:
      "Título en inglés",

    descriptionEs:
      "Descripción en español",

    descriptionEn:
      "Descripción en inglés",

    slug:
      "Identificador de la URL",

    slugPlaceholder:
      "ejemplo-diseno-creativo",

    contentType:
      "Tipo de contenido",

    free:
      "Gratis",

    paid:
      "Premium",

    portfolio:
      "Portafolio",

    freeDescription:
      "Visible y descargable gratuitamente.",

    paidDescription:
      "Visible para todos y disponible mediante compra.",

    portfolioDescription:
      "Solo demostración y solicitud de trabajos similares.",

    status:
      "Estado",

    draft:
      "Borrador",

    published:
      "Publicado",

    hidden:
      "Oculto",

    archived:
      "Archivado",

    category:
      "Categoría",

    selectCategory:
      "Selecciona una categoría",

    author:
      "Autor",

    price:
      "Precio",

    currency:
      "Moneda",

    resolution:
      "Resolución",

    resolutionPlaceholder:
      "Ejemplo: 1920 × 1080 px",

    formats:
      "Formatos disponibles",

    formatsPlaceholder:
      "Ejemplo: PNG, JPG, PSD",

    license:
      "Licencia",

    licensePlaceholder:
      "Ejemplo: Uso personal y comercial",

    tools:
      "Herramientas utilizadas",

    tags:
      "Etiquetas",

    tagsPlaceholder:
      "Ejemplo: publicidad, redes sociales, flyer",

    preview:
      "Vista previa pública",

    previewDescription:
      "Imagen que será visible en el catálogo y en el visor.",

    original:
      "Archivo original protegido",

    originalDescription:
      "Archivo entregable o fuente que no debe mostrarse públicamente.",

    featured:
      "Marcar como diseño destacado",

    watermark:
      "Aplicar marca de agua en la vista previa",

    download:
      "Permitir descarga cuando corresponda",

    request:
      "Permitir solicitudes de diseños similares",

    save:
      "Guardar diseño",

    create:
      "Crear diseño",

    saving:
      "Guardando diseño...",

    cancel:
      "Cancelar",

    titleRequired:
      "El título en español es obligatorio.",

    descriptionRequired:
      "La descripción en español es obligatoria.",

    categoryRequired:
      "Selecciona una categoría.",

    priceRequired:
      "Ingresa un precio mayor que cero.",

    previewRequired:
      "Selecciona una imagen de vista previa.",

    originalRequired:
      "Selecciona el archivo original.",

    invalidForm:
      "Revisa los campos señalados antes de guardar.",

    freePrice:
      "Las publicaciones gratuitas no requieren precio.",

    portfolioPrice:
      "Las publicaciones de portafolio no se venden directamente.",
  },

  en: {
    createHeading:
      "Add new design",

    editHeading:
      "Edit design",

    createDescription:
      "Complete the information to register a new catalog publication.",

    editDescription:
      "Update the publication information, files and settings.",

    basicInformation:
      "Main information",

    publicationSettings:
      "Publication settings",

    files:
      "Design files",

    advanced:
      "Additional settings",

    titleEs:
      "Spanish title",

    titleEn:
      "English title",

    descriptionEs:
      "Spanish description",

    descriptionEn:
      "English description",

    slug:
      "URL identifier",

    slugPlaceholder:
      "creative-design-example",

    contentType:
      "Content type",

    free:
      "Free",

    paid:
      "Premium",

    portfolio:
      "Portfolio",

    freeDescription:
      "Publicly visible and available as a free download.",

    paidDescription:
      "Visible to everyone and available through purchase.",

    portfolioDescription:
      "Showcase only with requests for similar work.",

    status:
      "Status",

    draft:
      "Draft",

    published:
      "Published",

    hidden:
      "Hidden",

    archived:
      "Archived",

    category:
      "Category",

    selectCategory:
      "Select a category",

    author:
      "Author",

    price:
      "Price",

    currency:
      "Currency",

    resolution:
      "Resolution",

    resolutionPlaceholder:
      "Example: 1920 × 1080 px",

    formats:
      "Available formats",

    formatsPlaceholder:
      "Example: PNG, JPG, PSD",

    license:
      "License",

    licensePlaceholder:
      "Example: Personal and commercial use",

    tools:
      "Tools used",

    tags:
      "Tags",

    tagsPlaceholder:
      "Example: advertising, social media, flyer",

    preview:
      "Public preview",

    previewDescription:
      "Image displayed in the catalog and design viewer.",

    original:
      "Protected original file",

    originalDescription:
      "Deliverable or source file that must not be publicly exposed.",

    featured:
      "Mark as featured design",

    watermark:
      "Apply watermark to the preview",

    download:
      "Allow download when applicable",

    request:
      "Allow similar design requests",

    save:
      "Save design",

    create:
      "Create design",

    saving:
      "Saving design...",

    cancel:
      "Cancel",

    titleRequired:
      "The Spanish title is required.",

    descriptionRequired:
      "The Spanish description is required.",

    categoryRequired:
      "Select a category.",

    priceRequired:
      "Enter a price greater than zero.",

    previewRequired:
      "Select a preview image.",

    originalRequired:
      "Select the original file.",

    invalidForm:
      "Review the highlighted fields before saving.",

    freePrice:
      "Free publications do not require a price.",

    portfolioPrice:
      "Portfolio publications are not sold directly.",
  },
} as const;

/* =========================================================
   CLASES
   ========================================================= */

const CREATIVE_ADMIN_FORM_VARIANT_CLASSES = {
  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "text-zinc-950",
    "shadow-[0_18px_55px_rgba(15,23,42,0.10)]",
    "backdrop-blur-xl",

    "dark:border-white/10",
    "dark:bg-zinc-950/88",
    "dark:text-white",
    "dark:shadow-[0_20px_60px_rgba(0,0,0,0.34)]",
  ].join(
    " ",
  ),

  dark: [
    "border-white/10",
    "bg-black/70",
    "text-white",
    "shadow-[0_20px_60px_rgba(0,0,0,0.42)]",
    "backdrop-blur-xl",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeAdminFormVariant,
  string
>;

const CREATIVE_ADMIN_FORM_SIZE_CLASSES = {
  md: {
    root:
      "rounded-2xl",

    section:
      "p-4 sm:p-5",

    heading:
      "text-xl sm:text-2xl",

    input:
      "min-h-11 rounded-xl px-4 py-2.5 text-sm",

    textarea:
      "min-h-32 rounded-xl px-4 py-3 text-sm",

    button:
      "min-h-11 rounded-xl px-5 py-3 text-sm",
  },

  lg: {
    root:
      "rounded-3xl",

    section:
      "p-5 sm:p-6",

    heading:
      "text-2xl sm:text-3xl",

    input:
      "min-h-12 rounded-xl px-5 py-3 text-base",

    textarea:
      "min-h-40 rounded-2xl px-5 py-4 text-base",

    button:
      "min-h-12 rounded-xl px-6 py-3.5 text-base",
  },
} as const satisfies Record<
  CreativeAdminFormSize,
  {
    root:
      string;

    section:
      string;

    heading:
      string;

    input:
      string;

    textarea:
      string;

    button:
      string;
  }
>;

const CREATIVE_ADMIN_FORM_FIELD_CLASSES = [
  "block",
  "w-full",
  "border",
  "border-zinc-200/90",
  "bg-white/90",
  "text-zinc-950",
  "placeholder:text-zinc-400",
  "outline-none",
  "transition-all",
  "duration-200",

  "focus:border-emerald-500/45",
  "focus:ring-2",
  "focus:ring-emerald-500/15",

  "disabled:cursor-not-allowed",
  "disabled:opacity-55",

  "dark:border-white/10",
  "dark:bg-zinc-900/85",
  "dark:text-white",
  "dark:placeholder:text-zinc-500",

  "dark:focus:border-emerald-400/45",
  "dark:focus:ring-emerald-400/15",
].join(
  " ",
);

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeAdminFormClasses(
  ...classes:
    Array<
      string | false | null | undefined
    >
): string {
  return classes
    .filter(
      Boolean,
    )
    .join(
      " ",
    );
}

function normalizeCreativeAdminFormText(
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
      /\s+/g,
      " ",
    )
    .trim();
}

function normalizeCreativeAdminFormDescription(
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
    );
}

function normalizeCreativeAdminFormStringList(
  values:
    string[] | null | undefined,
): string[] {
  if (
    !Array.isArray(
      values,
    )
  ) {
    return [];
  }

  return Array.from(
    new Set(
      values
        .map(
          normalizeCreativeAdminFormText,
        )
        .filter(
          Boolean,
        ),
    ),
  );
}

function normalizeCreativeAdminFormValues(
  values:
    Partial<CreativeAdminFormValues> | null | undefined,
): CreativeAdminFormValues {
  const contentType =
    CREATIVE_CONTENT_TYPES.includes(
      values?.contentType as CreativeContentType,
    )
      ? (
          values?.contentType as CreativeContentType
        )
      : CREATIVE_ADMIN_FORM_DEFAULT_VALUES.contentType;

  const status =
    CREATIVE_ITEM_STATUSES.includes(
      values?.status as CreativeItemStatus,
    )
      ? (
          values?.status as CreativeItemStatus
        )
      : CREATIVE_ADMIN_FORM_DEFAULT_VALUES.status;

  const currency =
    CREATIVE_CURRENCIES.includes(
      values?.currency as
        (typeof CREATIVE_CURRENCIES)[number],
    )
      ? (
          values?.currency as CreativeCurrency
        )
      : CREATIVE_ADMIN_FORM_DEFAULT_VALUES.currency;

  return {
    titleEs:
      typeof values?.titleEs ===
        "string"
        ? values.titleEs
        : "",

    titleEn:
      typeof values?.titleEn ===
        "string"
        ? values.titleEn
        : "",

    descriptionEs:
      typeof values?.descriptionEs ===
        "string"
        ? values.descriptionEs
        : "",

    descriptionEn:
      typeof values?.descriptionEn ===
        "string"
        ? values.descriptionEn
        : "",

    slug:
      typeof values?.slug ===
        "string"
        ? values.slug
        : "",

    contentType,

    status,

    categoryId:
      typeof values?.categoryId ===
        "string"
        ? values.categoryId
        : "",

    authorName:
      typeof values?.authorName ===
        "string"
        ? values.authorName
        : "FIXORA",

    price:
      typeof values?.price ===
        "string"
        ? values.price
        : "",

    currency,

    resolution:
      typeof values?.resolution ===
        "string"
        ? values.resolution
        : "",

    formats:
      typeof values?.formats ===
        "string"
        ? values.formats
        : "",

    license:
      typeof values?.license ===
        "string"
        ? values.license
        : "",

    tools:
      normalizeCreativeAdminFormStringList(
        values?.tools,
      ),

    tags:
      typeof values?.tags ===
        "string"
        ? values.tags
        : "",

    featured:
      Boolean(
        values?.featured,
      ),

    watermarkEnabled:
      Boolean(
        values?.watermarkEnabled,
      ),

    downloadEnabled:
      values?.downloadEnabled !==
        false,

    requestEnabled:
      Boolean(
        values?.requestEnabled,
      ),
  };
}

function isCreativeContentType(
  value:
    string,
): value is CreativeContentType {
  return CREATIVE_CONTENT_TYPES.includes(
    value as CreativeContentType,
  );
}

function isCreativeItemStatus(
  value:
    string,
): value is CreativeItemStatus {
  return CREATIVE_ITEM_STATUSES.includes(
    value as CreativeItemStatus,
  );
}

function isCreativeCurrency(
  value:
    string,
): value is CreativeCurrency {
  return CREATIVE_CURRENCIES.includes(
    value as
      (typeof CREATIVE_CURRENCIES)[number],
  );
}

/* =========================================================
   VALIDACIÓN
   ========================================================= */

function validateCreativeAdminForm(
  values:
    CreativeAdminFormValues,
  previewFiles:
    File[],
  originalFiles:
    File[],
  options: {
    requireCategory:
      boolean;

    requirePreviewFile:
      boolean;

    requireOriginalFile:
      boolean;

    showOriginalUpload:
      boolean;
  },
  language:
    CreativeAdminFormLanguage,
): CreativeAdminFormErrors {
  const copy =
    CREATIVE_ADMIN_FORM_COPY[
      language
    ];

  const errors:
    CreativeAdminFormErrors = {};

  if (
    !normalizeCreativeAdminFormText(
      values.titleEs,
    )
  ) {
    errors.titleEs =
      copy.titleRequired;
  }

  if (
    !normalizeCreativeAdminFormText(
      values.descriptionEs,
    )
  ) {
    errors.descriptionEs =
      copy.descriptionRequired;
  }

  if (
    options.requireCategory &&
    !normalizeCreativeAdminFormText(
      values.categoryId,
    )
  ) {
    errors.categoryId =
      copy.categoryRequired;
  }

  if (
    values.contentType ===
    "PAID"
  ) {
    const parsedPrice =
      Number(
        values.price
          .replace(
            ",",
            ".",
          )
          .trim(),
      );

    if (
      !Number.isFinite(
        parsedPrice,
      ) ||
      parsedPrice <=
        0
    ) {
      errors.price =
        copy.priceRequired;
    }
  }

  if (
    options.requirePreviewFile &&
    previewFiles.length ===
      0
  ) {
    errors.previewFiles =
      copy.previewRequired;
  }

  if (
    options.showOriginalUpload &&
    options.requireOriginalFile &&
    originalFiles.length ===
      0
  ) {
    errors.originalFiles =
      copy.originalRequired;
  }

  return errors;
}

/* =========================================================
   COMPONENTE DE CAMPO
   ========================================================= */

interface CreativeAdminFieldProps {
  label:
    string;

  required?:
    boolean;

  error?:
    string;

  children:
    ReactNode;
}

function CreativeAdminField({
  label,
  required =
    false,
  error,
  children,
}: CreativeAdminFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-1">
        <span className="text-sm font-bold text-zinc-900 dark:text-white">
          {label}
        </span>

        {required ? (
          <span
            aria-hidden="true"
            className="text-red-500"
          >
            *
          </span>
        ) : null}
      </div>

      <div className="mt-2">
        {children}
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeAdminForm({
  mode =
    "CREATE",

  language =
    "es",

  size =
    "md",

  variant =
    "surface",

  values,

  defaultValues =
    {},

  onValuesChange,

  onSubmitForm,

  onSubmitted,

  onSubmitError,

  categories =
    [],

  toolOptions =
    [],

  previewFiles =
    [],

  originalFiles =
    [],

  onPreviewFilesChange,

  onOriginalFilesChange,

  submitting =
    false,

  disabled =
    false,

  readOnly =
    false,

  requireCategory =
    true,

  requirePreviewFile =
    false,

  requireOriginalFile =
    false,

  showOriginalUpload =
    true,

  showAdvancedSettings =
    true,

  heading =
    null,

  description =
    null,

  submitLabel =
    null,

  cancelLabel =
    null,

  error =
    null,

  successMessage =
    null,

  onCancel,

  headerContent =
    null,

  footerContent =
    null,

  headerClassName,

  contentClassName,

  sectionClassName,

  actionsClassName,

  submitButtonClassName,

  cancelButtonClassName,

  className,

  "aria-label":
    ariaLabel,

  ...formProps
}: CreativeAdminFormProps) {
  const generatedId =
    useId();

  const copy =
    CREATIVE_ADMIN_FORM_COPY[
      language
    ];

  const controlled =
    values !==
    undefined;

  const [
    internalValues,
    setInternalValues,
  ] =
    useState<CreativeAdminFormValues>(
      () =>
        normalizeCreativeAdminFormValues({
          ...CREATIVE_ADMIN_FORM_DEFAULT_VALUES,
          ...defaultValues,
        }),
    );

  const [
    submitAttempted,
    setSubmitAttempted,
  ] =
    useState<boolean>(
      false,
    );

  const [
    internalError,
    setInternalError,
  ] =
    useState<string>(
      "",
    );

  const currentValues =
    controlled
      ? normalizeCreativeAdminFormValues(
          values,
        )
      : internalValues;

  const resolvedHeading =
    normalizeCreativeAdminFormText(
      heading,
    ) ||
    (
      mode ===
        "CREATE"
        ? copy.createHeading
        : copy.editHeading
    );

  const resolvedDescription =
    normalizeCreativeAdminFormText(
      description,
    ) ||
    (
      mode ===
        "CREATE"
        ? copy.createDescription
        : copy.editDescription
    );

  const resolvedSubmitLabel =
    normalizeCreativeAdminFormText(
      submitLabel,
    ) ||
    (
      mode ===
        "CREATE"
        ? copy.create
        : copy.save
    );

  const resolvedCancelLabel =
    normalizeCreativeAdminFormText(
      cancelLabel,
    ) ||
    copy.cancel;

  const normalizedExternalError =
    normalizeCreativeAdminFormText(
      error,
    );

  const normalizedSuccessMessage =
    normalizeCreativeAdminFormText(
      successMessage,
    );

  const validationErrors =
    validateCreativeAdminForm(
      currentValues,
      previewFiles,
      originalFiles,
      {
        requireCategory,
        requirePreviewFile,
        requireOriginalFile,
        showOriginalUpload,
      },
      language,
    );

  const hasValidationErrors =
    Object.keys(
      validationErrors,
    ).length >
    0;

  const interactionDisabled =
    disabled ||
    submitting;

  const formDisabled =
    interactionDisabled ||
    readOnly;

  const headingId =
    `creative-admin-form-heading-${generatedId}`;

  const descriptionId =
    `creative-admin-form-description-${generatedId}`;

  const updateValues =
    (
      nextValues:
        CreativeAdminFormValues,
    ): void => {
      if (
        !controlled
      ) {
        setInternalValues(
          nextValues,
        );
      }

      onValuesChange?.(
        nextValues,
      );
    };

  const updateField =
    <Key extends keyof CreativeAdminFormValues>(
      field:
        Key,
      fieldValue:
        CreativeAdminFormValues[Key],
    ): void => {
      updateValues({
        ...currentValues,
        [field]:
          fieldValue,
      });
    };

  const handleTextChange =
    (
      event:
        ChangeEvent<
          HTMLInputElement |
          HTMLTextAreaElement
        >,
    ): void => {
      const {
        name,
        value:
          nextValue,
      } =
        event.currentTarget;

      if (
        name ===
        "titleEs"
      ) {
        updateField(
          "titleEs",
          nextValue,
        );
      } else if (
        name ===
        "titleEn"
      ) {
        updateField(
          "titleEn",
          nextValue,
        );
      } else if (
        name ===
        "descriptionEs"
      ) {
        updateField(
          "descriptionEs",
          nextValue,
        );
      } else if (
        name ===
        "descriptionEn"
      ) {
        updateField(
          "descriptionEn",
          nextValue,
        );
      } else if (
        name ===
        "slug"
      ) {
        updateField(
          "slug",
          nextValue,
        );
      } else if (
        name ===
        "authorName"
      ) {
        updateField(
          "authorName",
          nextValue,
        );
      } else if (
        name ===
        "price"
      ) {
        updateField(
          "price",
          nextValue,
        );
      } else if (
        name ===
        "resolution"
      ) {
        updateField(
          "resolution",
          nextValue,
        );
      } else if (
        name ===
        "formats"
      ) {
        updateField(
          "formats",
          nextValue,
        );
      } else if (
        name ===
        "license"
      ) {
        updateField(
          "license",
          nextValue,
        );
      } else if (
        name ===
        "tags"
      ) {
        updateField(
          "tags",
          nextValue,
        );
      }
    };

  const handleContentTypeChange =
    (
      event:
        ChangeEvent<HTMLSelectElement>,
    ): void => {
      const nextContentType =
        event.currentTarget.value;

      if (
        !isCreativeContentType(
          nextContentType,
        )
      ) {
        return;
      }

      updateValues({
        ...currentValues,

        contentType:
          nextContentType,

        price:
          nextContentType ===
            "PAID"
            ? currentValues.price
            : "",

        watermarkEnabled:
          nextContentType ===
            "FREE"
            ? false
            : currentValues.watermarkEnabled,

        downloadEnabled:
          nextContentType ===
            "PORTFOLIO"
            ? false
            : currentValues.downloadEnabled,

        requestEnabled:
          nextContentType ===
            "PORTFOLIO"
            ? true
            : currentValues.requestEnabled,
      });
    };

  const handleStatusChange =
    (
      event:
        ChangeEvent<HTMLSelectElement>,
    ): void => {
      const nextStatus =
        event.currentTarget.value;

      if (
        isCreativeItemStatus(
          nextStatus,
        )
      ) {
        updateField(
          "status",
          nextStatus,
        );
      }
    };

  const handleCurrencyChange =
    (
      event:
        ChangeEvent<HTMLSelectElement>,
    ): void => {
      const nextCurrency =
        event.currentTarget.value;

      if (
        isCreativeCurrency(
          nextCurrency,
        )
      ) {
        updateField(
          "currency",
          nextCurrency,
        );
      }
    };

  const handleToolToggle =
    (
      toolValue:
        string,
    ): void => {
      if (
        formDisabled
      ) {
        return;
      }

      const toolExists =
        currentValues.tools.includes(
          toolValue,
        );

      updateField(
        "tools",
        toolExists
          ? currentValues.tools.filter(
              (
                currentTool,
              ) =>
                currentTool !==
                toolValue,
            )
          : [
              ...currentValues.tools,
              toolValue,
            ],
      );
    };

  const handleSubmit =
    (
      event:
        FormEvent<HTMLFormElement>,
    ): void => {
      event.preventDefault();

      setSubmitAttempted(
        true,
      );

      setInternalError(
        "",
      );

      if (
        interactionDisabled ||
        readOnly
      ) {
        return;
      }

      if (
        hasValidationErrors
      ) {
        setInternalError(
          copy.invalidForm,
        );

        return;
      }

      if (
        !onSubmitForm
      ) {
        return;
      }

      const normalizedValues:
        CreativeAdminFormValues = {
          ...currentValues,

          titleEs:
            normalizeCreativeAdminFormText(
              currentValues.titleEs,
            ),

          titleEn:
            normalizeCreativeAdminFormText(
              currentValues.titleEn,
            ),

          descriptionEs:
            normalizeCreativeAdminFormDescription(
              currentValues.descriptionEs,
            ).trim(),

          descriptionEn:
            normalizeCreativeAdminFormDescription(
              currentValues.descriptionEn,
            ).trim(),

          slug:
            normalizeCreativeAdminFormText(
              currentValues.slug,
            ),

          categoryId:
            normalizeCreativeAdminFormText(
              currentValues.categoryId,
            ),

          authorName:
            normalizeCreativeAdminFormText(
              currentValues.authorName,
            ),

          price:
            currentValues.contentType ===
              "PAID"
              ? currentValues.price
                  .replace(
                    ",",
                    ".",
                  )
                  .trim()
              : "",

          resolution:
            normalizeCreativeAdminFormText(
              currentValues.resolution,
            ),

          formats:
            normalizeCreativeAdminFormText(
              currentValues.formats,
            ),

          license:
            normalizeCreativeAdminFormText(
              currentValues.license,
            ),

          tools:
            normalizeCreativeAdminFormStringList(
              currentValues.tools,
            ),

          tags:
            normalizeCreativeAdminFormText(
              currentValues.tags,
            ),
        };

      Promise.resolve(
        onSubmitForm(
          normalizedValues,
          {
            previewFiles,
            originalFiles,
          },
        ),
      )
        .then(
          () => {
            onSubmitted?.();
          },
        )
        .catch(
          (
            submitError:
              unknown,
          ) => {
            onSubmitError?.(
              submitError,
            );
          },
        );
    };

  return (
    <form
      {...formProps}
      noValidate
      aria-label={
        ariaLabel ??
        resolvedHeading
      }
      aria-labelledby={
        headingId
      }
      aria-describedby={
        descriptionId
      }
      aria-busy={
        submitting ||
        undefined
      }
      data-creative-admin-form=""
      data-mode={
        mode
      }
      data-content-type={
        currentValues.contentType
      }
      data-status={
        currentValues.status
      }
      onSubmit={
        handleSubmit
      }
      className={
        joinCreativeAdminFormClasses(
          "w-full overflow-hidden border",

          CREATIVE_ADMIN_FORM_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_ADMIN_FORM_SIZE_CLASSES[
            size
          ].root,

          disabled &&
            "opacity-65",

          className,
        )
      }
    >
      <header
        className={
          joinCreativeAdminFormClasses(
            "flex flex-wrap items-start justify-between gap-4",
            "border-b border-zinc-200/80",
            "dark:border-white/10",

            CREATIVE_ADMIN_FORM_SIZE_CLASSES[
              size
            ].section,

            headerClassName,
          )
        }
      >
        <div className="min-w-0 flex-1">
          <h1
            id={
              headingId
            }
            className={
              joinCreativeAdminFormClasses(
                "font-black tracking-tight",

                CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                  size
                ].heading,
              )
            }
          >
            {resolvedHeading}
          </h1>

          <p
            id={
              descriptionId
            }
            className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-400"
          >
            {resolvedDescription}
          </p>
        </div>

        {headerContent}
      </header>

      <div
        className={
          joinCreativeAdminFormClasses(
            "space-y-6",

            CREATIVE_ADMIN_FORM_SIZE_CLASSES[
              size
            ].section,

            contentClassName,
          )
        }
      >
        <section
          className={
            joinCreativeAdminFormClasses(
              "rounded-2xl border border-zinc-200/80",
              "bg-zinc-50/60 p-4",
              "dark:border-white/10",
              "dark:bg-white/[0.025]",

              sectionClassName,
            )
          }
        >
          <h2 className="text-base font-black">
            {copy.basicInformation}
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <CreativeAdminField
              label={
                copy.titleEs
              }
              required
              error={
                submitAttempted
                  ? validationErrors.titleEs
                  : undefined
              }
            >
              <input
                type="text"
                name="titleEs"
                value={
                  currentValues.titleEs
                }
                disabled={
                  formDisabled
                }
                onChange={
                  handleTextChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              />
            </CreativeAdminField>

            <CreativeAdminField
              label={
                copy.titleEn
              }
            >
              <input
                type="text"
                name="titleEn"
                value={
                  currentValues.titleEn
                }
                disabled={
                  formDisabled
                }
                onChange={
                  handleTextChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              />
            </CreativeAdminField>

            <div className="md:col-span-2">
              <CreativeAdminField
                label={
                  copy.descriptionEs
                }
                required
                error={
                  submitAttempted
                    ? validationErrors.descriptionEs
                    : undefined
                }
              >
                <textarea
                  name="descriptionEs"
                  value={
                    currentValues.descriptionEs
                  }
                  disabled={
                    formDisabled
                  }
                  onChange={
                    handleTextChange
                  }
                  className={
                    joinCreativeAdminFormClasses(
                      CREATIVE_ADMIN_FORM_FIELD_CLASSES,
                      "resize-y",

                      CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                        size
                      ].textarea,
                    )
                  }
                />
              </CreativeAdminField>
            </div>

            <div className="md:col-span-2">
              <CreativeAdminField
                label={
                  copy.descriptionEn
                }
              >
                <textarea
                  name="descriptionEn"
                  value={
                    currentValues.descriptionEn
                  }
                  disabled={
                    formDisabled
                  }
                  onChange={
                    handleTextChange
                  }
                  className={
                    joinCreativeAdminFormClasses(
                      CREATIVE_ADMIN_FORM_FIELD_CLASSES,
                      "resize-y",

                      CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                        size
                      ].textarea,
                    )
                  }
                />
              </CreativeAdminField>
            </div>

            <CreativeAdminField
              label={
                copy.slug
              }
            >
              <input
                type="text"
                name="slug"
                value={
                  currentValues.slug
                }
                disabled={
                  formDisabled
                }
                placeholder={
                  copy.slugPlaceholder
                }
                onChange={
                  handleTextChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              />
            </CreativeAdminField>

            <CreativeAdminField
              label={
                copy.author
              }
            >
              <input
                type="text"
                name="authorName"
                value={
                  currentValues.authorName
                }
                disabled={
                  formDisabled
                }
                onChange={
                  handleTextChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              />
            </CreativeAdminField>
          </div>
        </section>

        <section
          className={
            joinCreativeAdminFormClasses(
              "rounded-2xl border border-zinc-200/80",
              "bg-zinc-50/60 p-4",
              "dark:border-white/10",
              "dark:bg-white/[0.025]",

              sectionClassName,
            )
          }
        >
          <h2 className="text-base font-black">
            {copy.publicationSettings}
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <CreativeAdminField
              label={
                copy.contentType
              }
              required
            >
              <select
                value={
                  currentValues.contentType
                }
                disabled={
                  formDisabled
                }
                onChange={
                  handleContentTypeChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              >
                <option value="FREE">
                  {copy.free}
                </option>

                <option value="PAID">
                  {copy.paid}
                </option>

                <option value="PORTFOLIO">
                  {copy.portfolio}
                </option>
              </select>

              <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                {currentValues.contentType ===
                "FREE"
                  ? copy.freeDescription
                  : currentValues.contentType ===
                      "PAID"
                    ? copy.paidDescription
                    : copy.portfolioDescription}
              </p>
            </CreativeAdminField>

            <CreativeAdminField
              label={
                copy.status
              }
              required
            >
              <select
                value={
                  currentValues.status
                }
                disabled={
                  formDisabled
                }
                onChange={
                  handleStatusChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              >
                <option value="DRAFT">
                  {copy.draft}
                </option>

                <option value="PUBLISHED">
                  {copy.published}
                </option>

                <option value="HIDDEN">
                  {copy.hidden}
                </option>

                <option value="ARCHIVED">
                  {copy.archived}
                </option>
              </select>
            </CreativeAdminField>

            <CreativeAdminField
              label={
                copy.category
              }
              required={
                requireCategory
              }
              error={
                submitAttempted
                  ? validationErrors.categoryId
                  : undefined
              }
            >
              <select
                value={
                  currentValues.categoryId
                }
                disabled={
                  formDisabled
                }
                onChange={
                  (
                    event,
                  ) => {
                    updateField(
                      "categoryId",
                      event.currentTarget.value,
                    );
                  }
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              >
                <option value="">
                  {copy.selectCategory}
                </option>

                {categories.map(
                  (
                    category,
                  ) => (
                    <option
                      key={
                        category.value
                      }
                      value={
                        category.value
                      }
                      disabled={
                        category.disabled
                      }
                    >
                      {category.label}
                    </option>
                  ),
                )}
              </select>
            </CreativeAdminField>

            {currentValues.contentType ===
            "PAID" ? (
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
                <CreativeAdminField
                  label={
                    copy.price
                  }
                  required
                  error={
                    submitAttempted
                      ? validationErrors.price
                      : undefined
                  }
                >
                  <input
                    type="text"
                    inputMode="decimal"
                    name="price"
                    value={
                      currentValues.price
                    }
                    disabled={
                      formDisabled
                    }
                    placeholder="0.00"
                    onChange={
                      handleTextChange
                    }
                    className={
                      joinCreativeAdminFormClasses(
                        CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                        CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                          size
                        ].input,
                      )
                    }
                  />
                </CreativeAdminField>

                <CreativeAdminField
                  label={
                    copy.currency
                  }
                >
                  <select
                    value={
                      currentValues.currency
                    }
                    disabled={
                      formDisabled
                    }
                    onChange={
                      handleCurrencyChange
                    }
                    className={
                      joinCreativeAdminFormClasses(
                        CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                        CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                          size
                        ].input,
                      )
                    }
                  >
                    <option value="PEN">
                      PEN
                    </option>

                    <option value="USD">
                      USD
                    </option>
                  </select>
                </CreativeAdminField>
              </div>
            ) : (
              <div className="flex items-center rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-3 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                {currentValues.contentType ===
                "FREE"
                  ? copy.freePrice
                  : copy.portfolioPrice}
              </div>
            )}
          </div>
        </section>

        <section
          className={
            joinCreativeAdminFormClasses(
              "rounded-2xl border border-zinc-200/80",
              "bg-zinc-50/60 p-4",
              "dark:border-white/10",
              "dark:bg-white/[0.025]",

              sectionClassName,
            )
          }
        >
          <h2 className="text-base font-black">
            {copy.files}
          </h2>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <div>
              <CreativeUploadField
                files={
                  previewFiles
                }
                language={
                  language
                }
                size={
                  size ===
                    "lg"
                    ? "lg"
                    : "md"
                }
                variant={
                  variant
                }
                multiple={
                  false
                }
                maximumFiles={
                  1
                }
                maximumFileSizeBytes={
                  10 *
                  1024 *
                  1024
                }
                accept="image/png,image/jpeg,image/webp"
                allowedExtensions={[
                  ".png",
                  ".jpg",
                  ".jpeg",
                  ".webp",
                ]}
                label={
                  copy.preview
                }
                description={
                  copy.previewDescription
                }
                disabled={
                  formDisabled
                }
                error={
                  submitAttempted
                    ? validationErrors.previewFiles
                    : null
                }
                onFilesChange={
                  onPreviewFilesChange
                }
              />
            </div>

            {showOriginalUpload ? (
              <div>
                <CreativeUploadField
                  files={
                    originalFiles
                  }
                  language={
                    language
                  }
                  size={
                    size ===
                      "lg"
                      ? "lg"
                      : "md"
                  }
                  variant={
                    variant
                  }
                  multiple={
                    false
                  }
                  maximumFiles={
                    1
                  }
                  maximumFileSizeBytes={
                    100 *
                    1024 *
                    1024
                  }
                  accept=".zip,.rar,.7z,.ai,.psd,.eps,.svg,.pdf,.png,.jpg,.jpeg,.webp"
                  allowedExtensions={[
                    ".zip",
                    ".rar",
                    ".7z",
                    ".ai",
                    ".psd",
                    ".eps",
                    ".svg",
                    ".pdf",
                    ".png",
                    ".jpg",
                    ".jpeg",
                    ".webp",
                  ]}
                  label={
                    copy.original
                  }
                  description={
                    copy.originalDescription
                  }
                  disabled={
                    formDisabled
                  }
                  error={
                    submitAttempted
                      ? validationErrors.originalFiles
                      : null
                  }
                  onFilesChange={
                    onOriginalFilesChange
                  }
                />
              </div>
            ) : null}
          </div>
        </section>

        <section
          className={
            joinCreativeAdminFormClasses(
              "rounded-2xl border border-zinc-200/80",
              "bg-zinc-50/60 p-4",
              "dark:border-white/10",
              "dark:bg-white/[0.025]",

              sectionClassName,
            )
          }
        >
          <h2 className="text-base font-black">
            {copy.advanced}
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <CreativeAdminField
              label={
                copy.resolution
              }
            >
              <input
                type="text"
                name="resolution"
                value={
                  currentValues.resolution
                }
                disabled={
                  formDisabled
                }
                placeholder={
                  copy.resolutionPlaceholder
                }
                onChange={
                  handleTextChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              />
            </CreativeAdminField>

            <CreativeAdminField
              label={
                copy.formats
              }
            >
              <input
                type="text"
                name="formats"
                value={
                  currentValues.formats
                }
                disabled={
                  formDisabled
                }
                placeholder={
                  copy.formatsPlaceholder
                }
                onChange={
                  handleTextChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              />
            </CreativeAdminField>

            <CreativeAdminField
              label={
                copy.license
              }
            >
              <input
                type="text"
                name="license"
                value={
                  currentValues.license
                }
                disabled={
                  formDisabled
                }
                placeholder={
                  copy.licensePlaceholder
                }
                onChange={
                  handleTextChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              />
            </CreativeAdminField>

            <CreativeAdminField
              label={
                copy.tags
              }
            >
              <input
                type="text"
                name="tags"
                value={
                  currentValues.tags
                }
                disabled={
                  formDisabled
                }
                placeholder={
                  copy.tagsPlaceholder
                }
                onChange={
                  handleTextChange
                }
                className={
                  joinCreativeAdminFormClasses(
                    CREATIVE_ADMIN_FORM_FIELD_CLASSES,

                    CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                      size
                    ].input,
                  )
                }
              />
            </CreativeAdminField>
          </div>

          {toolOptions.length >
          0 ? (
            <div className="mt-5">
              <h3 className="text-sm font-bold">
                {copy.tools}
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {toolOptions.map(
                  (
                    tool,
                  ) => {
                    const selected =
                      currentValues.tools.includes(
                        tool.value,
                      );

                    return (
                      <button
                        key={
                          tool.value
                        }
                        type="button"
                        disabled={
                          formDisabled ||
                          tool.disabled
                        }
                        aria-pressed={
                          selected
                        }
                        onClick={
                          () => {
                            handleToolToggle(
                              tool.value,
                            );
                          }
                        }
                        className={
                          joinCreativeAdminFormClasses(
                            "rounded-full border px-3 py-2",
                            "text-xs font-bold",
                            "outline-none transition-colors duration-150",

                            selected
                              ? [
                                  "border-emerald-500/35",
                                  "bg-emerald-500/15",
                                  "text-emerald-700",

                                  "dark:border-emerald-400/35",
                                  "dark:bg-emerald-400/15",
                                  "dark:text-emerald-300",
                                ].join(
                                  " ",
                                )
                              : [
                                  "border-zinc-200",
                                  "bg-white/70",
                                  "text-zinc-600",

                                  "dark:border-white/10",
                                  "dark:bg-white/[0.04]",
                                  "dark:text-zinc-300",
                                ].join(
                                  " ",
                                ),

                            "disabled:cursor-not-allowed",
                            "disabled:opacity-45",
                          )
                        }
                      >
                        {tool.label}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          ) : null}

          {showAdvancedSettings ? (
            <div className="mt-6 grid gap-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <input
                  type="checkbox"
                  checked={
                    currentValues.featured
                  }
                  disabled={
                    formDisabled
                  }
                  onChange={
                    (
                      event,
                    ) => {
                      updateField(
                        "featured",
                        event.currentTarget.checked,
                      );
                    }
                  }
                  className="mt-1 h-4 w-4 accent-emerald-500"
                />

                <span className="text-sm font-semibold">
                  {copy.featured}
                </span>
              </label>

              {currentValues.contentType !==
              "FREE" ? (
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <input
                    type="checkbox"
                    checked={
                      currentValues.watermarkEnabled
                    }
                    disabled={
                      formDisabled
                    }
                    onChange={
                      (
                        event,
                      ) => {
                        updateField(
                          "watermarkEnabled",
                          event.currentTarget.checked,
                        );
                      }
                    }
                    className="mt-1 h-4 w-4 accent-emerald-500"
                  />

                  <span className="text-sm font-semibold">
                    {copy.watermark}
                  </span>
                </label>
              ) : null}

              {currentValues.contentType !==
              "PORTFOLIO" ? (
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <input
                    type="checkbox"
                    checked={
                      currentValues.downloadEnabled
                    }
                    disabled={
                      formDisabled
                    }
                    onChange={
                      (
                        event,
                      ) => {
                        updateField(
                          "downloadEnabled",
                          event.currentTarget.checked,
                        );
                      }
                    }
                    className="mt-1 h-4 w-4 accent-emerald-500"
                  />

                  <span className="text-sm font-semibold">
                    {copy.download}
                  </span>
                </label>
              ) : null}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200/80 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <input
                  type="checkbox"
                  checked={
                    currentValues.requestEnabled
                  }
                  disabled={
                    formDisabled
                  }
                  onChange={
                    (
                      event,
                    ) => {
                      updateField(
                        "requestEnabled",
                        event.currentTarget.checked,
                      );
                    }
                  }
                  className="mt-1 h-4 w-4 accent-emerald-500"
                />

                <span className="text-sm font-semibold">
                  {copy.request}
                </span>
              </label>
            </div>
          ) : null}
        </section>

        {normalizedExternalError ||
        internalError ? (
          <div
            role="alert"
            className="rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm font-semibold text-red-700 dark:border-red-400/25 dark:bg-red-400/10 dark:text-red-300"
          >
            {normalizedExternalError ||
            internalError}
          </div>
        ) : null}

        {normalizedSuccessMessage ? (
          <div
            role="status"
            className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300"
          >
            {normalizedSuccessMessage}
          </div>
        ) : null}

        {footerContent}
      </div>

      <footer
        className={
          joinCreativeAdminFormClasses(
            "flex flex-wrap items-center justify-end gap-3",
            "border-t border-zinc-200/80",
            "dark:border-white/10",

            CREATIVE_ADMIN_FORM_SIZE_CLASSES[
              size
            ].section,

            actionsClassName,
          )
        }
      >
        {onCancel ? (
          <button
            type="button"
            disabled={
              interactionDisabled
            }
            onClick={
              onCancel
            }
            className={
              joinCreativeAdminFormClasses(
                "inline-flex items-center justify-center",
                "border border-zinc-200",
                "bg-zinc-100/80",
                "font-bold text-zinc-700",
                "outline-none transition-all duration-200",

                "enabled:hover:bg-zinc-200",
                "enabled:hover:text-zinc-950",

                "focus-visible:ring-2",
                "focus-visible:ring-zinc-500/40",

                "disabled:cursor-not-allowed",
                "disabled:opacity-45",

                "dark:border-white/10",
                "dark:bg-white/[0.07]",
                "dark:text-zinc-200",

                "dark:enabled:hover:bg-white/[0.12]",
                "dark:enabled:hover:text-white",

                CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                  size
                ].button,

                cancelButtonClassName,
              )
            }
          >
            {resolvedCancelLabel}
          </button>
        ) : null}

        <button
          type="submit"
          aria-busy={
            submitting ||
            undefined
          }
          disabled={
            formDisabled ||
            !onSubmitForm
          }
          className={
            joinCreativeAdminFormClasses(
              "inline-flex items-center justify-center gap-2.5",
              "border border-emerald-500/25",
              "bg-gradient-to-r",
              "from-emerald-500",
              "to-green-600",
              "font-black text-white",
              "outline-none transition-all duration-200",

              "enabled:hover:-translate-y-0.5",
              "enabled:hover:from-emerald-400",
              "enabled:hover:to-emerald-600",
              "enabled:hover:shadow-[0_12px_30px_rgba(16,185,129,0.25)]",

              "enabled:active:translate-y-0",
              "enabled:active:scale-[0.98]",

              "focus-visible:ring-2",
              "focus-visible:ring-emerald-500/60",
              "focus-visible:ring-offset-2",

              "disabled:cursor-not-allowed",
              "disabled:opacity-45",

              "dark:focus-visible:ring-offset-zinc-950",

              CREATIVE_ADMIN_FORM_SIZE_CLASSES[
                size
              ].button,

              submitButtonClassName,
            )
          }
        >
          {submitting ? (
            <CreativeSpinner
              decorative
              size="sm"
              variant="light"
            />
          ) : null}

          <span>
            {submitting
              ? copy.saving
              : resolvedSubmitLabel}
          </span>
        </button>
      </footer>
    </form>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeAdminForm;