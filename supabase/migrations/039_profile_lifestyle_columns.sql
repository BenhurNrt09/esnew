-- ============================================
-- 039_profile_lifestyle_columns.sql
-- ============================================
-- Adds lifestyle attributes (sexual orientation, smoking, alcohol, tattoo, piercing)
-- to independent_models and listings tables.
-- ============================================

-- 1. INDEPENDENT MODELS
ALTER TABLE public.independent_models 
ADD COLUMN IF NOT EXISTS sexual_orientation TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS smoking TEXT DEFAULT 'hayir',
ADD COLUMN IF NOT EXISTS alcohol TEXT DEFAULT 'hayir',
ADD COLUMN IF NOT EXISTS tattoo TEXT DEFAULT 'yok',
ADD COLUMN IF NOT EXISTS piercing TEXT DEFAULT 'yok';

-- 2. LISTINGS
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS sexual_orientation TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS smoking TEXT DEFAULT 'hayir',
ADD COLUMN IF NOT EXISTS alcohol TEXT DEFAULT 'hayir',
ADD COLUMN IF NOT EXISTS tattoo TEXT DEFAULT 'yok',
ADD COLUMN IF NOT EXISTS piercing TEXT DEFAULT 'yok';

-- 3. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

DO $$ 
BEGIN 
    RAISE NOTICE '039_profile_lifestyle_columns migration completed.'; 
END $$;
