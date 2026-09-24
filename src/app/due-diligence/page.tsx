import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Due Diligence Guide",
  description:
    "A practical due diligence guide for Nigerian property buyers: title verification, survey review, Governor's Consent, deeds, allocations, and more.",
  alternates: { canonical: "/due-diligence" },
};

const checks = [
  {
    title: "1. Title verification",
    points: [
      "Confirm the document offered (C of O, registered deed of assignment, gazetted excision, or allocation) is authentic.",
      "Verify the seller's authority: are they the registered owner, an attorney with a valid power of attorney, or an estate acting under mandate?",
      "Check for encumbrances — mortgages, liens, or pending litigation affecting the parcel.",
    ],
  },
  {
    title: "2. Survey plan & charting",
    points: [
      "Insist on a current, registered survey plan with beacon numbers and coordinates.",
      "Chart the coordinates at the state lands bureau to confirm the land is not under government acquisition or committed.",
      "Physically walk the boundaries; confirm beacons on the ground match the plan.",
    ],
  },
  {
    title: "3. Governor's Consent status",
    points: [
      "Establish whether consent has been obtained, is in process, or is yet to apply to your transaction.",
      "Budget realistic timeframes and official fees for consent processing in your state.",
      "Never accept 'consent is not necessary' as an answer for a registrable transfer without independent legal advice.",
    ],
  },
  {
    title: "4. Deed of assignment review",
    points: [
      "Read every clause: parties, description, consideration, covenants, and conditions precedent.",
      "Ensure completion triggers payment release — never pay everything before documents are executed.",
      "Have a licensed solicitor review before signature, even when the draft came from a familiar estate developer.",
    ],
  },
  {
    title: "5. Estate & allocation confirmation",
    points: [
      "For estate purchases, confirm the scheme's documentation covers the specific plot number allocated to you.",
      "Clarify service-charge obligations, development levies, and building guidelines before committing.",
      "Visit at least twice if possible — once in dry season, once after rain tells you the truth about drainage.",
    ],
  },
  {
    title: "6. Investment assessment",
    points: [
      "Weigh location fundamentals: access roads, infrastructure projects actually underway (not just announced), and neighbourhood trajectory.",
      "Consider exit liquidity: who buys this from you in five years, and what will they pay for?",
      "Model total cost of holding — levies, fencing, security — against expected appreciation.",
    ],
  },
];

export default function DueDiligencePage() {
  return (
    <>
      <PageHeader
        label="Buyer Education"
        title="The Abundance Abodes Due Diligence Guide"
        description="Documentation is everything in the Nigerian property market. These are the six checks we run on every listing — and that every buyer should understand."
        crumbs={[{ label: "Due Diligence Guide" }]}
      />

      <section className="section-padding" aria-label="Due diligence checks">
        <div className="container-site max-w-4xl">
          <ol className="space-y-8">
            {checks.map((check, i) => (
              <Reveal key={check.title} delay={i * 60}>
                <li className="card-surface p-7 sm:p-9">
                  <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                    {check.title}
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {check.points.map((point) => (
                      <li key={point} className="flex gap-3 text-sm leading-relaxed text-brand-muted sm:text-base">
                        <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <div className="mt-10 rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-7 sm:p-9">
              <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                Want us to run these checks for you?
              </h2>
              <p className="mt-3 leading-relaxed text-brand-muted">
                Verification-before-recommendation is our standard process on
                every listing we present — and we also review properties you
                have found elsewhere. Bring the documents to a consultation and
                we&apos;ll tell you honestly what we find.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
