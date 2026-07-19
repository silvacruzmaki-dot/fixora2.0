"use client";

import useLanguage from "@/hooks/language/useLanguage";
import type { MobileOverlayProps } from "@/types/navbar/navigation.types";

export default function MobileOverlay({
  isVisible,
  onClick,
}: Readonly<MobileOverlayProps>) {
  const { t } = useLanguage();

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={t.mobileNavigation.closeMenu}
      onClick={onClick}
      className={[
        "fixed inset-0 z-40",
        "h-full w-full",
        "cursor-default",
        "bg-black/30",
        "backdrop-blur-[2px]",
        "transition-opacity duration-300 ease-out",
        "md:hidden",
      ].join(" ")}
    />
  );
}