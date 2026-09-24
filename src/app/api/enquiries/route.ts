import { NextResponse } from "next/server";
import { dbInsertEnquiry, isSupabaseConfigured } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{6,19}$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  propertySlug?: unknown;
  propertyTitle?: unknown;
  preferredTime?: unknown;
  message?: unknown;
};

function str(value: unknown, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const name = str(body.name, 120);
  const email = str(body.email, 160);
  const phone = str(body.phone, 40);
  const propertySlug = str(body.propertySlug, 200) || null;
  const propertyTitle = str(body.propertyTitle, 200) || null;
  const preferredTime = str(body.preferredTime, 160) || null;
  const message = str(body.message, 1500) || null;

  if (!name || !EMAIL_RE.test(email) || !PHONE_RE.test(phone)) {
    return NextResponse.json(
      { ok: false, error: "Please check the name, email and phone fields." },
      { status: 422 }
    );
  }

  if (!isSupabaseConfigured()) {
    // No database yet — acknowledge so the client UX completes cleanly.
    return NextResponse.json({ ok: true, stored: false });
  }

  const result = await dbInsertEnquiry({
    name,
    email,
    phone,
    propertySlug,
    propertyTitle,
    preferredTime,
    message,
  });

  if (result === "not-writable") {
    // Supabase connected but RLS/permissions not finished — treat as
    // setup-pending rather than failing the visitor's submission.
    return NextResponse.json({ ok: true, stored: false });
  }

  if (result === "error") {
    return NextResponse.json(
      { ok: false, error: "Could not record your enquiry right now." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
