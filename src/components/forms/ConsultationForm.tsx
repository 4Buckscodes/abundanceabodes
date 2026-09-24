"use client";

import { useState } from "react";
import type { Property } from "@/lib/types";
import {
  submitConsultation,
  validate,
  isEmailJsConfigured,
  type FieldErrors,
  type FormValues,
} from "@/lib/form-logic";

const EMPTY: FormValues = {
  name: "",
  email: "",
  phone: "",
  propertySlug: "",
  preferredTime: "",
  message: "",
};

type ConsultationFormProps = {
  properties: Pick<Property, "slug" | "title">[];
  defaultPropertySlug?: string;
};

export function ConsultationForm({
  properties,
  defaultPropertySlug,
}: ConsultationFormProps) {
  const [values, setValues] = useState<FormValues>({
    ...EMPTY,
    propertySlug: defaultPropertySlug ?? "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  function update(key: keyof FormValues, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      document
        .querySelector<HTMLElement>(`[name="${Object.keys(fieldErrors)[0]}"]`)
        ?.focus();
      return;
    }
    setStatus("submitting");
    const result = await submitConsultation(values, properties);
    setStatus(result === "error" ? "error" : "success");
  }

  if (status === "success") {
    return (
      <div
        className="rounded-2xl border border-brand-forest/20 bg-brand-white p-8 text-center sm:p-10"
        role="status"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-forest text-brand-cream">
          <svg
            className="h-7 w-7"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <h3 className="mt-5 font-serif text-2xl font-semibold">
          Request received
        </h3>
        <p className="mt-2 leading-relaxed text-brand-muted">
          Thank you{values.name ? `, ${values.name.split(" ")[0]}` : ""}. A member
          of our advisory team will reach out shortly to confirm your
          consultation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {!isEmailJsConfigured() ? (
        <p className="rounded-xl border border-brand-gold/40 bg-brand-gold/10 px-4 py-3 text-sm text-brand-gold-dark">
          Note: email delivery is being finalised. Submitting still records your
          request and our team follows up on every enquiry.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="cc-name"
          label="Full name"
          required
          error={errors.name}
          input={
            <input
              id="cc-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="input-field"
              placeholder="e.g. Adaeze Okafor"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "cc-name-error" : undefined}
            />
          }
        />
        <Field
          id="cc-email"
          label="Email address"
          required
          error={errors.email}
          input={
            <input
              id="cc-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input-field"
              placeholder="you@example.com"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "cc-email-error" : undefined}
            />
          }
        />
        <Field
          id="cc-phone"
          label="Phone number"
          required
          error={errors.phone}
          input={
            <input
              id="cc-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className="input-field"
              placeholder="+234 801 234 5678"
              value={values.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          }
        />
        <Field
          id="cc-property"
          label="Property of interest"
          input={
            <select
              id="cc-property"
              name="propertySlug"
              className="input-field"
              value={values.propertySlug}
              onChange={(e) => update("propertySlug", e.target.value)}
            >
              <option value="">General consultation</option>
              {properties.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          }
        />
      </div>

      <Field
        id="cc-time"
        label="Preferred consultation date / time"
        input={
          <input
            id="cc-time"
            name="preferredTime"
            type="text"
            className="input-field"
            placeholder="e.g. Weekday evenings, or Saturday 10am"
            value={values.preferredTime}
            onChange={(e) => update("preferredTime", e.target.value)}
          />
        }
      />

      <Field
        id="cc-message"
        label="Message"
        error={errors.message}
        input={
          <textarea
            id="cc-message"
            name="message"
            rows={4}
            className="input-field resize-y"
            placeholder="Tell us about your goals, budget range, or any questions."
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "cc-message-error" : undefined}
          />
        }
      />

      {status === "error" ? (
        <p
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          We couldn&apos;t submit your request just now — this is usually
          temporary. Please try again in a moment.
        </p>
      ) : null}

      <button
        type="submit"
        className="btn-primary w-full sm:w-auto sm:min-w-56"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-brand-cream/40 border-t-brand-cream"
              aria-hidden="true"
            />
            Sending…
          </>
        ) : (
          "Book a Consultation"
        )}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  input,
  error,
  required,
}: {
  id: string;
  label: string;
  input: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="input-label">
        {label}{" "}
        {required ? (
          <span aria-hidden="true" className="text-brand-gold-dark">
            *
          </span>
        ) : null}
      </label>
      {input}
      {error ? (
        <p id={`${id}-error`} className="error-text" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
