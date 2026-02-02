-- ============================================
-- Comprehensive Profile and Review System Upgrade
-- ============================================

-- 1. Update Listings for new attributes and badges
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS orientation TEXT,
ADD COLUMN IF NOT EXISTS ethnicity TEXT,
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS tattoos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;

-- 2. Expand Comments for highly granular metrics
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS meeting_date DATE,
ADD COLUMN IF NOT EXISTS meeting_duration TEXT,
ADD COLUMN IF NOT EXISTS meeting_city TEXT,
ADD COLUMN IF NOT EXISTS rating_appearance INTEGER CHECK (rating_appearance >= 1 AND rating_appearance <= 10),
ADD COLUMN IF NOT EXISTS rating_service INTEGER CHECK (rating_service >= 1 AND rating_service <= 10),
ADD COLUMN IF NOT EXISTS rating_communication INTEGER CHECK (rating_communication >= 1 AND rating_communication <= 10),
ADD COLUMN IF NOT EXISTS kissing TEXT, -- 'Dilli', 'Dilsiz', etc.
ADD COLUMN IF NOT EXISTS sex_level TEXT, -- 'Aktif', 'Pasif', 'Orta', etc.
ADD COLUMN IF NOT EXISTS multiple_sessions TEXT, -- 'Tek sefer', 'Birden fazla', etc.
ADD COLUMN IF NOT EXISTS ejaculation TEXT, -- 'Yüze', 'İçeri', 'Yutma', etc.
ADD COLUMN IF NOT EXISTS come_in_mouth TEXT; -- Detailed options from screenshots

-- 3. Ensure index for better performance on these new fields
CREATE INDEX IF NOT EXISTS idx_comments_meeting_date ON public.comments(meeting_date);

-- 4. Publication updates
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
EXCEPTION WHEN others THEN
    NULL;
END $$;
