import {
  FiBell,
  FiLogOut,
  FiSettings,
  FiUser,
} from "react-icons/fi";

import type { FloatingMenuItem } from "@/types/floating-menu/floatingMenu.types";

export const floatingMenuItems: FloatingMenuItem[] = [
  {
    id: "settings",
    translationKey: "settings",
    icon: FiSettings,
    accent: "charcoal",
    href: "/ajustes",
    requiresAuth: false,
  },
  {
    id: "notifications",
    translationKey: "notifications",
    icon: FiBell,
    accent: "amber",
    href: "/notificaciones",
    requiresAuth: true,
  },
  {
    id: "profile",
    translationKey: "profile",
    icon: FiUser,
    accent: "green",
    href: "/perfil",
    requiresAuth: true,
  },
  {
    id: "logout",
    translationKey: "logout",
    icon: FiLogOut,
    accent: "red",
    action: "logout",
    requiresAuth: true,
  },
];