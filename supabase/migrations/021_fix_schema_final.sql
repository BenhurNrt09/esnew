-- Migration: 021_fix_schema_final.sql
-- Description: Adds missing columns needed for reviews and profile updates.

-- 1. Add missing columns to comments table
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS rating_stars INTEGER CHECK (rating_stars >= 1 AND rating_stars <= 5);

-- 2. Add missing columns to members table
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS phone_country_code TEXT DEFAULT '+90';

-- 3. Ensure RLS permissions are correct (re-granting just in case)
GRANT SELECT, INSERT, UPDATE ON public.comments TO authenticated;
GRANT SELECT ON public.comments TO anon;

GRANT SELECT, INSERT, UPDATE ON public.members TO authenticated;
GRANT SELECT ON public.members TO anon;

-- 4. Re-grant on favorites just in case
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
