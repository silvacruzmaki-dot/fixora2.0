import type {
  AuthLanguage,
  AuthRole,
  AuthUserStatus,
} from "@/constants/auth/auth.constants";

/*
 * Las fechas pueden existir como objetos Date dentro del
 * servidor y como cadenas ISO después de una respuesta JSON.
 */
export type AuthDateValue =
  | string
  | Date;

export type NullableAuthDateValue =
  | AuthDateValue
  | null;

export type AuthThemePreference =
  | "light"
  | "dark"
  | "system";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "error";

export type AuthMode =
  | "login"
  | "register";

export type AuthPageMode =
  | "login"
  | "register"
  | "verify-email"
  | "forgot-password"
  | "reset-password"
  | "admin-login";

export type VerificationPurpose =
  | "email-verification"
  | "password-recovery";

/*
 * Usuario compartido entre el contexto del navegador,
 * componentes y respuestas de autenticación.
 *
 * No contiene:
 * - passwordHash
 * - tokenHash
 * - codeHash
 * - failedLoginAttempts
 */
export interface AuthContextUser {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  avatarUrl?:
    | string
    | null;

  role: AuthRole;
  status: AuthUserStatus;

  preferredLanguage:
    AuthLanguage | string;

  preferredTheme:
    AuthThemePreference | string;

  emailVerifiedAt:
    NullableAuthDateValue;

  lockedUntil?:
    NullableAuthDateValue;

  lastLoginAt?:
    NullableAuthDateValue;

  passwordChangedAt?:
    NullableAuthDateValue;

  createdAt:
    AuthDateValue;

  updatedAt?:
    AuthDateValue;
}

export interface AuthContextSession {
  id?: string;

  expiresAt:
    AuthDateValue;

  rememberMe: boolean;

  createdAt?:
    AuthDateValue;

  lastSeenAt?:
    AuthDateValue;

  remainingSeconds?:
    number;
}

export interface AuthenticatedAuthSnapshot {
  user:
    AuthContextUser;

  session?:
    | AuthContextSession
    | null;

  unreadNotificationCount?:
    number;
}

export interface AuthContextError {
  code: string;
  message: string;

  httpStatus?: number;

  fieldErrors?:
    AuthFieldErrors;

  retryAfterSeconds?:
    number;
}

export interface RefreshSessionOptions {
  silent?: boolean;
}

export type UnreadNotificationCountUpdater =
  | number
  | ((
      currentCount: number,
    ) => number);

export interface AuthContextValue {
  status:
    AuthStatus;

  user:
    | AuthContextUser
    | null;

  session:
    | AuthContextSession
    | null;

  unreadNotificationCount:
    number;

  error:
    | AuthContextError
    | null;

  isLoading:
    boolean;

  isAuthenticated:
    boolean;

  isUnauthenticated:
    boolean;

  refreshSession: (
    options?:
      RefreshSessionOptions,
  ) => Promise<
    | AuthenticatedAuthSnapshot
    | null
  >;

  applyAuthenticatedSession: (
    snapshot:
      AuthenticatedAuthSnapshot,
  ) => void;

  updateUser: (
    updates:
      Partial<AuthContextUser>,
  ) => void;

  setUnreadNotificationCount: (
    updater:
      UnreadNotificationCountUpdater,
  ) => void;

  signOut:
    () => Promise<boolean>;

  clearAuthError:
    () => void;
}

export interface AuthProviderProps {
  children:
    React.ReactNode;
}

export type AuthFieldErrors =
  Record<
    string,
    string[]
  >;

export interface ApiSuccessResponse<
  TData = undefined,
> {
  ok: true;

  code?: string;
  message?: string;

  data:
    TData;
}

export interface ApiErrorResponse {
  ok: false;

  code: string;
  message: string;

  fieldErrors?:
    AuthFieldErrors;

  retryAfterSeconds?:
    number;

  details?: unknown;
}

export type ApiResponse<
  TData = undefined,
> =
  | ApiSuccessResponse<TData>
  | ApiErrorResponse;

/*
 * Datos enviados por los formularios.
 */
export interface LoginRequest {
  email: string;
  password: string;

