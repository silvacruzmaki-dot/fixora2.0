import {
  FiArrowUpRight,
  FiCheckCircle,
  FiCode,
  FiHeadphones,
  FiLayers,
  FiSettings,
} from "react-icons/fi";

import { buildCustomSoftwareWhatsAppUrl } from "@/lib/software";

const customSolutionBenefits = [
  {
    id: "analysis",
    label: "Análisis de requerimientos",
    icon: FiLayers,
  },
  {
    id: "development",
    label: "Desarrollo personalizado",
    icon: FiCode,
  },
  {
    id: "integration",
    label: "Integración con tus procesos",
    icon: FiSettings,
  },
  {
    id: "support",
    label: "Soporte y mantenimiento",
    icon: FiHeadphones,
  },
];

export default function SoftwareCustomSolutionBanner() {
  const advisoryUrl = buildCustomSoftwareWhatsAppUrl();

  return (
    <section
      aria-labelledby="custom-software-title"
      className={[
        "relative overflow-hidden",
        "border-t border-white/10",
        "bg-[#071018]",
        "px-5 py-16",
        "sm:px-8 sm:py-20",
        "lg:px-12",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(circle_at_15%_40%,rgba(98,201,69,0.1),transparent_32%),radial-gradient(circle_at_85%_60%,rgba(34,211,238,0.08),transparent_35%)]",
        ].join(" ")}
      />

      <div
        className={[
          "relative mx-auto grid w-full max-w-7xl",
          "overflow-hidden rounded-[2rem]",
          "border border-[#62C945]/25",
          "bg-[#0B1720]/95",
          "shadow-[0_35px_100px_rgba(0,0,0,0.45)]",
          "backdrop-blur-xl",
          "lg:grid-cols-[1.1fr_0.9fr]",
        ].join(" ")}
      >
        <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-14">
          <span
            className={[
              "inline-flex w-fit items-center gap-2",
              "rounded-full border border-[#62C945]/30",
              "bg-[#62C945]/10 px-4 py-2",
              "text-xs font-bold uppercase tracking-[0.16em]",
              "text-[#72D653]",
            ].join(" ")}
          >
            <FiCode
              aria-hidden="true"
              className="h-4 w-4"
            />

            Soluciones personalizadas
          </span>

          <h2
            id="custom-software-title"
            className={[
              "mt-6 max-w-2xl text-balance",
              "text-3xl font-black tracking-[-0.035em]",
              "text-white sm:text-4xl lg:text-5xl",
            ].join(" ")}
          >
            ¿Necesitas un software{" "}
            <span
              className={[
                "bg-gradient-to-r from-[#72D653]",
                "via-[#62C945] to-cyan-300",
                "bg-clip-text text-transparent",
              ].join(" ")}
            >
              hecho a tu medida?
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
            Desarrollamos soluciones digitales adaptadas a las
            necesidades, procesos y objetivos de tu empresa.
            Cuéntanos tu idea y nuestro equipo te ayudará a
            convertirla en una solución funcional.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {customSolutionBenefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.id}
                  className={[
                    "flex items-center gap-3 rounded-xl",
                    "border border-white/10",
                    "bg-white/[0.035] px-4 py-3",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-flex h-9 w-9 shrink-0",
                      "items-center justify-center rounded-lg",
                      "border border-[#62C945]/25",
                      "bg-[#62C945]/10 text-[#72D653]",
                    ].join(" ")}
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-4 w-4"
                    />
                  </span>

                  <span className="text-sm font-semibold text-white/75">
                    {benefit.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={advisoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "group inline-flex min-h-12",
                "items-center justify-center gap-2.5",
                "rounded-xl bg-[#62C945] px-6",
                "text-sm font-black text-[#071018]",
                "shadow-[0_0_28px_rgba(98,201,69,0.3)]",
                "transition-all duration-300",
                "hover:-translate-y-0.5",
                "hover:bg-[#72D653]",
                "hover:shadow-[0_0_38px_rgba(114,214,83,0.42)]",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-[#72D653]",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-[#071018]",
              ].join(" ")}
            >
              Solicitar asesoría

              <FiArrowUpRight
                aria-hidden="true"
                className={[
                  "h-4 w-4",
                  "transition-transform duration-300",
                  "group-hover:-translate-y-0.5",
                  "group-hover:translate-x-0.5",
                ].join(" ")}
              />
            </a>

            <div className="flex items-center gap-2 text-sm text-white/50">
              <FiCheckCircle
                aria-hidden="true"
                className="h-4 w-4 text-[#72D653]"
              />

              Atención personalizada por WhatsApp
            </div>
          </div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden lg:min-h-full">
          <div
            role="img"
            aria-label="Equipo desarrollando una solución de software personalizada"
            style={{
              backgroundImage: [
                "linear-gradient(to right, rgba(11,23,32,0.98), rgba(11,23,32,0.28))",
                'url("https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=90")',
              ].join(", "),
            }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#071018]/80 via-transparent to-cyan-950/20" />

          <div
            className={[
              "absolute bottom-6 left-6 right-6",
              "rounded-2xl border border-white/15",
              "bg-[#071018]/80 p-5",
              "shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
              "backdrop-blur-xl",
            ].join(" ")}
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#72D653]">
              Desarrollo FIXORA
            </p>

            <p className="mt-2 text-lg font-black text-white">
              Tecnología creada alrededor de tu negocio
            </p>

            <p className="mt-2 text-sm leading-6 text-white/55">
              Diseñamos sistemas web, plataformas y herramientas
              digitales escalables.
            </p>
          </div>
        </div>

        <span
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-x-20 top-0 h-px",
            "bg-gradient-to-r from-transparent",
            "via-[#72D653] to-transparent",
          ].join(" ")}
        />
      </div>
    </section>
  );
}