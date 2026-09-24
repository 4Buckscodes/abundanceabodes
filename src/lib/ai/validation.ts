import type {
  AiExtractionResult,
  FieldConflict,
  ExtractedFieldEvidence,
  PropertyDocument,
} from "@/lib/types";
import { extractPropertyFromRawText } from "@/lib/ai-assistant";
import { normalizeDocumentation, DOCUMENT_TYPES_META } from "@/lib/documentation";
import { AiProviderError } from "@/lib/ai/provider";
import { groqExtractionSchema, type GroqExtraction } from "@/lib/ai/schemas";

/**
 * Runtime schema gate. Parses the untrusted model JSON; on any failure throws
 * an `AiProviderError("schema")` so the caller falls back to deterministic
 * extraction rather than trusting malformed output.
 */
export function validateGroqExtraction(raw: unknown): GroqExtraction {
  const parsed = groqExtractionSchema.safeParse(raw);
  if (!parsed.success) {
    throw new AiProviderError(
      `Model output failed schema validation: ${parsed.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join(".")} ${i.message}`)
        .join("; ")}`,
      "schema",
    );
  }
  return parsed.data;
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

/**
 * Reconciles validated model output with deterministic extraction.
 *
 * The deterministic engine (`extractPropertyFromRawText`) is authoritative for
 * DOCUMENTATION — the model can never upgrade an unmentioned document to
 * "available", and vague title claims stay "requires_verification". For other
 * fields the model enriches, falling back to the deterministic value whenever
 * the model omits a fact. Conflicts, ambiguity flags, missing-info and
 * verification notes are unioned so nothing the safety layer found is lost.
 */
export function reconcile(model: GroqExtraction, sourceText: string): AiExtractionResult {
  const fallback = extractPropertyFromRawText(sourceText);

  const str = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim() ? v.trim() : undefined;
  const num = (v: unknown): number | undefined =>
    typeof v === "number" && Number.isFinite(v) ? v : undefined;

  // --- Documentation: deterministic classification wins outright. ---
  const documentation: PropertyDocument[] = normalizeDocumentation(fallback.documentation);

  // Surface any model documentation claim the source text did NOT clearly
  // support (possible hallucination or injected instruction) for human review,
  // without ever adopting its status.
  const detStatusByType = new Map(documentation.map((d) => [d.type, d.status]));
  const modelDocWarnings: string[] = [];
  for (const doc of model.documentation ?? []) {
    const known = DOCUMENT_TYPES_META[doc.type as keyof typeof DOCUMENT_TYPES_META];
    if (!known) continue;
    const detStatus = detStatusByType.get(doc.type as PropertyDocument["type"]);
    if (
      (doc.status === "available" || doc.status === "pending") &&
      detStatus !== "available" &&
      detStatus !== "pending"
    ) {
      modelDocWarnings.push(
        `Model reported "${known.label}" as ${doc.status}, but the source text does not clearly state it — verify before trusting.`,
      );
    }
  }

  const conflicts: FieldConflict[] = [
    ...(model.conflicts ?? []),
    ...fallback.conflicts,
  ];

  const evidence: ExtractedFieldEvidence[] =
    (model.evidence?.map((e) => ({
      field: e.field,
      value: e.value,
      sourceText: e.sourceText,
      confidence: e.confidence,
    })) as ExtractedFieldEvidence[] | undefined)?.length
      ? (model.evidence as ExtractedFieldEvidence[])
      : fallback.evidence;

  const ambiguityFlags = uniq([...(model.ambiguityFlags ?? []), ...fallback.ambiguityFlags]);
  const missingInformation = uniq([
    ...(model.missingInformation ?? []),
    ...fallback.missingInformation,
  ]);
  const needsVerification = uniq([
    ...(model.needsVerification ?? []),
    ...fallback.needsVerification,
    ...modelDocWarnings,
  ]);

  const description =
    Array.isArray(model.description) && model.description.length > 0
      ? model.description.map(String)
      : fallback.description;
  const amenities =
    Array.isArray(model.amenities) && model.amenities.length > 0
      ? model.amenities.map(String)
      : fallback.amenities;

  return {
    title: str(model.title) ?? fallback.title,
    category: model.category,
    type: model.type,
    purpose: model.purpose,
    price: num(model.price) ?? fallback.price,
    currency: model.currency,
    priceNote: str(model.priceNote) ?? fallback.priceNote,
    location: str(model.location) ?? fallback.location,
    address: str(model.address) ?? fallback.address,
    bedrooms: num(model.bedrooms) ?? fallback.bedrooms,
    bathrooms: num(model.bathrooms) ?? fallback.bathrooms,
    toilets: num(model.toilets) ?? fallback.toilets,
    parkingSpaces: num(model.parkingSpaces) ?? fallback.parkingSpaces,
    landSize: str(model.landSize) ?? fallback.landSize,
    propertySize: str(model.propertySize) ?? fallback.propertySize,
    status: model.status,
    shortDescription: str(model.shortDescription) ?? fallback.shortDescription,
    description,
    amenities,
    developerName: str(model.developerName) ?? fallback.developerName,
    developerNote: str(model.developerNote) ?? fallback.developerNote,
    documentation,
    paymentPlan: model.paymentPlan
      ? {
          initialPayment: model.paymentPlan.initialPayment ?? undefined,
          balancePeriod: model.paymentPlan.balancePeriod ?? undefined,
          rawText: model.paymentPlan.rawText ?? undefined,
        }
      : fallback.paymentPlan,
    seoTitle: str(model.seoTitle) ?? fallback.seoTitle,
    seoDescription: str(model.seoDescription) ?? fallback.seoDescription,
    seoKeywords:
      Array.isArray(model.seoKeywords) && model.seoKeywords.length > 0
        ? model.seoKeywords.map(String)
        : fallback.seoKeywords,
    evidence,
    conflicts,
    ambiguityFlags,
    missingInformation,
    needsVerification,
  };
}
