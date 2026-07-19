import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  setSessionCookie,
} from "@/lib/auth/cookies";

import {
  isRequestOriginAllowed as isTrustedRequestOrigin,
} from "@/lib/auth/origin";

import {
  checkRateLimit,
} from "@/lib/auth/rate-limit";

import {
  loginSchema,
} from "@/schemas/auth/login.schema";

import {
  authenticateAdministrator,
} from "@/server/services/admin-auth.service";

/*
 * Prisma, SQL Server y Argon2 necesitan
 * el entorno de ejecución de Node.js.
 */
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

/*
 * POST /api/admin/auth/iniciar-sesion
 *
 * Recibe:
 *
 * - email
 * - password
 * - rememberMe
 *
 * Solamente permite iniciar sesión cuando:
 *
 * - La cuenta existe.
 * - El correo está verificado.
 * - La cuenta está activa.
 * - El rol es ADMIN.
 * - La contraseña es correcta.
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

  /*
   * El acceso administrativo tiene un límite
   * más estricto que el acceso normal.
   */
  const rateLimitResult =
    await checkRateLimit({
      request,

      namespace:
        "admin:auth:login",

      limit:
        5,

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
            "Se realizaron demasiados intentos administrativos. Inténtalo nuevamente más tarde.",

          en:
            "Too many administrator login attempts were made. Please try again later.",
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
    loginSchema.safeParse(
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
            "Revisa los datos ingresados y vuelve a intentarlo.",

          en:
            "Review the entered information and try again.",
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
    const authenticationResult =
      await authenticateAdministrator(
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
      authenticationResult.status
    ) {
      case "authenticated": {
        const response =
          createJsonResponse(
            {
              ok:
                true,

              code:
                "ADMIN_AUTHENTICATED",

              message: {
                es:
                  "Acceso administrativo iniciado correctamente.",

                en:
                  "Administrator access started successfully.",
              },

              data: {
                authenticated:
                  true,

                authorized:
                  true,

                user: {
                  id:
                    authenticationResult
                      .user
                      .id,

                  firstName:
                    authenticationResult
                      .user
                      .firstName,

                  lastName:
                    authenticationResult
                      .user
                      .lastName,

                  displayName:
                    authenticationResult
                      .user
                      .displayName,

                  email:
                    authenticationResult
                      .user
                      .email,

                  avatarUrl:
                    authenticationResult
                      .user
                      .avatarUrl,

                  role:
                    authenticationResult
                      .user
                      .role,

                  status:
                    authenticationResult
                      .user
                      .status,

                  preferredLanguage:
                    authenticationResult
                      .user
                      .preferredLanguage,

                  preferredTheme:
                    authenticationResult
                      .user
                      .preferredTheme,

                  emailVerified:
                    authenticationResult
                      .user
                      .emailVerifiedAt !==
                    null,

                  createdAt:
                    authenticationResult
                      .user
                      .createdAt
                      .toISOString(),
                },

                session: {
                  id:
                    authenticationResult
                      .session
                      .id,

                  expiresAt:
                    authenticationResult
                      .session
                      .expiresAt
                      .toISOString(),

                  lastSeenAt:
                    authenticationResult
                      .session
                      .lastSeenAt
                      .toISOString(),

                  rememberMe:
                    authenticationResult
                      .session
                      .rememberMe,

                  remainingSeconds:
                    authenticationResult
                      .remainingSeconds,
                },

                redirectTo:
                  "/admin",
              },
            },
            200,
          );

        /*
         * El token real solamente se almacena
         * dentro de una cookie segura HttpOnly.
         */
        setSessionCookie(
          response,
          {
            token:
              authenticationResult
                .sessionToken,

            expiresAt:
              authenticationResult
                .session
                .expiresAt,

            rememberMe:
              authenticationResult
                .session
                .rememberMe,
          },
        );

        return response;
      }

      case "email-verification-required": {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "EMAIL_VERIFICATION_REQUIRED",

            message: {
              es:
                "La cuenta administradora debe verificar su correo antes de ingresar.",

              en:
                "The administrator account must verify its email before signing in.",
            },

            data: {
              verificationRequired:
                true,

              maskedEmail:
                authenticationResult
                  .maskedEmail,

              verificationExpiresInSeconds:
                authenticationResult
                  .verificationExpiresInSeconds,

              resendAvailableInSeconds:
                authenticationResult
                  .resendAvailableInSeconds,

              redirectTo:
                "/verificar-correo",
            },
          },
          403,
        );
      }

      case "account-locked": {
        const retryAfterSeconds =
          normalizeRetryAfterSeconds(
            authenticationResult
              .retryAfterSeconds,
          );

        return createJsonResponse(
          {
            ok:
              false,

            code:
              "ACCOUNT_TEMPORARILY_LOCKED",

            message: {
              es:
                "La cuenta está bloqueada temporalmente por seguridad.",

              en:
                "The account is temporarily locked for security.",
            },

            data: {
              lockedUntil:
                authenticationResult
                  .lockedUntil
                  ?.toISOString() ??
                null,

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

      case "account-disabled": {
        /*
         * No revelamos públicamente detalles
         * sobre el estado interno de la cuenta.
         */
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "ADMIN_AUTHENTICATION_FAILED",

            message: {
              es:
                "No fue posible iniciar el acceso administrativo con los datos proporcionados.",

              en:
                "Administrator access could not be started with the provided information.",
            },
          },
          401,
        );
      }

      case "insufficient-permissions": {
        /*
         * Una cuenta USER no puede utilizar
         * el acceso administrativo.
         *
         * La respuesta se mantiene general para
         * no confirmar públicamente el rol asociado
         * al correo ingresado.
         */
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "ADMIN_AUTHENTICATION_FAILED",

            message: {
              es:
                "No fue posible iniciar el acceso administrativo con los datos proporcionados.",

              en:
                "Administrator access could not be started with the provided information.",
            },
          },
          401,
        );
      }

      case "invalid-credentials":
      default: {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "INVALID_ADMIN_CREDENTIALS",

            message: {
              es:
                "El correo o la contraseña son incorrectos.",

              en:
                "The email or password is incorrect.",
            },
          },
          401,
        );
      }
    }
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA administrator login route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "ADMIN_AUTHENTICATION_UNAVAILABLE",

        message: {
          es:
            "No fue posible iniciar el acceso administrativo en este momento.",

          en:
            "Administrator access could not be started at this time.",
        },
      },
      503,
    );
  }
}