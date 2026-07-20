"use client";

import { usePathname } from "next/navigation";

import DesktopNavbar from "@/components/organisms/navbar/DesktopNavbar";
import MobileNavbar from "@/components/organisms/navbar/MobileNavbar";

const ROUTES_WITHOUT_NAVBAR = [
  "/iniciar-sesion",
  "/registrarse",
  "/recuperar-password",
  "/restablecer-password",
  "/verificar-correo",
  "/admin/iniciar-sesion",
] as const;

function shouldHideNavbar(
  pathname: string,
): boolean {
  return ROUTES_WITHOUT_NAVBAR.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(
        `${route}/`,
      ),
  );
}

export default function Navbar() {
  const pathname = usePathname();

  if (
    shouldHideNavbar(
      pathname,
    )
  ) {
    return null;
  }

  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  );
}