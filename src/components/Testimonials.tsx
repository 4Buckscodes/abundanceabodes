import { testimonials } from "@/lib/data/content";
import { Reveal } from "@/components/ui/Reveal";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-padding bg-brand-forest"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-site">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label-on-dark mb-3">Client Voices</p>
            <h2
              id="testimonials-heading"
              className="text-3xl font-semibold tracking-tight text-brand-cream sm:text-4xl"
            >
              Confidence Through Clarity
            </h2>
          </div>
        </Reveal>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <li className="h-full">
                <figure className="flex h-full flex-col rounded-2xl border border-brand-forest-light bg-brand-forest-dark/40 p-6 sm:p-8 lg:p-10">
                  <span
                    aria-hidden="true"
                    className="font-serif text-5xl leading-none text-brand-gold"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-2 flex-1">
                    <p className="font-serif text-lg italic leading-relaxed text-brand-cream sm:text-xl">
                      {t.quote}
                    </p>
                  </blockquote>
                  {t.attribution ? (
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="h-px w-8 bg-brand-gold"
                      />
                      <span className="text-sm font-medium text-brand-gold-light">
                        {t.attribution}
                      </span>
                    </figcaption>
                  ) : null}
                </figure>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
