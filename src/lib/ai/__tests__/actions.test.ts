import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isGroqConfigured, getProvider, groqModel } from "@/lib/ai";
import { extractListingAction } from "@/app/admin/(dashboard)/properties/ai-actions";
import { DEFAULT_GROQ_MODEL } from "@/lib/ai/groq";

const SRC = "3 bedroom duplex in Lekki Phase 1 for 180m with Governor's Consent.";

function validModelJson() {
  return {
    title: "3 Bedroom Duplex",
    category: "home",
    type: "duplex",
    purpose: "sale",
    price: 180_000_000,
    currency: "NGN",
    location: "Lekki Phase 1, Lagos",
    status: "available",
  };
}

function stubFetch(reject: unknown | null, content?: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      if (reject) throw reject;
      return {
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: content ?? "" } }] }),
        text: async () => "",
      } as unknown as Response;
    }),
  );
}

const savedKey = process.env.GROQ_API_KEY;
const savedModel = process.env.GROQ_MODEL;

beforeEach(() => {
  vi.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  process.env.GROQ_API_KEY = savedKey;
  process.env.GROQ_MODEL = savedModel;
  if (savedKey === undefined) delete process.env.GROQ_API_KEY;
  if (savedModel === undefined) delete process.env.GROQ_MODEL;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("provider selection (getProvider / isGroqConfigured)", () => {
  it("(10) reports unconfigured and returns no provider without a key", () => {
    delete process.env.GROQ_API_KEY;
    expect(isGroqConfigured()).toBe(false);
    expect(getProvider()).toBeNull();
  });

  it("returns a Groq provider when a key is present", () => {
    process.env.GROQ_API_KEY = "test-key";
    expect(isGroqConfigured()).toBe(true);
    expect(getProvider()?.id).toBe("groq");
  });

  it("honours GROQ_MODEL with a safe default", () => {
    delete process.env.GROQ_MODEL;
    expect(groqModel()).toBe(DEFAULT_GROQ_MODEL);
    process.env.GROQ_MODEL = "custom/model";
    expect(groqModel()).toBe("custom/model");
  });
});

describe("extractListingAction (server boundary + graceful fallback)", () => {
  it("(10) uses deterministic extraction when GROQ_API_KEY is missing", async () => {
    delete process.env.GROQ_API_KEY;
    const { result, meta } = await extractListingAction(SRC);
    expect(meta.source).toBe("deterministic");
    expect(meta.validation).toBe("ok");
    expect(result.documentation.find((d) => d.type === "governors_consent")?.status).toBe("available");
  });

  it("(1) uses Groq when configured and the call succeeds", async () => {
    process.env.GROQ_API_KEY = "test-key";
    stubFetch(null, JSON.stringify(validModelJson()));
    const { result, meta } = await extractListingAction(SRC);
    expect(meta.source).toBe("groq");
    expect(meta.validation).toBe("ok");
    expect(result.price).toBe(180_000_000);
  });

  it("(9) falls back to deterministic on provider failure, never losing input", async () => {
    process.env.GROQ_API_KEY = "test-key";
    stubFetch(new TypeError("fetch failed"));
    const { result, meta } = await extractListingAction(SRC);
    expect(meta.source).toBe("deterministic");
    expect(meta.validation).toBe("fallback");
    expect(meta.warnings.length).toBeGreaterThan(0);
    // Input preserved → deterministic still produced a real result.
    expect(result.price).toBe(180_000_000);
  });

  it("(11) falls back when the model returns malformed JSON", async () => {
    process.env.GROQ_API_KEY = "test-key";
    stubFetch(null, "not-json {");
    const { meta } = await extractListingAction(SRC);
    expect(meta.source).toBe("deterministic");
    expect(meta.validation).toBe("fallback");
  });
});
