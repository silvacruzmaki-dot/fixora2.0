import "server-only";

import {
  AUTH_LANGUAGES,
  AUTH_ROLES,
  AUTH_USER_FIELD_LIMITS,
  isAuthRole,
  isAuthUserStatus,
  type AuthLanguage,
  type AuthRole,
  type AuthUserStatus,
} from "@/constants/auth/auth.constants";

import {
  AUTH_PERMISSIONS,
  assertPermission,
} from "@/lib/auth/permissions";

import { prisma } from "@/lib/database/prisma";

import {
  getAuthenticatedSessionByToken,
  type AuthRequestMetadata,
  type AuthServiceUser,
} from "@/server/services/auth.service";

import { createAuditLogSafely } from "@/server/repositories/audit-log.repository";

import {
  findUserById,
  updateUserAvatar,
  updateUserPreferences,
  updateUserProfile,
} from "@/server/repositories/user.repository";

export type ProfileServiceErrorCode =
  | "PROFILE_INPUT_INVALID"
  | "PROFILE_NOT_FOUND"
  | "PROFILE_READ_FAILED"
  | "PROFILE_UPDATE_FAILED"
  | "PROFILE_AVATAR_UPDATE_FAILED";

export type ProfileServiceField =
  | "firstName"
  | "lastName"
  | "displayName"
  | "preferredLanguage"
  | "preferredTheme"
  | "avatarUrl"
  | "_form";

export type ProfileServiceFieldErrors = Partial<
  Record<ProfileServiceField, string[]>
>;

export type ProfileTheme =
  | "light"
  | "dark"
  | "system";

export type ProfileRequestMetadata =
  AuthRequestMetadata;

export interface UserProfile {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  avatarUrl: string | null;

  role: AuthRole;
  status: AuthUserStatus;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerifiedAt: Date | null;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
  passwordChangedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileInput {
  firstName?: unknown;
  lastName?: unknown;
  displayName?: unknown;

  preferredLanguage?: unknown;
  preferredTheme?: unknown;
}

export interface UpdateAvatarInput {
  avatarUrl?: unknown;
}

export interface ProfileSessionData {
  id: string;

  expiresAt: Date;
  lastSeenAt: Date;

  rememberMe: boolean;
  remainingSeconds: number;
}

export interface AuthenticatedProfileResult {
  status: "authenticated";

  profile: UserProfile;
  user: UserProfile;

  session: ProfileSessionData;
}

export interface InvalidProfileSessionResult {
  status: "invalid-session";

  profile: null;
  user: null;
}

export interface UnavailableProfileAccountResult {
  status: "account-unavailable";

  profile: null;
  user: null;
}

export type GetProfileResult =
  | AuthenticatedProfileResult
  | InvalidProfileSessionResult
  | UnavailableProfileAccountResult;

export interface ProfileUpdatedResult {
  status: "updated";

  profile: UserProfile;
  user: UserProfile;

  updated: true;
  noChanges: false;

  updatedFields: string[];
}

export interface ProfileNoChangesResult {
  status: "no-changes";

  profile: UserProfile;
  user: UserProfile;

  updated: false;
  noChanges: true;

  updatedFields: [];
}

export type UpdateProfileResult =
  | ProfileUpdatedResult
  | ProfileNoChangesResult
  | InvalidProfileSessionResult
  | UnavailableProfileAccountResult;

export interface AvatarUpdatedResult {
  status: "updated";

  profile: UserProfile;
  user: UserProfile;

  avatarUrl: string | null;

  updated: true;
  noChanges: false;

  updatedFields: ["avatarUrl"];
}

export interface AvatarNoChangesResult {
  status: "no-changes";

  profile: UserProfile;
  user: UserProfile;

  avatarUrl: string | null;

  updated: false;
  noChanges: true;

  updatedFields: [];
}

export type UpdateAvatarResult =
  | AvatarUpdatedResult
  | AvatarNoChangesResult
  | InvalidProfileSessionResult
  | UnavailableProfileAccountResult;

interface UpdateProfileCommand {
  sessionToken?: unknown;
  token?: unknown;

  data?: unknown;
  profile?: unknown;
  updates?: unknown;

  metadata?: ProfileRequestMetadata;
}

interface UpdateAvatarCommand {
  sessionToken?: unknown;
  token?: unknown;

  data?: unknown;
  avatar?: unknown;
  updates?: unknown;

  metadata?: ProfileRequestMetadata;
}

interface NormalizedProfileUpdate {
  firstName?: string;
  lastName?: string;
  displayName?: string;

