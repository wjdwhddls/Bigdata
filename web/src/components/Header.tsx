import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

interface HeaderProps {
  currentUserId?: string
  onUserChange?: (id: string) => void
}

const categories = [
  { label: '전체상품', param: '' },
  { label: '신선식품', param: '신선식품' },
  { label: '가공식품', param: '가공식품' },
  { label: '음료', param: '음료' },
  { label: '생수', param: '생수' },
]

export default function Header({ currentUserId, onUserChange }: HeaderProps) {
  const [searchId, setSearchId] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = () => {
    const id = searchId.trim().toUpperCase()
    if (id) {
      onUserChange?.(id)
      navigate(`/my/${id}`)
      setSearchId('')
    }
  }

  const currentCategory = new URLSearchParams(location.search).get('category') || ''

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-emerald-900/5'
          : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-700 to-teal-500 bg-clip-text text-transparent group-hover:from-teal-500 group-hover:to-emerald-700 transition-all duration-500">
                포컬리
              </span>
            </h1>
          </Link>

          {/* Search bar */}
          <div className={`flex-1 max-w-lg transition-all duration-300 ${searchFocused ? 'max-w-xl' : ''}`}>
            <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
              <input
                type="text"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="회원 ID로 로그인 (예: U10001)"
                className={`w-full px-5 py-2.5 border-2 rounded-full text-sm transition-all duration-300 outline-none ${
                  searchFocused
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 bg-white'
                    : 'border-gray-200 bg-gray-50 hover:border-emerald-300'
                }`}
              />
              <button
                onClick={handleSearch}
                className="absolute right-1.5 top-1.5 p-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full hover:from-teal-500 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {currentUserId ? (
              <Link
                to={`/my/${currentUserId}`}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100"
              >
                {currentUserId}
              </Link>
            ) : (
              <span className="text-sm text-gray-400">로그인</span>
            )}
            <Link
              to="/dashboard"
              className="text-xs text-gray-500 hover:text-emerald-600 border border-gray-200 rounded-full px-3 py-1.5 hover:border-emerald-300 transition-all duration-200"
            >
              대시보드
            </Link>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <div className="border-t border-gray-100/80">
        <nav className="max-w-6xl mx-auto px-4 flex items-center gap-1 h-11">
          {categories.map(cat => {
            const isActive = currentCategory === cat.param && location.pathname === '/'
            return (
              <Link
                key={cat.label}
                to={cat.param ? `/?category=${cat.param}` : '/'}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full ${
                  isActive
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50/50'
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
