import { Hero } from "@/components/Hero";
import { HeroSearch } from "@/components/home/HeroSearch";
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
      {/* Search band, relocated out of the hero to keep the hero clean. */}
      <section className="border-b border-brand-sand bg-brand-cream" aria-label="Search properties">
        <div className="container-site py-10 sm:py-12">
          <HeroSearch />
        </div>
      </section>
      <FeaturedProperties properties={curated} />
      <Positioning />
      <WhyAbundance />
      <Testimonials />
      <ConsultationBand />
    </>
  );
}

