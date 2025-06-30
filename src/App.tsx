import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import type { Subject } from './lib/supabase'
import { SubjectCard } from './components/SubjectCard'
import { Leaderboard } from './components/Leaderboard'
import { TeamCarousel } from './components/TeamCarousel'
import { ShareButton } from './components/ShareButton'
import { SpinWheel } from './components/SpinWheel'
import Select, { type SingleValue } from "react-select"
import { customSelectStyles2, customSingleSelectStyle } from './lib/styleUtils'
import { Pagination } from "react-bootstrap"
import './lib/customPagination.css'
import AddCourseModal from './components/AddCourseModal' 

const VISITED_KEY = 'gradence-has-visited'
const tags = ['good prof', 'bad prof', 'heavy workload', 'light workload', 'easy', 'hard']
const tagOptions = tags.map(tag => ({ value: tag, label: tag }))
type OptionType = { label: string; value: string };
const itemsPerPage = 9

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [majorOptions, setMajorOptions] = useState<string[]>([]) // stores unique majors for filtering
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null) //allows filtering by major
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leaderboardKey, setLeaderboardKey] = useState(0)
  const [isSpinWheelModalOpen, setIsSpinWheelModalOpen] = useState(false)
  const [courseQuery, setCourseQuery] = useState<string>('')
  const [tagQuery, setTagQuery] = useState<string[]>([])
  const [universityOptions, setUniversityOptions] = useState<string[]>([])
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [curPage, setCurPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadSubjects()
    
    // Auto-open wheel on first visit
    const hasVisited = localStorage.getItem(VISITED_KEY)
    if (!hasVisited) {
      setIsSpinWheelModalOpen(true)
      localStorage.setItem(VISITED_KEY, 'true')
    }
  }, [])

  useEffect(() => {
    filterSubjects()
    setCurPage(1)
  }, [subjects, courseQuery, selectedMajor, selectedUniversity, tagQuery])

  const loadSubjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error
      setSubjects(data || [])
      setFilteredSubjects(data || [])
      setTotalPages(Math.ceil(data.length/itemsPerPage))

      const uniqueMajors = Array.from( // extract unique majors from subjects
        new Set((data || []).map(subject => subject.major).filter(Boolean))
      )
      setMajorOptions(uniqueMajors)

      const uniqueUniversities = Array.from(
        new Set((data || []).map(s => s.university).filter(Boolean))
      )
      setUniversityOptions(uniqueUniversities)

    } catch (err) {
      console.error('Error loading subjects:', err)
      setError('Failed to load subjects. Please check your Supabase configuration.')
    } finally {
      setLoading(false)
    }
  }

  const filterSubjects = () => {
    const nameFiltered = getFilteredSubjectsByName()
    const majorFiltered = getFilteredSubjectsByMajor(nameFiltered)
    const universityFiltered = getFilteredSubjectsByUniversity(majorFiltered)
    const filterByTag = async () => {
      const final = await getFilteredSubjectsByTags(universityFiltered)
      setFilteredSubjects(final)
      setTotalPages(Math.ceil(final.length/itemsPerPage))
    }
    
    filterByTag()
  }

  // returns list of subjects containing searched name
  const getFilteredSubjectsByName = () => {
    const subset = subjects.filter(subject => {
      const subject_name = subject.name.trim().toLowerCase()
      return subject_name.includes(courseQuery.trim().toLowerCase())
    })
    return subset
  }

  // returns list of uninversities containing searched name
  const getFilteredSubjectsByUniversity = (list: Subject[]) => {
    if (!selectedUniversity) return list
    return list.filter(
      s => s.university?.toLowerCase() === selectedUniversity.toLowerCase()
    )
  }

  // returns list of subjects matching searched major
  const getFilteredSubjectsByMajor = (subjectList: Subject[]) => {
    if (!selectedMajor) return subjectList
    return subjectList.filter(subject => subject.major?.toLowerCase() === selectedMajor.toLowerCase())
  }

  // returns list of subjects containing all searched tags
  const getFilteredSubjectsByTags = async (subjectList: Subject[]) => {
    const filtered = await Promise.all(
      subjectList.map(async (subject) => {
        const { data, error } = await supabase.rpc('get_subject_stats', { subject_uuid: subject.id });
        
        if (error) {
          console.log("error fetching stats for", subject.name)
          return null
        }

        const tags = data[0].tags
        const topTags = tags ? 
          Object.entries(tags as Record<string, number>)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([key]) => key)
          : []

        return tagQuery.every(tag => topTags.includes(tag)) ? subject : null
      })
    )

    return filtered.filter(Boolean) as Subject[]
  }

  const handleVoteSubmitted = () => {
    setLeaderboardKey(prev => prev + 1)
  }

  const handleCourseAdded = async() => {
    await loadSubjects();
    filterSubjects()
  }

  const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-red-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between flex-wrap gap-y-2">

          {/* Left logo */}
          <div className="flex items-center flex-shrink-0">
            <a href="https://www.linkedin.com/company/global-summer-challenge/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="/By Meeedly.png" alt="By Meeedly" className="h-10 w-auto flex-shrink-0" />
            </a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            <ShareButton />
            <button
              onClick={() => setIsSpinWheelModalOpen(true)}
              className="group relative flex items-center gap-1.5
                        bg-gradient-to-r from-yellow-500 to-orange-500
                        hover:from-yellow-600 hover:to-orange-600
                        text-white
                        px-2 sm:px-4 py-1 sm:py-2
                        text-xs sm:text-sm
                        rounded-xl transition-all duration-300
                        shadow-lg hover:shadow-xl hover:scale-105 transform
                        min-w-[40px] sm:min-w-[64px]"
              title="Spin the Daily Wheel!"
            >
              <span className="text-xs animate-spin" style={{ animationDuration: '3s' }}>🎡</span>
              <span className="font-semibold hidden xs:inline sm:inline">Spin</span>
            </button>

            {/* Right logo */}
            <a href="https://www.linkedin.com/company/meeedly/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity flex-shrink-0">
              <img src="/logo.png" alt="Meeedly Logo" className="h-10 w-auto flex-shrink-0"/>
            </a>
          </div>
        </div>
      </div>
    </header>
  )

  const Footer = () => (
    <footer className="bg-black/95 border-t border-red-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Disclaimer</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            This program is intended solely for fun and interactive engagement. It does not reflect any official academic evaluation.
          </p>
        </div>
        <div className="mt-8 pt-8 border-t border-red-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-gray-300 text-sm">
                © {new Date().getFullYear()} Team CodeBlooded
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://www.linkedin.com/company/global-summer-challenge/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <p className="text-xs text-gray-400">Version 3.1.0</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden pt-20">
          <div className="text-center relative z-10">
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-red-500 border-t-transparent mx-auto"></div>
            </div>
            <h2 className="text-2xl font-display font-bold text-shimmer mb-4">Loading Subjects</h2>
            <p className="text-gray-300 text-lg font-light">Preparing your voting experience...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center relative pt-20">
          <div className="text-center max-w-md mx-auto p-8 relative z-10">
            <div className="bg-black/80 rounded-3xl p-8 mb-6 shadow-2xl border border-red-500/30">
              <div className="text-6xl mb-4 animate-pulse">⚠️</div>
              <h2 className="font-display font-bold text-2xl mb-3 text-gradient">Oops! Something went wrong</h2>
              <p className="text-red-300 font-light">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <SpinWheel isOpen={isSpinWheelModalOpen} onClose={() => setIsSpinWheelModalOpen(false)} />
      
      <main className="relative pt-20">
        
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className ="pb-px">
              <p>
                This application is developed as part of the
                <a href="https://www.linkedin.com/showcase/global-summer-challenge/posts/" target="_blank" rel="noopener noreferrer"> Global Summer Challenge </a>
                organized
                <a href="https://www.linkedin.com/company/meeedly/posts/" target="_blank" rel="noopener noreferrer"> by Meeedly. </a>
              </p>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 font-display">
              Gradence: Anonymous Subject Voter
            </h1>
            <h2 className="text-2xl sm:text-3xl text-red-300 mb-8 font-light">
              Rate Your Learning Experience
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              Help improve education by sharing your honest feedback. Your votes are completely anonymous! 🚀
            </p>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Gradence uses weighted voting to help you evaluate classes:
            </p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              💀 = <b>-2</b> pts&nbsp;&nbsp;&nbsp;😴 = <b>-1</b> pt&nbsp;&nbsp;&nbsp;❤️ = <b>+1</b> pt&nbsp;&nbsp;&nbsp;🔥 = <b>+2</b> pts
            </p>
          </div>
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 mix-blend-multiply"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TeamCarousel />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Leaderboard key={leaderboardKey} />
        </div>

        {/* search bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-red-500/30 shadow-2xl">
            {/* filters */}
            <div className='mb-8'>
              <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gradient mb-2">Search</h3>
              </div>

              <div className="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* name search */}
                <div>
                  <p className="mb-2">By name:</p>
                  <input
                    type="text"
                    placeholder="Course name"
                    value={courseQuery}
                    onChange={(e) => setCourseQuery(e.target.value)}
                    className="rounded-md px-4 py-2 w-full"
                  />
                </div>

                {/* uni search */}
                <div>
                  <p className="mb-2">By university:</p>
                  <Select<OptionType, false>
                    options={universityOptions.map(u => ({ label: u, value: u }))}
                    value={
                      selectedUniversity
                        ? { label: selectedUniversity, value: selectedUniversity }
                        : null
                    }
                    onChange={(v: SingleValue<OptionType>) =>
                      setSelectedUniversity(v?.value || null)
                    }
                    placeholder="Select a university"
                    styles={customSingleSelectStyle}
                    className="react-select"
                    isClearable
                  />
                </div>

                {/* major search */}
                <div>
                  <p className="mb-2">By major:</p>
                  <Select<OptionType, false>
                    options={majorOptions.map(m => ({ label: m, value: m }))}
                    value={selectedMajor ? { label: selectedMajor, value: selectedMajor } : null}
                    onChange={(selected: SingleValue<OptionType>) => setSelectedMajor(selected?.value || null)}
                    placeholder="Select a major"
                    styles={customSingleSelectStyle}
                    className="react-select"
                    isClearable
                  />
                </div>

                {/* tag search */}
                <div>
                  <p className="mb-2">Contains tags:</p>
                  <Select
                    isMulti
                    options={tagOptions}
                    value={tagQuery.map(tag => ({ value: tag, label: tag }))}
                    onChange={(selected) => setTagQuery(selected.map(s => s.value))}
                    placeholder="Search tags"
                    styles={customSelectStyles2}
                    className='react-select'
                  />
                </div>
              </div>
            </div>

            {/* add a course */}
            <div className='flex items-center'>
              <p className='mb-2 mr-4 inline-block'>Don't see your course?</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-2 bg-red-700 rounded-xl"
              >Add a course</button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {subjects.length === 0 ? (
            <div className="text-center">
              <div className="bg-black/80 rounded-3xl p-12 border border-red-500/30 shadow-2xl">
                <div className="text-8xl mb-6">📝</div>
                <h3 className="font-display font-bold text-2xl mb-3 text-white">No subjects available yet</h3>
                <p className="text-gray-300 font-light">Check back later for new topics to vote on!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSubjects.slice((curPage-1)*itemsPerPage, curPage*itemsPerPage).map((subject) => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  tags={tags}
                  onVoteSubmitted={handleVoteSubmitted}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center mx-4">
          <div className="rounded-lg overflow-hidden inline-block">
            <Pagination className="my-pagination">
              <Pagination.Prev className='pag-prev' disabled={curPage==1} onClick={() => setCurPage(curPage-1)}>Previous</Pagination.Prev>
              {
                Array.from({length: totalPages}, (_, i) => i + 1).map(pgNumber => 
                  <Pagination.Item key={pgNumber} active={curPage==pgNumber} onClick={() => setCurPage(pgNumber)}>{pgNumber}</Pagination.Item>
                )
              }
              <Pagination.Next className='pag-next' disabled={curPage==totalPages} onClick={() => setCurPage(curPage+1)}>Next</Pagination.Next>
            </Pagination>
          </div>
        </div>

      {/* add course modal */}
      <AddCourseModal 
        isOpen={isModalOpen} 
        onClose={() => {setIsModalOpen(false)}} 
        onSubmit={async() => {await handleCourseAdded()}}
        schools={universityOptions} 
        majors={majorOptions}/>
        
      </main>

      <Footer />
    </div>
  )
}

export default App

