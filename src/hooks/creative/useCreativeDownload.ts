"use client";

/*
 * Hook de descargas del módulo Diseño / Creative.
 *
 * Responsabilidades:
 * - Descargar archivos gratuitos.
 * - Descargar archivos premium después del pago aprobado.
 * - Bloquear las descargas de trabajos de portafolio.
 * - Solicitar autenticación cuando sea necesaria.
 * - Detectar compras o pagos pendientes.
 * - Procesar respuestas binarias y enlaces temporales.
 * - Obtener el nombre del archivo desde Content-Disposition.
 * - Crear y liberar URLs temporales de Blob.
 * - Cancelar descargas en preparación.
 * - Evitar que respuestas antiguas modifiquen el estado.
 *
 * No contiene:
 * - Componentes visuales.
 * - Acceso directo a Prisma.
 * - Lógica de pagos.
 * - Lógica administrativa.
 * - Gestión de comentarios.
 */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createCreativeItemDownloadApiRoute,
  createCreativeLoginRoute,
  normalizeCreativeReturnTo,
} from "@/constants/creative/creative.routes";

import type {
  CreativeApiLanguage,
  CreativeApiResponse,
} from "@/types/creative/creative-api.types";

import type {
  CreativeContentType,
  CreativeDownloadPolicy,
  CreativeItemId,
} from "@/types/creative/creative-item.types";

/* =========================================================
   ESTADOS DE DESCARGA
   ========================================================= */

export type CreativeDownloadStatus =
  | "IDLE"
  | "PREPARING"
  | "DOWNLOADING"
  | "SUCCESS"
  | "AUTHENTICATION_REQUIRED"
  | "PURCHASE_REQUIRED"
  | "PAYMENT_PENDING"
  | "PAYMENT_REJECTED"
  | "UNAVAILABLE"
  | "FORBIDDEN"
  | "CANCELLED"
  | "ERROR";

/* =========================================================
   MOTIVOS DE BLOQUEO
   ========================================================= */

export type CreativeDownloadBlockReason =
  | "AUTHENTICATION_REQUIRED"
  | "PURCHASE_REQUIRED"
  | "PAYMENT_PENDING"
  | "PAYMENT_REJECTED"
  | "DOWNLOAD_DISABLED"
  | "FILE_UNAVAILABLE"
  | "FORBIDDEN";

/* =========================================================
   RESPUESTA JSON DE LA API
   ========================================================= */

/*
 * La API puede responder de dos maneras:
 *
 * 1. Entregar directamente el archivo como Blob.
 * 2. Entregar un enlace temporal mediante JSON.
 *
 * Se admiten las propiedades downloadUrl y url para que
 * el hook sea compatible con ambas convenciones.
 */
interface CreativeDownloadApiData {
  downloadUrl?:
    string;

  url?:
    string;

  fileName?:
    string;

  filename?:
    string;

  mimeType?:
    string | null;

  fileSizeBytes?:
    number | null;

  expiresAt?:
    string | null;

  downloadToken?:
    string | null;
}

/* =========================================================
   SOLICITUD DE AUTENTICACIÓN
   ========================================================= */

export interface CreativeDownloadAuthenticationRequest {
  itemId:
    string;

  returnTo:
    string;

  redirectTo:
    string;
}

/* =========================================================
   SOLICITUD DE COMPRA
   ========================================================= */

export interface CreativeDownloadPurchaseRequest {
  itemId:
    string;

  reason:
    Extract<
      CreativeDownloadBlockReason,
      | "PURCHASE_REQUIRED"
      | "PAYMENT_PENDING"
      | "PAYMENT_REJECTED"
    >;
}

/* =========================================================
   EVENTO DE INICIO
   ========================================================= */

export interface CreativeDownloadStartEvent {
  itemId:
    string;

  startedAt:
    number;
}

/* =========================================================
   EVENTO DE ÉXITO
   ========================================================= */

export interface CreativeDownloadSuccessEvent {
  itemId:
    string;

  fileName:
    string;

  fileSizeBytes:
    number | null;

  mimeType:
    string | null;

  downloadedAt:
    number;

  source:
    "BLOB" | "TEMPORARY_URL";
}

/* =========================================================
   EVENTO DE ERROR
   ========================================================= */

export interface CreativeDownloadErrorEvent {
  itemId:
    string;

  message:
    string;

  error:
    unknown;

  status:
    CreativeDownloadStatus;

  blockReason:
    CreativeDownloadBlockReason | null;
}

/* =========================================================
   OPCIONES DEL HOOK
   ========================================================= */

export interface UseCreativeDownloadOptions {
  /*
   * Identificador del diseño.
   */
  itemId:
    CreativeItemId | null | undefined;

  /*
   * Tipo oficial de publicación.
   */
  contentType?:
    CreativeContentType | null;

  /*
   * Política oficial de descarga.
   */
  downloadPolicy?:
    CreativeDownloadPolicy | null;

  /*
   * Nombre utilizado cuando el servidor no devuelve uno.
   */
  fallbackFileName?:
    string | null;

  /*
   * Idioma utilizado para los mensajes.
   */
  language?:
    CreativeApiLanguage;

  /*
   * Permite desactivar temporalmente el hook.
   */
  enabled?:
    boolean;

  /*
   * Indica si el visitante inició sesión.
   */
  authenticated?:
    boolean;

  /*
   * Permiso definitivo calculado por el servidor.
   *
   * undefined permite que la API tome la decisión.
   */
  canDownload?:
    boolean;

  /*
   * Indica si la descarga requiere iniciar sesión.
   */
  requiresAuthentication?:
    boolean;

  /*
   * Indica que el usuario ya compró el diseño.
   */
  purchaseConfirmed?:
    boolean;

  /*
   * Indica que el comprobante todavía está en revisión.
   */
  paymentPending?:
    boolean;

  /*
   * Indica que el comprobante fue rechazado.
   */
  paymentRejected?:
    boolean;

  /*
   * Ruta a la que debe regresar después de iniciar sesión.
   */
  returnTo?:
    string;

