-- Complete Leaderboard Functions for Live Analytics
-- All time-based calculations are performed in PST (America/Los_Angeles).
-- All calculations now factor in 'vote_weight'.

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS get_overall_stats();
DROP FUNCTION IF EXISTS get_top_3_positive_subjects();
DROP FUNCTION IF EXISTS get_top_3_boring_subjects();



-- Function to get overall statistics
CREATE OR REPLACE FUNCTION get_overall_stats()
RETURNS TABLE (
  total_subjects BIGINT,
  total_votes BIGINT,
  total_users BIGINT,
  average_vote NUMERIC,
  positive_vote_percentage NUMERIC,
  negative_vote_percentage NUMERIC
) AS $$
DECLARE
  total_vote_weight BIGINT;
BEGIN
  total_vote_weight := (SELECT SUM(vote_weight) FROM votes);

  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM subjects) as total_subjects,
    total_vote_weight as total_votes,
    (SELECT COUNT(DISTINCT user_id) FROM votes) as total_users,
    CASE 
      WHEN total_vote_weight > 0 THEN ROUND((SELECT SUM(v.vote_value * v.vote_weight) FROM votes v)::numeric / total_vote_weight, 2)
      ELSE 0 
    END as average_vote,
    CASE 
      WHEN total_vote_weight > 0 THEN ROUND((SELECT SUM(v.vote_weight) FROM votes v WHERE v.vote_value > 0) * 100.0 / total_vote_weight, 1)
      ELSE 0 
    END as positive_vote_percentage,
    CASE 
      WHEN total_vote_weight > 0 THEN ROUND((SELECT SUM(v.vote_weight) FROM votes v WHERE v.vote_value < 0) * 100.0 / total_vote_weight, 1)
      ELSE 0
    END as negative_vote_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Top 3 Best Voted Subjects (by total rating sum)
CREATE OR REPLACE FUNCTION get_top_3_positive_subjects()
RETURNS TABLE (
  subject_id UUID,
  subject_name TEXT,
  total_votes BIGINT,
  total_rating_sum NUMERIC,
  rank_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    COALESCE(SUM(v.vote_weight), 0) AS total_votes,
    COALESCE(SUM(v.vote_value * v.vote_weight)::numeric, 0) AS total_rating_sum,
    ROW_NUMBER() OVER (
      ORDER BY COALESCE(SUM(v.vote_value * v.vote_weight), 0) DESC, COALESCE(SUM(v.vote_weight), 0) DESC
    )::INTEGER AS rank_position
  FROM subjects s
  LEFT JOIN votes v ON s.id = v.subject_id
  GROUP BY s.id, s.name
  HAVING COALESCE(SUM(v.vote_weight), 0) > 0
  ORDER BY total_rating_sum DESC, total_votes DESC
  LIMIT 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3 Most Boring Subjects (by lowest total rating sum)
CREATE OR REPLACE FUNCTION get_top_3_boring_subjects()
RETURNS TABLE (
  subject_id UUID,
  subject_name TEXT,
  total_votes BIGINT,
  total_rating_sum NUMERIC,
  rank_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    COALESCE(SUM(v.vote_weight), 0) AS total_votes,
    COALESCE(SUM(v.vote_value * v.vote_weight)::numeric, 0) AS total_rating_sum,
    ROW_NUMBER() OVER (
      ORDER BY COALESCE(SUM(v.vote_value * v.vote_weight), 0) ASC, COALESCE(SUM(v.vote_weight), 0) DESC
    )::INTEGER AS rank_position
  FROM subjects s
  LEFT JOIN votes v ON s.id = v.subject_id
  GROUP BY s.id, s.name
  HAVING COALESCE(SUM(v.vote_weight), 0) > 0
  ORDER BY total_rating_sum ASC, total_votes DESC
  LIMIT 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Grant permissions for all functions
GRANT EXECUTE ON FUNCTION get_top_3_positive_subjects() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_top_3_boring_subjects() TO anon, authenticated;