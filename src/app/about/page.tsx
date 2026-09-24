import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Abundance Abodes",
  description:
    "Learn about Abundance Abodes: a client-first real estate brokerage helping Nigerians buy, sell and invest in verified property with confidence.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Integrity over impulse",
    description:
      "We would rather lose a transaction than place a client in a questionable one. Every recommendation stands up to scrutiny — ours first, then yours.",
  },
  {
    title: "Verification is non-negotiable",
    description:
      "Documents before deposits. Titles, surveys, and ownership authority are examined on every listing we present, without exception.",
  },
  {
    title: "Clarity in every conversation",
    description:
      "No jargon walls, no pressure tactics. We explain trade-offs plainly so your decisions are informed, not rushed.",
  },
  {
    title: "Relationships outlast transactions",
    description:
      "Many clients return for second and third acquisitions. We build for that — advice that serves your next five years, not just our next sale.",
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: site.name,
    description: site.description,
    url: absoluteUrl("/about"),
    areaServed: { "@type": "Country", name: "Nigeria" },
    knowsAbout: [
      "Residential property brokerage",
      "Land acquisition advisory",
      "Property due diligence",
      "Real estate investment",
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        label="About Us"
        title="A Brokerage Built Around the Client's Side of the Table"
        description="Abundance Abodes exists to make Nigerian property ownership safer, clearer, and more rewarding for the people who take the risk — the buyers."
      />

      <section className="section-padding" aria-label="Our story">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="space-y-5 text-base leading-relaxed text-brand-muted sm:text-lg">
                <h2 className="font-serif text-2xl font-semibold sm:text-3xl text-brand-forest">
                  Our Story
                </h2>
                <p>
                  Abundance Abodes was founded on a simple observation: too many
                  Nigerians approach property with fear rather than confidence —
                  fear of omo-onile disputes, of defective documents, of money
                  lost to promises that were never verified.
                </p>
                <p>
                  We set out to build the opposite experience. A brokerage where
                  verification comes before recommendation. Where the person
                  selling you a property has personally checked the papers
                  behind it. Where questions are welcomed and answered
                  completely, because an informed client makes the best partner.
                </p>
                <p>
                  Today we serve buyers, sellers, developers, and investors —
                  but the buyer&apos;s interest remains at the centre of
                  everything we do. That is what &ldquo;client-first&rdquo;
                  actually means here.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="space-y-5 text-base leading-relaxed text-brand-muted sm:text-lg">
                <h2 className="font-serif text-2xl font-semibold sm:text-3xl text-brand-forest">
                  What We Do
                </h2>
                <ul className="space-y-4">
                  {[
                    ["Buyer representation", "Sourcing, verification, negotiation, and documentation support for homes and land."],
                    ["Seller brokerage", "Presenting genuine properties to qualified buyers with professional marketing."],
                    ["Developer support", "Connecting quality projects with the right purchasers through trusted channels."],
                    ["Investment advisory", "Land banking and portfolio guidance weighed against growth corridors and exit liquidity."],
                  ].map(([title, desc]) => (
                    <li key={title} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold"
                      />
                      <span>
                        <strong className="font-semibold text-brand-forest">{title}.</strong>{" "}
                        {desc}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 mt-8">
                  <p className="font-serif text-lg font-medium italic leading-relaxed text-brand-forest-dark">
                    &ldquo;Abundance is more than wealth — it is stability,
                    opportunity, and lasting value. An abode is more than a
                    property — it is where legacies begin.&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-brand-gold-dark">
                    The idea behind our name
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-brand-white" aria-labelledby="values-heading">
        <div className="container-site">
          <Reveal>
            <h2 id="values-heading" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              How We Work
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 80}>
                <li className="card-surface h-full p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-(--shadow-lift)">
                  <span aria-hidden="true" className="font-serif text-3xl font-semibold text-brand-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-serif text-xl font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted sm:text-base">
                    {value.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <div className="mt-10 text-center">
              <Link href="/why-choose-us" className="btn-secondary">
                See why clients choose us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
