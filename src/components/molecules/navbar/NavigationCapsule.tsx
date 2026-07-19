"use client";

import NavigationList from "@/components/molecules/navbar/NavigationList";
import useLanguage from "@/hooks/language/useLanguage";

export default function NavigationCapsule() {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t.navigation.primary}
      className={[
        "isolate",
        "flex min-h-16 w-fit shrink-0",
        "items-center justify-center",
        "overflow-visible",
        "rounded-fixora-capsule",
        "border border-fixora-border",
        "bg-fixora-surface",
        "p-2",
        "shadow-fixora-navbar",
        "backdrop-blur-xl",
        "transition-[background-color,border-color,box-shadow]",
        "duration-300 ease-out",
        "hover:border-fixora-border-strong",
      ].join(" ")}
    >
      <NavigationList />
    </nav>
  );
}