  /*
   * Control externo para mostrar un modal de autenticación.
   * Sin callback, el hook redirige al inicio de sesión.
   */
  onAuthenticationRequired?:
    (
      request:
        CreativeDownloadAuthenticationRequest,
    ) => void;

  /*
   * Control externo para abrir el proceso de compra.
   */
  onPurchaseRequired?:
    (
      request:
        CreativeDownloadPurchaseRequest,
    ) => void;

  /*
   * Se ejecuta al comenzar la preparación de la descarga.
   */
  onDownloadStart?:
    (
      event:
        CreativeDownloadStartEvent,
    ) => void;

  /*
   * Se ejecuta cuando la descarga se entrega correctamente.
   */
  onDownloadSuccess?:
    (
      event:
        CreativeDownloadSuccessEvent,
    ) => void | Promise<void>;

  /*
   * Se ejecuta cuando ocurre un error.
   */
  onDownloadError?:
    (
      event:
        CreativeDownloadErrorEvent,
    ) => void;
}

/* =========================================================
   RESULTADO DEL HOOK
   ========================================================= */

export interface UseCreativeDownloadResult {
  itemId:
    string;

  status:
    CreativeDownloadStatus;

  blockReason:
    CreativeDownloadBlockReason | null;

  processing:
    boolean;

  preparing:
    boolean;

  downloading:
    boolean;

  succeeded:
    boolean;

  cancelled:
    boolean;

  blocked:
    boolean;

  hasError:
    boolean;

  errorMessage:
    string | null;

  lastDownloadedAt:
    number | null;

  lastFileName:
    string | null;

  lastFileSizeBytes:
    number | null;

  lastMimeType:
    string | null;

  canStartDownload:
    boolean;

  download:
    () => Promise<boolean>;

  retry:
    () => Promise<boolean>;

  cancelDownload:
    () => void;

  clearError:
    () => void;

  resetDownloadState:
    () => void;

  requestAuthentication:
    () => void;

  requestPurchase:
    () => void;
}

/* =========================================================
   ESTADO INTERNO DE LA SOLICITUD
   ========================================================= */

interface CreativeDownloadRuntime {
  sequence:
    number;

  controller:
    AbortController | null;
}

/* =========================================================
   RESULTADO DE LA VALIDACIÓN PREVIA
   ========================================================= */

interface CreativeDownloadPreflightResult {
  allowed:
    boolean;

  status:
    CreativeDownloadStatus;

  blockReason:
    CreativeDownloadBlockReason | null;

  message:
    string | null;
}

/* =========================================================
   NORMALIZAR IDENTIFICADOR
   ========================================================= */

function normalizeCreativeDownloadItemId(
  itemId:
    CreativeItemId | null | undefined,
): string {
  if (
    typeof itemId !==
    "string"
  ) {
    return "";
  }

  return itemId.trim();
}

/* =========================================================
   NORMALIZAR NOMBRE DEL ARCHIVO
   ========================================================= */

function sanitizeCreativeDownloadFileName(
  fileName:
    string | null | undefined,
): string {
  if (
    typeof fileName !==
    "string"
  ) {
    return "";
  }

  return fileName
    .replace(
      /[<>:"/\\|?*\u0000-\u001F]/g,
      "-",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .replace(
      /^\.+/,
      "",
    )
    .trim()
    .slice(
      0,
      180,
    );
}

/* =========================================================
   CREAR NOMBRE PREDETERMINADO
   ========================================================= */

function createCreativeDefaultFileName(
  itemId:
    string,
  fallbackFileName:
    string | null | undefined,
): string {
  const normalizedFallback =
    sanitizeCreativeDownloadFileName(
      fallbackFileName,
    );

  if (
    normalizedFallback
  ) {
    return normalizedFallback;
  }

  const safeItemId =
    itemId
      .replace(
        /[^a-zA-Z0-9_-]/g,
        "",
      )
      .slice(
        0,
        40,
      );

  return safeItemId
    ? `fixora-diseno-${safeItemId}`
    : "fixora-diseno";
}

/* =========================================================
   NORMALIZAR TAMAÑO
   ========================================================= */

function normalizeCreativeDownloadFileSize(
  value:
    number | null | undefined,
): number | null {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    ) ||
    value <
      0
  ) {
    return null;
  }

  return Math.trunc(
    value,
  );
}

/* =========================================================
   IDENTIFICAR RESPUESTA JSON
   ========================================================= */

function isCreativeDownloadJsonResponse(
  response:
    Response,
): boolean {
  const contentType =
    response.headers
      .get(
        "content-type",
      )
      ?.toLowerCase() ??
    "";

  return (
    contentType.includes(
      "application/json",
    ) ||
    contentType.includes(
      "application/problem+json",
    )
  );
}

/* =========================================================
   LEER RESPUESTA JSON
   ========================================================= */

async function readCreativeDownloadJson(
  response:
    Response,
): Promise<
  CreativeApiResponse<CreativeDownloadApiData> | null
> {
  return (
    await response
      .json()
      .catch(
        () =>
          null,
      )
  ) as
    | CreativeApiResponse<CreativeDownloadApiData>
    | null;
}

/* =========================================================
   EXTRAER MENSAJE DE LA API
   ========================================================= */

function getCreativeDownloadApiMessage(
  payload:
    CreativeApiResponse<CreativeDownloadApiData> | null,
  language:
    CreativeApiLanguage,
  fallback:
    string,
): string {
  if (
    payload &&
    payload.ok ===
      false
  ) {
    return payload.message[
      language
    ];
  }

  return fallback;
}

/* =========================================================
   EXTRAER CÓDIGO DE ERROR
   ========================================================= */

function getCreativeDownloadApiErrorCode(
  payload:
    CreativeApiResponse<CreativeDownloadApiData> | null,
): string {
  if (
    !payload ||
    payload.ok !==
      false
  ) {
    return "";
  }

  const code =
    payload.code;

  return typeof code ===
    "string"
    ? code.trim().toUpperCase()
    : "";
}

