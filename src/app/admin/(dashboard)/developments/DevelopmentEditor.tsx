"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Development } from "@/lib/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { saveDevelopmentAction, type SaveState } from "./actions";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface p-6 sm:p-7">
      <h2 className="mb-5 font-serif text-lg font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function TextField({
  name,
  label,
  value,
  hint,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  value?: string | number | null;
  hint?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="input-label">
        {label} {required ? <span className="text-brand-gold-dark">*</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={value ?? ""}
        required={required}
        placeholder={placeholder}
        className="input-field"
      />
      {hint ? <p className="mt-1 text-xs text-brand-muted">{hint}</p> : null}
    </div>
  );
}

function TextArea({
  name,
  label,
  value,
  rows = 4,
  hint,
}: {
  name: string;
  label: string;
  value?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="input-label">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={value ?? ""}
        className="input-field resize-y font-mono text-sm"
      />
      {hint ? <p className="mt-1 text-xs text-brand-muted">{hint}</p> : null}
    </div>
  );
}

export function DevelopmentEditor({ development }: { development?: Development }) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    saveDevelopmentAction,
    {}
  );

  return (
    <form action={formAction} className="space-y-6">
      {development ? (
        <input type="hidden" name="id" value={development.id} />
      ) : null}
      {development ? (
        <input type="hidden" name="createdAt" value={development.createdAt} />
      ) : null}

      <Section title="Basics">
        <TextField
          name="title"
          label="Title"
          value={development?.title}
          required
        />
        <TextField
          name="slug"
          label="URL slug"
          value={development?.slug}
          hint="Lowercase letters, numbers, hyphens. Leave blank to derive it from the title."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="input-label">
              Status <span className="text-brand-gold-dark">*</span>
            </label>
            <select
              id="status"
              name="status"
              defaultValue={development?.status ?? "upcoming"}
              className="input-field"
            >
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <TextField
            name="location"
            label="Location (area, city)"
            value={development?.location}
            required
          />
        </div>
        <TextArea
          name="shortDescription"
          label="Short description (shown on cards)"
          value={development?.shortDescription}
          rows={2}
        />
      </Section>

      <Section title="Project details">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="developer"
            label="Developer / brand"
            value={development?.developer}
          />
          <TextField
            name="totalUnits"
            label="Total units"
            value={development?.totalUnits}
            placeholder="e.g. 24 apartments"
          />
          <TextField
            name="priceFrom"
            label="Price (display text)"
            value={development?.priceFrom}
            placeholder="e.g. From ₦85,000,000"
          />
          <TextField
            name="completionDate"
            label="Completion / timeline"
            value={development?.completionDate}
            placeholder="e.g. Q4 2027 or Delivered 2024"
          />
          <TextField
            name="progress"
            label="Construction progress (%)"
            value={development?.progress ?? ""}
            type="number"
            hint="0–100. Most useful for ongoing projects."
          />
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-brand-forest">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={development?.featured}
            className="h-5 w-5 rounded border-brand-stone accent-[#1a3c2e]"
          />
          Feature this development (shown first within its group)
        </label>
      </Section>

      <Section title="Photo">
        <ImageUploader
          name="mainImageUrl"
          label="Main photo"
          initial={
            development?.mainImage.url
              ? [{ url: development.mainImage.url, alt: development.mainImage.alt }]
              : []
          }
          hint="Shown on the development card."
        />
        <TextField
          name="mainImageAlt"
          label="Main image alt text"
          value={development?.mainImage.alt}
        />
        <ImageUploader
          name="gallery"
          label="Gallery photos (optional)"
          multiple
          initial={development?.gallery ?? []}
          hint="Additional project images."
        />
      </Section>

      <Section title="Details">
        <TextArea
          name="description"
          label="Full description"
          value={development?.description.join("\n\n")}
          rows={7}
          hint="Separate paragraphs with a blank line."
        />
        <TextArea
          name="highlights"
          label="Highlights"
          value={development?.highlights.join("\n")}
          rows={6}
          hint="One highlight per line."
        />
      </Section>

      {state.error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pb-10">
        <button type="submit" className="btn-primary min-w-44" disabled={pending}>
          {pending ? "Saving…" : development ? "Save changes" : "Create development"}
        </button>
        <Link href="/admin/developments" className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
