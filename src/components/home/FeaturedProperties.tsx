import Link from "next/link";
import type { Property } from "@/lib/types";
import { PropertyCarousel } from "@/components/property/PropertyCarousel";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type FeaturedPropertiesProps = {
  properties: Property[];
};

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  if (properties.length === 0) return null;
  return (
    <section
      id="featured"
      className="section-padding bg-brand-white"
      aria-labelledby="featured-heading"
    >
      <div className="container-site">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              label="Featured"
              title="Handpicked Opportunities"
              description="A shortlist of verified homes and land our advisors are presenting right now."
            />
            <Link href="/properties" className="btn-secondary shrink-0">
              View all properties
            </Link>
          </div>
        </Reveal>

        <Reveal>
          <PropertyCarousel properties={properties} />
        </Reveal>

        {/* Category entry points into the full catalogue */}
        <Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="text-brand-muted">Looking for something specific?</span>
            <Link href="/properties?type=home" className="link-underline">
              Browse Homes
            </Link>
            <Link href="/properties?type=land" className="link-underline">
              Browse Land
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