  rememberMe: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  password: string;
  confirmPassword: string;

  acceptTermsAndPrivacy: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendVerificationCodeRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyPasswordResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;

  newPassword: string;
  confirmPassword: string;
}

/*
 * Resultado de registro.
 */
export type RegisterStatus =
  | "registered"
  | "email-verification-required"
  | "email-already-registered"
  | "account-unavailable";

export interface RegisterResponseData {
  status:
    RegisterStatus;

  user?:
    | AuthContextUser
    | null;

  maskedEmail: string;

  verificationExpiresInSeconds:
    number;

  resendAvailableInSeconds:
    number;

  emailSent?: boolean;
}

/*
 * Resultado del inicio de sesión de usuario.
 */
export type LoginStatus =
  | "authenticated"
  | "email-verification-required"
  | "account-locked"
  | "account-disabled"
  | "admin-login-required"
  | "invalid-credentials";

export interface AuthenticatedLoginData {
  status:
    "authenticated";

  user:
    AuthContextUser;

  session?:
    AuthContextSession;

  expiresAt?:
    AuthDateValue;

  sessionExpiresAt?:
    AuthDateValue;

  remainingSeconds?:
    number;

  rememberMe:
    boolean;
}

export interface LoginEmailVerificationRequiredData {
  status:
    "email-verification-required";

  maskedEmail: string;

  verificationExpiresInSeconds:
    number;

  resendAvailableInSeconds:
    number;
}

export interface LoginAccountLockedData {
  status:
    "account-locked";

  lockedUntil:
    NullableAuthDateValue;

  retryAfterSeconds:
    number;
}

export interface LoginAccountDisabledData {
  status:
    "account-disabled";
}

export interface LoginAdminRequiredData {
  status:
    "admin-login-required";

  adminLoginPath:
    "/admin/iniciar-sesion";
}

export interface LoginInvalidCredentialsData {
  status:
    "invalid-credentials";
}

export type LoginResponseData =
  | AuthenticatedLoginData
  | LoginEmailVerificationRequiredData
  | LoginAccountLockedData
  | LoginAccountDisabledData
  | LoginAdminRequiredData
  | LoginInvalidCredentialsData;

/*
 * Consulta de sesión.
 */
export type SessionStatus =
  | "authenticated"
  | "invalid-session"
  | "account-unavailable";

export interface AuthenticatedSessionData {
  status:
    "authenticated";

  user:
    AuthContextUser;

  session:
    AuthContextSession;
}

export interface InvalidSessionData {
  status:
    "invalid-session";

  user?:
    null;

  session?:
    null;
}

export interface UnavailableSessionData {
  status:
    "account-unavailable";

  user?:
    null;

  session?:
    null;
}

export type SessionResponseData =
  | AuthenticatedSessionData
  | InvalidSessionData
  | UnavailableSessionData;

export interface LogoutResponseData {
  status:
    "signed-out";

  revoked: boolean;
}

/*
 * Verificación de correo.
 */
export type VerifyEmailStatus =
  | "verified"
  | "already-verified"
  | "code-expired"
  | "attempts-exceeded"
  | "invalid-code"
  | "not-found";

export interface EmailVerifiedData {
  status:
    "verified";

  user:
    AuthContextUser;

  maskedEmail: string;

  notificationCreated?:
    boolean;
}

export interface EmailAlreadyVerifiedData {
  status:
    "already-verified";

  maskedEmail: string;
}

export interface EmailVerificationCodeExpiredData {
  status:
    "code-expired";

  maskedEmail: string;

  resendAvailableInSeconds:
    number;
}

export interface EmailVerificationAttemptsExceededData {
  status:
    "attempts-exceeded";

  maskedEmail: string;

  attemptsRemaining:
    0;

  resendAvailableInSeconds:
    number;
}

export interface EmailVerificationInvalidCodeData {
  status:
    "invalid-code";

  maskedEmail: string;

  attemptsRemaining:
    number;
}

export interface EmailVerificationNotFoundData {
  status:
    "not-found";

  maskedEmail: string;
}

