import { notFound } from "next/navigation";
import { DevelopmentEditor } from "../DevelopmentEditor";
import { getAllDevelopments } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditDevelopmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const developments = await getAllDevelopments();
  const development = developments.find((d) => d.id === id);
  if (!development) notFound();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        Edit development
      </h1>
      <p className="mb-8 font-mono text-sm text-brand-muted">
        {development.slug}
      </p>
      <DevelopmentEditor development={development} />
    </div>
  );
}
