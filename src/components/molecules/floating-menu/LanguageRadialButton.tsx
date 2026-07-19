"use client";

import type { CSSProperties } from "react";

import RadialMenuTooltip from "@/components/atoms/floating-menu/RadialMenuTooltip";
import useLanguage from "@/hooks/language/useLanguage";

import type {
  LanguageRadialButtonProps,
  RadialMenuTooltipPlacement,
} from "@/types/floating-menu/floatingMenu.types";

export default function LanguageRadialButton({
  isOpen,
  angle,
  radius,
  index,
}: Readonly<LanguageRadialButtonProps>) {
  const {
    isSpanish,
    isEnglish,
    toggleLanguage,
    t,
  } = useLanguage();

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

  /*
   * Igual que el botón de tema:
   * muestra el idioma al que cambiará.
   *
   * Español actual → muestra EN.
   * Inglés actual → muestra ES.
   */
  const languageCode = isSpanish
    ? "EN"
    : "ES";

  const label = isSpanish
    ? t.floatingMenu.changeToEnglish
    : t.floatingMenu.changeToSpanish;

  const tooltipPlacement: RadialMenuTooltipPlacement =
    angle <= -45 ? "top" : "right";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isEnglish}
      disabled={!isOpen}
      onClick={toggleLanguage}
      style={buttonStyle}
      className={[
        "group",
        "absolute left-1/2 top-1/2",
        "z-10",
        "flex h-11 w-11",
        "items-center justify-center",
        "overflow-visible",
        "rounded-full",
        "border border-[#278b7d]",
        "bg-fixora-surface-solid",
        "text-[#176c62]",
        "shadow-fixora-soft",
        "cursor-pointer",
        "transition-[transform,opacity,background-color,color,border-color,box-shadow]",
        "duration-500",
        "ease-fixora-expand",

        "hover:z-[100]",
        "hover:bg-[#278b7d]",
        "hover:text-white",
        "hover:shadow-[0_0_24px_rgba(39,139,125,0.4)]",

        "focus-visible:z-[100]",
        "focus-visible:bg-[#278b7d]",
        "focus-visible:text-white",

        "active:scale-95",
        "sm:h-12 sm:w-12",

        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className={[
          "text-xs font-extrabold",
          "tracking-wide",
          "transition-transform",
          "duration-300 ease-out",
          "group-hover:scale-110",
          "group-focus-visible:scale-110",
        ].join(" ")}
      >
        {languageCode}
      </span>

      <RadialMenuTooltip
        label={label}
        placement={tooltipPlacement}
      />
    </button>
  );
}