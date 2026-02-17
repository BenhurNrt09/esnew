-- ============================================
-- 040_fix_lifestyle_column_types.sql
-- ============================================
-- Convert BOOLEAN columns to TEXT in listings table to match the application logic
-- and independent_models table.
-- ============================================

-- 1. Convert columns in listings table
ALTER TABLE public.listings 
ALTER COLUMN smoking TYPE TEXT USING (CASE WHEN smoking THEN 'evet' ELSE 'hayir' END),
ALTER COLUMN alcohol TYPE TEXT USING (CASE WHEN alcohol THEN 'evet' ELSE 'hayir' END);

-- 2. Ensure defaults are correct for TEXT values
ALTER TABLE public.listings 
ALTER COLUMN smoking SET DEFAULT 'hayir',
ALTER COLUMN alcohol SET DEFAULT 'hayir';

-- 3. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

DO $$ 
BEGIN 
    RAISE NOTICE '040_fix_lifestyle_column_types migration completed.'; 
END $$;
