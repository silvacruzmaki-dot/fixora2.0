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
  authenticateUser,
} from "@/server/services/auth.service";

/*
 * Prisma, SQL Server y Argon2 necesitan ejecutarse
 * mediante Node.js y no mediante Edge Runtime.
 */
export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

/*
 * El inicio de sesión solamente recibe correo,
 * contraseña y la opción de recordar la sesión.
 */
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

export async function POST(
  request:
    NextRequest,
): Promise<NextResponse> {
  /*
   * Bloquea solicitudes procedentes de orígenes
   * diferentes al dominio autorizado de FIXORA.
   */
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

  /*
   * Este endpoint solamente acepta solicitudes JSON.
   */
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

  /*
   * Primera comprobación del tamaño declarado
   * mediante Content-Length.
   */
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
   * Limita los intentos realizados desde un mismo
   * cliente para reducir ataques automatizados.
   */
  const rateLimitResult =
    await checkRateLimit({
      request,

      namespace:
        "auth:login",

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

    /*
     * Segunda comprobación para solicitudes sin
     * Content-Length o enviadas por fragmentos.
     */
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

  /*
   * Zod comprobará el correo, contraseña
   * y la opción de recordar la sesión.
   */
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
      await authenticateUser(
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
        /*
         * El token nunca se devuelve en el JSON.
         * Se guarda únicamente dentro de una cookie
         * segura gestionada por el servidor.
         */
        const response =
          createJsonResponse(
            {
              ok:
                true,

              code:
                "AUTHENTICATED",

              message: {
                es:
                  "Sesión iniciada correctamente.",

                en:
                  "You have signed in successfully.",
              },

              data: {
                authenticated:
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

                sessionExpiresAt:
                  authenticationResult
                    .session
                    .expiresAt
                    .toISOString(),

                redirectTo:
                  authenticationResult
                    .user
                    .role ===
                  "ADMIN"
                    ? "/admin"
                    : "/perfil",
              },
            },
            200,
          );

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
                "Debes verificar tu correo antes de iniciar sesión.",

              en:
                "You must verify your email before signing in.",
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
                "La cuenta está bloqueada temporalmente por seguridad. Inténtalo nuevamente más tarde.",

              en:
                "The account is temporarily locked for security. Please try again later.",
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
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "AUTHENTICATION_FAILED",

            message: {
              es:
                "No fue posible iniciar sesión con los datos proporcionados.",

              en:
                "It was not possible to sign in with the provided information.",
            },
          },
          401,
        );
      }

      case "admin-login-required": {
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "ADMIN_LOGIN_REQUIRED",

            message: {
              es:
                "Esta cuenta debe ingresar desde el acceso administrativo.",

              en:
                "This account must sign in through the administrator access.",
            },

            data: {
              redirectTo:
                "/admin/iniciar-sesion",
            },
          },
          403,
        );
      }

      case "invalid-credentials":
      default: {
        /*
         * Mensaje genérico para no confirmar si
         * el correo existe o cuál dato es incorrecto.
         */
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "INVALID_CREDENTIALS",

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
    /*
     * El detalle técnico solamente se registra
     * en el servidor y nunca se envía al navegador.
     */
    console.error(
      "FIXORA login route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "AUTHENTICATION_UNAVAILABLE",

        message: {
          es:
            "No fue posible iniciar sesión en este momento. Inténtalo nuevamente más tarde.",

          en:
            "It was not possible to sign in at this time. Please try again later.",
        },
      },
      503,
    );
  }
}