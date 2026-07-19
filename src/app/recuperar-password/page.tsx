import type { Metadata } from "next";

import { AuthPageShell } from "@/components/organisms/auth/AuthPageShell";
import { PasswordRecoveryCard } from "@/components/organisms/auth/PasswordRecoveryCard";

export const metadata: Metadata = {
  title:
    "FIXORA | Recuperar contraseña / Recover password",

  description:
    "Solicita un código para recuperar el acceso a tu cuenta FIXORA. Request a code to recover access to your FIXORA account.",

  robots: {
    index: false,
    follow: false,
  },
};

/*
 * Esta página permanece como Server Component.
 *
 * PasswordRecoveryCard controlará:
 *
 * - El formulario para ingresar el correo.
 * - La solicitud del código de recuperación.
 * - La verificación del código de seis dígitos.
 * - El reenvío del código y la cuenta regresiva.
 * - La transición entre las etapas de recuperación.
 * - Los mensajes en español e inglés.
 */
export default function RecoverPasswordPage() {
  return (
    <AuthPageShell>
      <PasswordRecoveryCard />
    </AuthPageShell>
  );
}