"use client";

import { FiMoreVertical, FiX } from "react-icons/fi";

import useLanguage from "@/hooks/language/useLanguage";
import type { FloatingMenuButtonProps } from "@/types/floating-menu/floatingMenu.types";

export default function FloatingMenuButton({
  isOpen,
  onToggle,
}: Readonly<FloatingMenuButtonProps>) {
  const { t } = useLanguage();

  const Icon = isOpen
    ? FiX
    : FiMoreVertical;

  const buttonLabel = isOpen
    ? t.floatingMenu.closeMenu
    : t.floatingMenu.openMenu;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={buttonLabel}
      aria-expanded={isOpen}
      aria-controls="fixora-radial-menu"
      className={[
        "group",
        "relative z-20",
        "flex h-14 w-14",
        "items-center justify-center",
        "rounded-full",
        "border border-fixora-border",
        "bg-fixora-green-strong",
        "text-white",
        "shadow-fixora-active",
        "cursor-pointer",
        "transition-[background-color,transform,box-shadow,border-color]",
        "duration-300 ease-out",
        "hover:-translate-y-0.5",
        "hover:scale-105",
        "hover:border-fixora-green",
        "hover:bg-fixora-green-hover",
        "hover:shadow-fixora-hover",
        "active:translate-y-0",
        "active:scale-95",
        "sm:h-16 sm:w-16",
      ].join(" ")}
    >
      <Icon
        aria-hidden="true"
        size={25}
        className={[
          "text-white",
          "transition-[transform,opacity]",
          "duration-300 ease-out",
          isOpen
            ? "rotate-0 scale-100"
            : "rotate-0 scale-100",
        ].join(" ")}
      />

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none",
          "absolute inset-0 -z-10",
          "rounded-full",
          "bg-fixora-green",
          "opacity-20 blur-lg",
          "transition-opacity duration-300",
          "group-hover:opacity-30",
        ].join(" ")}
      />
    </button>
  );
}