import { randomUUID } from "node:crypto";
import {
  mkdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

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
  getProfileBySessionToken,
  removeAvatarBySessionToken,
  updateAvatarBySessionToken,
} from "@/server/services/profile.service";

export const runtime = "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate = 0;

const MAX_AVATAR_SIZE_BYTES =
  10 * 1024 * 1024;

const MAX_REQUEST_SIZE_BYTES =
  MAX_AVATAR_SIZE_BYTES +
  1024 * 1024;

const AVATAR_URL_PREFIX =
  "/uploads/avatars/";

const AVATAR_DIRECTORY =
  path.join(
    process.cwd(),
    "public",
    "uploads",
    "avatars",
  );

const ALLOWED_MIME_TYPES =
  new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

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

type AvatarMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp";

type AvatarExtension =
  | "jpg"
  | "png"
  | "webp";

interface DetectedAvatarType {
  mimeType:
    AvatarMimeType;

  extension:
    AvatarExtension;
}

interface LocalizedMessage {
  es: string;
  en: string;
}

function createResponse(
  ok: boolean,
  code: string,
  message:
    LocalizedMessage,
  status: number,
  data?:
    Record<
      string,
      unknown
    >,
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
    {
      ok,
      code,
      message,

      ...(data
        ? {
            data,
          }
        : {}),
    },
    {
      status,
      headers,
    },
  );
}

function createUnauthenticatedResponse(
  clearCookie = false,
): NextResponse {
  const response =
    createResponse(
      false,

      "AUTHENTICATION_REQUIRED",

      {
        es:
          "Debes iniciar sesión para modificar tu foto de perfil.",

        en:
          "You must sign in to modify your profile picture.",
      },

      401,

      {
        authenticated:
          false,

        redirectTo:
          "/iniciar-sesion",
      },
    );

  if (
    clearCookie
  ) {
    clearSessionCookie(
      response,
    );
  }

  return response;
}

function getContentLength(
  request:
    NextRequest,
): number | null {
  const rawValue =
    request.headers.get(
      "content-length",
    );

  if (
    !rawValue
  ) {
    return null;
  }

  const value =
    Number(
      rawValue,
    );

  if (
    !Number.isFinite(
      value,
    ) ||
    value < 0
  ) {
    return null;
  }

  return value;
}

function getUserAgent(
  request:
    NextRequest,
): string | null {
  const value =
    request.headers
      .get(
        "user-agent",
      )
      ?.trim();

  if (
    !value
  ) {
    return null;
  }

  return value.slice(
    0,
    512,
  );
}

