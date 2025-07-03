-- Update the get_top_3_positive_subjects function to return total_rating_sum instead of average_rating
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

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_top_3_positive_subjects() TO anon, authenticated; 