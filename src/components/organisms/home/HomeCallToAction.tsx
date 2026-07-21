"use client";

import {
  FiArrowRight,
  FiMessageCircle,
  FiZap,
} from "react-icons/fi";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import HeroActions from "@/components/molecules/home/HeroActions";
import useLanguage from "@/hooks/language/useLanguage";

interface HomeCallToActionContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryAction: string;
  primaryActionAriaLabel: string;
  secondaryAction: string;
  secondaryActionAriaLabel: string;
}

const HOME_CALL_TO_ACTION_COPY: Record<
  "es" | "en",
  HomeCallToActionContent
> = {
  es: {
    badge: "Transformemos tu idea",

    title: "¿Tienes un proyecto o necesitas una",

    highlightedTitle: "solución tecnológica?",

    description:
      "Cuéntanos qué necesitas y trabajaremos contigo para encontrar una solución funcional, moderna y adaptada a tus objetivos.",

    primaryAction: "Contactar con FIXORA",

    primaryActionAriaLabel:
      "Ir a la página de contacto de FIXORA",

    secondaryAction: "Explorar proyectos",

    secondaryActionAriaLabel:
      "Ver los proyectos desarrollados por FIXORA",
  },

  en: {
    badge: "Let’s transform your idea",

    title: "Do you have a project or need a",

    highlightedTitle: "technology solution?",

    description:
      "Tell us what you need and we will work with you to find a functional, modern solution tailored to your goals.",

    primaryAction: "Contact FIXORA",

    primaryActionAriaLabel:
      "Go to the FIXORA contact page",

    secondaryAction: "Explore projects",

    secondaryActionAriaLabel:
      "View projects developed by FIXORA",
  },
};

export default function HomeCallToAction() {
  const { language } = useLanguage();

  const copy =
    language === "en"
      ? HOME_CALL_TO_ACTION_COPY.en
      : HOME_CALL_TO_ACTION_COPY.es;

  return (
    <section
      id="llamado-a-la-accion"
      aria-labelledby="home-call-to-action-title"
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
        size="extraLarge"
        form="circle"
        className={[
          "-left-52 top-1/2",
          "-translate-y-1/2 opacity-50",
          "sm:-left-40",
        ].join(" ")}
      />

      <HomeDecorativeShape
        variant="green"
        size="large"
        form="blob"
        className={[
          "-right-28 top-10",
          "opacity-45",
        ].join(" ")}
      />

      <HomeDecorativeShape
        variant="violet"
        size="small"
        form="ring"
        blurred={false}
        className={[
          "bottom-10 right-[12%]",
          "hidden opacity-60",
          "lg:block",
        ].join(" ")}
      />

      <div
        className={[
          "relative z-10 mx-auto w-full",
          "max-w-[1180px]",
        ].join(" ")}
      >
        <div
          className={[
            "relative isolate overflow-hidden",
            "rounded-[2rem] border",
            "border-cyan-500/20",
            "bg-gradient-to-br",
            "from-cyan-50",
            "via-white",
            "to-emerald-50",
            "px-5 py-12",
            "shadow-2xl shadow-cyan-950/10",
            "transition-colors duration-300",
            "dark:border-cyan-400/15",
            "dark:from-cyan-950/45",
            "dark:via-slate-900",
            "dark:to-emerald-950/35",
            "dark:shadow-black/30",
            "sm:px-8 sm:py-14",
            "lg:px-12 lg:py-16",
          ].join(" ")}
        >
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-0 -z-10",
              "bg-[linear-gradient(to_right,var(--fixora-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--fixora-border)_1px,transparent_1px)]",
              "bg-[size:38px_38px]",
              "opacity-20",
              "[mask-image:radial-gradient(circle_at_center,black,transparent_80%)]",
            ].join(" ")}
          />

          <span
            aria-hidden="true"
            className={[
              "pointer-events-none absolute",
              "-right-16 -top-16 -z-10",
              "h-56 w-56 rounded-full",
              "bg-cyan-400/15 blur-3xl",
              "dark:bg-cyan-300/10",
            ].join(" ")}
          />

          <span
            aria-hidden="true"
            className={[
              "pointer-events-none absolute",
              "-bottom-20 -left-16 -z-10",
              "h-56 w-56 rounded-full",
              "bg-emerald-400/15 blur-3xl",
              "dark:bg-emerald-300/10",
            ].join(" ")}
          />

          <div
            className={[
              "mx-auto flex max-w-4xl",
              "flex-col items-center",
              "text-center",
            ].join(" ")}
          >
            <HomeBadge
              variant="brand"
              icon={
                <FiZap
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              }
            >
              {copy.badge}
            </HomeBadge>

            <HomeSectionTitle
              id="home-call-to-action-title"
              as="h2"
              size="section"
              align="center"
              highlightedText={
                copy.highlightedTitle
              }
              className="mt-5"
            >
              {copy.title}
            </HomeSectionTitle>

            <HomeSectionDescription
              size="section"
              align="center"
              className="mt-5 max-w-2xl"
            >
              {copy.description}
            </HomeSectionDescription>

            <HeroActions
              primaryLabel={
                copy.primaryAction
              }
              primaryHref="/contacto"
              primaryAriaLabel={
                copy.primaryActionAriaLabel
              }
              primaryIcon={
                <FiMessageCircle
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              }
              secondaryLabel={
                copy.secondaryAction
              }
              secondaryHref="/proyectos"
              secondaryAriaLabel={
                copy.secondaryActionAriaLabel
              }
              secondaryIcon={
                <FiArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              }
              className={[
                "mt-8 justify-center",
                "sm:w-auto",
              ].join(" ")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}