import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  AUTH_SESSION_COOKIE_NAME,
} from "@/constants/auth/auth.constants";

const USER_LOGIN_PATH =
  "/iniciar-sesion";

const ADMIN_LOGIN_PATH =
  "/admin/iniciar-sesion";

const USER_PROTECTED_PATHS = [
  "/perfil",
  "/notificaciones",
] as const;

const ADMIN_PROTECTED_PATHS = [
  "/admin",
] as const;

const NON_INDEXABLE_PATHS = [
  "/iniciar-sesion",
  "/registrarse",
  "/verificar-correo",
  "/recuperar-password",
  "/restablecer-password",
  "/perfil",
  "/notificaciones",
  "/admin",
] as const;

function matchesPathPrefix(
  pathname: string,
  route: string,
): boolean {
  return (
    pathname ===
      route ||
    pathname.startsWith(
      `${route}/`,
    )
  );
}

function isUserProtectedPath(
  pathname: string,
): boolean {
  return USER_PROTECTED_PATHS.some(
    (
      route,
    ) =>
      matchesPathPrefix(
        pathname,
        route,
      ),
  );
}

function isAdminLoginPath(
  pathname: string,
): boolean {
  return (
    pathname ===
      ADMIN_LOGIN_PATH ||
    pathname.startsWith(
      `${ADMIN_LOGIN_PATH}/`,
    )
  );
}

function isAdminProtectedPath(
  pathname: string,
): boolean {
  if (
    isAdminLoginPath(
      pathname,
    )
  ) {
    return false;
  }

  return ADMIN_PROTECTED_PATHS.some(
    (
      route,
    ) =>
      matchesPathPrefix(
        pathname,
        route,
      ),
  );
}

function shouldPreventIndexing(
  pathname: string,
): boolean {
  return NON_INDEXABLE_PATHS.some(
    (
      route,
    ) =>
      matchesPathPrefix(
        pathname,
        route,
      ),
  );
}

function hasSessionCookie(
  request:
    NextRequest,
): boolean {
  const sessionCookie =
    request.cookies.get(
      AUTH_SESSION_COOKIE_NAME,
    );

  return Boolean(
    sessionCookie?.value
      .trim(),
  );
}

function createSafeReturnTo(
  request:
    NextRequest,
): string {
  const pathname =
    request.nextUrl.pathname;

  const search =
    request.nextUrl.search;

  const returnTo =
    `${pathname}${search}`;

  /*
   * returnTo se construye únicamente con una ruta interna
   * obtenida de la solicitud actual.
   */
  return returnTo.startsWith(
    "/",
  )
    ? returnTo
    : "/";
}

function createLoginRedirect(
  request:
    NextRequest,
  loginPath: string,
): NextResponse {
  const redirectUrl =
    request.nextUrl.clone();

  redirectUrl.pathname =
    loginPath;

  redirectUrl.search =
    "";

  redirectUrl.searchParams.set(
    "returnTo",
    createSafeReturnTo(
      request,
    ),
  );

  return NextResponse.redirect(
    redirectUrl,
  );
}

function applySecurityHeaders(
  response:
    NextResponse,
  pathname: string,
): NextResponse {
  response.headers.set(
    "X-Content-Type-Options",
    "nosniff",
  );

  response.headers.set(
    "X-Frame-Options",
    "DENY",
  );

  response.headers.set(
    "Referrer-Policy",
    "strict-origin-when-cross-origin",
  );

  response.headers.set(
    "Permissions-Policy",
    [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
    ].join(", "),
  );

  response.headers.set(
    "Cross-Origin-Opener-Policy",
    "same-origin",
  );

  response.headers.set(
    "Cross-Origin-Resource-Policy",
    "same-origin",
  );

  if (
    shouldPreventIndexing(
      pathname,
    )
  ) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive",
    );
  }

  return response;
}

/**
 * Proxy de navegación para páginas protegidas.
 *
 * Importante:
 *
 * Este archivo solamente comprueba que exista la cookie.
 * No valida:
 *
 * - Si el token está revocado.
 * - Si la sesión expiró.
 * - Si el usuario está activo.
 * - Si el usuario posee rol ADMIN.
 *
 * La validación completa continúa realizándose en los
 * servicios del servidor y en las páginas protegidas.
 */
export function proxy(
  request:
    NextRequest,
): NextResponse {
  const pathname =
    request.nextUrl.pathname;

  const sessionCookieExists =
    hasSessionCookie(
      request,
    );

  if (
    isAdminProtectedPath(
      pathname,
    ) &&
    !sessionCookieExists
  ) {
    const response =
      createLoginRedirect(
        request,
        ADMIN_LOGIN_PATH,
      );

    return applySecurityHeaders(
      response,
      pathname,
    );
  }

  if (
    isUserProtectedPath(
      pathname,
    ) &&
    !sessionCookieExists
  ) {
    const response =
      createLoginRedirect(
        request,
        USER_LOGIN_PATH,
      );

    return applySecurityHeaders(
      response,
      pathname,
    );
  }

  const response =
    NextResponse.next();

  return applySecurityHeaders(
    response,
    pathname,
  );
}

export const config = {
  matcher: [
    /*
     * No interceptar:
     *
     * - API Routes.
     * - Archivos internos de Next.js.
     * - Imágenes optimizadas.
     * - favicon.
     * - robots.txt.
     * - sitemap.xml.
     * - Archivos públicos con extensión.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};