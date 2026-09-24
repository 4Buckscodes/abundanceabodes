import type { Property } from "@/lib/types";

type SpecItem = {
  label: string;
  value: string;
};

function buildSpecs(property: Property): SpecItem[] {
  const specs: SpecItem[] = [];
  if (property.bedrooms) specs.push({ label: "Bedrooms", value: String(property.bedrooms) });
  if (property.bathrooms) specs.push({ label: "Bathrooms", value: String(property.bathrooms) });
  if (property.toilets) specs.push({ label: "Toilets", value: String(property.toilets) });
  if (property.parkingSpaces)
    specs.push({ label: "Parking", value: `${property.parkingSpaces} cars` });
  if (property.landSize) specs.push({ label: "Land size", value: property.landSize });
  if (property.propertySize)
    specs.push({ label: "Property size", value: property.propertySize });
  specs.push({ label: "Category", value: property.category === "land" ? "Land" : "Home" });
  specs.push({ label: "Type", value: typeLabel(property.type) });
  return specs;
}

function typeLabel(type: Property["type"]): string {
  return type
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function PropertySpecs({ property }: { property: Property }) {
  const specs = buildSpecs(property);
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-brand-sand bg-brand-sand sm:grid-cols-4">
      {specs.map((spec) => (
        <div key={spec.label} className="bg-brand-white p-4 sm:p-5">
          <dt className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
            {spec.label}
          </dt>
          <dd className="mt-1.5 font-serif text-lg font-semibold text-brand-forest sm:text-xl">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
