import {
  type NextRequest,
  NextResponse,
} from "next/server";

import { z } from "zod";

import {
  clearSessionCookie,
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";

import {
  isRequestOriginAllowed,
} from "@/lib/auth/origin";

import {
  getProfileBySessionToken,
  updateProfileBySessionToken,
} from "@/server/services/profile.service";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

const MAX_REQUEST_SIZE_BYTES =
  8_192;

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

const PERSON_NAME_PATTERN =
  /^[\p{L}\p{M} .'’-]+$/u;

const DISPLAY_NAME_PATTERN =
  /^[\p{L}\p{M}\p{N} ._'’-]+$/u;

const updateProfileSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(
        2,
        "Los nombres deben tener al menos 2 caracteres.",
      )
      .max(
        80,
        "Los nombres no pueden superar 80 caracteres.",
      )
      .regex(
        PERSON_NAME_PATTERN,
        "Los nombres contienen caracteres no permitidos.",
      )
      .optional(),

    lastName: z
      .string()
      .trim()
      .min(
        2,
        "Los apellidos deben tener al menos 2 caracteres.",
      )
      .max(
        80,
        "Los apellidos no pueden superar 80 caracteres.",
      )
      .regex(
        PERSON_NAME_PATTERN,
        "Los apellidos contienen caracteres no permitidos.",
      )
      .optional(),

    displayName: z
      .string()
      .trim()
      .min(
        2,
        "El nombre visible debe tener al menos 2 caracteres.",
      )
      .max(
        80,
        "El nombre visible no puede superar 80 caracteres.",
      )
      .regex(
        DISPLAY_NAME_PATTERN,
        "El nombre visible contiene caracteres no permitidos.",
      )
      .optional(),

    preferredLanguage: z
      .enum(
        [
          "es",
          "en",
        ],
        {
          message:
            "El idioma seleccionado no es válido.",
        },
      )
      .optional(),

    preferredTheme: z
      .enum(
        [
          "light",
          "dark",
        ],
        {
          message:
            "El tema seleccionado no es válido.",
        },
      )
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      Object.keys(
        data,
      ).length > 0,
    {
      message:
        "Debes enviar al menos un dato para actualizar.",

      path: [
        "form",
      ],
    },
  );

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

type UnknownRecord =
  Record<
    string,
    unknown
  >;

interface SerializedProfile {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;
  avatarUrl: string | null;

  role: string;
  status: string;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerified: boolean;
  emailVerifiedAt: string | null;

  createdAt: string | null;
  updatedAt: string | null;
}

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

function readRequiredString(
  record:
    UnknownRecord,
  propertyName:
    string,
): string {
  const value =
    record[
      propertyName
    ];

  if (
    typeof value !==
      "string"
  ) {
    throw new TypeError(
      `La propiedad ${propertyName} no existe o no es una cadena.`,
    );
  }

  return value;
}

function readNullableString(
  record:
    UnknownRecord,
  propertyName:
    string,
): string | null {
  const value =
    record[
      propertyName
    ];

  if (
    value ===
    null ||
    value ===
    undefined
  ) {
    return null;
  }

  if (
    typeof value ===
      "string"
  ) {
    return (
      value.trim() ||
      null
    );
  }

  return null;
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
 * El servicio puede devolver el perfil con alguna
 * de estas estructuras:
 *
 * {
 *   profile: usuario
 * }
 *
 * {
 *   user: usuario
 * }
 *
 * {
 *   updatedProfile: usuario
 * }
 *
 * {
 *   updatedUser: usuario
 * }
 *
 * {
 *   data: {
 *     profile: usuario
 *   }
 * }
 *
 * Esta función encuentra el registro real del usuario
 * sin forzar incorrectamente GetProfileResult o
 * UpdateProfileResult al tipo de Prisma.
 */
function findProfileRecord(
  serviceResult: unknown,
): UnknownRecord | null {
  if (
    !isRecord(
      serviceResult,
    )
  ) {
    return null;
  }

  const records:
    UnknownRecord[] = [
      serviceResult,
    ];

  for (
    let index = 0;
    index <
      records.length &&
    index < 25;
    index += 1
  ) {
    const currentRecord =
      records[
        index
      ];

    const looksLikeProfile =
      typeof currentRecord.id ===
        "string" &&
      typeof currentRecord.firstName ===
        "string" &&
      typeof currentRecord.lastName ===
        "string" &&
      typeof currentRecord.displayName ===
        "string" &&
      typeof currentRecord.email ===
        "string";

    if (
      looksLikeProfile
    ) {
      return currentRecord;
    }

    const possibleNestedValues = [
      currentRecord.profile,
      currentRecord.user,
      currentRecord.updatedProfile,
      currentRecord.updatedUser,
      currentRecord.safeUser,
      currentRecord.account,
      currentRecord.data,
      currentRecord.result,
    ];

    for (
      const nestedValue of
      possibleNestedValues
    ) {
      if (
        isRecord(
          nestedValue,
        ) &&
        !records.includes(
          nestedValue,
        )
      ) {
        records.push(
          nestedValue,
        );
      }
    }
  }

  return null;
}

function serializeProfile(
  serviceResult: unknown,
): SerializedProfile {
  const profile =
    findProfileRecord(
      serviceResult,
    );

  if (!profile) {
    throw new TypeError(
      "El servicio de perfil no devolvió un usuario válido.",
    );
  }

  const emailVerifiedAt =
    serializeDateValue(
      profile.emailVerifiedAt,
    );

  const explicitEmailVerified =
    profile.emailVerified;

  const emailVerified =
    typeof explicitEmailVerified ===
      "boolean"
      ? explicitEmailVerified
      : emailVerifiedAt !==
        null;

  return {
    id:
      readRequiredString(
        profile,
        "id",
      ),

    firstName:
      readRequiredString(
        profile,
        "firstName",
      ),

    lastName:
      readRequiredString(
        profile,
        "lastName",
      ),

    displayName:
      readRequiredString(
        profile,
        "displayName",
      ),

    email:
      readRequiredString(
        profile,
        "email",
      ),

    avatarUrl:
      readNullableString(
        profile,
        "avatarUrl",
      ),

    role:
      readRequiredString(
        profile,
        "role",
      ),

    status:
      readRequiredString(
        profile,
        "status",
      ),

    preferredLanguage:
      readRequiredString(
        profile,
        "preferredLanguage",
      ),

    preferredTheme:
      readRequiredString(
        profile,
        "preferredTheme",
      ),

    emailVerified,

    emailVerifiedAt,

    createdAt:
      serializeDateValue(
        profile.createdAt,
      ),

    updatedAt:
      serializeDateValue(
        profile.updatedAt,
      ),
  };
}

function createJsonResponse(
  body:
    ApiResponseBody,
  status:
    number,
): NextResponse {
  return NextResponse.json(
    body,
    {
      status,

      headers:
        RESPONSE_HEADERS,
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
          "Debes iniciar sesión para acceder a tu perfil.",

        en:
          "You must sign in to access your profile.",
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

function getBodySizeInBytes(
  content:
    string,
): number {
  return new TextEncoder()
    .encode(
      content,
    )
    .byteLength;
}

function getValidationFieldErrors(
  issues:
    ReadonlyArray<{
      path:
        PropertyKey[];

      message:
        string;
    }>,
): Record<
  string,
  string[]
> {
  const fieldErrors:
    Record<
      string,
      string[]
    > = {};

  for (
    const issue of
    issues
  ) {
    const firstPathSegment =
      issue.path[
        0
      ];

    const fieldName =
      typeof firstPathSegment ===
        "string"
        ? firstPathSegment
        : "form";

    fieldErrors[
      fieldName
    ] ??= [];

    if (
      !fieldErrors[
        fieldName
      ].includes(
        issue.message,
      )
    ) {
      fieldErrors[
        fieldName
      ].push(
        issue.message,
      );
    }
  }

  return fieldErrors;
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

/*
 * GET /api/perfil
 *
 * Obtiene el perfil del usuario autenticado.
 *
 * Nunca devuelve:
 *
 * - passwordHash
 * - token de sesión
 * - contador de intentos fallidos
 */
export async function GET(
  request:
    NextRequest,
): Promise<NextResponse> {
  const sessionToken =
    getSessionTokenFromRequest(
      request,
    );

  if (
    !sessionToken
  ) {
    return createUnauthenticatedResponse();
  }

  try {
    const profileResult =
      await getProfileBySessionToken(
        sessionToken,
      );

    if (
      !profileResult
    ) {
      const response =
        createUnauthenticatedResponse();

      clearSessionCookie(
        response,
      );

      return response;
    }

    const serializedProfile =
      serializeProfile(
        profileResult,
      );

    return createJsonResponse(
      {
        ok:
          true,

        code:
          "PROFILE_RETRIEVED",

        message: {
          es:
            "El perfil fue obtenido correctamente.",

          en:
            "The profile was retrieved successfully.",
        },

        data: {
          authenticated:
            true,

          profile:
            serializedProfile,
        },
      },
      200,
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA get profile route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "PROFILE_RETRIEVAL_UNAVAILABLE",

        message: {
          es:
            "No fue posible obtener el perfil en este momento.",

          en:
            "The profile could not be retrieved at this time.",
        },
      },
      503,
    );
  }
}

/*
 * PATCH /api/perfil
 *
 * Permite modificar:
 *
 * - Nombres.
 * - Apellidos.
 * - Nombre visible.
 * - Idioma preferido.
 * - Tema preferido.
 *
 * No permite modificar:
 *
 * - Correo.
 * - Contraseña.
 * - Rol.
 * - Estado.
 * - Avatar.
 */
export async function PATCH(
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
      "application/json",
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
            "La solicitud debe enviarse en formato JSON.",

          en:
            "The request must be sent in JSON format.",
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
            "La información enviada supera el tamaño permitido.",

          en:
            "The submitted information exceeds the allowed size.",
        },
      },
      413,
    );
  }

  let rawBody:
    unknown;

  try {
    const requestText =
      await request.text();

    if (
      getBodySizeInBytes(
        requestText,
      ) >
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
              "La información enviada supera el tamaño permitido.",

            en:
              "The submitted information exceeds the allowed size.",
          },
        },
        413,
      );
    }

    rawBody =
      JSON.parse(
        requestText,
      );
  } catch {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "INVALID_JSON",

        message: {
          es:
            "La información enviada no contiene un JSON válido.",

          en:
            "The submitted information does not contain valid JSON.",
        },
      },
      400,
    );
  }

  const validationResult =
    updateProfileSchema.safeParse(
      rawBody,
    );

  if (
    !validationResult.success
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "VALIDATION_ERROR",

        message: {
          es:
            "Revisa los datos del perfil.",

          en:
            "Review the profile information.",
        },

        fieldErrors:
          getValidationFieldErrors(
            validationResult
              .error
              .issues,
          ),
      },
      422,
    );
  }

  try {
    const updateResult =
      await updateProfileBySessionToken(
        sessionToken,
        validationResult.data,
        {
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

    const serializedProfile =
      serializeProfile(
        updateResult,
      );

    return createJsonResponse(
      {
        ok:
          true,

        code:
          "PROFILE_UPDATED",

        message: {
          es:
            "Tu perfil fue actualizado correctamente.",

          en:
            "Your profile was updated successfully.",
        },

        data: {
          authenticated:
            true,

          profile:
            serializedProfile,
        },
      },
      200,
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA update profile route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "PROFILE_UPDATE_UNAVAILABLE",

        message: {
          es:
            "No fue posible actualizar el perfil en este momento.",

          en:
            "The profile could not be updated at this time.",
        },
      },
      503,
    );
  }
}