"use server";

import type { AiExtractionResponse, AiRunMeta } from "@/lib/ai/provider";
import { AiProviderError } from "@/lib/ai/provider";
import { getProvider, groqModel } from "@/lib/ai";
import { extractPropertyFromRawText } from "@/lib/ai-assistant";

/** Maps a provider error kind to a calm, user-facing sentence (never the raw API error). */
function describeAiError(kind: AiProviderError["kind"]): string {
  switch (kind) {
    case "missing_key":
      return "AI service is not configured, so offline extraction was used instead.";
    case "rate_limit":
      return "AI service is busy right now — offline extraction was used instead.";
    case "timeout":
      return "AI service took too long, so offline extraction was used instead.";
    case "invalid_model":
      return "Configured AI model is unavailable — offline extraction was used instead.";
    case "invalid_json":
    case "schema":
      return "AI returned an unexpected response, so offline extraction was used instead.";
    case "network":
      return "Could not reach the AI service — offline extraction was used instead.";
    default:
      return "AI extraction failed, so offline extraction was used instead.";
  }
}

/**
 * Server boundary for the AI Listing Assistant. Runs the configured provider
 * (Groq) when available and falls back to the deterministic engine on ANY
 * failure — the admin never loses their input. Only metadata is logged; the raw
 * customer text, the API key and raw provider errors are never surfaced.
 */
export async function extractListingAction(rawText: string): Promise<AiExtractionResponse> {
  const started = Date.now();
  const trimmed = rawText?.trim() ?? "";

  const provider = getProvider();

  // No live provider configured → deterministic extraction, quietly.
  if (!provider) {
    const result = extractPropertyFromRawText(trimmed);
    const meta: AiRunMeta = {
      source: "deterministic",
      latencyMs: Date.now() - started,
      validation: "ok",
      warnings: [],
    };
    logRun({ provider: "deterministic", model: undefined, ok: true, latencyMs: meta.latencyMs, validation: "ok" });
    return { result, meta };
  }

  try {
    const result = await provider.extractProperty(trimmed);
    const meta: AiRunMeta = {
      source: "groq",
      model: provider.model,
      latencyMs: Date.now() - started,
      validation: "ok",
      warnings: [],
    };
    logRun({ provider: provider.id, model: provider.model, ok: true, latencyMs: meta.latencyMs, validation: "ok" });
    return { result, meta };
  } catch (err) {
    const kind = err instanceof AiProviderError ? err.kind : "provider";
    const result = extractPropertyFromRawText(trimmed);
    const meta: AiRunMeta = {
      source: "deterministic",
      model: groqModel(),
      latencyMs: Date.now() - started,
      validation: "fallback",
      warnings: [describeAiError(kind)],
    };
    logRun({ provider: "groq", model: groqModel(), ok: false, latencyMs: meta.latencyMs, validation: "fallback" });
    return { result, meta };
  }
}

/** Metadata-only structured log — no key, no raw customer text, no PII. */
function logRun(entry: {
  provider: string;
  model?: string;
  ok: boolean;
  latencyMs: number;
  validation: "ok" | "fallback";
}): void {
  console.info("[ai-listing-assistant]", JSON.stringify(entry));
}
