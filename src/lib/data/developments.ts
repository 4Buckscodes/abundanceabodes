import type { Development } from "@/lib/types";

/**
 * Seed catalogue of developments used until Supabase credentials are connected.
 * Once NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are present,
 * the data layer in src/lib/data/index.ts reads from the developments table instead.
 *
 * These are placeholder projects covering the three lifecycle stages
 * (completed / ongoing / upcoming) so the /developments page and the admin
 * dashboard have real content to work with out of the box.
 */
export const seedDevelopments: Development[] = [
  {
    id: "dev-lekki-court",
    slug: "the-courtyard-lekki",
    title: "The Courtyard — Lekki",
    status: "completed",
    location: "Lekki Phase 1, Lagos",
    shortDescription:
      "A delivered enclave of eight serviced four-bedroom terraces around a central landscaped courtyard.",
    description: [
      "The Courtyard is a completed and fully handed-over development of eight four-bedroom terraces arranged around a shared landscaped courtyard in the heart of Lekki Phase 1. Every home was delivered with fitted kitchens, en-suite bedrooms, and a private car port.",
      "Title and building approvals were verified before allocation, and residents have moved in across all eight units. A handful of resale units may become available from time to time — register your interest and we will notify you.",
    ],
    developer: "Abundance Abodes Developments",
    totalUnits: "8 terraces",
    priceFrom: "From ₦145,000,000",
    completionDate: "Delivered 2024",
    progress: 100,
    mainImage: {
      url: "/images/properties/terrace-row.svg",
      alt: "Illustration of a delivered row of four-bedroom terraces around a courtyard",
    },
    gallery: [],
    highlights: [
      "Fully delivered & occupied",
      "Governor's consent verified",
      "Fitted kitchens & en-suite rooms",
      "Landscaped central courtyard",
      "24-hour estate security",
    ],
    featured: true,
    createdAt: "2023-01-10T09:00:00Z",
    updatedAt: "2024-11-01T09:00:00Z",
  },
  {
    id: "dev-ikate-heights",
    slug: "ikate-heights-apartments",
    title: "Ikate Heights — Apartments",
    status: "ongoing",
    location: "Ikate, Lekki, Lagos",
    shortDescription:
      "24 contemporary one- and two-bedroom apartments under active construction, with verified milestone progress.",
    description: [
      "Ikate Heights is a mid-rise development of 24 one- and two-bedroom apartments currently under construction in Ikate, Lekki. The structure has topped out and finishing works are underway across the lower floors.",
      "We track delivery against real, verifiable milestones — not renders — and coordinate documentation so that allocations stand up to scrutiny. Off-plan units remain available at current-phase pricing.",
    ],
    developer: "Partner developer (vetted)",
    totalUnits: "24 apartments",
    priceFrom: "From ₦72,000,000",
    completionDate: "Q3 2027",
    progress: 55,
    mainImage: {
      url: "/images/properties/tower-apartment.svg",
      alt: "Illustration of a contemporary apartment block under construction",
    },
    gallery: [],
    highlights: [
      "Structure topped out",
      "Verified milestone progress",
      "Off-plan pricing available",
      "Transparent payment plan",
      "Documentation coordinated",
    ],
    featured: true,
    createdAt: "2025-02-01T09:00:00Z",
    updatedAt: "2026-08-20T09:00:00Z",
  },
  {
    id: "dev-epe-gardens",
    slug: "epe-gardens-estate",
    title: "Epe Gardens — Estate Plots",
    status: "upcoming",
    location: "Epe, Lagos",
    shortDescription:
      "A planned estate of 50 serviced residential plots in a growth corridor, releasing soon with clean title.",
    description: [
      "Epe Gardens is an upcoming release of 50 serviced residential plots within a planned estate along the Epe growth corridor. Layout approval and title verification are in progress ahead of the first allocation phase.",
      "Early registrations receive first access to the launch pricing and preferred plot selection. Join the interest list to be notified the moment the phase opens.",
    ],
    developer: "Abundance Abodes Developments",
    totalUnits: "50 serviced plots",
    priceFrom: "Launch pricing TBA",
    completionDate: "Launching 2027",
    progress: 10,
    mainImage: {
      url: "/images/properties/land-plots.svg",
      alt: "Illustration of a planned estate layout of serviced residential plots",
    },
    gallery: [],
    highlights: [
      "Releasing soon",
      "Title verification in progress",
      "Early-registration pricing",
      "Preferred plot selection",
      "Serviced estate infrastructure",
    ],
    featured: false,
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-09-01T09:00:00Z",
  },
];
