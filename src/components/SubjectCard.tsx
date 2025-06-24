import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Subject, SubjectStats } from '../lib/supabase'
import { getUserID, hasVoted, storeVote, getVoteValue, getFingerprint } from '../lib/userUtils'
import confetti from 'canvas-confetti'
import Select from 'react-select'
import { customSelectStyles } from '../lib/styleUtils'

const POWERUP_KEY = 'double-vote-powerup'

interface SubjectCardProps {
  subject: Subject
  onVoteSubmitted?: () => void
}

const emojis = ['💀', '😴', '❤️', '🔥']
const labels = ['Way too hard', 'Too boring', 'Loved the subject', 'Super Fun']
const values = [-2, -1, 1, 2]
const tags = ['good prof', 'bad prof', 'heavy workload', 'light workload', 'easy', 'hard']
const tagOptions = tags.map(tag => ({ value: tag, label: tag }))

export const SubjectCard = ({ subject, onVoteSubmitted }: SubjectCardProps) => {
  const [stats, setStats] = useState<SubjectStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [userVote, setUserVote] = useState<number | null>(null)
  const [hasUserVoted, setHasUserVoted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  useEffect(() => {
    loadStats()
    const voted = hasVoted(subject.id)
    setHasUserVoted(voted)
    if (voted) {
      setUserVote(getVoteValue(subject.id))
    }
  }, [subject.id])

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_subject_stats', { subject_uuid: subject.id })
      
      if (error) throw error
      if (data && data.length > 0) {
        setStats(data[0])
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleVote = async (voteValue: number) => {
    if (hasUserVoted) return

    setLoading(true)
    try {
      const userId = getUserID()
      const fingerprintId = await getFingerprint()
      const isDoubleVote = localStorage.getItem(POWERUP_KEY) === 'true'
      
      const votePayload = {
        user_id: userId,
        subject_id: subject.id,
        vote_value: voteValue,
        feedback: feedback.trim() || null,
        fingerprint_id: fingerprintId,
        vote_weight: isDoubleVote ? 2 : 1
      }
      
      /* TODO: increase tag count for each selected tag */

      const { data, error } = await supabase
        .from('votes')
        .insert(votePayload)
        .select()

      if (error) {
        console.error('Voting error details:', {
          error,
          userId,
          subjectId: subject.id,
          voteValue
        })
        // Handle unique constraint violation gracefully
        if (error.code === '23505') { // unique_violation
          alert('You have already voted for this subject from this device or browser.')
        } else {
          throw error
        }
      }

      console.log('Vote submitted successfully:', data)
      storeVote(subject.id, voteValue)
      setUserVote(voteValue)
      setHasUserVoted(true)

      // Remove power-up after use
      if (isDoubleVote) {
        localStorage.removeItem(POWERUP_KEY)
      }

      await loadStats()
      
      // Notify parent component that a vote was submitted
      if (onVoteSubmitted) {
        onVoteSubmitted()
      }
      
      if (voteValue > 0) {
        setShowCelebration(true)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF3B30', '#FF6B6B', '#FFD9D9']
        })
        setTimeout(() => setShowCelebration(false), 4000)
      }
    } catch (error) {
      console.error('Error voting:', error)
      alert('Failed to submit vote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getCoolOMeterPercentage = () => {
    if (!stats || stats.total_votes === 0) return 50
    // Convert average from -2 to +2 range to 0 to 100 percentage
    return Math.round(((stats.average_vote + 2) / 4) * 100)
  }

  return (
    <div className="subject-card group">
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-400/20 to-red-300/20 rounded-3xl animate-pulse z-10 pointer-events-none"></div>
      )}

      <div className="relative z-10">
        {/* Subject Title */}
        <h3 className="text-2xl sm:text-3xl font-bold text-gradient mb-3">
          {subject.name}
        </h3>

        {/* Speedometer */}
        <div className="mb-8">
          <div className="speedometer">
            <div 
              className="speedometer-needle"
              style={{ 
                transform: `rotate(${(getCoolOMeterPercentage() - 50) * 1.8}deg)`
              }}
            />
            <div className="absolute bottom-0 left-0 w-full">
              <div className="flex justify-between px-4 pb-2">
                <span className="text-xs text-red-400">Hard</span>
                <span className="text-xs text-green-400">Fun</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Section */}
        {!hasUserVoted ? (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleVote(values[index])}
                  onMouseEnter={() => setShowTooltip(index)}
                  onMouseLeave={() => setShowTooltip(null)}
                  disabled={loading}
                  className="relative group flex flex-col items-center p-4 rounded-2xl bg-black/60 border-2 border-red-500/30 hover:border-red-500/60 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-red-400/20 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
                >
                  <span className="text-3xl sm:text-4xl">{emoji}</span>
                  {showTooltip === index && (
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/95 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap border border-red-500/30 shadow-2xl">
                      {labels[index]}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Tag Selection */}
            <div>
              <Select
                isMulti
                options={tagOptions}
                value={selectedTags.map(tag => ({ value: tag, label: tag }))}
                onChange={(selected) => setSelectedTags(selected.map(s => s.value))}
                placeholder="Select tags (optional)"
                classNamePrefix="react-select"
                styles={customSelectStyles}
              />
            </div>

            {/* Feedback Input */}
            <div className="space-y-2">
              <textarea
                placeholder="Share your thoughts (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value.slice(0, 200))}
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-red-500/30 text-gray-100 placeholder-gray-400 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/30 transition-all duration-300 resize-none"
                rows={3}
              />
              <div className="text-right text-sm text-gray-400">
                {feedback.length}/200
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-100 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-red-400/20 border border-red-500/30">
            Thanks for voting! 🎉
          </div>
        )}
      </div>
    </div>
  )
} 