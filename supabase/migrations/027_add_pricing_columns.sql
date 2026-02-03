-- Migration: 027_add_pricing_columns.sql
-- Description: Adds location, currency, and generic price columns to model_pricing table
-- matching the frontend implementation in dashboard/pricing/page.tsx

ALTER TABLE public.model_pricing
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'TRY',
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

-- Update comment to force schema cache reload
COMMENT ON TABLE public.model_pricing IS 'Pricing tiers with flexible location and currency support';
