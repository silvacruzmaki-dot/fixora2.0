import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  clearSessionCookie,
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";

import {
  isRequestOriginAllowed,
} from "@/lib/auth/origin";

import {
  logoutUser,
} from "@/server/services/auth.service";

/*
 * La revocación de sesiones utiliza Prisma
 * y Microsoft SQL Server.
 */
export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

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
    Record<string, unknown>;
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

  if (!userAgent) {
    return null;
  }

  return userAgent.slice(
    0,
    500,
  );
}

/*
 * POST /api/auth/cerrar-sesion
 *
 * El cierre de sesión es idempotente:
 *
 * - Si existe una sesión, se revoca.
 * - Si ya no existe una sesión, responde correctamente.
 * - La cookie siempre se elimina del navegador.
 */
export async function POST(
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

  /*
   * Si no existe una cookie de sesión, consideramos
   * que el usuario ya tiene la sesión cerrada.
   */
  if (!sessionToken) {
    const response =
      createJsonResponse(
        {
          ok:
            true,

          code:
            "SESSION_ALREADY_CLOSED",

          message: {
            es:
              "La sesión ya se encontraba cerrada.",

            en:
              "The session was already closed.",
          },

          data: {
            revoked:
              false,
          },
        },
        200,
      );

    clearSessionCookie(
      response,
    );

    return response;
  }

  try {
    const logoutResult =
      await logoutUser(
        sessionToken,
        {
          userAgent:
            getSanitizedUserAgent(
              request,
            ),
        },
      );

    const response =
      createJsonResponse(
        {
          ok:
            true,

          code:
            logoutResult.revoked
              ? "SESSION_CLOSED"
              : "SESSION_ALREADY_CLOSED",

          message:
            logoutResult.revoked
              ? {
                  es:
                    "La sesión se cerró correctamente.",

                  en:
                    "The session was closed successfully.",
                }
              : {
                  es:
                    "La sesión ya se encontraba cerrada.",

                  en:
                    "The session was already closed.",
                },

          data: {
            revoked:
              logoutResult.revoked,
          },
        },
        200,
      );

    /*
     * La cookie se elimina después de intentar revocar
     * la sesión en SQL Server.
     */
    clearSessionCookie(
      response,
    );

    return response;
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA logout route error:",
      error,
    );

    /*
     * Aunque SQL Server no responda, eliminamos
     * la cookie del navegador para que el usuario
     * deje de utilizarla localmente.
     */
    const response =
      createJsonResponse(
        {
          ok:
            false,

          code:
            "SESSION_CLOSE_UNAVAILABLE",

          message: {
            es:
              "La sesión local fue eliminada, pero no fue posible completar la revocación en el servidor.",

            en:
              "The local session was removed, but server-side revocation could not be completed.",
          },

          data: {
            revoked:
              false,
          },
        },
        503,
      );

    clearSessionCookie(
      response,
    );

    return response;
  }
}