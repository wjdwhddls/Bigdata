import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../stores/dataStore'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import ProductCard from '../components/ProductCard'

interface HeroImage {
  image: string
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: number
  phase: number
  rotate: number
}

function ScrollSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1)
  return (
    <div ref={ref} className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

const heroImages: HeroImage[] = [
  // Phase 1: 신선식품 — 화면 가장자리
  { image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=80', top: '8%', left: '3%', size: 150, phase: 1, rotate: -12 },    // 과일 바구니
  { image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80', top: '10%', right: '4%', size: 160, phase: 1, rotate: 10 },   // 신선 채소
  { image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', bottom: '10%', left: '5%', size: 140, phase: 1, rotate: 6 },  // 스테이크
  { image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', bottom: '8%', right: '3%', size: 155, phase: 1, rotate: -8 },  // 연어/생선
  // Phase 2: 가공식품+음료 — 안쪽
  { image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80', top: '22%', left: '18%', size: 120, phase: 2, rotate: 14 },   // 라면
  { image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', top: '3%', right: '22%', size: 115, phase: 2, rotate: -7 },    // 빵
  { image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', bottom: '22%', right: '18%', size: 120, phase: 2, rotate: 9 }, // 커피
  { image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80', bottom: '3%', left: '20%', size: 115, phase: 2, rotate: -11 }, // 치즈
  { image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80', top: '45%', left: '1%', size: 110, phase: 2, rotate: 18 },    // 딸기
  { image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', top: '42%', right: '1%', size: 115, phase: 2, rotate: -16 },     // 음료
]

function clamp(min: number, val: number, max: number) {
  return Math.min(max, Math.max(min, val))
}

interface HomePageProps {
  categoryFilter?: string | null
  onCategoryChange?: (category: string | null) => void
}

export default function HomePage({ categoryFilter = null, onCategoryChange }: HomePageProps) {
  const { products } = useData()
  const navigate = useNavigate()
  const productSectionRef = useRef<HTMLDivElement>(null)

  const heroRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchId, setSearchId] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleScroll = useCallback(() => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const sectionHeight = heroRef.current.offsetHeight
    const viewportHeight = window.innerHeight
    const scrollable = sectionHeight - viewportHeight
    const scrolled = -rect.top
    setScrollProgress(clamp(0, scrolled / scrollable, 1))
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (window.location.hash === '#products') {
      setTimeout(() => {
        productSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [])

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const handleSearch = () => {
    const id = searchId.trim().toUpperCase()
    if (id) {
      navigate(`/my/${id}`)
      setSearchId('')
      setSearchOpen(false)
    }
  }

  const grouped = useMemo(() => {
    const groups: Record<string, typeof products> = {}
    for (const p of products) {
      if (categoryFilter && p.category !== categoryFilter) continue
      if (!groups[p.category]) groups[p.category] = []
      groups[p.category].push(p)
    }
    return groups
  }, [products, categoryFilter])

  const categoryOrder = ['신선식품', '가공식품', '음료', '생수']

  // 회원 검색 버튼 opacity
  const searchBtnOpacity = clamp(0, (scrollProgress - 0.8) / 0.15, 1)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section — 300vh scroll space */}
      <section ref={heroRef} style={{ height: '300vh' }} className="relative">
        <div
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          {/* Scroll images behind text */}
          {heroImages.map((img, i) => {
            const startProgress = img.phase === 1 ? 0.2 : 0.55
            const endProgress = img.phase === 1 ? 0.55 : 0.9
            const scale = clamp(0, (scrollProgress - startProgress) / (endProgress - startProgress), 1)
            const imgStyle: React.CSSProperties = {
              position: 'absolute',
              width: img.size,
              height: img.size,
              transform: `scale(${scale}) rotate(${img.rotate * scale}deg)`,
              opacity: scale,
              transition: 'none',
              zIndex: 1,
              ...(img.top != null && { top: img.top }),
              ...(img.bottom != null && { bottom: img.bottom }),
              ...(img.left != null && { left: img.left }),
              ...(img.right != null && { right: img.right }),
            }
            return (
              <div key={i} style={imgStyle}>
                <img
                  src={img.image}
                  alt=""
                  className="w-full h-full object-cover rounded-3xl shadow-lg"
                  loading="eager"
                />
              </div>
            )
          })}

          {/* Center logo text (above images) */}
          <div className="relative z-10 text-center pointer-events-none select-none px-4">
            <h2
              className="hero-logo text-gray-900 tracking-tighter"
              style={{
                fontSize: 'clamp(4rem, 15vw, 12rem)',
              }}
            >
              PORKULY
            </h2>
            <p
              className="text-gray-400 text-lg md:text-xl tracking-wide mt-2"
              style={{
                fontFamily: "'Pretendard', sans-serif",
                opacity: clamp(0.3, 1 - scrollProgress * 2, 1),
              }}
            >
              신선한 새벽, 당신의 식탁으로
            </p>
          </div>

          {/* 회원 검색 버튼 (3단계) */}
          <div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
            style={{ opacity: searchBtnOpacity, pointerEvents: searchBtnOpacity > 0.1 ? 'auto' : 'none' }}
          >
            {!searchOpen ? (
              <button
                onClick={() => setSearchOpen(true)}
                className="px-8 py-3 bg-gray-900 text-white rounded-full text-base font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
              >
                회원 검색
              </button>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-80 animate-scale-in">
                <p className="text-xs text-gray-400 mb-3">회원 ID를 입력하세요</p>
                <div className="flex gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSearch()
                      if (e.key === 'Escape') setSearchOpen(false)
                    }}
                    placeholder="예: U10001"
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-full text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full text-sm font-medium hover:from-teal-500 hover:to-emerald-600 transition-all active:scale-95"
                  >
                    검색
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Category Icons */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-center gap-12">
          {[
            { emoji: '🥬', label: '신선식품', cat: '신선식품' },
            { emoji: '🍜', label: '가공식품', cat: '가공식품' },
            { emoji: '🥤', label: '음료', cat: '음료' },
            { emoji: '💧', label: '생수', cat: '생수' },
          ].map(item => (
            <button
              key={item.cat}
              onClick={() => {
                onCategoryChange?.(categoryFilter === item.cat ? null : item.cat)
                productSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`text-center group ${categoryFilter === item.cat ? 'scale-105' : ''} transition-transform`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-all duration-300 mx-auto shadow-sm ${
                categoryFilter === item.cat ? 'bg-emerald-100 ring-2 ring-emerald-400' : 'bg-gray-50 group-hover:bg-emerald-50'
              }`}>
                {item.emoji}
              </div>
              <p className={`text-sm mt-2 font-medium transition-colors ${
                categoryFilter === item.cat ? 'text-emerald-700' : 'text-gray-600 group-hover:text-emerald-700'
              }`}>{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gray-100" />
      </div>

      {/* Product Sections */}
      <div id="products" ref={productSectionRef} className="max-w-6xl mx-auto px-4 py-10">
        {categoryOrder
          .filter(cat => grouped[cat])
          .map((category) => (
            <ScrollSection key={category} className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{category}</h3>
                <span className="text-sm text-gray-400">{grouped[category].length}개 상품</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {grouped[category]
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((p, i) => (
                    <ProductCard
                      key={p.name}
                      name={p.name}
                      subLabel={p.subCategory}
                      animated
                      delay={i * 50}
                    />
                  ))}
              </div>
            </ScrollSection>
          ))}
      </div>

      {/* Promotion Banner */}
      <ScrollSection>
        <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h3 className="text-2xl font-bold mb-3">나만의 맞춤 추천을 받아보세요</h3>
            <p className="text-gray-400 mb-8 text-sm">내 구매 패턴에 맞는 상품을 찾아드립니다</p>
            <div className="flex justify-center gap-3 text-sm">
              <span className="bg-white/10 rounded-full px-5 py-2.5 border border-white/10 text-gray-300">
                맞춤 추천
              </span>
              <span className="bg-white/10 rounded-full px-5 py-2.5 border border-white/10 text-gray-300">
                함께 구매한 상품
              </span>
              <span className="bg-white/10 rounded-full px-5 py-2.5 border border-white/10 text-gray-300">
                연령대별 인기상품
              </span>
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* Footer */}
      <footer className="bg-emerald-50/50 border-t border-emerald-100/50 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-teal-500 bg-clip-text text-transparent mb-3">
                포컬리
              </h4>
              <p className="text-sm text-gray-400">신선한 식품을 새벽에 배송합니다</p>
              <p className="text-xs text-gray-300 mt-1">고객센터 1234-5678 | 평일 09:00~18:00</p>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <div>
                <p className="font-medium text-gray-600 mb-2">서비스</p>
                <p className="mb-1 hover:text-emerald-600 cursor-pointer">이용약관</p>
                <p className="mb-1 hover:text-emerald-600 cursor-pointer">개인정보처리방침</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 mb-2">고객지원</p>
                <p className="mb-1 hover:text-emerald-600 cursor-pointer">자주 묻는 질문</p>
                <p className="mb-1 hover:text-emerald-600 cursor-pointer">배송 안내</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-300">
            &copy; 2025 포컬리. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
