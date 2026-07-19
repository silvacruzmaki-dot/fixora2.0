"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import { AuthFieldMessage } from "@/components/atoms/auth/AuthFieldMessage";
import { AuthSubmitButton } from "@/components/atoms/auth/AuthSubmitButton";
import { PasswordInput } from "@/components/atoms/auth/PasswordInput";
import { PasswordStrengthMeter } from "@/components/atoms/auth/PasswordStrengthMeter";

import useLanguage from "@/hooks/language/useLanguage";

export interface PasswordResetSuccessResult {
  sessionsRevoked: number;
}

interface ResetPasswordApiData {
  status?: string;

  passwordReset?: boolean;
  sessionsRevoked?: number;

  retryAfterSeconds?: number;
  remainingAttempts?: number;

  requestNewCode?: boolean;
  redirectTo?: string;
}

interface LocalizedApiMessage {
  es?: string;
  en?: string;
}

interface ApiResponse<TData> {
  ok: boolean;
  code: string;

  message?: LocalizedApiMessage;

  data?: TData;

  fieldErrors?: Record<
    string,
    string[]
  >;
}

interface ResetPasswordFieldErrors {
  newPassword?: string;
  confirmPassword?: string;
}

interface StoredPasswordRecovery {
  email?: string;
  maskedEmail?: string;

  code?: string;
  verificationCode?: string;

  verified?: boolean;
  verifiedAt?: number;
  storedAt?: number;
}

interface RecoveryState {
  email: string;
  verificationCode: string;

  isVerified: boolean;
  isLoading: boolean;
  mustRestart: boolean;
}

export interface ResetPasswordFormProps {
  initialEmail?: string;
  initialVerificationCode?: string;

  showHeading?: boolean;

  onPasswordReset?: (
    result: PasswordResetSuccessResult,
  ) => void | Promise<void>;

  onRequestRecovery?: () => void;
  onRequestLogin?: () => void;

  className?: string;
}

