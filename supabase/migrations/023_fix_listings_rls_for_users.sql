-- ============================================
-- ESNew Platform - Fix Listings RLS for User Profile Creation
-- ============================================
-- This migration adds policies to allow users to create and manage their own listings
-- ============================================

-- Allow authenticated users to INSERT their own listings
DROP POLICY IF EXISTS "Users can insert own listings" ON listings;
CREATE POLICY "Users can insert own listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own listings (even if not active)
DROP POLICY IF EXISTS "Users can view own listings" ON listings;
CREATE POLICY "Users can view own listings"
  ON listings FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to UPDATE their own listings
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings"
  ON listings FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to DELETE their own listings
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;
CREATE POLICY "Users can delete own listings"
  ON listings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MODEL PRICING - Allow users to manage their own pricing
-- ============================================

-- Enable RLS on model_pricing if not already enabled
ALTER TABLE model_pricing ENABLE ROW LEVEL SECURITY;

-- Allow users to INSERT pricing for their own listings
DROP POLICY IF EXISTS "Users can insert own pricing" ON model_pricing;
CREATE POLICY "Users can insert own pricing"
  ON model_pricing FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = model_pricing.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Allow users to view pricing for their own listings
DROP POLICY IF EXISTS "Users can view own pricing" ON model_pricing;
CREATE POLICY "Users can view own pricing"
  ON model_pricing FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = model_pricing.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Allow public to view pricing for active listings
DROP POLICY IF EXISTS "Public can view active listing pricing" ON model_pricing;
CREATE POLICY "Public can view active listing pricing"
  ON model_pricing FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = model_pricing.listing_id 
      AND listings.is_active = true
    )
  );

-- Allow users to UPDATE pricing for their own listings
DROP POLICY IF EXISTS "Users can update own pricing" ON model_pricing;
CREATE POLICY "Users can update own pricing"
  ON model_pricing FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = model_pricing.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Allow users to DELETE pricing for their own listings
DROP POLICY IF EXISTS "Users can delete own pricing" ON model_pricing;
CREATE POLICY "Users can delete own pricing"
  ON model_pricing FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE listings.id = model_pricing.listing_id 
      AND listings.user_id = auth.uid()
    )
  );

-- Admins have full access to model_pricing
DROP POLICY IF EXISTS "Admins have full access to model_pricing" ON model_pricing;
CREATE POLICY "Admins have full access to model_pricing"
  ON model_pricing FOR ALL
  USING (is_admin());
