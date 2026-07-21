"use client";

import {
  FiArrowRight,
  FiCheckCircle,
  FiMessageCircle,
  FiZap,
} from "react-icons/fi";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import HeroActions from "@/components/molecules/home/HeroActions";
import HeroVisual from "@/components/molecules/home/HeroVisual";
import useLanguage from "@/hooks/language/useLanguage";

const HOME_HERO_COPY = {
  es: {
    badge: "Tecnología que transforma",

    title: "Soluciones tecnológicas para",

    highlightedTitle:
      "impulsar tus ideas",

    description:
      "En FIXORA desarrollamos software, creamos experiencias digitales y ofrecemos soluciones de hardware adaptadas a las necesidades de personas y empresas.",

    primaryAction:
      "Explorar servicios",

    primaryActionLabel:
      "Explorar los servicios de FIXORA",

    secondaryAction:
      "Hablemos",

    secondaryActionLabel:
      "Contactar con FIXORA",

    imageAlt:
      "Soluciones tecnológicas y digitales ofrecidas por FIXORA",

    features: [
      "Soluciones personalizadas",
      "Atención especializada",
      "Soporte confiable",
    ],
  },

  en: {
    badge: "Technology that transforms",

    title: "Technology solutions to",

    highlightedTitle:
      "power your ideas",

    description:
      "At FIXORA, we develop software, create digital experiences, and provide hardware solutions tailored to the needs of individuals and businesses.",

    primaryAction:
      "Explore services",

    primaryActionLabel:
      "Explore FIXORA services",

    secondaryAction:
      "Let’s talk",

    secondaryActionLabel:
      "Contact FIXORA",

    imageAlt:
      "Technology and digital solutions provided by FIXORA",

    features: [
      "Tailored solutions",
      "Specialized support",
      "Reliable assistance",
    ],
  },
} as const;

export default function HomeHero() {
  const { language } = useLanguage();

  const copy =
    HOME_HERO_COPY[language];

  return (
    <section
      id="inicio"
      aria-labelledby="home-hero-title"
      className={[
        "relative isolate overflow-hidden",
        "bg-fixora-background",
        "px-4 pb-16 pt-28",
        "transition-colors duration-300",
        "sm:px-6 sm:pb-20 sm:pt-32",
        "md:pt-36",
        "lg:flex lg:min-h-[100svh] lg:items-center",
        "lg:px-8 lg:pb-24 lg:pt-32",
      ].join(" ")}
    >
      <HomeDecorativeShape
        variant="green"
        size="extraLarge"
        form="circle"
        className={[
          "-left-52 top-20",
          "opacity-70",
          "sm:-left-44",
          "lg:-left-32 lg:top-28",
        ].join(" ")}
      />

      <HomeDecorativeShape
        variant="blue"
        size="large"
        form="blob"
        className={[
          "-right-24 top-1/3",
          "opacity-60",
          "lg:right-4 lg:top-24",
        ].join(" ")}
      />

      <HomeDecorativeShape
        variant="violet"
        size="small"
        form="ring"
        blurred={false}
        className={[
          "bottom-12 left-[8%]",
          "hidden opacity-60",
          "lg:block",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 -z-10",
          "bg-[linear-gradient(to_right,var(--fixora-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--fixora-border)_1px,transparent_1px)]",
          "bg-[size:44px_44px]",
          "opacity-30",
          "[mask-image:linear-gradient(to_bottom,black,transparent_85%)]",
        ].join(" ")}
      />

      <div
        className={[
          "relative z-10 mx-auto grid w-full",
          "max-w-[1180px]",
          "grid-cols-1 items-center gap-12",
          "lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]",
          "lg:gap-14",
          "xl:gap-20",
        ].join(" ")}
      >
        <div
          className={[
            "flex min-w-0 flex-col items-start",
            "text-left",
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
            id="home-hero-title"
            as="h1"
            size="hero"
            align="left"
            highlightedText={
              copy.highlightedTitle
            }
            className="mt-5 max-w-3xl"
          >
            {copy.title}
          </HomeSectionTitle>

          <HomeSectionDescription
            size="hero"
            align="left"
            className="mt-6 max-w-2xl"
          >
            {copy.description}
          </HomeSectionDescription>

          <HeroActions
            primaryLabel={
              copy.primaryAction
            }
            primaryHref="/servicios"
            primaryAriaLabel={
              copy.primaryActionLabel
            }
            primaryIcon={
              <FiArrowRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            }
            secondaryLabel={
              copy.secondaryAction
            }
            secondaryHref="/contacto"
            secondaryAriaLabel={
              copy.secondaryActionLabel
            }
            secondaryIcon={
              <FiMessageCircle
                aria-hidden="true"
                className="h-4 w-4"
              />
            }
            className="mt-8"
          />

          <ul
            className={[
              "mt-8 grid w-full",
              "grid-cols-1 gap-3",
              "sm:grid-cols-3",
              "lg:max-w-2xl",
            ].join(" ")}
          >
            {copy.features.map(
              (feature) => (
                <li
                  key={feature}
                  className={[
                    "flex min-w-0 items-center gap-2",
                    "text-sm font-medium",
                    "text-fixora-text-secondary",
                  ].join(" ")}
                >
                  <FiCheckCircle
                    aria-hidden="true"
                    className={[
                      "h-4 w-4 shrink-0",
                      "text-fixora-green-strong",
                      "dark:text-fixora-green",
                    ].join(" ")}
                  />

                  <span className="text-pretty">
                    {feature}
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="min-w-0">
          <HeroVisual
            lightImage="/images/home/hero/hero-light.webp"
            darkImage="/images/home/hero/hero-dark.webp"
            alt={copy.imageAlt}
            priority
          />
        </div>
      </div>
    </section>
  );
}