import LoginButton from "@/components/atoms/navbar/LoginButton";

export default function SessionCapsule() {
  return (
    <div
      className={[
        "flex min-h-16 shrink-0",
        "items-center justify-center",
        "rounded-fixora-capsule",
        "border border-fixora-border",
        "bg-fixora-surface",
        "p-2",
        "shadow-fixora-navbar",
        "backdrop-blur-xl",
        "transition-[background-color,border-color,box-shadow]",
        "duration-300 ease-out",
        "hover:border-fixora-border-strong",
      ].join(" ")}
    >
      <LoginButton />
    </div>
  );
}