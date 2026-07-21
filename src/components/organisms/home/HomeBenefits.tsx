"use client";

import {
  FiLayers,
  FiMessageSquare,
  FiShield,
  FiTrendingUp,
  FiUserCheck,
} from "react-icons/fi";

import type { IconType } from "react-icons";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import HomeStatValue, {
  type HomeStatValueVariant,
} from "@/components/atoms/home/HomeStatValue";
import BenefitCard from "@/components/molecules/home/BenefitCard";
import useLanguage from "@/hooks/language/useLanguage";

type BenefitId =
  | "personalized"
  | "quality"
  | "communication"
  | "growth";

type BenefitVariant =
  | "brand"
  | "blue"
  | "green"
  | "violet"
  | "orange"
  | "neutral";

type StatId =
  | "areas"
  | "attention"
  | "solution";

interface BenefitContent {
  id: BenefitId;
  title: string;
  description: string;
}

interface StatContent {
  id: StatId;
  value: string;
  label: string;
}

interface HomeBenefitsContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  benefits: readonly BenefitContent[];
  stats: readonly StatContent[];
}

const HOME_BENEFITS_COPY: Record<
  "es" | "en",
  HomeBenefitsContent
> = {
  es: {
    badge: "Por qué elegir FIXORA",

    title: "Tecnología con un enfoque",

    highlightedTitle: "cercano, confiable y profesional",

    description:
      "Cada solución se desarrolla pensando en las necesidades reales del cliente, combinando atención personalizada, calidad tecnológica y acompañamiento constante.",

    benefits: [
      {
        id: "personalized",
        title: "Atención personalizada",
        description:
          "Escuchamos cada necesidad y trabajamos de manera cercana para construir una solución adecuada a cada proyecto.",
      },
      {
        id: "quality",
        title: "Calidad y confianza",
        description:
          "Utilizamos herramientas y buenas prácticas que permiten crear soluciones estables, seguras y funcionales.",
      },
      {
        id: "communication",
        title: "Comunicación clara",
        description:
          "Mantenemos informado al cliente durante cada etapa, explicando avances, decisiones y próximos pasos.",
      },
      {
        id: "growth",
        title: "Soluciones preparadas para crecer",
        description:
          "Diseñamos propuestas flexibles que pueden evolucionar junto con las nuevas necesidades del cliente.",
      },
    ],

    stats: [
      {
        id: "areas",
        value: "4",
        label: "áreas tecnológicas integradas",
      },
      {
        id: "attention",
        value: "1:1",
        label: "atención personalizada",
      },
      {
        id: "solution",
        value: "360°",
        label: "visión integral de cada solución",
      },
    ],
  },

  en: {
    badge: "Why choose FIXORA",

    title: "Technology with a",

    highlightedTitle:
      "close, reliable, and professional approach",

    description:
      "Every solution is developed around the client’s real needs, combining personalized attention, technology quality, and continuous support.",

    benefits: [
      {
        id: "personalized",
        title: "Personalized attention",
        description:
          "We listen to every need and work closely with clients to build the right solution for each project.",
      },
      {
        id: "quality",
        title: "Quality and trust",
        description:
          "We use reliable tools and good practices to create stable, secure, and functional solutions.",
      },
      {
        id: "communication",
        title: "Clear communication",
        description:
          "We keep clients informed at every stage by explaining progress, decisions, and the next steps.",
      },
      {
        id: "growth",
        title: "Solutions prepared to grow",
        description:
          "We design flexible proposals that can evolve alongside each client’s new requirements.",
      },
    ],

    stats: [
      {
        id: "areas",
        value: "4",
        label: "integrated technology areas",
      },
      {
        id: "attention",
        value: "1:1",
        label: "personalized attention",
      },
      {
        id: "solution",
        value: "360°",
        label: "complete solution perspective",
      },
    ],
  },
};

const BENEFIT_ICONS: Record<BenefitId, IconType> = {
  personalized: FiUserCheck,
  quality: FiShield,
  communication: FiMessageSquare,
  growth: FiTrendingUp,
};

const BENEFIT_VARIANTS: Record<
  BenefitId,
  BenefitVariant
> = {
  personalized: "green",
  quality: "blue",
  communication: "violet",
  growth: "orange",
};

const STAT_VARIANTS: Record<
  StatId,
  HomeStatValueVariant
> = {
  areas: "blue",
  attention: "green",
  solution: "violet",
};

export default function HomeBenefits() {
  const { language } = useLanguage();

  const copy =
    language === "en"
      ? HOME_BENEFITS_COPY.en
      : HOME_BENEFITS_COPY.es;

  return (
    <section
      id="beneficios"
      aria-labelledby="home-benefits-title"
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
        variant="green"
        size="large"
        form="circle"
        className="-left-32 bottom-12 opacity-45"
      />

      <HomeDecorativeShape
        variant="blue"
        size="medium"
        form="blob"
        className="-right-20 top-20 opacity-40"
      />

      <HomeDecorativeShape
        variant="violet"
        size="small"
        form="ring"
        blurred={false}
        className="right-[8%] top-12 hidden opacity-60 lg:block"
      />

      <div
        className={[
          "relative z-10 mx-auto w-full",
          "max-w-[1180px]",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <HomeBadge
            variant="brand"
            icon={
              <FiLayers
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
            }
          >
            {copy.badge}
          </HomeBadge>

          <HomeSectionTitle
            id="home-benefits-title"
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
            "lg:mt-12 lg:grid-cols-4 lg:gap-6",
          ].join(" ")}
        >
          {copy.benefits.map((benefit) => {
            const Icon = BENEFIT_ICONS[benefit.id];

            return (
              <BenefitCard
                key={benefit.id}
                icon={
                  <Icon
                    aria-hidden="true"
                    className="h-6 w-6"
                  />
                }
                title={benefit.title}
                description={benefit.description}
                variant={
                  BENEFIT_VARIANTS[benefit.id]
                }
              />
            );
          })}
        </div>

        <div
          className={[
            "mt-10 grid grid-cols-1 gap-6",
            "rounded-3xl border",
            "border-slate-200/80",
            "bg-slate-50/80 p-6",
            "shadow-sm backdrop-blur-xl",
            "transition-colors duration-300",
            "dark:border-white/10",
            "dark:bg-slate-950/55",
            "sm:grid-cols-3 sm:p-8",
            "lg:mt-12",
          ].join(" ")}
        >
          {copy.stats.map((stat, index) => (
            <div
              key={stat.id}
              className={[
                "relative flex justify-center",
                index > 0
                  ? [
                      "border-t border-slate-200/80 pt-6",
                      "dark:border-white/10",
                      "sm:border-l sm:border-t-0",
                      "sm:pl-6 sm:pt-0",
                    ].join(" ")
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <HomeStatValue
                value={stat.value}
                label={stat.label}
                variant={STAT_VARIANTS[stat.id]}
                size="medium"
                align="center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}