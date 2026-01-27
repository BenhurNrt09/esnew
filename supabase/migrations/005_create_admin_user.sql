-- Admin Test User for Development
-- Email: admin@esnew.com
-- Password: admin123

-- First, create user in Supabase Auth Dashboard manually
-- Replace the UUID below with your actual user ID from auth.users

INSERT INTO users (id, email, role, created_at, updated_at)
VALUES (
  'e1a097a0-5ca1-412e-b15d-20afe52a858e',
  'admin@esnew.com',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';
