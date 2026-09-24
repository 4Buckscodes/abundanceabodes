import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { Reveal } from "@/components/ui/Reveal";
import { getAllProperties } from "@/lib/data";
import { siteContent } from "@/lib/data/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Abundance Abodes about residential properties, verified land, and investment opportunities across Nigeria.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const properties = await getAllProperties();

  return (
    <>
      <PageHeader
        label="Contact"
        title="Let's Talk About Your Property Goals"
        description="Send a message below and an advisor will respond personally. Prefer a structured conversation? Book a consultation instead."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="section-padding">
        <div className="container-site">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-xl font-semibold">How to reach us</h2>
                  <p className="mt-3 leading-relaxed text-brand-muted">
                    Our advisory team responds personally to every enquiry,
                    usually within one business day.
                  </p>
                </div>

                <ul className="space-y-5 text-sm sm:text-base">
                  <li className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-forest text-brand-gold-light"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-semibold text-brand-forest">Email</p>
                      <p className="mt-0.5 text-brand-muted">
                        Send us a message through the form — it reaches the
                        whole advisory team.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-forest text-brand-gold-light"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-semibold text-brand-forest">Consultations</p>
                      <p className="mt-0.5 text-brand-muted">
                        Weekdays and Saturdays, in person or by video call —
                        whichever suits you.
                      </p>
                    </div>
                  </li>
                  {siteContent.addressLines ? (
                    <li className="flex gap-3.5">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-forest text-brand-gold-light"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-semibold text-brand-forest">Coverage</p>
                        <p className="mt-0.5 text-brand-muted">
                          {siteContent.addressLines.join(" • ")}. Remote and
                          diaspora clients fully supported.
                        </p>
                      </div>
                    </li>
                  ) : null}
                </ul>

                <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-6">
                  <p className="text-sm leading-relaxed text-brand-forest-dark">
                    Looking to buy? Browse our{" "}
                    <Link href="/properties" className="font-semibold underline decoration-brand-gold underline-offset-2 hover:text-brand-gold-dark">
                      verified listings
                    </Link>{" "}
                    first — your question may already have context there.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="card-surface p-6 sm:p-8 lg:p-10">
                <h2 className="font-serif text-2xl font-semibold">Send a message</h2>
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
