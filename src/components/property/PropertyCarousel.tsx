"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Property } from "@/lib/types";
import { PropertyCard } from "@/components/property/PropertyCard";

type PropertyCarouselProps = {
  properties: Property[];
};

/**
 * Horizontal, scroll-snap carousel for the homepage shortlist. Keeps the
 * section to a single row (shorter homepage) while still surfacing every
 * curated listing. Native scroll = touch/trackpad friendly; the arrow buttons
 * page by the viewport width and are hidden from AT (each card is already a
 * reachable link). Degrades to a plain scrollable row without JS.
 */
export function PropertyCarousel({ properties }: PropertyCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 8);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 8);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, [updateButtons]);

  const page = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // Page by ~one card width so a click advances a clean step.
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  return (
    <div className="relative mt-10">
      <ul
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:gap-7"
      >
        {properties.map((property, index) => (
          <li
            key={property.id}
            data-slide
            className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3.5rem)/3)]"
          >
            <PropertyCard property={property} priority={index === 0} />
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={!canPrev}
          aria-label="Previous properties"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-sand bg-brand-white text-brand-forest transition hover:border-brand-gold hover:text-brand-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={!canNext}
          aria-label="Next properties"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-sand bg-brand-white text-brand-forest transition hover:border-brand-gold hover:text-brand-gold-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
