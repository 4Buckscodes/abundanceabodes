import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

const services = ["Buying", "Selling", "Investment", "Land", "Advisory"];

const steps = [
  { label: "Discover", detail: "We learn your goals, budget, and timeline." },
  { label: "Verify", detail: "Titles, surveys, and ownership are checked first." },
  { label: "Advise", detail: "We negotiate and explain trade-offs honestly." },
  { label: "Complete", detail: "We stay involved through consent and handover." },
];

export function Positioning() {
  return (
    <section
      id="about"
      className="section-padding bg-brand-sand/40"
      aria-labelledby="positioning-heading"
    >
      <div className="container-site">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label mb-3 flex items-center justify-center gap-3 after:h-px after:w-8 after:bg-brand-gold">
              Who We Are
            </p>
            <h2
              id="positioning-heading"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Helping You Find Your Place — and Build What Lasts.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-brand-muted sm:text-lg">
              Abundance Abodes is a client-first real estate brokerage. We
              represent buyers, sellers, developers, and investors with verified
              opportunities, honest guidance, and support that runs from first
              enquiry through to handover.
            </p>

            <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
              {services.map((service) => (
                <li
                  key={service}
                  className="rounded-full border border-brand-sand bg-brand-white px-4 py-1.5 text-sm font-medium text-brand-forest"
                >
                  {service}
                </li>
              ))}
            </ul>

            <Link href="/about" className="btn-secondary mt-8">
              More About Us
            </Link>
          </div>
        </Reveal>

        {/* Compact process strip */}
        <Reveal>
          <ol className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.label} className="flex gap-3.5 sm:block">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-forest text-sm font-semibold text-brand-gold-light sm:mb-3"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <p className="font-serif text-lg font-semibold text-brand-forest">
                    {step.label}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-brand-muted">
                    {step.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
