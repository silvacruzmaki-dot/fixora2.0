import {
  z,
} from "zod";

import {
  creativeItemIdSchema,
} from "./creative-item.schema";

/* =========================================================
   CONSTANTES GENERALES
   ========================================================= */

export const CREATIVE_UPLOAD_MEGABYTE =
  1024 * 1024;

export const CREATIVE_UPLOAD_FILENAME_MAX_LENGTH =
  255;

export const CREATIVE_UPLOAD_STORAGE_KEY_MAX_LENGTH =
  512;

export const CREATIVE_UPLOAD_PUBLIC_URL_MAX_LENGTH =
  2_048;

export const CREATIVE_UPLOAD_MIME_TYPE_MAX_LENGTH =
  120;

export const CREATIVE_UPLOAD_ALT_TEXT_MAX_LENGTH =
  300;

export const CREATIVE_UPLOAD_MAX_SORT_ORDER =
  9_999;

/* =========================================================
   TAMAÑOS MÁXIMOS
   ========================================================= */

export const CREATIVE_UPLOAD_MAX_THUMBNAIL_SIZE =
  10 * CREATIVE_UPLOAD_MEGABYTE;

export const CREATIVE_UPLOAD_MAX_PREVIEW_SIZE =
  20 * CREATIVE_UPLOAD_MEGABYTE;

export const CREATIVE_UPLOAD_MAX_ORIGINAL_SIZE =
  250 * CREATIVE_UPLOAD_MEGABYTE;

export const CREATIVE_UPLOAD_MAX_WATERMARK_SIZE =
  10 * CREATIVE_UPLOAD_MEGABYTE;

/* =========================================================
   TIPO DE ARCHIVO CREATIVE
   ========================================================= */

export const creativeMediaKindSchema =
  z.enum([
    "THUMBNAIL",
    "PREVIEW",
    "ORIGINAL",
    "WATERMARK",
  ]);

export type CreativeMediaKindInput =
  z.infer<
    typeof creativeMediaKindSchema
  >;

/* =========================================================
   TAMAÑO POR TIPO
   ========================================================= */

export const CREATIVE_UPLOAD_MAX_SIZE_BY_KIND:
  Readonly<
    Record<
      CreativeMediaKindInput,
      number
    >
  > = {
    THUMBNAIL:
      CREATIVE_UPLOAD_MAX_THUMBNAIL_SIZE,

    PREVIEW:
      CREATIVE_UPLOAD_MAX_PREVIEW_SIZE,

    ORIGINAL:
      CREATIVE_UPLOAD_MAX_ORIGINAL_SIZE,

    WATERMARK:
      CREATIVE_UPLOAD_MAX_WATERMARK_SIZE,
  };

/* =========================================================
   FORMATOS PÚBLICOS
   ========================================================= */

export const CREATIVE_PUBLIC_IMAGE_EXTENSIONS =
  new Set<string>([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
  ]);

export const CREATIVE_PUBLIC_IMAGE_MIME_TYPES =
  new Set<string>([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ]);

/* =========================================================
   FORMATOS ORIGINALES
   ========================================================= */

export const CREATIVE_ORIGINAL_FILE_EXTENSIONS =
  new Set<string>([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
    ".svg",
    ".pdf",
    ".psd",
    ".ai",
    ".eps",
    ".zip",
    ".rar",
    ".7z",
  ]);

export const CREATIVE_ORIGINAL_MIME_TYPES =
  new Set<string>([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/svg+xml",
    "application/pdf",
    "application/postscript",
    "application/illustrator",
    "application/vnd.adobe.photoshop",
    "image/vnd.adobe.photoshop",
    "application/zip",
    "application/x-zip-compressed",
    "application/vnd.rar",
    "application/x-rar-compressed",
    "application/x-7z-compressed",
    "application/octet-stream",
  ]);

/* =========================================================
   IDENTIFICADOR DEL ARCHIVO
   ========================================================= */

export const creativeMediaIdSchema =
  z
    .string()
    .trim()
    .uuid(
      "El identificador del archivo Creative no es válido.",
    );

/* =========================================================
   INTERFAZ ESTRUCTURAL DEL ARCHIVO
   ========================================================= */

