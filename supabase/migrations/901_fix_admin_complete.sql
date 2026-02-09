-- ================================================================
-- KAPSAMLI ADMIN YETKİ ONARIMI
-- ================================================================
-- Bu script:
-- 1. Admin kullanıcısını 'members' tablosunda admin olarak işaretler (UI için)
-- 2. Admin kullanıcısını 'users' tablosunda admin olarak işaretler (RLS/Güvenlik için)
-- ================================================================

DO $$
DECLARE 
    target_id UUID;
    admin_email TEXT := 'admin@velora.com'; -- Admin email adresiniz
BEGIN
    -- 1. Kullanıcı ID'sini bul
    SELECT id INTO target_id FROM auth.users WHERE email = admin_email;

    IF target_id IS NOT NULL THEN
        -- 2. PUBLIC.USERS tablosunu güncelle (RLS ve Auth için KRİTİK)
        INSERT INTO public.users (id, email, role)
        VALUES (target_id, admin_email, 'admin')
        ON CONFLICT (id) DO UPDATE 
        SET role = 'admin';
        
        RAISE NOTICE 'Admin yetkisi users tablosuna eklendi.';

        -- 3. MEMBERS tablosunu güncelle (Profil görünümü için)
        UPDATE public.members 
        SET 
            user_type = 'member', -- Enum kısıtlaması nedeniyle 'member' (veya varsa 'admin')
            username = 'admin',
            first_name = 'Admin'
        WHERE id = target_id;
        
        RAISE NOTICE 'Admin profili members tablosunda güncellendi.';

    ELSE
        RAISE WARNING 'Kullanıcı bulunamadı: %', admin_email;
    END IF;
END $$;
