"use client";

import { FiChevronDown, FiSliders } from "react-icons/fi";

import { softwareSortOptions } from "@/data/software";

import type { SoftwareSortOption } from "@/types/software";

interface SoftwareSortProps {
  value: SoftwareSortOption;
  onChange: (value: SoftwareSortOption) => void;
  className?: string;
}

export default function SoftwareSort({
  value,
  onChange,
  className = "",
}: SoftwareSortProps) {
  return (
    <div
      className={[
        "flex w-full flex-col gap-2 sm:w-auto sm:flex-row",
        "sm:items-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label
        htmlFor="software-sort"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/60"
      >
        <FiSliders
          aria-hidden="true"
          className="h-4 w-4 text-[#72D653]"
        />

        Ordenar por:
      </label>

      <div className="relative min-w-56">
        <select
          id="software-sort"
          value={value}
          onChange={(event) =>
            onChange(event.target.value as SoftwareSortOption)
          }
          className={[
            "min-h-11 w-full appearance-none rounded-xl border",
            "border-white/10 bg-[#0D1720]/90",
            "py-2.5 pl-4 pr-11",
            "text-sm font-semibold text-white",
            "outline-none backdrop-blur-xl",
            "transition-all duration-300",
            "hover:border-white/20",
            "focus:border-[#62C945]/60",
            "focus:shadow-[0_0_22px_rgba(98,201,69,0.12)]",
            "cursor-pointer",
          ].join(" ")}
        >
          {softwareSortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#0D1720] text-white"
            >
              {option.label}
            </option>
          ))}
        </select>

        <FiChevronDown
          aria-hidden="true"
          className={[
            "pointer-events-none absolute right-4 top-1/2",
            "h-4 w-4 -translate-y-1/2",
            "text-[#72D653]",
          ].join(" ")}
        />
      </div>
    </div>
  );
}