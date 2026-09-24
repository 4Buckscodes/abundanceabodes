# Abundance Abodes

Client-first real estate brokerage website for a Nigerian property firm.

**Positioning:** trust, verification, and long-term value — not generic luxury clichés.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Supabase-ready data layer** (PostgREST via `fetch`, zero extra dependencies)
- Deployable to **Netlify** via `@netlify/plugin-nextjs`

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

## Configuration

Copy `.env.example` to `.env.local`. Everything is optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, JSON-LD |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Live database (run `supabase/schema.sql` first). Without them the site renders seed data. |
| `NEXT_PUBLIC_EMAILJS_*` | Consultation-form email delivery. Without them submissions are recorded through `/api/enquiries` when Supabase is present. |
| `ADMIN_PASSWORD` (+ optional `ADMIN_SESSION_SECRET`) | Enables sign-in at `/admin`. |

## Project structure

```
src/
  app/
    page.tsx                    # Homepage
    properties/                 # Listing + [slug] detail pages
    insights/[slug]/            # Articles
    consultation/, contact/     # EmailJS-powered forms
    about/ why-choose-us/ ...   # Content pages
    admin/                      # Password-protected dashboard (login outside route group)
      (dashboard)/              # Dashboard, Properties CRUD, Enquiries, Content
    api/enquiries/              # Enquiry persistence endpoint
    robots.ts sitemap.ts        # SEO infrastructure
  components/
    home/                       # Homepage sections
    property/                   # Cards, gallery + lightbox, video facade, specs
    forms/                      # Consultation form (EmailJS)
    ui/                         # Reveal animations, headings, breadcrumbs
  lib/
    types.ts site.ts utils.ts   # Property model & helpers
    youtube.ts                  # Safe URL parsing + facade embeds
    auth.ts                     # HMAC session tokens (Web Crypto)
    supabase.ts                 # Zero-dependency PostgREST adapter
    data/                       # Seed catalogue + repository with fallback
supabase/schema.sql             # Tables, indexes, RLS policies
```

## Key behaviours

- **Data fallback:** all property/content reads go through `src/lib/data/index.ts`; if Supabase env vars are absent the seed catalogue in `src/lib/data/properties.ts` is used. Adding credentials switches to live data with no code changes.
- **Property pages:** dynamic metadata, JSON-LD (`RealEstateListing`, breadcrumbs), accessible gallery lightbox, lazy-loaded YouTube facade (`youtube-nocookie.com` injected only on click).
- **Consultation form:** client-side validation → EmailJS REST delivery + persistence via `/api/enquiries`; loading/success/error states throughout.
- **Admin:** server-side protection in `src/middleware.ts` *and* the layout; writes are enabled only when Supabase is connected (honest preview mode otherwise).
- **SEO:** per-page titles/descriptions, Open Graph/Twitter cards, `robots.txt`, `sitemap.xml`, Organization/WebSite/FAQ structured data.

## Netlify

`netlify.toml` is configured for the Next.js runtime plugin. Connect the repo and deploy.
