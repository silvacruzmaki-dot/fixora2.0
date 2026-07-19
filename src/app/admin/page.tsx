"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useLanguage from "@/hooks/language/useLanguage";

interface AdministratorUser {
  id: string;

  firstName: string;
  lastName: string;
  displayName: string;

  email: string;

  avatarUrl:
    | string
    | null;

  role: string;
  status: string;

  preferredLanguage: string;
  preferredTheme: string;

  emailVerified: boolean;

  createdAt: string;
}

interface AdministratorSession {
  expiresAt: string;
  lastSeenAt: string;

  rememberMe: boolean;
}

interface AdministratorSessionData {
  authenticated: boolean;
  authorized: boolean;

  user?: AdministratorUser;
  session?: AdministratorSession;

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
}

interface AdministratorSessionResponse {
  response: Response;

  payload:
    ApiResponse<AdministratorSessionData>;
}

const ADMIN_COPY = {
  es: {
    pageTitle:
      "Panel administrativo",

    pageDescription:
      "Administra las cuentas, revisa el estado del sistema y controla las funciones internas de FIXORA.",

    loading:
      "Comprobando acceso administrativo...",

    loadError:
      "No fue posible cargar el panel administrativo.",

    retry:
      "Reintentar",

    administrator:
      "Administrador",

    account:
      "Cuenta administrativa",

    verifiedEmail:
      "Correo verificado",

    unverifiedEmail:
      "Correo pendiente de verificación",

    accountStatus:
      "Estado de la cuenta",

    active:
      "Activa",

    locked:
      "Bloqueada",

    disabled:
      "Desactivada",

    pending:
      "Pendiente",

    session:
      "Sesión administrativa",

    sessionExpires:
      "La sesión vence",

    lastActivity:
      "Última actividad",

    rememberedSession:
      "Sesión recordada",

    temporarySession:
      "Sesión temporal",

    quickActions:
      "Accesos rápidos",

    quickActionsDescription:
      "Utiliza estas opciones para administrar las principales áreas del sistema.",

    manageUsers:
      "Administrar usuarios",

    manageUsersDescription:
      "Consulta las cuentas registradas y administra sus permisos y estados.",

    viewProfile:
      "Ver mi perfil",

    viewProfileDescription:
      "Consulta y actualiza la información de tu cuenta administradora.",

    notifications:
      "Notificaciones",

    notificationsDescription:
      "Revisa alertas de seguridad y novedades importantes de FIXORA.",

    publicWebsite:
      "Ir al sitio público",

    publicWebsiteDescription:
      "Regresa a la página principal visible para los usuarios.",

    securityNotice:
      "Acceso protegido",

    securityNoticeDescription:
      "Las acciones realizadas desde este panel pueden registrarse en el historial de auditoría.",

    signOut:
      "Cerrar sesión",

    signingOut:
      "Cerrando sesión...",

    signOutError:
      "No fue posible cerrar la sesión correctamente.",

    sessionExpired:
      "La sesión administrativa venció.",

    insufficientPermissions:
      "Tu cuenta no tiene permisos administrativos.",

    createdAt:
      "Cuenta creada",

    role:
      "Rol",

    email:
      "Correo electrónico",

    unexpectedError:
      "Ocurrió un problema inesperado. Inténtalo nuevamente.",
  },

  en: {
    pageTitle:
      "Administrator dashboard",

    pageDescription:
      "Manage accounts, review system status, and control FIXORA internal functions.",

    loading:
      "Checking administrator access...",

    loadError:
      "The administrator dashboard could not be loaded.",

    retry:
      "Try again",

    administrator:
      "Administrator",

    account:
      "Administrator account",

    verifiedEmail:
      "Email verified",

    unverifiedEmail:
      "Email verification pending",

    accountStatus:
      "Account status",

    active:
      "Active",

    locked:
      "Locked",

    disabled:
      "Disabled",

    pending:
      "Pending",

    session:
      "Administrator session",

    sessionExpires:
      "Session expires",

    lastActivity:
      "Last activity",

    rememberedSession:
      "Remembered session",

    temporarySession:
      "Temporary session",

    quickActions:
      "Quick actions",

    quickActionsDescription:
      "Use these options to manage the main areas of the system.",

    manageUsers:
      "Manage users",

    manageUsersDescription:
      "Review registered accounts and manage their permissions and status.",

    viewProfile:
      "View my profile",

    viewProfileDescription:
      "Review and update your administrator account information.",

    notifications:
      "Notifications",

    notificationsDescription:
      "Review security alerts and important FIXORA updates.",

    publicWebsite:
      "Go to public website",

    publicWebsiteDescription:
      "Return to the main page visible to users.",

    securityNotice:
      "Protected access",

    securityNoticeDescription:
      "Actions performed from this dashboard may be recorded in the audit history.",

    signOut:
      "Sign out",

    signingOut:
      "Signing out...",

    signOutError:
      "The session could not be closed correctly.",

    sessionExpired:
      "The administrator session has expired.",

    insufficientPermissions:
      "Your account does not have administrator permissions.",

    createdAt:
      "Account created",

    role:
      "Role",

    email:
      "Email address",

    unexpectedError:
      "An unexpected problem occurred. Please try again.",
  },
} as const;

