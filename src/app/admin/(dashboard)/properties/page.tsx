import Link from "next/link";
import { getAllProperties } from "@/lib/data";
import { isAdminDatabaseConfigured } from "@/lib/supabase";
import { SupabaseBanner } from "@/components/admin/SupabaseBanner";
import {
  deletePropertyAction,
  duplicatePropertyAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const properties = await getAllProperties();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Properties
        </h1>
        <Link href="/admin/properties/new" className="btn-primary">
          + New property
        </Link>
      </div>

      {saved ? (
        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
          Property saved successfully.
        </p>
      ) : null}

      <div className="mt-6">
        <SupabaseBanner />
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-brand-sand bg-brand-cream/70 text-xs uppercase tracking-wider text-brand-muted">
            <tr>
              <th scope="col" className="px-4 py-3.5">Property</th>
              <th scope="col" className="px-4 py-3.5">Category</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
              <th scope="col" className="px-4 py-3.5">Featured</th>
              <th scope="col" className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-brand-cream/40">
                <td className="max-w-xs px-4 py-3.5">
                  <p className="truncate font-medium text-brand-forest">
                    {property.title}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-xs text-brand-muted">
                    /{property.slug}
                  </p>
                </td>
                <td className="px-4 py-3.5 capitalize text-brand-muted">
                  {property.category} — {property.type.replace(/-/g, " ")}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      property.status === "available"
                        ? "bg-emerald-100 text-emerald-800"
                        : property.status === "reserved"
                          ? "bg-amber-100 text-amber-800"
                          : property.status === "sold"
                            ? "bg-stone-200 text-stone-700"
                            : "border border-brand-stone bg-white text-brand-muted"
                    }`}
                  >
                    {property.status.replace("-", " ")}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {property.featured ? (
                    <span aria-label="Featured" className="text-brand-gold">★</span>
                  ) : (
                    <span className="text-brand-stone">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex justify-end gap-1.5">
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="rounded-lg border border-brand-stone/60 px-3 py-1.5 text-xs font-semibold text-brand-forest transition-colors hover:bg-brand-sand/50"
                    >
                      Edit
                    </Link>
                    <form action={duplicatePropertyAction}>
                      <input type="hidden" name="id" value={property.id} />
                      <button
                        type="submit"
                        disabled={!isAdminDatabaseConfigured()}
                        title={
                          isAdminDatabaseConfigured()
                            ? "Duplicate this property"
                            : "Requires the server database key (SUPABASE_SERVICE_ROLE_KEY)"
                        }
                        className="rounded-lg border border-brand-stone/60 px-3 py-1.5 text-xs font-semibold text-brand-forest transition-colors hover:bg-brand-sand/50 disabled:opacity-40"
                      >
                        Duplicate
                      </button>
                    </form>
                    <form action={deletePropertyAction}>
                      <input type="hidden" name="id" value={property.id} />
                      <button
                        type="submit"
                        disabled={!isAdminDatabaseConfigured()}
                        title={
                          isAdminDatabaseConfigured()
                            ? "Delete this property"
                            : "Requires the server database key (SUPABASE_SERVICE_ROLE_KEY)"
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
