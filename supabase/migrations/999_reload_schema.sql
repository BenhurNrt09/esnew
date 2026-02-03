-- Force PostgREST schema cache reload
-- Run this in Supabase Dashboard SQL Editor if you see "schema cache" errors

NOTIFY pgrst, 'reload config';

-- Alternatively, touching a table comment often forces a refresh
COMMENT ON TABLE public.model_pricing IS 'Pricing tiers for independent models (Cache Refreshed)';
