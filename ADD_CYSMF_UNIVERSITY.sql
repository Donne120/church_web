-- ============================================================================
-- Add CYSMF as a University/School Option
-- ============================================================================

-- Add Christian Youth and Students Missionary Fellowship as a university option
-- This will appear in the dropdown when creating reports

-- First, check if it already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM universities 
    WHERE name = 'Christian Youth and Students Missionary Fellowship'
  ) THEN
    INSERT INTO universities (name, city, region, lat, lng) 
    VALUES (
      'Christian Youth and Students Missionary Fellowship',
      'Kigali',
      'Kigali City',
      -1.9536,
      30.0606
    );
  END IF;
END $$;

-- Verify it was added
SELECT id, name, city, region 
FROM universities 
WHERE name = 'Christian Youth and Students Missionary Fellowship';

-- ============================================================================
-- RESULT: CYSMF will now appear in the university dropdown!
-- ============================================================================

