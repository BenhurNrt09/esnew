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

INSERT INTO public.cities (name, slug, is_active) VALUES
('Adana', 'adana', true),
('Adıyaman', 'adiyaman', true),
('Afyonkarahisar', 'afyonkarahisar', true),
('Ağrı', 'agri', true),
('Amasya', 'amasya', true),
('Ankara', 'ankara', true),
('Antalya', 'antalya', true),
('Artvin', 'artvin', true),
('Aydın', 'aydin', true),
('Balıkesir', 'balikesir', true),
('Bilecik', 'bilecik', true),
('Bingöl', 'bingol', true),
('Bitlis', 'bitlis', true),
('Bolu', 'bolu', true),
('Burdur', 'burdur', true),
('Bursa', 'bursa', true),
('Çanakkale', 'canakkale', true),
('Çankırı', 'cankiri', true),
('Çorum', 'corum', true),
('Denizli', 'denizli', true),
('Diyarbakır', 'diyarbakir', true),
('Edirne', 'edirne', true),
('Elazığ', 'elazig', true),
('Erzincan', 'erzincan', true),
('Erzurum', 'erzurum', true),
('Eskişehir', 'eskisehir', true),
('Gaziantep', 'gaziantep', true),
('Giresun', 'giresun', true),
('Gümüşhane', 'gumushane', true),
('Hakkari', 'hakkari', true),
('Hatay', 'hatay', true),
('Isparta', 'isparta', true),
('Mersin', 'mersin', true),
('İstanbul', 'istanbul', true),
('İzmir', 'izmir', true),
('Kars', 'kars', true),
('Kastamonu', 'kastamonu', true),
('Kayseri', 'kayseri', true),
('Kırklareli', 'kirklareli', true),
('Kırşehir', 'kirsehir', true),
('Kocaeli', 'kocaeli', true),
('Konya', 'konya', true),
('Kütahya', 'kutahya', true),
('Malatya', 'malatya', true),
('Manisa', 'manisa', true),
('Kahramanmaraş', 'kahramanmaras', true),
('Mardin', 'mardin', true),
('Muğla', 'mugla', true),
('Muş', 'mus', true),
('Nevşehir', 'nevsehir', true),
('Niğde', 'nigde', true),
('Ordu', 'ordu', true),
('Rize', 'rize', true),
('Sakarya', 'sakarya', true),
('Samsun', 'samsun', true),
('Siirt', 'siirt', true),
('Sinop', 'sinop', true),
('Sivas', 'sivas', true),
('Tekirdağ', 'tekirdag', true),
('Tokat', 'tokat', true),
('Trabzon', 'trabzon', true),
('Tunceli', 'tunceli', true),
('Şanlıurfa', 'sanliurfa', true),
('Uşak', 'usak', true),
('Van', 'van', true),
('Yozgat', 'yozgat', true),
('Zonguldak', 'zonguldak', true),
('Aksaray', 'aksaray', true),
('Bayburt', 'bayburt', true),
('Karaman', 'karaman', true),
('Kırıkkale', 'kirikkale', true),
('Batman', 'batman', true),
('Şırnak', 'sirnak', true),
('Bartın', 'bartin', true),
('Ardahan', 'ardahan', true),
('Iğdır', 'igdir', true),
('Yalova', 'yalova', true),
('Karabük', 'karabuk', true),
('Kilis', 'kilis', true),
('Osmaniye', 'osmaniye', true),
('Düzce', 'duzce', true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

-- Ensure RLS is updated for the new columns if necessary
-- Usually FOR ALL policies cover new columns automatically
