"use client";

import type { CSSProperties } from "react";

import RadialMenuTooltip from "@/components/atoms/floating-menu/RadialMenuTooltip";

import type {
  FloatingMenuAccent,
  RadialMenuItemProps,
  RadialMenuTooltipPlacement,
} from "@/types/floating-menu/floatingMenu.types";

const accentClasses: Record<FloatingMenuAccent, string> = {
  green: [
    "border-[#4caf2f]",
    "bg-fixora-surface-solid",
    "text-[#28691d]",
    "hover:bg-[#28691d]",
    "hover:text-white",
    "hover:shadow-[0_0_24px_rgba(76,175,47,0.38)]",
  ].join(" "),

  lime: [
    "border-[#78a936]",
    "bg-fixora-surface-solid",
    "text-[#5c8427]",
    "hover:bg-[#78a936]",
    "hover:text-white",
    "hover:shadow-[0_0_24px_rgba(120,169,54,0.38)]",
  ].join(" "),

  teal: [
    "border-[#278b7d]",
    "bg-fixora-surface-solid",
    "text-[#176c62]",
    "hover:bg-[#278b7d]",
    "hover:text-white",
    "hover:shadow-[0_0_24px_rgba(39,139,125,0.38)]",
  ].join(" "),

  charcoal: [
    "border-[#3e4842]",
    "bg-fixora-surface-solid",
    "text-[#29312c]",
    "hover:bg-[#29312c]",
    "hover:text-white",
    "hover:shadow-[0_0_24px_rgba(41,49,44,0.32)]",
  ].join(" "),

  amber: [
    "border-[#c28a2c]",
    "bg-fixora-surface-solid",
    "text-[#9a671a]",
    "hover:bg-[#b7791f]",
    "hover:text-white",
    "hover:shadow-[0_0_24px_rgba(194,138,44,0.4)]",
  ].join(" "),

  red: [
    "border-[#c64a4a]",
    "bg-fixora-surface-solid",
    "text-[#a83232]",
    "hover:bg-[#b83d3d]",
    "hover:text-white",
    "hover:shadow-[0_0_24px_rgba(198,74,74,0.4)]",
  ].join(" "),
};

export default function RadialMenuItem({
  item,
  isOpen,
  angle,
  radius,
  index,
  onAction,
}: Readonly<RadialMenuItemProps>) {
  const angleInRadians = (angle * Math.PI) / 180;

  const horizontalPosition =
    Math.cos(angleInRadians) * radius;

  const verticalPosition =
    Math.sin(angleInRadians) * radius;

  const transform = isOpen
    ? [
        "translate(-50%, -50%)",
        `translate(${horizontalPosition}px, ${verticalPosition}px)`,
        "scale(1)",
      ].join(" ")
    : [
        "translate(-50%, -50%)",
        "translate(0px, 0px)",
        "scale(0.35)",
      ].join(" ");

  const itemStyle: CSSProperties = {
    transform,
    transitionDelay: isOpen
      ? `${index * 65}ms`
      : `${Math.max(0, 240 - index * 35)}ms`,
  };

  /*
   * Los iconos ubicados en la parte superior
   * muestran el mensaje arriba.
   *
   * Los iconos ubicados hacia la derecha
   * muestran el mensaje al costado.
   */
  const tooltipPlacement: RadialMenuTooltipPlacement =
    angle <= -45 ? "top" : "right";

  const Icon = item.icon;

  return (
    <button
      type="button"
      aria-label={item.label}
      onClick={() => onAction(item)}
      disabled={!isOpen}
      style={itemStyle}
      className={[
        "group",
        "absolute left-1/2 top-1/2",
        "z-10",
        "flex h-11 w-11",
        "items-center justify-center",
        "overflow-visible",
        "rounded-full",
        "border",
        "shadow-fixora-soft",
        "cursor-pointer",
        "transition-[transform,opacity,background-color,color,border-color,box-shadow]",
        "duration-500",
        "ease-fixora-expand",

        /*
         * El botón y su tooltip suben por encima
         * de los demás elementos durante hover o foco.
         */
        "hover:z-[100]",
        "focus-visible:z-[100]",

        "active:scale-95",
        "sm:h-12 sm:w-12",

        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",

        accentClasses[item.accent],
      ].join(" ")}
    >
      <Icon
        aria-hidden="true"
        size={19}
        className={[
          "shrink-0",
          "transition-transform",
          "duration-300 ease-out",
          "group-hover:scale-110",
          "group-focus-visible:scale-110",
        ].join(" ")}
      />

      <RadialMenuTooltip
        label={item.label}
        placement={tooltipPlacement}
      />
    </button>
  );
}