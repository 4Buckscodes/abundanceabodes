import Link from "next/link";
import { isAdminDatabaseConfigured, isSupabaseConfigured } from "@/lib/supabase";

/** Shared banner explaining the data backend state in admin screens. */
export function SupabaseBanner() {
  if (isAdminDatabaseConfigured()) {
    return (
      <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        Connected to Supabase — changes are saved to the live database.{" "}
        <Link href="/admin/diagnostics" className="font-semibold underline underline-offset-2 hover:opacity-80">
          Run diagnostics
        </Link>
      </div>
    );
  }
  if (isSupabaseConfigured()) {
    return (
      <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
        <strong className="font-semibold">Reads only:</strong> the public
        Supabase credentials are set, but saves need the server-only{" "}
        <code className="rounded bg-brand-forest/10 px-1.5 py-0.5 font-mono text-xs">
          SUPABASE_SERVICE_ROLE_KEY
        </code>{" "}
        (Supabase dashboard → Settings → API). Add it to the environment and
        restart the server to enable editing.{" "}
        <Link href="/admin/diagnostics" className="font-semibold underline underline-offset-2 hover:opacity-80">
          Run diagnostics
        </Link>
      </div>
    );
  }
  return (
    <div className="mb-8 rounded-xl border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm leading-relaxed text-brand-gold-dark">
      <strong className="font-semibold">Preview mode:</strong> Supabase isn&apos;t
      connected yet, so you&apos;re viewing seed data and saves are disabled.
      Once{" "}
      <code className="rounded bg-brand-forest/10 px-1.5 py-0.5 font-mono text-xs">
        NEXT_PUBLIC_SUPABASE_URL
      </code>{" "}
      and{" "}
      <code className="rounded bg-brand-forest/10 px-1.5 py-0.5 font-mono text-xs">
        NEXT_PUBLIC_SUPABASE_ANON_KEY
      </code>{" "}
      are set (schema in <code className="font-mono text-xs">supabase/schema.sql</code>),
      full editing activates automatically.
    </div>
  );
}
