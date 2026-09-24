import Link from "next/link";
import { siteContent } from "@/lib/data/content";
import { navItems } from "@/lib/nav";

const columns = [
  {
    heading: "Properties",
    links: [
      { label: "All Properties", href: "/properties" },
      { label: "Homes for Sale", href: "/properties?type=home" },
      { label: "Land & Plots", href: "/properties?type=land" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Why Choose Us", href: "/why-choose-us" },
      { label: "Property Insights", href: "/insights" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "For Buyers", href: "/for-buyers" },
      { label: "For Sellers", href: "/for-sellers" },
      { label: "For Developers", href: "/for-developers" },
      { label: "Due Diligence Guide", href: "/due-diligence" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-forest-dark text-brand-cream" role="contentinfo">
      <div className="container-site py-16 sm:py-20">
        {/* Brand statement */}
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold font-serif text-lg font-bold text-brand-forest-dark"
                aria-hidden="true"
              >
                A
              </span>
              <span className="font-serif text-2xl font-semibold text-brand-cream">
                Abundance Abodes
              </span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-brand-sand sm:text-base">
              Abundance is more than wealth — it is stability, opportunity, and
              lasting value. An abode is more than a property — it is where
              lives are built and legacies begin.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/consultation" className="btn-gold !px-5 !py-2.5 text-xs sm:text-sm">
                Book a Consultation
              </Link>
              <Link
                href="/properties"
                className="btn-ghost-dark !px-5 !py-2.5 text-xs sm:text-sm"
              >
                Browse Properties
              </Link>
            </div>
            {siteContent.addressLines ? (
              <p className="mt-8 text-xs uppercase tracking-[0.18em] text-brand-stone">
                {siteContent.addressLines.join(" • ")}
              </p>
            ) : null}
          </div>

          {/* Link columns */}
          <nav aria-label="Footer" className="grid gap-10 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.heading}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
                  {column.heading}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-brand-sand transition-colors hover:text-brand-gold-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Secondary nav + contact */}
        <div className="mt-14 grid gap-8 border-t border-brand-forest-light pt-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Start Here
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navItems.slice(-2).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-brand-sand transition-colors hover:text-brand-gold-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Serving
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-sand">
              Nigerian buyers, sellers, developers, and investors — with
              verified opportunities and professional brokerage support at
              every step.
            </p>
          </div>
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Talk to Us
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-sand">
              The fastest way to reach our advisory team is through the
              consultation form — we respond personally to every request.
            </p>
            <Link
              href="/consultation"
              className="mt-3 inline-block text-sm font-semibold text-brand-gold-light transition-colors hover:text-brand-gold"
            >
              Book a Consultation →
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-brand-forest-light pt-6 text-xs text-brand-stone sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Abundance Abodes. All rights reserved.</p>
          <p>Trusted Property Brokerage</p>
        </div>
      </div>
    </footer>
  );
}
