import type { Metadata } from "next";

import { AuthCard } from "@/components/organisms/auth/AuthCard";
import { AuthPageShell } from "@/components/organisms/auth/AuthPageShell";

export const metadata: Metadata = {
  title: "FIXORA | Registro / Sign up",

  description:
    "Crea tu cuenta FIXORA. Create your FIXORA account.",

  robots: {
    index: false,
    follow: false,
  },
};

/*
 * Esta página permanece como Server Component.
 *
 * El formulario, la validación, las animaciones,
 * el cambio de idioma y el cambio de tema estarán
 * dentro de los componentes de autenticación.
 */
export default function RegisterPage() {
  return (
    <AuthPageShell>
      <AuthCard initialMode="register" />
    </AuthPageShell>
  );
}