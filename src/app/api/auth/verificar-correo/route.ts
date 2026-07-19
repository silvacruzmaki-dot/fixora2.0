import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  isRequestOriginAllowed as isTrustedRequestOrigin,
} from "@/lib/auth/origin";

import {
  checkRateLimit,
} from "@/lib/auth/rate-limit";

import {
  verifyEmailSchema,
} from "@/schemas/auth/verify-email.schema";

import {
  verifyEmailCode,
} from "@/server/services/verification.service";

/*
 * La verificación utiliza Prisma y SQL Server,
 * por lo que debe ejecutarse mediante Node.js.
 */
export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

const MAX_REQUEST_SIZE_BYTES =
  4_096;

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
 * POST /api/auth/verificar-correo
 *
 * Recibe:
 *
 * - email
 * - code
 *
 * Cuando el código es correcto:
 *
 * - Marca el correo como verificado.
 * - Activa la cuenta.
 * - Consume el código utilizado.
 * - Invalida los demás códigos pendientes.
 * - Redirige al usuario al inicio de sesión.
 *
 * La verificación no crea automáticamente
 * una sesión de usuario.
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
        "auth:verify-email",

      limit:
        10,

      windowMs:
        15 *
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
            "Se realizaron demasiados intentos de verificación. Inténtalo nuevamente más tarde.",

          en:
            "Too many verification attempts were made. Please try again later.",
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
    verifyEmailSchema.safeParse(
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
            "Revisa el correo y el código ingresado.",

          en:
            "Review the email and verification code.",
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
    const verificationResult =
      await verifyEmailCode(
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
      verificationResult.status
    ) {
      case "verified": {
        return createJsonResponse(
          {
            ok:
              true,

            code:
              "EMAIL_VERIFIED",

            message: {
              es:
                "Tu correo fue verificado correctamente. Ya puedes iniciar sesión.",

              en:
                "Your email was verified successfully. You can now sign in.",
            },

            data: {
              verified:
                true,

              maskedEmail:
                verificationResult
                  .maskedEmail,

              notificationCreated:
                verificationResult
                  .notificationCreated,

              user: {
                id:
                  verificationResult
                    .user
                    .id,

                firstName:
                  verificationResult
                    .user
                    .firstName,

                lastName:
                  verificationResult
                    .user
                    .lastName,

                displayName:
                  verificationResult
                    .user
                    .displayName,

                email:
                  verificationResult
                    .user
                    .email,

                avatarUrl:
                  verificationResult
                    .user
                    .avatarUrl,

                role:
                  verificationResult
                    .user
                    .role,

                status:
                  verificationResult
                    .user
                    .status,

                preferredLanguage:
                  verificationResult
                    .user
                    .preferredLanguage,

                preferredTheme:
                  verificationResult
                    .user
                    .preferredTheme,

                emailVerified:
                  verificationResult
                    .user
                    .emailVerifiedAt !==
                  null,

                emailVerifiedAt:
                  verificationResult
                    .user
                    .emailVerifiedAt
                    ?.toISOString() ??
                  null,

                createdAt:
                  verificationResult
                    .user
                    .createdAt
                    .toISOString(),

                updatedAt:
                  verificationResult
                    .user
                    .updatedAt
                    .toISOString(),
              },

              redirectTo:
                "/iniciar-sesion",
            },
          },
          200,
        );
      }

      case "already-verified": {
        return createJsonResponse(
          {
            ok:
              true,

            code:
              "EMAIL_ALREADY_VERIFIED",

            message: {
              es:
                "Este correo ya fue verificado. Puedes iniciar sesión.",

              en:
                "This email has already been verified. You can sign in.",
            },

            data: {
              alreadyVerified:
                true,

              maskedEmail:
                verificationResult
                  .maskedEmail,

              redirectTo:
                "/iniciar-sesion",
            },
          },
          200,
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
                "El código de verificación venció. Solicita uno nuevo.",

              en:
                "The verification code has expired. Request a new one.",
            },

            data: {
              maskedEmail:
                verificationResult
                  .maskedEmail,

              resendRequired:
                true,

              resendAvailableInSeconds:
                verificationResult
                  .resendAvailableInSeconds,
            },
          },
          410,
        );
      }

      case "attempts-exceeded": {
        const retryAfterSeconds =
          normalizeRetryAfterSeconds(
            verificationResult
              .resendAvailableInSeconds,
          );

        return createJsonResponse(
          {
            ok:
              false,

            code:
              "VERIFICATION_ATTEMPTS_EXCEEDED",

            message: {
              es:
                "Se superó el número permitido de intentos. Solicita un código nuevo.",

              en:
                "The allowed number of attempts was exceeded. Request a new code.",
            },

            data: {
              maskedEmail:
                verificationResult
                  .maskedEmail,

              attemptsRemaining:
                verificationResult
                  .attemptsRemaining,

              resendRequired:
                true,

              retryAfterSeconds,

              resendAvailableInSeconds:
                verificationResult
                  .resendAvailableInSeconds,
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

      case "invalid-code": {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "INVALID_VERIFICATION_CODE",

            message: {
              es:
                "El código ingresado es incorrecto.",

              en:
                "The entered verification code is incorrect.",
            },

            data: {
              maskedEmail:
                verificationResult
                  .maskedEmail,

              attemptsRemaining:
                verificationResult
                  .attemptsRemaining,
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
              "VERIFICATION_UNAVAILABLE",

            message: {
              es:
                "No fue posible validar el código proporcionado.",

              en:
                "The provided code could not be validated.",
            },

            data: {
              maskedEmail:
                verificationResult
                  .maskedEmail,
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
      "FIXORA email verification route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "EMAIL_VERIFICATION_UNAVAILABLE",

        message: {
          es:
            "No fue posible verificar el correo en este momento. Inténtalo nuevamente más tarde.",

          en:
            "The email could not be verified at this time. Please try again later.",
        },
      },
      503,
    );
  }
}