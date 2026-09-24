"use client";

import { useActionState } from "react";
import { runDiagnosticsAction, type DiagState } from "./actions";

const initial: DiagState = { ran: false, checks: [] };

export function DiagnosticsRunner() {
  const [state, formAction, pending] = useActionState<DiagState, FormData>(
    runDiagnosticsAction,
    initial
  );

  return (
    <div>
      <form action={formAction}>
        <button type="submit" className="btn-primary min-w-44" disabled={pending}>
          {pending ? "Running checks…" : state.ran ? "Re-run checks" : "Run connection checks"}
        </button>
      </form>

      {state.ran ? (
        <ul className="mt-6 space-y-3">
          {state.checks.map((check) => (
            <li
              key={check.name}
              className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                check.ok
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <p className="font-semibold">
                <span aria-hidden>{check.ok ? "✓ " : "✗ "}</span>
                {check.name}
              </p>
              <p className="mt-1 opacity-90">{check.detail}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-brand-muted">
          Runs live checks with the server&apos;s own credentials and reports
          exactly which step fails. A temporary probe property is created and
          deleted again during the save check — no data is left behind.
        </p>
      )}
    </div>
  );
}
