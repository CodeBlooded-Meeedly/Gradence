import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { 
  TopSubject, 
  MostVotedSubject, 
  TodaysTopSubject, 
  WeeklyTrendingSubject,
  VoteTrend,
  HourlyActivity,
  MostImprovedSubject,
  OverallStats,
  EmojiVoteDistribution
} from '../../lib/supabase'
import {
  VoteTrendsChart,
  HourlyActivityChart,
  TopSubjectsChart,
  VoteDistributionChart,
  WeeklyTrendsChart,
  ImprovementChart
} from './index'

interface ChartGalleryProps {
  topSubjects: TopSubject[]
  mostVoted: MostVotedSubject[]
  todaysTop: TodaysTopSubject[]
  weeklyTrending: WeeklyTrendingSubject[]
  voteTrends: VoteTrend[]
  hourlyActivity: HourlyActivity[]
  mostImproved: MostImprovedSubject[]
  overallStats: OverallStats | null
}

export const ChartGallery = ({
  topSubjects,
  mostVoted,
  todaysTop,
  weeklyTrending,
  voteTrends,
  hourlyActivity,
  mostImproved,
  overallStats
}: ChartGalleryProps) => {
  const [selectedChart, setSelectedChart] = useState<string | null>(null)
  const [emojiVoteDistribution, setEmojiVoteDistribution] = useState<EmojiVoteDistribution[]>([])

  useEffect(() => {
    loadEmojiVoteDistribution()
    
    // Set up real-time subscription for votes table to refresh emoji distribution
    const votesSubscription = supabase
      .channel('votes_changes_gallery')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        },
        (payload) => {
          console.log('New vote detected in gallery:', payload)
          // Reload emoji vote distribution when a new vote is added
          loadEmojiVoteDistribution()
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      votesSubscription.unsubscribe()
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
      id: 'vote-trends',
      title: '📈 Vote Trends (7 Days)',
      description: 'Line chart showing voting patterns over the last week',
      component: voteTrends.length > 0 ? <VoteTrendsChart data={voteTrends} /> : null,
      available: voteTrends.length > 0
    },
    {
      id: 'hourly-activity',
      title: '⚡ Hourly Activity',
      description: 'Bar chart showing today\'s voting activity by hour',
      component: hourlyActivity.length > 0 ? <HourlyActivityChart data={hourlyActivity} /> : null,
      available: hourlyActivity.length > 0
    },
    {
      id: 'top-rated',
      title: '🥇 Top Rated Subjects',
      description: 'Horizontal bar chart of highest rated subjects',
      component: <TopSubjectsChart data={topSubjects} title="" dataKey="average_vote" colorKey="vote" />,
      available: topSubjects.length > 0
    },
    {
      id: 'most-voted',
      title: '🗳️ Most Voted Subjects',
      description: 'Horizontal bar chart of subjects with most votes',
      component: <TopSubjectsChart data={mostVoted} title="" dataKey="total_votes" colorKey="count" />,
      available: mostVoted.length > 0
    },
    {
      id: 'vote-distribution',
      title: '📊 Vote Distribution',
      description: 'Pie chart showing emoji vote percentages',
      component: emojiVoteDistribution.length > 0 ? <VoteDistributionChart data={emojiVoteDistribution} /> : null,
      available: emojiVoteDistribution.length > 0
    },
    {
      id: 'weekly-trends',
      title: '📈 Weekly Trending',
      description: 'Combo chart showing weekly votes and ratings',
      component: <WeeklyTrendsChart data={weeklyTrending} />,
      available: weeklyTrending.length > 0
    },
    {
      id: 'improvement',
      title: '📈 Most Improved',
      description: 'Horizontal bar chart showing subject improvements',
      component: <ImprovementChart data={mostImproved} />,
      available: mostImproved.length > 0
    }
  ]

  const availableCharts = charts.filter(chart => chart.available)

  // Debug logging
  console.log('Chart availability:', {
    voteTrends: voteTrends.length,
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
              <p className="text-gray-300 text-sm">{chart.description}</p>
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
        <p className="text-gray-300 text-sm">Interactive visualizations of voting data</p>
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
            <p className="text-gray-300 text-sm mb-4">{chart.description}</p>
            
            {/* Mini preview */}
            <div className="h-24 bg-gradient-to-br from-red-500/20 to-red-400/20 rounded-lg flex items-center justify-center">
              <div className="text-4xl opacity-50">
                {chart.title.includes('📈') && '📈'}
                {chart.title.includes('⚡') && '⚡'}
                {chart.title.includes('🥇') && '🥇'}
                {chart.title.includes('🗳️') && '🗳️'}
                {chart.title.includes('📊') && '📊'}
              </div>
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