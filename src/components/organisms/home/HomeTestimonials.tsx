"use client";

import {
  FiMessageSquare,
} from "react-icons/fi";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import TestimonialCard from "@/components/molecules/home/TestimonialCard";
import useLanguage from "@/hooks/language/useLanguage";

interface TestimonialContent {
  id: string;
  quote: string;
  authorName: string;
  authorRole?: string;
  company?: string;
  avatar?: string;
  avatarAlt?: string;
  fallbackAvatar?: string;
  rating?: number;
  ratingLabel: string;
  featured?: boolean;
}

interface HomeTestimonialsContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  testimonials: readonly TestimonialContent[];
}

const HOME_TESTIMONIALS_COPY: Record<
  "es" | "en",
  HomeTestimonialsContent
> = {
  es: {
    badge: "Experiencias de clientes",

    title: "La confianza se construye con",

    highlightedTitle: "resultados y buenas experiencias",

    description:
      "Conoce la experiencia de personas y empresas que confiaron en FIXORA para desarrollar sus proyectos y resolver sus necesidades tecnológicas.",

    /*
     * Agregar únicamente testimonios reales.
     * Mientras esta lista permanezca vacía,
     * la sección no se mostrará en Inicio.
     */
    testimonials: [],
  },

  en: {
    badge: "Client experiences",

    title: "Trust is built through",

    highlightedTitle: "results and great experiences",

    description:
      "Discover the experience of individuals and businesses that trusted FIXORA to develop their projects and solve their technology needs.",

    /*
     * Add real testimonials only.
     * While this list remains empty,
     * the section will not appear on Home.
     */
    testimonials: [],
  },
};

export default function HomeTestimonials() {
  const { language } = useLanguage();

  const copy =
    language === "en"
      ? HOME_TESTIMONIALS_COPY.en
      : HOME_TESTIMONIALS_COPY.es;

  /*
   * Evita mostrar testimonios inventados.
   * La sección se activará automáticamente
   * cuando se agregue al menos uno real.
   */
  if (copy.testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonios"
      aria-labelledby="home-testimonials-title"
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
        variant="violet"
        size="large"
        form="circle"
        className="-left-28 top-20 opacity-40"
      />

      <HomeDecorativeShape
        variant="blue"
        size="medium"
        form="blob"
        className="-right-20 bottom-16 opacity-35"
      />

      <div
        className={[
          "relative z-10 mx-auto w-full",
          "max-w-[1180px]",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <HomeBadge
            variant="violet"
            icon={
              <FiMessageSquare
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
            }
          >
            {copy.badge}
          </HomeBadge>

          <HomeSectionTitle
            id="home-testimonials-title"
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
            "md:grid-cols-2",
            "lg:mt-12 lg:grid-cols-3 lg:gap-6",
          ].join(" ")}
        >
          {copy.testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              quote={testimonial.quote}
              authorName={testimonial.authorName}
              authorRole={testimonial.authorRole}
              company={testimonial.company}
              avatar={testimonial.avatar}
              avatarAlt={testimonial.avatarAlt}
              fallbackAvatar={
                testimonial.fallbackAvatar
              }
              rating={testimonial.rating}
              ratingLabel={testimonial.ratingLabel}
              featured={testimonial.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}