"use client";

/*
 * Recurso visual reutilizable del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar imágenes del catálogo y del visor.
 * - Mantener una relación de aspecto estable.
 * - Mostrar un estado de carga.
 * - Mostrar contenido alternativo cuando falla la imagen.
 * - Aplicar marca de agua.
 * - Aplicar superposiciones visuales.
 * - Adaptarse a tarjetas, visor y administración.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Acceso a Prisma.
 * - Lógica de compras.
 * - Lógica de comentarios.
 * - Lógica de descargas.
 */

import Image from "next/image";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  SyntheticEvent,
} from "react";

/* =========================================================
   ESTADO DE CARGA
   ========================================================= */

export type CreativeMediaLoadState =
  | "IDLE"
  | "LOADING"
  | "LOADED"
  | "ERROR";

/* =========================================================
   RELACIÓN DE ASPECTO
   ========================================================= */

export type CreativeMediaAspectRatio =
  | "auto"
  | "square"
  | "portrait"
  | "landscape"
  | "wide"
  | "ultrawide";

/* =========================================================
   AJUSTE DE LA IMAGEN
   ========================================================= */

export type CreativeMediaObjectFit =
  | "cover"
  | "contain";

/* =========================================================
   REDONDEADO
   ========================================================= */

export type CreativeMediaRounded =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

/* =========================================================
   VARIANTE VISUAL
   ========================================================= */

export type CreativeMediaVariant =
  | "plain"
  | "card"
  | "viewer"
  | "admin";

/* =========================================================
   EVENTOS
   ========================================================= */

export type CreativeMediaImageEvent =
  SyntheticEvent<
    HTMLImageElement,
    Event
  >;

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeMediaProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    | "children"
    | "onLoad"
    | "onError"
  > {
  /*
   * Ruta de la imagen.
   */
  src:
    string | null | undefined;

  /*
   * Texto alternativo obligatorio.
   */
  alt:
    string;

  /*
   * Relación de aspecto.
   */
  aspectRatio?:
    CreativeMediaAspectRatio;

  /*
   * Relación personalizada.
   *
   * Ejemplos:
   * 16 / 9
   * 4 / 5
   */
  customAspectRatio?:
    number | string | null;

  /*
   * Ajuste de la imagen dentro del contenedor.
   */
  objectFit?:
    CreativeMediaObjectFit;

  /*
   * Posición del contenido.
   */
  objectPosition?:
    string;

  /*
   * Redondeado exterior.
   */
  rounded?:
    CreativeMediaRounded;

  /*
   * Variante visual.
   */
  variant?:
    CreativeMediaVariant;

  /*
   * Configuración de Next Image.
   */
  priority?:
    boolean;

  quality?:
    number;

  sizes?:
    string;

  unoptimized?:
    boolean;

  /*
   * Imagen borrosa inicial opcional.
   */
  blurDataURL?:
    string | null;

  /*
   * Marca de agua.
   */
  watermark?:
    boolean;

  watermarkText?:
    string;

  watermarkOpacity?:
    number;

  /*
   * Oscurece ligeramente la imagen.
   */
  dimmed?:
    boolean;

  /*
   * Permite efectos cuando el usuario coloca
   * el cursor sobre el recurso.
   */
  interactive?:
    boolean;

  /*
   * Contenido superpuesto.
   */
  overlay?:
    ReactNode;

  /*
   * Contenido mostrado durante la carga.
   */
  loadingContent?:
    ReactNode;

  /*
   * Contenido mostrado cuando no hay imagen
   * o cuando ocurre un error.
   */
  fallback?:
    ReactNode;

  /*
   * Oculta el indicador predeterminado de carga.
   */
  hideLoadingIndicator?:
    boolean;

  /*
   * Oculta el mensaje predeterminado de error.
   */
  hideFallbackMessage?:
    boolean;

  /*
   * Textos personalizados.
   */
  loadingLabel?:
    string;

  errorLabel?:
    string;

  emptyLabel?:
    string;

  /*
   * Eventos de la imagen.
   */
  onImageLoad?:
    (
      event:
        CreativeMediaImageEvent,
    ) => void;

  onImageError?:
    (
      event:
        CreativeMediaImageEvent,
    ) => void;

  /*
   * Clases adicionales.
   */
  imageClassName?:
    string;

  overlayClassName?:
    string;

  fallbackClassName?:
    string;

  watermarkClassName?:
    string;
}

/* =========================================================
   RELACIONES DE ASPECTO
   ========================================================= */

