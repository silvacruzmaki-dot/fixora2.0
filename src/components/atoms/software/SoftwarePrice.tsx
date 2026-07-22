interface SoftwarePriceProps {
  price: number;
  previousPrice?: number;
  priceDetail?: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

const priceSizeStyles = {
  small: "text-lg",
  medium: "text-2xl",
  large: "text-3xl sm:text-4xl",
};

function formatSoftwarePrice(price: number): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export default function SoftwarePrice({
  price,
  previousPrice,
  priceDetail,
  className = "",
  size = "medium",
}: SoftwarePriceProps) {
  const hasDiscount =
    typeof previousPrice === "number" &&
    previousPrice > price;

  return (
    <div
      className={[
        "flex flex-col gap-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        <span
          className={[
            "font-extrabold leading-none tracking-tight",
            "text-[#72D653]",
            priceSizeStyles[size],
          ].join(" ")}
        >
          {formatSoftwarePrice(price)}
        </span>

        {hasDiscount && (
          <span className="text-sm font-medium text-white/40 line-through">
            {formatSoftwarePrice(previousPrice)}
          </span>
        )}
      </div>

      {priceDetail && (
        <span className="text-xs leading-relaxed text-white/55">
          {priceDetail}
        </span>
      )}
    </div>
  );
}