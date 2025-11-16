-- ============================================================================
-- JOIN REQUESTS SYSTEM - Allow people to request to join teams/programs
-- ============================================================================

-- Create join_requests table
CREATE TABLE IF NOT EXISTS join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- What they want to join
  request_type TEXT NOT NULL CHECK (request_type IN ('team', 'program')),
  team_name TEXT, -- e.g., 'Media Team', 'Literature Group', 'Evangelism Team'
  program_name TEXT, -- e.g., 'Campus Ministry', 'Prayer Group'
  
  -- Request details
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  university TEXT,
  region TEXT,
  
  -- Why they want to join
  motivation TEXT NOT NULL,
  experience TEXT,
  availability TEXT,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  reviewer_comment TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_join_requests_user_id ON join_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_join_requests_status ON join_requests(status);
CREATE INDEX IF NOT EXISTS idx_join_requests_request_type ON join_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_join_requests_created_at ON join_requests(created_at DESC);

-- Enable RLS
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can create a join request
CREATE POLICY "join_requests_insert_public"
ON join_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Users can view their own requests
CREATE POLICY "join_requests_read_own"
ON join_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins/Secretariat can view all requests
CREATE POLICY "join_requests_read_all_admins"
ON join_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('ADMIN', 'SECRETARIAT')
  )
);

-- Admins/Secretariat can update requests (approve/reject)
CREATE POLICY "join_requests_update_admins"
ON join_requests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('ADMIN', 'SECRETARIAT')
  )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_join_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER join_requests_updated_at
BEFORE UPDATE ON join_requests
FOR EACH ROW
EXECUTE FUNCTION update_join_requests_updated_at();

-- ============================================================================
-- AVAILABLE TEAMS (for reference)
-- ============================================================================
-- Media Team - Content creation, social media
-- Literature Group - Book distribution, reading programs
-- Evangelism Team - Campus outreach, evangelism
-- Prayer Team - Friday prayer, intercession, worship
-- Worship Team - Music, worship leading
-- Admin Team - Organization, coordination

-- ============================================================================
-- AVAILABLE PROGRAMS (for reference)
-- ============================================================================
-- Campus Ministry - General campus outreach
-- Prayer Groups - Friday, Literature, Media, Intercession, Worship, Evangelism
-- Leadership Training - For aspiring leaders
-- Discipleship Program - New believer follow-up

-- ============================================================================
-- Grant access
-- ============================================================================
GRANT SELECT, INSERT ON join_requests TO anon, authenticated;
GRANT UPDATE ON join_requests TO authenticated;

-- ============================================================================
-- AFTER RUNNING THIS:
-- 1. People can submit join requests through a form
-- 2. Admins can view and approve/reject requests
-- 3. Users can track their request status
-- ============================================================================

