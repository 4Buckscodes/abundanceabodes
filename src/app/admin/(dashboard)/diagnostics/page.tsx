import { DiagnosticsRunner } from "./DiagnosticsRunner";

export const dynamic = "force-dynamic";

export default function DiagnosticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Connection diagnostics
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted">
        If property saves fail, run these checks — they exercise the same code
        path as the editor and report the exact failing step. No credentials
        are ever displayed.
      </p>
      <div className="card-surface mt-6 p-6 sm:p-7">
        <DiagnosticsRunner />
      </div>
    </div>
  );
}
