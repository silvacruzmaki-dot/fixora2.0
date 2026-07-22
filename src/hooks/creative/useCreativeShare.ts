"use client";

/*
 * Hook para compartir publicaciones del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Crear enlaces públicos del diseño.
 * - Copiar el enlace al portapapeles.
 * - Utilizar la Web Share API cuando esté disponible.
 * - Compartir mediante servicios externos.
 * - Mantener estados de procesamiento, éxito y error.
 * - Aplicar alternativas en navegadores sin Clipboard API.
 * - Evitar que operaciones antiguas modifiquen el estado actual.
 *
 * No contiene:
 * - Componentes visuales.
 * - Acceso directo a Prisma.
 * - Comentarios.
 * - Compras.
 * - Descargas.
 * - Administración.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createCreativeAbsoluteShareUrl,
  createCreativeShareRoute,
} from "@/constants/creative/creative.routes";

import type {
  CreativeApiLanguage,
  CreativeShareChannel,
} from "@/types/creative/creative-api.types";

import type {
  CreativeItemSlug,
} from "@/types/creative/creative-item.types";

/* =========================================================
   DESTINOS EXTERNOS
   ========================================================= */

export type CreativeExternalShareDestination =
  | "WHATSAPP"
  | "FACEBOOK"
  | "X"
  | "TELEGRAM"
  | "LINKEDIN"
  | "PINTEREST"
  | "EMAIL";

/* =========================================================
   ACCIONES DEL HOOK
   ========================================================= */

export type CreativeShareAction =
  | "COPY_LINK"
  | "NATIVE_SHARE"
  | CreativeExternalShareDestination;

/* =========================================================
   ESTADO DE LA OPERACIÓN
   ========================================================= */

export type CreativeShareOperationStatus =
  | "IDLE"
  | "PROCESSING"
  | "SUCCESS"
  | "CANCELLED"
  | "ERROR";

/* =========================================================
   CAPACIDADES DEL NAVEGADOR
   ========================================================= */

export interface CreativeShareBrowserCapabilities {
  nativeShare:
    boolean;

  clipboard:
    boolean;
}

/* =========================================================
   EVENTO DE ÉXITO
   ========================================================= */

export interface CreativeShareSuccessEvent {
  action:
    CreativeShareAction;

  destination:
    CreativeExternalShareDestination | null;

  channel:
    CreativeShareChannel;

  url:
    string;

  sharedAt:
    number;

  usedFallback:
    boolean;
}

/* =========================================================
   EVENTO DE ERROR
   ========================================================= */

export interface CreativeShareErrorEvent {
  action:
    CreativeShareAction;

  destination:
    CreativeExternalShareDestination | null;

  channel:
    CreativeShareChannel;

  url:
    string | null;

  message:
    string;

  error:
    unknown;
}

/* =========================================================
   OPCIONES DEL HOOK
   ========================================================= */

export interface UseCreativeShareOptions {
  /*
   * Slug público del diseño.
   */
  slug:
    CreativeItemSlug | null | undefined;

  /*
   * Título mostrado al compartir.
   */
  title?:
    string | null;

  /*
   * Descripción breve que acompañará al enlace.
   */
  text?:
    string | null;

  /*
   * Imagen principal utilizada principalmente por Pinterest.
   */
  imageUrl?:
    string | null;

  /*
   * Dominio utilizado para crear el enlace absoluto.
   *
   * Ejemplo:
   * https://fixora.com
   *
   * Cuando no se proporciona, se utiliza window.location.origin.
   */
  origin?:
    string | null;

  /*
   * Canal almacenado dentro del enlace compartido.
   */
  channel?:
    CreativeShareChannel;

  /*
   * Idioma para mensajes de error.
   */
  language?:
    CreativeApiLanguage;

  /*
   * Permite desactivar temporalmente el hook.
   */
  enabled?:
    boolean;

  /*
   * Duración del estado visual "Enlace copiado".
   */
  copiedStateDurationMs?:
    number;

  /*
   * Indica si los servicios externos deben abrirse
   * en una nueva ventana.
   */
  openExternalInNewWindow?:
    boolean;

  /*
   * Callback ejecutado al completar una acción.
   */
  onShareSuccess?:
    (
      event:
        CreativeShareSuccessEvent,
    ) => void | Promise<void>;

  /*
   * Callback ejecutado cuando una operación falla.
   */
  onShareError?:
    (
      event:
        CreativeShareErrorEvent,
    ) => void;
}

/* =========================================================
   RESULTADO DEL HOOK
   ========================================================= */

