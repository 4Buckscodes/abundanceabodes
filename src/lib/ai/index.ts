import type { PropertyAIProvider } from "@/lib/ai/provider";
import {
  GroqProvider,
  GROQ_API_KEY_ENV,
  GROQ_MODEL_ENV,
  DEFAULT_GROQ_MODEL,
} from "@/lib/ai/groq";

/**
 * True when a live AI provider can run — i.e. a Groq key is present and we are
 * on the server. Mirrors the `isSupabaseConfigured()` null-object idiom: the
 * app degrades gracefully to deterministic extraction when this is false.
 */
export function isGroqConfigured(): boolean {
  if (typeof window !== "undefined") return false;
  return Boolean(process.env[GROQ_API_KEY_ENV]);
}

/** The Groq model that will be used, honouring `GROQ_MODEL` with a safe default. */
export function groqModel(): string {
  return process.env[GROQ_MODEL_ENV]?.trim() || DEFAULT_GROQ_MODEL;
}

/**
 * The single provider-selection point. Returns a configured provider or `null`
 * when no live provider is available (caller then runs deterministic
 * extraction). Swapping to a different backend later means adding a new
 * `PropertyAIProvider` implementation and one branch here — no consumer of the
 * interface (server action, Property Editor, Listing Assistant) changes.
 */
export function getProvider(): PropertyAIProvider | null {
  if (isGroqConfigured()) {
    return new GroqProvider(process.env[GROQ_API_KEY_ENV] as string, groqModel());
  }
  return null;
}

export type { PropertyAIProvider } from "@/lib/ai/provider";
export { AiProviderError } from "@/lib/ai/provider";
