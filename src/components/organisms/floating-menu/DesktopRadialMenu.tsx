"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import FloatingMenuButton from "@/components/atoms/floating-menu/FloatingMenuButton";
import RadialMenuWheel from "@/components/molecules/floating-menu/RadialMenuWheel";

import {
  AUTH_DEFAULT_REDIRECTS,
} from "@/constants/auth/auth.routes";

import { useAuth } from "@/hooks/auth/useAuth";
import useFloatingMenu from "@/hooks/floating-menu/useFloatingMenu";
import useRadialRotation from "@/hooks/floating-menu/useRadialRotation";
import useLanguage from "@/hooks/language/useLanguage";
import useOutsideClick from "@/hooks/navbar/useOutsideClick";

import type { FloatingMenuItem } from "@/types/floating-menu/floatingMenu.types";

const DESKTOP_MENU_RADIUS = 106;

export default function DesktopRadialMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const menuRef =
    useRef<HTMLElement>(null);

  const [
    isSigningOut,
    setIsSigningOut,
  ] = useState(false);

  const {
    isAuthenticated,
    isAdministrator,
    refreshSession,
    signOut,
  } = useAuth();

  const { t } =
    useLanguage();

  const {
    isOpen,
    closeMenu,
    toggleMenu,
  } = useFloatingMenu();

  const {
    rotation,
    handleWheel,
  } = useRadialRotation();

  useOutsideClick(
    menuRef,
    closeMenu,
    isOpen,
  );

  /*
   * Comprueba nuevamente la sesión al abrir el menú.
   *
   * Esto es importante después de iniciar sesión,
   * porque el AuthProvider permanece montado durante
   * la navegación de Next.js.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    void refreshSession({
      silent: true,
    });
  }, [
    isOpen,
    pathname,
    refreshSession,
  ]);

  const handleSignOut =
    useCallback(
      async (): Promise<void> => {
        if (
          isSigningOut ||
          !isAuthenticated
        ) {
          closeMenu();
          return;
        }

        /*
         * Se guarda antes de cerrar sesión porque
         * signOut limpia el usuario del contexto.
         */
        const wasAdministrator =
          isAdministrator;

        setIsSigningOut(true);
        closeMenu();

        try {
          const signedOut =
            await signOut();

          if (!signedOut) {
            /*
             * Si ocurrió un error, se vuelve a comprobar
             * si la cookie todavía representa una sesión.
             */
            await refreshSession({
              silent: true,
            });

            return;
          }

          const redirectPath =
            wasAdministrator
              ? AUTH_DEFAULT_REDIRECTS
                  .AFTER_ADMIN_LOGOUT
              : AUTH_DEFAULT_REDIRECTS
                  .AFTER_USER_LOGOUT;

          router.replace(
            redirectPath,
          );

          router.refresh();
        } finally {
          setIsSigningOut(
            false,
          );
        }
      },
      [
        closeMenu,
        isAdministrator,
        isAuthenticated,
        isSigningOut,
        refreshSession,
        router,
        signOut,
      ],
    );

  const handleItemAction =
    useCallback(
      (
        item: FloatingMenuItem,
      ): void => {
        /*
         * Protección adicional para impedir
         * abrir opciones privadas sin sesión.
         */
        if (
          item.requiresAuth &&
          !isAuthenticated
        ) {
          closeMenu();
          return;
        }

        if (
          item.action ===
          "logout"
        ) {
          void handleSignOut();
          return;
        }

        if (item.href) {
          router.push(
            item.href,
          );

          closeMenu();
        }
      },
      [
        closeMenu,
        handleSignOut,
        isAuthenticated,
        router,
      ],
    );

  return (
    <section
      ref={menuRef}
      aria-label={
        t.floatingMenu
          .quickSettings
      }
      onWheel={
        isOpen
          ? handleWheel
          : undefined
      }
      className={[
        "fixed bottom-7 left-7 z-[80]",
        "hidden md:block",
        "touch-none",
      ].join(" ")}
    >
      <div
        className={[
          "relative",
          "flex h-16 w-16",
          "items-center justify-center",
        ].join(" ")}
      >
        <RadialMenuWheel
          isOpen={isOpen}
          rotation={rotation}
          radius={
            DESKTOP_MENU_RADIUS
          }
          onAction={
            handleItemAction
          }
        />

        <FloatingMenuButton
          isOpen={isOpen}
          onToggle={
            toggleMenu
          }
        />
      </div>
    </section>
  );
}