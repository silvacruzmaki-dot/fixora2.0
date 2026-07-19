export const AUTH_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type AuthRole =
  (typeof AUTH_ROLES)[keyof typeof AUTH_ROLES];

export const AUTH_USER_STATUSES = {
  PENDING_VERIFICATION:
    "PENDING_VERIFICATION",

  ACTIVE:
    "ACTIVE",

  LOCKED:
    "LOCKED",

  DISABLED:
    "DISABLED",
} as const;

export type AuthUserStatus =
  (typeof AUTH_USER_STATUSES)[keyof typeof AUTH_USER_STATUSES];

export const AUTH_CODE_PURPOSES = {
  EMAIL_VERIFICATION:
    "EMAIL_VERIFICATION",

  PASSWORD_RESET:
    "PASSWORD_RESET",
} as const;

export type AuthCodePurpose =
  (typeof AUTH_CODE_PURPOSES)[keyof typeof AUTH_CODE_PURPOSES];

export const AUTH_LANGUAGES = {
  SPANISH: "es",
  ENGLISH: "en",
} as const;

export type AuthLanguage =
  (typeof AUTH_LANGUAGES)[keyof typeof AUTH_LANGUAGES];

export const AUTH_THEMES = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
} as const;

export type AuthTheme =
  (typeof AUTH_THEMES)[keyof typeof AUTH_THEMES];

export const AUTH_DEFAULTS = {
  ROLE:
    AUTH_ROLES.USER,

  STATUS:
    AUTH_USER_STATUSES.PENDING_VERIFICATION,

  LANGUAGE:
    AUTH_LANGUAGES.SPANISH,

  THEME:
    AUTH_THEMES.SYSTEM,
} as const;

/*
 * Contraseñas
 *
 * El servidor debe aplicar estos límites incluso cuando
 * el formulario del cliente también realice validaciones.
 */
export const AUTH_PASSWORD_POLICY = {
  MINIMUM_LENGTH: 8,

  RECOMMENDED_LENGTH: 12,

  MAXIMUM_LENGTH: 128,

  REQUIRE_UPPERCASE: true,

  REQUIRE_LOWERCASE: true,

  REQUIRE_NUMBER: true,

  REQUIRE_SPECIAL_CHARACTER: true,

  MAXIMUM_HASH_INPUT_BYTES: 1024,
} as const;

/*
 * Parámetros para Argon2id.
 *
 * Estos valores equilibran seguridad y rendimiento para
 * un proyecto web ejecutado en un servidor convencional.
 */
export const AUTH_PASSWORD_HASH_OPTIONS = {
  TYPE: "argon2id",

  MEMORY_COST: 65_536,

  TIME_COST: 3,

  PARALLELISM: 1,

  HASH_LENGTH: 32,
} as const;

/*
 * Sesiones
 */
export const AUTH_SESSION_COOKIE_NAME =
  "fixora_session";

export const AUTH_SESSION_COOKIE_PATH =
  "/";

export const AUTH_SESSION_COOKIE_SAME_SITE =
  "lax" as const;

export const AUTH_SESSION_COOKIE_HTTP_ONLY =
  true;

export const AUTH_SESSION_COOKIE_SECURE_IN_PRODUCTION =
  true;

export const AUTH_SESSION_TOKEN_BYTES =
  48;

export const AUTH_SESSION_TOKEN_HASH_ALGORITHM =
  "sha256";

export const AUTH_SESSION_DURATION_SECONDS =
  60 * 60 * 12;

export const AUTH_REMEMBERED_SESSION_DURATION_SECONDS =
  60 * 60 * 24 * 30;

export const AUTH_SESSION_REFRESH_THRESHOLD_SECONDS =
  60 * 60;

/*
 * Códigos de verificación y recuperación.
 */
export const AUTH_CODE_LENGTH =
  6;

export const AUTH_CODE_TOKEN_BYTES =
  32;

export const AUTH_CODE_HASH_ALGORITHM =
  "sha256";

export const AUTH_EMAIL_VERIFICATION_CODE_EXPIRATION_SECONDS =
  60 * 10;

export const AUTH_PASSWORD_RESET_CODE_EXPIRATION_SECONDS =
  60 * 10;

