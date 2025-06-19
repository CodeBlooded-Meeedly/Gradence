-- Step 1: Create subjects table
CREATE TABLE subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create votes table with feedback
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  vote_value INTEGER NOT NULL CHECK (vote_value >= -2 AND vote_value <= 2),
  feedback TEXT CHECK (char_length(feedback) <= 200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, subject_id)
);

-- Step 3: Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for subjects (anyone can read)
CREATE POLICY "Subjects are viewable by everyone" ON subjects
  FOR SELECT USING (true);

-- Step 5: Create RLS policies for votes (allow anonymous voting)
CREATE POLICY "Anyone can view votes" ON votes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert votes" ON votes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can only update their own votes" ON votes
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Step 6: Create function to get vote statistics (anonymous access)
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

-- Step 7: Grant permissions for the function
GRANT EXECUTE ON FUNCTION get_subject_stats(UUID) TO anon, authenticated;

-- Step 8: Insert some sample subjects
INSERT INTO subjects (name, description) VALUES
  ('React Hooks', 'How do you find working with React Hooks?'),
  ('TypeScript', 'Share your TypeScript learning experience'),
  ('Tailwind CSS', 'Rate your experience with Tailwind CSS'),
  ('Supabase', 'How was your journey learning Supabase?'),
  ('Vite', 'What do you think about Vite as a build tool?');

-- Step 9: Create indexes for better performance
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_subject_id ON votes(subject_id);
CREATE INDEX idx_votes_created_at ON votes(created_at); 