export interface CreativeUploadFileLike {
  name:
    string;

  size:
    number;

  type:
    string;

  arrayBuffer:
    () => Promise<ArrayBuffer>;
}

/* =========================================================
   NORMALIZADORES
   ========================================================= */

function normalizeCreativeUploadKind(
  value:
    unknown,
): unknown {
  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  return value
    .trim()
    .toUpperCase();
}

function normalizeCreativeUploadText(
  value:
    unknown,
): unknown {
  if (
    value ===
      undefined ||
    value ===
      null
  ) {
    return "";
  }

  if (
    typeof value !==
    "string"
  ) {
    return value;
  }

  return value.trim();
}

function normalizeCreativeUploadOptionalText(
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
    value.trim();

  return normalizedValue ||
    undefined;
}

function normalizeCreativeUploadNullableText(
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
    value.trim();

  return normalizedValue ||
    null;
}

function normalizeCreativeUploadInteger(
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

function normalizeCreativeUploadNullableInteger(
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
      null ||
    value ===
      ""
  ) {
    return null;
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
      return null;
    }

    return Number(
      normalizedValue,
    );
  }

  return value;
}

function normalizeCreativeUploadBoolean(
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
        "1" ||
      normalizedValue ===
        "yes" ||
      normalizedValue ===
        "si" ||
      normalizedValue ===
        "sí"
    ) {
      return true;
    }

    if (
      normalizedValue ===
        "false" ||
      normalizedValue ===
        "0" ||
      normalizedValue ===
        "no"
    ) {
      return false;
    }
  }

  return value;
}

/* =========================================================
   COMPROBAR ARCHIVO
   ========================================================= */

export function isCreativeUploadFile(
  value:
    unknown,
): value is File {
  if (
    typeof value !==
      "object" ||
    value ===
      null
  ) {
    return false;
  }

  const candidate =
    value as
      Partial<
        CreativeUploadFileLike
      >;

  return (
    typeof candidate.name ===
      "string" &&
    candidate.name
      .trim()
      .length >
      0 &&
    typeof candidate.size ===
      "number" &&
    Number.isFinite(
      candidate.size,
    ) &&
    candidate.size >
      0 &&
    typeof candidate.type ===
      "string" &&
    typeof candidate.arrayBuffer ===
      "function"
  );
}

/* =========================================================
   OBTENER EXTENSIÓN
   ========================================================= */

export function getCreativeUploadFileExtension(
  filename:
    string,
): string {
  const normalizedFilename =
    filename
      .trim()
      .toLowerCase();

  const lastDotIndex =
    normalizedFilename.lastIndexOf(
      ".",
    );

  if (
    lastDotIndex <
      0
  ) {
    return "";
  }

  return normalizedFilename.slice(
    lastDotIndex,
  );
}

/* =========================================================
   OBTENER MIME
   ========================================================= */

export function getCreativeUploadMimeType(
  file:
    Pick<
      CreativeUploadFileLike,
      "type"
    >,
): string {
  const normalizedMimeType =
    file.type
      .trim()
      .toLowerCase();

  return normalizedMimeType ||
    "application/octet-stream";
}

/* =========================================================
   COMPROBAR FORMATO
   ========================================================= */

export function isAllowedCreativeUploadFile(
  file:
    CreativeUploadFileLike,
  kind:
    CreativeMediaKindInput,
): boolean {
  const extension =
    getCreativeUploadFileExtension(
      file.name,
    );

  const mimeType =
    getCreativeUploadMimeType(
      file,
    );

  if (
    kind ===
    "ORIGINAL"
  ) {
    return (
      CREATIVE_ORIGINAL_FILE_EXTENSIONS.has(
        extension,
      ) &&
      CREATIVE_ORIGINAL_MIME_TYPES.has(
        mimeType,
      )
    );
  }

  return (
    CREATIVE_PUBLIC_IMAGE_EXTENSIONS.has(
      extension,
    ) &&
    CREATIVE_PUBLIC_IMAGE_MIME_TYPES.has(
      mimeType,
    )
  );
}

/* =========================================================
   ARCHIVO
   ========================================================= */

