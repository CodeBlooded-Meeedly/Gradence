import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type {
  OverallStats,
  Top3PositiveSubject,
  Top3BoringSubject,
} from '../lib/supabase'

const boringEmojis = ['🥵', '😴', '🥱']

function Top3Triangle({ data }: { data: Top3PositiveSubject[] }) {
  const [first, second, third] = [data[0], data[1], data[2]]
  return (
    <div className="flex flex-col items-center w-full">
      {/* Top row: 1st place */}
      <div className="flex justify-center mb-4">
        {first && (
          <div className="flex flex-col items-center bg-black/60 rounded-2xl border border-blue-500/30 shadow p-6 w-56">
            <span className="text-5xl mb-2">🥇</span>
            <span className="font-bold text-lg text-white text-center mb-1">{first.subject_name}</span>
            <span className="text-sm text-blue-200">{first.average_rating.toFixed(2)} avg rating</span>
          </div>
        )}
      </div>
      {/* Bottom row: 2nd and 3rd place */}
      <div className="flex flex-row justify-center gap-8">
        {second && (
          <div className="flex flex-col items-center bg-black/60 rounded-2xl border border-blue-500/30 shadow p-6 w-48">
            <span className="text-5xl mb-2">🥈</span>
            <span className="font-bold text-lg text-white text-center mb-1">{second.subject_name}</span>
            <span className="text-sm text-blue-200">{second.average_rating.toFixed(2)} avg rating</span>
          </div>
        )}
        {third && (
          <div className="flex flex-col items-center bg-black/60 rounded-2xl border border-blue-500/30 shadow p-6 w-48">
            <span className="text-5xl mb-2">🥉</span>
            <span className="font-bold text-lg text-white text-center mb-1">{third.subject_name}</span>
            <span className="text-sm text-blue-200">{third.average_rating.toFixed(2)} avg rating</span>
          </div>
        )}
      </div>
    </div>
  )
}

function Bottom3Triangle({ data }: { data: Top3BoringSubject[] }) {
  const [first, second, third] = [data[0], data[1], data[2]]
  return (
    <div className="flex flex-col items-center w-full">
      {/* Top row: 1st place (most boring) */}
      <div className="flex justify-center mb-4">
        {first && (
          <div className="flex flex-col items-center bg-black/60 rounded-2xl border border-purple-500/30 shadow p-6 w-56">
            <span className="text-5xl mb-2">{boringEmojis[0]}</span>
            <span className="font-bold text-lg text-white text-center mb-1">{first.subject_name}</span>
            <span className="text-sm text-purple-200">{first.total_rating_sum.toFixed(0)} total score</span>
          </div>
        )}
      </div>
      {/* Bottom row: 2nd and 3rd place */}
      <div className="flex flex-row justify-center gap-8">
        {second && (
          <div className="flex flex-col items-center bg-black/60 rounded-2xl border border-purple-500/30 shadow p-6 w-48">
            <span className="text-5xl mb-2">{boringEmojis[1]}</span>
            <span className="font-bold text-lg text-white text-center mb-1">{second.subject_name}</span>
            <span className="text-sm text-purple-200">{second.total_rating_sum.toFixed(0)} total score</span>
          </div>
        )}
        {third && (
          <div className="flex flex-col items-center bg-black/60 rounded-2xl border border-purple-500/30 shadow p-6 w-48">
            <span className="text-5xl mb-2">{boringEmojis[2]}</span>
            <span className="font-bold text-lg text-white text-center mb-1">{third.subject_name}</span>
            <span className="text-sm text-purple-200">{third.total_rating_sum.toFixed(0)} total score</span>
          </div>
        )}
      </div>
    </div>
  )
}

export const Leaderboard = () => {
  const [loading, setLoading] = useState(true)
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [top3Positive, setTop3Positive] = useState<Top3PositiveSubject[]>([])
  const [top3Boring, setTop3Boring] = useState<Top3BoringSubject[]>([])

  useEffect(() => {
    loadLeaderboardData()
    const votesSubscription = supabase
      .channel('votes_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        },
        () => loadLeaderboardData()
      )
      .subscribe()
    return () => {
      votesSubscription.unsubscribe()
    }
  }, [])

  const loadLeaderboardData = async () => {
    try {
      setLoading(true)
      const [
        overallStatsResult,
        top3PositiveResult,
        top3BoringResult
      ] = await Promise.all([
        supabase.rpc('get_overall_stats'),
        supabase.rpc('get_top_3_positive_subjects'),
        supabase.rpc('get_top_3_boring_subjects')
      ])
      if (overallStatsResult.data) setOverallStats(overallStatsResult.data[0])
      if (top3PositiveResult.data) setTop3Positive(top3PositiveResult.data)
      if (top3BoringResult.data) setTop3Boring(top3BoringResult.data)
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
      {/* Top 3 Best Voted Subjects and 3 Most Boring Subjects side by side */}
      <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-start gap-8 w-full">
        {/* Left: Top 3 Best Voted Subjects */}
        <div className="flex-1 flex flex-col items-center bg-black/60 rounded-2xl border-2 border-blue-400/40 shadow-lg p-4">
          <h3 className="text-xl font-bold text-blue-300 mb-6 flex items-center">💙 Top 3 Best Voted Subjects</h3>
          <Top3Triangle data={top3Positive} />
        </div>
        {/* Right: 3 Most Boring Subjects */}
        <div className="flex-1 flex flex-col items-center bg-black/60 rounded-2xl border-2 border-purple-400/40 shadow-lg p-4">
          <h3 className="text-xl font-bold text-purple-300 mb-6 flex items-center">😴 3 Most Boring Subjects</h3>
          <Bottom3Triangle data={top3Boring} />
        </div>
      </div>
    </div>
  )
} 