import type { Metadata } from "next";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import ProjectCard from "@/components/molecules/home/ProjectCard";
import { FiGrid, FiGlobe } from "react-icons/fi";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Proyectos tecnológicos, páginas web, sistemas y soluciones desarrolladas por FIXORA.",
};

const PROJECTS = [
  {
    id: "celendin",
    title: "Celendín Tours",
    description:
      "Sitio web informativo para promover los atractivos turísticos de la provincia de Celendín.",
    category: "Página Web Turística",
    image: "/images/home/projects/image1.jpg",
    imageAlt: "Celendín Tours – vista previa",
    technologies: ["Next.js", "Tailwind CSS", "JavaScript"],
    href: "/proyectos/celendin",
  },
  {
    id: "vida-animal",
    title: "Vida Animal",
    description:
      "Sistema para gestión de mascotas, citas, historiales clínicos y ventas en veterinarias.",
    category: "Sistema Veterinario",
    image: "/images/home/projects/image2.jpg",
    imageAlt: "Vida Animal – vista previa",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    href: "/proyectos/vida-animal",
  },
  {
    id: "motos-peru",
    title: "Motos Perú",
    description:
      "Tienda en línea de motocicletas con catálogo de productos, filtros y carrito de compras.",
    category: "E-commerce",
    image: "/images/home/projects/image3.jpg",
    imageAlt: "Motos Perú – vista previa",
    technologies: ["React", "Node.js", "MongoDB", "JWT"],
    href: "/proyectos/motos-peru",
  },
  {
    id: "ferreteria",
    title: "Ferretería ",
    description:
      "Sistema para controlar productos, categorías, ventas, clientes y reportes en una ferretería.",
    category: "Sistema de Inventario",
    image: "/images/home/projects/image4.jpg",
    imageAlt: "Ferretería IPC – vista previa",
    technologies: ["React", "Express", "MySQL", "Tailwind"],
    href: "/proyectos/ferreteria-ipc",
  },
  {
    id: "salon",
    title: "Salón de Belleza",
    description:
      "Sitio web moderno para un salón de belleza con servicios, galería, reservas y contacto.",
    category: "Página Web",
    image: "/images/home/projects/image5.jpg",
    imageAlt: "Salón de Belleza – vista previa",
    technologies: ["Next.js", "Tailwind CSS", "EmailJS"],
    href: "/proyectos/salon-belleza",
  },
  {
    id: "task-manager",
    title: "Task Manager",
    description:
      "Aplicación para gestionar tareas diarias, con categorías, prioridades y autenticación.",
    category: "Aplicación de Tareas",
    image: "/images/home/projects/image7.jpg",
    imageAlt: "Task Manager – vista previa",
    technologies: ["React", "Firebase", "Tailwind CSS"],
    href: "/proyectos/task-manager",
  },
];

export default function ProyectosPage() {
  return (
    <main className="relative isolate overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900/95 text-white min-h-screen py-12">
      <HomeDecorativeShape
        variant="violet"
        size="extraLarge"
        form="blob"
        className="-right-44 top-6 opacity-60"
      />

      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-4xl text-center">
          <HomeBadge variant="violet" icon={<FiGrid className="h-3.5 w-3.5" />}>
            Proyectos
          </HomeBadge>

          <HomeSectionTitle
            as="h1"
            size="hero"
            align="center"
            highlightedText={"PROYECTOS"}
            className="mt-6 text-white"
          >
            Proyectos realizados
          </HomeSectionTitle>

          <HomeSectionDescription className="mt-4 text-slate-300">
            Explora los proyectos que he desarrollado: aplicaciones web,
            sistemas, diseños y soluciones tecnológicas. Los colores y estilos
            usados aquí mantienen la paleta del sitio para coherencia visual.
          </HomeSectionDescription>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              Todos
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-slate-300">
              Aplicaciones Web
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-slate-300">
              Sistemas
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-4 py-2 text-sm text-slate-300">
              Diseños
            </button>
          </div>
        </header>

        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <ProjectCard
              key={p.id}
              image={p.image}
              imageAlt={p.imageAlt}
              title={p.title}
              description={p.description}
              category={p.category}
              technologies={p.technologies}
              href={p.href}
              linkLabel="Ver proyecto"
              linkAriaLabel={`Ver ${p.title}`}
              featured={i === 0}
            />
          ))}
        </section>

        <div className="mt-12 flex items-center justify-center">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-3 rounded-full bg-fixora-green px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <FiGlobe className="h-4 w-4" />
            Contáctame
          </Link>
        </div>
      </div>
    </main>
  );
}