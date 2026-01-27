-- ============================================
-- ESNew Platform - Storage Buckets
-- ============================================
-- Run this in your Supabase SQL Editor
-- ============================================

-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Public can view listing images
DROP POLICY IF EXISTS "Public can view listing images" ON storage.objects;
CREATE POLICY "Public can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

-- Admins can upload listing images
DROP POLICY IF EXISTS "Admins can upload listing images" ON storage.objects;
CREATE POLICY "Admins can upload listing images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can update listing images
DROP POLICY IF EXISTS "Admins can update listing images" ON storage.objects;
CREATE POLICY "Admins can update listing images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'listing-images'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can delete listing images
DROP POLICY IF EXISTS "Admins can delete listing images" ON storage.objects;
CREATE POLICY "Admins can delete listing images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-images'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
