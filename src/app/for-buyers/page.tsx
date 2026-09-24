import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "For Buyers",
  description:
    "Guidance for Nigerian property buyers: verified listings, due diligence support, and professional representation from Abundance Abodes.",
  alternates: { canonical: "/for-buyers" },
};

const steps = [
  {
    title: "Tell us your brief",
    description:
      "Goals, budget, preferred locations, timeline. The clearer the brief, the sharper the shortlist.",
  },
  {
    title: "Receive a verified shortlist",
    description:
      "We present only properties whose documents we have examined — with honest notes on the trade-offs of each.",
  },
  {
    title: "Inspect with confidence",
    description:
      "Physical or virtual viewings with an advisor present. Diaspora clients receive recorded walkthroughs.",
  },
  {
    title: "Offer, verification summary & negotiation",
    description:
      "We negotiate on your behalf and share a written summary of everything our checks confirmed.",
  },
  {
    title: "Documentation & handover",
    description:
      "Deed preparation, consent guidance, and allocation — supported through to final handover.",
  },
];

const buyerTypes = [
  ["First-time buyers", "Extra patience, plain-language explanations, and realistic budgeting help — including the fees most first-timers forget to plan for."],
  ["Family home buyers", "School runs, estate security, service charges, and space to grow — weighed alongside price."],
  ["Diaspora buyers", "Video consultations, recorded inspections, digital document sharing, and trusted local execution on your behalf."],
  ["Investors", "Land banking and rental-yield plays assessed for growth corridors, exit liquidity, and holding costs."],
];

export default function ForBuyersPage() {
  return (
    <>
      <PageHeader
        label="For Buyers"
        title="Buy With Confidence, Not Luck"
        description="Whether it's your first plot or your fifth property, you deserve the same thing: verified documents, honest advice, and someone firmly on your side of the table."
        crumbs={[{ label: "For Buyers" }]}
      />

      <section className="section-padding" aria-labelledby="buyer-process-heading">
        <div className="container-site">
          <Reveal>
            <h2 id="buyer-process-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How Buying Works With Us
            </h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 70}>
                <li className="card-surface flex h-full flex-col p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold font-serif text-sm font-bold text-brand-forest-dark"
                  >
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold leading-snug">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {step.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>

          <div className="mt-14 rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6 sm:p-8">
            <p className="text-sm leading-relaxed text-brand-forest-dark sm:text-base">
              <strong className="font-semibold">Our promise to buyers:</strong>{" "}
              if a property fails our documentation review, we tell you — even
              when you found it yourself and only asked us to check. A second
              opinion costs far less than a bad acquisition.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-white" aria-labelledby="buyer-types-heading">
        <div className="container-site">
          <Reveal>
            <h2 id="buyer-types-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Whatever Kind of Buyer You Are
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {buyerTypes.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 80}>
                <li className="h-full rounded-2xl border border-brand-sand bg-brand-cream/60 p-7">
                  <h3 className="font-serif text-xl font-semibold">{title}</h3>
                  <p className="mt-2.5 leading-relaxed text-brand-muted">{desc}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/properties" className="btn-primary">
                Browse Verified Properties
              </Link>
              <Link href="/due-diligence" className="btn-secondary">
                Read the Due Diligence Guide
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
