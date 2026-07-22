"use client";

import {
  FiArrowRight,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

import {
  SoftwareBadge,
  SoftwarePrice,
  SoftwareStock,
} from "@/components/atoms/software";

import type { SoftwareProduct } from "@/types/software";

interface SoftwareFeaturedCardProps {
  product: SoftwareProduct;
  onViewDetails: (product: SoftwareProduct) => void;
  onBuy: (product: SoftwareProduct) => void;
  className?: string;
}

export default function SoftwareFeaturedCard({
  product,
  onViewDetails,
  onBuy,
  className = "",
}: SoftwareFeaturedCardProps) {
  return (
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden",
        "rounded-3xl border border-white/10",
        "bg-[#0D1720]/90 backdrop-blur-xl",
        "shadow-[0_24px_70px_rgba(0,0,0,0.32)]",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:border-[#62C945]/40",
        "hover:shadow-[0_28px_80px_rgba(76,175,47,0.12)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-label={product.imageAlt}
        role="img"
        style={{
          backgroundImage: [
            "linear-gradient(to top, rgba(7,16,24,0.96), rgba(7,16,24,0.08))",
            `url("${product.imageUrl}")`,
          ].join(", "),
        }}
        className={[
          "relative h-52 w-full overflow-hidden",
          "bg-cover bg-center bg-no-repeat",
          "transition-transform duration-500",
          "group-hover:scale-[1.02]",
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#62C945]/10 via-transparent to-cyan-400/10" />

        <div className="absolute left-4 top-4 z-10">
          <SoftwareBadge
            badge={product.badge}
            discountPercentage={product.discountPercentage}
          />
        </div>

        {typeof product.rating === "number" && (
          <div className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#071018]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <FiStar
              aria-hidden="true"
              className="h-3.5 w-3.5 fill-amber-300 text-amber-300"
            />

            <span>{product.rating.toFixed(1)}</span>

            {typeof product.reviewCount === "number" && (
              <span className="font-normal text-white/50">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-[#72D653]">
            {product.name}
          </h3>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/60">
            {product.shortDescription}
          </p>
        </div>

        <ul className="mt-5 space-y-2.5">
          {product.features.slice(0, 3).map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm leading-5 text-white/70"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#72D653] shadow-[0_0_8px_rgba(114,214,83,0.8)]"
              />

              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <SoftwareStock
            availability={product.availability}
            showDeliveryMessage
          />
        </div>

        <div className="mt-5 border-t border-white/10 pt-5">
          <SoftwarePrice
            price={product.price}
            previousPrice={product.previousPrice}
            priceDetail={product.priceDetail}
            size="medium"
          />
        </div>

        <div className="mt-auto grid grid-cols-1 gap-3 pt-6 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className={[
              "inline-flex min-h-11 items-center justify-center gap-2",
              "rounded-xl border border-white/15 bg-white/5 px-4",
              "text-sm font-semibold text-white",
              "transition-all duration-300",
              "hover:border-[#62C945]/45 hover:bg-[#62C945]/10",
              "hover:text-[#72D653]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[#62C945]",
            ].join(" ")}
          >
            Ver detalles

            <FiArrowRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>

          <button
            type="button"
            onClick={() => onBuy(product)}
            className={[
              "inline-flex min-h-11 items-center justify-center gap-2",
              "rounded-xl bg-[#62C945] px-4",
              "text-sm font-bold text-[#071018]",
              "shadow-[0_0_22px_rgba(98,201,69,0.24)]",
              "transition-all duration-300",
              "hover:bg-[#72D653]",
              "hover:shadow-[0_0_30px_rgba(114,214,83,0.38)]",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-[#72D653] focus-visible:ring-offset-2",
              "focus-visible:ring-offset-[#071018]",
            ].join(" ")}
          >
            <FiShoppingBag
              aria-hidden="true"
              className="h-4 w-4"
            />

            Comprar
          </button>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-[#72D653]/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </article>
  );
}