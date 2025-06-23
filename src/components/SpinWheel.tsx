import { useState, useEffect } from 'react'

const prizes = [
  { text: 'Vote\nAgain!', color: '#EF4444' }, // Red
  { text: 'Bonus\nSpin!', color: '#3B82F6' }, // Blue - NEW
  { text: 'LUCK\n404', color: '#6B7280' }, // Darker Gray
  { text: 'Double\nVote!', color: '#F59E0B' }, // Orange
  { text: 'Try\nAgain', color: '#10B981' }, // Green
  { text: 'Zzz...', color: '#4B5563' }, // Gray
  { text: 'So\nClose', color: '#8B5CF6' }, // Purple
  { text: 'Not\nToday', color: '#EC4899' }, // Pink
]

const LAST_SPIN_KEY = 'lastSpinTime'
const POWERUP_KEY = 'double-vote-powerup'

interface SpinWheelProps {
  isOpen: boolean
  onClose: () => void
}

export const SpinWheel = ({ isOpen, onClose }: SpinWheelProps) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [canSpin, setCanSpin] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [spinResult, setSpinResult] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return
    const lastSpinTime = localStorage.getItem(LAST_SPIN_KEY)
    if (lastSpinTime) {
      const timeSinceLastSpin = Date.now() - parseInt(lastSpinTime, 10)
      const oneDay = 24 * 60 * 60 * 1000
      setCanSpin(timeSinceLastSpin >= oneDay)
    } else {
      setCanSpin(true)
    }
  }, [isOpen])

  const handleSpin = (isBonusSpin = false) => {
    if (isSpinning || (!canSpin && !isBonusSpin)) return

    setIsSpinning(true)
    setSpinResult(null)
    
    // Only set spin time if it's not a bonus spin
    if (!isBonusSpin) {
      localStorage.setItem(LAST_SPIN_KEY, Date.now().toString())
    }
    
    const randomDegree = Math.floor(Math.random() * 360)
    const totalRotation = rotation + 360 * 5 + randomDegree
    setRotation(totalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      const segmentAngle = 360 / prizes.length
      const winningAngle = (360 - (totalRotation % 360)) % 360
      const prizeIndex = Math.floor(winningAngle / segmentAngle)
      const prize = prizes[prizeIndex]

      setSpinResult(prize.text.replace('\n', ' '))

      if (prize.text.includes('Vote')) {
        localStorage.setItem('vote-again-powerup', 'true')
      } else if (prize.text.includes('Double')) {
        localStorage.setItem('double-vote-powerup', 'true')
      } else if (prize.text.includes('Bonus')) {
        // Allow another spin immediately
        setCanSpin(true)
        // No need to set timeout, user can just spin again.
        return
      }
      
      setCanSpin(false)
    }, 5000)
  }

  if (!isOpen) return null
  
  const segmentAngle = 360 / prizes.length
  const conicGradient = prizes.map((p, i) => `${p.color} ${i * segmentAngle}deg, ${p.color} ${(i + 1) * segmentAngle}deg`).join(', ')

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center justify-center p-8 bg-black/90 rounded-3xl border border-red-500/30 shadow-2xl animate-in slide-in-from-top-5 duration-300 w-full max-w-md">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h3 className="font-display font-bold text-3xl mb-2 text-white">Daily Spin to Win!</h3>
        <p className="text-gray-300 mb-6">You get one free spin every 24 hours.</p>

        <div className="relative w-80 h-80 mb-6">
          {/* The entire spinning assembly */}
          <div
            className="absolute w-full h-full transition-transform duration-[5000ms] ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {/* 1. Wheel background */}
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `conic-gradient(${conicGradient})`,
                border: '4px solid #450a0a'
              }}
            />
            {/* 2. Text labels that spin with the wheel */}
            {prizes.map((prize, i) => {
              const angle = i * segmentAngle + segmentAngle / 2;
              return (
                <div
                  key={i}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className="flex justify-center items-start pt-5"
                    style={{
                      height: '50%',
                    }}
                  >
                    <div
                      className="text-center"
                      style={{
                        transform: 'rotate(180deg)',
                      }}
                    >
                      <span
                        className="font-display font-bold text-lg text-white whitespace-pre-wrap"
                        style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                      >
                        {prize.text}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pointer and center dot (non-rotating) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-0 h-0 
            border-l-[12px] border-l-transparent
            border-r-[12px] border-r-transparent
            border-t-[20px] border-t-white z-10 drop-shadow-lg"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full z-10 border-2 border-gray-800"></div>
        </div>

        <div className="h-24 flex flex-col justify-center items-center">
          {!isSpinning && spinResult && (
            <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg animate-in fade-in duration-300">
              <p className="font-bold text-lg text-yellow-300">You got: {spinResult}</p>
              {spinResult.includes('Bonus') && <p className="text-sm text-yellow-200">Spin again now!</p>}
            </div>
          )}
        </div>

        <button
          onClick={() => handleSpin()}
          disabled={isSpinning || !canSpin}
          className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg shadow-lg
            hover:scale-105 transition-transform duration-300
            disabled:bg-gray-700 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isSpinning ? 'Spinning...' : (canSpin ? 'SPIN THE WHEEL' : 'Come back tomorrow!')}
        </button>
      </div>
    </div>
  )
} 