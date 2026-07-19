"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { AuthCheckbox } from "@/components/atoms/auth/AuthCheckbox";
import { AuthFieldMessage } from "@/components/atoms/auth/AuthFieldMessage";
import { AuthInput } from "@/components/atoms/auth/AuthInput";
import { AuthSubmitButton } from "@/components/atoms/auth/AuthSubmitButton";
import { PasswordInput } from "@/components/atoms/auth/PasswordInput";

import useLanguage from "@/hooks/language/useLanguage";

interface AdministratorUser {
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

interface AdministratorSession {
  expiresAt: string;
  rememberMe: boolean;
}

export interface AdminLoginAuthenticatedResult {
  user: AdministratorUser;
  session: AdministratorSession;
}

interface AdminLoginApiData {
  status?: string;
  authenticated?: boolean;

  user?: AdministratorUser;
  session?: AdministratorSession;

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

interface AdminLoginFieldErrors {
  email?: string;
  password?: string;
}

export interface AdminLoginCardProps {
  initialEmail?: string;
  redirectTo?: string;

  onAuthenticated?: (
    result: AdminLoginAuthenticatedResult,
  ) => void | Promise<void>;

  className?: string;
}

const ADMIN_LOGIN_COPY = {
  es: {
    eyebrow:
      "Acceso restringido",

    panelTitle:
      "Administración segura de FIXORA",

    panelDescription:
      "Este acceso está reservado exclusivamente para cuentas con permisos administrativos.",

    authorizedAccounts:
      "Solo cuentas autorizadas",

    authorizedAccountsDescription:
      "El servidor comprobará el rol y el estado de la cuenta antes de conceder acceso.",

    auditLog:
      "Registro de actividad",

    auditLogDescription:
      "Los accesos y acciones administrativas pueden quedar registrados para fines de seguridad.",

    protectedSession:
      "Sesión protegida",

    protectedSessionDescription:
      "Las sesiones administrativas utilizan controles adicionales de validación y vencimiento.",

    warningTitle:
      "Uso exclusivo",

    warningDescription:
      "No compartas tus credenciales. Los intentos de acceso no autorizados pueden bloquear temporalmente la cuenta.",

    formEyebrow:
      "FIXORA ADMIN",

    title:
      "Iniciar sesión como administrador",

    description:
      "Ingresa tus credenciales administrativas para acceder al panel de control.",

    emailLabel:
      "Correo administrativo",

    emailPlaceholder:
      "administrador@fixora.com",

    passwordLabel:
      "Contraseña",

    passwordPlaceholder:
      "Ingresa tu contraseña",

    rememberMe:
      "Mantener abierta la sesión administrativa",

    submit:
      "Acceder al panel",

    submitting:
      "Verificando acceso...",

    showPassword:
      "Mostrar contraseña",

    hidePassword:
      "Ocultar contraseña",

    emailRequired:
      "Debes ingresar el correo administrativo.",

    emailInvalid:
      "Ingresa un correo electrónico válido.",

    passwordRequired:
      "Debes ingresar tu contraseña.",

    passwordTooLong:
      "La contraseña ingresada es demasiado extensa.",

    invalidCredentials:
      "El correo o la contraseña son incorrectos.",

    insufficientPermissions:
      "Esta cuenta no tiene permisos para acceder al panel administrativo.",

    accountLocked:
      "La cuenta está bloqueada temporalmente.",

    accountDisabled:
      "Esta cuenta se encuentra desactivada.",

    verificationRequired:
      "Debes verificar el correo de esta cuenta antes de ingresar.",

    verifyEmail:
      "Verificar correo",

    rateLimit:
      "Se realizaron demasiados intentos de acceso.",

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
      "No fue posible completar el acceso administrativo.",

    regularAccess:
      "¿No eres administrador?",

    userLogin:
      "Ir al acceso de usuarios",

    securityFooter:
      "El acceso se validará nuevamente en el servidor.",
  },

  en: {
    eyebrow:
      "Restricted access",

    panelTitle:
      "Secure FIXORA administration",

    panelDescription:
      "This access is reserved exclusively for accounts with administrator permissions.",

    authorizedAccounts:
      "Authorized accounts only",

    authorizedAccountsDescription:
      "The server will verify the account role and status before granting access.",

    auditLog:
      "Activity logging",

    auditLogDescription:
      "Administrator access and actions may be recorded for security purposes.",

    protectedSession:
      "Protected session",

    protectedSessionDescription:
      "Administrator sessions use additional validation and expiration controls.",

    warningTitle:
      "Exclusive use",

    warningDescription:
      "Do not share your credentials. Unauthorized access attempts may temporarily lock the account.",

    formEyebrow:
      "FIXORA ADMIN",

    title:
      "Sign in as administrator",

    description:
      "Enter your administrator credentials to access the control panel.",

    emailLabel:
      "Administrator email",

    emailPlaceholder:
      "administrator@fixora.com",

    passwordLabel:
      "Password",

    passwordPlaceholder:
      "Enter your password",

    rememberMe:
      "Keep the administrator session open",

    submit:
      "Access dashboard",

    submitting:
      "Verifying access...",

    showPassword:
      "Show password",

    hidePassword:
      "Hide password",

    emailRequired:
      "You must enter the administrator email address.",

    emailInvalid:
      "Enter a valid email address.",

    passwordRequired:
      "You must enter your password.",

    passwordTooLong:
      "The entered password is too long.",

    invalidCredentials:
      "The email address or password is incorrect.",

    insufficientPermissions:
      "This account does not have permission to access the administrator dashboard.",

    accountLocked:
      "The account is temporarily locked.",

    accountDisabled:
      "This account is disabled.",

    verificationRequired:
      "You must verify this account's email address before signing in.",

    verifyEmail:
      "Verify email",

    rateLimit:
      "Too many access attempts were made.",

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
      "Administrator access could not be completed.",

    regularAccess:
      "Not an administrator?",

    userLogin:
      "Go to user access",

    securityFooter:
      "Access will be validated again on the server.",
  },
} as const;

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailIcon() {
  return (
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
  );
}

function LockIcon() {
  return (
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
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v5c0 5.2 3.4 8.8 8 10 4.6-1.2 8-4.8 8-10V6l-8-3Z" />

      <path d="m8.5 12 2.2 2.2 4.8-4.8" />
    </svg>
  );
}

function AuditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3" />

