import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/autoplay'
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

export const TeamCarousel = () => {
  const handleCardClick = (linkedinUrl: string) => {
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-black/80 rounded-2xl p-4 sm:p-6 border border-red-500/30 shadow-2xl">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gradient mb-1 sm:mb-2">👥 Our Team</h2>
          <p className="text-sm sm:text-base text-gray-300">Meet the developers behind Gradence</p>
        </div>
      </div>
      <Swiper
        modules={[Autoplay]}
        loop={true}
        freeMode={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={4000}
        slidesPerView={1}
        allowTouchMove={false}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="w-full"
        initialSlide={0}
      >
        {teamMembers.map((member) => (
          <SwiperSlide key={member.id}>
            <div className="team-card flex items-center justify-center px-2 sm:px-4 h-full">
              <div
                className="bg-black/60 rounded-xl p-4 sm:p-6 lg:p-8 border border-red-500/30 hover:border-red-400/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 w-full max-w-sm mx-auto"
                onClick={() => handleCardClick(member.linkedin)}
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <img
                      src={member.headshot}
                      alt={`${member.name}'s Headshot`}
                      className="h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-xl object-cover border-2 border-red-500/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 text-center">{member.name}</h3>
                  <p className="text-sm sm:text-base text-red-400 font-medium mb-1 text-center">{member.role}</p>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-400 text-center">{member.university}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
} 