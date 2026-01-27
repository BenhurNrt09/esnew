-- Rename 'ads' bucket to 'banners' to avoid AdBlocker interference
-- This migration creates a new 'banners' bucket and sets its policies.

-- 1. Create banners bucket
insert into storage.buckets (id, name, public) 
values ('banners', 'banners', true)
on conflict (id) do nothing;

-- 2. Storage policies for 'banners'
drop policy if exists "Banners Images Public Access" on storage.objects;
create policy "Banners Images Public Access"
on storage.objects for select
using ( bucket_id = 'banners' );

drop policy if exists "Banners Images Upload Access" on storage.objects;
create policy "Banners Images Upload Access"
on storage.objects for insert
with check ( bucket_id = 'banners' and auth.role() = 'authenticated' );

drop policy if exists "Banners Images Update Access" on storage.objects;
create policy "Banners Images Update Access"
on storage.objects for update
using ( bucket_id = 'banners' and auth.role() = 'authenticated' );

drop policy if exists "Banners Images Delete Access" on storage.objects;
create policy "Banners Images Delete Access"
on storage.objects for delete
using ( bucket_id = 'banners' and auth.role() = 'authenticated' );
