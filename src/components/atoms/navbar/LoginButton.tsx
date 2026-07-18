import Link from "next/link";
import { FiLogIn } from "react-icons/fi";

import NavigationIcon from "@/components/atoms/navbar/NavigationIcon";

export default function LoginButton() {
  return (
    <Link
      href="/iniciar-sesion"
      aria-label="Ir a iniciar sesión"
      style={{ color: "#ffffff" }}
      className={[
        "group",
        "inline-flex h-12 shrink-0",
        "items-center justify-center gap-2.5",
        "rounded-fixora-capsule",
        "bg-fixora-green-strong",
        "px-5",
        "text-sm font-semibold",
        "shadow-fixora-soft",
        "transition-[background-color,transform,box-shadow]",
        "duration-300 ease-out",
        "hover:-translate-y-0.5",
        "hover:bg-fixora-green-hover",
        "hover:shadow-fixora-hover",
        "active:translate-y-0",
      ].join(" ")}
    >
      <NavigationIcon
        icon={FiLogIn}
        size={20}
        className={[
          "text-white",
          "transition-transform duration-300",
          "group-hover:translate-x-0.5",
        ].join(" ")}
      />

      <span className="whitespace-nowrap text-white">
        Iniciar sesión
      </span>
    </Link>
  );
}