/* =========================================================
   EXTRAER NOMBRE DESDE CONTENT-DISPOSITION
   ========================================================= */

function getCreativeDownloadFileNameFromHeaders(
  response:
    Response,
): string {
  const contentDisposition =
    response.headers.get(
      "content-disposition",
    );

  if (
    !contentDisposition
  ) {
    return "";
  }

  /*
   * Formato RFC 5987:
   * filename*=UTF-8''archivo%20final.png
   */
  const encodedMatch =
    contentDisposition.match(
      /filename\*\s*=\s*(?:UTF-8''|utf-8'')([^;]+)/i,
    );

  if (
    encodedMatch?.[1]
  ) {
    const encodedValue =
      encodedMatch[1]
        .trim()
        .replace(
          /^["']|["']$/g,
          "",
        );

    try {
      return sanitizeCreativeDownloadFileName(
        decodeURIComponent(
          encodedValue,
        ),
      );
    } catch {
      return sanitizeCreativeDownloadFileName(
        encodedValue,
      );
    }
  }

  /*
   * Formato tradicional:
   * filename="archivo final.png"
   */
  const basicMatch =
    contentDisposition.match(
      /filename\s*=\s*(?:"([^"]+)"|'([^']+)'|([^;]+))/i,
    );

  const basicValue =
    basicMatch?.[1] ??
    basicMatch?.[2] ??
    basicMatch?.[3] ??
    "";

  return sanitizeCreativeDownloadFileName(
    basicValue,
  );
}

/* =========================================================
   EXTENSIÓN SEGÚN MIME TYPE
   ========================================================= */

function getCreativeDownloadExtensionFromMimeType(
  mimeType:
    string | null | undefined,
): string {
  const normalizedMimeType =
    mimeType
      ?.split(
        ";",
        1,
      )[0]
      ?.trim()
      .toLowerCase() ??
    "";

  const extensionByMimeType:
    Record<string, string> = {
      "image/jpeg":
        "jpg",

      "image/png":
        "png",

      "image/webp":
        "webp",

      "image/svg+xml":
        "svg",

      "application/pdf":
        "pdf",

      "application/zip":
        "zip",

      "application/x-zip-compressed":
        "zip",

      "application/postscript":
        "ai",

      "application/octet-stream":
        "bin",
    };

  return extensionByMimeType[
    normalizedMimeType
  ] ?? "";
}

/* =========================================================
   ASEGURAR EXTENSIÓN
   ========================================================= */

function ensureCreativeDownloadFileExtension(
  fileName:
    string,
  mimeType:
    string | null | undefined,
): string {
  if (
    /\.[a-zA-Z0-9]{1,10}$/.test(
      fileName,
    )
  ) {
    return fileName;
  }

  const extension =
    getCreativeDownloadExtensionFromMimeType(
      mimeType,
    );

  if (
    !extension
  ) {
    return fileName;
  }

  return `${fileName}.${extension}`;
}

/* =========================================================
   VALIDAR URL DE DESCARGA
   ========================================================= */

function normalizeCreativeDownloadUrl(
  value:
    string | null | undefined,
): string {
  if (
    typeof value !==
    "string"
  ) {
    return "";
  }

  const normalizedValue =
    value.trim();

  if (
    !normalizedValue
  ) {
    return "";
  }

  try {
    const parsedUrl =
      typeof window !==
        "undefined"
        ? new URL(
            normalizedValue,
            window.location.origin,
          )
        : new URL(
            normalizedValue,
            "http://localhost",
          );

    if (
      parsedUrl.protocol !==
        "http:" &&
      parsedUrl.protocol !==
        "https:"
    ) {
      return "";
    }

    /*
     * Conserva rutas relativas cuando fueron entregadas
     * de esa manera por la API.
     */
    if (
      normalizedValue.startsWith(
        "/",
      )
    ) {
      return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
    }

    return parsedUrl.toString();
  } catch {
    return "";
  }
}

/* =========================================================
   DESCARGAR MEDIANTE UN ENLACE
   ========================================================= */

function triggerCreativeBrowserDownload(
  url:
    string,
  fileName:
    string,
): void {
  if (
    typeof document ===
    "undefined"
  ) {
    throw new Error(
      "The browser document is not available.",
    );
  }

  const anchor =
    document.createElement(
      "a",
    );

  anchor.href =
    url;

  anchor.download =
    fileName;

  anchor.rel =
    "noopener noreferrer";

  anchor.style.display =
    "none";

  document.body.appendChild(
    anchor,
  );

  anchor.click();

  document.body.removeChild(
    anchor,
  );
}

/* =========================================================
   DETECTAR CANCELACIÓN
   ========================================================= */

function isCreativeDownloadAbortError(
  error:
    unknown,
): boolean {
  return (
    error instanceof DOMException &&
    error.name ===
      "AbortError"
  );
}

/* =========================================================
   MENSAJES PREDETERMINADOS
   ========================================================= */

function getCreativeDownloadFallbackMessage(
  status:
    CreativeDownloadStatus,
  language:
    CreativeApiLanguage,
): string {
  if (
    language ===
    "en"
  ) {
    switch (
      status
    ) {
      case "AUTHENTICATION_REQUIRED":
        return "Sign in to download this design.";

      case "PURCHASE_REQUIRED":
        return "Purchase this design before downloading it.";

      case "PAYMENT_PENDING":
        return "Your payment is still under review.";

      case "PAYMENT_REJECTED":
        return "The submitted payment was rejected. Review or replace the payment proof.";

      case "UNAVAILABLE":
        return "This design is not available for download.";

      case "FORBIDDEN":
        return "You do not have permission to download this file.";

      case "ERROR":
        return "The file could not be downloaded.";

      default:
        return "The download could not be completed.";
    }
  }

  switch (
    status
  ) {
    case "AUTHENTICATION_REQUIRED":
      return "Inicia sesión para descargar este diseño.";

    case "PURCHASE_REQUIRED":
      return "Debes comprar este diseño antes de descargarlo.";

    case "PAYMENT_PENDING":
      return "Tu pago todavía está en revisión.";

    case "PAYMENT_REJECTED":
      return "El comprobante enviado fue rechazado. Revísalo o reemplázalo.";

    case "UNAVAILABLE":
      return "Este diseño no está disponible para descargar.";

    case "FORBIDDEN":
      return "No tienes permiso para descargar este archivo.";

    case "ERROR":
      return "No fue posible descargar el archivo.";

    default:
      return "No fue posible completar la descarga.";
  }
}

