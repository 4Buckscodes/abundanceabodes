export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
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
