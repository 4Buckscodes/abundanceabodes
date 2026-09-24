import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { Reveal } from "@/components/ui/Reveal";
import { getAllProperties } from "@/lib/data";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Book a free property consultation with Abundance Abodes: speak with an advisor about verified homes, land, and investment opportunities in Nigeria.",
  alternates: { canonical: "/consultation" },
};

const expectations = [
  "A conversation about your goals, budget, and timeline — not a sales script.",
  "Verified options matched to your brief, with honest trade-offs for each.",
  "Clear next steps, whether or not you proceed with any listing.",
];

export default async function ConsultationPage() {
  const properties = await getAllProperties();

  return (
    <>
      <PageHeader
        label="Consultation"
        title="Book Your Free Property Consultation"
        description="Thirty focused minutes with an advisor can save you months of searching — and protect you from the mistakes that cost buyers real money."
        crumbs={[{ label: "Book a Consultation" }]}
      />

      <section className="section-padding">
        <div className="container-site">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <Reveal>
              <div>
                <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                  What to expect
                </h2>
                <ul className="mt-5 space-y-4">
                  {expectations.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-brand-muted sm:text-base">
                      <span
                        aria-hidden="true"
                        className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-forest text-brand-cream"
                      >
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-2xl bg-brand-forest p-6 sm:p-7">
                  <h3 className="font-serif text-lg font-semibold text-brand-cream">
                    Consulting remotely or abroad?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-sand">
                    We regularly serve clients in the diaspora. Video
                    consultations, recorded inspections, and digital document
                    sharing mean distance is no barrier to buying safely.
                  </p>
                </div>

                <p className="mt-6 text-xs leading-relaxed text-brand-stone">
                  Your details are used only to respond to your enquiry. We do
                  not share client information with third parties.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card-surface p-6 sm:p-8 lg:p-10">
                <h2 className="font-serif text-2xl font-semibold">Request your consultation</h2>
                <p className="mt-1.5 text-sm text-brand-muted">
                  Fields marked * are required.
                </p>
                <div className="mt-6">
                  <ConsultationForm
                    properties={properties.map((p) => ({
                      slug: p.slug,
                      title: p.title,
                    }))}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
