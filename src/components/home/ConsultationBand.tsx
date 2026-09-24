import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export function ConsultationBand() {
  return (
    <section
      className="relative overflow-hidden bg-brand-forest"
      aria-labelledby="cta-band-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(184,149,74,0.18),_transparent_55%)]"
        aria-hidden="true"
      />
      <div className="container-site relative py-16 sm:py-20 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label-on-dark mb-4">
              Take the Next Step
            </p>
            <h2
              id="cta-band-heading"
              className="text-3xl font-semibold tracking-tight text-brand-cream sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
            >
              Tell Us What You&apos;re Looking For.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-sand sm:text-lg">
              A short conversation is all it takes to get moving — share your
              goals and budget, and we&apos;ll come back with verified options
              and an honest read on each one.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/consultation" className="btn-gold">
                Book a Free Consultation
              </Link>
              <Link href="/properties" className="btn-ghost-dark">
                Explore Properties First
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
