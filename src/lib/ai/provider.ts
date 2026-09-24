import type { AiExtractionResult, PropertyListingCopy } from "@/lib/types";

/**
 * Provider-agnostic contract for the AI Listing Assistant.
 *
 * Consumers (the server action, and through it the Property Editor / Listing
 * Assistant) depend only on this interface — never on Groq specifics — so a
 * future provider (Direct Qwen, GLM, OpenAI, …) is a new file implementing
 * `PropertyAIProvider` plus one branch in `getProvider()`, with no change to
 * the editor UI.
 */
export interface PropertyAIProvider {
  /** Stable identifier for logging/telemetry, e.g. "groq". */
  readonly id: string;
  /** Concrete model id in use, e.g. "qwen/qwen3.8-27b". */
  readonly model: string;
  /** Extract structured property facts from raw, untrusted listing text. */
  extractProperty(input: string): Promise<AiExtractionResult>;
  /** Generate brand marketing copy from already-extracted facts. */
  generateListing(data: AiExtractionResult): Promise<PropertyListingCopy>;
}

/** Metadata surfaced to the admin UI — never contains secrets or raw PII. */
export type AiRunMeta = {
  source: "groq" | "deterministic";
  model?: string;
  latencyMs: number;
  validation: "ok" | "fallback";
  warnings: string[];
};

/** Envelope returned by the server action to the client. */
export type AiExtractionResponse = {
  result: AiExtractionResult;
  meta: AiRunMeta;
};

/** Raised by a provider so the caller can fall back to deterministic extraction. */
export class AiProviderError extends Error {
  constructor(
    message: string,
    readonly kind:
      | "missing_key"
      | "rate_limit"
      | "timeout"
      | "invalid_model"
      | "network"
      | "invalid_json"
      | "schema"
      | "provider",
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}
