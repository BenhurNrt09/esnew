-- ============================================
-- ESNew Platform - Row Level Security Policies
-- ============================================
-- Run this AFTER 001_initial_schema.sql
-- ============================================

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

DO $$ 
BEGIN
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
  ALTER TABLE features ENABLE ROW LEVEL SECURITY;
  ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
  ALTER TABLE listing_features ENABLE ROW LEVEL SECURITY;
  ALTER TABLE listing_tags ENABLE ROW LEVEL SECURITY;
  ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'RLS already enabled or table missing: %', SQLERRM;
END $$;

-- ============================================
-- HELPER FUNCTION - Check if user is admin
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to users" ON users;
CREATE POLICY "Admins have full access to users"
  ON users FOR ALL
  USING (is_admin());

-- ============================================
-- CITIES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public can view active cities" ON cities;
CREATE POLICY "Public can view active cities"
  ON cities FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all cities" ON cities;
CREATE POLICY "Admins can view all cities"
  ON cities FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert cities" ON cities;
CREATE POLICY "Admins can insert cities"
  ON cities FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update cities" ON cities;
CREATE POLICY "Admins can update cities"
  ON cities FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete cities" ON cities;
CREATE POLICY "Admins can delete cities"
  ON cities FOR DELETE
  USING (is_admin());

-- ============================================
-- CATEGORIES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update categories" ON categories;
CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete categories" ON categories;
CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (is_admin());

-- ============================================
-- TAGS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public can view tags" ON tags;
CREATE POLICY "Public can view tags"
  ON tags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert tags" ON tags;
CREATE POLICY "Admins can insert tags"
  ON tags FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update tags" ON tags;
CREATE POLICY "Admins can update tags"
  ON tags FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete tags" ON tags;
CREATE POLICY "Admins can delete tags"
  ON tags FOR DELETE
  USING (is_admin());

-- ============================================
-- FEATURES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public can view features" ON features;
CREATE POLICY "Public can view features"
  ON features FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert features" ON features;
CREATE POLICY "Admins can insert features"
  ON features FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update features" ON features;
CREATE POLICY "Admins can update features"
  ON features FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete features" ON features;
CREATE POLICY "Admins can delete features"
  ON features FOR DELETE
  USING (is_admin());

-- ============================================
-- LISTINGS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public can view active listings" ON listings;
CREATE POLICY "Public can view active listings"
  ON listings FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
CREATE POLICY "Admins can view all listings"
  ON listings FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert listings" ON listings;
CREATE POLICY "Admins can insert listings"
  ON listings FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update listings" ON listings;
CREATE POLICY "Admins can update listings"
  ON listings FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete listings" ON listings;
CREATE POLICY "Admins can delete listings"
  ON listings FOR DELETE
  USING (is_admin());

-- ============================================
-- LISTING IMAGES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public can view listing images" ON listing_images;
CREATE POLICY "Public can view listing images"
  ON listing_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_images.listing_id
      AND listings.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can view all listing images" ON listing_images;
CREATE POLICY "Admins can view all listing images"
  ON listing_images FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert listing images" ON listing_images;
CREATE POLICY "Admins can insert listing images"
  ON listing_images FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update listing images" ON listing_images;
CREATE POLICY "Admins can update listing images"
  ON listing_images FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete listing images" ON listing_images;
CREATE POLICY "Admins can delete listing images"
  ON listing_images FOR DELETE
  USING (is_admin());

-- ============================================
-- LISTING FEATURES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public can view listing features" ON listing_features;
CREATE POLICY "Public can view listing features"
  ON listing_features FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_features.listing_id
      AND listings.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can view all listing features" ON listing_features;
CREATE POLICY "Admins can view all listing features"
  ON listing_features FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert listing features" ON listing_features;
CREATE POLICY "Admins can insert listing features"
  ON listing_features FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update listing features" ON listing_features;
CREATE POLICY "Admins can update listing features"
  ON listing_features FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete listing features" ON listing_features;
CREATE POLICY "Admins can delete listing features"
  ON listing_features FOR DELETE
  USING (is_admin());

-- ============================================
-- LISTING TAGS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public can view listing tags" ON listing_tags;
CREATE POLICY "Public can view listing tags"
  ON listing_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_tags.listing_id
      AND listings.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can view all listing tags" ON listing_tags;
CREATE POLICY "Admins can view all listing tags"
  ON listing_tags FOR SELECT
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert listing tags" ON listing_tags;
CREATE POLICY "Admins can insert listing tags"
  ON listing_tags FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can delete listing tags" ON listing_tags;
CREATE POLICY "Admins can delete listing tags"
  ON listing_tags FOR DELETE
  USING (is_admin());

-- ============================================
-- SEO PAGES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Public can view seo pages" ON seo_pages;
CREATE POLICY "Public can view seo pages"
  ON seo_pages FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert seo pages" ON seo_pages;
CREATE POLICY "Admins can insert seo pages"
  ON seo_pages FOR INSERT
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can update seo pages" ON seo_pages;
CREATE POLICY "Admins can update seo pages"
  ON seo_pages FOR UPDATE
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can delete seo pages" ON seo_pages;
CREATE POLICY "Admins can delete seo pages"
  ON seo_pages FOR DELETE
  USING (is_admin());