async function requestAdministratorSession(
  signal?: AbortSignal,
): Promise<AdministratorSessionResponse> {
  const response =
    await fetch(
      "/api/admin/auth/sesion",
      {
        method:
          "GET",

        credentials:
          "include",

        cache:
          "no-store",

        signal,

        headers: {
          Accept:
            "application/json",
        },
      },
    );

  const payload =
    (
      await response.json()
    ) as ApiResponse<
      AdministratorSessionData
    >;

  return {
    response,
    payload,
  };
}

function getApiMessage<TData>(
  response: ApiResponse<TData>,
  language:
    | "es"
    | "en",
  fallback: string,
): string {
  const localizedMessage =
    response.message?.[
      language
    ];

  if (
    typeof localizedMessage ===
      "string" &&
    localizedMessage
      .trim()
      .length >
      0
  ) {
    return localizedMessage;
  }

  return fallback;
}

function getInitials(
  user: Pick<
    AdministratorUser,
    | "firstName"
    | "lastName"
    | "displayName"
  >,
): string {
  const firstInitial =
    user.firstName
      .trim()
      .charAt(0);

  const lastInitial =
    user.lastName
      .trim()
      .charAt(0);

  const combinedInitials =
    `${firstInitial}${lastInitial}`
      .trim()
      .toUpperCase();

  if (
    combinedInitials
  ) {
    return combinedInitials;
  }

  return user.displayName
    .trim()
    .slice(
      0,
      2,
    )
    .toUpperCase();
}

export default function AdminDashboardPage() {
  const router =
    useRouter();

  const {
    language,
  } =
    useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language ===
    "en"
      ? "en"
      : "es";

  const copy =
    ADMIN_COPY[
      currentLanguage
    ];

  const [
    user,
    setUser,
  ] =
    useState<
      AdministratorUser
      | null
    >(
      null,
    );

  const [
    session,
    setSession,
  ] =
    useState<
      AdministratorSession
      | null
    >(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(
      true,
    );

  const [
    isSigningOut,
    setIsSigningOut,
  ] =
    useState(
      false,
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<
      string
      | null
    >(
      null,
    );

  const redirectToAdminLogin =
    useCallback(
      (): void => {
        router.replace(
          "/admin/iniciar-sesion",
        );
      },
      [
        router,
      ],
    );

  useEffect(
    () => {
      const controller =
        new AbortController();

      void requestAdministratorSession(
        controller.signal,
      )
        .then(
          ({
            response,
            payload,
          }) => {
            if (
              controller.signal
                .aborted
            ) {
              return;
            }

            if (
              response.status ===
              401
            ) {
              redirectToAdminLogin();

              return;
            }

            if (
              response.status ===
              403
            ) {
              router.replace(
                "/",
              );

              return;
            }

            if (
              !response.ok ||
              !payload.data
                ?.authenticated ||
              !payload.data
                .authorized ||
              !payload.data
                .user ||
              !payload.data
                .session
            ) {
              throw new Error(
                getApiMessage(
                  payload,
                  currentLanguage,
                  copy.loadError,
                ),
              );
            }

            setUser(
              payload.data.user,
            );

            setSession(
              payload.data.session,
            );

            setErrorMessage(
              null,
            );
          },
        )
        .catch(
          (
            error: unknown,
          ) => {
            if (
              controller.signal
                .aborted
            ) {
              return;
            }

            setErrorMessage(
              error instanceof
                Error
                ? error.message
                : copy.loadError,
            );
          },
        )
        .finally(
          () => {
            if (
              controller.signal
                .aborted
            ) {
              return;
            }

            setIsLoading(
              false,
            );
          },
        );

      return () => {
        controller.abort();
      };
    },
    [
      copy.loadError,
      currentLanguage,
      redirectToAdminLogin,
      router,
    ],
  );

  useEffect(
    () => {
      document.title =
        `FIXORA | ${copy.pageTitle}`;
    },
    [
      copy.pageTitle,
    ],
  );

  const retryAdministratorSession =
    useCallback(
      async (): Promise<void> => {
        setIsLoading(
          true,
        );

        setErrorMessage(
          null,
        );

        try {
          const {
            response,
            payload,
          } =
            await requestAdministratorSession();

          if (
            response.status ===
            401
          ) {
            redirectToAdminLogin();

            return;
          }

          if (
            response.status ===
            403
          ) {
            router.replace(
              "/",
            );

            return;
          }

          if (
            !response.ok ||
            !payload.data
              ?.authenticated ||
            !payload.data
              .authorized ||
            !payload.data
              .user ||
            !payload.data
              .session
          ) {
            throw new Error(
              getApiMessage(
                payload,
                currentLanguage,
                copy.loadError,
              ),
            );
          }

          setUser(
            payload.data.user,
          );

          setSession(
            payload.data.session,
          );

          setErrorMessage(
            null,
          );
        } catch (
          error: unknown
        ) {
          setErrorMessage(
            error instanceof
              Error
              ? error.message
              : copy.loadError,
          );
        } finally {
          setIsLoading(
            false,
          );
        }
      },
      [
        copy.loadError,
        currentLanguage,
        redirectToAdminLogin,
        router,
      ],
    );

  const initials =
    useMemo(
      () => {
        if (!user) {
          return "FX";
        }

        return getInitials(
          user,
        );
      },
      [
        user,
      ],
    );

  const formatDate =
    useCallback(
      (
        dateValue: string,
      ): string => {
        const date =
          new Date(
            dateValue,
          );

        if (
          Number.isNaN(
            date.getTime(),
          )
        ) {
          return dateValue;
        }

        return new Intl.DateTimeFormat(
          currentLanguage ===
            "en"
            ? "en-US"
            : "es-PE",
          {
            dateStyle:
              "medium",

            timeStyle:
              "short",
          },
        ).format(
          date,
        );
      },
      [
        currentLanguage,
      ],
    );

  const accountStatusLabel =
    useMemo(
      () => {
        switch (
          user?.status
        ) {
          case "ACTIVE":
            return copy.active;

          case "LOCKED":
            return copy.locked;

          case "DISABLED":
            return copy.disabled;

          default:
            return copy.pending;
        }
      },
      [
        copy.active,
        copy.disabled,
        copy.locked,
        copy.pending,
        user?.status,
      ],
    );

  const handleSignOut =
    async (): Promise<void> => {
      if (
        isSigningOut
      ) {
        return;
      }

      setIsSigningOut(
        true,
      );

      setErrorMessage(
        null,
      );

      try {
        const response =
          await fetch(
            "/api/auth/cerrar-sesion",
            {
              method:
                "POST",

              credentials:
                "include",

              headers: {
                Accept:
                  "application/json",
              },
            },
          );

        const payload =
          (
            await response.json()
          ) as ApiResponse<
            Record<
              string,
              never
            >
          >;

        if (
          !response.ok
        ) {
          throw new Error(
            getApiMessage(
              payload,
              currentLanguage,
              copy.signOutError,
            ),
          );
        }

        router.replace(
          "/admin/iniciar-sesion",
        );

        router.refresh();
      } catch (
        error: unknown
      ) {
        setErrorMessage(
          error instanceof
            Error
            ? error.message
            : copy.signOutError,
        );
      } finally {
        setIsSigningOut(
          false,
        );
      }
    };

  if (
    isLoading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-12">
        <div
          className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/90 px-6 py-4 shadow-lg backdrop-blur dark:border-white/10 dark:bg-zinc-900/90"
          aria-live="polite"
        >
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />

          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {
              copy.loading
            }
          </span>
        </div>
      </main>
    );
  }

  if (
    errorMessage &&
    (
      !user ||
      !session
    )
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-12">
        <section className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white p-7 text-center shadow-xl dark:bg-zinc-900">
          <h1 className="text-xl font-bold text-zinc-950 dark:text-white">
            {
              copy.loadError
            }
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {
              errorMessage
            }
          </p>

          <button
            type="button"
            onClick={
              () => {
                void retryAdministratorSession();
              }
            }
            className="mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
          >
            {
              copy.retry
            }
          </button>
        </section>
      </main>
    );
  }

  if (
    !user ||
    !session
  ) {
    return null;
  }

  const quickActions = [
    {
      href:
        "/admin/usuarios",

      title:
        copy.manageUsers,

      description:
        copy.manageUsersDescription,

      symbol:
        "👥",
    },

    {
      href:
        "/perfil",

      title:
        copy.viewProfile,

      description:
        copy.viewProfileDescription,

      symbol:
        "👤",
    },

    {
      href:
        "/notificaciones",

      title:
        copy.notifications,

      description:
        copy.notificationsDescription,

      symbol:
        "🔔",
    },

    {
      href:
        "/",

      title:
        copy.publicWebsite,

      description:
        copy.publicWebsiteDescription,

      symbol:
        "🌐",
    },
  ];

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="flex flex-col gap-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              FIXORA ADMIN
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              {
                copy.pageTitle
              }
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:text-base">
              {
                copy.pageDescription
              }
            </p>
          </div>

          <button
            type="button"
            onClick={
              () => {
                void handleSignOut();
              }
            }
            disabled={
              isSigningOut
            }
            className="min-h-12 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
          >
            {
              isSigningOut
                ? copy.signingOut
                : copy.signOut
            }
          </button>
        </header>

        {
          errorMessage
            ? (
                <div
                  className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300"
                  aria-live="polite"
                >
                  {
                    errorMessage
                  }
                </div>
              )
            : null
        }

        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-500/20 bg-emerald-600 text-3xl font-bold text-white shadow-lg">
                {
                  user.avatarUrl
                    ? (
                        <Image
                          src={
                            user.avatarUrl
                          }
                          alt={
                            user.displayName
                          }
                          fill
                          sizes="112px"
                          unoptimized
                          className="object-cover"
                        />
                      )
                    : (
                        <span>
                          {
                            initials
                          }
                        </span>
                      )
                }
              </div>

              <h2 className="mt-5 text-xl font-bold text-zinc-950 dark:text-white">
                {
                  user.displayName
                }
              </h2>

              <p className="mt-1 break-all text-sm text-zinc-500 dark:text-zinc-400">
                {
                  user.email
                }
              </p>

              <span className="mt-4 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {
                  copy.administrator
                }
              </span>

              <span
                className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${
                  user.emailVerified
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                }`}
              >
                {
                  user.emailVerified
                    ? copy.verifiedEmail
                    : copy.unverifiedEmail
                }
              </span>
            </div>

            <div className="mt-7 grid gap-4 border-t border-black/10 pt-6 dark:border-white/10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {
                    copy.email
                  }
                </p>

                <p className="mt-1 break-all text-sm font-medium text-zinc-900 dark:text-white">
                  {
                    user.email
                  }
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {
                    copy.role
                  }
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
                  {
                    copy.administrator
                  }
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {
                    copy.accountStatus
                  }
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
                  {
                    accountStatusLabel
                  }
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  {
                    copy.createdAt
                  }
                </p>

                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-white">
                  {
                    formatDate(
                      user.createdAt,
                    )
                  }
                </p>
              </div>
            </div>
          </aside>

          <div className="grid gap-6">
            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-8">
              <div>
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                  {
                    copy.session
                  }
                </h2>

                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  {
                    session.rememberMe
                      ? copy.rememberedSession
                      : copy.temporarySession
                  }
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-950">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {
                      copy.sessionExpires
                    }
                  </p>

                  <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">
                    {
                      formatDate(
                        session.expiresAt,
                      )
                    }
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-5 dark:bg-zinc-950">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    {
                      copy.lastActivity
                    }
                  </p>

                  <p className="mt-2 text-sm font-semibold text-zinc-950 dark:text-white">
                    {
                      formatDate(
                        session.lastSeenAt,
                      )
                    }
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 sm:p-8">
              <div>
                <h2 className="text-xl font-bold text-zinc-950 dark:text-white">
                  {
                    copy.quickActions
                  }
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {
                    copy.quickActionsDescription
                  }
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {
                  quickActions.map(
                    (
                      action,
                    ) => (
                      <Link
                        key={
                          action.href
                        }
                        href={
                          action.href
                        }
                        className="group rounded-2xl border border-black/10 bg-zinc-50 p-5 transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-lg dark:border-white/10 dark:bg-zinc-950"
                      >
                        <span className="text-2xl">
                          {
                            action.symbol
                          }
                        </span>

                        <h3 className="mt-4 text-base font-bold text-zinc-950 transition group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                          {
                            action.title
                          }
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                          {
                            action.description
                          }
                        </p>
                      </Link>
                    ),
                  )
                }
              </div>
            </section>

            <section className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xl">
                  🔐
                </div>

                <div>
                  <h2 className="text-base font-bold text-amber-900 dark:text-amber-200">
                    {
                      copy.securityNotice
                    }
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-300">
                    {
                      copy.securityNoticeDescription
                    }
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}