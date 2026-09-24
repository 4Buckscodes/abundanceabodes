"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PropertyImage } from "@/lib/types";

type PropertyGalleryProps = {
  images: PropertyImage[];
  title: string;
};

/**
 * Responsive gallery with an accessible lightbox:
 * keyboard navigation, focus trapping, Escape to close.
 */
export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          "button, [href]"
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, showNext, showPrev]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={image.url + index}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open image ${index + 1} of ${images.length}: ${
              image.alt || title
            }`}
            className={`group img-zoom relative overflow-hidden rounded-xl border border-brand-sand/60 bg-brand-sand/40 focus-visible:outline-brand-gold ${
              index === 0
                ? "col-span-2 row-span-2 aspect-[4/3] lg:aspect-auto"
                : "hidden aspect-[4/3] sm:block"
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt || `${title} — image ${index + 1}`}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover"
              priority={index === 0}
            />
            <span
              className="pointer-events-none absolute inset-0 bg-brand-forest-dark/0 transition-colors duration-300 group-hover:bg-brand-forest-dark/15"
              aria-hidden="true"
            />
            {index === 4 && images.length > 5 ? (
              <span className="absolute inset-0 flex items-center justify-center bg-brand-forest-dark/60 text-lg font-semibold text-brand-cream">
                +{images.length - 5} more
              </span>
            ) : null}
            <span
              className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-cream/90 text-brand-forest opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              aria-hidden="true"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m6 6V11a9 9 0 10-18 0v10h10z" />
              </svg>
            </span>
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image gallery`}
          ref={dialogRef}
          className="fixed inset-0 z-100 flex items-center justify-center bg-brand-forest-dark/95 p-4 sm:p-8"
          onClick={close}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-brand-cream/10 text-brand-cream transition-colors hover:bg-brand-cream/20"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <figure
            className="flex w-full max-w-5xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full">
              <Image
                src={images[openIndex].url}
                alt={images[openIndex].alt || `${title} — image ${openIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="rounded-xl object-contain"
                priority
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-brand-sand">
              {images[openIndex].alt} ({openIndex + 1}/{images.length})
            </figcaption>
          </figure>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream/10 text-brand-cream transition-colors hover:bg-brand-cream/20 sm:left-6"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream/10 text-brand-cream transition-colors hover:bg-brand-cream/20 sm:right-6"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
