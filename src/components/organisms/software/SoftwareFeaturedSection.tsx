"use client";

import { FiArrowRight } from "react-icons/fi";

import { featuredSoftwareProducts } from "@/data/software";

import { SoftwareFeaturedCard } from "@/components/molecules/software";

import type { SoftwareProduct } from "@/types/software";

interface SoftwareFeaturedSectionProps {
  onViewDetails: (product: SoftwareProduct) => void;
  onBuy: (product: SoftwareProduct) => void;
}

export default function SoftwareFeaturedSection({
  onViewDetails,
  onBuy,
}: SoftwareFeaturedSectionProps) {
  const scrollToCatalog = () => {
    document
      .getElementById("software-catalog")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section
      aria-labelledby="software-featured-title"
      className={[
        "relative overflow-hidden",
        "border-b border-white/10",
        "bg-[#071018]",
        "px-5 py-16",
        "sm:px-8 sm:py-20",
        "lg:px-12",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(circle_at_15%_25%,rgba(98,201,69,0.08),transparent_30%),radial-gradient(circle_at_85%_75%,rgba(34,211,238,0.06),transparent_32%)]",
        ].join(" ")}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div
          className={[
            "flex flex-col gap-6",
            "md:flex-row md:items-end md:justify-between",
          ].join(" ")}
        >
          <div className="max-w-3xl">
            <span
              className={[
                "inline-flex items-center rounded-full",
                "border border-[#62C945]/30",
                "bg-[#62C945]/10 px-4 py-2",
                "text-xs font-bold uppercase tracking-[0.16em]",
                "text-[#72D653]",
              ].join(" ")}
            >
              Selección FIXORA
            </span>

            <h2
              id="software-featured-title"
              className={[
                "mt-5 text-3xl font-black",
                "tracking-[-0.03em] text-white",
                "sm:text-4xl",
              ].join(" ")}
            >
              Productos destacados
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
              Conoce nuestras soluciones más solicitadas,
              seleccionadas por su rendimiento, seguridad y
              facilidad de activación.
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToCatalog}
            className={[
              "group inline-flex w-fit items-center gap-2",
              "rounded-xl border border-white/10",
              "bg-white/5 px-4 py-3",
              "text-sm font-bold text-white/75",
              "transition-all duration-300",
              "hover:border-[#62C945]/40",
              "hover:bg-[#62C945]/10",
              "hover:text-[#72D653]",
              "focus-visible:outline-none",
              "focus-visible:ring-2",
              "focus-visible:ring-[#62C945]",
              "focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[#071018]",
            ].join(" ")}
          >
            Ver todo el catálogo

            <FiArrowRight
              aria-hidden="true"
              className={[
                "h-4 w-4",
                "transition-transform duration-300",
                "group-hover:translate-x-1",
              ].join(" ")}
            />
          </button>
        </div>

        <div
          className={[
            "mt-10 grid grid-cols-1 gap-6",
            "md:grid-cols-2",
            "xl:grid-cols-3",
          ].join(" ")}
        >
          {featuredSoftwareProducts.map((product) => (
            <SoftwareFeaturedCard
              key={product.id}
              product={product}
              onViewDetails={onViewDetails}
              onBuy={onBuy}
            />
          ))}
        </div>
      </div>
    </section>
  );
}