export const creativeUploadFileSchema =
  z.custom<File>(
    isCreativeUploadFile,
    {
      message:
        "Debes seleccionar un archivo Creative válido.",
    },
  );

/* =========================================================
   NOMBRE DEL ARCHIVO
   ========================================================= */

export const creativeUploadFilenameSchema =
  z
    .string()
    .trim()
    .min(
      1,
      "El nombre del archivo es obligatorio.",
    )
    .max(
      CREATIVE_UPLOAD_FILENAME_MAX_LENGTH,
      `El nombre del archivo no puede superar los ${CREATIVE_UPLOAD_FILENAME_MAX_LENGTH} caracteres.`,
    );

/* =========================================================
   CLAVE DE ALMACENAMIENTO
   ========================================================= */

export const creativeUploadStorageKeySchema =
  z
    .string()
    .trim()
    .min(
      1,
      "La clave de almacenamiento es obligatoria.",
    )
    .max(
      CREATIVE_UPLOAD_STORAGE_KEY_MAX_LENGTH,
      `La clave de almacenamiento no puede superar los ${CREATIVE_UPLOAD_STORAGE_KEY_MAX_LENGTH} caracteres.`,
    );

/* =========================================================
   URL PÚBLICA
   ========================================================= */

export const creativeUploadPublicUrlSchema =
  z.preprocess(
    normalizeCreativeUploadNullableText,
    z
      .string()
      .url(
        "La URL pública del archivo no es válida.",
      )
      .max(
        CREATIVE_UPLOAD_PUBLIC_URL_MAX_LENGTH,
        `La URL pública no puede superar los ${CREATIVE_UPLOAD_PUBLIC_URL_MAX_LENGTH} caracteres.`,
      )
      .nullable()
      .optional(),
  );

/* =========================================================
   MIME TYPE
   ========================================================= */

export const creativeUploadMimeTypeSchema =
  z
    .string()
    .trim()
    .toLowerCase()
    .min(
      1,
      "El tipo MIME es obligatorio.",
    )
    .max(
      CREATIVE_UPLOAD_MIME_TYPE_MAX_LENGTH,
      `El tipo MIME no puede superar los ${CREATIVE_UPLOAD_MIME_TYPE_MAX_LENGTH} caracteres.`,
    );

/* =========================================================
   TEXTO ALTERNATIVO
   ========================================================= */

export const creativeUploadAltTextSchema =
  z.preprocess(
    normalizeCreativeUploadText,
    z
      .string()
      .max(
        CREATIVE_UPLOAD_ALT_TEXT_MAX_LENGTH,
        `El texto alternativo no puede superar los ${CREATIVE_UPLOAD_ALT_TEXT_MAX_LENGTH} caracteres.`,
      )
      .default(
        "",
      ),
  );

/* =========================================================
   ORDEN
   ========================================================= */

export const creativeUploadSortOrderSchema =
  z.preprocess(
    normalizeCreativeUploadInteger,
    z
      .number()
      .int(
        "El orden debe ser un número entero.",
      )
      .min(
        0,
        "El orden no puede ser negativo.",
      )
      .max(
        CREATIVE_UPLOAD_MAX_SORT_ORDER,
        `El orden no puede superar ${CREATIVE_UPLOAD_MAX_SORT_ORDER}.`,
      )
      .default(
        0,
      ),
  );

/* =========================================================
   ESTADO ACTIVO
   ========================================================= */

export const creativeUploadActiveSchema =
  z.preprocess(
    normalizeCreativeUploadBoolean,
    z
      .boolean()
      .default(
        true,
      ),
  );

/* =========================================================
   DIMENSIONES
   ========================================================= */

export const creativeUploadDimensionSchema =
  z.preprocess(
    normalizeCreativeUploadNullableInteger,
    z
      .number()
      .int(
        "La dimensión debe ser un número entero.",
      )
      .positive(
        "La dimensión debe ser mayor que cero.",
      )
      .max(
        100_000,
        "La dimensión supera el máximo permitido.",
      )
      .nullable()
      .optional(),
  );

/* =========================================================
   TAMAÑO EN BYTES
   ========================================================= */

