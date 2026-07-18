import Image from "next/image";

export default function FixoraLogo() {
  return (
    <Image
      src="/brand/fixora-symbol.png"
      alt="FIXORA"
      width={50}
      height={50}
      priority
      draggable={false}
      className={[
        "h-[50px] w-[50px]",
        "select-none object-contain",
      ].join(" ")}
    />
  );
}