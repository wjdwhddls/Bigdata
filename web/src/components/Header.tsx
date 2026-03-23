import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

interface HeaderProps {
  currentUserId?: string
  onUserChange?: (id: string | undefined) => void
  onCategoryChange?: (category: string | null) => void
  activeCategory?: string | null
}

const categories = [
  { label: '전체상품', param: '' },
  { label: '신선식품', param: '신선식품' },
  { label: '가공식품', param: '가공식품' },
  { label: '음료', param: '음료' },
  { label: '생수', param: '생수' },
]

export default function Header({ currentUserId, onUserChange, onCategoryChange, activeCategory }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [searchId, setSearchId] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLoginOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (loginOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [loginOpen])

  const handleLogin = () => {
    const id = searchId.trim().toUpperCase()
    if (id) {
      onUserChange?.(id)
      navigate(`/my/${id}`)
      setSearchId('')
      setLoginOpen(false)
    }
  }

  const currentCategory = activeCategory || ''

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-emerald-900/5'
          : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center h-14 gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-700 to-teal-500 bg-clip-text text-transparent group-hover:from-teal-500 group-hover:to-emerald-700 transition-all duration-500">
                포컬리
              </span>
            </h1>
          </Link>

          {/* Category Navigation (center) */}
          <nav className="flex-1 flex items-center justify-center gap-1">
            {categories.map(cat => {
              const isActive = currentCategory === cat.param
              return (
                <button
                  key={cat.label}
                  onClick={() => {
                    if (location.pathname !== '/') {
                      navigate('/#products')
                    }
                    onCategoryChange?.(cat.param || null)
                    setTimeout(() => {
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }, 50)
                  }}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full ${
                    isActive
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50/50'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/dashboard"
              className="text-xs text-gray-500 hover:text-emerald-600 border border-gray-200 rounded-full px-3 py-1.5 hover:border-emerald-300 transition-all duration-200"
            >
              대시보드
            </Link>

            {/* Login button / User badge */}
            <div className="relative" ref={dropdownRef}>
              {currentUserId ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/my/${currentUserId}`}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-900 transition-colors bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {currentUserId}
                  </Link>
                  <button
                    onClick={() => {
                      onUserChange?.(undefined)
                      navigate('/')
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                    title="로그아웃"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLoginOpen(!loginOpen)}
                  className="text-sm text-gray-600 hover:text-emerald-700 border border-gray-200 rounded-full px-4 py-1.5 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  로그인
                </button>
              )}

              {/* Login dropdown */}
              {loginOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-fade-in-up z-50">
                  <p className="text-xs text-gray-400 mb-2">회원 ID로 로그인</p>
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchId}
                      onChange={e => setSearchId(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleLogin()}
                      placeholder="예: U10001"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <button
                      onClick={handleLogin}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full text-sm font-medium hover:from-teal-500 hover:to-emerald-600 transition-all active:scale-95"
                    >
                      확인
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
