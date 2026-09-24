import type { PropertyStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const styles: Record<PropertyStatus, string> = {
  available: "bg-brand-forest text-brand-cream",
  reserved: "bg-brand-gold text-brand-forest-dark",
  sold: "bg-brand-ink/70 text-brand-cream",
  "coming-soon": "bg-brand-sand text-brand-forest border border-brand-stone/60",
};

const labels: Record<PropertyStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
  "coming-soon": "Coming Soon",
};

export function StatusBadge({
  status,
  className,
}: {
  status: PropertyStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