  preferredLanguage?: AuthLanguage;
  preferredTheme?: ProfileTheme;
}

interface NormalizedAvatarUpdate {
  avatarUrl: string | null;
}

interface ResolvedProfileSession {
  user: AuthServiceUser;
  profile: UserProfile;
  session: ProfileSessionData;
}

export class ProfileServiceError extends Error {
  readonly code: ProfileServiceErrorCode;
  readonly httpStatus: number;
  readonly fieldErrors: ProfileServiceFieldErrors;

  constructor(
    code: ProfileServiceErrorCode,
    message: string,
    options?: {
      cause?: unknown;
      httpStatus?: number;
      fieldErrors?: ProfileServiceFieldErrors;
    },
  ) {
    super(message, {
      cause: options?.cause,
    });

    this.name = "ProfileServiceError";
    this.code = code;

    this.httpStatus =
      options?.httpStatus ??
      (
        code === "PROFILE_INPUT_INVALID"
          ? 400
          : code === "PROFILE_NOT_FOUND"
            ? 404
            : 500
      );

    this.fieldErrors =
      options?.fieldErrors ?? {};
  }
}

const PERSON_NAME_PATTERN =
  /^[\p{L}\p{M}]+(?:[ '\-’][\p{L}\p{M}]+)*$/u;

const DISPLAY_NAME_PATTERN =
  /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} .,'’_-]*$/u;

const ALLOWED_PROFILE_THEMES =
  new Set<ProfileTheme>([
    "light",
    "dark",
    "system",
  ]);

const HASH_PATTERN =
  /^[a-f0-9]{64}$/i;

const MAXIMUM_USER_AGENT_LENGTH =
  500;

const MAXIMUM_AVATAR_URL_LENGTH =
  500;

const PROFILE_INPUT_ALIAS_KEYS = {
  firstName: [
    "first_name",
    "names",
    "nombres",
  ],

  lastName: [
    "last_name",
    "surnames",
    "apellidos",
  ],

  displayName: [
    "display_name",
    "visibleName",
    "visible_name",
    "nombreVisible",
    "nombre_visible",
  ],

  preferredLanguage: [
    "preferred_language",
    "language",
    "idioma",
  ],

  preferredTheme: [
    "preferred_theme",
    "theme",
    "tema",
  ],
} as const;

const AVATAR_INPUT_ALIAS_KEYS = [
  "avatar",
  "url",
  "avatar_url",
  "imageUrl",
  "image_url",
] as const;

/*
 * Estos campos pueden llegar desde un formulario que
 * conserve el perfil completo, pero nunca se modifican.
 */
const ALLOWED_READ_ONLY_PROFILE_KEYS =
  new Set([
    "id",
    "email",
    "role",
    "status",
    "avatarUrl",
    "emailVerifiedAt",
    "lockedUntil",
    "lastLoginAt",
    "passwordChangedAt",
    "createdAt",
    "updatedAt",
  ]);

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function getFirstDefinedValue(
  source: Record<string, unknown>,
  keys: readonly string[],
): unknown {
  for (const key of keys) {
    if (source[key] !== undefined) {
      return source[key];
    }
  }

  return undefined;
}

function extractSessionToken(
  value: unknown,
): unknown {
  if (!isPlainObject(value)) {
    return value;
  }

  return (
    value.sessionToken ??
    value.token ??
    null
  );
}

function normalizeMetadataHash(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedHash =
    value
      .trim()
      .toLowerCase();

  return HASH_PATTERN.test(normalizedHash)
    ? normalizedHash
    : null;
}

function resolveMetadataIpHash(
  metadata: ProfileRequestMetadata,
): string | null {
  return (
    normalizeMetadataHash(metadata.ipHash) ??
    normalizeMetadataHash(metadata.identifierHash)
  );
}

function normalizeUserAgent(
  value: unknown,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue =
    value
      .replace(
        /[\u0000-\u001F\u007F]+/g,
        " ",
      )
      .trim()
      .replace(
        /\s+/g,
        " ",
      )
      .slice(
        0,
        MAXIMUM_USER_AGENT_LENGTH,
      );

  return normalizedValue || null;
}

function normalizeProfileText(
  value: string,
): string {
  return value
    .replace(
      /[\r\n\t]+/g,
      " ",
    )
    .trim()
    .replace(
      /\s+/g,
      " ",
    );
}

function normalizeProfileRole(
  role: unknown,
): AuthRole {
  return isAuthRole(role)
    ? role
    : AUTH_ROLES.USER;
}

function normalizeProfileStatus(
  status: unknown,
): AuthUserStatus {
  if (isAuthUserStatus(status)) {
    return status;
  }

  throw new ProfileServiceError(
    "PROFILE_READ_FAILED",
    "El estado de la cuenta no es válido.",
  );
}

function toUserProfile(
  user: {
    id: string;

    firstName: string;
    lastName: string;
    displayName: string;

    email: string;

    avatarUrl: string | null;

    role: unknown;
    status: unknown;

    preferredLanguage: string;
    preferredTheme: string;

    emailVerifiedAt: Date | null;
    lockedUntil: Date | null;
    lastLoginAt: Date | null;
    passwordChangedAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
  },
): UserProfile {
  return {
    id: user.id,

    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,

    email: user.email,

    avatarUrl: user.avatarUrl,

    role: normalizeProfileRole(user.role),
    status: normalizeProfileStatus(user.status),

    preferredLanguage: user.preferredLanguage,
    preferredTheme: user.preferredTheme,

    emailVerifiedAt: user.emailVerifiedAt,
    lockedUntil: user.lockedUntil,
    lastLoginAt: user.lastLoginAt,
    passwordChangedAt: user.passwordChangedAt,

    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function addFieldError(
  fieldErrors: ProfileServiceFieldErrors,
  field: ProfileServiceField,
  message: string,
): void {
  fieldErrors[field] ??= [];
  fieldErrors[field]?.push(message);
}

function validatePersonName(
  value: unknown,
  field: "firstName" | "lastName",
  fieldErrors: ProfileServiceFieldErrors,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    addFieldError(
      fieldErrors,
      field,
      field === "firstName"
        ? "Los nombres no son válidos."
        : "Los apellidos no son válidos.",
    );

    return undefined;
  }

  const normalizedValue =
    normalizeProfileText(value);

  const minimumLength =
    field === "firstName"
      ? AUTH_USER_FIELD_LIMITS
          .FIRST_NAME_MINIMUM_LENGTH
      : AUTH_USER_FIELD_LIMITS
          .LAST_NAME_MINIMUM_LENGTH;

  const maximumLength =
    field === "firstName"
      ? AUTH_USER_FIELD_LIMITS
          .FIRST_NAME_MAXIMUM_LENGTH
      : AUTH_USER_FIELD_LIMITS
          .LAST_NAME_MAXIMUM_LENGTH;

  if (normalizedValue.length < minimumLength) {
    addFieldError(
      fieldErrors,
      field,
      `El campo debe contener al menos ${minimumLength} caracteres.`,
    );
  }

  if (normalizedValue.length > maximumLength) {
    addFieldError(
      fieldErrors,
      field,
      `El campo no puede superar ${maximumLength} caracteres.`,
    );
  }

  if (
    normalizedValue.length > 0 &&
    !PERSON_NAME_PATTERN.test(normalizedValue)
  ) {
    addFieldError(
      fieldErrors,
      field,
      "El campo contiene caracteres no permitidos.",
    );
  }

  return normalizedValue;
}

function validateDisplayName(
  value: unknown,
  fieldErrors: ProfileServiceFieldErrors,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    addFieldError(
      fieldErrors,
      "displayName",
      "El nombre visible no es válido.",
    );

    return undefined;
  }

  const normalizedValue =
    normalizeProfileText(value);

  if (
    normalizedValue.length <
    AUTH_USER_FIELD_LIMITS
      .DISPLAY_NAME_MINIMUM_LENGTH
  ) {
    addFieldError(
      fieldErrors,
      "displayName",
      `El nombre visible debe contener al menos ${AUTH_USER_FIELD_LIMITS.DISPLAY_NAME_MINIMUM_LENGTH} caracteres.`,
    );
  }

  if (
    normalizedValue.length >
    AUTH_USER_FIELD_LIMITS
      .DISPLAY_NAME_MAXIMUM_LENGTH
  ) {
    addFieldError(
      fieldErrors,
      "displayName",
      `El nombre visible no puede superar ${AUTH_USER_FIELD_LIMITS.DISPLAY_NAME_MAXIMUM_LENGTH} caracteres.`,
    );
  }

  if (
    normalizedValue.length > 0 &&
    !DISPLAY_NAME_PATTERN.test(normalizedValue)
  ) {
    addFieldError(
      fieldErrors,
      "displayName",
      "El nombre visible contiene caracteres no permitidos.",
    );
  }

  return normalizedValue;
}

function validatePreferredLanguage(
  value: unknown,
  fieldErrors: ProfileServiceFieldErrors,
): AuthLanguage | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (
    value !== AUTH_LANGUAGES.SPANISH &&
    value !== AUTH_LANGUAGES.ENGLISH
  ) {
    addFieldError(
      fieldErrors,
      "preferredLanguage",
      "El idioma seleccionado no es válido.",
    );

    return undefined;
  }

  return value;
}

function validatePreferredTheme(
  value: unknown,
  fieldErrors: ProfileServiceFieldErrors,
): ProfileTheme | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    addFieldError(
      fieldErrors,
      "preferredTheme",
      "El tema seleccionado no es válido.",
    );

