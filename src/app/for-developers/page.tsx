import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "For Developers",
  description:
    "Developer partnerships with Abundance Abodes: brokerage support for projects and estate allocations in Nigeria.",
  alternates: { canonical: "/for-developers" },
};

const services = [
  {
    title: "Buyer sourcing & matching",
    description:
      "We maintain active briefs from buyers — end-users and investors — and match them to projects that genuinely fit, so your sales conversations start qualified.",
  },
  {
    title: "Sales representation",
    description:
      "Advisors who understand your product present it accurately to the market. No overselling; mismatched expectations only create refunds and reputational drag.",
  },
  {
    title: "Allocation & documentation coordination",
    description:
      "We help coordinate allocation letters, deeds, and consent paperwork between your team and purchasers, keeping transactions moving.",
  },
  {
    title: "Market feedback",
    description:
      "Structured feedback from inspections and enquiries — pricing perception, common objections, competing supply — reported back to inform your releases.",
  },
];

const fitCriteria = [
  ["Documentation", "Title or excision status that can be verified before marketing begins."],
  ["Delivery intent", "Realistic construction milestones with evidence of progress for off-plan phases."],
  ["Transparent terms", "Payment plans, refund positions, and service charges that can be stated plainly to buyers."],
  ["Build quality", "Finishes and specifications we would put our own reputation behind."],
];

export default function ForDevelopersPage() {
  return (
    <>
      <PageHeader
        label="For Developers"
        title="A Brokerage Your Buyers Can Trust Is an Asset to Your Project"
        description="We partner selectively. When our name sits beside a development, our clients need to know it has passed scrutiny."
        crumbs={[{ label: "For Developers" }]}
      />

      <section className="section-padding" aria-label="Developer services">
        <div className="container-site">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                How We Support Your Project
              </h2>
              <ul className="mt-8 space-y-6">
                {services.map((service) => (
                  <li key={service.title} className="border-l-2 border-brand-gold pl-5">
                    <h3 className="font-serif text-lg font-semibold">{service.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-brand-muted">{service.description}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120}>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                What We Look For
              </h2>
              <ul className="mt-8 space-y-4">
                {fitCriteria.map(([title, desc]) => (
                  <li key={title} className="card-surface p-5">
                    <h3 className="font-semibold text-brand-forest">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-brand-muted">{desc}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8 rounded-2xl bg-brand-forest p-6 sm:p-7">
                <h3 className="font-serif text-lg font-semibold text-brand-cream sm:text-xl">
                  Start a partnership conversation
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-sand">
                  Book a consultation and share your project details — location,
                  product type, documentation status, and release timeline.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
