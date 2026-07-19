"use client";

import type { CSSProperties } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import RadialMenuTooltip from "@/components/atoms/floating-menu/RadialMenuTooltip";
import useLanguage from "@/hooks/language/useLanguage";
import useTheme from "@/hooks/theme/useTheme";

import type {
  RadialMenuTooltipPlacement,
  ThemeRadialButtonProps,
} from "@/types/floating-menu/floatingMenu.types";

export default function ThemeRadialButton({
  isOpen,
  angle,
  radius,
  index,
}: Readonly<ThemeRadialButtonProps>) {
  const {
    isDark,
    toggleTheme,
  } = useTheme();

  const { t } = useLanguage();

  const angleInRadians =
    (angle * Math.PI) / 180;

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

  const buttonStyle: CSSProperties = {
    transform,
    transitionDelay: isOpen
      ? `${index * 65}ms`
      : `${Math.max(0, 240 - index * 35)}ms`,
  };

  const Icon = isDark
    ? FiSun
    : FiMoon;

  const label = isDark
    ? t.floatingMenu.lightMode
    : t.floatingMenu.darkMode;

  const tooltipPlacement: RadialMenuTooltipPlacement =
    angle <= -45 ? "top" : "right";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isDark}
      disabled={!isOpen}
      onClick={toggleTheme}
      style={buttonStyle}
      className={[
        "group",
        "absolute left-1/2 top-1/2",
        "z-10",
        "flex h-11 w-11",
        "items-center justify-center",
        "overflow-visible",
        "rounded-full",
        "border border-fixora-green",
        "bg-fixora-surface-solid",
        "text-fixora-green-strong",
        "shadow-fixora-soft",
        "cursor-pointer",
        "transition-[transform,opacity,background-color,color,border-color,box-shadow]",
        "duration-500",
        "ease-fixora-expand",

        "hover:z-[100]",
        "hover:bg-fixora-green-strong",
        "hover:text-white",
        "hover:shadow-[0_0_24px_rgba(76,175,47,0.4)]",

        "focus-visible:z-[100]",
        "focus-visible:bg-fixora-green-strong",
        "focus-visible:text-white",

        "active:scale-95",
        "sm:h-12 sm:w-12",

        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <Icon
        aria-hidden="true"
        size={19}
        className={[
          "shrink-0",
          "transition-[transform,color]",
          "duration-300 ease-out",
          "group-hover:rotate-12",
          "group-hover:scale-110",
          "group-focus-visible:rotate-12",
          "group-focus-visible:scale-110",
        ].join(" ")}
      />

      <RadialMenuTooltip
        label={label}
        placement={tooltipPlacement}
      />
    </button>
  );
}