"use client";

import Link from "next/link";

import {
  FiArrowRight,
  FiCode,
  FiCpu,
  FiEdit3,
  FiGlobe,
  FiSettings,
  FiTool,
} from "react-icons/fi";

import type { IconType } from "react-icons";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import ServiceCard from "@/components/molecules/home/ServiceCard";
import useLanguage from "@/hooks/language/useLanguage";

type ServiceId =
  | "software"
  | "web"
  | "hardware"
  | "design"
  | "support"
  | "maintenance";

type ServiceVariant =
  | "brand"
  | "blue"
  | "green"
  | "violet"
  | "orange"
  | "neutral";

interface ServiceContent {
  id: ServiceId;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  linkAriaLabel: string;
}

interface HomeServicesContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  viewAllLabel: string;
  viewAllAriaLabel: string;
  services: readonly ServiceContent[];
}

const HOME_SERVICES_COPY: Record<
  "es" | "en",
  HomeServicesContent
> = {
  es: {
    badge: "Nuestros servicios",

    title: "Soluciones creadas para",

    highlightedTitle: "cada necesidad tecnológica",

    description:
      "Reunimos desarrollo, diseño, hardware y soporte técnico para ofrecer soluciones completas, funcionales y adaptadas a cada proyecto.",

    viewAllLabel: "Ver todos los servicios",

    viewAllAriaLabel:
      "Ver todos los servicios tecnológicos de FIXORA",

    services: [
      {
        id: "software",
        title: "Desarrollo de software",
        description:
          "Creamos sistemas y aplicaciones adaptados a los procesos, objetivos y necesidades de cada cliente.",
        href: "/software",
        linkLabel: "Conocer más",
        linkAriaLabel:
          "Conocer el servicio de desarrollo de software",
      },
      {
        id: "web",
        title: "Desarrollo web",
        description:
          "Diseñamos sitios web modernos, rápidos, responsivos y preparados para brindar una buena experiencia.",
        href: "/servicios",
        linkLabel: "Conocer más",
        linkAriaLabel:
          "Conocer el servicio de desarrollo web",
      },
      {
        id: "hardware",
        title: "Soluciones de hardware",
        description:
          "Ofrecemos equipos, componentes y asesoría para elegir tecnología confiable y adecuada para cada uso.",
        href: "/hardware",
        linkLabel: "Conocer más",
        linkAriaLabel:
          "Conocer las soluciones de hardware",
      },
      {
        id: "design",
        title: "Diseño y creatividad",
        description:
          "Construimos identidades visuales, piezas gráficas e interfaces digitales que comunican con claridad.",
        href: "/diseno",
        linkLabel: "Conocer más",
        linkAriaLabel:
          "Conocer los servicios de diseño y creatividad",
      },
      {
        id: "support",
        title: "Soporte técnico",
        description:
          "Diagnosticamos y solucionamos problemas tecnológicos para mantener equipos y sistemas funcionando.",
        href: "/servicios",
        linkLabel: "Conocer más",
        linkAriaLabel:
          "Conocer el servicio de soporte técnico",
      },
      {
        id: "maintenance",
        title: "Mantenimiento de equipos",
        description:
          "Realizamos mantenimiento preventivo y correctivo para mejorar el rendimiento y prolongar la vida útil.",
        href: "/servicios",
        linkLabel: "Conocer más",
        linkAriaLabel:
          "Conocer el servicio de mantenimiento de equipos",
      },
    ],
  },

  en: {
    badge: "Our services",

    title: "Solutions created for",

    highlightedTitle: "every technology need",

    description:
      "We combine development, design, hardware, and technical support to provide complete, functional solutions tailored to every project.",

    viewAllLabel: "View all services",

    viewAllAriaLabel:
      "View all FIXORA technology services",

    services: [
      {
        id: "software",
        title: "Software development",
        description:
          "We create systems and applications adapted to each client’s processes, goals, and specific needs.",
        href: "/software",
        linkLabel: "Learn more",
        linkAriaLabel:
          "Learn more about software development",
      },
      {
        id: "web",
        title: "Web development",
        description:
          "We design modern, fast, responsive websites prepared to provide an excellent user experience.",
        href: "/servicios",
        linkLabel: "Learn more",
        linkAriaLabel:
          "Learn more about web development",
      },
      {
        id: "hardware",
        title: "Hardware solutions",
        description:
          "We provide equipment, components, and guidance to select reliable technology for every use.",
        href: "/hardware",
        linkLabel: "Learn more",
        linkAriaLabel:
          "Learn more about hardware solutions",
      },
      {
        id: "design",
        title: "Design and creativity",
        description:
          "We build visual identities, graphic materials, and digital interfaces that communicate clearly.",
        href: "/diseno",
        linkLabel: "Learn more",
        linkAriaLabel:
          "Learn more about design and creativity services",
      },
      {
        id: "support",
        title: "Technical support",
        description:
          "We diagnose and solve technology problems to keep equipment and systems working properly.",
        href: "/servicios",
        linkLabel: "Learn more",
        linkAriaLabel:
          "Learn more about technical support",
      },
      {
        id: "maintenance",
        title: "Equipment maintenance",
        description:
          "We provide preventive and corrective maintenance to improve performance and extend equipment life.",
        href: "/servicios",
        linkLabel: "Learn more",
        linkAriaLabel:
          "Learn more about equipment maintenance",
      },
    ],
  },
};