    return undefined;
  }

  const normalizedTheme =
    value
      .trim()
      .toLowerCase();

  if (
    !ALLOWED_PROFILE_THEMES.has(
      normalizedTheme as ProfileTheme,
    )
  ) {
    addFieldError(
      fieldErrors,
      "preferredTheme",
      "El tema debe ser light, dark o system.",
    );

    return undefined;
  }

  return normalizedTheme as ProfileTheme;
}

function normalizeProfileUpdateObject(
  input: unknown,
): Record<string, unknown> {
  if (!isPlainObject(input)) {
    throw new ProfileServiceError(
      "PROFILE_INPUT_INVALID",
      "Los datos del perfil no son válidos.",
      {
        fieldErrors: {
          _form: [
            "Debes enviar un objeto con los datos del perfil.",
          ],
        },
      },
    );
  }

  const normalizedInput:
    Record<string, unknown> = {
      ...input,
    };

  for (
    const [
      canonicalKey,
      aliases,
    ] of Object.entries(
      PROFILE_INPUT_ALIAS_KEYS,
    )
  ) {
    if (
      normalizedInput[canonicalKey] ===
      undefined
    ) {
      normalizedInput[canonicalKey] =
        getFirstDefinedValue(
          normalizedInput,
          aliases,
        );
    }

    for (const alias of aliases) {
      delete normalizedInput[alias];
    }
  }

  return normalizedInput;
}

