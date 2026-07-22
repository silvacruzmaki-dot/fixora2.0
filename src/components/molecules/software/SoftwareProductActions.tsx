"use client";

import {
  FiArrowRight,
  FiFileText,
  FiShoppingBag,
} from "react-icons/fi";

import type { SoftwareProduct } from "@/types/software";

interface SoftwareProductActionsProps {
  product: SoftwareProduct;
  onViewDetails: (product: SoftwareProduct) => void;
  onBuy: (product: SoftwareProduct) => void;
  onRequestQuote?: (product: SoftwareProduct) => void;
  showQuotationButton?: boolean;
  compact?: boolean;
  className?: string;
}

export default function SoftwareProductActions({
  product,
  onViewDetails,
  onBuy,
  onRequestQuote,
  showQuotationButton = false,
  compact = false,
  className = "",
}: SoftwareProductActionsProps) {
  const buttonHeight = compact ? "min-h-10" : "min-h-11";
  const buttonPadding = compact ? "px-3" : "px-4";
  const iconSize = compact ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div
      className={[
        "grid w-full gap-3",
        showQuotationButton
          ? "grid-cols-1 sm:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        onClick={() => onViewDetails(product)}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl",
          "border border-white/15 bg-white/5",
          buttonHeight,
          buttonPadding,
          "text-sm font-semibold text-white",
          "transition-all duration-300",
          "hover:border-[#62C945]/45 hover:bg-[#62C945]/10",
          "hover:text-[#72D653]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[#62C945]",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[#071018]",
        ].join(" ")}
      >
        Ver detalles

        <FiArrowRight
          aria-hidden="true"
          className={iconSize}
        />
      </button>

      {showQuotationButton && onRequestQuote && (
        <button
          type="button"
          onClick={() => onRequestQuote(product)}
          className={[
            "inline-flex items-center justify-center gap-2 rounded-xl",
            "border border-cyan-400/35 bg-cyan-400/10",
            buttonHeight,
            buttonPadding,
            "text-sm font-semibold text-cyan-200",
            "transition-all duration-300",
            "hover:border-cyan-300/70 hover:bg-cyan-400/20",
            "hover:text-cyan-100",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-cyan-300",
            "focus-visible:ring-offset-2",
            "focus-visible:ring-offset-[#071018]",
          ].join(" ")}
        >
          <FiFileText
            aria-hidden="true"
            className={iconSize}
          />

          Cotizar
        </button>
      )}

      <button
        type="button"
        onClick={() => onBuy(product)}
        className={[
          "inline-flex items-center justify-center gap-2 rounded-xl",
          "bg-[#62C945]",
          buttonHeight,
          buttonPadding,
          "text-sm font-bold text-[#071018]",
          "shadow-[0_0_22px_rgba(98,201,69,0.24)]",
          "transition-all duration-300",
          "hover:-translate-y-0.5 hover:bg-[#72D653]",
          "hover:shadow-[0_0_30px_rgba(114,214,83,0.38)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[#72D653]",
          "focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[#071018]",
        ].join(" ")}
      >
        <FiShoppingBag
          aria-hidden="true"
          className={iconSize}
        />

        Comprar
      </button>
    </div>
  );
}