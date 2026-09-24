"use client";

import { useState, useEffect } from "react";
import type { Property } from "@/lib/types";
import { getWhatsAppLink } from "@/lib/site";

interface InspectionModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function InspectionModal({ property, isOpen, onClose }: InspectionModalProps) {
  // Scrollable, height-capped overlay so the dialog is usable on short viewports.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          propertySlug: property.slug,
          propertyTitle: property.title,
          preferredTime: `${date} ${time}`.trim(),
          message: message || `Requesting physical/virtual inspection for ${property.title}.`,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inspection request");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = `Hello Abundance Abodes, I would like to schedule an inspection for property "${property.title}" (Ref: ${property.slug}).`;
  const whatsappUrl = getWhatsAppLink(whatsappMessage);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Book Inspection for ${property.title}`}
      className="fixed inset-0 z-100 overflow-y-auto overscroll-contain bg-brand-forest-dark/80 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-brand-sand bg-brand-white p-6 shadow-2xl sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-sand/40 text-brand-forest transition-colors hover:bg-brand-sand"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-brand-forest">
              Inspection Requested!
            </h3>
            <p className="mt-2 text-sm text-brand-muted">
              Thank you, <strong className="text-brand-forest">{name}</strong>. Our advisory desk will contact you shortly to confirm your inspection appointment for <strong className="text-brand-forest">{property.title}</strong>.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary justify-center gap-2 !bg-[#25D366] hover:!bg-[#20bd5a]"
              >
                Chat directly on WhatsApp
              </a>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary justify-center text-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold-dark">
              Property Inspection Request
            </span>
            <h3 className="mt-1 font-serif text-xl font-semibold text-brand-forest sm:text-2xl">
              Book a Private Viewing
            </h3>
            <p className="mt-1.5 text-xs text-brand-muted">
              Property: <strong className="font-semibold text-brand-forest">{property.title}</strong> ({property.location})
            </p>

            {error && (
              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label htmlFor="modal-name" className="block text-xs font-semibold text-brand-forest">
                  Full Name *
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  placeholder="e.g. Chief Funke Adeleke"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-sand/10 px-3.5 py-2 text-sm text-brand-forest placeholder:text-brand-muted/60 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="modal-email" className="block text-xs font-semibold text-brand-forest">
                    Email Address *
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-sand/10 px-3.5 py-2 text-sm text-brand-forest placeholder:text-brand-muted/60 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="modal-phone" className="block text-xs font-semibold text-brand-forest">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-sand/10 px-3.5 py-2 text-sm text-brand-forest placeholder:text-brand-muted/60 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="modal-date" className="block text-xs font-semibold text-brand-forest">
                    Preferred Date
                  </label>
                  <input
                    id="modal-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-sand/10 px-3.5 py-2 text-sm text-brand-forest focus:border-brand-gold focus:bg-brand-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="modal-time" className="block text-xs font-semibold text-brand-forest">
                    Preferred Time
                  </label>
                  <select
                    id="modal-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-sand/10 px-3.5 py-2 text-sm text-brand-forest focus:border-brand-gold focus:bg-brand-white focus:outline-none"
                  >
                    <option value="">Select Time Window</option>
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 3 PM)">Afternoon (12 PM - 3 PM)</option>
                    <option value="Evening (3 PM - 6 PM)">Evening (3 PM - 6 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="modal-message" className="block text-xs font-semibold text-brand-forest">
                  Specific Notes or Questions
                </label>
                <textarea
                  id="modal-message"
                  rows={2}
                  placeholder="e.g. Interested in land survey documents, virtual video tour first, etc."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-brand-stone/60 bg-brand-sand/10 px-3.5 py-2 text-sm text-brand-forest placeholder:text-brand-muted/60 focus:border-brand-gold focus:bg-brand-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center !py-3 text-sm font-semibold shadow-md disabled:opacity-50"
                >
                  {loading ? "Submitting Request..." : "Confirm Inspection Booking"}
                </button>
              </div>
            </form>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