function validateProfileUpdate(
  input: unknown,
): NormalizedProfileUpdate {
  const normalizedInput =
    normalizeProfileUpdateObject(input);

  const allowedEditableKeys =
    new Set([
      "firstName",
      "lastName",
      "displayName",
      "preferredLanguage",
      "preferredTheme",
    ]);

  const unknownKeys =
    Object.keys(normalizedInput).filter(
      (key) =>
        !allowedEditableKeys.has(key) &&
        !ALLOWED_READ_ONLY_PROFILE_KEYS.has(key),
    );

  const fieldErrors:
    ProfileServiceFieldErrors = {};

  if (unknownKeys.length > 0) {
    addFieldError(
      fieldErrors,
      "_form",
      `La solicitud contiene campos no permitidos: ${unknownKeys.join(", ")}.`,
    );
  }

  const normalizedUpdate:
    NormalizedProfileUpdate = {};

  const firstName =
    validatePersonName(
      normalizedInput.firstName,
      "firstName",
      fieldErrors,
    );

  const lastName =
    validatePersonName(
      normalizedInput.lastName,
      "lastName",
      fieldErrors,
    );

  const displayName =
    validateDisplayName(
      normalizedInput.displayName,
      fieldErrors,
    );

  const preferredLanguage =
    validatePreferredLanguage(
      normalizedInput.preferredLanguage,
      fieldErrors,
    );

  const preferredTheme =
    validatePreferredTheme(
      normalizedInput.preferredTheme,
      fieldErrors,
    );

  if (
    normalizedInput.firstName !==
    undefined
  ) {
    normalizedUpdate.firstName =
      firstName;
  }

  if (
    normalizedInput.lastName !==
    undefined
  ) {
    normalizedUpdate.lastName =
      lastName;
  }

  if (
    normalizedInput.displayName !==
    undefined
  ) {
    normalizedUpdate.displayName =
      displayName;
  }

  if (
    normalizedInput.preferredLanguage !==
    undefined
  ) {
    normalizedUpdate.preferredLanguage =
      preferredLanguage;
  }

  if (
    normalizedInput.preferredTheme !==
    undefined
  ) {
    normalizedUpdate.preferredTheme =
      preferredTheme;
  }

  if (
    Object.keys(fieldErrors).length > 0
  ) {
    throw new ProfileServiceError(
      "PROFILE_INPUT_INVALID",
      "Revisa los datos ingresados.",
      {
        fieldErrors,
      },
    );
  }

  return normalizedUpdate;
}

