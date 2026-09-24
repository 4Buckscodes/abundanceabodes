import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    title: "Verification First",
    description:
      "Titles, surveys, and ownership authority are examined before anything reaches you — so confidence is earned, not assumed.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
  },
  {
    title: "Client-Side Representation",
    description:
      "We sit on your side of the table — negotiating, explaining trade-offs honestly, and keeping the process transparent.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0a4.5 4.5 0 100-9 4.5 4.5 0 000 9z"
      />
    ),
  },
  {
    title: "Long-Term Value",
    description:
      "Every recommendation weighs growth potential and exit liquidity, because property should compound your position, not complicate it.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
      />
    ),
  },
  {
    title: "Support Through Handover",
    description:
      "From offer to Governor's Consent to keys in hand, we stay involved until the transaction is fully complete.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64M21 21v-5.094a3 3 0 00-.506-1.667l-4-5.906a3 3 0 00-4.988 0l-4 5.906A3 3 0 007 15.906V21"
      />
    ),
  },
];

export function WhyAbundance() {
  return (
    <section
      id="why-us"
      className="section-padding bg-brand-white"
      aria-labelledby="why-heading"
    >
      <div className="container-site">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              label="Why Abundance Abodes"
              title="Brokerage You Can Actually Trust"
              id="why-heading"
              description="The Nigerian market rewards careful buyers and punishes rushed ones. Our role is simple: make sure you are always the careful one."
            />
            <p className="mt-6 border-l-2 border-brand-gold pl-5 italic leading-relaxed text-brand-muted">
              &ldquo;Every Property. Every Client. Every Decision Matters.&rdquo;
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/why-choose-us" className="link-underline group text-sm">
                More on how we work
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/due-diligence" className="link-underline text-sm">
                Read our due-diligence approach
              </Link>
            </div>
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 80}>
                <li className="card-surface h-full p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-(--shadow-lift)">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-forest text-brand-gold-light"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      {pillar.icon}
                    </svg>
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {pillar.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
