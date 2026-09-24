import type { MetadataRoute } from "next";
import { getAllProperties, getPropertySlugs } from "@/lib/data";
import { insights } from "@/lib/data/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/properties",
    "/about",
    "/why-choose-us",
    "/for-buyers",
    "/for-sellers",
    "/for-developers",
    "/due-diligence",
    "/insights",
    "/faq",
    "/consultation",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const slugs = await getPropertySlugs();
  const properties = await getAllProperties();
  const propertyEntries: MetadataRoute.Sitemap = slugs.map((slug) => {
    const property = properties.find((p) => p.slug === slug);
    return {
      url: absoluteUrl(`/properties/${slug}`),
      lastModified: property ? new Date(property.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: property?.featured ? 0.9 : 0.8,
    };
  });

  const insightEntries: MetadataRoute.Sitemap = insights.map((post) => ({
    url: absoluteUrl(`/insights/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticPages, ...propertyEntries, ...insightEntries];
}
