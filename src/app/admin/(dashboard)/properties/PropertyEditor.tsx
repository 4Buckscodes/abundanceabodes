"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Property, PropertyCategory, PropertyType } from "@/lib/types";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { AiListingAssistant } from "@/components/admin/AiListingAssistant";
import { PropertyDocumentationEditor } from "@/components/admin/PropertyDocumentationEditor";
import type { AiExtractionResult } from "@/lib/ai-assistant";
import { savePropertyAction, type SaveState } from "./actions";

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

export function PropertyEditor({ property }: { property?: Property }) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(
    savePropertyAction,
    {}
  );

  const [category, setCategory] = useState<PropertyCategory>(property?.category ?? "home");
  const [propertyType, setPropertyType] = useState<PropertyType>(property?.type ?? "duplex");

  // Form field state for AI extraction populating
  const [extractedData, setExtractedData] = useState<Partial<Property> | null>(null);
  // Bumped on each apply so uncontrolled fields + the documentation editor remount
  // with the freshly applied values instead of keeping their mount-time state.
  const [aiApplyVersion, setAiApplyVersion] = useState(0);

  const handleAiApply = (extracted: AiExtractionResult) => {
    setCategory(extracted.category);
    setPropertyType(extracted.type);
    setExtractedData({
      title: extracted.title,
      category: extracted.category,
      type: extracted.type,
      purpose: extracted.purpose,
      price: extracted.price,
      currency: extracted.currency,
      priceNote: extracted.priceNote,
      location: extracted.location,
      address: extracted.address,
      bedrooms: extracted.bedrooms,
      bathrooms: extracted.bathrooms,
      toilets: extracted.toilets,
      parkingSpaces: extracted.parkingSpaces,
      landSize: extracted.landSize,
      propertySize: extracted.propertySize,
      shortDescription: extracted.shortDescription,
      description: extracted.description,
      amenities: extracted.amenities,
      documentation: extracted.documentation,
      developerName: extracted.developerName,
      developerNote: extracted.developerNote,
      seoTitle: extracted.seoTitle,
      seoDescription: extracted.seoDescription,
      seoKeywords: extracted.seoKeywords,
    });
    setAiApplyVersion((v) => v + 1);
  };

  return (
    <form action={formAction} className="space-y-6">
      {property ? (
        <input type="hidden" name="id" value={property.id} />
      ) : null}

      {/* AI Property Listing Assistant Widget */}
      <AiListingAssistant onApply={handleAiApply} />

      <Section title="Basics">
        <TextField
          key={`title-${aiApplyVersion}`}
          name="title"
          label="Title"
          value={extractedData?.title ?? property?.title}
          required
        />
        <TextField
          name="slug"
          label="URL slug"
          value={property?.slug}
          required
          hint="Lowercase letters, numbers, hyphens. e.g. the-crest-4-bedroom-duplex-lekki"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="category" className="input-label">Category</label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as PropertyCategory)}
              className="input-field"
            >
              <option value="home">Home</option>
              <option value="land">Land</option>
            </select>
          </div>
          <div>
            <label htmlFor="type" className="input-label">Type</label>
            <select
              id="type"
              name="type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value as PropertyType)}
              className="input-field"
            >
              <optgroup label="Homes">
                <option value="apartment">Apartment</option>
                <option value="duplex">Duplex</option>
                <option value="terrace">Terrace</option>
                <option value="bungalow">Bungalow</option>
                <option value="villa">Villa</option>
              </optgroup>
              <optgroup label="Land">
                <option value="residential-land">Residential land</option>
                <option value="commercial-land">Commercial land</option>
                <option value="mixed-use-land">Mixed-use land</option>
                <option value="estate-allocation">Estate allocation</option>
              </optgroup>
            </select>
          </div>
          <div>
            <label htmlFor="purpose" className="input-label">Purpose</label>
            <select
              key={`purpose-${aiApplyVersion}`}
              id="purpose"
              name="purpose"
              defaultValue={extractedData?.purpose ?? property?.purpose ?? "sale"}
              className="input-field"
            >
              <option value="sale">For sale</option>
              <option value="rent">For rent</option>
            </select>
          </div>
        </div>
        <TextArea
          key={`shortDescription-${aiApplyVersion}`}
          name="shortDescription"
          label="Short description (shown on cards)"
          value={extractedData?.shortDescription ?? property?.shortDescription}
          rows={2}
        />
      </Section>

      {/* Property Documentation Checklist Section */}
      <Section title="Property Documentation & Title Verification">
        <PropertyDocumentationEditor
          key={`docs-${aiApplyVersion}`}
          initialDocumentation={extractedData?.documentation ?? property?.documentation}
          category={category}
          propertyType={propertyType}
        />
      </Section>

      <Section title="Price & status">
        <div className="grid gap-4 sm:grid-cols-4">
          <TextField
            key={`price-${aiApplyVersion}`}
            name="price"
            label="Price"
            value={extractedData?.price ?? property?.price ?? ""}
            type="number"
            hint="Leave blank for 'on application'"
          />
          <div>
            <label htmlFor="currency" className="input-label">Currency</label>
            <select
              key={`currency-${aiApplyVersion}`}
              id="currency"
              name="currency"
              defaultValue={extractedData?.currency ?? property?.currency ?? "NGN"}
              className="input-field"
            >
              <option value="NGN">NGN ₦</option>
              <option value="USD">USD $</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="input-label">Status</label>
            <select id="status" name="status" defaultValue={property?.status ?? "available"} className="input-field">
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="coming-soon">Coming soon</option>
            </select>
          </div>
          <TextField
            key={`priceNote-${aiApplyVersion}`}
            name="priceNote"
            label="Price note"
            value={extractedData?.priceNote ?? property?.priceNote}
            hint='e.g. "per plot"'
          />
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-brand-forest">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={property?.featured}
            className="h-5 w-5 rounded border-brand-stone accent-[#1a3c2e]"
          />
          Feature this property on the homepage
        </label>
      </Section>

      <Section title="Location & specifications">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            key={`location-${aiApplyVersion}`}
            name="location"
            label="Location (area, city)"
            value={extractedData?.location ?? property?.location}
            required
          />
          <TextField
            key={`address-${aiApplyVersion}`}
            name="address"
            label="Address note"
            value={extractedData?.address ?? property?.address}
          />
          <TextField
            key={`bedrooms-${aiApplyVersion}`}
            name="bedrooms"
            label="Bedrooms"
            value={extractedData?.bedrooms ?? property?.bedrooms ?? ""}
            type="number"
          />
          <TextField
            key={`bathrooms-${aiApplyVersion}`}
            name="bathrooms"
            label="Bathrooms"
            value={extractedData?.bathrooms ?? property?.bathrooms ?? ""}
            type="number"
          />
          <TextField
            key={`toilets-${aiApplyVersion}`}
            name="toilets"
            label="Toilets"
            value={extractedData?.toilets ?? property?.toilets ?? ""}
            type="number"
          />
          <TextField
            key={`parkingSpaces-${aiApplyVersion}`}
            name="parkingSpaces"
            label="Parking spaces"
            value={extractedData?.parkingSpaces ?? property?.parkingSpaces ?? ""}
            type="number"
          />
          <TextField
            key={`landSize-${aiApplyVersion}`}
            name="landSize"
            label="Land size"
            value={extractedData?.landSize ?? property?.landSize}
            placeholder="e.g. 500 sqm"
          />
          <TextField
            key={`propertySize-${aiApplyVersion}`}
            name="propertySize"
            label="Property (built) size"
            value={extractedData?.propertySize ?? property?.propertySize}
            placeholder="e.g. 320 sqm"
          />
        </div>
      </Section>

      <Section title="Photos & video">
        <ImageUploader
          name="mainImageUrl"
          label="Main photo"
          initial={
            property?.mainImage.url
              ? [{ url: property.mainImage.url, alt: property.mainImage.alt }]
              : []
          }
          hint="Shown on cards and as the property page hero."
        />
        <TextField name="mainImageAlt" label="Main image alt text" value={property?.mainImage.alt} />
        <ImageUploader
          name="gallery"
          label="Gallery photos"
          multiple
          initial={property?.gallery ?? []}
          hint="Drag the arrows to reorder. First image shows largest on the page."
        />
        <TextField
          name="youtubeUrl"
          label="YouTube walkthrough URL or video ID"
          value={property?.youtubeUrl}
          hint="watch?v=, youtu.be/, embed/ and shorts/ links are all accepted"
        />
      </Section>

      <Section title="Details">
        <TextArea
          key={`description-${aiApplyVersion}`}
          name="description"
          label="Full description"
          value={extractedData?.description ? extractedData.description.join("\n\n") : property?.description.join("\n\n")}
          rows={7}
          hint="Separate paragraphs with a blank line."
        />
        <TextArea
          key={`amenities-${aiApplyVersion}`}
          name="amenities"
          label="Features / amenities"
          value={extractedData?.amenities ? extractedData.amenities.join("\n") : property?.amenities.join("\n")}
          rows={6}
          hint="One per line."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            key={`developerName-${aiApplyVersion}`}
            name="developerName"
            label="Developer / brand name"
            value={extractedData?.developerName ?? property?.developerName}
          />
          <TextField
            key={`developerNote-${aiApplyVersion}`}
            name="developerNote"
            label="Developer note"
            value={extractedData?.developerNote ?? property?.developerNote}
          />
        </div>
      </Section>

      <Section title="SEO">
        <TextField
          key={`seoTitle-${aiApplyVersion}`}
          name="seoTitle"
          label="SEO title"
          value={extractedData?.seoTitle ?? property?.seoTitle}
          hint="Aim for under 60 characters."
        />
        <TextArea
          key={`seoDescription-${aiApplyVersion}`}
          name="seoDescription"
          label="SEO meta description"
          value={extractedData?.seoDescription ?? property?.seoDescription}
          rows={2}
        />
        <TextArea
          key={`seoKeywords-${aiApplyVersion}`}
          name="seoKeywords"
          label="SEO keywords"
          value={(extractedData?.seoKeywords ?? property?.seoKeywords)?.join("\n")}
          rows={3}
          hint="One keyword phrase per line."
        />
      </Section>

      {state.error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 pb-10">
        <button type="submit" className="btn-primary min-w-44" disabled={pending}>
          {pending ? "Saving…" : property ? "Save changes" : "Create property"}
        </button>
        <Link href="/admin/properties" className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}

