import type { AiExtractionResult } from "@/lib/types";

/**
 * Pure logic for the "existing manual value vs AI value" picker. Kept out of the
 * client component so it can be unit-tested without a DOM and reused anywhere a
 * comparison between the admin's current form values and the AI result is needed.
 */

export type CompareField = {
  name: keyof AiExtractionResult;
  label: string;
  kind: "string" | "number";
  format?: (v: unknown) => string;
};

const money = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) ? `₦${v.toLocaleString()}` : String(v ?? "");

/** Fields where a non-empty existing form value could clash with the AI value. */
export const COMPARE_FIELDS: CompareField[] = [
  { name: "title", label: "Title", kind: "string" },
  { name: "price", label: "Price", kind: "number", format: money },
  { name: "location", label: "Location", kind: "string" },
  { name: "shortDescription", label: "Short description", kind: "string" },
  { name: "priceNote", label: "Price note", kind: "string" },
  { name: "bedrooms", label: "Bedrooms", kind: "number" },
  { name: "bathrooms", label: "Bathrooms", kind: "number" },
  { name: "toilets", label: "Toilets", kind: "number" },
  { name: "parkingSpaces", label: "Parking spaces", kind: "number" },
  { name: "landSize", label: "Land size", kind: "string" },
];

export type ExistingConflict = {
  field: CompareField;
  existing: string;
  aiValue: unknown;
};

/** True when the existing (string, from the DOM) and AI values are equivalent. */
export function valuesMatch(kind: "string" | "number", existing: string, aiValue: unknown): boolean {
  if (kind === "number") return Number(existing) === Number(aiValue);
  return existing.trim().toLowerCase() === String(aiValue ?? "").trim().toLowerCase();
}

/**
 * Finds fields where the admin already typed a value that differs from what the
 * AI produced. These are surfaced in the picker so nothing is silently
 * overwritten — the admin explicitly chooses which value wins.
 */
export function detectExistingConflicts(
  existing: Record<string, string>,
  result: AiExtractionResult,
): ExistingConflict[] {
  const conflicts: ExistingConflict[] = [];
  for (const field of COMPARE_FIELDS) {
    const existingValue = (existing[field.name as string] ?? "").trim();
    const aiValue = (result as Record<string, unknown>)[field.name as string];
    const aiPresent = aiValue !== undefined && aiValue !== null && aiValue !== "";
    if (existingValue && aiPresent && !valuesMatch(field.kind, existingValue, aiValue)) {
      conflicts.push({ field, existing: existingValue, aiValue });
    }
  }
  return conflicts;
}