function hasBytes(
  bytes:
    Uint8Array,
  signature:
    readonly number[],
  offset = 0,
): boolean {
  if (
    bytes.length <
    offset +
      signature.length
  ) {
    return false;
  }

  return signature.every(
    (
      byte,
      index,
    ) =>
      bytes[
        offset +
          index
      ] ===
      byte,
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
    hasBytes(
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
    hasBytes(
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
   * RIFF....WEBP
   */
  const isWebP =
    hasBytes(
      bytes,
      [
        0x52,
        0x49,
        0x46,
        0x46,
      ],
    ) &&
    hasBytes(
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

function normalizeMimeType(
  value:
    string,
): string {
  const mimeType =
    value
      .trim()
      .toLowerCase();

  if (
    mimeType ===
    "image/jpg"
  ) {
    return "image/jpeg";
  }

  return mimeType;
}

function isFile(
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

function createAvatarFileName(
  userId:
    string,
  extension:
    AvatarExtension,
): string {
  const safeUserId =
    userId.replace(
      /[^a-zA-Z0-9_-]/g,
      "",
    ) ||
    "user";

  return [
    safeUserId,
    "-",
    randomUUID(),
    ".",
    extension,
  ].join("");
}

function resolveLocalAvatarPath(
  avatarUrl:
    string | null,
): string | null {
  if (
    !avatarUrl?.startsWith(
      AVATAR_URL_PREFIX,
    )
  ) {
    return null;
  }

  const fileName =
    avatarUrl
      .slice(
        AVATAR_URL_PREFIX.length,
      )
      .split(
        /[?#]/,
        1,
      )[0]
      ?.trim();

  if (
    !fileName ||
    fileName.includes(
      "/",
    ) ||
    fileName.includes(
      "\\",
    ) ||
    !/^[a-zA-Z0-9._-]+$/.test(
      fileName,
    )
  ) {
    return null;
  }

  return path.join(
    AVATAR_DIRECTORY,
    fileName,
  );
}

async function deleteLocalAvatar(
  avatarUrl:
    string | null,
): Promise<void> {
  const filePath =
    resolveLocalAvatarPath(
      avatarUrl,
    );

  if (
    !filePath
  ) {
    return;
  }

  try {
    await unlink(
      filePath,
    );
  } catch (
    error: unknown
  ) {
    const errorCode =
      typeof error ===
        "object" &&
      error !==
        null &&
      "code" in error
        ? String(
            error.code,
          )
        : "";

    /*
     * Si el archivo ya no existe,
     * no se considera un error.
     */
    if (
      errorCode !==
      "ENOENT"
    ) {
      console.warn(
        "FIXORA could not delete an avatar file:",
        error,
      );
    }
  }
}

async function getCurrentProfile(
  sessionToken:
    string,
) {
  const result =
    await getProfileBySessionToken(
      sessionToken,
    );

  if (
    result.status !==
    "authenticated"
  ) {
    return null;
  }

  return result.profile;
}

function createRateLimitResponse(
  retryAfterSeconds:
    number,
): NextResponse {
  const safeSeconds =
    Number.isFinite(
      retryAfterSeconds,
    ) &&
    retryAfterSeconds >=
      1
      ? Math.ceil(
          retryAfterSeconds,
        )
      : 1;

  return createResponse(
    false,

    "RATE_LIMITED",

    {
      es:
        "Se realizaron demasiados cambios de imagen. Inténtalo más tarde.",

      en:
        "Too many profile picture changes were made. Try again later.",
    },

    429,

    {
      retryAfterSeconds:
        safeSeconds,
    },

    {
      "Retry-After":
        String(
          safeSeconds,
        ),
    },
  );
}

/*
 * POST /api/perfil/avatar
 *
 * Guarda una nueva foto para el usuario o
 * administrador que tiene la sesión activa.
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
    return createResponse(
      false,

      "UNTRUSTED_ORIGIN",

      {
        es:
          "La solicitud no proviene de un origen autorizado.",

        en:
          "The request does not come from an authorized origin.",
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
    return createResponse(
      false,

      "UNSUPPORTED_MEDIA_TYPE",

      {
        es:
          "La imagen debe enviarse mediante multipart/form-data.",

        en:
          "The image must be sent using multipart/form-data.",
      },

      415,
    );
  }

  const contentLength =
    getContentLength(
      request,
    );

  if (
    contentLength !==
      null &&
    contentLength >
      MAX_REQUEST_SIZE_BYTES
  ) {
    return createResponse(
      false,

      "REQUEST_TOO_LARGE",

      {
        es:
          "La imagen supera el tamaño máximo permitido de 10 MB.",

        en:
          "The image exceeds the maximum allowed size of 10 MB.",
      },

      413,
    );
  }

  const rateLimit =
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
    !rateLimit.allowed
  ) {
    return createRateLimitResponse(
      rateLimit
        .retryAfterSeconds,
    );
  }

  let formData:
    FormData;

  try {
    formData =
      await request.formData();
  } catch {
    return createResponse(
      false,

      "INVALID_FORM_DATA",

      {
        es:
          "No fue posible leer el archivo enviado.",

        en:
          "The submitted file could not be read.",
      },

      400,
    );
  }

  const avatarFile =
    formData.get(
      "avatar",
    );

  if (
    !isFile(
      avatarFile,
    ) ||
    avatarFile.size <
      1
  ) {
    return createResponse(
      false,

      "AVATAR_REQUIRED",

      {
        es:
          "Debes seleccionar una imagen válida.",

        en:
          "You must select a valid image.",
      },

      422,
    );
  }

  if (
    avatarFile.size >
    MAX_AVATAR_SIZE_BYTES
  ) {
    return createResponse(
      false,

      "AVATAR_FILE_TOO_LARGE",

      {
        es:
          "La imagen no puede superar los 10 MB.",

        en:
          "The image cannot exceed 10 MB.",
      },

      413,
    );
  }

  const declaredMimeType =
    normalizeMimeType(
      avatarFile.type,
    );

  if (
    !ALLOWED_MIME_TYPES.has(
      declaredMimeType,
    )
  ) {
    return createResponse(
      false,

      "UNSUPPORTED_AVATAR_FORMAT",

      {
        es:
          "La foto debe estar en formato JPG, PNG o WebP.",

        en:
          "The picture must be in JPG, PNG, or WebP format.",
      },

      415,
    );
  }

  let bytes:
    Uint8Array;

  try {
    bytes =
      new Uint8Array(
        await avatarFile.arrayBuffer(),
      );
  } catch {
    return createResponse(
      false,

      "AVATAR_READ_FAILED",

      {
        es:
          "No fue posible leer la imagen seleccionada.",

        en:
          "The selected image could not be read.",
      },

      400,
    );
  }

  const detectedType =
    detectAvatarType(
      bytes,
    );

  if (
    !detectedType ||
    detectedType.mimeType !==
      declaredMimeType
  ) {
    return createResponse(
      false,

      "INVALID_AVATAR_FILE",

      {
        es:
          "El archivo no contiene una imagen JPG, PNG o WebP válida.",

        en:
          "The file does not contain a valid JPG, PNG, or WebP image.",
      },

      415,
    );
  }

  let savedFilePath:
    string | null =
      null;

  try {
    const currentProfile =
      await getCurrentProfile(
        sessionToken,
      );

    if (
      !currentProfile
    ) {
      return createUnauthenticatedResponse(
        true,
      );
    }

    /*
     * Crea automáticamente:
     *
     * public/uploads/avatars
     */
    await mkdir(
      AVATAR_DIRECTORY,
      {
        recursive:
          true,
      },
    );

    const fileName =
      createAvatarFileName(
        currentProfile.id,
        detectedType.extension,
      );

    savedFilePath =
      path.join(
        AVATAR_DIRECTORY,
        fileName,
      );

    await writeFile(
      savedFilePath,
      bytes,
      {
        /*
         * Evita reemplazar accidentalmente
         * un archivo existente.
         */
        flag:
          "wx",
      },
    );

    const newAvatarUrl =
      `${AVATAR_URL_PREFIX}${fileName}`;

    /*
     * El servicio de perfil sí espera avatarUrl.
     * Este era el error del código anterior.
     */
    const result =
      await updateAvatarBySessionToken(
        sessionToken,

        {
          avatarUrl:
            newAvatarUrl,
        },

        {
          ipHash:
            rateLimit.identifierHash,

          userAgent:
            getUserAgent(
              request,
            ),
        },
      );

    if (
      result.status ===
        "invalid-session" ||
      result.status ===
        "account-unavailable"
    ) {
      await deleteLocalAvatar(
        newAvatarUrl,
      );

      return createUnauthenticatedResponse(
        true,
      );
    }

    /*
     * La base ya contiene la URL nueva.
     * Ahora se elimina la imagen anterior.
     */
    await deleteLocalAvatar(
      currentProfile.avatarUrl,
    );

    return createResponse(
      true,

      "AVATAR_UPDATED",

      {
        es:
          "Tu foto de perfil fue actualizada correctamente.",

        en:
          "Your profile picture was updated successfully.",
      },

      200,

      {
        avatarUrl:
          result.profile.avatarUrl,

        updatedAt:
          result.profile.updatedAt.toISOString(),
      },
    );
  } catch (
    error: unknown
  ) {
    /*
     * Si falló la base de datos después de
     * crear el archivo, elimina el archivo nuevo.
     */
    if (
      savedFilePath
    ) {
      try {
        await unlink(
          savedFilePath,
        );
      } catch {
        /*
         * El archivo pudo haber sido eliminado
         * previamente.
         */
      }
    }

    console.error(
      "FIXORA update avatar route error:",
      error,
    );

    return createResponse(
      false,

      "AVATAR_UPDATE_UNAVAILABLE",

      {
        es:
          "No fue posible actualizar la foto de perfil en este momento.",

        en:
          "The profile picture could not be updated at this time.",
      },

      503,
    );
  }
}

/*
 * DELETE /api/perfil/avatar
 *
 * Elimina la imagen física y establece
 * avatarUrl en null.
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
    return createResponse(
      false,

      "UNTRUSTED_ORIGIN",

      {
        es:
          "La solicitud no proviene de un origen autorizado.",

        en:
          "The request does not come from an authorized origin.",
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

  const rateLimit =
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
    !rateLimit.allowed
  ) {
    return createRateLimitResponse(
      rateLimit
        .retryAfterSeconds,
    );
  }

  try {
    const currentProfile =
      await getCurrentProfile(
        sessionToken,
      );

    if (
      !currentProfile
    ) {
      return createUnauthenticatedResponse(
        true,
      );
    }

    const result =
      await removeAvatarBySessionToken(
        sessionToken,

        {
          ipHash:
            rateLimit.identifierHash,

          userAgent:
            getUserAgent(
              request,
            ),
        },
      );

    if (
      result.status ===
        "invalid-session" ||
      result.status ===
        "account-unavailable"
    ) {
      return createUnauthenticatedResponse(
        true,
      );
    }

    await deleteLocalAvatar(
      currentProfile.avatarUrl,
    );

    return createResponse(
      true,

      "AVATAR_REMOVED",

      {
        es:
          "Tu foto de perfil fue eliminada correctamente.",

        en:
          "Your profile picture was removed successfully.",
      },

      200,

      {
        avatarUrl:
          null,

        updatedAt:
          result.profile.updatedAt.toISOString(),
      },
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA remove avatar route error:",
      error,
    );

    return createResponse(
      false,

      "AVATAR_REMOVE_UNAVAILABLE",

      {
        es:
          "No fue posible eliminar la foto de perfil en este momento.",

        en:
          "The profile picture could not be removed at this time.",
      },

      503,
    );
  }
}