import {
  type NextRequest,
  NextResponse,
} from "next/server";

import {
  clearSessionCookie,
  getSessionTokenFromRequest,
} from "@/lib/auth/cookies";

import {
  getAuthenticatedSessionByToken,
} from "@/server/services/auth.service";

/*
 * Este endpoint consulta la sesión almacenada
 * mediante Prisma y Microsoft SQL Server.
 */
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

  data: {
    authenticated:
      boolean;

    user?: {
      id: string;

      firstName: string;
      lastName: string;
      displayName: string;

      email: string;

      avatarUrl:
        string | null;

      role: string;
      status: string;

      preferredLanguage:
        string;

      preferredTheme:
        string;

      emailVerified:
        boolean;
    };

    session?: {
      id: string;

      expiresAt:
        string;

      lastSeenAt:
        string;

      rememberMe:
        boolean;

      remainingSeconds:
        number;
    };
  };
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

function createUnauthenticatedResponse(
  code:
    | "NO_SESSION"
    | "INVALID_SESSION"
    | "ACCOUNT_UNAVAILABLE",
): NextResponse {
  return createJsonResponse(
    {
      ok:
        true,

      code,

      message: {
        es:
          "No existe una sesión activa.",

        en:
          "There is no active session.",
      },

      data: {
        authenticated:
          false,
      },
    },
    200,
  );
}

/*
 * GET /api/auth/sesion
 *
 * Devuelve la información pública necesaria para:
 *
 * - Actualizar el AuthContext.
 * - Mostrar el nombre y avatar del usuario.
 * - Cambiar el botón de iniciar sesión.
 * - Habilitar perfil, notificaciones y cerrar sesión.
 *
 * El token de sesión nunca se devuelve al navegador.
 */
export async function GET(
  request:
    NextRequest,
): Promise<NextResponse> {
  const sessionToken =
    getSessionTokenFromRequest(
      request,
    );

  /*
   * No tener cookie no es un error técnico.
   * Significa que el visitante no inició sesión.
   */
  if (!sessionToken) {
    return createUnauthenticatedResponse(
      "NO_SESSION",
    );
  }

  try {
    const authenticatedSession =
      await getAuthenticatedSessionByToken(
        sessionToken,
      );

    /*
     * El servicio puede devolver:
     *
     * - authenticated
     * - invalid-session
     * - account-unavailable
     */
    if (
      authenticatedSession.status ===
      "invalid-session"
    ) {
      const response =
        createUnauthenticatedResponse(
          "INVALID_SESSION",
        );

      /*
       * Eliminamos cualquier cookie vencida,
       * revocada, inválida o manipulada.
       */
      clearSessionCookie(
        response,
      );

      return response;
    }

    if (
      authenticatedSession.status ===
      "account-unavailable"
    ) {
      const response =
        createUnauthenticatedResponse(
          "ACCOUNT_UNAVAILABLE",
        );

      /*
       * Si la cuenta fue desactivada, bloqueada
       * o dejó de estar disponible, también se
       * elimina la cookie local.
       */
      clearSessionCookie(
        response,
      );

      return response;
    }

    /*
     * Después de comprobar el estado, TypeScript
     * reconoce correctamente las propiedades
     * user y session.
     */
    const {
      user,
      session,
    } =
      authenticatedSession;

    return createJsonResponse(
      {
        ok:
          true,

        code:
          "SESSION_ACTIVE",

        message: {
          es:
            "La sesión está activa.",

          en:
            "The session is active.",
        },

        data: {
          authenticated:
            true,

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
          },

          session: {
            id:
              session.id,

            expiresAt:
              session.expiresAt
                .toISOString(),

            lastSeenAt:
              session.lastSeenAt
                .toISOString(),

            rememberMe:
              session.rememberMe,

            remainingSeconds:
              session.remainingSeconds,
          },
        },
      },
      200,
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "FIXORA session route error:",
      error,
    );

    return createJsonResponse(
      {
        ok:
          false,

        code:
          "SESSION_CHECK_UNAVAILABLE",

        message: {
          es:
            "No fue posible comprobar la sesión en este momento.",

          en:
            "The session could not be checked at this time.",
        },

        data: {
          authenticated:
            false,
        },
      },
      503,
    );
  }
}