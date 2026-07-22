"use client";

/*
 * Formulario reutilizable para comentarios, respuestas
 * y ediciones del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Crear comentarios.
 * - Responder comentarios.
 * - Editar comentarios existentes.
 * - Validar longitud mínima y máxima.
 * - Mostrar contador de caracteres.
 * - Solicitar inicio de sesión cuando sea necesario.
 * - Mostrar estados de carga y errores.
 *
 * No contiene:
 * - Solicitudes HTTP.
 * - Estado global de autenticación.
 * - Acceso a Prisma.
 * - Lógica de moderación.
 */

import {
  useId,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from "react";

import {
  CreativeSpinner,
} from "@/components/atoms/creative/CreativeSpinner";

/* =========================================================
   IDIOMAS
   ========================================================= */

export type CreativeCommentFormLanguage =
  | "es"
  | "en";

/* =========================================================
   MODOS
   ========================================================= */

export type CreativeCommentFormMode =
  | "COMMENT"
  | "REPLY"
  | "EDIT";

/* =========================================================
   TAMAÑOS
   ========================================================= */

export type CreativeCommentFormSize =
  | "sm"
  | "md"
  | "lg";

/* =========================================================
   VARIANTES
   ========================================================= */

export type CreativeCommentFormVariant =
  | "surface"
  | "soft"
  | "minimal";

/* =========================================================
   PROPIEDADES
   ========================================================= */

export interface CreativeCommentFormProps
  extends Omit<
    HTMLAttributes<HTMLFormElement>,
    "children" | "onSubmit"
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
   * Cambio del contenido.
   */
  onValueChange?:
    (
      value:
        string,
    ) => void;

  /*
   * Envío del comentario.
   */
  onSubmitComment?:
    (
      content:
        string,
    ) => void | Promise<void>;

  /*
   * Se ejecuta después de completar el envío.
   */
  onSubmitted?:
    () => void;

  /*
   * Se ejecuta cuando el envío produce un error.
   */
  onSubmitError?:
    (
      error:
        unknown,
    ) => void;

  /*
   * Modo del formulario.
   */
  mode?:
    CreativeCommentFormMode;

  /*
   * Idioma.
   */
  language?:
    CreativeCommentFormLanguage;

  /*
   * Tamaño visual.
   */
  size?:
    CreativeCommentFormSize;

  /*
   * Variante visual.
   */
  variant?:
    CreativeCommentFormVariant;

  /*
   * Estado de autenticación.
   */
  authenticated?:
    boolean;

  requireAuthentication?:
    boolean;

  onRequireAuthentication?:
    () => void;

  /*
   * Estado del formulario.
   */
  submitting?:
    boolean;

  disabled?:
    boolean;

  readOnly?:
    boolean;

  /*
   * Configuración del texto.
   */
  minimumLength?:
    number;

  maximumLength?:
    number;

  rows?:
    number;

  autoFocus?:
    boolean;

  clearOnSubmit?:
    boolean;

  submitWithShortcut?:
    boolean;

  /*
   * Textos personalizados.
   */
  label?:
    string | null;

  placeholder?:
    string | null;

  submitLabel?:
    string | null;

  cancelLabel?:
    string | null;

  clearLabel?:
    string | null;

  helperText?:
    string | null;

  error?:
    string | null;

  replyingTo?:
    string | null;

  /*
   * Visibilidad.
   */
  showLabel?:
    boolean;

  showCharacterCount?:
    boolean;

  showCancelButton?:
    boolean;

  showClearButton?:
    boolean;

  /*
   * Acciones adicionales.
   */
  onCancel?:
    () => void;

  onClear?:
    () => void;

  /*
   * Contenido adicional.
   */
  avatar?:
    ReactNode;

  headerContent?:
    ReactNode;

  footerContent?:
    ReactNode;

  leadingActions?:
    ReactNode;

  trailingActions?:
    ReactNode;

  /*
   * Identificación del textarea.
   */
  textareaId?:
    string;

  textareaName?:
    string;

  /*
   * Evento adicional del textarea.
   */
  onTextareaKeyDown?:
    (
      event:
        KeyboardEvent<HTMLTextAreaElement>,
    ) => void;

  /*
   * Clases adicionales.
   */
  headerClassName?:
    string;

  bodyClassName?:
    string;

  textareaClassName?:
    string;

  footerClassName?:
    string;

  actionsClassName?:
    string;

  submitButtonClassName?:
    string;

  cancelButtonClassName?:
    string;

  clearButtonClassName?:
    string;
}

