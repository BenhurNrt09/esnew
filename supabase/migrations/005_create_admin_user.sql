-- Admin Test User for Development
-- Email: admin@esnew.com
-- Password: admin123

-- First, create user in Supabase Auth Dashboard manually, then run this:
-- Or use this to create via SQL after you have the user_id

-- Example SQL to insert admin user (You need to create auth user first in Supabase Dashboard)
-- Replace 'YOUR-USER-ID-HERE' with actual user ID from auth.users

INSERT INTO users (id, email, role, created_at, updated_at)
VALUES (
  'YOUR-USER-ID-HERE', -- Replace with actual UUID from auth.users
  'admin@esnew.com',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';

-- ALTERNATIVE: If you want to update existing user to admin
-- UPDATE users SET role = 'admin' WHERE email = 'admin@esnew.com';
