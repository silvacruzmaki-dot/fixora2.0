import type { Metadata } from "next";
import Link from "next/link";
import {
  FiCpu,
  FiPenTool,
  FiZap,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Sobre Nosotros | FIXORA",
  description:
    "Conoce FIXORA, especialistas en desarrollo web, soporte técnico, diseño gráfico y soluciones tecnológicas.",
};

export default function NosotrosPage() {
  return (
    <main className="relative isolate overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900/95 text-white">

      {/* Decoraciones */}
      <div className="absolute -top-44 -right-44 h-96 w-96 rounded-full bg-fixora-green/10 blur-3xl" />
      <div className="absolute bottom-0 -left-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      {/* HERO */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">

          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-fixora-green">
            Sobre Nosotros
          </span>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight">
            Tecnología, innovación y creatividad
            <span className="block text-fixora-green">
              para impulsar tu negocio.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            En FIXORA desarrollamos soluciones digitales modernas,
            brindamos soporte técnico profesional y creamos diseños
            gráficos que fortalecen la identidad de empresas,
            emprendedores e instituciones.
          </p>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20">

        <div className="grid gap-8 md:grid-cols-2">

          <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-lg transition hover:border-fixora-green/50">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-fixora-green/15">
              <FiCpu className="h-8 w-8 text-fixora-green" />
            </div>

            <h2 className="text-2xl font-bold">
              Soporte Técnico
            </h2>

            <p className="mt-4 text-slate-300 leading-8">
              Diagnosticamos, mantenemos y reparamos computadoras,
              laptops y equipos tecnológicos con altos estándares
              de calidad, garantizando seguridad, rendimiento y
              confiabilidad.
            </p>

          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-lg transition hover:border-fixora-green/50">

            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-fixora-green/15">
              <FiPenTool className="h-8 w-8 text-fixora-green" />
            </div>

            <h2 className="text-2xl font-bold">
              Diseño Gráfico
            </h2>

            <p className="mt-4 text-slate-300 leading-8">
              Diseñamos logotipos, identidad corporativa,
              publicidad para redes sociales, material
              impreso y contenido visual profesional para
              fortalecer la presencia de tu marca.
            </p>

          </article>

        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="border-y border-white/10 bg-slate-900/40 py-20">

        <div className="mx-auto max-w-6xl px-6">

          <h2 className="text-center text-4xl font-bold">
            ¿Por qué elegir FIXORA?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-300">
            Nuestro objetivo es ofrecer soluciones completas
            que combinen tecnología, creatividad e innovación.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center">

              <FiZap className="mx-auto h-10 w-10 text-fixora-green" />

              <h3 className="mt-5 text-xl font-semibold">
                Atención Rápida
              </h3>

              <p className="mt-3 text-slate-400">
                Solucionamos problemas técnicos y entregamos
                proyectos digitales en el menor tiempo posible.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center">

              <FiShield className="mx-auto h-10 w-10 text-fixora-green" />

              <h3 className="mt-5 text-xl font-semibold">
                Calidad Garantizada
              </h3>

              <p className="mt-3 text-slate-400">
                Trabajamos con procesos profesionales que
                garantizan seguridad, estabilidad y confianza.
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center">

              <FiCheckCircle className="mx-auto h-10 w-10 text-fixora-green" />

              <h3 className="mt-5 text-xl font-semibold">
                Soluciones Integrales
              </h3>

              <p className="mt-3 text-slate-400">
                Desarrollo web, diseño gráfico, mantenimiento
                y soporte técnico en un solo lugar.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="py-20">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-4xl font-bold">
            ¿Tienes un proyecto en mente?
          </h2>

          <p className="mt-5 text-lg text-slate-300">
            Estamos preparados para ayudarte con soluciones
            tecnológicas modernas que impulsen el crecimiento
            de tu negocio.
          </p>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            En <span className="font-semibold text-fixora-green">FIXORA</span> somos una empresa
            comprometida con la innovación tecnológica y la transformación digital.
            Nuestro propósito es ofrecer soluciones modernas que ayuden a empresas,
            emprendedores e instituciones a optimizar sus procesos mediante el uso de la
            tecnología y el diseño profesional.
          </p>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Contamos con experiencia en el desarrollo de aplicaciones web, páginas
            corporativas, sistemas de gestión, soporte técnico especializado y diseño
            gráfico. Trabajamos con herramientas y tecnologías actuales para crear
            proyectos funcionales, seguros, atractivos y adaptados a las necesidades de
            cada cliente.
          </p>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Creemos que cada proyecto representa una oportunidad para generar impacto,
            por ello acompañamos a nuestros clientes desde la planificación hasta la
            implementación, brindando asesoría personalizada, atención de calidad y
            soluciones innovadoras que contribuyan al crecimiento de sus negocios.
          </p>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            Nuestro compromiso es combinar creatividad, conocimiento técnico e innovación
            para desarrollar productos digitales que no solo cumplan con los objetivos
            planteados, sino que también ofrezcan una excelente experiencia para los
            usuarios y aporten valor a largo plazo.
          </p>

          <Link
            href="/contacto"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-fixora-green px-8 py-4 font-semibold text-slate-900 transition hover:scale-105"
          >
            Contáctanos
            <FiArrowRight />
          </Link>

        </div>

      </section>

    </main>
  );
}