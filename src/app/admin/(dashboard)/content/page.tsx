import Link from "next/link";
import { faqs, insights, siteContent, testimonials } from "@/lib/data/content";
import { SupabaseBanner } from "@/components/admin/SupabaseBanner";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function AdminContentPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Site Content
      </h1>
      <div className="mt-6">
        <SupabaseBanner />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Testimonials */}
        <section className="card-surface p-6" aria-labelledby="content-testimonials">
          <h2 id="content-testimonials" className="font-serif text-lg font-semibold">
            Testimonials ({testimonials.length})
          </h2>
          <ul className="mt-4 space-y-4">
            {testimonials.map((t) => (
              <li key={t.id} className="rounded-xl bg-brand-cream/70 p-4">
                <p className="line-clamp-2 text-sm italic leading-relaxed text-brand-muted">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-1.5 text-xs font-medium text-brand-gold-dark">
                  {t.attribution ?? "Unattributed"}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        <section className="card-surface p-6" aria-labelledby="content-faqs">
          <h2 id="content-faqs" className="font-serif text-lg font-semibold">
            FAQs ({faqs.length})
          </h2>
          <ul className="mt-4 divide-y divide-brand-sand text-sm">
            {faqs.map((f) => (
              <li key={f.id} className="py-2.5">
                <p className="font-medium text-brand-forest">{f.question}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-brand-muted">
            Edit in{" "}
            <code className="rounded bg-brand-forest/10 px-1 py-0.5 font-mono text-[11px]">
              src/lib/data/content.ts
            </code>{" "}
            — or via Supabase once connected.
          </p>
        </section>

        {/* Insights */}
        <section className="card-surface p-6" aria-labelledby="content-insights">
          <h2 id="content-insights" className="font-serif text-lg font-semibold">
            Insights ({insights.length})
          </h2>
          <ul className="mt-4 divide-y divide-brand-sand text-sm">
            {insights.map((post) => (
              <li key={post.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="truncate font-medium text-brand-forest">
                  {post.title}
                </span>
                <span className="shrink-0 text-xs text-brand-muted">
                  {formatDate(post.publishedAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Contact / footer content */}
        <section className="card-surface p-6" aria-labelledby="content-contact">
          <h2 id="content-contact" className="font-serif text-lg font-semibold">
            Contact &amp; Footer
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between border-b border-brand-sand pb-2.5">
              <dt className="text-brand-muted">Phone</dt>
              <dd>{siteContent.phone ?? "Pending client details"}</dd>
            </div>
            <div className="flex justify-between border-b border-brand-sand pb-2.5">
              <dt className="text-brand-muted">Email</dt>
              <dd>{siteContent.email ?? "Via consultation form"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-brand-muted">Coverage</dt>
              <dd className="text-right">{siteContent.addressLines?.join(", ")}</dd>
            </div>
          </dl>
          <Link href="/contact" className="btn-secondary mt-5 !px-4 !py-2 text-xs">
            View contact page
          </Link>
        </section>
      </div>
    </div>
  );
}
