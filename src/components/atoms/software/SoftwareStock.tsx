import {
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import type { SoftwareAvailability } from "@/types/software";

interface SoftwareStockProps {
  availability: SoftwareAvailability;
  className?: string;
  showDeliveryMessage?: boolean;
}

const availabilityConfig: Record<
  SoftwareAvailability,
  {
    label: string;
    deliveryMessage: string;
    icon: typeof FiCheckCircle;
    containerStyles: string;
    iconStyles: string;
    dotStyles: string;
  }
> = {
  "in-stock": {
    label: "En stock",
    deliveryMessage: "Entrega digital inmediata",
    icon: FiCheckCircle,
    containerStyles:
      "border-[#62C945]/25 bg-[#62C945]/10 text-[#72D653]",
    iconStyles: "text-[#72D653]",
    dotStyles:
      "bg-[#72D653] shadow-[0_0_10px_rgba(114,214,83,0.8)]",
  },

  "on-request": {
    label: "Bajo pedido",
    deliveryMessage: "Consultar tiempo de entrega",
    icon: FiClock,
    containerStyles:
      "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
    iconStyles: "text-cyan-300",
    dotStyles:
      "bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.75)]",
  },
};

export default function SoftwareStock({
  availability,
  className = "",
  showDeliveryMessage = false,
}: SoftwareStockProps) {
  const config = availabilityConfig[availability];
  const Icon = config.icon;

  return (
    <div
      className={[
        "flex flex-wrap items-center gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "inline-flex w-fit items-center gap-2 rounded-full border",
          "px-3 py-1.5 text-xs font-semibold backdrop-blur-md",
          config.containerStyles,
        ].join(" ")}
      >
        <span
          aria-hidden="true"
          className={[
            "h-2 w-2 rounded-full",
            config.dotStyles,
          ].join(" ")}
        />

        <Icon
          aria-hidden="true"
          className={[
            "h-3.5 w-3.5",
            config.iconStyles,
          ].join(" ")}
        />

        {config.label}
      </span>

      {showDeliveryMessage && (
        <span className="text-xs text-white/50">
          {config.deliveryMessage}
        </span>
      )}
    </div>
  );
}