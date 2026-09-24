import Image from "next/image";
import Link from "next/link";
import { HeroSearch } from "@/components/home/HeroSearch";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-brand-cream"
      aria-labelledby="hero-heading"
    >
      {/* soft radial warmth */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,149,74,0.14),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(26,60,46,0.07),_transparent_50%)]"
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-20 lg:pb-16">
          <div className="animate-fade-up">
            <p className="eyebrow-rule section-label mb-4">
              Property • Advisory • Investment
            </p>

            <h1
              id="hero-heading"
              className="text-4xl font-semibold leading-[1.08] tracking-tight text-brand-forest sm:text-5xl lg:text-[3.5rem]"
            >
              Find a Place to Call Home.{" "}
              <span className="relative inline-block text-brand-gold-dark">
                Build Wealth That Lasts.
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 220 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 9C60 3 160 3 217 8"
                    stroke="#d4b56a"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-muted sm:text-lg">
              Abundance Abodes helps individuals, families, diaspora clients, and investors discover, acquire, and manage verified property opportunities across Lagos, Ogun, Ibadan, and Abuja.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/properties" className="btn-primary">
                Explore Properties
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/consultation" className="btn-secondary">
                Book a Consultation
              </Link>
            </div>
          </div>

          {/* hero image */}
          <div className="relative animate-fade-up [animation-delay:150ms]">
            <div className="relative overflow-hidden rounded-3xl shadow-(--shadow-deep)">
              <Image
                src="/images/hero-home.svg"
                alt="Illustration of a modern Nigerian home with glowing windows at dusk"
                width={1600}
                height={1000}
                priority
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 46vw"
              />
            </div>
            {/* floating price-style card for depth */}
            <div className="card-surface absolute -bottom-5 left-4 hidden items-center gap-4 p-4 sm:flex lg:-left-8">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-forest text-brand-gold-light"
                aria-hidden="true"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-forest">
                  Verification before recommendation
                </p>
                <p className="text-xs text-brand-muted">
                  Titles, surveys &amp; legal documents checked on every listing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Search Bar */}
        <div className="relative z-10 pb-14 pt-2 animate-fade-up [animation-delay:200ms] sm:pb-16">
          <HeroSearch />
        </div>
      </div>
    </section>
  );
}
