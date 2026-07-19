import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  clearSessionCookie,
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";

import {
  isRequestOriginAllowed,
} from "@/lib/auth/origin";

import {
  checkRateLimit,
} from "@/lib/auth/rate-limit";

import {
  removeAvatarBySessionToken,
  updateAvatarBySessionToken,
} from "@/server/services/profile.service";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

const MAX_AVATAR_SIZE_BYTES =
  5 * 1024 * 1024;

const MAX_REQUEST_SIZE_BYTES =
  MAX_AVATAR_SIZE_BYTES +
  128 * 1024;

const RESPONSE_HEADERS = {
  "Cache-Control":
    "private, no-store, no-cache, max-age=0, must-revalidate",

  Pragma:
    "no-cache",

  Expires:
    "0",

  "Referrer-Policy":
    "no-referrer",

  "X-Content-Type-Options":
    "nosniff",

  "Cross-Origin-Resource-Policy":
    "same-origin",

  Vary:
    "Cookie",
} as const;

const ALLOWED_MIME_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

type SupportedAvatarMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp";

type SupportedAvatarExtension =
  | "jpg"
  | "png"
  | "webp";

interface DetectedAvatarType {
  mimeType:
    SupportedAvatarMimeType;

  extension:
    SupportedAvatarExtension;
}

interface LocalizedMessage {
  es: string;
  en: string;
}

interface ApiResponseBody {
  ok: boolean;
  code: string;

  message:
    LocalizedMessage;

  data?:
    Record<
      string,
      unknown
    >;

  fieldErrors?:
    Record<
      string,
      string[]
    >;
}

interface AvatarResponseData {
  avatarUrl:
    string | null;

  updatedAt:
    string | null;
}

type UnknownRecord =
  Record<
    string,
    unknown
  >;

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    typeof value ===
      "object" &&
    value !==
      null &&
    !Array.isArray(
      value,
    )
  );
}

function serializeDateValue(
  value: unknown,
): string | null {
  if (
    value instanceof
    Date
  ) {
    if (
      Number.isNaN(
        value.getTime(),
      )
    ) {
      return null;
    }

    return value.toISOString();
  }

  if (
    typeof value !==
      "string" &&
    typeof value !==
      "number"
  ) {
    return null;
  }

  const parsedDate =
    new Date(
      value,
    );

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return null;
  }

  return parsedDate.toISOString();
}

/*
 * El servicio de perfil puede devolver el usuario
 * actualizado dentro de diferentes propiedades,
 * por ejemplo:
 *
 * - result.user
 * - result.profile
 * - result.updatedUser
 * - result.updatedProfile
 * - result.data.user
 *
 * Esta función obtiene avatarUrl y updatedAt sin
 * forzar un tipo incorrecto sobre el resultado real
 * del servicio.
 */
function getAvatarResponseData(
  serviceResult: unknown,
): AvatarResponseData {
  const records:
    UnknownRecord[] = [];

  const appendRecord = (
    value: unknown,
  ): void => {
    if (
      !isRecord(
        value,
      ) ||
      records.includes(
        value,
      )
    ) {
      return;
    }

    records.push(
      value,
    );
  };

  appendRecord(
    serviceResult,
  );

  /*
   * Recorremos solamente propiedades conocidas
   * relacionadas con resultados de servicios.
   */
  for (
    let index = 0;
    index < records.length &&
    index < 20;
    index += 1
  ) {
    const record =
      records[index];

    appendRecord(
      record.user,
    );

    appendRecord(
      record.profile,
    );

    appendRecord(
      record.updatedUser,
    );

    appendRecord(
      record.updatedProfile,
    );

    appendRecord(
      record.data,
    );

    appendRecord(
      record.result,
    );
  }

  let avatarUrl:
    string | null = null;

  let avatarUrlWasFound =
    false;

  let updatedAt:
    string | null = null;

  for (
    const record of
    records
  ) {
    if (
      !avatarUrlWasFound &&
      Object.prototype.hasOwnProperty.call(
        record,
        "avatarUrl",
      )
    ) {
      const candidateAvatarUrl =
        record.avatarUrl;

      if (
        typeof candidateAvatarUrl ===
          "string"
      ) {
        avatarUrl =
          candidateAvatarUrl.trim() ||
          null;

        avatarUrlWasFound =
          true;
      } else if (
        candidateAvatarUrl ===
        null
      ) {
        avatarUrl =
          null;

        avatarUrlWasFound =
          true;
      }
    }

    if (
      updatedAt ===
      null
    ) {
      updatedAt =
        serializeDateValue(
          record.updatedAt,
        );
    }

    if (
      avatarUrlWasFound &&
      updatedAt !==
        null
    ) {
      break;
    }
  }

  return {
    avatarUrl,
    updatedAt,
  };
}

