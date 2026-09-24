"use server";

import type { Property } from "@/lib/types";
import { isSupabaseStorageReady } from "@/lib/storage";
import {
  dbDeleteProperty,
  dbListEnquiries,
  dbListProperties,
  dbUpsertProperty,
  isAdminDatabaseConfigured,
  isSupabaseConfigured,
  supabaseServerConfig,
} from "@/lib/supabase";

export type DiagCheck = { name: string; ok: boolean; detail: string };
export type DiagState = { ran: boolean; checks: DiagCheck[] };

const PROBE_ID = "__admin_diagnostics_probe__";

function probeProperty(): Property {
  const now = new Date().toISOString();
  return {
    id: PROBE_ID,
    slug: PROBE_ID,
    title: "Diagnostics probe (auto-deleted)",
    category: "home",
    type: "duplex",
    purpose: "sale",
    shortDescription: "Temporary connectivity probe.",
    description: ["Temporary connectivity probe."],
    price: null,
    currency: "NGN",
    location: "Diagnostics",
    status: "coming-soon",
    featured: false,
    mainImage: { url: "/images/properties/exterior-duplex.svg", alt: "probe" },
    gallery: [],
    amenities: [],
    createdAt: now,
    updatedAt: now,
  };
}

async function storageBucketCheck(): Promise<DiagCheck> {
  const cfg = supabaseServerConfig();
  if (!isSupabaseStorageReady() || !cfg) {
    return {
      name: "Image storage (bucket)",
      ok: false,
      detail: "SUPABASE_SECRET_KEY or NEXT_PUBLIC_SUPABASE_URL missing — uploads disabled.",
    };
  }
  const base = cfg.url;
  const key = cfg.key;
  try {
    const res = await fetch(`${base}/storage/v1/bucket/property-images`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    return {
      name: "Image storage (bucket)",
      ok: res.ok,
      detail: res.ok
        ? "property-images bucket exists; uploads can be stored."
        : `Bucket check failed (HTTP ${res.status}). It is created automatically on first upload.`,
    };
  } catch (e) {
    return {
      name: "Image storage (bucket)",
      ok: false,
      detail: `Network error: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

/**
 * Runs live connectivity checks against Supabase using the server's own
 * credentials. Values are never echoed — only present/missing and the
 * outcome of a self-cleaning write probe.
 */
export async function runDiagnosticsAction(
  _prev: DiagState,
  _form: FormData
): Promise<DiagState> {
  void _prev;
  void _form;
  const checks: DiagCheck[] = [];

  checks.push({
    name: "Public credentials (URL + publishable key)",
    ok: isSupabaseConfigured(),
    detail: isSupabaseConfigured()
      ? "Set — public reads and the site catalogue can use the database."
      : "Missing — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then restart.",
  });

  checks.push({
    name: "Server database key (secret)",
    ok: isAdminDatabaseConfigured(),
    detail: isAdminDatabaseConfigured()
      ? "Set — admin saves, deletes and the enquiry inbox are enabled."
      : "Missing — set SUPABASE_SECRET_KEY (Supabase dashboard → Settings → API keys), then restart. Saves are disabled until then.",
  });

  try {
    const rows = await dbListProperties();
    checks.push({
      name: "Database read (properties)",
      ok: rows !== null,
      detail:
        rows !== null
          ? `Readable — ${rows.length} row(s) in the properties table${rows.length === 0 ? " (site shows seed data until you add one)" : ""}.`
          : "Read failed — check the URL/publishable key and that supabase/schema.sql was applied.",
    });
  } catch (e) {
    checks.push({
      name: "Database read (properties)",
      ok: false,
      detail: `Threw: ${e instanceof Error ? e.message : String(e)}`,
    });
  }

  try {
    const inbox = await dbListEnquiries();
    checks.push({
      name: "Enquiry inbox read",
      ok: inbox !== null,
      detail:
        inbox !== null
          ? `Readable — ${inbox.length} stored enquirie(s).`
          : "Read failed — the secret key is required (see above).",
    });
  } catch (e) {
    checks.push({
      name: "Enquiry inbox read",
      ok: false,
      detail: `Threw: ${e instanceof Error ? e.message : String(e)}`,
    });
  }

  // Write probe: the exact call the property editor makes, then delete it.
  try {
    const saved = await dbUpsertProperty(probeProperty());
    if (!saved.ok) {
      checks.push({
        name: "Property save probe (write + delete)",
        ok: false,
        detail: `Save rejected (HTTP ${saved.status}): ${saved.error}`,
      });
    } else {
      const removed = await dbDeleteProperty(PROBE_ID);
      checks.push({
        name: "Property save probe (write + delete)",
        ok: removed.ok,
        detail: removed.ok
          ? "Save and delete both succeeded — the editor can persist properties."
          : `Save worked but cleanup delete failed (HTTP ${(removed as { status?: number }).status ?? "?"}). A probe row may remain in properties.`,
      });
    }
  } catch (e) {
    checks.push({
      name: "Property save probe (write + delete)",
      ok: false,
      detail: `Threw: ${e instanceof Error ? e.message : String(e)}`,
    });
  }

  checks.push(await storageBucketCheck());

  return { ran: true, checks };
}