export type VerifyEmailResponseData =
  | EmailVerifiedData
  | EmailAlreadyVerifiedData
  | EmailVerificationCodeExpiredData
  | EmailVerificationAttemptsExceededData
  | EmailVerificationInvalidCodeData
  | EmailVerificationNotFoundData;

/*
 * Reenvío de código de verificación.
 */
export type ResendVerificationStatus =
  | "sent"
  | "cooldown"
  | "resend-limit-exceeded"
  | "already-verified"
  | "not-found";

export interface VerificationCodeSentData {
  status:
    "sent";

  maskedEmail: string;

  verificationExpiresInSeconds:
    number;

  resendAvailableInSeconds:
    number;

  emailSent?: boolean;
}

export interface VerificationCodeCooldownData {
  status:
    "cooldown";

  maskedEmail: string;

  retryAfterSeconds:
    number;

  resendAvailableInSeconds:
    number;
}

export interface VerificationCodeResendLimitData {
  status:
    "resend-limit-exceeded";

  maskedEmail: string;

  remainingResends:
    0;

  resendAvailableInSeconds:
    number;
}

export interface VerificationCodeAlreadyVerifiedData {
  status:
    "already-verified";

  maskedEmail: string;
}

export interface VerificationCodeNotFoundData {
  status:
    "not-found";

  maskedEmail: string;
}

export type ResendVerificationResponseData =
  | VerificationCodeSentData
  | VerificationCodeCooldownData
  | VerificationCodeResendLimitData
  | VerificationCodeAlreadyVerifiedData
  | VerificationCodeNotFoundData;

/*
 * Solicitud de recuperación de contraseña.
 */
export type PasswordResetRequestStatus =
  | "sent"
  | "cooldown"
  | "resend-limit-exceeded";

export interface PasswordResetCodeSentData {
  status:
    "sent";

  maskedEmail: string;

  resetExpiresInSeconds:
    number;

  recoveryExpiresInSeconds?:
    number;

  verificationExpiresInSeconds?:
    number;

  resendAvailableInSeconds:
    number;

  emailSent?: boolean;
}

export interface PasswordResetCooldownData {
  status:
    "cooldown";

  maskedEmail: string;

  retryAfterSeconds:
    number;

  resendAvailableInSeconds:
    number;
}

export interface PasswordResetResendLimitData {
  status:
    "resend-limit-exceeded";

  maskedEmail: string;

  remainingResends:
    0;

  resendAvailableInSeconds:
    number;
}

export type PasswordResetRequestResponseData =
  | PasswordResetCodeSentData
  | PasswordResetCooldownData
  | PasswordResetResendLimitData;

/*
 * Verificación del código de recuperación.
 */
export type PasswordResetCodeStatus =
  | "verified"
  | "code-expired"
  | "attempts-exceeded"
  | "invalid-code"
  | "account-unavailable"
  | "not-found";

export interface PasswordResetCodeVerifiedData {
  status:
    "verified";

  maskedEmail: string;

  expiresAt:
    AuthDateValue;

  remainingSeconds:
    number;
}

export interface PasswordResetCodeExpiredData {
  status:
    "code-expired";

  maskedEmail: string;

  resendAvailableInSeconds:
    number;
}

export interface PasswordResetAttemptsExceededData {
  status:
    "attempts-exceeded";

  maskedEmail: string;

  attemptsRemaining:
    0;

  resendAvailableInSeconds:
    number;
}

export interface PasswordResetInvalidCodeData {
  status:
    "invalid-code";

  maskedEmail: string;

  attemptsRemaining:
    number;
}

export interface PasswordResetAccountUnavailableData {
  status:
    "account-unavailable";

  maskedEmail: string;
}

export interface PasswordResetCodeNotFoundData {
  status:
    "not-found";

  maskedEmail: string;
}

export type VerifyPasswordResetCodeResponseData =
  | PasswordResetCodeVerifiedData
  | PasswordResetCodeExpiredData
  | PasswordResetAttemptsExceededData
  | PasswordResetInvalidCodeData
  | PasswordResetAccountUnavailableData
  | PasswordResetCodeNotFoundData;

/*
 * Restablecimiento definitivo de contraseña.
 */
