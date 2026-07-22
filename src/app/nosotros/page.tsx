const VALUES = [
  {
    number: "01",
    title: "Innovación",
    description:
      "Creamos soluciones digitales modernas que ayudan a las personas y empresas a avanzar.",
  },
  {
    number: "02",
    title: "Compromiso",
    description:
      "Trabajamos con responsabilidad, comunicación clara y atención en cada etapa del proyecto.",
  },
  {
    number: "03",
    title: "Calidad",
    description:
      "Cuidamos el diseño, el rendimiento, la seguridad y cada detalle de nuestros servicios.",
  },
  {
    number: "04",
    title: "Cercanía",
    description:
      "Escuchamos tus necesidades para desarrollar soluciones realmente útiles y personalizadas.",
  },
] as const;

const SERVICES = [
  {
    title: "Desarrollo de software",
    description:
      "Plataformas, sistemas empresariales y aplicaciones construidas según las necesidades de cada proyecto.",
    icon: "code",
  },
  {
    title: "Hardware y soporte",
    description:
      "Equipos tecnológicos, componentes, mantenimiento preventivo y soporte técnico especializado.",
    icon: "hardware",
  },
  {
    title: "Diseño creativo",
    description:
      "Identidad visual, contenido digital, piezas publicitarias y diseños que fortalecen tu marca.",
    icon: "design",
  },
  {
    title: "Soluciones integrales",
    description:
      "Integramos tecnología, estrategia y creatividad para resolver problemas reales de manera eficiente.",
    icon: "solution",
  },
] as const;

const PROCESS = [
  {
    step: "01",
    title: "Escuchamos",
    description:
      "Conocemos tu idea, necesidades, objetivos y los problemas que deseas solucionar.",
  },
  {
    step: "02",
    title: "Planificamos",
    description:
      "Definimos una propuesta clara, organizada y adaptada al alcance de tu proyecto.",
  },
  {
    step: "03",
    title: "Creamos",
    description:
      "Diseñamos y desarrollamos la solución aplicando tecnología, calidad y creatividad.",
  },
  {
    step: "04",
    title: "Acompañamos",
    description:
      "Realizamos seguimiento, mejoras y soporte para que tu solución continúe creciendo.",
  },
] as const;

function ServiceIcon({
  type,
}: {
  type: (typeof SERVICES)[number]["icon"];
}) {
  if (type === "code") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path
          d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M14 5l-4 14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "hardware") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <rect
          x="5"
          y="3"
          width="14"
          height="18"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="9"
          r="3"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle
          cx="12"
          cy="16"
          r="1.8"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    );
  }

  if (type === "design") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path
          d="M12 3a9 9 0 1 0 0 18h1.2a1.8 1.8 0 0 0 0-3.6H12a1.5 1.5 0 0 1 0-3h2.5A6.5 6.5 0 0 0 21 7.9C21 5.2 17 3 12 3Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="9" r="1" fill="currentColor" />
        <circle cx="10.5" cy="6.5" r="1" fill="currentColor" />
        <circle cx="15" cy="6.8" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path
        d="M12 3 14.7 9.3 21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CompanyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030706] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-52 -top-52 h-[520px] w-[520px] rounded-full bg-emerald-500/10 blur-[140px]" />

        <div className="absolute -bottom-52 -right-52 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[140px]" />
      </div>

      {/* HERO */}
      <section className="relative mx-auto max-w-[1600px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-zinc-950/85 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px]" />

          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/10 blur-[100px]" />

          <div className="relative grid min-h-[660px] items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-16 lg:py-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
                Sobre FIXORA
              </span>

              <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.045em] sm:text-5xl lg:text-7xl">
                Transformamos ideas en{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-green-300 to-cyan-300 bg-clip-text text-transparent">
                  soluciones reales
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
                Somos un equipo enfocado en tecnología, desarrollo,
                hardware y diseño creativo. Ayudamos a personas,
                emprendimientos y empresas a construir soluciones
                modernas, funcionales y preparadas para crecer.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="/contacto"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(16,185,129,0.25)]"
                >
                  Trabaja con nosotros
                  <ArrowIcon />
                </a>

                <a
                  href="/proyectos"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-3 text-sm font-black text-white transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
                >
                  Conoce nuestros proyectos
                </a>
              </div>

              <div className="mt-12 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["100%", "Compromiso"],
                  ["4", "Áreas"],
                  ["24/7", "Innovación"],
                  ["360°", "Soluciones"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                  >
                    <strong className="block text-2xl font-black text-white">
                      {value}
                    </strong>

                    <span className="mt-1 block text-xs text-zinc-500">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FIGURA VISUAL */}
            <div className="relative mx-auto flex min-h-[440px] w-full max-w-xl items-center justify-center">
              <div className="absolute h-[390px] w-[390px] rounded-full border border-emerald-400/15" />

              <div className="absolute h-[310px] w-[310px] rounded-full border border-cyan-400/15" />

              <div className="absolute h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative flex h-64 w-64 items-center justify-center rounded-[3rem] border border-white/10 bg-black/50 shadow-[0_35px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:h-72 sm:w-72">
                <div className="absolute inset-4 rounded-[2.4rem] border border-emerald-400/10" />

                <span className="relative bg-gradient-to-br from-emerald-300 via-green-300 to-cyan-300 bg-clip-text text-7xl font-black tracking-[-0.08em] text-transparent sm:text-8xl">
                  FX
                </span>
              </div>

              <div className="absolute left-0 top-12 rounded-2xl border border-white/10 bg-zinc-950/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-emerald-400">
                  Software
                </span>

                <span className="mt-1 block text-xs text-zinc-500">
                  Soluciones digitales
                </span>
              </div>

              <div className="absolute bottom-12 right-0 rounded-2xl border border-white/10 bg-zinc-950/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-cyan-400">
                  Hardware
                </span>

                <span className="mt-1 block text-xs text-zinc-500">
                  Tecnología y soporte
                </span>
              </div>

              <div className="absolute bottom-4 left-8 rounded-2xl border border-white/10 bg-zinc-950/90 px-4 py-3 shadow-xl backdrop-blur-xl">
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-amber-300">
                  Creative
                </span>

                <span className="mt-1 block text-xs text-zinc-500">
                  Diseño e identidad
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUIÉNES SOMOS */}
      <section className="relative mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 p-6 sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />

            <div className="relative grid h-full min-h-[440px] grid-cols-2 gap-4">
              <div className="flex flex-col gap-4 pt-12">
                <div className="flex min-h-48 flex-col justify-end rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                  <span className="text-4xl font-black text-emerald-300">
                    01
                  </span>

                  <strong className="mt-3 text-lg font-black">
                    Tecnología
                  </strong>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Herramientas modernas para resolver necesidades
                    reales.
                  </p>
                </div>

                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.07] p-5">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-emerald-300">
                    Evolución constante
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.07] p-5">
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-cyan-300">
                    Ideas que funcionan
                  </span>
                </div>

                <div className="flex min-h-56 flex-col justify-end rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                  <span className="text-4xl font-black text-cyan-300">
                    02
                  </span>

                  <strong className="mt-3 text-lg font-black">
                    Creatividad
                  </strong>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Diseños y experiencias que conectan con las
                    personas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
              Quiénes somos
            </span>

            <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-[-0.035em] sm:text-5xl">
              Tecnología, creatividad y estrategia en un solo lugar
            </h2>

            <p className="mt-6 text-base leading-8 text-zinc-400">
              FIXORA nace con el propósito de acercar soluciones
              tecnológicas de calidad a personas y organizaciones que
              buscan mejorar, modernizarse y alcanzar nuevos objetivos.
            </p>

            <p className="mt-4 text-base leading-8 text-zinc-400">
              No ofrecemos soluciones genéricas. Analizamos cada
              necesidad para desarrollar una propuesta adaptada,
              funcional y alineada con la identidad de cada cliente.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Soluciones adaptadas a cada necesidad.",
                "Comunicación directa durante todo el proyecto.",
                "Diseño moderno, rendimiento y funcionalidad.",
                "Acompañamiento antes, durante y después.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300">
                    <CheckIcon />
                  </span>

                  <span className="text-sm font-semibold text-zinc-300 sm:text-base">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="relative mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 p-7 transition hover:border-emerald-400/25 sm:p-10">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-[70px]" />

            <div className="relative">
              <span className="text-6xl font-black text-emerald-400/15">
                01
              </span>

              <span className="mt-7 block text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                Nuestra misión
              </span>

              <h2 className="mt-4 text-3xl font-black">
                Crear soluciones que generen valor
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
                Desarrollar soluciones tecnológicas, creativas y
                funcionales que ayuden a nuestros clientes a resolver
                problemas, optimizar sus procesos y fortalecer su
                presencia en el entorno digital.
              </p>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 p-7 transition hover:border-cyan-400/25 sm:p-10">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-[70px]" />

            <div className="relative">
              <span className="text-6xl font-black text-cyan-400/15">
                02
              </span>

              <span className="mt-7 block text-xs font-black uppercase tracking-[0.18em] text-cyan-400">
                Nuestra visión
              </span>

              <h2 className="mt-4 text-3xl font-black">
                Ser un referente en innovación
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
                Consolidarnos como una empresa reconocida por integrar
                tecnología, diseño e innovación, desarrollando
                soluciones confiables que evolucionen junto con
                nuestros clientes.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="relative mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
            Lo que hacemos
          </span>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-[-0.035em] sm:text-5xl">
            Diferentes áreas, un mismo objetivo
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-400">
            Integramos nuestras especialidades para brindar una
            experiencia completa y coherente.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service, index) => (
            <article
              key={service.title}
              className="group rounded-3xl border border-white/10 bg-zinc-950/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition group-hover:bg-emerald-400/15">
                  <ServiceIcon type={service.icon} />
                </span>

                <span className="text-sm font-black text-zinc-700">
                  0{index + 1}
                </span>
              </div>

              <h3 className="mt-7 text-xl font-black">
                {service.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* VALORES */}
      <section className="relative mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-zinc-950/80 p-6 sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                Nuestros valores
              </span>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
                La forma en que construimos FIXORA
              </h2>

              <p className="mt-5 text-base leading-8 text-zinc-400">
                Nuestros valores orientan cada decisión, cada diseño y
                cada solución que desarrollamos.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {VALUES.map((value) => (
                <article
                  key={value.number}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-emerald-400/20 hover:bg-emerald-400/[0.04]"
                >
                  <span className="text-sm font-black text-emerald-400">
                    {value.number}
                  </span>

                  <h3 className="mt-5 text-xl font-black">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="relative mx-auto max-w-[1600px] px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
            Cómo trabajamos
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] sm:text-5xl">
            Un proceso claro de principio a fin
          </h2>
        </div>

        <div className="relative mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-9 hidden h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent xl:block" />

          {PROCESS.map((item) => (
            <article
              key={item.step}
              className="relative rounded-3xl border border-white/10 bg-zinc-950/80 p-6"
            >
              <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/25 bg-[#07110c] text-lg font-black text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.12)]">
                {item.step}
              </span>

              <h3 className="mt-7 text-xl font-black">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-500">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative mx-auto max-w-[1600px] px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-emerald-400/20 bg-gradient-to-r from-emerald-500/15 via-zinc-950 to-cyan-500/15 px-6 py-14 text-center sm:px-10 lg:py-20">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-[90px]" />

          <div className="relative">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
              Construyamos juntos
            </span>

            <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Tu próxima gran idea puede comenzar hoy
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-400">
              Cuéntanos qué necesitas y descubre cómo FIXORA puede
              ayudarte a convertirlo en una solución real.
            </p>

            <a
              href="/contacto"
              className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-7 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(16,185,129,0.25)]"
            >
              Iniciar un proyecto
              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}