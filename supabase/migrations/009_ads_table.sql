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
alter table public.ads enable row level security;

-- Policy to allow read access for everyone
create policy "Allow public read access" on public.ads
    for select using (true);

-- Policy to allow full access for authenticated users (admin logic to be refined later if needed, assuming auth users are admins now or will be handled by middleware)
-- Ideally only admins should write, but for now allow authenticated to write (admin panel uses authenticated user)
create policy "Allow authenticated insert" on public.ads
    for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated update" on public.ads
    for update using (auth.role() = 'authenticated');

create policy "Allow authenticated delete" on public.ads
    for delete using (auth.role() = 'authenticated');

-- Storage bucket for ads
insert into storage.buckets (id, name, public) 
values ('ads', 'ads', true)
on conflict (id) do nothing;

create policy "Ads Images Public Access"
on storage.objects for select
using ( bucket_id = 'ads' );

create policy "Ads Images Upload Access"
on storage.objects for insert
with check ( bucket_id = 'ads' and auth.role() = 'authenticated' );

create policy "Ads Images Update Access"
on storage.objects for update
using ( bucket_id = 'ads' and auth.role() = 'authenticated' );

create policy "Ads Images Delete Access"
on storage.objects for delete
using ( bucket_id = 'ads' and auth.role() = 'authenticated' );
