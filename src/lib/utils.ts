export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * URL-safe slug from arbitrary text: lowercase, non-alphanumerics collapsed to
 * single hyphens, trimmed. Returns "" when the input has no usable characters
 * (callers supply their own fallback). Shared by the property save path and the
 * admin editor so an AI-applied title and a manually saved one slugify identically.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ngnFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(
  price: number | null,
  currency: "NGN" | "USD",
  note?: string
): string {
  if (price == null) return note || "Price on request";
  const formatted =
    currency === "USD" ? usdFormatter.format(price) : ngnFormatter.format(price);
  return note ? `${formatted} ${note}` : formatted;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
