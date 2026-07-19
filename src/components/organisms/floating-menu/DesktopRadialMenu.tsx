"use client";

import {
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

import FloatingMenuButton from "@/components/atoms/floating-menu/FloatingMenuButton";
import RadialMenuWheel from "@/components/molecules/floating-menu/RadialMenuWheel";
import useFloatingMenu from "@/hooks/floating-menu/useFloatingMenu";
import useRadialRotation from "@/hooks/floating-menu/useRadialRotation";
import useLanguage from "@/hooks/language/useLanguage";
import useOutsideClick from "@/hooks/navbar/useOutsideClick";

import type { FloatingMenuItem } from "@/types/floating-menu/floatingMenu.types";

const DESKTOP_MENU_RADIUS = 106;

export default function DesktopRadialMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLElement>(null);

  const { t } = useLanguage();

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
    <section
      ref={menuRef}
      aria-label={t.floatingMenu.quickSettings}
      onWheel={
        isOpen ? handleWheel : undefined
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
          radius={DESKTOP_MENU_RADIUS}
          onAction={handleItemAction}
        />

        <FloatingMenuButton
          isOpen={isOpen}
          onToggle={toggleMenu}
        />
      </div>
    </section>
  );
}