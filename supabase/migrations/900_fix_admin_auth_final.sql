-- ================================================================
-- ESNEW PLATFORM - KESİN ADMİN YETKİ DÜZELTMESİ (VOL 2)
-- ================================================================

-- 1. ADMİNİ PUBLIC.USERS TABLOSUNA 'admin' ROLÜYLE KAYDET
-- Not: requireAdmin() fonksiyonu bu tabloya bakar.
DO $$
DECLARE 
    target_id UUID;
    admin_email TEXT := 'admin@velora.com';
BEGIN
    -- Auth tablosundan ID'yi al
    SELECT id INTO target_id FROM auth.users WHERE email = admin_email LIMIT 1;

    IF target_id IS NOT NULL THEN
        -- public.users tablosu (GİRİŞ YETKİSİ BURADADIR)
        INSERT INTO public.users (id, email, role)
        VALUES (target_id, admin_email, 'admin')
        ON CONFLICT (id) DO UPDATE 
        SET role = 'admin';

        RAISE NOTICE 'Admin yetkisi public.users tablosunda guncellendi: %', admin_email;
    ELSE
        RAISE WARNING 'Hata: % e-postali kullanici auth.users tablosunda bulunamadi!', admin_email;
    END IF;
END $$;

-- 2. KONTROL SORGUSU
-- Bu sorgu 'admin' donuyorsa giris yapabilmeniz gerekir.
SELECT email, role FROM public.users WHERE role = 'admin';
