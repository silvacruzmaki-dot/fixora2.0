"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useState,
  type ReactNode,
} from "react";

import { UserAvatar } from "@/components/atoms/navbar/UserAvatar";

import useLanguage from "@/hooks/language/useLanguage";

export interface AuthenticatedNavbarUser {
  id?: string;

  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;

  email?: string | null;
  avatarUrl?: string | null;

  role?: string | null;
}

export interface AuthenticatedSessionContentProps {
  user: AuthenticatedNavbarUser;

  unreadNotificationCount?: number;

  compact?: boolean;
  showSettings?: boolean;
  showAdminAccess?: boolean;

  isSigningOut?: boolean;

  redirectAfterSignOut?: string;

  onNavigate?: () => void;

  onSignOut?: () =>
    | void
    | Promise<void>;

  className?: string;
}

const AUTHENTICATED_SESSION_COPY = {
  es: {
    userRole:
      "Usuario",

    adminRole:
      "Administrador",

    account:
      "Mi cuenta",

    profile:
      "Mi perfil",

    profileDescription:
      "Consulta y actualiza tu información personal.",

    notifications:
      "Notificaciones",

    notificationsDescription:
      "Revisa alertas y novedades pendientes.",

    settings:
      "Ajustes",

    settingsDescription:
      "Administra el idioma, tema y preferencias.",

    adminPanel:
      "Panel administrativo",

    adminPanelDescription:
      "Gestiona usuarios y funciones internas.",

    signOut:
      "Cerrar sesión",

    signingOut:
      "Cerrando sesión...",

    signOutError:
      "No fue posible cerrar la sesión correctamente.",

    unread:
      "notificaciones sin leer",

    secureSession:
      "Tu sesión está protegida.",

    unknownUser:
      "Usuario FIXORA",
  },

  en: {
    userRole:
      "User",

    adminRole:
      "Administrator",

    account:
      "My account",

    profile:
      "My profile",

    profileDescription:
      "Review and update your personal information.",

    notifications:
      "Notifications",

    notificationsDescription:
      "Review pending alerts and updates.",

    settings:
      "Settings",

    settingsDescription:
      "Manage language, theme, and preferences.",

    adminPanel:
      "Administrator dashboard",

    adminPanelDescription:
      "Manage users and internal functions.",

    signOut:
      "Sign out",

    signingOut:
      "Signing out...",

    signOutError:
      "The session could not be closed correctly.",

    unread:
      "unread notifications",

    secureSession:
      "Your session is protected.",

    unknownUser:
      "FIXORA user",
  },
} as const;

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

      <path d="M10 21h4" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
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
        r="3"
      />

      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3 4 6v5c0 5.2 3.4 8.8 8 10 4.6-1.2 8-4.8 8-10V6l-8-3Z" />

      <path d="M9 12h6" />

      <path d="M12 9v6" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

      <path d="m16 17 5-5-5-5" />

      <path d="M21 12H9" />
    </svg>
  );
}

function SecurityIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
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

interface SessionNavigationItemProps {
  href: string;

  title: string;
  description?: string;

  icon: ReactNode;

  badge?: number;

  compact: boolean;

  onNavigate?: () => void;
}

