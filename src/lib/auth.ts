/**
 * Admin session authentication.
 *
 * - Password comes from ADMIN_PASSWORD env var (never hardcoded).
 * - Sessions are HMAC-signed tokens stored in an httpOnly cookie.
 * - Verification uses Web Crypto so the same code runs in Edge middleware
 *   and Node server components/actions.
 *
 * If ADMIN_PASSWORD is not configured, login is disabled entirely and the
 * admin area reports that configuration is pending — no default backdoor.
 */

export const ADMIN_COOKIE = "aa_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8 hours

function getSecret(): string | null {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD || // derived fallback so a password alone is enough
    null
  );
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && getSecret());
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(payload: string): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("Admin auth secret missing");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toHex(signature);
}

/** Constant-time-ish comparison for hex strings. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken(): Promise<string | null> {
  if (!isAdminAuthConfigured()) return null;
  const expiry = Date.now() + SESSION_TTL_MS;
  const signature = await hmac(String(expiry));
  return `${expiry}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const [expiryRaw, signature] = token.split(".");
  const expiry = Number(expiryRaw);
  if (!Number.isFinite(expiry) || !signature) return false;
  if (Date.now() > expiry) return false;
  try {
    const expected = await hmac(expiryRaw);
    return safeEqual(signature, expected);
  } catch {
    return false;
  }
}

/** Constant-time password check. */
export async function verifyAdminPassword(
  candidate: string
): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Length-independent double pass keeps timing roughly constant.
  let match = expected.length === candidate.length;
  const len = Math.max(expected.length, candidate.length);
  for (let i = 0; i < len; i++) {
    if ((expected[i] ?? "\0") !== (candidate[i] ?? "\0")) match = false;
  }
  return match && candidate.length > 0;
}
