import Link from "next/link";
import { getAllDevelopments } from "@/lib/data";
import { isAdminDatabaseConfigured } from "@/lib/supabase";
import { SupabaseBanner } from "@/components/admin/SupabaseBanner";
import {
  deleteDevelopmentAction,
  duplicateDevelopmentAction,
} from "./actions";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  ongoing: "bg-amber-100 text-amber-800",
  upcoming: "bg-sky-100 text-sky-800",
  completed: "bg-emerald-100 text-emerald-800",
};

export default async function AdminDevelopmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const developments = await getAllDevelopments();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Developments
        </h1>
        <Link href="/admin/developments/new" className="btn-primary">
          + New development
        </Link>
      </div>

      {saved ? (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
          Development saved successfully.
        </p>
      ) : null}

      <div className="mt-6">
        <SupabaseBanner />
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-brand-sand bg-brand-cream/70 text-xs uppercase tracking-wider text-brand-muted">
            <tr>
              <th scope="col" className="px-4 py-3.5">Development</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5">Timeline</th>
              <th scope="col" className="px-4 py-3.5">Featured</th>
              <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand">
            {developments.map((development) => (
              <tr key={development.id} className="hover:bg-brand-cream/40">
                <td className="max-w-xs px-4 py-3.5">
                  <p className="truncate font-medium text-brand-forest">
                    {development.title}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-brand-muted">
                    {development.location}
                  </p>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      STATUS_STYLES[development.status] ??
                      "border border-brand-stone bg-white text-brand-muted"
                    }`}
                  >
                    {development.status}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-brand-muted">
                  {development.completionDate ?? "—"}
                </td>
                <td className="px-4 py-3.5">
                  {development.featured ? (
                    <span aria-label="Featured" className="text-brand-gold">★</span>
                  ) : (
                    <span className="text-brand-stone">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-1.5">
                    <Link
                      href={`/admin/developments/${development.id}`}
                      className="rounded-lg border border-brand-stone/60 px-3 py-1.5 text-xs font-semibold text-brand-forest transition-colors hover:bg-brand-sand/50"
                    >
                      Edit
                    </Link>
                    <form action={duplicateDevelopmentAction}>
                      <input type="hidden" name="id" value={development.id} />
                      <button
                        type="submit"
                        disabled={!isAdminDatabaseConfigured()}
                        title={
                          isAdminDatabaseConfigured()
                            ? "Duplicate this development"
                            : "Requires the server database key (SUPABASE_SECRET_KEY)"
                        }
                        className="rounded-lg border border-brand-stone/60 px-3 py-1.5 text-xs font-semibold text-brand-forest transition-colors hover:bg-brand-sand/50 disabled:opacity-40"
                      >
                        Duplicate
                      </button>
                    </form>
                    <form action={deleteDevelopmentAction}>
                      <input type="hidden" name="id" value={development.id} />
                      <button
                        type="submit"
                        disabled={!isAdminDatabaseConfigured()}
                        title={
                          isAdminDatabaseConfigured()
                            ? "Delete this development"
                            : "Requires the server database key (SUPABASE_SECRET_KEY)"
                        }
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
