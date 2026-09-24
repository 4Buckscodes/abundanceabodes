export type PropertyCategory = "home" | "land";
export type PropertyType =
  | "apartment"
  | "duplex"
  | "terrace"
  | "bungalow"
  | "villa"
  | "residential-land"
  | "commercial-land"
  | "mixed-use-land"
  | "estate-allocation";
export type PropertyStatus = "available" | "reserved" | "sold" | "coming-soon";
export type PropertyPurpose = "sale" | "rent" | "invest" | "land";

export type PropertyImage = {
  url: string;
  alt: string;
};

export type PropertyDocumentStatus =
  | "available"
  | "pending"
  | "not_available"
  | "not_stated"
  | "not_applicable"
  | "requires_verification";

export type PropertyDocumentCategory =
  | "title_land"
  | "building_dev"
  | "estate_dev"
  | "other";

export type PropertyDocumentType =
  // Title / Land Documents
  | "certificate_of_occupancy"
  | "governors_consent"
  | "deed_of_assignment"
  | "deed_of_lease"
  | "registered_deed"
  | "survey_plan"
  | "registered_survey"
  | "excision"
  | "gazette"
  | "allocation_letter"
  | "power_of_attorney"
  | "purchase_receipt"
  | "land_agreement"
  // Building / Development Documents
  | "approved_building_plan"
  | "building_approval"
  | "development_permit"
  | "planning_permit"
  | "as_built_approval"
  | "environmental_planning_approval"
  // Estate / Developer Documents
  | "estate_allocation_letter"
  | "deed_of_assignment_developer"
  | "developer_title"
  | "estate_survey"
  | "estate_layout_approval"
  | "infrastructure_service_charge"
  // Other Documents
  | "probate_letters_of_admin"
  | "court_order"
  | "other_documentation";

export type PropertyDocument = {
  type: PropertyDocumentType;
  status: PropertyDocumentStatus;
  notes?: string;
};

export type PaymentPlan = {
  initialPayment?: string;
  balancePeriod?: string;
  rawText?: string;
};

export type ExtractedFieldEvidence = {
  field: string;
  value: unknown;
  sourceText: string;
  confidence: "high" | "medium" | "low";
};

export type FieldConflict = {
  field: string;
  val1: string;
  val2: string;
  explanation: string;
};

/**
 * Structured result of extracting a property listing from raw text — the shared
 * contract between the deterministic engine (`ai-assistant.ts`), the AI provider
 * layer (`ai/`), and the admin consumers (Property Editor + Listing Assistant).
 * The AI provider enriches these fields but can never invent unsupported facts;
 * the deterministic layer stays authoritative over documentation status.
 */
export type AiExtractionResult = {
  title: string;
  category: PropertyCategory;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number | null;
  currency: "NGN" | "USD";
  priceNote?: string;
  location: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parkingSpaces?: number;
  landSize?: string;
  propertySize?: string;
  status: PropertyStatus;
  shortDescription: string;
  description: string[];
  amenities: string[];
  developerName?: string;
  developerNote?: string;
  documentation: PropertyDocument[];
  paymentPlan?: PaymentPlan;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  /** Field-level provenance so admins can see what each value was drawn from. */
  evidence: ExtractedFieldEvidence[];
  /** Contradictions found within the source text (e.g. "4 vs 5 bedrooms"). */
  conflicts: FieldConflict[];
  ambiguityFlags: string[];
  missingInformation: string[];
  needsVerification: string[];
};

/** Brand marketing copy generated strictly from extracted facts. */
export type PropertyListingCopy = {
  title: string;
  shortDescription: string;
  description: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
};

export type Property = {
  id: string;
  slug: string;
  title: string;
  category: PropertyCategory;
  type: PropertyType;
  purpose: PropertyPurpose;
  /** Short one-liner shown on cards. */
  shortDescription: string;
  description: string[];
  price: number | null;
  currency: "NGN" | "USD";
  /** e.g. "₦120,000,000" or "Price on request". */
  priceNote?: string;
  location: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  toilets?: number;
  parkingSpaces?: number;
  /** Land size, e.g. "500 sqm" */
  landSize?: string;
  /** Built-up property size, e.g. "320 sqm" */
  propertySize?: string;
  status: PropertyStatus;
  featured: boolean;
  mainImage: PropertyImage;
  gallery: PropertyImage[];
  youtubeUrl?: string;
  amenities: string[];
  documentation?: PropertyDocument[];
  paymentPlan?: PaymentPlan;
  developerName?: string;
  developerNote?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  attribution?: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type Insight = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: { heading?: string; paragraphs: string[] }[];
  publishedAt: string;
  readMinutes: number;
  tag: string;
};

export type SiteContent = {
  phone?: string;
  whatsapp?: string;
  email?: string;
  addressLines?: string[];
  socials?: { label: string; href: string }[];
};

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "inspection-scheduled"
  | "in-progress"
  | "completed"
  | "closed"
  | "archived";

export type EnquiryType = "property_inspection" | "consultation" | "general";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertySlug?: string | null;
  propertyTitle?: string | null;
  preferredTime?: string | null;
  message?: string | null;
  status: EnquiryStatus;
  createdAt: string;
};

