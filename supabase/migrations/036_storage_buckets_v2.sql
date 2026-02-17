-- ============================================
-- ESNew Platform - Storage Buckets v2
-- ============================================

-- 1. Create missing buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('listings', 'listings', true),
  ('stories', 'stories', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Setup Policies for 'listings'
DROP POLICY IF EXISTS "Public can view listings" ON storage.objects;
CREATE POLICY "Public can view listings"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings');

DROP POLICY IF EXISTS "Admins can manage listings" ON storage.objects;
CREATE POLICY "Admins can manage listings"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'listings' 
    AND is_admin()
  )
  WITH CHECK (
    bucket_id = 'listings' 
    AND is_admin()
  );

-- 3. Setup Policies for 'stories'
DROP POLICY IF EXISTS "Public can view stories" ON storage.objects;
CREATE POLICY "Public can view stories"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stories');

DROP POLICY IF EXISTS "Admins can manage stories" ON storage.objects;
CREATE POLICY "Admins can manage stories"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'stories' 
    AND is_admin()
  )
  WITH CHECK (
    bucket_id = 'stories' 
    AND is_admin()
  );
