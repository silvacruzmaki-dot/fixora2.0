"use client";

import Link from "next/link";

import {
  FiArrowRight,
  FiCode,
  FiCpu,
  FiEdit3,
  FiTool,
} from "react-icons/fi";

import type { IconType } from "react-icons";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import AreaCard, {
  type AreaCardVariant,
} from "@/components/molecules/home/AreaCard";
import useLanguage from "@/hooks/language/useLanguage";

type HomeAreaId =
  | "software"
  | "hardware"
  | "design"
  | "support";

interface HomeAreaContent {
  id: HomeAreaId;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  linkAriaLabel: string;
}

interface HomeAreasContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  viewAllLabel: string;
  viewAllAriaLabel: string;
  areas: readonly HomeAreaContent[];
}

const HOME_AREAS_COPY: Record<
  "es" | "en",
  HomeAreasContent
> = {
  es: {
    badge: "Áreas de trabajo",

    title: "Todo lo que necesitas para",

    highlightedTitle: "hacer crecer tus proyectos",

    description:
      "Explora las principales áreas de FIXORA y encuentra soluciones de software, hardware, diseño y soporte tecnológico en un solo lugar.",

    viewAllLabel: "Conocer FIXORA",

    viewAllAriaLabel:
      "Conocer más sobre las áreas de trabajo de FIXORA",

    areas: [
      {
        id: "software",
        title: "Software",
        description:
          "Desarrollamos sistemas, aplicaciones y soluciones digitales adaptadas a los procesos y objetivos de cada cliente.",
        href: "/software",
        linkLabel: "Explorar software",
        linkAriaLabel:
          "Explorar el área de software de FIXORA",
      },
      {
        id: "hardware",
        title: "Hardware",
        description:
          "Brindamos equipos, componentes, accesorios y asesoría para elegir tecnología confiable y adecuada.",
        href: "/hardware",
        linkLabel: "Explorar hardware",
        linkAriaLabel:
          "Explorar el área de hardware de FIXORA",
      },
      {
        id: "design",
        title: "Diseño y creatividad",
        description:
          "Creamos identidades visuales, contenido gráfico e interfaces digitales que comunican de manera clara y profesional.",
        href: "/diseno",
        linkLabel: "Explorar diseño",
        linkAriaLabel:
          "Explorar el área de diseño y creatividad de FIXORA",
      },
      {
        id: "support",
        title: "Soporte técnico",
        description:
          "Diagnosticamos, reparamos y mantenemos equipos para asegurar su funcionamiento, rendimiento y continuidad.",
        href: "/servicios",
        linkLabel: "Explorar soporte",
        linkAriaLabel:
          "Explorar los servicios de soporte técnico de FIXORA",
      },
    ],
  },

  en: {
    badge: "Areas of expertise",

    title: "Everything you need to",

    highlightedTitle: "grow your projects",

    description:
      "Explore FIXORA’s main areas and find software, hardware, design, and technology support solutions in one place.",

    viewAllLabel: "Discover FIXORA",

    viewAllAriaLabel:
      "Learn more about FIXORA’s areas of expertise",

    areas: [
      {
        id: "software",
        title: "Software",
        description:
          "We develop systems, applications, and digital solutions tailored to each client’s processes and goals.",
        href: "/software",
        linkLabel: "Explore software",
        linkAriaLabel:
          "Explore FIXORA’s software area",
      },
      {
        id: "hardware",
        title: "Hardware",
        description:
          "We provide equipment, components, accessories, and guidance to select reliable and suitable technology.",
        href: "/hardware",
        linkLabel: "Explore hardware",
        linkAriaLabel:
          "Explore FIXORA’s hardware area",
      },
      {
        id: "design",
        title: "Design and creativity",
        description:
          "We create visual identities, graphic content, and digital interfaces that communicate clearly and professionally.",
        href: "/diseno",
        linkLabel: "Explore design",
        linkAriaLabel:
          "Explore FIXORA’s design and creativity area",
      },
      {
        id: "support",
        title: "Technical support",
        description:
          "We diagnose, repair, and maintain equipment to ensure reliable operation, performance, and continuity.",
        href: "/servicios",
        linkLabel: "Explore support",
        linkAriaLabel:
          "Explore FIXORA’s technical support services",
      },
    ],
  },
};

