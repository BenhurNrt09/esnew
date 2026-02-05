-- Featured Listings Migration
-- This creates a new table to track featured listings with time-based expiration

CREATE TABLE IF NOT EXISTS featured_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    featured_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    UNIQUE(listing_id)
);

-- Index for quick lookups of currently featured items
CREATE INDEX idx_featured_listings_featured_until ON featured_listings(featured_until);

CREATE INDEX idx_featured_listings_listing_id ON featured_listings(listing_id);

-- Function to automatically update is_featured flag based on featured_until
CREATE OR REPLACE FUNCTION sync_featured_status()
RETURNS void AS $$
BEGIN
    -- Set is_featured = false for expired listings
    UPDATE listings
    SET is_featured = false
    WHERE id IN (
        SELECT listing_id 
        FROM featured_listings 
        WHERE featured_until <= NOW()
    );
    
    -- Set is_featured = true for active featured listings
    UPDATE listings
    SET is_featured = true
    WHERE id IN (
        SELECT listing_id 
        FROM featured_listings 
        WHERE featured_until > NOW()
    );
    
    -- Delete expired featured entries older than 7 days
    DELETE FROM featured_listings
    WHERE featured_until < NOW() - INTERVAL '7 days';
-- Enable RLS
ALTER TABLE featured_listings ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read
CREATE POLICY "Allow authenticated users to read featured listings"
ON featured_listings FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated users can manage (temporary for admin, should be refined)
CREATE POLICY "Allow authenticated users to manage featured listings"
ON featured_listings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- Optional: Create a scheduled job to run this function periodically
-- This requires pg_cron extension (comment out if not available)
-- SELECT cron.schedule('sync-featured-status', '*/5 * * * *', 'SELECT sync_featured_status()');
