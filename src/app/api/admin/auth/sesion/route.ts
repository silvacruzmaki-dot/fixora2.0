import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  clearSessionCookie,
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";

import { checkRateLimit } from "@/lib/auth/rate-limit";

import { getAdministratorSessionByToken } from "@/server/services/admin-auth.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const RESPONSE_HEADERS = {
  "Cache-Control":
    "private, no-store, no-cache, max-age=0, must-revalidate",

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

  data?: Record<string, unknown>;
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
        headers.set(key, value);
      },
    );
  }

  return NextResponse.json(body, {
    status,
    headers,
  });
}

function createAuthenticationRequiredResponse(): NextResponse {
  return createJsonResponse(
    {
      ok: false,
      code:
        "ADMIN_AUTHENTICATION_REQUIRED",

      message: {
        es: "Debes iniciar sesión como administrador para acceder a esta sección.",
        en: "You must sign in as an administrator to access this section.",
      },

      data: {
        authenticated: false,
        authorized: false,

        redirectTo:
          "/admin/iniciar-sesion",
      },
    },
    401,
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
 * GET /api/admin/auth/sesion
 *
 * Comprueba:
 *
 * - Que exista una cookie de sesión.
 * - Que la sesión exista en SQL Server.
 * - Que la sesión no esté vencida.
 * - Que la sesión no haya sido revocada.
 * - Que la cuenta esté activa.
 * - Que la cuenta tenga rol ADMIN.
 *
 * El token de sesión nunca se devuelve en el JSON.
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse> {
  const sessionToken =
    getSessionTokenFromRequest(request);

  if (!sessionToken) {
    return createAuthenticationRequiredResponse();
  }

  const rateLimitResult =
    await checkRateLimit({
      request,

      namespace:
        "admin:auth:session",

      limit: 120,

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
          es: "Se realizaron demasiadas comprobaciones de sesión. Inténtalo nuevamente más tarde.",
          en: "Too many session checks were made. Please try again later.",
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

  try {
    const sessionResult =
      await getAdministratorSessionByToken(
        sessionToken,
      );

    switch (sessionResult.status) {
      case "authenticated": {
        const {
          user,
          session,
        } = sessionResult;

        return createJsonResponse(
          {
            ok: true,
            code:
              "ADMIN_SESSION_ACTIVE",

            message: {
              es: "La sesión administrativa está activa.",
              en: "The administrator session is active.",
            },

            data: {
              authenticated: true,
              authorized: true,

              user: {
                id:
                  user.id,

                firstName:
                  user.firstName,

                lastName:
                  user.lastName,

                displayName:
                  user.displayName,

                email:
                  user.email,

                avatarUrl:
                  user.avatarUrl,

                role:
                  user.role,

                status:
                  user.status,

                preferredLanguage:
                  user.preferredLanguage,

                preferredTheme:
                  user.preferredTheme,

                emailVerified:
                  user.emailVerifiedAt !==
                  null,

                createdAt:
                  user.createdAt
                    .toISOString(),
              },

              session: {
                expiresAt:
                  session.expiresAt
                    .toISOString(),

                lastSeenAt:
                  session.lastSeenAt
                    .toISOString(),

                rememberMe:
                  session.rememberMe,
              },
            },
          },
          200,
        );
      }

      case "insufficient-permissions": {
        /*
         * La sesión puede ser válida para un usuario
         * normal, por eso no eliminamos su cookie.
         *
         * Solamente impedimos el acceso administrativo.
         */
        return createJsonResponse(
          {
            ok: false,
            code:
              "ADMIN_PERMISSION_REQUIRED",

            message: {
              es: "Tu cuenta no tiene permisos para acceder al panel administrativo.",
              en: "Your account does not have permission to access the administrator panel.",
            },

            data: {
              authenticated: true,
              authorized: false,

              redirectTo: "/",
            },
          },
          403,
        );
      }

      case "invalid-session":
      case "account-unavailable":
      default: {
        /*
         * La cookie ya no representa una sesión válida.
         * Se elimina para evitar que siga enviándose.
         */
        const response =
          createAuthenticationRequiredResponse();

        clearSessionCookie(response);

        return response;
      }
    }
  } catch (error: unknown) {
    console.error(
      "FIXORA administrator session route error:",
      error,
    );

    return createJsonResponse(
      {
        ok: false,
        code:
          "ADMIN_SESSION_CHECK_UNAVAILABLE",

        message: {
          es: "No fue posible comprobar la sesión administrativa en este momento.",
          en: "The administrator session could not be checked at this time.",
        },

        data: {
          authenticated: false,
          authorized: false,
        },
      },
      503,
    );
  }
}