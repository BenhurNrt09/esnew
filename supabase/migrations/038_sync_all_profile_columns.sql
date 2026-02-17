-- ============================================
-- 038_sync_all_profile_columns.sql
-- ============================================
-- This migration ensures that all user profile tables 
-- (members, independent_models, agencies) and listings
-- have a consistent set of columns required by the application.
-- ============================================

-- 1. INDEPENDENT MODELS
ALTER TABLE public.independent_models 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL;

-- Sync phone_number to phone if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='independent_models' AND table_schema='public' AND column_name='phone_number') THEN
        UPDATE public.independent_models SET phone = phone_number WHERE phone IS NULL;
    END IF;
END $$;

-- 2. MEMBERS
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL;

-- 3. AGENCIES
ALTER TABLE public.agencies 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL;

-- 4. LISTINGS (Ensuring all attributes from actions.ts exist)
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'female',
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS hair_color TEXT,
ADD COLUMN IF NOT EXISTS breast_size TEXT,
ADD COLUMN IF NOT EXISTS body_hair TEXT,
ADD COLUMN IF NOT EXISTS ethnicity TEXT,
ADD COLUMN IF NOT EXISTS height INTEGER,
ADD COLUMN IF NOT EXISTS weight INTEGER,
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 5. RELOAD SCHEMA CACHE (Critical for PostgREST)
NOTIFY pgrst, 'reload schema';

DO $$ 
BEGIN 
    RAISE NOTICE '038_sync_all_profile_columns migration completed and schema reload triggered.'; 
END $$;
