import type { Metadata } from "next";

import { SoftwareStore } from "@/components/organisms/software";

export const metadata: Metadata = {
  title: "Software | FIXORA",
  description:
    "Encuentra las mejores soluciones de software, licencias originales y herramientas digitales para empresas, profesionales y estudiantes.",
};

export default function SoftwarePage() {
  return <SoftwareStore />;
}