import { softwareBenefits } from "@/data/software";

import { SoftwareTrustItem } from "@/components/molecules/software";

export default function SoftwareTrustBar() {
  return (
    <section
      aria-label="Beneficios de comprar software en FIXORA"
      className={[
        "relative border-b border-white/10",
        "bg-[#071018] px-5 py-10",
        "sm:px-8 sm:py-12",
        "lg:px-12",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(circle_at_center,rgba(98,201,69,0.06),transparent_55%)]",
        ].join(" ")}
      />

      <div
        className={[
          "relative mx-auto grid w-full max-w-7xl",
          "grid-cols-1 gap-4",
          "sm:grid-cols-2",
          "xl:grid-cols-4",
        ].join(" ")}
      >
        {softwareBenefits.map((benefit) => (
          <SoftwareTrustItem
            key={benefit.id}
            benefit={benefit}
          />
        ))}
      </div>
    </section>
  );
}