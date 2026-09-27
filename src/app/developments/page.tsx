import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Development, DevelopmentStatus } from "@/lib/types";
import { getDevelopmentsByStatus } from "@/lib/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConsultationBand } from "@/components/home/ConsultationBand";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Developments",
  description:
    "Completed, ongoing, and upcoming developments represented by Abundance Abodes — every project vetted for title, delivery, and terms before it reaches you.",
  alternates: { canonical: "/developments" },
};

const STATUS_META: Record<
  DevelopmentStatus,
  { label: string; blurb: string; pill: string }
> = {
  ongoing: {
    label: "Ongoing",
    blurb: "Under construction now, with verified milestone progress.",
    pill: "bg-amber-100 text-amber-800",
  },
  upcoming: {
    label: "Upcoming",
    blurb:
      "Releasing soon — register early for launch pricing and preferred selection.",
    pill: "bg-sky-100 text-sky-800",
  },
  completed: {
    label: "Completed",
    blurb:
      "Delivered and handed over. Occasional resale units may become available.",
    pill: "bg-emerald-100 text-emerald-800",
  },
};

const vetting = [
  ["Title & documentation", "Excision, C of O, deeds, and survey verified before a development is ever marketed to our clients."],
  ["Delivery evidence", "For off-plan phases we look for real construction progress — not renders — and realistic milestone dates."],
  ["Transparent terms", "Payment plans, refund positions, and service charges stated plainly, in writing, with no moving goalposts."],
  ["Build quality", "Finishes and specifications we would put our own reputation behind before attaching our name."],
];

function DevelopmentCard({ development }: { development: Development }) {
  const meta = STATUS_META[development.status];
  return (
    <li className="card-surface flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] bg-brand-sand/50">
        <Image
          src={development.mainImage.url}
          alt={development.mainImage.alt || development.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          unoptimized={development.mainImage.url.startsWith("http")}
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${meta.pill}`}
        >
          {meta.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-xl font-semibold">{development.title}</h3>
        <p className="mt-1 text-sm text-brand-muted">{development.location}</p>
        <p className="mt-3 flex-1 leading-relaxed text-brand-muted">
          {development.shortDescription}
        </p>

        {development.status === "ongoing" &&
        typeof development.progress === "number" ? (
          <div className="mt-4" aria-label={`Construction progress ${development.progress}%`}>
            <div className="flex items-center justify-between text-xs font-medium text-brand-muted">
              <span>Construction progress</span>
              <span>{development.progress}%</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-sand">
              <div
                className="h-full rounded-full bg-brand-gold"
                style={{ width: `${development.progress}%` }}
              />
            </div>
          </div>
        ) : null}

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {development.priceFrom ? (
            <div className="col-span-2">
              <dt className="text-xs uppercase tracking-wide text-brand-muted">Price</dt>
              <dd className="font-semibold text-brand-forest">{development.priceFrom}</dd>
            </div>
          ) : null}
          {development.totalUnits ? (
            <div>
              <dt className="text-xs uppercase tracking-wide text-brand-muted">Units</dt>
              <dd className="text-brand-forest">{development.totalUnits}</dd>
            </div>
          ) : null}
          {development.completionDate ? (
            <div>
              <dt className="text-xs uppercase tracking-wide text-brand-muted">Timeline</dt>
              <dd className="text-brand-forest">{development.completionDate}</dd>
            </div>
          ) : null}
        </dl>

        {development.highlights.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {development.highlights.slice(0, 4).map((h) => (
              <li
                key={h}
                className="rounded-full border border-brand-sand bg-brand-cream/60 px-2.5 py-1 text-xs text-brand-muted"
              >
                {h}
              </li>
            ))}
          </ul>
        ) : null}

        <Link
          href={`/consultation?development=${development.slug}`}
          className="btn-secondary mt-6 w-full justify-center"
        >
          Enquire about this development
        </Link>
      </div>
    </li>
  );
}

export default async function DevelopmentsPage() {
  const groups = await getDevelopmentsByStatus();

  return (
    <>
      <PageHeader
        label="Developments"
        title="New Developments, Vetted Before They Reach You"
        description="We represent a selective slate of projects — completed, under construction, and releasing soon. Each one passes the same documentation and delivery scrutiny we would demand as buyers ourselves."
        crumbs={[{ label: "Developments" }]}
      />

      {groups.map((group, gi) => {
        const meta = STATUS_META[group.status];
        return (
          <section
            key={group.status}
            className={gi % 2 === 1 ? "section-padding bg-brand-white" : "section-padding"}
            aria-labelledby={`dev-${group.status}-heading`}
          >
            <div className="container-site">
              <Reveal>
                <h2
                  id={`dev-${group.status}-heading`}
                  className="text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  {meta.label} Developments
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-brand-muted">
                  {meta.blurb}
                </p>
              </Reveal>
              <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((development, i) => (
                  <Reveal key={development.id} delay={i * 70}>
                    <DevelopmentCard development={development} />
                  </Reveal>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <section className="section-padding bg-brand-white" aria-labelledby="dev-vetting-heading">
        <div className="container-site">
          <Reveal>
            <h2 id="dev-vetting-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How We Vet a Development
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {vetting.map(([title, desc], i) => (
              <Reveal key={title} delay={i * 80}>
                <li className="h-full rounded-2xl border border-brand-sand bg-brand-cream/60 p-7">
                  <h3 className="font-serif text-lg font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-brand-muted">{desc}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/properties" className="btn-primary">
                Explore Current Listings
              </Link>
              <Link href="/for-developers" className="btn-secondary">
                Developing a Project? Partner With Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}
