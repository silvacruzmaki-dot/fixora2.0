import type { Metadata } from "next";

import { AdminLoginCard } from "@/components/organisms/auth/AdminLoginCard";
import { AuthPageShell } from "@/components/organisms/auth/AuthPageShell";

export const metadata: Metadata = {
  title:
    "FIXORA | Acceso administrativo / Administrator access",

  description:
    "Acceso exclusivo para administradores autorizados de FIXORA. Exclusive access for authorized FIXORA administrators.",

  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

/*
 * Esta página permanece como Server Component.
 *
 * AdminLoginCard se encargará de:
 *
 * - Solicitar correo y contraseña.
 * - Permitir recordar la sesión.
 * - Consumir el endpoint administrativo.
 * - Mostrar mensajes en español o inglés.
 * - Gestionar estados de carga y errores.
 * - Redirigir al panel cuando el acceso sea válido.
 *
 * La comprobación definitiva del rol ADMIN
 * siempre se realizará en el servidor.
 */
export default function AdminLoginPage() {
  return (
    <AuthPageShell>
      <AdminLoginCard />
    </AuthPageShell>
  );
}