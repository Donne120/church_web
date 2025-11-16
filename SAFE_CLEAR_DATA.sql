-- ============================================================================
-- SAFE DATA CLEANUP - Choose what to keep/remove
-- Run sections individually based on what you want to clear
-- ============================================================================

-- ============================================================================
-- OPTION 1: CONSERVATIVE CLEAR (Recommended for first time)
-- Removes only reports and media, keeps universities and all profiles
-- ============================================================================

-- Clear all monthly reports
DELETE FROM monthly_reports;

-- Clear all media
DELETE FROM media;

-- Clear all events
DELETE FROM events;

-- Keep universities ✅
-- Keep all profiles ✅

-- ============================================================================
-- OPTION 2: MODERATE CLEAR
-- Removes reports, media, events, and test profiles
-- Keeps universities and YOUR admin profile
-- ============================================================================

-- STEP 1: First, find your user ID
-- Run this query to see your profile:
-- SELECT id, email, full_name, role FROM profiles;

-- STEP 2: Clear reports, media, events
-- DELETE FROM monthly_reports;
-- DELETE FROM media;
-- DELETE FROM events;

-- STEP 3: Keep only YOUR profile (replace 'YOUR_USER_ID_HERE' with your actual ID)
-- DELETE FROM profiles WHERE id != 'YOUR_USER_ID_HERE';

-- ============================================================================
-- OPTION 3: FULL RESET (Use with caution!)
-- Removes everything except structure
-- You'll need to re-add universities and re-login
-- ============================================================================

-- DELETE FROM monthly_reports;
-- DELETE FROM media;
-- DELETE FROM events;
-- DELETE FROM universities;
-- DELETE FROM profiles;

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to check what remains
-- ============================================================================

-- Count all data
SELECT 
  'monthly_reports' as table_name, 
  COUNT(*) as count,
  CASE WHEN COUNT(*) = 0 THEN '✅ Empty' ELSE '⚠️ Has data' END as status
FROM monthly_reports
UNION ALL
SELECT 'media', COUNT(*), CASE WHEN COUNT(*) = 0 THEN '✅ Empty' ELSE '⚠️ Has data' END FROM media
UNION ALL
SELECT 'events', COUNT(*), CASE WHEN COUNT(*) = 0 THEN '✅ Empty' ELSE '⚠️ Has data' END FROM events
UNION ALL
SELECT 'universities', COUNT(*), CASE WHEN COUNT(*) = 0 THEN '⚠️ Empty' ELSE '✅ Has data' END FROM universities
UNION ALL
SELECT 'profiles', COUNT(*), CASE WHEN COUNT(*) = 0 THEN '⚠️ Empty' ELSE '✅ Has data' END FROM profiles;

-- View remaining profiles
-- SELECT id, email, full_name, role FROM profiles;

-- View remaining universities
-- SELECT id, name, region FROM universities ORDER BY region, name;

-- ============================================================================
-- RECOMMENDED APPROACH:
-- 
-- 1. Run OPTION 1 (Conservative Clear) first
-- 2. Verify with the verification queries
-- 3. If you need to remove test profiles, run OPTION 2
-- 4. Never run OPTION 3 unless you want to start completely fresh
-- ============================================================================

