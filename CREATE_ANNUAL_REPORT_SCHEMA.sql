-- ============================================================================
-- ANNUAL REPORT SYSTEM - Database Schema
-- ============================================================================
-- This creates all tables needed for comprehensive annual report generation
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- 1. PRAYER ACTIVITIES TABLE
-- ============================================================================
-- Tracks all prayer meetings (Friday prayers, departmental prayers, etc.)
CREATE TABLE IF NOT EXISTS prayer_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Info
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'friday_prayer',
    'intercession_prayer',
    'literature_prayer',
    'media_prayer',
    'evangelism_prayer',
    'worship_prayer',
    'leadership_prayer',
    'other'
  )),
  
  -- Details
  location TEXT, -- Campus or venue
  attendance_count INTEGER DEFAULT 0,
  hours_invested NUMERIC(10,2) DEFAULT 0,
  
  -- Description
  theme TEXT, -- Prayer theme/focus
  notes TEXT, -- Additional notes
  
  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prayer_activities_date ON prayer_activities(activity_date);
CREATE INDEX idx_prayer_activities_type ON prayer_activities(activity_type);

ALTER TABLE prayer_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view prayer activities"
  ON prayer_activities FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert prayer activities"
  ON prayer_activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

CREATE POLICY "Admins can update prayer activities"
  ON prayer_activities FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

CREATE POLICY "Admins can delete prayer activities"
  ON prayer_activities FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

-- ============================================================================
-- 2. PRAYER IMPACT TABLE
-- ============================================================================
-- Tracks the impact of prayer ministry (testimonies, survey results)
CREATE TABLE IF NOT EXISTS prayer_impact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Impact Categories (checkboxes in form)
  deliverance_from_sin BOOLEAN DEFAULT false,
  true_repentance BOOLEAN DEFAULT false,
  closeness_to_god BOOLEAN DEFAULT false,
  academic_excellence BOOLEAN DEFAULT false,
  job_opportunities BOOLEAN DEFAULT false,
  passion_for_souls BOOLEAN DEFAULT false,
  
  -- Details
  testimony_text TEXT,
  person_name TEXT, -- Optional, can be anonymous
  campus TEXT,
  impact_date DATE,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prayer_impact_date ON prayer_impact(impact_date);

ALTER TABLE prayer_impact ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view prayer impact"
  ON prayer_impact FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage prayer impact"
  ON prayer_impact FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

-- ============================================================================
-- 3. DEPARTMENT MEMBERS TABLE
-- ============================================================================
-- Tracks who is committed to which department/team
CREATE TABLE IF NOT EXISTS department_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Member Info
  member_name TEXT NOT NULL,
  member_email TEXT,
  member_phone TEXT,
  university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
  
  -- Department Assignment
  department TEXT NOT NULL CHECK (department IN (
    'media_team',
    'prayer_team',
    'literature_team',
    'evangelism_team',
    'worship_team',
    'leadership_team',
    'other'
  )),
  
  -- Commitment
  role_in_department TEXT, -- e.g., "Leader", "Member", "Coordinator"
  hours_committed NUMERIC(10,2) DEFAULT 0, -- Total hours invested
  joined_date DATE,
  is_active BOOLEAN DEFAULT true,
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_department_members_dept ON department_members(department);
CREATE INDEX idx_department_members_active ON department_members(is_active);

ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view department members"
  ON department_members FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage department members"
  ON department_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

