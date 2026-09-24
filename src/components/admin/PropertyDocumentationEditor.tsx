"use client";

import { useState } from "react";
import type {
  PropertyCategory,
  PropertyDocument,
  PropertyDocumentCategory,
  PropertyDocumentStatus,
  PropertyDocumentType,
} from "@/lib/types";
import {
  DOCUMENT_CATEGORIES,
  DOCUMENT_TYPES_META,
  STATUS_META,
  normalizeDocumentation,
  getPrioritizedDocTypes,
} from "@/lib/documentation";

interface PropertyDocumentationEditorProps {
  initialDocumentation?: PropertyDocument[];
  category: PropertyCategory;
  propertyType?: string;
}

export function PropertyDocumentationEditor({
  initialDocumentation = [],
  category,
  propertyType,
}: PropertyDocumentationEditorProps) {
  // Store status and notes in state for interactive prefilling by AI or Admin
  const [docState, setDocState] = useState<Record<PropertyDocumentType, { status: PropertyDocumentStatus; notes: string }>>(() => {
    const normalized = normalizeDocumentation(initialDocumentation);
    const initialMap: Record<string, { status: PropertyDocumentStatus; notes: string }> = {};
    normalized.forEach((d) => {
      initialMap[d.type] = {
        status: d.status,
        notes: d.notes || "",
      };
    });
    return initialMap as Record<PropertyDocumentType, { status: PropertyDocumentStatus; notes: string }>;
  });

  const [activeTab, setActiveTab] = useState<PropertyDocumentCategory>("title_land");
  const prioritizedTypes = getPrioritizedDocTypes(category, propertyType);

  const updateStatus = (type: PropertyDocumentType, status: PropertyDocumentStatus) => {
    setDocState((prev) => ({
      ...prev,
      [type]: { ...prev[type], status },
    }));
  };

  const updateNotes = (type: PropertyDocumentType, notes: string) => {
    setDocState((prev) => ({
      ...prev,
      [type]: { ...prev[type], notes },
    }));
  };

  const allDocTypes = Object.keys(DOCUMENT_TYPES_META) as PropertyDocumentType[];

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-brand-sand pb-3">
        {DOCUMENT_CATEGORIES.map((cat) => {
          const countAvailable = allDocTypes.filter(
            (t) => DOCUMENT_TYPES_META[t].category === cat.id && docState[t]?.status === "available"
          ).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                activeTab === cat.id
                  ? "bg-brand-forest text-brand-gold-light shadow-xs"
                  : "border border-brand-stone/40 bg-brand-white text-brand-forest hover:bg-brand-sand/40"
              }`}
            >
              {cat.title}
              {countAvailable > 0 && (
                <span className="ml-2 rounded-full bg-brand-gold px-2 py-0.5 text-[10px] font-bold text-brand-forest-dark">
                  {countAvailable}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {allDocTypes
          .filter((type) => DOCUMENT_TYPES_META[type].category === activeTab)
          .map((type) => {
            const meta = DOCUMENT_TYPES_META[type];
            const isPrioritized = prioritizedTypes.includes(type);
            const current = docState[type] || { status: "not_stated", notes: "" };

            return (
              <div
                key={type}
                className={`rounded-xl border p-4 transition-all ${
                  isPrioritized
                    ? "border-brand-gold/50 bg-brand-cream/40"
                    : "border-brand-stone/40 bg-brand-white"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-brand-forest text-sm sm:text-base">
                        {meta.label}
                      </span>
                      {isPrioritized && (
                        <span className="rounded-full bg-brand-forest/10 px-2 py-0.5 text-[10px] font-semibold text-brand-forest">
                          Priority for {category}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-brand-muted">{meta.description}</p>
                  </div>

                  {/* Hidden form inputs for server submission */}
                  <input type="hidden" name={`doc_status_${type}`} value={current.status} />
                  <input type="hidden" name={`doc_notes_${type}`} value={current.notes} />
                </div>

                {/* Status Radio Pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(
                    [
                      "available",
                      "pending",
                      "requires_verification",
                      "not_stated",
                      "not_available",
                      "not_applicable",
                    ] as PropertyDocumentStatus[]
                  ).map((st) => {
                    const stMeta = STATUS_META[st];
                    const isSelected = current.status === st;

                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => updateStatus(type, st)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          isSelected
                            ? `${stMeta.badgeClass} ring-2 ring-brand-forest/20 shadow-xs`
                            : "border-brand-stone/40 bg-brand-white text-brand-muted hover:border-brand-stone hover:text-brand-forest"
                        }`}
                      >
                        <span className="mr-1">{stMeta.icon}</span>
                        {stMeta.label}
                      </button>
                    );
                  })}
                </div>

                {/* Optional Notes Input */}
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Optional note e.g. Original sighted by agent; government verification pending..."
                    value={current.notes}
                    onChange={(e) => updateNotes(type, e.target.value)}
                    className="w-full rounded-lg border border-brand-stone/50 bg-brand-sand/10 px-3 py-1.5 text-xs text-brand-forest placeholder:text-brand-muted/60 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
