type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Renders a schema.org JSON-LD block. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
