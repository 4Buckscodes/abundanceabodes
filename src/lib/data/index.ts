import type { Property } from "@/lib/types";
import { seedProperties } from "@/lib/data/properties";
import { dbListProperties, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Repository for properties.
 *
 * Reads from Supabase when credentials are present; falls back to the
 * bundled seed catalogue otherwise, so the site always renders.
 */

export async function getAllProperties(): Promise<Property[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbListProperties();
    if (rows && rows.length > 0) return rows;
  }
  return seedProperties;
}

export async function getPropertyBySlug(
  slug: string
): Promise<Property | null> {
  const all = await getAllProperties();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProperties(
  limit = 3
): Promise<Property[]> {
  const all = await getAllProperties();
  return all.filter((p) => p.featured && p.status !== "sold").slice(0, limit);
}

export async function getPropertiesByCategory(
  category: "home" | "land",
  limit?: number
): Promise<Property[]> {
  const all = await getAllProperties();
  const list = all.filter((p) => p.category === category);
  return limit ? list.slice(0, limit) : list;
}

export async function getRelatedProperties(
  property: Property,
  limit = 3
): Promise<Property[]> {
  const all = await getAllProperties();
  return all
    .filter((p) => p.slug !== property.slug)
    .sort((a, b) => {
      const scoreA =
        (a.category === property.category ? 2 : 0) +
        (a.location.split(",")[0] === property.location.split(",")[0] ? 1 : 0);
      const scoreB =
        (b.category === property.category ? 2 : 0) +
        (b.location.split(",")[0] === property.location.split(",")[0] ? 1 : 0);
      return scoreB - scoreA;
    })
    .slice(0, limit);
}

/** All slugs — used by sitemap and generateStaticParams. */
export async function getPropertySlugs(): Promise<string[]> {
  const all = await getAllProperties();
  return all.map((p) => p.slug);
}
