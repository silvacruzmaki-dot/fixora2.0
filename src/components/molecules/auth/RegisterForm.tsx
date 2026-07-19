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
import { PasswordStrengthMeter } from "@/components/atoms/auth/PasswordStrengthMeter";

import useLanguage from "@/hooks/language/useLanguage";

export interface RegisterSuccessResult {
  email: string;
  maskedEmail: string;

  verificationExpiresInSeconds: number;
  resendAvailableInSeconds: number;
}

interface RegisterApiData {
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

interface RegisterFieldErrors {
  firstName?: string;
  lastName?: string;
  displayName?: string;

  email?: string;

  password?: string;
  confirmPassword?: string;

  acceptTerms?: string;
  acceptPrivacy?: string;
}

export interface RegisterFormProps {
  initialEmail?: string;

  showHeading?: boolean;

  onRegistered?: (
    result: RegisterSuccessResult,
  ) => void | Promise<void>;

  onRequestLogin?: () => void;

  className?: string;
}

const REGISTER_COPY = {
  es: {
    title:
      "Crea tu cuenta",

    description:
      "Regístrate para administrar tu perfil, proyectos, servicios y notificaciones en FIXORA.",

    firstNameLabel:
      "Nombres",

    firstNamePlaceholder:
      "Ingresa tus nombres",

    lastNameLabel:
      "Apellidos",

    lastNamePlaceholder:
      "Ingresa tus apellidos",

    displayNameLabel:
      "Nombre visible",

    displayNamePlaceholder:
      "Nombre que verán los demás",

    displayNameHelper:
      "Puedes utilizar letras, números, espacios, puntos, guiones y guiones bajos.",

    emailLabel:
      "Correo electrónico",

    emailPlaceholder:
      "correo@ejemplo.com",

    passwordLabel:
      "Contraseña",

    passwordPlaceholder:
      "Crea una contraseña segura",

    confirmPasswordLabel:
      "Repite tu contraseña",

    confirmPasswordPlaceholder:
      "Ingresa nuevamente tu contraseña",

    acceptTerms:
      "Acepto los términos y condiciones de uso de FIXORA.",

    acceptPrivacy:
      "Acepto la política de privacidad y el tratamiento de mis datos.",

    submit:
      "Crear cuenta",

    submitting:
      "Creando cuenta...",

    alreadyHaveAccount:
      "¿Ya tienes una cuenta?",

    signIn:
      "Iniciar sesión",

    showPassword:
      "Mostrar contraseña",

    hidePassword:
      "Ocultar contraseña",

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

    firstNameRequired:
      "Debes ingresar tus nombres.",

    firstNameInvalid:
      "Los nombres contienen caracteres no permitidos.",

    firstNameLength:
      "Los nombres deben contener entre 2 y 80 caracteres.",

    lastNameRequired:
      "Debes ingresar tus apellidos.",

    lastNameInvalid:
      "Los apellidos contienen caracteres no permitidos.",

    lastNameLength:
      "Los apellidos deben contener entre 2 y 80 caracteres.",

    displayNameRequired:
      "Debes ingresar un nombre visible.",

    displayNameInvalid:
      "El nombre visible contiene caracteres no permitidos.",

    displayNameLength:
      "El nombre visible debe contener entre 3 y 40 caracteres.",

    emailRequired:
      "Debes ingresar tu correo electrónico.",

    emailInvalid:
      "Ingresa un correo electrónico válido.",

    passwordRequired:
      "Debes crear una contraseña.",

    passwordLength:
      "La contraseña debe contener entre 8 y 128 caracteres.",

    passwordRequirements:
      "La contraseña debe incluir mayúscula, minúscula, número y carácter especial.",

    confirmPasswordRequired:
      "Debes repetir tu contraseña.",

    passwordsDoNotMatch:
      "Las contraseñas no coinciden.",

    termsRequired:
      "Debes aceptar los términos y condiciones.",

    privacyRequired:
      "Debes aceptar la política de privacidad.",

    registrationUnavailable:
      "No fue posible completar el registro. Revisa los datos e inténtalo nuevamente.",

    rateLimit:
      "Se realizaron demasiados intentos de registro.",

    retryAfter:
      "Podrás volver a intentarlo en",

    seconds:
      "segundos",

    minute:
      "minuto",

    minutes:
      "minutos",

    networkError:
      "No fue posible conectar con el servidor. Revisa tu conexión e inténtalo nuevamente.",

    unexpectedError:
      "Ocurrió un problema inesperado. Inténtalo nuevamente.",
  },

  en: {
    title:
      "Create your account",

    description:
      "Register to manage your profile, projects, services, and notifications in FIXORA.",

    firstNameLabel:
      "First names",

    firstNamePlaceholder:
      "Enter your first names",

    lastNameLabel:
      "Last names",

    lastNamePlaceholder:
      "Enter your last names",

    displayNameLabel:
      "Display name",

    displayNamePlaceholder:
      "Name other users will see",

    displayNameHelper:
      "You may use letters, numbers, spaces, periods, hyphens, and underscores.",

    emailLabel:
      "Email address",

    emailPlaceholder:
      "email@example.com",

    passwordLabel:
      "Password",

    passwordPlaceholder:
      "Create a secure password",

    confirmPasswordLabel:
      "Repeat your password",

    confirmPasswordPlaceholder:
      "Enter your password again",

    acceptTerms:
      "I accept the FIXORA terms and conditions of use.",

    acceptPrivacy:
      "I accept the privacy policy and the processing of my data.",

    submit:
      "Create account",

    submitting:
      "Creating account...",

    alreadyHaveAccount:
      "Already have an account?",

    signIn:
      "Sign in",

    showPassword:
      "Show password",

    hidePassword:
      "Hide password",

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

    firstNameRequired:
      "You must enter your first names.",

    firstNameInvalid:
      "The first names contain unsupported characters.",

    firstNameLength:
      "The first names must contain between 2 and 80 characters.",

    lastNameRequired:
      "You must enter your last names.",

    lastNameInvalid:
      "The last names contain unsupported characters.",

    lastNameLength:
      "The last names must contain between 2 and 80 characters.",

    displayNameRequired:
      "You must enter a display name.",

    displayNameInvalid:
      "The display name contains unsupported characters.",

    displayNameLength:
      "The display name must contain between 3 and 40 characters.",

    emailRequired:
      "You must enter your email address.",

    emailInvalid:
      "Enter a valid email address.",

    passwordRequired:
      "You must create a password.",

    passwordLength:
      "The password must contain between 8 and 128 characters.",

    passwordRequirements:
      "The password must include an uppercase letter, lowercase letter, number, and special character.",

    confirmPasswordRequired:
      "You must repeat your password.",

    passwordsDoNotMatch:
      "The passwords do not match.",

    termsRequired:
      "You must accept the terms and conditions.",

    privacyRequired:
      "You must accept the privacy policy.",

    registrationUnavailable:
      "The registration could not be completed. Review the information and try again.",

    rateLimit:
      "Too many registration attempts were made.",

    retryAfter:
      "You can try again in",

    seconds:
      "seconds",

    minute:
      "minute",

    minutes:
      "minutes",

    networkError:
      "The server could not be reached. Check your connection and try again.",

    unexpectedError:
      "An unexpected problem occurred. Please try again.",
  },
} as const;

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PERSON_NAME_PATTERN =
  /^[\p{L}\p{M}' -]+$/u;

const DISPLAY_NAME_PATTERN =
  /^[\p{L}\p{M}\d._ -]+$/u;

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
      .replaceAll(" ", "_") ?? ""
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
  fieldName: string,
): string | undefined {
  const error =
    fieldErrors?.[fieldName]?.[0];

  return typeof error === "string"
    ? error
    : undefined;
}

function formatRetryTime(
  seconds: number,
  copy:
    | typeof REGISTER_COPY.es
    | typeof REGISTER_COPY.en,
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

export function RegisterForm({
  initialEmail = "",

  showHeading = true,

  onRegistered,
  onRequestLogin,

  className = "",
}: RegisterFormProps) {
  const router = useRouter();

  const { language } = useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    REGISTER_COPY[currentLanguage];

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [displayName, setDisplayName] =
    useState("");

  const [email, setEmail] =
    useState(
      initialEmail
        .trim()
        .toLowerCase(),
    );

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    acceptTerms,
    setAcceptTerms,
  ] = useState(false);

  const [
    acceptPrivacy,
    setAcceptPrivacy,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [
    generalError,
    setGeneralError,
  ] = useState<string | null>(null);

  const [
    fieldErrors,
    setFieldErrors,
  ] = useState<RegisterFieldErrors>({});

  const normalizedValues =
    useMemo(
      () => ({
        firstName:
          firstName.trim(),

        lastName:
          lastName.trim(),

        displayName:
          displayName.trim(),

        email:
          email
            .trim()
            .toLowerCase(),
      }),
      [
        displayName,
        email,
        firstName,
        lastName,
      ],
    );

  const clearFieldError = (
    fieldName:
      keyof RegisterFieldErrors,
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
        RegisterFieldErrors = {};

      if (
        !normalizedValues.firstName
      ) {
        nextErrors.firstName =
          copy.firstNameRequired;
      } else if (
        normalizedValues.firstName
          .length < 2 ||
        normalizedValues.firstName
          .length > 80
      ) {
        nextErrors.firstName =
          copy.firstNameLength;
      } else if (
        !PERSON_NAME_PATTERN.test(
          normalizedValues.firstName,
        )
      ) {
        nextErrors.firstName =
          copy.firstNameInvalid;
      }

      if (
        !normalizedValues.lastName
      ) {
        nextErrors.lastName =
          copy.lastNameRequired;
      } else if (
        normalizedValues.lastName
          .length < 2 ||
        normalizedValues.lastName
          .length > 80
      ) {
        nextErrors.lastName =
          copy.lastNameLength;
      } else if (
        !PERSON_NAME_PATTERN.test(
          normalizedValues.lastName,
        )
      ) {
        nextErrors.lastName =
          copy.lastNameInvalid;
      }

      if (
        !normalizedValues.displayName
      ) {
        nextErrors.displayName =
          copy.displayNameRequired;
      } else if (
        normalizedValues.displayName
          .length < 3 ||
        normalizedValues.displayName
          .length > 40
      ) {
        nextErrors.displayName =
          copy.displayNameLength;
      } else if (
        !DISPLAY_NAME_PATTERN.test(
          normalizedValues.displayName,
        )
      ) {
        nextErrors.displayName =
          copy.displayNameInvalid;
      }

      if (
        !normalizedValues.email
      ) {
        nextErrors.email =
          copy.emailRequired;
      } else if (
        normalizedValues.email
          .length > 254 ||
        !EMAIL_PATTERN.test(
          normalizedValues.email,
        )
      ) {
        nextErrors.email =
          copy.emailInvalid;
      }

      if (!password) {
        nextErrors.password =
          copy.passwordRequired;
      } else if (
        password.length < 8 ||
        password.length > 128
      ) {
        nextErrors.password =
          copy.passwordLength;
      } else if (
        !hasStrongPasswordRequirements(
          password,
        )
      ) {
        nextErrors.password =
          copy.passwordRequirements;
      }

      if (!confirmPassword) {
        nextErrors.confirmPassword =
          copy.confirmPasswordRequired;
      } else if (
        confirmPassword !==
        password
      ) {
        nextErrors.confirmPassword =
          copy.passwordsDoNotMatch;
      }

      if (!acceptTerms) {
        nextErrors.acceptTerms =
          copy.termsRequired;
      }

      if (!acceptPrivacy) {
        nextErrors.acceptPrivacy =
          copy.privacyRequired;
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

  const storePendingVerification =
    (
      result:
        RegisterSuccessResult,
    ) => {
      try {
        sessionStorage.setItem(
          "fixora.pendingVerification",
          JSON.stringify({
            email:
              result.email,

            maskedEmail:
              result.maskedEmail,

            verificationExpiresInSeconds:
              result.verificationExpiresInSeconds,

            resendAvailableInSeconds:
              result.resendAvailableInSeconds,

            storedAt:
              Date.now(),
          }),
        );
      } catch {
        /*
         * La navegación continuará aunque
         * sessionStorage no esté disponible.
         */
      }
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
      event: FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      setGeneralError(null);

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch(
          "/api/auth/registrar",
          {
            method: "POST",

            credentials:
              "include",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify({
              firstName:
                normalizedValues.firstName,

              lastName:
                normalizedValues.lastName,

              displayName:
                normalizedValues.displayName,

              email:
                normalizedValues.email,

              password,

              confirmPassword,

              acceptTerms,
              acceptPrivacy,

              preferredLanguage:
                currentLanguage,
            }),
          },
        );

        const payload =
          (await response
            .json()
            .catch(
              () => null,
            )) as
            | ApiResponse<RegisterApiData>
            | null;

        if (
          response.ok &&
          payload?.data
        ) {
          const registeredResult:
            RegisterSuccessResult = {
              email:
                payload.data.email ??
                normalizedValues.email,

              maskedEmail:
                payload.data
                  .maskedEmail ??
                normalizedValues.email,

              verificationExpiresInSeconds:
                payload.data
                  .verificationExpiresInSeconds ??
                600,

              resendAvailableInSeconds:
                payload.data
                  .resendAvailableInSeconds ??
                60,
            };

          storePendingVerification(
            registeredResult,
          );

          await onRegistered?.(
            registeredResult,
          );

          router.push(
            "/verificar-correo",
          );

          return;
        }

        const serverFieldErrors:
          RegisterFieldErrors = {
          firstName:
            getFirstFieldError(
              payload?.fieldErrors,
              "firstName",
            ),

          lastName:
            getFirstFieldError(
              payload?.fieldErrors,
              "lastName",
            ),

          displayName:
            getFirstFieldError(
              payload?.fieldErrors,
              "displayName",
            ),

          email:
            getFirstFieldError(
              payload?.fieldErrors,
              "email",
            ),

          password:
            getFirstFieldError(
              payload?.fieldErrors,
              "password",
            ),

          confirmPassword:
            getFirstFieldError(
              payload?.fieldErrors,
              "confirmPassword",
            ),

          acceptTerms:
            getFirstFieldError(
              payload?.fieldErrors,
              "acceptTerms",
            ),

          acceptPrivacy:
            getFirstFieldError(
              payload?.fieldErrors,
              "acceptPrivacy",
            ),
        };

        const hasServerFieldErrors =
          Object.values(
            serverFieldErrors,
          ).some(Boolean);

        if (hasServerFieldErrors) {
          setFieldErrors(
            serverFieldErrors,
          );
        }

        const apiCode =
          normalizeApiCode(
            payload?.code ??
              payload?.data
                ?.status,
          );

        if (
          response.status === 429 ||
          apiCode.includes(
            "RATE_LIMIT",
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

          setGeneralError(
            `${getApiMessage(
              payload,
              currentLanguage,
              copy.rateLimit,
            )}${retryMessage}`,
          );

          return;
        }

        if (
          response.status === 409 ||
          apiCode.includes(
            "EMAIL_ALREADY",
          ) ||
          apiCode.includes(
            "ALREADY_REGISTERED",
          )
        ) {
          setGeneralError(
            copy.registrationUnavailable,
          );

          return;
        }

        setGeneralError(
          getApiMessage(
            payload,
            currentLanguage,
            copy.registrationUnavailable,
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

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`grid w-full gap-5 ${className}`}
    >
      {showHeading ? (
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
            {copy.title}
          </h1>

          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {copy.description}
          </p>
        </header>
      ) : null}

      {generalError ? (
        <AuthFieldMessage variant="error">
          {generalError}
        </AuthFieldMessage>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <AuthInput
          label={
            copy.firstNameLabel
          }
          name="firstName"
          type="text"
          value={firstName}
          placeholder={
            copy.firstNamePlaceholder
          }
          autoComplete="given-name"
          maxLength={80}
          required
          disabled={isSubmitting}
          errorMessage={
            fieldErrors.firstName
          }
          onChange={(event) => {
            setFirstName(
              event.target.value,
            );

            clearFieldError(
              "firstName",
            );
          }}
        />

        <AuthInput
          label={
            copy.lastNameLabel
          }
          name="lastName"
          type="text"
          value={lastName}
          placeholder={
            copy.lastNamePlaceholder
          }
          autoComplete="family-name"
          maxLength={80}
          required
          disabled={isSubmitting}
          errorMessage={
            fieldErrors.lastName
          }
          onChange={(event) => {
            setLastName(
              event.target.value,
            );

            clearFieldError(
              "lastName",
            );
          }}
        />
      </div>

      <AuthInput
        label={
          copy.displayNameLabel
        }
        name="displayName"
        type="text"
        value={displayName}
        placeholder={
          copy.displayNamePlaceholder
        }
        helperText={
          copy.displayNameHelper
        }
        autoComplete="nickname"
        maxLength={40}
        required
        disabled={isSubmitting}
        errorMessage={
          fieldErrors.displayName
        }
        onChange={(event) => {
          setDisplayName(
            event.target.value,
          );

          clearFieldError(
            "displayName",
          );
        }}
      />

      <AuthInput
        label={copy.emailLabel}
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
        disabled={isSubmitting}
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
        onChange={(event) => {
          setEmail(
            event.target.value,
          );

          clearFieldError(
            "email",
          );
        }}
      />

      <div className="grid gap-3">
        <PasswordInput
          label={
            copy.passwordLabel
          }
          name="password"
          value={password}
          placeholder={
            copy.passwordPlaceholder
          }
          autoComplete="new-password"
          maxLength={128}
          required
          disabled={isSubmitting}
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
          onChange={(event) => {
            setPassword(
              event.target.value,
            );

            clearFieldError(
              "password",
            );

            if (
              fieldErrors.confirmPassword
            ) {
              clearFieldError(
                "confirmPassword",
              );
            }
          }}
        />

        <PasswordStrengthMeter
          password={password}
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
        value={confirmPassword}
        placeholder={
          copy.confirmPasswordPlaceholder
        }
        autoComplete="new-password"
        maxLength={128}
        required
        disabled={isSubmitting}
        errorMessage={
          fieldErrors.confirmPassword
        }
        showPasswordLabel={
          copy.showPassword
        }
        hidePasswordLabel={
          copy.hidePassword
        }
        onChange={(event) => {
          setConfirmPassword(
            event.target.value,
          );

          clearFieldError(
            "confirmPassword",
          );
        }}
      />

      <div className="grid gap-4">
        <AuthCheckbox
          name="acceptTerms"
          checked={acceptTerms}
          required
          disabled={isSubmitting}
          label={copy.acceptTerms}
          errorMessage={
            fieldErrors.acceptTerms
          }
          onChange={(event) => {
            setAcceptTerms(
              event.target.checked,
            );

            clearFieldError(
              "acceptTerms",
            );
          }}
        />

        <AuthCheckbox
          name="acceptPrivacy"
          checked={acceptPrivacy}
          required
          disabled={isSubmitting}
          label={copy.acceptPrivacy}
          errorMessage={
            fieldErrors.acceptPrivacy
          }
          onChange={(event) => {
            setAcceptPrivacy(
              event.target.checked,
            );

            clearFieldError(
              "acceptPrivacy",
            );
          }}
        />
      </div>

      <AuthSubmitButton
        isLoading={isSubmitting}
        loadingText={
          copy.submitting
        }
      >
        {copy.submit}
      </AuthSubmitButton>

      <div className="flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-zinc-600 dark:text-zinc-300">
        <span>
          {copy.alreadyHaveAccount}
        </span>

        <button
          type="button"
          onClick={
            handleLoginRequest
          }
          disabled={isSubmitting}
          className="font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {copy.signIn}
        </button>
      </div>
    </form>
  );
}