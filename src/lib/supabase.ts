/**
 * Zero-dependency Supabase/PostgREST adapter.
 *
 * Uses plain `fetch` against the Supabase REST endpoint instead of adding the
 * supabase-js dependency while credentials do not yet exist. When the client
 * provisions their project they only need to set:
 *
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
 *
 * and every repository in src/lib/data/index.ts switches from seed data to
 * the live database without code changes.
 *
 * Admin writes (property saves/deletes) and the enquiry inbox do NOT use the
 * anon key: the dashboard authenticates with its own HMAC session cookie
 * (see src/lib/auth.ts), not Supabase Auth, so the anon key can never satisfy
 * the admin-only RLS policies. Those helpers run exclusively on the server
 * (server components, server actions, API routes) and use
 * SUPABASE_SERVICE_ROLE_KEY via adminRest() instead.
 */
import type { Enquiry, Property } from "@/lib/types";

export const SUPABASE_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
export const SUPABASE_ANON_KEY_ENV = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

function env(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export function isSupabaseConfigured(): boolean {
  return env() !== null;
}

/* ------------------------------------------------------------------ */
/* Privileged server access (service role)                             */
/* ------------------------------------------------------------------ */

/**
 * Server-side credentials for admin writes and the enquiry inbox.
 *
 * Guarded to the server (`typeof window` check) so the service role key —
 * which bypasses Row Level Security — can never be used from the browser,
 * even if one of these helpers were imported from client code by mistake.
 * Every caller is a server component, server action or API route, each
 * gated by the admin session cookie (except the public enquiry insert,
 * whose payload is validated in src/app/api/enquiries/route.ts first).
 */
function serviceEnv(): { url: string; key: string } | null {
  if (typeof window !== "undefined") return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

/** True when admin saves, deletes and the enquiry inbox can work. */
export function isAdminDatabaseConfigured(): boolean {
  return serviceEnv() !== null;
}

/** Detailed outcome of a privileged write, so admin UI can explain failures. */
export type WriteOutcome =
  | { ok: true }
  | { ok: false; status: number; error: string };

/**
 * Turns a failed write into an admin-facing message. Shown only inside the
 * password-protected dashboard, where the reader can act on it.
 */
export function describeWriteError(outcome: Extract<WriteOutcome, { ok: false }>): string {
  if (outcome.status === 0) {
    return `Could not reach the database: ${outcome.error}`;
  }
  if (outcome.status === 401 || outcome.status === 403) {
    return "The database rejected the server credentials (HTTP 401/403). Check SUPABASE_SERVICE_ROLE_KEY in the environment (Supabase dashboard → Settings → API), then restart the server.";
  }
  if (outcome.status === 404) {
    return "The table was not found (HTTP 404). Run supabase/schema.sql in the Supabase SQL editor, then try again.";
  }
  if (outcome.status === 400) {
    return `The database refused the save — the live table likely differs from supabase/schema.sql (HTTP 400): ${outcome.error}`;
  }
  return `Could not save right now (HTTP ${outcome.status}): ${outcome.error}`;
}

async function adminRest<T>(
  path: string,
  init: RequestInit & { preferRepresentation?: boolean } = {}
): Promise<T | null> {
  const cfg = serviceEnv();
  if (!cfg) return null;

  const headers: Record<string, string> = {
    apikey: cfg.key,
    Authorization: `Bearer ${cfg.key}`,
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (init.preferRepresentation) {
    headers["Prefer"] = "return=representation";
  }

  try {
    const res = await fetch(`${cfg.url}/rest/v1/${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const text = await res.text();
    // DELETEs answer 204 No Content: an empty body on success.
    if (!text) return true as unknown as T;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Privileged write that preserves the failure reason instead of swallowing
 * it, so the admin UI can tell "bad key" apart from "schema mismatch".
 */
async function adminWrite(
  path: string,
  init: RequestInit
): Promise<WriteOutcome> {
  const cfg = serviceEnv();
  if (!cfg) {
    return {
      ok: false,
      status: 0,
      error: "SUPABASE_SERVICE_ROLE_KEY is not configured on the server.",
    };
  }

  let res: Response;
  try {
    res = await fetch(`${cfg.url}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        ...((init.headers as Record<string, string> | undefined) ?? {}),
      },
      cache: "no-store",
    });
  } catch (e) {
    return {
      ok: false,
      status: 0,
      error: e instanceof Error ? e.message : String(e),
    };
  }

  if (res.ok) return { ok: true };

  const body = await res.text().catch(() => "");
  let detail = body || res.statusText;
  try {
    const parsed = JSON.parse(body) as {
      message?: string;
      error?: string;
      hint?: string | null;
    };
    detail = parsed.message || parsed.error || body;
    if (parsed.hint) detail += ` (${parsed.hint})`;
  } catch {
    // Keep the raw body.
  }
  return { ok: false, status: res.status, error: detail.slice(0, 300) };
}

async function rest<T>(
  path: string,
  init: RequestInit & { preferRepresentation?: boolean } = {}
): Promise<T | null> {
  const cfg = env();
  if (!cfg) return null;

  const headers: Record<string, string> = {
    apikey: cfg.key,
    Authorization: `Bearer ${cfg.key}`,
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (init.preferRepresentation) {
    headers["Prefer"] = "return=representation";
  }

  try {
    const res = await fetch(`${cfg.url}/rest/v1/${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
    if (!res.ok) return null;
    const text = await res.text();
    // DELETEs answer 204 No Content: an empty body on success.
    if (!text) return true as unknown as T;
    return JSON.parse(text) as T;
  } catch {
    // Network/schema issues must never take the public site down.
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Properties                                                          */
/* ------------------------------------------------------------------ */

const PROPERTY_COLUMNS =
  "id,slug,title,category,type,purpose,short_description,description,price,currency," +
  "price_note,location,address,bedrooms,bathrooms,toilets,parking_spaces,land_size," +
  "property_size,status,featured,main_image,gallery,youtube_url,amenities,documentation," +
  "developer_name,developer_note,seo_title,seo_description,seo_keywords,created_at,updated_at";

type PropertyRow = Record<string, unknown>;

function rowToProperty(row: PropertyRow): Property {
  return {
    id: String(row.id ?? ""),
    slug: String(row.slug ?? ""),
    title: String(row.title ?? ""),
    category: (row.category as Property["category"]) ?? "home",
    type: (row.type as Property["type"]) ?? "duplex",
    purpose: (row.purpose as Property["purpose"]) ?? "sale",
    shortDescription: String(row.short_description ?? ""),
    description: Array.isArray(row.description)
      ? (row.description as string[])
      : String(row.description ?? "")
          .split("\n\n")
          .filter(Boolean),
    price: row.price == null ? null : Number(row.price),
    currency: (row.currency as Property["currency"]) ?? "NGN",
    priceNote: row.price_note == null ? undefined : String(row.price_note),
    location: String(row.location ?? ""),
    address: row.address == null ? undefined : String(row.address),
    bedrooms: row.bedrooms == null ? undefined : Number(row.bedrooms),
    bathrooms: row.bathrooms == null ? undefined : Number(row.bathrooms),
    toilets: row.toilets == null ? undefined : Number(row.toilets),
    parkingSpaces:
      row.parking_spaces == null ? undefined : Number(row.parking_spaces),
    landSize: row.land_size == null ? undefined : String(row.land_size),
    propertySize:
      row.property_size == null ? undefined : String(row.property_size),
    status: (row.status as Property["status"]) ?? "available",
    featured: Boolean(row.featured),
    mainImage:
      typeof row.main_image === "object" && row.main_image !== null
        ? (row.main_image as Property["mainImage"])
        : { url: "/images/properties/exterior-duplex.svg", alt: "" },
    gallery: Array.isArray(row.gallery)
      ? (row.gallery as Property["gallery"])
      : [],
    youtubeUrl: row.youtube_url == null ? undefined : String(row.youtube_url),
    amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : [],
    documentation: Array.isArray(row.documentation)
      ? (row.documentation as Property["documentation"])
      : [],
    developerName:
      row.developer_name == null ? undefined : String(row.developer_name),
    developerNote:
      row.developer_note == null ? undefined : String(row.developer_note),
    seoTitle: row.seo_title == null ? undefined : String(row.seo_title),
    seoDescription:
      row.seo_description == null ? undefined : String(row.seo_description),
    seoKeywords: Array.isArray(row.seo_keywords)
      ? (row.seo_keywords as string[])
      : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  };
}

export async function dbListProperties(): Promise<Property[] | null> {
  const rows = await rest<PropertyRow[]>(
    `properties?select=${PROPERTY_COLUMNS}&order=featured.desc,updated_at.desc`
  );
  if (!rows) return null;
  return rows.map(rowToProperty);
}

export async function dbGetProperty(
  slug: string
): Promise<Property | null> {
  const rows = await rest<PropertyRow[]>(
    `properties?select=${PROPERTY_COLUMNS}&slug=eq.${encodeURIComponent(slug)}&limit=1`
  );
  if (!rows || rows.length === 0) return null;
  return rowToProperty(rows[0]);
}

export async function dbUpsertProperty(property: Property): Promise<WriteOutcome> {
  const row = {
    id: property.id,
    slug: property.slug,
    title: property.title,
    category: property.category,
    type: property.type,
    purpose: property.purpose,
    short_description: property.shortDescription,
    description: property.description,
    price: property.price,
    currency: property.currency,
    price_note: property.priceNote ?? null,
    location: property.location,
    address: property.address ?? null,
    bedrooms: property.bedrooms ?? null,
    bathrooms: property.bathrooms ?? null,
    toilets: property.toilets ?? null,
    parking_spaces: property.parkingSpaces ?? null,
    land_size: property.landSize ?? null,
    property_size: property.propertySize ?? null,
    status: property.status,
    featured: property.featured,
    main_image: property.mainImage,
    gallery: property.gallery,
    youtube_url: property.youtubeUrl ?? null,
    amenities: property.amenities,
    documentation: property.documentation ?? [],
    developer_name: property.developerName ?? null,
    developer_note: property.developerNote ?? null,
    seo_title: property.seoTitle ?? null,
    seo_description: property.seoDescription ?? null,
    seo_keywords: property.seoKeywords ?? null,
    created_at: property.createdAt,
    updated_at: new Date().toISOString(),
  };
  // Privileged: called only from the admin server actions, which verify the
  // HMAC session cookie first. The anon key can never satisfy the
  // admin-only RLS policies, so this uses the service role (bypasses RLS).
  const outcome = await adminWrite(`properties`, {
    method: "POST",
    body: JSON.stringify([row]),
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
  });
  return outcome;
}

export async function dbDeleteProperty(id: string): Promise<WriteOutcome> {
  // Privileged (see dbUpsertProperty): admin server actions only.
  return adminWrite(`properties?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

/* ------------------------------------------------------------------ */
/* Enquiries                                                           */
/* ------------------------------------------------------------------ */

export type EnquiryInsertResult = "stored" | "not-writable" | "error";

/**
 * Inserts an enquiry. Called server-side from /api/enquiries, whose payload
 * is validated before this runs. Prefers the service role (immune to a
 * missing/misapplied insert policy) and falls back to the anon key, which
 * relies on the "anyone can submit enquiries" RLS policy. Returns
 * "not-writable" when neither credential is available or the anon attempt
 * is rejected for authorisation reasons, so callers can treat it as
 * setup-pending rather than a hard failure.
 */
export async function dbInsertEnquiry(input: {
  name: string;
  email: string;
  phone: string;
  propertySlug?: string | null;
  propertyTitle?: string | null;
  preferredTime?: string | null;
  message?: string | null;
}): Promise<EnquiryInsertResult> {
  const svc = serviceEnv();
  const anon = env();
  const cfg = svc ?? anon;
  if (!cfg) return "not-writable";

  const headers: Record<string, string> = {
    apikey: cfg.key,
    Authorization: `Bearer ${cfg.key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  try {
    const res = await fetch(`${cfg.url}/rest/v1/enquiries`, {
      method: "POST",
      headers,
      cache: "no-store",
      body: JSON.stringify([
        {
          name: input.name,
          email: input.email,
          phone: input.phone,
          property_slug: input.propertySlug ?? null,
          property_title: input.propertyTitle ?? null,
          preferred_time: input.preferredTime ?? null,
          message: input.message ?? null,
          status: "new",
        },
      ]),
    });
    if (res.ok) return "stored";
    // The service role bypasses RLS, so any rejection there is a real
    // failure. The anon key depends on the insert policy being applied —
    // an auth rejection there means setup is still pending.
    if (!svc && (res.status === 401 || res.status === 403)) return "not-writable";
    return "error";
  } catch {
    return "error";
  }
}

export async function dbListEnquiries(): Promise<Enquiry[] | null> {
  // Privileged: admin dashboard server components only (HMAC-gated). The
  // anon key can never satisfy the admin-only select policy.
  const rows = await adminRest<
    {
      id: string;
      name: string;
      email: string;
      phone: string;
      property_slug: string | null;
      property_title: string | null;
      preferred_time: string | null;
      message: string | null;
      status: Enquiry["status"];
      created_at: string;
    }[]
  >("enquiries?select=*&order=created_at.desc");
  if (!rows) return null;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    propertySlug: r.property_slug,
    propertyTitle: r.property_title,
    preferredTime: r.preferred_time,
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function dbUpdateEnquiryStatus(
  id: string,
  status: Enquiry["status"]
): Promise<WriteOutcome> {
  // Privileged (see dbListEnquiries): admin server actions only.
  return adminWrite(`enquiries?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
    headers: { Prefer: "return=representation" },
  });
}
