"use client";

import type { MobileOverlayProps } from "@/types/navbar/navigation.types";

export default function MobileOverlay({
  isVisible,
  onClick,
}: Readonly<MobileOverlayProps>) {
  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Cerrar menú de navegación"
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