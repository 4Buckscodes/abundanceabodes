"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The oversized editorial wordmark — ABUNDANCE (upper) and ABODES (lower) —
 * spanning full-bleed across the hero, sitting over the villa photo and behind
 * the foreground content. Each word is centered by a full-width wrapper so its
 * own `transform` is free for the entrance animation (translateY + blur only).
 *
 * Entrance (paired with .hero-word rules in globals.css):
 *  - ABUNDANCE eases down from above, ABODES eases up from below; both fade in
 *    and de-blur, ABODES trailing ABUNDANCE.
 *  - An IntersectionObserver (threshold 0.5) replays the sequence each time the
 *    hero re-enters the viewport; moving around inside the hero does not retrigger.
 *  - prefers-reduced-motion shows both words in final position, no motion.
 */
export function HeroWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setPlaying(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const inClass = playing ? " is-in" : "";

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ABUNDANCE — upper band. flex+justify-center so the oversized text
          bleeds equally past both edges (text-align would only overflow right). */}
      <div className="absolute inset-x-0 top-[19%] flex justify-center sm:top-[17%] lg:top-[20%]">
        <span
          className={`hero-word hero-word--top font-display inline-block whitespace-nowrap text-[clamp(3.5rem,16vw,13rem)] font-medium leading-[0.8] tracking-tight text-brand-cream/85${inClass}`}
        >
          ABUNDANCE
        </span>
      </div>

      {/* ABODES — lower band (converges upward toward ABUNDANCE) */}
      <div className="absolute inset-x-0 top-[30%] flex justify-center sm:top-[29%] lg:top-[58%]">
        <span
          className={`hero-word hero-word--bottom font-display inline-block whitespace-nowrap text-[clamp(4.25rem,22vw,20rem)] font-medium leading-[0.8] tracking-tight text-brand-cream/85${inClass}`}
        >
          ABODES
        </span>
      </div>
    </div>
  );
}