-- ============================================================================
-- 4. LITERATURE DISTRIBUTION TABLE
-- ============================================================================
-- Detailed tracking of literature distribution
CREATE TABLE IF NOT EXISTS literature_distribution (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Distribution Details
  distribution_date DATE NOT NULL,
  university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
  campus_location TEXT,
  
  -- Items Distributed
  tracts_count INTEGER DEFAULT 0,
  booklets_count INTEGER DEFAULT 0,
  bibles_count INTEGER DEFAULT 0,
  other_materials TEXT, -- JSON or text description
  
  -- Financial
  cost_amount NUMERIC(12,2) DEFAULT 0,
  funded_by TEXT, -- Source of funds
  
  -- Impact
  people_reached INTEGER DEFAULT 0,
  follow_up_contacts INTEGER DEFAULT 0,
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  distributed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_literature_distribution_date ON literature_distribution(distribution_date);
CREATE INDEX idx_literature_distribution_university ON literature_distribution(university_id);

ALTER TABLE literature_distribution ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view literature distribution"
  ON literature_distribution FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage literature distribution"
  ON literature_distribution FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

-- ============================================================================
-- 5. PROJECTS TABLE
-- ============================================================================
-- Track ongoing projects (e.g., Physical Library)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Project Info
  project_name TEXT NOT NULL,
  project_type TEXT CHECK (project_type IN (
    'physical_library',
    'campus_expansion',
    'media_production',
    'training_program',
    'other'
  )),
  description TEXT,
  
  -- Status
  status TEXT CHECK (status IN (
    'planning',
    'in_progress',
    'completed',
    'on_hold',
    'cancelled'
  )) DEFAULT 'planning',
  
  -- Timeline
  start_date DATE,
  target_completion_date DATE,
  actual_completion_date DATE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  
  -- Financial
  total_budget NUMERIC(12,2) DEFAULT 0,
  funds_raised NUMERIC(12,2) DEFAULT 0,
  funds_spent NUMERIC(12,2) DEFAULT 0,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_status ON projects(status);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage projects"
  ON projects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

-- ============================================================================
-- 6. PROJECT MILESTONES TABLE
-- ============================================================================
-- Track milestones for each project
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Milestone Info
  milestone_name TEXT NOT NULL,
  description TEXT,
  
  -- Status
  status TEXT CHECK (status IN (
    'pending',
    'in_progress',
    'completed',
    'blocked'
  )) DEFAULT 'pending',
  
  -- Timeline
  target_date DATE,
  completion_date DATE,
  
  -- Financial
  budget_allocated NUMERIC(12,2) DEFAULT 0,
  actual_cost NUMERIC(12,2) DEFAULT 0,
  
  -- Order
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_project_milestones_project ON project_milestones(project_id);

ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view project milestones"
  ON project_milestones FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage project milestones"
  ON project_milestones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

-- ============================================================================
-- 7. TESTIMONIES TABLE
-- ============================================================================
-- Store powerful testimonies and stories
CREATE TABLE IF NOT EXISTS testimonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Testimony Info
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  
  -- Person Info (optional/anonymous)
  person_name TEXT,
  person_role TEXT, -- e.g., "Student", "Campus Leader"
  university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
  
  -- Category
  category TEXT CHECK (category IN (
    'salvation',
    'deliverance',
    'healing',
    'academic',
    'career',
    'leadership',
    'other'
  )),
  
  -- Media
  photo_url TEXT, -- If consent given
  video_url TEXT,
  
  -- Consent & Privacy
  has_consent BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false, -- Show on homepage
  
  -- Date
  testimony_date DATE,
  
  -- Metadata
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_testimonies_category ON testimonies(category);
CREATE INDEX idx_testimonies_featured ON testimonies(is_featured);

ALTER TABLE testimonies ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view public testimonies"
  ON testimonies FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage testimonies"
  ON testimonies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

-- ============================================================================
-- 8. FINANCIAL TRANSACTIONS TABLE
-- ============================================================================
-- Track all financial activities (fundraising, expenses)
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Transaction Info
  transaction_date DATE NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN (
    'income',
    'expense'
  )) NOT NULL,
  
  -- Category
  category TEXT CHECK (category IN (
    'literature',
    'project',
    'event',
    'media',
    'administration',
    'other'
  )),
  
  -- Amount
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'RWF',
  
  -- Details
  description TEXT NOT NULL,
  source_or_recipient TEXT, -- Who gave/received the money
  
  -- Reference
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  receipt_url TEXT, -- Link to receipt/proof
  
  -- Metadata
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_financial_transactions_date ON financial_transactions(transaction_date);
CREATE INDEX idx_financial_transactions_type ON financial_transactions(transaction_type);

ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view financial transactions"
  ON financial_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

CREATE POLICY "Admins can manage financial transactions"
  ON financial_transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('ADMIN', 'SECRETARIAT')
    )
  );

-- ============================================================================
-- SUMMARY VIEWS FOR QUICK STATISTICS
-- ============================================================================

-- View: Annual Prayer Statistics
CREATE OR REPLACE VIEW annual_prayer_stats AS
SELECT
  EXTRACT(YEAR FROM activity_date) as year,
  COUNT(*) as total_sessions,
  SUM(attendance_count) as total_attendance,
  ROUND(AVG(attendance_count), 0) as avg_attendance,
  SUM(hours_invested) as total_hours,
  activity_type
FROM prayer_activities
GROUP BY EXTRACT(YEAR FROM activity_date), activity_type
ORDER BY year DESC, activity_type;

GRANT SELECT ON annual_prayer_stats TO anon, authenticated;

-- View: Department Statistics
CREATE OR REPLACE VIEW department_stats AS
SELECT
  department,
  COUNT(*) as total_members,
  COUNT(CASE WHEN is_active = true THEN 1 END) as active_members,
  SUM(hours_committed) as total_hours
FROM department_members
GROUP BY department;

GRANT SELECT ON department_stats TO anon, authenticated;

-- View: Literature Distribution Summary
CREATE OR REPLACE VIEW literature_summary AS
SELECT
  EXTRACT(YEAR FROM distribution_date) as year,
  SUM(tracts_count) as total_tracts,
  SUM(booklets_count) as total_booklets,
  SUM(bibles_count) as total_bibles,
  SUM(people_reached) as total_people_reached,
  SUM(cost_amount) as total_cost
FROM literature_distribution
GROUP BY EXTRACT(YEAR FROM distribution_date)
ORDER BY year DESC;

GRANT SELECT ON literature_summary TO anon, authenticated;

-- View: Project Financial Summary
CREATE OR REPLACE VIEW project_financial_summary AS
SELECT
  p.id,
  p.project_name,
  p.total_budget,
  p.funds_raised,
  p.funds_spent,
  (p.funds_raised - p.funds_spent) as balance,
  p.completion_percentage,
  p.status
FROM projects p
ORDER BY p.created_at DESC;

GRANT SELECT ON project_financial_summary TO anon, authenticated;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Annual Report Schema Created Successfully!';
  RAISE NOTICE '📊 Tables created: 8';
  RAISE NOTICE '📈 Views created: 4';
  RAISE NOTICE '🔒 RLS policies applied';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Build admin forms for data entry';
  RAISE NOTICE '2. Update frontend statistics';
  RAISE NOTICE '3. Build report generator';
END $$;

