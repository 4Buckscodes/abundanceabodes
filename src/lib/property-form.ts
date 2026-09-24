import type { Property, PropertyCategory, PropertyDocument, PropertyDocumentType, PropertyDocumentStatus, PropertyType } from "@/lib/types";
import { DOCUMENT_TYPES_META } from "@/lib/documentation";
import { extractYouTubeId } from "@/lib/youtube";
import { slugify } from "@/lib/utils";

/**
 * Parses the admin property editor FormData into a Property object.
 * Lives outside "use server" so it can export sync functions.
 */
const TYPES: PropertyType[] = [
  "apartment", "duplex", "terrace", "bungalow", "villa",
  "residential-land", "commercial-land", "mixed-use-land", "estate-allocation",
];

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parsePropertyForm(formData: FormData): Property {
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  // Prefer the slug field; if it is empty, derive one from the title so a
  // listing always gets a readable URL instead of a random fallback.
  const slug =
    slugify(slugInput) ||
    slugify(title) ||
    `property-${Date.now().toString(36)}`;
  const typeRaw = String(formData.get("type") ?? "duplex") as PropertyType;
  const category = (
    formData.get("category") === "land" ? "land" : "home"
  ) as PropertyCategory;
  const priceRaw = String(formData.get("price") ?? "").replace(/[, ]/g, "");

  const mainUrl = String(formData.get("mainImageUrl") ?? "").trim();
  const mainAlt =
    String(formData.get("mainImageAlt") ?? "").trim() ||
    `${title} — main image`;

  const createdAt =
    String(formData.get("createdAt") ?? "") || new Date().toISOString();

  const youtubeRaw = String(formData.get("youtubeUrl") ?? "").trim();

  // Parse documentation items
  const documentation: PropertyDocument[] = [];
  (Object.keys(DOCUMENT_TYPES_META) as PropertyDocumentType[]).forEach((docType) => {
    const statusVal = String(formData.get(`doc_status_${docType}`) ?? "").trim() as PropertyDocumentStatus;
    const notesVal = String(formData.get(`doc_notes_${docType}`) ?? "").trim();

    if (statusVal && ["available", "pending", "not_available", "not_stated", "not_applicable", "requires_verification"].includes(statusVal)) {
      documentation.push({
        type: docType,
        status: statusVal,
        notes: notesVal || undefined,
      });
    }
  });

  return {
    id: id || `prop-${Date.now().toString(36)}`,
    slug,
    title,
    category,
    type: TYPES.includes(typeRaw)
      ? typeRaw
      : category === "land"
        ? "residential-land"
        : "duplex",
    purpose: String(formData.get("purpose") ?? "sale") === "rent" ? "rent" : "sale",
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    description: lines(formData.get("description")),
    price: priceRaw === "" ? null : Number(priceRaw),
    currency: String(formData.get("currency") ?? "NGN") === "USD" ? "USD" : "NGN",
    priceNote: String(formData.get("priceNote") ?? "").trim() || undefined,
    location: String(formData.get("location") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim() || undefined,
    bedrooms:
      String(formData.get("bedrooms") ?? "") === ""
        ? undefined
        : Number(formData.get("bedrooms")),
    bathrooms:
      String(formData.get("bathrooms") ?? "") === ""
        ? undefined
        : Number(formData.get("bathrooms")),
    toilets:
      String(formData.get("toilets") ?? "") === ""
        ? undefined
        : Number(formData.get("toilets")),
    parkingSpaces:
      String(formData.get("parkingSpaces") ?? "") === ""
        ? undefined
        : Number(formData.get("parkingSpaces")),
    landSize: String(formData.get("landSize") ?? "").trim() || undefined,
    propertySize: String(formData.get("propertySize") ?? "").trim() || undefined,
    status: (["available", "reserved", "sold", "coming-soon"].includes(
      String(formData.get("status"))
    )
      ? String(formData.get("status"))
      : "available") as Property["status"],
    featured: formData.get("featured") === "on",
    mainImage: {
      url: mainUrl || "/images/properties/exterior-duplex.svg",
      alt: mainAlt,
    },
    gallery: lines(formData.get("gallery")).map((line) => {
      const [url, ...rest] = line.split("|");
      return {
        url: url.trim(),
        alt: rest.join("|").trim() || `${title} — gallery image`,
      };
    }),
    youtubeUrl: youtubeRaw && extractYouTubeId(youtubeRaw) ? youtubeRaw : undefined,
    amenities: lines(formData.get("amenities")),
    documentation,
    developerName: String(formData.get("developerName") ?? "").trim() || undefined,
    developerNote: String(formData.get("developerNote") ?? "").trim() || undefined,
    seoTitle: String(formData.get("seoTitle") ?? "").trim() || undefined,
    seoDescription: String(formData.get("seoDescription") ?? "").trim() || undefined,
    seoKeywords: lines(formData.get("seoKeywords")),
    createdAt,
    updatedAt: new Date().toISOString(),
  };
}

