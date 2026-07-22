import type { SoftwareBenefit } from "@/types/software";

interface SoftwareTrustItemProps {
  benefit: SoftwareBenefit;
  compact?: boolean;
  className?: string;
}

const accentStyles = {
  green: {
    container:
      "border-[#62C945]/30 bg-[#62C945]/10",
    icon: "text-[#72D653]",
    glow:
      "shadow-[0_0_24px_rgba(98,201,69,0.15)]",
  },
  cyan: {
    container:
      "border-cyan-400/30 bg-cyan-400/10",
    icon: "text-cyan-300",
    glow:
      "shadow-[0_0_24px_rgba(34,211,238,0.14)]",
  },
  blue: {
    container:
      "border-blue-400/30 bg-blue-400/10",
    icon: "text-blue-300",
    glow:
      "shadow-[0_0_24px_rgba(96,165,250,0.14)]",
  },
  violet: {
    container:
      "border-violet-400/30 bg-violet-400/10",
    icon: "text-violet-300",
    glow:
      "shadow-[0_0_24px_rgba(167,139,250,0.14)]",
  },
  lime: {
    container:
      "border-lime-400/30 bg-lime-400/10",
    icon: "text-lime-300",
    glow:
      "shadow-[0_0_24px_rgba(163,230,53,0.14)]",
  },
  amber: {
    container:
      "border-amber-400/30 bg-amber-400/10",
    icon: "text-amber-300",
    glow:
      "shadow-[0_0_24px_rgba(251,191,36,0.14)]",
  },
} satisfies Record<
  SoftwareBenefit["accent"],
  {
    container: string;
    icon: string;
    glow: string;
  }
>;

export default function SoftwareTrustItem({
  benefit,
  compact = false,
  className = "",
}: SoftwareTrustItemProps) {
  const Icon = benefit.icon;
  const styles = accentStyles[benefit.accent];

  return (
    <article
      className={[
        "group flex h-full items-center gap-4",
        "rounded-2xl border border-white/10",
        "bg-[#0D1720]/75 backdrop-blur-xl",
        "transition-all duration-300",
        "hover:-translate-y-0.5 hover:border-[#62C945]/35",
        compact ? "p-4" : "p-5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "inline-flex shrink-0 items-center justify-center",
          "rounded-xl border transition-transform duration-300",
          "group-hover:scale-105",
          compact ? "h-11 w-11" : "h-12 w-12",
          styles.container,
          styles.glow,
        ].join(" ")}
      >
        <Icon
          aria-hidden="true"
          className={[
            compact ? "h-5 w-5" : "h-6 w-6",
            styles.icon,
          ].join(" ")}
        />
      </span>

      <div className="min-w-0">
        <h3
          className={[
            "font-bold text-white",
            compact ? "text-sm" : "text-base",
          ].join(" ")}
        >
          {benefit.title}
        </h3>

        <p
          className={[
            "mt-1 leading-relaxed text-white/55",
            compact ? "text-xs" : "text-sm",
          ].join(" ")}
        >
          {benefit.description}
        </p>
      </div>
    </article>
  );
}