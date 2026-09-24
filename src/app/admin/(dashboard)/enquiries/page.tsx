import Link from "next/link";
import { dbListEnquiries, isAdminDatabaseConfigured } from "@/lib/supabase";
import { SupabaseBanner } from "@/components/admin/SupabaseBanner";
import { updateEnquiryStatusAction } from "./actions";
import type { EnquiryStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyles: Record<EnquiryStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  "inspection-scheduled": "bg-indigo-100 text-indigo-800",
  "in-progress": "bg-purple-100 text-purple-800",
  completed: "bg-emerald-100 text-emerald-800",
  closed: "bg-stone-200 text-stone-800",
  archived: "bg-stone-100 text-stone-600",
};

const statuses: EnquiryStatus[] = [
  "new",
  "contacted",
  "inspection-scheduled",
  "in-progress",
  "completed",
  "closed",
  "archived",
];

export default async function AdminEnquiriesPage() {
  const enquiries = isAdminDatabaseConfigured() ? await dbListEnquiries() : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Enquiries
      </h1>
      <div className="mt-6">
        <SupabaseBanner />
      </div>

      {!isAdminDatabaseConfigured() || !enquiries ? (
        <div className="card-surface p-10 text-center">
          <h2 className="font-serif text-xl font-semibold">No enquiries to show</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-muted">
            Consultation submissions are stored in the{" "}
            <code className="rounded bg-brand-forest/10 px-1.5 py-0.5 font-mono text-xs">enquiries</code>{" "}
            table once the server database key{" "}
            <code className="rounded bg-brand-forest/10 px-1.5 py-0.5 font-mono text-xs">SUPABASE_SECRET_KEY</code>{" "}
            is set. Until then, requests reach the team
            through email delivery (EmailJS) when configured.
          </p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="card-surface p-10 text-center text-brand-muted">
          The enquiry inbox is empty — new consultation bookings will appear here.
        </div>
      ) : (
        <ul className="space-y-4">
          {enquiries.map((enquiry) => (
            <li key={enquiry.id} className="card-surface p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[enquiry.status]}`}
                    >
                      {enquiry.status.replace("-", " ")}
                    </span>
                    <span className="text-xs text-brand-muted">
                      {formatDate(enquiry.createdAt)}
                    </span>
                  </div>
                  <h2 className="mt-2 truncate font-semibold text-brand-forest">
                    {enquiry.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-brand-muted">
                    <a href={`mailto:${enquiry.email}`} className="hover:text-brand-gold-dark">
                      {enquiry.email}
                    </a>
                    {" • "}
                    <a href={`tel:${enquiry.phone}`} className="hover:text-brand-gold-dark">
                      {enquiry.phone}
                    </a>
                  </p>
                  {enquiry.propertyTitle ? (
                    <p className="mt-1.5 text-sm">
                      Interested in:{" "}
                      {enquiry.propertySlug ? (
                        <Link
                          href={`/properties/${enquiry.propertySlug}`}
                          className="font-medium text-brand-forest underline decoration-brand-gold underline-offset-2 hover:text-brand-gold-dark"
                        >
                          {enquiry.propertyTitle}
                        </Link>
                      ) : (
                        <strong className="font-medium">{enquiry.propertyTitle}</strong>
                      )}
                    </p>
                  ) : null}
                  {enquiry.preferredTime ? (
                    <p className="mt-1 text-sm text-brand-muted">
                      Preferred time: {enquiry.preferredTime}
                    </p>
                  ) : null}
                  {enquiry.message ? (
                    <p className="mt-3 rounded-xl bg-brand-cream/70 p-4 text-sm leading-relaxed text-brand-muted">
                      {enquiry.message}
                    </p>
                  ) : null}
                </div>

                <form action={updateEnquiryStatusAction} className="shrink-0">
                  <input type="hidden" name="id" value={enquiry.id} />
                  <label className="sr-only" htmlFor={`status-${enquiry.id}`}>
                    Update status for {enquiry.name}
                  </label>
                  <select
                    id={`status-${enquiry.id}`}
                    name="status"
                    defaultValue={enquiry.status}
                    className="input-field !w-auto !py-2 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("-", " ")}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn-secondary mt-2 w-full !px-4 !py-2 text-xs sm:w-auto">
                    Update
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