const AREA_ICONS: Record<HomeAreaId, IconType> = {
  software: FiCode,
  hardware: FiCpu,
  design: FiEdit3,
  support: FiTool,
};

const AREA_VARIANTS: Record<
  HomeAreaId,
  AreaCardVariant
> = {
  software: "blue",
  hardware: "green",
  design: "violet",
  support: "orange",
};

export default function HomeAreas() {
  const { language } = useLanguage();

  const copy =
    language === "en"
      ? HOME_AREAS_COPY.en
      : HOME_AREAS_COPY.es;

  return (
    <section
      id="areas"
      aria-labelledby="home-areas-title"
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
        variant="violet"
        size="large"
        form="circle"
        className="-left-32 top-20 opacity-40"
      />

      <HomeDecorativeShape
        variant="orange"
        size="medium"
        form="blob"
        className="-right-20 bottom-20 opacity-40"
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 -z-10",
          "bg-[radial-gradient(circle_at_center,var(--fixora-border)_1px,transparent_1px)]",
          "bg-[size:28px_28px]",
          "opacity-25",
          "[mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]",
        ].join(" ")}
      />

      <div
        className={[
          "relative z-10 mx-auto w-full",
          "max-w-[1180px]",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <HomeBadge variant="violet">
            {copy.badge}
          </HomeBadge>

          <HomeSectionTitle
            id="home-areas-title"
            as="h2"
            size="section"
            align="center"
            highlightedText={copy.highlightedTitle}
            className="mt-5"
          >
            {copy.title}
          </HomeSectionTitle>

          <HomeSectionDescription
            size="section"
            align="center"
            className="mt-5"
          >
            {copy.description}
          </HomeSectionDescription>
        </div>

        <div
          className={[
            "mt-10 grid grid-cols-1 gap-5",
            "sm:grid-cols-2",
            "lg:mt-12 lg:gap-6",
          ].join(" ")}
        >
          {copy.areas.map((area) => {
            const Icon = AREA_ICONS[area.id];

            return (
              <AreaCard
                key={area.id}
                icon={
                  <Icon
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                }
                title={area.title}
                description={area.description}
                href={area.href}
                linkLabel={area.linkLabel}
                linkAriaLabel={area.linkAriaLabel}
                variant={AREA_VARIANTS[area.id]}
              />
            );
          })}
        </div>

        <div className="mt-10 flex justify-center lg:mt-12">
          <Link
            href="/nosotros"
            aria-label={copy.viewAllAriaLabel}
            className={[
              "group inline-flex min-h-12",
              "items-center justify-center gap-2.5",
              "rounded-full border",
              "border-violet-500/25",
              "bg-violet-500/10",
              "px-6 py-3",
              "text-sm font-semibold",
              "text-violet-700",
              "shadow-sm",
              "transition-all duration-300",
              "hover:-translate-y-0.5",
              "hover:border-violet-500/40",
              "hover:bg-violet-500/15",
              "hover:shadow-lg",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-violet-500/20",
              "dark:border-violet-400/20",
              "dark:bg-violet-400/10",
              "dark:text-violet-300",
              "dark:hover:border-violet-400/35",
              "dark:hover:bg-violet-400/15",
            ].join(" ")}
          >
            <span>{copy.viewAllLabel}</span>

            <FiArrowRight
              aria-hidden="true"
              className={[
                "h-4 w-4",
                "transition-transform duration-300",
                "group-hover:translate-x-1",
              ].join(" ")}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}