import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  onDark?: boolean;
  id?: string;
  className?: string;
};

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  onDark = false,
  id,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p
        className={cn(
          onDark ? "section-label-on-dark" : "section-label",
          "mb-3",
          align === "center" && !onDark && "",
          align === "center" &&
            !onDark &&
            "flex items-center justify-center gap-3 after:h-px after:w-8 after:bg-brand-gold"
        )}
      >
        {label}
      </p>
      <h2
        id={id}
        className={cn(
          "text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.6rem] lg:leading-tight",
          onDark && "text-brand-cream"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            onDark ? "text-brand-sand" : "text-brand-muted"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
