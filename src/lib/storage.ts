/**
 * Server-side Supabase Storage helpers for property imagery.
 *
 * Uses the server-only secret key (SUPABASE_SECRET_KEY, legacy
 * SUPABASE_SERVICE_ROLE_KEY as fallback) via supabaseServerConfig() — never a
 * NEXT_PUBLIC value. All requests run inside authenticated admin API routes.
 *
 * Images live in the public "property-images" bucket, which is created
 * automatically on first upload if missing, so no dashboard setup needed.
 */

import { supabaseServerConfig } from "@/lib/supabase";

const BUCKET = "property-images";
const MAX_BYTES = 5 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isSupabaseStorageReady(): boolean {
  return supabaseServerConfig() !== null;
}

function cfg(): { url: string; key: string } {
  const c = supabaseServerConfig();
  if (!c) throw new Error("Supabase server config unavailable");
  return c;
}

function headers(extra: Record<string, string> = {}) {
  const { key } = cfg();
  return { apikey: key, Authorization: `Bearer ${key}`, ...extra };
}

function safeExt(file: File): string | null {
  const byMime = EXT_BY_MIME[file.type];
  if (byMime) return byMime;
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && Object.values(EXT_BY_MIME).includes(fromName)) {
    // Trust extension only when it maps to an accepted type.
    const guessed = `image/${fromName === "jpg" ? "jpeg" : fromName}`;
    return EXT_BY_MIME[guessed] ?? null;
  }
  return null;
}

async function ensureBucket(): Promise<void> {
  const { url } = cfg();
  const res = await fetch(`${url}/storage/v1/bucket/${BUCKET}`, {
    headers: headers(),
    cache: "no-store",
  });
  if (res.ok) return;
  await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ name: BUCKET, public: true }),
  });
  // If it already existed (race/duplicate), the subsequent upload decides.
}

export async function uploadImage(
  file: File
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  if (!isSupabaseStorageReady()) {
    return {
      ok: false,
      error: "Uploads are not configured yet (missing server secret key).",
    };
  }

  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Image must be smaller than 5 MB." };
  }

  const ext = safeExt(file);
  if (!ext) {
    return { ok: false, error: "Only JPG, PNG or WebP images are allowed." };
  }

  const { url } = cfg();
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const path = `${Date.now().toString(36)}-${rand}.${ext}`;

  let created = false;
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
      method: "POST",
      headers: headers({
        "Content-Type": file.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
        "x-upsert": "true",
      }),
      body: file,
      cache: "no-store",
    });

    if (res.ok) {
      return { ok: true, url: `${url}/storage/v1/object/public/${BUCKET}/${path}` };
    }

    // Bucket missing -> create it once, then retry.
    const bodyText = await res.text().catch(() => "");
    if ((res.status === 404 || bodyText.includes("Bucket not found")) && !created) {
      created = true;
      await ensureBucket();
      continue;
    }

    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        error: "Storage rejected the upload — check SUPABASE_SECRET_KEY.",
      };
    }
    return { ok: false, error: "Storage upload failed. Please try again." };
  }

  return { ok: false, error: "Storage upload failed. Please try again." };
}
