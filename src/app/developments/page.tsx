import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Developments",
  description:
    "New-build homes, estate allocations, and development-ready land represented by Abundance Abodes — every project vetted before it reaches you.",
  alternates: { canonical: "/developments" },
};

const categories = [
  {
    title: "Off-plan & new-build homes",
    description:
      "Duplexes, terraces, and apartments released ahead of or during construction. We track delivery milestones and only present phases with genuine, verifiable progress.",
    href: "/properties?type=home",
    cta: "Browse homes",
  },
  {
    title: "Estate land allocations",
    description:
      "Serviced plots within planned estates — allocation letters, deeds, and consent paperwork coordinated so your title stands up to scrutiny.",
    href: "/properties?type=land",
    cta: "Browse land",
  },
  {
    title: "Development-ready land",
    description:
      "Multi-acre parcels in growth corridors suited to residential, commercial, or mixed-use projects, assessed for title, access, and exit liquidity.",
    href: "/properties?type=land",
    cta: "Browse land",
  },
];

const vetting = [
  ["Title & documentation", "Excision, C of O, deeds, and survey verified before a development is ever marketed to our clients."],
  ["Delivery evidence", "For off-plan phases we look for real construction progress — not renders — and realistic milestone dates."],
  ["Transparent terms", "Payment plans, refund positions, and service charges stated plainly, in writing, with no moving goalposts."],
  ["Build quality", "Finishes and specifications we would put our own reputation behind before attaching our name."],
];

export default function DevelopmentsPage() {
  return (
    <>
      <PageHeader
        label="Developments"
        title="New Developments, Vetted Before They Reach You"
        description="We represent a selective slate of projects — off-plan homes, estate allocations, and development-ready land. Each one passes the same documentation and delivery scrutiny we would demand as buyers ourselves."
        crumbs={[{ label: "Developments" }]}
      />

      <section className="section-padding" aria-labelledby="dev-categories-heading">
        <div className="container-site">
          <Reveal>
            <h2 id="dev-categories-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What We Represent
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Reveal key={cat.title} delay={i * 80}>
                <li className="card-surface flex h-full flex-col p-7">
                  <h3 className="font-serif text-xl font-semibold">{cat.title}</h3>
                  <p className="mt-2.5 flex-1 leading-relaxed text-brand-muted">
                    {cat.description}
                  </p>
                  <Link href={cat.href} className="link-underline group mt-5 text-sm">
                    {cat.cta}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-padding bg-brand-white" aria-labelledby="dev-vetting-heading">
        <div className="container-site">
          <Reveal>
            <h2 id="dev-vetting-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How We Vet a Development
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {vetting.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 80}>
                <li className="h-full rounded-2xl border border-brand-sand bg-brand-cream/60 p-7">
                  <h3 className="font-serif text-lg font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-brand-muted">{desc}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/properties" className="btn-primary">
                Explore Current Listings
              </Link>
              <Link href="/for-developers" className="btn-secondary">
                Developing a Project? Partner With Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
