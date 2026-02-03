    ALTER TABLE public.members
    ADD COLUMN IF NOT EXISTS first_name TEXT,
    ADD COLUMN IF NOT EXISTS last_name TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS phone_country_code TEXT DEFAULT '+90';

    ALTER TABLE public.listings
    ADD COLUMN IF NOT EXISTS breast_size TEXT,
    ADD COLUMN IF NOT EXISTS body_hair TEXT,
    ADD COLUMN IF NOT EXISTS age_value INTEGER,
    ADD COLUMN IF NOT EXISTS height TEXT,
    ADD COLUMN IF NOT EXISTS weight TEXT,
    ADD COLUMN IF NOT EXISTS smoking BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS alcohol BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS tattoos BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'woman',
    ADD COLUMN IF NOT EXISTS orientation TEXT DEFAULT 'straight',
    ADD COLUMN IF NOT EXISTS ethnicity TEXT DEFAULT 'european',
    ADD COLUMN IF NOT EXISTS race TEXT, -- Keep for compatibility with homepage filter if needed
    ADD COLUMN IF NOT EXISTS nationality TEXT,
    ADD COLUMN IF NOT EXISTS services JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS phone TEXT;

    -- Indexing for performance
    CREATE INDEX IF NOT EXISTS idx_listings_is_active ON public.listings(is_active) WHERE is_active = true;
    CREATE INDEX IF NOT EXISTS idx_listings_is_featured ON public.listings(is_featured) WHERE is_featured = true;

    -- Refresh PostgREST cache (this is usually automatic but good to include)
    -- NOTIFY pgrst, 'reload schema';