export const AUTH_CODE_RESEND_COOLDOWN_SECONDS =
  60;

export const AUTH_MAXIMUM_CODE_ATTEMPTS =
  5;

export const AUTH_MAXIMUM_CODE_RESENDS =
  5;

export const AUTH_CODE_RESEND_WINDOW_SECONDS =
  60 * 60;

/*
 * Intentos de inicio de sesión y bloqueo de cuentas.
 */
export const AUTH_LOGIN_POLICY = {
  MAXIMUM_FAILED_ATTEMPTS: 5,

  LOCK_DURATION_SECONDS:
    60 * 15,

  ATTEMPT_WINDOW_SECONDS:
    60 * 15,

  SUCCESSFUL_LOGIN_RESETS_ATTEMPTS:
    true,
} as const;

/*
 * Límites generales por endpoint.
 *
 * Cada ruta puede utilizar namespace, limit y windowSeconds
 * al invocar el servicio de rate limit.
 */
export const AUTH_RATE_LIMITS = {
  REGISTER: {
    NAMESPACE:
      "auth:register",

    LIMIT: 5,

    WINDOW_SECONDS:
      60 * 60,
  },

  LOGIN: {
    NAMESPACE:
      "auth:login",

    LIMIT: 10,

    WINDOW_SECONDS:
      60 * 15,
  },

  ADMIN_LOGIN: {
    NAMESPACE:
      "auth:admin-login",

    LIMIT: 8,

    WINDOW_SECONDS:
      60 * 15,
  },

  SESSION: {
    NAMESPACE:
      "auth:session",

    LIMIT: 120,

    WINDOW_SECONDS:
      60,
  },

  LOGOUT: {
    NAMESPACE:
      "auth:logout",

    LIMIT: 30,

    WINDOW_SECONDS:
      60,
  },

  VERIFY_EMAIL: {
    NAMESPACE:
      "auth:verify-email",

    LIMIT: 10,

    WINDOW_SECONDS:
      60 * 15,
  },

  RESEND_CODE: {
    NAMESPACE:
      "auth:resend-code",

    LIMIT: 5,

    WINDOW_SECONDS:
      60 * 60,
  },

  FORGOT_PASSWORD: {
    NAMESPACE:
      "auth:forgot-password",

    LIMIT: 5,

    WINDOW_SECONDS:
      60 * 60,
  },

  VERIFY_PASSWORD_RESET: {
    NAMESPACE:
      "auth:verify-password-reset",

    LIMIT: 10,

    WINDOW_SECONDS:
      60 * 15,
  },

  RESET_PASSWORD: {
    NAMESPACE:
      "auth:reset-password",

    LIMIT: 5,

    WINDOW_SECONDS:
      60 * 60,
  },

  PROFILE_READ: {
    NAMESPACE:
      "profile:read",

    LIMIT: 120,

    WINDOW_SECONDS:
      60,
  },

  PROFILE_UPDATE: {
    NAMESPACE:
      "profile:update",

    LIMIT: 20,

    WINDOW_SECONDS:
      60 * 15,
  },

  AVATAR_UPDATE: {
    NAMESPACE:
      "profile:avatar-update",

    LIMIT: 10,

    WINDOW_SECONDS:
      60 * 15,
  },

  NOTIFICATIONS: {
    NAMESPACE:
      "notifications",

    LIMIT: 120,

    WINDOW_SECONDS:
      60,
  },

  ADMIN_USERS: {
    NAMESPACE:
      "admin:users",

    LIMIT: 120,

    WINDOW_SECONDS:
      60,
  },
} as const;

/*
 * Claves utilizadas únicamente para conservar datos
 * temporales del flujo en sessionStorage.
 *
 * Nunca se debe guardar la sesión real ni la contraseña
 * dentro de localStorage o sessionStorage.
 */
export const AUTH_STORAGE_KEYS = {
  PENDING_VERIFICATION:
    "fixora.pendingVerification",

  PASSWORD_RECOVERY:
    "fixora.passwordRecovery",

  REDIRECT:
    "fixora.authRedirect",
} as const;

/*
 * Límites de campos de usuario.
 */
