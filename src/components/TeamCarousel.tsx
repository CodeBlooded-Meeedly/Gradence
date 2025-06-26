import { useState, useEffect, useRef } from 'react'
import nayshaHeadshot from '../assets/nayshaheadshot.png'
import hetaviHeadshot from '../assets/hetaviheadshot.jpg'
import bryanHeadshot from '../assets/bryanheadshot.jpg'
import rylanHeadshot from '../assets/rylanheadshot.png'
import mulanHeadshot from '../assets/mulanheadshot.png'
import jaronHeadshot from '../assets/jaronheadshot.jpg'

interface TeamMember {
  id: number
  name: string
  role: string
  university: string
  linkedin: string
  headshot: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Naysha Jain",
    role: "Leader",
    university: "Knox College",
    linkedin: "https://www.linkedin.com/in/naysha-jain/",
    headshot: nayshaHeadshot
  },
  {
    id: 2,
    name: "Hetavi Mehta",
    role: "Lead Programmer",
    university: "Arizona State University",
    linkedin: "https://www.linkedin.com/in/hetavimehta22/",
    headshot: hetaviHeadshot
  },
  {
    id: 3,
    name: "Bryan Garcia",
    role: "Lead Marketer",
    university: "DePaul University",
    linkedin: "https://www.linkedin.com/in/bgarciacs/",
    headshot: bryanHeadshot
  },
  {
    id: 4,
    name: "Rylan Hurtado",
    role: "Advisor",
    university: "DePaul University",
    linkedin: "https://www.linkedin.com/in/rylanhurtado/",
    headshot: rylanHeadshot
  },
  {
    id: 5,
    name: "Mulan Liu",
    role: "Member",
    university: "University of Wisconsin-Madison",
    linkedin: "https://www.linkedin.com/in/mulan-liu-542071260/",
    headshot: mulanHeadshot
  },
  {
    id: 6,
    name: "Jaron Lin",
    role: "Member",
    university: "Cal Poly Pomona",
    linkedin: "https://www.linkedin.com/in/jaron-lin/",
    headshot: jaronHeadshot
  }
]

function getCardsPerView() {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 640) return 1 // mobile
    if (window.innerWidth < 1024) return 2 // tablet
    return 3 // desktop
  }
  return 3
}

export const TeamCarousel = () => {
  const [isPaused, setIsPaused] = useState(false)
  const [cardsPerView, setCardsPerView] = useState(getCardsPerView())
  const [cardWidth, setCardWidth] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => setCardsPerView(getCardsPerView())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Measure container width and set card width
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      setCardWidth(width / cardsPerView)
    }
  }, [cardsPerView])

  // Continuous animation
  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      return
    }
    let lastTimestamp = performance.now()
    const speed = 60 // px per second
    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastTimestamp
      lastTimestamp = timestamp
      setTranslateX(prev => {
        let next = prev - (speed * elapsed) / 1000
        // Reset for infinite loop
        const totalWidth = cardWidth * teamMembers.length
        if (Math.abs(next) >= totalWidth) {
          next += totalWidth
        }
        return next
      })
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPaused, cardWidth, cardsPerView])

  const handleCardClick = (linkedinUrl: string) => {
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer')
  }

  // Duplicate cards for seamless loop
  const displayMembers = [...teamMembers, ...teamMembers]

  return (
    <div className="bg-black/80 rounded-2xl p-6 border border-red-500/30 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gradient mb-2">👥 Our Team</h2>
          <p className="text-base text-gray-300">Meet the developers behind Gradence</p>
        </div>
      </div>

      <div 
        className="relative overflow-hidden flex items-center justify-center w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ minHeight: '350px' }}
        ref={containerRef}
      >
        <div
          className={`flex`}
          style={{
            width: displayMembers.length * cardWidth,
            transform: `translateX(${translateX}px)`,
            transition: isPaused ? 'none' : 'transform 0.03s linear',
          }}
        >
          {displayMembers.map((member, idx) => (
            <div 
              key={member.id + '-' + idx}
              className="team-card flex items-center justify-center px-4"
              style={{ width: cardWidth }}
            >
              <div 
                className="bg-black/60 rounded-xl p-8 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 w-full max-w-md mx-auto"
                onClick={() => handleCardClick(member.linkedin)}
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img 
                      src={member.headshot} 
                      alt={`${member.name}'s Headshot`} 
                      className="h-36 w-36 rounded-xl object-cover border-2 border-red-500/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-base text-red-400 font-medium mb-1">{member.role}</p>
                  <p className="text-base text-gray-400 text-center">{member.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 