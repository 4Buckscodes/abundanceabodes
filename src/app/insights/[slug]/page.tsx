import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { insights } from "@/lib/data/content";
import { formatDate } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return insights.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      url: absoluteUrl(`/insights/${post.slug}`),
    },
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  const post = insights.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = insights.filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "Abundance Abodes" },
    publisher: { "@type": "Organization", name: "Abundance Abodes" },
    mainEntityOfPage: absoluteUrl(`/insights/${post.slug}`),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="border-b border-brand-sand bg-brand-cream">
        <div className="container-site py-10 sm:py-12">
          <Breadcrumbs
            items={[
              { label: "Insights", href: "/insights" },
              { label: post.title },
            ]}
          />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-forest/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold-dark">
              {post.tag}
            </span>
            <span className="text-sm text-brand-muted">
              {formatDate(post.publishedAt)} • {post.readMinutes} min read
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[2.8rem]">
            {post.title}
          </h1>
        </div>
      </section>

      <article className="section-padding">
        <div className="container-site max-w-3xl">
          <p className="text-lg font-medium italic leading-relaxed text-brand-forest-dark/90 border-l-2 border-brand-gold pl-5">
            {post.excerpt}
          </p>

          <div className="mt-10 space-y-8">
            {post.body.map((section, i) => (
              <section key={i}>
                {section.heading ? (
                  <h2 className="font-serif text-xl font-semibold sm:text-2xl">
                    {section.heading}
                  </h2>
                ) : null}
                <div className="mt-3 space-y-4">
                  {section.paragraphs.map((paragraph, j) => (
                    <p key={j} className="leading-relaxed text-brand-muted sm:text-lg">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Related reading */}
          {others.length > 0 ? (
            <aside className="mt-14 border-t border-brand-sand pt-10" aria-label="More articles">
              <h2 className="font-serif text-xl font-semibold">Keep reading</h2>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                {others.map((other) => (
                  <li key={other.id}>
                    <Link
                      href={`/insights/${other.slug}`}
                      className="group card-surface block h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-(--shadow-lift)"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold-dark">
                        {other.tag}
                      </span>
                      <h3 className="mt-2.5 font-serif text-base font-semibold leading-snug transition-colors group-hover:text-brand-gold-dark sm:text-lg">
                        {other.title}
                      </h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>
      </article>

      <ConsultationBand />
    </>
  );
}
