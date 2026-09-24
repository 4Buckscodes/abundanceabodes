import type { PropertyDocument } from "@/lib/types";
import { DOCUMENT_TYPES_META } from "@/lib/documentation";

interface PropertyDocumentationCardProps {
  documentation?: PropertyDocument[];
}

export function PropertyDocumentationCard({ documentation = [] }: PropertyDocumentationCardProps) {
  // Public Rule 8: Filter ONLY confirmed available documents
  const availableDocs = documentation.filter((d) => d.status === "available");

  if (availableDocs.length === 0) return null;

  return (
    <div className="rounded-2xl border border-brand-sand bg-brand-white p-6 shadow-xs sm:p-7">
      <div className="flex items-center gap-3 border-b border-brand-sand/60 pb-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-forest/10 text-brand-gold-dark">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </span>
        <div>
          <h3 className="font-serif text-xl font-semibold text-brand-forest">
            Verified Property Documentation
          </h3>
          <p className="text-xs text-brand-muted">
            Title and planning approvals confirmed for this listing
          </p>
        </div>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {availableDocs.map((doc) => {
          const meta = DOCUMENT_TYPES_META[doc.type];
          return (
            <li
              key={doc.type}
              className="flex items-start gap-3 rounded-xl border border-brand-stone/40 bg-brand-cream/30 p-3.5"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                ✓
              </span>
              <div>
                <p className="text-sm font-semibold text-brand-forest">
                  {meta?.label || doc.type.replace(/_/g, " ")}
                </p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  {doc.notes || meta?.description || "Document confirmed available."}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Subtle Disclaimer Rule 9 */}
      <p className="mt-5 border-t border-brand-sand/60 pt-3.5 text-[11px] leading-relaxed text-brand-muted italic">
        Documentation information is based on details provided to Abundance Abodes and should be independently verified during due diligence before purchase.
      </p>
    </div>
  );
}
