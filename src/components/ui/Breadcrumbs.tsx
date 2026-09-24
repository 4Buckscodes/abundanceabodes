import Link from "next/link";
import { absoluteUrl } from "@/lib/site";

export type Crumb = {
  label: string;
  href?: string;
};

/**
 * Accessible breadcrumb trail with matching BreadcrumbList JSON-LD.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        ...(item.href ? { item: absoluteUrl(item.href) } : {}),
      })),
    ],
  };

  return (
    <nav aria-label="Breadcrumb">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-muted">
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-brand-gold-dark"
          >
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-brand-stone">
              /
            </span>
            {item.href && i < items.length - 1 ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-brand-gold-dark"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-brand-ink font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
