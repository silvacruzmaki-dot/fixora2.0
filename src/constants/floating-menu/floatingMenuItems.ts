import {
  FiBell,
  FiGlobe,
  FiLogOut,
  FiSettings,
  FiUser,
} from "react-icons/fi";

import type { FloatingMenuItem } from "@/types/floating-menu/floatingMenu.types";

export const floatingMenuItems: FloatingMenuItem[] = [
  {
    id: "language",
    label: "Idioma",
    icon: FiGlobe,
    accent: "teal",
    action: "change-language",
    requiresAuth: false,
  },
  {
    id: "settings",
    label: "Ajustes",
    icon: FiSettings,
    accent: "charcoal",
    href: "/ajustes",
    requiresAuth: false,
  },
  {
    id: "notifications",
    label: "Notificaciones",
    icon: FiBell,
    accent: "amber",
    href: "/notificaciones",
    requiresAuth: true,
  },
  {
    id: "profile",
    label: "Perfil",
    icon: FiUser,
    accent: "green",
    href: "/perfil",
    requiresAuth: true,
  },
  {
    id: "logout",
    label: "Cerrar sesión",
    icon: FiLogOut,
    accent: "red",
    action: "logout",
    requiresAuth: true,
  },
];