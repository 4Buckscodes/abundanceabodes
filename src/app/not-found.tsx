import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-padding">
      <div className="container-site max-w-xl text-center">
        <p className="section-label mb-4 flex items-center justify-center gap-3 after:h-px after:w-8 after:bg-brand-gold">
          Page not found
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          This address doesn&apos;t exist
        </h1>
        <p className="mt-5 leading-relaxed text-brand-muted sm:text-lg">
          The page you&apos;re looking for may have been moved or renamed. Try
          browsing our verified properties, or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
          <Link href="/properties" className="btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
