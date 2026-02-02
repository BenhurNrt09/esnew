-- ============================================
-- Multi-User Authentication System Migration
-- ============================================
-- Creates separate tables for three user types:
-- 1. Members (Üyeler)
-- 2. Independent Models (Bağımsız Modeller)
-- 3. Agencies (Ajanslar/Şirketler)
-- ============================================

-- ============================================
-- ENUM TYPES
-- ============================================

-- Gender types for independent models
CREATE TYPE gender_type AS ENUM ('woman', 'man', 'transsexual');

-- Business types for agencies
CREATE TYPE business_type AS ENUM (
    'escort_agency',
    'private_apartment',
    'brothel_studio_club',
    'massage_salon',
    'agency_company',
    'escort_directory',
    'sauna'
);

-- User type for tracking which auth system was used
CREATE TYPE user_type AS ENUM ('member', 'independent_model', 'agency');

-- ============================================
-- MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    user_type user_type NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for members
CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(email);
CREATE INDEX IF NOT EXISTS idx_members_username ON public.members(username);
CREATE INDEX IF NOT EXISTS idx_members_user_type ON public.members(user_type);

-- RLS Policies for members
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their own profile"
    ON public.members FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Members can update their own profile"
    ON public.members FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Anyone can insert member profile"
    ON public.members FOR INSERT
    WITH CHECK (true);

-- ============================================
-- INDEPENDENT MODELS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.independent_models (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    gender gender_type NOT NULL,
    user_type user_type NOT NULL DEFAULT 'independent_model',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for independent models
CREATE INDEX IF NOT EXISTS idx_independent_models_email ON public.independent_models(email);
CREATE INDEX IF NOT EXISTS idx_independent_models_username ON public.independent_models(username);
CREATE INDEX IF NOT EXISTS idx_independent_models_gender ON public.independent_models(gender);
CREATE INDEX IF NOT EXISTS idx_independent_models_user_type ON public.independent_models(user_type);

-- RLS Policies for independent models
ALTER TABLE public.independent_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Models can view their own profile"
    ON public.independent_models FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Models can update their own profile"
    ON public.independent_models FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Anyone can insert model profile"
    ON public.independent_models FOR INSERT
    WITH CHECK (true);

-- ============================================
-- AGENCIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    business_type business_type NOT NULL,
    user_type user_type NOT NULL DEFAULT 'agency',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for agencies
CREATE INDEX IF NOT EXISTS idx_agencies_email ON public.agencies(email);
CREATE INDEX IF NOT EXISTS idx_agencies_username ON public.agencies(username);
CREATE INDEX IF NOT EXISTS idx_agencies_business_type ON public.agencies(business_type);
CREATE INDEX IF NOT EXISTS idx_agencies_user_type ON public.agencies(user_type);

-- RLS Policies for agencies
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view their own profile"
    ON public.agencies FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Agencies can update their own profile"
    ON public.agencies FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Anyone can insert agency profile"
    ON public.agencies FOR INSERT
    WITH CHECK (true);

-- ============================================
-- UPDATE TIMESTAMP TRIGGERS
-- ============================================

-- Apply update triggers to all tables
DROP TRIGGER IF EXISTS update_members_updated_at ON public.members;
CREATE TRIGGER update_members_updated_at 
    BEFORE UPDATE ON public.members
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_independent_models_updated_at ON public.independent_models;
CREATE TRIGGER update_independent_models_updated_at 
    BEFORE UPDATE ON public.independent_models
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agencies_updated_at ON public.agencies;
CREATE TRIGGER update_agencies_updated_at 
    BEFORE UPDATE ON public.agencies
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get user type by user ID
CREATE OR REPLACE FUNCTION get_user_type(user_id UUID)
RETURNS user_type
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result user_type;
BEGIN
    -- Check members
    SELECT user_type INTO result FROM public.members WHERE id = user_id;
    IF FOUND THEN RETURN result; END IF;
    
    -- Check independent models
    SELECT user_type INTO result FROM public.independent_models WHERE id = user_id;
    IF FOUND THEN RETURN result; END IF;
    
    -- Check agencies
    SELECT user_type INTO result FROM public.agencies WHERE id = user_id;
    IF FOUND THEN RETURN result; END IF;
    
    RETURN NULL;
END;
$$;

-- Function to check if username is available
CREATE OR REPLACE FUNCTION is_username_available(p_username TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check all three tables
    IF EXISTS (SELECT 1 FROM public.members WHERE username = p_username) THEN
        RETURN FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.independent_models WHERE username = p_username) THEN
        RETURN FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.agencies WHERE username = p_username) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Function to check if email is available
CREATE OR REPLACE FUNCTION is_email_available(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check all three tables
    IF EXISTS (SELECT 1 FROM public.members WHERE email = p_email) THEN
        RETURN FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.independent_models WHERE email = p_email) THEN
        RETURN FALSE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.agencies WHERE email = p_email) THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE public.members IS 'Regular member accounts';
COMMENT ON TABLE public.independent_models IS 'Independent escort model accounts with gender selection';
COMMENT ON TABLE public.agencies IS 'Agency and company accounts with business type selection';
COMMENT ON FUNCTION get_user_type IS 'Returns the user type for a given user ID';
COMMENT ON FUNCTION is_username_available IS 'Checks if a username is available across all user types';
COMMENT ON FUNCTION is_email_available IS 'Checks if an email is available across all user types';
