/*
 * Rutas públicas relacionadas con autenticación.
 */
export const AUTH_ROUTES = {
  HOME: "/",

  LOGIN: "/iniciar-sesion",
  REGISTER: "/registrarse",

  VERIFY_EMAIL: "/verificar-correo",

  FORGOT_PASSWORD: "/recuperar-password",
  RESET_PASSWORD: "/restablecer-password",

  PROFILE: "/perfil",
  NOTIFICATIONS: "/notificaciones",
  SETTINGS: "/ajustes",

  ADMIN_LOGIN: "/admin/iniciar-sesion",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/usuarios",
} as const;

export type AuthPageRoute =
  (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES];

/*
 * Endpoints de autenticación para usuarios.
 */
export const AUTH_API_ROUTES = {
  REGISTER:
    "/api/auth/registrar",

  LOGIN:
    "/api/auth/iniciar-sesion",

  LOGOUT:
    "/api/auth/cerrar-sesion",

  SESSION:
    "/api/auth/sesion",

  VERIFY_EMAIL:
    "/api/auth/verificar-correo",

  RESEND_CODE:
    "/api/auth/reenviar-codigo",

  FORGOT_PASSWORD:
    "/api/auth/recuperar-password",

  VERIFY_PASSWORD_RESET:
    "/api/auth/verificar-recuperacion",

  RESET_PASSWORD:
    "/api/auth/restablecer-password",

  PROFILE:
    "/api/perfil",

  PROFILE_AVATAR:
    "/api/perfil/avatar",

  NOTIFICATIONS:
    "/api/notificaciones",

  READ_ALL_NOTIFICATIONS:
    "/api/notificaciones/leer-todas",

  ADMIN_LOGIN:
    "/api/admin/auth/iniciar-sesion",

  ADMIN_SESSION:
    "/api/admin/auth/sesion",
} as const;

export type AuthApiRoute =
  (typeof AUTH_API_ROUTES)[keyof typeof AUTH_API_ROUTES];

/*
 * Prefijos principales.
 */
export const AUTH_ROUTE_PREFIXES = {
  API: "/api",

  USER_AUTH_API:
    "/api/auth",

  ADMIN:
    "/admin",

  ADMIN_AUTH_API:
    "/api/admin/auth",
} as const;

/*
 * Páginas destinadas a visitantes que todavía
 * no han iniciado sesión.
 */
export const AUTH_GUEST_ONLY_ROUTES = [
  AUTH_ROUTES.LOGIN,
  AUTH_ROUTES.REGISTER,
  AUTH_ROUTES.FORGOT_PASSWORD,
  AUTH_ROUTES.RESET_PASSWORD,
] as const;

/*
 * La verificación de correo puede abrirse aunque
 * exista una sesión parcial o una cuenta pendiente.
 */
export const AUTH_VERIFICATION_ROUTES = [
  AUTH_ROUTES.VERIFY_EMAIL,
] as const;

/*
 * Rutas que requieren una sesión normal válida.
 */
export const AUTH_USER_PROTECTED_ROUTES = [
  AUTH_ROUTES.PROFILE,
  AUTH_ROUTES.NOTIFICATIONS,
] as const;

/*
 * Rutas que requieren una sesión con rol ADMIN.
 *
 * Al comprobar `/admin` también se incluyen sus rutas
 * hijas, excepto el formulario de inicio de sesión.
 */
export const AUTH_ADMIN_PROTECTED_ROUTES = [
  AUTH_ROUTES.ADMIN_DASHBOARD,
] as const;

/*
 * Rutas administrativas que pueden abrirse sin
 * una sesión administrativa.
 */
export const AUTH_ADMIN_PUBLIC_ROUTES = [
  AUTH_ROUTES.ADMIN_LOGIN,
] as const;

/*
 * Destinos predeterminados después de autenticar.
 */
export const AUTH_DEFAULT_REDIRECTS = {
  AFTER_USER_LOGIN:
    AUTH_ROUTES.PROFILE,

  AFTER_USER_REGISTRATION:
    AUTH_ROUTES.VERIFY_EMAIL,

  AFTER_EMAIL_VERIFICATION:
    AUTH_ROUTES.PROFILE,

  AFTER_PASSWORD_RESET:
    AUTH_ROUTES.LOGIN,

  AFTER_USER_LOGOUT:
    AUTH_ROUTES.HOME,

  AFTER_ADMIN_LOGIN:
    AUTH_ROUTES.ADMIN_DASHBOARD,

  AFTER_ADMIN_LOGOUT:
    AUTH_ROUTES.ADMIN_LOGIN,
} as const;

/*
 * Parámetros utilizados dentro de las rutas.
 */
