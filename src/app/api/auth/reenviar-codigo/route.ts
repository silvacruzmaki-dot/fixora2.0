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
  resendVerificationCodeSchema,
} from "@/schemas/auth/verify-email.schema";

import {
  resendEmailVerificationCode,
} from "@/server/services/verification.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_REQUEST_SIZE_BYTES = 4_096;

const RESPONSE_HEADERS = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate, proxy-revalidate",

  Pragma: "no-cache",
  Expires: "0",

  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "Cross-Origin-Resource-Policy": "same-origin",

  Vary: "Cookie",
} as const;

interface LocalizedMessage {
  es: string;
  en: string;
}

interface ApiResponseBody {
  ok: boolean;
  code: string;

  message: LocalizedMessage;

  data?: Record<
    string,
    unknown
  >;

  fieldErrors?: Record<
    string,
    string[]
  >;
}

function createJsonResponse(
  body: ApiResponseBody,
  status: number,
  additionalHeaders?: HeadersInit,
): NextResponse {
  const headers = new Headers(
    RESPONSE_HEADERS,
  );

  if (additionalHeaders) {
    const extraHeaders = new Headers(
      additionalHeaders,
    );

    extraHeaders.forEach(
      (value, key) => {
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
  request: NextRequest,
): number | null {
  const contentLengthHeader =
    request.headers.get(
      "content-length",
    );

  if (!contentLengthHeader) {
    return null;
  }

  const contentLength = Number(
    contentLengthHeader,
  );

  if (
    !Number.isFinite(
      contentLength,
    ) ||
    contentLength < 0
  ) {
    return null;
  }

  return contentLength;
}

function getBodySizeInBytes(
  content: string,
): number {
  return new TextEncoder()
    .encode(content)
    .byteLength;
}

function getValidationFieldErrors(
  issues: ReadonlyArray<{
    path: PropertyKey[];
    message: string;
  }>,
): Record<string, string[]> {
  const fieldErrors: Record<
    string,
    string[]
  > = {};

  for (const issue of issues) {
    const firstPathSegment =
      issue.path[0];

    const fieldName =
      typeof firstPathSegment ===
      "string"
        ? firstPathSegment
        : "form";

    fieldErrors[fieldName] ??= [];

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
  request: NextRequest,
): string | null {
  const userAgent =
    request.headers
      .get("user-agent")
      ?.replace(
        /[\u0000-\u001F\u007F]+/g,
        " ",
      )
      .trim()
      .replace(
        /\s+/g,
        " ",
      );

  if (!userAgent) {
    return null;
  }

  return userAgent.slice(
    0,
    500,
  );
}

function normalizeRetryAfterSeconds(
  value: number,
): number {
  if (
    !Number.isFinite(value) ||
    value < 1
  ) {
    return 1;
  }

  return Math.ceil(value);
}

/*
 * POST /api/auth/reenviar-codigo
 *
 * Recibe:
 *
 * - email
 *
 * La respuesta pública no confirma si el correo
 * existe, evitando la enumeración de cuentas.
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse> {
  if (
    !isTrustedRequestOrigin(
      request,
    )
  ) {
    return createJsonResponse(
      {
        ok: false,
        code: "UNTRUSTED_ORIGIN",

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
      .get("content-type")
      ?.toLowerCase() ??
    "";

  if (
    !contentType.includes(
      "application/json",
    )
  ) {
    return createJsonResponse(
      {
        ok: false,
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
    declaredContentLength !== null &&
    declaredContentLength >
      MAX_REQUEST_SIZE_BYTES
  ) {
    return createJsonResponse(
      {
        ok: false,
        code: "REQUEST_TOO_LARGE",

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
        "auth:resend-verification-code",

      limit: 5,

      windowMs:
        30 * 60 * 1_000,
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
        ok: false,
        code: "RATE_LIMITED",

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
        "Retry-After": String(
          retryAfterSeconds,
        ),
      },
    );
  }

  let rawBody: unknown;

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
          ok: false,
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

    rawBody = JSON.parse(
      requestText,
    );
  } catch {
    return createJsonResponse(
      {
        ok: false,
        code: "INVALID_JSON",

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
    resendVerificationCodeSchema.safeParse(
      rawBody,
    );

  if (
    !validationResult.success
  ) {
    return createJsonResponse(
      {
        ok: false,
        code:
          "VALIDATION_ERROR",

        message: {
          es:
            "Revisa el correo ingresado.",

          en:
            "Review the entered email address.",
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
    const resendResult =
      await resendEmailVerificationCode(
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
      resendResult.status
    ) {
      case "sent": {
        return createJsonResponse(
          {
            ok: true,
            code:
              "VERIFICATION_CODE_SENT",

            message: {
              es:
                "Se envió un nuevo código de verificación a tu correo.",

              en:
                "A new verification code was sent to your email.",
            },

            data: {
              maskedEmail:
                resendResult
                  .maskedEmail,

              verificationExpiresInSeconds:
                resendResult
                  .verificationExpiresInSeconds,

              resendAvailableInSeconds:
                resendResult
                  .resendAvailableInSeconds,

              emailSent:
                resendResult
                  .emailSent,
            },
          },
          202,
        );
      }

      case "cooldown": {
        const retryAfterSeconds =
          normalizeRetryAfterSeconds(
            resendResult
              .retryAfterSeconds,
          );

        return createJsonResponse(
          {
            ok: false,
            code:
              "RESEND_NOT_AVAILABLE_YET",

            message: {
              es:
                "Debes esperar antes de solicitar otro código.",

              en:
                "You must wait before requesting another code.",
            },

            data: {
              maskedEmail:
                resendResult
                  .maskedEmail,

              retryAfterSeconds,

              resendAvailableInSeconds:
                resendResult
                  .resendAvailableInSeconds,
            },
          },
          429,
          {
            "Retry-After": String(
              retryAfterSeconds,
            ),
          },
        );
      }

      case "resend-limit-exceeded": {
        const retryAfterSeconds =
          normalizeRetryAfterSeconds(
            resendResult
              .resendAvailableInSeconds,
          );

        return createJsonResponse(
          {
            ok: false,
            code:
              "RESEND_LIMIT_EXCEEDED",

            message: {
              es:
                "Se alcanzó el límite de reenvíos. Inténtalo nuevamente más tarde.",

              en:
                "The resend limit has been reached. Please try again later.",
            },

            data: {
              maskedEmail:
                resendResult
                  .maskedEmail,

              remainingResends:
                resendResult
                  .remainingResends,

              retryAfterSeconds,

              resendAvailableInSeconds:
                resendResult
                  .resendAvailableInSeconds,
            },
          },
          429,
          {
            "Retry-After": String(
              retryAfterSeconds,
            ),
          },
        );
      }

      case "already-verified": {
        return createJsonResponse(
          {
            ok: true,
            code:
              "EMAIL_ALREADY_VERIFIED",

            message: {
              es:
                "El correo ya se encuentra verificado. Puedes iniciar sesión.",

              en:
                "The email is already verified. You can sign in.",
            },

            data: {
              maskedEmail:
                resendResult
                  .maskedEmail,

              redirectTo:
                "/iniciar-sesion",
            },
          },
          200,
        );
      }

      case "not-found":
      default: {
        /*
         * Respuesta general para evitar confirmar
         * si el correo existe o no.
         */
        return createJsonResponse(
          {
            ok: true,
            code:
              "VERIFICATION_REQUEST_ACCEPTED",

            message: {
              es:
                "Si el correo corresponde a una cuenta pendiente, recibirás un nuevo código de verificación.",

              en:
                "If the email belongs to a pending account, you will receive a new verification code.",
            },

            data: {
              requestAccepted: true,
            },
          },
          202,
        );
      }
    }
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA resend verification code route error:",
      error,
    );

    return createJsonResponse(
      {
        ok: false,
        code:
          "VERIFICATION_RESEND_UNAVAILABLE",

        message: {
          es:
            "No fue posible reenviar el código en este momento. Inténtalo nuevamente más tarde.",

          en:
            "The code could not be resent at this time. Please try again later.",
        },
      },
      503,
    );
  }
}