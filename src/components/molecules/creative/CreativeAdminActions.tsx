"use client";

/*
 * Acciones administrativas para publicaciones
 * del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Editar una publicación.
 * - Publicar un borrador.
 * - Ocultar una publicación.
 * - Restaurar una publicación oculta o archivada.
 * - Archivar una publicación.
 * - Eliminar definitivamente una publicación.
 * - Mostrar el estado actual.
 * - Mostrar estados de carga.
 *
 * Todas las acciones son controladas por el componente padre.
 */

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

import {
  CreativeStatusBadge,
} from "@/components/atoms/creative/CreativeStatusBadge";

import type {
  CreativeItemStatus,
} from "@/types/creative/creative-item.types";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeAdminActionsLanguage =
  | "es"
  | "en";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeAdminActionsSize =
  | "sm"
  | "md";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeAdminActionsVariant =
  | "surface"
  | "minimal"
  | "dark";

/* =========================================================
   ACCIONES EN PROCESO
   ========================================================= */

export type CreativeAdminLoadingAction =
  | "EDIT"
  | "PUBLISH"
  | "HIDE"
  | "RESTORE"
  | "ARCHIVE"
  | "DELETE"
  | null;

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeAdminActionsProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "children"
  > {
  /*
   * Estado actual de la publicación.
   */
  status:
    CreativeItemStatus;

  /*
   * Idioma de los textos.
   */
  language?:
    CreativeAdminActionsLanguage;

  /*
   * Tamaño visual.
   */
  size?:
    CreativeAdminActionsSize;

  /*
   * Variante visual.
   */
  variant?:
    CreativeAdminActionsVariant;

  /*
   * Título opcional del grupo.
   */
  heading?:
    string | null;

  /*
   * Estado general.
   */
  disabled?:
    boolean;

  loadingAction?:
    CreativeAdminLoadingAction;

  /*
   * Permisos.
   */
  canEdit?:
    boolean;

  canPublish?:
    boolean;

  canHide?:
    boolean;

  canRestore?:
    boolean;

  canArchive?:
    boolean;

  canDeletePermanently?:
    boolean;

  /*
   * Visibilidad.
   */
  showStatus?:
    boolean;

  showEdit?:
    boolean;

  showPublish?:
    boolean;

  showHide?:
    boolean;

  showRestore?:
    boolean;

  showArchive?:
    boolean;

  showDelete?:
    boolean;

  /*
   * Acciones.
   */
  onEdit?:
    () => void | Promise<void>;

  onPublish?:
    () => void | Promise<void>;

  onHide?:
    () => void | Promise<void>;

  onRestore?:
    () => void | Promise<void>;

  onArchive?:
    () => void | Promise<void>;

  onDeletePermanently?:
    () => void | Promise<void>;

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
  headerClassName?:
    string;

  actionsClassName?:
    string;

  buttonClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_ADMIN_ACTIONS_COPY = {
  es: {
    group:
      "Acciones administrativas del diseño",

    heading:
      "Administrar publicación",

    edit:
      "Editar",

    editing:
      "Abriendo edición...",

    publish:
      "Publicar",

    publishing:
      "Publicando...",

    hide:
      "Ocultar",

    hiding:
      "Ocultando...",

    restore:
      "Restaurar",

    restoring:
      "Restaurando...",

    archive:
      "Archivar",

    archiving:
      "Archivando...",

    delete:
      "Eliminar definitivamente",

    deleting:
      "Eliminando...",

    currentStatus:
      "Estado actual",
  },

  en: {
    group:
      "Design administrative actions",

    heading:
      "Manage publication",

    edit:
      "Edit",

    editing:
      "Opening editor...",

    publish:
      "Publish",

    publishing:
      "Publishing...",

    hide:
      "Hide",

    hiding:
      "Hiding...",

    restore:
      "Restore",

    restoring:
      "Restoring...",

    archive:
      "Archive",

    archiving:
      "Archiving...",

    delete:
      "Delete permanently",

    deleting:
      "Deleting...",

    currentStatus:
      "Current status",
  },
} as const;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_ADMIN_ACTIONS_BASE_CLASSES = [
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

const CREATIVE_ADMIN_ACTIONS_VARIANT_CLASSES = {
  surface: [
    "rounded-2xl",
    "border-zinc-200/90",
    "bg-white/90",
    "shadow-[0_12px_38px_rgba(15,23,42,0.08)]",
    "backdrop-blur-xl",

    "dark:border-white/10",
    "dark:bg-zinc-950/85",
    "dark:shadow-[0_14px_42px_rgba(0,0,0,0.28)]",
  ].join(
    " ",
  ),

  minimal: [
    "rounded-xl",
    "border-transparent",
    "bg-transparent",
  ].join(
    " ",
  ),

  dark: [
    "rounded-2xl",
    "border-white/10",
    "bg-black/65",
    "text-white",
    "shadow-[0_14px_42px_rgba(0,0,0,0.35)]",
    "backdrop-blur-xl",
  ].join(
    " ",
  ),
} as const satisfies Record<
  CreativeAdminActionsVariant,
  string
>;

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_ADMIN_ACTIONS_SIZE_CLASSES = {
  sm: {
    root:
      "p-3",

    gap:
      "gap-2",

    button:
      "min-h-9 gap-2 rounded-lg px-3 py-2 text-xs",

    icon:
      "h-4 w-4",
  },

  md: {
    root:
      "p-4",

    gap:
      "gap-2.5",

    button:
      "min-h-10 gap-2.5 rounded-xl px-4 py-2.5 text-sm",

    icon:
      "h-[18px] w-[18px]",
  },
} as const satisfies Record<
  CreativeAdminActionsSize,
  {
    root:
      string;

    gap:
      string;

    button:
      string;

    icon:
      string;
  }
>;

/* =========================================================
   CLASES DE BOTONES
   ========================================================= */

const CREATIVE_ADMIN_BUTTON_BASE_CLASSES = [
  "inline-flex",
  "shrink-0",
  "items-center",
  "justify-center",
  "border",
  "font-semibold",
  "leading-none",
  "outline-none",
  "transition-all",
  "duration-200",
  "ease-out",

  "enabled:hover:-translate-y-0.5",
  "enabled:active:translate-y-0",
  "enabled:active:scale-[0.98]",

  "focus-visible:ring-2",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white",

  "disabled:pointer-events-none",
  "disabled:cursor-not-allowed",
  "disabled:opacity-45",

  "dark:focus-visible:ring-offset-zinc-950",

  "motion-reduce:transform-none",
  "motion-reduce:transition-none",
].join(
  " ",
);

const CREATIVE_ADMIN_BUTTON_VARIANT_CLASSES = {
  edit: [
    "border-zinc-200",
    "bg-zinc-100/90",
    "text-zinc-700",

    "enabled:hover:border-zinc-300",
    "enabled:hover:bg-zinc-200/80",
    "enabled:hover:text-zinc-950",

    "focus-visible:ring-zinc-500/40",

    "dark:border-white/10",
    "dark:bg-white/[0.07]",
    "dark:text-zinc-200",

    "dark:enabled:hover:bg-white/[0.12]",
    "dark:enabled:hover:text-white",
  ].join(
    " ",
  ),

  publish: [
    "border-emerald-500/25",
    "bg-emerald-500",
    "text-white",
    "shadow-[0_8px_22px_rgba(16,185,129,0.20)]",

    "enabled:hover:bg-emerald-600",
    "enabled:hover:shadow-[0_10px_26px_rgba(16,185,129,0.28)]",

    "focus-visible:ring-emerald-500/55",

    "dark:border-emerald-300/20",
  ].join(
    " ",
  ),

  hide: [
    "border-amber-500/25",
    "bg-amber-500/10",
    "text-amber-700",

    "enabled:hover:border-amber-500/40",
    "enabled:hover:bg-amber-500/20",

    "focus-visible:ring-amber-500/50",

    "dark:border-amber-400/25",
    "dark:bg-amber-400/10",
    "dark:text-amber-300",
  ].join(
    " ",
  ),

  restore: [
    "border-cyan-500/25",
    "bg-cyan-500/10",
    "text-cyan-700",

    "enabled:hover:border-cyan-500/40",
    "enabled:hover:bg-cyan-500/20",

    "focus-visible:ring-cyan-500/50",

    "dark:border-cyan-400/25",
    "dark:bg-cyan-400/10",
    "dark:text-cyan-300",
  ].join(
    " ",
  ),

  archive: [
    "border-violet-500/25",
    "bg-violet-500/10",
    "text-violet-700",

    "enabled:hover:border-violet-500/40",
    "enabled:hover:bg-violet-500/20",

    "focus-visible:ring-violet-500/50",

    "dark:border-violet-400/25",
    "dark:bg-violet-400/10",
    "dark:text-violet-300",
  ].join(
    " ",
  ),

  delete: [
    "border-red-500/25",
    "bg-red-500/10",
    "text-red-700",

    "enabled:hover:border-red-500/40",
    "enabled:hover:bg-red-500",
    "enabled:hover:text-white",
    "enabled:hover:shadow-[0_10px_26px_rgba(239,68,68,0.22)]",

    "focus-visible:ring-red-500/50",

    "dark:border-red-400/25",
    "dark:bg-red-400/10",
    "dark:text-red-300",

    "dark:enabled:hover:bg-red-500",
    "dark:enabled:hover:text-white",
  ].join(
    " ",
  ),
} as const;

/* =========================================================
   UTILIDADES
   ========================================================= */

function joinCreativeAdminActionsClasses(
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

function normalizeCreativeAdminActionsText(
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

function runCreativeAdminAction(
  action:
    (() => void | Promise<void>) |
    undefined,
): void {
  void action?.();
}

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeAdminEditIcon({
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <path d="M12 20h9" />

      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />

      <path d="m15 5 3 3" />
    </svg>
  );
}

function CreativeAdminPublishIcon({
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <path d="M12 21V5" />

      <path d="m5 12 7-7 7 7" />

      <path d="M5 3h14" />
    </svg>
  );
}

function CreativeAdminHideIcon({
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <path d="M3 3l18 18" />

      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a18 18 0 0 1-2.2 3.4" />

      <path d="M6.6 6.6C3.8 8.4 2 12 2 12s3.5 8 10 8a10.7 10.7 0 0 0 5.4-1.5" />
    </svg>
  );
}

function CreativeAdminRestoreIcon({
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />

      <path d="M3 4v6h6" />
    </svg>
  );
}

function CreativeAdminArchiveIcon({
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="5"
        rx="1"
      />

      <path d="M5 9v11h14V9" />

      <path d="M10 13h4" />
    </svg>
  );
}

function CreativeAdminDeleteIcon({
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
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        className
      }
    >
      <path d="M3 6h18" />

      <path d="M8 6V4h8v2" />

      <path d="m19 6-1 15H6L5 6" />

      <path d="M10 11v5" />

      <path d="M14 11v5" />
    </svg>
  );
}

/* =========================================================
   BOTÓN ADMINISTRATIVO
   ========================================================= */

interface CreativeAdminActionButtonProps {
  label:
    string;

  loadingLabel:
    string;

  loading:
    boolean;

  disabled:
    boolean;

  variant:
    keyof typeof CREATIVE_ADMIN_BUTTON_VARIANT_CLASSES;

  icon:
    ReactNode;

  size:
    CreativeAdminActionsSize;

  className?:
    string;

  onPress?:
    () => void | Promise<void>;
}

function CreativeAdminActionButton({
  label,
  loadingLabel,
  loading,
  disabled,
  variant,
  icon,
  size,
  className,
  onPress,
}: CreativeAdminActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={
        loading
          ? loadingLabel
          : label
      }
      aria-busy={
        loading ||
        undefined
      }
      title={
        label
      }
      disabled={
        disabled
      }
      onClick={
        () => {
          runCreativeAdminAction(
            onPress,
          );
        }
      }
      className={
        joinCreativeAdminActionsClasses(
          CREATIVE_ADMIN_BUTTON_BASE_CLASSES,

          CREATIVE_ADMIN_ACTIONS_SIZE_CLASSES[
            size
          ].button,

          CREATIVE_ADMIN_BUTTON_VARIANT_CLASSES[
            variant
          ],

          className,
        )
      }
    >
      {loading ? (
        <CreativeSpinner
          decorative
          size="sm"
          variant={
            variant ===
              "publish"
              ? "light"
              : "neutral"
          }
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      )}

      <span className="whitespace-nowrap">
        {loading
          ? loadingLabel
          : label}
      </span>
    </button>
  );
}

/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export function CreativeAdminActions({
  status,

  language =
    "es",

  size =
    "md",

  variant =
    "surface",

  heading =
    null,

  disabled =
    false,

  loadingAction =
    null,

  canEdit =
    true,

  canPublish =
    true,

  canHide =
    true,

  canRestore =
    true,

  canArchive =
    true,

  canDeletePermanently =
    false,

  showStatus =
    true,

  showEdit =
    true,

  showPublish =
    true,

  showHide =
    true,

  showRestore =
    true,

  showArchive =
    true,

  showDelete =
    true,

  onEdit,

  onPublish,

  onHide,

  onRestore,

  onArchive,

  onDeletePermanently,

  leadingContent =
    null,

  trailingContent =
    null,

  headerClassName,

  actionsClassName,

  buttonClassName,

  className,

  "aria-label":
    ariaLabel,

  ...containerProps
}: CreativeAdminActionsProps) {
  const copy =
    CREATIVE_ADMIN_ACTIONS_COPY[
      language
    ];

  const resolvedHeading =
    normalizeCreativeAdminActionsText(
      heading,
    ) ||
    copy.heading;

  const anyActionLoading =
    loadingAction !==
    null;

  const editLoading =
    loadingAction ===
    "EDIT";

  const publishLoading =
    loadingAction ===
    "PUBLISH";

  const hideLoading =
    loadingAction ===
    "HIDE";

  const restoreLoading =
    loadingAction ===
    "RESTORE";

  const archiveLoading =
    loadingAction ===
    "ARCHIVE";

  const deleteLoading =
    loadingAction ===
    "DELETE";

  const canShowPublish =
    showPublish &&
    status !==
      "PUBLISHED" &&
    status !==
      "ARCHIVED";

  const canShowHide =
    showHide &&
    status ===
      "PUBLISHED";

  const canShowRestore =
    showRestore &&
    (
      status ===
        "HIDDEN" ||
      status ===
        "ARCHIVED"
    );

  const canShowArchive =
    showArchive &&
    status !==
      "ARCHIVED";

  const actionDisabled =
    disabled ||
    anyActionLoading;

  const iconClassName =
    CREATIVE_ADMIN_ACTIONS_SIZE_CLASSES[
      size
    ].icon;

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
      data-creative-admin-actions=""
      data-status={
        status
      }
      data-size={
        size
      }
      data-variant={
        variant
      }
      data-loading-action={
        loadingAction ??
        undefined
      }
      className={
        joinCreativeAdminActionsClasses(
          CREATIVE_ADMIN_ACTIONS_BASE_CLASSES,

          CREATIVE_ADMIN_ACTIONS_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_ADMIN_ACTIONS_SIZE_CLASSES[
            size
          ].root,

          disabled &&
            "opacity-60",

          className,
        )
      }
    >
      <div
        className={
          joinCreativeAdminActionsClasses(
            "flex flex-wrap items-center justify-between gap-3",

            headerClassName,
          )
        }
      >
        <div className="min-w-0">
          <h3
            className={
              joinCreativeAdminActionsClasses(
                "truncate font-bold",

                variant ===
                  "dark"
                  ? "text-white"
                  : "text-zinc-950 dark:text-white",

                size ===
                  "sm"
                  ? "text-sm"
                  : "text-base",
              )
            }
          >
            {resolvedHeading}
          </h3>

          {showStatus ? (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={
                  joinCreativeAdminActionsClasses(
                    "text-xs font-medium",

                    variant ===
                      "dark"
                      ? "text-zinc-400"
                      : "text-zinc-500 dark:text-zinc-400",
                  )
                }
              >
                {copy.currentStatus}:
              </span>

              <CreativeStatusBadge
                status={
                  status
                }
                language={
                  language
                }
                size="sm"
                pulseDot={
                  false
                }
              />
            </div>
          ) : null}
        </div>

        {leadingContent}
      </div>

      <div
        className={
          joinCreativeAdminActionsClasses(
            "mt-4 flex flex-wrap items-center",

            CREATIVE_ADMIN_ACTIONS_SIZE_CLASSES[
              size
            ].gap,

            actionsClassName,
          )
        }
      >
        {showEdit ? (
          <CreativeAdminActionButton
            label={
              copy.edit
            }
            loadingLabel={
              copy.editing
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
            variant="edit"
            size={
              size
            }
            icon={
              <CreativeAdminEditIcon
                className={
                  iconClassName
                }
              />
            }
            className={
              buttonClassName
            }
            onPress={
              onEdit
            }
          />
        ) : null}

        {canShowPublish ? (
          <CreativeAdminActionButton
            label={
              copy.publish
            }
            loadingLabel={
              copy.publishing
            }
            loading={
              publishLoading
            }
            disabled={
              actionDisabled ||
              !canPublish ||
              !onPublish
            }
            variant="publish"
            size={
              size
            }
            icon={
              <CreativeAdminPublishIcon
                className={
                  iconClassName
                }
              />
            }
            className={
              buttonClassName
            }
            onPress={
              onPublish
            }
          />
        ) : null}

        {canShowHide ? (
          <CreativeAdminActionButton
            label={
              copy.hide
            }
            loadingLabel={
              copy.hiding
            }
            loading={
              hideLoading
            }
            disabled={
              actionDisabled ||
              !canHide ||
              !onHide
            }
            variant="hide"
            size={
              size
            }
            icon={
              <CreativeAdminHideIcon
                className={
                  iconClassName
                }
              />
            }
            className={
              buttonClassName
            }
            onPress={
              onHide
            }
          />
        ) : null}

        {canShowRestore ? (
          <CreativeAdminActionButton
            label={
              copy.restore
            }
            loadingLabel={
              copy.restoring
            }
            loading={
              restoreLoading
            }
            disabled={
              actionDisabled ||
              !canRestore ||
              !onRestore
            }
            variant="restore"
            size={
              size
            }
            icon={
              <CreativeAdminRestoreIcon
                className={
                  iconClassName
                }
              />
            }
            className={
              buttonClassName
            }
            onPress={
              onRestore
            }
          />
        ) : null}

        {canShowArchive ? (
          <CreativeAdminActionButton
            label={
              copy.archive
            }
            loadingLabel={
              copy.archiving
            }
            loading={
              archiveLoading
            }
            disabled={
              actionDisabled ||
              !canArchive ||
              !onArchive
            }
            variant="archive"
            size={
              size
            }
            icon={
              <CreativeAdminArchiveIcon
                className={
                  iconClassName
                }
              />
            }
            className={
              buttonClassName
            }
            onPress={
              onArchive
            }
          />
        ) : null}

        {showDelete ? (
          <CreativeAdminActionButton
            label={
              copy.delete
            }
            loadingLabel={
              copy.deleting
            }
            loading={
              deleteLoading
            }
            disabled={
              actionDisabled ||
              !canDeletePermanently ||
              !onDeletePermanently
            }
            variant="delete"
            size={
              size
            }
            icon={
              <CreativeAdminDeleteIcon
                className={
                  iconClassName
                }
              />
            }
            className={
              buttonClassName
            }
            onPress={
              onDeletePermanently
            }
          />
        ) : null}

        {trailingContent}
      </div>
    </div>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeAdminActions;