import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken, isAdminAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/properties", label: "Properties" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/diagnostics", label: "Diagnostics" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Defense in depth: middleware already guards these routes; re-verify here.
  const store = await cookies();
  const authed = await verifySessionToken(store.get(ADMIN_COOKIE)?.value);
  if (!authed) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-brand-sand/30">
      <header className="border-b border-brand-sand bg-brand-forest-dark text-brand-cream">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-serif text-lg font-semibold">
              Abundance Admin
            </Link>
            {!isAdminAuthConfigured() ? (
              <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold text-brand-gold-light">
                Config pending
              </span>
            ) : null}
          </div>
          <nav aria-label="Admin" className="flex flex-wrap items-center gap-1.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm text-brand-sand transition-colors hover:bg-white/10 hover:text-brand-cream"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm text-brand-stone transition-colors hover:text-brand-cream"
            >
              View site ↗
            </Link>
          </nav>
        </div>
      </header>
      <main className="container-site py-8 sm:py-10">{children}</main>
    </div>
  );
}
