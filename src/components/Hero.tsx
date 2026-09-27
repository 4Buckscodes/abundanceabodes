import Image from "next/image";
import Link from "next/link";

/**
 * Full-bleed editorial hero: a dusk villa photo with an oversized layered
 * ivory wordmark and a lower-left content block.
 *
 * The client supplies the photo at `public/images/hero-villa.jpg`. Until it
 * lands, an always-present dusk-blue → ink gradient sits behind the (missing)
 * image so the layout still reads as intentional rather than broken.
 */
export function Hero() {
  return (
    <section
      className="relative flex min-h-[88vh] items-end overflow-hidden bg-brand-forest-dark"
      aria-labelledby="hero-heading"
    >
      {/* Graceful fallback gradient — always rendered, shows through if the
          photo is absent or still loading. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,_#5c6e83_0%,_#3a4656_45%,_#100e0c_100%)]"
        aria-hidden="true"
      />

      {/* Client hero photo (no text). object-cover keeps it full-bleed. */}
      <Image
        src="/images/hero-villa.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Legibility scrim: darker toward the bottom where the copy sits. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(16,14,12,0.35)_0%,_rgba(16,14,12,0.05)_35%,_rgba(16,14,12,0.55)_100%)]"
        aria-hidden="true"
      />

      {/* Oversized layered wordmark. Approximates the "letters behind the
          building" look via placement + soft opacity; a transparent cut-out of
          the house can be layered on top later for true occlusion. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[16%] flex flex-col items-center px-4 text-center leading-[0.82] text-brand-cream/85 mix-blend-soft-light select-none"
        aria-hidden="true"
      >
        <span className="font-display text-[clamp(3rem,15vw,13rem)] font-bold tracking-tighter">
          ABUNDANCE
        </span>
        <span className="font-display text-[clamp(3rem,15vw,13rem)] font-bold tracking-tighter">
          ABODES
        </span>
      </div>

      {/* Content block, lower-left. */}
      <div className="container-site relative z-10 pb-16 pt-32 sm:pb-20 lg:pb-24">
        <div className="max-w-2xl animate-fade-up">
          <h1
            id="hero-heading"
            className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-brand-cream sm:text-5xl lg:text-6xl"
          >
            Spaces for the life you&apos;re building.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-cream/85 sm:text-lg">
            Abundance Abodes helps individuals, families, diaspora clients, and
            investors discover, acquire, and manage verified property across
            Lagos, Ogun, Ibadan, and Abuja.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
        </div>
      </div>
    </section>
  );
}
