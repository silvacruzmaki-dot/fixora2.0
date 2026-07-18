"use client";

import MobileMenuButton from "@/components/atoms/navbar/MobileMenuButton";
import MobileOverlay from "@/components/atoms/navbar/MobileOverlay";
import LogoCapsule from "@/components/molecules/navbar/LogoCapsule";
import MobileNavigationPanel from "@/components/molecules/navbar/MobileNavigationPanel";
import useMobileMenu from "@/hooks/navbar/useMobileMenu";

export default function MobileNavbar() {
  const {
    isOpen,
    closeMenu,
    toggleMenu,
  } = useMobileMenu();

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-[60]",
          "px-4 pt-4",
          "md:hidden",
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto flex w-full max-w-xl",
            "items-center justify-between",
          ].join(" ")}
        >
          <LogoCapsule />

          <MobileMenuButton
            isOpen={isOpen}
            onToggle={toggleMenu}
          />
        </div>
      </header>

      <MobileOverlay
        isVisible={isOpen}
        onClick={closeMenu}
      />

      <MobileNavigationPanel
        isOpen={isOpen}
        onClose={closeMenu}
      />
    </>
  );
}