function createJsonResponse(
  body:
    ApiResponseBody,
  status:
    number,
  additionalHeaders?:
    HeadersInit,
): NextResponse {
  const headers =
    new Headers(
      RESPONSE_HEADERS,
    );

  if (
    additionalHeaders
  ) {
    const extraHeaders =
      new Headers(
        additionalHeaders,
      );

    extraHeaders.forEach(
      (
        value,
        key,
      ) => {
        headers.set(
          key,
          value,
        );
      },
    );
  }

  return NextResponse.json(
    body,
    {
      status,
      headers,
    },
  );
}

function createUnauthenticatedResponse():
  NextResponse {
  return createJsonResponse(
    {
      ok:
        false,

      code:
        "AUTHENTICATION_REQUIRED",

      message: {
        es:
          "Debes iniciar sesión para modificar tu avatar.",

        en:
          "You must sign in to modify your avatar.",
      },

      data: {
        authenticated:
          false,

        redirectTo:
          "/iniciar-sesion",
      },
    },
    401,
  );
}

function getDeclaredContentLength(
  request:
    NextRequest,
): number | null {
  const contentLengthHeader =
    request.headers.get(
      "content-length",
    );

  if (
    !contentLengthHeader
  ) {
    return null;
  }

  const contentLength =
    Number(
      contentLengthHeader,
    );

  if (
    !Number.isFinite(
      contentLength,
    ) ||
    contentLength <
      0
  ) {
    return null;
  }

  return contentLength;
}

function getSanitizedUserAgent(
  request:
    NextRequest,
): string | null {
  const userAgent =
    request.headers
      .get(
        "user-agent",
      )
      ?.trim();

  if (
    !userAgent
  ) {
    return null;
  }

  return userAgent.slice(
    0,
    512,
  );
}

function normalizeRetryAfterSeconds(
  value:
    number,
): number {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <
      1
  ) {
    return 1;
  }

  return Math.ceil(
    value,
  );
}

function hasMatchingBytes(
  bytes:
    Uint8Array,
  expectedBytes:
    readonly number[],
  offset =
    0,
): boolean {
  if (
    bytes.length <
    offset +
      expectedBytes.length
  ) {
    return false;
  }

  return expectedBytes.every(
    (
      expectedByte,
      index,
    ) =>
      bytes[
        offset +
          index
      ] ===
      expectedByte,
  );
}

function detectAvatarType(
  bytes:
    Uint8Array,
): DetectedAvatarType | null {
  /*
   * JPEG:
   * FF D8 FF
   */
  if (
    hasMatchingBytes(
      bytes,
      [
        0xff,
        0xd8,
        0xff,
      ],
    )
  ) {
    return {
      mimeType:
        "image/jpeg",

      extension:
        "jpg",
    };
  }

  /*
   * PNG:
   * 89 50 4E 47 0D 0A 1A 0A
   */
  if (
    hasMatchingBytes(
      bytes,
      [
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a,
      ],
    )
  ) {
    return {
      mimeType:
        "image/png",

      extension:
        "png",
    };
  }

  /*
   * WebP:
   *
   * RIFF....WEBP
   */
  const isWebP =
    hasMatchingBytes(
      bytes,
      [
        0x52,
        0x49,
        0x46,
        0x46,
      ],
      0,
    ) &&
    hasMatchingBytes(
      bytes,
      [
        0x57,
        0x45,
        0x42,
        0x50,
      ],
      8,
    );

  if (
    isWebP
  ) {
    return {
      mimeType:
        "image/webp",

      extension:
        "webp",
    };
  }

  return null;
}

function isFileValue(
  value:
    FormDataEntryValue | null,
): value is File {
  return (
    typeof File !==
      "undefined" &&
    value instanceof
      File
  );
}

/*
 * POST /api/perfil/avatar
 *
 * El formulario multipart/form-data debe contener:
 *
 * avatar: File
 */