export interface UseCreativeShareResult {
  slug:
    string;

  relativeShareUrl:
    string;

  displayShareUrl:
    string;

  status:
    CreativeShareOperationStatus;

  activeAction:
    CreativeShareAction | null;

  activeDestination:
    CreativeExternalShareDestination | null;

  processing:
    boolean;

  copied:
    boolean;

  succeeded:
    boolean;

  cancelled:
    boolean;

  hasError:
    boolean;

  errorMessage:
    string | null;

  lastSharedAt:
    number | null;

  capabilities:
    CreativeShareBrowserCapabilities;

  nativeShareAvailable:
    boolean;

  clipboardAvailable:
    boolean;

  ready:
    boolean;

  getAbsoluteShareUrl:
    () => string;

  copyLink:
    () => Promise<boolean>;

  shareNative:
    () => Promise<boolean>;

  shareTo:
    (
      destination:
        CreativeExternalShareDestination,
    ) => Promise<boolean>;

  shareToWhatsApp:
    () => Promise<boolean>;

  shareToFacebook:
    () => Promise<boolean>;

  shareToX:
    () => Promise<boolean>;

  shareToTelegram:
    () => Promise<boolean>;

  shareToLinkedIn:
    () => Promise<boolean>;

  shareToPinterest:
    () => Promise<boolean>;

  shareByEmail:
    () => Promise<boolean>;

  clearError:
    () => void;

  resetShareState:
    () => void;

  cancelCurrentShare:
    () => void;
}

/* =========================================================
   CAPACIDADES VACÍAS
   ========================================================= */

const EMPTY_CREATIVE_SHARE_CAPABILITIES:
  CreativeShareBrowserCapabilities = {
    nativeShare:
      false,

    clipboard:
      false,
  };

/* =========================================================
   NORMALIZAR SLUG
   ========================================================= */

function normalizeCreativeShareSlug(
  slug:
    CreativeItemSlug | null | undefined,
): string {
  if (
    typeof slug !==
    "string"
  ) {
    return "";
  }

  return slug.trim();
}

/* =========================================================
   NORMALIZAR TEXTO
   ========================================================= */

