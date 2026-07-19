import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  clearSessionCookie,
} from "@/lib/auth/cookies";

import {
  isRequestOriginAllowed as isTrustedRequestOrigin,
} from "@/lib/auth/origin";

import {
  checkRateLimit,
} from "@/lib/auth/rate-limit";

import {
  resetPasswordSchema,
} from "@/schemas/auth/reset-password.schema";

import {
  resetPassword,
} from "@/server/services/password-reset.service";

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
    "no-store, no-cache, must-revalidate, proxy-revalidate",

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
      issue.path[0];

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
      ?.replace(
        /[\u0000-\u001F\u007F]+/g,
        " ",
      )
      .trim()
      .replace(
        /\s+/g,
        " ",
      );

  if (
    !userAgent
  ) {
    return null;
  }

  return userAgent.slice(
    0,
    500,
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

/*
 * POST /api/auth/restablecer-password
 *
 * Recibe:
 *
 * - email
 * - code
 * - password
 * - confirmPassword
 *
 * Cuando la operación termina correctamente:
 *
 * - Se reemplaza el hash de la contraseña.
 * - Se actualiza passwordChangedAt.
 * - Se consume el código de recuperación.
 * - Se revocan todas las sesiones existentes.
 * - Se reinicia el contador de intentos fallidos.
 * - Se elimina la cookie local del navegador.
 */
export async function POST(
  request:
    NextRequest,
): Promise<NextResponse> {
  if (
    !isTrustedRequestOrigin(
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

  const rateLimitResult =
    await checkRateLimit({
      request,

      namespace:
        "auth:reset-password",

      limit:
        5,

      windowMs:
        30 *
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
            "Se realizaron demasiados intentos. Inténtalo nuevamente más tarde.",

          en:
            "Too many attempts were made. Please try again later.",
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
    resetPasswordSchema.safeParse(
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
            "Revisa el código y la nueva contraseña.",

          en:
            "Review the code and the new password.",
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
    const resetResult =
      await resetPassword(
        validationResult.data,
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

    switch (
      resetResult.status
    ) {
      case "password-reset": {
        const response =
          createJsonResponse(
            {
              ok:
                true,

              code:
                "PASSWORD_RESET_SUCCESSFUL",

              message: {
                es:
                  "Tu contraseña fue restablecida correctamente. Inicia sesión nuevamente.",

                en:
                  "Your password was reset successfully. Sign in again.",
              },

              data: {
                passwordReset:
                  true,

                sessionsRevoked:
                  resetResult
                    .sessionsRevoked,

                redirectTo:
                  "/iniciar-sesion",
              },
            },
            200,
          );

        /*
         * Todas las sesiones anteriores fueron
         * revocadas, por lo que eliminamos cualquier
         * cookie que todavía exista en este navegador.
         */
        clearSessionCookie(
          response,
        );

        return response;
      }

      case "password-reused": {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "PASSWORD_ALREADY_IN_USE",

            message: {
              es:
                "La nueva contraseña debe ser diferente de la contraseña actual.",

              en:
                "The new password must be different from the current password.",
            },

            fieldErrors: {
              password: [
                "La nueva contraseña debe ser diferente de la contraseña actual.",
              ],
            },
          },
          422,
        );
      }

      case "code-expired": {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "CODE_EXPIRED",

            message: {
              es:
                "El código de recuperación venció. Solicita uno nuevo.",

              en:
                "The recovery code has expired. Request a new one.",
            },

            data: {
              requestNewCode:
                true,

              redirectTo:
                "/recuperar-password",
            },
          },
          410,
        );
      }

      case "attempts-exceeded": {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "RECOVERY_ATTEMPTS_EXCEEDED",

            message: {
              es:
                "Se superó el número permitido de intentos. Solicita un código nuevo.",

              en:
                "The allowed number of attempts was exceeded. Request a new code.",
            },

            data: {
              requestNewCode:
                true,

              redirectTo:
                "/recuperar-password",
            },
          },
          429,
        );
      }

      case "invalid-code": {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "INVALID_RECOVERY_CODE",

            message: {
              es:
                "El código ingresado es incorrecto.",

              en:
                "The entered recovery code is incorrect.",
            },

            data: {
              invalidCode:
                true,
            },
          },
          400,
        );
      }

      case "account-unavailable": {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "PASSWORD_RESET_UNAVAILABLE",

            message: {
              es:
                "No fue posible restablecer la contraseña de esta cuenta.",

              en:
                "The password for this account could not be reset.",
            },
          },
          400,
        );
      }

      case "not-found":
      default: {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "INVALID_RECOVERY_REQUEST",

            message: {
              es:
                "No fue posible validar la solicitud de recuperación.",

              en:
                "The recovery request could not be validated.",
            },
          },
          400,
        );
      }
    }
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA reset password route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "PASSWORD_RESET_UNAVAILABLE",

        message: {
          es:
            "No fue posible restablecer la contraseña en este momento. Inténtalo nuevamente más tarde.",

          en:
            "The password could not be reset at this time. Please try again later.",
        },
      },
      503,
    );
  }
}