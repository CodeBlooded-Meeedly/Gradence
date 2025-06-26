import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { 
  TopSubject, 
  MostVotedSubject, 
  WeeklyTrendingSubject,
  VoteTrend,
  HourlyActivity,
  MostImprovedSubject,
  OverallStats
} from '../lib/supabase'
import { ChartGallery } from './charts'

export const Leaderboard = () => {
  const [loading, setLoading] = useState(true)
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [topSubjects, setTopSubjects] = useState<TopSubject[]>([])
  const [mostVoted, setMostVoted] = useState<MostVotedSubject[]>([])
  const [weeklyTrending, setWeeklyTrending] = useState<WeeklyTrendingSubject[]>([])
  const [voteTrends, setVoteTrends] = useState<VoteTrend[]>([])
  const [hourlyActivity, setHourlyActivity] = useState<HourlyActivity[]>([])
  const [mostImproved, setMostImproved] = useState<MostImprovedSubject[]>([])

  useEffect(() => {
    loadLeaderboardData()
    
    // Set up real-time subscription for votes table
    const votesSubscription = supabase
      .channel('votes_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        },
        (payload) => {
          console.log('New vote detected:', payload)
          // Reload data when a new vote is added
          loadLeaderboardData()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      votesSubscription.unsubscribe()
    }
  }, [])

  const loadLeaderboardData = async () => {
    try {
      setLoading(true)
      
      const [
        statsResult,
        topResult,
        mostVotedResult,
        todaysResult,
        weeklyResult,
        trendsResult,
        hourlyResult,
        improvedResult
      ] = await Promise.all([
        supabase.rpc('get_overall_stats'),
        supabase.rpc('get_top_subjects_all_time', { limit_count: 10 }),
        supabase.rpc('get_most_voted_subjects', { limit_count: 10 }),
        supabase.rpc('get_todays_top_subjects', { limit_count: 5 }),
        supabase.rpc('get_weekly_trending_subjects', { limit_count: 5 }),
        supabase.rpc('get_vote_trends_7_days'),
        supabase.rpc('get_todays_hourly_activity'),
        supabase.rpc('get_most_improved_subjects', { limit_count: 5 })
      ])

      // Debug logging with errors
      console.log('Leaderboard data loaded:', {
        stats: { data: statsResult.data?.length, error: statsResult.error },
        top: { data: topResult.data?.length, error: topResult.error },
        mostVoted: { data: mostVotedResult.data?.length, error: mostVotedResult.error },
        todays: { data: todaysResult.data?.length, error: todaysResult.error },
        weekly: { data: weeklyResult.data?.length, error: weeklyResult.error },
        trends: { data: trendsResult.data?.length, error: trendsResult.error },
        hourly: { data: hourlyResult.data?.length, error: hourlyResult.error },
        improved: { data: improvedResult.data?.length, error: improvedResult.error }
      })

      if (statsResult.data) setOverallStats(statsResult.data[0])
      if (topResult.data) setTopSubjects(topResult.data)
      if (mostVotedResult.data) setMostVoted(mostVotedResult.data)
      if (weeklyResult.data) setWeeklyTrending(weeklyResult.data)
      if (trendsResult.data) setVoteTrends(trendsResult.data)
      if (hourlyResult.data) setHourlyActivity(hourlyResult.data)
      if (improvedResult.data) setMostImproved(improvedResult.data)

    } catch (error) {
      console.error('Error loading leaderboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-black/80 rounded-2xl p-8 border border-red-500/30 shadow-2xl">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent mr-3"></div>
          <span className="text-gray-300">Loading live leaderboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black/80 rounded-2xl p-6 border border-red-500/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gradient mb-2">🏆 Live Leaderboard</h2>
          <p className="text-gray-300 text-base">Real-time voting statistics and trends</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-base text-gray-400">Live</span>
        </div>
      </div>

      {overallStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/60 rounded-xl p-4 text-center border border-red-500/30">
            <div className="text-4xl font-bold text-white">{overallStats.total_subjects}</div>
            <div className="text-base text-gray-400">Subjects</div>
          </div>
          <div className="bg-black/60 rounded-xl p-4 text-center border border-red-500/30">
            <div className="text-4xl font-bold text-white">{overallStats.total_votes}</div>
            <div className="text-base text-gray-400">Total Votes</div>
          </div>
          <div className="bg-black/60 rounded-xl p-4 text-center border border-red-500/30">
            <div className="text-4xl font-bold text-white">{overallStats.total_users}</div>
            <div className="text-base text-gray-400">Voters</div>
          </div>
          <div className="bg-black/60 rounded-xl p-4 text-center border border-red-500/30">
            <div className="text-4xl font-bold text-red-400">{overallStats.average_vote}</div>
            <div className="text-base text-gray-400">Avg Rating</div>
          </div>
        </div>
      )}

      <ChartGallery
        topSubjects={topSubjects}
        mostVoted={mostVoted}
        weeklyTrending={weeklyTrending}
        voteTrends={voteTrends}
        hourlyActivity={hourlyActivity}
        mostImproved={mostImproved}
      />
    </div>
  )
} 