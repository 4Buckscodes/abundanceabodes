import type { AiExtractionResult, PropertyListingCopy } from "@/lib/types";
import { PropertyAIProvider, AiProviderError } from "@/lib/ai/provider";
import {
  EXTRACTION_SYSTEM_PROMPT,
  COPY_SYSTEM_PROMPT,
  buildExtractionUserPrompt,
  buildCopyUserPrompt,
} from "@/lib/ai/prompts";
import { validateGroqExtraction, reconcile } from "@/lib/ai/validation";
import { groqCopySchema } from "@/lib/ai/schemas";

export const GROQ_API_KEY_ENV = "GROQ_API_KEY";
export const GROQ_MODEL_ENV = "GROQ_MODEL";
export const DEFAULT_GROQ_MODEL = "qwen/qwen3.8-27b";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 30_000;

type GroqChatMessage = { role: "system" | "user"; content: string };

/**
 * Groq implementation of {@link PropertyAIProvider}. Server-only: the API key is
 * read from `process.env` behind a `typeof window` guard so it can never reach
 * the browser bundle. Talks to Groq's OpenAI-compatible chat-completions
 * endpoint with JSON-object response formatting; Zod (`validation.ts`) is the
 * real authority over the returned shape, and the deterministic engine stays
 * authoritative over documentation once reconciled.
 */
export class GroqProvider implements PropertyAIProvider {
  readonly id = "groq";
  readonly model: string;
  private readonly apiKey: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  private async chat(messages: GroqChatMessage[]): Promise<unknown> {
    if (typeof window !== "undefined") {
      // Defensive: this class must never run in the browser.
      throw new AiProviderError("Groq provider invoked on the client", "provider");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.1,
          reasoning_effort: "low",
          response_format: { type: "json_object" },
          messages,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        throw new AiProviderError("Groq request timed out", "timeout");
      }
      throw new AiProviderError(
        err instanceof Error ? err.message : "Network error contacting Groq",
        "network",
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const status = response.status;
      const kind =
        status === 401 || status === 403
          ? "missing_key"
          : status === 404
            ? "invalid_model"
            : status === 429
              ? "rate_limit"
              : "provider";
      // Body is drained but not surfaced to the user — only metadata is logged upstream.
      await response.text().catch(() => "");
      throw new AiProviderError(`Groq request failed with status ${status}`, kind);
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new AiProviderError("Groq returned a non-JSON response", "invalid_json");
    }

    const content = (payload as { choices?: { message?: { content?: unknown } }[] })
      ?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new AiProviderError("Groq response had no message content", "invalid_json");
    }

    try {
      return JSON.parse(content);
    } catch {
      throw new AiProviderError("Groq message content was not valid JSON", "invalid_json");
    }
  }

  async extractProperty(input: string): Promise<AiExtractionResult> {
    const raw = await this.chat([
      { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
      { role: "user", content: buildExtractionUserPrompt(input) },
    ]);
    const validated = validateGroqExtraction(raw);
    return reconcile(validated, input);
  }

  async generateListing(data: AiExtractionResult): Promise<PropertyListingCopy> {
    const raw = await this.chat([
      { role: "system", content: COPY_SYSTEM_PROMPT },
      { role: "user", content: buildCopyUserPrompt(data) },
    ]);
    const parsed = groqCopySchema.safeParse(raw);
    if (!parsed.success) {
      throw new AiProviderError("Copy output failed schema validation", "schema");
    }
    return {
      title: parsed.data.title,
      shortDescription: parsed.data.shortDescription,
      description: parsed.data.description,
      seoTitle: parsed.data.seoTitle ?? undefined,
      seoDescription: parsed.data.seoDescription ?? undefined,
      seoKeywords: parsed.data.seoKeywords ?? undefined,
    };
  }
}