export async function POST(
  request:
    NextRequest,
): Promise<NextResponse> {
  if (
    !isRequestOriginAllowed(
      request,
    )
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "UNTRUSTED_ORIGIN",

        message: {
          es:
            "La solicitud no proviene de un origen autorizado.",

          en:
            "The request does not come from an authorized origin.",
        },
      },
      403,
    );
  }

  const sessionToken =
    getSessionTokenFromRequest(
      request,
    );

  if (
    !sessionToken
  ) {
    return createUnauthenticatedResponse();
  }

  const contentType =
    request.headers
      .get(
        "content-type",
      )
      ?.toLowerCase() ??
    "";

  if (
    !contentType.includes(
      "multipart/form-data",
    )
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "UNSUPPORTED_MEDIA_TYPE",

        message: {
          es:
            "El avatar debe enviarse mediante un formulario multipart/form-data.",

          en:
            "The avatar must be sent using a multipart/form-data form.",
        },
      },
      415,
    );
  }

  const declaredContentLength =
    getDeclaredContentLength(
      request,
    );

  if (
    declaredContentLength !==
      null &&
    declaredContentLength >
      MAX_REQUEST_SIZE_BYTES
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "REQUEST_TOO_LARGE",

        message: {
          es:
            "La imagen supera el tamaño máximo permitido de 5 MB.",

          en:
            "The image exceeds the maximum allowed size of 5 MB.",
        },
      },
      413,
    );
  }

  const rateLimitResult =
    await checkRateLimit({
      request,

      namespace:
        "profile:avatar-upload",

      limit:
        10,

      windowMs:
        60 *
        60 *
        1_000,
    });

  if (
    !rateLimitResult.allowed
  ) {
    const retryAfterSeconds =
      normalizeRetryAfterSeconds(
        rateLimitResult
          .retryAfterSeconds,
      );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "RATE_LIMITED",

        message: {
          es:
            "Se realizaron demasiados cambios de avatar. Inténtalo nuevamente más tarde.",

          en:
            "Too many avatar changes were made. Please try again later.",
        },

        data: {
          retryAfterSeconds,
        },
      },
      429,
      {
        "Retry-After":
          String(
            retryAfterSeconds,
          ),
      },
    );
  }

  let formData:
    FormData;

  try {
    formData =
      await request.formData();
  } catch {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "INVALID_FORM_DATA",

        message: {
          es:
            "No fue posible leer el archivo enviado.",

          en:
            "The submitted file could not be read.",
        },
      },
      400,
    );
  }

  const avatarField =
    formData.get(
      "avatar",
    );

  if (
    !isFileValue(
      avatarField,
    )
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "AVATAR_REQUIRED",

        message: {
          es:
            "Debes seleccionar una imagen para tu avatar.",

          en:
            "You must select an image for your avatar.",
        },

        fieldErrors: {
          avatar: [
            "Debes seleccionar una imagen.",
          ],
        },
      },
      422,
    );
  }

  if (
    avatarField.size <
    1
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "EMPTY_AVATAR_FILE",

        message: {
          es:
            "La imagen seleccionada está vacía.",

          en:
            "The selected image is empty.",
        },

        fieldErrors: {
          avatar: [
            "El archivo está vacío.",
          ],
        },
      },
      422,
    );
  }

  if (
    avatarField.size >
    MAX_AVATAR_SIZE_BYTES
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "AVATAR_FILE_TOO_LARGE",

        message: {
          es:
            "La imagen no puede superar los 5 MB.",

          en:
            "The image cannot exceed 5 MB.",
        },

        fieldErrors: {
          avatar: [
            "El tamaño máximo permitido es de 5 MB.",
          ],
        },
      },
      413,
    );
  }

  const declaredMimeType =
    avatarField.type
      .trim()
      .toLowerCase();

  if (
    !ALLOWED_MIME_TYPES.has(
      declaredMimeType,
    )
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "UNSUPPORTED_AVATAR_FORMAT",

        message: {
          es:
            "El avatar debe ser una imagen JPG, PNG o WebP.",

          en:
            "The avatar must be a JPG, PNG, or WebP image.",
        },

        fieldErrors: {
          avatar: [
            "Formato permitido: JPG, PNG o WebP.",
          ],
        },
      },
      415,
    );
  }

  let avatarBytes:
    Uint8Array;

  try {
    avatarBytes =
      new Uint8Array(
        await avatarField.arrayBuffer(),
      );
  } catch {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "AVATAR_READ_FAILED",

        message: {
          es:
            "No fue posible leer la imagen seleccionada.",

          en:
            "The selected image could not be read.",
        },
      },
      400,
    );
  }

  const detectedAvatarType =
    detectAvatarType(
      avatarBytes,
    );

  if (
    !detectedAvatarType ||
    detectedAvatarType.mimeType !==
      declaredMimeType
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "INVALID_AVATAR_FILE",

        message: {
          es:
            "El archivo seleccionado no contiene una imagen válida.",

          en:
            "The selected file does not contain a valid image.",
        },

        fieldErrors: {
          avatar: [
            "El contenido del archivo no coincide con una imagen válida.",
          ],
        },
      },
      415,
    );
  }

  try {
    const updateResult =
      await updateAvatarBySessionToken(
        sessionToken,
        {
          bytes:
            avatarBytes,

          mimeType:
            detectedAvatarType
              .mimeType,

          extension:
            detectedAvatarType
              .extension,

          size:
            avatarField.size,
        },
        {
          ipHash:
            rateLimitResult
              .identifierHash,

          userAgent:
            getSanitizedUserAgent(
              request,
            ),
        },
      );

    if (
      !updateResult
    ) {
      const response =
        createUnauthenticatedResponse();

      clearSessionCookie(
        response,
      );

      return response;
    }

    const avatarData =
      getAvatarResponseData(
        updateResult,
      );

    return createJsonResponse(
      {
        ok:
          true,

        code:
          "AVATAR_UPDATED",

        message: {
          es:
            "Tu avatar fue actualizado correctamente.",

          en:
            "Your avatar was updated successfully.",
        },

        data: {
          avatarUrl:
            avatarData.avatarUrl,

          ...(avatarData.updatedAt
            ? {
                updatedAt:
                  avatarData.updatedAt,
              }
            : {}),
        },
      },
      200,
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA update avatar route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "AVATAR_UPDATE_UNAVAILABLE",

        message: {
          es:
            "No fue posible actualizar el avatar en este momento.",

          en:
            "The avatar could not be updated at this time.",
        },
      },
      503,
    );
  }
}

