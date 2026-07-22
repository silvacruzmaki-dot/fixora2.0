"use client";

/*
 * Buscador controlado o no controlado para el catálogo
 * Diseño / Creative.
 *
 * Responsabilidades:
 * - Buscar publicaciones por texto.
 * - Ejecutar la búsqueda mediante Enter o botón.
 * - Limpiar el contenido.
 * - Mostrar un estado de carga.
 * - Mantener accesibilidad.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Navegación.
 * - Acceso a Prisma.
 * - Estado del catálogo.
 */

import {
  forwardRef,
  useId,
  useState,
} from "react";

import type {
  FormEvent,
  InputHTMLAttributes,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeSearchInputLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeSearchInputSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeSearchInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "children"
    | "type"
    | "size"
    | "value"
    | "defaultValue"
    | "onChange"
  > {
  /*
   * Valor controlado.
   */
  value?:
    string;

  /*
   * Valor inicial no controlado.
   */
  defaultValue?:
    string;

  /*
   * Se ejecuta cada vez que cambia el texto.
   */
  onValueChange?:
    (
      value:
        string,
    ) => void;

  /*
   * Se ejecuta al presionar Enter o el botón Buscar.
   */
  onSearch?:
    (
      value:
        string,
    ) => void | Promise<void>;

  /*
   * Se ejecuta al limpiar el campo.
   */
  onClear?:
    () => void;

  /*
   * Idioma de los textos automáticos.
   */
  language?:
    CreativeSearchInputLanguage;

  /*
   * Tamaño visual.
   */
  size?:
    CreativeSearchInputSize;

  /*
   * Etiqueta accesible y visual.
   */
  label?:
    string | null;

  /*
   * Muestra la etiqueta encima del buscador.
   */
  showLabel?:
    boolean;

  /*
   * Muestra el botón para limpiar.
   */
  clearable?:
    boolean;

  /*
   * Muestra el botón Buscar.
   */
  showSearchButton?:
    boolean;

  /*
   * Estado de procesamiento.
   */
  loading?:
    boolean;

  /*
   * Permite ejecutar una búsqueda vacía.
   */
  allowEmptySearch?:
    boolean;

  /*
   * Textos personalizados.
   */
  searchLabel?:
    string | null;

  clearLabel?:
    string | null;

  loadingLabel?:
    string | null;

  /*
   * Contenido adicional.
   */
  leadingContent?:
    ReactNode;

  trailingContent?:
    ReactNode;

  /*
   * Clases adicionales.
   */
  wrapperClassName?:
    string;

  labelClassName?:
    string;

  fieldClassName?:
    string;

  inputClassName?:
    string;

  clearButtonClassName?:
    string;

  searchButtonClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_SEARCH_INPUT_COPY = {
  es: {
    label:
      "Buscar diseños",

    placeholder:
      "Buscar por título, categoría, herramienta o etiqueta...",

    search:
      "Buscar",

    clear:
      "Limpiar búsqueda",

    loading:
      "Buscando...",
  },

  en: {
    label:
      "Search designs",

    placeholder:
      "Search by title, category, tool or tag...",

    search:
      "Search",

    clear:
      "Clear search",

    loading:
      "Searching...",
  },
} as const;

/* =========================================================
   CLASES POR TAMAÑO
   ========================================================= */

const CREATIVE_SEARCH_INPUT_SIZE_CLASSES = {
  sm: {
    field:
      "min-h-10 rounded-xl",

    input:
      "px-3 py-2 text-xs",

    icon:
      "h-4 w-4",

    button:
      "min-h-8 px-3 text-xs",
  },

  md: {
    field:
      "min-h-12 rounded-2xl",

    input:
      "px-4 py-3 text-sm",

    icon:
      "h-[18px] w-[18px]",

    button:
      "min-h-9 px-4 text-sm",
  },

  lg: {
    field:
      "min-h-14 rounded-2xl",

    input:
      "px-5 py-4 text-base",

    icon:
      "h-5 w-5",

    button:
      "min-h-10 px-5 text-sm",
  },
} as const satisfies Record<
  CreativeSearchInputSize,
  {
    field:
      string;

    input:
      string;

    icon:
      string;

    button:
      string;
  }
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeSearchInputClasses(
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

/* =========================================================
   NORMALIZAR TEXTO
   ========================================================= */

function normalizeCreativeSearchText(
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

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeSearchIcon({
  className,
}: {
  className:
    string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function CreativeSearchClearIcon() {
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

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativeSearchInput =
  forwardRef<
    HTMLInputElement,
    CreativeSearchInputProps
  >(
    function CreativeSearchInput(
      {
        value,

        defaultValue =
          "",

        onValueChange,

        onSearch,

        onClear,

        language =
          "es",

        size =
          "md",

        label =
          null,

        showLabel =
          false,

        clearable =
          true,

        showSearchButton =
          true,

        loading =
          false,

        allowEmptySearch =
          false,

        searchLabel =
          null,

        clearLabel =
          null,

        loadingLabel =
          null,

        leadingContent =
          null,

        trailingContent =
          null,

        wrapperClassName,

        labelClassName,

        fieldClassName,

        inputClassName,

        clearButtonClassName,

        searchButtonClassName,

        className,

        disabled =
          false,

        placeholder,

        autoComplete =
          "off",

        maxLength =
          160,

        id,

        name,

        "aria-label":
          ariaLabel,

        ...inputProps
      },
      ref,
    ) {
      const generatedId =
        useId();

      const copy =
        CREATIVE_SEARCH_INPUT_COPY[
          language
        ];

      const controlled =
        typeof value ===
        "string";

      const [
        internalValue,
        setInternalValue,
      ] =
        useState<string>(
          defaultValue,
        );

      const currentValue =
        controlled
          ? value
          : internalValue;

      const normalizedValue =
        normalizeCreativeSearchText(
          currentValue,
        );

      const resolvedInputId =
        id ??
        `creative-search-${generatedId}`;

      const resolvedLabel =
        normalizeCreativeSearchText(
          label,
        ) ||
        copy.label;

      const resolvedSearchLabel =
        normalizeCreativeSearchText(
          searchLabel,
        ) ||
        copy.search;

      const resolvedClearLabel =
        normalizeCreativeSearchText(
          clearLabel,
        ) ||
        copy.clear;

      const resolvedLoadingLabel =
        normalizeCreativeSearchText(
          loadingLabel,
        ) ||
        copy.loading;

      const resolvedPlaceholder =
        placeholder ??
        copy.placeholder;

      const interactionDisabled =
        disabled ||
        loading;

      const searchDisabled =
        interactionDisabled ||
        (
          !allowEmptySearch &&
          !normalizedValue
        ) ||
        !onSearch;

      const showClearButton =
        clearable &&
        currentValue.length >
          0;

      const handleValueChange =
        (
          nextValue:
            string,
        ): void => {
          if (
            !controlled
          ) {
            setInternalValue(
              nextValue,
            );
          }

          onValueChange?.(
            nextValue,
          );
        };

      const handleClear =
        (): void => {
          if (
            interactionDisabled
          ) {
            return;
          }

          handleValueChange(
            "",
          );

          onClear?.();
        };

      const handleSubmit =
        (
          event:
            FormEvent<HTMLFormElement>,
        ): void => {
          event.preventDefault();

          if (
            searchDisabled
          ) {
            return;
          }

          void onSearch?.(
            normalizedValue,
          );
        };

      return (
        <form
          role="search"
          aria-busy={
            loading ||
            undefined
          }
          data-creative-search-input=""
          data-size={
            size
          }
          onSubmit={
            handleSubmit
          }
          className={
            joinCreativeSearchInputClasses(
              "w-full space-y-2",

              wrapperClassName,
            )
          }
        >
          {showLabel ? (
            <label
              htmlFor={
                resolvedInputId
              }
              className={
                joinCreativeSearchInputClasses(
                  "block text-sm font-semibold",
                  "text-zinc-700",
                  "dark:text-zinc-200",

                  labelClassName,
                )
              }
            >
              {resolvedLabel}
            </label>
          ) : null}

          <div
            className={
              joinCreativeSearchInputClasses(
                "flex w-full min-w-0 items-center gap-2",
                "border border-zinc-200/90",
                "bg-white/90",
                "shadow-[0_10px_30px_rgba(15,23,42,0.07)]",
                "backdrop-blur-xl",
                "transition-all duration-200",

                "focus-within:border-emerald-500/45",
                "focus-within:ring-2",
                "focus-within:ring-emerald-500/15",

                "dark:border-white/10",
                "dark:bg-zinc-950/85",
                "dark:shadow-[0_12px_34px_rgba(0,0,0,0.25)]",

                "dark:focus-within:border-emerald-400/40",
                "dark:focus-within:ring-emerald-400/15",

                interactionDisabled &&
                  "cursor-not-allowed opacity-60",

                CREATIVE_SEARCH_INPUT_SIZE_CLASSES[
                  size
                ].field,

                fieldClassName,
              )
            }
          >
            <span
              aria-hidden="true"
              className="ml-4 flex shrink-0 items-center justify-center text-zinc-400 dark:text-zinc-500"
            >
              {leadingContent ??
              (
                <CreativeSearchIcon
                  className={
                    CREATIVE_SEARCH_INPUT_SIZE_CLASSES[
                      size
                    ].icon
                  }
                />
              )}
            </span>

            <input
              {...inputProps}
              ref={ref}
              id={
                resolvedInputId
              }
              name={
                name
              }
              type="search"
              value={
                currentValue
              }
              disabled={
                interactionDisabled
              }
              placeholder={
                resolvedPlaceholder
              }
              autoComplete={
                autoComplete
              }
              maxLength={
                maxLength
              }
              aria-label={
                ariaLabel ??
                (
                  showLabel
                    ? undefined
                    : resolvedLabel
                )
              }
              onChange={
                (
                  event,
                ) => {
                  handleValueChange(
                    event.target.value,
                  );
                }
              }
              className={
                joinCreativeSearchInputClasses(
                  "min-w-0 flex-1 bg-transparent",
                  "text-zinc-950",
                  "placeholder:text-zinc-400",
                  "outline-none",
                  "[&::-webkit-search-cancel-button]:hidden",
                  "[&::-webkit-search-decoration]:hidden",

                  "disabled:cursor-not-allowed",

                  "dark:text-white",
                  "dark:placeholder:text-zinc-500",

                  CREATIVE_SEARCH_INPUT_SIZE_CLASSES[
                    size
                  ].input,

                  inputClassName,

                  className,
                )
              }
            />

            {loading ? (
              <span className="flex shrink-0 items-center justify-center pr-1">
                <CreativeSpinner
                  decorative
                  size="sm"
                  variant="primary"
                />
              </span>
            ) : null}

            {showClearButton &&
            !loading ? (
              <button
                type="button"
                disabled={
                  interactionDisabled
                }
                aria-label={
                  resolvedClearLabel
                }
                title={
                  resolvedClearLabel
                }
                onClick={
                  handleClear
                }
                className={
                  joinCreativeSearchInputClasses(
                    "flex h-8 w-8 shrink-0 items-center justify-center",
                    "rounded-lg",
                    "text-zinc-400",
                    "outline-none",
                    "transition-colors duration-150",

                    "hover:bg-zinc-100",
                    "hover:text-zinc-700",

                    "focus-visible:ring-2",
                    "focus-visible:ring-emerald-500/50",

                    "disabled:pointer-events-none",
                    "disabled:opacity-40",

                    "dark:hover:bg-white/[0.08]",
                    "dark:hover:text-white",

                    clearButtonClassName,
                  )
                }
              >
                <CreativeSearchClearIcon />
              </button>
            ) : null}

            {trailingContent}

            {showSearchButton ? (
              <button
                type="submit"
                disabled={
                  searchDisabled
                }
                aria-label={
                  loading
                    ? resolvedLoadingLabel
                    : resolvedSearchLabel
                }
                className={
                  joinCreativeSearchInputClasses(
                    "mr-1.5 inline-flex shrink-0 items-center justify-center gap-2",
                    "rounded-xl",
                    "border border-emerald-500/25",
                    "bg-gradient-to-r",
                    "from-emerald-500",
                    "to-green-600",
                    "font-bold text-white",
                    "outline-none",
                    "transition-all duration-200",

                    "enabled:hover:-translate-y-0.5",
                    "enabled:hover:from-emerald-400",
                    "enabled:hover:to-emerald-600",
                    "enabled:hover:shadow-[0_8px_22px_rgba(16,185,129,0.25)]",

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

                    CREATIVE_SEARCH_INPUT_SIZE_CLASSES[
                      size
                    ].button,

                    searchButtonClassName,
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
                  <CreativeSearchIcon
                    className="h-4 w-4"
                  />
                )}

                <span className="hidden sm:inline">
                  {loading
                    ? resolvedLoadingLabel
                    : resolvedSearchLabel}
                </span>
              </button>
            ) : null}
          </div>
        </form>
      );
    },
  );

CreativeSearchInput.displayName =
  "CreativeSearchInput";

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeSearchInput;