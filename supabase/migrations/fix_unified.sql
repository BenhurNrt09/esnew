-- ================================================================
-- ESNEW PLATFORM - KESİN VE SORUNSUZ DÜZELTME (ZERO PROBLEM SQL)
-- Tüm yetki, kimlik ve tablo sorunlarını tek seferde çözer.
-- ================================================================

-- 1. ADMİN YETKİLERİNİ VE BİLGİLERİNİ GÜNCELLE
-- Not: Enum hatası almamak için members tablosundaki 'user_type' alanına dokunmuyoruz.
-- Yetki kontrolü zaten 'users' tablosundaki 'role' alanı üzerinden yapılır.
DO $$
DECLARE 
    target_id UUID;
BEGIN
    -- Önce admin hesabının ID'sini bul
    SELECT id INTO target_id FROM auth.users WHERE email IN ('admin@esnew.com', 'admin@velora.com', 'admin@veloraescortworld.com') LIMIT 1;

    IF target_id IS NOT NULL THEN
        -- auth.users tablosu güncelleme (Supabase İçin)
        UPDATE auth.users SET email = 'admin@velora.com' WHERE id = target_id;

        -- public.users tablosu (Yetki kontrolü buradadır)
        UPDATE public.users 
        SET 
            email = 'admin@velora.com',
            role = 'admin' -- Bu alan TEXT'tir, enum hatası vermez
        WHERE id = target_id;

        -- public.members tablosu (Profil ismi burada gözükür)
        UPDATE public.members 
        SET 
            email = 'admin@velora.com',
            first_name = 'Admin',
            last_name = 'Panel',
            username = 'admin'
        WHERE id = target_id;
    END IF;
END $$;


-- 2. FEATURED_LISTINGS (VİTRİN) TABLOSU
CREATE TABLE IF NOT EXISTS public.featured_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    featured_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(listing_id)
);

-- RLS Aktifleştir
ALTER TABLE public.featured_listings ENABLE ROW LEVEL SECURITY;

-- Vitrin İzinleri
DROP POLICY IF EXISTS "Allow authenticated users to read featured listings" ON featured_listings;
CREATE POLICY "Allow authenticated users to read featured listings"
ON featured_listings FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage featured listings" ON featured_listings;
CREATE POLICY "Allow authenticated users to manage featured listings"
ON featured_listings FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- 3. KATEGORİ YÖNETİM İZİNLERİ (RLS)
-- Adminlerin kategori düzenleyebilmesi için
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
ON categories FOR ALL 
TO authenticated
USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));


-- 4. KONTROL - Bu sorguların sonucu paneldeki durumu gösterir
SELECT 'users_tablosu' as tablo, id, email, role FROM public.users WHERE role = 'admin';
SELECT 'members_tablosu' as tablo, id, email, username, first_name FROM public.members WHERE username = 'admin';
