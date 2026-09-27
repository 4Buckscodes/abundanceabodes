import Image from "next/image";
import Link from "next/link";
import { HeroWordmark } from "@/components/HeroWordmark";

/**
 * Full-bleed editorial hero: a dusk villa photo as the visual foundation, an
 * oversized layered ABUNDANCE / ABODES wordmark spanning the frame, and a
 * lower-left content block (headline + supporting copy + CTAs).
 *
 * The photo lives at `public/images/hero-villa.jpg`; an always-present
 * dusk-blue → ink gradient sits behind it as a graceful fallback.
 */
export function Hero() {
  return (
    <section
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-brand-forest-dark"
      aria-labelledby="hero-heading"
    >
      {/* Graceful fallback gradient — shows through if the photo is absent. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,_#5c6e83_0%,_#3a4656_45%,_#100e0c_100%)]"
        aria-hidden="true"
      />

      {/* Villa photo. object-position keeps the house/roofline/facade centred
          rather than accepting an arbitrary cover crop. */}
      <Image
        src="/images/hero-villa.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_38%] sm:object-[50%_45%] lg:object-center"
      />

      {/* Light cinematic scrim: sky stays bright up top, gently darkened toward
          the bottom-left where the copy sits. Never heavily darkened. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(16,14,12,0.10)_0%,_rgba(16,14,12,0)_28%,_rgba(16,14,12,0)_52%,_rgba(16,14,12,0.48)_100%)]"
        aria-hidden="true"
      />

      {/* Oversized layered wordmark (with the cinematic entrance animation). */}
      <HeroWordmark />

      {/* Foreground content, lower-left. Sits above the wordmark in hierarchy. */}
      <div className="container-site relative z-10 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-xl animate-fade-up">
          <h1
            id="hero-heading"
            className="text-[clamp(2.25rem,3.8vw,3.25rem)] font-semibold leading-[1.04] tracking-tight text-brand-cream drop-shadow-[0_2px_18px_rgba(16,14,12,0.35)]"
          >
            Spaces for the life
            <br />
            you&apos;re building.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-cream/90">
            Thoughtfully selected properties, developments and opportunities for
            people who value where they live, what they own and who they trust.
          </p>

          {/* Mobile CTAs — cream-filled + outlined pills. */}
          <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
            <Link href="/properties" className="btn-on-photo">
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
            <Link href="/consultation" className="btn-ghost-dark">
              Work With Us
            </Link>
          </div>

          {/* Desktop CTAs — understated editorial text treatments. */}
          <div className="mt-9 hidden items-center gap-8 lg:flex">
            <Link
              href="/properties"
              className="group inline-flex items-center gap-2 border-b border-brand-cream/70 pb-1 text-base font-semibold tracking-wide text-brand-cream transition-colors hover:border-brand-cream"
            >
              Explore Properties
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
            <Link
              href="/consultation"
              className="text-base font-semibold tracking-wide text-brand-cream/85 transition-colors hover:text-brand-cream"
            >
              Work With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
