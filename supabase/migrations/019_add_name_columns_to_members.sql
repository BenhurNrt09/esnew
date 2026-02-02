-- Add first_name, last_name, phone, and phone_country_code columns to members table
ALTER TABLE public.members 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS phone_country_code TEXT DEFAULT '+90';

-- Update existing records
UPDATE public.members 
SET first_name = INITCAP(username)
WHERE first_name IS NULL;
