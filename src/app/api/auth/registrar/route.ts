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
  registerSchema,
} from "@/schemas/auth/register.schema";

import {
  registerUser,
} from "@/server/services/auth.service";

/*
 * SQL Server, Prisma y Argon2 requieren el entorno
 * de ejecución de Node.js, no Edge Runtime.
 */
export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

/*
 * El formulario de registro solamente debe enviar
 * algunos campos de texto. Limitamos el cuerpo para
 * evitar solicitudes innecesariamente grandes.
 */
const MAX_REQUEST_SIZE_BYTES =
  16_384;

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
   * Impide solicitudes enviadas desde orígenes externos
   * no autorizados.
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
   * El endpoint solamente acepta JSON.
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
   * Primera protección de tamaño usando Content-Length.
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
   * Límite de solicitudes por cliente.
   */
  const rateLimitResult =
    await checkRateLimit({
      request,

      namespace:
        "auth:register",

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
     * Segunda comprobación para solicitudes que no
     * incluyan Content-Length o utilicen transferencia
     * por fragmentos.
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
   * La validación de nombres, correo, contraseña,
   * confirmación y consentimientos se realiza con Zod.
   */
  const validationResult =
    registerSchema.safeParse(
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
    const registrationResult =
      await registerUser(
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

    /*
     * La respuesta es deliberadamente general.
     * No confirma públicamente si el correo ya estaba
     * registrado, evitando enumerar cuentas.
     */
    return createJsonResponse(
      {
        ok:
          true,

        code:
          "REGISTRATION_ACCEPTED",

        message: {
          es:
            "Si los datos pueden utilizarse, recibirás un código de verificación en tu correo.",

          en:
            "If the information can be used, you will receive a verification code by email.",
        },

        data: {
          maskedEmail:
            registrationResult
              .maskedEmail,

          verificationRequired:
            true,

          verificationExpiresInSeconds:
            registrationResult
              .verificationExpiresInSeconds,

          resendAvailableInSeconds:
            registrationResult
              .resendAvailableInSeconds,

          redirectTo:
            "/verificar-correo",
        },
      },
      202,
    );
  } catch (
    error: unknown
  ) {
    /*
     * El detalle técnico solamente se registra
     * en el servidor. Nunca se envía al navegador.
     */
    console.error(
      "FIXORA registration route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "REGISTRATION_UNAVAILABLE",

        message: {
          es:
            "No fue posible procesar el registro en este momento. Inténtalo nuevamente más tarde.",

          en:
            "Registration could not be processed at this time. Please try again later.",
        },
      },
      503,
    );
  }
}