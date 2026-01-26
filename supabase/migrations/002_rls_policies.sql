-- ============================================
-- ESNew Platform - Row Level Security Policies
-- ============================================
-- Run this AFTER 001_initial_schema.sql
-- ============================================

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

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

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admins have full access to users
CREATE POLICY "Admins have full access to users"
  ON users FOR ALL
  USING (is_admin());

-- ============================================
-- CITIES TABLE POLICIES
-- ============================================

-- Public can view active cities
CREATE POLICY "Public can view active cities"
  ON cities FOR SELECT
  USING (is_active = true);

-- Admins can view all cities
CREATE POLICY "Admins can view all cities"
  ON cities FOR SELECT
  USING (is_admin());

-- Admins can manage cities
CREATE POLICY "Admins can insert cities"
  ON cities FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update cities"
  ON cities FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete cities"
  ON cities FOR DELETE
  USING (is_admin());

-- ============================================
-- CATEGORIES TABLE POLICIES
-- ============================================

-- Public can view all categories
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  USING (is_admin());

-- ============================================
-- TAGS TABLE POLICIES
-- ============================================

-- Public can view all tags
CREATE POLICY "Public can view tags"
  ON tags FOR SELECT
  USING (true);

-- Admins can manage tags
CREATE POLICY "Admins can insert tags"
  ON tags FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update tags"
  ON tags FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete tags"
  ON tags FOR DELETE
  USING (is_admin());

-- ============================================
-- FEATURES TABLE POLICIES
-- ============================================

-- Public can view all features
CREATE POLICY "Public can view features"
  ON features FOR SELECT
  USING (true);

-- Admins can manage features
CREATE POLICY "Admins can insert features"
  ON features FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update features"
  ON features FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete features"
  ON features FOR DELETE
  USING (is_admin());

-- ============================================
-- LISTINGS TABLE POLICIES
-- ============================================

-- Public can view active listings
CREATE POLICY "Public can view active listings"
  ON listings FOR SELECT
  USING (is_active = true);

-- Admins can view all listings
CREATE POLICY "Admins can view all listings"
  ON listings FOR SELECT
  USING (is_admin());

-- Admins can manage listings
CREATE POLICY "Admins can insert listings"
  ON listings FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update listings"
  ON listings FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete listings"
  ON listings FOR DELETE
  USING (is_admin());

-- ============================================
-- LISTING IMAGES TABLE POLICIES
-- ============================================

-- Public can view images of active listings
CREATE POLICY "Public can view listing images"
  ON listing_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_images.listing_id
      AND listings.is_active = true
    )
  );

-- Admins can view all listing images
CREATE POLICY "Admins can view all listing images"
  ON listing_images FOR SELECT
  USING (is_admin());

-- Admins can manage listing images
CREATE POLICY "Admins can insert listing images"
  ON listing_images FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update listing images"
  ON listing_images FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete listing images"
  ON listing_images FOR DELETE
  USING (is_admin());

-- ============================================
-- LISTING FEATURES TABLE POLICIES
-- ============================================

-- Public can view features of active listings
CREATE POLICY "Public can view listing features"
  ON listing_features FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_features.listing_id
      AND listings.is_active = true
    )
  );

-- Admins can view all listing features
CREATE POLICY "Admins can view all listing features"
  ON listing_features FOR SELECT
  USING (is_admin());

-- Admins can manage listing features
CREATE POLICY "Admins can insert listing features"
  ON listing_features FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update listing features"
  ON listing_features FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete listing features"
  ON listing_features FOR DELETE
  USING (is_admin());

-- ============================================
-- LISTING TAGS TABLE POLICIES
-- ============================================

-- Public can view tags of active listings
CREATE POLICY "Public can view listing tags"
  ON listing_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_tags.listing_id
      AND listings.is_active = true
    )
  );

-- Admins can view all listing tags
CREATE POLICY "Admins can view all listing tags"
  ON listing_tags FOR SELECT
  USING (is_admin());

-- Admins can manage listing tags
CREATE POLICY "Admins can insert listing tags"
  ON listing_tags FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete listing tags"
  ON listing_tags FOR DELETE
  USING (is_admin());

-- ============================================
-- SEO PAGES TABLE POLICIES
-- ============================================

-- Public can view all SEO pages
CREATE POLICY "Public can view seo pages"
  ON seo_pages FOR SELECT
  USING (true);

-- Admins can manage SEO pages
CREATE POLICY "Admins can insert seo pages"
  ON seo_pages FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update seo pages"
  ON seo_pages FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete seo pages"
  ON seo_pages FOR DELETE
  USING (is_admin());
