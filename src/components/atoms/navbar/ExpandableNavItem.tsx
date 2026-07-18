"use client";

import Link from "next/link";

import NavigationIcon from "@/components/atoms/navbar/NavigationIcon";
import type { ExpandableNavItemProps } from "@/types/navbar/navigation.types";

export default function ExpandableNavItem({
  label,
  href,
  icon,
  isActive,
  onNavigate,
}: Readonly<ExpandableNavItemProps>) {
  const itemStateClasses = isActive
    ? [
        "bg-fixora-green-strong",
        "text-white",
        "shadow-fixora-active",
        "hover:bg-fixora-green-hover",
        "hover:text-white",
      ].join(" ")
    : [
        "text-fixora-text-secondary",
        "hover:bg-fixora-surface-hover",
        "hover:text-fixora-text",
        "hover:shadow-fixora-hover",
      ].join(" ");

  return (
    <li className="shrink-0">
      <Link
        href={href}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
        onClick={onNavigate}
        className={[
          "group",
          "flex h-12 w-12 items-center",
          "overflow-hidden whitespace-nowrap",
          "rounded-fixora-capsule",
          "transition-[width,background-color,color,box-shadow]",
          "duration-500",
          "ease-fixora-expand",
          "hover:w-[148px]",
          "focus-visible:w-[148px]",
          itemStateClasses,
        ].join(" ")}
      >
        <span
          className={[
            "flex h-12 w-12 shrink-0",
            "items-center justify-center",
            isActive ? "text-white" : "text-current",
          ].join(" ")}
        >
          <NavigationIcon
            icon={icon}
            size={21}
            className={[
              "transition-[transform,color]",
              "duration-300",
              "group-hover:scale-105",
              isActive ? "text-white" : "text-current",
            ].join(" ")}
          />
        </span>

        <span
          className={[
            "max-w-0 overflow-hidden",
            "pr-0",
            "text-sm font-semibold",
            "opacity-0",
            "-translate-x-2",
            "transition-[max-width,opacity,transform,padding]",
            "duration-[900ms]",
            "ease-fixora-expand",

            "group-hover:delay-150",
            "group-hover:max-w-[96px]",
            "group-hover:pr-5",
            "group-hover:opacity-100",
            "group-hover:translate-x-0",

            "group-focus-visible:delay-150",
            "group-focus-visible:max-w-[96px]",
            "group-focus-visible:pr-5",
            "group-focus-visible:opacity-100",
            "group-focus-visible:translate-x-0",

            isActive ? "text-white" : "text-current",
          ].join(" ")}
        >
          {label}
        </span>
      </Link>
    </li>
  );
}