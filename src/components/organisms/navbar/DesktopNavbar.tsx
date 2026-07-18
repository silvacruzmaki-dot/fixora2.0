import LogoCapsule from "@/components/molecules/navbar/LogoCapsule";
import NavigationCapsule from "@/components/molecules/navbar/NavigationCapsule";
import SessionCapsule from "@/components/molecules/navbar/SessionCapsule";

export default function DesktopNavbar() {
  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50",
        "hidden md:block",
        "px-4 pt-5",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex w-full max-w-[1180px]",
          "items-center justify-between gap-4",
        ].join(" ")}
      >
        <LogoCapsule />

        <div className="flex min-w-0 flex-1 justify-center">
          <NavigationCapsule />
        </div>

        <SessionCapsule />
      </div>
    </header>
  );
}