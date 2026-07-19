"use client";

import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

import { AuthCheckbox } from "@/components/atoms/auth/AuthCheckbox";
import { AuthFieldMessage } from "@/components/atoms/auth/AuthFieldMessage";
import { AuthInput } from "@/components/atoms/auth/AuthInput";
import { AuthSubmitButton } from "@/components/atoms/auth/AuthSubmitButton";
import { PasswordInput } from "@/components/atoms/auth/PasswordInput";

import useLanguage from "@/hooks/language/useLanguage";

interface LoginUser {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;
  avatarUrl: string | null;

  role: string;
  status: string;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerifiedAt: string | null;
  createdAt: string;
}

interface LoginSession {
  expiresAt: string;
  rememberMe: boolean;
}

export interface LoginAuthenticatedResult {
  user: LoginUser;
  session: LoginSession;
}

export interface LoginVerificationRequiredResult {
  email: string;
  maskedEmail: string;

  verificationExpiresInSeconds: number;
  resendAvailableInSeconds: number;
}

interface LoginApiData {
  status?: string;
  authenticated?: boolean;

  user?: LoginUser;
  session?: LoginSession;

  maskedEmail?: string;

  verificationExpiresInSeconds?: number;
  resendAvailableInSeconds?: number;

  retryAfterSeconds?: number;
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

interface LoginFieldErrors {
  email?: string;
  password?: string;
}

export interface LoginFormProps {
  initialEmail?: string;

  redirectTo?: string;

  showHeading?: boolean;

  onAuthenticated?: (
    result: LoginAuthenticatedResult,
  ) => void | Promise<void>;

  onVerificationRequired?: (
    result: LoginVerificationRequiredResult,
  ) => void | Promise<void>;

  onRequestRegister?: () => void;
  onRequestPasswordRecovery?: () => void;

