import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { 
  TopSubject,
  MostVotedSubject,
  WeeklyTrendingSubject,
  HourlyActivity,
  MostImprovedSubject,
  EmojiVoteDistribution,
  TodaysTop3Subject,
  Top3PositiveSubject,
  Top3BoringSubject
} from '../../lib/supabase'
import {
  VoteTrendsChart,
  Top3PositiveChart,
  Top3BoringChart
} from './index'

interface ChartGalleryProps {
  topSubjects: TopSubject[]
  mostVoted: MostVotedSubject[]
  weeklyTrending: WeeklyTrendingSubject[]
  hourlyActivity: HourlyActivity[]
  mostImproved: MostImprovedSubject[]
  todaysTop3?: TodaysTop3Subject[]
  top3Positive?: Top3PositiveSubject[]
  top3Boring?: Top3BoringSubject[]
}

export const ChartGallery = ({
  topSubjects,
  mostVoted,
  weeklyTrending,
  hourlyActivity,
  mostImproved,
  todaysTop3 = [],
  top3Positive = [],
  top3Boring = []
}: ChartGalleryProps) => {
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [emojiVoteDistribution, setEmojiVoteDistribution] = useState<EmojiVoteDistribution[]>([])

  useEffect(() => {
    loadEmojiVoteDistribution()
    // Use a unique channel name per component instance
    const channelName = `votes_changes_gallery_${Math.random().toString(36).substring(2, 10)}`
    const votesSubscription = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        },
        (payload) => {
          console.log('New vote detected in gallery:', payload)
          loadEmojiVoteDistribution()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(votesSubscription)
    }
  }, [])

  const loadEmojiVoteDistribution = async () => {
    try {
      const { data, error } = await supabase.rpc('get_emoji_vote_distribution')
      if (error) throw error
      setEmojiVoteDistribution(data || [])
      console.log('Emoji vote distribution loaded:', data?.length)
    } catch (error) {
      console.error('Error loading emoji vote distribution:', error)
    }
  }

  const charts = [
    {
      id: 'top-3-positive',
      title: '❤️ Top 3 Best Voted Subjects',
      description: 'Horizontal bar chart of highest rated subjects by aggregate score',
      component: top3Positive.length > 0 ? <Top3PositiveChart data={top3Positive} /> : null,
      available: true
    },
    {
      id: 'top-3-boring',
      title: '😴 3 Most Boring Subjects',
      description: 'Horizontal bar chart of lowest rated subjects',
      component: top3Boring.length > 0 ? <Top3BoringChart data={top3Boring} /> : null,
      available: true
    },
    {
      id: 'weekly-trends',
      title: '📈 Weekly Voting Trends',
      description: 'Line chart showing voting patterns for the last week',
      component: weeklyTrending.length > 0 ? <VoteTrendsChart data={weeklyTrending} /> : null,
      available: true
    }
  ]

  // Show all charts, even if data is empty
  const availableCharts = charts // no filter

  // Debug logging
  console.log('Chart availability:', {
    todaysTop3: todaysTop3.length,
    top3Positive: top3Positive.length,
    top3Boring: top3Boring.length,
    voteTrends: weeklyTrending.length,
    hourlyActivity: hourlyActivity.length,
    topSubjects: topSubjects.length,
    mostVoted: mostVoted.length,
    emojiVoteDistribution: emojiVoteDistribution.length,
    weeklyTrending: weeklyTrending.length,
    mostImproved: mostImproved.length,
    availableCharts: availableCharts.length
  })

  if (selectedChart) {
    const chart = charts.find(c => c.id === selectedChart)
    if (chart) {
      return (
        <div className="bg-black/80 rounded-2xl p-6 border border-red-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gradient mb-2">{chart.title}</h2>
              <p className="text-gray-300 text-base">{chart.description}</p>
            </div>
            <button
              onClick={() => setSelectedChart(null)}
              className="btn-primary bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400"
            >
              ← Back to Gallery
            </button>
          </div>
          <div className="bg-black/60 rounded-lg p-4 border border-red-500/30">
            {chart.component}
          </div>
        </div>
      )
    }
  }

  return (
    <div className="bg-black/80 rounded-2xl p-6 border border-red-500/30 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient mb-2">📊 Chart Gallery</h2>
        <p className="text-gray-300 text-base">Interactive visualizations of voting data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableCharts.map((chart) => (
          <div
            key={chart.id}
            onClick={() => setSelectedChart(chart.id)}
            className="bg-black/60 rounded-lg p-4 border border-red-500/30 cursor-pointer hover:border-red-500/50 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-red-400/20 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white group-hover:text-red-300 transition-colors">
                {chart.title}
              </h3>
              <div className="text-gray-400 group-hover:text-red-400 transition-colors">
                →
              </div>
            </div>
            <p className="text-gray-300 text-base mb-4">{chart.description}</p>
            {/* Mini preview */}
            <div className="h-24 bg-gradient-to-br from-red-500/20 to-red-400/20 rounded-lg flex items-center justify-center">
              {chart.component ? (
              <div className="text-4xl opacity-50">
                  {chart.title.includes('🥇') && '🥇'}
                  {chart.title.includes('❤️') && '❤️'}
                  {chart.title.includes('😴') && '😴'}
                {chart.title.includes('📈') && '📈'}
              </div>
              ) : (
                <span className="text-gray-400 text-sm">No data</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {availableCharts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">No charts available yet</h3>
          <p className="text-gray-300">Start voting to see beautiful visualizations!</p>
        </div>
      )}
    </div>
  )
} 