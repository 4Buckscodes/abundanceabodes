import Link from "next/link";
import { getAllProperties } from "@/lib/data";
import { dbListEnquiries, isAdminDatabaseConfigured } from "@/lib/supabase";
import { seedProperties } from "@/lib/data/properties";
import { insights } from "@/lib/data/content";
import { SupabaseBanner } from "@/components/admin/SupabaseBanner";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const properties = await getAllProperties();
  const enquiries = isAdminDatabaseConfigured() ? await dbListEnquiries() : null;
  const newEnquiries = enquiries?.filter((e) => e.status === "new").length ?? 0;

  const stats = [
    { label: "Properties", value: String(properties.length), href: "/admin/properties" },
    {
      label: "Featured",
      value: String(properties.filter((p) => p.featured).length),
      href: "/admin/properties",
    },
    {
      label: "Available listings",
      value: String(properties.filter((p) => p.status === "available").length),
      href: "/admin/properties",
    },
    {
      label: "New enquiries",
      value: enquiries ? String(newEnquiries) : "—",
      href: "/admin/enquiries",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Dashboard
      </h1>
      <div className="mt-2">
        <SupabaseBanner />
      </div>

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-lift)"
          >
            <dt className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              {stat.label}
            </dt>
            <dd className="mt-1.5 font-serif text-3xl font-semibold text-brand-forest">
              {stat.value}
            </dd>
          </Link>
        ))}
      </dl>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-6" aria-labelledby="dash-recent">
          <h2 id="dash-recent" className="font-serif text-lg font-semibold">
            Recent properties
          </h2>
          <ul className="mt-4 divide-y divide-brand-sand text-sm">
            {[...properties]
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )
              .slice(0, 5)
              .map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="truncate font-medium text-brand-ink">{p.title}</span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      p.status === "available"
                        ? "bg-emerald-100 text-emerald-800"
                        : p.status === "reserved"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-200 text-stone-700"
                    }`}
                  >
                    {p.status.replace("-", " ")}
                  </span>
                </li>
              ))}
          </ul>
          <Link href="/admin/properties" className="btn-secondary mt-5 !px-4 !py-2 text-xs">
            Manage all properties
          </Link>
        </section>

        <section className="card-surface p-6" aria-labelledby="dash-content">
          <h2 id="dash-content" className="font-serif text-lg font-semibold">
            Site content snapshot
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-brand-muted">
            <li className="flex justify-between border-b border-brand-sand pb-2.5">
              Seed properties loaded:{" "}
              <strong className="text-brand-forest">{seedProperties.length}</strong>
            </li>
            <li className="flex justify-between border-b border-brand-sand pb-2.5">
              Insights published:{" "}
              <strong className="text-brand-forest">{insights.length}</strong>
            </li>
            <li className="flex justify-between">
              Enquiry inbox:{" "}
              <strong className="text-brand-forest">
                {isAdminDatabaseConfigured() ? (enquiries ? `${enquiries.length} stored` : "unavailable") : "connects with Supabase"}
              </strong>
            </li>
          </ul>
          <Link href="/admin/enquiries" className="btn-secondary mt-5 !px-4 !py-2 text-xs">
            Open enquiries
          </Link>
        </section>
      </div>
    </div>
  );
}
