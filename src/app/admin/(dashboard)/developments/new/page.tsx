import { DevelopmentEditor } from "../DevelopmentEditor";

export const dynamic = "force-dynamic";

export default function NewDevelopmentPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">
        New development
      </h1>
      <DevelopmentEditor />
    </div>
  );
}
