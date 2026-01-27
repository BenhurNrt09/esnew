-- Rename 'ads' table to 'banners' to avoid AdBlocker interference
-- This migration renames the table and updates all RLS policies.

-- 1. Rename the table
alter table if exists public.ads rename to banners;

-- 2. Update RLS policies for the new table name
alter table public.banners enable row level security;

drop policy if exists "Allow public read access" on public.banners;
create policy "Allow public read access" on public.banners
    for select using (true);

drop policy if exists "Allow authenticated insert" on public.banners;
create policy "Allow authenticated insert" on public.banners
    for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update" on public.banners;
create policy "Allow authenticated update" on public.banners
    for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete" on public.banners;
create policy "Allow authenticated delete" on public.banners
    for delete using (auth.role() = 'authenticated');
