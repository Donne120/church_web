-- ============================================================================
-- ADD PRAYER HOURS TRACKING - Run this in Supabase SQL Editor
-- ============================================================================

-- Add prayer hours columns to monthly_reports table
ALTER TABLE monthly_reports
ADD COLUMN IF NOT EXISTS prayer_hours_friday INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prayer_hours_literature INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prayer_hours_media INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prayer_hours_intercession INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prayer_hours_worship INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prayer_hours_evangelism INTEGER DEFAULT 0;

-- Add comment to describe the columns
COMMENT ON COLUMN monthly_reports.prayer_hours_friday IS 'Hours spent in Friday prayer meetings';
COMMENT ON COLUMN monthly_reports.prayer_hours_literature IS 'Hours spent in Literature Group prayer';
COMMENT ON COLUMN monthly_reports.prayer_hours_media IS 'Hours spent in Media Team prayer';
COMMENT ON COLUMN monthly_reports.prayer_hours_intercession IS 'Hours spent in Intercession prayer';
COMMENT ON COLUMN monthly_reports.prayer_hours_worship IS 'Hours spent in Worship prayer';
COMMENT ON COLUMN monthly_reports.prayer_hours_evangelism IS 'Hours spent in Evangelism prayer';

-- Update the public_kpis view to include prayer_hours
DROP VIEW IF EXISTS public_kpis;

CREATE VIEW public_kpis AS
SELECT
  month,
  SUM(universities_reached) AS universities_reached,
  SUM(tracts_given) AS tracts_given,
  SUM(souls_saved) AS souls_saved,
  SUM(integrations_count) AS integrations,
  SUM(meetings_count) AS meetings,
  SUM(hours_invested) AS hours_invested,
  SUM(
    COALESCE(prayer_hours_friday, 0) +
    COALESCE(prayer_hours_literature, 0) +
    COALESCE(prayer_hours_media, 0) +
    COALESCE(prayer_hours_intercession, 0) +
    COALESCE(prayer_hours_worship, 0) +
    COALESCE(prayer_hours_evangelism, 0)
  ) AS prayer_hours,
  SUM(literature_money) AS literature_money,
  SUM(literature_count) AS literature_count
FROM monthly_reports
WHERE status = 'approved'
GROUP BY month
ORDER BY month DESC;

-- Grant access to the view
GRANT SELECT ON public_kpis TO anon, authenticated;

-- ============================================================================
-- After running this, your reports will track prayer hours by category
-- and they will appear on the public homepage!
-- ============================================================================

