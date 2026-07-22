"use client";

/*
 * Panel de comentarios del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Mostrar el formulario para publicar comentarios.
 * - Mostrar la lista de comentarios y respuestas.
 * - Ordenar los comentarios.
 * - Mostrar estados de carga, error y lista vacía.
 * - Permitir cargar más comentarios.
 * - Coordinar acciones de Me gusta, respuesta,
 *   edición, eliminación y reporte.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Acceso directo a Prisma.
 * - Estado global de autenticación.
 *
 * Todos los datos y acciones son controlados
 * por el componente padre.
 */

import {
  useId,
} from "react";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

import {
  CreativeCommentForm,
} from "@/components/molecules/creative/CreativeCommentForm";

import type {
  CreativeCommentFormSize,
  CreativeCommentFormVariant,
} from "@/components/molecules/creative/CreativeCommentForm";

import {
  CreativeCommentItem,
} from "@/components/molecules/creative/CreativeCommentItem";

import type {
  CreativeCommentItemLoadingAction,
  CreativeCommentItemSize,
  CreativeCommentItemStatus,
  CreativeCommentItemVariant,
  CreativeCommentVisibleLines,
} from "@/components/molecules/creative/CreativeCommentItem";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeCommentsPanelLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeCommentsPanelSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeCommentsPanelVariant =
  | "surface"
  | "soft"
  | "dark"
  | "minimal";

/* =========================================================
   POSICIÓN DEL FORMULARIO
   ========================================================= */

export type CreativeCommentsFormPosition =
  | "top"
  | "bottom";

/* =========================================================
   ORDENAMIENTO
   ========================================================= */

export type CreativeCommentsSortValue =
  | "NEWEST"
  | "OLDEST"
  | "MOST_LIKED";

/* =========================================================
   COMENTARIO DEL PANEL
   ========================================================= */

export interface CreativeCommentsPanelComment {
  id:
    string;

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

  depth?:
    number;

  expandable?:
    boolean;

  expanded?:
    boolean;

  liked?:
    boolean;

  likeCount?:
    number | null;

  canLike?:
    boolean;

  canReply?:
    boolean;

  replying?:
    boolean;

  replyEditor?:
    ReactNode;

  canEdit?:
    boolean;

  editing?:
    boolean;

  editEditor?:
    ReactNode;

  canDelete?:
    boolean;

  canReport?:
    boolean;

  canModerate?:
    boolean;

  moderationContent?:
    ReactNode;

  replyCount?:
    number | null;

  repliesExpanded?:
    boolean;

  repliesContent?:
    ReactNode;

  headerContent?:
    ReactNode;

  actionsContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  className?:
    string;
}

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeCommentsPanelProps
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "children"
  > {
  /*
   * Apariencia.
   */
  language?:
    CreativeCommentsPanelLanguage;

  size?:
    CreativeCommentsPanelSize;

  variant?:
    CreativeCommentsPanelVariant;

  heading?:
    string | null;

  description?:
    string | null;

  /*
   * Datos.
   */
  comments?:
    CreativeCommentsPanelComment[];

  totalComments?:
    number | null;

  /*
   * Estados.
   */
  loading?:
    boolean;

  loadingMore?:
    boolean;

  disabled?:
    boolean;

  error?:
    string | null;

  /*
   * Ordenamiento.
   */
  sortValue?:
    CreativeCommentsSortValue;

  onSortChange?:
    (
      value:
        CreativeCommentsSortValue,
    ) => void;

  /*
   * Formulario principal.
   */
  commentValue?:
    string;

  commentDefaultValue?:
    string;

  onCommentValueChange?:
    (
      value:
        string,
    ) => void;

  onSubmitComment?:
    (
      content:
        string,
    ) => void | Promise<void>;

  onCommentSubmitted?:
    () => void;

  onCommentSubmitError?:
    (
      error:
        unknown,
    ) => void;

  commentSubmitting?:
    boolean;

  commentError?:
    string | null;

  commentHelperText?:
    string | null;

  minimumCommentLength?:
    number;

  maximumCommentLength?:
    number;

  clearCommentOnSubmit?:
    boolean;

  commentAvatar?:
    ReactNode;

  /*
   * Autenticación.
   */
  authenticated?:
    boolean;

  requireAuthentication?:
    boolean;

  onRequireAuthentication?:
    () => void;

  /*
   * Acciones por comentario.
   */
  loadingActionByCommentId?:
    Partial<
      Record<
        string,
        CreativeCommentItemLoadingAction
      >
    >;

  onLike?:
    (
      comment:
        CreativeCommentsPanelComment,
    ) => void | Promise<void>;

  onReply?:
    (
      comment:
        CreativeCommentsPanelComment,
    ) => void | Promise<void>;

  onEdit?:
    (
      comment:
        CreativeCommentsPanelComment,
    ) => void | Promise<void>;

  onDelete?:
    (
      comment:
        CreativeCommentsPanelComment,
    ) => void | Promise<void>;

  onReport?:
    (
      comment:
        CreativeCommentsPanelComment,
    ) => void | Promise<void>;

  onToggleExpanded?:
    (
      comment:
        CreativeCommentsPanelComment,
    ) => void;

  onToggleReplies?:
    (
      comment:
        CreativeCommentsPanelComment,
    ) => void | Promise<void>;

  /*
   * Paginación.
   */
  hasMore?:
    boolean;

  onLoadMore?:
    () => void | Promise<void>;

  /*
   * Visibilidad.
   */
  showHeader?:
    boolean;

  showDescription?:
    boolean;

  showCount?:
    boolean;

  showSort?:
    boolean;

  showForm?:
    boolean;

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
   * Configuración visual.
   */
  formPosition?:
    CreativeCommentsFormPosition;

  maximumVisibleLines?:
    CreativeCommentVisibleLines;

  /*
   * Contenido adicional.
   */
  headerContent?:
    ReactNode;

  formHeaderContent?:
    ReactNode;

  formFooterContent?:
    ReactNode;

  emptyContent?:
    ReactNode;

  errorContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  /*
   * Clases adicionales.
   */
  headerClassName?:
    string;

  formClassName?:
    string;

  listClassName?:
    string;

  commentClassName?:
    string;

  loadMoreClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_COMMENTS_PANEL_COPY = {
  es: {
    panel:
      "Comentarios del diseño",

    heading:
      "Comentarios",

    description:
      "Comparte tu opinión, responde a otros usuarios y participa en la conversación.",

    comment:
      "comentario",

    comments:
      "comentarios",

    writeComment:
      "Escribe un comentario",

    loading:
      "Cargando comentarios...",

    emptyTitle:
      "Todavía no hay comentarios",

    emptyDescription:
      "Sé la primera persona en compartir una opinión sobre este diseño.",

    errorTitle:
      "No se pudieron cargar los comentarios",

    errorDescription:
      "Ocurrió un problema al cargar la conversación.",

    sortLabel:
      "Ordenar comentarios",

    newest:
      "Más recientes",

    oldest:
      "Más antiguos",

    mostLiked:
      "Más gustados",

    loadMore:
      "Cargar más comentarios",

    loadingMore:
      "Cargando más comentarios...",
  },

  en: {
    panel:
      "Design comments",

    heading:
      "Comments",

    description:
      "Share your opinion, reply to other users and join the conversation.",

    comment:
      "comment",

    comments:
      "comments",

    writeComment:
      "Write a comment",

    loading:
      "Loading comments...",

    emptyTitle:
      "There are no comments yet",

    emptyDescription:
      "Be the first person to share an opinion about this design.",

    errorTitle:
      "Comments could not be loaded",

    errorDescription:
      "A problem occurred while loading the conversation.",

    sortLabel:
      "Sort comments",

    newest:
      "Newest",

    oldest:
      "Oldest",

    mostLiked:
      "Most liked",

    loadMore:
      "Load more comments",

    loadingMore:
      "Loading more comments...",
  },
} as const;

/* =========================================================
   VALORES DE ORDENAMIENTO
   ========================================================= */

const CREATIVE_COMMENTS_SORT_VALUES:
  readonly CreativeCommentsSortValue[] = [
    "NEWEST",
    "OLDEST",
    "MOST_LIKED",
  ];

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_COMMENTS_PANEL_BASE_CLASSES = [
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

const CREATIVE_COMMENTS_PANEL_VARIANT_CLASSES = {
  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "shadow-[0_16px_48px_rgba(15,23,42,0.08)]",
    "backdrop-blur-xl",

    "dark:border-white/10",
    "dark:bg-zinc-950/85",
    "dark:shadow-[0_18px_52px_rgba(0,0,0,0.30)]",
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
    "bg-black/65",
    "text-white",
    "shadow-[0_18px_54px_rgba(0,0,0,0.38)]",
    "backdrop-blur-xl",
  ].join(
    " ",
  ),

  minimal: [
    "border-transparent",
    "bg-transparent",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeCommentsPanelVariant,
  string
>;

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_COMMENTS_PANEL_SIZE_CLASSES = {
  sm: {
    root:
      "rounded-2xl",

    section:
      "p-3",

    heading:
      "text-base",

    description:
      "text-xs leading-5",

    gap:
      "space-y-3",

    button:
      "min-h-9 rounded-lg px-3 py-2 text-xs",
  },

  md: {
    root:
      "rounded-2xl",

    section:
      "p-4 sm:p-5",

    heading:
      "text-lg",

    description:
      "text-sm leading-6",

    gap:
      "space-y-4",

    button:
      "min-h-10 rounded-xl px-4 py-2.5 text-sm",
  },

  lg: {
    root:
      "rounded-3xl",

    section:
      "p-5 sm:p-6",

    heading:
      "text-xl",

    description:
      "text-base leading-7",

    gap:
      "space-y-5",

    button:
      "min-h-11 rounded-xl px-5 py-3 text-sm",
  },
} as const satisfies Record<
  CreativeCommentsPanelSize,
  {
    root:
      string;

    section:
      string;

    heading:
      string;

    description:
      string;

    gap:
      string;

    button:
      string;
  }
>;

/* =========================================================
   TAMAÑOS DE COMPONENTES HIJOS
   ========================================================= */

const CREATIVE_COMMENTS_PANEL_ITEM_SIZE = {
  sm:
    "sm",

  md:
    "md",

  lg:
    "lg",
} as const satisfies Record<
  CreativeCommentsPanelSize,
  CreativeCommentItemSize
>;

const CREATIVE_COMMENTS_PANEL_FORM_SIZE = {
  sm:
    "sm",

  md:
    "md",

  lg:
    "lg",
} as const satisfies Record<
  CreativeCommentsPanelSize,
  CreativeCommentFormSize
>;

/* =========================================================
   VARIANTES DE COMPONENTES HIJOS
   ========================================================= */

const CREATIVE_COMMENTS_PANEL_ITEM_VARIANT = {
  surface:
    "surface",

  soft:
    "soft",

  dark:
    "minimal",

  minimal:
    "minimal",
} as const satisfies Record<
  CreativeCommentsPanelVariant,
  CreativeCommentItemVariant
>;

const CREATIVE_COMMENTS_PANEL_FORM_VARIANT = {
  surface:
    "surface",

  soft:
    "soft",

  dark:
    "minimal",

  minimal:
    "minimal",
} as const satisfies Record<
  CreativeCommentsPanelVariant,
  CreativeCommentFormVariant
>;

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeCommentsPanelClasses(
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

function normalizeCreativeCommentsPanelText(
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

function normalizeCreativeCommentsPanelCount(
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

export function isCreativeCommentsSortValue(
  value:
    string,
): value is CreativeCommentsSortValue {
  return CREATIVE_COMMENTS_SORT_VALUES.includes(
    value as CreativeCommentsSortValue,
  );
}

export function formatCreativeCommentsPanelCount(
  value:
    number | null | undefined,
): string {
  const normalizedValue =
    normalizeCreativeCommentsPanelCount(
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

function CreativeCommentsPanelEmptyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />

      <path d="M8 9h8" />

      <path d="M8 13h5" />
    </svg>
  );
}

function CreativeCommentsPanelErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 7v6" />

      <path d="M12 17h.01" />
    </svg>
  );
}

function CreativeCommentsPanelChevronIcon() {
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

export function CreativeCommentsPanel({
  language =
    "es",

  size =
    "md",

  variant =
    "surface",

  heading =
    null,

  description =
    null,

  comments =
    [],

  totalComments =
    null,

  loading =
    false,

  loadingMore =
    false,

  disabled =
    false,

  error =
    null,

  sortValue =
    "NEWEST",

  onSortChange,

  commentValue,

  commentDefaultValue =
    "",

  onCommentValueChange,

  onSubmitComment,

  onCommentSubmitted,

  onCommentSubmitError,

  commentSubmitting =
    false,

  commentError =
    null,

  commentHelperText =
    null,

  minimumCommentLength =
    2,

  maximumCommentLength =
    2_000,

  clearCommentOnSubmit =
    true,

  commentAvatar =
    null,

  authenticated =
    false,

  requireAuthentication =
    true,

  onRequireAuthentication,

  loadingActionByCommentId =
    {},

  onLike,

  onReply,

  onEdit,

  onDelete,

  onReport,

  onToggleExpanded,

  onToggleReplies,

  hasMore =
    false,

  onLoadMore,

  showHeader =
    true,

  showDescription =
    true,

  showCount =
    true,

  showSort =
    true,

  showForm =
    true,

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

  formPosition =
    "top",

  maximumVisibleLines =
    4,

  headerContent =
    null,

  formHeaderContent =
    null,

  formFooterContent =
    null,

  emptyContent =
    null,

  errorContent =
    null,

  footerContent =
    null,

  headerClassName,

  formClassName,

  listClassName,

  commentClassName,

  loadMoreClassName,

  className,

  "aria-label":
    ariaLabel,

  ...sectionProps
}: CreativeCommentsPanelProps) {
  const generatedId =
    useId();

  const copy =
    CREATIVE_COMMENTS_PANEL_COPY[
      language
    ];

  const resolvedHeading =
    normalizeCreativeCommentsPanelText(
      heading,
    ) ||
    copy.heading;

  const resolvedDescription =
    normalizeCreativeCommentsPanelText(
      description,
    ) ||
    copy.description;

  const normalizedError =
    normalizeCreativeCommentsPanelText(
      error,
    );

  const normalizedTotalComments =
    totalComments ===
      null
      ? comments.length
      : normalizeCreativeCommentsPanelCount(
          totalComments,
        );

  const commentCountLabel =
    normalizedTotalComments ===
      1
      ? copy.comment
      : copy.comments;

  const headingId =
    `creative-comments-heading-${generatedId}`;

  const descriptionId =
    `creative-comments-description-${generatedId}`;

  const childItemSize =
    CREATIVE_COMMENTS_PANEL_ITEM_SIZE[
      size
    ];

  const childFormSize =
    CREATIVE_COMMENTS_PANEL_FORM_SIZE[
      size
    ];

  const childItemVariant =
    CREATIVE_COMMENTS_PANEL_ITEM_VARIANT[
      variant
    ];

  const childFormVariant =
    CREATIVE_COMMENTS_PANEL_FORM_VARIANT[
      variant
    ];

  const interactionDisabled =
    disabled ||
    loading;

  const commentFormContent =
    showForm ? (
      <div
        className={
          joinCreativeCommentsPanelClasses(
            "border-b border-zinc-200/80",
            "dark:border-white/10",

            formPosition ===
              "bottom" &&
              "border-b-0 border-t",

            CREATIVE_COMMENTS_PANEL_SIZE_CLASSES[
              size
            ].section,

            formClassName,
          )
        }
      >
        <CreativeCommentForm
          value={
            commentValue
          }
          defaultValue={
            commentDefaultValue
          }
          language={
            language
          }
          size={
            childFormSize
          }
          variant={
            childFormVariant
          }
          mode="COMMENT"
          label={
            copy.writeComment
          }
          showLabel
          authenticated={
            authenticated
          }
          requireAuthentication={
            requireAuthentication
          }
          onRequireAuthentication={
            onRequireAuthentication
          }
          submitting={
            commentSubmitting
          }
          disabled={
            interactionDisabled
          }
          minimumLength={
            minimumCommentLength
          }
          maximumLength={
            maximumCommentLength
          }
          clearOnSubmit={
            clearCommentOnSubmit
          }
          helperText={
            commentHelperText
          }
          error={
            commentError
          }
          avatar={
            commentAvatar
          }
          headerContent={
            formHeaderContent
          }
          footerContent={
            formFooterContent
          }
          onValueChange={
            onCommentValueChange
          }
          onSubmitComment={
            onSubmitComment
          }
          onSubmitted={
            onCommentSubmitted
          }
          onSubmitError={
            onCommentSubmitError
          }
        />
      </div>
    ) : null;

  return (
    <section
      {...sectionProps}
      aria-label={
        ariaLabel ??
        copy.panel
      }
      aria-labelledby={
        headingId
      }
      aria-describedby={
        showDescription
          ? descriptionId
          : undefined
      }
      aria-busy={
        loading ||
        loadingMore ||
        commentSubmitting ||
        undefined
      }
      data-creative-comments-panel=""
      data-size={
        size
      }
      data-variant={
        variant
      }
      data-comment-count={
        normalizedTotalComments
      }
      className={
        joinCreativeCommentsPanelClasses(
          CREATIVE_COMMENTS_PANEL_BASE_CLASSES,

          CREATIVE_COMMENTS_PANEL_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_COMMENTS_PANEL_SIZE_CLASSES[
            size
          ].root,

          disabled &&
            "opacity-65",

          className,
        )
      }
    >
      {showHeader ? (
        <header
          className={
            joinCreativeCommentsPanelClasses(
              "flex flex-wrap items-start justify-between gap-4",
              "border-b border-zinc-200/80",
              "dark:border-white/10",

              CREATIVE_COMMENTS_PANEL_SIZE_CLASSES[
                size
              ].section,

              headerClassName,
            )
          }
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id={
                  headingId
                }
                className={
                  joinCreativeCommentsPanelClasses(
                    "font-black text-zinc-950",
                    "dark:text-white",

                    CREATIVE_COMMENTS_PANEL_SIZE_CLASSES[
                      size
                    ].heading,
                  )
                }
              >
                {resolvedHeading}
              </h2>

              {showCount ? (
                <span
                  aria-label={
                    `${normalizedTotalComments} ${commentCountLabel}`
                  }
                  className={[
                    "inline-flex min-h-7 items-center justify-center",
                    "rounded-full border",
                    "border-emerald-500/20",
                    "bg-emerald-500/10",
                    "px-2.5 py-1",
                    "text-xs font-black tabular-nums",
                    "text-emerald-700",

                    "dark:border-emerald-400/20",
                    "dark:bg-emerald-400/10",
                    "dark:text-emerald-300",
                  ].join(
                    " ",
                  )}
                >
                  {formatCreativeCommentsPanelCount(
                    normalizedTotalComments,
                  )}
                </span>
              ) : null}
            </div>

            {showDescription ? (
              <p
                id={
                  descriptionId
                }
                className={
                  joinCreativeCommentsPanelClasses(
                    "mt-2 text-zinc-600",
                    "dark:text-zinc-400",

                    CREATIVE_COMMENTS_PANEL_SIZE_CLASSES[
                      size
                    ].description,
                  )
                }
              >
                {resolvedDescription}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {showSort ? (
              <div className="relative min-w-[170px]">
                <label
                  htmlFor={
                    `creative-comments-sort-${generatedId}`
                  }
                  className="sr-only"
                >
                  {copy.sortLabel}
                </label>

                <select
                  id={
                    `creative-comments-sort-${generatedId}`
                  }
                  value={
                    sortValue
                  }
                  disabled={
                    interactionDisabled ||
                    !onSortChange
                  }
                  aria-label={
                    copy.sortLabel
                  }
                  onChange={
                    (
                      event,
                    ) => {
                      const nextValue =
                        event.currentTarget.value;

                      if (
                        !isCreativeCommentsSortValue(
                          nextValue,
                        )
                      ) {
                        return;
                      }

                      onSortChange?.(
                        nextValue,
                      );
                    }
                  }
                  className={[
                    "min-h-10 w-full appearance-none",
                    "rounded-xl border",
                    "border-zinc-200",
                    "bg-white/90",
                    "py-2 pl-3 pr-10",
                    "text-xs font-semibold",
                    "text-zinc-700",
                    "outline-none",
                    "transition-colors duration-150",

                    "focus:border-emerald-500/40",
                    "focus:ring-2",
                    "focus:ring-emerald-500/15",

                    "disabled:cursor-not-allowed",
                    "disabled:opacity-50",

                    "dark:border-white/10",
                    "dark:bg-zinc-900/90",
                    "dark:text-zinc-200",

                    variant ===
                      "dark"
                      ? "border-white/10 bg-white/[0.06] text-white"
                      : "",
                  ].join(
                    " ",
                  )}
                >
                  <option value="NEWEST">
                    {copy.newest}
                  </option>

                  <option value="OLDEST">
                    {copy.oldest}
                  </option>

                  <option value="MOST_LIKED">
                    {copy.mostLiked}
                  </option>
                </select>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  <CreativeCommentsPanelChevronIcon />
                </span>
              </div>
            ) : null}

            {headerContent}
          </div>
        </header>
      ) : null}

      {formPosition ===
        "top"
        ? commentFormContent
        : null}

      <div
        className={
          CREATIVE_COMMENTS_PANEL_SIZE_CLASSES[
            size
          ].section
        }
      >
        {loading ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 text-center">
            <CreativeSpinner
              decorative
              size="lg"
              variant="primary"
            />

            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              {copy.loading}
            </p>
          </div>
        ) : normalizedError ? (
          <div
            role="alert"
            className={[
              "flex min-h-64 flex-col",
              "items-center justify-center",
              "rounded-2xl border",
              "border-red-500/20",
              "bg-red-500/[0.04]",
              "px-6 py-10 text-center",

              "dark:border-red-400/20",
              "dark:bg-red-400/[0.04]",
            ].join(
              " ",
            )}
          >
            {errorContent ?? (
              <>
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-600 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300">
                  <CreativeCommentsPanelErrorIcon />
                </span>

                <h3 className="mt-5 text-lg font-black text-zinc-950 dark:text-white">
                  {copy.errorTitle}
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {normalizedError ||
                  copy.errorDescription}
                </p>
              </>
            )}
          </div>
        ) : comments.length ===
          0 ? (
          <div
            className={[
              "flex min-h-64 flex-col",
              "items-center justify-center",
              "rounded-2xl border",
              "border-dashed border-zinc-300",
              "bg-zinc-50/60",
              "px-6 py-10 text-center",

              "dark:border-white/10",
              "dark:bg-white/[0.02]",
            ].join(
              " ",
            )}
          >
            {emptyContent ?? (
              <>
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <CreativeCommentsPanelEmptyIcon />
                </span>

                <h3 className="mt-5 text-lg font-black text-zinc-950 dark:text-white">
                  {copy.emptyTitle}
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {copy.emptyDescription}
                </p>
              </>
            )}
          </div>
        ) : (
          <div
            className={
              joinCreativeCommentsPanelClasses(
                CREATIVE_COMMENTS_PANEL_SIZE_CLASSES[
                  size
                ].gap,

                listClassName,
              )
            }
          >
            {comments.map(
              (
                comment,
                commentIndex,
              ) => {
                const normalizedCommentId =
                  normalizeCreativeCommentsPanelText(
                    comment.id,
                  );

                return (
                  <CreativeCommentItem
                    key={
                      normalizedCommentId ||
                      `creative-comment-${commentIndex}`
                    }
                    commentId={
                      normalizedCommentId
                    }
                    authorName={
                      comment.authorName
                    }
                    authorLabel={
                      comment.authorLabel
                    }
                    authorInitials={
                      comment.authorInitials
                    }
                    avatar={
                      comment.avatar
                    }
                    authorIsAdmin={
                      Boolean(
                        comment.authorIsAdmin,
                      )
                    }
                    authorIsOwner={
                      Boolean(
                        comment.authorIsOwner,
                      )
                    }
                    currentUserIsAuthor={
                      Boolean(
                        comment.currentUserIsAuthor,
                      )
                    }
                    content={
                      comment.content
                    }
                    createdAtLabel={
                      comment.createdAtLabel
                    }
                    edited={
                      Boolean(
                        comment.edited,
                      )
                    }
                    pinned={
                      Boolean(
                        comment.pinned,
                      )
                    }
                    status={
                      comment.status ??
                      "PUBLISHED"
                    }
                    language={
                      language
                    }
                    size={
                      childItemSize
                    }
                    variant={
                      childItemVariant
                    }
                    depth={
                      comment.depth ??
                      0
                    }
                    expandable={
                      Boolean(
                        comment.expandable,
                      )
                    }
                    expanded={
                      Boolean(
                        comment.expanded,
                      )
                    }
                    maximumVisibleLines={
                      maximumVisibleLines
                    }
                    liked={
                      Boolean(
                        comment.liked,
                      )
                    }
                    likeCount={
                      comment.likeCount
                    }
                    canLike={
                      comment.canLike !==
                        false &&
                      Boolean(
                        onLike,
                      )
                    }
                    canReply={
                      comment.canReply !==
                        false &&
                      Boolean(
                        onReply,
                      )
                    }
                    replying={
                      Boolean(
                        comment.replying,
                      )
                    }
                    replyEditor={
                      comment.replyEditor
                    }
                    canEdit={
                      comment.canEdit !==
                        false &&
                      Boolean(
                        onEdit,
                      )
                    }
                    editing={
                      Boolean(
                        comment.editing,
                      )
                    }
                    editEditor={
                      comment.editEditor
                    }
                    canDelete={
                      comment.canDelete !==
                        false &&
                      Boolean(
                        onDelete,
                      )
                    }
                    canReport={
                      comment.canReport !==
                        false &&
                      Boolean(
                        onReport,
                      )
                    }
                    canModerate={
                      Boolean(
                        comment.canModerate,
                      )
                    }
                    moderationContent={
                      comment.moderationContent
                    }
                    replyCount={
                      comment.replyCount
                    }
                    repliesExpanded={
                      Boolean(
                        comment.repliesExpanded,
                      )
                    }
                    repliesContent={
                      comment.repliesContent
                    }
                    disabled={
                      interactionDisabled
                    }
                    loadingAction={
                      loadingActionByCommentId[
                        normalizedCommentId
                      ] ??
                      null
                    }
                    showLike={
                      showLike
                    }
                    showReply={
                      showReply
                    }
                    showEdit={
                      showEdit
                    }
                    showDelete={
                      showDelete
                    }
                    showReport={
                      showReport
                    }
                    showReplies={
                      showReplies
                    }
                    headerContent={
                      comment.headerContent
                    }
                    actionsContent={
                      comment.actionsContent
                    }
                    footerContent={
                      comment.footerContent
                    }
                    className={
                      joinCreativeCommentsPanelClasses(
                        comment.className,

                        commentClassName,
                      )
                    }
                    onToggleExpanded={
                      onToggleExpanded
                        ? () => {
                            onToggleExpanded(
                              comment,
                            );
                          }
                        : undefined
                    }
                    onLike={
                      onLike
                        ? () =>
                            onLike(
                              comment,
                            )
                        : undefined
                    }
                    onReply={
                      onReply
                        ? () =>
                            onReply(
                              comment,
                            )
                        : undefined
                    }
                    onEdit={
                      onEdit
                        ? () =>
                            onEdit(
                              comment,
                            )
                        : undefined
                    }
                    onDelete={
                      onDelete
                        ? () =>
                            onDelete(
                              comment,
                            )
                        : undefined
                    }
                    onReport={
                      onReport
                        ? () =>
                            onReport(
                              comment,
                            )
                        : undefined
                    }
                    onToggleReplies={
                      onToggleReplies
                        ? () =>
                            onToggleReplies(
                              comment,
                            )
                        : undefined
                    }
                  />
                );
              },
            )}
          </div>
        )}

        {!loading &&
        !normalizedError &&
        comments.length >
          0 &&
        hasMore ? (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              aria-busy={
                loadingMore ||
                undefined
              }
              disabled={
                disabled ||
                loadingMore ||
                !onLoadMore
              }
              onClick={
                () => {
                  void onLoadMore?.();
                }
              }
              className={
                joinCreativeCommentsPanelClasses(
                  "inline-flex items-center justify-center gap-2.5",
                  "border border-emerald-500/25",
                  "bg-emerald-500/10",
                  "font-bold text-emerald-700",
                  "outline-none",
                  "transition-all duration-200",

                  "enabled:hover:-translate-y-0.5",
                  "enabled:hover:border-emerald-500/40",
                  "enabled:hover:bg-emerald-500/15",
                  "enabled:hover:shadow-[0_10px_26px_rgba(16,185,129,0.15)]",

                  "enabled:active:translate-y-0",
                  "enabled:active:scale-[0.98]",

                  "focus-visible:ring-2",
                  "focus-visible:ring-emerald-500/60",
                  "focus-visible:ring-offset-2",

                  "disabled:cursor-not-allowed",
                  "disabled:opacity-45",

                  "dark:border-emerald-400/25",
                  "dark:bg-emerald-400/10",
                  "dark:text-emerald-300",

                  "dark:focus-visible:ring-emerald-400/60",
                  "dark:focus-visible:ring-offset-zinc-950",

                  CREATIVE_COMMENTS_PANEL_SIZE_CLASSES[
                    size
                  ].button,

                  loadMoreClassName,
                )
              }
            >
              {loadingMore ? (
                <CreativeSpinner
                  decorative
                  size="sm"
                  variant="primary"
                />
              ) : null}

              <span>
                {loadingMore
                  ? copy.loadingMore
                  : copy.loadMore}
              </span>
            </button>
          </div>
        ) : null}
      </div>

      {formPosition ===
        "bottom"
        ? commentFormContent
        : null}

      {footerContent ? (
        <footer
          className={
            joinCreativeCommentsPanelClasses(
              "border-t border-zinc-200/80",
              "dark:border-white/10",

              CREATIVE_COMMENTS_PANEL_SIZE_CLASSES[
                size
              ].section,
            )
          }
        >
          {footerContent}
        </footer>
      ) : null}
    </section>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeCommentsPanel;