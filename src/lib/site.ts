export const siteConfig = {
  name: "Abundance Abodes",
  company: "Abundance Abode Realty",
  tagline: "Trusted Real Estate Advisory & Property Discovery",
  description:
    "Client-first Nigerian real estate consultancy helping individuals, families, diaspora clients, and investors acquire verified homes and land with confidence.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://abundanceabodes.com",
  phone: "+234 815 537 7898",
  phoneDisplay: "+234 (0) 815 537 7898",
  whatsapp: "+2348155377898",
  whatsappDisplay: "+234 815 537 7898",
  email: "advisory@abundanceabodes.com",
  address: "Plot 12, Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  markets: ["Lagos", "Ogun", "Ibadan", "Abuja"],
  keywords: [
    "real estate Nigeria",
    "property brokerage Nigeria",
    "buy land Lagos",
    "verified property Nigeria",
    "houses for sale Lekki",
    "land for sale Ibadan",
    "Abundance Abodes",
    "diaspora property investment Nigeria",
  ],
  socials: {
    instagram: "https://instagram.com/abundanceabodes",
    linkedin: "https://linkedin.com/company/abundance-abodes",
    x: "https://x.com/abundanceabodes",
    youtube: "https://youtube.com/@abundanceabodes",
  },
} as const;

export const site = siteConfig;

export function absoluteUrl(path: string): string {
  const base = siteConfig.url || "https://abundanceabodes.com";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getWhatsAppLink(message?: string): string {
  const defaultText = "Hello Abundance Abodes, I would like to inquire about your real estate services and property listings.";
  const text = encodeURIComponent(message || defaultText);
  return `https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${text}`;
}

