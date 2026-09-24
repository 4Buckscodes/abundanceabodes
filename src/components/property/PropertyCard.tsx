import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/property/StatusBadge";

type PropertyCardProps = {
  property: Property;
  priority?: boolean;
};

export function PropertyCard({ property, priority }: PropertyCardProps) {
  const specs: string[] = [];
  if (property.bedrooms) specs.push(`${property.bedrooms} bed`);
  if (property.bathrooms) specs.push(`${property.bathrooms} bath`);
  if (property.landSize) specs.push(property.landSize);
  if (!property.bedrooms && property.propertySize)
    specs.push(property.propertySize);

  return (
    <article className="group card-surface overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-(--shadow-lift)">
      <Link
        href={`/properties/${property.slug}`}
        className="block focus-visible:outline-none"
        aria-label={`${property.title}, ${property.location}`}
      >
        <div className="img-zoom relative aspect-[4/3]">
          <Image
            src={property.mainImage.url}
            alt={property.mainImage.alt || `${property.title} in ${property.location}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-brand-cream/95 px-3 py-1 text-xs font-semibold capitalize text-brand-forest">
              For {property.purpose}
            </span>
            <StatusBadge status={property.status} />
          </div>
          {property.featured ? (
            <span className="absolute right-4 top-4 rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-forest-dark">
              Featured
            </span>
          ) : null}
          <p className="absolute bottom-3 left-4 text-lg font-semibold text-white drop-shadow-md sm:text-xl">
            {formatPrice(property.price, property.currency, property.priceNote)}
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <h3 className="font-serif text-xl font-semibold leading-snug text-brand-forest transition-colors group-hover:text-brand-gold-dark">
            {property.title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-brand-muted">
            <svg
              className="h-4 w-4 shrink-0 text-brand-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>
          {specs.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Key specifications">
              {specs.map((spec) => (
                <li
                  key={spec}
                  className="rounded-full border border-brand-sand bg-brand-cream px-3 py-1 text-xs font-medium text-brand-muted"
                >
                  {spec}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-brand-muted">
            {property.shortDescription}
          </p>
          <span className="link-underline mt-5 text-sm" aria-hidden="true">
            View property
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </Link>
    </article>
  );
}
