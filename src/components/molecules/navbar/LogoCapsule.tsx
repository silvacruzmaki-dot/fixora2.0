"use client";

import Link from "next/link";

import FixoraLogo from "@/components/atoms/navbar/FixoraLogo";
import useLanguage from "@/hooks/language/useLanguage";

export default function LogoCapsule() {
  const { t } = useLanguage();

  return (
    <Link
      href="/"
      aria-label={`${t.navbar.home} FIXORA`}
      className={[
        "group",
        "flex h-16 w-16 shrink-0",
        "items-center justify-center",
        "overflow-hidden",
        "rounded-fixora-capsule",
        "border border-fixora-border",
        "bg-fixora-surface",
        "shadow-fixora-navbar",
        "backdrop-blur-xl",
        "transition-[background-color,border-color,transform,box-shadow]",
        "duration-300 ease-out",
        "hover:-translate-y-0.5",
        "hover:border-fixora-border-strong",
        "hover:bg-fixora-surface-solid",
        "hover:shadow-fixora-hover",
        "active:translate-y-0",
      ].join(" ")}
    >
      <span
        className={[
          "flex items-center justify-center",
          "transition-transform duration-300 ease-out",
          "group-hover:scale-105",
        ].join(" ")}
      >
        <FixoraLogo />
      </span>
    </Link>
  );
}