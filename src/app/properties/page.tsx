import { Suspense } from "react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { PropertyDiscovery } from "@/components/property/PropertyDiscovery";
import { getAllProperties } from "@/lib/data";

export const metadata: Metadata = {
  title: "Verified Properties for Sale & Investment in Nigeria | Abundance Abodes",
  description:
    "Explore verified homes, apartments, duplexes, land plots, and investment opportunities across Lagos, Ogun, Ibadan, and Abuja. Every property is title and document verified.",
  alternates: { canonical: "/properties" },
};

export const revalidate = 60;

export default async function PropertiesPage() {
  const allProperties = await getAllProperties();

  return (
    <>
      <section className="border-b border-brand-sand bg-brand-cream">
        <div className="container-site py-10 sm:py-14">
          <Breadcrumbs items={[{ label: "Properties" }]} />
          <h1 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-brand-forest sm:text-4xl lg:text-5xl">
            Verified Property Discovery
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-muted sm:text-lg">
            Browse documentation-checked homes, land, and investment opportunities across prime Nigerian locations. Every listing undergoes thorough title, survey, and legal verification before recommendation.
          </p>
        </div>
      </section>

      <section className="section-padding !pt-10" aria-label="Property discovery catalogue">
        <div className="container-site">
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center rounded-2xl border border-brand-sand bg-brand-white">
                <div className="flex items-center gap-3 text-brand-forest">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-forest border-t-transparent" />
                  <span className="text-sm font-medium">Loading property catalogue...</span>
                </div>
              </div>
            }
          >
            <PropertyDiscovery initialProperties={allProperties} />
          </Suspense>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}


