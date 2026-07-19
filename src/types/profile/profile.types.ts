import type {
  AuthLanguage,
  AuthRole,
  AuthUserStatus,
} from "@/constants/auth/auth.constants";

import type {
  ApiResponse,
  AuthDateValue,
  AuthThemePreference,
  NullableAuthDateValue,
} from "@/types/auth/auth.types";

/*
 * Las fechas llegan como Date dentro del servidor y como
 * cadenas ISO después de una respuesta JSON.
 */
export type ProfileDateValue =
  AuthDateValue;

export type NullableProfileDateValue =
  NullableAuthDateValue;

export type ProfileTheme =
  AuthThemePreference;

export type ProfileStatus =
  | "authenticated"
  | "updated"
  | "no-changes"
  | "invalid-session"
  | "account-unavailable";

export type EditableProfileField =
  | "firstName"
  | "lastName"
  | "displayName"
  | "preferredLanguage"
  | "preferredTheme";

export type EditableAvatarField =
  "avatarUrl";

export type ProfileUpdatedField =
  | EditableProfileField
  | EditableAvatarField;

export type ReadonlyProfileField =
  | "id"
  | "email"
  | "role"
  | "status"
  | "emailVerifiedAt"
  | "lockedUntil"
  | "lastLoginAt"
  | "passwordChangedAt"
  | "createdAt"
  | "updatedAt";

export type ProfileFormField =
  | EditableProfileField
  | EditableAvatarField
  | "_form";

export type ProfileFieldErrors =
  Partial<
    Record<
      ProfileFormField,
      string[]
    >
  >;

/*
 * Perfil público y seguro.
 *
 * Nunca debe incluir:
 * - passwordHash
 * - tokenHash
 * - codeHash
 * - failedLoginAttempts
 */
export interface UserProfile {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  avatarUrl:
    | string
    | null;

  role: AuthRole;
  status: AuthUserStatus;

  preferredLanguage:
    AuthLanguage;

  preferredTheme:
    ProfileTheme;

  emailVerifiedAt:
    NullableProfileDateValue;

  lockedUntil:
    NullableProfileDateValue;

  lastLoginAt:
    NullableProfileDateValue;

  passwordChangedAt:
    NullableProfileDateValue;

  createdAt:
    ProfileDateValue;

  updatedAt:
    ProfileDateValue;
}

export interface ProfileSessionData {
  id: string;

  expiresAt:
    ProfileDateValue;

  lastSeenAt:
    ProfileDateValue;

  rememberMe:
    boolean;

  remainingSeconds:
    number;
}

export interface ProfilePreferences {
  preferredLanguage:
    AuthLanguage;

  preferredTheme:
    ProfileTheme;
}

/*
 * Valores completos utilizados por el formulario.
 */
export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  displayName: string;

  preferredLanguage:
    AuthLanguage;

  preferredTheme:
    ProfileTheme;
}

export interface AvatarFormValues {
  avatarUrl:
    string | null;
}

/*
 * Solicitud canónica para actualizar el perfil.
 *
 * Todos los campos son opcionales porque el formulario
 * puede enviar únicamente los valores modificados.
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  displayName?: string;

  preferredLanguage?:
    AuthLanguage;

  preferredTheme?:
    ProfileTheme;
}

export interface UpdateProfilePersonalDataRequest {
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export interface UpdateProfilePreferencesRequest {
  preferredLanguage?:
    AuthLanguage;

  preferredTheme?:
    ProfileTheme;
}

export interface UpdateAvatarRequest {
  /*
   * Una cadena actualiza el avatar.
   * null elimina el avatar actual.
   */
  avatarUrl:
    | string
    | null;
}

/*
 * Resultado de GET /api/perfil
 */
export interface AuthenticatedProfileData {
  status:
    "authenticated";

  profile:
    UserProfile;

  /*
   * Alias conservado para componentes que utilizan
   * result.user en lugar de result.profile.
   */
  user:
    UserProfile;

  session:
    ProfileSessionData;
}

export interface InvalidProfileSessionData {
  status:
    "invalid-session";

  profile:
    null;

  user:
    null;

  session?:
    null;
}

export interface UnavailableProfileAccountData {
  status:
    "account-unavailable";

  profile:
    null;

  user:
    null;

  session?:
    null;
}

export type GetProfileResponseData =
  | AuthenticatedProfileData
  | InvalidProfileSessionData
  | UnavailableProfileAccountData;