/* =========================================================
   VALIDACIÓN PREVIA
   ========================================================= */

function resolveCreativeDownloadPreflight(
  options: {
    contentType:
      CreativeContentType | null | undefined;

    downloadPolicy:
      CreativeDownloadPolicy | null | undefined;

    authenticated:
      boolean;

    canDownload:
      boolean | undefined;

    requiresAuthentication:
      boolean;

    purchaseConfirmed:
      boolean;

    paymentPending:
      boolean;

    paymentRejected:
      boolean;

    language:
      CreativeApiLanguage;
  },
): CreativeDownloadPreflightResult {
  const {
    contentType,
    downloadPolicy,
    authenticated,
    canDownload,
    requiresAuthentication,
    purchaseConfirmed,
    paymentPending,
    paymentRejected,
    language,
  } =
    options;

  if (
    contentType ===
      "PORTFOLIO" ||
    downloadPolicy ===
      "DISABLED"
  ) {
    return {
      allowed:
        false,

      status:
        "UNAVAILABLE",

      blockReason:
        "DOWNLOAD_DISABLED",

      message:
        getCreativeDownloadFallbackMessage(
          "UNAVAILABLE",
          language,
        ),
    };
  }

  const premiumDownload =
    contentType ===
      "PAID" ||
    downloadPolicy ===
      "AFTER_APPROVED_PAYMENT";

  if (
    (
      requiresAuthentication ||
      premiumDownload
    ) &&
    !authenticated
  ) {
    return {
      allowed:
        false,

      status:
        "AUTHENTICATION_REQUIRED",

      blockReason:
        "AUTHENTICATION_REQUIRED",

      message:
        getCreativeDownloadFallbackMessage(
          "AUTHENTICATION_REQUIRED",
          language,
        ),
    };
  }

  if (
    premiumDownload &&
    paymentRejected
  ) {
    return {
      allowed:
        false,

      status:
        "PAYMENT_REJECTED",

      blockReason:
        "PAYMENT_REJECTED",

      message:
        getCreativeDownloadFallbackMessage(
          "PAYMENT_REJECTED",
          language,
        ),
    };
  }

  if (
    premiumDownload &&
    paymentPending
  ) {
    return {
      allowed:
        false,

      status:
        "PAYMENT_PENDING",

      blockReason:
        "PAYMENT_PENDING",

      message:
        getCreativeDownloadFallbackMessage(
          "PAYMENT_PENDING",
          language,
        ),
    };
  }

  if (
    premiumDownload &&
    !purchaseConfirmed &&
    canDownload !==
      true
  ) {
    return {
      allowed:
        false,

      status:
        "PURCHASE_REQUIRED",

      blockReason:
        "PURCHASE_REQUIRED",

      message:
        getCreativeDownloadFallbackMessage(
          "PURCHASE_REQUIRED",
          language,
        ),
    };
  }

  /*
   * undefined significa que todavía debe decidir la API.
   * Solo false representa una denegación conocida.
   */
  if (
    canDownload ===
      false
  ) {
    return {
      allowed:
        false,

      status:
        "FORBIDDEN",

      blockReason:
        "FORBIDDEN",

      message:
        getCreativeDownloadFallbackMessage(
          "FORBIDDEN",
          language,
        ),
    };
  }

  return {
    allowed:
      true,

    status:
      "IDLE",

    blockReason:
      null,

    message:
      null,
  };
}

/* =========================================================
   RESOLVER ERROR DE LA API
   ========================================================= */