const RESET_PASSWORD_COPY = {
  es: {
    title:
      "Crea una nueva contraseña",

    description:
      "Ingresa una contraseña segura que no hayas utilizado anteriormente en tu cuenta.",

    loadingRecovery:
      "Comprobando la solicitud de recuperación...",

    newPasswordLabel:
      "Nueva contraseña",

    newPasswordPlaceholder:
      "Crea una nueva contraseña segura",

    confirmPasswordLabel:
      "Confirma la nueva contraseña",

    confirmPasswordPlaceholder:
      "Ingresa nuevamente la contraseña",

    passwordStrengthTitle:
      "Seguridad de la contraseña",

    passwordEmpty:
      "Sin contraseña",

    passwordWeak:
      "Débil",

    passwordFair:
      "Regular",

    passwordGood:
      "Buena",

    passwordStrong:
      "Segura",

    showPassword:
      "Mostrar contraseña",

    hidePassword:
      "Ocultar contraseña",

    submit:
      "Restablecer contraseña",

    submitting:
      "Restableciendo contraseña...",

    backToLogin:
      "Volver al inicio de sesión",

    restartRecovery:
      "Solicitar un nuevo código",

    securityTitle:
      "Protege tu cuenta",

    securityDescription:
      "Al cambiar la contraseña, las demás sesiones abiertas en tu cuenta serán cerradas.",

    recoveryUnavailableTitle:
      "La verificación no está disponible",

    recoveryUnavailable:
      "Primero debes solicitar y verificar un código de recuperación.",

    passwordRequired:
      "Debes ingresar una nueva contraseña.",

    passwordLength:
      "La contraseña debe contener entre 8 y 128 caracteres.",

    passwordRequirements:
      "La contraseña debe incluir mayúscula, minúscula, número y carácter especial.",

    confirmPasswordRequired:
      "Debes confirmar la nueva contraseña.",

    passwordsDoNotMatch:
      "Las contraseñas no coinciden.",

    passwordReused:
      "La nueva contraseña no puede ser igual a una contraseña utilizada anteriormente.",

    codeExpired:
      "El código de recuperación venció. Solicita uno nuevo para continuar.",

    invalidCode:
      "El código de recuperación ya no es válido.",

    attemptsExceeded:
      "Se superó el número permitido de intentos de recuperación.",

    accountUnavailable:
      "No fue posible restablecer la contraseña de esta cuenta.",

    resetUnavailable:
      "No fue posible restablecer la contraseña. Revisa los datos e inténtalo nuevamente.",

    resetSuccessTitle:
      "Contraseña actualizada",

    resetSuccess:
      "Tu contraseña fue restablecida correctamente.",

    sessionsRevoked:
      "Se cerraron las sesiones anteriores de tu cuenta.",

    retryAfter:
      "Podrás volver a intentarlo en",

    seconds:
      "segundos",

    minute:
      "minuto",

    minutes:
      "minutos",

    remainingAttempts:
      "Intentos restantes",

    networkError:
      "No fue posible conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.",

    unexpectedError:
      "Ocurrió un problema inesperado. Inténtalo nuevamente.",
  },

  en: {
    title:
      "Create a new password",

    description:
      "Enter a secure password that you have not previously used for your account.",

    loadingRecovery:
      "Checking the password recovery request...",

    newPasswordLabel:
      "New password",

    newPasswordPlaceholder:
      "Create a new secure password",

    confirmPasswordLabel:
      "Confirm new password",

    confirmPasswordPlaceholder:
      "Enter the password again",

    passwordStrengthTitle:
      "Password strength",

    passwordEmpty:
      "No password",

    passwordWeak:
      "Weak",

    passwordFair:
      "Fair",

    passwordGood:
      "Good",

    passwordStrong:
      "Strong",

    showPassword:
      "Show password",

    hidePassword:
      "Hide password",

    submit:
      "Reset password",

    submitting:
      "Resetting password...",

    backToLogin:
      "Back to sign in",

    restartRecovery:
      "Request a new code",

    securityTitle:
      "Protect your account",

    securityDescription:
      "When your password is changed, the other active sessions on your account will be closed.",

    recoveryUnavailableTitle:
      "Verification is unavailable",

    recoveryUnavailable:
      "You must first request and verify a password recovery code.",

    passwordRequired:
      "You must enter a new password.",

    passwordLength:
      "The password must contain between 8 and 128 characters.",

    passwordRequirements:
      "The password must include an uppercase letter, lowercase letter, number, and special character.",

    confirmPasswordRequired:
      "You must confirm the new password.",

    passwordsDoNotMatch:
      "The passwords do not match.",

    passwordReused:
      "The new password cannot match a password that was previously used.",

    codeExpired:
      "The password recovery code has expired. Request a new one to continue.",

    invalidCode:
      "The password recovery code is no longer valid.",

    attemptsExceeded:
      "The maximum number of password recovery attempts was exceeded.",

    accountUnavailable:
      "The password for this account could not be reset.",

    resetUnavailable:
      "The password could not be reset. Review the information and try again.",

    resetSuccessTitle:
      "Password updated",

    resetSuccess:
      "Your password was reset successfully.",

    sessionsRevoked:
      "Previous account sessions were closed.",

    retryAfter:
      "You can try again in",

    seconds:
      "seconds",

    minute:
      "minute",

    minutes:
      "minutes",

    remainingAttempts:
      "Remaining attempts",

    networkError:
      "The server could not be reached. Check your connection and try again.",

    unexpectedError:
      "An unexpected problem occurred. Please try again.",
  },
} as const;

function normalizeEmail(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase();
}

function normalizeVerificationCode(
  value: string,
): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 6);
}

