-- Comprehensive Seed Data

-- 1. Cities (Major Turkish Cities)
INSERT INTO cities (name, slug, is_active, seo_title, seo_description) VALUES
('İstanbul', 'istanbul', true, 'İstanbul İlanları ve Profilleri', 'İstanbul bölgesindeki en iyi hizmet ve ilanlar.'),
('Ankara', 'ankara', true, 'Ankara İlanları ve Profilleri', 'Ankara bölgesindeki en iyi hizmet ve ilanlar.'),
('İzmir', 'izmir', true, 'İzmir İlanları ve Profilleri', 'İzmir bölgesindeki en iyi hizmet ve ilanlar.'),
('Antalya', 'antalya', true, 'Antalya İlanları ve Profilleri', 'Antalya bölgesindeki en iyi hizmet ve ilanlar.'),
('Bursa', 'bursa', true, 'Bursa İlanları ve Profilleri', 'Bursa bölgesindeki en iyi hizmet ve ilanlar.')
ON CONFLICT (slug) DO NOTHING;

-- 2. Categories (Main)
INSERT INTO categories (name, slug, description, icon, "order", is_active) VALUES
('Hizmetler', 'hizmetler', 'Tamirat, tadilat, nakliye vb.', 'tool', 1, true),
('Emlak', 'emlak', 'Satılık, kiralık daireler', 'home', 2, true),
('Vasıta', 'vasita', 'Otomobil, motosiklet', 'car', 3, true),
('Elektronik', 'elektronik', 'Telefon, bilgisayar', 'smartphone', 4, true),
('Özel Ders', 'ozel-ders', 'Matematik, İngilizce vb.', 'book', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. Subcategories (Hizmetler -> ...)
DO $$
DECLARE
    hizmetler_id UUID;
    emlak_id UUID;
    vasita_id UUID;
BEGIN
    SELECT id INTO hizmetler_id FROM categories WHERE slug = 'hizmetler';
    SELECT id INTO emlak_id FROM categories WHERE slug = 'emlak';
    SELECT id INTO vasita_id FROM categories WHERE slug = 'vasita';

    INSERT INTO categories (name, slug, parent_id, "order", is_active) VALUES
    ('Ev Temizliği', 'ev-temizligi', hizmetler_id, 1, true),
    ('Nakliye', 'nakliye', hizmetler_id, 2, true),
    ('Boyacı', 'boyaci', hizmetler_id, 3, true),
    ('Satılık Daire', 'satilik-daire', emlak_id, 1, true),
    ('Kiralık Daire', 'kiralik-daire', emlak_id, 2, true),
    ('Otomobil', 'otomobil', vasita_id, 1, true)
    ON CONFLICT (slug) DO NOTHING;
END $$;

-- 4. Sample Listings (Various)
DO $$
DECLARE
    istanbul_id UUID;
    ankara_id UUID;
    izmir_id UUID;
    temizlik_id UUID;
    nakliye_id UUID;
    satilik_id UUID;
BEGIN
    SELECT id INTO istanbul_id FROM cities WHERE slug = 'istanbul';
    SELECT id INTO ankara_id FROM cities WHERE slug = 'ankara';
    SELECT id INTO izmir_id FROM cities WHERE slug = 'izmir';
    
    SELECT id INTO temizlik_id FROM categories WHERE slug = 'ev-temizligi';
    SELECT id INTO nakliye_id FROM categories WHERE slug = 'nakliye';
    SELECT id INTO satilik_id FROM categories WHERE slug = 'satilik-daire';

    IF istanbul_id IS NOT NULL AND temizlik_id IS NOT NULL THEN
        INSERT INTO listings (title, slug, description, price, city_id, category_id, is_active, is_featured, created_at) VALUES
        ('Profesyonel Ev Temizliği', 'profesyonel-ev-temizligi-3df2', 'Deneyimli ekiplerimizle evinizi pırıl pırıl yapıyoruz. Malzemeler dahildir.', 1500, istanbul_id, temizlik_id, true, true, NOW()),
        ('Günlük Ev Temizliği', 'gunluk-ev-temizligi-a1b2', 'Yarım gün veya tam gün temizlik hizmeti.', 1200, istanbul_id, temizlik_id, true, false, NOW() - INTERVAL '1 day'),
        ('Detaylı Ofis Temizliği', 'detayli-ofis-temizligi-xyz', 'Ofisleriniz için kurumsal temizlik çözümleri.', 2500, ankara_id, temizlik_id, true, true, NOW() - INTERVAL '2 days');
    END IF;

    IF izmir_id IS NOT NULL AND nakliye_id IS NOT NULL THEN
        INSERT INTO listings (title, slug, description, price, city_id, category_id, is_active, created_at) VALUES
        ('Şehir İçi Nakliye', 'sehir-ici-nakliye-izmir', 'Asansörlü, sigortalı taşımacılık.', 5000, izmir_id, nakliye_id, true, NOW() - INTERVAL '3 days');
    END IF;

     IF istanbul_id IS NOT NULL AND satilik_id IS NOT NULL THEN
        INSERT INTO listings (title, slug, description, price, city_id, category_id, is_active, is_featured, created_at) VALUES
        ('Kadıköyde 3+1 Lüks Daire', 'kadikoyde-3-1-luks-daire', 'Merkezi konumda, metroya yakın, sıfır bina.', 5500000, istanbul_id, satilik_id, true, true, NOW() - INTERVAL '5 days');
    END IF;
END $$;
