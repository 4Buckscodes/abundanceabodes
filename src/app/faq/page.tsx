import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";
import { faqs } from "@/lib/data/content";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about buying, selling, and investing in property with Abundance Abodes — fees, documentation, diaspora purchases and more.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader
        label="FAQ"
        title="Questions Clients Ask Us Most"
        description="Straight answers about how we work, what things cost, and what to expect. If your question isn't here, ask it directly during a consultation."
        crumbs={[{ label: "FAQ" }]}
      />

      <section className="section-padding" aria-label="Frequently asked questions">
        <div className="container-site max-w-3xl">
          <div className="divide-y divide-brand-sand rounded-2xl border border-brand-sand bg-brand-white">
            {faqs.map((faq) => (
              <details key={faq.id} className="group px-6 py-5 sm:px-8">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-forest transition-colors hover:text-brand-gold-dark [&::-webkit-details-marker]:hidden">
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-stone/60 text-brand-forest transition-transform duration-300 group-open:rotate-45 group-open:border-brand-gold group-open:text-brand-gold-dark"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3.5 leading-relaxed text-brand-muted">{faq.answer}</p>
              </details>
            ))}
          </div>

          <Reveal>
            <div className="mt-10 text-center">
              <p className="text-brand-muted">
                Still have questions?{" "}
                <Link href="/consultation" className="link-underline group">
                  Book a free consultation
                </Link>{" "}
                or browse our{" "}
                <Link href="/insights" className="link-underline group">
                  property insights
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
