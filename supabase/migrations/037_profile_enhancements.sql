-- ============================================
-- ESNew Platform - Profile Enhancements
-- ============================================

-- 1. Add city_id to independent_models
ALTER TABLE public.independent_models 
ADD COLUMN IF NOT EXISTS city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL;

-- 2. Add currency and update model_pricing
ALTER TABLE public.model_pricing
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'TL',
ADD COLUMN IF NOT EXISTS incall_currency TEXT, -- Optional: if they want separate currencies
ADD COLUMN IF NOT EXISTS outcall_currency TEXT;

-- 3. Ensure we have the latest schema in cache
NOTIFY pgrst, 'reload schema';
