import type {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  AUTH_SESSION_COOKIE_HTTP_ONLY,
  AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_COOKIE_PATH,
  AUTH_SESSION_COOKIE_SAME_SITE,
  AUTH_SESSION_COOKIE_SECURE_IN_PRODUCTION,
} from "@/constants/auth/auth.constants";

import {
  assertValidSessionToken,
  isValidSessionToken,
} from "@/lib/auth/session";

export type SessionCookieDateInput =
  | Date
  | string
  | number;

export interface SetSessionCookieInput {
  token: string;

  expiresAt:
    SessionCookieDateInput;

  rememberMe: boolean;
}

interface CookieStoreLike {
  get: (
    name: string,
  ) =>
    | string
    | {
        value?: string;
      }
    | undefined;
}

interface RequestWithOptionalCookies
  extends Request {
  cookies?: CookieStoreLike;
}

function isProductionEnvironment():
  boolean {
  return (
    process.env.NODE_ENV ===
    "production"
  );
}

function shouldUseSecureCookie():
  boolean {
  return (
    AUTH_SESSION_COOKIE_SECURE_IN_PRODUCTION &&
    isProductionEnvironment()
  );
}

function parseCookieExpiration(
  value: SessionCookieDateInput,
): Date {
  const expirationDate =
    value instanceof Date
      ? new Date(
          value.getTime(),
        )
      : new Date(value);

  if (
    Number.isNaN(
      expirationDate.getTime(),
    )
  ) {
    throw new RangeError(
      "La fecha de vencimiento de la cookie de sesión no es válida.",
    );
  }

  return expirationDate;
}

function calculateCookieMaximumAge(
  expiresAt: Date,
  now = new Date(),
): number {
  const maximumAgeSeconds =
    Math.ceil(
      (
        expiresAt.getTime() -
        now.getTime()
      ) / 1_000,
    );

  if (
    maximumAgeSeconds <= 0
  ) {
    throw new RangeError(
      "No se puede crear una cookie de sesión con una fecha de vencimiento pasada.",
    );
  }

  return maximumAgeSeconds;
}

function getSessionCookieBaseOptions() {
  return {
    httpOnly:
      AUTH_SESSION_COOKIE_HTTP_ONLY,

    secure:
      shouldUseSecureCookie(),

    sameSite:
      AUTH_SESSION_COOKIE_SAME_SITE,

    path:
      AUTH_SESSION_COOKIE_PATH,
  } as const;
}

function decodeCookieValue(
  value: string,
): string {
  try {
    return decodeURIComponent(
      value,
    );
  } catch {
    return value;
  }
}

function readCookieHeaderValue(
  cookieHeader: string | null,
  cookieName: string,
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookieParts =
    cookieHeader.split(";");

  for (
    const cookiePart
    of cookieParts
  ) {
    const separatorIndex =
      cookiePart.indexOf("=");

    if (
      separatorIndex === -1
    ) {
      continue;
    }

    const name =
      cookiePart
        .slice(
          0,
          separatorIndex,
        )
        .trim();

    if (
      name !== cookieName
    ) {
      continue;
    }

    const value =
      cookiePart
        .slice(
          separatorIndex + 1,
        )
        .trim();

    return value
      ? decodeCookieValue(
          value,
        )
      : null;
  }

  return null;
}

function readCookieStoreValue(
  request:
    | NextRequest
    | Request,
): string | null {
  const requestWithCookies =
    request as RequestWithOptionalCookies;

  const cookieEntry =
    requestWithCookies.cookies?.get(
      AUTH_SESSION_COOKIE_NAME,
    );

  if (
    typeof cookieEntry ===
    "string"
  ) {
    return cookieEntry;
  }

  if (
    cookieEntry &&
    typeof cookieEntry.value ===
      "string"
  ) {
    return cookieEntry.value;
  }

  return null;
}

/**
 * Escribe la cookie HttpOnly que contiene el token
 * opaco de sesión.
 *
 * Sesión normal:
 * - Se crea como cookie de sesión del navegador.
 * - El servidor seguirá controlando el vencimiento.
 *
 * Sesión con "recordarme":
 * - Se conserva hasta la fecha indicada en expiresAt.
 */
export function setSessionCookie<
  TResponse extends NextResponse<unknown>,
>(
  response: TResponse,
  {
    token,
    expiresAt,
    rememberMe,
  }: SetSessionCookieInput,
): TResponse {
  assertValidSessionToken(
    token,
  );

  const baseOptions =
    getSessionCookieBaseOptions();

  if (rememberMe) {
    const expirationDate =
      parseCookieExpiration(
        expiresAt,
      );

    const maximumAge =
      calculateCookieMaximumAge(
        expirationDate,
      );

    response.cookies.set({
      name:
        AUTH_SESSION_COOKIE_NAME,

      value:
        token,

      ...baseOptions,

      expires:
        expirationDate,

      maxAge:
        maximumAge,
    });

    return response;
  }

  /*
   * Al omitir expires y maxAge, el navegador elimina
   * la cookie cuando finaliza la sesión del navegador.
   *
   * La sesión en SQL Server mantiene su propio
   * vencimiento de 12 horas.
   */
  response.cookies.set({
    name:
      AUTH_SESSION_COOKIE_NAME,

    value:
      token,

    ...baseOptions,
  });

  return response;
}

/**
 * Elimina la cookie de sesión.
 *
 * Se utiliza una cookie expirada con la misma ruta y
 * las mismas opciones de seguridad para asegurar que
 * el navegador elimine la cookie correcta.
 */
export function clearSessionCookie<
  TResponse extends NextResponse<unknown>,
>(
  response: TResponse,
): TResponse {
  response.cookies.set({
    name:
      AUTH_SESSION_COOKIE_NAME,

    value:
      "",

    ...getSessionCookieBaseOptions(),

    expires:
      new Date(0),

    maxAge:
      0,
  });

  return response;
}

/**
 * Obtiene y valida el token desde una solicitud.
 *
 * Primero utiliza el almacén de cookies de NextRequest.
 * Como respaldo, lee directamente el encabezado Cookie.
 */
export function getSessionTokenFromRequest(
  request:
    | NextRequest
    | Request,
): string | null {
  const cookieStoreValue =
    readCookieStoreValue(
      request,
    );

  const rawToken =
    cookieStoreValue ??
    readCookieHeaderValue(
      request.headers.get(
        "cookie",
      ),
      AUTH_SESSION_COOKIE_NAME,
    );

  if (
    !isValidSessionToken(
      rawToken,
    )
  ) {
    return null;
  }

  return rawToken;
}

/**
 * Comprueba si la solicitud contiene un token de sesión
 * con el formato esperado.
 *
 * No comprueba que la sesión exista en la base de datos.
 */
export function requestHasSessionToken(
  request:
    | NextRequest
    | Request,
): boolean {
  return (
    getSessionTokenFromRequest(
      request,
    ) !== null
  );
}