export const creativeUploadSizeBytesSchema =
  z
    .number()
    .int(
      "El tamaño del archivo debe ser un número entero.",
    )
    .positive(
      "El archivo debe contener información.",
    )
    .max(
      CREATIVE_UPLOAD_MAX_ORIGINAL_SIZE,
      "El archivo supera el tamaño máximo permitido.",
    );

/* =========================================================
   ESQUEMA BASE DE SUBIDA
   ========================================================= */

const creativeUploadBaseSchema =
  z.object({
    creativeItemId:
      creativeItemIdSchema,

    kind:
      z.preprocess(
        normalizeCreativeUploadKind,
        creativeMediaKindSchema,
      ),

    file:
      creativeUploadFileSchema,

    altEs:
      creativeUploadAltTextSchema,

    altEn:
      creativeUploadAltTextSchema,

    sortOrder:
      creativeUploadSortOrderSchema,

    isActive:
      creativeUploadActiveSchema,
  });

/* =========================================================
   VALIDACIÓN DE SUBIDA
   ========================================================= */

export const creativeUploadSchema =
  creativeUploadBaseSchema
    .superRefine(
      (
        values,
        context,
      ) => {
        const filename =
          values.file.name.trim();

        if (
          filename.length >
          CREATIVE_UPLOAD_FILENAME_MAX_LENGTH
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "file",
            ],

            message:
              `El nombre del archivo no puede superar los ${CREATIVE_UPLOAD_FILENAME_MAX_LENGTH} caracteres.`,
          });
        }

        const maximumSize =
          CREATIVE_UPLOAD_MAX_SIZE_BY_KIND[
            values.kind
          ];

        if (
          values.file.size >
          maximumSize
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "file",
            ],

            message:
              `El archivo supera el límite permitido de ${Math.floor(
                maximumSize /
                  CREATIVE_UPLOAD_MEGABYTE,
              )} MB.`,
          });
        }

        if (
          !isAllowedCreativeUploadFile(
            values.file,
            values.kind,
          )
        ) {
          context.addIssue({
            code:
              "custom",

            path: [
              "file",
            ],

            message:
              values.kind ===
              "ORIGINAL"
                ? "El formato del archivo original no está permitido."
                : "Las miniaturas, vistas previas y marcas de agua deben ser JPG, PNG, WebP o AVIF.",
          });
        }
      },
    );

/* =========================================================
   METADATOS GUARDADOS
   ========================================================= */

export const creativeMediaCreateSchema =
  z.object({
    creativeItemId:
      creativeItemIdSchema,

    kind:
      creativeMediaKindSchema,

    filename:
      creativeUploadFilenameSchema,

    storageKey:
      creativeUploadStorageKeySchema,

    publicUrl:
      creativeUploadPublicUrlSchema,

    mimeType:
      creativeUploadMimeTypeSchema,

    sizeBytes:
      creativeUploadSizeBytesSchema,

    width:
      creativeUploadDimensionSchema,

    height:
      creativeUploadDimensionSchema,

    altEs:
      creativeUploadAltTextSchema,

    altEn:
      creativeUploadAltTextSchema,

    sortOrder:
      creativeUploadSortOrderSchema,

    isActive:
      creativeUploadActiveSchema,
  });

/* =========================================================
   ACTUALIZAR METADATOS
   ========================================================= */

