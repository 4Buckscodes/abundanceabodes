import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { isAdminAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const configured = isAdminAuthConfigured();

  return (
    <section className="section-padding">
      <div className="container-site max-w-md">
        <div className="card-surface p-7 sm:p-9">
          <p className="section-label mb-3">Team Access</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Admin Sign In
          </h1>

          {!configured ? (
            <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-gold/10 px-4 py-4 text-sm leading-relaxed text-brand-gold-dark">
              Admin access isn&apos;t configured on this deployment yet. Add
              <code className="mx-1.5 rounded bg-brand-forest/10 px-1.5 py-0.5 font-mono text-xs">
                ADMIN_PASSWORD
              </code>
              (and optionally
              <code className="mx-1.5 rounded bg-brand-forest/10 px-1.5 py-0.5 font-mono text-xs">
                ADMIN_SESSION_SECRET
              </code>
              ) to the environment to enable sign-in.
            </div>
          ) : (
            <div className="mt-6">
              <LoginForm next={next && next.startsWith("/admin") ? next : "/admin"} />
            </div>
          )}

          <p className="mt-8 border-t border-brand-sand pt-5 text-sm text-brand-muted">
            Not a team member?{" "}
            <Link href="/" className="font-semibold text-brand-forest hover:text-brand-gold-dark">
              Return to the website
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
