-- Add rating columns to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS rating_average NUMERIC(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Add rating columns to independent_models and agencies
ALTER TABLE independent_models
ADD COLUMN IF NOT EXISTS rating_average NUMERIC(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

ALTER TABLE agencies
ADD COLUMN IF NOT EXISTS rating_average NUMERIC(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Function to calculate ratings
CREATE OR REPLACE FUNCTION calculate_listing_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_listing_id UUID;
    target_user_id UUID;
    new_avg NUMERIC(3, 2);
    new_count INTEGER;
    owner_avg NUMERIC(3, 2);
    owner_count INTEGER;
    is_model BOOLEAN;
    is_agency BOOLEAN;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_listing_id := OLD.listing_id;
    ELSE
        target_listing_id := NEW.listing_id;
    END IF;

    -- 1. Update Listing Rating
    SELECT 
        COALESCE(AVG(rating_stars), 0),
        COUNT(*)
    INTO 
        new_avg,
        new_count
    FROM comments
    WHERE listing_id = target_listing_id
      AND is_approved = true;

    UPDATE listings
    SET 
        rating_average = new_avg,
        review_count = new_count
    WHERE id = target_listing_id
    RETURNING user_id INTO target_user_id;

    -- 2. Update Owner Rating (Independent Model or Agency)
    IF target_user_id IS NOT NULL THEN
        -- Calculate aggregate across all listings of this owner
        SELECT 
            COALESCE(SUM(rating_average * review_count) / NULLIF(SUM(review_count), 0), 0),
            SUM(review_count)
        INTO
            owner_avg,
            owner_count
        FROM listings
        WHERE user_id = target_user_id
          AND is_active = true;

        -- Check if owner is a model
        SELECT EXISTS(SELECT 1 FROM independent_models WHERE id = target_user_id) INTO is_model;
        
        IF is_model THEN
            UPDATE independent_models
            SET rating_average = owner_avg, review_count = owner_count
            WHERE id = target_user_id;
        ELSE
            -- Check if owner is an agency
            SELECT EXISTS(SELECT 1 FROM agencies WHERE id = target_user_id) INTO is_agency;
            IF is_agency THEN
                UPDATE agencies
                SET rating_average = owner_avg, review_count = owner_count
                WHERE id = target_user_id;
            END IF;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_update_listing_rating ON comments;
CREATE TRIGGER trigger_update_listing_rating
AFTER INSERT OR UPDATE OF rating_stars, is_approved OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION calculate_listing_rating();

-- Backfill existing data
DO $$
DECLARE
    r RECORD;
    u RECORD;
BEGIN
    -- Backfill listings
    FOR r IN SELECT id FROM listings LOOP
        UPDATE listings l
        SET 
            rating_average = (SELECT COALESCE(AVG(rating_stars), 0) FROM comments c WHERE c.listing_id = l.id AND c.is_approved = true),
            review_count = (SELECT COUNT(*) FROM comments c WHERE c.listing_id = l.id AND c.is_approved = true)
        WHERE l.id = r.id;
    END LOOP;

    -- Backfill owners (Independent Models)
    FOR u IN SELECT id FROM independent_models LOOP
        UPDATE independent_models m
        SET 
            rating_average = (SELECT COALESCE(SUM(rating_average * review_count) / NULLIF(SUM(review_count), 0), 0) FROM listings l WHERE l.user_id = m.id AND l.is_active = true),
            review_count = (SELECT SUM(review_count) FROM listings l WHERE l.user_id = m.id AND l.is_active = true)
        WHERE m.id = u.id;
    END LOOP;

    -- Backfill owners (Agencies)
    FOR u IN SELECT id FROM agencies LOOP
        UPDATE agencies a
        SET 
            rating_average = (SELECT COALESCE(SUM(rating_average * review_count) / NULLIF(SUM(review_count), 0), 0) FROM listings l WHERE l.user_id = a.id AND l.is_active = true),
            review_count = (SELECT SUM(review_count) FROM listings l WHERE l.user_id = a.id AND l.is_active = true)
        WHERE a.id = u.id;
    END LOOP;
END $$;