const SERVICE_ICONS: Record<ServiceId, IconType> = {
  software: FiCode,
  web: FiGlobe,
  hardware: FiCpu,
  design: FiEdit3,
  support: FiTool,
  maintenance: FiSettings,
};

const SERVICE_VARIANTS: Record<
  ServiceId,
  ServiceVariant
> = {
  software: "blue",
  web: "brand",
  hardware: "green",
  design: "violet",
  support: "orange",
  maintenance: "neutral",
};

export default function HomeServices() {
  const { language } = useLanguage();

  const copy =
    language === "en"
      ? HOME_SERVICES_COPY.en
      : HOME_SERVICES_COPY.es;

  return (
    <section
      id="servicios"
      aria-labelledby="home-services-title"
      className={[
        "relative isolate overflow-hidden",
        "bg-white px-4 py-16",
        "transition-colors duration-300",
        "dark:bg-slate-900",
        "sm:px-6 sm:py-20",
        "lg:px-8 lg:py-24",
      ].join(" ")}
    >
      <HomeDecorativeShape
        variant="blue"
        size="large"
        form="circle"
        className="-right-28 top-20 opacity-45"
      />

      <HomeDecorativeShape
        variant="green"
        size="medium"
        form="blob"
        className="-left-20 bottom-16 opacity-40"
      />

      <div
        className={[
          "relative z-10 mx-auto w-full",
          "max-w-[1180px]",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <HomeBadge variant="brand">
            {copy.badge}
          </HomeBadge>

          <HomeSectionTitle
            id="home-services-title"
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
            "lg:mt-12 lg:grid-cols-3 lg:gap-6",
          ].join(" ")}
        >
          {copy.services.map((service, index) => {
            const Icon = SERVICE_ICONS[service.id];
            const variant =
              SERVICE_VARIANTS[service.id];

            return (
              <ServiceCard
                key={service.id}
                icon={
                  <Icon
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                }
                title={service.title}
                description={service.description}
                href={service.href}
                linkLabel={service.linkLabel}
                linkAriaLabel={
                  service.linkAriaLabel
                }
                variant={variant}
                featured={index === 0}
              />
            );
          })}
        </div>

        <div className="mt-10 flex justify-center lg:mt-12">
          <Link
            href="/servicios"
            aria-label={copy.viewAllAriaLabel}
            className={[
              "group inline-flex min-h-12",
              "items-center justify-center gap-2.5",
              "rounded-full border",
              "border-cyan-500/25",
              "bg-cyan-500/10",
              "px-6 py-3",
              "text-sm font-semibold",
              "text-cyan-700",
              "shadow-sm",
              "transition-all duration-300",
              "hover:-translate-y-0.5",
              "hover:border-cyan-500/40",
              "hover:bg-cyan-500/15",
              "hover:shadow-lg",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-cyan-500/20",
              "dark:border-cyan-400/20",
              "dark:bg-cyan-400/10",
              "dark:text-cyan-300",
              "dark:hover:border-cyan-400/35",
              "dark:hover:bg-cyan-400/15",
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