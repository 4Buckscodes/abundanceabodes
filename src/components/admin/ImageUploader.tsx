"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type GalleryItem = { url: string; alt: string };

type ImageUploaderProps = {
  /** Hidden input name that receives the serialised value. */
  name: string;
  /** Existing images (urls) to pre-populate. */
  initial?: GalleryItem[];
  /** Single mode emits just the URL; gallery mode emits "url | alt" lines. */
  multiple?: boolean;
  label: string;
  hint?: string;
};

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 5;

export function ImageUploader({
  name,
  initial = [],
  multiple = false,
  label,
  hint,
}: ImageUploaderProps) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [busy, setBusy] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [showUrlEntry, setShowUrlEntry] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function serialize(): string {
    if (!multiple) return items[0]?.url ?? "";
    return items.map((i) => `${i.url} | ${i.alt}`).join("\n");
  }

  function addItem(item: GalleryItem) {
    setItems((prev) => (multiple ? [...prev, item] : [item]));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");

    const list = Array.from(files).slice(0, multiple ? 10 : 1);
    for (const file of list) {
      if (!ACCEPTED.includes(file.type)) {
        setError(`"${file.name}" is not a JPG, PNG or WebP image.`);
        continue;
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setError(`"${file.name}" is larger than ${MAX_MB} MB.`);
        continue;
      }

      const marker = `${file.name}-${Date.now()}`;
      setBusy((b) => [...b, marker]);
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const json = (await res.json().catch(() => null)) as {
          ok?: boolean;
          url?: string;
          error?: string;
        } | null;

        if (res.ok && json?.ok && json.url) {
          addItem({
            url: json.url,
            alt: "",
          });
        } else {
          setError(json?.error ?? "Upload failed. Please try again.");
        }
      } catch {
        setError("Upload failed — check your connection and try again.");
      } finally {
        setBusy((b) => b.filter((m) => m !== marker));
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updateAlt(index: number, alt: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, alt } : item))
    );
  }

  return (
    <div>
      <span className="input-label">{label}</span>

      <input type="hidden" name={name} value={serialize()} />

      {/* Current images */}
      {items.length > 0 ? (
        <ul className="mt-1 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item.url + index}
              className="overflow-hidden rounded-xl border border-brand-sand bg-brand-cream/60"
            >
              <div className="relative aspect-[4/3] bg-brand-sand/50">
                <Image
                  src={item.url}
                  alt={item.alt || `Property image ${index + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized={item.url.startsWith("http")}
                />
                {!multiple ? (
                  <span className="absolute left-2 top-2 rounded-full bg-brand-forest px-2.5 py-0.5 text-[11px] font-semibold text-brand-gold-light">
                    Main image
                  </span>
                ) : (
                  <div className="absolute right-1.5 top-1.5 flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      aria-label={`Move image ${index + 1} earlier`}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brand-forest shadow-sm transition-opacity hover:bg-white disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label={`Move image ${index + 1} later`}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brand-forest shadow-sm transition-opacity hover:bg-white disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-sm transition-colors hover:bg-red-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              {multiple ? (
                <input
                  type="text"
                  value={item.alt}
                  onChange={(e) => updateAlt(index, e.target.value)}
                  placeholder="Alt text (for accessibility & SEO)"
                  className="w-full border-t border-brand-sand bg-white px-2.5 py-2 text-xs text-brand-ink placeholder:text-brand-muted/50 focus:outline-none"
                />
              ) : null}
            </li>
          ))}

          {/* Inline upload tile while in gallery mode */}
          {multiple ? (
            <li>
              <label
                className={cn(
                  "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-stone/70 bg-brand-sand/20 text-center transition-colors hover:border-brand-gold hover:bg-brand-sand/40",
                  busy.length > 0 && "pointer-events-none opacity-60"
                )}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  className="sr-only"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                {busy.length > 0 ? (
                  <>
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-gold/40 border-t-brand-gold" />
                    <span className="px-2 text-xs font-medium text-brand-muted">
                      Uploading…
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="h-6 w-6 text-brand-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="px-2 text-xs font-semibold text-brand-forest">
                      Add photos
                    </span>
                    <span className="px-2 text-[11px] leading-snug text-brand-muted">
                      JPG, PNG or WebP · up to 5 MB
                    </span>
                  </>
                )}
              </label>
            </li>
          ) : null}
        </ul>
      ) : null}

      {/* Empty / single-mode dropzone */}
      {(items.length === 0 || !multiple) && (
        <label
          className={cn(
            "mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-stone/70 bg-brand-sand/20 px-6 py-8 text-center transition-colors hover:border-brand-gold hover:bg-brand-sand/40",
            busy.length > 0 && "pointer-events-none opacity-60"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            {...(multiple ? { multiple: true } : {})}
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {busy.length > 0 ? (
            <>
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand-gold/40 border-t-brand-gold" />
              <span className="text-xs font-medium text-brand-muted">
                Uploading…
              </span>
            </>
          ) : (
            <>
              <svg className="h-7 w-7 text-brand-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-sm font-semibold text-brand-forest">
                {multiple ? "Upload property photos" : "Upload main photo"}
              </span>
              <span className="text-xs text-brand-muted">
                Click to choose · JPG, PNG or WebP · up to {MAX_MB} MB
              </span>
            </>
          )}
        </label>
      )}

      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {/* Manual URL fallback for reusing bundled artwork */}
      {showUrlEntry ? (
        <div className="mt-3 flex gap-2">
          <input
            type="url"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="/images/properties/exterior-duplex.svg or https://…"
            className="input-field !py-2 text-sm"
          />
          <button
            type="button"
            className="btn-secondary shrink-0 !px-4 !py-2 text-xs"
            onClick={() => {
              if (urlDraft.trim()) {
                addItem({ url: urlDraft.trim(), alt: "" });
                setUrlDraft("");
                setShowUrlEntry(false);
              }
            }}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowUrlEntry(true)}
          className="mt-2 text-xs font-medium text-brand-muted underline decoration-dotted underline-offset-4 hover:text-brand-forest"
        >
          Or paste an image URL instead
        </button>
      )}

      {hint ? <p className="mt-1.5 text-xs text-brand-muted">{hint}</p> : null}
    </div>
  );
}
