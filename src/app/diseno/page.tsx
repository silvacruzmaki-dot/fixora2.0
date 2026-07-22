"use client";

import {
  CreativeHero,
} from "@/components/organisms/creative/CreativeHero";

const designs = [
  {
    id:
      "design-free-1",

    title:
      "Plantilla para redes sociales",

    description:
      "Diseño editable para publicaciones promocionales y contenido digital.",

    type:
      "FREE",

    typeLabel:
      "Gratis",

    category:
      "Flyers",

    action:
      "Descargar gratis",
  },
  {
    id:
      "design-paid-1",

    title:
      "Identidad visual profesional",

    description:
      "Propuesta visual para marcas que buscan una imagen moderna y consistente.",

    type:
      "PAID",

    typeLabel:
      "Premium",

    category:
      "Branding",

    action:
      "Comprar con Yape",
  },
  {
    id:
      "design-portfolio-1",

    title:
      "Campaña gráfica empresarial",

    description:
      "Proyecto desarrollado para mostrar el proceso y resultado de una campaña visual.",

    type:
      "PORTFOLIO",

    typeLabel:
      "Portafolio",

    category:
      "Publicidad",

    action:
      "Solicitar uno similar",
  },
  {
    id:
      "design-free-2",

    title:
      "Historia para Instagram",

    description:
      "Plantilla vertical para promociones, anuncios y comunicación de servicios.",

    type:
      "FREE",

    typeLabel:
      "Gratis",

    category:
      "Redes sociales",

    action:
      "Descargar gratis",
  },
  {
    id:
      "design-paid-2",

    title:
      "Paquete de publicaciones",

    description:
      "Colección de piezas gráficas listas para adaptar a diferentes negocios.",

    type:
      "PAID",

    typeLabel:
      "Premium",

    category:
      "Contenido digital",

    action:
      "Comprar con Yape",
  },
  {
    id:
      "design-portfolio-2",

    title:
      "Edición fotográfica profesional",

    description:
      "Trabajo de retoque, colorización y mejora visual para una campaña comercial.",

    type:
      "PORTFOLIO",

    typeLabel:
      "Portafolio",

    category:
      "Fotografía",

    action:
      "Solicitar uno similar",
  },
] as const;

function getTypeClasses(
  type:
    (typeof designs)[number]["type"],
): string {
  if (
    type ===
    "FREE"
  ) {
    return [
      "border-emerald-400/30",
      "bg-emerald-400/10",
      "text-emerald-300",
    ].join(
      " ",
    );
  }

  if (
    type ===
    "PAID"
  ) {
    return [
      "border-amber-400/30",
      "bg-amber-400/10",
      "text-amber-300",
    ].join(
      " ",
    );
  }

  return [
    "border-cyan-400/30",
    "bg-cyan-400/10",
    "text-cyan-300",
  ].join(
    " ",
  );
}

function scrollToCatalog(): void {
  document
    .getElementById(
      "catalogo-diseno",
    )
    ?.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start",
    });
}

function scrollToPortfolio(): void {
  document
    .getElementById(
      "portafolio-diseno",
    )
    ?.scrollIntoView({
      behavior:
        "smooth",

      block:
        "start",
    });
}

export default function DesignPage() {
  return (
    <main className="min-h-screen bg-[#050807] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <CreativeHero
          language="es"
          size="wide"
          variant="dark"
          heading="Diseños que convierten ideas en"
          highlightedText="experiencias visuales"
          description="Explora recursos gratuitos, diseños premium y proyectos desarrollados por FIXORA para marcas, negocios y creadores."
          primaryActionLabel="Explorar diseños"
          secondaryActionLabel="Ver portafolio"
          onPrimaryAction={
            scrollToCatalog
          }
          onSecondaryAction={
            scrollToPortfolio
          }
          metrics={[
            {
              id:
                "designs",

              value:
                "120+",

              label:
                "Diseños",
            },
            {
              id:
                "categories",

              value:
                "8",

              label:
                "Categorías",
            },
            {
              id:
                "projects",

              value:
                "40+",

              label:
                "Proyectos",
            },
          ]}
        />

        <section
          id="catalogo-diseno"
          className="scroll-mt-24 py-20"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                Catálogo creativo
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Explora nuestros diseños
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Recursos gratuitos, piezas premium y trabajos de
                portafolio organizados en una experiencia visual moderna.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Todos",
                "Gratis",
                "Premium",
                "Portafolio",
              ].map(
                (
                  filter,
                  index,
                ) => (
                  <button
                    key={
                      filter
                    }
                    type="button"
                    className={
                      index ===
                      0
                        ? "rounded-xl border border-emerald-400/30 bg-emerald-400/15 px-4 py-2 text-sm font-bold text-emerald-300"
                        : "rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-emerald-400/30 hover:text-emerald-300"
                    }
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {designs.map(
              (
                design,
              ) => (
                <article
                  key={
                    design.id
                  }
                  id={
                    design.type ===
                    "PORTFOLIO"
                      ? "portafolio-diseno"
                      : undefined
                  }
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-emerald-400/25"
                >
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-500/15 via-zinc-900 to-cyan-500/10">
                    <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />

                    <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

                    <div className="relative flex h-24 w-24 rotate-3 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl transition duration-300 group-hover:rotate-0 group-hover:scale-105">
                      <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-4xl font-black text-transparent">
                        F
                      </span>
                    </div>

                    <span
                      className={[
                        "absolute left-4 top-4 rounded-full border px-3 py-1.5",
                        "text-[10px] font-black uppercase tracking-[0.1em]",
                        getTypeClasses(
                          design.type,
                        ),
                      ].join(
                        " ",
                      )}
                    >
                      {design.typeLabel}
                    </span>
                  </div>

                  <div className="p-5">
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-emerald-400">
                      {design.category}
                    </span>

                    <h3 className="mt-2 text-xl font-black text-white">
                      {design.title}
                    </h3>

                    <p className="mt-3 min-h-14 text-sm leading-6 text-zinc-400">
                      {design.description}
                    </p>

                    <button
                      type="button"
                      className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2.5 text-sm font-black text-emerald-300 transition hover:bg-emerald-400/20"
                    >
                      {design.action}
                    </button>
                  </div>
                </article>
              ),
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-emerald-500/10 via-zinc-950 to-cyan-500/10 p-7 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                Diseño personalizado
              </span>

              <h2 className="mt-3 text-3xl font-black">
                ¿Necesitas una propuesta única?
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Solicita un diseño adaptado a tu marca, negocio,
                emprendimiento o proyecto.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(16,185,129,0.25)]"
            >
              Solicitar diseño
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}