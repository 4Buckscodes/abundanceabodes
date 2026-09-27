"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { label: "Who We Are", href: "/about" },
  { label: "Properties", href: "/properties" },
  { label: "Developments", href: "/for-developers" },
  { label: "Services", href: "/for-buyers" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const menuLinks = [
  { label: "Why Choose Us", href: "/why-choose-us" },
  { label: "For Buyers", href: "/for-buyers" },
  { label: "For Sellers", href: "/for-sellers" },
  { label: "For Developers", href: "/for-developers" },
  { label: "Due Diligence Guide", href: "/due-diligence" },
  { label: "Homes", href: "/properties?type=home" },
  { label: "Land", href: "/properties?type=land" },
  { label: "FAQ", href: "/faq" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Track scroll so the transparent home nav turns solid once the hero scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // Transparent, ivory-on-photo only at the top of the homepage; solid cream
  // everywhere else (scrolled, other routes, or with the drawer open).
  const solid = !isHome || scrolled || open;

  return (
    <header
      className={cn(
        "z-90 transition-colors duration-300",
        isHome ? "fixed inset-x-0 top-0" : "sticky top-0",
        solid
          ? "border-b border-brand-sand bg-brand-cream/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-site">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-4 lg:h-20">
          <Link
            href="/"
            className="font-display text-lg font-bold leading-[0.95] tracking-tight text-brand-ink transition-colors hover:text-brand-forest-light sm:text-xl"
            aria-label="Abundance Abodes — home"
          >
            Abundance
            <br />
            Abodes
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
            <Link
              href="/consultation"
              className={solid ? "btn-primary !px-5 !py-2.5" : "btn-on-photo !px-5 !py-2.5"}
            >
              Book a Consultation
            </Link>
          </nav>

          {/* Mobile actions */}
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <Link
              href="/consultation"
              className={cn(
                "text-xs",
                solid ? "btn-primary !px-3.5 !py-2.5" : "btn-on-photo !px-3.5 !py-2.5"
              )}
            >
              Book a Consultation
            </Link>
            <button
              type="button"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border transition-colors",
                solid
                  ? "border-brand-ink/15 bg-brand-white text-brand-ink"
                  : "border-transparent bg-transparent text-brand-ink"
              )}
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
            open ? "max-h-[40rem] pb-6 opacity-100" : "max-h-0 opacity-0",
            open && "border-t border-brand-sand pt-4"
          )}
        >
          {/* Primary links repeat here on mobile only (the top bar hides them
              below lg); the secondary links show at every width. */}
          <ul className="grid gap-1 sm:grid-cols-3">
            {primaryLinks.map((item) => (
              <li key={item.href} className="lg:hidden">
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-sand/50 hover:text-brand-gold-dark"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {menuLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-3 text-sm text-brand-ink transition-colors hover:bg-brand-sand/50 hover:text-brand-gold-dark"
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