export const AUTH_ROUTE_QUERY_KEYS = {
  REDIRECT:
    "redirect",

  EMAIL:
    "email",

  SOURCE:
    "source",

  VERIFIED:
    "verified",

  PASSWORD_RESET:
    "passwordReset",

  SESSION_EXPIRED:
    "sessionExpired",
} as const;

const INTERNAL_URL_BASE =
  "https://fixora.internal";

function removeTrailingSlash(
  pathname: string,
): string {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(
    /\/+$/,
    "",
  );
}

/*
 * Normaliza solamente el pathname.
 *
 * No devuelve parámetros ni fragmentos.
 */
export function normalizeAuthPathname(
  pathname: string,
): string {
  const trimmedPathname =
    pathname.trim();

  if (!trimmedPathname) {
    return "/";
  }

  try {
    const parsedUrl =
      new URL(
        trimmedPathname,
        INTERNAL_URL_BASE,
      );

    return removeTrailingSlash(
      parsedUrl.pathname || "/",
    );
  } catch {
    const pathWithoutQuery =
      trimmedPathname
        .split("?")[0]
        ?.split("#")[0] ?? "/";

    const pathWithSlash =
      pathWithoutQuery.startsWith("/")
        ? pathWithoutQuery
        : `/${pathWithoutQuery}`;

    return removeTrailingSlash(
      pathWithSlash,
    );
  }
}

/*
 * Comprueba una ruta exacta o cualquiera de
 * sus rutas hijas.
 *
 * Ejemplo:
 * routeMatches("/admin/usuarios", "/admin") → true
 */
export function routeMatches(
  pathname: string,
  route: string,
  includeChildren = true,
): boolean {
  const normalizedPathname =
    normalizeAuthPathname(
      pathname,
    );

  const normalizedRoute =
    normalizeAuthPathname(
      route,
    );

  if (
    normalizedPathname ===
    normalizedRoute
  ) {
    return true;
  }

  if (
    !includeChildren ||
    normalizedRoute === "/"
  ) {
    return false;
  }

  return normalizedPathname.startsWith(
    `${normalizedRoute}/`,
  );
}

export function routeMatchesAny(
  pathname: string,
  routes: readonly string[],
  includeChildren = true,
): boolean {
  return routes.some(
    (route) =>
      routeMatches(
        pathname,
        route,
        includeChildren,
      ),
  );
}

/*
 * Valida que una dirección permanezca dentro
 * de la aplicación FIXORA.
 *
 * Rechaza:
 * - URLs externas.
 * - Rutas que empiecen con //.
 * - Barras invertidas.
 * - Protocolos como javascript: o https:.
 */
