"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiLogIn } from "react-icons/fi";

import NavigationIcon from "@/components/atoms/navbar/NavigationIcon";
import { navigationItems } from "@/constants/navbar/navigation";
import type { MobileNavigationPanelProps } from "@/types/navbar/navigation.types";

export default function MobileNavigationPanel({
  isOpen,
  onClose,
}: Readonly<MobileNavigationPanelProps>) {
  const pathname = usePathname();

  const isRouteActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <nav
      id="fixora-mobile-navigation"
      aria-label="Navegación móvil"
      className={[
        // Posición: empieza arriba y crece hacia abajo
        "fixed right-4 top-20 z-50",

        // Ancho compacto
        "w-[46vw] min-w-[150px] max-w-[210px]",

        // Un poco más largo que la mitad de la pantalla
        "h-[64dvh] max-h-[620px]",

        // Scroll interno
        "overflow-y-auto overscroll-contain",

        "rounded-[20px]",
        "border border-fixora-border",
        "bg-fixora-surface-solid",
        "p-2",
        "shadow-fixora-navbar",
        "md:hidden",
      ].join(" ")}
    >
      <ul className="flex flex-col gap-0.5">
        {navigationItems.map((item) => {
          const isActive = isRouteActive(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex min-h-10 w-full",
                  "items-center gap-2",
                  "rounded-[14px]",
                  "px-2.5 py-1.5",
                  "text-xs font-semibold",
                  "transition-[background-color,color,transform,box-shadow]",
                  "duration-300 ease-out",

                  isActive
                    ? [
                        "bg-fixora-active-background",
                        "text-fixora-active-text",
                        "shadow-fixora-active",
                      ].join(" ")
                    : [
                        "text-fixora-text-secondary",
                        "hover:translate-x-0.5",
                        "hover:bg-fixora-surface-hover",
                        "hover:text-fixora-text",
                      ].join(" "),
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-8 w-8 shrink-0",
                    "items-center justify-center",
                    "rounded-full",

                    isActive
                      ? "bg-fixora-green text-white"
                      : "bg-fixora-green-soft text-fixora-green-strong",
                  ].join(" ")}
                >
                  <NavigationIcon
                    icon={item.icon}
                    size={16}
                    className={
                      isActive ? "text-white" : "text-current"
                    }
                  />
                </span>

                <span className="truncate leading-none">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="my-2 h-px bg-fixora-border" />

      <Link
        href="/iniciar-sesion"
        onClick={onClose}
        className={[
          "flex min-h-10 w-full",
          "items-center justify-center gap-1.5",
          "rounded-[14px]",
          "bg-fixora-green-strong",
          "px-2.5 py-1.5",
          "text-xs font-semibold text-white",
          "shadow-fixora-soft",
          "transition-[background-color,transform,box-shadow]",
          "duration-300 ease-out",
          "hover:-translate-y-0.5",
          "hover:bg-fixora-green-hover",
          "hover:shadow-fixora-hover",
          "active:translate-y-0",
        ].join(" ")}
      >
        <NavigationIcon
          icon={FiLogIn}
          size={16}
          className="text-white"
        />

        <span className="whitespace-nowrap text-white">
          Iniciar sesión
        </span>
      </Link>
    </nav>
  );
}