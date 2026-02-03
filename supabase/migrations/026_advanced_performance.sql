-- ============================================
-- ESNew Platform - Advanced Performance Tuning
-- ============================================
-- Targeting specific bottlenecks in listing stats and reviews
-- ============================================

-- 1. Listing Stats Optimization
-- Speeds up the aggregation of view/contact counts
CREATE INDEX IF NOT EXISTS idx_listing_stats_listing_id_view_contact 
ON public.listing_stats(listing_id, view_count, contact_count);

-- 2. Comments Optimization
-- First ensure the column exists (failsafe if previous migrations were skipped)
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS rating_stars INTEGER CHECK (rating_stars >= 1 AND rating_stars <= 5);

-- Optional: Sync data from old 'rating' column if it exists
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='comments' AND column_name='rating') THEN
        UPDATE public.comments SET rating_stars = rating WHERE rating_stars IS NULL AND rating IS NOT NULL;
    END IF;
END $$;

-- Speeds up average rating calculation
CREATE INDEX IF NOT EXISTS idx_comments_listing_rating_stats
ON public.comments(listing_id, rating_stars) 
WHERE parent_id IS NULL AND rating_stars IS NOT NULL;

-- 3. Notification Read Performance
-- Speeds up finding unread notifications which happens on every page load
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_unread_active
ON public.notifications(user_id) 
WHERE is_read = false;

-- 4. Favorites Aggregation
-- Speeds up count(*) on favorites
CREATE INDEX IF NOT EXISTS idx_favorites_listing_user 
ON public.favorites(listing_id, user_id);

-- Run Analyze to update statistics
ANALYZE public.listing_stats;
ANALYZE public.comments;
ANALYZE public.notifications;
ANALYZE public.favorites;
