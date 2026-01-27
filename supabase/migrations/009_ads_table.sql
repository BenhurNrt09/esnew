-- Create ads table
create table if not exists public.ads (
    id uuid default gen_random_uuid() primary key,
    image_url text not null,
    link text,
    position text check (position in ('left', 'right')),  -- 'left' or 'right'
    "order" integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
DO $$ 
BEGIN
    alter table public.ads enable row level security;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'RLS already enabled or table missing on ads: %', SQLERRM;
END $$;

-- Policy to allow read access for everyone
drop policy if exists "Allow public read access" on public.ads;
create policy "Allow public read access" on public.ads
    for select using (true);

-- Policy to allow full access for authenticated users
drop policy if exists "Allow authenticated insert" on public.ads;
create policy "Allow authenticated insert" on public.ads
    for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update" on public.ads;
create policy "Allow authenticated update" on public.ads
    for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete" on public.ads;
create policy "Allow authenticated delete" on public.ads
    for delete using (auth.role() = 'authenticated');

-- Storage bucket for ads
insert into storage.buckets (id, name, public) 
values ('ads', 'ads', true)
on conflict (id) do nothing;

-- Storage policies
drop policy if exists "Ads Images Public Access" on storage.objects;
create policy "Ads Images Public Access"
on storage.objects for select
using ( bucket_id = 'ads' );

drop policy if exists "Ads Images Upload Access" on storage.objects;
create policy "Ads Images Upload Access"
on storage.objects for insert
with check ( bucket_id = 'ads' and auth.role() = 'authenticated' );

drop policy if exists "Ads Images Update Access" on storage.objects;
create policy "Ads Images Update Access"
on storage.objects for update
using ( bucket_id = 'ads' and auth.role() = 'authenticated' );

drop policy if exists "Ads Images Delete Access" on storage.objects;
create policy "Ads Images Delete Access"
on storage.objects for delete
using ( bucket_id = 'ads' and auth.role() = 'authenticated' );
