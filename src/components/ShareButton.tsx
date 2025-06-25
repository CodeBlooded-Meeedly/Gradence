import { useState } from 'react'

interface ShareButtonProps {
  className?: string
}

export const ShareButton = ({ className = '' }: ShareButtonProps) => {
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  const shareUrl = window.location.href
  const shareText = "Check out this Anonymous Subject Voter app! Rate your favorite subjects anonymously. 🎓📊"
  
  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '📱',
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
        window.open(url, '_blank')
      }
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'from-blue-700 to-blue-800',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        window.open(url, '_blank')
      }
    },
    {
      name: 'Instagram',
      icon: '📷',
      color: 'from-purple-500 via-pink-500 to-orange-500',
      hoverColor: 'from-purple-600 via-pink-600 to-orange-600',
      action: () => {
        // Open Instagram directly - users can then share via DM, story, or post
        const instagramUrl = 'https://www.instagram.com/'
        window.open(instagramUrl, '_blank')
        // Also copy the link to clipboard for convenience
        setTimeout(() => {
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
          alert('Link copied to clipboard! You can now paste it in your Instagram DM, story, or post.')
        }, 500)
      }
    },
    {
      name: 'Email',
      icon: '📧',
      color: 'from-gray-600 to-gray-700',
      hoverColor: 'from-gray-700 to-gray-800',
      action: () => {
        const subject = 'Check out this Anonymous Subject Voter app!'
        const body = `${shareText}\n\n${shareUrl}`
        const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
        window.open(url)
      }
    }
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard!')
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Share Button */}
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="group relative flex items-center gap-1.5 sm:gap-2 
                  bg-gradient-to-r from-red-600 to-red-700 
                  hover:from-red-700 hover:to-red-800 
                  text-white 
                  px-2 sm:px-4 py-1 sm:py-2 
                  text-xs sm:text-sm 
                  rounded-xl transition-all duration-300 
                  shadow-lg hover:shadow-xl hover:scale-105 transform 
                  min-w-[64px]"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        
        {/* Content */}
        <div className="relative flex items-center gap-1 sm:gap-2">
          <span className="text-sm sm:text-base animate-pulse">📤</span>
          <span className="font-semibold">Share</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${showShareMenu ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Share Menu Dropdown */}
      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full right-0 mt-3 bg-black/95 border border-red-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-sm z-50 min-w-56 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-3">
              <div className="text-center mb-3">
                <h3 className="text-white font-semibold text-sm">Share this app</h3>
                <p className="text-gray-400 text-xs mt-1">Help others discover Gradence!</p>
              </div>
              
              {shareOptions.map((option, index) => (
                <button
                  key={option.name}
                  onClick={() => {
                    option.action()
                    setShowShareMenu(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white transition-all duration-300 bg-gradient-to-r ${option.color} hover:${option.hoverColor} hover:scale-105 transform shadow-lg hover:shadow-xl`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium">{option.name}</span>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </button>
              ))}
              
              {/* Divider */}
              <div className="border-t border-gray-600 my-3" />
              
              {/* Copy Link */}
              <button
                onClick={() => {
                  copyToClipboard()
                  setShowShareMenu(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl"
              >
                <span className="text-xl">🔗</span>
                <span className="font-medium">Copy Link</span>
                <div className="ml-auto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 