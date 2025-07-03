import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { VotesPastHour } from '../lib/supabase'

interface VotesPastHourPopupProps {
  className?: string
}

export const VotesPastHourPopup = ({ className = '' }: VotesPastHourPopupProps) => {
  const [votesPastHour, setVotesPastHour] = useState<VotesPastHour | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVotesPastHour()
    
    // Set up real-time subscription for votes table
    const votesSubscription = supabase
      .channel('votes_past_hour_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes'
        },
        () => loadVotesPastHour()
      )
      .subscribe()

    // Update every minute to keep the hour count accurate
    const interval = setInterval(loadVotesPastHour, 60000)

    // Cleanup subscription and interval on unmount
    return () => {
      votesSubscription.unsubscribe()
      clearInterval(interval)
    }
  }, [])

  const loadVotesPastHour = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.rpc('get_votes_past_hour')
      if (error) throw error
      setVotesPastHour(data?.[0] || null)
    } catch (error) {
      console.error('Error loading votes past hour:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`bg-black/90 rounded-xl p-4 border border-red-500/30 shadow-2xl ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent mr-2"></div>
          <span className="text-gray-300 text-sm">Loading...</span>
        </div>
      </div>
    )
  }

  if (!votesPastHour) {
    return null
  }

  return (
    <div className={`bg-black/90 rounded-xl p-4 border border-red-500/30 shadow-2xl backdrop-blur-sm ${className}`}>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-400 mb-1">
          {votesPastHour.votes_past_hour}
        </div>
        <div className="text-gray-300 text-sm mb-2">
          votes in the past hour
        </div>
        <div className="text-xs text-gray-400">
          {votesPastHour.unique_voters_past_hour} unique voters
        </div>
      </div>
    </div>
  )
} 