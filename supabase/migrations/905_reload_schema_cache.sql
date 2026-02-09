-- Force PostgREST to reload schema by performing a structural NO-OP and re-granting permissions
-- This is a more aggressive refresh strategy

-- 1. Structural NO-OP
ALTER TABLE stories ADD COLUMN IF NOT EXISTS _schema_refresh_dummy_v2 text;
ALTER TABLE stories DROP COLUMN IF EXISTS _schema_refresh_dummy_v2;

-- 2. Update Table Description (another trigger)
COMMENT ON TABLE stories IS 'Media stories for listings (refreshed at 2026-02-09)';

-- 3. Explicitly Re-grant Permissions to ensure visibility
GRANT ALL ON TABLE stories TO postgres, anon, authenticated, service_role;

-- 4. Standard Notify as backup
NOTIFY pgrst, 'reload schema';

-- 5. Verification Check (useful for DB logs)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'stories' AND column_name = 'listing_id'
    ) THEN
        RAISE NOTICE 'listing_id column found in stories table';
    ELSE
        RAISE WARNING 'listing_id column NOT FOUND in stories table';
    END IF;
END $$;
