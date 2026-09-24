import { PropertyEditor } from "../PropertyEditor";

export const dynamic = "force-dynamic";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight sm:text-3xl">
        New property
      </h1>
      <PropertyEditor />
    </div>
  );
}
