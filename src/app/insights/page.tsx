import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";
import { insights } from "@/lib/data/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Property Insights",
  description:
    "Practical articles and guidance on the Nigerian real estate market — due diligence checklists, buyer guides, and investment notes from Abundance Abodes.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <PageHeader
        label="Property Insights"
        title="Practical Knowledge for the Nigerian Market"
        description="No hype, no recycled listicles — grounded guidance on buying safely, investing wisely, and understanding the documents that protect you."
        crumbs={[{ label: "Insights" }]}
      />

      <section className="section-padding" aria-label="Articles">
        <div className="container-site">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((post, i) => (
              <Reveal key={post.id} delay={i * 80}>
                <li className="h-full list-none">
                  <Link
                    href={`/insights/${post.slug}`}
                    className="group card-surface flex h-full flex-col p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-(--shadow-lift)"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-brand-forest/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold-dark">
                        {post.tag}
                      </span>
                      <span className="text-xs text-brand-stone">
                        {post.readMinutes} min read
                      </span>
                    </div>
                    <h2 className="mt-4 font-serif text-xl font-semibold leading-snug text-brand-forest transition-colors group-hover:text-brand-gold-dark">
                      {post.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-muted sm:text-base">
                      {post.excerpt}
                    </p>
                    <p className="mt-5 flex items-center justify-between border-t border-brand-sand pt-4 text-sm">
                      <time dateTime={post.publishedAt} className="text-brand-stone">
                        {formatDate(post.publishedAt)}
                      </time>
                      <span aria-hidden="true" className="link-underline !text-inherit">
                        Read article
                        <svg
                          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </p>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