function hasStrongPasswordRequirements(
  password: string,
): boolean {
  return (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function normalizeApiCode(
  code?: string,
): string {
  return (
    code
      ?.trim()
      .toUpperCase()
      .replaceAll("-", "_")
      .replaceAll(" ", "_") ??
    ""
  );
}

function getApiMessage<TData>(
  response: ApiResponse<TData> | null,
  language: "es" | "en",
  fallback: string,
): string {
  const localizedMessage =
    response?.message?.[language];

  if (
    typeof localizedMessage === "string" &&
    localizedMessage.trim().length > 0
  ) {
    return localizedMessage;
  }

  return fallback;
}

function getFirstFieldError(
  fieldErrors:
    | Record<string, string[]>
    | undefined,
  fieldNames: string[],
): string | undefined {
  for (const fieldName of fieldNames) {
    const error =
      fieldErrors?.[fieldName]?.[0];

    if (
      typeof error === "string" &&
      error.trim().length > 0
    ) {
      return error;
    }
  }

  return undefined;
}

function formatRetryTime(
  seconds: number,
  copy:
    | typeof RESET_PASSWORD_COPY.es
    | typeof RESET_PASSWORD_COPY.en,
): string {
  if (seconds < 60) {
    return `${copy.retryAfter} ${Math.max(
      1,
      Math.ceil(seconds),
    )} ${copy.seconds}.`;
  }

  const minutes =
    Math.max(
      1,
      Math.ceil(
        seconds / 60,
      ),
    );

  return `${copy.retryAfter} ${minutes} ${
    minutes === 1
      ? copy.minute
      : copy.minutes
  }.`;
}

function readStoredRecovery():
  | StoredPasswordRecovery
  | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const storedValue =
      window.sessionStorage.getItem(
        "fixora.passwordRecovery",
      );

    if (!storedValue) {
      return null;
    }

    const parsedValue =
      JSON.parse(
        storedValue,
      ) as unknown;

    if (
      !parsedValue ||
      typeof parsedValue !==
        "object"
    ) {
      return null;
    }

    return parsedValue as
      StoredPasswordRecovery;
  } catch {
    return null;
  }
}

function createInitialRecoveryState(
  initialEmail: string,
  initialVerificationCode: string,
): RecoveryState {
  const normalizedEmailValue =
    normalizeEmail(
      initialEmail,
    );

  const normalizedCodeValue =
    normalizeVerificationCode(
      initialVerificationCode,
    );

  const hasInitialRecovery =
    normalizedEmailValue.length > 0 &&
    normalizedCodeValue.length === 6;

  if (hasInitialRecovery) {
    return {
      email:
        normalizedEmailValue,

      verificationCode:
        normalizedCodeValue,

      isVerified: true,
      isLoading: false,
      mustRestart: false,
    };
  }

  return {
    email: "",
    verificationCode: "",

    isVerified: false,
    isLoading: true,
    mustRestart: false,
  };
}

function getStoredRecoveryState():
  RecoveryState {
  const storedRecovery =
    readStoredRecovery();

  const storedEmail =
    normalizeEmail(
      storedRecovery?.email ??
        "",
    );

  const storedCode =
    normalizeVerificationCode(
      storedRecovery
        ?.verificationCode ??
        storedRecovery?.code ??
        "",
    );

  const hasVerifiedRecovery =
    storedRecovery?.verified ===
      true &&
    storedEmail.length > 0 &&
    storedCode.length === 6;

  if (hasVerifiedRecovery) {
    return {
      email:
        storedEmail,

      verificationCode:
        storedCode,

      isVerified: true,
      isLoading: false,
      mustRestart: false,
    };
  }

  return {
    email:
      storedEmail,

    verificationCode:
      storedCode,

    isVerified: false,
    isLoading: false,
    mustRestart: true,
  };
}

function removeStoredRecovery(): void {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    window.sessionStorage.removeItem(
      "fixora.passwordRecovery",
    );
  } catch {
    /*
     * La navegación puede continuar aunque
     * sessionStorage no esté disponible.
     */
  }
}

