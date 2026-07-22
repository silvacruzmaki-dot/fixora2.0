"use client";

import {
  FiSearch,
  FiX,
} from "react-icons/fi";

interface SoftwareSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SoftwareSearch({
  value,
  onChange,
  placeholder = "Buscar software...",
  className = "",
}: SoftwareSearchProps) {
  const clearSearch = () => {
    onChange("");
  };

  return (
    <div
      className={[
        "relative w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <FiSearch
        aria-hidden="true"
        className={[
          "pointer-events-none absolute left-4 top-1/2",
          "h-4 w-4 -translate-y-1/2",
          "text-white/40",
        ].join(" ")}
      />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Buscar productos de software"
        autoComplete="off"
        className={[
          "min-h-12 w-full rounded-xl border",
          "border-white/10 bg-[#0D1720]/90",
          "py-3 pl-11 pr-11",
          "text-sm text-white",
          "placeholder:text-white/35",
          "outline-none backdrop-blur-xl",
          "transition-all duration-300",
          "hover:border-white/20",
          "focus:border-[#62C945]/60",
          "focus:bg-[#101D26]",
          "focus:shadow-[0_0_22px_rgba(98,201,69,0.12)]",
          "[&::-webkit-search-cancel-button]:hidden",
        ].join(" ")}
      />

      {value.length > 0 && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Limpiar búsqueda"
          title="Limpiar búsqueda"
          className={[
            "absolute right-3 top-1/2",
            "inline-flex h-8 w-8 -translate-y-1/2",
            "items-center justify-center rounded-lg",
            "text-white/45",
            "transition-all duration-200",
            "hover:bg-[#62C945]/10",
            "hover:text-[#72D653]",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-[#62C945]",
          ].join(" ")}
        >
          <FiX
            aria-hidden="true"
            className="h-4 w-4"
          />
        </button>
      )}
    </div>
  );
}