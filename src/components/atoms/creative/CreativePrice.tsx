/*
 * Precio reutilizable del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar el precio de una publicación pagada.
 * - Mostrar el estado gratuito.
 * - Mostrar el estado de portafolio.
 * - Formatear monedas de manera determinista.
 * - Mostrar precio anterior y porcentaje de descuento.
 * - Adaptarse al idioma y al modo claro u oscuro.
 *
 * No contiene:
 * - Estado React.
 * - Solicitudes HTTP.
 * - Lógica de compra.
 * - Confirmación de pagos.
 * - Navegación.
 */

import {
  forwardRef,
} from "react";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import type {
  CreativeContentType,
  CreativeCurrency,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativePriceLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativePriceSize =
  | "sm"
  | "md"
  | "lg"
  | "xl";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativePriceVariant =
  | "default"
  | "compact"
  | "card"
  | "viewer"
  | "admin";

/* =========================================================
   ALINEACIÓN
   ========================================================= */

export type CreativePriceAlignment =
  | "start"
  | "center"
  | "end";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativePriceProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    "children"
  > {
  /*
   * Precio del diseño.
   *
   * Puede recibirse como número o texto procedente
   * de una API o formulario administrativo.
   */
  price?:
    number | string | null;

  /*
   * Precio anterior para mostrar una rebaja.
   */
  originalPrice?:
    number | string | null;

  /*
   * Tipo oficial de contenido.
   *
   * FREE:
   * muestra "Gratis".
   *
   * PAID:
   * muestra el precio.
   *
   * PORTFOLIO:
   * indica que no está disponible para venta.
   */
  contentType?:
    CreativeContentType | null;

  /*
   * Moneda del precio.
   */
  currency?:
    CreativeCurrency;

  /*
   * Idioma de las etiquetas.
   */
  language?:
    CreativePriceLanguage;

  /*
   * Tamaño visual.
   */
  size?:
    CreativePriceSize;

  /*
   * Variante visual.
   */
  variant?:
    CreativePriceVariant;

  /*
   * Alineación interna.
   */
  align?:
    CreativePriceAlignment;

  /*
   * Muestra siempre dos decimales.
   */
  showDecimals?:
    boolean;

  /*
   * Muestra el código de moneda después del precio.
   *
   * Ejemplo:
   * S/ 25,00 PEN
   */
  showCurrencyCode?:
    boolean;

  /*
   * Etiqueta mostrada antes del precio.
   *
   * Ejemplo:
   * "Desde"
   */
  prefixLabel?:
    string | null;

  /*
   * Contenido mostrado después del precio.
   */
  suffix?:
    ReactNode;

  /*
   * Etiqueta personalizada para contenido gratuito.
   */
  freeLabel?:
    string | null;

  /*
   * Etiqueta personalizada para portafolio.
   */
  portfolioLabel?:
    string | null;

  /*
   * Etiqueta cuando el precio no es válido.
   */
  unavailableLabel?:
    string | null;

  /*
   * Porcentaje de descuento proporcionado manualmente.
   *
   * Cuando no se proporciona, se calcula usando
   * price y originalPrice.
   */
  discountPercentage?:
    number | null;

  /*
   * Permite ocultar el descuento.
   */
  showDiscount?:
    boolean;

  /*
   * Permite ocultar el precio anterior.
   */
  showOriginalPrice?:
    boolean;

  /*
   * Clases adicionales.
   */
  amountClassName?:
    string;

  labelClassName?:
    string;

  originalPriceClassName?:
    string;

  discountClassName?:
    string;
}

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_PRICE_BASE_CLASSES = [
  "inline-flex",
  "max-w-full",
  "flex-wrap",
  "items-baseline",
  "font-semibold",
  "leading-none",
  "text-zinc-950",
  "dark:text-white",
].join(
  " ",
);

/* =========================================================
   CLASES POR TAMAÑO
   ========================================================= */

const CREATIVE_PRICE_SIZE_CLASSES = {
  sm: [
    "gap-x-1.5",
    "gap-y-1",
  ].join(
    " ",
  ),

  md: [
    "gap-x-2",
    "gap-y-1",
  ].join(
    " ",
  ),

  lg: [
    "gap-x-2.5",
    "gap-y-1.5",
  ].join(
    " ",
  ),

  xl: [
    "gap-x-3",
    "gap-y-2",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativePriceSize,
  string
>;

/* =========================================================
   TAMAÑO DEL PRECIO
   ========================================================= */

const CREATIVE_PRICE_AMOUNT_SIZE_CLASSES = {
  sm:
    "text-base",

  md:
    "text-xl",

  lg:
    "text-2xl",

  xl:
    "text-3xl sm:text-4xl",
} as const satisfies Record<
  CreativePriceSize,
  string
>;

/* =========================================================
   TAMAÑO DE TEXTOS SECUNDARIOS
   ========================================================= */

const CREATIVE_PRICE_SECONDARY_SIZE_CLASSES = {
  sm:
    "text-[10px]",

  md:
    "text-xs",

  lg:
    "text-sm",

  xl:
    "text-base",
} as const satisfies Record<
  CreativePriceSize,
  string
>;

/* =========================================================
   VARIANTES VISUALES
   ========================================================= */

const CREATIVE_PRICE_VARIANT_CLASSES = {
  default:
    "",

  compact:
    "whitespace-nowrap",

  card: [
    "rounded-xl",
    "border",
    "border-zinc-200/80",
    "bg-white/75",
    "px-3",
    "py-2",
    "shadow-sm",
    "backdrop-blur-md",

    "dark:border-white/10",
    "dark:bg-white/[0.05]",
  ].join(
    " ",
  ),

  viewer: [
    "rounded-2xl",
    "border",
    "border-emerald-500/20",
    "bg-emerald-500/[0.07]",
    "px-4",
    "py-3",
    "shadow-[0_12px_36px_rgba(16,185,129,0.10)]",

    "dark:border-emerald-400/20",
    "dark:bg-emerald-400/[0.08]",
  ].join(
    " ",
  ),

  admin: [
    "rounded-xl",
    "border",
    "border-zinc-300/80",
    "bg-zinc-100/80",
    "px-3",
    "py-2",

    "dark:border-white/10",
    "dark:bg-zinc-900/70",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativePriceVariant,
  string
>;

/* =========================================================
   ALINEACIÓN
   ========================================================= */

const CREATIVE_PRICE_ALIGNMENT_CLASSES = {
  start:
    "justify-start text-left",

  center:
    "justify-center text-center",

  end:
    "justify-end text-right",
} as const satisfies Record<
  CreativePriceAlignment,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativePriceClasses(
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

function normalizeCreativePriceText(
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
   NORMALIZAR PRECIO
   ========================================================= */

export function normalizeCreativePriceValue(
  value:
    number | string | null | undefined,
): number | null {
  if (
    typeof value ===
    "number"
  ) {
    if (
      !Number.isFinite(
        value,
      ) ||
      value <
        0
    ) {
      return null;
    }

    return Math.round(
      value *
      100,
    ) /
    100;
  }

  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalizedValue =
    value
      .trim()
      .replace(
        /\s+/g,
        "",
      )
      .replace(
        /S\/|PEN|\$/gi,
        "",
      );

  if (
    !normalizedValue
  ) {
    return null;
  }

  /*
   * Admite:
   * 25
   * 25.5
   * 25,50
   * 1.250,50
   * 1,250.50
   */
  const lastCommaIndex =
    normalizedValue.lastIndexOf(
      ",",
    );

  const lastDotIndex =
    normalizedValue.lastIndexOf(
      ".",
    );

  let numericValue =
    normalizedValue;

  if (
    lastCommaIndex >
    lastDotIndex
  ) {
    numericValue =
      normalizedValue
        .replace(
          /\./g,
          "",
        )
        .replace(
          ",",
          ".",
        );
  } else if (
    lastDotIndex >
    lastCommaIndex &&
    lastCommaIndex >=
      0
  ) {
    numericValue =
      normalizedValue.replace(
        /,/g,
        "",
      );
  } else {
    numericValue =
      normalizedValue.replace(
        ",",
        ".",
      );
  }

  const parsedValue =
    Number(
      numericValue,
    );

  if (
    !Number.isFinite(
      parsedValue,
    ) ||
    parsedValue <
      0
  ) {
    return null;
  }

  return Math.round(
    parsedValue *
    100,
  ) /
  100;
}

/* =========================================================
   SÍMBOLO DE MONEDA
   ========================================================= */

export function getCreativeCurrencySymbol(
  currency:
    CreativeCurrency,
): string {
  const normalizedCurrency =
    String(
      currency,
    )
      .trim()
      .toUpperCase();

  switch (
    normalizedCurrency
  ) {
    case "PEN":
      return "S/";

    case "USD":
      return "$";

    case "EUR":
      return "€";

    default:
      return normalizedCurrency;
  }
}

/* =========================================================
   FORMATO NUMÉRICO DETERMINISTA
   ========================================================= */

/*
 * No utiliza Intl.NumberFormat.
 *
 * De esta manera, el servidor y el navegador generan
 * exactamente el mismo texto y se evitan diferencias
 * de hidratación por configuraciones regionales.
 */
export function formatCreativePriceNumber(
  value:
    number,
  language:
    CreativePriceLanguage,
  showDecimals:
    boolean,
): string {
  const decimalPlaces =
    showDecimals
      ? 2
      : Number.isInteger(
            value,
          )
        ? 0
        : 2;

  const fixedValue =
    value.toFixed(
      decimalPlaces,
    );

  const [
    integerPart,
    decimalPart,
  ] =
    fixedValue.split(
      ".",
    );

  const thousandsSeparator =
    language ===
      "es"
      ? "."
      : ",";

  const decimalSeparator =
    language ===
      "es"
      ? ","
      : ".";

  const groupedInteger =
    integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandsSeparator,
    );

  if (
    decimalPlaces ===
      0 ||
    decimalPart ===
      undefined
  ) {
    return groupedInteger;
  }

  return `${groupedInteger}${decimalSeparator}${decimalPart}`;
}

/* =========================================================
   FORMATEAR PRECIO COMPLETO
   ========================================================= */

export function formatCreativePrice(
  value:
    number,
  currency:
    CreativeCurrency,
  language:
    CreativePriceLanguage = "es",
  showDecimals =
    true,
): string {
  const symbol =
    getCreativeCurrencySymbol(
      currency,
    );

  const formattedNumber =
    formatCreativePriceNumber(
      value,
      language,
      showDecimals,
    );

  return `${symbol} ${formattedNumber}`;
}

/* =========================================================
   CALCULAR DESCUENTO
   ========================================================= */

export function calculateCreativeDiscountPercentage(
  price:
    number,
  originalPrice:
    number,
): number | null {
  if (
    originalPrice <=
      0 ||
    price >=
      originalPrice
  ) {
    return null;
  }

  const discount =
    (
      (
        originalPrice -
        price
      ) /
      originalPrice
    ) *
    100;

  return Math.min(
    100,
    Math.max(
      1,
      Math.round(
        discount,
      ),
    ),
  );
}

/* =========================================================
   NORMALIZAR DESCUENTO MANUAL
   ========================================================= */

function normalizeCreativeDiscountPercentage(
  value:
    number | null | undefined,
): number | null {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    ) ||
    value <=
      0
  ) {
    return null;
  }

  return Math.min(
    100,
    Math.max(
      1,
      Math.round(
        value,
      ),
    ),
  );
}

/* =========================================================
   ETIQUETAS
   ========================================================= */

function getCreativeFreePriceLabel(
  language:
    CreativePriceLanguage,
): string {
  return language ===
    "en"
    ? "Free"
    : "Gratis";
}

function getCreativePortfolioPriceLabel(
  language:
    CreativePriceLanguage,
): string {
  return language ===
    "en"
    ? "Portfolio only"
    : "Solo portafolio";
}

function getCreativeUnavailablePriceLabel(
  language:
    CreativePriceLanguage,
): string {
  return language ===
    "en"
    ? "Price unavailable"
    : "Precio no disponible";
}

function getCreativeOriginalPriceLabel(
  language:
    CreativePriceLanguage,
): string {
  return language ===
    "en"
    ? "Previous price"
    : "Precio anterior";
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export const CreativePrice =
  forwardRef<
    HTMLSpanElement,
    CreativePriceProps
  >(
    function CreativePrice(
      {
        price,

        originalPrice =
          null,

        contentType =
          null,

        currency =
          "PEN" as CreativeCurrency,

        language =
          "es",

        size =
          "md",

        variant =
          "default",

        align =
          "start",

        showDecimals =
          true,

        showCurrencyCode =
          false,

        prefixLabel =
          null,

        suffix =
          null,

        freeLabel =
          null,

        portfolioLabel =
          null,

        unavailableLabel =
          null,

        discountPercentage =
          null,

        showDiscount =
          true,

        showOriginalPrice =
          true,

        amountClassName,

        labelClassName,

        originalPriceClassName,

        discountClassName,

        className,

        title,

        "aria-label":
          ariaLabel,

        ...spanProps
      },
      ref,
    ) {
      const normalizedPrice =
        normalizeCreativePriceValue(
          price,
        );

      const normalizedOriginalPrice =
        normalizeCreativePriceValue(
          originalPrice,
        );

      const normalizedPrefixLabel =
        normalizeCreativePriceText(
          prefixLabel,
        );

      const normalizedFreeLabel =
        normalizeCreativePriceText(
          freeLabel,
        );

      const normalizedPortfolioLabel =
        normalizeCreativePriceText(
          portfolioLabel,
        );

      const normalizedUnavailableLabel =
        normalizeCreativePriceText(
          unavailableLabel,
        );

      const currencyCode =
        String(
          currency,
        )
          .trim()
          .toUpperCase();

      const freeContent =
        contentType ===
        "FREE";

      const portfolioContent =
        contentType ===
        "PORTFOLIO";

      const paidContent =
        contentType ===
        "PAID";

      const resolvedDiscount =
        normalizeCreativeDiscountPercentage(
          discountPercentage,
        ) ??
        (
          normalizedPrice !==
            null &&
          normalizedOriginalPrice !==
            null
            ? calculateCreativeDiscountPercentage(
                normalizedPrice,
                normalizedOriginalPrice,
              )
            : null
        );

      const validOriginalPrice =
        normalizedPrice !==
          null &&
        normalizedOriginalPrice !==
          null &&
        normalizedOriginalPrice >
          normalizedPrice;

      const resolvedFreeLabel =
        normalizedFreeLabel ||
        getCreativeFreePriceLabel(
          language,
        );

      const resolvedPortfolioLabel =
        normalizedPortfolioLabel ||
        getCreativePortfolioPriceLabel(
          language,
        );

      const resolvedUnavailableLabel =
        normalizedUnavailableLabel ||
        getCreativeUnavailablePriceLabel(
          language,
        );

      let accessibleText =
        "";

      if (
        freeContent
      ) {
        accessibleText =
          resolvedFreeLabel;
      } else if (
        portfolioContent
      ) {
        accessibleText =
          resolvedPortfolioLabel;
      } else if (
        normalizedPrice !==
        null
      ) {
        accessibleText =
          formatCreativePrice(
            normalizedPrice,
            currency,
            language,
            showDecimals,
          );
      } else {
        accessibleText =
          resolvedUnavailableLabel;
      }

      return (
        <span
          {...spanProps}
          ref={ref}
          title={
            title ??
            accessibleText
          }
          aria-label={
            ariaLabel ??
            accessibleText
          }
          data-creative-price=""
          data-content-type={
            contentType ??
            undefined
          }
          data-currency={
            currencyCode
          }
          data-available={
            normalizedPrice !==
              null ||
            freeContent ||
            portfolioContent
              ? "true"
              : "false"
          }
          className={
            joinCreativePriceClasses(
              CREATIVE_PRICE_BASE_CLASSES,

              CREATIVE_PRICE_SIZE_CLASSES[
                size
              ],

              CREATIVE_PRICE_VARIANT_CLASSES[
                variant
              ],

              CREATIVE_PRICE_ALIGNMENT_CLASSES[
                align
              ],

              className,
            )
          }
        >
          {normalizedPrefixLabel &&
          paidContent ? (
            <span
              className={
                joinCreativePriceClasses(
                  "font-medium text-zinc-500",
                  "dark:text-zinc-400",

                  CREATIVE_PRICE_SECONDARY_SIZE_CLASSES[
                    size
                  ],

                  labelClassName,
                )
              }
            >
              {normalizedPrefixLabel}
            </span>
          ) : null}

          {freeContent ? (
            <span
              className={
                joinCreativePriceClasses(
                  "font-bold text-emerald-600",
                  "dark:text-emerald-300",

                  CREATIVE_PRICE_AMOUNT_SIZE_CLASSES[
                    size
                  ],

                  amountClassName,
                )
              }
            >
              {resolvedFreeLabel}
            </span>
          ) : portfolioContent ? (
            <span
              className={
                joinCreativePriceClasses(
                  "font-semibold text-cyan-700",
                  "dark:text-cyan-300",

                  CREATIVE_PRICE_AMOUNT_SIZE_CLASSES[
                    size
                  ],

                  amountClassName,
                )
              }
            >
              {resolvedPortfolioLabel}
            </span>
          ) : normalizedPrice !==
            null ? (
            <>
              <span
                className={
                  joinCreativePriceClasses(
                    "font-bold tracking-[-0.025em]",
                    "text-zinc-950",
                    "dark:text-white",

                    CREATIVE_PRICE_AMOUNT_SIZE_CLASSES[
                      size
                    ],

                    amountClassName,
                  )
                }
              >
                {formatCreativePrice(
                  normalizedPrice,
                  currency,
                  language,
                  showDecimals,
                )}
              </span>

              {showCurrencyCode ? (
                <span
                  className={
                    joinCreativePriceClasses(
                      "font-semibold uppercase tracking-[0.08em]",
                      "text-zinc-500",
                      "dark:text-zinc-400",

                      CREATIVE_PRICE_SECONDARY_SIZE_CLASSES[
                        size
                      ],

                      labelClassName,
                    )
                  }
                >
                  {currencyCode}
                </span>
              ) : null}

              {showOriginalPrice &&
              validOriginalPrice ? (
                <span
                  aria-label={
                    `${getCreativeOriginalPriceLabel(language)}: ${formatCreativePrice(
                      normalizedOriginalPrice,
                      currency,
                      language,
                      showDecimals,
                    )}`
                  }
                  className={
                    joinCreativePriceClasses(
                      "font-medium text-zinc-400 line-through",
                      "decoration-zinc-400/80",
                      "dark:text-zinc-500",

                      CREATIVE_PRICE_SECONDARY_SIZE_CLASSES[
                        size
                      ],

                      originalPriceClassName,
                    )
                  }
                >
                  {formatCreativePrice(
                    normalizedOriginalPrice,
                    currency,
                    language,
                    showDecimals,
                  )}
                </span>
              ) : null}

              {showDiscount &&
              resolvedDiscount !==
                null ? (
                <span
                  className={
                    joinCreativePriceClasses(
                      "inline-flex items-center justify-center",
                      "rounded-full border",
                      "border-emerald-500/20",
                      "bg-emerald-500/10",
                      "px-2 py-1",
                      "font-bold text-emerald-700",

                      "dark:border-emerald-400/20",
                      "dark:bg-emerald-400/10",
                      "dark:text-emerald-300",

                      CREATIVE_PRICE_SECONDARY_SIZE_CLASSES[
                        size
                      ],

                      discountClassName,
                    )
                  }
                >
                  -{resolvedDiscount}%
                </span>
              ) : null}
            </>
          ) : (
            <span
              className={
                joinCreativePriceClasses(
                  "font-medium text-zinc-500",
                  "dark:text-zinc-400",

                  CREATIVE_PRICE_SECONDARY_SIZE_CLASSES[
                    size
                  ],

                  amountClassName,
                )
              }
            >
              {resolvedUnavailableLabel}
            </span>
          )}

          {suffix ? (
            <span
              className={
                joinCreativePriceClasses(
                  "font-medium text-zinc-500",
                  "dark:text-zinc-400",

                  CREATIVE_PRICE_SECONDARY_SIZE_CLASSES[
                    size
                  ],

                  labelClassName,
                )
              }
            >
              {suffix}
            </span>
          ) : null}
        </span>
      );
    },
  );

CreativePrice.displayName =
  "CreativePrice";

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativePrice;