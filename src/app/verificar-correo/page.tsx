import type { Metadata } from "next";

import { EmailVerificationCard } from "@/components/organisms/auth/EmailVerificationCard";
import { AuthPageShell } from "@/components/organisms/auth/AuthPageShell";

export const metadata: Metadata = {
  title:
    "FIXORA | Verificar correo / Verify email",

  description:
    "Verifica tu correo electrónico para activar tu cuenta FIXORA. Verify your email address to activate your FIXORA account.",

  robots: {
    index: false,
    follow: false,
  },
};

/*
 * Esta página permanece como Server Component.
 *
 * EmailVerificationCard se encargará de:
 *
 * - Recuperar el correo pendiente de verificación.
 * - Mostrar los seis campos del código.
 * - Permitir pegar el código completo.
 * - Avanzar automáticamente entre campos.
 * - Verificar el código enviado por correo.
 * - Controlar el reenvío y la cuenta regresiva.
 * - Mostrar mensajes en español o inglés.
 */
export default function VerifyEmailPage() {
  return (
    <AuthPageShell>
      <EmailVerificationCard />
    </AuthPageShell>
  );
}