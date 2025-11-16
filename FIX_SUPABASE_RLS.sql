-- ============================================================================
-- FIX SUPABASE RLS POLICIES - Copy this entire block to Supabase SQL Editor
-- ============================================================================

-- Step 1: Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
DROP POLICY IF EXISTS "profiles_read_all_for_admins" ON profiles;
DROP POLICY IF EXISTS "profiles_read_all_authenticated" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;

-- Step 2: Create new, simple policies that don't cause recursion
-- Allow all authenticated users to read all profiles (needed for dashboard)
CREATE POLICY "profiles_read_all_authenticated"
ON profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "profiles_insert_own"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
ON profiles
FOR UPDATE
USING (auth.uid() = id);

-- Step 3: Fix monthly_reports policies to allow reading
DROP POLICY IF EXISTS "reports_read_own" ON monthly_reports;
DROP POLICY IF EXISTS "reports_read_all_for_admins" ON monthly_reports;
DROP POLICY IF EXISTS "reports_read_all" ON monthly_reports;
DROP POLICY IF EXISTS "reports_insert_own" ON monthly_reports;
DROP POLICY IF EXISTS "reports_update_own" ON monthly_reports;

-- Allow everyone to read reports (you can tighten this later)
CREATE POLICY "reports_read_all"
ON monthly_reports
FOR SELECT
USING (true);

-- Allow users to create reports for themselves
CREATE POLICY "reports_insert_own"
ON monthly_reports
FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

-- Allow users to update their own reports
CREATE POLICY "reports_update_own"
ON monthly_reports
FOR UPDATE
USING (auth.uid() = reporter_id);

-- ============================================================================
-- AFTER RUNNING THIS SQL:
-- 1. Refresh your browser at http://localhost:3000/portal
-- 2. You should see all the dashboard data!
-- ============================================================================

