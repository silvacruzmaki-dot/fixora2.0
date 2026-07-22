import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  FiEdit3,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiSend,
  FiUser,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contacto | FIXORA",
  description:
    "Comunícate con FIXORA para solicitar información, soporte técnico, desarrollo web o diseño gráfico.",
};

const WHATSAPP_NUMBER = "51921844151";
const CONTACT_EMAIL = "gabrielcarranzasilva@gmail.com";

const SOCIAL_NETWORKS = [
  {
    name: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      "Hola FIXORA, deseo solicitar información sobre sus servicios."
    )}`,
    icon: FaWhatsapp,
    styles:
      "hover:border-emerald-400 hover:bg-emerald-500/15 hover:text-emerald-400",
  },
  {
    name: "Facebook",
    // Reemplaza este enlace por el enlace de tu página de Facebook.
    href: "https://www.facebook.com/",
    icon: FaFacebookF,
    styles:
      "hover:border-blue-500 hover:bg-blue-500/15 hover:text-blue-400",
  },
  {
    name: "Instagram",
    // Reemplaza este enlace por el enlace de tu cuenta de Instagram.
    href: "https://www.instagram.com/",
    icon: FaInstagram,
    styles:
      "hover:border-pink-500 hover:bg-pink-500/15 hover:text-pink-400",
  },
  {
    name: "TikTok",
    // Reemplaza este enlace por el enlace de tu cuenta de TikTok.
    href: "https://www.tiktok.com/",
    icon: FaTiktok,
    styles:
      "hover:border-cyan-400 hover:bg-cyan-400/15 hover:text-cyan-300",
  },
];

/* Envía los datos del formulario a WhatsApp */
async function sendToWhatsApp(formData: FormData) {
  "use server";

  const nombre = String(formData.get("nombre") ?? "").trim();
  const correo = String(formData.get("correo") ?? "").trim();
  const asunto = String(formData.get("asunto") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();

  const whatsappMessage = `
Hola FIXORA, deseo solicitar información.

Nombre: ${nombre}
Correo: ${correo}
Asunto: ${asunto}

Mensaje:
${mensaje}
  `.trim();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  redirect(whatsappUrl);
}

export default function ContactoPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900/95 text-white">
      {/* Fondo decorativo */}

      <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-fixora-green/10 blur-3xl" />

      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Contenido */}

      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Encabezado */}

          <header className="text-center">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-fixora-green">
              CONTACTO
            </span>

            <h1 className="mt-6 text-5xl font-extrabold tracking-tight md:text-6xl">
              Ponte en contacto con
              <span className="block text-fixora-green">FIXORA</span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              ¿Necesitas una página web, soporte técnico, diseño gráfico o una
              solución tecnológica? Completa el formulario y comunícate
              directamente con nosotros por WhatsApp.
            </p>
          </header>

          {/* Formulario */}

          <div className="mt-20">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
              <h2 className="text-3xl font-bold">Envíanos un mensaje</h2>

              <p className="mt-3 text-slate-400">
                Completa el formulario y serás dirigido a WhatsApp.
              </p>

              <form action={sendToWhatsApp} className="mt-10 space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Nombre */}

                  <div>
                    <label
                      htmlFor="nombre"
                      className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300"
                    >
                      <FiUser className="text-fixora-green" />
                      Nombre completo
                    </label>

                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Ingresa tu nombre"
                      className="w-full rounded-2xl border border-white/10 bg-slate-800/60 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-fixora-green focus:ring-2 focus:ring-fixora-green/20"
                    />
                  </div>

                  {/* Correo */}

                  <div>
                    <label
                      htmlFor="correo"
                      className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300"
                    >
                      <FiMail className="text-fixora-green" />
                      Correo electrónico
                    </label>

                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="correo@ejemplo.com"
                      className="w-full rounded-2xl border border-white/10 bg-slate-800/60 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-fixora-green focus:ring-2 focus:ring-fixora-green/20"
                    />
                  </div>
                </div>

                {/* Asunto */}

                <div>
                  <label
                    htmlFor="asunto"
                    className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300"
                  >
                    <FiEdit3 className="text-fixora-green" />
                    Asunto
                  </label>

                  <input
                    id="asunto"
                    name="asunto"
                    type="text"
                    required
                    placeholder="Escribe el asunto"
                    className="w-full rounded-2xl border border-white/10 bg-slate-800/60 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-fixora-green focus:ring-2 focus:ring-fixora-green/20"
                  />
                </div>

                {/* Mensaje */}

                <div>
                  <label
                    htmlFor="mensaje"
                    className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300"
                  >
                    <FiMessageSquare className="text-fixora-green" />
                    Mensaje
                  </label>

                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={8}
                    required
                    placeholder="Cuéntanos sobre tu proyecto o consulta..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-slate-800/60 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-fixora-green focus:ring-2 focus:ring-fixora-green/20"
                  />
                </div>

                {/* Botón */}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-fixora-green px-8 py-4 text-lg font-semibold text-slate-900 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-fixora-green/30"
                  >
                    <FiSend className="text-xl" />
                    Enviar por WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Información de contacto */}

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {/* Correo */}

            <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-fixora-green">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-fixora-green/20">
                <FiMail className="text-3xl text-fixora-green" />
              </div>

              <h3 className="mt-6 text-xl font-bold">Correo</h3>

              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Consulta para FIXORA`}
                className="mt-3 inline-block break-all text-slate-400 transition hover:text-fixora-green"
              >
                {CONTACT_EMAIL}
              </a>
            </article>

            {/* Teléfono */}

            <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-fixora-green">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-fixora-green/20">
                <FiPhone className="text-3xl text-fixora-green" />
              </div>

              <h3 className="mt-6 text-xl font-bold">Teléfono</h3>

              <a
                href="tel:+51921844151"
                className="mt-3 inline-block text-slate-400 transition hover:text-fixora-green"
              >
                +51 921 844 151
              </a>
            </article>

            {/* Dirección */}

            <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-fixora-green">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-fixora-green/20">
                <FiMapPin className="text-3xl text-fixora-green" />
              </div>

              <h3 className="mt-6 text-xl font-bold">Ubicación</h3>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Celendín+Cajamarca+Perú"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-slate-400 transition hover:text-fixora-green"
              >
                Celendín - Cajamarca - Perú
              </a>
            </article>
          </div>

          {/* Redes sociales */}

          <section className="mt-16 rounded-3xl border border-white/10 bg-slate-900/60 p-8 text-center shadow-xl backdrop-blur-xl md:p-12">
            <span className="text-sm font-semibold uppercase tracking-widest text-fixora-green">
              Redes sociales
            </span>

            <h2 className="mt-3 text-3xl font-bold">Conecta con FIXORA</h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-400">
              Síguenos en nuestras redes sociales o escríbenos directamente por
              WhatsApp.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {SOCIAL_NETWORKS.map(
                ({ name, href, icon: SocialIcon, styles }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visitar ${name} de FIXORA`}
                    className={`group inline-flex min-w-36 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-semibold text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles}`}
                  >
                    <SocialIcon className="text-2xl transition-transform duration-300 group-hover:scale-110" />
                    <span>{name}</span>
                  </a>
                )
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}