function SessionNavigationItem({
  href,

  title,
  description,

  icon,

  badge,

  compact,

  onNavigate,
}: SessionNavigationItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "group flex items-center gap-3 rounded-xl border border-transparent",
        "px-3 py-3 text-left transition",
        "hover:border-emerald-500/20 hover:bg-emerald-500/10",
        "focus:outline-none focus:ring-4 focus:ring-emerald-500/15",
      ].join(" ")}
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition group-hover:bg-emerald-600 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-200">
        {icon}

        {typeof badge === "number" &&
        badge > 0 ? (
          <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white dark:ring-zinc-900">
            {badge > 99
              ? "99+"
              : badge}
          </span>
        ) : null}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-zinc-950 dark:text-white">
          {title}
        </span>

        {!compact &&
        description ? (
          <span className="mt-0.5 block text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            {description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function getSafeSignOutRedirect(
  redirectAfterSignOut?: string,
): string {
  if (
    redirectAfterSignOut &&
    redirectAfterSignOut.startsWith("/") &&
    !redirectAfterSignOut.startsWith("//") &&
    !redirectAfterSignOut.startsWith(
      "/admin",
    )
  ) {
    return redirectAfterSignOut;
  }

  return "/";
}

export function AuthenticatedSessionContent({
  user,

  unreadNotificationCount = 0,

  compact = false,
  showSettings = true,
  showAdminAccess = true,

  isSigningOut:
    controlledIsSigningOut,

  redirectAfterSignOut = "/",

  onNavigate,
  onSignOut,

  className = "",
}: AuthenticatedSessionContentProps) {
  const router =
    useRouter();

  const { language } =
    useLanguage();

  const currentLanguage:
    | "es"
    | "en" =
    language === "en"
      ? "en"
      : "es";

  const copy =
    AUTHENTICATED_SESSION_COPY[
      currentLanguage
    ];

  const [
    internalIsSigningOut,
    setInternalIsSigningOut,
  ] = useState(false);

  const [
    signOutError,
    setSignOutError,
  ] = useState<string | null>(
    null,
  );

  const isSigningOut =
    controlledIsSigningOut ??
    internalIsSigningOut;

  const fullName =
    [
      user.firstName,
      user.lastName,
    ]
      .filter(
        (
          value,
        ): value is string =>
          typeof value ===
            "string" &&
          value.trim().length >
            0,
      )
      .map(
        (
          value,
        ) =>
          value.trim(),
      )
      .join(" ");

  const resolvedDisplayName =
    user.displayName?.trim() ||
    fullName ||
    copy.unknownUser;

  const normalizedRole =
    user.role
      ?.trim()
      .toUpperCase() ??
    "USER";

  const isAdministrator =
    normalizedRole ===
    "ADMIN";

  const roleLabel =
    isAdministrator
      ? copy.adminRole
      : copy.userRole;

  const normalizedUnreadCount =
    Number.isFinite(
      unreadNotificationCount,
    )
      ? unreadNotificationCount
      : 0;

  const safeUnreadCount =
    Math.max(
      0,
      Math.floor(
        normalizedUnreadCount,
      ),
    );

  const handleSignOut =
    async () => {
      if (isSigningOut) {
        return;
      }

      setSignOutError(
        null,
      );

      if (
        controlledIsSigningOut ===
        undefined
      ) {
        setInternalIsSigningOut(
          true,
        );
      }

      try {
        if (onSignOut) {
          await onSignOut();
        } else {
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

          if (!response.ok) {
            const payload =
              (await response
                .json()
                .catch(
                  () => null,
                )) as
                | {
                    message?: {
                      es?: string;
                      en?: string;
                    };
                  }
                | null;

            const serverMessage =
              payload?.message?.[
                currentLanguage
              ];

            throw new Error(
              typeof serverMessage ===
                "string" &&
              serverMessage
                .trim()
                .length > 0
                ? serverMessage
                : copy.signOutError,
            );
          }
        }

        onNavigate?.();

        router.replace(
          getSafeSignOutRedirect(
            redirectAfterSignOut,
          ),
        );

        router.refresh();
      } catch (
        error: unknown
      ) {
        setSignOutError(
          error instanceof Error &&
          error.message.trim()
            .length > 0
            ? error.message
            : copy.signOutError,
        );
      } finally {
        if (
          controlledIsSigningOut ===
          undefined
        ) {
          setInternalIsSigningOut(
            false,
          );
        }
      }
    };

  return (
    <section
      className={[
        "w-full",

        compact
          ? "p-3"
          : "p-4",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <header className="border-b border-black/10 pb-4 dark:border-white/10">
        <div className="flex items-center gap-3">
          <UserAvatar
            firstName={
              user.firstName
            }
            lastName={
              user.lastName
            }
            displayName={
              resolvedDisplayName
            }
            avatarUrl={
              user.avatarUrl
            }
            size={
              compact
                ? "md"
                : "lg"
            }
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">
              {resolvedDisplayName}
            </p>

            {user.email ? (
              <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>
            ) : null}

            <span className="mt-1.5 inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              {roleLabel}
            </span>
          </div>
        </div>
      </header>

      <nav
        className="mt-3 grid gap-1"
        aria-label={
          copy.account
        }
      >
        <SessionNavigationItem
          href="/perfil"
          title={
            copy.profile
          }
          description={
            copy.profileDescription
          }
          icon={
            <ProfileIcon />
          }
          compact={compact}
          onNavigate={
            onNavigate
          }
        />

        <SessionNavigationItem
          href="/notificaciones"
          title={
            copy.notifications
          }
          description={
            safeUnreadCount > 0
              ? `${safeUnreadCount} ${copy.unread}`
              : copy.notificationsDescription
          }
          icon={
            <NotificationIcon />
          }
          badge={
            safeUnreadCount
          }
          compact={compact}
          onNavigate={
            onNavigate
          }
        />

        {showSettings ? (
          <SessionNavigationItem
            href="/ajustes"
            title={
              copy.settings
            }
            description={
              copy.settingsDescription
            }
            icon={
              <SettingsIcon />
            }
            compact={compact}
            onNavigate={
              onNavigate
            }
          />
        ) : null}

        {showAdminAccess &&
        isAdministrator ? (
          <SessionNavigationItem
            href="/admin"
            title={
              copy.adminPanel
            }
            description={
              copy.adminPanelDescription
            }
            icon={
              <AdminIcon />
            }
            compact={compact}
            onNavigate={
              onNavigate
            }
          />
        ) : null}
      </nav>

      <div className="mt-3 border-t border-black/10 pt-3 dark:border-white/10">
        {signOutError ? (
          <p
            role="alert"
            className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-700 dark:text-red-300"
          >
            {signOutError}
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => {
            void handleSignOut();
          }}
          disabled={
            isSigningOut
          }
          className={[
            "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5",
            "text-left text-sm font-semibold text-red-600 transition",
            "hover:bg-red-500/10",
            "focus:outline-none focus:ring-4 focus:ring-red-500/15",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:text-red-400",
          ].join(" ")}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            {isSigningOut ? (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-red-500/30 border-t-red-600"
                aria-hidden="true"
              />
            ) : (
              <SignOutIcon />
            )}
          </span>

          <span>
            {isSigningOut
              ? copy.signingOut
              : copy.signOut}
          </span>
        </button>
      </div>

      {!compact ? (
        <div className="mt-3 flex items-center gap-2 border-t border-black/10 pt-3 text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-400">
          <span className="shrink-0 text-emerald-600 dark:text-emerald-400">
            <SecurityIcon />
          </span>

          <span>
            {copy.secureSession}
          </span>
        </div>
      ) : null}
    </section>
  );
}