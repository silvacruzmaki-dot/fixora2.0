"use client";

import { FiMenu, FiX } from "react-icons/fi";

import type { MobileMenuButtonProps } from "@/types/navbar/navigation.types";

export default function MobileMenuButton({
  isOpen,
  onToggle,
}: Readonly<MobileMenuButtonProps>) {
  const Icon = isOpen ? FiX : FiMenu;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
      aria-expanded={isOpen}
      aria-controls="fixora-mobile-navigation"
      className={[
        "group",
        "flex h-12 w-12 shrink-0",
        "items-center justify-center",
        "rounded-fixora-capsule",
        "border border-fixora-border",
        "bg-fixora-surface-solid",
        "text-fixora-text",
        "shadow-fixora-soft",
        "cursor-pointer",
        "transition-[background-color,color,border-color,transform,box-shadow]",
        "duration-300 ease-out",
        "hover:-translate-y-0.5",
        "hover:border-fixora-border-strong",
        "hover:bg-fixora-surface-hover",
        "hover:text-fixora-green-strong",
        "hover:shadow-fixora-hover",
        "active:translate-y-0",
      ].join(" ")}
    >
      <Icon
        aria-hidden="true"
        size={23}
        className={[
          "transition-transform duration-300",
          isOpen
            ? "rotate-0 scale-100"
            : "rotate-0 scale-100 group-hover:scale-105",
        ].join(" ")}
      />
    </button>
  );
}