"use client";

import Image from "next/image";
import { useState } from "react";
import {
  extractYouTubeId,
  youTubeEmbedUrl,
  youTubeThumbnail,
} from "@/lib/youtube";

type PropertyVideoProps = {
  url?: string;
  title: string;
};

/**
 * Premium YouTube facade:
 * - Renders a lightweight poster image + play button (no third-party JS).
 * - The actual youtube-nocookie.com iframe is injected only after the
 *   visitor interacts, keeping initial page loads fast.
 * - Falls back to a graceful empty state when no video is configured.
 */
export function PropertyVideo({ url, title }: PropertyVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYouTubeId(url);

  if (!videoId) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-forest/15 bg-brand-forest-dark shadow-(--shadow-deep)">
      <div className="relative aspect-video w-full">
        {playing ? (
          <iframe
            src={youTubeEmbedUrl(videoId)}
            title={`${title} — video walkthrough`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 block h-full w-full cursor-pointer"
            aria-label={`Play the ${title} video walkthrough`}
          >
            <Image
              src={youTubeThumbnail(videoId)}
              alt={`Video walkthrough preview for ${title}`}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              unoptimized
            />
            <span
              className="absolute inset-0 bg-gradient-to-t from-brand-forest-dark/80 via-brand-forest-dark/20 to-transparent"
              aria-hidden="true"
            />
            <span
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gold text-brand-forest-dark shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-gold-light sm:h-20 sm:w-20"
              aria-hidden="true"
            >
              <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="absolute bottom-4 left-1/2 w-max -translate-x-1/2 rounded-full bg-brand-cream/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-forest sm:text-sm">
              Watch the walkthrough
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
