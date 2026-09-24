-- ============================================================
-- Abundance Abodes — RLS activation
--
-- Your tables already exist, but Row Level Security currently has no
-- permissive policies, so:
--   • the public consultation form cannot save enquiries (401/42501)
--   • the admin dashboard cannot create/edit properties
--
-- Run this whole file in: Supabase Dashboard → SQL Editor → New query.
-- It is safe to re-run (idempotent).
--
-- AFTER running it, create your admin login:
--   1. Dashboard → Authentication → Users → "Add user"
--      (email + password, auto-confirm)
--   2. Run: insert into public.admins (user_id)
--          select id from auth.users where email = 'you@example.com';
-- ============================================================

-- Admin users table (maps Supabase auth users to admin rights)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Helper used by policies below
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

alter table public.properties   enable row level security;
alter table public.enquiries    enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs         enable row level security;
alter table public.insights     enable row level security;
alter table public.site_content enable row level security;

-- ---------- Properties: public read, admin write ----------
drop policy if exists "properties are public" on public.properties;
create policy "properties are public"
  on public.properties for select using (true);
drop policy if exists "admins write properties" on public.properties;
create policy "admins write properties"
  on public.properties for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Enquiries: anyone may submit; only admins read/update ----------
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

-- ---------- Testimonials / FAQs / Insights: public read of published rows, admin writes ----------
drop policy if exists "testimonials published" on public.testimonials;
create policy "testimonials published"
  on public.testimonials for select using (published or public.is_admin());
drop policy if exists "testimonials admin write" on public.testimonials;
create policy "testimonials admin write"
  on public.testimonials for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "faqs published" on public.faqs;
create policy "faqs published"
  on public.faqs for select using (published or public.is_admin());
drop policy if exists "faqs admin write" on public.faqs;
create policy "faqs admin write"
  on public.faqs for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "insights published" on public.insights;
create policy "insights published"
  on public.insights for select using (published or public.is_admin());
drop policy if exists "insights admin write" on public.insights;
create policy "insights admin write"
  on public.insights for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Site content: public read, admin write ----------
drop policy if exists "site content is public" on public.site_content;
create policy "site content is public"
  on public.site_content for select using (true);
drop policy if exists "admins write site content" on public.site_content;
create policy "admins write site content"
  on public.site_content for all
  using (public.is_admin()) with check (public.is_admin());