function normalizeCreativeShareText(
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
   NORMALIZAR ORIGEN
   ========================================================= */

function normalizeCreativeShareOrigin(
  origin:
    string | null | undefined,
): string {
  if (
    typeof origin !==
    "string"
  ) {
    return "";
  }

  const normalizedOrigin =
    origin.trim();

  if (
    !normalizedOrigin
  ) {
    return "";
  }

  try {
    const parsedOrigin =
      new URL(
        normalizedOrigin,
      );

    if (
      parsedOrigin.protocol !==
        "http:" &&
      parsedOrigin.protocol !==
        "https:"
    ) {
      return "";
    }

    return parsedOrigin.origin;
  } catch {
    return "";
  }
}

/* =========================================================
   NORMALIZAR DURACIÓN
   ========================================================= */

function normalizeCreativeCopiedDuration(
  duration:
    number | null | undefined,
): number {
  if (
    typeof duration !==
      "number" ||
    !Number.isFinite(
      duration,
    )
  ) {
    return 2_500;
  }

  return Math.min(
    10_000,
    Math.max(
      500,
      Math.trunc(
        duration,
      ),
    ),
  );
}

/* =========================================================
   RESOLVER TÍTULO
   ========================================================= */

function resolveCreativeShareTitle(
  title:
    string | null | undefined,
  language:
    CreativeApiLanguage,
): string {
  const normalizedTitle =
    normalizeCreativeShareText(
      title,
    );

  if (
    normalizedTitle
  ) {
    return normalizedTitle;
  }

  return language ===
    "en"
    ? "FIXORA Creative design"
    : "Diseño creativo de FIXORA";
}

/* =========================================================
   RESOLVER DESCRIPCIÓN
   ========================================================= */

function resolveCreativeShareDescription(
  text:
    string | null | undefined,
  language:
    CreativeApiLanguage,
): string {
  const normalizedText =
    normalizeCreativeShareText(
      text,
    );

  if (
    normalizedText
  ) {
    return normalizedText;
  }

  return language ===
    "en"
    ? "Discover this creative work on FIXORA."
    : "Descubre este trabajo creativo en FIXORA.";
}

/* =========================================================
   COMPROBAR CANCELACIÓN NATIVA
   ========================================================= */

function isCreativeShareCancellation(
  error:
    unknown,
): boolean {
  return (
    error instanceof DOMException &&
    (
      error.name ===
        "AbortError" ||
      error.name ===
        "NotAllowedError"
    )
  );
}

/* =========================================================
   MENSAJE DE ERROR PREDETERMINADO
   ========================================================= */

function getCreativeShareFallbackError(
  action:
    CreativeShareAction,
  language:
    CreativeApiLanguage,
): string {
  if (
    language ===
    "en"
  ) {
    switch (
      action
    ) {
      case "COPY_LINK":
        return "The link could not be copied.";

      case "NATIVE_SHARE":
        return "The design could not be shared.";

      case "EMAIL":
        return "The email application could not be opened.";

      default:
        return "The selected sharing service could not be opened.";
    }
  }

  switch (
    action
  ) {
    case "COPY_LINK":
      return "No fue posible copiar el enlace.";

    case "NATIVE_SHARE":
      return "No fue posible compartir el diseño.";

    case "EMAIL":
      return "No fue posible abrir la aplicación de correo.";

    default:
      return "No fue posible abrir el servicio seleccionado.";
  }
}

/* =========================================================
   MENSAJE DE SLUG INVÁLIDO
   ========================================================= */

function getCreativeInvalidShareItemMessage(
  language:
    CreativeApiLanguage,
): string {
  return language ===
    "en"
    ? "The design does not have a valid public link."
    : "El diseño no tiene un enlace público válido.";
}

/* =========================================================
   MENSAJE DE VENTANA BLOQUEADA
   ========================================================= */

function getCreativeBlockedWindowMessage(
  language:
    CreativeApiLanguage,
): string {
  return language ===
    "en"
    ? "The browser blocked the sharing window. Allow pop-ups and try again."
    : "El navegador bloqueó la ventana para compartir. Permite las ventanas emergentes e inténtalo nuevamente.";
}

/* =========================================================
   CREAR URL ABSOLUTA
   ========================================================= */

function resolveCreativeAbsoluteUrl(
  slug:
    string,
  channel:
    CreativeShareChannel,
  configuredOrigin:
    string,
): string {
  if (
    !slug
  ) {
    return "";
  }

  if (
    configuredOrigin
  ) {
    return createCreativeAbsoluteShareUrl(
      configuredOrigin,
      slug,
      channel,
    );
  }

  if (
    typeof window !==
      "undefined" &&
    window.location.origin
  ) {
    return createCreativeAbsoluteShareUrl(
      window.location.origin,
      slug,
      channel,
    );
  }

  return createCreativeShareRoute(
    slug,
    channel,
  );
}

/* =========================================================
   RESOLVER URL DE IMAGEN
   ========================================================= */

function resolveCreativeAbsoluteImageUrl(
  imageUrl:
    string | null | undefined,
  shareUrl:
    string,
): string {
  const normalizedImageUrl =
    normalizeCreativeShareText(
      imageUrl,
    );

  if (
    !normalizedImageUrl
  ) {
    return "";
  }

  try {
    const baseUrl =
      new URL(
        shareUrl,
      );

    return new URL(
      normalizedImageUrl,
      baseUrl.origin,
    ).toString();
  } catch {
    return normalizedImageUrl;
  }
}

/* =========================================================
   COPIAR MEDIANTE CLIPBOARD API
   ========================================================= */

async function copyCreativeTextWithClipboard(
  text:
    string,
): Promise<boolean> {
  if (
    typeof navigator ===
      "undefined" ||
    !navigator.clipboard ||
    typeof navigator.clipboard.writeText !==
      "function"
  ) {
    return false;
  }

  await navigator.clipboard.writeText(
    text,
  );

  return true;
}

/* =========================================================
   COPIA ALTERNATIVA
   ========================================================= */

function copyCreativeTextWithFallback(
  text:
    string,
): boolean {
  if (
    typeof document ===
    "undefined"
  ) {
    return false;
  }

  const textArea =
    document.createElement(
      "textarea",
    );

  textArea.value =
    text;

  textArea.setAttribute(
    "readonly",
    "",
  );

  textArea.style.position =
    "fixed";

  textArea.style.left =
    "-9999px";

  textArea.style.top =
    "0";

  textArea.style.opacity =
    "0";

  textArea.style.pointerEvents =
    "none";

  document.body.appendChild(
    textArea,
  );

  textArea.focus();

  textArea.select();

  textArea.setSelectionRange(
    0,
    textArea.value.length,
  );

  let copied =
    false;

  try {
    copied =
      document.execCommand(
        "copy",
      );
  } catch {
    copied =
      false;
  } finally {
    document.body.removeChild(
      textArea,
    );
  }

  return copied;
}

/* =========================================================
   COPIAR TEXTO
   ========================================================= */

async function copyCreativeText(
  text:
    string,
): Promise<{
  copied:
    boolean;

  usedFallback:
    boolean;
}> {
  try {
    const copiedWithClipboard =
      await copyCreativeTextWithClipboard(
        text,
      );

    if (
      copiedWithClipboard
    ) {
      return {
        copied:
          true,

        usedFallback:
          false,
      };
    }
  } catch {
    /*
     * Continúa con la alternativa compatible con
     * navegadores antiguos o contextos no seguros.
     */
  }

  const copiedWithFallback =
    copyCreativeTextWithFallback(
      text,
    );

  return {
    copied:
      copiedWithFallback,

    usedFallback:
      true,
  };
}

/* =========================================================
   CREAR MENSAJE COMPLETO
   ========================================================= */

function createCreativeCombinedShareText(
  title:
    string,
  description:
    string,
  url:
    string,
): string {
  return [
    title,
    description,
    url,
  ]
    .filter(
      Boolean,
    )
    .join(
      "\n\n",
    );
}

/* =========================================================
   CREAR URL EXTERNA
   ========================================================= */

function createCreativeExternalShareUrl(
  destination:
    CreativeExternalShareDestination,
  title:
    string,
  description:
    string,
  shareUrl:
    string,
  imageUrl:
    string,
): string {
  const encodedTitle =
    encodeURIComponent(
      title,
    );

  const encodedDescription =
    encodeURIComponent(
      description,
    );

  const encodedShareUrl =
    encodeURIComponent(
      shareUrl,
    );

  const encodedCombinedText =
    encodeURIComponent(
      createCreativeCombinedShareText(
        title,
        description,
        shareUrl,
      ),
    );

  switch (
    destination
  ) {
    case "WHATSAPP":
      return `https://wa.me/?text=${encodedCombinedText}`;

    case "FACEBOOK":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`;

    case "X":
      return `https://twitter.com/intent/tweet?text=${encodedDescription}&url=${encodedShareUrl}`;

    case "TELEGRAM":
      return `https://t.me/share/url?url=${encodedShareUrl}&text=${encodedDescription}`;

    case "LINKEDIN":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`;

    case "PINTEREST": {
      const encodedImageUrl =
        encodeURIComponent(
          imageUrl ||
          shareUrl,
        );

      return `https://www.pinterest.com/pin/create/button/?url=${encodedShareUrl}&media=${encodedImageUrl}&description=${encodedDescription}`;
    }

    case "EMAIL":
      return `mailto:?subject=${encodedTitle}&body=${encodedCombinedText}`;
  }
}