function resolveCreativeDownloadApiFailure(
  response:
    Response,
  payload:
    CreativeApiResponse<CreativeDownloadApiData> | null,
  language:
    CreativeApiLanguage,
): {
  status:
    CreativeDownloadStatus;

  blockReason:
    CreativeDownloadBlockReason | null;

  message:
    string;
} {
  const code =
    getCreativeDownloadApiErrorCode(
      payload,
    );

  const authenticationCodes =
    new Set([
      "UNAUTHORIZED",
      "AUTHENTICATION_REQUIRED",
      "CREATIVE_AUTHENTICATION_REQUIRED",
      "CREATIVE_DOWNLOAD_AUTHENTICATION_REQUIRED",
    ]);

  const purchaseCodes =
    new Set([
      "PURCHASE_REQUIRED",
      "CREATIVE_PURCHASE_REQUIRED",
      "CREATIVE_DOWNLOAD_PURCHASE_REQUIRED",
    ]);

  const paymentPendingCodes =
    new Set([
      "PAYMENT_PENDING",
      "PAYMENT_UNDER_REVIEW",
      "CREATIVE_PAYMENT_PENDING",
      "CREATIVE_PAYMENT_UNDER_REVIEW",
    ]);

  const paymentRejectedCodes =
    new Set([
      "PAYMENT_REJECTED",
      "CREATIVE_PAYMENT_REJECTED",
    ]);

  const disabledCodes =
    new Set([
      "DOWNLOAD_DISABLED",
      "CREATIVE_DOWNLOAD_DISABLED",
      "CREATIVE_PORTFOLIO_DOWNLOAD_DISABLED",
    ]);

  const unavailableCodes =
    new Set([
      "FILE_NOT_FOUND",
      "DOWNLOAD_FILE_NOT_FOUND",
      "CREATIVE_FILE_NOT_FOUND",
      "CREATIVE_DOWNLOAD_FILE_NOT_FOUND",
      "CREATIVE_FILE_UNAVAILABLE",
    ]);

  if (
    response.status ===
      401 ||
    authenticationCodes.has(
      code,
    )
  ) {
    const status:
      CreativeDownloadStatus =
        "AUTHENTICATION_REQUIRED";

    return {
      status,

      blockReason:
        "AUTHENTICATION_REQUIRED",

      message:
        getCreativeDownloadApiMessage(
          payload,
          language,
          getCreativeDownloadFallbackMessage(
            status,
            language,
          ),
        ),
    };
  }

  if (
    response.status ===
      402 ||
    purchaseCodes.has(
      code,
    )
  ) {
    const status:
      CreativeDownloadStatus =
        "PURCHASE_REQUIRED";

    return {
      status,

      blockReason:
        "PURCHASE_REQUIRED",

      message:
        getCreativeDownloadApiMessage(
          payload,
          language,
          getCreativeDownloadFallbackMessage(
            status,
            language,
          ),
        ),
    };
  }

  if (
    paymentPendingCodes.has(
      code,
    )
  ) {
    const status:
      CreativeDownloadStatus =
        "PAYMENT_PENDING";

    return {
      status,

      blockReason:
        "PAYMENT_PENDING",

      message:
        getCreativeDownloadApiMessage(
          payload,
          language,
          getCreativeDownloadFallbackMessage(
            status,
            language,
          ),
        ),
    };
  }

  if (
    paymentRejectedCodes.has(
      code,
    )
  ) {
    const status:
      CreativeDownloadStatus =
        "PAYMENT_REJECTED";

    return {
      status,

      blockReason:
        "PAYMENT_REJECTED",

      message:
        getCreativeDownloadApiMessage(
          payload,
          language,
          getCreativeDownloadFallbackMessage(
            status,
            language,
          ),
        ),
    };
  }

  if (
    disabledCodes.has(
      code,
    )
  ) {
    const status:
      CreativeDownloadStatus =
        "UNAVAILABLE";

    return {
      status,

      blockReason:
        "DOWNLOAD_DISABLED",

      message:
        getCreativeDownloadApiMessage(
          payload,
          language,
          getCreativeDownloadFallbackMessage(
            status,
            language,
          ),
        ),
    };
  }

  if (
    response.status ===
      404 ||
    unavailableCodes.has(
      code,
    )
  ) {
    const status:
      CreativeDownloadStatus =
        "UNAVAILABLE";

    return {
      status,

      blockReason:
        "FILE_UNAVAILABLE",

      message:
        getCreativeDownloadApiMessage(
          payload,
          language,
          getCreativeDownloadFallbackMessage(
            status,
            language,
          ),
        ),
    };
  }

  if (
    response.status ===
      403
  ) {
    const status:
      CreativeDownloadStatus =
        "FORBIDDEN";

    return {
      status,

      blockReason:
        "FORBIDDEN",

      message:
        getCreativeDownloadApiMessage(
          payload,
          language,
          getCreativeDownloadFallbackMessage(
            status,
            language,
          ),
        ),
    };
  }

  const status:
    CreativeDownloadStatus =
      "ERROR";

  return {
    status,

    blockReason:
      null,

    message:
      getCreativeDownloadApiMessage(
        payload,
        language,
        getCreativeDownloadFallbackMessage(
          status,
          language,
        ),
      ),
  };
}

/* =========================================================
   HOOK PRINCIPAL
   ========================================================= */

