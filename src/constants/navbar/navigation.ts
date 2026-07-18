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
    label: "Inicio",
    href: "/",
    icon: FiHome,
  },
  {
    label: "Diseño",
    href: "/diseno",
    icon: FiPenTool,
  },
  {
    label: "Proyectos",
    href: "/proyectos",
    icon: FiFolder,
  },
  {
    label: "Software",
    href: "/software",
    icon: FiMonitor,
  },
  {
    label: "Hardware",
    href: "/hardware",
    icon: FiCpu,
  },
  {
    label: "Servicios",
    href: "/servicios",
    icon: FiTool,
  },
  {
    label: "Nosotros",
    href: "/nosotros",
    icon: FiUsers,
  },
  {
    label: "Contacto",
    href: "/contacto",
    icon: FiMail,
  },
];