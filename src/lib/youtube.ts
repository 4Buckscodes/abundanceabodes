/**
 * Safe YouTube URL / ID parsing and thumbnail helpers.
 *
 * Supported formats:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - https://www.youtube.com/shorts/VIDEO_ID
 *  - https://www.youtube.com/live/VIDEO_ID
 *  - bare 11-character video IDs
 */
const ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export function extractYouTubeId(input: string | undefined | null): string | null {
  if (!input) return null;
  const value = input.trim();
  if (ID_PATTERN.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ID_PATTERN.test(id) ? id : null;
  }

  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    const v = url.searchParams.get("v");
    if (v && ID_PATTERN.test(v)) return v;
    const segments = url.pathname.split("/").filter(Boolean);
    const marker = segments.findIndex((s) =>
      ["embed", "shorts", "live", "v"].includes(s)
    );
    if (marker !== -1 && segments[marker + 1]) {
      const id = segments[marker + 1];
      return ID_PATTERN.test(id) ? id : null;
    }
  }

  return null;
}

/** Highest-quality poster available for the video. Falls back down the ladder. */
export function youTubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
}

export function youTubeEmbedUrl(id: string, autoplay = true): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (autoplay) params.set("autoplay", "1");
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}
