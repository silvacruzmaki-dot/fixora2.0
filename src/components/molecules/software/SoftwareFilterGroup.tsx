import type { ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";

interface SoftwareFilterGroupProps {
  title: string;
  children: ReactNode;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function SoftwareFilterGroup({
  title,
  children,
  className = "",
  isOpen = true,
  onToggle,
}: SoftwareFilterGroupProps) {
  const contentId = `software-filter-${title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return (
    <section
      className={[
        "border-b border-white/10 pb-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={onToggle}
        disabled={!onToggle}
        className={[
          "flex w-full items-center justify-between gap-4",
          "text-left text-sm font-bold text-white",
          "transition-colors duration-200",
          onToggle
            ? "cursor-pointer hover:text-[#72D653]"
            : "cursor-default",
          "disabled:opacity-100",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[#62C945]",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[#071018]",
        ].join(" ")}
      >
        <span>{title}</span>

        {onToggle && (
          <FiChevronDown
            aria-hidden="true"
            className={[
              "h-4 w-4 text-white/50",
              "transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0",
            ].join(" ")}
          />
        )}
      </button>

      <div
        id={contentId}
        hidden={!isOpen}
        className="mt-4"
      >
        {children}
      </div>
    </section>
  );
}