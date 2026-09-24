import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/auth";
import { uploadImage } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Authenticated image upload for the admin dashboard.
 * Accepts multipart/form-data with a "file" field; returns the public URL.
 * The admin session cookie is verified server-side on every request.
 */
export async function POST(request: Request) {
  const store = await cookies();
  const authed = await verifySessionToken(store.get(ADMIN_COOKIE)?.value);
  if (!authed) {
    return NextResponse.json(
      { ok: false, error: "Not authorised." },
      { status: 403 }
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const candidate = form.get("file");
    if (candidate instanceof File) file = candidate;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid upload." },
      { status: 400 }
    );
  }

  if (!file || file.size === 0) {
    return NextResponse.json(
      { ok: false, error: "No file received." },
      { status: 400 }
    );
  }

  const result = await uploadImage(file);

  if (!result.ok) {
    const configured = result.error.includes("not configured");
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: configured ? 503 : 422 }
    );
  }

  return NextResponse.json({ ok: true, url: result.url });
}
