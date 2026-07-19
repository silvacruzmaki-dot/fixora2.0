"use client";

import useLanguage from "@/hooks/language/useLanguage";
import type { FloatingMenuOverlayProps } from "@/types/floating-menu/floatingMenu.types";

export default function FloatingMenuOverlay({
  isVisible,
  onClick,
}: Readonly<FloatingMenuOverlayProps>) {
  const { t } = useLanguage();

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={t.floatingMenu.closeMenu}
      onClick={onClick}
      className={[
        "fixed inset-0 z-[70]",
        "h-full w-full",
        "cursor-default",
        "border-0",
        "bg-black/10",
        "backdrop-blur-[1px]",
        "transition-opacity duration-300 ease-out",
        "md:hidden",
      ].join(" ")}
    />
  );
}