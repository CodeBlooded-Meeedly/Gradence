import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Subject, SubjectStats } from '../lib/supabase'
import { getUserID, hasVoted, storeVote, getFingerprint } from '../lib/userUtils'
import Select from 'react-select'
import { customSelectStyles } from '../lib/styleUtils'
import { useRef } from 'react'

interface SubjectCardProps {
  subject: Subject
  tags: string[]
  onVoteSubmitted?: () => void
}

const emojis = ['💀', '😴', '❤️', '🔥']
const labels = ['Way too hard', 'Too boring', 'Loved the subject', 'Super Fun']
const values = [-2, -1, 1, 2]

function ConfettiOverlay() {
  const canvasRef = useRef(null);
  useEffect(() => {
    import('canvas-confetti').then(confetti => {
      if (canvasRef.current) {
        confetti.create(canvasRef.current, { resize: true, useWorker: true })({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF3B30', '#FF6B6B', '#FFD9D9', '#FBBF24', '#FDE68A'],
        });
      }
    });
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-30" />;
}

export const SubjectCard = ({ subject, tags, onVoteSubmitted }: SubjectCardProps) => {
  const tagOptions = tags.map(tag => ({ value: tag, label: tag }))

  const [stats, setStats] = useState<SubjectStats | null>(null)
  const [topTags, setTopTags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [hasUserVoted, setHasUserVoted] = useState(false)
  const [canVoteAgain, setCanVoteAgain] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSad, setShowSad] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [showTooltip, setShowTooltip] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedVote, setSelectedVote] = useState<number | null>(null)

  useEffect(() => {
    loadStats()
    const voted = hasVoted(subject.id)
    setHasUserVoted(voted)
    setCanVoteAgain(voted && localStorage.getItem('vote-again-powerup') === 'true')
  }, [subject.id])

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_subject_stats', { subject_uuid: subject.id })
      
      if (error) throw error
      if (data && data.length > 0) {
        setStats(data[0])
      }

      // top tags
      const tagDistribution = data[0].tags
      const top3Tags = tagDistribution ?
        Object.entries(tagDistribution as Record<string, number>)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([key]) => key)
        : []
      setTopTags(top3Tags)

    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleVoteSelection = (voteValue: number) => {
    setSelectedVote(voteValue)
  }

  const handleSubmitVote = async () => {
    if (selectedVote === null || (hasUserVoted && !canVoteAgain)) return

    setLoading(true)
    try {
      const userId = getUserID()
      const fingerprintId = await getFingerprint()
      const isDoubleVote = localStorage.getItem('double-vote-powerup') === 'true'
      const voteWeight = isDoubleVote ? 2 : 1
      const votePayload = {
        user_id: userId,
        subject_id: subject.id,
        vote_value: selectedVote,
        vote_weight: voteWeight,
        feedback: feedback.trim() || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        fingerprint_id: fingerprintId
      }

      const { data, error } = await supabase
        .from('votes')
        .upsert([votePayload], { onConflict: 'user_id,subject_id' })
        .select()

      if (error) {
        console.error('Voting error details:', {
          error,
          userId,
          subjectId: subject.id,
          voteValue: selectedVote
        })
        // Handle unique constraint violation gracefully
        if (error.code === '23505') { // unique_violation
          alert('You have already voted for this subject from this device or browser.')
        } else {
          throw error
        }
      }

      // add tag votes to backend (insert into tag_votes, not votes)
      if (selectedTags.length > 0) {
        const tagInsertData = selectedTags.map(tag => ({
          subject_id: subject.id,
          tag
        }))
        const { error: tagError } = await supabase
          .from('tag_votes')
          .insert(tagInsertData)
        if (tagError) {
          console.error('Tag vote insert error:', JSON.stringify(tagError, null, 2));
        }
      }

      console.log('Vote submitted successfully:', data)
      storeVote(subject.id, selectedVote)
      setHasUserVoted(true)

      // Remove power-ups after use
      if (isDoubleVote) {
        localStorage.removeItem('double-vote-powerup')
      }
      if (canVoteAgain) {
        localStorage.removeItem('vote-again-powerup')
        setCanVoteAgain(false)
      }

      await loadStats()
      console.log(stats)
      
      // Notify parent component that a vote was submitted
      if (onVoteSubmitted) {
        onVoteSubmitted()
      }
      
      if (selectedVote > 0) {
        setShowCelebration(true)
        // Launch confetti on the card itself
        setTimeout(() => setShowCelebration(false), 2500)
      } else if (selectedVote < 0) {
        setShowSad(true)
        setTimeout(() => setShowSad(false), 2500)
      }

      // Reset vote selection
      setSelectedVote(null)
    } catch (error) {
      console.error('Error voting:', error)
      alert('Failed to submit vote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelVote = () => {
    setSelectedVote(null)
  }

  const getCoolOMeterPercentage = () => {
    if (!stats || stats.total_votes === 0) return 50
    // Convert average from -2 to +2 range to 0 to 100 percentage
    return Math.round(((stats.average_vote + 2) / 4) * 100)
  }

  return (
    <div className="subject-card group relative">
      {showCelebration && (
        <>
          <ConfettiOverlay />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 z-20 animate-fade-in">
            <div className="mt-4 text-2xl text-yellow-300 font-bold drop-shadow-lg">Super!</div>
          </div>
        </>
      )}
      {showSad && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20 animate-fade-in">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M40 70s-18-13.5-26-22C6 41 4 32 12 25c7-6 17-2 20 5 3-7 13-11 20-5 8 7 6 16-2 23-8 8.5-26 22-26 22z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
            <path d="M40 70L32 50l8-10-8-8 8-10" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-4 text-2xl text-red-300 font-bold drop-shadow-lg">Ouch!</div>
        </div>
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

        {/* display top tags */}
        {topTags.length != 0 && (
          <div className="flex">
            {topTags.map(tag => {
              return <p key={tag} className="inline-block bg-[#b06dcd]/50 px-2 py-1 rounded mb-6 mr-2 text-sm">{tag}</p>
            })}
          </div>
        )}

        {/* Voting Section */}
        {localStorage.getItem('double-vote-powerup') === 'true' && !hasUserVoted && (
          <div className="mb-4 text-yellow-400 font-bold animate-pulse text-center">
            Double Vote Active! Your next vote will count double.
          </div>
        )}
        {canVoteAgain && hasUserVoted && (
          <div className="mb-4 text-blue-400 font-bold animate-pulse text-center">
            Vote Again Active! You can vote again for this subject.
          </div>
        )}
        {!hasUserVoted || canVoteAgain ? (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleVoteSelection(values[index])}
                  onMouseEnter={() => setShowTooltip(index)}
                  onMouseLeave={() => setShowTooltip(null)}
                  disabled={loading}
                  className={`relative group flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110 ${
                    selectedVote === values[index]
                      ? 'bg-gradient-to-br from-red-500/40 to-red-400/40 border-red-500/80 scale-105'
                      : 'bg-black/60 border-red-500/30 hover:border-red-500/60 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-red-400/20'
                  }`}
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

            {/* Always show submit button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSubmitVote}
                disabled={loading || selectedVote === null}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'Submitting...' : 'Submit Vote'}
              </button>
              <button
                onClick={handleCancelVote}
                disabled={loading}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
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