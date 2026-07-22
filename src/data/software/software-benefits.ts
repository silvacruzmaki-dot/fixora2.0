import {
  FiHeadphones,
  FiLock,
  FiShield,
  FiZap,
} from "react-icons/fi";

import type { SoftwareBenefit } from "@/types/software";

/* =========================================================
   BENEFICIOS COMERCIALES DEL CATÁLOGO DE SOFTWARE
   ========================================================= */

export const softwareBenefits: SoftwareBenefit[] = [
  {
    id: "original-licenses",
    title: "Licencias originales",
    description: "Productos oficiales y completamente confiables.",
    icon: FiShield,
    accent: "green",
  },
  {
    id: "instant-activation",
    title: "Activación inmediata",
    description: "Recibe tu licencia digital de manera rápida.",
    icon: FiZap,
    accent: "lime",
  },
  {
    id: "specialized-support",
    title: "Soporte especializado",
    description: "Asesoría antes y después de realizar tu compra.",
    icon: FiHeadphones,
    accent: "cyan",
  },
  {
    id: "secure-purchase",
    title: "Compra segura",
    description: "Atención confiable y protección de tus datos.",
    icon: FiLock,
    accent: "amber",
  },
];

/* =========================================================
   FUNCIÓN AUXILIAR PARA OBTENER UN BENEFICIO
   ========================================================= */

export function getSoftwareBenefitById(
  benefitId: string,
): SoftwareBenefit | undefined {
  return softwareBenefits.find(
    (benefit) => benefit.id === benefitId,
  );
}