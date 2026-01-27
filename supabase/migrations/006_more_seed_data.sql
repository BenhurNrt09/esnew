-- ESNew Profil Platformu Seed Data
-- Türkiye İller, Önemli İlçeler ve Profil Kategorileri

-- 1. İLLER (81 İl)
INSERT INTO cities (name, slug, is_active, seo_title, seo_description) VALUES
('Adana', 'adana', true, 'Adana Profilleri', 'Adana bölgesindeki profiller'),
('Adıyaman', 'adiyaman', true, 'Adıyaman Profilleri', 'Adıyaman bölgesindeki profiller'),
('Afyonkarahisar', 'afyonkarahisar', true, 'Afyonkarahisar Profilleri', 'Afyonkarahisar bölgesindeki profiller'),
('Ağrı', 'agri', true, 'Ağrı Profilleri', 'Ağrı bölgesindeki profiller'),
('Amasya', 'amasya', true, 'Amasya Profilleri', 'Amasya bölgesindeki profiller'),
('Ankara', 'ankara', true, 'Ankara Profilleri', 'Ankara bölgesindeki profiller'),
('Antalya', 'antalya', true, 'Antalya Profilleri', 'Antalya bölgesindeki profiller'),
('Artvin', 'artvin', true, 'Artvin Profilleri', 'Artvin bölgesindeki profiller'),
('Aydın', 'aydin', true, 'Aydın Profilleri', 'Aydın bölgesindeki profiller'),
('Balıkesir', 'balikesir', true, 'Balıkesir Profilleri', 'Balıkesir bölgesindeki profiller'),
('Bilecik', 'bilecik', true, 'Bilecik Profilleri', 'Bilecik bölgesindeki profiller'),
('Bingöl', 'bingol', true, 'Bingöl Profilleri', 'Bingöl bölgesindeki profiller'),
('Bitlis', 'bitlis', true, 'Bitlis Profilleri', 'Bitlis bölgesindeki profiller'),
('Bolu', 'bolu', true, 'Bolu Profilleri', 'Bolu bölgesindeki profiller'),
('Burdur', 'burdur', true, 'Burdur Profilleri', 'Burdur bölgesindeki profiller'),
('Bursa', 'bursa', true, 'Bursa Profilleri', 'Bursa bölgesindeki profiller'),
('Çanakkale', 'canakkale', true, 'Çanakkale Profilleri', 'Çanakkale bölgesindeki profiller'),
('Çankırı', 'cankiri', true, 'Çankırı Profilleri', 'Çankırı bölgesindeki profiller'),
('Çorum', 'corum', true, 'Çorum Profilleri', 'Çorum bölgesindeki profiller'),
('Denizli', 'denizli', true, 'Denizli Profilleri', 'Denizli bölgesindeki profiller'),
('Diyarbakır', 'diyarbakir', true, 'Diyarbakır Profilleri', 'Diyarbakır bölgesindeki profiller'),
('Edirne', 'edirne', true, 'Edirne Profilleri', 'Edirne bölgesindeki profiller'),
('Elazığ', 'elazig', true, 'Elazığ Profilleri', 'Elazığ bölgesindeki profiller'),
('Erzincan', 'erzincan', true, 'Erzincan Profilleri', 'Erzincan bölgesindeki profiller'),
('Erzurum', 'erzurum', true, 'Erzurum Profilleri', 'Erzurum bölgesindeki profiller'),
('Eskişehir', 'eskisehir', true, 'Eskişehir Profilleri', 'Eskişehir bölgesindeki profiller'),
('Gaziantep', 'gaziantep', true, 'Gaziantep Profilleri', 'Gaziantep bölgesindeki profiller'),
('Giresun', 'giresun', true, 'Giresun Profilleri', 'Giresun bölgesindeki profiller'),
('Gümüşhane', 'gumushane', true, 'Gümüşhane Profilleri', 'Gümüşhane bölgesindeki profiller'),
('Hakkari', 'hakkari', true, 'Hakkari Profilleri', 'Hakkari bölgesindeki profiller'),
('Hatay', 'hatay', true, 'Hatay Profilleri', 'Hatay bölgesindeki profiller'),
('Isparta', 'isparta', true, 'Isparta Profilleri', 'Isparta bölgesindeki profiller'),
('Mersin', 'mersin', true, 'Mersin Profilleri', 'Mersin bölgesindeki profiller'),
('İstanbul', 'istanbul', true, 'İstanbul Profilleri', 'İstanbul bölgesindeki profiller'),
('İzmir', 'izmir', true, 'İzmir Profilleri', 'İzmir bölgesindeki profiller'),
('Kars', 'kars', true, 'Kars Profilleri', 'Kars bölgesindeki profiller'),
('Kastamonu', 'kastamonu', true, 'Kastamonu Profilleri', 'Kastamonu bölgesindeki profiller'),
('Kayseri', 'kayseri', true, 'Kayseri Profilleri', 'Kayseri bölgesindeki profiller'),
('Kırklareli', 'kirklareli', true, 'Kırklareli Profilleri', 'Kırklareli bölgesindeki profiller'),
('Kırşehir', 'kirsehir', true, 'Kırşehir Profilleri', 'Kırşehir bölgesindeki profiller'),
('Kocaeli', 'kocaeli', true, 'Kocaeli Profilleri', 'Kocaeli bölgesindeki profiller'),
('Konya', 'konya', true, 'Konya Profilleri', 'Konya bölgesindeki profiller'),
('Kütahya', 'kutahya', true, 'Kütahya Profilleri', 'Kütahya bölgesindeki profiller'),
('Malatya', 'malatya', true, 'Malatya Profilleri', 'Malatya bölgesindeki profiller'),
('Manisa', 'manisa', true, 'Manisa Profilleri', 'Manisa bölgesindeki profiller'),
('Kahramanmaraş', 'kahramanmaras', true, 'Kahramanmaraş Profilleri', 'Kahramanmaraş bölgesindeki profiller'),
('Mardin', 'mardin', true, 'Mardin Profilleri', 'Mardin bölgesindeki profiller'),
('Muğla', 'mugla', true, 'Muğla Profilleri', 'Muğla bölgesindeki profiller'),
('Muş', 'mus', true, 'Muş Profilleri', 'Muş bölgesindeki profiller'),
('Nevşehir', 'nevsehir', true, 'Nevşehir Profilleri', 'Nevşehir bölgesindeki profiller'),
('Niğde', 'nigde', true, 'Niğde Profilleri', 'Niğde bölgesindeki profiller'),
('Ordu', 'ordu', true, 'Ordu Profilleri', 'Ordu bölgesindeki profiller'),
('Rize', 'rize', true, 'Rize Profilleri', 'Rize bölgesindeki profiller'),
('Sakarya', 'sakarya', true, 'Sakarya Profilleri', 'Sakarya bölgesindeki profiller'),
('Samsun', 'samsun', true, 'Samsun Profilleri', 'Samsun bölgesindeki profiller'),
('Siirt', 'siirt', true, 'Siirt Profilleri', 'Siirt bölgesindeki profiller'),
('Sinop', 'sinop', true, 'Sinop Profilleri', 'Sinop bölgesindeki profiller'),
('Sivas', 'sivas', true, 'Sivas Profilleri', 'Sivas bölgesindeki profiller'),
('Tekirdağ', 'tekirdag', true, 'Tekirdağ Profilleri', 'Tekirdağ bölgesindeki profiller'),
('Tokat', 'tokat', true, 'Tokat Profilleri', 'Tokat bölgesindeki profiller'),
('Trabzon', 'trabzon', true, 'Trabzon Profilleri', 'Trabzon bölgesindeki profiller'),
('Tunceli', 'tunceli', true, 'Tunceli Profilleri', 'Tunceli bölgesindeki profiller'),
('Şanlıurfa', 'sanliurfa', true, 'Şanlıurfa Profilleri', 'Şanlıurfa bölgesindeki profiller'),
('Uşak', 'usak', true, 'Uşak Profilleri', 'Uşak bölgesindeki profiller'),
('Van', 'van', true, 'Van Profilleri', 'Van bölgesindeki profiller'),
('Yozgat', 'yozgat', true, 'Yozgat Profilleri', 'Yozgat bölgesindeki profiller'),
('Zonguldak', 'zonguldak', true, 'Zonguldak Profilleri', 'Zonguldak bölgesindeki profiller'),
('Aksaray', 'aksaray', true, 'Aksaray Profilleri', 'Aksaray bölgesindeki profiller'),
('Bayburt', 'bayburt', true, 'Bayburt Profilleri', 'Bayburt bölgesindeki profiller'),
('Karaman', 'karaman', true, 'Karaman Profilleri', 'Karaman bölgesindeki profiller'),
('Kırıkkale', 'kirikkale', true, 'Kırıkkale Profilleri', 'Kırıkkale bölgesindeki profiller'),
('Batman', 'batman', true, 'Batman Profilleri', 'Batman bölgesindeki profiller'),
('Şırnak', 'sirnak', true, 'Şırnak Profilleri', 'Şırnak bölgesindeki profiller'),
('Bartın', 'bartin', true, 'Bartın Profilleri', 'Bartın bölgesindeki profiller'),
('Ardahan', 'ardahan', true, 'Ardahan Profilleri', 'Ardahan bölgesindeki profiller'),
('Iğdır', 'igdir', true, 'Iğdır Profilleri', 'Iğdır bölgesindeki profiller'),
('Yalova', 'yalova', true, 'Yalova Profilleri', 'Yalova bölgesindeki profiller'),
('Karabük', 'karabuk', true, 'Karabük Profilleri', 'Karabük bölgesindeki profiller'),
('Kilis', 'kilis', true, 'Kilis Profilleri', 'Kilis bölgesindeki profiller'),
('Osmaniye', 'osmaniye', true, 'Osmaniye Profilleri', 'Osmaniye bölgesindeki profiller'),
('Düzce', 'duzce', true, 'Düzce Profilleri', 'Düzce bölgesindeki profiller')
ON CONFLICT (slug) DO NOTHING;


