import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type PageHeaderProps = {
  label: string;
  title: string;
  description: string;
  crumbs?: { label: string; href?: string }[];
};

export function PageHeader({ label, title, description, crumbs = [] }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-brand-sand bg-brand-cream">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(184,149,74,0.12),_transparent_50%)]"
        aria-hidden="true"
      />
      <div className="container-site relative py-12 sm:py-16">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow-rule section-label mt-6 mb-4">{label}</p>
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-brand-muted sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
