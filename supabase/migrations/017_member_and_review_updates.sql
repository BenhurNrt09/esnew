-- ============================================
-- Member Profile and Advanced Reviews Update
-- ============================================

-- 1. Update Members Table
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Update Comments Table for Advanced Reviews
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS rating_stars INTEGER CHECK (rating_stars >= 1 AND rating_stars <= 5),
ADD COLUMN IF NOT EXISTS oral_condom TEXT, -- 'condom', 'no_condom'
ADD COLUMN IF NOT EXISTS breast_natural TEXT, -- 'natural', 'silicone'
ADD COLUMN IF NOT EXISTS anal_status BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS photo_accuracy TEXT; -- 'real', '10p', '20p', '30p', '40p', 'ai'

-- 3. Update Model Pricing for Currency
ALTER TABLE public.model_pricing
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'TRY'; -- 'TRY', 'USD', 'EUR'

-- 4. Re-enable Realtime for these tables to ensure updates are instant
-- (In case publication was not set correctly before)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.members, public.comments, public.model_pricing;
    EXCEPTION WHEN others THEN
        -- Handle case where tables are already in publication
        NULL;
    END IF;
END $$;
