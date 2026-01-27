import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    // SCHEMA REPAIR + BUCKET FIX SQL
    const sqlCommand = `
-- ==========================================
-- 1. FIX SCHEMA: Add Missing 'user_id'
-- ==========================================
-- This fixes "column user_id does not exist" error
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'user_id') THEN
        ALTER TABLE public.listings ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;


-- ==========================================
-- 2. SETUP 'BANNERS' BUCKET (Anti-AdBlock)
-- ==========================================
-- Creates public bucket 'banners' safe from adblockers
insert into storage.buckets (id, name, public) 
values ('banners', 'banners', true)
on conflict (id) do update set public = true;

-- Policies for Banners
drop policy if exists "Banners Public Access" on storage.objects;
create policy "Banners Public Access" on storage.objects for select using ( bucket_id = 'banners' );

drop policy if exists "Banners Upload Access" on storage.objects;
create policy "Banners Upload Access" on storage.objects for insert with check ( bucket_id = 'banners' );

drop policy if exists "Banners Update Access" on storage.objects;
create policy "Banners Update Access" on storage.objects for update using ( bucket_id = 'banners' );


-- ==========================================
-- 3. FIX POLICIES (Listings & Ads)
-- ==========================================

-- Listings
alter table public.listings enable row level security;

drop policy if exists "Users can insert own listings" on public.listings;
create policy "Users can insert own listings" on public.listings for insert with check (auth.uid() = user_id);

drop policy if exists "Public read listings" on public.listings;
create policy "Public read listings" on public.listings for select using (true);


-- Ads (Table)
create table if not exists public.ads (
    id uuid default gen_random_uuid() primary key,
    image_url text not null,
    link text,
    position text check (position in ('left', 'right')),
    "order" integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.ads enable row level security;
drop policy if exists "Ads Admin Full" on public.ads;
create policy "Ads Admin Full" on public.ads for all using (true) with check (true);
drop policy if exists "Ads Public Read" on public.ads;
create policy "Ads Public Read" on public.ads for select using (true);


-- ==========================================
-- 4. FIX CATEGORIES & CITIES ACCESS
-- ==========================================
alter table public.categories enable row level security;
alter table public.cities enable row level security;

drop policy if exists "Categories Full Access" on public.categories;
create policy "Categories Full Access" on public.categories for all using (true) with check (true);

drop policy if exists "Cities Full Access" on public.cities;
create policy "Cities Full Access" on public.cities for all using (true) with check (true);

-- RELOAD
NOTIFY pgrst, 'reload config';
    `.trim();

    try {
        return new NextResponse(`
            <html>
                <body style="font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.5; background-color: #f9fafb;">
                    <div style="background: white; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <h1 style="color: #ea580c; margin-top: 0;">🛠️ Veritabanı Onarım Paketi</h1>
                        
                        <div style="background: #fff7ed; color: #9a3412; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
                            <strong>Tespit Edilen Kritik Eksik:</strong>
                            <p style="margin: 8px 0;">Veritabanınızda <code>listings</code> tablosunda <code>user_id</code> (ilan sahibi) sütunu eksik olduğu için hata alıyordunuz.</p>
                            <p style="margin: 8px 0;">Bu kod hem o sütunu ekleyecek hem de reklam engelleyicilere takılmamak için depolama sistemini güncelleyecektir.</p>
                        </div>
                        
                        <p>Lütfen güncellenmiş SQL kodunu paneline yapıştırıp çalıştırın:</p>
                        
                        <div style="background: #111827; color: #e5e7eb; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 20px 0;">
                            <pre style="margin: 0;">${sqlCommand}</pre>
                        </div>

                        <button onclick="navigator.clipboard.writeText(\`${sqlCommand}\`).then(() => alert('Kopyalandı!'))" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500;">
                            📋 Onarım Kodunu Kopyala
                        </button>
                    </div>
                </body>
            </html>
        `, { headers: { 'content-type': 'text/html; charset=utf-8' } });

    } catch (error: any) {
        return new NextResponse(`<h1>Hata: ${error.message}</h1>`, { headers: { 'content-type': 'text/html' } });
    }
}