const CREATIVE_MEDIA_ASPECT_RATIOS = {
  auto:
    undefined,

  square:
    "1 / 1",

  portrait:
    "4 / 5",

  landscape:
    "4 / 3",

  wide:
    "16 / 9",

  ultrawide:
    "21 / 9",
} as const satisfies Record<
  CreativeMediaAspectRatio,
  string | undefined
>;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_MEDIA_BASE_CLASSES = [
  "group/creative-media",
  "relative",
  "isolate",
  "block",
  "w-full",
  "overflow-hidden",
  "bg-zinc-100",
  "text-zinc-500",
  "dark:bg-zinc-900",
  "dark:text-zinc-400",
].join(
  " ",
);

/* =========================================================
   VARIANTES
   ========================================================= */

const CREATIVE_MEDIA_VARIANT_CLASSES = {
  plain:
    "",

  card: [
    "border",
    "border-zinc-200/80",
    "shadow-[0_16px_40px_rgba(15,23,42,0.10)]",

    "dark:border-white/10",
    "dark:shadow-[0_18px_46px_rgba(0,0,0,0.32)]",
  ].join(
    " ",
  ),

  viewer: [
    "border",
    "border-white/10",
    "bg-black",
    "shadow-[0_28px_90px_rgba(0,0,0,0.42)]",
  ].join(
    " ",
  ),

  admin: [
    "border",
    "border-dashed",
    "border-zinc-300",
    "bg-zinc-50",

    "dark:border-white/15",
    "dark:bg-zinc-950",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeMediaVariant,
  string
>;

/* =========================================================
   REDONDEADO
   ========================================================= */

const CREATIVE_MEDIA_ROUNDED_CLASSES = {
  none:
    "rounded-none",

  sm:
    "rounded-md",

  md:
    "rounded-lg",

  lg:
    "rounded-xl",

  xl:
    "rounded-2xl",

  "2xl":
    "rounded-3xl",

  "3xl":
    "rounded-[2rem]",

  full:
    "rounded-full",
} as const satisfies Record<
  CreativeMediaRounded,
  string
>;

/* =========================================================
   CLASES DE LA IMAGEN
   ========================================================= */

const CREATIVE_MEDIA_IMAGE_BASE_CLASSES = [
  "select-none",
  "transition-all",
  "duration-500",
  "ease-out",
  "motion-reduce:transition-none",
].join(
  " ",
);

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeMediaClasses(
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

function normalizeCreativeMediaText(
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
   NORMALIZAR SRC
   ========================================================= */

function normalizeCreativeMediaSource(
  value:
    string | null | undefined,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  return value.trim();
}

/* =========================================================
   NORMALIZAR CALIDAD
   ========================================================= */

function normalizeCreativeMediaQuality(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 85;
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
    return 0.18;
  }

  return Math.min(
    0.7,
    Math.max(
      0.05,
      value,
    ),
  );
}

/* =========================================================
   RESOLVER RELACIÓN DE ASPECTO
   ========================================================= */

function resolveCreativeMediaAspectRatio(
  aspectRatio:
    CreativeMediaAspectRatio,
  customAspectRatio:
    number | string | null | undefined,
): CSSProperties["aspectRatio"] {
  if (
    typeof customAspectRatio ===
      "number" &&
    Number.isFinite(
      customAspectRatio,
    ) &&
    customAspectRatio >
      0
  ) {
    return customAspectRatio;
  }

  if (
    typeof customAspectRatio ===
    "string"
  ) {
    const normalizedCustomRatio =
      customAspectRatio.trim();

    if (
      normalizedCustomRatio
    ) {
      return normalizedCustomRatio;
    }
  }

  return CREATIVE_MEDIA_ASPECT_RATIOS[
    aspectRatio
  ];
}

/* =========================================================
   ICONO DE IMAGEN
   ========================================================= */

function CreativeMediaImageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
      />

      <circle
        cx="8.5"
        cy="9"
        r="1.5"
      />

      <path d="m21 15-5-5L5 20" />
    </svg>
  );
}

/* =========================================================
   INDICADOR DE CARGA
   ========================================================= */

function CreativeMediaLoadingIndicator({
  label,
}: {
  label:
    string;
}) {
  return (
    <div
      className={[
        "absolute inset-0 z-10",
        "flex flex-col items-center justify-center gap-3",
        "bg-zinc-100/90",
        "text-zinc-500",
        "backdrop-blur-sm",

        "dark:bg-zinc-950/80",
        "dark:text-zinc-400",
      ].join(
        " ",
      )}
    >
      <span
        aria-hidden="true"
        className={[
          "h-7 w-7",
          "animate-spin",
          "rounded-full",
          "border-2",
          "border-zinc-300",
          "border-t-emerald-500",

          "dark:border-zinc-700",
          "dark:border-t-emerald-400",
        ].join(
          " ",
        )}
      />

      <span className="text-xs font-medium">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   CONTENIDO ALTERNATIVO
   ========================================================= */

function CreativeMediaDefaultFallback({
  label,
}: {
  label:
    string;
}) {
  return (
    <div
      className={[
        "flex h-full min-h-40 w-full",
        "flex-col items-center justify-center gap-3",
        "px-6 py-10",
        "text-center",
      ].join(
        " ",
      )}
    >
      <span
        aria-hidden="true"
        className={[
          "flex h-12 w-12",
          "items-center justify-center",
          "rounded-2xl",
          "border",
          "border-zinc-200",
          "bg-white",
          "text-zinc-400",
          "shadow-sm",

          "dark:border-white/10",
          "dark:bg-white/[0.05]",
          "dark:text-zinc-500",
        ].join(
          " ",
        )}
      >
        <CreativeMediaImageIcon />
      </span>

      <span className="max-w-52 text-sm font-medium">
        {label}
      </span>
    </div>
  );
}

/* =========================================================
   MARCA DE AGUA
   ========================================================= */

function CreativeMediaWatermark({
  text,
  opacity,
  className,
}: {
  text:
    string;

  opacity:
    number;

  className?:
    string;
}) {
  return (
    <div
      aria-hidden="true"
      className={
        joinCreativeMediaClasses(
          "pointer-events-none absolute inset-0 z-20 overflow-hidden",
          className,
        )
      }
      style={{
        opacity,
      }}
    >
      <div
        className={[
          "absolute left-1/2 top-1/2",
          "flex min-w-[160%]",
          "-translate-x-1/2 -translate-y-1/2",
          "-rotate-[28deg]",
          "flex-wrap justify-center gap-x-10 gap-y-8",
        ].join(
          " ",
        )}
      >
        {Array.from(
          {
            length:
              15,
          },
          (
            _,
            index,
          ) => (
            <span
              key={index}
              className={[
                "whitespace-nowrap",
                "text-sm font-black uppercase",
                "tracking-[0.28em]",
                "text-white",
                "drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]",
                "sm:text-base",
              ].join(
                " ",
              )}
            >
              {text}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeMedia({
  src,

  alt,

  aspectRatio =
    "landscape",

  customAspectRatio =
    null,

  objectFit =
    "cover",

  objectPosition =
    "center",

  rounded =
    "xl",

  variant =
    "plain",

  priority =
    false,

  quality =
    85,

  sizes =
    "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px",

  unoptimized =
    false,

  blurDataURL =
    null,

  watermark =
    false,

  watermarkText =
    "FIXORA",

  watermarkOpacity =
    0.18,

  dimmed =
    false,

  interactive =
    false,

  overlay =
    null,

  loadingContent =
    null,

  fallback =
    null,

  hideLoadingIndicator =
    false,

  hideFallbackMessage =
    false,

  loadingLabel =
    "Cargando imagen...",

  errorLabel =
    "No fue posible mostrar esta imagen.",

  emptyLabel =
    "Imagen no disponible.",

  onImageLoad,

  onImageError,

  imageClassName,

  overlayClassName,

  fallbackClassName,

  watermarkClassName,

  className,

  style,

  ...containerProps
}: CreativeMediaProps) {
  const normalizedSource =
    normalizeCreativeMediaSource(
      src,
    );

  const normalizedAlt =
    normalizeCreativeMediaText(
      alt,
    );

  const normalizedLoadingLabel =
    normalizeCreativeMediaText(
      loadingLabel,
    ) ||
    "Cargando imagen...";

  const normalizedErrorLabel =
    normalizeCreativeMediaText(
      errorLabel,
    ) ||
    "No fue posible mostrar esta imagen.";

  const normalizedEmptyLabel =
    normalizeCreativeMediaText(
      emptyLabel,
    ) ||
    "Imagen no disponible.";

  const normalizedWatermarkText =
    normalizeCreativeMediaText(
      watermarkText,
    ) ||
    "FIXORA";

  const normalizedQuality =
    normalizeCreativeMediaQuality(
      quality,
    );

  const normalizedWatermarkOpacity =
    normalizeCreativeWatermarkOpacity(
      watermarkOpacity,
    );

  const resolvedAspectRatio =
    resolveCreativeMediaAspectRatio(
      aspectRatio,
      customAspectRatio,
    );

  const [
    loadState,
    setLoadState,
  ] =
    useState<CreativeMediaLoadState>(
      () =>
        normalizedSource
          ? "LOADING"
          : "IDLE",
    );

  /*
   * Restablece el estado cuando cambia la imagen.
   * La actualización se programa fuera de la ejecución
   * síncrona del efecto.
   */
  useEffect(
    () => {
      const timeoutId =
        window.setTimeout(
          () => {
            setLoadState(
              normalizedSource
                ? "LOADING"
                : "IDLE",
            );
          },
          0,
        );

      return () => {
        window.clearTimeout(
          timeoutId,
        );
      };
    },
    [
      normalizedSource,
    ],
  );

  const handleImageLoad =
    useCallback(
      (
        event:
          CreativeMediaImageEvent,
      ): void => {
        setLoadState(
          "LOADED",
        );

        onImageLoad?.(
          event,
        );
      },
      [
        onImageLoad,
      ],
    );

  const handleImageError =
    useCallback(
      (
        event:
          CreativeMediaImageEvent,
      ): void => {
        setLoadState(
          "ERROR",
        );

        onImageError?.(
          event,
        );
      },
      [
        onImageError,
      ],
    );

  const hasSource =
    normalizedSource.length >
    0;

  const loading =
    hasSource &&
    loadState ===
      "LOADING";

  const loaded =
    hasSource &&
    loadState ===
      "LOADED";

  const failed =
    loadState ===
    "ERROR";

  const showFallback =
    !hasSource ||
    failed;

  const fallbackLabel =
    failed
      ? normalizedErrorLabel
      : normalizedEmptyLabel;

  const placeholder =
    blurDataURL
      ? "blur"
      : "empty";

  return (
    <div
      {...containerProps}
      aria-busy={
        loading ||
        undefined
      }
      data-creative-media=""
      data-load-state={
        loadState
      }
      data-variant={
        variant
      }
      data-object-fit={
        objectFit
      }
      className={
        joinCreativeMediaClasses(
          CREATIVE_MEDIA_BASE_CLASSES,

          CREATIVE_MEDIA_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_MEDIA_ROUNDED_CLASSES[
            rounded
          ],

          interactive &&
            "cursor-pointer",

          className,
        )
      }
      style={{
        aspectRatio:
          resolvedAspectRatio,

        ...style,
      }}
    >
      {showFallback ? (
        <div
          className={
            joinCreativeMediaClasses(
              "absolute inset-0 z-10",
              fallbackClassName,
            )
          }
        >
          {fallback ??
          (
            hideFallbackMessage
              ? null
              : (
                  <CreativeMediaDefaultFallback
                    label={
                      fallbackLabel
                    }
                  />
                )
          )}
        </div>
      ) : null}

      {hasSource &&
      !failed ? (
        <Image
          key={
            normalizedSource
          }
          fill
          src={
            normalizedSource
          }
          alt={
            normalizedAlt
          }
          sizes={
            sizes
          }
          quality={
            normalizedQuality
          }
          priority={
            priority
          }
          unoptimized={
            unoptimized
          }
          placeholder={
            placeholder
          }
          blurDataURL={
            blurDataURL ??
            undefined
          }
          draggable={
            false
          }
          onLoad={
            handleImageLoad
          }
          onError={
            handleImageError
          }
          className={
            joinCreativeMediaClasses(
              CREATIVE_MEDIA_IMAGE_BASE_CLASSES,

              loading &&
                "scale-[1.02] opacity-0",

              loaded &&
                "scale-100 opacity-100",

              dimmed &&
                "brightness-[0.72]",

              interactive &&
                [
                  "group-hover/creative-media:scale-[1.025]",
                  "group-focus-within/creative-media:scale-[1.025]",
                ].join(
                  " ",
                ),

              imageClassName,
            )
          }
          style={{
            objectFit,

            objectPosition,
          }}
        />
      ) : null}

      {loading &&
      !hideLoadingIndicator ? (
        loadingContent ??
        (
          <CreativeMediaLoadingIndicator
            label={
              normalizedLoadingLabel
            }
          />
        )
      ) : null}

      {watermark &&
      hasSource &&
      !failed ? (
        <CreativeMediaWatermark
          text={
            normalizedWatermarkText
          }
          opacity={
            normalizedWatermarkOpacity
          }
          className={
            watermarkClassName
          }
        />
      ) : null}

      {dimmed ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[15] bg-black/10"
        />
      ) : null}

      {overlay ? (
        <div
          className={
            joinCreativeMediaClasses(
              "absolute inset-0 z-30",
              overlayClassName,
            )
          }
        >
          {overlay}
        </div>
      ) : null}
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeMedia;