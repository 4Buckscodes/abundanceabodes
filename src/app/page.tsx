import { Hero } from "@/components/Hero";
import { FeaturedProperties } from "@/components/home/FeaturedProperties";
import { Positioning } from "@/components/home/Positioning";
import { WhyAbundance } from "@/components/home/WhyAbundance";
import { Testimonials } from "@/components/Testimonials";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { getAllProperties } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const all = await getAllProperties();

  // One curated shortlist: featured & available first, topped up with other
  // available listings, capped at six. A single fetch replaces three.
  const available = all.filter((p) => p.status !== "sold");
  const curated = [
    ...available.filter((p) => p.featured),
    ...available.filter((p) => !p.featured),
  ].slice(0, 6);

  return (
    <>
      <Hero />
      <FeaturedProperties properties={curated} />
      <Positioning />
      <WhyAbundance />
      <Testimonials />
      <ConsultationBand />
    </>
  );
}
