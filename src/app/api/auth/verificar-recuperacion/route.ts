import {
  type NextRequest,
  NextResponse,
} from "next/server";

import { z } from "zod";

import {
  isRequestOriginAllowed as isTrustedRequestOrigin,
} from "@/lib/auth/origin";

import {
  checkRateLimit,
} from "@/lib/auth/rate-limit";

import {
  verifyPasswordResetCode,
} from "@/server/services/password-reset.service";

/*
 * Prisma y SQL Server requieren el entorno
 * de ejecución de Node.js.
 */
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

/*
 * Esquema local para verificar el código de recuperación.
 *
 * Se define aquí porque reset-password.schema.ts
 * no exporta verifyPasswordResetCodeSchema.
 */
const verifyPasswordResetCodeSchema =
  z.object({
    email: z
      .string()
      .trim()
      .min(
        1,
        "El correo electrónico es obligatorio.",
      )
      .max(
        320,
        "El correo electrónico es demasiado largo.",
      )
      .email(
        "Ingresa un correo electrónico válido.",
      )
      .transform((value) =>
        value.toLowerCase(),
      ),

    code: z
      .string()
      .trim()
      .regex(
        /^\d{6}$/,
        "El código debe contener exactamente 6 dígitos.",
      ),
  })
  .strict();

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
  const headers =
    new Headers(
      RESPONSE_HEADERS,
    );

  if (additionalHeaders) {
    const extraHeaders =
      new Headers(
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

  const contentLength =
    Number(
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
 * POST /api/auth/verificar-recuperacion
 *
 * Recibe:
 *
 * - email
 * - code
 *
 * Este endpoint comprueba que el código sea válido
 * antes de mostrar el formulario para establecer
 * una nueva contraseña.
 *
 * El código todavía no se consume definitivamente.
 * Se vuelve a validar al restablecer la contraseña.
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
        "auth:verify-password-reset",

      limit: 10,

      windowMs:
        15 * 60 * 1_000,
    });

  if (!rateLimitResult.allowed) {
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

    rawBody =
      JSON.parse(
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
    verifyPasswordResetCodeSchema
      .safeParse(
        rawBody,
      );

  if (!validationResult.success) {
    return createJsonResponse(
      {
        ok: false,
        code:
          "VALIDATION_ERROR",

        message: {
          es:
            "Revisa el correo y el código ingresado.",

          en:
            "Review the email and recovery code.",
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
      await verifyPasswordResetCode(
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
            ok: true,
            code:
              "PASSWORD_RESET_CODE_VERIFIED",

            message: {
              es:
                "El código fue verificado correctamente.",

              en:
                "The code was verified successfully.",
            },

            data: {
              verified: true,

              maskedEmail:
                verificationResult
                  .maskedEmail,

              redirectTo:
                "/restablecer-password",
            },
          },
          200,
        );
      }

      case "code-expired": {
        return createJsonResponse(
          {
            ok: false,
            code:
              "CODE_EXPIRED",

            message: {
              es:
                "El código de recuperación venció. Solicita uno nuevo.",

              en:
                "The recovery code has expired. Request a new one.",
            },

            data: {
              maskedEmail:
                verificationResult
                  .maskedEmail,

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
            ok: false,
            code:
              "RECOVERY_ATTEMPTS_EXCEEDED",

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
            ok: false,
            code:
              "INVALID_RECOVERY_CODE",

            message: {
              es:
                "El código ingresado es incorrecto.",

              en:
                "The entered recovery code is incorrect.",
            },

            data: {
              maskedEmail:
                verificationResult
                  .maskedEmail,

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
            ok: false,
            code:
              "PASSWORD_RESET_UNAVAILABLE",

            message: {
              es:
                "No fue posible continuar con la recuperación de contraseña.",

              en:
                "Password recovery could not continue.",
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

      case "not-found":
      default: {
        return createJsonResponse(
          {
            ok: false,
            code:
              "INVALID_RECOVERY_REQUEST",

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
      "FIXORA password reset code verification route error:",
      error,
    );

    return createJsonResponse(
      {
        ok: false,
        code:
          "PASSWORD_RESET_VERIFICATION_UNAVAILABLE",

        message: {
          es:
            "No fue posible verificar el código en este momento. Inténtalo nuevamente más tarde.",

          en:
            "The code could not be verified at this time. Please try again later.",
        },
      },
      503,
    );
  }
}