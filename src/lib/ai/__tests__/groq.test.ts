import { describe, it, expect, vi, afterEach } from "vitest";
import { GroqProvider } from "@/lib/ai/groq";
import { AiProviderError } from "@/lib/ai/provider";

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

/** Stub global fetch with a Groq-shaped chat-completions response. */
function stubFetch(opts: {
  ok?: boolean;
  status?: number;
  content?: string;
  reject?: unknown;
}) {
  const fn = vi.fn(async () => {
    if (opts.reject) throw opts.reject;
    return {
      ok: opts.ok ?? true,
      status: opts.status ?? 200,
      json: async () => ({ choices: [{ message: { content: opts.content ?? "" } }] }),
      text: async () => "",
    } as unknown as Response;
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("GroqProvider.extractProperty", () => {
  it("(1) parses a valid structured response and reconciles it", async () => {
    stubFetch({ content: JSON.stringify(validModelJson()) });
    const provider = new GroqProvider("test-key", "qwen/qwen3.8-27b");
    const result = await provider.extractProperty(SRC);
    expect(result.price).toBe(180_000_000);
    // Deterministic documentation authority still applies via the provider path.
    expect(result.documentation.find((d) => d.type === "governors_consent")?.status).toBe("available");
  });

  it("(11) throws schema error on structurally invalid model JSON", async () => {
    stubFetch({ content: JSON.stringify({ title: "x", category: "castle" }) });
    const provider = new GroqProvider("test-key", "qwen/qwen3.8-27b");
    await expect(provider.extractProperty(SRC)).rejects.toMatchObject({ kind: "schema" });
  });

  it("(11) throws invalid_json when message content is not JSON", async () => {
    stubFetch({ content: "here is your listing: {oops" });
    const provider = new GroqProvider("test-key", "qwen/qwen3.8-27b");
    await expect(provider.extractProperty(SRC)).rejects.toMatchObject({ kind: "invalid_json" });
  });

  it("maps HTTP 401 to missing_key", async () => {
    stubFetch({ ok: false, status: 401 });
    const provider = new GroqProvider("bad-key", "qwen/qwen3.8-27b");
    await expect(provider.extractProperty(SRC)).rejects.toMatchObject({ kind: "missing_key" });
  });

  it("maps HTTP 404 to invalid_model", async () => {
    stubFetch({ ok: false, status: 404 });
    const provider = new GroqProvider("test-key", "nope/not-a-model");
    await expect(provider.extractProperty(SRC)).rejects.toMatchObject({ kind: "invalid_model" });
  });

  it("maps HTTP 429 to rate_limit", async () => {
    stubFetch({ ok: false, status: 429 });
    const provider = new GroqProvider("test-key", "qwen/qwen3.8-27b");
    await expect(provider.extractProperty(SRC)).rejects.toMatchObject({ kind: "rate_limit" });
  });

  it("maps an aborted request to timeout", async () => {
    stubFetch({ reject: new DOMException("aborted", "AbortError") });
    const provider = new GroqProvider("test-key", "qwen/qwen3.8-27b");
    await expect(provider.extractProperty(SRC)).rejects.toMatchObject({ kind: "timeout" });
  });

  it("maps a generic network failure to network", async () => {
    stubFetch({ reject: new TypeError("fetch failed") });
    const provider = new GroqProvider("test-key", "qwen/qwen3.8-27b");
    await expect(provider.extractProperty(SRC)).rejects.toBeInstanceOf(AiProviderError);
    await expect(provider.extractProperty(SRC)).rejects.toMatchObject({ kind: "network" });
  });

  it("never leaks the API key into the request URL", async () => {
    const fn = stubFetch({ content: JSON.stringify(validModelJson()) });
    const provider = new GroqProvider("super-secret-key", "qwen/qwen3.8-27b");
    await provider.extractProperty(SRC);
    const [url] = fn.mock.calls[0];
    expect(String(url)).not.toContain("super-secret-key");
  });
});
