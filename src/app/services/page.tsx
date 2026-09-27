import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Services",
  description:
    "How Abundance Abodes helps buyers, sellers, and developers: verified property discovery, representation, due diligence, and transaction support across Nigeria.",
  alternates: { canonical: "/services" },
};

const services = [
  {
    title: "For Buyers",
    description:
      "Verified shortlists, honest advice, and someone firmly on your side of the table — from brief to handover, first plot or fifth property.",
    href: "/for-buyers",
    cta: "How buying works",
  },
  {
    title: "For Sellers",
    description:
      "Accurate pricing, serious buyers, and a marketing process that presents your property honestly and moves it without cutting corners.",
    href: "/for-sellers",
    cta: "How selling works",
  },
  {
    title: "For Developers",
    description:
      "Buyer sourcing, sales representation, and documentation coordination for projects and estate allocations we can stand behind.",
    href: "/for-developers",
    cta: "Partner with us",
  },
  {
    title: "Property Discovery",
    description:
      "Browse a curated set of verified homes and land, filtered by location, budget, and purpose — every listing document-checked before it's published.",
    href: "/properties",
    cta: "Explore properties",
  },
  {
    title: "Due Diligence",
    description:
      "Independent title, survey, and documentation review — even on a property you found yourself. A second opinion costs far less than a bad acquisition.",
    href: "/due-diligence",
    cta: "Read the guide",
  },
  {
    title: "Advisory & Consultation",
    description:
      "A short conversation about your goals and budget, answered with verified options and an honest read on the trade-offs of each.",
    href: "/consultation",
    cta: "Book a consultation",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        label="Services"
        title="Everything We Do Sits on One Foundation: Verified First"
        description="Whether you're buying, selling, or building, the service is the same in spirit — evidence over promises, honest advice, and professional representation from brief to handover."
        crumbs={[{ label: "Services" }]}
      />

      <section className="section-padding" aria-labelledby="services-heading">
        <div className="container-site">
          <Reveal>
            <h2 id="services-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How We Can Help
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.title} delay={i * 70}>
                <li className="card-surface flex h-full flex-col p-7">
                  <h3 className="font-serif text-xl font-semibold">{service.title}</h3>
                  <p className="mt-2.5 flex-1 leading-relaxed text-brand-muted">
                    {service.description}
                  </p>
                  <Link href={service.href} className="link-underline group mt-5 text-sm">
                    {service.cta}
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

      <ConsultationBand />
    </>
  );
}
