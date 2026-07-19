"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { useRouter } from "next/navigation";

import { AuthFieldMessage } from "@/components/atoms/auth/AuthFieldMessage";
import { AuthInput } from "@/components/atoms/auth/AuthInput";
import { AuthSubmitButton } from "@/components/atoms/auth/AuthSubmitButton";

import useLanguage from "@/hooks/language/useLanguage";

export interface PasswordRecoveryRequestedResult {
  email: string;
  maskedEmail: string;

  verificationExpiresInSeconds: number;
  resendAvailableInSeconds: number;
}

interface ForgotPasswordApiData {
  status?: string;

  email?: string;
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

interface ForgotPasswordFieldErrors {
  email?: string;
}

export interface ForgotPasswordFormProps {
  initialEmail?: string;

  showHeading?: boolean;

  onRequested?: (
    result: PasswordRecoveryRequestedResult,
  ) => void | Promise<void>;

  onRequestLogin?: () => void;

  className?: string;
}

const FORGOT_PASSWORD_COPY = {
  es: {
    title:
      "Recupera tu contraseña",

    description:
      "Ingresa el correo asociado a tu cuenta. Te enviaremos un código para continuar con el restablecimiento.",

    emailLabel:
      "Correo electrónico",

    emailPlaceholder:
      "correo@ejemplo.com",

    submit:
      "Enviar código",

    submitting:
      "Enviando código...",

    backToLogin:
      "Volver al inicio de sesión",

    securityNoticeTitle:
      "Protección de tu cuenta",

    securityNotice:
      "Por seguridad, mostraremos el mismo resultado exista o no una cuenta registrada con este correo.",

    requestSuccessTitle:
      "Revisa tu correo",

    requestSuccess:
      "Si existe una cuenta asociada, recibirás un código para restablecer tu contraseña.",

    emailRequired:
      "Debes ingresar tu correo electrónico.",

    emailInvalid:
      "Ingresa un correo electrónico válido.",

    rateLimit:
      "Se realizaron demasiadas solicitudes de recuperación.",

    retryAfter:
      "Podrás volver a intentarlo en",

    seconds:
      "segundos",

    minute:
      "minuto",

    minutes:
      "minutos",

    requestUnavailable:
      "No fue posible procesar la solicitud de recuperación.",

    networkError:
      "No fue posible conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.",

    unexpectedError:
      "Ocurrió un problema inesperado. Inténtalo nuevamente.",
  },

  en: {
    title:
      "Recover your password",

    description:
      "Enter the email address associated with your account. We will send you a code to continue resetting your password.",

    emailLabel:
      "Email address",

    emailPlaceholder:
      "email@example.com",

    submit:
      "Send code",

    submitting:
      "Sending code...",

    backToLogin:
      "Back to sign in",

    securityNoticeTitle:
      "Account protection",

    securityNotice:
      "For security reasons, the same result is shown whether or not an account exists for this email address.",

    requestSuccessTitle:
      "Check your email",

    requestSuccess:
      "If an associated account exists, you will receive a code to reset your password.",

    emailRequired:
      "You must enter your email address.",

    emailInvalid:
      "Enter a valid email address.",

    rateLimit:
      "Too many password recovery requests were made.",

    retryAfter:
      "You can try again in",

    seconds:
      "seconds",

    minute:
      "minute",

    minutes:
      "minutes",

    requestUnavailable:
      "The password recovery request could not be processed.",

    networkError:
      "The server could not be reached. Check your connection and try again.",

    unexpectedError:
      "An unexpected problem occurred. Please try again.",
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

function getFirstFieldError(
  fieldErrors:
    | Record<
        string,
        string[]
      >
    | undefined,
  fieldName:
    string,
): string | undefined {
  const error =
    fieldErrors
      ?.[fieldName]
      ?.[0];

  return typeof error ===
    "string"
    ? error
    : undefined;
}

function formatRetryTime(
  seconds:
    number,
  copy:
    | typeof FORGOT_PASSWORD_COPY.es
    | typeof FORGOT_PASSWORD_COPY.en,
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

export function ForgotPasswordForm({
  initialEmail = "",

  showHeading = true,

  onRequested,
  onRequestLogin,

  className = "",
}: ForgotPasswordFormProps) {
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
    FORGOT_PASSWORD_COPY[
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
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState<ForgotPasswordFieldErrors>(
      {},
    );

  const [
    generalError,
    setGeneralError,
  ] =
    useState<string | null>(
      null,
    );

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState<string | null>(
      null,
    );

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
        ForgotPasswordFieldErrors =
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

      setFieldErrors(
        nextErrors,
      );

      return (
        Object.keys(
          nextErrors,
        ).length === 0
      );
    };

  const storePasswordRecovery =
    (
      result:
        PasswordRecoveryRequestedResult,
    ): void => {
      try {
        sessionStorage.setItem(
          "fixora.passwordRecovery",
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

            verified:
              false,

            storedAt:
              Date.now(),
          }),
        );
      } catch {
        /*
         * El flujo continuará aunque
         * sessionStorage esté bloqueado.
         */
      }
    };

  const handleLoginRequest =
    (): void => {
      setGeneralError(
        null,
      );

      setSuccessMessage(
        null,
      );

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
    ): Promise<void> => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      setGeneralError(
        null,
      );

      setSuccessMessage(
        null,
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
            "/api/auth/recuperar-password",
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

                  preferredLanguage:
                    currentLanguage,
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
            | ApiResponse<ForgotPasswordApiData>
            | null;

        const apiCode =
          normalizeApiCode(
            payload?.code ??
              payload
                ?.data
                ?.status,
          );

        if (response.ok) {
          const recoveryResult:
            PasswordRecoveryRequestedResult =
            {
              email:
                payload
                  ?.data
                  ?.email ??
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

          storePasswordRecovery(
            recoveryResult,
          );

          setSuccessMessage(
            copy.requestSuccess,
          );

          if (onRequested) {
            await onRequested(
              recoveryResult,
            );

            return;
          }

          const searchParams =
            new URLSearchParams({
              step:
                "verify",
            });

          router.push(
            `/recuperar-password?${searchParams.toString()}`,
          );

          return;
        }

        const emailFieldError =
          getFirstFieldError(
            payload
              ?.fieldErrors,
            "email",
          );

        if (
          emailFieldError
        ) {
          setFieldErrors({
            email:
              emailFieldError,
          });
        }

        if (
          response.status ===
            429 ||
          apiCode.includes(
            "RATE_LIMIT",
          ) ||
          apiCode.includes(
            "TOO_MANY_REQUESTS",
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
              copy.rateLimit,
            )}${retryMessage}`,
          );

          return;
        }

        setGeneralError(
          getApiMessage(
            payload,
            currentLanguage,
            copy.requestUnavailable,
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

      <AuthFieldMessage
        variant="info"
        title={
          copy.securityNoticeTitle
        }
      >
        {
          copy.securityNotice
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
            copy.requestSuccessTitle
          }
        >
          {successMessage}
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
        autoFocus
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
              {},
            );
          }

          setGeneralError(
            null,
          );

          setSuccessMessage(
            null,
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
            <path d="M22 2 11 13" />

            <path d="m22 2-7 20-4-9-9-4Z" />
          </svg>
        }
      >
        {copy.submit}
      </AuthSubmitButton>

      <button
        type="button"
        onClick={
          handleLoginRequest
        }
        disabled={
          isSubmitting
        }
        className="mx-auto text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-400 dark:hover:text-emerald-300"
      >
        {
          copy.backToLogin
        }
      </button>
    </form>
  );
}