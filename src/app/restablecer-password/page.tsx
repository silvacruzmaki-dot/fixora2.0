import type { Metadata } from "next";

import { AuthPageShell } from "@/components/organisms/auth/AuthPageShell";
import { PasswordRecoveryCard } from "@/components/organisms/auth/PasswordRecoveryCard";

export const metadata: Metadata = {
  title:
    "FIXORA | Restablecer contraseña / Reset password",

  description:
    "Crea una nueva contraseña segura para recuperar el acceso a tu cuenta FIXORA. Create a new secure password to recover access to your FIXORA account.",

  robots: {
    index: false,
    follow: false,
  },
};

/*
 * Esta página permanece como Server Component.
 *
 * PasswordRecoveryCard comenzará directamente
 * en la etapa de restablecimiento y se encargará de:
 *
 * - Recuperar temporalmente el correo y el código
 *   previamente verificados.
 * - Mostrar el campo de nueva contraseña.
 * - Mostrar la confirmación de contraseña.
 * - Comprobar los requisitos de seguridad.
 * - Enviar el restablecimiento al servidor.
 * - Invalidar las sesiones anteriores.
 * - Redirigir al inicio de sesión.
 * - Mostrar mensajes en español o inglés.
 */
export default function ResetPasswordPage() {
  return (
    <AuthPageShell>
      <PasswordRecoveryCard initialStep="reset" />
    </AuthPageShell>
  );
}