export function getSafeInternalPath(
  requestedPath: unknown,
): string | null {
  if (
    typeof requestedPath !==
    "string"
  ) {
    return null;
  }

  const trimmedPath =
    requestedPath.trim();

  if (
    !trimmedPath ||
    !trimmedPath.startsWith("/") ||
    trimmedPath.startsWith("//") ||
    trimmedPath.includes("\\") ||
    /[\u0000-\u001F\u007F]/.test(
      trimmedPath,
    )
  ) {
    return null;
  }

  try {
    const parsedUrl =
      new URL(
        trimmedPath,
        INTERNAL_URL_BASE,
      );

    if (
      parsedUrl.origin !==
      INTERNAL_URL_BASE
    ) {
      return null;
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return null;
  }
}

export function isSafeInternalPath(
  requestedPath: unknown,
): requestedPath is string {
  return (
    getSafeInternalPath(
      requestedPath,
    ) !== null
  );
}

/*
 * Redirección segura para un usuario normal.
 *
 * No permite:
 * - Área administrativa.
 * - Endpoints de API.
 * - Formularios de autenticación que generarían bucles.
 */
export function getSafeUserRedirect(
  requestedPath: unknown,
  fallback:
    AuthPageRoute | string =
    AUTH_DEFAULT_REDIRECTS.AFTER_USER_LOGIN,
): string {
  const safePath =
    getSafeInternalPath(
      requestedPath,
    );

  if (!safePath) {
    return fallback;
  }

  const pathname =
    normalizeAuthPathname(
      safePath,
    );

  const isAdministratorPath =
    routeMatches(
      pathname,
      AUTH_ROUTE_PREFIXES.ADMIN,
    );

  const isApiPath =
    routeMatches(
      pathname,
      AUTH_ROUTE_PREFIXES.API,
    );

  const isAuthenticationForm =
    routeMatchesAny(
      pathname,
      [
        ...AUTH_GUEST_ONLY_ROUTES,
        ...AUTH_VERIFICATION_ROUTES,
        AUTH_ROUTES.ADMIN_LOGIN,
      ],
      false,
    );

  if (
    isAdministratorPath ||
    isApiPath ||
    isAuthenticationForm
  ) {
    return fallback;
  }

  return safePath;
}

/*
 * Redirección segura para administradores.
 *
 * Solo permite `/admin` y sus rutas hijas,
 * excluyendo el mismo formulario de ingreso.
 */
export function getSafeAdminRedirect(
  requestedPath: unknown,
  fallback:
    AuthPageRoute | string =
    AUTH_DEFAULT_REDIRECTS.AFTER_ADMIN_LOGIN,
): string {
  const safePath =
    getSafeInternalPath(
      requestedPath,
    );

  if (!safePath) {
    return fallback;
  }

  const pathname =
    normalizeAuthPathname(
      safePath,
    );

  const isAdminPath =
    routeMatches(
      pathname,
      AUTH_ROUTES.ADMIN_DASHBOARD,
    );

  const isAdminLogin =
    routeMatches(
      pathname,
      AUTH_ROUTES.ADMIN_LOGIN,
      false,
    );

  if (
    !isAdminPath ||
    isAdminLogin
  ) {
    return fallback;
  }

  return safePath;
}

/*
 * Construye una ruta interna agregando parámetros
 * de consulta sin perder los parámetros existentes.
 */
export function buildAuthRoute(
  route: string,
  query?: Record<
    string,
    string | number | boolean | null | undefined
  >,
): string {
  const safeRoute =
    getSafeInternalPath(
      route,
    );

  if (!safeRoute) {
    return AUTH_ROUTES.HOME;
  }

  if (!query) {
    return safeRoute;
  }

  const parsedUrl =
    new URL(
      safeRoute,
      INTERNAL_URL_BASE,
    );

  Object.entries(
    query,
  ).forEach(
    ([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        parsedUrl.searchParams.delete(
          key,
        );

        return;
      }

      parsedUrl.searchParams.set(
        key,
        String(value),
      );
    },
  );

  return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
}

export function createUserLoginRoute(
  redirectTo?: unknown,
): string {
  const safeRedirect =
    getSafeUserRedirect(
      redirectTo,
      "",
    );

  return buildAuthRoute(
    AUTH_ROUTES.LOGIN,
    {
      [AUTH_ROUTE_QUERY_KEYS.REDIRECT]:
        safeRedirect || undefined,
    },
  );
}

export function createRegisterRoute(
  redirectTo?: unknown,
): string {
  const safeRedirect =
    getSafeUserRedirect(
      redirectTo,
      "",
    );

  return buildAuthRoute(
    AUTH_ROUTES.REGISTER,
    {
      [AUTH_ROUTE_QUERY_KEYS.REDIRECT]:
        safeRedirect || undefined,
    },
  );
}

export function createAdminLoginRoute(
  redirectTo?: unknown,
): string {
  const safeRedirect =
    getSafeAdminRedirect(
      redirectTo,
      "",
    );

  return buildAuthRoute(
    AUTH_ROUTES.ADMIN_LOGIN,
    {
      [AUTH_ROUTE_QUERY_KEYS.REDIRECT]:
        safeRedirect || undefined,
    },
  );
}

export function isGuestOnlyAuthRoute(
  pathname: string,
): boolean {
  return routeMatchesAny(
    pathname,
    AUTH_GUEST_ONLY_ROUTES,
    false,
  );
}

export function isVerificationRoute(
  pathname: string,
): boolean {
  return routeMatchesAny(
    pathname,
    AUTH_VERIFICATION_ROUTES,
    false,
  );
}

export function isUserProtectedRoute(
  pathname: string,
): boolean {
  return routeMatchesAny(
    pathname,
    AUTH_USER_PROTECTED_ROUTES,
  );
}

export function isAdminPublicRoute(
  pathname: string,
): boolean {
  return routeMatchesAny(
    pathname,
    AUTH_ADMIN_PUBLIC_ROUTES,
    false,
  );
}

export function isAdminProtectedRoute(
  pathname: string,
): boolean {
  if (
    isAdminPublicRoute(
      pathname,
    )
  ) {
    return false;
  }

  return routeMatchesAny(
    pathname,
    AUTH_ADMIN_PROTECTED_ROUTES,
  );
}

export function isAuthApiRoute(
  pathname: string,
): boolean {
  return routeMatches(
    pathname,
    AUTH_ROUTE_PREFIXES.USER_AUTH_API,
  );
}

export function isAdminAuthApiRoute(
  pathname: string,
): boolean {
  return routeMatches(
    pathname,
    AUTH_ROUTE_PREFIXES.ADMIN_AUTH_API,
  );
}