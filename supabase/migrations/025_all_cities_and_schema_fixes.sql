-- ============================================
-- ESNew Platform - Schema Fixes & Enhancements
-- ============================================

-- 1. Ensure phone columns exist in listings
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS phone_country_code TEXT DEFAULT '+90';

-- 2. Update sexual orientation to support multi-select (using JSONB)
-- First, if it exists as TEXT, we might need to convert or just ensure it's there.
ALTER TABLE public.listings 
DROP COLUMN IF EXISTS orientation;

ALTER TABLE public.listings 
ADD COLUMN orientation JSONB DEFAULT '[]'::jsonb;

-- 3. Update Model Pricing to support Currency
ALTER TABLE public.model_pricing 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'TRY';

-- 4. Re-populate Cities table with 81 Turkish Provinces
-- First clear existing to ensure clean state (optional but safer for consistency)
-- TRUNCATE public.cities CASCADE; -- Be careful, might break existing references if not CASCADE

INSERT INTO public.cities (id, name, slug, is_active) VALUES
('adana', 'Adana', 'adana', true),
('adiyaman', 'Adıyaman', 'adiyaman', true),
('afyon', 'Afyonkarahisar', 'afyonkarahisar', true),
('agri', 'Ağrı', 'agri', true),
('amasya', 'Amasya', 'amasya', true),
('ankara', 'Ankara', 'ankara', true),
('antalya', 'Antalya', 'antalya', true),
('artvin', 'Artvin', 'artvin', true),
('aydin', 'Aydın', 'aydin', true),
('balikesir', 'Balıkesir', 'balikesir', true),
('bilecik', 'Bilecik', 'bilecik', true),
('bingol', 'Bingöl', 'bingol', true),
('bitlis', 'Bitlis', 'bitlis', true),
('bolu', 'Bolu', 'bolu', true),
('burdur', 'Burdur', 'burdur', true),
('bursa', 'Bursa', 'bursa', true),
('canakkale', 'Çanakkale', 'canakkale', true),
('cankiri', 'Çankırı', 'cankiri', true),
('corum', 'Çorum', 'corum', true),
('denizli', 'Denizli', 'denizli', true),
('diyarbakir', 'Diyarbakır', 'diyarbakir', true),
('edirne', 'Edirne', 'edirne', true),
('elazig', 'Elazığ', 'elazig', true),
('erzincan', 'Erzincan', 'erzincan', true),
('erzurum', 'Erzurum', 'erzurum', true),
('eskisehir', 'Eskişehir', 'eskisehir', true),
('gaziantep', 'Gaziantep', 'gaziantep', true),
('giresun', 'Giresun', 'giresun', true),
('gumushane', 'Gümüşhane', 'gumushane', true),
('hakkari', 'Hakkari', 'hakkari', true),
('hatay', 'Hatay', 'hatay', true),
('isparta', 'Isparta', 'isparta', true),
('mersin', 'Mersin', 'mersin', true),
('istanbul', 'İstanbul', 'istanbul', true),
('izmir', 'İzmir', 'izmir', true),
('kars', 'Kars', 'kars', true),
('kastamonu', 'Kastamonu', 'kastamonu', true),
('kayseri', 'Kayseri', 'kayseri', true),
('kirklareli', 'Kırklareli', 'kirklareli', true),
('kirsehir', 'Kırşehir', 'kirsehir', true),
('kocaeli', 'Kocaeli', 'kocaeli', true),
('konya', 'Konya', 'konya', true),
('kutahya', 'Kütahya', 'kutahya', true),
('malatya', 'Malatya', 'malatya', true),
('manisa', 'Manisa', 'manisa', true),
('kahramanmaras', 'Kahramanmaraş', 'kahramanmaras', true),
('mardin', 'Mardin', 'mardin', true),
('mugla', 'Muğla', 'mugla', true),
('mus', 'Muş', 'mus', true),
('nevsehir', 'Nevşehir', 'nevsehir', true),
('nigde', 'Niğde', 'nigde', true),
('ordu', 'Ordu', 'ordu', true),
('rize', 'Rize', 'rize', true),
('sakarya', 'Sakarya', 'sakarya', true),
('samsun', 'Samsun', 'samsun', true),
('siirt', 'Siirt', 'siirt', true),
('sinop', 'Sinop', 'sinop', true),
('sivas', 'Sivas', 'sivas', true),
('tekirdag', 'Tekirdağ', 'tekirdag', true),
('tokat', 'Tokat', 'tokat', true),
('trabzon', 'Trabzon', 'trabzon', true),
('tunceli', 'Tunceli', 'tunceli', true),
('sanliurfa', 'Şanlıurfa', 'sanliurfa', true),
('usak', 'Uşak', 'usak', true),
('van', 'Van', 'van', true),
('yozgat', 'Yozgat', 'yozgat', true),
('zonguldak', 'Zonguldak', 'zonguldak', true),
('aksaray', 'Aksaray', 'aksaray', true),
('bayburt', 'Bayburt', 'bayburt', true),
('karaman', 'Karaman', 'karaman', true),
('kirikkale', 'Kırıkkale', 'kirikkale', true),
('batman', 'Batman', 'batman', true),
('sirnak', 'Şırnak', 'sirnak', true),
('bartin', 'Bartın', 'bartin', true),
('ardahan', 'Ardahan', 'ardahan', true),
('igdir', 'Iğdır', 'igdir', true),
('yalova', 'Yalova', 'yalova', true),
('karabuk', 'Karabük', 'karabuk', true),
('kilis', 'Kilis', 'kilis', true),
('osmaniye', 'Osmaniye', 'osmaniye', true),
('duzce', 'Düzce', 'duzce', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, is_active = true;

-- Ensure RLS is updated for the new columns if necessary
-- Usually FOR ALL policies cover new columns automatically