export const AUTH_USER_FIELD_LIMITS = {
  FIRST_NAME_MINIMUM_LENGTH:
    2,

  FIRST_NAME_MAXIMUM_LENGTH:
    80,

  LAST_NAME_MINIMUM_LENGTH:
    2,

  LAST_NAME_MAXIMUM_LENGTH:
    100,

  DISPLAY_NAME_MINIMUM_LENGTH:
    2,

  DISPLAY_NAME_MAXIMUM_LENGTH:
    80,

  EMAIL_MAXIMUM_LENGTH:
    254,

  AVATAR_URL_MAXIMUM_LENGTH:
    2_048,
} as const;

/*
 * Configuración de avatar.
 */
export const AUTH_AVATAR_POLICY = {
  MAXIMUM_FILE_SIZE_BYTES:
    5 * 1024 * 1024,

  ALLOWED_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],

  ALLOWED_EXTENSIONS: [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ],
} as const;

/*
 * Correos electrónicos.
 */
export const AUTH_EMAIL_POLICY = {
  MASK_VISIBLE_PREFIX_CHARACTERS:
    1,

  MASK_VISIBLE_DOMAIN_CHARACTERS:
    0,

  SUBJECT_PREFIX:
    "FIXORA",

  VERIFICATION_TEMPLATE:
    "verify-email",

  PASSWORD_RESET_TEMPLATE:
    "reset-password",
} as const;

/*
 * Eventos registrados en la auditoría.
 */
export const AUTH_AUDIT_ACTIONS = {
  USER_REGISTERED:
    "USER_REGISTERED",

  EMAIL_VERIFIED:
    "EMAIL_VERIFIED",

  VERIFICATION_CODE_SENT:
    "VERIFICATION_CODE_SENT",

  PASSWORD_RESET_REQUESTED:
    "PASSWORD_RESET_REQUESTED",

  PASSWORD_RESET_COMPLETED:
    "PASSWORD_RESET_COMPLETED",

  LOGIN_SUCCEEDED:
    "LOGIN_SUCCEEDED",

  LOGIN_FAILED:
    "LOGIN_FAILED",

  ADMIN_LOGIN_SUCCEEDED:
    "ADMIN_LOGIN_SUCCEEDED",

  ADMIN_LOGIN_FAILED:
    "ADMIN_LOGIN_FAILED",

  SESSION_REVOKED:
    "SESSION_REVOKED",

  ALL_SESSIONS_REVOKED:
    "ALL_SESSIONS_REVOKED",

  PROFILE_UPDATED:
    "PROFILE_UPDATED",

  AVATAR_UPDATED:
    "AVATAR_UPDATED",

  ADMIN_USER_UPDATED:
    "ADMIN_USER_UPDATED",
} as const;

export type AuthAuditAction =
  (typeof AUTH_AUDIT_ACTIONS)[keyof typeof AUTH_AUDIT_ACTIONS];

/*
 * Métodos HTTP que modifican información.
 * Serán utilizados para validar el encabezado Origin.
 */
export const AUTH_MUTATING_HTTP_METHODS = [
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
] as const;

export function isAuthRole(
  value: unknown,
): value is AuthRole {
  return (
    typeof value === "string" &&
    Object.values(
      AUTH_ROLES,
    ).includes(
      value as AuthRole,
    )
  );
}

export function isAuthUserStatus(
  value: unknown,
): value is AuthUserStatus {
  return (
    typeof value === "string" &&
    Object.values(
      AUTH_USER_STATUSES,
    ).includes(
      value as AuthUserStatus,
    )
  );
}

export function isAuthCodePurpose(
  value: unknown,
): value is AuthCodePurpose {
  return (
    typeof value === "string" &&
    Object.values(
      AUTH_CODE_PURPOSES,
    ).includes(
      value as AuthCodePurpose,
    )
  );
}

export function isAuthLanguage(
  value: unknown,
): value is AuthLanguage {
  return (
    typeof value === "string" &&
    Object.values(
      AUTH_LANGUAGES,
    ).includes(
      value as AuthLanguage,
    )
  );
}

export function isAuthTheme(
  value: unknown,
): value is AuthTheme {
  return (
    typeof value === "string" &&
    Object.values(
      AUTH_THEMES,
    ).includes(
      value as AuthTheme,
    )
  );
}