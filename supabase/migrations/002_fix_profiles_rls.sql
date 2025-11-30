-- Fix infinite recursion in profiles RLS policies
-- The issue: policies that check auth.uid() against profiles.id can cause recursion
-- Solution: Use simpler policies that don't query the same table

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
DROP POLICY IF EXISTS "profiles_read_all_for_admins" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;

-- Create new, simpler policies that avoid recursion

-- 1. Anyone can read their own profile (no recursion - direct auth.uid() check)
CREATE POLICY "profiles_read_own" 
ON profiles 
FOR SELECT 
USING (auth.uid() = id);

-- 2. Users can insert their own profile (for bootstrap)
CREATE POLICY "profiles_insert_own" 
ON profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile
CREATE POLICY "profiles_update_own" 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- 4. Admins can read all profiles (but avoid recursion by not checking role in profiles table)
-- Instead, we'll handle admin checks in the application layer
-- For now, just allow reading own profile
-- If you need admin access, use the service role key in your app

-- Optional: If you want to enable admin access via RLS, you need a separate admin tracking table
-- For now, we'll keep it simple and use service role key for admin operations








