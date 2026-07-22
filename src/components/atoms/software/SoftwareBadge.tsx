import type { SoftwareBadgeType } from "@/types/software";

interface SoftwareBadgeProps {
  badge?: SoftwareBadgeType;
  discountPercentage?: number;
  className?: string;
}

const badgeLabels: Record<SoftwareBadgeType, string> = {
  "best-seller": "Más vendido",
  offer: "Oferta",
  new: "Nuevo",
  "perpetual-license": "Licencia permanente",
};

const badgeStyles: Record<SoftwareBadgeType, string> = {
  "best-seller":
    "border-[#62C945]/40 bg-[#62C945]/15 text-[#72D653] shadow-[0_0_18px_rgba(98,201,69,0.15)]",

  offer:
    "border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.14)]",

  new:
    "border-blue-400/40 bg-blue-400/10 text-blue-300 shadow-[0_0_18px_rgba(96,165,250,0.14)]",

  "perpetual-license":
    "border-[#4CAF2F]/40 bg-[#4CAF2F]/10 text-[#62C945] shadow-[0_0_18px_rgba(76,175,47,0.14)]",
};

export default function SoftwareBadge({
  badge,
  discountPercentage,
  className = "",
}: SoftwareBadgeProps) {
  if (!badge) {
    return null;
  }

  const label =
    badge === "offer" &&
    typeof discountPercentage === "number"
      ? `Oferta -${discountPercentage}%`
      : badgeLabels[badge];

  return (
    <span
      className={[
        "inline-flex w-fit items-center rounded-full border",
        "px-3 py-1 text-xs font-semibold leading-none",
        "whitespace-nowrap backdrop-blur-md",
        badgeStyles[badge],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
}