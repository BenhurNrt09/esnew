-- ============================================
-- ESNew Platform - Seed Data (Optional)
-- ============================================
-- Sample data for development/testing
-- ============================================

-- ============================================
-- SAMPLE CITIES
-- ============================================

INSERT INTO cities (name, slug, is_active, seo_title, seo_description) VALUES
('İstanbul', 'istanbul', true, 'İstanbul İlanları', 'İstanbul''da en iyi hizmet ve profil ilanları'),
('Ankara', 'ankara', true, 'Ankara İlanları', 'Ankara''da en iyi hizmet ve profil ilanları'),
('İzmir', 'izmir', true, 'İzmir İlanları', 'İzmir''de en iyi hizmet ve profil ilanları'),
('Bursa', 'bursa', true, 'Bursa İlanları', 'Bursa''da en iyi hizmet ve profil ilanları'),
('Antalya', 'antalya', true, 'Antalya İlanları', 'Antalya''da en iyi hizmet ve profil ilanları'),
('Adana', 'adana', true, 'Adana İlanları', 'Adana''da en iyi hizmet ve profil ilanları'),
('Konya', 'konya', true, 'Konya İlanları', 'Konya''da en iyi hizmet ve profil ilanları'),
('Gaziantep', 'gaziantep', true, 'Gaziantep İlanları', 'Gaziantep''te en iyi hizmet ve profil ilanları');

-- ============================================
-- SAMPLE CATEGORIES
-- ============================================

-- Main categories
INSERT INTO categories (id, name, slug, parent_id, "order", seo_title, seo_description) VALUES
('11111111-1111-1111-1111-111111111111', 'Hizmetler', 'hizmetler', NULL, 1, 'Hizmet İlanları', 'Profesyonel hizmet veren kişi ve firmalar'),
('22222222-2222-2222-2222-222222222222', 'Emlak', 'emlak', NULL, 2, 'Emlak İlanları', 'Satılık ve kiralık emlak ilanları'),
('33333333-3333-3333-3333-333333333333', 'Araçlar', 'araclar', NULL, 3, 'Araç İlanları', 'Satılık ve kiralık araç ilanları'),
('44444444-4444-4444-4444-444444444444', 'İş & Kariyer', 'is-kariyer', NULL, 4, 'İş İlanları', 'İş ilanları ve kariyer fırsatları');

-- Sub-categories for Hizmetler
INSERT INTO categories (name, slug, parent_id, "order", seo_title) VALUES
('Temizlik', 'temizlik', '11111111-1111-1111-1111-111111111111', 1, 'Temizlik Hizmetleri'),
('Tadilat', 'tadilat', '11111111-1111-1111-1111-111111111111', 2, 'Tadilat Hizmetleri'),
('Özel Ders', 'ozel-ders', '11111111-1111-1111-1111-111111111111', 3, 'Özel Ders Verenler'),
('Sağlık', 'saglik', '11111111-1111-1111-1111-111111111111', 4, 'Sağlık Hizmetleri'),
('Güzellik', 'guzellik', '11111111-1111-1111-1111-111111111111', 5, 'Güzellik Hizmetleri');

-- Sub-categories for Emlak
INSERT INTO categories (name, slug, parent_id, "order", seo_title) VALUES
('Satılık Daire', 'satilik-daire', '22222222-2222-2222-2222-222222222222', 1, 'Satılık Daireler'),
('Kiralık Daire', 'kiralik-daire', '22222222-2222-2222-2222-222222222222', 2, 'Kiralık Daireler'),
('Satılık Villa', 'satilik-villa', '22222222-2222-2222-2222-222222222222', 3, 'Satılık Villalar'),
('Satılık Arsa', 'satilik-arsa', '22222222-2222-2222-2222-222222222222', 4, 'Satılık Arsalar');

-- ============================================
-- SAMPLE TAGS
-- ============================================

INSERT INTO tags (name, slug) VALUES
('Uygun Fiyat', 'uygun-fiyat'),
('Profesyonel', 'profesyonel'),
('Tecrübeli', 'tecrubeli'),
('Hızlı Teslimat', 'hizli-teslimat'),
('Güvenilir', 'guvenilir'),
('7/24', '7-24'),
('Garanti', 'garanti'),
('Önerilen', 'onerilen');

-- ============================================
-- SAMPLE FEATURES
-- ============================================

-- Features for Temizlik category
INSERT INTO features (name, slug, category_id, input_type) VALUES
('Çalışma Saatleri', 'calisma-saatleri', (SELECT id FROM categories WHERE slug = 'temizlik'), 'text'),
('Tecrübe Yılı', 'tecrube-yili', (SELECT id FROM categories WHERE slug = 'temizlik'), 'number'),
('Sigortalı', 'sigortali', (SELECT id FROM categories WHERE slug = 'temizlik'), 'boolean'),
('Araç Gereç', 'arac-gerec', (SELECT id FROM categories WHERE slug = 'temizlik'), 'boolean');

-- Features for Emlak
INSERT INTO features (name, slug, category_id, input_type, options) VALUES
('Oda Sayısı', 'oda-sayisi', (SELECT id FROM categories WHERE slug = 'satilik-daire'), 'select', '["1+1", "2+1", "3+1", "4+1", "5+1"]'::jsonb),
('Bina Yaşı', 'bina-yasi', (SELECT id FROM categories WHERE slug = 'satilik-daire'), 'number', NULL),
('Kat', 'kat', (SELECT id FROM categories WHERE slug = 'satilik-daire'), 'number', NULL),
('m² (Brüt)', 'm2-brut', (SELECT id FROM categories WHERE slug = 'satilik-daire'), 'number', NULL);

-- ============================================
-- NOTE: Admin User Setup
-- ============================================
-- To create your first admin user:
-- 1. Sign up through Supabase Auth
-- 2. Find your user ID in the auth.users table
-- 3. Run this query with your actual user ID:
--
-- INSERT INTO users (id, email, role)
-- VALUES ('your-user-id-here', 'admin@example.com', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';
--
-- Or if the user already exists in users table:
--
-- UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
-- ============================================
