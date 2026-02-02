-- ============================================
-- Independent Model Enhancements Migration
-- ============================================

-- 1. Personal Information for Independent Models
ALTER TABLE public.independent_models 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- 2. Physical Attributes and Services for Listings (Profiles)
-- Note: Re-using the listings table but adding specific columns for models.
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS breast_size TEXT, -- Options: a, b, bb, d, dd, ff, vc
ADD COLUMN IF NOT EXISTS body_hair TEXT, -- Options: trasli, degil, arasira
ADD COLUMN IF NOT EXISTS tattoos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS piercings BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS smoking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS alcohol BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS race TEXT,
ADD COLUMN IF NOT EXISTS age_value INTEGER,
ADD COLUMN IF NOT EXISTS height TEXT,
ADD COLUMN IF NOT EXISTS weight TEXT,
ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '{}'::jsonb; -- activity permissions

-- 3. Multi-tier Pricing Table
-- This handles the "3 bars" requirement: duration, in-call, out-call.
CREATE TABLE IF NOT EXISTS public.model_pricing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    duration TEXT NOT NULL, -- e.g. '30 dk', '45 dk', '1 sa', 'Gecelik'
    incall_price DECIMAL(10,2),
    outcall_price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_model_pricing_listing ON public.model_pricing(listing_id);

-- RLS Policies
ALTER TABLE public.model_pricing ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view pricing
CREATE POLICY "Anyone can view model pricing" 
    ON public.model_pricing FOR SELECT 
    USING (true);

-- Allow owners (models) to manage their pricing
-- Note: Uses a subquery to check if the user owns the listing associated with the price.
CREATE POLICY "Models can manage their own pricing" 
    ON public.model_pricing FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.listings
            WHERE public.listings.id = public.model_pricing.listing_id
            AND public.listings.user_id = auth.uid()
        )
    );

-- Users (Models) can manage their own listings (profiles)
-- This supplements regular admin access from previous migrations.
CREATE POLICY "Models can manage their own listings" 
    ON public.listings FOR ALL 
    USING (auth.uid() = user_id);

-- Update trigger for model_pricing
CREATE TRIGGER update_model_pricing_updated_at 
    BEFORE UPDATE ON public.model_pricing
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
