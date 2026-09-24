import { z } from "zod";

/**
 * Runtime validation of the UNTRUSTED JSON returned by the model. This is the
 * schema gate in the pipeline: raw model JSON is parsed here first, and any
 * failure makes the caller fall back to deterministic extraction. The schema
 * is intentionally lenient about missing/null fields (the model legitimately
 * returns null for absent facts) but strict about types and enum membership,
 * so malformed or hallucinated-shape output is rejected rather than trusted.
 */

const categoryEnum = z.enum(["home", "land"]);
const typeEnum = z.enum([
  "apartment",
  "duplex",
  "terrace",
  "bungalow",
  "villa",
  "residential-land",
  "commercial-land",
  "mixed-use-land",
  "estate-allocation",
]);
const purposeEnum = z.enum(["sale", "rent", "invest", "land"]);
const currencyEnum = z.enum(["NGN", "USD"]);
const statusEnum = z.enum(["available", "reserved", "sold", "coming-soon"]);
const docStatusEnum = z.enum([
  "available",
  "pending",
  "not_available",
  "not_stated",
  "not_applicable",
  "requires_verification",
]);

const nullableString = z.string().nullish();
const nullableNumber = z.number().finite().nullish();

const documentSchema = z.object({
  type: z.string().min(1),
  status: docStatusEnum,
  notes: nullableString,
});

const evidenceSchema = z.object({
  field: z.string(),
  value: z.unknown(),
  sourceText: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
});

const conflictSchema = z.object({
  field: z.string(),
  val1: z.string(),
  val2: z.string(),
  explanation: z.string(),
});

const paymentPlanSchema = z
  .object({
    initialPayment: nullableString,
    balancePeriod: nullableString,
    rawText: nullableString,
  })
  .nullish();

/** Shape the model is expected to return from the extraction call. */
export const groqExtractionSchema = z.object({
  title: z.string().nullish(),
  category: categoryEnum,
  type: typeEnum,
  purpose: purposeEnum,
  price: nullableNumber,
  currency: currencyEnum,
  priceNote: nullableString,
  location: z.string().min(1),
  address: nullableString,
  bedrooms: nullableNumber,
  bathrooms: nullableNumber,
  toilets: nullableNumber,
  parkingSpaces: nullableNumber,
  landSize: nullableString,
  propertySize: nullableString,
  status: statusEnum,
  shortDescription: z.string().nullish(),
  description: z.array(z.string()).nullish(),
  amenities: z.array(z.string()).nullish(),
  developerName: nullableString,
  developerNote: nullableString,
  documentation: z.array(documentSchema).nullish(),
  paymentPlan: paymentPlanSchema,
  seoTitle: nullableString,
  seoDescription: nullableString,
  seoKeywords: z.array(z.string()).nullish(),
  evidence: z.array(evidenceSchema).nullish(),
  conflicts: z.array(conflictSchema).nullish(),
  ambiguityFlags: z.array(z.string()).nullish(),
  missingInformation: z.array(z.string()).nullish(),
  needsVerification: z.array(z.string()).nullish(),
});

export type GroqExtraction = z.infer<typeof groqExtractionSchema>;

/** Shape of the marketing-copy call. */
export const groqCopySchema = z.object({
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.array(z.string()),
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
  seoKeywords: z.array(z.string()).nullish(),
});

export type GroqCopy = z.infer<typeof groqCopySchema>;