/*
 * Resultado de actualizar datos o preferencias.
 */
export interface ProfileUpdatedData {
  status:
    "updated";

  profile:
    UserProfile;

  user:
    UserProfile;

  updated:
    true;

  noChanges:
    false;

  updatedFields:
    EditableProfileField[];
}

export interface ProfileNoChangesData {
  status:
    "no-changes";

  profile:
    UserProfile;

  user:
    UserProfile;

  updated:
    false;

  noChanges:
    true;

  updatedFields:
    [];
}

export type UpdateProfileResponseData =
  | ProfileUpdatedData
  | ProfileNoChangesData
  | InvalidProfileSessionData
  | UnavailableProfileAccountData;

/*
 * Resultado de actualizar o eliminar el avatar.
 */
export interface AvatarUpdatedData {
  status:
    "updated";

  profile:
    UserProfile;

  user:
    UserProfile;

  avatarUrl:
    | string
    | null;

  updated:
    true;

  noChanges:
    false;

  updatedFields: [
    "avatarUrl",
  ];
}

export interface AvatarNoChangesData {
  status:
    "no-changes";

  profile:
    UserProfile;

  user:
    UserProfile;

  avatarUrl:
    | string
    | null;

  updated:
    false;

  noChanges:
    true;

  updatedFields:
    [];
}

export type UpdateAvatarResponseData =
  | AvatarUpdatedData
  | AvatarNoChangesData
  | InvalidProfileSessionData
  | UnavailableProfileAccountData;

/*
 * Sobres completos de las rutas API.
 */
export type GetProfileApiResponse =
  ApiResponse<GetProfileResponseData>;

export type UpdateProfileApiResponse =
  ApiResponse<UpdateProfileResponseData>;

export type UpdateAvatarApiResponse =
  ApiResponse<UpdateAvatarResponseData>;

/*
 * Estado local del formulario de perfil.
 */
export interface ProfileFormState {
  values:
    ProfileFormValues;

  errors:
    ProfileFieldErrors;

  isSubmitting:
    boolean;

  isDirty:
    boolean;

  isSuccess:
    boolean;

  message:
    | string
    | null;
}

export interface AvatarFormState {
  values:
    AvatarFormValues;

  errors:
    ProfileFieldErrors;

  isSubmitting:
    boolean;

  isDirty:
    boolean;

  isSuccess:
    boolean;

  message:
    | string
    | null;
}

/*
 * Datos que pueden utilizarse para mostrar un resumen
 * compacto del usuario en el navbar.
 */
export interface ProfileSummary {
  id: string;

  displayName: string;
  email: string;

  avatarUrl:
    | string
    | null;

  role: AuthRole;
}

export interface ProfileIdentity {
  firstName: string;
  lastName: string;
  displayName: string;
}

export interface ProfileAccountInformation {
  email: string;

  role: AuthRole;
  status: AuthUserStatus;

  emailVerifiedAt:
    NullableProfileDateValue;

  createdAt:
    ProfileDateValue;
}

/*
 * Resultado genérico utilizado por componentes que pueden
 * actualizar datos personales, preferencias o avatar.
 */
export type ProfileMutationResponseData =
  | ProfileUpdatedData
  | ProfileNoChangesData
  | AvatarUpdatedData
  | AvatarNoChangesData
  | InvalidProfileSessionData
  | UnavailableProfileAccountData;

export type ProfileMutationApiResponse =
  ApiResponse<ProfileMutationResponseData>;

/*
 * Alias compatibles con componentes y páginas anteriores.
 */
export type Profile =
  UserProfile;

export type ProfileData =
  UserProfile;

export type ProfileUser =
  UserProfile;

export type CurrentProfile =
  UserProfile;

export type UserProfileData =
  UserProfile;

export type ProfileSession =
  ProfileSessionData;

export type UpdateProfileData =
  UpdateProfileRequest;

export type ProfileUpdateData =
  UpdateProfileRequest;

export type ProfilePreferencesData =
  UpdateProfilePreferencesRequest;

export type AvatarData =
  UpdateAvatarRequest;

export type AvatarUpdateData =
  UpdateAvatarRequest;

export type ProfileResponse =
  GetProfileResponseData;

export type ProfileApiResponse =
  GetProfileApiResponse;

export type ProfileUpdateResponse =
  UpdateProfileResponseData;

export type AvatarUpdateResponse =
  UpdateAvatarResponseData;