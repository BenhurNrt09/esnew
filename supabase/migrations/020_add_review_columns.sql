-- Migration: Add anal_status column to comments table
-- This fixes the "Could not find the 'anal_status' column" error

-- Add anal_status column if it doesn't exist
ALTER TABLE comments ADD COLUMN IF NOT EXISTS anal_status BOOLEAN DEFAULT NULL;

-- Add other missing columns that might be needed
ALTER TABLE comments ADD COLUMN IF NOT EXISTS breast_natural TEXT DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS photo_accuracy INTEGER DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS multiple_sessions TEXT DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS ejaculation TEXT DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS sex_level TEXT DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS come_in_mouth TEXT DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS oral_condom TEXT DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS kissing TEXT DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS rating_appearance INTEGER DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS rating_service INTEGER DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS rating_communication INTEGER DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS meeting_date DATE DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS meeting_duration TEXT DEFAULT NULL;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS meeting_city TEXT DEFAULT NULL;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON comments TO authenticated;
GRANT SELECT ON comments TO anon;