export function normalizeProfileAvatarUrl(
  value: unknown,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalizedUrl =
    value.trim();

  if (
    normalizedUrl.length === 0 ||
    normalizedUrl.length >
      MAXIMUM_AVATAR_URL_LENGTH ||
    /[\u0000-\u001F\u007F]/.test(
      normalizedUrl,
    ) ||
    normalizedUrl.includes("\\")
  ) {
    return null;
  }

  if (normalizedUrl.startsWith("/")) {
    if (normalizedUrl.startsWith("//")) {
      return null;
    }

    try {
      const parsedUrl =
        new URL(
          normalizedUrl,
          "https://fixora.local",
        );

      if (
        parsedUrl.origin !==
        "https://fixora.local"
      ) {
        return null;
      }

      return [
        parsedUrl.pathname,
        parsedUrl.search,
        parsedUrl.hash,
      ].join("");
    } catch {
      return null;
    }
  }

  try {
    const parsedUrl =
      new URL(normalizedUrl);

    if (
      parsedUrl.username ||
      parsedUrl.password
    ) {
      return null;
    }

    if (parsedUrl.protocol === "https:") {
      return parsedUrl.toString();
    }

    if (
      process.env.NODE_ENV !==
        "production" &&
      parsedUrl.protocol === "http:" &&
      (
        parsedUrl.hostname ===
          "localhost" ||
        parsedUrl.hostname ===
          "127.0.0.1"
      )
    ) {
      return parsedUrl.toString();
    }

    return null;
  } catch {
    return null;
  }
}

function normalizeAvatarUpdateObject(
  input: unknown,
): Record<string, unknown> {
  if (
    input === null ||
    typeof input === "string"
  ) {
    return {
      avatarUrl: input,
    };
  }

  if (!isPlainObject(input)) {
    throw new ProfileServiceError(
      "PROFILE_INPUT_INVALID",
      "Los datos del avatar no son válidos.",
      {
        fieldErrors: {
          avatarUrl: [
            "Debes enviar una URL válida o null para eliminar el avatar.",
          ],
        },
      },
    );
  }

  const normalizedInput:
    Record<string, unknown> = {
      ...input,
    };

  if (
    normalizedInput.avatarUrl ===
    undefined
  ) {
    normalizedInput.avatarUrl =
      getFirstDefinedValue(
        normalizedInput,
        AVATAR_INPUT_ALIAS_KEYS,
      );
  }

  for (
    const alias
    of AVATAR_INPUT_ALIAS_KEYS
  ) {
    delete normalizedInput[alias];
  }

  return normalizedInput;
}

function validateAvatarUpdate(
  input: unknown,
): NormalizedAvatarUpdate {
  const normalizedInput =
    normalizeAvatarUpdateObject(input);

  const allowedKeys =
    new Set([
      "avatarUrl",
    ]);

  const unknownKeys =
    Object.keys(normalizedInput).filter(
      (key) =>
        !allowedKeys.has(key),
    );

  if (unknownKeys.length > 0) {
    throw new ProfileServiceError(
      "PROFILE_INPUT_INVALID",
      "La solicitud contiene campos no permitidos.",
      {
        fieldErrors: {
          _form: [
            `Campos no permitidos: ${unknownKeys.join(", ")}.`,
          ],
        },
      },
    );
  }

  if (!("avatarUrl" in normalizedInput)) {
    throw new ProfileServiceError(
      "PROFILE_INPUT_INVALID",
      "Debes indicar el avatar.",
      {
        fieldErrors: {
          avatarUrl: [
            "El campo avatarUrl es obligatorio.",
          ],
        },
      },
    );
  }

  if (
    normalizedInput.avatarUrl === null ||
    normalizedInput.avatarUrl === ""
  ) {
    return {
      avatarUrl: null,
    };
  }

  const avatarUrl =
    normalizeProfileAvatarUrl(
      normalizedInput.avatarUrl,
    );

  if (!avatarUrl) {
    throw new ProfileServiceError(
      "PROFILE_INPUT_INVALID",
      "La URL del avatar no es válida.",
      {
        fieldErrors: {
          avatarUrl: [
            "Utiliza una ruta interna o una dirección HTTPS válida.",
          ],
        },
      },
    );
  }

  return {
    avatarUrl,
  };
}

async function resolveProfileSession(
  sessionToken: unknown,
  permission:
    (typeof AUTH_PERMISSIONS)[keyof typeof AUTH_PERMISSIONS],
): Promise<
  | ResolvedProfileSession
  | InvalidProfileSessionResult
  | UnavailableProfileAccountResult