/* =========================================================
   COPIAS
   ========================================================= */

const CREATIVE_COMMENT_FORM_COPY = {
  es: {
    commentLabel:
      "Escribe un comentario",

    replyLabel:
      "Escribe una respuesta",

    editLabel:
      "Editar comentario",

    commentPlaceholder:
      "Comparte tu opinión sobre este diseño...",

    replyPlaceholder:
      "Escribe tu respuesta...",

    editPlaceholder:
      "Modifica tu comentario...",

    commentSubmit:
      "Publicar comentario",

    replySubmit:
      "Publicar respuesta",

    editSubmit:
      "Guardar cambios",

    submitting:
      "Publicando...",

    saving:
      "Guardando...",

    cancel:
      "Cancelar",

    clear:
      "Limpiar",

    characters:
      "caracteres",

    minimum:
      "Escribe al menos",

    maximum:
      "El comentario no puede superar",

    loginRequired:
      "Inicia sesión para participar en los comentarios.",

    login:
      "Iniciar sesión",

    replyingTo:
      "Respondiendo a",

    shortcut:
      "Presiona Ctrl + Enter para publicar.",
  },

  en: {
    commentLabel:
      "Write a comment",

    replyLabel:
      "Write a reply",

    editLabel:
      "Edit comment",

    commentPlaceholder:
      "Share your thoughts about this design...",

    replyPlaceholder:
      "Write your reply...",

    editPlaceholder:
      "Update your comment...",

    commentSubmit:
      "Post comment",

    replySubmit:
      "Post reply",

    editSubmit:
      "Save changes",

    submitting:
      "Posting...",

    saving:
      "Saving...",

    cancel:
      "Cancel",

    clear:
      "Clear",

    characters:
      "characters",

    minimum:
      "Write at least",

    maximum:
      "The comment cannot exceed",

    loginRequired:
      "Sign in to participate in the comments.",

    login:
      "Sign in",

    replyingTo:
      "Replying to",

    shortcut:
      "Press Ctrl + Enter to post.",
  },
} as const;

/* =========================================================
   CLASES BASE
   ========================================================= */

const CREATIVE_COMMENT_FORM_BASE_CLASSES = [
  "w-full",
  "border",
  "transition-colors",
  "duration-200",
].join(
  " ",
);

/* =========================================================
   VARIANTES
   ========================================================= */

