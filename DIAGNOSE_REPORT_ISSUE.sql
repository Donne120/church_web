-- ============================================================================
-- Diagnose Report Display Issues
-- ============================================================================

-- 1. Check if reports exist
SELECT 
  COUNT(*) as total_reports,
  COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_reports,
  COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted_reports,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_reports
FROM monthly_reports;

-- 2. Check latest report data
SELECT 
  id,
  month,
  region,
  status,
  universities_reached,
  tracts_given,
  souls_saved,
  integrations_count as integrations,
  meetings_count as meetings,
  hours_invested,
  literature_count,
  literature_money,
  prayer_hours_friday,
  prayer_hours_literature,
  prayer_hours_media,
  prayer_hours_intercession,
  prayer_hours_worship,
  prayer_hours_evangelism,
  created_at
FROM monthly_reports
ORDER BY created_at DESC
LIMIT 5;

-- 3. Check if public_kpis view exists and what it returns
SELECT * FROM public_kpis
ORDER BY month DESC
LIMIT 3;

-- 4. Check if prayer_hours column exists in public_kpis
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'public_kpis'
ORDER BY ordinal_position;

-- 5. Check university names
SELECT id, name, region 
FROM universities 
ORDER BY name;

-- ============================================================================
-- WHAT TO LOOK FOR:
-- ============================================================================
-- 1. Are there any reports? (total_reports > 0)
-- 2. Are there approved reports? (approved_reports > 0)
-- 3. Does public_kpis view exist and return data?
-- 4. Does public_kpis have prayer_hours column?
-- 5. Is "Christian Youth and Students Missionary Fellowship" in universities?
-- ============================================================================

