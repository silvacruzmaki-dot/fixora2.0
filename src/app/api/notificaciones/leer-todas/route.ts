import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  clearSessionCookie,
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";

import {
  isRequestOriginAllowed as isTrustedRequestOrigin,
} from "@/lib/auth/origin";

import {
  checkRateLimit,
} from "@/lib/auth/rate-limit";

import {
  markAllNotificationsAsReadBySessionToken,
} from "@/server/services/notification.service";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

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
          "Debes iniciar sesión para modificar tus notificaciones.",

        en:
          "You must sign in to modify your notifications.",
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
 * POST /api/notificaciones/leer-todas
 *
 * Marca como leídas todas las notificaciones
 * pendientes del usuario autenticado.
 *
 * La operación es idempotente:
 *
 * - Si existen notificaciones sin leer, las actualiza.
 * - Si todas estaban leídas, responde correctamente.
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
        "notifications:mark-all-read",

      limit:
        30,

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
    const result =
      await markAllNotificationsAsReadBySessionToken(
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

    /*
     * El servicio devuelve null cuando:
     *
     * - La sesión no existe.
     * - La sesión venció.
     * - La sesión fue revocada.
     * - La cuenta fue desactivada o eliminada.
     */
    if (
      !result
    ) {
      const response =
        createUnauthenticatedResponse();

      clearSessionCookie(
        response,
      );

      return response;
    }

    const allWereAlreadyRead =
      result.markedCount ===
      0;

    return createJsonResponse(
      {
        ok:
          true,

        code:
          allWereAlreadyRead
            ? "NOTIFICATIONS_ALREADY_READ"
            : "ALL_NOTIFICATIONS_MARKED_AS_READ",

        message:
          allWereAlreadyRead
            ? {
                es:
                  "Todas tus notificaciones ya se encontraban leídas.",

                en:
                  "All your notifications were already marked as read.",
              }
            : {
                es:
                  "Todas tus notificaciones fueron marcadas como leídas.",

                en:
                  "All your notifications were marked as read.",
              },

        data: {
          authenticated:
            true,

          markedCount:
            result.markedCount,

          unreadCount:
            result.unreadCount,

          allWereAlreadyRead,
        },
      },
      200,
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA mark all notifications as read route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "MARK_ALL_NOTIFICATIONS_UNAVAILABLE",

        message: {
          es:
            "No fue posible marcar las notificaciones como leídas en este momento.",

          en:
            "The notifications could not be marked as read at this time.",
        },
      },
      503,
    );
  }
}