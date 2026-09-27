"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Layered, cinematic homepage hero.
 *
 * Six independent layers build a real depth composition (never a flat image):
 *   1. Background environment  (public/images/abundance-hero-background.webp)
 *   2. Giant ABUNDANCE type    — behind the villa
 *   3. Villa cutout            (public/images/abundance-hero-villa.webp, transparent)
 *   4. Giant ABODES type       — in front of the villa
 *   5. Hero content / CTAs     — lower-left
 *   6. Navigation              — the site <Nav>, floating (rendered in layout)
 *
 * Composition is driven entirely by CSS custom properties on `.hero-stage`
 * (see globals.css), tuned independently per breakpoint — nothing here hard-codes
 * pixel positions. An IntersectionObserver toggles `.is-in` so the staggered
 * entrance replays whenever the hero meaningfully re-enters the viewport, and
 * prefers-reduced-motion collapses it to the static final frame.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  // Temporarily hidden per client request — flip back to `true` to restore the
  // oversized ABUNDANCE / ABODES wordmark layers (nothing else needs changing).
  const SHOW_WORDMARK = false;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setPlaying(true);
      return;
    }

    // Replay on re-entry, reset when it leaves — but only when the hero is
    // meaningfully in view (threshold 0.45), so scrolling within it never
    // retriggers the sequence.
    const observer = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.45 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={cn("hero-stage", playing && "is-in")}
      aria-labelledby="hero-heading"
    >
      {/* LAYER 1 — background environment (full-bleed, never max-width bound) */}
      <div className="hero-layer hero-layer--bg" aria-hidden="true">
        <Image
          src="/images/abundance-hero-background.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-bg-img object-cover object-center"
        />
        {/* Subtle cinematic scrim: keeps the sky bright, gently darkens the
            lower-left where the copy sits. Never heavily darkened. */}
        <div className="hero-scrim" />
      </div>

      {/* LAYER 2 — ABUNDANCE, behind the villa. Real HTML text. */}
      {SHOW_WORDMARK && (
        <div className="hero-layer hero-layer--abundance" aria-hidden="true">
          <span className="hero-word hero-abundance font-display">ABUNDANCE</span>
        </div>
      )}

      {/* LAYER 3 — villa cutout (transparent), grounded in the garden. */}
      <div className="hero-layer hero-layer--villa" aria-hidden="true">
        <Image
          src="/images/abundance-hero-villa.webp"
          alt=""
          width={2000}
          height={727}
          priority
          sizes="(min-width: 1440px) 1240px, (min-width: 1024px) 82vw, (min-width: 768px) 92vw, 130vw"
          className="hero-villa-img"
        />
      </div>

      {/* LAYER 4 — ABODES, in front of the villa. Real HTML text. */}
      {SHOW_WORDMARK && (
        <div className="hero-layer hero-layer--abodes" aria-hidden="true">
          <span className="hero-word hero-abodes font-display">ABODES</span>
        </div>
      )}

      {/* LAYER 5 — hero content, lower-left. */}
      <div className="hero-layer hero-layer--content">
        <div className="container-site w-full">
          <div className="hero-copy max-w-xl">
            <h1 id="hero-heading" className="hero-headline">
              Spaces for the life
              <br />
              you&apos;re building.
            </h1>
            <p className="hero-sub">
              Thoughtfully selected properties, developments and opportunities
              for people who value where they live, what they own and who they
              trust.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/properties" className="group hero-cta-primary">
                Explore Properties
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link href="/consultation" className="hero-cta-secondary">
                Work With Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
