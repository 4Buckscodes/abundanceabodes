import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "For Sellers",
  description:
    "Sell with confidence through Abundance Abodes: professional brokerage for Nigerian property sellers.",
  alternates: { canonical: "/for-sellers" },
};

const services = [
  {
    title: "Honest valuation guidance",
    description:
      "We study recent comparable transactions in your area so your pricing is ambitious but realistic — properties priced right sell; properties priced on hope sit.",
  },
  {
    title: "Documentation review first",
    description:
      "Before marketing, we help you assemble a clean document pack. Resolving title issues early prevents deals collapsing at the finish line.",
  },
  {
    title: "Qualified-buyer marketing",
    description:
      "Your property is presented to genuine buyers — people whose briefs match what you are selling, not time-wasters collecting photos.",
  },
  {
    title: "Negotiation & closing support",
    description:
      "We manage offers, counter-offers, and the paperwork trail through to completion, keeping every party accountable to agreed timelines.",
  },
];

const sellerFaq = [
  ["What documents should I have ready?", "At minimum: proof of ownership or title (C of O, registered deed, or gazetted allocation), a current survey plan, and valid identification. For estate properties, include allocation letters and any developer undertakings."],
  ["How is my property marketed?", "Through our verified listing pages, direct matching against active buyer briefs, and advisor-led introductions. We present your property accurately — misdescription only creates failed inspections."],
  ["What does it cost?", "Our commission structure is disclosed upfront in writing before any mandate begins. If we don't complete a sale, you owe no success fee."],
];

export default function ForSellersPage() {
  return (
    <>
      <PageHeader
        label="For Sellers"
        title="Sell Clearly, Sell Confidently"
        description="A well-prepared property with clean documents attracts serious buyers and commands better terms. That preparation is where we start."
        crumbs={[{ label: "For Sellers" }]}
      />

      <section className="section-padding" aria-label="Seller services">
        <div className="container-site">
          <ul className="grid gap-6 sm:grid-cols-2">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 80}>
                <li className="card-surface h-full p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-(--shadow-lift)">
                  <span aria-hidden="true" className="font-serif text-3xl font-semibold text-brand-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-3 font-serif text-xl font-semibold">{service.title}</h2>
                  <p className="mt-2 leading-relaxed text-brand-muted">{service.description}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-brand-white" aria-labelledby="seller-faq-heading">
        <div className="container-site max-w-3xl">
          <Reveal>
            <h2 id="seller-faq-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Common Seller Questions
            </h2>
          </Reveal>
          <div className="mt-8 divide-y divide-brand-sand rounded-2xl border border-brand-sand bg-brand-cream/60">
            {sellerFaq.map(([q, a]) => (
              <details key={q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-forest transition-colors hover:text-brand-gold-dark [&::-webkit-details-marker]:hidden">
                  {q}
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-stone/60 transition-transform duration-300 group-open:rotate-45 group-open:border-brand-gold"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-base">{a}</p>
              </details>
            ))}
          </div>
          <Reveal>
            <div className="mt-10 rounded-2xl bg-brand-forest p-7 text-brand-cream sm:p-9">
              <h3 className="font-serif text-xl font-semibold sm:text-2xl text-brand-cream">
                Listing with us starts with a conversation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-sand sm:text-base">
                Book a consultation and tell us about the property. If it&apos;s
                a fit for our buyer network, we&apos;ll propose a mandate and
                marketing plan in writing.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
