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
} 