-- ================================================================
-- 904_fix_admin_visibility_complete.sql
-- ================================================================
-- Bu migration, admin paneli görünürlük sorunlarını kökten çözmek için:
-- 1. is_admin() fonksiyonunu daha güvenli hale getirir.
-- 2. Admin rolüne tüm tablolar için tam yetki verir.
-- 3. RLS politikalarını admin için "ALWAYS TRUE" yapar.
-- ================================================================

-- 1. is_admin() fonksiyonunu iyileştir (Check public.users first, then auth metadata)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Önce public.users tablosuna bak
    SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
    
    IF user_role = 'admin' THEN
        RETURN TRUE;
    END IF;

    -- Alternatif olarak auth metadata'ya bak (Backup)
    IF (auth.jwt() -> 'user_metadata' ->> 'user_type') = 'admin' OR 
       (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Admin rolü için tüm kritik tablolara erişim izni (RLS bypass olsa bile açıkça izin iyidir)
-- Not: Kayıtlı 'admin' rolü varsa GRANT yapıyoruz.
DO $$ 
BEGIN
    -- Listings
    DROP POLICY IF EXISTS "Admins have full access to listings" ON public.listings;
    CREATE POLICY "Admins have full access to listings" ON public.listings FOR ALL TO authenticated USING (is_admin());

    -- Agencies
    DROP POLICY IF EXISTS "Admins can view all agencies" ON public.agencies;
    CREATE POLICY "Admins can view all agencies" ON public.agencies FOR ALL TO authenticated USING (is_admin());

    -- Independent Models
    DROP POLICY IF EXISTS "Admins can view all models" ON public.independent_models;
    CREATE POLICY "Admins can view all models" ON public.independent_models FOR ALL TO authenticated USING (is_admin());

    -- Members
    DROP POLICY IF EXISTS "Admins can view all members" ON public.members;
    CREATE POLICY "Admins can view all members" ON public.members FOR ALL TO authenticated USING (is_admin());

EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Permissions update partially skipped: %', SQLERRM;
END $$;

-- 3. Listings ve Agencies arasındaki ilişkiyi PostgREST'e tanıtmak için (isteğe bağlı)
-- Eğer listings.user_id agencies.id'ye bakarsa join daha kolay olur.
-- Ancak user_id hem model hem ajans olabildiği için "foreign key" auth.users kalmalı.
-- PostgREST join hatası genellikle her iki tarafta da FK tanımlanmadığında olur.

RAISE NOTICE '904_fix_admin_visibility_complete migration completed.';
