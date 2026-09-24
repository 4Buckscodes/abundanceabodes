import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/ui/Reveal";
import { PropertyGallery } from "@/components/property/PropertyGallery";
import { PropertySpecs } from "@/components/property/PropertySpecs";
import { PropertyVideo } from "@/components/property/PropertyVideo";
import { StatusBadge } from "@/components/property/StatusBadge";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyActions } from "@/components/property/PropertyActions";
import { PropertyDocumentationCard } from "@/components/property/PropertyDocumentationCard";
import {
  getAllProperties,
  getPropertyBySlug,
  getRelatedProperties,
} from "@/lib/data";
import { absoluteUrl, site } from "@/lib/site";
import { formatPrice } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const properties = await getAllProperties();
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return {};

  const title =
    property.seoTitle ??
    `${property.title} in ${property.location} | ${site.name}`;
  const description =
    property.seoDescription ??
    `${property.shortDescription} View full specifications, images and book a viewing with ${site.name}.`;

  return {
    title,
    description,
    keywords: property.seoKeywords,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(`/properties/${property.slug}`),
      images: [{ url: property.mainImage.url, alt: property.mainImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const related = await getRelatedProperties(property, 3);

  // Structured data — only truthful fields we hold.
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.seoDescription ?? property.shortDescription,
    url: absoluteUrl(`/properties/${property.slug}`),
    image: absoluteUrl(property.mainImage.url),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressCountry: "NG",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: property.currency === "USD" ? "USD" : "NGN",
      ...(property.price != null
        ? { price: property.price }
        : { priceSpecification: { "@type": "PriceSpecification", valueAddedTaxIncluded: false } }),
      availability:
        property.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    datePosted: property.createdAt,
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative bg-brand-forest-dark" aria-labelledby="property-heading">
        <div className="relative h-[52vh] min-h-80 w-full sm:h-[60vh]">
          <Image
            src={property.mainImage.url}
            alt={property.mainImage.alt || `${property.title}, ${property.location}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-forest-dark via-brand-forest-dark/45 to-brand-forest-dark/10"
            aria-hidden="true"
          />
        </div>

        <div className="container-site relative -mt-40 pb-12 sm:-mt-48 sm:pb-16">
          <div className="[&_a]:text-brand-sand [&_a:hover]:text-brand-gold-light [&_span[aria-current]]:!text-brand-cream [&_span]:text-brand-stone/70">
            <Breadcrumbs
              items={[
                { label: "Properties", href: "/properties" },
                { label: property.title },
              ]}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-brand-cream/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-forest">
              For {property.purpose}
            </span>
            <StatusBadge status={property.status} />
            {property.featured ? (
              <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-forest-dark">
                Featured
              </span>
            ) : null}
          </div>

          <h1
            id="property-heading"
            className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-brand-cream sm:text-4xl lg:text-5xl"
          >
            {property.title}
          </h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-brand-sand sm:text-base">
            <svg className="h-5 w-5 shrink-0 text-brand-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.address ? `${property.location} — ${property.address}` : property.location}
          </p>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
            <p className="text-2xl font-semibold text-white drop-shadow sm:text-3xl">
              {formatPrice(property.price, property.currency, property.priceNote)}
            </p>
            <PropertyActions property={property} />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="container-site pt-12 sm:pt-16" aria-label="Property gallery">
        <PropertyGallery
          images={[
            property.mainImage,
            ...property.gallery.filter((g) => g.url !== property.mainImage.url),
          ]}
          title={property.title}
        />
      </section>

      {/* Specs + description + amenities */}
      <section className="container-site section-padding !pb-8" aria-label="Property details">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
              About this property
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-brand-muted">
              {property.description.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10">
              <PropertyDocumentationCard documentation={property.documentation} />
            </div>

            <h2 className="mt-10 font-serif text-2xl font-semibold sm:text-3xl">
              Features &amp; Amenities
            </h2>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {property.amenities.map((amenity) => (
                <li key={amenity} className="flex items-start gap-2.5 text-sm text-brand-muted sm:text-base">
                  <span
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-forest/10 text-brand-gold-dark"
                    aria-hidden="true"
                  >
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {amenity}
                </li>
              ))}
            </ul>

            {property.youtubeUrl ? (
              <>
                <h2 className="mt-12 font-serif text-2xl font-semibold sm:text-3xl">
                  Video walkthrough
                </h2>
                <p className="mb-5 mt-2 text-sm text-brand-muted">
                  Take a guided look around before you visit in person.
                </p>
                <PropertyVideo url={property.youtubeUrl} title={property.title} />
              </>
            ) : null}
          </div>

          {/* Sidebar specs */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <PropertySpecs property={property} />

            {property.developerName || property.developerNote ? (
              <div className="card-surface mt-6 p-5">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
                  Developer / Brand
                </h2>
                {property.developerName ? (
                  <p className="mt-2 font-serif text-lg font-semibold text-brand-forest">
                    {property.developerName}
                  </p>
                ) : null}
                {property.developerNote ? (
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
                    {property.developerNote}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-5 mt-6">
              <h2 className="font-serif text-lg font-semibold text-brand-forest">
                Documentation status
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                Title, survey and ownership checks for this listing are handled
                by our advisory team. Ask us for the full verification summary
                during your consultation.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Enquiry CTA with prefilled property */}
      <section id="enquire" className="bg-brand-sand/40 scroll-mt-24" aria-labelledby="enquire-heading">
        <div className="container-site section-padding">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow-rule section-label mb-3">Enquire</p>
              <h2
                id="enquire-heading"
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Interested in this property?
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-brand-muted sm:text-lg">
                Book a free consultation and mention{" "}
                <strong className="font-semibold text-brand-forest">
                  {property.title}
                </strong>{" "}
                — we&apos;ll prepare the verification summary and answer every
                question before you commit to anything.
              </p>
              <dl className="mt-7 space-y-3 text-sm">
                <div className="flex justify-between border-b border-brand-stone/50 pb-2.5">
                  <dt className="text-brand-muted">Price</dt>
                  <dd className="font-semibold text-brand-forest">
                    {formatPrice(property.price, property.currency, property.priceNote)}
                  </dd>
                </div>
                <div className="flex justify-between border-b border-brand-stone/50 pb-2.5">
                  <dt className="text-brand-muted">Location</dt>
                  <dd className="font-semibold text-brand-forest">{property.location}</dd>
                </div>
                <div className="flex justify-between border-b border-brand-stone/50 pb-2.5">
                  <dt className="text-brand-muted">Status</dt>
                  <dd className="font-semibold capitalize text-brand-forest">{property.status.replace("-", " ")}</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={120}>
              <div className="card-surface p-6 sm:p-8">
                <ConsultationForm
                  properties={[{ slug: property.slug, title: property.title }]}
                  defaultPropertySlug={property.slug}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Related properties */}
      {related.length > 0 ? (
        <section className="section-padding" aria-labelledby="related-heading">
          <div className="container-site">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2
                id="related-heading"
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                You may also like
              </h2>
              <Link href="/properties" className="link-underline group text-sm">
                Browse all properties
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <ul className="mt-8 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
              {related.map((item) => (
                <li key={item.id}>
                  <PropertyCard property={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Clearance for the fixed mobile action bar (PropertyActions, lg:hidden). */}
      <div className="h-20 lg:hidden" aria-hidden="true" />
    </>
  );
}
