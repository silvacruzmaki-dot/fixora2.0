"use client";

import {
  FiArrowDown,
  FiBarChart2,
  FiCheckCircle,
  FiFileText,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";

import { softwareBenefits } from "@/data/software";

import { buildGeneralSoftwareQuotationWhatsAppUrl } from "@/lib/software";

export default function SoftwareHero() {
  const scrollToCatalog = () => {
    document
      .getElementById("software-catalog")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const quotationUrl =
    buildGeneralSoftwareQuotationWhatsAppUrl();

  return (
    <section
      aria-labelledby="software-hero-title"
      className={[
        "relative isolate overflow-hidden",
        "border-b border-white/10",
        "bg-[#071018]",
        "px-5 pb-20 pt-28",
        "sm:px-8 sm:pb-24 sm:pt-32",
        "lg:px-12 lg:pb-28 lg:pt-36",
      ].join(" ")}
    >
      {/* Fondos decorativos */}
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 -z-20",
          "bg-[radial-gradient(circle_at_15%_25%,rgba(98,201,69,0.14),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,#071018_0%,#09131C_55%,#071018_100%)]",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 -z-10 opacity-25",
          "bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)]",
          "bg-[size:52px_52px]",
          "[mask-image:linear-gradient(to_bottom,black,transparent_90%)]",
        ].join(" ")}
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.02fr_0.98fr]">
        {/* Contenido principal */}
        <div className="max-w-3xl">
          <div
            className={[
              "inline-flex items-center gap-2 rounded-full",
              "border border-[#62C945]/30",
              "bg-[#62C945]/10 px-4 py-2",
              "text-xs font-bold uppercase tracking-[0.16em]",
              "text-[#72D653]",
              "shadow-[0_0_25px_rgba(98,201,69,0.12)]",
            ].join(" ")}
          >
            <FiCheckCircle
              aria-hidden="true"
              className="h-4 w-4"
            />

            Software original · Activación inmediata
          </div>

          <h1
            id="software-hero-title"
            className={[
              "mt-7 text-balance",
              "text-4xl font-black leading-[1.08]",
              "tracking-[-0.04em] text-white",
              "sm:text-5xl lg:text-6xl",
            ].join(" ")}
          >
            Las mejores soluciones de software{" "}
            <span
              className={[
                "bg-gradient-to-r from-[#72D653]",
                "via-[#62C945] to-cyan-300",
                "bg-clip-text text-transparent",
              ].join(" ")}
            >
              en un solo lugar
            </span>
          </h1>

          <p
            className={[
              "mt-6 max-w-2xl",
              "text-base leading-7 text-white/65",
              "sm:text-lg sm:leading-8",
            ].join(" ")}
          >
            Encuentra licencias originales, herramientas
            profesionales y soluciones digitales para mejorar tu
            productividad, proteger tu información y hacer crecer
            tu negocio.
          </p>

          {/* Botones funcionales */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToCatalog}
              className={[
                "inline-flex min-h-12 items-center justify-center gap-2.5",
                "rounded-xl bg-[#62C945] px-6",
                "text-sm font-extrabold text-[#071018]",
                "shadow-[0_0_28px_rgba(98,201,69,0.3)]",
                "transition-all duration-300",
                "hover:-translate-y-0.5 hover:bg-[#72D653]",
                "hover:shadow-[0_0_38px_rgba(114,214,83,0.42)]",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-[#72D653]",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[#071018]",
              ].join(" ")}
            >
              <FiShoppingBag
                aria-hidden="true"
                className="h-4 w-4"
              />

              Ver catálogo

              <FiArrowDown
                aria-hidden="true"
                className="h-4 w-4"
              />
            </button>

            <a
              href={quotationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "inline-flex min-h-12 items-center justify-center gap-2.5",
                "rounded-xl border border-cyan-300/35",
                "bg-cyan-300/10 px-6",
                "text-sm font-bold text-cyan-200",
                "backdrop-blur-md",
                "transition-all duration-300",
                "hover:-translate-y-0.5",
                "hover:border-cyan-300/65",
                "hover:bg-cyan-300/15",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-cyan-300",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[#071018]",
              ].join(" ")}
            >
              <FiFileText
                aria-hidden="true"
                className="h-4 w-4"
              />

              Solicitar cotización
            </a>
          </div>

          {/* Beneficios rápidos */}
          <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
            {softwareBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.id}
                  className="flex items-center gap-2.5"
                >
                  <span
                    className={[
                      "inline-flex h-9 w-9 shrink-0 items-center",
                      "justify-center rounded-lg",
                      "border border-[#62C945]/25",
                      "bg-[#62C945]/10 text-[#72D653]",
                    ].join(" ")}
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4"
                    />
                  </span>

                  <span className="text-xs font-semibold leading-5 text-white/70">
                    {benefit.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vista comercial del software */}
        <div className="relative mx-auto w-full max-w-2xl">
          <div
            aria-hidden="true"
            className={[
              "absolute -inset-10 -z-10 rounded-full",
              "bg-gradient-to-r from-[#62C945]/15 to-cyan-400/15",
              "blur-3xl",
            ].join(" ")}
          />

          <div
            className={[
              "relative overflow-hidden rounded-[2rem]",
              "border border-white/15",
              "bg-[#0B151E]/90 p-3",
              "shadow-[0_35px_100px_rgba(0,0,0,0.5)]",
              "backdrop-blur-xl",
            ].join(" ")}
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-3 pb-3 pt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#72D653]" />

              <span className="ml-3 text-xs font-semibold text-white/40">
                FIXORA Software Dashboard
              </span>
            </div>

            <div
              role="img"
              aria-label="Panel tecnológico de gestión y análisis de software"
              style={{
                backgroundImage: [
                  "linear-gradient(to top right, rgba(7,16,24,0.82), rgba(7,16,24,0.22))",
                  'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=90")',
                ].join(", "),
              }}
              className={[
                "relative mt-3 min-h-[370px] overflow-hidden",
                "rounded-2xl bg-cover bg-center",
                "sm:min-h-[440px]",
              ].join(" ")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#071018]/45 via-transparent to-cyan-950/45" />

              <div className="absolute inset-x-5 top-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-white/15 bg-[#071018]/80 p-4 backdrop-blur-md">
                  <FiBarChart2
                    aria-hidden="true"
                    className="h-5 w-5 text-[#72D653]"
                  />

                  <p className="mt-3 text-xs text-white/45">
                    Soluciones
                  </p>

                  <p className="mt-1 text-xl font-black text-white">
                    +250
                  </p>
                </div>

                <div className="rounded-xl border border-white/15 bg-[#071018]/80 p-4 backdrop-blur-md">
                  <FiUsers
                    aria-hidden="true"
                    className="h-5 w-5 text-cyan-300"
                  />

                  <p className="mt-3 text-xs text-white/45">
                    Clientes
                  </p>

                  <p className="mt-1 text-xl font-black text-white">
                    +850
                  </p>
                </div>

                <div className="col-span-2 rounded-xl border border-white/15 bg-[#071018]/80 p-4 backdrop-blur-md sm:col-span-1">
                  <FiCheckCircle
                    aria-hidden="true"
                    className="h-5 w-5 text-[#72D653]"
                  />

                  <p className="mt-3 text-xs text-white/45">
                    Satisfacción
                  </p>

                  <p className="mt-1 text-xl font-black text-white">
                    98%
                  </p>
                </div>
              </div>

              <div
                className={[
                  "absolute bottom-5 left-5 right-5",
                  "rounded-2xl border border-white/15",
                  "bg-[#071018]/85 p-5 backdrop-blur-lg",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                      Catálogo digital
                    </p>

                    <p className="mt-1 text-lg font-bold text-white">
                      Licencias listas para activar
                    </p>
                  </div>

                  <span
                    className={[
                      "inline-flex items-center rounded-full",
                      "border border-[#62C945]/30",
                      "bg-[#62C945]/10 px-3 py-1.5",
                      "text-xs font-bold text-[#72D653]",
                    ].join(" ")}
                  >
                    Disponible
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-[#62C945] to-cyan-300 shadow-[0_0_16px_rgba(98,201,69,0.55)]" />
                </div>
              </div>
            </div>
          </div>

          <div
            className={[
              "absolute -bottom-5 -left-3 hidden",
              "rounded-2xl border border-[#62C945]/25",
              "bg-[#0B151E]/90 px-5 py-4",
              "shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
              "backdrop-blur-xl sm:block",
            ].join(" ")}
          >
            <p className="text-xs text-white/45">
              Activación digital
            </p>

            <p className="mt-1 font-bold text-[#72D653]">
              Rápida y segura
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}