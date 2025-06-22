-- Complete Leaderboard Functions for Live Analytics
-- All time-based calculations are performed in PST (America/Los_Angeles).
-- All calculations now factor in 'vote_weight'.

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS get_top_subjects_all_time(INTEGER);
DROP FUNCTION IF EXISTS get_most_voted_subjects(INTEGER);
DROP FUNCTION IF EXISTS get_todays_top_subjects(INTEGER);
DROP FUNCTION IF EXISTS get_weekly_trending_subjects(INTEGER);
DROP FUNCTION IF EXISTS get_vote_trends_7_days();
DROP FUNCTION IF EXISTS get_todays_hourly_activity();
DROP FUNCTION IF EXISTS get_most_improved_subjects(INTEGER);
DROP FUNCTION IF EXISTS get_overall_stats();
DROP FUNCTION IF EXISTS get_emoji_vote_distribution();

-- Function to get top subjects by average vote (all time)
-- Shows all subjects, even those with no votes.
CREATE OR REPLACE FUNCTION get_top_subjects_all_time(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  subject_id UUID,
  subject_name TEXT,
  average_vote NUMERIC,
  total_votes BIGINT,
  rank_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    CASE 
      WHEN SUM(v.vote_weight) > 0 THEN ROUND(SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight), 2)
      ELSE 0
    END as average_vote,
    COALESCE(SUM(v.vote_weight), 0) as total_votes,
    ROW_NUMBER() OVER (ORDER BY (CASE WHEN SUM(v.vote_weight) > 0 THEN SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight) ELSE 0 END) DESC, COALESCE(SUM(v.vote_weight), 0) DESC) as rank_position
  FROM subjects s
  LEFT JOIN votes v ON s.id = v.subject_id
  GROUP BY s.id, s.name
  ORDER BY average_vote DESC, total_votes DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top subjects by total votes (all time)
-- Shows all subjects, even those with no votes.
CREATE OR REPLACE FUNCTION get_most_voted_subjects(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  subject_id UUID,
  subject_name TEXT,
  total_votes BIGINT,
  average_vote NUMERIC,
  rank_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    COALESCE(SUM(v.vote_weight), 0) as total_votes,
    CASE 
      WHEN SUM(v.vote_weight) > 0 THEN ROUND(SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight), 2)
      ELSE 0
    END as average_vote,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(v.vote_weight), 0) DESC, (CASE WHEN SUM(v.vote_weight) > 0 THEN SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight) ELSE 0 END) DESC) as rank_position
  FROM subjects s
  LEFT JOIN votes v ON s.id = v.subject_id
  GROUP BY s.id, s.name
  ORDER BY total_votes DESC, average_vote DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get today's top subjects (show all subjects even if no votes today) - PST
CREATE OR REPLACE FUNCTION get_todays_top_subjects(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  subject_id UUID,
  subject_name TEXT,
  todays_votes BIGINT,
  average_vote NUMERIC,
  rank_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    COALESCE(SUM(v.vote_weight), 0) as todays_votes,
    CASE 
      WHEN SUM(v.vote_weight) > 0 THEN ROUND(SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight), 2)
      ELSE 0
    END as average_vote,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(v.vote_weight), 0) DESC, (CASE WHEN SUM(v.vote_weight) > 0 THEN SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight) ELSE 0 END) DESC) as rank_position
  FROM subjects s
  LEFT JOIN votes v ON s.id = v.subject_id AND (v.created_at AT TIME ZONE 'America/Los_Angeles')::date = (now() AT TIME ZONE 'America/Los_Angeles')::date
  GROUP BY s.id, s.name
  ORDER BY todays_votes DESC, average_vote DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get this week's trending subjects - PST
CREATE OR REPLACE FUNCTION get_weekly_trending_subjects(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  subject_id UUID,
  subject_name TEXT,
  weekly_votes BIGINT,
  average_vote NUMERIC,
  rank_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    COALESCE(SUM(v.vote_weight), 0) as weekly_votes,
    CASE 
      WHEN SUM(v.vote_weight) > 0 THEN ROUND(SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight), 2)
      ELSE 0
    END as average_vote,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(v.vote_weight), 0) DESC, (CASE WHEN SUM(v.vote_weight) > 0 THEN SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight) ELSE 0 END) DESC) as rank_position
  FROM subjects s
  LEFT JOIN votes v ON s.id = v.subject_id AND (v.created_at AT TIME ZONE 'America/Los_Angeles')::date >= ((now() AT TIME ZONE 'America/Los_Angeles')::date - INTERVAL '6 days')
  GROUP BY s.id, s.name
  ORDER BY weekly_votes DESC, average_vote DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get vote distribution over time (last 7 days) - Individual emoji votes - PST
