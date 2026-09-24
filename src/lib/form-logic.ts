import type { Property } from "@/lib/types";

export type FormValues = {
  name: string;
  email: string;
  phone: string;
  propertySlug: string;
  preferredTime: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const env = (key: string) => process.env[key];

export function isEmailJsConfigured(): boolean {
  return Boolean(
    env("NEXT_PUBLIC_EMAILJS_SERVICE_ID") &&
      env("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID") &&
      env("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY")
  );
}

export function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.email.trim())
    errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "That email address doesn't look right.";
  if (!values.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (!/^[+\d][\d\s()-]{6,19}$/.test(values.phone.trim()))
    errors.phone = "Enter a valid phone number, e.g. +234 801 234 5678.";
  if (values.message.length > 1500)
    errors.message = "Please keep your message under 1,500 characters.";
  return errors;
}

/**
 * Sends via EmailJS REST API (no SDK dependency) and persists the enquiry
 * through our API route so it lands in Supabase when configured.
 */
export async function submitConsultation(
  values: FormValues,
  properties: Pick<Property, "slug" | "title">[]
): Promise<"success" | "error" | "partial"> {
  const selectedProperty = properties.find(
    (p) => p.slug === values.propertySlug
  );

  let deliveredViaEmailJs = false;
  if (isEmailJsConfigured()) {
    try {
      const res = await fetch(EMAILJS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: env("NEXT_PUBLIC_EMAILJS_SERVICE_ID"),
          template_id: env("NEXT_PUBLIC_EMAILJS_TEMPLATE_ID"),
          user_id: env("NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"),
          template_params: {
            from_name: values.name.trim(),
            reply_to: values.email.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            property_title: selectedProperty?.title ?? "General consultation",
            property_slug: values.propertySlug || "-",
            preferred_time: values.preferredTime || "Flexible",
            message: values.message.trim() || "(No additional message)",
          },
        }),
      });
      deliveredViaEmailJs = res.ok;
    } catch {
      deliveredViaEmailJs = false;
    }
  }

  let storedInDatabase = false;
  try {
    const apiRes = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        propertySlug: values.propertySlug || null,
        propertyTitle: selectedProperty?.title ?? null,
        preferredTime: values.preferredTime || null,
        message: values.message.trim() || null,
      }),
    });
    storedInDatabase = apiRes.ok;
  } catch {
    storedInDatabase = false;
  }

  if (deliveredViaEmailJs && storedInDatabase) return "success";
  if (deliveredViaEmailJs || storedInDatabase) return "success";
  return "error";
}