  className?: string;
}

const LOGIN_COPY = {
  es: {
    title:
      "Inicia sesión",

    description:
      "Accede a tu cuenta para administrar tu perfil, proyectos y notificaciones.",

    emailLabel:
      "Correo electrónico",

    emailPlaceholder:
      "correo@ejemplo.com",

    passwordLabel:
      "Contraseña",

    passwordPlaceholder:
      "Ingresa tu contraseña",

    rememberMe:
      "Mantener mi sesión iniciada",

    forgotPassword:
      "¿Olvidaste tu contraseña?",

    submit:
      "Iniciar sesión",

    submitting:
      "Iniciando sesión...",

    noAccount:
      "¿Todavía no tienes una cuenta?",

    register:
      "Crear una cuenta",

    showPassword:
      "Mostrar contraseña",

    hidePassword:
      "Ocultar contraseña",

    emailRequired:
      "Debes ingresar tu correo electrónico.",

    emailInvalid:
      "Ingresa un correo electrónico válido.",

    passwordRequired:
      "Debes ingresar tu contraseña.",

    passwordTooLong:
      "La contraseña ingresada es demasiado extensa.",

    invalidCredentials:
      "El correo o la contraseña son incorrectos.",

    accountLocked:
      "La cuenta está bloqueada temporalmente.",

    accountDisabled:
      "Esta cuenta se encuentra desactivada.",

    verificationRequired:
      "Debes verificar tu correo electrónico antes de iniciar sesión.",

    adminLoginRequired:
      "Las cuentas administradoras deben ingresar desde el acceso administrativo.",

    goToAdminLogin:
      "Ir al acceso administrativo",

    networkError:
      "No fue posible conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.",

    unexpectedError:
      "Ocurrió un problema inesperado. Inténtalo nuevamente.",

    retryAfter:
      "Podrás volver a intentarlo en",

    seconds:
      "segundos",

    minute:
      "minuto",

    minutes:
      "minutos",
  },

  en: {
    title:
      "Sign in",

    description:
      "Access your account to manage your profile, projects, and notifications.",

    emailLabel:
      "Email address",

    emailPlaceholder:
      "email@example.com",

    passwordLabel:
      "Password",

    passwordPlaceholder:
      "Enter your password",

    rememberMe:
      "Keep me signed in",

    forgotPassword:
      "Forgot your password?",

    submit:
      "Sign in",

    submitting:
      "Signing in...",

    noAccount:
      "Do not have an account yet?",

    register:
      "Create an account",

    showPassword:
      "Show password",

    hidePassword:
      "Hide password",

    emailRequired:
      "You must enter your email address.",

    emailInvalid:
      "Enter a valid email address.",

    passwordRequired:
      "You must enter your password.",

    passwordTooLong:
      "The entered password is too long.",

    invalidCredentials:
      "The email address or password is incorrect.",

    accountLocked:
      "The account is temporarily locked.",

    accountDisabled:
      "This account is disabled.",

    verificationRequired:
      "You must verify your email address before signing in.",

    adminLoginRequired:
      "Administrator accounts must use the administrator access page.",

    goToAdminLogin:
      "Go to administrator access",

    networkError:
      "The server could not be reached. Check your connection and try again.",

    unexpectedError:
      "An unexpected problem occurred. Please try again.",

    retryAfter:
      "You can try again in",

    seconds:
      "seconds",

    minute:
      "minute",

    minutes:
      "minutes",
  },
} as const;

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getApiMessage<TData>(
  response:
    ApiResponse<TData> | null,
  language:
    "es" | "en",
  fallback:
    string,
): string {
  const localizedMessage =
    response
      ?.message
      ?.[language];

  if (
    typeof localizedMessage ===
      "string" &&
    localizedMessage
      .trim()
      .length > 0
  ) {
    return localizedMessage;
  }

  return fallback;
}

function normalizeApiCode(
  code?: string,
): string {
  return (
    code
      ?.trim()
      .toUpperCase()
      .replaceAll(
        "-",
        "_",
      )
      .replaceAll(
        " ",
        "_",
      ) ??
    ""
  );
}

function getSafeRedirectPath(
  requestedPath?: string,
): string {
  if (
    requestedPath &&
    requestedPath.startsWith("/") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.startsWith(
      "/admin",
    )
  ) {
    return requestedPath;
  }

  if (
    typeof window !==
    "undefined"
  ) {
    const searchParams =
      new URLSearchParams(
        window.location.search,
      );

    const redirectPath =
      searchParams.get(
        "redirect",
      );

    if (
      redirectPath &&
      redirectPath.startsWith("/") &&
      !redirectPath.startsWith("//") &&
      !redirectPath.startsWith(
        "/admin",
      )
    ) {
      return redirectPath;
    }
  }

  return "/perfil";
}

function formatRetryTime(
  seconds:
    number,
  copy:
    | typeof LOGIN_COPY.es
    | typeof LOGIN_COPY.en,
): string {
  if (seconds < 60) {
    return `${copy.retryAfter} ${Math.max(
      1,
      Math.ceil(
        seconds,
      ),
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

export function LoginForm({
  initialEmail = "",

  redirectTo,

  showHeading = true,

  onAuthenticated,
  onVerificationRequired,

  onRequestRegister,
  onRequestPasswordRecovery,

  className = "",
}: LoginFormProps) {
  const router =
    useRouter();

  const {
    language,
  } = useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    LOGIN_COPY[
      currentLanguage
    ];

  const [
    email,
    setEmail,
  ] = useState(
    initialEmail
      .trim()
      .toLowerCase(),
  );

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    rememberMe,
    setRememberMe,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    generalError,
    setGeneralError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState<LoginFieldErrors>(
      {},
    );

  const [
    requiresAdminLogin,
    setRequiresAdminLogin,
  ] = useState(false);

  const normalizedEmail =
    useMemo(
      () =>
        email
          .trim()
          .toLowerCase(),
      [email],
    );

  const validateForm =
    (): boolean => {
      const nextErrors:
        LoginFieldErrors =
        {};

      if (!normalizedEmail) {
        nextErrors.email =
          copy.emailRequired;
      } else if (
        normalizedEmail.length >
          254 ||
        !EMAIL_PATTERN.test(
          normalizedEmail,
        )
      ) {
        nextErrors.email =
          copy.emailInvalid;
      }

      if (!password) {
        nextErrors.password =
          copy.passwordRequired;
      } else if (
        password.length >
          256
      ) {
        nextErrors.password =
          copy.passwordTooLong;
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

  const handleRegisterRequest =
    (): void => {
      setGeneralError(
        null,
      );

      setRequiresAdminLogin(
        false,
      );

      if (onRequestRegister) {
        onRequestRegister();

        return;
      }

      router.push(
        "/registrarse",
      );
    };

  const handlePasswordRecoveryRequest =
    (): void => {
      setGeneralError(
        null,
      );

      setRequiresAdminLogin(
        false,
      );

      if (
        onRequestPasswordRecovery
      ) {
        onRequestPasswordRecovery();

        return;
      }

      const searchParams =
        new URLSearchParams();

      if (normalizedEmail) {
        searchParams.set(
          "email",
          normalizedEmail,
        );
      }

      const queryString =
        searchParams.toString();

      router.push(
        queryString
          ? `/recuperar-password?${queryString}`
          : "/recuperar-password",
      );
    };

  const storePendingVerification =
    (
      result:
        LoginVerificationRequiredResult,
    ): void => {
      try {
        sessionStorage.setItem(
          "fixora.pendingVerification",
          JSON.stringify({
            email:
              result.email,

            maskedEmail:
              result.maskedEmail,

            verificationExpiresInSeconds:
              result
                .verificationExpiresInSeconds,

            resendAvailableInSeconds:
              result
                .resendAvailableInSeconds,

            storedAt:
              Date.now(),
          }),
        );
      } catch {
        /*
         * La navegación continúa incluso cuando
         * el navegador bloquea sessionStorage.
         */
      }
    };

  const handleSubmit =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ): Promise<void> => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      setGeneralError(
        null,
      );

      setRequiresAdminLogin(
        false,
      );

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(
        true,
      );

      try {
        const response =
          await fetch(
            "/api/auth/iniciar-sesion",
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
                    normalizedEmail,

                  password,

                  rememberMe,
                }),
            },
          );

        const payload =
          (await response
            .json()
            .catch(
              () =>
                null,
            )) as
            | ApiResponse<LoginApiData>
            | null;

        const apiCode =
          normalizeApiCode(
            payload?.code ??
              payload
                ?.data
                ?.status,
          );

        if (
          response.ok &&
          payload?.data?.user &&
          payload.data.session
        ) {
          const authenticatedResult:
            LoginAuthenticatedResult =
            {
              user:
                payload.data.user,

              session:
                payload.data.session,
            };

          if (onAuthenticated) {
            await onAuthenticated(
              authenticatedResult,
            );
          }

          router.replace(
            getSafeRedirectPath(
              redirectTo,
            ),
          );

          router.refresh();

          return;
        }

        const requiresVerification =
          apiCode.includes(
            "EMAIL_VERIFICATION_REQUIRED",
          ) ||
          apiCode.includes(
            "VERIFICATION_REQUIRED",
          );

        if (
          requiresVerification
        ) {
          const verificationResult:
            LoginVerificationRequiredResult =
            {
              email:
                normalizedEmail,

              maskedEmail:
                payload
                  ?.data
                  ?.maskedEmail ??
                normalizedEmail,

              verificationExpiresInSeconds:
                payload
                  ?.data
                  ?.verificationExpiresInSeconds ??
                600,

              resendAvailableInSeconds:
                payload
                  ?.data
                  ?.resendAvailableInSeconds ??
                60,
            };

          storePendingVerification(
            verificationResult,
          );

          if (
            onVerificationRequired
          ) {
            await onVerificationRequired(
              verificationResult,
            );

            return;
          }

          router.push(
            "/verificar-correo",
          );

          return;
        }

        const emailFieldError =
          payload
            ?.fieldErrors
            ?.email
            ?.[0];

        const passwordFieldError =
          payload
            ?.fieldErrors
            ?.password
            ?.[0];

        if (
          emailFieldError ||
          passwordFieldError
        ) {
          setFieldErrors({
            email:
              emailFieldError,

            password:
              passwordFieldError,
          });
        }

        if (
          apiCode.includes(
            "ACCOUNT_LOCKED",
          ) ||
          apiCode.includes(
            "ACCOUNT_TEMPORARILY_LOCKED",
          )
        ) {
          const retryAfterSeconds =
            payload
              ?.data
              ?.retryAfterSeconds;

          const retryMessage =
            typeof retryAfterSeconds ===
              "number" &&
            retryAfterSeconds >
              0
              ? ` ${formatRetryTime(
                  retryAfterSeconds,
                  copy,
                )}`
              : "";

          setGeneralError(
            `${getApiMessage(
              payload,
              currentLanguage,
              copy.accountLocked,
            )}${retryMessage}`,
          );

          return;
        }

        if (
          apiCode.includes(
            "ACCOUNT_DISABLED",
          )
        ) {
          setGeneralError(
            getApiMessage(
              payload,
              currentLanguage,
              copy.accountDisabled,
            ),
          );

          return;
        }

        if (
          apiCode.includes(
            "ADMIN_LOGIN_REQUIRED",
          )
        ) {
          setRequiresAdminLogin(
            true,
          );

          setGeneralError(
            getApiMessage(
              payload,
              currentLanguage,
              copy.adminLoginRequired,
            ),
          );

          return;
        }

        if (
          response.status ===
            401 ||
          apiCode.includes(
            "INVALID_CREDENTIALS",
          ) ||
          apiCode.includes(
            "AUTHENTICATION_FAILED",
          )
        ) {
          setGeneralError(
            getApiMessage(
              payload,
              currentLanguage,
              copy.invalidCredentials,
            ),
          );

          return;
        }

        if (
          response.status ===
            429 ||
          apiCode.includes(
            "RATE_LIMITED",
          )
        ) {
          const retryAfterSeconds =
            payload
              ?.data
              ?.retryAfterSeconds;

          setGeneralError(
            typeof retryAfterSeconds ===
              "number"
              ? formatRetryTime(
                  retryAfterSeconds,
                  copy,
                )
              : getApiMessage(
                  payload,
                  currentLanguage,
                  copy.unexpectedError,
                ),
          );

          return;
        }

        setGeneralError(
          getApiMessage(
            payload,
            currentLanguage,
            copy.unexpectedError,
          ),
        );
      } catch {
        setGeneralError(
          copy.networkError,
        );
      } finally {
        setIsSubmitting(
          false,
        );
      }
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
      noValidate
      className={[
        "grid w-full gap-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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

      {generalError ? (
        <AuthFieldMessage
          variant="error"
        >
          <p>
            {generalError}
          </p>

          {requiresAdminLogin ? (
            <button
              type="button"
              onClick={() => {
                router.push(
                  "/admin/iniciar-sesion",
                );
              }}
              className="mt-2 font-semibold underline underline-offset-4 transition hover:opacity-80"
            >
              {
                copy.goToAdminLogin
              }
            </button>
          ) : null}
        </AuthFieldMessage>
      ) : null}

      <AuthInput
        label={
          copy.emailLabel
        }
        name="email"
        type="email"
        value={email}
        placeholder={
          copy.emailPlaceholder
        }
        autoComplete="email"
        inputMode="email"
        spellCheck={false}
        autoCapitalize="none"
        maxLength={254}
        required
        disabled={
          isSubmitting
        }
        errorMessage={
          fieldErrors.email
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
              x="3"
              y="5"
              width="18"
              height="14"
              rx="2"
            />

            <path d="m3 7 9 6 9-6" />
          </svg>
        }
        onChange={(
          event,
        ) => {
          setEmail(
            event
              .target
              .value,
          );

          if (
            fieldErrors.email
          ) {
            setFieldErrors(
              (
                currentErrors,
              ) => ({
                ...currentErrors,

                email:
                  undefined,
              }),
            );
          }

          setGeneralError(
            null,
          );

          setRequiresAdminLogin(
            false,
          );
        }}
      />

      <div className="grid gap-2">
        <PasswordInput
          label={
            copy.passwordLabel
          }
          name="password"
          value={password}
          placeholder={
            copy.passwordPlaceholder
          }
          autoComplete="current-password"
          maxLength={256}
          required
          disabled={
            isSubmitting
          }
          errorMessage={
            fieldErrors.password
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
            setPassword(
              event
                .target
                .value,
            );

            if (
              fieldErrors.password
            ) {
              setFieldErrors(
                (
                  currentErrors,
                ) => ({
                  ...currentErrors,

                  password:
                    undefined,
                }),
              );
            }

            setGeneralError(
              null,
            );

            setRequiresAdminLogin(
              false,
            );
          }}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={
              handlePasswordRecoveryRequest
            }
            disabled={
              isSubmitting
            }
            className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            {
              copy.forgotPassword
            }
          </button>
        </div>
      </div>

      <AuthCheckbox
        name="rememberMe"
        checked={
          rememberMe
        }
        disabled={
          isSubmitting
        }
        label={
          copy.rememberMe
        }
        onChange={(
          event,
        ) => {
          setRememberMe(
            event
              .target
              .checked,
          );
        }}
      />

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

      <div className="flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-zinc-600 dark:text-zinc-300">
        <span>
          {copy.noAccount}
        </span>

        <button
          type="button"
          onClick={
            handleRegisterRequest
          }
          disabled={
            isSubmitting
          }
          className="font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {copy.register}
        </button>
      </div>
    </form>
  );
}