/* =========================================================
   ABRIR SERVICIO EXTERNO
   ========================================================= */

function openCreativeExternalShareDestination(
  destination:
    CreativeExternalShareDestination,
  externalUrl:
    string,
  openInNewWindow:
    boolean,
): boolean {
  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  if (
    destination ===
    "EMAIL"
  ) {
    window.location.href =
      externalUrl;

    return true;
  }

  if (
    !openInNewWindow
  ) {
    window.location.assign(
      externalUrl,
    );

    return true;
  }

  const popup =
    window.open(
      externalUrl,
      "_blank",
      [
        "noopener",
        "noreferrer",
        "width=720",
        "height=680",
        "menubar=no",
        "toolbar=no",
        "location=yes",
        "resizable=yes",
        "scrollbars=yes",
      ].join(
        ",",
      ),
    );

  if (
    !popup
  ) {
    return false;
  }

  popup.opener =
    null;

  return true;
}

/* =========================================================
   HOOK PRINCIPAL
   ========================================================= */

export function useCreativeShare(
  options:
    UseCreativeShareOptions,
): UseCreativeShareResult {
  const {
    slug,

    title,

    text,

    imageUrl =
      null,

    origin =
      null,

    channel =
      "copy-link",

    language =
      "es",

    enabled =
      true,

    copiedStateDurationMs =
      2_500,

    openExternalInNewWindow =
      true,

    onShareSuccess,

    onShareError,
  } =
    options;

  /* =======================================================
     VALORES NORMALIZADOS
     ======================================================= */

  const normalizedSlug =
    normalizeCreativeShareSlug(
      slug,
    );

  const normalizedOrigin =
    normalizeCreativeShareOrigin(
      origin,
    );

  const normalizedCopiedDuration =
    normalizeCreativeCopiedDuration(
      copiedStateDurationMs,
    );

  const resolvedTitle =
    resolveCreativeShareTitle(
      title,
      language,
    );

  const resolvedDescription =
    resolveCreativeShareDescription(
      text,
      language,
    );

  const relativeShareUrl =
    normalizedSlug
      ? createCreativeShareRoute(
          normalizedSlug,
          channel,
        )
      : "";

  const displayShareUrl =
    normalizedOrigin &&
    normalizedSlug
      ? createCreativeAbsoluteShareUrl(
          normalizedOrigin,
          normalizedSlug,
          channel,
        )
      : relativeShareUrl;

  /* =======================================================
     ESTADO DE OPERACIÓN
     ======================================================= */

  const [
    status,
    setStatus,
  ] =
    useState<CreativeShareOperationStatus>(
      "IDLE",
    );

  const [
    activeAction,
    setActiveAction,
  ] =
    useState<
      CreativeShareAction | null
    >(
      null,
    );

  const [
    activeDestination,
    setActiveDestination,
  ] =
    useState<
      CreativeExternalShareDestination | null
    >(
      null,
    );

  const [
    copied,
    setCopied,
  ] =
    useState<boolean>(
      false,
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<
      string | null
    >(
      null,
    );

  /*
   * Comienza en null para no ejecutar Date.now()
   * durante el renderizado.
   */
  const [
    lastSharedAt,
    setLastSharedAt,
  ] =
    useState<
      number | null
    >(
      null,
    );

  /* =======================================================
     CAPACIDADES DEL NAVEGADOR
     ======================================================= */

  const [
    capabilities,
    setCapabilities,
  ] =
    useState<CreativeShareBrowserCapabilities>(
      EMPTY_CREATIVE_SHARE_CAPABILITIES,
    );

  /* =======================================================
     REFERENCIAS DE CONTROL
     ======================================================= */

  const operationSequenceRef =
    useRef<number>(
      0,
    );

  /*
   * window.setTimeout devuelve un número en el navegador.
   *
   * Se usa explícitamente number para evitar el conflicto
   * con NodeJS.Timeout de los tipos instalados por Next.js.
   */
  const copiedTimerRef =
    useRef<number | null>(
      null,
    );

  const successCallbackRef =
    useRef(
      onShareSuccess,
    );

  const errorCallbackRef =
    useRef(
      onShareError,
    );

  /* =======================================================
     ACTUALIZAR REFERENCIAS DE CALLBACKS
     ======================================================= */

  useEffect(
    () => {
      successCallbackRef.current =
        onShareSuccess;
    },
    [
      onShareSuccess,
    ],
  );

  useEffect(
    () => {
      errorCallbackRef.current =
        onShareError;
    },
    [
      onShareError,
    ],
  );

  /* =======================================================
     DETECTAR CAPACIDADES
     ======================================================= */

  useEffect(
    () => {
      const timeoutId =
        window.setTimeout(
          () => {
            setCapabilities({
              nativeShare:
                typeof navigator.share ===
                "function",

              clipboard:
                Boolean(
                  navigator.clipboard &&
                  typeof navigator.clipboard.writeText ===
                    "function",
                ),
            });
          },
          0,
        );

      return () => {
        window.clearTimeout(
          timeoutId,
        );
      };
    },
    [],
  );

  /* =======================================================
     LIMPIAR TEMPORIZADOR DE COPIA
     ======================================================= */

  const clearCopiedTimer =
    useCallback(
      (): void => {
        const timerId =
          copiedTimerRef.current;

        if (
          timerId ===
          null
        ) {
          return;
        }

        window.clearTimeout(
          timerId,
        );

        copiedTimerRef.current =
          null;
      },
      [],
    );

  /* =======================================================
     PROGRAMAR LIMPIEZA DE COPIA
     ======================================================= */

  const scheduleCopiedReset =
    useCallback(
      (): void => {
        clearCopiedTimer();

        const timerId =
          window.setTimeout(
            () => {
              setCopied(
                false,
              );

              copiedTimerRef.current =
                null;
            },
            normalizedCopiedDuration,
          );

        copiedTimerRef.current =
          timerId;
      },
      [
        clearCopiedTimer,
        normalizedCopiedDuration,
      ],
    );

  /* =======================================================
     OBTENER URL ABSOLUTA
     ======================================================= */

  const getAbsoluteShareUrl =
    useCallback(
      (): string => {
        return resolveCreativeAbsoluteUrl(
          normalizedSlug,
          channel,
          normalizedOrigin,
        );
      },
      [
        channel,
        normalizedOrigin,
        normalizedSlug,
      ],
    );

  /* =======================================================
     INICIAR OPERACIÓN
     ======================================================= */

  const beginShareOperation =
    useCallback(
      (
        action:
          CreativeShareAction,
        destination:
          CreativeExternalShareDestination | null,
      ): number | null => {
        if (
          !enabled
        ) {
          return null;
        }

        if (
          !normalizedSlug
        ) {
          const message =
            getCreativeInvalidShareItemMessage(
              language,
            );

          setStatus(
            "ERROR",
          );

          setActiveAction(
            action,
          );

          setActiveDestination(
            destination,
          );

          setErrorMessage(
            message,
          );

          errorCallbackRef.current?.({
            action,

            destination,

            channel,

            url:
              null,

            message,

            error:
              new Error(
                message,
              ),
          });

          return null;
        }

        const nextSequence =
          operationSequenceRef.current +
          1;

        operationSequenceRef.current =
          nextSequence;

        setStatus(
          "PROCESSING",
        );

        setActiveAction(
          action,
        );

        setActiveDestination(
          destination,
        );

        setErrorMessage(
          null,
        );

        setCopied(
          false,
        );

        clearCopiedTimer();

        return nextSequence;
      },
      [
        channel,
        clearCopiedTimer,
        enabled,
        language,
        normalizedSlug,
      ],
    );

  /* =======================================================
     COMPLETAR CON ÉXITO
     ======================================================= */

  const completeShareOperation =
    useCallback(
      async (
        sequence:
          number,
        action:
          CreativeShareAction,
        destination:
          CreativeExternalShareDestination | null,
        shareUrl:
          string,
        usedFallback:
          boolean,
      ): Promise<boolean> => {
        if (
          sequence !==
          operationSequenceRef.current
        ) {
          return false;
        }

        const sharedAt =
          Date.now();

        setStatus(
          "SUCCESS",
        );

        setActiveAction(
          action,
        );

        setActiveDestination(
          destination,
        );

        setErrorMessage(
          null,
        );

        setLastSharedAt(
          sharedAt,
        );

        if (
          action ===
            "COPY_LINK" ||
          (
            action ===
              "NATIVE_SHARE" &&
            usedFallback
          )
        ) {
          setCopied(
            true,
          );

          scheduleCopiedReset();
        }

        const callback =
          successCallbackRef.current;

        if (
          callback
        ) {
          try {
            await callback({
              action,

              destination,

              channel,

              url:
                shareUrl,

              sharedAt,

              usedFallback,
            });
          } catch {
            /*
             * Un error del registro estadístico externo
             * no debe revertir la acción ya completada.
             */
          }
        }

        return true;
      },
      [
        channel,
        scheduleCopiedReset,
      ],
    );

  /* =======================================================
     COMPLETAR CON CANCELACIÓN
     ======================================================= */

  const cancelShareOperation =
    useCallback(
      (
        sequence:
          number,
        action:
          CreativeShareAction,
      ): boolean => {
        if (
          sequence !==
          operationSequenceRef.current
        ) {
          return false;
        }

        setStatus(
          "CANCELLED",
        );

        setActiveAction(
          action,
        );

        setActiveDestination(
          null,
        );

        setErrorMessage(
          null,
        );

        return false;
      },
      [],
    );

  /* =======================================================
     COMPLETAR CON ERROR
     ======================================================= */

  const failShareOperation =
    useCallback(
      (
        sequence:
          number,
        action:
          CreativeShareAction,
        destination:
          CreativeExternalShareDestination | null,
        shareUrl:
          string | null,
        error:
          unknown,
        customMessage?:
          string,
      ): boolean => {
        if (
          sequence !==
          operationSequenceRef.current
        ) {
          return false;
        }

        const resolvedErrorMessage =
          customMessage ||
          (
            error instanceof Error &&
            error.message.trim()
              ? error.message
              : getCreativeShareFallbackError(
                  action,
                  language,
                )
          );

        setStatus(
          "ERROR",
        );

        setActiveAction(
          action,
        );

        setActiveDestination(
          destination,
        );

        setErrorMessage(
          resolvedErrorMessage,
        );

        errorCallbackRef.current?.({
          action,

          destination,

          channel,

          url:
            shareUrl,

          message:
            resolvedErrorMessage,

          error,
        });

        return false;
      },
      [
        channel,
        language,
      ],
    );

  /* =======================================================
     COPIAR ENLACE
     ======================================================= */

  const copyLink =
    useCallback(
      async (): Promise<boolean> => {
        const action:
          CreativeShareAction =
            "COPY_LINK";

        const sequence =
          beginShareOperation(
            action,
            null,
          );

        if (
          sequence ===
          null
        ) {
          return false;
        }

        const shareUrl =
          getAbsoluteShareUrl();

        try {
          const result =
            await copyCreativeText(
              shareUrl,
            );

          if (
            !result.copied
          ) {
            throw new Error(
              getCreativeShareFallbackError(
                action,
                language,
              ),
            );
          }

          return await completeShareOperation(
            sequence,
            action,
            null,
            shareUrl,
            result.usedFallback,
          );
        } catch (
          error
        ) {
          return failShareOperation(
            sequence,
            action,
            null,
            shareUrl,
            error,
          );
        }
      },
      [
        beginShareOperation,
        completeShareOperation,
        failShareOperation,
        getAbsoluteShareUrl,
        language,
      ],
    );

  /* =======================================================
     COMPARTIR MEDIANTE EL DISPOSITIVO
     ======================================================= */

  const shareNative =
    useCallback(
      async (): Promise<boolean> => {
        const action:
          CreativeShareAction =
            "NATIVE_SHARE";

        const sequence =
          beginShareOperation(
            action,
            null,
          );

        if (
          sequence ===
          null
        ) {
          return false;
        }

        const shareUrl =
          getAbsoluteShareUrl();

        if (
          typeof navigator.share !==
          "function"
        ) {
          try {
            const result =
              await copyCreativeText(
                shareUrl,
              );

            if (
              !result.copied
            ) {
              throw new Error(
                getCreativeShareFallbackError(
                  action,
                  language,
                ),
              );
            }

            return await completeShareOperation(
              sequence,
              action,
              null,
              shareUrl,
              true,
            );
          } catch (
            error
          ) {
            return failShareOperation(
              sequence,
              action,
              null,
              shareUrl,
              error,
            );
          }
        }

        try {
          const shareData:
            ShareData = {
              title:
                resolvedTitle,

              text:
                resolvedDescription,

              url:
                shareUrl,
            };

          await navigator.share(
            shareData,
          );

          return await completeShareOperation(
            sequence,
            action,
            null,
            shareUrl,
            false,
          );
        } catch (
          error
        ) {
          if (
            isCreativeShareCancellation(
              error,
            )
          ) {
            return cancelShareOperation(
              sequence,
              action,
            );
          }

          return failShareOperation(
            sequence,
            action,
            null,
            shareUrl,
            error,
          );
        }
      },
      [
        beginShareOperation,
        cancelShareOperation,
        completeShareOperation,
        failShareOperation,
        getAbsoluteShareUrl,
        language,
        resolvedDescription,
        resolvedTitle,
      ],
    );

  /* =======================================================
     COMPARTIR EN SERVICIO EXTERNO
     ======================================================= */

  const shareTo =
    useCallback(
      async (
        destination:
          CreativeExternalShareDestination,
      ): Promise<boolean> => {
        const action:
          CreativeShareAction =
            destination;

        const sequence =
          beginShareOperation(
            action,
            destination,
          );

        if (
          sequence ===
          null
        ) {
          return false;
        }

        const shareUrl =
          getAbsoluteShareUrl();

        try {
          const absoluteImageUrl =
            resolveCreativeAbsoluteImageUrl(
              imageUrl,
              shareUrl,
            );

          const externalUrl =
            createCreativeExternalShareUrl(
              destination,
              resolvedTitle,
              resolvedDescription,
              shareUrl,
              absoluteImageUrl,
            );

          const opened =
            openCreativeExternalShareDestination(
              destination,
              externalUrl,
              openExternalInNewWindow,
            );

          if (
            !opened
          ) {
            const blockedWindowMessage =
              getCreativeBlockedWindowMessage(
                language,
              );

            return failShareOperation(
              sequence,
              action,
              destination,
              shareUrl,
              new Error(
                blockedWindowMessage,
              ),
              blockedWindowMessage,
            );
          }

          return await completeShareOperation(
            sequence,
            action,
            destination,
            shareUrl,
            false,
          );
        } catch (
          error
        ) {
          return failShareOperation(
            sequence,
            action,
            destination,
            shareUrl,
            error,
          );
        }
      },
      [
        beginShareOperation,
        completeShareOperation,
        failShareOperation,
        getAbsoluteShareUrl,
        imageUrl,
        language,
        openExternalInNewWindow,
        resolvedDescription,
        resolvedTitle,
      ],
    );

  /* =======================================================
     FUNCIONES ESPECÍFICAS
     ======================================================= */

  const shareToWhatsApp =
    useCallback(
      async (): Promise<boolean> => {
        return shareTo(
          "WHATSAPP",
        );
      },
      [
        shareTo,
      ],
    );

  const shareToFacebook =
    useCallback(
      async (): Promise<boolean> => {
        return shareTo(
          "FACEBOOK",
        );
      },
      [
        shareTo,
      ],
    );

  const shareToX =
    useCallback(
      async (): Promise<boolean> => {
        return shareTo(
          "X",
        );
      },
      [
        shareTo,
      ],
    );

  const shareToTelegram =
    useCallback(
      async (): Promise<boolean> => {
        return shareTo(
          "TELEGRAM",
        );
      },
      [
        shareTo,
      ],
    );

  const shareToLinkedIn =
    useCallback(
      async (): Promise<boolean> => {
        return shareTo(
          "LINKEDIN",
        );
      },
      [
        shareTo,
      ],
    );

  const shareToPinterest =
    useCallback(
      async (): Promise<boolean> => {
        return shareTo(
          "PINTEREST",
        );
      },
      [
        shareTo,
      ],
    );

  const shareByEmail =
    useCallback(
      async (): Promise<boolean> => {
        return shareTo(
          "EMAIL",
        );
      },
      [
        shareTo,
      ],
    );

  /* =======================================================
     LIMPIAR ERROR
     ======================================================= */

  const clearError =
    useCallback(
      (): void => {
        setErrorMessage(
          null,
        );

        setStatus(
          (
            currentStatus,
          ) =>
            currentStatus ===
            "ERROR"
              ? "IDLE"
              : currentStatus,
        );
      },
      [],
    );

  /* =======================================================
     RESTABLECER ESTADO
     ======================================================= */

  const resetShareState =
    useCallback(
      (): void => {
        operationSequenceRef.current +=
          1;

        clearCopiedTimer();

        setStatus(
          "IDLE",
        );

        setActiveAction(
          null,
        );

        setActiveDestination(
          null,
        );

        setCopied(
          false,
        );

        setErrorMessage(
          null,
        );
      },
      [
        clearCopiedTimer,
      ],
    );

  /* =======================================================
     CANCELAR OPERACIÓN ACTUAL
     ======================================================= */

  const cancelCurrentShare =
    useCallback(
      (): void => {
        operationSequenceRef.current +=
          1;

        clearCopiedTimer();

        setStatus(
          "CANCELLED",
        );

        setActiveAction(
          null,
        );

        setActiveDestination(
          null,
        );

        setCopied(
          false,
        );

        setErrorMessage(
          null,
        );
      },
      [
        clearCopiedTimer,
      ],
    );

  /* =======================================================
     LIMPIEZA AL DESMONTAR
     ======================================================= */

  useEffect(
    () => {
      return () => {
        operationSequenceRef.current +=
          1;

        const timerId =
          copiedTimerRef.current;

        if (
          timerId !==
          null
        ) {
          window.clearTimeout(
            timerId,
          );

          copiedTimerRef.current =
            null;
        }
      };
    },
    [],
  );

  /* =======================================================
     INFORMACIÓN DERIVADA
     ======================================================= */

  const processing =
    status ===
    "PROCESSING";

  const succeeded =
    status ===
    "SUCCESS";

  const cancelled =
    status ===
    "CANCELLED";

  const hasError =
    status ===
      "ERROR" ||
    errorMessage !==
      null;

  const ready =
    enabled &&
    normalizedSlug.length >
      0;

  /* =======================================================
     RETORNO
     ======================================================= */

  return {
    slug:
      normalizedSlug,

    relativeShareUrl,

    displayShareUrl,

    status,

    activeAction,

    activeDestination,

    processing,

    copied,

    succeeded,

    cancelled,

    hasError,

    errorMessage,

    lastSharedAt,

    capabilities,

    nativeShareAvailable:
      capabilities.nativeShare,

    clipboardAvailable:
      capabilities.clipboard,

    ready,

    getAbsoluteShareUrl,

    copyLink,

    shareNative,

    shareTo,

    shareToWhatsApp,

    shareToFacebook,

    shareToX,

    shareToTelegram,

    shareToLinkedIn,

    shareToPinterest,

    shareByEmail,

    clearError,

    resetShareState,

    cancelCurrentShare,
  };
}