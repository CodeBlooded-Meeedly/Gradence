-- Step 1: First update existing vote values to fit the new range
-- Convert votes from 1-5 range to -2 to +2 range
UPDATE votes
SET vote_value = CASE
    WHEN vote_value = 1 THEN -2  -- "Not Cool" -> "Way too hard"
    WHEN vote_value = 2 THEN -1  -- "Meh" -> "Too boring"
    WHEN vote_value = 4 THEN 1   -- "Very Cool" -> "Loved the subject"
    WHEN vote_value = 5 THEN 2   -- "Super Cool" -> "Super Fun"
    ELSE 0                       -- Default case, map to neutral
END;

-- Step 2: Now update the votes table structure
ALTER TABLE votes 
  ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Step 3: Add the constraints after data is updated
ALTER TABLE votes 
  DROP CONSTRAINT IF EXISTS vote_value_range,
  ADD CONSTRAINT vote_value_range CHECK (vote_value >= -2 AND vote_value <= 2),
  DROP CONSTRAINT IF EXISTS feedback_length,
  ADD CONSTRAINT feedback_length CHECK (char_length(feedback) <= 200);

-- Step 4: Drop existing RLS policies for votes
DROP POLICY IF EXISTS "Users can view their own votes" ON votes;
DROP POLICY IF EXISTS "Users can insert their own votes" ON votes;
DROP POLICY IF EXISTS "Users can update their own votes" ON votes;

-- Step 5: Create new RLS policies for anonymous voting
CREATE POLICY "Anyone can view votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert votes" ON votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can only update their own votes" ON votes
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Step 6: Update or create the stats function
CREATE OR REPLACE FUNCTION get_subject_stats(subject_uuid UUID)
RETURNS TABLE (
  subject_id UUID,
  subject_name TEXT,
  total_votes BIGINT,
  average_vote NUMERIC,
  vote_distribution JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    COUNT(v.id) as total_votes,
    ROUND(AVG(v.vote_value)::numeric, 2) as average_vote,
    json_build_object(
      '-2', COUNT(CASE WHEN v.vote_value = -2 THEN 1 END),
      '-1', COUNT(CASE WHEN v.vote_value = -1 THEN 1 END),
      '1', COUNT(CASE WHEN v.vote_value = 1 THEN 1 END),
      '2', COUNT(CASE WHEN v.vote_value = 2 THEN 1 END)
    ) as vote_distribution
  FROM subjects s
  LEFT JOIN votes v ON s.id = v.subject_id
  WHERE s.id = subject_uuid
  GROUP BY s.id, s.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Ensure function permissions
GRANT EXECUTE ON FUNCTION get_subject_stats(UUID) TO anon, authenticated;

-- Step 8: Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_subject_id ON votes(subject_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at); 