-- ============================================
-- Moderation and Anonymous Reviews Updates
-- ============================================

-- 1. Update Comments Table
-- Allow user_id to be NULL for anonymous comments
ALTER TABLE public.comments ALTER COLUMN user_id DROP NOT NULL;

-- Add author_name for guest comments
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Ensure is_approved defaults to false for everything
ALTER TABLE public.comments ALTER COLUMN is_approved SET DEFAULT false;

-- 2. Update RLS for Comments
-- Allow everyone (including anonymous users) to insert comments
DROP POLICY IF EXISTS "Public can submit comments" ON public.comments;
CREATE POLICY "Public can submit comments" ON public.comments FOR INSERT WITH CHECK (true);

-- Ensure public can only see approved comments
DROP POLICY IF EXISTS "Public can view approved comments" ON public.comments;
CREATE POLICY "Public can view approved comments" ON public.comments FOR SELECT USING (is_approved = true);

-- 3. Update Listings for Approval Workflow
-- If we want to use a specific status column instead of just is_active
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Update existing listings to 'approved' if they are active
UPDATE public.listings SET approval_status = 'approved' WHERE is_active = true AND approval_status = 'pending';

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_comments_is_approved ON public.comments(is_approved);
CREATE INDEX IF NOT EXISTS idx_listings_approval_status ON public.listings(approval_status);

-- Permissions
GRANT ALL ON public.comments TO authenticated, service_role;
GRANT ALL ON public.comments TO anon;
