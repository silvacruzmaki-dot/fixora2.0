"use client";

/*
 * Acciones reutilizables para las tarjetas del catálogo
 * Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar Me gusta, favoritos y compartir.
 * - Mostrar la acción principal según FREE, PAID o PORTFOLIO.
 * - Mostrar estados activos y de carga.
 * - Mostrar contadores de interacción.
 * - Mantener accesibilidad.
 *
 * Las acciones son controladas por el componente padre
 * mediante propiedades y callbacks.
 */

import type {
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from "react";

import {
  CreativeIconButton,
} from "@/components/atoms/creative/CreativeIconButton";

import type {
  CreativeIconButtonSize,
} from "@/components/atoms/creative/CreativeIconButton";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

import type {
  CreativeContentType,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeCardActionsLanguage =
  | "es"
  | "en";

/* =========================================================
   ACCIONES EN PROCESO
   ========================================================= */

export type CreativeCardLoadingAction =
  | "LIKE"
  | "FAVORITE"
  | "SHARE"
  | "DOWNLOAD"
  | "PURCHASE"
  | "REQUEST"
  | null;

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeCardActionsSize =
  | "sm"
  | "md";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeCardActionsProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  contentType:
    CreativeContentType;

  language?:
    CreativeCardActionsLanguage;

  size?:
    CreativeCardActionsSize;

  liked?:
    boolean;

  favorited?:
    boolean;

  likeCount?:
    number | null;

  favoriteCount?:
    number | null;

  shareCount?:
    number | null;

  loadingAction?:
    CreativeCardLoadingAction;

  disabled?:
    boolean;

  showLike?:
    boolean;

  showFavorite?:
    boolean;

  showShare?:
    boolean;

  showPrimaryAction?:
    boolean;

  canLike?:
    boolean;

  canFavorite?:
    boolean;

  canShare?:
    boolean;

  canDownload?:
    boolean;

  canPurchase?:
    boolean;

  canRequest?:
    boolean;

  onLike?:
    () => void | Promise<void>;

  onFavorite?:
    () => void | Promise<void>;

  onShare?:
    () => void | Promise<void>;

  onDownload?:
    () => void | Promise<void>;

  onPurchase?:
    () => void | Promise<void>;

  onRequest?:
    () => void | Promise<void>;

  downloadLabel?:
    string | null;

  purchaseLabel?:
    string | null;

  requestLabel?:
    string | null;

  trailingContent?:
    ReactNode;

  secondaryActionsClassName?:
    string;

  primaryActionClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_CARD_ACTIONS_COPY = {
  es: {
    like:
      "Me gusta",

    unlike:
      "Quitar Me gusta",

    favorite:
      "Guardar en favoritos",

    unfavorite:
      "Quitar de favoritos",

    share:
      "Compartir diseño",

    download:
      "Descargar gratis",

    downloading:
      "Preparando descarga...",

    purchase:
      "Comprar con Yape",

    purchasing:
      "Procesando compra...",

    request:
      "Solicitar diseño similar",

    requesting:
      "Preparando solicitud...",

    unavailable:
      "Acción no disponible",
  },

  en: {
    like:
      "Like",

    unlike:
      "Remove like",

    favorite:
      "Save to favorites",

    unfavorite:
      "Remove from favorites",

    share:
      "Share design",

    download:
      "Download free",

    downloading:
      "Preparing download...",

    purchase:
      "Buy with Yape",

    purchasing:
      "Processing purchase...",

    request:
      "Request a similar design",

    requesting:
      "Preparing request...",

    unavailable:
      "Action unavailable",
  },
} as const;

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_CARD_ACTIONS_ICON_SIZE = {
  sm:
    "sm",

  md:
    "md",
} as const satisfies Record<
  CreativeCardActionsSize,
  CreativeIconButtonSize
>;

const CREATIVE_CARD_ACTIONS_PRIMARY_SIZE_CLASSES = {
  sm: [
    "min-h-9",
    "gap-2",
    "rounded-xl",
    "px-3",
    "py-2",
    "text-xs",
  ].join(
    " ",
  ),

  md: [
    "min-h-10",
    "gap-2.5",
    "rounded-xl",
    "px-4",
    "py-2.5",
    "text-sm",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeCardActionsSize,
  string
>;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_CARD_ACTIONS_PRIMARY_BASE_CLASSES = [
  "inline-flex",
  "min-w-0",
  "flex-1",
  "items-center",
  "justify-center",
  "border",
  "font-bold",
  "leading-none",
  "outline-none",
  "transition-all",
  "duration-200",
  "ease-out",

  "focus-visible:ring-2",
  "focus-visible:ring-emerald-500/70",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white",

  "enabled:hover:-translate-y-0.5",
  "enabled:active:translate-y-0",
  "enabled:active:scale-[0.98]",

  "disabled:pointer-events-none",
  "disabled:cursor-not-allowed",
  "disabled:opacity-50",

  "dark:focus-visible:ring-emerald-400/70",
  "dark:focus-visible:ring-offset-zinc-950",

  "motion-reduce:transform-none",
  "motion-reduce:transition-none",
].join(
  " ",
);

/* =========================================================
   VARIANTES DE ACCIÓN PRINCIPAL
   ========================================================= */

const CREATIVE_CARD_ACTIONS_PRIMARY_VARIANT_CLASSES = {
  FREE: [
    "border-emerald-500/30",
    "bg-gradient-to-r",
    "from-emerald-500",
    "to-green-600",
    "text-white",
    "shadow-[0_8px_24px_rgba(16,185,129,0.22)]",

    "enabled:hover:from-emerald-400",
    "enabled:hover:to-emerald-600",
    "enabled:hover:shadow-[0_12px_30px_rgba(16,185,129,0.30)]",

    "dark:border-emerald-300/20",
  ].join(
    " ",
  ),

  PAID: [
    "border-amber-500/30",
    "bg-gradient-to-r",
    "from-amber-400",
    "to-orange-500",
    "text-zinc-950",
    "shadow-[0_8px_24px_rgba(245,158,11,0.22)]",

    "enabled:hover:from-amber-300",
    "enabled:hover:to-orange-400",
    "enabled:hover:shadow-[0_12px_30px_rgba(245,158,11,0.30)]",

    "dark:border-amber-300/20",
  ].join(
    " ",
  ),

  PORTFOLIO: [
    "border-cyan-500/25",
    "bg-cyan-500/10",
    "text-cyan-700",
    "shadow-[0_8px_24px_rgba(6,182,212,0.10)]",

    "enabled:hover:border-cyan-500/40",
    "enabled:hover:bg-cyan-500/15",
    "enabled:hover:shadow-[0_12px_30px_rgba(6,182,212,0.16)]",

    "dark:border-cyan-400/25",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeContentType,
  string
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeCardActionsClasses(
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

function normalizeCreativeCardActionText(
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
   NORMALIZAR CONTADOR
   ========================================================= */

function normalizeCreativeCardActionCount(
  value:
    number | null | undefined,
): number {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.trunc(
      value,
    ),
  );
}

/* =========================================================
   FORMATEAR CONTADOR
   ========================================================= */

export function formatCreativeCardActionCount(
  value:
    number | null | undefined,
): string {
  const normalizedValue =
    normalizeCreativeCardActionCount(
      value,
    );

  if (
    normalizedValue <
    1_000
  ) {
    return String(
      normalizedValue,
    );
  }

  if (
    normalizedValue <
    1_000_000
  ) {
    const compactValue =
      Math.round(
        (
          normalizedValue /
          1_000
        ) *
        10,
      ) /
      10;

    return `${compactValue}K`;
  }

  const compactValue =
    Math.round(
      (
        normalizedValue /
        1_000_000
      ) *
      10,
    ) /
    10;

  return `${compactValue}M`;
}

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeLikeIcon({
  filled,
}: {
  filled:
    boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={
        filled
          ? "currentColor"
          : "none"
      }
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    </svg>
  );
}

function CreativeFavoriteIcon({
  filled,
}: {
  filled:
    boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill={
        filled
          ? "currentColor"
          : "none"
      }
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function CreativeShareIcon() {
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
      <circle
        cx="18"
        cy="5"
        r="3"
      />

      <circle
        cx="6"
        cy="12"
        r="3"
      />

      <circle
        cx="18"
        cy="19"
        r="3"
      />

      <path d="m8.6 10.5 6.8-4" />

      <path d="m8.6 13.5 6.8 4" />
    </svg>
  );
}

function CreativeDownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M12 3v12" />

      <path d="m7 10 5 5 5-5" />

      <path d="M5 21h14" />
    </svg>
  );
}

function CreativePurchaseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="M3 10h18" />

      <path d="M7 15h2" />
    </svg>
  );
}

function CreativeRequestIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M12 20h9" />

      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />

      <path d="m15 5 3 3" />
    </svg>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeCardActions({
  contentType,

  language =
    "es",

  size =
    "md",

  liked =
    false,

  favorited =
    false,

  likeCount =
    0,

  favoriteCount =
    0,

  shareCount =
    0,

  loadingAction =
    null,

  disabled =
    false,

  showLike =
    true,

  showFavorite =
    true,

  showShare =
    true,

  showPrimaryAction =
    true,

  canLike =
    true,

  canFavorite =
    true,

  canShare =
    true,

  canDownload =
    true,

  canPurchase =
    true,

  canRequest =
    true,

  onLike,

  onFavorite,

  onShare,

  onDownload,

  onPurchase,

  onRequest,

  downloadLabel =
    null,

  purchaseLabel =
    null,

  requestLabel =
    null,

  trailingContent =
    null,

  secondaryActionsClassName,

  primaryActionClassName,

  className,

  onClick,

  ...containerProps
}: CreativeCardActionsProps) {
  const copy =
    CREATIVE_CARD_ACTIONS_COPY[
      language
    ];

  const normalizedLikeCount =
    normalizeCreativeCardActionCount(
      likeCount,
    );

  const normalizedFavoriteCount =
    normalizeCreativeCardActionCount(
      favoriteCount,
    );

  const normalizedShareCount =
    normalizeCreativeCardActionCount(
      shareCount,
    );

  const formattedLikeCount =
    formatCreativeCardActionCount(
      normalizedLikeCount,
    );

  const formattedFavoriteCount =
    formatCreativeCardActionCount(
      normalizedFavoriteCount,
    );

  const formattedShareCount =
    formatCreativeCardActionCount(
      normalizedShareCount,
    );

  const likeLoading =
    loadingAction ===
    "LIKE";

  const favoriteLoading =
    loadingAction ===
    "FAVORITE";

  const shareLoading =
    loadingAction ===
    "SHARE";

  const downloadLoading =
    loadingAction ===
    "DOWNLOAD";

  const purchaseLoading =
    loadingAction ===
    "PURCHASE";

  const requestLoading =
    loadingAction ===
    "REQUEST";

  const anyActionLoading =
    loadingAction !==
    null;

  const resolvedDownloadLabel =
    normalizeCreativeCardActionText(
      downloadLabel,
    ) ||
    copy.download;

  const resolvedPurchaseLabel =
    normalizeCreativeCardActionText(
      purchaseLabel,
    ) ||
    copy.purchase;

  const resolvedRequestLabel =
    normalizeCreativeCardActionText(
      requestLabel,
    ) ||
    copy.request;

  /*
   * Las anotaciones explícitas evitan que TypeScript
   * limite estas variables a un solo texto literal.
   */
  let primaryLabel:
    string =
      resolvedDownloadLabel;

  let primaryLoadingLabel:
    string =
      copy.downloading;

  let primaryDisabled:
    boolean =
      !canDownload;

  let primaryLoading:
    boolean =
      downloadLoading;

  let primaryIcon:
    ReactNode =
      <CreativeDownloadIcon />;

  let primaryAction:
    (() => void | Promise<void>) |
    undefined =
      onDownload;

  if (
    contentType ===
    "PAID"
  ) {
    primaryLabel =
      resolvedPurchaseLabel;

    primaryLoadingLabel =
      copy.purchasing;

    primaryDisabled =
      !canPurchase;

    primaryLoading =
      purchaseLoading;

    primaryIcon =
      <CreativePurchaseIcon />;

    primaryAction =
      onPurchase;
  }

  if (
    contentType ===
    "PORTFOLIO"
  ) {
    primaryLabel =
      resolvedRequestLabel;

    primaryLoadingLabel =
      copy.requesting;

    primaryDisabled =
      !canRequest;

    primaryLoading =
      requestLoading;

    primaryIcon =
      <CreativeRequestIcon />;

    primaryAction =
      onRequest;
  }

  const handleContainerClick =
    (
      event:
        MouseEvent<HTMLDivElement>,
    ): void => {
      event.stopPropagation();

      onClick?.(
        event,
      );
    };

  return (
    <div
      {...containerProps}
      onClick={
        handleContainerClick
      }
      data-creative-card-actions=""
      data-content-type={
        contentType
      }
      data-loading-action={
        loadingAction ??
        undefined
      }
      className={
        joinCreativeCardActionsClasses(
          "flex min-w-0 flex-wrap items-center gap-3",

          className,
        )
      }
    >
      <div
        className={
          joinCreativeCardActionsClasses(
            "flex shrink-0 items-center gap-2",

            secondaryActionsClassName,
          )
        }
      >
        {showLike ? (
          <CreativeIconButton
            icon={
              <CreativeLikeIcon
                filled={
                  liked
                }
              />
            }
            label={
              liked
                ? copy.unlike
                : copy.like
            }
            loadingLabel={
              copy.like
            }
            size={
              CREATIVE_CARD_ACTIONS_ICON_SIZE[
                size
              ]
            }
            variant={
              liked
                ? "danger"
                : "surface"
            }
            active={
              liked
            }
            pressed={
              liked
            }
            loading={
              likeLoading
            }
            disabled={
              disabled ||
              !canLike ||
              (
                anyActionLoading &&
                !likeLoading
              )
            }
            badge={
              normalizedLikeCount >
                0
                ? formattedLikeCount
                : undefined
            }
            badgeLabel={
              normalizedLikeCount >
                0
                ? `${normalizedLikeCount} ${copy.like}`
                : undefined
            }
            tooltipPlacement="top"
            onClick={
              onLike
            }
          />
        ) : null}

        {showFavorite ? (
          <CreativeIconButton
            icon={
              <CreativeFavoriteIcon
                filled={
                  favorited
                }
              />
            }
            label={
              favorited
                ? copy.unfavorite
                : copy.favorite
            }
            loadingLabel={
              copy.favorite
            }
            size={
              CREATIVE_CARD_ACTIONS_ICON_SIZE[
                size
              ]
            }
            variant={
              favorited
                ? "warning"
                : "surface"
            }
            active={
              favorited
            }
            pressed={
              favorited
            }
            loading={
              favoriteLoading
            }
            disabled={
              disabled ||
              !canFavorite ||
              (
                anyActionLoading &&
                !favoriteLoading
              )
            }
            badge={
              normalizedFavoriteCount >
                0
                ? formattedFavoriteCount
                : undefined
            }
            badgeLabel={
              normalizedFavoriteCount >
                0
                ? `${normalizedFavoriteCount} ${copy.favorite}`
                : undefined
            }
            tooltipPlacement="top"
            onClick={
              onFavorite
            }
          />
        ) : null}

        {showShare ? (
          <CreativeIconButton
            icon={
              <CreativeShareIcon />
            }
            label={
              copy.share
            }
            loadingLabel={
              copy.share
            }
            size={
              CREATIVE_CARD_ACTIONS_ICON_SIZE[
                size
              ]
            }
            variant="surface"
            loading={
              shareLoading
            }
            disabled={
              disabled ||
              !canShare ||
              (
                anyActionLoading &&
                !shareLoading
              )
            }
            badge={
              normalizedShareCount >
                0
                ? formattedShareCount
                : undefined
            }
            badgeLabel={
              normalizedShareCount >
                0
                ? `${normalizedShareCount} ${copy.share}`
                : undefined
            }
            tooltipPlacement="top"
            onClick={
              onShare
            }
          />
        ) : null}
      </div>

      {showPrimaryAction ? (
        <button
          type="button"
          aria-busy={
            primaryLoading ||
            undefined
          }
          aria-label={
            primaryLoading
              ? primaryLoadingLabel
              : primaryLabel
          }
          title={
            primaryDisabled
              ? copy.unavailable
              : primaryLabel
          }
          disabled={
            disabled ||
            primaryDisabled ||
            (
              anyActionLoading &&
              !primaryLoading
            )
          }
          onClick={
            primaryAction
          }
          className={
            joinCreativeCardActionsClasses(
              CREATIVE_CARD_ACTIONS_PRIMARY_BASE_CLASSES,

              CREATIVE_CARD_ACTIONS_PRIMARY_SIZE_CLASSES[
                size
              ],

              CREATIVE_CARD_ACTIONS_PRIMARY_VARIANT_CLASSES[
                contentType
              ],

              primaryActionClassName,
            )
          }
        >
          {primaryLoading ? (
            <CreativeSpinner
              decorative
              size="sm"
              variant={
                contentType ===
                  "PORTFOLIO"
                  ? "primary"
                  : "light"
              }
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex shrink-0 items-center justify-center"
            >
              {primaryIcon}
            </span>
          )}

          <span className="min-w-0 truncate">
            {primaryLoading
              ? primaryLoadingLabel
              : primaryLabel}
          </span>
        </button>
      ) : null}

      {trailingContent}
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeCardActions;