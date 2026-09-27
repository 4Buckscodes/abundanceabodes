-- ============================================================
-- Abundance Abodes — reconcile live DB with schema.sql
--
-- Fixes two issues seen on save:
--   • "Could not find the 'documentation' column of 'properties'" (HTTP 400)
--   • relation "public.developments" does not exist
--
-- Cause: the live DB was created by an older schema.sql. `create table if
-- not exists` never added the newer columns, and the developments table
-- (added later) was never created at all.
--
-- Idempotent and safe to re-run. Run in: Supabase Dashboard → SQL Editor.
-- ============================================================

-- ---------- properties: add any missing columns ----------
alter table public.properties add column if not exists purpose           text not null default 'sale';
alter table public.properties add column if not exists short_description text not null default '';
alter table public.properties add column if not exists description       jsonb not null default '[]'::jsonb;
alter table public.properties add column if not exists price             numeric(14,2);
alter table public.properties add column if not exists currency          text not null default 'NGN';
alter table public.properties add column if not exists price_note        text;
alter table public.properties add column if not exists address           text;
alter table public.properties add column if not exists bedrooms          int2;
alter table public.properties add column if not exists bathrooms         int2;
alter table public.properties add column if not exists toilets           int2;
alter table public.properties add column if not exists parking_spaces    int2;
alter table public.properties add column if not exists land_size         text;
alter table public.properties add column if not exists property_size     text;
alter table public.properties add column if not exists status            text not null default 'available';
alter table public.properties add column if not exists featured          boolean not null default false;
alter table public.properties add column if not exists main_image        jsonb not null default '{}'::jsonb;
alter table public.properties add column if not exists gallery           jsonb not null default '[]'::jsonb;
alter table public.properties add column if not exists youtube_url       text;
alter table public.properties add column if not exists amenities         jsonb not null default '[]'::jsonb;
alter table public.properties add column if not exists documentation     jsonb not null default '[]'::jsonb;
alter table public.properties add column if not exists developer_name    text;
alter table public.properties add column if not exists developer_note    text;
alter table public.properties add column if not exists seo_title         text;
alter table public.properties add column if not exists seo_description   text;
alter table public.properties add column if not exists seo_keywords      jsonb;
alter table public.properties add column if not exists created_at        timestamptz not null default now();
alter table public.properties add column if not exists updated_at        timestamptz not null default now();

-- ---------- admin helper (needed by the developments write policy) ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.admins where user_id = auth.uid()); $$;

-- ---------- developments: create if missing ----------
create table if not exists public.developments (
  id                text primary key,
  slug              text not null unique,
  title             text not null,
  status            text not null default 'upcoming'
                    check (status in ('completed','ongoing','upcoming')),
  location          text not null,
  short_description text not null default '',
  description       jsonb not null default '[]'::jsonb,
  developer         text,
  total_units       text,
  price_from        text,
  completion_date   text,
  progress          int2,
  main_image        jsonb not null default '{}'::jsonb,
  gallery           jsonb not null default '[]'::jsonb,
  highlights        jsonb not null default '[]'::jsonb,
  featured          boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_developments_status   on public.developments (status);
create index if not exists idx_developments_featured on public.developments (featured desc);

-- If the table already existed from an older schema, reconcile its columns.
alter table public.developments add column if not exists short_description text not null default '';
alter table public.developments add column if not exists description       jsonb not null default '[]'::jsonb;
alter table public.developments add column if not exists developer         text;
alter table public.developments add column if not exists total_units       text;
alter table public.developments add column if not exists price_from        text;
alter table public.developments add column if not exists completion_date   text;
alter table public.developments add column if not exists progress          int2;
alter table public.developments add column if not exists gallery           jsonb not null default '[]'::jsonb;
alter table public.developments add column if not exists highlights        jsonb not null default '[]'::jsonb;
alter table public.developments add column if not exists featured          boolean not null default false;
alter table public.developments add column if not exists created_at        timestamptz not null default now();
alter table public.developments add column if not exists updated_at        timestamptz not null default now();

-- ---------- developments: RLS (public read, admin write) ----------
alter table public.developments enable row level security;
drop policy if exists "developments are public" on public.developments;
create policy "developments are public"
  on public.developments for select using (true);
drop policy if exists "admins write developments" on public.developments;
create policy "admins write developments"
  on public.developments for all
  using (public.is_admin()) with check (public.is_admin());

-- Refresh PostgREST's schema cache immediately.
notify pgrst, 'reload schema';
