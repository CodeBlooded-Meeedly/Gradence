import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Subject {
  id: string
  name: string
  major?: string
  university: string
  created_at: string
  updated_at: string
}

export interface Vote {
  id: string
  user_id: string
  subject_id: string
  vote_value: -2 | -1 | 1 | 2
  feedback: string | null
  created_at: string
  updated_at: string
}

export interface SubjectStats {
  subject_id: string
  subject_name: string
  total_votes: number
  average_vote: number
  vote_distribution: {
    '-2': number
    '-1': number
    '1': number
    '2': number
  }
  tags: {
    'good prof': number
    'bad prof': number
    'heavy workload': number
    'light workload': number
    'easy': number
    'hard': number
  }
}

// Leaderboard Types
export interface TopSubject {
  subject_id: string
  subject_name: string
  average_vote: number
  total_votes: number
  rank_position: number
}

export interface MostVotedSubject {
  subject_id: string
  subject_name: string
  total_votes: number
  average_vote: number
  rank_position: number
}

export interface TodaysTopSubject {
  subject_id: string
  subject_name: string
  todays_votes: number
  average_vote: number
  rank_position: number
}

export interface WeeklyTrendingSubject {
  subject_id: string
  subject_name: string
  weekly_votes: number
  average_vote: number
  rank_position: number
}

export interface HourlyActivity {
  hour_label: string
  vote_count: number
}

export interface MostImprovedSubject {
  subject_id: string
  subject_name: string
  current_rating: number
  previous_rating: number
  improvement_score: number
  rank_position: number
}

export interface OverallStats {
  total_subjects: number
  total_votes: number
  total_users: number
  average_vote: number
  positive_vote_percentage: number
  negative_vote_percentage: number
}

export interface EmojiVoteDistribution {
  emoji_name: string
  vote_count: number
  vote_percentage: number
}

// New types for enhanced leaderboard
export interface TodaysTop3Subject {
  subject_id: string
  subject_name: string
  todays_votes: number
  average_vote: number
  rank_position: number
}

export interface Top3PositiveSubject {
  subject_id: string
  subject_name: string
  total_votes: number
  average_rating: number
  rank_position: number
}

export interface Top3BoringSubject {
  subject_id: string
  subject_name: string
  total_votes: number
  total_rating_sum: number
  rank_position: number
}

export interface VotesPastHour {
  votes_past_hour: number
  unique_voters_past_hour: number
} 