export function useCreativeDownload(
  options:
    UseCreativeDownloadOptions,
): UseCreativeDownloadResult {
  const {
    itemId,

    contentType =
      null,

    downloadPolicy =
      null,

    fallbackFileName =
      null,

    language =
      "es",

    enabled =
      true,

    authenticated =
      false,

    canDownload,

    requiresAuthentication =
      false,

    purchaseConfirmed =
      false,

    paymentPending =
      false,

    paymentRejected =
      false,

    returnTo,

    onAuthenticationRequired,

    onPurchaseRequired,

    onDownloadStart,

    onDownloadSuccess,

    onDownloadError,
  } =
    options;

  const normalizedItemId =
    normalizeCreativeDownloadItemId(
      itemId,
    );

  const normalizedReturnTo =
    normalizeCreativeReturnTo(
      returnTo,
    );

  const defaultFileName =
    createCreativeDefaultFileName(
      normalizedItemId,
      fallbackFileName,
    );

  /* =======================================================
     ESTADO PRINCIPAL
     ======================================================= */

  const [
    status,
    setStatus,
  ] =
    useState<CreativeDownloadStatus>(
      "IDLE",
    );

  const [
    blockReason,
    setBlockReason,
  ] =
    useState<
      CreativeDownloadBlockReason | null
    >(
      null,
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

  const [
    lastDownloadedAt,
    setLastDownloadedAt,
  ] =
    useState<
      number | null
    >(
      null,
    );

  const [
    lastFileName,
    setLastFileName,
  ] =
    useState<
      string | null
    >(
      null,
    );

  const [
    lastFileSizeBytes,
    setLastFileSizeBytes,
  ] =
    useState<
      number | null
    >(
      null,
    );

  const [
    lastMimeType,
    setLastMimeType,
  ] =
    useState<
      string | null
    >(
      null,
    );

  /* =======================================================
     REFERENCIAS DE CONTROL
     ======================================================= */

  const runtimeRef =
    useRef<CreativeDownloadRuntime>({
      sequence:
        0,

      controller:
        null,
    });

  const objectUrlRef =
    useRef<
      string | null
    >(
      null,
    );

  /*
   * Se utiliza number porque window.setTimeout devuelve
   * un identificador numérico en el navegador.
   */
  const objectUrlCleanupTimerRef =
    useRef<
      number | null
    >(
      null,
    );

  /* =======================================================
     REFERENCIAS DE CALLBACKS
     ======================================================= */

  const authenticationCallbackRef =
    useRef(
      onAuthenticationRequired,
    );

  const purchaseCallbackRef =
    useRef(
      onPurchaseRequired,
    );

  const startCallbackRef =
    useRef(
      onDownloadStart,
    );

  const successCallbackRef =
    useRef(
      onDownloadSuccess,
    );

  const errorCallbackRef =
    useRef(
      onDownloadError,
    );

  useEffect(
    () => {
      authenticationCallbackRef.current =
        onAuthenticationRequired;
    },
    [
      onAuthenticationRequired,
    ],
  );

  useEffect(
    () => {
      purchaseCallbackRef.current =
        onPurchaseRequired;
    },
    [
      onPurchaseRequired,
    ],
  );

  useEffect(
    () => {
      startCallbackRef.current =
        onDownloadStart;
    },
    [
      onDownloadStart,
    ],
  );

  useEffect(
    () => {
      successCallbackRef.current =
        onDownloadSuccess;
    },
    [
      onDownloadSuccess,
    ],
  );

  useEffect(
    () => {
      errorCallbackRef.current =
        onDownloadError;
    },
    [
      onDownloadError,
    ],
  );

  /* =======================================================
     LIBERAR URL TEMPORAL
     ======================================================= */

  const releaseTemporaryObjectUrl =
    useCallback(
      (): void => {
        const cleanupTimerId =
          objectUrlCleanupTimerRef.current;

        if (
          cleanupTimerId !==
          null
        ) {
          window.clearTimeout(
            cleanupTimerId,
          );

          objectUrlCleanupTimerRef.current =
            null;
        }

        const currentObjectUrl =
          objectUrlRef.current;

        if (
          currentObjectUrl
        ) {
          URL.revokeObjectURL(
            currentObjectUrl,
          );

          objectUrlRef.current =
            null;
        }
      },
      [],
    );

  /* =======================================================
     PROGRAMAR LIBERACIÓN DE URL
     ======================================================= */

  const scheduleTemporaryObjectUrlRelease =
    useCallback(
      (): void => {
        const previousTimerId =
          objectUrlCleanupTimerRef.current;

        if (
          previousTimerId !==
          null
        ) {
          window.clearTimeout(
            previousTimerId,
          );
        }

        objectUrlCleanupTimerRef.current =
          window.setTimeout(
            () => {
              const currentObjectUrl =
                objectUrlRef.current;

              if (
                currentObjectUrl
              ) {
                URL.revokeObjectURL(
                  currentObjectUrl,
                );

                objectUrlRef.current =
                  null;
              }

              objectUrlCleanupTimerRef.current =
                null;
            },
            30_000,
          );
      },
      [],
    );

  /* =======================================================
     SOLICITAR AUTENTICACIÓN
     ======================================================= */

  const requestAuthentication =
    useCallback(
      (): void => {
        if (
          !normalizedItemId
        ) {
          return;
        }

        const redirectTo =
          createCreativeLoginRoute(
            normalizedReturnTo,
          );

        const request:
          CreativeDownloadAuthenticationRequest = {
            itemId:
              normalizedItemId,

            returnTo:
              normalizedReturnTo,

            redirectTo,
          };

        const callback =
          authenticationCallbackRef.current;

        if (
          callback
        ) {
          callback(
            request,
          );

          return;
        }

        if (
          typeof window !==
          "undefined"
        ) {
          window.location.assign(
            redirectTo,
          );
        }
      },
      [
        normalizedItemId,
        normalizedReturnTo,
      ],
    );

  /* =======================================================
     SOLICITAR COMPRA O REVISIÓN
     ======================================================= */

  const notifyPurchaseRequirement =
    useCallback(
      (
        reason:
          Extract<
            CreativeDownloadBlockReason,
            | "PURCHASE_REQUIRED"
            | "PAYMENT_PENDING"
            | "PAYMENT_REJECTED"
          >,
      ): void => {
        if (
          !normalizedItemId
        ) {
          return;
        }

        purchaseCallbackRef.current?.({
          itemId:
            normalizedItemId,

          reason,
        });
      },
      [
        normalizedItemId,
      ],
    );

  const requestPurchase =
    useCallback(
      (): void => {
        if (
          paymentRejected
        ) {
          notifyPurchaseRequirement(
            "PAYMENT_REJECTED",
          );

          return;
        }

        if (
          paymentPending
        ) {
          notifyPurchaseRequirement(
            "PAYMENT_PENDING",
          );

          return;
        }

        notifyPurchaseRequirement(
          "PURCHASE_REQUIRED",
        );
      },
      [
        notifyPurchaseRequirement,
        paymentPending,
        paymentRejected,
      ],
    );

  /* =======================================================
     REGISTRAR ERROR
     ======================================================= */

  const commitDownloadFailure =
    useCallback(
      (
        nextStatus:
          CreativeDownloadStatus,
        nextBlockReason:
          CreativeDownloadBlockReason | null,
        message:
          string,
        error:
          unknown,
      ): false => {
        setStatus(
          nextStatus,
        );

        setBlockReason(
          nextBlockReason,
        );

        setErrorMessage(
          message,
        );

        errorCallbackRef.current?.({
          itemId:
            normalizedItemId,

          message,

          error,

          status:
            nextStatus,

          blockReason:
            nextBlockReason,
        });

        return false;
      },
      [
        normalizedItemId,
      ],
    );

  /* =======================================================
     COMPLETAR DESCARGA
     ======================================================= */

  const commitDownloadSuccess =
    useCallback(
      async (
        sequence:
          number,
        event:
          Omit<
            CreativeDownloadSuccessEvent,
            "downloadedAt" | "itemId"
          >,
      ): Promise<boolean> => {
        if (
          sequence !==
          runtimeRef.current.sequence
        ) {
          return false;
        }

        const downloadedAt =
          Date.now();

        setStatus(
          "SUCCESS",
        );

        setBlockReason(
          null,
        );

        setErrorMessage(
          null,
        );

        setLastDownloadedAt(
          downloadedAt,
        );

        setLastFileName(
          event.fileName,
        );

        setLastFileSizeBytes(
          event.fileSizeBytes,
        );

        setLastMimeType(
          event.mimeType,
        );

        const callback =
          successCallbackRef.current;

        if (
          callback
        ) {
          try {
            await callback({
              itemId:
                normalizedItemId,

              fileName:
                event.fileName,

              fileSizeBytes:
                event.fileSizeBytes,

              mimeType:
                event.mimeType,

              downloadedAt,

              source:
                event.source,
            });
          } catch {
            /*
             * Un error estadístico externo no debe revertir
             * una descarga ya entregada al navegador.
             */
          }
        }

        return true;
      },
      [
        normalizedItemId,
      ],
    );

  /* =======================================================
     CANCELAR DESCARGA
     ======================================================= */

  const cancelDownload =
    useCallback(
      (): void => {
        const runtime =
          runtimeRef.current;

        runtime.controller?.abort();

        runtimeRef.current = {
          sequence:
            runtime.sequence +
            1,

          controller:
            null,
        };

        setStatus(
          "CANCELLED",
        );

        setBlockReason(
          null,
        );

        setErrorMessage(
          null,
        );
      },
      [],
    );

  /* =======================================================
     EJECUTAR DESCARGA
     ======================================================= */

  const download =
    useCallback(
      async (): Promise<boolean> => {
        if (
          !enabled ||
          !normalizedItemId
        ) {
          const message =
            language ===
              "en"
              ? "The design does not have a valid identifier."
              : "El diseño no tiene un identificador válido.";

          return commitDownloadFailure(
            "ERROR",
            null,
            message,
            new Error(
              message,
            ),
          );
        }

        if (
          runtimeRef.current.controller
        ) {
          return false;
        }

        const preflight =
          resolveCreativeDownloadPreflight({
            contentType,

            downloadPolicy,

            authenticated,

            canDownload,

            requiresAuthentication,

            purchaseConfirmed,

            paymentPending,

            paymentRejected,

            language,
          });

        if (
          !preflight.allowed
        ) {
          setStatus(
            preflight.status,
          );

          setBlockReason(
            preflight.blockReason,
          );

          setErrorMessage(
            preflight.message,
          );

          if (
            preflight.blockReason ===
            "AUTHENTICATION_REQUIRED"
          ) {
            requestAuthentication();
          } else if (
            preflight.blockReason ===
              "PURCHASE_REQUIRED" ||
            preflight.blockReason ===
              "PAYMENT_PENDING" ||
            preflight.blockReason ===
              "PAYMENT_REJECTED"
          ) {
            notifyPurchaseRequirement(
              preflight.blockReason,
            );
          }

          return false;
        }

        releaseTemporaryObjectUrl();

        const controller =
          new AbortController();

        const sequence =
          runtimeRef.current.sequence +
          1;

        runtimeRef.current = {
          sequence,

          controller,
        };

        const startedAt =
          Date.now();

        setStatus(
          "PREPARING",
        );

        setBlockReason(
          null,
        );

        setErrorMessage(
          null,
        );

        startCallbackRef.current?.({
          itemId:
            normalizedItemId,

          startedAt,
        });

        try {
          const response =
            await fetch(
              createCreativeItemDownloadApiRoute(
                normalizedItemId,
              ),
              {
                method:
                  "GET",

                headers: {
                  Accept:
                    "application/octet-stream, application/json",
                },

                credentials:
                  "same-origin",

                cache:
                  "no-store",

                signal:
                  controller.signal,
              },
            );

          const jsonResponse =
            isCreativeDownloadJsonResponse(
              response,
            );

          const payload =
            jsonResponse
              ? await readCreativeDownloadJson(
                  response,
                )
              : null;

          if (
            !response.ok ||
            (
              payload &&
              payload.ok ===
                false
            )
          ) {
            const failure =
              resolveCreativeDownloadApiFailure(
                response,
                payload,
                language,
              );

            if (
              sequence !==
              runtimeRef.current.sequence
            ) {
              return false;
            }

            if (
              failure.blockReason ===
              "AUTHENTICATION_REQUIRED"
            ) {
              commitDownloadFailure(
                failure.status,
                failure.blockReason,
                failure.message,
                new Error(
                  failure.message,
                ),
              );

              requestAuthentication();

              return false;
            }

            if (
              failure.blockReason ===
                "PURCHASE_REQUIRED" ||
              failure.blockReason ===
                "PAYMENT_PENDING" ||
              failure.blockReason ===
                "PAYMENT_REJECTED"
            ) {
              commitDownloadFailure(
                failure.status,
                failure.blockReason,
                failure.message,
                new Error(
                  failure.message,
                ),
              );

              notifyPurchaseRequirement(
                failure.blockReason,
              );

              return false;
            }

            return commitDownloadFailure(
              failure.status,
              failure.blockReason,
              failure.message,
              new Error(
                failure.message,
              ),
            );
          }

          if (
            sequence !==
            runtimeRef.current.sequence
          ) {
            return false;
          }

          setStatus(
            "DOWNLOADING",
          );

          /* ===============================================
             RESPUESTA MEDIANTE ENLACE TEMPORAL
             =============================================== */

          if (
            jsonResponse &&
            payload &&
            payload.ok ===
              true
          ) {
            const temporaryUrl =
              normalizeCreativeDownloadUrl(
                payload.data.downloadUrl ??
                payload.data.url,
              );

            if (
              !temporaryUrl
            ) {
              const message =
                language ===
                  "en"
                  ? "The server did not return a valid download link."
                  : "El servidor no devolvió un enlace de descarga válido.";

              throw new Error(
                message,
              );
            }

            const responseFileName =
              sanitizeCreativeDownloadFileName(
                payload.data.fileName ??
                payload.data.filename,
              );

            const finalFileName =
              ensureCreativeDownloadFileExtension(
                responseFileName ||
                defaultFileName,
                payload.data.mimeType,
              );

            triggerCreativeBrowserDownload(
              temporaryUrl,
              finalFileName,
            );

            return await commitDownloadSuccess(
              sequence,
              {
                fileName:
                  finalFileName,

                fileSizeBytes:
                  normalizeCreativeDownloadFileSize(
                    payload.data.fileSizeBytes,
                  ),

                mimeType:
                  payload.data.mimeType ??
                  null,

                source:
                  "TEMPORARY_URL",
              },
            );
          }

          /* ===============================================
             RESPUESTA BINARIA DIRECTA
             =============================================== */

          const blob =
            await response.blob();

          if (
            sequence !==
            runtimeRef.current.sequence
          ) {
            return false;
          }

          if (
            blob.size <=
            0
          ) {
            const message =
              language ===
                "en"
                ? "The downloaded file is empty."
                : "El archivo descargado está vacío.";

            throw new Error(
              message,
            );
          }

          const headerFileName =
            getCreativeDownloadFileNameFromHeaders(
              response,
            );

          const responseMimeType =
            blob.type ||
            response.headers.get(
              "content-type",
            ) ||
            null;

          const finalFileName =
            ensureCreativeDownloadFileExtension(
              headerFileName ||
              defaultFileName,
              responseMimeType,
            );

          const objectUrl =
            URL.createObjectURL(
              blob,
            );

          objectUrlRef.current =
            objectUrl;

          triggerCreativeBrowserDownload(
            objectUrl,
            finalFileName,
          );

          scheduleTemporaryObjectUrlRelease();

          return await commitDownloadSuccess(
            sequence,
            {
              fileName:
                finalFileName,

              fileSizeBytes:
                blob.size,

              mimeType:
                responseMimeType,

              source:
                "BLOB",
            },
          );
        } catch (
          error
        ) {
          if (
            sequence !==
            runtimeRef.current.sequence
          ) {
            return false;
          }

          if (
            isCreativeDownloadAbortError(
              error,
            )
          ) {
            setStatus(
              "CANCELLED",
            );

            setBlockReason(
              null,
            );

            setErrorMessage(
              null,
            );

            return false;
          }

          const fallbackMessage =
            getCreativeDownloadFallbackMessage(
              "ERROR",
              language,
            );

          const resolvedMessage =
            error instanceof
              Error &&
            error.message.trim()
              ? error.message
              : fallbackMessage;

          return commitDownloadFailure(
            "ERROR",
            null,
            resolvedMessage,
            error,
          );
        } finally {
          if (
            sequence ===
            runtimeRef.current.sequence
          ) {
            runtimeRef.current = {
              sequence,

              controller:
                null,
            };
          }
        }
      },
      [
        authenticated,
        canDownload,
        commitDownloadFailure,
        commitDownloadSuccess,
        contentType,
        defaultFileName,
        downloadPolicy,
        enabled,
        language,
        normalizedItemId,
        notifyPurchaseRequirement,
        paymentPending,
        paymentRejected,
        purchaseConfirmed,
        releaseTemporaryObjectUrl,
        requestAuthentication,
        requiresAuthentication,
        scheduleTemporaryObjectUrlRelease,
      ],
    );

  /* =======================================================
     REINTENTAR
     ======================================================= */

  const retry =
    useCallback(
      async (): Promise<boolean> => {
        return download();
      },
      [
        download,
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

        setBlockReason(
          null,
        );

        setStatus(
          (
            currentStatus,
          ) => {
            if (
              currentStatus ===
                "ERROR" ||
              currentStatus ===
                "FORBIDDEN" ||
              currentStatus ===
                "UNAVAILABLE"
            ) {
              return "IDLE";
            }

            return currentStatus;
          },
        );
      },
      [],
    );

  /* =======================================================
     RESTABLECER ESTADO
     ======================================================= */

  const resetDownloadState =
    useCallback(
      (): void => {
        const runtime =
          runtimeRef.current;

        runtime.controller?.abort();

        runtimeRef.current = {
          sequence:
            runtime.sequence +
            1,

          controller:
            null,
        };

        setStatus(
          "IDLE",
        );

        setBlockReason(
          null,
        );

        setErrorMessage(
          null,
        );

        setLastDownloadedAt(
          null,
        );

        setLastFileName(
          null,
        );

        setLastFileSizeBytes(
          null,
        );

        setLastMimeType(
          null,
        );

        releaseTemporaryObjectUrl();
      },
      [
        releaseTemporaryObjectUrl,
      ],
    );

  /* =======================================================
     LIMPIEZA AL DESMONTAR
     ======================================================= */

  useEffect(
    () => {
      return () => {
        runtimeRef.current.controller?.abort();

        const cleanupTimerId =
          objectUrlCleanupTimerRef.current;

        if (
          cleanupTimerId !==
          null
        ) {
          window.clearTimeout(
            cleanupTimerId,
          );
        }

        const currentObjectUrl =
          objectUrlRef.current;

        if (
          currentObjectUrl
        ) {
          URL.revokeObjectURL(
            currentObjectUrl,
          );
        }
      };
    },
    [],
  );

  /* =======================================================
     INFORMACIÓN DERIVADA
     ======================================================= */

  const preparing =
    status ===
    "PREPARING";

  const downloading =
    status ===
    "DOWNLOADING";

  const processing =
    preparing ||
    downloading;

  const succeeded =
    status ===
    "SUCCESS";

  const cancelled =
    status ===
    "CANCELLED";

  const blocked =
    status ===
      "AUTHENTICATION_REQUIRED" ||
    status ===
      "PURCHASE_REQUIRED" ||
    status ===
      "PAYMENT_PENDING" ||
    status ===
      "PAYMENT_REJECTED" ||
    status ===
      "UNAVAILABLE" ||
    status ===
      "FORBIDDEN";

  const hasError =
    status ===
      "ERROR" ||
    errorMessage !==
      null;

  const canStartDownload =
    enabled &&
    normalizedItemId.length >
      0 &&
    !processing;

  /* =======================================================
     RETORNO
     ======================================================= */

  return {
    itemId:
      normalizedItemId,

    status,

    blockReason,

    processing,

    preparing,

    downloading,

    succeeded,

    cancelled,

    blocked,

    hasError,

    errorMessage,

    lastDownloadedAt,

    lastFileName,

    lastFileSizeBytes,

    lastMimeType,

    canStartDownload,

    download,

    retry,

    cancelDownload,

    clearError,

    resetDownloadState,

    requestAuthentication,

    requestPurchase,
  };
}