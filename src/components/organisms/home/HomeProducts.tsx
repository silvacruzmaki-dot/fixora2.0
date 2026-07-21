"use client";

import Link from "next/link";

import {
  FiArrowRight,
  FiBox,
} from "react-icons/fi";

import HomeBadge from "@/components/atoms/home/HomeBadge";
import HomeDecorativeShape from "@/components/atoms/home/HomeDecorativeShape";
import HomeSectionDescription from "@/components/atoms/home/HomeSectionDescription";
import HomeSectionTitle from "@/components/atoms/home/HomeSectionTitle";
import ProductCard from "@/components/molecules/home/ProductCard";
import useLanguage from "@/hooks/language/useLanguage";

type ProductId =
  | "laptop"
  | "component"
  | "accessory"
  | "software";

interface ProductContent {
  id: ProductId;
  title: string;
  description: string;
  category: string;
  badge?: string;
  image: string;
  imageAlt: string;
  href: string;
  linkLabel: string;
  linkAriaLabel: string;
}

interface HomeProductsContent {
  badge: string;
  title: string;
  highlightedTitle: string;
  description: string;
  viewAllLabel: string;
  viewAllAriaLabel: string;
  products: readonly ProductContent[];
}

const HOME_PRODUCTS_COPY: Record<
  "es" | "en",
  HomeProductsContent
> = {
  es: {
    badge: "Productos destacados",

    title: "Tecnología seleccionada para",

    highlightedTitle: "trabajar, crear y crecer",

    description:
      "Descubre una selección de equipos, componentes, accesorios y soluciones de software pensados para diferentes necesidades y presupuestos.",

    viewAllLabel: "Explorar productos",

    viewAllAriaLabel:
      "Explorar todos los productos tecnológicos de FIXORA",

    products: [
      {
        id: "laptop",
        title: "Laptops y computadoras",
        description:
          "Equipos para estudio, trabajo, diseño, programación y uso empresarial.",
        category: "Hardware",
        badge: "Equipos",
        image:
          "/images/home/products/product-laptop.webp",
        imageAlt:
          "Laptop disponible en el catálogo de FIXORA",
        href: "/hardware",
        linkLabel: "Ver equipos",
        linkAriaLabel:
          "Ver laptops y computadoras disponibles en FIXORA",
      },
      {
        id: "component",
        title: "Componentes de computadora",
        description:
          "Memorias, almacenamiento, tarjetas gráficas y componentes para mejorar el rendimiento.",
        category: "Componentes",
        badge: "Rendimiento",
        image:
          "/images/home/products/product-component.webp",
        imageAlt:
          "Componente de computadora disponible en FIXORA",
        href: "/hardware",
        linkLabel: "Ver componentes",
        linkAriaLabel:
          "Ver componentes de computadora disponibles en FIXORA",
      },
      {
        id: "accessory",
        title: "Accesorios tecnológicos",
        description:
          "Mouses, teclados, audífonos y accesorios para complementar cada espacio de trabajo.",
        category: "Accesorios",
        badge: "Complementos",
        image:
          "/images/home/products/product-accessory.webp",
        imageAlt:
          "Accesorios tecnológicos disponibles en FIXORA",
        href: "/hardware",
        linkLabel: "Ver accesorios",
        linkAriaLabel:
          "Ver accesorios tecnológicos disponibles en FIXORA",
      },
      {
        id: "software",
        title: "Soluciones de software",
        description:
          "Programas, herramientas y soluciones digitales para productividad y gestión.",
        category: "Software",
        badge: "Digital",
        image:
          "/images/home/products/product-software.webp",
        imageAlt:
          "Solución de software disponible en FIXORA",
        href: "/software",
        linkLabel: "Ver software",
        linkAriaLabel:
          "Ver soluciones de software disponibles en FIXORA",
      },
    ],
  },

  en: {
    badge: "Featured products",

    title: "Technology selected to",

    highlightedTitle: "work, create, and grow",

    description:
      "Discover a selection of equipment, components, accessories, and software solutions designed for different needs and budgets.",

    viewAllLabel: "Explore products",

    viewAllAriaLabel:
      "Explore all FIXORA technology products",

    products: [
      {
        id: "laptop",
        title: "Laptops and computers",
        description:
          "Equipment for study, work, design, programming, and business use.",
        category: "Hardware",
        badge: "Equipment",
        image:
          "/images/home/products/product-laptop.webp",
        imageAlt:
          "Laptop available in the FIXORA catalog",
        href: "/hardware",
        linkLabel: "View equipment",
        linkAriaLabel:
          "View laptops and computers available at FIXORA",
      },
      {
        id: "component",
        title: "Computer components",
        description:
          "Memory, storage, graphics cards, and components to improve performance.",
        category: "Components",
        badge: "Performance",
        image:
          "/images/home/products/product-component.webp",
        imageAlt:
          "Computer component available at FIXORA",
        href: "/hardware",
        linkLabel: "View components",
        linkAriaLabel:
          "View computer components available at FIXORA",
      },
      {
        id: "accessory",
        title: "Technology accessories",
        description:
          "Mice, keyboards, headphones, and accessories for every workspace.",
        category: "Accessories",
        badge: "Essentials",
        image:
          "/images/home/products/product-accessory.webp",
        imageAlt:
          "Technology accessories available at FIXORA",
        href: "/hardware",
        linkLabel: "View accessories",
        linkAriaLabel:
          "View technology accessories available at FIXORA",
      },
      {
        id: "software",
        title: "Software solutions",
        description:
          "Programs, tools, and digital solutions for productivity and management.",
        category: "Software",
        badge: "Digital",
        image:
          "/images/home/products/product-software.webp",
        imageAlt:
          "Software solution available at FIXORA",
        href: "/software",
        linkLabel: "View software",
        linkAriaLabel:
          "View software solutions available at FIXORA",
      },
    ],
  },
};

export default function HomeProducts() {
  const { language } = useLanguage();

  const copy =
    language === "en"
      ? HOME_PRODUCTS_COPY.en
      : HOME_PRODUCTS_COPY.es;

  return (
    <section
      id="productos-destacados"
      aria-labelledby="home-products-title"
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
        className="-left-28 top-20 opacity-40"
      />

      <HomeDecorativeShape
        variant="green"
        size="medium"
        form="blob"
        className="-right-20 bottom-16 opacity-40"
      />

      <div
        className={[
          "relative z-10 mx-auto w-full",
          "max-w-[1180px]",
        ].join(" ")}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <HomeBadge
            variant="blue"
            icon={
              <FiBox
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
            }
          >
            {copy.badge}
          </HomeBadge>

          <HomeSectionTitle
            id="home-products-title"
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
          {copy.products.map(
            (product, index) => (
              <ProductCard
                key={product.id}
                image={product.image}
                imageAlt={product.imageAlt}
                title={product.title}
                description={product.description}
                category={product.category}
                badge={product.badge}
                href={product.href}
                linkLabel={product.linkLabel}
                linkAriaLabel={
                  product.linkAriaLabel
                }
                featured={index === 0}
              />
            ),
          )}
        </div>

        <div className="mt-10 flex justify-center lg:mt-12">
          <Link
            href="/hardware"
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