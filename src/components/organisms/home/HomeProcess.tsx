"use client";

import {
  FiCheckCircle,
  FiCode,
  FiMessageCircle,
  FiSearch,
} from "react-icons/fi";

import type { IconType } from "react-icons";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import type { HomeIconContainerVariant } from "@/components/atoms/home/HomeIconContainer";
import ProcessStep from "@/components/molecules/home/ProcessStep";
import useLanguage from "@/hooks/language/useLanguage";

type ProcessId =
  | "contact"
  | "analysis"
  | "development"
  | "delivery";

interface ProcessContent {
  id: ProcessId;
  step: string;
  title: string;
  description: string;
}

interface HomeProcessContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  steps: readonly ProcessContent[];
}

const HOME_PROCESS_COPY: Record<
  "es" | "en",
  HomeProcessContent
> = {
  es: {
    badge: "Nuestro proceso",

    title: "Convertimos cada necesidad en una",

    highlightedTitle: "solución tecnológica funcional",

    description:
      "Trabajamos mediante un proceso claro y ordenado que nos permite comprender cada proyecto, desarrollar la mejor propuesta y acompañar al cliente hasta su implementación.",

    steps: [
      {
        id: "contact",
        step: "01",
        title: "Cuéntanos tu necesidad",
        description:
          "Conversamos contigo para conocer el problema, la idea o el proyecto que deseas desarrollar.",
      },
      {
        id: "analysis",
        step: "02",
        title: "Analizamos la solución",
        description:
          "Evaluamos los requerimientos, objetivos y recursos necesarios para plantear una propuesta adecuada.",
      },
      {
        id: "development",
        step: "03",
        title: "Diseñamos y desarrollamos",
        description:
          "Construimos la solución aplicando tecnología, diseño y buenas prácticas durante cada etapa.",
      },
      {
        id: "delivery",
        step: "04",
        title: "Entregamos y acompañamos",
        description:
          "Implementamos la solución, verificamos su funcionamiento y brindamos orientación o soporte.",
      },
    ],
  },

  en: {
    badge: "Our process",

    title: "We turn every need into a",

    highlightedTitle: "functional technology solution",

    description:
      "We follow a clear and organized process that allows us to understand every project, develop the right proposal, and support the client through implementation.",

    steps: [
      {
        id: "contact",
        step: "01",
        title: "Tell us what you need",
        description:
          "We talk with you to understand the problem, idea, or project you would like to develop.",
      },
      {
        id: "analysis",
        step: "02",
        title: "We analyze the solution",
        description:
          "We evaluate the requirements, goals, and resources needed to prepare the right proposal.",
      },
      {
        id: "development",
        step: "03",
        title: "We design and develop",
        description:
          "We build the solution using technology, design, and good practices throughout every stage.",
      },
      {
        id: "delivery",
        step: "04",
        title: "We deliver and support",
        description:
          "We implement the solution, verify its operation, and provide guidance or ongoing support.",
      },
    ],
  },
};

const PROCESS_ICONS: Record<ProcessId, IconType> = {
  contact: FiMessageCircle,
  analysis: FiSearch,
  development: FiCode,
  delivery: FiCheckCircle,
};

const PROCESS_VARIANTS: Record<
  ProcessId,
  HomeIconContainerVariant
> = {
  contact: "blue",
  analysis: "violet",
  development: "orange",
  delivery: "green",
};

export default function HomeProcess() {
  const { language } = useLanguage();

  const copy =
    language === "en"
      ? HOME_PROCESS_COPY.en
      : HOME_PROCESS_COPY.es;

  return (
    <section
      id="proceso"
      aria-labelledby="home-process-title"
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
        variant="blue"
        size="medium"
        form="blob"
        className="-right-20 bottom-20 opacity-40"
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 -z-10",
          "bg-[linear-gradient(to_right,var(--fixora-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--fixora-border)_1px,transparent_1px)]",
          "bg-[size:42px_42px]",
          "opacity-20",
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
            id="home-process-title"
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
          {copy.steps.map((processStep, index) => {
            const Icon =
              PROCESS_ICONS[processStep.id];

            return (
              <ProcessStep
                key={processStep.id}
                step={processStep.step}
                title={processStep.title}
                description={
                  processStep.description
                }
                icon={
                  <Icon
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                }
                variant={
                  PROCESS_VARIANTS[
                    processStep.id
                  ]
                }
                showConnector={
                  index < copy.steps.length - 1
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}