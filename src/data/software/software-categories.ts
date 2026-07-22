import {
  FiBarChart2,
  FiBookOpen,
  FiCode,
  FiEdit3,
  FiFileText,
  FiShield,
} from "react-icons/fi";

import type { SoftwareCategory } from "@/types/software";

/* =========================================================
   CATEGORÍAS LOCALES DEL CATÁLOGO DE SOFTWARE
   ========================================================= */

export const softwareCategories: SoftwareCategory[] = [
  {
    id: "productivity",
    name: "Productividad",
    description:
      "Herramientas para documentos, oficina, colaboración y organización.",
    icon: FiFileText,
    accent: "green",
  },
  {
    id: "security",
    name: "Seguridad",
    description:
      "Antivirus, protección de dispositivos y soluciones de seguridad digital.",
    icon: FiShield,
    accent: "cyan",
  },
  {
    id: "design",
    name: "Diseño",
    description:
      "Programas para edición de imágenes, diseño gráfico y contenido creativo.",
    icon: FiEdit3,
    accent: "violet",
  },
  {
    id: "management",
    name: "Gestión",
    description:
      "Sistemas para administrar proyectos, procesos, ventas y empresas.",
    icon: FiBarChart2,
    accent: "blue",
  },
  {
    id: "education",
    name: "Educación",
    description:
      "Plataformas y herramientas digitales para estudiantes y docentes.",
    icon: FiBookOpen,
    accent: "lime",
  },
  {
    id: "development",
    name: "Desarrollo",
    description:
      "Entornos, herramientas y soluciones para programación y desarrollo web.",
    icon: FiCode,
    accent: "amber",
  },
];

/* =========================================================
   FUNCIÓN AUXILIAR PARA OBTENER UNA CATEGORÍA
   ========================================================= */

export function getSoftwareCategoryById(
  categoryId: SoftwareCategory["id"],
): SoftwareCategory | undefined {
  return softwareCategories.find(
    (category) => category.id === categoryId,
  );
}