-- 2. KATEGORİLER (Profil Özellikleri)
-- Ana Kategoriler: Saç Rengi, Vücut Tipi, Irk, Yaş Grubu, Göz Rengi
INSERT INTO categories (name, slug, description, icon, "order", is_active) VALUES
('Saç Rengi', 'sac-rengi', 'Saç rengi seçenekleri', 'palette', 1, true),
('Vücut Tipi', 'vucut-tipi', 'Vücut tipi ve kilo seçenekleri', 'user', 2, true),
('Irk / Köken', 'irk', 'Etnik köken seçenekleri', 'globe', 3, true),
('Yaş Grubu', 'yas-grubu', 'Yaş aralıkları', 'calendar', 4, true),
('Hizmetler', 'hizmetler', 'Sunulan hizmet türleri', 'star', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 3. ALT KATEGORİLER
DO $$
DECLARE
    sac_id UUID;
    vucut_id UUID;
    irk_id UUID;
    yas_id UUID;
BEGIN
    SELECT id INTO sac_id FROM categories WHERE slug = 'sac-rengi';
    SELECT id INTO vucut_id FROM categories WHERE slug = 'vucut-tipi';
    SELECT id INTO irk_id FROM categories WHERE slug = 'irk';
    SELECT id INTO yas_id FROM categories WHERE slug = 'yas-grubu';

    INSERT INTO categories (name, slug, parent_id, "order", is_active) VALUES
    -- Saç Renkleri
    ('Sarışın', 'sarisin', sac_id, 1, true),
    ('Esmer', 'esmer', sac_id, 2, true),
    ('Siyah Saçlı', 'siyah-sacli', sac_id, 3, true),
    ('Kumral', 'kumral', sac_id, 4, true),
    ('Kızıl', 'kizil', sac_id, 5, true),
    
    -- Vücut / Kilo
    ('Zayıf', 'zayif', vucut_id, 1, true),
    ('Balık Etli', 'balik-etli', vucut_id, 2, true),
    ('Dolgun', 'dolgun', vucut_id, 3, true),
    ('Sporcu', 'sporcu', vucut_id, 4, true),
    ('Minyon', 'minyon', vucut_id, 5, true),
    ('Uzun Boylu', 'uzun-boylu', vucut_id, 6, true),

    -- Irk
    ('Türk', 'turk', irk_id, 1, true),
    ('Rus', 'rus', irk_id, 2, true),
    ('Ukraynalı', 'ukraynali', irk_id, 3, true),
    ('Latin', 'latin', irk_id, 4, true),
    ('Asyalı', 'asyali', irk_id, 5, true),
    ('Siyahi', 'siyahi', irk_id, 6, true),

    -- Yaş Grupları
    ('18-20 Yaş', '18-20', yas_id, 1, true),
    ('21-24 Yaş', '21-24', yas_id, 2, true),
    ('25-30 Yaş', '25-30', yas_id, 3, true),
    ('30+ Yaş', '30-plus', yas_id, 4, true)
    ON CONFLICT (slug) DO NOTHING;
END $$;

-- 4. ÖRNEK İLANLAR
DO $$
DECLARE
    istanbul_id UUID;
    ankara_id UUID;
    izmir_id UUID;
    sarisin_id UUID;
    esmer_id UUID;
    rus_id UUID;
BEGIN
    SELECT id INTO istanbul_id FROM cities WHERE slug = 'istanbul';
    SELECT id INTO ankara_id FROM cities WHERE slug = 'ankara';
    SELECT id INTO izmir_id FROM cities WHERE slug = 'izmir';
    
    SELECT id INTO sarisin_id FROM categories WHERE slug = 'sarisin';
    SELECT id INTO esmer_id FROM categories WHERE slug = 'esmer';
    SELECT id INTO rus_id FROM categories WHERE slug = 'rus';

    IF istanbul_id IS NOT NULL AND sarisin_id IS NOT NULL THEN
        INSERT INTO listings (title, slug, description, price, city_id, category_id, is_active, is_featured, created_at) VALUES
        ('İstanbul Şişli Sarışın Model', 'istanbul-sisli-sarisin-model', 'Merhaba ben Aslı, 22 yaşında sarışın, 1.70 boyunda bakımlı biriyim. Detaylar için arayın.', 5000, istanbul_id, sarisin_id, true, true, NOW())
        ON CONFLICT (slug) DO NOTHING;
    END IF;

    IF ankara_id IS NOT NULL AND esmer_id IS NOT NULL THEN
        INSERT INTO listings (title, slug, description, price, city_id, category_id, is_active, is_featured, created_at) VALUES
        ('Ankara Kızılay Esmer Güzeli', 'ankara-kizilay-esmer', 'Adım Leyla, 25 yaşındayım. Esmer, dolgun vücut hatlarına sahibim.', 4000, ankara_id, esmer_id, true, true, NOW() - INTERVAL '1 day')
        ON CONFLICT (slug) DO NOTHING;
    END IF;

    IF izmir_id IS NOT NULL AND rus_id IS NOT NULL THEN
        INSERT INTO listings (title, slug, description, price, city_id, category_id, is_active, created_at) VALUES
        ('İzmir Alsancak Rus Model', 'izmir-alsancak-rus', 'Merhaba, ben Natasha. 21 yaşında, mavi gözlü Rus asıllıyım.', 6000, izmir_id, rus_id, true, NOW() - INTERVAL '2 days')
        ON CONFLICT (slug) DO NOTHING;
    END IF;
END $$;
