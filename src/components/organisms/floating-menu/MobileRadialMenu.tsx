"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import FloatingMenuButton from "@/components/atoms/floating-menu/FloatingMenuButton";
import FloatingMenuOverlay from "@/components/atoms/floating-menu/FloatingMenuOverlay";
import RadialMenuWheel from "@/components/molecules/floating-menu/RadialMenuWheel";

import {
  AUTH_DEFAULT_REDIRECTS,
} from "@/constants/auth/auth.routes";

import { useAuth } from "@/hooks/auth/useAuth";
import useFloatingMenu from "@/hooks/floating-menu/useFloatingMenu";
import useRadialRotation from "@/hooks/floating-menu/useRadialRotation";
import useLanguage from "@/hooks/language/useLanguage";

import type { FloatingMenuItem } from "@/types/floating-menu/floatingMenu.types";

const MOBILE_MENU_RADIUS = 92;

export default function MobileRadialMenu() {
  const router = useRouter();
  const pathname = usePathname();

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
    handleTouchStart,
    handleTouchMove,
  } = useRadialRotation();

  /*
   * Actualiza la sesión al abrir el menú.
   * Funciona tanto para usuarios como administradores.
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

        const wasAdministrator =
          isAdministrator;

        setIsSigningOut(true);
        closeMenu();

        try {
          const signedOut =
            await signOut();

          if (!signedOut) {
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
    <>
      <FloatingMenuOverlay
        isVisible={isOpen}
        onClick={closeMenu}
      />

      <section
        aria-label={
          t.floatingMenu
            .quickSettings
        }
        onTouchStart={
          isOpen
            ? handleTouchStart
            : undefined
        }
        onTouchMove={
          isOpen
            ? handleTouchMove
            : undefined
        }
        className={[
          "fixed bottom-5 left-5 z-[80]",
          "block md:hidden",
          "touch-none",
        ].join(" ")}
      >
        <div
          className={[
            "relative",
            "flex h-14 w-14",
            "items-center justify-center",
          ].join(" ")}
        >
          <RadialMenuWheel
            isOpen={isOpen}
            rotation={rotation}
            radius={
              MOBILE_MENU_RADIUS
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
    </>
  );
}