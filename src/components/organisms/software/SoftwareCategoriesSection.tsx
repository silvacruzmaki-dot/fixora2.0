"use client";

import {
  softwareCategories,
  softwareProducts,
} from "@/data/software";

import { countSoftwareProductsByCategory } from "@/lib/software";

import { SoftwareCategoryCard } from "@/components/molecules/software";

import type { SoftwareCategoryId } from "@/types/software";

interface SoftwareCategoriesSectionProps {
  selectedCategoryIds: SoftwareCategoryId[];
  onSelectCategory: (categoryId: SoftwareCategoryId) => void;
}

export default function SoftwareCategoriesSection({
  selectedCategoryIds,
  onSelectCategory,
}: SoftwareCategoriesSectionProps) {
  const handleCategorySelection = (
    categoryId: SoftwareCategoryId,
  ) => {
    onSelectCategory(categoryId);

    document
      .getElementById("software-catalog")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <section
      aria-labelledby="software-categories-title"
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
          "bg-[radial-gradient(circle_at_20%_30%,rgba(98,201,69,0.08),transparent_30%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.06),transparent_32%)]",
        ].join(" ")}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span
            className={[
              "inline-flex items-center rounded-full",
              "border border-[#62C945]/30",
              "bg-[#62C945]/10 px-4 py-2",
              "text-xs font-bold uppercase tracking-[0.16em]",
              "text-[#72D653]",
            ].join(" ")}
          >
            Explora por categoría
          </span>

          <h2
            id="software-categories-title"
            className={[
              "mt-5 text-balance",
              "text-3xl font-black tracking-[-0.03em]",
              "text-white sm:text-4xl",
            ].join(" ")}
          >
            Encuentra la solución adecuada para cada necesidad
          </h2>

          <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
            Selecciona una categoría para mostrar únicamente los
            productos relacionados dentro del catálogo de software.
          </p>
        </div>

        <div
          className={[
            "mt-10 grid grid-cols-1 gap-4",
            "sm:grid-cols-2",
            "lg:grid-cols-3",
            "xl:grid-cols-6",
          ].join(" ")}
        >
          {softwareCategories.map((category) => {
            const productCount =
              countSoftwareProductsByCategory(
                softwareProducts,
                category.id,
              );

            const isActive =
              selectedCategoryIds.includes(category.id);

            return (
              <SoftwareCategoryCard
                key={category.id}
                category={category}
                productCount={productCount}
                isActive={isActive}
                onSelect={handleCategorySelection}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}