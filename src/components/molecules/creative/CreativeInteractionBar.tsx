"use client";

/*
 * Barra de interacciones del visor Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar visualizaciones.
 * - Dar o quitar Me gusta.
 * - Guardar o quitar de favoritos.
 * - Abrir comentarios.
 * - Compartir una publicación.
 * - Reportar contenido.
 * - Mostrar contadores y estados de carga.
 *
 * Todas las interacciones son controladas por el componente padre.
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
  CreativeIconButtonVariant,
} from "@/components/atoms/creative/CreativeIconButton";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeInteractionBarLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeInteractionBarSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeInteractionBarVariant =
  | "surface"
  | "dark"
  | "minimal";

/* =========================================================
   ORIENTACIÓN
   ========================================================= */

export type CreativeInteractionBarOrientation =
  | "horizontal"
  | "vertical";

/* =========================================================
   ACCIONES EN PROCESO
   ========================================================= */

export type CreativeInteractionLoadingAction =
  | "LIKE"
  | "FAVORITE"
  | "COMMENTS"
  | "SHARE"
  | "REPORT"
  | null;

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeInteractionBarProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  language?:
    CreativeInteractionBarLanguage;

  size?:
    CreativeInteractionBarSize;

  variant?:
    CreativeInteractionBarVariant;

  orientation?:
    CreativeInteractionBarOrientation;

  liked?:
    boolean;

  favorited?:
    boolean;

  viewCount?:
    number | null;

  likeCount?:
    number | null;

  favoriteCount?:
    number | null;

  commentCount?:
    number | null;

  shareCount?:
    number | null;

  loadingAction?:
    CreativeInteractionLoadingAction;

  disabled?:
    boolean;

  showViews?:
    boolean;

  showLike?:
    boolean;

  showFavorite?:
    boolean;

  showComments?:
    boolean;

  showShare?:
    boolean;

  showReport?:
    boolean;

  showCounts?:
    boolean;

  canLike?:
    boolean;

  canFavorite?:
    boolean;

  canComment?:
    boolean;

  canShare?:
    boolean;

  canReport?:
    boolean;

  onLike?:
    () => void | Promise<void>;

  onFavorite?:
    () => void | Promise<void>;

  onComments?:
    () => void | Promise<void>;

  onShare?:
    () => void | Promise<void>;

  onReport?:
    () => void | Promise<void>;

  leadingContent?:
    ReactNode;

  trailingContent?:
    ReactNode;

  viewsClassName?:
    string;

  actionsClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_INTERACTION_BAR_COPY = {
  es: {
    group:
      "Interacciones del diseño",

    views:
      "visualizaciones",

    like:
      "Me gusta",

    unlike:
      "Quitar Me gusta",

    favorite:
      "Guardar en favoritos",

    unfavorite:
      "Quitar de favoritos",

    comments:
      "Ver comentarios",

    share:
      "Compartir diseño",

    report:
      "Reportar contenido",

    processingLike:
      "Procesando Me gusta",

    processingFavorite:
      "Procesando favorito",

    processingComments:
      "Abriendo comentarios",

    processingShare:
      "Compartiendo diseño",

    processingReport:
      "Preparando reporte",
  },

  en: {
    group:
      "Design interactions",

    views:
      "views",

    like:
      "Like",

    unlike:
      "Remove like",

    favorite:
      "Save to favorites",

    unfavorite:
      "Remove from favorites",

    comments:
      "View comments",

    share:
      "Share design",

    report:
      "Report content",

    processingLike:
      "Processing like",

    processingFavorite:
      "Processing favorite",

    processingComments:
      "Opening comments",

    processingShare:
      "Sharing design",

    processingReport:
      "Preparing report",
  },
} as const;

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_INTERACTION_ICON_SIZES = {
  sm:
    "sm",

  md:
    "md",

  lg:
    "lg",
} as const satisfies Record<
  CreativeInteractionBarSize,
  CreativeIconButtonSize
>;

const CREATIVE_INTERACTION_BAR_SIZE_CLASSES = {
  sm:
    "gap-1.5 p-1.5",

  md:
    "gap-2 p-2",

  lg:
    "gap-2.5 p-2.5",
} as const satisfies Record<
  CreativeInteractionBarSize,
  string
>;

const CREATIVE_INTERACTION_VIEW_SIZE_CLASSES = {
  sm:
    "min-h-8 gap-1.5 px-2.5 text-[11px]",

  md:
    "min-h-10 gap-2 px-3 text-xs",

  lg:
    "min-h-12 gap-2.5 px-4 text-sm",
} as const satisfies Record<
  CreativeInteractionBarSize,
  string
>;

/* =========================================================
   VARIANTES
   ========================================================= */

const CREATIVE_INTERACTION_BAR_VARIANT_CLASSES = {
  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "text-zinc-700",
    "shadow-[0_12px_36px_rgba(15,23,42,0.09)]",
    "backdrop-blur-xl",

    "dark:border-white/10",
    "dark:bg-zinc-950/85",
    "dark:text-zinc-200",
    "dark:shadow-[0_14px_40px_rgba(0,0,0,0.30)]",
  ].join(
    " ",
  ),

  dark: [
    "border-white/10",
    "bg-black/65",
    "text-white",
    "shadow-[0_14px_42px_rgba(0,0,0,0.35)]",
    "backdrop-blur-xl",
  ].join(
    " ",
  ),

  minimal: [
    "border-transparent",
    "bg-transparent",
    "text-zinc-700",

    "dark:text-zinc-200",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeInteractionBarVariant,
  string
>;

/* =========================================================
   ORIENTACIÓN
   ========================================================= */

const CREATIVE_INTERACTION_ORIENTATION_CLASSES = {
  horizontal:
    "flex-row flex-wrap",

  vertical:
    "flex-col",
} as const satisfies Record<
  CreativeInteractionBarOrientation,
  string
>;

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeInteractionBarClasses(
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

function normalizeCreativeInteractionCount(
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

export function formatCreativeInteractionCount(
  value:
    number | null | undefined,
  language:
    CreativeInteractionBarLanguage = "es",
): string {
  const normalizedValue =
    normalizeCreativeInteractionCount(
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

  const decimalSeparator =
    language ===
      "es"
      ? ","
      : ".";

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

    const formattedValue =
      String(
        compactValue,
      ).replace(
        ".",
        decimalSeparator,
      );

    return language ===
      "es"
      ? `${formattedValue} mil`
      : `${formattedValue}K`;
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

  return `${String(
    compactValue,
  ).replace(
    ".",
    decimalSeparator,
  )}M`;
}

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeInteractionViewIcon() {
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
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

function CreativeInteractionLikeIcon({
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

function CreativeInteractionFavoriteIcon({
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

function CreativeInteractionCommentIcon() {
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
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
    </svg>
  );
}

function CreativeInteractionShareIcon() {
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

function CreativeInteractionReportIcon() {
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
      <path d="M5 21V4" />

      <path d="M5 5h11l-1.5 4L16 13H5" />
    </svg>
  );
}

/* =========================================================
   COMPONENTE
   ========================================================= */

export function CreativeInteractionBar({
  language =
    "es",

  size =
    "md",

  variant =
    "surface",

  orientation =
    "horizontal",

  liked =
    false,

  favorited =
    false,

  viewCount =
    0,

  likeCount =
    0,

  favoriteCount =
    0,

  commentCount =
    0,

  shareCount =
    0,

  loadingAction =
    null,

  disabled =
    false,

  showViews =
    true,

  showLike =
    true,

  showFavorite =
    true,

  showComments =
    true,

  showShare =
    true,

  showReport =
    false,

  showCounts =
    true,

  canLike =
    true,

  canFavorite =
    true,

  canComment =
    true,

  canShare =
    true,

  canReport =
    true,

  onLike,

  onFavorite,

  onComments,

  onShare,

  onReport,

  leadingContent =
    null,

  trailingContent =
    null,

  viewsClassName,

  actionsClassName,

  className,

  onClick,

  "aria-label":
    ariaLabel,

  ...containerProps
}: CreativeInteractionBarProps) {
  const copy =
    CREATIVE_INTERACTION_BAR_COPY[
      language
    ];

  const normalizedViewCount =
    normalizeCreativeInteractionCount(
      viewCount,
    );

  const normalizedLikeCount =
    normalizeCreativeInteractionCount(
      likeCount,
    );

  const normalizedFavoriteCount =
    normalizeCreativeInteractionCount(
      favoriteCount,
    );

  const normalizedCommentCount =
    normalizeCreativeInteractionCount(
      commentCount,
    );

  const normalizedShareCount =
    normalizeCreativeInteractionCount(
      shareCount,
    );

  const iconSize =
    CREATIVE_INTERACTION_ICON_SIZES[
      size
    ];

  const defaultButtonVariant:
    CreativeIconButtonVariant =
      variant ===
        "dark"
        ? "ghost"
        : variant ===
            "minimal"
          ? "ghost"
          : "surface";

  const anyActionLoading =
    loadingAction !==
    null;

  const likeLoading =
    loadingAction ===
    "LIKE";

  const favoriteLoading =
    loadingAction ===
    "FAVORITE";

  const commentsLoading =
    loadingAction ===
    "COMMENTS";

  const shareLoading =
    loadingAction ===
    "SHARE";

  const reportLoading =
    loadingAction ===
    "REPORT";

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

  const runAction =
    (
      action:
        (() => void | Promise<void>) |
        undefined,
    ): void => {
      void action?.();
    };

  return (
    <div
      {...containerProps}
      role="group"
      aria-label={
        ariaLabel ??
        copy.group
      }
      aria-disabled={
        disabled ||
        undefined
      }
      aria-busy={
        anyActionLoading ||
        undefined
      }
      data-creative-interaction-bar=""
      data-size={
        size
      }
      data-variant={
        variant
      }
      data-orientation={
        orientation
      }
      data-loading-action={
        loadingAction ??
        undefined
      }
      onClick={
        handleContainerClick
      }
      className={
        joinCreativeInteractionBarClasses(
          "inline-flex min-w-0 items-center rounded-2xl border",

          CREATIVE_INTERACTION_BAR_SIZE_CLASSES[
            size
          ],

          CREATIVE_INTERACTION_BAR_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_INTERACTION_ORIENTATION_CLASSES[
            orientation
          ],

          disabled &&
            "opacity-60",

          className,
        )
      }
    >
      {leadingContent}

      {showViews ? (
        <span
          title={
            `${normalizedViewCount} ${copy.views}`
          }
          aria-label={
            `${normalizedViewCount} ${copy.views}`
          }
          className={
            joinCreativeInteractionBarClasses(
              "inline-flex shrink-0 items-center justify-center",
              "rounded-xl font-semibold tabular-nums",
              "text-zinc-600",

              "dark:text-zinc-300",

              CREATIVE_INTERACTION_VIEW_SIZE_CLASSES[
                size
              ],

              viewsClassName,
            )
          }
        >
          <CreativeInteractionViewIcon />

          <span>
            {formatCreativeInteractionCount(
              normalizedViewCount,
              language,
            )}
          </span>
        </span>
      ) : null}

      <div
        className={
          joinCreativeInteractionBarClasses(
            "flex min-w-0 items-center",

            orientation ===
              "vertical"
              ? "flex-col gap-1.5"
              : "flex-row flex-wrap gap-1.5",

            actionsClassName,
          )
        }
      >
        {showLike ? (
          <CreativeIconButton
            icon={
              <CreativeInteractionLikeIcon
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
              copy.processingLike
            }
            size={
              iconSize
            }
            variant={
              liked
                ? "danger"
                : defaultButtonVariant
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
              !onLike ||
              (
                anyActionLoading &&
                !likeLoading
              )
            }
            badge={
              showCounts &&
              normalizedLikeCount >
                0
                ? formatCreativeInteractionCount(
                    normalizedLikeCount,
                    language,
                  )
                : undefined
            }
            badgeLabel={
              showCounts &&
              normalizedLikeCount >
                0
                ? `${normalizedLikeCount} ${copy.like}`
                : undefined
            }
            onClick={
              () => {
                runAction(
                  onLike,
                );
              }
            }
          />
        ) : null}

        {showFavorite ? (
          <CreativeIconButton
            icon={
              <CreativeInteractionFavoriteIcon
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
              copy.processingFavorite
            }
            size={
              iconSize
            }
            variant={
              favorited
                ? "warning"
                : defaultButtonVariant
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
              !onFavorite ||
              (
                anyActionLoading &&
                !favoriteLoading
              )
            }
            badge={
              showCounts &&
              normalizedFavoriteCount >
                0
                ? formatCreativeInteractionCount(
                    normalizedFavoriteCount,
                    language,
                  )
                : undefined
            }
            badgeLabel={
              showCounts &&
              normalizedFavoriteCount >
                0
                ? `${normalizedFavoriteCount} ${copy.favorite}`
                : undefined
            }
            onClick={
              () => {
                runAction(
                  onFavorite,
                );
              }
            }
          />
        ) : null}

        {showComments ? (
          <CreativeIconButton
            icon={
              <CreativeInteractionCommentIcon />
            }
            label={
              copy.comments
            }
            loadingLabel={
              copy.processingComments
            }
            size={
              iconSize
            }
            variant={
              defaultButtonVariant
            }
            loading={
              commentsLoading
            }
            disabled={
              disabled ||
              !canComment ||
              !onComments ||
              (
                anyActionLoading &&
                !commentsLoading
              )
            }
            badge={
              showCounts &&
              normalizedCommentCount >
                0
                ? formatCreativeInteractionCount(
                    normalizedCommentCount,
                    language,
                  )
                : undefined
            }
            badgeLabel={
              showCounts &&
              normalizedCommentCount >
                0
                ? `${normalizedCommentCount} ${copy.comments}`
                : undefined
            }
            onClick={
              () => {
                runAction(
                  onComments,
                );
              }
            }
          />
        ) : null}

        {showShare ? (
          <CreativeIconButton
            icon={
              <CreativeInteractionShareIcon />
            }
            label={
              copy.share
            }
            loadingLabel={
              copy.processingShare
            }
            size={
              iconSize
            }
            variant={
              defaultButtonVariant
            }
            loading={
              shareLoading
            }
            disabled={
              disabled ||
              !canShare ||
              !onShare ||
              (
                anyActionLoading &&
                !shareLoading
              )
            }
            badge={
              showCounts &&
              normalizedShareCount >
                0
                ? formatCreativeInteractionCount(
                    normalizedShareCount,
                    language,
                  )
                : undefined
            }
            badgeLabel={
              showCounts &&
              normalizedShareCount >
                0
                ? `${normalizedShareCount} ${copy.share}`
                : undefined
            }
            onClick={
              () => {
                runAction(
                  onShare,
                );
              }
            }
          />
        ) : null}

        {showReport ? (
          <CreativeIconButton
            icon={
              <CreativeInteractionReportIcon />
            }
            label={
              copy.report
            }
            loadingLabel={
              copy.processingReport
            }
            size={
              iconSize
            }
            variant="danger"
            loading={
              reportLoading
            }
            disabled={
              disabled ||
              !canReport ||
              !onReport ||
              (
                anyActionLoading &&
                !reportLoading
              )
            }
            onClick={
              () => {
                runAction(
                  onReport,
                );
              }
            }
          />
        ) : null}
      </div>

      {trailingContent}
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeInteractionBar;