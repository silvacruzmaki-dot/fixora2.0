"use client";

/*
 * Comentario individual reutilizable del módulo
 * Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar autor, fecha, contenido y estado.
 * - Mostrar comentarios editados y fijados.
 * - Dar o quitar Me gusta.
 * - Responder, editar, eliminar y reportar.
 * - Mostrar u ocultar respuestas.
 * - Admitir contenido de respuesta y edición.
 * - Mantener todas las acciones controladas por el padre.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Estado global de autenticación.
 * - Acceso a Prisma.
 * - Confirmaciones modales.
 * - Lógica de permisos del servidor.
 */

import {
  useId,
} from "react";

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

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeCommentItemLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeCommentItemSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeCommentItemVariant =
  | "surface"
  | "soft"
  | "minimal";

/* =========================================================
   ESTADOS
   ========================================================= */

export type CreativeCommentItemStatus =
  | "PUBLISHED"
  | "PENDING"
  | "HIDDEN"
  | "DELETED"
  | "REPORTED";

/* =========================================================
   ACCIONES EN PROCESO
   ========================================================= */

export type CreativeCommentItemLoadingAction =
  | "LIKE"
  | "REPLY"
  | "EDIT"
  | "DELETE"
  | "REPORT"
  | "REPLIES"
  | null;

/* =========================================================
   LÍNEAS VISIBLES
   ========================================================= */

export type CreativeCommentVisibleLines =
  | 2
  | 3
  | 4
  | 5
  | 6;

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeCommentItemProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "children"
  > {
  /*
   * Identificación.
   */
  commentId:
    string;

  /*
   * Información del autor.
   */
  authorName:
    string;

  authorLabel?:
    string | null;

  authorInitials?:
    string | null;

  avatar?:
    ReactNode;

  authorIsAdmin?:
    boolean;

  authorIsOwner?:
    boolean;

  currentUserIsAuthor?:
    boolean;

  /*
   * Contenido.
   */
  content:
    string;

  createdAtLabel:
    string;

  edited?:
    boolean;

  pinned?:
    boolean;

  status?:
    CreativeCommentItemStatus;

  /*
   * Apariencia.
   */
  language?:
    CreativeCommentItemLanguage;

  size?:
    CreativeCommentItemSize;

  variant?:
    CreativeCommentItemVariant;

  depth?:
    number;

  /*
   * Expansión del contenido.
   */
  expandable?:
    boolean;

  expanded?:
    boolean;

  maximumVisibleLines?:
    CreativeCommentVisibleLines;

  onToggleExpanded?:
    () => void;

  /*
   * Me gusta.
   */
  liked?:
    boolean;

  likeCount?:
    number | null;

  canLike?:
    boolean;

  onLike?:
    () => void | Promise<void>;

  /*
   * Responder.
   */
  canReply?:
    boolean;

  replying?:
    boolean;

  onReply?:
    () => void | Promise<void>;

  replyEditor?:
    ReactNode;

  /*
   * Editar.
   */
  canEdit?:
    boolean;

  editing?:
    boolean;

  onEdit?:
    () => void | Promise<void>;

  editEditor?:
    ReactNode;

  /*
   * Eliminar.
   */
  canDelete?:
    boolean;

  onDelete?:
    () => void | Promise<void>;

  /*
   * Reportar.
   */
  canReport?:
    boolean;

  onReport?:
    () => void | Promise<void>;

  /*
   * Moderación.
   */
  canModerate?:
    boolean;

  moderationContent?:
    ReactNode;

  /*
   * Respuestas.
   */
  replyCount?:
    number | null;

  repliesExpanded?:
    boolean;

  onToggleReplies?:
    () => void | Promise<void>;

  repliesContent?:
    ReactNode;

  /*
   * Estado general.
   */
  disabled?:
    boolean;

  loadingAction?:
    CreativeCommentItemLoadingAction;

  /*
   * Visibilidad.
   */
  showLike?:
    boolean;

  showReply?:
    boolean;

  showEdit?:
    boolean;

  showDelete?:
    boolean;

  showReport?:
    boolean;

  showReplies?:
    boolean;

  /*
   * Contenido adicional.
   */
  headerContent?:
    ReactNode;

  actionsContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  /*
   * Clases adicionales.
   */
  headerClassName?:
    string;

  contentClassName?:
    string;

  actionsClassName?:
    string;

  repliesClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_COMMENT_ITEM_COPY = {
  es: {
    admin:
      "Administrador",

    owner:
      "Autor",

    edited:
      "Editado",

    pinned:
      "Comentario fijado",

    pending:
      "Pendiente de revisión",

    hidden:
      "Este comentario fue ocultado.",

    deleted:
      "Este comentario fue eliminado.",

    reported:
      "Comentario reportado",

    like:
      "Me gusta",

    unlike:
      "Quitar Me gusta",

    reply:
      "Responder",

    edit:
      "Editar comentario",

    delete:
      "Eliminar comentario",

    report:
      "Reportar comentario",

    showMore:
      "Ver más",

    showLess:
      "Ver menos",

    showReplies:
      "Ver respuestas",

    hideReplies:
      "Ocultar respuestas",

    replySingular:
      "respuesta",

    replyPlural:
      "respuestas",

    processingLike:
      "Procesando Me gusta",

    processingReply:
      "Preparando respuesta",

    processingEdit:
      "Preparando edición",

    processingDelete:
      "Eliminando comentario",

    processingReport:
      "Preparando reporte",

    processingReplies:
      "Cargando respuestas",
  },

  en: {
    admin:
      "Administrator",

    owner:
      "Author",

    edited:
      "Edited",

    pinned:
      "Pinned comment",

    pending:
      "Pending review",

    hidden:
      "This comment was hidden.",

    deleted:
      "This comment was deleted.",

    reported:
      "Reported comment",

    like:
      "Like",

    unlike:
      "Remove like",

    reply:
      "Reply",

    edit:
      "Edit comment",

    delete:
      "Delete comment",

    report:
      "Report comment",

    showMore:
      "Show more",

    showLess:
      "Show less",

    showReplies:
      "Show replies",

    hideReplies:
      "Hide replies",

    replySingular:
      "reply",

    replyPlural:
      "replies",

    processingLike:
      "Processing like",

    processingReply:
      "Preparing reply",

    processingEdit:
      "Preparing edit",

    processingDelete:
      "Deleting comment",

    processingReport:
      "Preparing report",

    processingReplies:
      "Loading replies",
  },
} as const;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_COMMENT_ITEM_BASE_CLASSES = [
  "relative",
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

const CREATIVE_COMMENT_ITEM_VARIANT_CLASSES = {
  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "shadow-[0_12px_38px_rgba(15,23,42,0.07)]",
    "backdrop-blur-xl",

    "dark:border-white/10",
    "dark:bg-zinc-950/80",
    "dark:shadow-[0_14px_42px_rgba(0,0,0,0.26)]",
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

  minimal: [
    "border-transparent",
    "border-b-zinc-200/80",
    "bg-transparent",

    "dark:border-b-white/10",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeCommentItemVariant,
  string
>;

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_COMMENT_ITEM_SIZE_CLASSES = {
  sm: {
    root:
      "rounded-xl p-3",

    avatar:
      "h-8 w-8 text-[10px]",

    author:
      "text-xs",

    metadata:
      "text-[10px]",

    content:
      "text-xs leading-5",

    action:
      "text-[11px]",
  },

  md: {
    root:
      "rounded-2xl p-4",

    avatar:
      "h-10 w-10 text-xs",

    author:
      "text-sm",

    metadata:
      "text-xs",

    content:
      "text-sm leading-6",

    action:
      "text-xs",
  },

  lg: {
    root:
      "rounded-2xl p-5",

    avatar:
      "h-12 w-12 text-sm",

    author:
      "text-base",

    metadata:
      "text-xs",

    content:
      "text-base leading-7",

    action:
      "text-sm",
  },
} as const satisfies Record<
  CreativeCommentItemSize,
  {
    root:
      string;

    avatar:
      string;

    author:
      string;

    metadata:
      string;

    content:
      string;

    action:
      string;
  }
>;

/* =========================================================
   TAMAÑO DE BOTONES
   ========================================================= */

const CREATIVE_COMMENT_ITEM_ICON_SIZE = {
  sm:
    "sm",

  md:
    "sm",

  lg:
    "md",
} as const satisfies Record<
  CreativeCommentItemSize,
  CreativeIconButtonSize
>;

/* =========================================================
   PROFUNDIDAD
   ========================================================= */

const CREATIVE_COMMENT_ITEM_DEPTH_CLASSES = {
  0:
    "",

  1:
    "ml-3 w-[calc(100%-0.75rem)] sm:ml-6 sm:w-[calc(100%-1.5rem)]",

  2:
    "ml-5 w-[calc(100%-1.25rem)] sm:ml-10 sm:w-[calc(100%-2.5rem)]",

  3:
    "ml-7 w-[calc(100%-1.75rem)] sm:ml-14 sm:w-[calc(100%-3.5rem)]",

  4:
    "ml-9 w-[calc(100%-2.25rem)] sm:ml-16 sm:w-[calc(100%-4rem)]",
} as const satisfies Record<
  0 | 1 | 2 | 3 | 4,
  string
>;

/* =========================================================
   LÍNEAS VISIBLES
   ========================================================= */

const CREATIVE_COMMENT_ITEM_LINE_CLASSES = {
  2:
    "line-clamp-2",

  3:
    "line-clamp-3",

  4:
    "line-clamp-4",

  5:
    "line-clamp-5",

  6:
    "line-clamp-6",
} as const satisfies Record<
  CreativeCommentVisibleLines,
  string
>;

/* =========================================================
   ESTADOS
   ========================================================= */

const CREATIVE_COMMENT_ITEM_STATUS_CLASSES = {
  PUBLISHED:
    "",

  PENDING: [
    "border-amber-500/25",
    "bg-amber-500/[0.04]",

    "dark:border-amber-400/25",
    "dark:bg-amber-400/[0.04]",
  ].join(
    " ",
  ),

  HIDDEN: [
    "border-zinc-300/80",
    "bg-zinc-100/70",

    "dark:border-white/10",
    "dark:bg-white/[0.03]",
  ].join(
    " ",
  ),

  DELETED: [
    "border-zinc-300/70",
    "bg-zinc-100/50",

    "dark:border-white/10",
    "dark:bg-white/[0.02]",
  ].join(
    " ",
  ),

  REPORTED: [
    "border-red-500/20",
    "bg-red-500/[0.03]",

    "dark:border-red-400/20",
    "dark:bg-red-400/[0.03]",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeCommentItemStatus,
  string
>;

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeCommentItemClasses(
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

function normalizeCreativeCommentItemText(
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

function normalizeCreativeCommentContent(
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
    )
    .trim();
}

function normalizeCreativeCommentCount(
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

function normalizeCreativeCommentDepth(
  value:
    number | null | undefined,
): 0 | 1 | 2 | 3 | 4 {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    )
  ) {
    return 0;
  }

  const normalizedValue =
    Math.min(
      4,
      Math.max(
        0,
        Math.trunc(
          value,
        ),
      ),
    );

  return normalizedValue as
    | 0
    | 1
    | 2
    | 3
    | 4;
}

function getCreativeCommentInitials(
  authorName:
    string,
): string {
  const parts =
    authorName
      .split(
        " ",
      )
      .filter(
        Boolean,
      )
      .slice(
        0,
        2,
      );

  const initials =
    parts
      .map(
        (
          part,
        ) =>
          part
            .charAt(
              0,
            )
            .toUpperCase(),
      )
      .join(
        "",
      );

  return initials ||
    "FX";
}

export function formatCreativeCommentCount(
  value:
    number | null | undefined,
): string {
  const normalizedValue =
    normalizeCreativeCommentCount(
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

function runCreativeCommentAction(
  action:
    (() => void | Promise<void>) |
    undefined,
): void {
  void action?.();
}

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeCommentLikeIcon({
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

function CreativeCommentEditIcon() {
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
      <path d="M12 20h9" />

      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />

      <path d="m15 5 3 3" />
    </svg>
  );
}

function CreativeCommentDeleteIcon() {
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
      <path d="M3 6h18" />

      <path d="M8 6V4h8v2" />

      <path d="m19 6-1 15H6L5 6" />

      <path d="M10 11v5" />

      <path d="M14 11v5" />
    </svg>
  );
}

function CreativeCommentReportIcon() {
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

function CreativeCommentPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="m12 17-5 5" />

      <path d="m5 3 16 16" />

      <path d="m9 7-3 3 8 8 3-3" />

      <path d="m14 4 6 6" />
    </svg>
  );
}

function CreativeCommentChevronIcon({
  expanded,
}: {
  expanded:
    boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        joinCreativeCommentItemClasses(
          "h-4 w-4 transition-transform duration-200",

          expanded &&
            "rotate-180",
        )
      }
    >
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeCommentItem({
  commentId,

  authorName,

  authorLabel =
    null,

  authorInitials =
    null,

  avatar =
    null,

  authorIsAdmin =
    false,

  authorIsOwner =
    false,

  currentUserIsAuthor =
    false,

  content,

  createdAtLabel,

  edited =
    false,

  pinned =
    false,

  status =
    "PUBLISHED",

  language =
    "es",

  size =
    "md",

  variant =
    "surface",

  depth =
    0,

  expandable =
    false,

  expanded =
    false,

  maximumVisibleLines =
    4,

  onToggleExpanded,

  liked =
    false,

  likeCount =
    0,

  canLike =
    true,

  onLike,

  canReply =
    true,

  replying =
    false,

  onReply,

  replyEditor =
    null,

  canEdit =
    false,

  editing =
    false,

  onEdit,

  editEditor =
    null,

  canDelete =
    false,

  onDelete,

  canReport =
    true,

  onReport,

  canModerate =
    false,

  moderationContent =
    null,

  replyCount =
    0,

  repliesExpanded =
    false,

  onToggleReplies,

  repliesContent =
    null,

  disabled =
    false,

  loadingAction =
    null,

  showLike =
    true,

  showReply =
    true,

  showEdit =
    true,

  showDelete =
    true,

  showReport =
    true,

  showReplies =
    true,

  headerContent =
    null,

  actionsContent =
    null,

  footerContent =
    null,

  headerClassName,

  contentClassName,

  actionsClassName,

  repliesClassName,

  className,

  onClick,

  ...articleProps
}: CreativeCommentItemProps) {
  const generatedId =
    useId();

  const copy =
    CREATIVE_COMMENT_ITEM_COPY[
      language
    ];

  const normalizedCommentId =
    normalizeCreativeCommentItemText(
      commentId,
    );

  const normalizedAuthorName =
    normalizeCreativeCommentItemText(
      authorName,
    ) ||
    "FIXORA";

  const normalizedAuthorLabel =
    normalizeCreativeCommentItemText(
      authorLabel,
    );

  const normalizedAuthorInitials =
    normalizeCreativeCommentItemText(
      authorInitials,
    ) ||
    getCreativeCommentInitials(
      normalizedAuthorName,
    );

  const normalizedCreatedAt =
    normalizeCreativeCommentItemText(
      createdAtLabel,
    );

  const normalizedContent =
    normalizeCreativeCommentContent(
      content,
    );

  const normalizedDepth =
    normalizeCreativeCommentDepth(
      depth,
    );

  const normalizedLikeCount =
    normalizeCreativeCommentCount(
      likeCount,
    );

  const normalizedReplyCount =
    normalizeCreativeCommentCount(
      replyCount,
    );

  const iconSize =
    CREATIVE_COMMENT_ITEM_ICON_SIZE[
      size
    ];

  const anyActionLoading =
    loadingAction !==
    null;

  const likeLoading =
    loadingAction ===
    "LIKE";

  const replyLoading =
    loadingAction ===
    "REPLY";

  const editLoading =
    loadingAction ===
    "EDIT";

  const deleteLoading =
    loadingAction ===
    "DELETE";

  const reportLoading =
    loadingAction ===
    "REPORT";

  const repliesLoading =
    loadingAction ===
    "REPLIES";

  const contentUnavailable =
    status ===
      "HIDDEN" ||
    status ===
      "DELETED";

  let displayedContent:
    string =
      normalizedContent;

  if (
    status ===
    "HIDDEN"
  ) {
    displayedContent =
      copy.hidden;
  }

  if (
    status ===
    "DELETED"
  ) {
    displayedContent =
      copy.deleted;
  }

  const statusLabel =
    status ===
      "PENDING"
      ? copy.pending
      : status ===
          "REPORTED"
        ? copy.reported
        : "";

  const repliesLabel =
    normalizedReplyCount ===
      1
      ? copy.replySingular
      : copy.replyPlural;

  const commentTitleId =
    `creative-comment-author-${generatedId}`;

  const commentContentId =
    `creative-comment-content-${generatedId}`;

  const handleArticleClick =
    (
      event:
        MouseEvent<HTMLElement>,
    ): void => {
      onClick?.(
        event,
      );
    };

  const handleActionsClick =
    (
      event:
        MouseEvent<HTMLDivElement>,
    ): void => {
      event.stopPropagation();
    };

  return (
    <article
      {...articleProps}
      aria-labelledby={
        commentTitleId
      }
      aria-describedby={
        commentContentId
      }
      aria-busy={
        anyActionLoading ||
        undefined
      }
      data-creative-comment-item=""
      data-comment-id={
        normalizedCommentId
      }
      data-status={
        status
      }
      data-depth={
        normalizedDepth
      }
      data-current-user-author={
        currentUserIsAuthor
          ? "true"
          : "false"
      }
      onClick={
        handleArticleClick
      }
      className={
        joinCreativeCommentItemClasses(
          CREATIVE_COMMENT_ITEM_BASE_CLASSES,

          CREATIVE_COMMENT_ITEM_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_COMMENT_ITEM_SIZE_CLASSES[
            size
          ].root,

          CREATIVE_COMMENT_ITEM_DEPTH_CLASSES[
            normalizedDepth
          ],

          CREATIVE_COMMENT_ITEM_STATUS_CLASSES[
            status
          ],

          pinned &&
            "ring-1 ring-emerald-500/20 dark:ring-emerald-400/20",

          disabled &&
            "opacity-65",

          className,
        )
      }
    >
      <div
        className={
          joinCreativeCommentItemClasses(
            "flex min-w-0 items-start gap-3",

            headerClassName,
          )
        }
      >
        <div className="shrink-0">
          {avatar ?? (
            <span
              aria-hidden="true"
              className={
                joinCreativeCommentItemClasses(
                  "flex items-center justify-center rounded-full",
                  "border border-emerald-500/20",
                  "bg-emerald-500/10",
                  "font-black uppercase",
                  "text-emerald-700",

                  "dark:border-emerald-400/20",
                  "dark:bg-emerald-400/10",
                  "dark:text-emerald-300",

                  CREATIVE_COMMENT_ITEM_SIZE_CLASSES[
                    size
                  ].avatar,
                )
              }
            >
              {normalizedAuthorInitials}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  id={
                    commentTitleId
                  }
                  className={
                    joinCreativeCommentItemClasses(
                      "truncate font-bold text-zinc-950",
                      "dark:text-white",

                      CREATIVE_COMMENT_ITEM_SIZE_CLASSES[
                        size
                      ].author,
                    )
                  }
                >
                  {normalizedAuthorName}
                </h3>

                {authorIsAdmin ? (
                  <span
                    className={[
                      "inline-flex rounded-full",
                      "border border-emerald-500/20",
                      "bg-emerald-500/10",
                      "px-2 py-1",
                      "text-[9px] font-bold uppercase",
                      "tracking-[0.08em]",
                      "text-emerald-700",

                      "dark:border-emerald-400/20",
                      "dark:bg-emerald-400/10",
                      "dark:text-emerald-300",
                    ].join(
                      " ",
                    )}
                  >
                    {copy.admin}
                  </span>
                ) : null}

                {authorIsOwner ? (
                  <span
                    className={[
                      "inline-flex rounded-full",
                      "border border-cyan-500/20",
                      "bg-cyan-500/10",
                      "px-2 py-1",
                      "text-[9px] font-bold uppercase",
                      "tracking-[0.08em]",
                      "text-cyan-700",

                      "dark:border-cyan-400/20",
                      "dark:bg-cyan-400/10",
                      "dark:text-cyan-300",
                    ].join(
                      " ",
                    )}
                  >
                    {copy.owner}
                  </span>
                ) : null}

                {normalizedAuthorLabel ? (
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {normalizedAuthorLabel}
                  </span>
                ) : null}
              </div>

              <div
                className={
                  joinCreativeCommentItemClasses(
                    "mt-1 flex flex-wrap items-center gap-x-2 gap-y-1",
                    "text-zinc-500",
                    "dark:text-zinc-400",

                    CREATIVE_COMMENT_ITEM_SIZE_CLASSES[
                      size
                    ].metadata,
                  )
                }
              >
                {normalizedCreatedAt ? (
                  <time>
                    {normalizedCreatedAt}
                  </time>
                ) : null}

                {edited ? (
                  <>
                    <span
                      aria-hidden="true"
                    >
                      •
                    </span>

                    <span>
                      {copy.edited}
                    </span>
                  </>
                ) : null}

                {pinned ? (
                  <>
                    <span
                      aria-hidden="true"
                    >
                      •
                    </span>

                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
                      <CreativeCommentPinIcon />

                      {copy.pinned}
                    </span>
                  </>
                ) : null}

                {statusLabel ? (
                  <>
                    <span
                      aria-hidden="true"
                    >
                      •
                    </span>

                    <span
                      className={
                        status ===
                          "REPORTED"
                          ? "font-semibold text-red-600 dark:text-red-300"
                          : "font-semibold text-amber-700 dark:text-amber-300"
                      }
                    >
                      {statusLabel}
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {headerContent}
          </div>

          {!editing ? (
            <div className="mt-3">
              <p
                id={
                  commentContentId
                }
                className={
                  joinCreativeCommentItemClasses(
                    "whitespace-pre-wrap break-words",
                    "text-zinc-700",
                    "dark:text-zinc-300",

                    CREATIVE_COMMENT_ITEM_SIZE_CLASSES[
                      size
                    ].content,

                    expandable &&
                      !expanded &&
                      !contentUnavailable &&
                      CREATIVE_COMMENT_ITEM_LINE_CLASSES[
                        maximumVisibleLines
                      ],

                    contentUnavailable &&
                      "italic text-zinc-500 dark:text-zinc-500",

                    contentClassName,
                  )
                }
              >
                {displayedContent}
              </p>

              {expandable &&
              !contentUnavailable &&
              onToggleExpanded ? (
                <button
                  type="button"
                  disabled={
                    disabled
                  }
                  aria-expanded={
                    expanded
                  }
                  onClick={
                    onToggleExpanded
                  }
                  className={[
                    "mt-2 text-xs font-bold",
                    "text-emerald-700",
                    "outline-none",
                    "transition-colors duration-150",

                    "hover:text-emerald-600",
                    "focus-visible:underline",

                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",

                    "dark:text-emerald-300",
                    "dark:hover:text-emerald-200",
                  ].join(
                    " ",
                  )}
                >
                  {expanded
                    ? copy.showLess
                    : copy.showMore}
                </button>
              ) : null}
            </div>
          ) : null}

          {editing &&
          editEditor ? (
            <div className="mt-4">
              {editEditor}
            </div>
          ) : null}

          {!contentUnavailable ? (
            <div
              role="group"
              aria-label={
                language ===
                  "es"
                  ? "Acciones del comentario"
                  : "Comment actions"
              }
              onClick={
                handleActionsClick
              }
              className={
                joinCreativeCommentItemClasses(
                  "mt-4 flex flex-wrap items-center gap-2",

                  actionsClassName,
                )
              }
            >
              {showLike ? (
                <CreativeIconButton
                  icon={
                    <CreativeCommentLikeIcon
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
                      : "ghost"
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
                    normalizedLikeCount >
                      0
                      ? formatCreativeCommentCount(
                          normalizedLikeCount,
                        )
                      : undefined
                  }
                  badgeLabel={
                    normalizedLikeCount >
                      0
                      ? `${normalizedLikeCount} ${copy.like}`
                      : undefined
                  }
                  onClick={
                    () => {
                      runCreativeCommentAction(
                        onLike,
                      );
                    }
                  }
                />
              ) : null}

              {showReply ? (
                <button
                  type="button"
                  aria-expanded={
                    replying
                  }
                  disabled={
                    disabled ||
                    !canReply ||
                    !onReply ||
                    (
                      anyActionLoading &&
                      !replyLoading
                    )
                  }
                  onClick={
                    () => {
                      runCreativeCommentAction(
                        onReply,
                      );
                    }
                  }
                  className={
                    joinCreativeCommentItemClasses(
                      "inline-flex min-h-8 items-center justify-center",
                      "rounded-lg px-2.5 py-1.5",
                      "font-semibold text-zinc-600",
                      "outline-none transition-colors duration-150",

                      "hover:bg-zinc-100",
                      "hover:text-zinc-950",

                      "focus-visible:ring-2",
                      "focus-visible:ring-emerald-500/50",

                      "disabled:cursor-not-allowed",
                      "disabled:opacity-45",

                      "dark:text-zinc-400",
                      "dark:hover:bg-white/[0.07]",
                      "dark:hover:text-white",

                      CREATIVE_COMMENT_ITEM_SIZE_CLASSES[
                        size
                      ].action,
                    )
                  }
                >
                  {replyLoading
                    ? copy.processingReply
                    : copy.reply}
                </button>
              ) : null}

              {showEdit &&
              currentUserIsAuthor ? (
                <CreativeIconButton
                  icon={
                    <CreativeCommentEditIcon />
                  }
                  label={
                    copy.edit
                  }
                  loadingLabel={
                    copy.processingEdit
                  }
                  size={
                    iconSize
                  }
                  variant="ghost"
                  active={
                    editing
                  }
                  pressed={
                    editing
                  }
                  loading={
                    editLoading
                  }
                  disabled={
                    disabled ||
                    !canEdit ||
                    !onEdit ||
                    (
                      anyActionLoading &&
                      !editLoading
                    )
                  }
                  onClick={
                    () => {
                      runCreativeCommentAction(
                        onEdit,
                      );
                    }
                  }
                />
              ) : null}

              {showDelete &&
              (
                currentUserIsAuthor ||
                canModerate
              ) ? (
                <CreativeIconButton
                  icon={
                    <CreativeCommentDeleteIcon />
                  }
                  label={
                    copy.delete
                  }
                  loadingLabel={
                    copy.processingDelete
                  }
                  size={
                    iconSize
                  }
                  variant="danger"
                  loading={
                    deleteLoading
                  }
                  disabled={
                    disabled ||
                    !canDelete ||
                    !onDelete ||
                    (
                      anyActionLoading &&
                      !deleteLoading
                    )
                  }
                  onClick={
                    () => {
                      runCreativeCommentAction(
                        onDelete,
                      );
                    }
                  }
                />
              ) : null}

              {showReport &&
              !currentUserIsAuthor ? (
                <CreativeIconButton
                  icon={
                    <CreativeCommentReportIcon />
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
                  variant="ghost"
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
                      runCreativeCommentAction(
                        onReport,
                      );
                    }
                  }
                />
              ) : null}

              {actionsContent}
            </div>
          ) : null}

          {replying &&
          replyEditor ? (
            <div className="mt-4">
              {replyEditor}
            </div>
          ) : null}

          {canModerate &&
          moderationContent ? (
            <div className="mt-4">
              {moderationContent}
            </div>
          ) : null}

          {showReplies &&
          normalizedReplyCount >
            0 ? (
            <div className="mt-4">
              <button
                type="button"
                aria-expanded={
                  repliesExpanded
                }
                disabled={
                  disabled ||
                  !onToggleReplies ||
                  (
                    anyActionLoading &&
                    !repliesLoading
                  )
                }
                onClick={
                  () => {
                    runCreativeCommentAction(
                      onToggleReplies,
                    );
                  }
                }
                className={[
                  "inline-flex min-h-9 items-center gap-2",
                  "rounded-xl px-3 py-2",
                  "text-xs font-bold",
                  "text-emerald-700",
                  "outline-none",
                  "transition-colors duration-150",

                  "hover:bg-emerald-500/10",

                  "focus-visible:ring-2",
                  "focus-visible:ring-emerald-500/50",

                  "disabled:cursor-not-allowed",
                  "disabled:opacity-45",

                  "dark:text-emerald-300",
                  "dark:hover:bg-emerald-400/10",
                ].join(
                  " ",
                )}
              >
                <CreativeCommentChevronIcon
                  expanded={
                    repliesExpanded
                  }
                />

                <span>
                  {repliesLoading
                    ? copy.processingReplies
                    : repliesExpanded
                      ? copy.hideReplies
                      : `${copy.showReplies} (${normalizedReplyCount} ${repliesLabel})`}
                </span>
              </button>
            </div>
          ) : null}

          {repliesExpanded &&
          repliesContent ? (
            <div
              className={
                joinCreativeCommentItemClasses(
                  "mt-4 space-y-3",
                  "border-l-2 border-emerald-500/15 pl-3",

                  "dark:border-emerald-400/15",

                  repliesClassName,
                )
              }
            >
              {repliesContent}
            </div>
          ) : null}

          {footerContent ? (
            <div className="mt-4">
              {footerContent}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeCommentItem;