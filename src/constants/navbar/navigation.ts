import {
  FiCpu,
  FiFolder,
  FiHome,
  FiMail,
  FiMonitor,
  FiPenTool,
  FiTool,
  FiUsers,
} from "react-icons/fi";

import type { NavigationItem } from "@/types/navbar/navigation.types";

export const navigationItems: NavigationItem[] = [
  {
    translationKey: "home",
    href: "/",
    icon: FiHome,
  },
  {
    translationKey: "design",
    href: "/diseno",
    icon: FiPenTool,
  },
  {
    translationKey: "projects",
    href: "/proyectos",
    icon: FiFolder,
  },
  {
    translationKey: "software",
    href: "/software",
    icon: FiMonitor,
  },
  {
    translationKey: "hardware",
    href: "/hardware",
    icon: FiCpu,
  },
  {
    translationKey: "services",
    href: "/servicios",
    icon: FiTool,
  },
  {
    translationKey: "about",
    href: "/nosotros",
    icon: FiUsers,
  },
  {
    translationKey: "contact",
    href: "/contacto",
    icon: FiMail,
  },
];