CREATE OR REPLACE FUNCTION get_vote_trends_7_days()
RETURNS TABLE (
  date_label TEXT,
  total_votes BIGINT,
  skull_votes BIGINT,
  sleepy_votes BIGINT,
  heart_votes BIGINT,
  fire_votes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR((v.created_at AT TIME ZONE 'America/Los_Angeles')::date, 'Mon DD') as date_label,
    SUM(v.vote_weight) as total_votes,
    SUM(CASE WHEN v.vote_value = -2 THEN v.vote_weight ELSE 0 END) as skull_votes,
    SUM(CASE WHEN v.vote_value = -1 THEN v.vote_weight ELSE 0 END) as sleepy_votes,
    SUM(CASE WHEN v.vote_value = 1 THEN v.vote_weight ELSE 0 END) as heart_votes,
    SUM(CASE WHEN v.vote_value = 2 THEN v.vote_weight ELSE 0 END) as fire_votes
  FROM votes v
  WHERE (v.created_at AT TIME ZONE 'America/Los_Angeles')::date >= ((now() AT TIME ZONE 'America/Los_Angeles')::date - INTERVAL '6 days')
  GROUP BY (v.created_at AT TIME ZONE 'America/Los_Angeles')::date
  ORDER BY (v.created_at AT TIME ZONE 'America/Los_Angeles')::date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get hourly voting activity for today (show all hours even if no votes) - PST
CREATE OR REPLACE FUNCTION get_todays_hourly_activity()
RETURNS TABLE (
  hour_label TEXT,
  vote_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH hours AS (
    SELECT generate_series(0, 23) as hour
  ),
  vote_counts AS (
    SELECT 
      EXTRACT(hour FROM v.created_at AT TIME ZONE 'America/Los_Angeles') as hour,
      SUM(v.vote_weight) as vote_count
    FROM votes v
    WHERE (v.created_at AT TIME ZONE 'America/Los_Angeles')::date = (now() AT TIME ZONE 'America/Los_Angeles')::date
    GROUP BY EXTRACT(hour FROM v.created_at AT TIME ZONE 'America/Los_Angeles')
  )
  SELECT 
    TO_CHAR(h.hour, 'FM00') || ':00' as hour_label,
    COALESCE(vc.vote_count, 0) as vote_count
  FROM hours h
  LEFT JOIN vote_counts vc ON h.hour = vc.hour
  ORDER BY h.hour;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get subjects with biggest improvement (show all subjects, not just improved ones) - PST
CREATE OR REPLACE FUNCTION get_most_improved_subjects(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  subject_id UUID,
  subject_name TEXT,
  current_rating NUMERIC,
  previous_rating NUMERIC,
  improvement_score NUMERIC,
  rank_position INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH current_period AS (
    SELECT 
      v.subject_id as id,
      CASE WHEN SUM(v.vote_weight) > 0 THEN SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight) ELSE 0 END as current_avg
    FROM votes v
    WHERE (v.created_at AT TIME ZONE 'America/Los_Angeles')::date >= ((now() AT TIME ZONE 'America/Los_Angeles')::date - INTERVAL '6 days')
    GROUP BY v.subject_id
  ),
  previous_period AS (
    SELECT 
      v.subject_id as id,
      CASE WHEN SUM(v.vote_weight) > 0 THEN SUM(v.vote_value * v.vote_weight)::numeric / SUM(v.vote_weight) ELSE 0 END as previous_avg
    FROM votes v
    WHERE (v.created_at AT TIME ZONE 'America/Los_Angeles')::date BETWEEN ((now() AT TIME ZONE 'America/Los_Angeles')::date - INTERVAL '13 days') AND ((now() AT TIME ZONE 'America/Los_Angeles')::date - INTERVAL '7 days')
    GROUP BY v.subject_id
  )
  SELECT 
    s.id as subject_id,
    s.name as subject_name,
    ROUND(COALESCE(cp.current_avg, 0)::numeric, 2) as current_rating,
    ROUND(COALESCE(pp.previous_avg, 0)::numeric, 2) as previous_rating,
    ROUND((COALESCE(cp.current_avg, 0) - COALESCE(pp.previous_avg, 0))::numeric, 2) as improvement_score,
    ROW_NUMBER() OVER (ORDER BY (COALESCE(cp.current_avg, 0) - COALESCE(pp.previous_avg, 0)) DESC) as rank_position
  FROM subjects s
  LEFT JOIN current_period cp ON s.id = cp.id
  LEFT JOIN previous_period pp ON s.id = pp.id
  ORDER BY improvement_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Function to get emoji vote distribution (for pie chart)
CREATE OR REPLACE FUNCTION get_emoji_vote_distribution()
RETURNS TABLE (
  emoji_name TEXT,
  vote_count BIGINT,
  vote_percentage NUMERIC
) AS $$
DECLARE
  total_vote_weight BIGINT;
BEGIN
  total_vote_weight := (SELECT SUM(vote_weight) FROM votes);

  RETURN QUERY
  SELECT 
    CASE 
      WHEN v.vote_value = -2 THEN '💀 Way too hard'
      WHEN v.vote_value = -1 THEN '😴 Too boring'
      WHEN v.vote_value = 1 THEN '❤️ Loved the subject'
      WHEN v.vote_value = 2 THEN '🔥 Super fun'
    END as emoji_name,
    SUM(v.vote_weight) as vote_count,
    CASE 
      WHEN total_vote_weight > 0 THEN ROUND((SUM(v.vote_weight) * 100.0 / total_vote_weight)::numeric, 1)
      ELSE 0
    END as vote_percentage
  FROM votes v
  GROUP BY v.vote_value
  ORDER BY v.vote_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions for all functions
GRANT EXECUTE ON FUNCTION get_top_subjects_all_time(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_most_voted_subjects(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_todays_top_subjects(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_weekly_trending_subjects(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_vote_trends_7_days() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_todays_hourly_activity() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_most_improved_subjects(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_overall_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_emoji_vote_distribution() TO anon, authenticated; 