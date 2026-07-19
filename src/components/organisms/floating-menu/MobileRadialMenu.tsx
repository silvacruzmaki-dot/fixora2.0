"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import FloatingMenuButton from "@/components/atoms/floating-menu/FloatingMenuButton";
import FloatingMenuOverlay from "@/components/atoms/floating-menu/FloatingMenuOverlay";
import RadialMenuWheel from "@/components/molecules/floating-menu/RadialMenuWheel";

import useFloatingMenu from "@/hooks/floating-menu/useFloatingMenu";
import useRadialRotation from "@/hooks/floating-menu/useRadialRotation";
import useLanguage from "@/hooks/language/useLanguage";

import type { FloatingMenuItem } from "@/types/floating-menu/floatingMenu.types";

const MOBILE_MENU_RADIUS = 92;

export default function MobileRadialMenu() {
  const router = useRouter();

  const { t } = useLanguage();

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

  const handleItemAction = useCallback(
    (item: FloatingMenuItem): void => {
      if (item.href) {
        router.push(item.href);
        closeMenu();
        return;
      }

      if (item.action === "logout") {
        /*
         * Se conectará posteriormente
         * con el sistema de autenticación.
         */
        closeMenu();
      }
    },
    [closeMenu, router],
  );

  return (
    <>
      <FloatingMenuOverlay
        isVisible={isOpen}
        onClick={closeMenu}
      />

      <section
        aria-label={t.floatingMenu.quickSettings}
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
            radius={MOBILE_MENU_RADIUS}
            onAction={handleItemAction}
          />

          <FloatingMenuButton
            isOpen={isOpen}
            onToggle={toggleMenu}
          />
        </div>
      </section>
    </>
  );
}