> {
  const sessionResult =
    await getAuthenticatedSessionByToken(
      sessionToken,
    );

  if (
    sessionResult.status ===
    "invalid-session"
  ) {
    return {
      status: "invalid-session",
      profile: null,
      user: null,
    };
  }

  if (
    sessionResult.status ===
    "account-unavailable"
  ) {
    return {
      status: "account-unavailable",
      profile: null,
      user: null,
    };
  }

  assertPermission(
    sessionResult.user,
    permission,
  );

  return {
    user: sessionResult.user,

    profile:
      toUserProfile(
        sessionResult.user,
      ),

    session: {
      id: sessionResult.session.id,

      expiresAt:
        sessionResult.session.expiresAt,

      lastSeenAt:
        sessionResult.session.lastSeenAt,

      rememberMe:
        sessionResult.session.rememberMe,

      remainingSeconds:
        sessionResult.session.remainingSeconds,
    },
  };
}

async function recordProfileAudit(
  {
    userId,
    action,
    metadata,
    details,
  }: {
    userId: string;
    action: string;
    metadata: ProfileRequestMetadata;
    details?: unknown;
  },
): Promise<void> {
  await createAuditLogSafely({
    actorUserId: userId,
    subjectUserId: userId,

    action,

    entityType: "USER",
    entityId: userId,

    ipHash:
      resolveMetadataIpHash(metadata),

    userAgent:
      normalizeUserAgent(
        metadata.userAgent,
      ),

    details,
  });
}

function resolveGetProfileArguments(
  sessionTokenOrInput: unknown,
): {
  sessionToken: unknown;
} {
  return {
    sessionToken:
      extractSessionToken(
        sessionTokenOrInput,
      ),
  };
}

function resolveUpdateProfileArguments(
  sessionTokenOrCommand: unknown,
  profileInput?: unknown,
  metadata:
    ProfileRequestMetadata = {},
): {
  sessionToken: unknown;
  profileInput: unknown;
  metadata: ProfileRequestMetadata;
} {
  if (
    isPlainObject(sessionTokenOrCommand) &&
    (
      "sessionToken" in
        sessionTokenOrCommand ||
      "token" in
        sessionTokenOrCommand
    ) &&
    (
      "data" in
        sessionTokenOrCommand ||
      "profile" in
        sessionTokenOrCommand ||
      "updates" in
        sessionTokenOrCommand
    )
  ) {
    const command =
      sessionTokenOrCommand as UpdateProfileCommand;

    return {
      sessionToken:
        command.sessionToken ??
        command.token,

      profileInput:
        command.data ??
        command.profile ??
        command.updates ??
        {},

      metadata:
        command.metadata ??
        metadata,
    };
  }

  return {
    sessionToken:
      sessionTokenOrCommand,

    profileInput:
      profileInput ?? {},

    metadata,
  };
}

function resolveUpdateAvatarArguments(
  sessionTokenOrCommand: unknown,
  avatarInput?: unknown,
  metadata:
    ProfileRequestMetadata = {},
): {
  sessionToken: unknown;
  avatarInput: unknown;
  metadata: ProfileRequestMetadata;
} {
  if (
    isPlainObject(sessionTokenOrCommand) &&
    (
      "sessionToken" in
        sessionTokenOrCommand ||
      "token" in
        sessionTokenOrCommand
    ) &&
    (
      "data" in
        sessionTokenOrCommand ||
      "avatar" in
        sessionTokenOrCommand ||
      "updates" in
        sessionTokenOrCommand
    )
  ) {
    const command =
      sessionTokenOrCommand as UpdateAvatarCommand;

    return {
      sessionToken:
        command.sessionToken ??
        command.token,

      avatarInput:
        command.data ??
        command.avatar ??
        command.updates ??
        {},

      metadata:
        command.metadata ??
        metadata,
    };
  }

  return {
    sessionToken:
      sessionTokenOrCommand,

    avatarInput,

    metadata,
  };
}

/**
 * Obtiene el perfil asociado a la sesión autenticada.
 */
export async function getProfileBySessionToken(
  sessionTokenOrInput: unknown,
): Promise<GetProfileResult> {
  const { sessionToken } =
    resolveGetProfileArguments(
      sessionTokenOrInput,
    );

  try {
    const sessionContext =
      await resolveProfileSession(
        sessionToken,
        AUTH_PERMISSIONS.PROFILE_READ_SELF,
      );

    if ("status" in sessionContext) {
      return sessionContext;
    }

    return {
      status: "authenticated",

      profile:
        sessionContext.profile,

      user:
        sessionContext.profile,

      session:
        sessionContext.session,
    };
  } catch (error) {
    if (
      error instanceof
      ProfileServiceError
    ) {
      throw error;
    }

    throw new ProfileServiceError(
      "PROFILE_READ_FAILED",
      "No fue posible obtener el perfil.",
      {
        cause: error,
      },
    );
  }
}