/*
 * DELETE /api/perfil/avatar
 *
 * Elimina el archivo actual y establece
 * avatarUrl como null.
 */
export async function DELETE(
  request:
    NextRequest,
): Promise<NextResponse> {
  if (
    !isRequestOriginAllowed(
      request,
    )
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "UNTRUSTED_ORIGIN",

        message: {
          es:
            "La solicitud no proviene de un origen autorizado.",

          en:
            "The request does not come from an authorized origin.",
        },
      },
      403,
    );
  }

  const sessionToken =
    getSessionTokenFromRequest(
      request,
    );

  if (
    !sessionToken
  ) {
    return createUnauthenticatedResponse();
  }

  const rateLimitResult =
    await checkRateLimit({
      request,

      namespace:
        "profile:avatar-delete",

      limit:
        20,

      windowMs:
        60 *
        60 *
        1_000,
    });

  if (
    !rateLimitResult.allowed
  ) {
    const retryAfterSeconds =
      normalizeRetryAfterSeconds(
        rateLimitResult
          .retryAfterSeconds,
      );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "RATE_LIMITED",

        message: {
          es:
            "Se realizaron demasiadas solicitudes. Inténtalo nuevamente más tarde.",

          en:
            "Too many requests were made. Please try again later.",
        },

        data: {
          retryAfterSeconds,
        },
      },
      429,
      {
        "Retry-After":
          String(
            retryAfterSeconds,
          ),
      },
    );
  }

  try {
    const removeResult =
      await removeAvatarBySessionToken(
        sessionToken,
        {
          ipHash:
            rateLimitResult
              .identifierHash,

          userAgent:
            getSanitizedUserAgent(
              request,
            ),
        },
      );

    if (
      !removeResult
    ) {
      const response =
        createUnauthenticatedResponse();

      clearSessionCookie(
        response,
      );

      return response;
    }

    const avatarData =
      getAvatarResponseData(
        removeResult,
      );

    return createJsonResponse(
      {
        ok:
          true,

        code:
          "AVATAR_REMOVED",

        message: {
          es:
            "Tu avatar fue eliminado correctamente.",

          en:
            "Your avatar was removed successfully.",
        },

        data: {
          avatarUrl:
            null,

          ...(avatarData.updatedAt
            ? {
                updatedAt:
                  avatarData.updatedAt,
              }
            : {}),
        },
      },
      200,
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA remove avatar route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "AVATAR_REMOVE_UNAVAILABLE",

        message: {
          es:
            "No fue posible eliminar el avatar en este momento.",

          en:
            "The avatar could not be removed at this time.",
        },
      },
      503,
    );
  }
}