      <rect
        x="9"
        y="3"
        width="6"
        height="4"
        rx="1"
      />

      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  );
}

function SessionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.7 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />

      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

interface SecurityItem {
  title: string;
  description: string;
  icon: ReactNode;
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
    | typeof ADMIN_LOGIN_COPY.es
    | typeof ADMIN_LOGIN_COPY.en,
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

function getSafeAdminRedirectPath(
  requestedPath?: string,
): string {
  if (
    requestedPath &&
    requestedPath.startsWith("/admin") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.startsWith(
      "/admin/iniciar-sesion",
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
      redirectPath.startsWith(
        "/admin",
      ) &&
      !redirectPath.startsWith(
        "//",
      ) &&
      !redirectPath.startsWith(
        "/admin/iniciar-sesion",
      )
    ) {
      return redirectPath;
    }
  }

  return "/admin";
}

export function AdminLoginCard({
  initialEmail = "",
  redirectTo,

  onAuthenticated,

  className = "",
}: AdminLoginCardProps) {
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
    ADMIN_LOGIN_COPY[
      currentLanguage
    ];

  const [email, setEmail] =
    useState(
      initialEmail
        .trim()
        .toLowerCase(),
    );

  const [password, setPassword] =
    useState("");

  const [rememberMe, setRememberMe] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [
    generalError,
    setGeneralError,
  ] = useState<string | null>(
    null,
  );

  const [
    fieldErrors,
    setFieldErrors,
  ] =
    useState<AdminLoginFieldErrors>(
      {},
    );

  const [
    verificationRequired,
    setVerificationRequired,
  ] = useState(false);

  const normalizedEmail =
    useMemo(
      () =>
        email
          .trim()
          .toLowerCase(),
      [email],
    );

  const securityItems =
    useMemo<SecurityItem[]>(
      () => [
        {
          title:
            copy.authorizedAccounts,

          description:
            copy.authorizedAccountsDescription,

          icon:
            <ShieldIcon />,
        },

        {
          title:
            copy.auditLog,

          description:
            copy.auditLogDescription,

          icon:
            <AuditIcon />,
        },

        {
          title:
            copy.protectedSession,

          description:
            copy.protectedSessionDescription,

          icon:
            <SessionIcon />,
        },
      ],
      [
        copy.auditLog,
        copy.auditLogDescription,
        copy.authorizedAccounts,
        copy.authorizedAccountsDescription,
        copy.protectedSession,
        copy.protectedSessionDescription,
      ],
    );

  const validateForm =
    (): boolean => {
      const nextErrors:
        AdminLoginFieldErrors = {};

      if (!normalizedEmail) {
        nextErrors.email =
          copy.emailRequired;
      } else if (
        normalizedEmail.length > 254 ||
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
        password.length > 256
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

  const storePendingVerification =
    (
      data: AdminLoginApiData,
    ) => {
      try {
        sessionStorage.setItem(
          "fixora.pendingVerification",
          JSON.stringify({
            email:
              normalizedEmail,

            maskedEmail:
              data.maskedEmail ??
              normalizedEmail,

            verificationExpiresInSeconds:
              data.verificationExpiresInSeconds ??
              600,

            resendAvailableInSeconds:
              data.resendAvailableInSeconds ??
              60,

            source:
              "admin-login",

            storedAt:
              Date.now(),
          }),
        );
      } catch {
        /*
         * La verificación podrá continuar aunque
         * sessionStorage esté deshabilitado.
         */
      }
    };

  const handleVerificationRequest =
    () => {
      router.push(
        "/verificar-correo",
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
      setVerificationRequired(false);

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch(
          "/api/admin/auth/iniciar-sesion",
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
              () => null,
            )) as
            | ApiResponse<AdminLoginApiData>
            | null;

        const apiCode =
          normalizeApiCode(
            payload?.code ??
              payload?.data
                ?.status,
          );

        if (
          response.ok &&
          payload?.data?.user &&
          payload.data.session
        ) {
          const authenticatedResult:
            AdminLoginAuthenticatedResult = {
              user:
                payload.data.user,

              session:
                payload.data.session,
            };

          await onAuthenticated?.(
            authenticatedResult,
          );

          router.replace(
            getSafeAdminRedirectPath(
              redirectTo,
            ),
          );

          router.refresh();

          return;
        }

        const emailFieldError =
          getFirstFieldError(
            payload?.fieldErrors,
            "email",
          );

        const passwordFieldError =
          getFirstFieldError(
            payload?.fieldErrors,
            "password",
          );

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
            "EMAIL_VERIFICATION_REQUIRED",
          ) ||
          apiCode.includes(
            "VERIFICATION_REQUIRED",
          )
        ) {
          storePendingVerification(
            payload?.data ?? {},
          );

          setVerificationRequired(
            true,
          );

          setGeneralError(
            getApiMessage(
              payload,
              currentLanguage,
              copy.verificationRequired,
            ),
          );

          return;
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
            "INSUFFICIENT_PERMISSIONS",
          )
        ) {
          setGeneralError(
            getApiMessage(
              payload,
              currentLanguage,
              copy.insufficientPermissions,
            ),
          );

          return;
        }

        if (
          response.status === 401 ||
          apiCode.includes(
            "INVALID_CREDENTIALS",
          ) ||
          apiCode.includes(
            "INVALID_ADMIN_CREDENTIALS",
          ) ||
          apiCode.includes(
            "ADMIN_AUTHENTICATION_FAILED",
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
          response.status === 429 ||
          apiCode.includes(
            "RATE_LIMIT",
          ) ||
          apiCode.includes(
            "TOO_MANY_REQUESTS",
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
          response.status === 403
        ) {
          setGeneralError(
            getApiMessage(
              payload,
              currentLanguage,
              copy.insufficientPermissions,
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
        setIsSubmitting(false);
      }
    };

  return (
    <section
      className={[
        "grid w-full max-w-5xl overflow-hidden rounded-[2rem]",
        "border border-black/10 bg-white shadow-2xl shadow-black/10",
        "dark:border-white/10 dark:bg-zinc-900 dark:shadow-black/30",
        "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <aside className="relative overflow-hidden bg-gradient-to-br from-zinc-950 via-emerald-950 to-teal-950 px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full border border-emerald-300/10" />

          <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full border border-emerald-300/10" />

          <div className="absolute right-10 top-1/3 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />

          <span className="absolute left-[14%] top-[18%] h-2 w-2 rounded-full bg-emerald-300/60 motion-safe:animate-pulse" />

          <span className="absolute bottom-[18%] right-[20%] h-2.5 w-2.5 rounded-full bg-white/50 motion-safe:animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200 shadow-xl backdrop-blur-sm">
            <ShieldIcon />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-200">
            {copy.eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {copy.panelTitle}
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
            {copy.panelDescription}
          </p>

          <div className="mt-8 grid gap-5">
            {securityItems.map(
              (item) => (
                <article
                  key={
                    item.title
                  }
                  className="flex gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-200">
                    {item.icon}
                  </span>

                  <div>
                    <h2 className="text-sm font-bold text-white">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-white/60 sm:text-sm">
                      {
                        item.description
                      }
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>

          <div className="mt-8 flex gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/10 p-4">
            <span className="mt-0.5 shrink-0 text-amber-200">
              <WarningIcon />
            </span>

            <div>
              <h2 className="text-sm font-bold text-amber-100">
                {copy.warningTitle}
              </h2>

              <p className="mt-1 text-xs leading-5 text-amber-100/65">
                {
                  copy.warningDescription
                }
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex items-center px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <form
          onSubmit={
            handleSubmit
          }
          noValidate
          className="mx-auto grid w-full max-w-md gap-5"
        >
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
              {copy.formEyebrow}
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
              {copy.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {copy.description}
            </p>
          </header>

          {generalError ? (
            <AuthFieldMessage
              variant="error"
            >
              <p>
                {generalError}
              </p>

              {verificationRequired ? (
                <button
                  type="button"
                  onClick={
                    handleVerificationRequest
                  }
                  className="mt-2 font-semibold underline underline-offset-4 transition hover:opacity-80"
                >
                  {copy.verifyEmail}
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
            autoComplete="username"
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
              <EmailIcon />
            }
            onChange={(event) => {
              setEmail(
                event.target.value,
              );

              setFieldErrors(
                (
                  currentErrors,
                ) => ({
                  ...currentErrors,
                  email:
                    undefined,
                }),
              );

              setGeneralError(
                null,
              );

              setVerificationRequired(
                false,
              );
            }}
          />

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
              <LockIcon />
            }
            onChange={(event) => {
              setPassword(
                event.target.value,
              );

              setFieldErrors(
                (
                  currentErrors,
                ) => ({
                  ...currentErrors,
                  password:
                    undefined,
                }),
              );

              setGeneralError(
                null,
              );

              setVerificationRequired(
                false,
              );
            }}
          />

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
            onChange={(event) => {
              setRememberMe(
                event.target.checked,
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
            trailingIcon={
              <ArrowIcon />
            }
          >
            {copy.submit}
          </AuthSubmitButton>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-zinc-600 dark:text-zinc-300">
            <span>
              {copy.regularAccess}
            </span>

            <Link
              href="/iniciar-sesion"
              className="font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              {copy.userLogin}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 border-t border-black/10 pt-5 text-center text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
            <span className="text-emerald-600 dark:text-emerald-400">
              <LockIcon />
            </span>

            <span>
              {copy.securityFooter}
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}