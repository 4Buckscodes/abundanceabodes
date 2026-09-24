"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { label: "Properties", href: "/properties" },
  { label: "Homes", href: "/properties?type=home" },
  { label: "Land", href: "/properties?type=land" },
  { label: "About", href: "/about" },
];

const menuLinks = [
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "For Buyers", href: "/for-buyers" },
  { label: "For Sellers", href: "/for-sellers" },
  { label: "For Developers", href: "/for-developers" },
  { label: "Due Diligence Guide", href: "/due-diligence" },
  { label: "Property Insights", href: "/insights" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll + Escape to close while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-90 border-b border-brand-sand/70 bg-brand-cream/95 backdrop-blur-md">
      <div className="container-site">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4 lg:h-20">
          <Link
            href="/"
            className="group flex min-w-0 flex-col"
            aria-label="Abundance Abodes — home"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-forest font-serif text-sm font-bold text-brand-gold-light transition-colors group-hover:bg-brand-forest-light"
                aria-hidden="true"
              >
                A
              </span>
              <span className="min-w-0 truncate font-serif text-base font-semibold tracking-tight text-brand-forest transition-colors group-hover:text-brand-forest-light sm:text-lg lg:text-xl">
                Abundance Abodes
              </span>
            </span>
            <span className="ml-10 truncate text-[10px] uppercase tracking-[0.18em] text-brand-gold-dark sm:text-[11px]">
              Trusted Property Brokerage
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-ink transition-colors hover:text-brand-gold-dark"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/consultation" className="btn-gold !px-5 !py-2.5">
              Book a Consultation
            </Link>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-brand-forest/15 bg-brand-white px-4 py-2.5 text-sm font-medium text-brand-forest transition-colors hover:bg-brand-sand/40"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-nav-menu"
            >
              More
              <svg
                className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </nav>

          {/* Mobile actions */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <Link
              href="/consultation"
              className="btn-gold !px-3 !py-2.5 text-xs sm:!px-4 sm:text-sm"
            >
              Consultation
            </Link>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand-forest/15 bg-brand-white text-brand-forest"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-nav-menu"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            >
              {open ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Expandable panel (desktop dropdown / mobile full list) */}
        <nav
          id="site-nav-menu"
          aria-label="Secondary"
          className={cn(
            "overflow-hidden transition-all duration-300",
            open ? "max-h-[36rem] pb-6 opacity-100" : "max-h-0 opacity-0",
            open && "border-t border-brand-sand pt-4"
          )}
        >
          <ul className="grid gap-1 sm:grid-cols-3">
            {menuLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-sm text-brand-ink transition-colors hover:bg-brand-sand/50 hover:text-brand-forest"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
