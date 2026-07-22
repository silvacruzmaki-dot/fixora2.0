"use client";

import { useEffect } from "react";
import {
  FiCheck,
  FiFileText,
  FiInfo,
  FiShoppingBag,
  FiStar,
  FiX,
} from "react-icons/fi";

import {
  SoftwareBadge,
  SoftwarePrice,
  SoftwareStock,
} from "@/components/atoms/software";

import type { SoftwareProduct } from "@/types/software";

interface SoftwareProductDetailsModalProps {
  product: SoftwareProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy: (product: SoftwareProduct) => void;
  onRequestQuote: (product: SoftwareProduct) => void;
}

export default function SoftwareProductDetailsModal({
  product,
  isOpen,
  onClose,
  onBuy,
  onRequestQuote,
}: SoftwareProductDetailsModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) {
    return null;
  }

  const isAvailable = product.availability === "in-stock";

  return (
    <div
      role="presentation"
      onMouseDown={onClose}
      className={[
        "fixed inset-0 z-[100] flex items-center justify-center",
        "overflow-y-auto bg-[#02070C]/85 px-4 py-8",
        "backdrop-blur-md sm:px-6",
      ].join(" ")}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="software-modal-title"
        aria-describedby="software-modal-description"
        onMouseDown={(event) => event.stopPropagation()}
        className={[
          "relative w-full max-w-5xl overflow-hidden",
          "rounded-3xl border border-white/15",
          "bg-[#09141D]",
          "shadow-[0_40px_120px_rgba(0,0,0,0.7)]",
        ].join(" ")}
      >
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute inset-0",
            "bg-[radial-gradient(circle_at_15%_20%,rgba(98,201,69,0.12),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(34,211,238,0.1),transparent_32%)]",
          ].join(" ")}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalles del producto"
          title="Cerrar"
          className={[
            "absolute right-4 top-4 z-30",
            "inline-flex h-10 w-10 items-center justify-center",
            "rounded-xl border border-white/15",
            "bg-[#071018]/85 text-white/65",
            "backdrop-blur-md transition-all duration-200",
            "hover:border-[#62C945]/45",
            "hover:bg-[#62C945]/15",
            "hover:text-[#72D653]",
            "focus-visible:outline-none",
            "focus-visible:ring-2",
            "focus-visible:ring-[#62C945]",
          ].join(" ")}
        >
          <FiX
            aria-hidden="true"
            className="h-5 w-5"
          />
        </button>

        <div className="relative grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-72 overflow-hidden lg:min-h-[650px]">
            <div
              role="img"
              aria-label={product.imageAlt}
              style={{
                backgroundImage: [
                  "linear-gradient(to top, rgba(7,16,24,0.98), rgba(7,16,24,0.15))",
                  `url("${product.imageUrl}")`,
                ].join(", "),
              }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-[#62C945]/10 via-transparent to-cyan-400/10" />

            <div className="absolute left-5 top-5 z-10">
              <SoftwareBadge
                badge={product.badge}
                discountPercentage={product.discountPercentage}
              />
            </div>

            <div
              className={[
                "absolute inset-x-5 bottom-5 z-10",
                "rounded-2xl border border-white/15",
                "bg-[#071018]/80 p-5 backdrop-blur-xl",
              ].join(" ")}
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#72D653]">
                Producto digital FIXORA
              </p>

              <p className="mt-2 text-sm leading-6 text-white/65">
                Licencia original, asesoría especializada y
                acompañamiento durante el proceso de activación.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col p-6 sm:p-8 lg:p-10">
            <div className="pr-10">
              <div className="flex flex-wrap items-center gap-3">
                <SoftwareStock
                  availability={product.availability}
                  showDeliveryMessage
                />

                {typeof product.rating === "number" && (
                  <div
                    className={[
                      "inline-flex items-center gap-1.5",
                      "rounded-full border border-amber-300/25",
                      "bg-amber-300/10 px-3 py-1.5",
                      "text-xs font-semibold text-amber-200",
                    ].join(" ")}
                  >
                    <FiStar
                      aria-hidden="true"
                      className="h-3.5 w-3.5 fill-amber-300 text-amber-300"
                    />

                    <span>{product.rating.toFixed(1)}</span>

                    {typeof product.reviewCount === "number" && (
                      <span className="text-white/45">
                        ({product.reviewCount} reseñas)
                      </span>
                    )}
                  </div>
                )}
              </div>

              <h2
                id="software-modal-title"
                className={[
                  "mt-6 text-3xl font-black",
                  "tracking-[-0.035em] text-white",
                  "sm:text-4xl",
                ].join(" ")}
              >
                {product.name}
              </h2>

              <p
                id="software-modal-description"
                className="mt-4 text-sm leading-7 text-white/65 sm:text-base"
              >
                {product.fullDescription}
              </p>
            </div>

            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <div
                className={[
                  "rounded-2xl border border-white/10",
                  "bg-white/[0.035] p-5",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <FiCheck
                    aria-hidden="true"
                    className="h-5 w-5 text-[#72D653]"
                  />

                  <h3 className="font-bold text-white">
                    Características
                  </h3>
                </div>

                <ul className="mt-4 space-y-3">
                  {product.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-white/65"
                    >
                      <span
                        aria-hidden="true"
                        className={[
                          "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                          "bg-[#72D653]",
                          "shadow-[0_0_8px_rgba(114,214,83,0.8)]",
                        ].join(" ")}
                      />

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={[
                  "rounded-2xl border border-white/10",
                  "bg-white/[0.035] p-5",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <FiInfo
                    aria-hidden="true"
                    className="h-5 w-5 text-cyan-300"
                  />

                  <h3 className="font-bold text-white">
                    Requisitos
                  </h3>
                </div>

                {product.requirements &&
                product.requirements.length > 0 ? (
                  <ul className="mt-4 space-y-3">
                    {product.requirements.map((requirement) => (
                      <li
                        key={requirement}
                        className="flex items-start gap-3 text-sm leading-6 text-white/65"
                      >
                        <span
                          aria-hidden="true"
                          className={[
                            "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                            "bg-cyan-300",
                            "shadow-[0_0_8px_rgba(103,232,249,0.7)]",
                          ].join(" ")}
                        />

                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-white/50">
                    Los requisitos serán confirmados durante la
                    asesoría de compra.
                  </p>
                )}
              </div>
            </div>

            <div
              className={[
                "mt-7 rounded-2xl border",
                "border-[#62C945]/20",
                "bg-[#62C945]/[0.07] p-5",
              ].join(" ")}
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                Precio del producto
              </p>

              <div className="mt-3">
                <SoftwarePrice
                  price={product.price}
                  previousPrice={product.previousPrice}
                  priceDetail={product.priceDetail}
                  size="large"
                />
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onRequestQuote(product)}
                className={[
                  "inline-flex min-h-12 items-center justify-center gap-2.5",
                  "rounded-xl border border-cyan-300/35",
                  "bg-cyan-300/10 px-5",
                  "text-sm font-bold text-cyan-200",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:border-cyan-300/65",
                  "hover:bg-cyan-300/20",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-cyan-300",
                ].join(" ")}
              >
                <FiFileText
                  aria-hidden="true"
                  className="h-4 w-4"
                />

                Solicitar cotización
              </button>

              <button
                type="button"
                onClick={() =>
                  isAvailable
                    ? onBuy(product)
                    : onRequestQuote(product)
                }
                className={[
                  "inline-flex min-h-12 items-center justify-center gap-2.5",
                  "rounded-xl bg-[#62C945] px-5",
                  "text-sm font-black text-[#071018]",
                  "shadow-[0_0_28px_rgba(98,201,69,0.28)]",
                  "transition-all duration-300",
                  "hover:-translate-y-0.5",
                  "hover:bg-[#72D653]",
                  "hover:shadow-[0_0_36px_rgba(114,214,83,0.4)]",
                  "focus-visible:outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-[#72D653]",
                  "focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-[#09141D]",
                ].join(" ")}
              >
                <FiShoppingBag
                  aria-hidden="true"
                  className="h-4 w-4"
                />

                {isAvailable
                  ? "Comprar por WhatsApp"
                  : "Consultar disponibilidad"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}