export type ResetPasswordStatus =
  | "password-reset"
  | "password-reused"
  | "code-expired"
  | "attempts-exceeded"
  | "invalid-code"
  | "account-unavailable"
  | "not-found";

export interface PasswordResetCompletedData {
  status:
    "password-reset";

  user:
    AuthContextUser;

  maskedEmail: string;

  revokedSessions:
    number;

  sessionsRevoked?:
    number;

  notificationCreated?:
    boolean;
}

export interface PasswordReusedData {
  status:
    "password-reused";

  maskedEmail: string;
}

export type ResetPasswordResponseData =
  | PasswordResetCompletedData
  | PasswordReusedData
  | PasswordResetCodeExpiredData
  | PasswordResetAttemptsExceededData
  | PasswordResetInvalidCodeData
  | PasswordResetAccountUnavailableData
  | PasswordResetCodeNotFoundData;

/*
 * Autenticación administrativa.
 */
export type AdministratorLoginStatus =
  | "authenticated"
  | "email-verification-required"
  | "account-locked"
  | "account-disabled"
  | "insufficient-permissions"
  | "invalid-credentials";

export interface AdministratorUser
  extends AuthContextUser {
  role:
    "ADMIN";
}

export interface AuthenticatedAdministratorData {
  status:
    "authenticated";

  administrator:
    AdministratorUser;

  user:
    AdministratorUser;

  session:
    AuthContextSession;

  expiresAt?:
    AuthDateValue;

  sessionExpiresAt?:
    AuthDateValue;

  remainingSeconds?:
    number;

  rememberMe:
    boolean;
}

export interface AdministratorInsufficientPermissionsData {
  status:
    "insufficient-permissions";

  requiredRole:
    "ADMIN";
}

export type AdministratorLoginResponseData =
  | AuthenticatedAdministratorData
  | LoginEmailVerificationRequiredData
  | LoginAccountLockedData
  | LoginAccountDisabledData
  | AdministratorInsufficientPermissionsData
  | LoginInvalidCredentialsData;

export type AdministratorSessionStatus =
  | "authenticated"
  | "insufficient-permissions"
  | "invalid-session"
  | "account-unavailable";

export interface AuthenticatedAdministratorSessionData {
  status:
    "authenticated";

  administrator:
    AdministratorUser;

  user:
    AdministratorUser;

  session:
    AuthContextSession;
}

export type AdministratorSessionResponseData =
  | AuthenticatedAdministratorSessionData
  | AdministratorInsufficientPermissionsData
  | InvalidSessionData
  | UnavailableSessionData;

/*
 * Almacenamiento temporal utilizado por los formularios
 * durante verificación y recuperación.
 */
export interface PendingEmailVerificationStorage {
  email: string;

  maskedEmail?: string;

  verificationExpiresInSeconds?:
    number;

  resendAvailableInSeconds?:
    number;

  createdAt?:
    string;
}

export interface PasswordRecoveryStorage {
  email: string;

  maskedEmail?: string;

  code?: string;

  verified?: boolean;

  expiresAt?: string;

  remainingSeconds?: number;

  createdAt?:
    string;
}

/*
 * Alias compatibles con componentes anteriores.
 */
export type AuthUser =
  AuthContextUser;

export type User =
  AuthContextUser;

export type SessionUser =
  AuthContextUser;

export type CurrentUser =
  AuthContextUser;

export type AuthSession =
  AuthContextSession;

export type Session =
  AuthContextSession;

export type AuthState =
  AuthStatus;

export type AuthContextType =
  AuthContextValue;

export type LoginData =
  LoginRequest;

export type LoginCredentials =
  LoginRequest;

export type RegisterData =
  RegisterRequest;

export type RegistrationData =
  RegisterRequest;

export type VerifyEmailData =
  VerifyEmailRequest;

export type VerificationData =
  VerifyEmailRequest;

export type ForgotPasswordData =
  ForgotPasswordRequest;

export type PasswordRecoveryData =
  ForgotPasswordRequest;

export type ResetPasswordData =
  ResetPasswordRequest;

export type PasswordResetData =
  ResetPasswordRequest;

export type AuthApiResponse<
  TData = undefined,
> =
  ApiResponse<TData>;