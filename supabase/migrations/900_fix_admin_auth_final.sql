-- ================================================================
-- ESNEW PLATFORM - KESİN ADMİN VE KULLANICI SENKRONİZASYON DÜZELTMESİ
-- ================================================================

-- 1. YENİ KULLANICI OLUŞTUĞUNDA OTOMATİK SENKRONİZASYON FONKSİYONU
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- public.users tablosuna ekle
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;

  -- public.members tablosuna ekle (Profil yönetimi için)
  -- Not: members tablosundaki sütun isimleri 001_initial_schema.sql veya diğer migration'lara göre ayarlanmalıdır.
  -- Eğer 'first_name', 'last_name' gibi alanlar varsa onları da ekleyebiliriz.
  INSERT INTO public.members (id, email, username)
  VALUES (
    NEW.id, 
    NEW.email, 
    SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTR(CAST(NEW.id AS TEXT), 1, 4)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. TRIGGER'I OLUŞTUR
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. MEVCUT ADMİN HESABINI ZORLA DÜZELT (UPSERT)
DO $$
DECLARE 
    target_id UUID;
    admin_email TEXT := 'admin@velora.com';
BEGIN
    -- Önce admin hesabının ID'sini auth.users tablosunda bul
    SELECT id INTO target_id FROM auth.users WHERE email = admin_email LIMIT 1;

    -- Eğer auth.users'ta yoksa diğer bilinen emailleri dene
    IF target_id IS NULL THEN
        SELECT id INTO target_id FROM auth.users WHERE email IN ('admin@esnew.com', 'admin@veloraescortworld.com') LIMIT 1;
        IF target_id IS NOT NULL THEN
            -- Email'i ana admin emailine güncelle
            UPDATE auth.users SET email = admin_email WHERE id = target_id;
        END IF;
    END IF;

    -- Eğer ID bulunduysa public tablolarını UPSERT ile güncelle/doldur
    IF target_id IS NOT NULL THEN
        -- public.users (Yetki kontrolü buradadır)
        INSERT INTO public.users (id, email, role)
        VALUES (target_id, admin_email, 'admin')
        ON CONFLICT (id) DO UPDATE 
        SET email = EXCLUDED.email, role = 'admin';

        -- public.members (Profil bilgileri)
        INSERT INTO public.members (id, email, username, first_name, last_name)
        VALUES (target_id, admin_email, 'admin', 'Admin', 'Panel')
        ON CONFLICT (id) DO UPDATE 
        SET 
            email = EXCLUDED.email,
            username = EXCLUDED.username,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name;
            
        -- members tablosunda 'user_type' kolonu varsa onu da güncelle
        BEGIN
            UPDATE public.members SET user_type = 'admin' WHERE id = target_id;
        EXCEPTION WHEN OTHERS THEN
            NULL; -- Kolon yoksa hata alma
        END;
    END IF;
END $$;
