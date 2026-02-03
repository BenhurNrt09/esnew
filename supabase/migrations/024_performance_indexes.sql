-- ============================================
-- ESNew Platform - Performance Optimization Indexes
-- ============================================
-- This migration adds indexes to speed up common dashboard queries
-- ============================================

-- 1. Listings: Index on user_id to quickly find user profiles
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON public.listings(user_id);

-- 2. Notifications: Composite index for unread count queries
-- Dashboard layout queries: .eq('user_id', user.id).eq('is_read', false)
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;

-- 3. Favorites: Index on user_id for member dashboards
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);

-- 4. Comments: Index on user_id for reviews overview
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);

-- 5. Listing Stats: Ensure listing_id index is efficient
-- Current migrations show idx_stats_listing_id already exists in 015
-- But let's verify listing_id is indexed across related tables if missing

-- 6. Model Pricing: Indexing duration for faster filtering if needed
CREATE INDEX IF NOT EXISTS idx_model_pricing_duration ON public.model_pricing(duration);

ANALYZE public.listings;
ANALYZE public.notifications;
ANALYZE public.favorites;
ANALYZE public.comments;
ANALYZE public.model_pricing;