export function ResetPasswordForm({
  initialEmail = "",
  initialVerificationCode = "",

  showHeading = true,

  onPasswordReset,

  onRequestRecovery,
  onRequestLogin,

  className = "",
}: ResetPasswordFormProps) {
  const router = useRouter();

  const { language } =
    useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    RESET_PASSWORD_COPY[
      currentLanguage
    ];

  const [
    recoveryState,
    setRecoveryState,
  ] = useState<RecoveryState>(
    () =>
      createInitialRecoveryState(
        initialEmail,
        initialVerificationCode,
      ),
  );

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    isCompleted,
    setIsCompleted,
  ] = useState(false);

  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState<ResetPasswordFieldErrors>(
      {},
    );

  const [
    generalError,
    setGeneralError,
  ] = useState<string | null>(
    null,
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const initialState =
      createInitialRecoveryState(
        initialEmail,
        initialVerificationCode,
      );

    /*
     * Cuando la información llega directamente
     * mediante propiedades, no necesitamos consultar
     * sessionStorage.
     */
    if (
      initialState.isVerified
    ) {
      const timeoutId =
        window.setTimeout(
          () => {
            setRecoveryState(
              initialState,
            );
          },
          0,
        );

      return () => {
        window.clearTimeout(
          timeoutId,
        );
      };
    }

    /*
     * El setTimeout evita realizar actualizaciones
     * de estado síncronas dentro del efecto.
     */
    const timeoutId =
      window.setTimeout(
        () => {
          setRecoveryState(
            getStoredRecoveryState(),
          );
        },
        0,
      );

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [
    initialEmail,
    initialVerificationCode,
  ]);

  const canSubmit =
    useMemo(
      () =>
        recoveryState
          .isVerified &&
        !recoveryState
          .mustRestart &&
        !recoveryState
          .isLoading &&
        !isCompleted,
      [
        isCompleted,
        recoveryState
          .isLoading,
        recoveryState
          .isVerified,
        recoveryState
          .mustRestart,
      ],
    );

  const clearFieldError = (
    fieldName:
      keyof ResetPasswordFieldErrors,
  ) => {
    setFieldErrors(
      (currentErrors) => {
        if (
          !currentErrors[
            fieldName
          ]
        ) {
          return currentErrors;
        }

        return {
          ...currentErrors,

          [fieldName]:
            undefined,
        };
      },
    );

    setGeneralError(null);
  };

  const validateForm =
    (): boolean => {
      const nextErrors:
        ResetPasswordFieldErrors =
        {};

      if (!newPassword) {
        nextErrors.newPassword =
          copy.passwordRequired;
      } else if (
        newPassword.length < 8 ||
        newPassword.length >
          128
      ) {
        nextErrors.newPassword =
          copy.passwordLength;
      } else if (
        !hasStrongPasswordRequirements(
          newPassword,
        )
      ) {
        nextErrors.newPassword =
          copy.passwordRequirements;
      }

      if (!confirmPassword) {
        nextErrors.confirmPassword =
          copy.confirmPasswordRequired;
      } else if (
        confirmPassword !==
        newPassword
      ) {
        nextErrors.confirmPassword =
          copy.passwordsDoNotMatch;
      }

      setFieldErrors(
        nextErrors,
      );

      return (
        Object.keys(
          nextErrors,
        ).length === 0
      );
    };

  const markRecoveryForRestart =
    (
      message:
        string,
    ) => {
      setRecoveryState(
        (currentState) => ({
          ...currentState,

          isVerified: false,
          mustRestart: true,
        }),
      );

      setGeneralError(
        message,
      );
    };

  const handleRecoveryRequest =
    () => {
      setGeneralError(null);

      removeStoredRecovery();

      if (onRequestRecovery) {
        onRequestRecovery();

        return;
      }

      router.push(
        "/recuperar-password",
      );
    };

  const handleLoginRequest =
    () => {
      setGeneralError(null);

      if (onRequestLogin) {
        onRequestLogin();

        return;
      }

      router.push(
        "/iniciar-sesion",
      );
    };

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (
        isSubmitting ||
        !canSubmit
      ) {
        return;
      }

      setGeneralError(null);
      setSuccessMessage(null);

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const response =
          await fetch(
            "/api/auth/restablecer-password",
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  email:
                    recoveryState
                      .email,

                  code:
                    recoveryState
                      .verificationCode,

                  /*
                   * El esquema del backend espera
                   * la propiedad llamada password.
                   */
                  password:
                    newPassword,

                  confirmPassword,
                }),
            },
          );

        const payload =
          (await response
            .json()
            .catch(
              () => null,
            )) as
            | ApiResponse<ResetPasswordApiData>
            | null;

        const apiCode =
          normalizeApiCode(
            payload?.code ??
              payload?.data
                ?.status,
          );

        const resetWasSuccessful =
          response.ok &&
          (
            payload?.data
              ?.passwordReset ===
              true ||
            apiCode ===
              "PASSWORD_RESET_SUCCESSFUL" ||
            typeof payload?.data
              ?.sessionsRevoked ===
              "number"
          );

        if (
          resetWasSuccessful
        ) {
          const result:
            PasswordResetSuccessResult =
            {
              sessionsRevoked:
                payload?.data
                  ?.sessionsRevoked ??
                0,
            };

          removeStoredRecovery();

          setIsCompleted(true);

          setNewPassword("");
          setConfirmPassword("");

          setFieldErrors({});

          setSuccessMessage(
            result.sessionsRevoked >
              0
              ? `${copy.resetSuccess} ${copy.sessionsRevoked}`
              : copy.resetSuccess,
          );

          await onPasswordReset?.(
            result,
          );

          if (!onPasswordReset) {
            router.replace(
              "/iniciar-sesion?passwordReset=success",
            );

            router.refresh();
          }

          return;
        }

        const newPasswordError =
          getFirstFieldError(
            payload?.fieldErrors,
            [
              "password",
              "newPassword",
            ],
          );

        const confirmPasswordError =
          getFirstFieldError(
            payload?.fieldErrors,
            [
              "confirmPassword",
              "passwordConfirmation",
            ],
          );

        if (
          newPasswordError ||
          confirmPasswordError
        ) {
          setFieldErrors({
            newPassword:
              newPasswordError,

            confirmPassword:
              confirmPasswordError,
          });
        }

        if (
          apiCode.includes(
            "PASSWORD_ALREADY_IN_USE",
          ) ||
          apiCode.includes(
            "PASSWORD_REUSED",
          )
        ) {
          setFieldErrors(
            (currentErrors) => ({
              ...currentErrors,

              newPassword:
                getApiMessage(
                  payload,
                  currentLanguage,
                  copy.passwordReused,
                ),
            }),
          );

          return;
        }

        if (
          apiCode.includes(
            "CODE_EXPIRED",
          )
        ) {
          markRecoveryForRestart(
            getApiMessage(
              payload,
              currentLanguage,
              copy.codeExpired,
            ),
          );

          return;
        }

        if (
          apiCode.includes(
            "ATTEMPTS_EXCEEDED",
          )
        ) {
          const retryAfterSeconds =
            payload?.data
              ?.retryAfterSeconds;

          const retryMessage =
            typeof retryAfterSeconds ===
              "number" &&
            retryAfterSeconds > 0
              ? ` ${formatRetryTime(
                  retryAfterSeconds,
                  copy,
                )}`
              : "";

          markRecoveryForRestart(
            `${getApiMessage(
              payload,
              currentLanguage,
              copy.attemptsExceeded,
            )}${retryMessage}`,
          );

          return;
        }

        if (
          apiCode.includes(
            "INVALID_RECOVERY_CODE",
          ) ||
          apiCode.includes(
            "INVALID_RECOVERY_REQUEST",
          ) ||
          apiCode.includes(
            "INVALID_CODE",
          ) ||
          apiCode.includes(
            "NOT_FOUND",
          )
        ) {
          const remainingAttempts =
            payload?.data
              ?.remainingAttempts;

          const remainingMessage =
            typeof remainingAttempts ===
              "number" &&
            remainingAttempts >= 0
              ? ` ${copy.remainingAttempts}: ${remainingAttempts}.`
              : "";

          markRecoveryForRestart(
            `${getApiMessage(
              payload,
              currentLanguage,
              copy.invalidCode,
            )}${remainingMessage}`,
          );

          return;
        }

        if (
          apiCode.includes(
            "ACCOUNT_UNAVAILABLE",
          )
        ) {
          markRecoveryForRestart(
            getApiMessage(
              payload,
              currentLanguage,
              copy.accountUnavailable,
            ),
          );

          return;
        }

        if (
          response.status ===
          429
        ) {
          const retryAfterSeconds =
            payload?.data
              ?.retryAfterSeconds;

          setGeneralError(
            typeof retryAfterSeconds ===
              "number" &&
            retryAfterSeconds > 0
              ? formatRetryTime(
                  retryAfterSeconds,
                  copy,
                )
              : getApiMessage(
                  payload,
                  currentLanguage,
                  copy.resetUnavailable,
                ),
          );

          return;
        }

        setGeneralError(
          getApiMessage(
            payload,
            currentLanguage,
            copy.resetUnavailable,
          ),
        );
      } catch {
        setGeneralError(
          copy.networkError,
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  if (
    recoveryState.isLoading
  ) {
    return (
      <div
        className={`flex min-h-48 items-center justify-center ${className}`}
        aria-live="polite"
      >
        <div className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <span
            className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"
            aria-hidden="true"
          />

          {
            copy.loadingRecovery
          }
        </div>
      </div>
    );
  }

  if (
    !recoveryState.isVerified ||
    recoveryState.mustRestart
  ) {
    return (
      <div
        className={`grid w-full gap-5 ${className}`}
      >
        {showHeading ? (
          <header>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              {copy.title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {
                copy.description
              }
            </p>
          </header>
        ) : null}

        <AuthFieldMessage
          variant="warning"
          title={
            copy.recoveryUnavailableTitle
          }
        >
          {generalError ??
            copy.recoveryUnavailable}
        </AuthFieldMessage>

        <button
          type="button"
          onClick={
            handleRecoveryRequest
          }
          className="min-h-12 w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
        >
          {
            copy.restartRecovery
          }
        </button>

        <button
          type="button"
          onClick={
            handleLoginRequest
          }
          className="mx-auto text-sm font-semibold text-emerald-700 transition hover:underline dark:text-emerald-400"
        >
          {
            copy.backToLogin
          }
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      noValidate
      className={`grid w-full gap-5 ${className}`}
    >
      {showHeading ? (
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
            {copy.title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {
              copy.description
            }
          </p>
        </header>
      ) : null}

      <AuthFieldMessage
        variant="info"
        title={
          copy.securityTitle
        }
      >
        {
          copy.securityDescription
        }
      </AuthFieldMessage>

      {generalError ? (
        <AuthFieldMessage
          variant="error"
        >
          {generalError}
        </AuthFieldMessage>
      ) : null}

      {successMessage ? (
        <AuthFieldMessage
          variant="success"
          title={
            copy.resetSuccessTitle
          }
        >
          {successMessage}
        </AuthFieldMessage>
      ) : null}

      <div className="grid gap-3">
        <PasswordInput
          label={
            copy.newPasswordLabel
          }
          name="password"
          value={
            newPassword
          }
          placeholder={
            copy.newPasswordPlaceholder
          }
          autoComplete="new-password"
          maxLength={128}
          required
          autoFocus
          disabled={
            isSubmitting ||
            isCompleted
          }
          errorMessage={
            fieldErrors.newPassword
          }
          showPasswordLabel={
            copy.showPassword
          }
          hidePasswordLabel={
            copy.hidePassword
          }
          leadingIcon={
            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect
                x="5"
                y="10"
                width="14"
                height="10"
                rx="2"
              />

              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          }
          onChange={(
            event,
          ) => {
            setNewPassword(
              event.target.value,
            );

            clearFieldError(
              "newPassword",
            );

            if (
              fieldErrors
                .confirmPassword
            ) {
              clearFieldError(
                "confirmPassword",
              );
            }
          }}
        />

        <PasswordStrengthMeter
          password={
            newPassword
          }
          labels={{
            title:
              copy.passwordStrengthTitle,

            empty:
              copy.passwordEmpty,

            weak:
              copy.passwordWeak,

            fair:
              copy.passwordFair,

            good:
              copy.passwordGood,

            strong:
              copy.passwordStrong,
          }}
        />
      </div>

      <PasswordInput
        label={
          copy.confirmPasswordLabel
        }
        name="confirmPassword"
        value={
          confirmPassword
        }
        placeholder={
          copy.confirmPasswordPlaceholder
        }
        autoComplete="new-password"
        maxLength={128}
        required
        disabled={
          isSubmitting ||
          isCompleted
        }
        errorMessage={
          fieldErrors
            .confirmPassword
        }
        showPasswordLabel={
          copy.showPassword
        }
        hidePasswordLabel={
          copy.hidePassword
        }
        onChange={(
          event,
        ) => {
          setConfirmPassword(
            event.target.value,
          );

          clearFieldError(
            "confirmPassword",
          );
        }}
      />

      {!isCompleted ? (
        <AuthSubmitButton
          isLoading={
            isSubmitting
          }
          loadingText={
            copy.submitting
          }
        >
          {copy.submit}
        </AuthSubmitButton>
      ) : (
        <button
          type="button"
          onClick={
            handleLoginRequest
          }
          className="min-h-12 w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
        >
          {
            copy.backToLogin
          }
        </button>
      )}
    </form>
  );
}