export const creativeMediaUpdateSchema =
  z
    .object({
      altEs:
        z.preprocess(
          normalizeCreativeUploadOptionalText,
          z
            .string()
            .max(
              CREATIVE_UPLOAD_ALT_TEXT_MAX_LENGTH,
              `El texto alternativo en español no puede superar los ${CREATIVE_UPLOAD_ALT_TEXT_MAX_LENGTH} caracteres.`,
            )
            .optional(),
        ),

      altEn:
        z.preprocess(
          normalizeCreativeUploadOptionalText,
          z
            .string()
            .max(
              CREATIVE_UPLOAD_ALT_TEXT_MAX_LENGTH,
              `El texto alternativo en inglés no puede superar los ${CREATIVE_UPLOAD_ALT_TEXT_MAX_LENGTH} caracteres.`,
            )
            .optional(),
        ),

      sortOrder:
        z.preprocess(
          normalizeCreativeUploadInteger,
          z
            .number()
            .int(
              "El orden debe ser un número entero.",
            )
            .min(
              0,
              "El orden no puede ser negativo.",
            )
            .max(
              CREATIVE_UPLOAD_MAX_SORT_ORDER,
              `El orden no puede superar ${CREATIVE_UPLOAD_MAX_SORT_ORDER}.`,
            )
            .optional(),
        ),

      isActive:
        z.preprocess(
          normalizeCreativeUploadBoolean,
          z
            .boolean()
            .optional(),
        ),
    })
    .refine(
      (
        values,
      ) =>
        values.altEs !==
          undefined ||
        values.altEn !==
          undefined ||
        values.sortOrder !==
          undefined ||
        values.isActive !==
          undefined,
      {
        message:
          "Debes enviar al menos un campo para actualizar el archivo.",
      },
    );

/* =========================================================
   CAMBIAR ESTADO
   ========================================================= */

export const creativeMediaActiveUpdateSchema =
  z.object({
    isActive:
      z.preprocess(
        normalizeCreativeUploadBoolean,
        z.boolean(),
      ),
  });

/* =========================================================
   PARÁMETROS DE RUTA
   ========================================================= */

export const creativeMediaIdParamsSchema =
  z.object({
    mediaId:
      creativeMediaIdSchema,
  });

export const creativeItemMediaParamsSchema =
  z.object({
    itemId:
      creativeItemIdSchema,
  });

/* =========================================================
   FORM DATA
   ========================================================= */

export function creativeUploadFormDataToObject(
  formData:
    FormData,
): Record<string, FormDataEntryValue | null> {
  return {
    creativeItemId:
      formData.get(
        "creativeItemId",
      ),

    kind:
      formData.get(
        "kind",
      ),

    file:
      formData.get(
        "file",
      ),

    altEs:
      formData.get(
        "altEs",
      ),

    altEn:
      formData.get(
        "altEn",
      ),

    sortOrder:
      formData.get(
        "sortOrder",
      ),

    isActive:
      formData.get(
        "isActive",
      ),
  };
}

/* =========================================================
   VALIDAR FORM DATA
   ========================================================= */

export function parseCreativeUploadFormData(
  formData:
    FormData,
): CreativeUploadData {
  return creativeUploadSchema.parse(
    creativeUploadFormDataToObject(
      formData,
    ),
  );
}

export function safeParseCreativeUploadFormData(
  formData:
    FormData,
) {
  return creativeUploadSchema.safeParse(
    creativeUploadFormDataToObject(
      formData,
    ),
  );
}

/* =========================================================
   ALIAS COMPATIBLES
   ========================================================= */

export const creativeMediaUploadSchema =
  creativeUploadSchema;

export const creativeUploadFormSchema =
  creativeUploadSchema;

export const createCreativeMediaSchema =
  creativeMediaCreateSchema;

export const updateCreativeMediaSchema =
  creativeMediaUpdateSchema;

/* =========================================================
   TIPOS INFERIDOS
   ========================================================= */

export type CreativeUploadInput =
  z.input<
    typeof creativeUploadSchema
  >;

export type CreativeUploadData =
  z.output<
    typeof creativeUploadSchema
  >;

export type CreativeMediaCreateInput =
  z.input<
    typeof creativeMediaCreateSchema
  >;

export type CreativeMediaCreateData =
  z.output<
    typeof creativeMediaCreateSchema
  >;

export type CreativeMediaUpdateInput =
  z.input<
    typeof creativeMediaUpdateSchema
  >;

export type CreativeMediaUpdateData =
  z.output<
    typeof creativeMediaUpdateSchema
  >;

export type CreativeMediaActiveUpdateInput =
  z.input<
    typeof creativeMediaActiveUpdateSchema
  >;

export type CreativeMediaIdParams =
  z.infer<
    typeof creativeMediaIdParamsSchema
  >;

export type CreativeItemMediaParams =
  z.infer<
    typeof creativeItemMediaParamsSchema
  >;