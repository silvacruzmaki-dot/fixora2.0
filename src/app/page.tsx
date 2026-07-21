import HomeAbout from "@/components/organisms/home/HomeAbout";
import HomeAreas from "@/components/organisms/home/HomeAreas";
import HomeBenefits from "@/components/organisms/home/HomeBenefits";
import HomeCallToAction from "@/components/organisms/home/HomeCallToAction";
import HomeContact from "@/components/organisms/home/HomeContact";
import HomeHero from "@/components/organisms/home/HomeHero";
import HomeProcess from "@/components/organisms/home/HomeProcess";
import HomeProducts from "@/components/organisms/home/HomeProducts";
import HomeProjects from "@/components/organisms/home/HomeProjects";
import HomeServices from "@/components/organisms/home/HomeServices";
import HomeTestimonials from "@/components/organisms/home/HomeTestimonials";

export default function HomePage() {
  return (
    <main
      className={[
        "min-h-screen w-full overflow-x-hidden",
        "bg-white text-slate-950",
        "transition-colors duration-300",
        "dark:bg-slate-950 dark:text-white",
      ].join(" ")}
    >
      <HomeHero />

      <HomeAbout />

      <HomeServices />

      <HomeAreas />

      <HomeBenefits />

      <HomeProcess />

      <HomeProjects />

      <HomeProducts />

      <HomeTestimonials />

      <HomeCallToAction />

      <HomeContact />
    </main>
  );
}