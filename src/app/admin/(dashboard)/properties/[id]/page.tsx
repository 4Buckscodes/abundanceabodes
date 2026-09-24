import { notFound } from "next/navigation";
import { PropertyEditor } from "../PropertyEditor";
import { getAllProperties } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const properties = await getAllProperties();
  const property = properties.find((p) => p.id === id);
  if (!property) notFound();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        Edit property
      </h1>
      <p className="mb-8 font-mono text-sm text-brand-muted">
        /properties/{property.slug}
      </p>
      <PropertyEditor property={property} />
    </div>
  );
}
