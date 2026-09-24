import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We understand your goals, budget, and timeline — then shortlist verified options that genuinely fit.",
  },
  {
    number: "02",
    title: "Verify",
    description:
      "Documentation, surveys, and ownership checks are completed before any recommendation reaches you.",
  },
  {
    number: "03",
    title: "Advise",
    description:
      "We lay out your options honestly, negotiate where needed, and help you decide with clarity.",
  },
  {
    number: "04",
    title: "Complete",
    description:
      "From offer to documentation and handover, we remain by your side until everything is done.",
  },
];

export function Process() {
  return (
    <section
      id="process"
      className="section-padding bg-brand-cream"
      aria-labelledby="process-heading"
    >
      <div className="container-site">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-label mb-3 flex items-center justify-center gap-3 after:h-px after:w-8 after:bg-brand-gold">
              Our Brokerage Process
            </p>
            <h2
              id="process-heading"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              A Clear Path from Interest to Ownership
            </h2>
          </div>
        </Reveal>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 90}>
              <li className="group card-surface relative h-full p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-(--shadow-lift) sm:p-7">
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-5 font-serif text-5xl font-semibold leading-none text-brand-sand transition-colors duration-500 group-hover:text-brand-gold/60"
                >
                  {step.number}
                </span>
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold font-serif text-sm font-bold text-brand-forest-dark"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