/**
 * Actualiza nombres, nombre visible, idioma y tema.
 *
 * No permite modificar:
 * - Correo.
 * - Rol.
 * - Estado.
 * - Verificación.
 */
export async function updateProfileBySessionToken(
  sessionTokenOrCommand: unknown,
  profileInput?: unknown,
  metadata:
    ProfileRequestMetadata = {},
): Promise<UpdateProfileResult> {
  const resolvedArguments =
    resolveUpdateProfileArguments(
      sessionTokenOrCommand,
      profileInput,
      metadata,
    );

  const normalizedUpdate =
    validateProfileUpdate(
      resolvedArguments.profileInput,
    );

  try {
    const sessionContext =
      await resolveProfileSession(
        resolvedArguments.sessionToken,
        AUTH_PERMISSIONS.PROFILE_UPDATE_SELF,
      );

    if ("status" in sessionContext) {
      return sessionContext;
    }

    if (
      normalizedUpdate.preferredLanguage !==
        undefined ||
      normalizedUpdate.preferredTheme !==
        undefined
    ) {
      assertPermission(
        sessionContext.user,
        AUTH_PERMISSIONS
          .ACCOUNT_PREFERENCES_UPDATE_SELF,
      );
    }

    const transactionResult =
      await prisma.$transaction(
        async (transaction) => {
          const currentUser =
            await findUserById(
              sessionContext.user.id,
              transaction,
            );

          if (!currentUser) {
            throw new ProfileServiceError(
              "PROFILE_NOT_FOUND",
              "No se encontró el perfil del usuario.",
            );
          }

          const updatedFields:
            string[] = [];

          const profileData: {
            firstName?: string;
            lastName?: string;
            displayName?: string;
          } = {};

          if (
            normalizedUpdate.firstName !==
              undefined &&
            normalizedUpdate.firstName !==
              currentUser.firstName
          ) {
            profileData.firstName =
              normalizedUpdate.firstName;

            updatedFields.push(
              "firstName",
            );
          }

          if (
            normalizedUpdate.lastName !==
              undefined &&
            normalizedUpdate.lastName !==
              currentUser.lastName
          ) {
            profileData.lastName =
              normalizedUpdate.lastName;

            updatedFields.push(
              "lastName",
            );
          }

          if (
            normalizedUpdate.displayName !==
              undefined &&
            normalizedUpdate.displayName !==
              currentUser.displayName
          ) {
            profileData.displayName =
              normalizedUpdate.displayName;

            updatedFields.push(
              "displayName",
            );
          }

          const preferencesData:
            Parameters<
              typeof updateUserPreferences
            >[1] = {};

          if (
            normalizedUpdate.preferredLanguage !==
              undefined &&
            normalizedUpdate.preferredLanguage !==
              currentUser.preferredLanguage
          ) {
            preferencesData.preferredLanguage =
              normalizedUpdate.preferredLanguage;

            updatedFields.push(
              "preferredLanguage",
            );
          }

          if (
            normalizedUpdate.preferredTheme !==
              undefined &&
            normalizedUpdate.preferredTheme !==
              currentUser.preferredTheme
          ) {
            preferencesData.preferredTheme =
              normalizedUpdate.preferredTheme;

            updatedFields.push(
              "preferredTheme",
            );
          }

          if (
            updatedFields.length === 0
          ) {
            return {
              user: currentUser,
              updatedFields,
            };
          }

          let updatedUser =
            currentUser;

          if (
            Object.keys(profileData)
              .length > 0
          ) {
            updatedUser =
              await updateUserProfile(
                currentUser.id,
                profileData,
                transaction,
              );
          }

          if (
            Object.keys(preferencesData)
              .length > 0
          ) {
            updatedUser =
              await updateUserPreferences(
                currentUser.id,
                preferencesData,
                transaction,
              );
          }

          return {
            user: updatedUser,
            updatedFields,
          };
        },
      );

    const profile =
      toUserProfile(
        transactionResult.user,
      );

    if (
      transactionResult
        .updatedFields.length === 0
    ) {
      return {
        status: "no-changes",

        profile,
        user: profile,

        updated: false,
        noChanges: true,

        updatedFields: [],
      };
    }

    await recordProfileAudit({
      userId: profile.id,

      action: "PROFILE_UPDATED",

      metadata:
        resolvedArguments.metadata,

      details: {
        updatedFields:
          transactionResult.updatedFields,
      },
    });

    return {
      status: "updated",

      profile,
      user: profile,

      updated: true,
      noChanges: false,

      updatedFields:
        transactionResult.updatedFields,
    };
  } catch (error) {
    if (
      error instanceof
      ProfileServiceError
    ) {
      throw error;
    }

    throw new ProfileServiceError(
      "PROFILE_UPDATE_FAILED",
      "No fue posible actualizar el perfil.",
      {
        cause: error,
      },
    );
  }
}

