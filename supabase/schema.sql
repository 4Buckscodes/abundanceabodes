-- ============================================================
-- Abundance Abodes — Supabase schema
-- Run this in the Supabase SQL editor when the client's project
-- is created, then set:
--   NEXT_PUBLIC_SUPABASE_URL=...
--   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   (public reads)
--   SUPABASE_SECRET_KEY=sb_secret_...                        (server-only writes)
-- (Legacy anon / service_role keys are still accepted as fallbacks.)
-- The app switches from seed data to these tables automatically.
-- ============================================================

-- ---------- Properties ----------
create table if not exists public.properties (
  id               text primary key,
  slug             text not null unique,
  title            text not null,
  category         text not null check (category in ('home','land')),
  type             text not null,
  purpose          text not null default 'sale' check (purpose in ('sale','rent')),
  short_description text not null default '',
  description      jsonb not null default '[]'::jsonb, -- array of paragraphs
  price            numeric(14,2),
  currency         text not null default 'NGN' check (currency in ('NGN','USD')),
  price_note       text,
  location         text not null,
  address          text,
  bedrooms         int2,
  bathrooms        int2,
  toilets          int2,
  parking_spaces   int2,
  land_size        text,
  property_size    text,
  status           text not null default 'available'
                   check (status in ('available','reserved','sold','coming-soon')),
  featured         boolean not null default false,
  main_image       jsonb not null,                    -- {url, alt}
  gallery          jsonb not null default '[]'::jsonb -- [{url, alt}]
                   check (jsonb_typeof(gallery) = 'array'),
  youtube_url      text,
  amenities        jsonb not null default '[]'::jsonb check (jsonb_typeof(amenities) = 'array'),
  documentation    jsonb not null default '[]'::jsonb check (jsonb_typeof(documentation) = 'array'),
  developer_name   text,
  developer_note   text,
  seo_title        text,
  seo_description  text,
  seo_keywords     jsonb check (seo_keywords is null or jsonb_typeof(seo_keywords) = 'array'),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_properties_category on public.properties (category);
create index if not exists idx_properties_status   on public.properties (status);
create index if not exists idx_properties_featured on public.properties (featured desc);

-- ---------- Enquiries ----------
create table if not exists public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null,
  phone          text not null,
  property_slug  text references public.properties(slug) on delete set null,
  property_title text,
  preferred_time text,
  message        text,
  status         text not null default 'new'
                 check (status in ('new','contacted','in-progress','completed')),
  created_at     timestamptz not null default now()
);

create index if not exists idx_enquiries_status     on public.enquiries (status);
create index if not exists idx_enquiries_created_at on public.enquiries (created_at desc);

-- ---------- Testimonials ----------
create table if not exists public.testimonials (
  id          text primary key,
  quote       text not null,
  attribution text,
  sort_order  int2 not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- FAQs ----------
create table if not exists public.faqs (
  id          text primary key,
  question    text not null,
  answer      text not null,
  sort_order  int2 not null default 0,
  published   boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ---------- Insights / articles ----------
create table if not exists public.insights (
  id           text primary key,
  slug         text not null unique,
  title        text not null,
  excerpt      text not null,
  body         jsonb not null default '[]'::jsonb, -- [{heading?, paragraphs[]}]
  tag          text not null default 'Insights',
  read_minutes int2 not null default 5,
  published_at timestamptz not null,
  published    boolean not null default true
);

-- ---------- Site content (key/value JSON) ----------
create table if not exists public.site_content (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Example rows the admin content screen can manage later:
-- insert into site_content (key, value) values
--   ('contact', '{"phone":null,"email":null,"addressLines":["Serving clients across Nigeria"]}'),
--   ('homepage_hero', '{"title":"Property That Builds Abundance."}');

-- ============================================================
-- Row Level Security
-- Public site reads via the publishable key; writes only for
-- authenticated admin users. Create an admin user under Authentication
-- and add their id to the admins table below.
--
-- NOTE: the Next.js app itself does NOT write with the publishable key. Its
-- admin dashboard uses its own session cookie and performs all writes
-- server-side with SUPABASE_SECRET_KEY (which bypasses RLS), so
-- these policies are a second layer of defence for direct API access
-- rather than the mechanism the app depends on.
-- ============================================================

alter table public.properties   enable row level security;
alter table public.enquiries    enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs         enable row level security;
alter table public.insights     enable row level security;
alter table public.site_content enable row level security;

-- Table of admin user ids (fill after creating an auth user)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Helper: is current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- Properties: world-readable; admin-only writes
drop policy if exists "properties are public" on public.properties;
create policy "properties are public"
  on public.properties for select using (true);
drop policy if exists "admins write properties" on public.properties;
create policy "admins write properties"
  on public.properties for all
  using (public.is_admin()) with check (public.is_admin());

-- Testimonials / FAQs / Insights: public read of published rows
drop policy if exists "published testimonials are public" on public.testimonials;
create policy "published testimonials are public"
  on public.testimonials for select using (published or public.is_admin());
drop policy if exists "admins write testimonials" on public.testimonials;
create policy "admins write testimonials"
  on public.testimonials for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "published faqs are public" on public.faqs;
create policy "published faqs are public"
  on public.faqs for select using (published or public.is_admin());
drop policy if exists "admins write faqs" on public.faqs;
create policy "admins write faqs"
  on public.faqs for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "published insights are public" on public.insights;
create policy "published insights are public"
  on public.insights for select using (published or public.is_admin());
drop policy if exists "admins write insights" on public.insights;
create policy "admins write insights"
  on public.insights for all
  using (public.is_admin()) with check (public.is_admin());

-- Site content: public readable, admin writable
drop policy if exists "site content is public" on public.site_content;
create policy "site content is public"
  on public.site_content for select using (true);
drop policy if exists "admins write site content" on public.site_content;
create policy "admins write site content"
  on public.site_content for all
  using (public.is_admin()) with check (public.is_admin());

-- Enquiries: ANYONE can create (the consultation form), only admins can read/update.
drop policy if exists "anyone can submit enquiries" on public.enquiries;
create policy "anyone can submit enquiries"
  on public.enquiries for insert with check (true);
drop policy if exists "admins read enquiries" on public.enquiries;
create policy "admins read enquiries"
  on public.enquiries for select using (public.is_admin());
drop policy if exists "admins update enquiries" on public.enquiries;
create policy "admins update enquiries"
  on public.enquiries for update
  using (public.is_admin()) with check (public.is_admin());
