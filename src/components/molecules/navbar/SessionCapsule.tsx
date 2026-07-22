"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import { UserAvatar } from "@/components/atoms/navbar/UserAvatar";
import LoginButton from "@/components/atoms/navbar/LoginButton";

import { AuthenticatedSessionContent } from "@/components/molecules/navbar/AuthenticatedSessionContent";

import { useAuth } from "@/hooks/auth/useAuth";
import useLanguage from "@/hooks/language/useLanguage";
import useOutsideClick from "@/hooks/navbar/useOutsideClick";

const SESSION_MENU_ID =
  "fixora-authenticated-session-menu";

export default function SessionCapsule() {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false);

  const {
    user,
    isLoading,
    isAuthenticated,
    unreadNotificationCount,
    signOut,
  } = useAuth();

  const { language } =
    useLanguage();

  const closeMenu =
    useCallback(() => {
      setIsMenuOpen(false);
    }, []);

  useOutsideClick(
    containerRef,
    closeMenu,
    isMenuOpen,
  );

  /*
   * Mientras se comprueba la cookie de sesión,
   * no se muestra el botón de iniciar sesión.
   *
   * Así se evita que aparezca durante unos segundos
   * antes de cargar el usuario autenticado.
   */
  if (isLoading) {
    return (
      <div
        className={[
          "flex min-h-16 w-[190px] shrink-0",
          "items-center gap-3",
          "rounded-fixora-capsule",
          "border border-fixora-border",
          "bg-fixora-surface",
          "px-4 py-2",
          "shadow-fixora-navbar",
          "backdrop-blur-xl",
        ].join(" ")}
        aria-label={
          language === "en"
            ? "Checking session"
            : "Comprobando sesión"
        }
      >
        <span className="h-10 w-10 animate-pulse rounded-full bg-fixora-green-soft" />

        <span className="h-4 flex-1 animate-pulse rounded-full bg-fixora-border" />
      </div>
    );
  }

  /*
   * Solo aparece cuando realmente no existe
   * una sesión autenticada.
   */
  if (
    !isAuthenticated ||
    !user
  ) {
    return (
      <div
        className={[
          "flex min-h-16 shrink-0",
          "items-center justify-center",
          "rounded-fixora-capsule",
          "border border-fixora-border",
          "bg-fixora-surface",
          "p-2",
          "shadow-fixora-navbar",
          "backdrop-blur-xl",
          "transition-[background-color,border-color,box-shadow]",
          "duration-300 ease-out",
          "hover:border-fixora-border-strong",
        ].join(" ")}
      >
        <LoginButton />
      </div>
    );
  }

  const displayName =
    user.displayName?.trim() ||
    `${user.firstName} ${user.lastName}`.trim() ||
    user.email;

  const roleLabel =
    user.role === "ADMIN"
      ? language === "en"
        ? "Administrator"
        : "Administrador"
      : language === "en"
        ? "User"
        : "Usuario";

  const openMenuLabel =
    language === "en"
      ? "Open account menu"
      : "Abrir menú de la cuenta";

  const closeMenuLabel =
    language === "en"
      ? "Close account menu"
      : "Cerrar menú de la cuenta";

  const signOutError =
    language === "en"
      ? "The session could not be closed."
      : "No fue posible cerrar la sesión.";

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
    >
      <div
        className={[
          "flex min-h-16 shrink-0",
          "items-center justify-center",
          "rounded-fixora-capsule",
          "border border-fixora-border",
          "bg-fixora-surface",
          "p-2",
          "shadow-fixora-navbar",
          "backdrop-blur-xl",
          "transition-[background-color,border-color,box-shadow]",
          "duration-300 ease-out",
          "hover:border-fixora-border-strong",
        ].join(" ")}
      >
        <button
          type="button"
          aria-label={
            isMenuOpen
              ? closeMenuLabel
              : openMenuLabel
          }
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-controls={
            SESSION_MENU_ID
          }
          onClick={() => {
            setIsMenuOpen(
              (currentValue) =>
                !currentValue,
            );
          }}
          className={[
            "group flex min-h-12 items-center gap-3",
            "rounded-fixora-capsule px-3 py-1.5",
            "text-left",
            "transition-colors duration-200",
            "hover:bg-fixora-surface-hover",
            "focus:outline-none",
            "focus:ring-4 focus:ring-fixora-green-soft",
          ].join(" ")}
        >
          <UserAvatar
            firstName={
              user.firstName
            }
            lastName={
              user.lastName
            }
            displayName={
              displayName
            }
            avatarUrl={
              user.avatarUrl
            }
            size="md"
            showOnlineStatus
            isOnline
          />

          <span className="hidden min-w-0 xl:block">
            <span className="block max-w-36 truncate text-sm font-semibold text-fixora-text">
              {displayName}
            </span>

            <span className="mt-0.5 block text-xs text-fixora-text-secondary">
              {roleLabel}
            </span>
          </span>

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
            className={[
              "shrink-0 text-fixora-text-secondary",
              "transition-transform duration-200",
              isMenuOpen
                ? "rotate-180"
                : "rotate-0",
            ].join(" ")}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>

      {isMenuOpen ? (
        <div
          id={SESSION_MENU_ID}
          role="menu"
          className={[
            "absolute right-0 top-[calc(100%+12px)]",
            "z-[90] w-[350px]",
            "overflow-hidden rounded-3xl",
            "border border-fixora-border",
            "bg-fixora-surface-solid",
            "shadow-fixora-navbar",
            "backdrop-blur-xl",
          ].join(" ")}
        >
          <AuthenticatedSessionContent
            user={user}
            unreadNotificationCount={
              unreadNotificationCount
            }
            redirectAfterSignOut="/"
            onNavigate={
              closeMenu
            }
            onSignOut={
              async () => {
                const signedOut =
                  await signOut();

                if (!signedOut) {
                  throw new Error(
                    signOutError,
                  );
                }

                closeMenu();
              }
            }
          />
        </div>
      ) : null}
    </div>
  );
}