const CREATIVE_COMMENT_FORM_VARIANT_CLASSES = {
  surface: [
    "border-zinc-200/90",
    "bg-white/90",
    "shadow-[0_14px_40px_rgba(15,23,42,0.08)]",
    "backdrop-blur-xl",

    "dark:border-white/10",
    "dark:bg-zinc-950/85",
    "dark:shadow-[0_16px_44px_rgba(0,0,0,0.28)]",
  ].join(
    " ",
  ),

  soft: [
    "border-emerald-500/15",
    "bg-emerald-500/[0.05]",

    "dark:border-emerald-400/15",
    "dark:bg-emerald-400/[0.05]",
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
  CreativeCommentFormVariant,
  string
>;

/* =========================================================
   TAMAÑOS
   ========================================================= */

const CREATIVE_COMMENT_FORM_SIZE_CLASSES = {
  sm: {
    form:
      "rounded-2xl",

    body:
      "gap-2.5 p-3",

    textarea:
      "min-h-20 rounded-xl px-3 py-2.5 text-xs",

    button:
      "min-h-8 rounded-lg px-3 py-2 text-xs",
  },

  md: {
    form:
      "rounded-2xl",

    body:
      "gap-3 p-4",

    textarea:
      "min-h-28 rounded-xl px-4 py-3 text-sm",

    button:
      "min-h-10 rounded-xl px-4 py-2.5 text-sm",
  },

  lg: {
    form:
      "rounded-3xl",

    body:
      "gap-4 p-5",

    textarea:
      "min-h-32 rounded-2xl px-5 py-4 text-base",

    button:
      "min-h-11 rounded-xl px-5 py-3 text-sm",
  },
} as const satisfies Record<
  CreativeCommentFormSize,
  {
    form:
      string;

    body:
      string;

    textarea:
      string;

    button:
      string;
  }
>;

/* =========================================================
   UNIR CLASES
   ========================================================= */

function joinCreativeCommentFormClasses(
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

function normalizeCreativeCommentFormText(
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
   NORMALIZAR COMENTARIO
   ========================================================= */

export function normalizeCreativeCommentContent(
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

/* =========================================================
   NORMALIZAR NÚMEROS
   ========================================================= */

function normalizeCreativeCommentMaximumLength(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 2_000;
  }

  return Math.max(
    1,
    Math.trunc(
      value,
    ),
  );
}

function normalizeCreativeCommentMinimumLength(
  value:
    number,
  maximumLength:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 2;
  }

  return Math.min(
    maximumLength,
    Math.max(
      1,
      Math.trunc(
        value,
      ),
    ),
  );
}

function normalizeCreativeCommentRows(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    )
  ) {
    return 4;
  }

  return Math.min(
    12,
    Math.max(
      2,
      Math.trunc(
        value,
      ),
    ),
  );
}

/* =========================================================
   ICONOS
   ========================================================= */

function CreativeCommentSendIcon() {
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
      <path d="m22 2-7 20-4-9-9-4Z" />

      <path d="M22 2 11 13" />
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

function CreativeCommentClearIcon() {
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

export function CreativeCommentForm({
  value,

  defaultValue =
    "",

  onValueChange,

  onSubmitComment,

  onSubmitted,

  onSubmitError,

  mode =
    "COMMENT",

  language =
    "es",

  size =
    "md",

  variant =
    "surface",

  authenticated =
    false,

  requireAuthentication =
    true,

  onRequireAuthentication,

  submitting =
    false,

  disabled =
    false,

  readOnly =
    false,

  minimumLength =
    2,

  maximumLength =
    2_000,

  rows =
    4,

  autoFocus =
    false,

  clearOnSubmit =
    true,

  submitWithShortcut =
    true,

  label =
    null,

  placeholder =
    null,

  submitLabel =
    null,

  cancelLabel =
    null,

  clearLabel =
    null,

  helperText =
    null,

  error =
    null,

  replyingTo =
    null,

  showLabel =
    true,

  showCharacterCount =
    true,

  showCancelButton =
    false,

  showClearButton =
    true,

  onCancel,

  onClear,

  avatar =
    null,

  headerContent =
    null,

  footerContent =
    null,

  leadingActions =
    null,

  trailingActions =
    null,

  textareaId,

  textareaName =
    "comment",

  onTextareaKeyDown,

  headerClassName,

  bodyClassName,

  textareaClassName,

  footerClassName,

  actionsClassName,

  submitButtonClassName,

  cancelButtonClassName,

  clearButtonClassName,

  className,

  "aria-label":
    ariaLabel,

  ...formProps
}: CreativeCommentFormProps) {
  const generatedId =
    useId();

  const copy =
    CREATIVE_COMMENT_FORM_COPY[
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

  const normalizedContent =
    normalizeCreativeCommentContent(
      currentValue,
    );

  const normalizedMaximumLength =
    normalizeCreativeCommentMaximumLength(
      maximumLength,
    );

  const normalizedMinimumLength =
    normalizeCreativeCommentMinimumLength(
      minimumLength,
      normalizedMaximumLength,
    );

  const normalizedRows =
    normalizeCreativeCommentRows(
      rows,
    );

  const resolvedTextareaId =
    textareaId ??
    `creative-comment-${generatedId}`;

  let automaticLabel:
    string =
      copy.commentLabel;

  let automaticPlaceholder:
    string =
      copy.commentPlaceholder;

  let automaticSubmitLabel:
    string =
      copy.commentSubmit;

  if (
    mode ===
    "REPLY"
  ) {
    automaticLabel =
      copy.replyLabel;

    automaticPlaceholder =
      copy.replyPlaceholder;

    automaticSubmitLabel =
      copy.replySubmit;
  }

  if (
    mode ===
    "EDIT"
  ) {
    automaticLabel =
      copy.editLabel;

    automaticPlaceholder =
      copy.editPlaceholder;

    automaticSubmitLabel =
      copy.editSubmit;
  }

  const resolvedLabel =
    normalizeCreativeCommentFormText(
      label,
    ) ||
    automaticLabel;

  const resolvedPlaceholder =
    normalizeCreativeCommentFormText(
      placeholder,
    ) ||
    automaticPlaceholder;

  const resolvedSubmitLabel =
    normalizeCreativeCommentFormText(
      submitLabel,
    ) ||
    automaticSubmitLabel;

  const resolvedCancelLabel =
    normalizeCreativeCommentFormText(
      cancelLabel,
    ) ||
    copy.cancel;

  const resolvedClearLabel =
    normalizeCreativeCommentFormText(
      clearLabel,
    ) ||
    copy.clear;

  const normalizedHelperText =
    normalizeCreativeCommentFormText(
      helperText,
    );

  const normalizedError =
    normalizeCreativeCommentFormText(
      error,
    );

  const normalizedReplyingTo =
    normalizeCreativeCommentFormText(
      replyingTo,
    );

  const currentLength =
    currentValue.length;

  const belowMinimum =
    normalizedContent.length <
    normalizedMinimumLength;

  const aboveMaximum =
    currentLength >
    normalizedMaximumLength;

  const authenticationRequired =
    requireAuthentication &&
    !authenticated;

  const interactionDisabled =
    disabled ||
    submitting;

  const submitDisabled =
    interactionDisabled ||
    readOnly ||
    aboveMaximum ||
    (
      !authenticationRequired &&
      (
        belowMinimum ||
        !onSubmitComment
      )
    );

  const helperId =
    `${resolvedTextareaId}-helper`;

  const errorId =
    `${resolvedTextareaId}-error`;

  const countId =
    `${resolvedTextareaId}-count`;

  const describedBy =
    [
      normalizedHelperText
        ? helperId
        : "",

      normalizedError
        ? errorId
        : "",

      showCharacterCount
        ? countId
        : "",
    ]
      .filter(
        Boolean,
      )
      .join(
        " ",
      ) ||
    undefined;

  const updateValue =
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

  const clearValue =
    (): void => {
      if (
        interactionDisabled ||
        readOnly
      ) {
        return;
      }

      updateValue(
        "",
      );

      onClear?.();
    };

  const submitCurrentComment =
    async (): Promise<void> => {
      if (
        interactionDisabled ||
        readOnly
      ) {
        return;
      }

      if (
        authenticationRequired
      ) {
        onRequireAuthentication?.();

        return;
      }

      if (
        belowMinimum ||
        aboveMaximum ||
        !onSubmitComment
      ) {
        return;
      }

      try {
        await onSubmitComment(
          normalizedContent,
        );

        if (
          clearOnSubmit
        ) {
          updateValue(
            "",
          );
        }

        onSubmitted?.();
      } catch (
        submitError
      ) {
        onSubmitError?.(
          submitError,
        );
      }
    };

  const handleSubmit =
    (
      event:
        FormEvent<HTMLFormElement>,
    ): void => {
      event.preventDefault();

      void submitCurrentComment();
    };

  const handleTextareaChange =
    (
      event:
        ChangeEvent<HTMLTextAreaElement>,
    ): void => {
      updateValue(
        event.target.value,
      );
    };

  const handleTextareaKeyDown =
    (
      event:
        KeyboardEvent<HTMLTextAreaElement>,
    ): void => {
      onTextareaKeyDown?.(
        event,
      );

      if (
        event.defaultPrevented ||
        !submitWithShortcut
      ) {
        return;
      }

      if (
        (
          event.ctrlKey ||
          event.metaKey
        ) &&
        event.key ===
          "Enter"
      ) {
        event.preventDefault();

        void submitCurrentComment();
      }
    };

  const submittingLabel =
    mode ===
      "EDIT"
      ? copy.saving
      : copy.submitting;

  return (
    <form
      {...formProps}
      noValidate
      aria-label={
        ariaLabel ??
        resolvedLabel
      }
      aria-busy={
        submitting ||
        undefined
      }
      data-creative-comment-form=""
      data-mode={
        mode
      }
      data-size={
        size
      }
      data-variant={
        variant
      }
      data-authenticated={
        authenticated
          ? "true"
          : "false"
      }
      onSubmit={
        handleSubmit
      }
      className={
        joinCreativeCommentFormClasses(
          CREATIVE_COMMENT_FORM_BASE_CLASSES,

          CREATIVE_COMMENT_FORM_VARIANT_CLASSES[
            variant
          ],

          CREATIVE_COMMENT_FORM_SIZE_CLASSES[
            size
          ].form,

          interactionDisabled &&
            "opacity-70",

          className,
        )
      }
    >
      {headerContent ||
      normalizedReplyingTo ? (
        <div
          className={
            joinCreativeCommentFormClasses(
              "flex flex-wrap items-center justify-between gap-3",
              "border-b border-zinc-200/80 px-4 py-3",

              "dark:border-white/10",

              headerClassName,
            )
          }
        >
          <div className="min-w-0">
            {normalizedReplyingTo ? (
              <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {copy.replyingTo}{" "}
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {normalizedReplyingTo}
                </span>
              </p>
            ) : null}
          </div>

          {headerContent}
        </div>
      ) : null}

      <div
        className={
          joinCreativeCommentFormClasses(
            "flex items-start",

            CREATIVE_COMMENT_FORM_SIZE_CLASSES[
              size
            ].body,

            bodyClassName,
          )
        }
      >
        {avatar ? (
          <div className="shrink-0">
            {avatar}
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-2">
          {showLabel ? (
            <label
              htmlFor={
                resolvedTextareaId
              }
              className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200"
            >
              {resolvedLabel}
            </label>
          ) : null}

          {authenticationRequired ? (
            <div
              className={[
                "flex min-h-24 flex-col items-center justify-center gap-3",
                "rounded-xl border border-dashed",
                "border-emerald-500/25",
                "bg-emerald-500/[0.05]",
                "px-5 py-5 text-center",

                "dark:border-emerald-400/25",
                "dark:bg-emerald-400/[0.05]",
              ].join(
                " ",
              )}
            >
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {copy.loginRequired}
              </p>

              <button
                type="button"
                disabled={
                  interactionDisabled ||
                  !onRequireAuthentication
                }
                onClick={
                  onRequireAuthentication
                }
                className={[
                  "inline-flex min-h-9 items-center justify-center",
                  "rounded-xl border border-emerald-500/25",
                  "bg-emerald-500 px-4 py-2",
                  "text-sm font-bold text-white",
                  "outline-none transition-all duration-200",

                  "enabled:hover:bg-emerald-600",
                  "enabled:hover:shadow-[0_8px_24px_rgba(16,185,129,0.22)]",

                  "focus-visible:ring-2",
                  "focus-visible:ring-emerald-500/60",
                  "focus-visible:ring-offset-2",

                  "disabled:cursor-not-allowed",
                  "disabled:opacity-50",

                  "dark:focus-visible:ring-emerald-400/60",
                  "dark:focus-visible:ring-offset-zinc-950",
                ].join(
                  " ",
                )}
              >
                {copy.login}
              </button>
            </div>
          ) : (
            <textarea
              id={
                resolvedTextareaId
              }
              name={
                textareaName
              }
              value={
                currentValue
              }
              rows={
                normalizedRows
              }
              maxLength={
                normalizedMaximumLength
              }
              disabled={
                interactionDisabled
              }
              readOnly={
                readOnly
              }
              autoFocus={
                autoFocus
              }
              required
              placeholder={
                resolvedPlaceholder
              }
              aria-label={
                showLabel
                  ? undefined
                  : resolvedLabel
              }
              aria-describedby={
                describedBy
              }
              aria-invalid={
                Boolean(
                  normalizedError ||
                  aboveMaximum,
                ) ||
                undefined
              }
              onChange={
                handleTextareaChange
              }
              onKeyDown={
                handleTextareaKeyDown
              }
              className={
                joinCreativeCommentFormClasses(
                  "block w-full resize-y",
                  "border border-zinc-200/90",
                  "bg-white/90",
                  "text-zinc-950",
                  "placeholder:text-zinc-400",
                  "outline-none",
                  "transition-all duration-200",

                  "focus:border-emerald-500/45",
                  "focus:ring-2",
                  "focus:ring-emerald-500/15",

                  "disabled:cursor-not-allowed",
                  "disabled:opacity-60",

                  "read-only:cursor-default",

                  "dark:border-white/10",
                  "dark:bg-zinc-900/80",
                  "dark:text-white",
                  "dark:placeholder:text-zinc-500",

                  "dark:focus:border-emerald-400/40",
                  "dark:focus:ring-emerald-400/15",

                  normalizedError &&
                    "border-red-500/50 focus:border-red-500 focus:ring-red-500/15",

                  CREATIVE_COMMENT_FORM_SIZE_CLASSES[
                    size
                  ].textarea,

                  textareaClassName,
                )
              }
            />
          )}

          {normalizedHelperText ? (
            <p
              id={
                helperId
              }
              className="text-xs leading-5 text-zinc-500 dark:text-zinc-400"
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
              className="text-xs font-medium leading-5 text-red-600 dark:text-red-300"
            >
              {normalizedError}
            </p>
          ) : null}

          {!authenticationRequired &&
          belowMinimum &&
          normalizedContent.length >
            0 ? (
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {copy.minimum}{" "}
              {normalizedMinimumLength}{" "}
              {copy.characters}.
            </p>
          ) : null}

          {aboveMaximum ? (
            <p
              role="alert"
              className="text-xs font-medium text-red-600 dark:text-red-300"
            >
              {copy.maximum}{" "}
              {normalizedMaximumLength}{" "}
              {copy.characters}.
            </p>
          ) : null}

          {submitWithShortcut &&
          !authenticationRequired ? (
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {copy.shortcut}
            </p>
          ) : null}
        </div>
      </div>

      <div
        className={
          joinCreativeCommentFormClasses(
            "flex flex-wrap items-center justify-between gap-3",
            "border-t border-zinc-200/80 px-4 py-3",

            "dark:border-white/10",

            footerClassName,
          )
        }
      >
        <div className="flex min-w-0 items-center gap-3">
          {showCharacterCount &&
          !authenticationRequired ? (
            <span
              id={
                countId
              }
              className={
                joinCreativeCommentFormClasses(
                  "text-xs font-medium tabular-nums",

                  aboveMaximum
                    ? "text-red-600 dark:text-red-300"
                    : "text-zinc-500 dark:text-zinc-400",
                )
              }
            >
              {currentLength}/
              {normalizedMaximumLength}
            </span>
          ) : null}

          {leadingActions}

          {footerContent}
        </div>

        <div
          className={
            joinCreativeCommentFormClasses(
              "flex flex-wrap items-center justify-end gap-2",

              actionsClassName,
            )
          }
        >
          {showClearButton &&
          currentValue.length >
            0 &&
          !authenticationRequired ? (
            <button
              type="button"
              disabled={
                interactionDisabled ||
                readOnly
              }
              onClick={
                clearValue
              }
              className={
                joinCreativeCommentFormClasses(
                  "inline-flex items-center justify-center gap-2",
                  "border border-zinc-200",
                  "bg-zinc-100/80",
                  "font-semibold text-zinc-600",
                  "outline-none transition-all duration-200",

                  "enabled:hover:border-red-500/25",
                  "enabled:hover:bg-red-500/10",
                  "enabled:hover:text-red-700",

                  "focus-visible:ring-2",
                  "focus-visible:ring-red-500/50",

                  "disabled:cursor-not-allowed",
                  "disabled:opacity-45",

                  "dark:border-white/10",
                  "dark:bg-white/[0.06]",
                  "dark:text-zinc-300",

                  "dark:enabled:hover:text-red-300",

                  CREATIVE_COMMENT_FORM_SIZE_CLASSES[
                    size
                  ].button,

                  clearButtonClassName,
                )
              }
            >
              <CreativeCommentClearIcon />

              <span>
                {resolvedClearLabel}
              </span>
            </button>
          ) : null}

          {showCancelButton ? (
            <button
              type="button"
              disabled={
                interactionDisabled ||
                !onCancel
              }
              onClick={
                onCancel
              }
              className={
                joinCreativeCommentFormClasses(
                  "inline-flex items-center justify-center",
                  "border border-zinc-200",
                  "bg-transparent",
                  "font-semibold text-zinc-700",
                  "outline-none transition-all duration-200",

                  "enabled:hover:bg-zinc-100",

                  "focus-visible:ring-2",
                  "focus-visible:ring-zinc-400/40",

                  "disabled:cursor-not-allowed",
                  "disabled:opacity-45",

                  "dark:border-white/10",
                  "dark:text-zinc-300",
                  "dark:enabled:hover:bg-white/[0.08]",

                  CREATIVE_COMMENT_FORM_SIZE_CLASSES[
                    size
                  ].button,

                  cancelButtonClassName,
                )
              }
            >
              {resolvedCancelLabel}
            </button>
          ) : null}

          {trailingActions}

          {!authenticationRequired ? (
            <button
              type="submit"
              disabled={
                submitDisabled
              }
              aria-busy={
                submitting ||
                undefined
              }
              className={
                joinCreativeCommentFormClasses(
                  "inline-flex items-center justify-center gap-2",
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

                  CREATIVE_COMMENT_FORM_SIZE_CLASSES[
                    size
                  ].button,

                  submitButtonClassName,
                )
              }
            >
              {submitting ? (
                <CreativeSpinner
                  decorative
                  size="sm"
                  variant="light"
                />
              ) : mode ===
                "EDIT" ? (
                <CreativeCommentEditIcon />
              ) : (
                <CreativeCommentSendIcon />
              )}

              <span>
                {submitting
                  ? submittingLabel
                  : resolvedSubmitLabel}
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}

/* =========================================================
   EXPORTACIÓN PREDETERMINADA
   ========================================================= */

export default CreativeCommentForm;