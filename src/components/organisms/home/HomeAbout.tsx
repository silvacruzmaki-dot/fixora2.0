"use client";

import Image from "next/image";

import {
  FiCpu,
  FiLayers,
  FiTarget,
  FiUsers,
} from "react-icons/fi";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import AboutFeature from "@/components/molecules/home/AboutFeature";
import useLanguage from "@/hooks/language/useLanguage";

const HOME_ABOUT_COPY = {
  es: {
    badge: "Conoce FIXORA",

    title: "Tecnología, creatividad y",

    highlightedTitle: "soluciones en un solo lugar",

    description:
      "En FIXORA combinamos conocimientos tecnológicos, creatividad y atención personalizada para desarrollar soluciones que respondan a las necesidades reales de cada persona, emprendimiento o empresa.",

    imageAlt:
      "Equipo de FIXORA trabajando en soluciones tecnológicas",

    imageLabel: "Soluciones adaptadas a cada necesidad",

    features: [
      {
        id: "personalized",
        title: "Soluciones personalizadas",
        description:
          "Analizamos cada necesidad para ofrecer una propuesta adecuada, funcional y alineada con los objetivos del cliente.",
      },
      {
        id: "technology",
        title: "Tecnología confiable",
        description:
          "Trabajamos con herramientas modernas para crear soluciones seguras, eficientes y preparadas para crecer.",
      },
      {
        id: "support",
        title: "Atención especializada",
        description:
          "Acompañamos al cliente durante todo el proceso, desde la planificación hasta la implementación y el soporte.",
      },
    ],
  },

  en: {
    badge: "Meet FIXORA",

    title: "Technology, creativity and",

    highlightedTitle: "solutions in one place",

    description:
      "At FIXORA, we combine technological knowledge, creativity, and personalized attention to develop solutions that respond to the real needs of every individual, entrepreneur, or business.",

    imageAlt:
      "FIXORA team working on technology solutions",

    imageLabel: "Solutions tailored to every need",

    features: [
      {
        id: "personalized",
        title: "Tailored solutions",
        description:
          "We analyze every need to provide an appropriate, functional proposal aligned with each client’s goals.",
      },
      {
        id: "technology",
        title: "Reliable technology",
        description:
          "We use modern tools to create secure, efficient solutions prepared to grow over time.",
      },
      {
        id: "support",
        title: "Specialized assistance",
        description:
          "We support each client throughout the process, from planning to implementation and ongoing support.",
      },
    ],
  },
} as const;

const FEATURE_ICONS = {
  personalized: FiTarget,
  technology: FiCpu,
  support: FiUsers,
} as const;

const FEATURE_VARIANTS = {
  personalized: "blue",
  technology: "green",
  support: "violet",
} as const;

export default function HomeAbout() {
  const { language } = useLanguage();

  const copy = HOME_ABOUT_COPY[language];

  return (
    <section
      id="nosotros"
      aria-labelledby="home-about-title"
      className={[
        "relative isolate overflow-hidden",
        "bg-slate-50 px-4 py-16",
        "transition-colors duration-300",
        "dark:bg-slate-950",
        "sm:px-6 sm:py-20",
        "lg:px-8 lg:py-24",
      ].join(" ")}
    >
      <HomeDecorativeShape
        variant="blue"
        size="large"
        form="circle"
        className="-left-32 top-16 opacity-50"
      />

      <HomeDecorativeShape
        variant="violet"
        size="medium"
        form="blob"
        className="-right-20 bottom-12 opacity-40"
      />

      <div
        className={[
          "relative z-10 mx-auto grid w-full",
          "max-w-[1180px]",
          "grid-cols-1 items-center gap-12",
          "lg:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)]",
          "lg:gap-16",
          "xl:gap-20",
        ].join(" ")}
      >
        <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
          <div
            className={[
              "relative aspect-[4/3] overflow-hidden",
              "rounded-[2rem]",
              "border border-slate-200/80",
              "bg-white",
              "p-3",
              "shadow-2xl shadow-slate-950/10",
              "transition-colors duration-300",
              "dark:border-white/10",
              "dark:bg-slate-900",
              "dark:shadow-black/30",
              "sm:p-4",
            ].join(" ")}
          >
            <div
              className={[
                "relative h-full w-full overflow-hidden",
                "rounded-[1.45rem]",
                "bg-slate-100",
                "dark:bg-slate-950",
              ].join(" ")}
            >
              <Image
                src="/images/home/about/about-fixora.webp"
                alt={copy.imageAlt}
                fill
                sizes={[
                  "(max-width: 640px) 92vw",
                  "(max-width: 1024px) 70vw",
                  "540px",
                ].join(", ")}
                className={[
                  "object-cover object-center",
                  "transition-transform duration-700",
                  "hover:scale-[1.03]",
                ].join(" ")}
              />

              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute inset-0",
                  "bg-gradient-to-t",
                  "from-slate-950/60",
                  "via-slate-950/5",
                  "to-transparent",
                ].join(" ")}
              />

              <div
                className={[
                  "absolute bottom-4 left-4 right-4",
                  "flex items-center gap-3",
                  "rounded-2xl border border-white/20",
                  "bg-slate-950/55 p-4",
                  "text-white shadow-lg",
                  "backdrop-blur-md",
                  "sm:bottom-5 sm:left-5 sm:right-5",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "inline-flex h-10 w-10 shrink-0",
                    "items-center justify-center",
                    "rounded-xl",
                    "bg-white/15",
                  ].join(" ")}
                >
                  <FiLayers className="h-5 w-5" />
                </span>

                <p className="text-sm font-semibold leading-relaxed sm:text-base">
                  {copy.imageLabel}
                </p>
              </div>
            </div>
          </div>

          <span
            aria-hidden="true"
            className={[
              "absolute -bottom-5 -right-5 -z-10",
              "h-24 w-24 rounded-3xl",
              "border border-cyan-500/20",
              "bg-cyan-500/10",
              "dark:border-cyan-400/15",
              "dark:bg-cyan-400/10",
              "sm:h-32 sm:w-32",
            ].join(" ")}
          />
        </div>

        <div className="min-w-0">
          <HomeBadge variant="blue">
            {copy.badge}
          </HomeBadge>

          <HomeSectionTitle
            id="home-about-title"
            as="h2"
            size="section"
            align="left"
            highlightedText={copy.highlightedTitle}
            className="mt-5"
          >
            {copy.title}
          </HomeSectionTitle>

          <HomeSectionDescription
            size="section"
            align="left"
            className="mt-5"
          >
            {copy.description}
          </HomeSectionDescription>

          <div className="mt-8 grid grid-cols-1 gap-4">
            {copy.features.map((feature) => {
              const Icon =
                FEATURE_ICONS[
                  feature.id as keyof typeof FEATURE_ICONS
                ];

              const variant =
                FEATURE_VARIANTS[
                  feature.id as keyof typeof FEATURE_VARIANTS
                ];

              return (
                <AboutFeature
                  key={feature.id}
                  icon={
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5"
                    />
                  }
                  title={feature.title}
                  description={feature.description}
                  variant={variant}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}