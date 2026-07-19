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
  markNotificationAsReadBySessionToken,
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

/*
 * Prisma utiliza identificadores UUID para las
 * notificaciones. Esta expresión acepta un UUID
 * válido sin depender de una versión específica.
 */
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface NotificationRouteContext {
  params: Promise<{
    notificationId: string;
  }>;
}

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

function serializeNotification(
  notification: {
    id: string;
    type: string;

    titleEs: string;
    titleEn: string;

    messageEs: string;
    messageEn: string;

    actionUrl:
      string | null;

    readAt:
      Date | null;

    createdAt:
      Date;

    updatedAt:
      Date;
  },
): Record<
  string,
  unknown
> {
  return {
    id:
      notification.id,

    type:
      notification.type,

    titleEs:
      notification.titleEs,

    titleEn:
      notification.titleEn,

    messageEs:
      notification.messageEs,

    messageEn:
      notification.messageEn,

    actionUrl:
      notification.actionUrl,

    isRead:
      notification.readAt !==
      null,

    readAt:
      notification.readAt
        ? notification
            .readAt
            .toISOString()
        : null,

    createdAt:
      notification
        .createdAt
        .toISOString(),

    updatedAt:
      notification
        .updatedAt
        .toISOString(),
  };
}

/*
 * POST /api/notificaciones/[notificationId]/leer
 *
 * Solamente permite modificar una notificación
 * que pertenezca al usuario autenticado.
 *
 * La operación es idempotente:
 *
 * - Si estaba sin leer, se marca como leída.
 * - Si ya estaba leída, responde correctamente.
 */
export async function POST(
  request:
    NextRequest,
  context:
    NotificationRouteContext,
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

  /*
   * En Next.js 16, params es una promesa.
   */
  const {
    notificationId:
      rawNotificationId,
  } =
    await context.params;

  const notificationId =
    rawNotificationId
      .trim()
      .toLowerCase();

  if (
    !UUID_PATTERN.test(
      notificationId,
    )
  ) {
    return createJsonResponse(
      {
        ok:
          false,

        code:
          "INVALID_NOTIFICATION_ID",

        message: {
          es:
            "El identificador de la notificación no es válido.",

          en:
            "The notification identifier is invalid.",
        },

        fieldErrors: {
          notificationId: [
            "El identificador debe ser un UUID válido.",
          ],
        },
      },
      422,
    );
  }

  const rateLimitResult =
    await checkRateLimit({
      request,

      namespace:
        "notifications:mark-one-read",

      limit:
        120,

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
      await markNotificationAsReadBySessionToken(
        sessionToken,
        notificationId,
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
     * El servicio devuelve null cuando la sesión:
     *
     * - No existe.
     * - Venció.
     * - Fue revocada.
     * - Pertenece a una cuenta no disponible.
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

    switch (
      result.status
    ) {
      case "marked": {
        const wasAlreadyRead =
          result.alreadyRead;

        return createJsonResponse(
          {
            ok:
              true,

            code:
              wasAlreadyRead
                ? "NOTIFICATION_ALREADY_READ"
                : "NOTIFICATION_MARKED_AS_READ",

            message:
              wasAlreadyRead
                ? {
                    es:
                      "La notificación ya se encontraba marcada como leída.",

                    en:
                      "The notification was already marked as read.",
                  }
                : {
                    es:
                      "La notificación fue marcada como leída.",

                    en:
                      "The notification was marked as read.",
                  },

            data: {
              authenticated:
                true,

              notification:
                serializeNotification(
                  result.notification,
                ),

              alreadyRead:
                wasAlreadyRead,

              unreadCount:
                result.unreadCount,
            },
          },
          200,
        );
      }

      case "not-found":
      default: {
        /*
         * No se revela si la notificación pertenece
         * a otro usuario.
         */
        return createJsonResponse(
          {
            ok:
              false,

            code:
              "NOTIFICATION_NOT_FOUND",

            message: {
              es:
                "La notificación solicitada no fue encontrada.",

              en:
                "The requested notification was not found.",
            },
          },
          404,
        );
      }
    }
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA mark notification as read route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "MARK_NOTIFICATION_UNAVAILABLE",

        message: {
          es:
            "No fue posible marcar la notificación como leída en este momento.",

          en:
            "The notification could not be marked as read at this time.",
        },
      },
      503,
    );
  }
}