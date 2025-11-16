-- ============================================================================
-- CLEAR MOCK DATA - Run this in Supabase SQL Editor
-- This will remove test/mock data while preserving the database structure
-- ============================================================================

-- IMPORTANT: This will delete data but keep:
-- ✅ All tables and their structure
-- ✅ All views (public_kpis)
-- ✅ All RLS policies
-- ✅ Your user accounts and profiles

-- ============================================================================
-- Step 1: Clear monthly reports (test reports)
-- ============================================================================

DELETE FROM monthly_reports;

-- ============================================================================
-- Step 2: Clear media entries (test media)
-- ============================================================================

DELETE FROM media;

-- ============================================================================
-- Step 3: Clear events (test events)
-- ============================================================================

DELETE FROM events;

-- ============================================================================
-- Step 4: Clear universities (if you want to re-add them fresh)
-- COMMENT OUT the line below if you want to KEEP your universities
-- ============================================================================

-- DELETE FROM universities;

-- ============================================================================
-- Step 5: Clear profiles (EXCEPT your own admin account)
-- This keeps your login but removes test users
-- ============================================================================

-- Option A: Keep ALL profiles (recommended for first-time clear)
-- Do nothing - profiles stay

-- Option B: Remove specific test profiles by email
-- Uncomment and modify the emails below:
-- DELETE FROM profiles WHERE email IN (
--   'test@example.com',
--   'demo@example.com'
-- );

-- Option C: Keep only YOUR profile (replace with your actual email)
-- Uncomment and replace 'your-email@example.com':
-- DELETE FROM profiles WHERE email != 'your-email@example.com';

-- ============================================================================
-- Step 6: Verify what's left
-- ============================================================================

-- Check remaining data
SELECT 'monthly_reports' as table_name, COUNT(*) as count FROM monthly_reports
UNION ALL
SELECT 'media', COUNT(*) FROM media
UNION ALL
SELECT 'events', COUNT(*) FROM events
UNION ALL
SELECT 'universities', COUNT(*) FROM universities
UNION ALL
SELECT 'profiles', COUNT(*) FROM profiles;

-- ============================================================================
-- AFTER RUNNING THIS:
-- 1. You should see 0 reports, 0 media, 0 events
-- 2. Universities count depends on if you deleted them
-- 3. Profiles count depends on which option you chose
-- 4. Your database structure is intact
-- 5. You can now add real data through the app!
-- ============================================================================

