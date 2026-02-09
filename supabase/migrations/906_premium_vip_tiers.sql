-- Premium & VIP Listings Migration
-- Adds columns to listings and creates duration tracking tables

-- 1. Add columns to listings
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_vip BOOLEAN DEFAULT false;

-- 2. Create Premium Listings table
CREATE TABLE IF NOT EXISTS premium_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    premium_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    UNIQUE(listing_id)
);

-- 3. Create VIP Listings table
CREATE TABLE IF NOT EXISTS vip_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    vip_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    UNIQUE(listing_id)
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_premium_listings_premium_until ON premium_listings(premium_until);
CREATE INDEX IF NOT EXISTS idx_vip_listings_vip_until ON vip_listings(vip_until);

-- 5. Sync Function for Premium/VIP status
CREATE OR REPLACE FUNCTION sync_premium_vip_status()
RETURNS void AS $$
BEGIN
    -- Update Premium status
    UPDATE listings
    SET is_premium = (EXISTS (
        SELECT 1 FROM premium_listings 
        WHERE premium_listings.listing_id = listings.id 
        AND premium_until > NOW()
    ));

    -- Update VIP status
    UPDATE listings
    SET is_vip = (EXISTS (
        SELECT 1 FROM vip_listings 
        WHERE vip_listings.listing_id = listings.id 
        AND vip_until > NOW()
    ));

    -- Cleanup expired entries older than 7 days
    DELETE FROM premium_listings WHERE premium_until < NOW() - INTERVAL '7 days';
    DELETE FROM vip_listings WHERE vip_until < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- 6. Enable RLS
ALTER TABLE premium_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_listings ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
CREATE POLICY "Allow authenticated users to read premium listings"
ON premium_listings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage premium listings"
ON premium_listings FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read vip listings"
ON vip_listings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to manage vip listings"
ON vip_listings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Trigger to refresh schema cache (from 905 pattern)
NOTIFY pgrst, 'reload schema';
