import type { Development, DevelopmentStatus } from "@/lib/types";
import { slugify } from "@/lib/utils";

/**
 * Parses the admin development editor FormData into a Development object.
 * Lives outside "use server" so it can export sync functions.
 */
const STATUSES: DevelopmentStatus[] = ["completed", "ongoing", "upcoming"];

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parseDevelopmentForm(formData: FormData): Development {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug =
    slugify(slugInput) ||
    slugify(title) ||
    `development-${Date.now().toString(36)}`;

  const statusRaw = String(formData.get("status") ?? "upcoming") as DevelopmentStatus;
  const status = STATUSES.includes(statusRaw) ? statusRaw : "upcoming";

  const mainUrl = String(formData.get("mainImageUrl") ?? "").trim();
  const mainAlt =
    String(formData.get("mainImageAlt") ?? "").trim() ||
    `${title} — main image`;

  const createdAt =
    String(formData.get("createdAt") ?? "") || new Date().toISOString();

  const progressRaw = String(formData.get("progress") ?? "").trim();

  return {
    id: id || `dev-${Date.now().toString(36)}`,
    slug,
    title,
    status,
    location: String(formData.get("location") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: lines(formData.get("description")),
    developer: String(formData.get("developer") ?? "").trim() || undefined,
    totalUnits: String(formData.get("totalUnits") ?? "").trim() || undefined,
    priceFrom: String(formData.get("priceFrom") ?? "").trim() || undefined,
    completionDate:
      String(formData.get("completionDate") ?? "").trim() || undefined,
    progress:
      progressRaw === "" ? undefined : Math.max(0, Math.min(100, Number(progressRaw))),
    mainImage: {
      url: mainUrl || "/images/properties/aerial-estate.svg",
      alt: mainAlt,
    },
    gallery: lines(formData.get("gallery")).map((line) => {
      const [url, ...rest] = line.split("|");
      return {
        url: url.trim(),
        alt: rest.join("|").trim() || `${title} — gallery image`,
      };
    }),
    highlights: lines(formData.get("highlights")),
    featured: formData.get("featured") === "on",
    createdAt,
    updatedAt: new Date().toISOString(),
  };
}
