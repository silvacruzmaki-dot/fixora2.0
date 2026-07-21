"use client";

import Link from "next/link";

import {
  FiArrowRight,
  FiBriefcase,
} from "react-icons/fi";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import ProjectCard from "@/components/molecules/home/ProjectCard";
import useLanguage from "@/hooks/language/useLanguage";

type ProjectId =
  | "web"
  | "management"
  | "design";

interface ProjectContent {
  id: ProjectId;
  title: string;
  description: string;
  category: string;
  image: string;
  imageAlt: string;
  technologies: readonly string[];
  href: string;
  linkLabel: string;
  linkAriaLabel: string;
}

interface HomeProjectsContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  viewAllLabel: string;
  viewAllAriaLabel: string;
  projects: readonly ProjectContent[];
}

const HOME_PROJECTS_COPY: Record<
  "es" | "en",
  HomeProjectsContent
> = {
  es: {
    badge: "Proyectos destacados",

    title: "Ideas convertidas en",

    highlightedTitle: "soluciones digitales reales",

    description:
      "Conoce algunos proyectos desarrollados para resolver necesidades, optimizar procesos y crear experiencias digitales funcionales.",

    viewAllLabel: "Ver todos los proyectos",

    viewAllAriaLabel:
      "Ver todos los proyectos desarrollados por FIXORA",

    projects: [
      {
        id: "web",
        title: "Plataforma web corporativa",
        description:
          "Sitio web moderno, responsivo y optimizado para presentar servicios, proyectos e información empresarial.",
        category: "Desarrollo web",
        image:
          "/images/home/projects/project-web.webp",
        imageAlt:
          "Vista previa de una plataforma web corporativa desarrollada por FIXORA",
        technologies: [
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
        ],
        href: "/proyectos",
        linkLabel: "Ver proyecto",
        linkAriaLabel:
          "Ver el proyecto de plataforma web corporativa",
      },
      {
        id: "management",
        title: "Sistema de gestión digital",
        description:
          "Aplicación creada para organizar información, controlar procesos y facilitar el seguimiento de operaciones.",
        category: "Software",
        image:
          "/images/home/projects/project-management.webp",
        imageAlt:
          "Vista previa de un sistema de gestión digital desarrollado por FIXORA",
        technologies: [
          "React",
          "Prisma",
          "SQL Server",
        ],
        href: "/proyectos",
        linkLabel: "Ver proyecto",
        linkAriaLabel:
          "Ver el proyecto de sistema de gestión digital",
      },
      {
        id: "design",
        title: "Identidad visual y experiencia digital",
        description:
          "Propuesta gráfica diseñada para construir una imagen coherente, moderna y reconocible en medios digitales.",
        category: "Diseño",
        image:
          "/images/home/projects/project-design.webp",
        imageAlt:
          "Vista previa de un proyecto de identidad visual realizado por FIXORA",
        technologies: [
          "Branding",
          "UI Design",
          "Prototipado",
        ],
        href: "/proyectos",
        linkLabel: "Ver proyecto",
        linkAriaLabel:
          "Ver el proyecto de identidad visual y experiencia digital",
      },
    ],
  },

  en: {
    badge: "Featured projects",

    title: "Ideas transformed into",

    highlightedTitle: "real digital solutions",

    description:
      "Discover projects developed to solve specific needs, optimize processes, and create functional digital experiences.",

    viewAllLabel: "View all projects",

    viewAllAriaLabel:
      "View all projects developed by FIXORA",

    projects: [
      {
        id: "web",
        title: "Corporate web platform",
        description:
          "A modern, responsive, and optimized website created to present services, projects, and business information.",
        category: "Web development",
        image:
          "/images/home/projects/project-web.webp",
        imageAlt:
          "Preview of a corporate web platform developed by FIXORA",
        technologies: [
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
        ],
        href: "/proyectos",
        linkLabel: "View project",
        linkAriaLabel:
          "View the corporate web platform project",
      },
      {
        id: "management",
        title: "Digital management system",
        description:
          "An application created to organize information, manage processes, and improve operational monitoring.",
        category: "Software",
        image:
          "/images/home/projects/project-management.webp",
        imageAlt:
          "Preview of a digital management system developed by FIXORA",
        technologies: [
          "React",
          "Prisma",
          "SQL Server",
        ],
        href: "/proyectos",
        linkLabel: "View project",
        linkAriaLabel:
          "View the digital management system project",
      },
      {
        id: "design",
        title: "Visual identity and digital experience",
        description:
          "A graphic proposal designed to build a coherent, modern, and recognizable identity across digital media.",
        category: "Design",
        image:
          "/images/home/projects/project-design.webp",
        imageAlt:
          "Preview of a visual identity project created by FIXORA",
        technologies: [
          "Branding",
          "UI Design",
          "Prototyping",
        ],
        href: "/proyectos",
        linkLabel: "View project",
        linkAriaLabel:
          "View the visual identity and digital experience project",
      },
    ],
  },
};

export default function HomeProjects() {
  const { language } = useLanguage();

  const copy =
    language === "en"
      ? HOME_PROJECTS_COPY.en
      : HOME_PROJECTS_COPY.es;

  return (
    <section
      id="proyectos-destacados"
      aria-labelledby="home-projects-title"
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
        variant="orange"
        size="large"
        form="circle"
        className="-right-28 top-16 opacity-45"
      />

      <HomeDecorativeShape
        variant="violet"
        size="medium"
        form="blob"
        className="-left-20 bottom-12 opacity-35"
      />

      <div
        className={[
          "relative z-10 mx-auto w-full",
          "max-w-[1180px]",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <HomeBadge
            variant="orange"
            icon={
              <FiBriefcase
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
            }
          >
            {copy.badge}
          </HomeBadge>

          <HomeSectionTitle
            id="home-projects-title"
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
          {copy.projects.map(
            (project, index) => (
              <ProjectCard
                key={project.id}
                image={project.image}
                imageAlt={project.imageAlt}
                title={project.title}
                description={project.description}
                category={project.category}
                technologies={
                  project.technologies
                }
                href={project.href}
                linkLabel={project.linkLabel}
                linkAriaLabel={
                  project.linkAriaLabel
                }
                featured={index === 0}
              />
            ),
          )}
        </div>

        <div className="mt-10 flex justify-center lg:mt-12">
          <Link
            href="/proyectos"
            aria-label={copy.viewAllAriaLabel}
            className={[
              "group inline-flex min-h-12",
              "items-center justify-center gap-2.5",
              "rounded-full border",
              "border-orange-500/25",
              "bg-orange-500/10",
              "px-6 py-3",
              "text-sm font-semibold",
              "text-orange-700",
              "shadow-sm",
              "transition-all duration-300",
              "hover:-translate-y-0.5",
              "hover:border-orange-500/40",
              "hover:bg-orange-500/15",
              "hover:shadow-lg",
              "focus-visible:outline-none",
              "focus-visible:ring-4",
              "focus-visible:ring-orange-500/20",
              "dark:border-orange-400/20",
              "dark:bg-orange-400/10",
              "dark:text-orange-300",
              "dark:hover:border-orange-400/35",
              "dark:hover:bg-orange-400/15",
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