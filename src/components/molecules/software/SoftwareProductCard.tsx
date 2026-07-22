"use client";

import { FiStar } from "react-icons/fi";

import {
  SoftwareBadge,
  SoftwarePrice,
  SoftwareStock,
} from "@/components/atoms/software";

import SoftwareProductActions from "./SoftwareProductActions";

import type { SoftwareProduct } from "@/types/software";

interface SoftwareProductCardProps {
  product: SoftwareProduct;
  onViewDetails: (product: SoftwareProduct) => void;
  onBuy: (product: SoftwareProduct) => void;
  onRequestQuote?: (product: SoftwareProduct) => void;
  className?: string;
}

export default function SoftwareProductCard({
  product,
  onViewDetails,
  onBuy,
  onRequestQuote,
  className = "",
}: SoftwareProductCardProps) {
  const showQuotationButton =
    product.availability === "on-request" &&
    typeof onRequestQuote === "function";

  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden",
        "rounded-2xl border border-white/10",
        "bg-[#0D1720]/90 backdrop-blur-xl",
        "shadow-[0_20px_55px_rgba(0,0,0,0.28)]",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:border-[#62C945]/40",
        "hover:shadow-[0_24px_65px_rgba(76,175,47,0.12)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        role="img"
        aria-label={product.imageAlt}
        style={{
          backgroundImage: [
            "linear-gradient(to top, rgba(7,16,24,0.95), rgba(7,16,24,0.08))",
            `url("${product.imageUrl}")`,
          ].join(", "),
        }}
        className={[
          "relative h-44 w-full overflow-hidden",
          "bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#62C945]/10 via-transparent to-cyan-400/10 transition-opacity duration-300 group-hover:opacity-80" />

        <div className="absolute left-4 top-4 z-10">
          <SoftwareBadge
            badge={product.badge}
            discountPercentage={product.discountPercentage}
          />
        </div>

        {typeof product.rating === "number" && (
          <div
            className={[
              "absolute bottom-3 right-3 z-10",
              "inline-flex items-center gap-1.5 rounded-full",
              "border border-white/15 bg-[#071018]/85",
              "px-2.5 py-1.5 text-xs font-semibold text-white",
              "backdrop-blur-md",
            ].join(" ")}
          >
            <FiStar
              aria-hidden="true"
              className="h-3.5 w-3.5 fill-amber-300 text-amber-300"
            />

            <span>{product.rating.toFixed(1)}</span>

            {typeof product.reviewCount === "number" && (
              <span className="font-normal text-white/45">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div>
          <h3
            className={[
              "text-lg font-bold tracking-tight text-white",
              "transition-colors duration-300",
              "group-hover:text-[#72D653]",
            ].join(" ")}
          >
            {product.name}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55">
            {product.shortDescription}
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {product.features.slice(0, 3).map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm leading-5 text-white/65"
            >
              <span
                aria-hidden="true"
                className={[
                  "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                  "bg-[#72D653]",
                  "shadow-[0_0_8px_rgba(114,214,83,0.75)]",
                ].join(" ")}
              />

              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5">
          <SoftwareStock
            availability={product.availability}
            showDeliveryMessage={false}
          />
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          <SoftwarePrice
            price={product.price}
            previousPrice={product.previousPrice}
            priceDetail={product.priceDetail}
            size="small"
          />
        </div>

        <div className="mt-auto pt-5">
          <SoftwareProductActions
            product={product}
            onViewDetails={onViewDetails}
            onBuy={onBuy}
            onRequestQuote={onRequestQuote}
            showQuotationButton={showQuotationButton}
            compact
          />
        </div>
      </div>

      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-8 bottom-0 h-px",
          "bg-gradient-to-r from-transparent via-[#72D653]/70 to-transparent",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
        ].join(" ")}
      />
    </article>
  );
}