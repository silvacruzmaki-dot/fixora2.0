"use client";

import { usePathname } from "next/navigation";

import ExpandableNavItem from "@/components/atoms/navbar/ExpandableNavItem";
import { navigationItems } from "@/constants/navbar/navigation";
import useLanguage from "@/hooks/language/useLanguage";

interface NavigationListProps {
  onNavigate?: () => void;
}

export default function NavigationList({
  onNavigate,
}: Readonly<NavigationListProps>) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isRouteActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <ul
      aria-label={t.navigation.mainOptions}
      className={[
        "flex items-center",
        "gap-1",
      ].join(" ")}
    >
      {navigationItems.map((item) => (
        <ExpandableNavItem
          key={item.href}
          label={t.navbar[item.translationKey]}
          href={item.href}
          icon={item.icon}
          isActive={isRouteActive(item.href)}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  );
}