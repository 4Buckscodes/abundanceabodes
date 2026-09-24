"use client";

import { useRef, useState } from "react";
import type { AiExtractionResult } from "@/lib/types";
import type { AiRunMeta } from "@/lib/ai/provider";
import { extractListingAction } from "@/app/admin/(dashboard)/properties/ai-actions";
import {
  COMPARE_FIELDS,
  detectExistingConflicts,
  type ExistingConflict,
} from "@/lib/ai/conflicts";

interface AiListingAssistantProps {
  onApply: (extracted: AiExtractionResult) => void;
}

// PLACEHOLDER_BODY

export function AiListingAssistant({ onApply }: AiListingAssistantProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<AiExtractionResult | null>(null);
  const [meta, setMeta] = useState<AiRunMeta | null>(null);
  const [conflicts, setConflicts] = useState<ExistingConflict[]>([]);
  // Per-field choice for existing-vs-AI conflicts. Defaults to the AI value.
  const [choices, setChoices] = useState<Record<string, "ai" | "existing">>({});

  /** Snapshot the sibling form's current values so we can detect real conflicts. */
  const readExistingValues = (): Record<string, string> => {
    const form = rootRef.current?.closest("form");
    const values: Record<string, string> = {};
    if (!form) return values;
    for (const field of COMPARE_FIELDS) {
      const el = form.elements.namedItem(field.name as string);
      if (el && "value" in el) {
        values[field.name as string] = String((el as { value?: unknown }).value ?? "");
      }
    }
    return values;
  };

  const handleExtract = async () => {
    if (!rawText.trim() || isExtracting) return;
    setIsExtracting(true);
    setError(null);
    try {
      const existing = readExistingValues();
      const { result, meta: runMeta } = await extractListingAction(rawText);
      setLastResult(result);
      setMeta(runMeta);

      const detected = detectExistingConflicts(existing, result);
      setConflicts(detected);
      setChoices(Object.fromEntries(detected.map((c) => [c.field.name as string, "ai" as const])));
    } catch {
      setError("Something went wrong preparing the extraction. Your input is safe — please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApply = () => {
    if (!lastResult) return;
    // Start from the AI result, then honour every "keep existing" choice.
    const overrides: Record<string, unknown> = {};
    for (const conflict of conflicts) {
      if (choices[conflict.field.name as string] === "existing") {
        overrides[conflict.field.name as string] =
          conflict.field.kind === "number" ? Number(conflict.existing) : conflict.existing;
      }
    }
    onApply({ ...lastResult, ...overrides } as AiExtractionResult);
    setIsOpen(false);
  };

  const visibleDocs = lastResult?.documentation.filter((d) => d.status !== "not_stated") ?? [];

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-brand-gold/40 bg-gradient-to-r from-brand-sand/30 via-brand-cream to-brand-gold/10 p-5 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-forest text-brand-gold-light">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          <div>
            <h3 className="font-serif text-base font-semibold text-brand-forest">
              AI Listing &amp; Documentation Assistant
            </h3>
            <p className="text-xs text-brand-muted">
              Paste raw property text (WhatsApp agent note, marketing brief) to extract specs &amp; title document statuses.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="btn-secondary !px-4 !py-2 text-xs font-semibold"
        >
          {isOpen ? "Close Assistant" : "Open Assistant"}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 space-y-4 border-t border-brand-sand/80 pt-4">
          <div>
            <label htmlFor="raw-listing-text" className="block text-xs font-semibold text-brand-forest">
              Paste Raw Property Description / Agent Notes
            </label>
            <textarea
              id="raw-listing-text"
              rows={5}
              placeholder="e.g. 4 Bedroom detached duplex in Lekki Phase 1 for 185m. Comes with Governor's Consent, approved building plan and registered survey..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-white p-3 text-xs text-brand-forest font-mono focus:border-brand-gold focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleExtract}
              disabled={!rawText.trim() || isExtracting}
              className="btn-primary !px-5 !py-2.5 text-xs font-semibold shadow-xs disabled:opacity-50"
            >
              {isExtracting ? "Extracting…" : "Extract Listing Details"}
            </button>

            {lastResult && !isExtracting && (
              <button
                type="button"
                onClick={handleApply}
                className="btn-gold !px-5 !py-2.5 text-xs font-semibold shadow-md"
              >
                Apply Extracted Fields to Form ↓
              </button>
            )}
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          {meta && (
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold ${
                  meta.source === "groq"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {meta.source === "groq"
                  ? `Enhanced by Groq (${meta.model ?? "AI"})`
                  : "Offline extraction"}
              </span>
              {meta.warnings.map((w, i) => (
                <span key={i} className="text-amber-700">{w}</span>
              ))}
            </div>
          )}

          {lastResult && (
            <div className="rounded-xl border border-brand-forest/20 bg-brand-white p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-forest">
                Extracted Preview for Human Review
              </h4>

              <div className="grid gap-2 text-xs text-brand-muted sm:grid-cols-2">
                <p><strong className="text-brand-forest">Title:</strong> {lastResult.title}</p>
                <p><strong className="text-brand-forest">Category/Type:</strong> {lastResult.category} / {lastResult.type}</p>
                <p><strong className="text-brand-forest">Price:</strong> {lastResult.price ? `₦${lastResult.price.toLocaleString()}` : "Price on request"}</p>
                <p><strong className="text-brand-forest">Location:</strong> {lastResult.location}</p>
              </div>

              {conflicts.length > 0 && (
                <div className="rounded-lg border border-rose-300 bg-rose-50 p-3 text-xs">
                  <p className="font-semibold text-rose-900 mb-2">
                    Value conflict detected. Choose which value to keep:
                  </p>
                  <div className="space-y-2">
                    {conflicts.map((c) => {
                      const fieldName = c.field.name as string;
                      const fmt = c.field.format ?? ((v: unknown) => String(v ?? ""));
                      const chosen = choices[fieldName] ?? "ai";
                      return (
                        <div key={fieldName} className="rounded-md border border-rose-200 bg-white p-2">
                          <p className="mb-1 font-semibold text-brand-forest">{c.field.label}</p>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setChoices((p) => ({ ...p, [fieldName]: "existing" }))}
                              className={`rounded-md border px-2 py-1 text-left ${
                                chosen === "existing"
                                  ? "border-brand-forest bg-brand-forest/10 font-semibold text-brand-forest"
                                  : "border-brand-stone/60 text-brand-muted"
                              }`}
                            >
                              Existing: {c.field.kind === "number" ? fmt(Number(c.existing)) : c.existing}
                            </button>
                            <button
                              type="button"
                              onClick={() => setChoices((p) => ({ ...p, [fieldName]: "ai" }))}
                              className={`rounded-md border px-2 py-1 text-left ${
                                chosen === "ai"
                                  ? "border-brand-gold-dark bg-brand-gold/10 font-semibold text-brand-forest"
                                  : "border-brand-stone/60 text-brand-muted"
                              }`}
                            >
                              AI: {fmt(c.aiValue)}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {lastResult.conflicts.length > 0 && (
                <div className="rounded-lg border border-orange-300 bg-orange-50 p-3 text-xs text-orange-900">
                  <p className="font-semibold mb-1">Contradictions found in the source text:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {lastResult.conflicts.map((c, i) => (
                      <li key={i}>
                        <strong>{c.field}:</strong> “{c.val1}” vs “{c.val2}” — {c.explanation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {lastResult.ambiguityFlags.length > 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
                  <p className="font-semibold text-amber-900 mb-1">⚠️ Ambiguity Flags (Requires Verification):</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {lastResult.ambiguityFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              {lastResult.needsVerification.length > 0 && (
                <div className="rounded-lg border border-indigo-300 bg-indigo-50 p-3 text-xs text-indigo-900">
                  <p className="font-semibold mb-1">Needs verification before publishing:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {lastResult.needsVerification.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-brand-forest mb-1">Extracted Documentation Statuses:</p>
                <div className="flex flex-wrap gap-1.5">
                  {visibleDocs.map((d) => (
                    <span
                      key={d.type}
                      className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                        d.status === "available"
                          ? "bg-emerald-100 text-emerald-800"
                          : d.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : d.status === "requires_verification"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {d.type.replace(/_/g, " ")}: {d.status.replace(/_/g, " ")}
                    </span>
                  ))}
                  {visibleDocs.length === 0 && (
                    <span className="text-xs text-brand-muted italic">No specific documents named (all unstated items defaulted to &quot;not_stated&quot;).</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

