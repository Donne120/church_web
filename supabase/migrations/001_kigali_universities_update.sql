-- Migration: Update universities with correct Kigali data and add campus playbook fields
-- Date: 2025-11-14

-- Step 1: Add new fields for campus playbook
ALTER TABLE universities ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS best_day TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS best_time TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS venue_notes TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS approval_notes TEXT;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS last_visit_date DATE;
ALTER TABLE universities ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'visited', 'active', 'inactive'));

-- Step 2: Delete old universities (keep only if you want to preserve history)
-- For clean slate, uncomment the next line:
-- DELETE FROM universities;

-- Step 3: Insert correct Kigali universities with accurate coordinates
-- Note: Coordinates are approximate and should be verified with Google Maps

INSERT INTO universities (name, city, region, lat, lng, status) VALUES
-- Kigali City Universities
('Adventist University of Central Africa (AUCA)', 'Kigali', 'Kigali City', -1.9441, 30.0936, 'pending'),
('African Leadership University (ALU) - Rwanda', 'Kigali', 'Kigali City', -1.9536, 30.0919, 'pending'),
('Mount Kigali University', 'Kigali', 'Kigali City', -1.9706, 30.1044, 'pending'),
('Université Libre de Kigali (ULK)', 'Kigali', 'Kigali City', -1.9706, 30.1044, 'pending'),
('University of Global Health Equity (UGHE)', 'Kigali', 'Kigali City', -1.9536, 30.0606, 'pending'),
('University of Kigali (UoK)', 'Kigali', 'Kigali City', -1.9536, 30.0606, 'pending'),
('University of Lay Adventists of Kigali (UNILAK)', 'Kigali', 'Kigali City', -1.9706, 30.1044, 'pending'),
('University of Rwanda (UR) – Nyarugenge Campus', 'Kigali', 'Kigali City', -1.9578, 30.0611, 'pending'),
('University of Rwanda (UR) – Gikondo Campus', 'Kigali', 'Kigali City', -1.9706, 30.0619, 'pending'),
('University of Rwanda (UR) – Remera Campus', 'Kigali', 'Kigali City', -1.9536, 30.0906, 'pending'),
('University of Tourism, Technology and Business Studies (UTB)', 'Kigali', 'Kigali City', -1.9536, 30.0606, 'pending'),
('Vatel School Rwanda', 'Kigali', 'Kigali City', -1.9536, 30.0919, 'pending')
ON CONFLICT (name) DO UPDATE SET
  city = EXCLUDED.city,
  region = EXCLUDED.region,
  lat = EXCLUDED.lat,
  lng = EXCLUDED.lng;

-- Step 4: Add event checklist fields
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue_booked BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS sound_ok BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS power_ok BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS security_ok BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS consent_plan_ok BOOLEAN DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS university_id UUID REFERENCES universities(id);

-- Step 5: Create permission_requests table for tracking campus permissions
CREATE TABLE IF NOT EXISTS permission_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE NOT NULL,
  requested_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  request_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  contact_person TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  purpose TEXT,
  proposed_dates TEXT,
  approval_letter_url TEXT,
  notes TEXT,
  approved_date DATE,
  expires_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for permission_requests
ALTER TABLE permission_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view permission requests"
  ON permission_requests FOR SELECT
  USING (true);

CREATE POLICY "Leaders can create permission requests"
  ON permission_requests FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role IN ('ADMIN', 'SECRETARIAT', 'REGIONAL_LEADER', 'CAMPUS_LEADER')
    )
  );

CREATE POLICY "Leaders can update their permission requests"
  ON permission_requests FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles 
      WHERE role IN ('ADMIN', 'SECRETARIAT', 'REGIONAL_LEADER', 'CAMPUS_LEADER')
    )
  );

-- Step 6: Create campus_history view for tracking past events
CREATE OR REPLACE VIEW campus_history AS
SELECT 
  u.id AS university_id,
  u.name AS university_name,
  u.region,
  COUNT(DISTINCT e.id) AS total_events,
  COUNT(DISTINCT mr.id) AS total_reports,
  SUM(mr.souls_saved) AS total_souls_saved,
  SUM(mr.integrations_count) AS total_integrations,
  SUM(mr.tracts_given) AS total_tracts_given,
  MAX(e.start_at) AS last_event_date,
  u.last_visit_date,
  u.status
FROM universities u
LEFT JOIN events e ON e.university_id = u.id
LEFT JOIN monthly_reports mr ON mr.university_id = u.id AND mr.status = 'approved'
GROUP BY u.id, u.name, u.region, u.last_visit_date, u.status;

-- Step 7: Create function to get campuses without recent events (for alerts)
CREATE OR REPLACE FUNCTION get_campuses_without_recent_events(days_threshold INT DEFAULT 30)
RETURNS TABLE (
  university_id UUID,
  university_name TEXT,
  region TEXT,
  days_since_last_event INT,
  last_event_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.region,
    COALESCE(EXTRACT(DAY FROM NOW() - MAX(e.start_at))::INT, 999) AS days_since_last_event,
    MAX(e.start_at) AS last_event_date
  FROM universities u
  LEFT JOIN events e ON e.university_id = u.id
  GROUP BY u.id, u.name, u.region
  HAVING COALESCE(EXTRACT(DAY FROM NOW() - MAX(e.start_at))::INT, 999) > days_threshold
  ORDER BY days_since_last_event DESC;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Add index for performance
CREATE INDEX IF NOT EXISTS idx_events_university_id ON events(university_id);
CREATE INDEX IF NOT EXISTS idx_permission_requests_university_id ON permission_requests(university_id);
CREATE INDEX IF NOT EXISTS idx_universities_status ON universities(status);
CREATE INDEX IF NOT EXISTS idx_universities_region ON universities(region);

-- Step 9: Update monthly_reports to ensure university_id is tracked
-- (Already exists in your schema, but let's ensure the index)
CREATE INDEX IF NOT EXISTS idx_monthly_reports_university_id ON monthly_reports(university_id);

COMMENT ON TABLE permission_requests IS 'Tracks permission requests and approvals for campus outreach';
COMMENT ON TABLE universities IS 'Universities with campus playbook data for systematic outreach';
COMMENT ON VIEW campus_history IS 'Historical metrics per campus for tracking impact over time';
COMMENT ON FUNCTION get_campuses_without_recent_events IS 'Returns campuses that need outreach attention';




