import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";
import { Process } from "@/components/Process";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description:
    "Why clients choose Abundance Abodes for verified property opportunities and professional brokerage in Nigeria.",
  alternates: { canonical: "/why-choose-us" },
};

const reasons = [
  {
    title: "We check before we recommend",
    description:
      "Most listings in the market are marketed first and verified later — if at all. Ours are verified first. If a document cannot be confirmed, the property never reaches your shortlist, whatever the price.",
    highlight: "Verification",
  },
  {
    title: "We represent you, not the sale",
    description:
      "Our advice is shaped by your goals and budget. When a property is wrong for you, we say so plainly — including when the right answer is to wait or walk away.",
    highlight: "Representation",
  },
  {
    title: "We explain everything in plain language",
    description:
      "C of O, excision, Governor's Consent, deeds — you will understand what each means for your specific purchase before you sign anything, not after.",
    highlight: "Clarity",
  },
  {
    title: "We stay through handover",
    description:
      "Our involvement does not end at offer acceptance. We support documentation, consent processing, and allocation until the transaction is genuinely complete.",
    highlight: "Follow-through",
  },
];

const comparisons = [
  ["Every listing documentation-checked", "Presented as-is"],
  ["Written verification summaries", "Verbal assurances"],
  ["Buyer-side negotiation", "Seller-side pricing"],
  ["Plain-language guidance on titles", "Jargon left unexplained"],
  ["Support through consent & handover", "Ends at payment"],
];

export default function WhyChooseUsPage() {
  return (
    <>
      <PageHeader
        label="Why Choose Us"
        title="The Difference Is What Happens Before You Pay"
        description="Anyone can show you properties. We make sure the property you choose is safe to buy — and that you understand exactly why."
        crumbs={[{ label: "Why Choose Us" }]}
      />

      <section className="section-padding" aria-label="What sets us apart">
        <div className="container-site">
          <ul className="grid gap-6 md:grid-cols-2">
            {reasons.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 80}>
                <li className="card-surface h-full p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-(--shadow-lift)">
                  <span className="rounded-full bg-brand-forest px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold-light">
                    {reason.highlight}
                  </span>
                  <h2 className="mt-4 font-serif text-xl font-semibold sm:text-2xl">
                    {reason.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-brand-muted">
                    {reason.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Honest comparison */}
      <section className="section-padding bg-brand-forest" aria-labelledby="compare-heading">
        <div className="container-site">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="section-label-on-dark mb-3">A Fair Comparison</p>
              <h2 id="compare-heading" className="text-3xl font-semibold tracking-tight text-brand-cream sm:text-4xl">
                What Working With Us Changes
              </h2>
            </div>
          </Reveal>
          <div className="mx-auto mt-10 max-w-3xl overflow-x-auto rounded-2xl border border-brand-forest-light">
            <table className="w-full text-left text-sm sm:text-base">
              <caption className="sr-only">
                Comparison of Abundance Abodes process against a typical unverified purchase
              </caption>
              <thead>
                <tr className="bg-brand-forest-dark text-brand-cream">
                  <th scope="col" className="px-5 py-4 font-semibold">With Abundance Abodes</th>
                  <th scope="col" className="px-5 py-4 font-semibold">Going it alone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-forest-light bg-brand-forest-dark/40">
                {comparisons.map(([withUs, alone]) => (
                  <tr key={withUs}>
                    <td className="px-5 py-4 text-brand-cream">
                      <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold align-middle text-xs text-brand-forest-dark" aria-hidden="true">✓</span>
                      {withUs}
                    </td>
                    <td className="px-5 py-4 text-brand-stone">{alone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Process />

      <ConsultationBand />
    </>
  );
}
