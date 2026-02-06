-- ============================================
-- ESNew Platform - Missing Storage Buckets
-- ============================================

-- 1. Create 'chat-attachments' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Setup Policies for 'chat-attachments'
-- Select (Public read for simplicity in chat, or restricted to participants if needed)
DROP POLICY IF EXISTS "Chat attachments public read" ON storage.objects;
CREATE POLICY "Chat attachments public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-attachments');

-- Insert (Authenticaed users can upload)
DROP POLICY IF EXISTS "Authenticated users can upload chat attachments" ON storage.objects;
CREATE POLICY "Authenticated users can upload chat attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'chat-attachments' 
    AND auth.role() = 'authenticated'
  );

-- Delete (Users can delete own attachments)
DROP POLICY IF EXISTS "Users can delete own chat attachments" ON storage.objects;
CREATE POLICY "Users can delete own chat attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'chat-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