/**
 * Actualiza o elimina el avatar de la cuenta autenticada.
 */
export async function updateAvatarBySessionToken(
  sessionTokenOrCommand: unknown,
  avatarInput?: unknown,
  metadata:
    ProfileRequestMetadata = {},
): Promise<UpdateAvatarResult> {
  const resolvedArguments =
    resolveUpdateAvatarArguments(
      sessionTokenOrCommand,
      avatarInput,
      metadata,
    );

  const normalizedUpdate =
    validateAvatarUpdate(
      resolvedArguments.avatarInput,
    );

  try {
    const sessionContext =
      await resolveProfileSession(
        resolvedArguments.sessionToken,
        AUTH_PERMISSIONS.AVATAR_UPDATE_SELF,
      );

    if ("status" in sessionContext) {
      return sessionContext;
    }

    const transactionResult =
      await prisma.$transaction(
        async (transaction) => {
          const currentUser =
            await findUserById(
              sessionContext.user.id,
              transaction,
            );

          if (!currentUser) {
            throw new ProfileServiceError(
              "PROFILE_NOT_FOUND",
              "No se encontró el perfil del usuario.",
            );
          }

          if (
            currentUser.avatarUrl ===
            normalizedUpdate.avatarUrl
          ) {
            return {
              user: currentUser,
              updated: false,
            };
          }

          const updatedUser =
            await updateUserAvatar(
              currentUser.id,
              normalizedUpdate.avatarUrl,
              transaction,
            );

          return {
            user: updatedUser,
            updated: true,
          };
        },
      );

    const profile =
      toUserProfile(
        transactionResult.user,
      );

    if (!transactionResult.updated) {
      return {
        status: "no-changes",

        profile,
        user: profile,

        avatarUrl:
          profile.avatarUrl,

        updated: false,
        noChanges: true,

        updatedFields: [],
      };
    }

    await recordProfileAudit({
      userId: profile.id,

      action:
        profile.avatarUrl
          ? "PROFILE_AVATAR_UPDATED"
          : "PROFILE_AVATAR_REMOVED",

      metadata:
        resolvedArguments.metadata,

      details: {
        avatarPresent:
          profile.avatarUrl !== null,
      },
    });

    return {
      status: "updated",

      profile,
      user: profile,

      avatarUrl:
        profile.avatarUrl,

      updated: true,
      noChanges: false,

      updatedFields: [
        "avatarUrl",
      ],
    };
  } catch (error) {
    if (
      error instanceof
      ProfileServiceError
    ) {
      throw error;
    }

    throw new ProfileServiceError(
      "PROFILE_AVATAR_UPDATE_FAILED",
      "No fue posible actualizar el avatar.",
      {
        cause: error,
      },
    );
  }
}

/**
 * Elimina el avatar estableciendo avatarUrl en null.
 */
export async function removeAvatarBySessionToken(
  sessionToken: unknown,
  metadata:
    ProfileRequestMetadata = {},
): Promise<UpdateAvatarResult> {
  return updateAvatarBySessionToken(
    sessionToken,
    {
      avatarUrl: null,
    },
    metadata,
  );
}

export function isProfileServiceError(
  error: unknown,
): error is ProfileServiceError {
  return (
    error instanceof
    ProfileServiceError
  );
}

/**
 * Alias compatibles con rutas y componentes.
 */
export const getUserProfileByToken =
  getProfileBySessionToken;

export const getCurrentUserProfile =
  getProfileBySessionToken;

export const getProfile =
  getProfileBySessionToken;

export const updateUserProfileByToken =
  updateProfileBySessionToken;

export const updateCurrentUserProfile =
  updateProfileBySessionToken;

export const updateProfile =
  updateProfileBySessionToken;

export const updateUserAvatarByToken =
  updateAvatarBySessionToken;

export const updateCurrentUserAvatar =
  updateAvatarBySessionToken;

export const updateAvatar =
  updateAvatarBySessionToken;

export const removeUserAvatarByToken =
  removeAvatarBySessionToken;

export const deleteUserAvatarByToken =
  removeAvatarBySessionToken;

export const deleteAvatarBySessionToken =
  removeAvatarBySessionToken;