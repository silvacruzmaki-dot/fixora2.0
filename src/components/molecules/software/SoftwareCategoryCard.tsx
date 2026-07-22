"use client";

import { FiArrowRight } from "react-icons/fi";

import type {
  SoftwareAccent,
  SoftwareCategory,
} from "@/types/software";

interface SoftwareCategoryCardProps {
  category: SoftwareCategory;
  productCount?: number;
  isActive?: boolean;
  onSelect: (categoryId: SoftwareCategory["id"]) => void;
}

const accentStyles: Record<
  SoftwareAccent,
  {
    iconContainer: string;
    icon: string;
    activeBorder: string;
    activeShadow: string;
  }
> = {
  green: {
    iconContainer:
      "border-[#62C945]/30 bg-[#62C945]/10",
    icon: "text-[#72D653]",
    activeBorder: "border-[#62C945]/70",
    activeShadow:
      "shadow-[0_0_28px_rgba(98,201,69,0.18)]",
  },

  cyan: {
    iconContainer:
      "border-cyan-400/30 bg-cyan-400/10",
    icon: "text-cyan-300",
    activeBorder: "border-cyan-400/70",
    activeShadow:
      "shadow-[0_0_28px_rgba(34,211,238,0.18)]",
  },

  blue: {
    iconContainer:
      "border-blue-400/30 bg-blue-400/10",
    icon: "text-blue-300",
    activeBorder: "border-blue-400/70",
    activeShadow:
      "shadow-[0_0_28px_rgba(96,165,250,0.18)]",
  },

  violet: {
    iconContainer:
      "border-violet-400/30 bg-violet-400/10",
    icon: "text-violet-300",
    activeBorder: "border-violet-400/70",
    activeShadow:
      "shadow-[0_0_28px_rgba(167,139,250,0.18)]",
  },

  lime: {
    iconContainer:
      "border-lime-400/30 bg-lime-400/10",
    icon: "text-lime-300",
    activeBorder: "border-lime-400/70",
    activeShadow:
      "shadow-[0_0_28px_rgba(163,230,53,0.18)]",
  },

  amber: {
    iconContainer:
      "border-amber-400/30 bg-amber-400/10",
    icon: "text-amber-300",
    activeBorder: "border-amber-400/70",
    activeShadow:
      "shadow-[0_0_28px_rgba(251,191,36,0.18)]",
  },
};

export default function SoftwareCategoryCard({
  category,
  productCount,
  isActive = false,
  onSelect,
}: SoftwareCategoryCardProps) {
  const Icon = category.icon;
  const styles = accentStyles[category.accent];

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onSelect(category.id)}
      className={[
        "group relative flex h-full w-full flex-col",
        "rounded-2xl border bg-[#101A23]/80 p-5 text-left",
        "backdrop-blur-xl transition-all duration-300",
        "hover:-translate-y-1 hover:border-[#62C945]/45",
        "hover:bg-[#13212B]",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[#62C945] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[#071018]",
        isActive
          ? `${styles.activeBorder} ${styles.activeShadow} bg-[#13231B]`
          : "border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.22)]",
      ].join(" ")}
    >
      <div className="flex w-full items-start justify-between gap-4">
        <span
          className={[
            "inline-flex h-12 w-12 shrink-0 items-center",
            "justify-center rounded-xl border",
            "transition-transform duration-300",
            "group-hover:scale-105",
            styles.iconContainer,
          ].join(" ")}
        >
          <Icon
            aria-hidden="true"
            className={[
              "h-6 w-6",
              styles.icon,
            ].join(" ")}
          />
        </span>

        {typeof productCount === "number" && (
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/55">
            {productCount}
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <h3 className="text-base font-bold text-white transition-colors duration-300 group-hover:text-[#72D653]">
          {category.name}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/55">
          {category.description}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#72D653]">
          Ver productos

          <FiArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>
      </div>

      {isActive && (
        <span
          aria-hidden="true"
          className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[#72D653] to-transparent"
        />
      )}
    </button>
  );
}