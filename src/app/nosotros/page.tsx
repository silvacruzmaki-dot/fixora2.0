import type { Metadata } from "next";
import Link from "next/link";
import {
  FiCpu,
  FiPenTool,
  FiCode,
  FiZap,
  FiShield,
  FiCheckCircle,
  FiArrowRight,
  FiTarget,
  FiEye,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "Sobre Nosotros | FIXORA",
  description:
    "Conoce FIXORA, especialistas en desarrollo web, soporte técnico, diseño gráfico y soluciones tecnológicas.",
};

const services = [
  {
    title: "Desarrollo Web",
    description:
      "Creamos páginas corporativas, aplicaciones web y sistemas de gestión modernos, rápidos, seguros y adaptados a cada negocio.",
    icon: FiCode,
  },
  {
    title: "Soporte Técnico",
    description:
      "Diagnosticamos, mantenemos y reparamos computadoras, laptops y equipos tecnológicos, garantizando rendimiento y confiabilidad.",
    icon: FiCpu,
  },
  {
    title: "Diseño Gráfico",
    description:
      "Diseñamos logotipos, identidad corporativa, contenido para redes sociales y material publicitario que fortalece tu marca.",
    icon: FiPenTool,
  },
];

const benefits = [
  {
    title: "Atención rápida",
    description:
      "Respondemos oportunamente y trabajamos para entregar cada proyecto en el menor tiempo posible.",
    icon: FiZap,
  },
  {
    title: "Calidad garantizada",
    description:
      "Aplicamos procesos profesionales para ofrecer soluciones seguras, estables y confiables.",
    icon: FiShield,
  },
  {
    title: "Soluciones integrales",
    description:
      "Reunimos desarrollo web, diseño gráfico y soporte técnico en un solo lugar.",
    icon: FiCheckCircle,
  },
];

export default function NosotrosPage() {
  return (
    <main className="relative isolate overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white">
      {/* Decoraciones de fondo */}
      <div className="pointer-events-none absolute -right-44 -top-44 h-96 w-96 rounded-full bg-fixora-green/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Hero */}
      <section className="relative z-10 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-fixora-green">
            Sobre nosotros
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Tecnología, innovación y creatividad
            <span className="mt-2 block text-fixora-green">
              para impulsar tu negocio
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            En FIXORA desarrollamos soluciones digitales modernas,
            brindamos soporte técnico profesional y creamos diseños que
            fortalecen la identidad de empresas, emprendedores e instituciones.
          </p>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-black/20 backdrop-blur-lg sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="text-sm font-semibold uppercase tracking-widest text-fixora-green">
                Conoce FIXORA
              </span>

              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Soluciones que generan resultados
              </h2>
            </div>

            <div className="space-y-5 leading-8 text-slate-300">
              <p>
                Somos una empresa comprometida con la innovación tecnológica y
                la transformación digital. Ayudamos a nuestros clientes a
                optimizar sus procesos mediante tecnología y diseño profesional.
              </p>

              <p>
                Acompañamos cada proyecto desde la planificación hasta su
                implementación, ofreciendo asesoría personalizada y soluciones
                adaptadas a las necesidades reales de cada cliente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-fixora-green">
            Lo que hacemos
          </span>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Nuestros servicios
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Combinamos conocimiento técnico y creatividad para construir
            soluciones funcionales, atractivas y confiables.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.title}
                className="group rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-lg transition duration-300 hover:-translate-y-2 hover:border-fixora-green/50 hover:shadow-xl hover:shadow-fixora-green/5"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fixora-green/15 transition group-hover:bg-fixora-green/20">
                  <Icon className="h-8 w-8 text-fixora-green" />
                </div>

                <h3 className="mt-6 text-2xl font-bold">{service.title}</h3>

                <p className="mt-4 leading-7 text-slate-300">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Misión y visión */}
      <section className="border-y border-white/10 bg-slate-900/40 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fixora-green/15">
              <FiTarget className="h-7 w-7 text-fixora-green" />
            </div>

            <h2 className="mt-6 text-2xl font-bold">Nuestra misión</h2>

            <p className="mt-4 leading-8 text-slate-300">
              Brindar soluciones tecnológicas y creativas de calidad que ayuden
              a nuestros clientes a mejorar sus procesos, fortalecer su
              presencia digital y alcanzar sus objetivos.
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-950/50 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15">
              <FiEye className="h-7 w-7 text-violet-400" />
            </div>

            <h2 className="mt-6 text-2xl font-bold">Nuestra visión</h2>

            <p className="mt-4 leading-8 text-slate-300">
              Ser una empresa tecnológica reconocida por su innovación,
              creatividad, atención personalizada y capacidad para desarrollar
              soluciones que generen valor a largo plazo.
            </p>
          </article>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            ¿Por qué elegir FIXORA?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-300">
            Nos enfocamos en comprender cada necesidad para ofrecer una
            experiencia cercana, profesional y eficiente.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center transition hover:border-fixora-green/40"
                >
                  <Icon className="mx-auto h-10 w-10 text-fixora-green" />

                  <h3 className="mt-5 text-xl font-semibold">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 pb-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-3xl border border-fixora-green/20 bg-gradient-to-r from-fixora-green/10 to-violet-500/10 px-6 py-14 text-center sm:px-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              ¿Tienes un proyecto en mente?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Conversemos sobre tus ideas y creemos una solución tecnológica
              que impulse el crecimiento de tu negocio.
            </p>

            <Link
              href="/contacto"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-fixora-green px-8 py-4 font-semibold text-slate-950 transition duration-300 hover:scale-105 hover:shadow-lg hover:shadow-fixora-green/20"
            >
              Contáctanos
              <FiArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}