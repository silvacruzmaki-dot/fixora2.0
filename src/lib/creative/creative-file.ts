/* =========================================================
   TIPOS DE ARCHIVO
   ========================================================= */

export type CreativeFileKind =
  | "THUMBNAIL"
  | "PREVIEW"
  | "ORIGINAL"
  | "WATERMARK";

export interface CreativeFileLike {
  name:
    string;

  size:
    number;

  type:
    string;
}

export interface CreativeFileValidationOptions {
  kind:
    CreativeFileKind;

  maximumSize?:
    number;

  allowEmptyMimeType?:
    boolean;
}

export interface CreativeFileValidationResult {
  valid:
    boolean;

  errors:
    string[];

  extension:
    string;

  mimeType:
    string;

  maximumSize:
    number;
}

/* =========================================================
   CONSTANTES
   ========================================================= */

export const CREATIVE_FILE_MEGABYTE =
  1024 * 1024;

export const CREATIVE_FILE_MAX_NAME_LENGTH =
  255;

export const CREATIVE_FILE_MAX_THUMBNAIL_SIZE =
  10 * CREATIVE_FILE_MEGABYTE;

export const CREATIVE_FILE_MAX_PREVIEW_SIZE =
  20 * CREATIVE_FILE_MEGABYTE;

export const CREATIVE_FILE_MAX_ORIGINAL_SIZE =
  250 * CREATIVE_FILE_MEGABYTE;

export const CREATIVE_FILE_MAX_WATERMARK_SIZE =
  10 * CREATIVE_FILE_MEGABYTE;

export const CREATIVE_FILE_MAX_SIZE_BY_KIND:
  Readonly<
    Record<
      CreativeFileKind,
      number
    >
  > = {
    THUMBNAIL:
      CREATIVE_FILE_MAX_THUMBNAIL_SIZE,

    PREVIEW:
      CREATIVE_FILE_MAX_PREVIEW_SIZE,

    ORIGINAL:
      CREATIVE_FILE_MAX_ORIGINAL_SIZE,

    WATERMARK:
      CREATIVE_FILE_MAX_WATERMARK_SIZE,
  };

export const CREATIVE_PUBLIC_IMAGE_EXTENSIONS:
  ReadonlySet<string> =
  new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
  ]);

export const CREATIVE_PUBLIC_IMAGE_MIME_TYPES:
  ReadonlySet<string> =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ]);

export const CREATIVE_ORIGINAL_EXTENSIONS:
  ReadonlySet<string> =
  new Set([
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

export const CREATIVE_ORIGINAL_MIME_TYPES:
  ReadonlySet<string> =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/svg+xml",
    "application/pdf",
    "application/postscript",
    "application/illustrator",
    "application/vnd.adobe.illustrator",
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
   NORMALIZACIÓN
   ========================================================= */

export function normalizeCreativeFileMimeType(
  mimeType:
    string | null | undefined,
): string {
  if (
    typeof mimeType !==
    "string"
  ) {
    return "";
  }

  return mimeType
    .trim()
    .toLowerCase();
}

export function normalizeCreativeFileName(
  filename:
    string | null | undefined,
): string {
  if (
    typeof filename !==
    "string"
  ) {
    return "";
  }

  return filename
    .replace(
      /\\/g,
      "/",
    )
    .split(
      "/",
    )
    .pop()
    ?.trim() ??
    "";
}

/* =========================================================
   EXTENSIÓN Y NOMBRE
   ========================================================= */

export function getCreativeFileExtension(
  filename:
    string | null | undefined,
): string {
  const normalizedFilename =
    normalizeCreativeFileName(
      filename,
    ).toLowerCase();

  const lastDotIndex =
    normalizedFilename.lastIndexOf(
      ".",
    );

  if (
    lastDotIndex <=
      0 ||
    lastDotIndex ===
      normalizedFilename.length -
        1
  ) {
    return "";
  }

  return normalizedFilename.slice(
    lastDotIndex,
  );
}

export function getCreativeFileBasename(
  filename:
    string | null | undefined,
): string {
  return normalizeCreativeFileName(
    filename,
  );
}

export function getCreativeFileStem(
  filename:
    string | null | undefined,
): string {
  const basename =
    getCreativeFileBasename(
      filename,
    );

  const extension =
    getCreativeFileExtension(
      basename,
    );

  if (
    !extension
  ) {
    return basename;
  }

  return basename.slice(
    0,
    -extension.length,
  );
}

/* =========================================================
   LIMPIAR NOMBRE
   ========================================================= */

function removeCreativeFileDiacritics(
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
    );
}

function trimCreativeFileNameToMaximum(
  stem:
    string,
  extension:
    string,
): string {
  const maximumStemLength =
    Math.max(
      1,
      CREATIVE_FILE_MAX_NAME_LENGTH -
        extension.length,
    );

  return `${stem.slice(
    0,
    maximumStemLength,
  )}${extension}`;
}

export function sanitizeCreativeFileName(
  filename:
    string | null | undefined,
  fallbackName =
    "creative-file",
): string {
  const basename =
    getCreativeFileBasename(
      filename,
    );

  const extension =
    getCreativeFileExtension(
      basename,
    );

  const rawStem =
    getCreativeFileStem(
      basename,
    );

  const sanitizedStem =
    removeCreativeFileDiacritics(
      rawStem,
    )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      );

  const normalizedFallback =
    removeCreativeFileDiacritics(
      fallbackName,
    )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "" ) ||
    "creative-file";

  return trimCreativeFileNameToMaximum(
    sanitizedStem ||
      normalizedFallback,
    extension,
  );
}

/* =========================================================
   NOMBRE PARA ALMACENAMIENTO
   ========================================================= */

export function createCreativeStorageFilename(
  filename:
    string,
  uniqueSuffix?:
    string | number | null,
): string {
  const extension =
    getCreativeFileExtension(
      filename,
    );

  const sanitizedFilename =
    sanitizeCreativeFileName(
      filename,
    );

  const sanitizedStem =
    getCreativeFileStem(
      sanitizedFilename,
    );

  const normalizedSuffix =
    uniqueSuffix ===
      null ||
    uniqueSuffix ===
      undefined
      ? ""
      : String(
          uniqueSuffix,
        )
          .trim()
          .toLowerCase()
          .replace(
            /[^a-z0-9_-]+/g,
            "-",
          )
          .replace(
            /^-+|-+$/g,
            "" );

  const finalStem =
    normalizedSuffix
      ? `${sanitizedStem}-${normalizedSuffix}`
      : sanitizedStem;

  return trimCreativeFileNameToMaximum(
    finalStem,
    extension,
  );
}

/* =========================================================
   COMPROBAR ESTRUCTURA
   ========================================================= */

export function isCreativeFileLike(
  value:
    unknown,
): value is CreativeFileLike {
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
        CreativeFileLike
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
      "string"
  );
}

/* =========================================================
   FORMATOS PERMITIDOS
   ========================================================= */

export function isCreativeImageMimeType(
  mimeType:
    string | null | undefined,
): boolean {
  return CREATIVE_PUBLIC_IMAGE_MIME_TYPES.has(
    normalizeCreativeFileMimeType(
      mimeType,
    ),
  );
}

export function isCreativePublicImageExtension(
  extensionOrFilename:
    string,
): boolean {
  const normalizedExtension =
    extensionOrFilename.startsWith(
      ".",
    )
      ? extensionOrFilename.toLowerCase()
      : getCreativeFileExtension(
          extensionOrFilename,
        );

  return CREATIVE_PUBLIC_IMAGE_EXTENSIONS.has(
    normalizedExtension,
  );
}

export function isCreativeOriginalExtension(
  extensionOrFilename:
    string,
): boolean {
  const normalizedExtension =
    extensionOrFilename.startsWith(
      ".",
    )
      ? extensionOrFilename.toLowerCase()
      : getCreativeFileExtension(
          extensionOrFilename,
        );

  return CREATIVE_ORIGINAL_EXTENSIONS.has(
    normalizedExtension,
  );
}

export function isCreativeFileTypeAllowed(
  file:
    CreativeFileLike,
  kind:
    CreativeFileKind,
  allowEmptyMimeType =
    false,
): boolean {
  const extension =
    getCreativeFileExtension(
      file.name,
    );

  const mimeType =
    normalizeCreativeFileMimeType(
      file.type,
    );

  if (
    kind ===
    "ORIGINAL"
  ) {
    const extensionAllowed =
      CREATIVE_ORIGINAL_EXTENSIONS.has(
        extension,
      );

    const mimeAllowed =
      mimeType
        ? CREATIVE_ORIGINAL_MIME_TYPES.has(
            mimeType,
          )
        : allowEmptyMimeType;

    return (
      extensionAllowed &&
      mimeAllowed
    );
  }

  const extensionAllowed =
    CREATIVE_PUBLIC_IMAGE_EXTENSIONS.has(
      extension,
    );

  const mimeAllowed =
    mimeType
      ? CREATIVE_PUBLIC_IMAGE_MIME_TYPES.has(
          mimeType,
        )
      : allowEmptyMimeType;

  return (
    extensionAllowed &&
    mimeAllowed
  );
}

/* =========================================================
   TAMAÑO MÁXIMO
   ========================================================= */

export function getCreativeFileMaximumSize(
  kind:
    CreativeFileKind,
): number {
  return CREATIVE_FILE_MAX_SIZE_BY_KIND[
    kind
  ];
}

export function isCreativeFileSizeAllowed(
  size:
    number,
  kind:
    CreativeFileKind,
  customMaximumSize?:
    number,
): boolean {
  if (
    !Number.isFinite(
      size,
    ) ||
    size <=
      0
  ) {
    return false;
  }

  const maximumSize =
    typeof customMaximumSize ===
      "number" &&
    Number.isFinite(
      customMaximumSize,
    ) &&
    customMaximumSize >
      0
      ? customMaximumSize
      : getCreativeFileMaximumSize(
          kind,
        );

  return size <=
    maximumSize;
}

/* =========================================================
   FORMATEAR TAMAÑO
   ========================================================= */

export function formatCreativeFileSize(
  bytes:
    number | null | undefined,
  language:
    "es" | "en" = "es",
): string {
  if (
    typeof bytes !==
      "number" ||
    !Number.isFinite(
      bytes,
    ) ||
    bytes <
      0
  ) {
    return language ===
      "es"
      ? "Tamaño desconocido"
      : "Unknown size";
  }

  if (
    bytes <
    1024
  ) {
    return `${Math.round(
      bytes,
    )} B`;
  }

  const units = [
    "KB",
    "MB",
    "GB",
    "TB",
  ];

  let value =
    bytes /
    1024;

  let unitIndex =
    0;

  while (
    value >=
      1024 &&
    unitIndex <
      units.length -
        1
  ) {
    value /=
      1024;

    unitIndex +=
      1;
  }

  try {
    const formattedValue =
      new Intl.NumberFormat(
        language ===
          "es"
          ? "es-PE"
          : "en-US",
        {
          maximumFractionDigits:
            value >=
            100
              ? 0
              : value >=
                  10
                ? 1
                : 2,
        },
      ).format(
        value,
      );

    return `${formattedValue} ${units[unitIndex]}`;
  } catch {
    return `${value.toFixed(
      2,
    )} ${units[unitIndex]}`;
  }
}

/* =========================================================
   VALIDACIÓN COMPLETA
   ========================================================= */

export function validateCreativeFile(
  file:
    CreativeFileLike,
  options:
    CreativeFileValidationOptions,
): CreativeFileValidationResult {
  const errors:
    string[] = [];

  const extension =
    getCreativeFileExtension(
      file.name,
    );

  const mimeType =
    normalizeCreativeFileMimeType(
      file.type,
    );

  const maximumSize =
    typeof options.maximumSize ===
      "number" &&
    Number.isFinite(
      options.maximumSize,
    ) &&
    options.maximumSize >
      0
      ? options.maximumSize
      : getCreativeFileMaximumSize(
          options.kind,
        );

  const normalizedFilename =
    normalizeCreativeFileName(
      file.name,
    );

  if (
    !normalizedFilename
  ) {
    errors.push(
      "El archivo debe tener un nombre válido.",
    );
  }

  if (
    normalizedFilename.length >
    CREATIVE_FILE_MAX_NAME_LENGTH
  ) {
    errors.push(
      `El nombre del archivo no puede superar los ${CREATIVE_FILE_MAX_NAME_LENGTH} caracteres.`,
    );
  }

  if (
    !Number.isFinite(
      file.size,
    ) ||
    file.size <=
      0
  ) {
    errors.push(
      "El archivo está vacío o su tamaño no es válido.",
    );
  } else if (
    file.size >
    maximumSize
  ) {
    errors.push(
      `El archivo supera el tamaño máximo permitido de ${formatCreativeFileSize(
        maximumSize,
      )}.`,
    );
  }

  if (
    !extension
  ) {
    errors.push(
      "El archivo debe tener una extensión válida.",
    );
  }

  if (
    !isCreativeFileTypeAllowed(
      file,
      options.kind,
      options.allowEmptyMimeType ??
        false,
    )
  ) {
    errors.push(
      options.kind ===
      "ORIGINAL"
        ? "El formato del archivo original no está permitido."
        : "El archivo debe ser una imagen JPG, PNG, WebP o AVIF.",
    );
  }

  return {
    valid:
      errors.length ===
      0,

    errors,

    extension,

    mimeType,

    maximumSize,
  };
}

/* =========================================================
   VALIDACIÓN CON ERROR
   ========================================================= */

export class CreativeFileValidationError extends Error {
  readonly errors:
    string[];

  constructor(
    errors:
      string[],
  ) {
    super(
      errors[0] ??
      "El archivo Creative no es válido.",
    );

    this.name =
      "CreativeFileValidationError";

    this.errors =
      errors;
  }
}

export function assertCreativeFile(
  file:
    CreativeFileLike,
  options:
    CreativeFileValidationOptions,
): void {
  const validation =
    validateCreativeFile(
      file,
      options,
    );

  if (
    !validation.valid
  ) {
    throw new CreativeFileValidationError(
      validation.errors,
    );
  }
}

/* =========================================================
   ALIAS COMPATIBLES
   ========================================================= */

export const getFileExtension =
  getCreativeFileExtension;

export const getFileBasename =
  getCreativeFileBasename;

export const sanitizeFilename =
  sanitizeCreativeFileName;

export const formatFileSize =
  formatCreativeFileSize;

export const validateCreativeUploadFile =
  validateCreativeFile;