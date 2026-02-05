-- ================================================================
-- ADMIN ROL DÜZELTMESİ (GÜNCELLENMİŞ)
-- SADECE Admin hesabını düzeltir, diğer tablolara dokunmaz
-- ================================================================

-- Önce mevcut kullanıcıları görüntüleyin
SELECT id, email, username, first_name, user_type FROM members ORDER BY created_at;

-- ================================================================
-- ADIM 1: Admin Email Güncelleme ve Yetki Verme
-- ================================================================

UPDATE members 
SET 
    user_type = 'admin', -- 'role' sütunu 'user_type' olarak düzeltildi
    first_name = 'Admin', 
    username = 'admin'
WHERE email = 'admin@velora.com' OR email = 'admin@esnew.com';

-- ================================================================
-- KONTROL
-- ================================================================
SELECT id, email, username, first_name, user_type FROM members;
