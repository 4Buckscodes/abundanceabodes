"use client";

import { useState } from "react";
import type { Property } from "@/lib/types";
import { siteConfig, getWhatsAppLink } from "@/lib/site";
import { InspectionModal } from "@/components/forms/InspectionModal";

interface PropertyActionsProps {
  property: Property;
}

export function PropertyActions({ property }: PropertyActionsProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const whatsappMessage = `Hello Abundance Abodes, I am interested in property "${property.title}" in ${property.location} (Ref: ${property.slug}).`;
  const whatsappUrl = getWhatsAppLink(whatsappMessage);

  return (
    <>
      {/* Desktop & Inline Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-gold !px-6 !py-3 font-semibold shadow-md"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Book an Inspection
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center gap-2 !px-5 !py-3 font-semibold hover:!border-[#25D366] hover:!text-[#25D366]"
        >
          <svg className="h-4 w-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.004 3.673 3.747-.998z"/>
          </svg>
          WhatsApp Us
        </a>

        <a
          href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
          className="hidden items-center gap-2 rounded-xl border border-brand-stone/60 bg-brand-white px-4 py-3 text-sm font-semibold text-brand-forest transition-colors hover:bg-brand-sand/40 sm:flex"
        >
          <svg className="h-4 w-4 text-brand-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1.1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Advisory
        </a>
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-80 flex items-center justify-between border-t border-brand-sand bg-brand-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-brand-muted">Direct Inquiry</span>
          <p className="text-xs font-semibold text-brand-forest truncate max-w-[140px] sm:max-w-[200px]">
            {property.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.004 3.673 3.747-.998z"/>
            </svg>
          </a>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn-gold !px-4 !py-2.5 text-xs font-semibold"
          >
            Book Inspection
          </button>
        </div>
      </div>

      <InspectionModal
        property={property}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
