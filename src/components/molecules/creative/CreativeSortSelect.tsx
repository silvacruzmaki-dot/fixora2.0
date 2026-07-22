"use client";

/*
 * Selector de ordenamiento del catálogo Diseño / Creative.
 *
 * Responsabilidades:
 * - Ordenar publicaciones por relevancia, fecha y popularidad.
 * - Ordenar diseños de pago por precio.
 * - Admitir uso controlado y no controlado.
 * - Mostrar estado deshabilitado o de carga.
 * - Mantener accesibilidad mediante label y atributos ARIA.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Navegación.
 * - Acceso a Prisma.
 * - Estado general del catálogo.
 */

import {
  forwardRef,
  useId,
  useState,
} from "react";

import type {
  SelectHTMLAttributes,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeSortSelectLanguage =
  | "es"
  | "en";

/* =========================================================
   VALORES DE ORDENAMIENTO
   ========================================================= */

export type CreativeSortValue =
  | "RELEVANCE"
  | "NEWEST"
  | "OLDEST"
  | "MOST_VIEWED"
  | "MOST_LIKED"
  | "MOST_COMMENTED"
  | "MOST_DOWNLOADED"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "TITLE_ASC"
  | "TITLE_DESC";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeSortSelectSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeSortSelectVariant =
  | "surface"
  | "soft"
  | "minimal";

/* =========================================================
   OPCIONES
   ========================================================= */

export interface CreativeSortOption {
  value:
    CreativeSortValue;

  label:
    string;

  disabled?:
    boolean;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeSortSelectProps
  extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    | "children"
    | "size"
    | "value"
    | "defaultValue"
    | "onChange"
  > {
  /*
   * Valor controlado.
   */
  value?:
    CreativeSortValue;

  /*
   * Valor inicial no controlado.
   */
  defaultValue?:
    CreativeSortValue;

  /*
   * Se ejecuta al cambiar el orden.
   */
  onValueChange?:
    (
      value:
        CreativeSortValue,
    ) => void;

  /*
   * Idioma de las opciones automáticas.
   */
  language?:
    CreativeSortSelectLanguage;

  /*
   * Tamaño visual.
   */
  size?:
    CreativeSortSelectSize;

  /*
   * Variante visual.
   */
  variant?:
    CreativeSortSelectVariant;

  /*
   * Etiqueta del campo.
   */
  label?:
    string | null;

  /*
   * Muestra la etiqueta visual.
   */
  showLabel?:
    boolean;

  /*
   * Opciones personalizadas.
   *
   * Cuando no se proporcionan se usan
   * las opciones oficiales del módulo.
   */
  options?:
    CreativeSortOption[];

  /*
   * Estado de carga.
   */
  loading?:
    boolean;

  /*
   * Permite mostrar opciones relacionadas
   * con precios.
   */
  includePriceOptions?:
    boolean;

  /*
   * Permite mostrar opciones relacionadas
   * con descargas.
   */
  includeDownloadOption?:
    boolean;

  /*
   * Clases adicionales.
   */
  wrapperClassName?:
    string;

  labelClassName?:
    string;

  fieldClassName?:
    string;

  selectClassName?:
    string;

  iconClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_SORT_SELECT_COPY = {
  es: {
    label:
      "Ordenar por",

    relevance:
      "Más relevantes",

    newest:
      "Más recientes",

    oldest:
      "Más antiguos",

    mostViewed:
      "Más vistos",

    mostLiked:
      "Más gustados",

    mostCommented:
      "Más comentados",

    mostDownloaded:
      "Más descargados",

    priceAscending:
      "Precio: menor a mayor",

    priceDescending:
      "Precio: mayor a menor",

    titleAscending:
      "Título: A a Z",

    titleDescending:
      "Título: Z a A",

    loading:
      "Cargando opciones de ordenamiento",
  },

  en: {
    label:
      "Sort by",

    relevance:
      "Most relevant",

    newest:
      "Newest",

    oldest:
      "Oldest",

    mostViewed:
      "Most viewed",

    mostLiked:
      "Most liked",

    mostCommented:
      "Most commented",

    mostDownloaded:
      "Most downloaded",

    priceAscending:
      "Price: low to high",

    priceDescending:
      "Price: high to low",

    titleAscending:
      "Title: A to Z",

    titleDescending:
      "Title: Z to A",

    loading:
      "Loading sorting options",
  },
} as const;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_SORT_SELECT_FIELD_BASE_CLASSES = [
  "relative",
  "flex",
  "w-full",
  "items-center",
  "overflow-hidden",
  "border",
  "transition-all",
  "duration-200",

  "focus-within:ring-2",
  "focus-within:ring-emerald-500/15",

  "dark:focus-within:ring-emerald-400/15",
].join(
  " ",
);

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_SORT_SELECT_SIZE_CLASSES = {
  sm: {
    field:
      "min-h-10 rounded-xl",

    select:
      "py-2 pl-3 pr-10 text-xs",

    icon:
      "right-3 h-4 w-4",
  },

  md: {
    field:
      "min-h-12 rounded-2xl",

    select:
      "py-3 pl-4 pr-11 text-sm",

    icon:
      "right-4 h-[18px] w-[18px]",
  },

  lg: {
    field:
      "min-h-14 rounded-2xl",

    select:
      "py-4 pl-5 pr-12 text-base",

    icon:
      "right-4 h-5 w-5",
  },
} as const satisfies Record<
  CreativeSortSelectSize,
  {
    field:
      string;

    select:
      string;

    icon:
      string;
  }
>;

/* =========================================================
   VARIANTES
   ========================================================= */

const CREATIVE_SORT_SELECT_VARIANT_CLASSES = {
  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "shadow-[0_10px_30px_rgba(15,23,42,0.07)]",
    "backdrop-blur-xl",

    "focus-within:border-emerald-500/45",

    "dark:border-white/10",
    "dark:bg-zinc-950/85",
    "dark:shadow-[0_12px_34px_rgba(0,0,0,0.25)]",

    "dark:focus-within:border-emerald-400/40",
  ].join(
    " ",
  ),

  soft: [
    "border-emerald-500/15",
    "bg-emerald-500/[0.07]",

    "focus-within:border-emerald-500/40",

    "dark:border-emerald-400/15",
    "dark:bg-emerald-400/[0.07]",

    "dark:focus-within:border-emerald-400/40",
  ].join(
    " ",
  ),

  minimal: [
    "border-transparent",
    "bg-zinc-100/80",

    "focus-within:border-emerald-500/30",

    "dark:bg-white/[0.06]",
    "dark:focus-within:border-emerald-400/30",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeSortSelectVariant,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeSortSelectClasses(
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

function normalizeCreativeSortText(
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
   VALIDAR VALOR
   ========================================================= */

const CREATIVE_SORT_VALUES:
  readonly CreativeSortValue[] = [
    "RELEVANCE",
    "NEWEST",
    "OLDEST",
    "MOST_VIEWED",
    "MOST_LIKED",
    "MOST_COMMENTED",
    "MOST_DOWNLOADED",
    "PRICE_ASC",
    "PRICE_DESC",
    "TITLE_ASC",
    "TITLE_DESC",
  ];

export function isCreativeSortValue(
  value:
    string,
): value is CreativeSortValue {
  return CREATIVE_SORT_VALUES.includes(
    value as CreativeSortValue,
  );
}

/* =========================================================
   OPCIONES AUTOMÁTICAS
   ========================================================= */

export function getCreativeSortOptions(
  language:
    CreativeSortSelectLanguage = "es",
  configuration: {
    includePriceOptions?:
      boolean;

    includeDownloadOption?:
      boolean;
  } = {},
): CreativeSortOption[] {
  const {
    includePriceOptions =
      true,

    includeDownloadOption =
      true,
  } =
    configuration;

  const copy =
    CREATIVE_SORT_SELECT_COPY[
      language
    ];

  const options:
    CreativeSortOption[] = [
      {
        value:
          "RELEVANCE",

        label:
          copy.relevance,
      },

      {
        value:
          "NEWEST",

        label:
          copy.newest,
      },

      {
        value:
          "OLDEST",

        label:
          copy.oldest,
      },

      {
        value:
          "MOST_VIEWED",

        label:
          copy.mostViewed,
      },

      {
        value:
          "MOST_LIKED",

        label:
          copy.mostLiked,
      },

      {
        value:
          "MOST_COMMENTED",

        label:
          copy.mostCommented,
      },
    ];

  if (
    includeDownloadOption
  ) {
    options.push({
      value:
        "MOST_DOWNLOADED",

      label:
        copy.mostDownloaded,
    });
  }

  if (
    includePriceOptions
  ) {
    options.push(
      {
        value:
          "PRICE_ASC",

        label:
          copy.priceAscending,
      },
      {
        value:
          "PRICE_DESC",

        label:
          copy.priceDescending,
      },
    );
  }

  options.push(
    {
      value:
        "TITLE_ASC",

      label:
        copy.titleAscending,
    },
    {
      value:
        "TITLE_DESC",

      label:
        copy.titleDescending,
    },
  );

  return options;
}

/* =========================================================
   NORMALIZAR OPCIONES
   ========================================================= */

function normalizeCreativeSortOptions(
  options:
    CreativeSortOption[],
): CreativeSortOption[] {
  const normalizedOptions:
    CreativeSortOption[] =
      [];

  const usedValues =
    new Set<CreativeSortValue>();

  for (
    const option of
    options
  ) {
    const normalizedLabel =
      normalizeCreativeSortText(
        option.label,
      );

    if (
      !normalizedLabel ||
      !isCreativeSortValue(
        option.value,
      ) ||
      usedValues.has(
        option.value,
      )
    ) {
      continue;
    }

    usedValues.add(
      option.value,
    );

    normalizedOptions.push({
      value:
        option.value,

      label:
        normalizedLabel,

      disabled:
        Boolean(
          option.disabled,
        ),
    });
  }

  return normalizedOptions;
}

/* =========================================================
   ICONO
   ========================================================= */

function CreativeSortSelectIcon({
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
      <path d="M8 6h13" />

      <path d="M8 12h9" />

      <path d="M8 18h5" />

      <path d="m3 4 2 2 2-2" />

      <path d="M5 6v12" />
    </svg>
  );
}

function CreativeSortChevronIcon() {
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
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativeSortSelect =
  forwardRef<
    HTMLSelectElement,
    CreativeSortSelectProps
  >(
    function CreativeSortSelect(
      {
        value,

        defaultValue =
          "RELEVANCE",

        onValueChange,

        language =
          "es",

        size =
          "md",

        variant =
          "surface",

        label =
          null,

        showLabel =
          false,

        options,

        loading =
          false,

        includePriceOptions =
          true,

        includeDownloadOption =
          true,

        wrapperClassName,

        labelClassName,

        fieldClassName,

        selectClassName,

        iconClassName,

        className,

        disabled =
          false,

        id,

        name,

        "aria-label":
          ariaLabel,

        ...selectProps
      },
      ref,
    ) {
      const generatedId =
        useId();

      const copy =
        CREATIVE_SORT_SELECT_COPY[
          language
        ];

      const controlled =
        value !==
        undefined;

      const [
        internalValue,
        setInternalValue,
      ] =
        useState<CreativeSortValue>(
          defaultValue,
        );

      const currentValue:
        CreativeSortValue =
          controlled
            ? value
            : internalValue;

      const resolvedId =
        id ??
        `creative-sort-${generatedId}`;

      const resolvedLabel =
        normalizeCreativeSortText(
          label,
        ) ||
        copy.label;

      const automaticOptions =
        getCreativeSortOptions(
          language,
          {
            includePriceOptions,

            includeDownloadOption,
          },
        );

      const normalizedOptions =
        normalizeCreativeSortOptions(
          options ??
          automaticOptions,
        );

      const availableValues =
        new Set(
          normalizedOptions.map(
            (
              option,
            ) =>
              option.value,
          ),
        );

      const resolvedValue:
        CreativeSortValue =
          availableValues.has(
            currentValue,
          )
            ? currentValue
            : normalizedOptions[
                0
              ]?.value ??
              "RELEVANCE";

      const interactionDisabled =
        disabled ||
        loading ||
        normalizedOptions.length ===
          0;

      return (
        <div
          data-creative-sort-select=""
          data-size={
            size
          }
          data-variant={
            variant
          }
          className={
            joinCreativeSortSelectClasses(
              "w-full space-y-2",

              wrapperClassName,
            )
          }
        >
          {showLabel ? (
            <label
              htmlFor={
                resolvedId
              }
              className={
                joinCreativeSortSelectClasses(
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
              joinCreativeSortSelectClasses(
                CREATIVE_SORT_SELECT_FIELD_BASE_CLASSES,

                CREATIVE_SORT_SELECT_SIZE_CLASSES[
                  size
                ].field,

                CREATIVE_SORT_SELECT_VARIANT_CLASSES[
                  variant
                ],

                interactionDisabled &&
                  "cursor-not-allowed opacity-60",

                fieldClassName,
              )
            }
          >
            <span
              aria-hidden="true"
              className="ml-4 flex shrink-0 items-center justify-center text-emerald-600 dark:text-emerald-400"
            >
              <CreativeSortSelectIcon
                className={
                  joinCreativeSortSelectClasses(
                    CREATIVE_SORT_SELECT_SIZE_CLASSES[
                      size
                    ].icon
                      .split(
                        " ",
                      )
                      .filter(
                        (
                          classValue,
                        ) =>
                          classValue.startsWith(
                            "h-",
                          ) ||
                          classValue.startsWith(
                            "w-",
                          ),
                      )
                      .join(
                        " ",
                      ),

                    iconClassName,
                  )
                }
              />
            </span>

            <select
              {...selectProps}
              ref={ref}
              id={
                resolvedId
              }
              name={
                name
              }
              value={
                resolvedValue
              }
              disabled={
                interactionDisabled
              }
              aria-label={
                ariaLabel ??
                (
                  showLabel
                    ? undefined
                    : resolvedLabel
                )
              }
              aria-busy={
                loading ||
                undefined
              }
              onChange={
                (
                  event,
                ) => {
                  const nextValue =
                    event.target.value;

                  if (
                    !isCreativeSortValue(
                      nextValue,
                    )
                  ) {
                    return;
                  }

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
                }
              }
              className={
                joinCreativeSortSelectClasses(
                  "min-w-0 flex-1 appearance-none",
                  "cursor-pointer bg-transparent",
                  "font-medium text-zinc-700",
                  "outline-none",

                  "disabled:cursor-not-allowed",

                  "dark:text-zinc-200",

                  CREATIVE_SORT_SELECT_SIZE_CLASSES[
                    size
                  ].select,

                  selectClassName,

                  className,
                )
              }
            >
              {normalizedOptions.map(
                (
                  option,
                ) => (
                  <option
                    key={
                      option.value
                    }
                    value={
                      option.value
                    }
                    disabled={
                      option.disabled
                    }
                    className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white"
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>

            <span
              aria-hidden="true"
              className={
                joinCreativeSortSelectClasses(
                  "pointer-events-none absolute",
                  "flex items-center justify-center",
                  "text-zinc-400",
                  "dark:text-zinc-500",

                  CREATIVE_SORT_SELECT_SIZE_CLASSES[
                    size
                  ].icon,
                )
              }
            >
              {loading ? (
                <CreativeSpinner
                  decorative
                  size="sm"
                  variant="primary"
                />
              ) : (
                <CreativeSortChevronIcon />
              )}
            </span>
          </div>
        </div>
      );
    },
  );

CreativeSortSelect.displayName =
  "CreativeSortSelect";

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeSortSelect;