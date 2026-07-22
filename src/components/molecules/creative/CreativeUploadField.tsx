"use client";

/*
 * Campo de carga de archivos para el módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Seleccionar archivos mediante el explorador.
 * - Recibir archivos mediante arrastrar y soltar.
 * - Validar formato, tamaño y cantidad.
 * - Mostrar los archivos seleccionados.
 * - Permitir eliminar archivos individualmente.
 * - Permitir limpiar toda la selección.
 * - Admitir uso controlado y no controlado.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Carga directa al servidor.
 * - Acceso a Prisma.
 * - Generación de URLs temporales.
 */

import {
  forwardRef,
  useId,
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
  DragEvent,
  InputHTMLAttributes,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeUploadFieldLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeUploadFieldSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeUploadFieldVariant =
  | "surface"
  | "soft"
  | "dark";

/* =========================================================
   MOTIVOS DE RECHAZO
   ========================================================= */

export type CreativeUploadRejectionReason =
  | "INVALID_TYPE"
  | "FILE_TOO_LARGE"
  | "TOO_MANY_FILES"
  | "DUPLICATE_FILE";

/* =========================================================
   ARCHIVO RECHAZADO
   ========================================================= */

export interface CreativeRejectedFile {
  file:
    File;

  reason:
    CreativeUploadRejectionReason;

  message:
    string;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeUploadFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "children"
    | "type"
    | "size"
    | "value"
    | "defaultValue"
    | "onChange"
    | "accept"
    | "multiple"
    | "className"
  > {
  /*
   * Archivos controlados.
   */
  files?:
    readonly File[];

  /*
   * Archivos iniciales para uso no controlado.
   */
  defaultFiles?:
    readonly File[];

  /*
   * Cambio de archivos aceptados.
   */
  onFilesChange?:
    (
      files:
        File[],
    ) => void;

  /*
   * Archivos rechazados.
   */
  onRejectedFiles?:
    (
      rejectedFiles:
        CreativeRejectedFile[],
    ) => void;

  /*
   * Configuración de formatos.
   *
   * Ejemplos:
   * image/png,image/jpeg
   * .png,.jpg,.jpeg
   * image/*
   */
  accept?:
    string;

  allowedMimeTypes?:
    readonly string[];

  allowedExtensions?:
    readonly string[];

  /*
   * Configuración de cantidad.
   */
  multiple?:
    boolean;

  maximumFiles?:
    number;

  /*
   * Tamaño máximo por archivo.
   */
  maximumFileSizeBytes?:
    number;

  /*
   * Idioma.
   */
  language?:
    CreativeUploadFieldLanguage;

  /*
   * Apariencia.
   */
  size?:
    CreativeUploadFieldSize;

  variant?:
    CreativeUploadFieldVariant;

  /*
   * Estado del campo.
   */
  loading?:
    boolean;

  /*
   * Textos.
   */
  label?:
    string | null;

  description?:
    string | null;

  helperText?:
    string | null;

  error?:
    string | null;

  selectLabel?:
    string | null;

  clearLabel?:
    string | null;

  removeLabel?:
    string | null;

  emptyLabel?:
    string | null;

  /*
   * Visibilidad.
   */
  showLabel?:
    boolean;

  showDescription?:
    boolean;

  showFileList?:
    boolean;

  showFileSize?:
    boolean;

  showClearButton?:
    boolean;

  /*
   * Contenido adicional.
   */
  icon?:
    ReactNode;

  leadingContent?:
    ReactNode;

  trailingContent?:
    ReactNode;

  /*
   * Clases adicionales.
   */
  className?:
    string;

  headerClassName?:
    string;

  dropzoneClassName?:
    string;

  inputClassName?:
    string;

  fileListClassName?:
    string;

  fileItemClassName?:
    string;

  selectButtonClassName?:
    string;

  clearButtonClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_UPLOAD_FIELD_COPY = {
  es: {
    label:
      "Subir archivos",

    description:
      "Arrastra los archivos aquí o selecciónalos desde tu equipo.",

    select:
      "Seleccionar archivos",

    selectSingle:
      "Seleccionar archivo",

    clear:
      "Limpiar archivos",

    remove:
      "Eliminar archivo",

    empty:
      "Todavía no seleccionaste ningún archivo.",

    loading:
      "Procesando archivos...",

    invalidType:
      "El formato del archivo no está permitido.",

    fileTooLarge:
      "El archivo supera el tamaño máximo permitido.",

    tooManyFiles:
      "Se alcanzó la cantidad máxima de archivos.",

    duplicate:
      "Este archivo ya fue seleccionado.",

    selectedFiles:
      "Archivos seleccionados",

    maximumSize:
      "Tamaño máximo por archivo",

    maximumFiles:
      "Cantidad máxima",

    file:
      "archivo",

    files:
      "archivos",
  },

  en: {
    label:
      "Upload files",

    description:
      "Drag files here or select them from your device.",

    select:
      "Select files",

    selectSingle:
      "Select file",

    clear:
      "Clear files",

    remove:
      "Remove file",

    empty:
      "No files have been selected yet.",

    loading:
      "Processing files...",

    invalidType:
      "The file format is not allowed.",

    fileTooLarge:
      "The file exceeds the maximum allowed size.",

    tooManyFiles:
      "The maximum number of files has been reached.",

    duplicate:
      "This file has already been selected.",

    selectedFiles:
      "Selected files",

    maximumSize:
      "Maximum size per file",

    maximumFiles:
      "Maximum quantity",

    file:
      "file",

    files:
      "files",
  },
} as const;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_UPLOAD_FIELD_BASE_CLASSES = [
  "w-full",
  "min-w-0",
  "border",
  "transition-colors",
  "duration-200",
].join(
  " ",
);

/* =========================================================
   VARIANTES
   ========================================================= */

const CREATIVE_UPLOAD_FIELD_VARIANT_CLASSES = {
  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "shadow-[0_14px_42px_rgba(15,23,42,0.08)]",
    "backdrop-blur-xl",

    "dark:border-white/10",
    "dark:bg-zinc-950/85",
    "dark:shadow-[0_16px_46px_rgba(0,0,0,0.28)]",
  ].join(
    " ",
  ),

  soft: [
    "border-emerald-500/15",
    "bg-emerald-500/[0.04]",

    "dark:border-emerald-400/15",
    "dark:bg-emerald-400/[0.04]",
  ].join(
    " ",
  ),

  dark: [
    "border-white/10",
    "bg-black/70",
    "text-white",
    "shadow-[0_16px_48px_rgba(0,0,0,0.38)]",
    "backdrop-blur-xl",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeUploadFieldVariant,
  string
>;

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_UPLOAD_FIELD_SIZE_CLASSES = {
  sm: {
    root:
      "rounded-2xl p-3",

    dropzone:
      "min-h-32 rounded-xl p-4",

    icon:
      "h-10 w-10 rounded-xl [&>svg]:h-5 [&>svg]:w-5",

    title:
      "text-sm",

    description:
      "text-xs leading-5",

    button:
      "min-h-9 rounded-lg px-3 py-2 text-xs",

    file:
      "rounded-lg px-3 py-2.5",

    fileName:
      "text-xs",

    metadata:
      "text-[10px]",
  },

  md: {
    root:
      "rounded-2xl p-4",

    dropzone:
      "min-h-40 rounded-2xl p-5",

    icon:
      "h-12 w-12 rounded-2xl [&>svg]:h-6 [&>svg]:w-6",

    title:
      "text-base",

    description:
      "text-sm leading-6",

    button:
      "min-h-10 rounded-xl px-4 py-2.5 text-sm",

    file:
      "rounded-xl px-4 py-3",

    fileName:
      "text-sm",

    metadata:
      "text-xs",
  },

  lg: {
    root:
      "rounded-3xl p-5",

    dropzone:
      "min-h-48 rounded-2xl p-6",

    icon:
      "h-14 w-14 rounded-2xl [&>svg]:h-7 [&>svg]:w-7",

    title:
      "text-lg",

    description:
      "text-base leading-7",

    button:
      "min-h-11 rounded-xl px-5 py-3 text-sm",

    file:
      "rounded-xl px-4 py-3.5",

    fileName:
      "text-base",

    metadata:
      "text-xs",
  },
} as const satisfies Record<
  CreativeUploadFieldSize,
  {
    root:
      string;

    dropzone:
      string;

    icon:
      string;

    title:
      string;

    description:
      string;

    button:
      string;

    file:
      string;

    fileName:
      string;

    metadata:
      string;
  }
>;

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeUploadFieldClasses(
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

function normalizeCreativeUploadText(
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

function normalizeCreativeUploadMaximumFiles(
  value:
    number,
  multiple:
    boolean,
): number {
  if (
    !multiple
  ) {
    return 1;
  }

  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 10;
  }

  return Math.min(
    100,
    Math.max(
      1,
      Math.trunc(
        value,
      ),
    ),
  );
}

function normalizeCreativeUploadMaximumSize(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <=
      0
  ) {
    return 10 *
      1024 *
      1024;
  }

  return Math.trunc(
    value,
  );
}

function normalizeCreativeUploadFiles(
  files:
    readonly File[] | null | undefined,
): File[] {
  if (
    !Array.isArray(
      files,
    )
  ) {
    return [];
  }

  return files.filter(
    (
      file,
    ): file is File =>
      file instanceof
      File,
  );
}

function normalizeCreativeUploadExtensions(
  extensions:
    readonly string[] | null | undefined,
): string[] {
  if (
    !Array.isArray(
      extensions,
    )
  ) {
    return [];
  }

  return Array.from(
    new Set(
      extensions
        .map(
          (
            extension,
          ) => {
            const normalizedExtension =
              normalizeCreativeUploadText(
                extension,
              )
                .toLowerCase();

            if (
              !normalizedExtension
            ) {
              return "";
            }

            return normalizedExtension.startsWith(
              ".",
            )
              ? normalizedExtension
              : `.${normalizedExtension}`;
          },
        )
        .filter(
          Boolean,
        ),
    ),
  );
}

function normalizeCreativeUploadMimeTypes(
  mimeTypes:
    readonly string[] | null | undefined,
): string[] {
  if (
    !Array.isArray(
      mimeTypes,
    )
  ) {
    return [];
  }

  return Array.from(
    new Set(
      mimeTypes
        .map(
          (
            mimeType,
          ) =>
            normalizeCreativeUploadText(
              mimeType,
            )
              .toLowerCase(),
        )
        .filter(
          Boolean,
        ),
    ),
  );
}

/* =========================================================
   FORMATEAR TAMAÑO
   ========================================================= */

export function formatCreativeUploadFileSize(
  bytes:
    number,
): string {
  if (
    !Number.isFinite(
      bytes,
    ) ||
    bytes <=
      0
  ) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ] as const;

  const unitIndex =
    Math.min(
      units.length -
        1,
      Math.floor(
        Math.log(
          bytes,
        ) /
          Math.log(
            1024,
          ),
      ),
    );

  const value =
    bytes /
    1024 **
      unitIndex;

  const decimals =
    unitIndex ===
      0 ||
    value >=
      10
      ? 0
      : 1;

  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
}

/* =========================================================
   ARCHIVOS DUPLICADOS
   ========================================================= */

function areCreativeUploadFilesEqual(
  firstFile:
    File,
  secondFile:
    File,
): boolean {
  return (
    firstFile.name ===
      secondFile.name &&
    firstFile.size ===
      secondFile.size &&
    firstFile.lastModified ===
      secondFile.lastModified
  );
}

/* =========================================================
   VALIDACIÓN DE FORMATO
   ========================================================= */

function matchesCreativeUploadRule(
  file:
    File,
  rule:
    string,
): boolean {
  const normalizedRule =
    rule
      .trim()
      .toLowerCase();

  if (
    !normalizedRule
  ) {
    return false;
  }

  const fileName =
    file.name.toLowerCase();

  const fileType =
    file.type.toLowerCase();

  if (
    normalizedRule.startsWith(
      ".",
    )
  ) {
    return fileName.endsWith(
      normalizedRule,
    );
  }

  if (
    normalizedRule.endsWith(
      "/*",
    )
  ) {
    const category =
      normalizedRule.slice(
        0,
        -1,
      );

    return fileType.startsWith(
      category,
    );
  }

  return fileType ===
    normalizedRule;
}

function isCreativeUploadFileTypeAllowed(
  file:
    File,
  accept:
    string,
  mimeTypes:
    readonly string[],
  extensions:
    readonly string[],
): boolean {
  const acceptRules =
    accept
      .split(
        ",",
      )
      .map(
        (
          rule,
        ) =>
          rule.trim(),
      )
      .filter(
        Boolean,
      );

  const rules = [
    ...acceptRules,
    ...mimeTypes,
    ...extensions,
  ];

  if (
    rules.length ===
    0
  ) {
    return true;
  }

  return rules.some(
    (
      rule,
    ) =>
      matchesCreativeUploadRule(
        file,
        rule,
      ),
  );
}

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeUploadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 16V4" />

      <path d="m7 9 5-5 5 5" />

      <path d="M5 20h14" />
    </svg>
  );
}

function CreativeUploadFileIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M6 2h8l4 4v16H6Z" />

      <path d="M14 2v5h5" />
    </svg>
  );
}

function CreativeUploadRemoveIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M5 5l10 10" />

      <path d="M15 5 5 15" />
    </svg>
  );
}

function CreativeUploadClearIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />

      <path d="M3 4v6h6" />
    </svg>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativeUploadField =
  forwardRef<
    HTMLInputElement,
    CreativeUploadFieldProps
  >(
    function CreativeUploadField(
      {
        files,

        defaultFiles =
          [],

        onFilesChange,

        onRejectedFiles,

        accept =
          "",

        allowedMimeTypes =
          [],

        allowedExtensions =
          [],

        multiple =
          false,

        maximumFiles =
          10,

        maximumFileSizeBytes =
          10 *
          1024 *
          1024,

        language =
          "es",

        size =
          "md",

        variant =
          "surface",

        loading =
          false,

        label =
          null,

        description =
          null,

        helperText =
          null,

        error =
          null,

        selectLabel =
          null,

        clearLabel =
          null,

        removeLabel =
          null,

        emptyLabel =
          null,

        showLabel =
          true,

        showDescription =
          true,

        showFileList =
          true,

        showFileSize =
          true,

        showClearButton =
          true,

        icon =
          null,

        leadingContent =
          null,

        trailingContent =
          null,

        className,

        headerClassName,

        dropzoneClassName,

        inputClassName,

        fileListClassName,

        fileItemClassName,

        selectButtonClassName,

        clearButtonClassName,

        disabled =
          false,

        required =
          false,

        id,

        name,

        "aria-label":
          ariaLabel,

        "aria-describedby":
          ariaDescribedBy,

        ...inputProps
      },
      forwardedRef,
    ) {
      const generatedId =
        useId();

      const internalInputRef =
        useRef<HTMLInputElement | null>(
          null,
        );

      const dragDepthRef =
        useRef<number>(
          0,
        );

      const [
        internalFiles,
        setInternalFiles,
      ] =
        useState<File[]>(
          () =>
            normalizeCreativeUploadFiles(
              defaultFiles,
            ),
        );

      const [
        dragActive,
        setDragActive,
      ] =
        useState<boolean>(
          false,
        );

      const copy =
        CREATIVE_UPLOAD_FIELD_COPY[
          language
        ];

      const controlled =
        files !==
        undefined;

      const selectedFiles =
        controlled
          ? normalizeCreativeUploadFiles(
              files,
            )
          : internalFiles;

      const normalizedMaximumFiles =
        normalizeCreativeUploadMaximumFiles(
          maximumFiles,
          multiple,
        );

      const normalizedMaximumFileSize =
        normalizeCreativeUploadMaximumSize(
          maximumFileSizeBytes,
        );

      const normalizedMimeTypes =
        normalizeCreativeUploadMimeTypes(
          allowedMimeTypes,
        );

      const normalizedExtensions =
        normalizeCreativeUploadExtensions(
          allowedExtensions,
        );

      const normalizedAccept =
        normalizeCreativeUploadText(
          accept,
        );

      const generatedAccept =
        [
          ...normalizedMimeTypes,
          ...normalizedExtensions,
        ]
          .filter(
            Boolean,
          )
          .join(
            ",",
          );

      const resolvedAccept =
        normalizedAccept ||
        generatedAccept ||
        undefined;

      const resolvedInputId =
        id ??
        `creative-upload-${generatedId}`;

      const helperId =
        `${resolvedInputId}-helper`;

      const errorId =
        `${resolvedInputId}-error`;

      const descriptionId =
        `${resolvedInputId}-description`;

      const resolvedLabel =
        normalizeCreativeUploadText(
          label,
        ) ||
        copy.label;

      const resolvedDescription =
        normalizeCreativeUploadText(
          description,
        ) ||
        copy.description;

      const resolvedSelectLabel =
        normalizeCreativeUploadText(
          selectLabel,
        ) ||
        (
          multiple
            ? copy.select
            : copy.selectSingle
        );

      const resolvedClearLabel =
        normalizeCreativeUploadText(
          clearLabel,
        ) ||
        copy.clear;

      const resolvedRemoveLabel =
        normalizeCreativeUploadText(
          removeLabel,
        ) ||
        copy.remove;

      const resolvedEmptyLabel =
        normalizeCreativeUploadText(
          emptyLabel,
        ) ||
        copy.empty;

      const normalizedHelperText =
        normalizeCreativeUploadText(
          helperText,
        );

      const normalizedError =
        normalizeCreativeUploadText(
          error,
        );

      const interactionDisabled =
        disabled ||
        loading;

      const describedBy =
        [
          ariaDescribedBy,

          showDescription
            ? descriptionId
            : "",

          normalizedHelperText
            ? helperId
            : "",

          normalizedError
            ? errorId
            : "",
        ]
          .filter(
            Boolean,
          )
          .join(
            " ",
          ) ||
        undefined;

      const fileCountLabel =
        selectedFiles.length ===
          1
          ? copy.file
          : copy.files;

      const setInputReferences =
        (
          element:
            HTMLInputElement | null,
        ): void => {
          internalInputRef.current =
            element;

          if (
            typeof forwardedRef ===
            "function"
          ) {
            forwardedRef(
              element,
            );

            return;
          }

          if (
            forwardedRef
          ) {
            forwardedRef.current =
              element;
          }
        };

      const commitFiles =
        (
          nextFiles:
            File[],
        ): void => {
          if (
            !controlled
          ) {
            setInternalFiles(
              nextFiles,
            );
          }

          onFilesChange?.(
            nextFiles,
          );
        };

      const processFiles =
        (
          incomingFiles:
            File[],
        ): void => {
          if (
            interactionDisabled ||
            incomingFiles.length ===
              0
          ) {
            return;
          }

          const nextFiles =
            multiple
              ? [
                  ...selectedFiles,
                ]
              : [];

          const rejectedFiles:
            CreativeRejectedFile[] =
              [];

          for (
            const file of
            incomingFiles
          ) {
            if (
              nextFiles.length >=
              normalizedMaximumFiles
            ) {
              rejectedFiles.push({
                file,

                reason:
                  "TOO_MANY_FILES",

                message:
                  copy.tooManyFiles,
              });

              continue;
            }

            if (
              file.size >
              normalizedMaximumFileSize
            ) {
              rejectedFiles.push({
                file,

                reason:
                  "FILE_TOO_LARGE",

                message:
                  copy.fileTooLarge,
              });

              continue;
            }

            if (
              !isCreativeUploadFileTypeAllowed(
                file,
                normalizedAccept,
                normalizedMimeTypes,
                normalizedExtensions,
              )
            ) {
              rejectedFiles.push({
                file,

                reason:
                  "INVALID_TYPE",

                message:
                  copy.invalidType,
              });

              continue;
            }

            const duplicate =
              nextFiles.some(
                (
                  selectedFile,
                ) =>
                  areCreativeUploadFilesEqual(
                    selectedFile,
                    file,
                  ),
              );

            if (
              duplicate
            ) {
              rejectedFiles.push({
                file,

                reason:
                  "DUPLICATE_FILE",

                message:
                  copy.duplicate,
              });

              continue;
            }

            nextFiles.push(
              file,
            );

            if (
              !multiple
            ) {
              break;
            }
          }

          commitFiles(
            nextFiles,
          );

          if (
            rejectedFiles.length >
            0
          ) {
            onRejectedFiles?.(
              rejectedFiles,
            );
          }
        };

      const handleInputChange =
        (
          event:
            ChangeEvent<HTMLInputElement>,
        ): void => {
          const nextFiles =
            Array.from(
              event.currentTarget.files ??
              [],
            );

          processFiles(
            nextFiles,
          );

          event.currentTarget.value =
            "";
        };

      const handleOpenPicker =
        (): void => {
          if (
            interactionDisabled
          ) {
            return;
          }

          internalInputRef.current?.click();
        };

      const handleClear =
        (): void => {
          if (
            interactionDisabled
          ) {
            return;
          }

          commitFiles(
            [],
          );

          if (
            internalInputRef.current
          ) {
            internalInputRef.current.value =
              "";
          }
        };

      const handleRemoveFile =
        (
          fileIndex:
            number,
        ): void => {
          if (
            interactionDisabled
          ) {
            return;
          }

          const nextFiles =
            selectedFiles.filter(
              (
                _,
                index,
              ) =>
                index !==
                fileIndex,
            );

          commitFiles(
            nextFiles,
          );
        };

      const handleDragEnter =
        (
          event:
            DragEvent<HTMLDivElement>,
        ): void => {
          event.preventDefault();
          event.stopPropagation();

          if (
            interactionDisabled
          ) {
            return;
          }

          dragDepthRef.current +=
            1;

          setDragActive(
            true,
          );
        };

      const handleDragOver =
        (
          event:
            DragEvent<HTMLDivElement>,
        ): void => {
          event.preventDefault();
          event.stopPropagation();

          if (
            event.dataTransfer
          ) {
            event.dataTransfer.dropEffect =
              interactionDisabled
                ? "none"
                : "copy";
          }
        };

      const handleDragLeave =
        (
          event:
            DragEvent<HTMLDivElement>,
        ): void => {
          event.preventDefault();
          event.stopPropagation();

          dragDepthRef.current =
            Math.max(
              0,
              dragDepthRef.current -
                1,
            );

          if (
            dragDepthRef.current ===
            0
          ) {
            setDragActive(
              false,
            );
          }
        };

      const handleDrop =
        (
          event:
            DragEvent<HTMLDivElement>,
        ): void => {
          event.preventDefault();
          event.stopPropagation();

          dragDepthRef.current =
            0;

          setDragActive(
            false,
          );

          if (
            interactionDisabled
          ) {
            return;
          }

          const droppedFiles =
            Array.from(
              event.dataTransfer.files ??
              [],
            );

          processFiles(
            droppedFiles,
          );
        };

      return (
        <div
          data-creative-upload-field=""
          data-size={
            size
          }
          data-variant={
            variant
          }
          data-drag-active={
            dragActive
              ? "true"
              : "false"
          }
          data-file-count={
            selectedFiles.length
          }
          aria-busy={
            loading ||
            undefined
          }
          className={
            joinCreativeUploadFieldClasses(
              CREATIVE_UPLOAD_FIELD_BASE_CLASSES,

              CREATIVE_UPLOAD_FIELD_VARIANT_CLASSES[
                variant
              ],

              CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                size
              ].root,

              interactionDisabled &&
                "opacity-65",

              className,
            )
          }
        >
          <div
            className={
              joinCreativeUploadFieldClasses(
                "flex flex-wrap items-start justify-between gap-3",

                headerClassName,
              )
            }
          >
            <div className="min-w-0">
              {showLabel ? (
                <label
                  htmlFor={
                    resolvedInputId
                  }
                  className={
                    joinCreativeUploadFieldClasses(
                      "block font-bold",

                      variant ===
                        "dark"
                        ? "text-white"
                        : "text-zinc-950 dark:text-white",

                      CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                        size
                      ].title,
                    )
                  }
                >
                  {resolvedLabel}

                  {required ? (
                    <span
                      aria-hidden="true"
                      className="ml-1 text-red-500"
                    >
                      *
                    </span>
                  ) : null}
                </label>
              ) : null}

              {showDescription ? (
                <p
                  id={
                    descriptionId
                  }
                  className={
                    joinCreativeUploadFieldClasses(
                      "mt-1 text-zinc-500",

                      "dark:text-zinc-400",

                      CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                        size
                      ].description,
                    )
                  }
                >
                  {resolvedDescription}
                </p>
              ) : null}
            </div>

            {selectedFiles.length >
              0 &&
            showClearButton ? (
              <button
                type="button"
                disabled={
                  interactionDisabled
                }
                onClick={
                  handleClear
                }
                className={
                  joinCreativeUploadFieldClasses(
                    "inline-flex min-h-9 items-center justify-center gap-2",
                    "rounded-xl border border-red-500/20",
                    "bg-red-500/[0.07] px-3 py-2",
                    "text-xs font-semibold text-red-700",
                    "outline-none transition-all duration-200",

                    "enabled:hover:border-red-500/35",
                    "enabled:hover:bg-red-500/15",

                    "focus-visible:ring-2",
                    "focus-visible:ring-red-500/50",

                    "disabled:cursor-not-allowed",
                    "disabled:opacity-45",

                    "dark:border-red-400/20",
                    "dark:bg-red-400/[0.07]",
                    "dark:text-red-300",

                    clearButtonClassName,
                  )
                }
              >
                <CreativeUploadClearIcon />

                <span>
                  {resolvedClearLabel}
                </span>
              </button>
            ) : null}
          </div>

          {leadingContent}

          <div
            onDragEnter={
              handleDragEnter
            }
            onDragOver={
              handleDragOver
            }
            onDragLeave={
              handleDragLeave
            }
            onDrop={
              handleDrop
            }
            className={
              joinCreativeUploadFieldClasses(
                "mt-4 flex flex-col items-center justify-center",
                "border-2 border-dashed text-center",
                "transition-all duration-200",

                dragActive
                  ? [
                      "border-emerald-500",
                      "bg-emerald-500/10",
                      "shadow-[0_0_0_4px_rgba(16,185,129,0.10)]",

                      "dark:border-emerald-400",
                      "dark:bg-emerald-400/10",
                    ].join(
                      " ",
                    )
                  : [
                      "border-zinc-300",
                      "bg-zinc-50/70",

                      "dark:border-white/15",
                      "dark:bg-white/[0.03]",
                    ].join(
                      " ",
                    ),

                interactionDisabled &&
                  "cursor-not-allowed",

                CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                  size
                ].dropzone,

                dropzoneClassName,
              )
            }
          >
            <input
              {...inputProps}
              ref={
                setInputReferences
              }
              id={
                resolvedInputId
              }
              name={
                name
              }
              type="file"
              accept={
                resolvedAccept
              }
              multiple={
                multiple
              }
              disabled={
                interactionDisabled
              }
              required={
                required &&
                selectedFiles.length ===
                  0
              }
              aria-label={
                ariaLabel ??
                (
                  showLabel
                    ? undefined
                    : resolvedLabel
                )
              }
              aria-describedby={
                describedBy
              }
              aria-invalid={
                Boolean(
                  normalizedError,
                ) ||
                undefined
              }
              onChange={
                handleInputChange
              }
              className={
                joinCreativeUploadFieldClasses(
                  "sr-only",

                  inputClassName,
                )
              }
            />

            <span
              aria-hidden="true"
              className={
                joinCreativeUploadFieldClasses(
                  "flex items-center justify-center",
                  "border border-emerald-500/20",
                  "bg-emerald-500/10",
                  "text-emerald-700",

                  "dark:border-emerald-400/20",
                  "dark:bg-emerald-400/10",
                  "dark:text-emerald-300",

                  CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                    size
                  ].icon,
                )
              }
            >
              {icon ??
              (
                <CreativeUploadIcon />
              )}
            </span>

            <p
              className={
                joinCreativeUploadFieldClasses(
                  "mt-3 font-bold",

                  variant ===
                    "dark"
                    ? "text-white"
                    : "text-zinc-900 dark:text-white",

                  CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                    size
                  ].title,
                )
              }
            >
              {dragActive
                ? resolvedDescription
                : resolvedSelectLabel}
            </p>

            <p
              className={
                joinCreativeUploadFieldClasses(
                  "mt-2 text-zinc-500",
                  "dark:text-zinc-400",

                  CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                    size
                  ].description,
                )
              }
            >
              {copy.maximumSize}:{" "}
              {formatCreativeUploadFileSize(
                normalizedMaximumFileSize,
              )}

              {multiple ? (
                <>
                  {" "}•{" "}
                  {copy.maximumFiles}:{" "}
                  {normalizedMaximumFiles}
                </>
              ) : null}
            </p>

            <button
              type="button"
              disabled={
                interactionDisabled
              }
              onClick={
                handleOpenPicker
              }
              className={
                joinCreativeUploadFieldClasses(
                  "mt-4 inline-flex items-center justify-center gap-2",
                  "border border-emerald-500/25",
                  "bg-gradient-to-r",
                  "from-emerald-500",
                  "to-green-600",
                  "font-bold text-white",
                  "outline-none transition-all duration-200",

                  "enabled:hover:-translate-y-0.5",
                  "enabled:hover:from-emerald-400",
                  "enabled:hover:to-emerald-600",
                  "enabled:hover:shadow-[0_10px_26px_rgba(16,185,129,0.25)]",

                  "enabled:active:translate-y-0",
                  "enabled:active:scale-[0.98]",

                  "focus-visible:ring-2",
                  "focus-visible:ring-emerald-500/60",
                  "focus-visible:ring-offset-2",

                  "disabled:cursor-not-allowed",
                  "disabled:opacity-45",

                  "dark:border-emerald-300/20",
                  "dark:focus-visible:ring-emerald-400/60",
                  "dark:focus-visible:ring-offset-zinc-950",

                  CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                    size
                  ].button,

                  selectButtonClassName,
                )
              }
            >
              {loading ? (
                <CreativeSpinner
                  decorative
                  size="sm"
                  variant="light"
                />
              ) : (
                <CreativeUploadIcon />
              )}

              <span>
                {loading
                  ? copy.loading
                  : resolvedSelectLabel}
              </span>
            </button>
          </div>

          {normalizedHelperText ? (
            <p
              id={
                helperId
              }
              className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
            >
              {normalizedHelperText}
            </p>
          ) : null}

          {normalizedError ? (
            <p
              id={
                errorId
              }
              role="alert"
              className="mt-3 text-xs font-semibold leading-5 text-red-600 dark:text-red-300"
            >
              {normalizedError}
            </p>
          ) : null}

          {showFileList ? (
            <div
              className={
                joinCreativeUploadFieldClasses(
                  "mt-5",

                  fileListClassName,
                )
              }
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {copy.selectedFiles}
                </h3>

                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  {selectedFiles.length}{" "}
                  {fileCountLabel}
                </span>
              </div>

              {selectedFiles.length >
              0 ? (
                <ul className="mt-3 space-y-2">
                  {selectedFiles.map(
                    (
                      file,
                      fileIndex,
                    ) => (
                      <li
                        key={
                          `${file.name}-${file.size}-${file.lastModified}-${fileIndex}`
                        }
                        className={
                          joinCreativeUploadFieldClasses(
                            "flex min-w-0 items-center gap-3",
                            "border border-zinc-200/90",
                            "bg-zinc-50/80",

                            "dark:border-white/10",
                            "dark:bg-white/[0.04]",

                            CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                              size
                            ].file,

                            fileItemClassName,
                          )
                        }
                      >
                        <span
                          aria-hidden="true"
                          className={[
                            "flex h-9 w-9 shrink-0",
                            "items-center justify-center",
                            "rounded-lg",
                            "bg-emerald-500/10",
                            "text-emerald-700",

                            "dark:bg-emerald-400/10",
                            "dark:text-emerald-300",
                          ].join(
                            " ",
                          )}
                        >
                          <CreativeUploadFileIcon />
                        </span>

                        <div className="min-w-0 flex-1">
                          <p
                            title={
                              file.name
                            }
                            className={
                              joinCreativeUploadFieldClasses(
                                "truncate font-semibold",
                                "text-zinc-800",
                                "dark:text-zinc-200",

                                CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                                  size
                                ].fileName,
                              )
                            }
                          >
                            {file.name}
                          </p>

                          {showFileSize ? (
                            <p
                              className={
                                joinCreativeUploadFieldClasses(
                                  "mt-1 text-zinc-500",
                                  "dark:text-zinc-400",

                                  CREATIVE_UPLOAD_FIELD_SIZE_CLASSES[
                                    size
                                  ].metadata,
                                )
                              }
                            >
                              {formatCreativeUploadFileSize(
                                file.size,
                              )}

                              {file.type ? (
                                <>
                                  {" "}•{" "}
                                  {file.type}
                                </>
                              ) : null}
                            </p>
                          ) : null}
                        </div>

                        <button
                          type="button"
                          disabled={
                            interactionDisabled
                          }
                          aria-label={
                            `${resolvedRemoveLabel}: ${file.name}`
                          }
                          title={
                            `${resolvedRemoveLabel}: ${file.name}`
                          }
                          onClick={
                            () => {
                              handleRemoveFile(
                                fileIndex,
                              );
                            }
                          }
                          className={[
                            "flex h-9 w-9 shrink-0",
                            "items-center justify-center",
                            "rounded-lg",
                            "text-zinc-400",
                            "outline-none",
                            "transition-colors duration-150",

                            "enabled:hover:bg-red-500/10",
                            "enabled:hover:text-red-600",

                            "focus-visible:ring-2",
                            "focus-visible:ring-red-500/50",

                            "disabled:cursor-not-allowed",
                            "disabled:opacity-45",

                            "dark:text-zinc-500",
                            "dark:enabled:hover:text-red-300",
                          ].join(
                            " ",
                          )}
                        >
                          <CreativeUploadRemoveIcon />
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  {resolvedEmptyLabel}
                </p>
              )}
            </div>
          ) : null}

          {trailingContent}
        </div>
      );
    },
  );

CreativeUploadField.displayName =
  "CreativeUploadField";

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeUploadField;