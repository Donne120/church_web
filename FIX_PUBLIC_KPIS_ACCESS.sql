-- Fix public_kpis view to be accessible without authentication
-- This view should be publicly readable since it's used on the public homepage

-- First, ensure the view exists and has the correct structure
DROP VIEW IF EXISTS public_kpis;

CREATE VIEW public_kpis AS
SELECT 
  month,
  COUNT(DISTINCT university_id) as universities_reached,
  COALESCE(SUM(tracts_given), 0) as tracts_given,
  COALESCE(SUM(souls_saved), 0) as souls_saved,
  COALESCE(SUM(integrations), 0) as integrations,
  COALESCE(SUM(meetings), 0) as meetings,
  COALESCE(SUM(hours_invested), 0) as hours_invested,
  COALESCE(SUM(prayer_hours_friday + prayer_hours_literature + prayer_hours_media + 
               prayer_hours_intercession + prayer_hours_worship + prayer_hours_evangelism), 0) as prayer_hours,
  COALESCE(SUM(literature_money), 0) as literature_money,
  COALESCE(SUM(literature_count), 0) as literature_count
FROM monthly_reports
WHERE status = 'approved'
GROUP BY month
ORDER BY month DESC;

-- Grant SELECT permission to anonymous users (public access)
GRANT SELECT ON public_kpis TO anon;

-- Also grant to authenticated users
GRANT SELECT ON public_kpis TO authenticated;

-- Ensure the view is in the public schema and accessible
ALTER VIEW public_kpis OWNER TO postgres;

