-- Run this in Supabase SQL Editor to make tyrytr0981@gmail.com an admin

-- Update the profile to have admin privileges
UPDATE profiles 
SET 
  is_verified = true,
  is_premium = true,
  is_featured = true
WHERE email = 'tyrytr0981@gmail.com';

-- Verify the update
SELECT id, email, name, is_verified, is_premium, is_featured 
FROM profiles 
WHERE email = 'tyrytr0981@gmail.com';
