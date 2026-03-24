import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
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

const promoSlides = [
  {
    title: '오늘의 혜택은?',
    subtitle: '진행 중인 이벤트 모아보기',
    description: '이벤트 참여하고 혜택 받기',
    bg: 'from-purple-100 to-purple-50',
    accent: 'text-purple-900',
    cards: [
      { label: 'COUPON', color: 'bg-purple-300', icon: '🎫' },
      { label: 'BENEFIT', color: 'bg-purple-400', icon: '🎁' },
      { label: 'TODAY', color: 'bg-purple-800 text-white', icon: '📅' },
    ],
  },
  {
    title: '신선식품 특가',
    subtitle: '산지 직송 프리미엄 식재료',
    description: '매일 새벽 신선하게 배송',
    bg: 'from-emerald-100 to-emerald-50',
    accent: 'text-emerald-900',
    cards: [
      { label: '채소', color: 'bg-emerald-300', icon: '🥬' },
      { label: '과일', color: 'bg-emerald-400', icon: '🍎' },
      { label: '축산', color: 'bg-emerald-800 text-white', icon: '🥩' },
    ],
  },
  {
    title: '첫 구매 혜택',
    subtitle: '가입하고 바로 받는 할인',
    description: '최대 30% 할인 쿠폰팩',
    bg: 'from-amber-100 to-amber-50',
    accent: 'text-amber-900',
    cards: [
      { label: '30% OFF', color: 'bg-amber-300', icon: '💰' },
      { label: '무료배송', color: 'bg-amber-400', icon: '🚚' },
      { label: '적립금', color: 'bg-amber-700 text-white', icon: '✨' },
    ],
  },
  {
    title: '이번 주 베스트',
    subtitle: '가장 많이 찾은 인기상품',
    description: '실시간 판매 랭킹 TOP',
    bg: 'from-rose-100 to-rose-50',
    accent: 'text-rose-900',
    cards: [
      { label: 'TOP 10', color: 'bg-rose-300', icon: '🏆' },
      { label: '리뷰', color: 'bg-rose-400', icon: '⭐' },
      { label: 'NEW', color: 'bg-rose-800 text-white', icon: '🔥' },
    ],
  },
]

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
  { image: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&q=80', top: '8%', left: '3%', size: 150, phase: 1, rotate: -12 },
  { image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80', top: '10%', right: '4%', size: 160, phase: 1, rotate: 10 },
  { image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', bottom: '10%', left: '5%', size: 140, phase: 1, rotate: 6 },
  { image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&q=80', bottom: '8%', right: '3%', size: 155, phase: 1, rotate: -8 },
  // Phase 2: 가공식품+음료 — 안쪽
  { image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80', top: '22%', left: '18%', size: 120, phase: 2, rotate: 14 },
  { image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80', top: '3%', right: '22%', size: 115, phase: 2, rotate: -7 },
  { image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80', bottom: '22%', right: '18%', size: 120, phase: 2, rotate: 9 },
  { image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80', bottom: '3%', left: '20%', size: 115, phase: 2, rotate: -11 },
  { image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80', top: '45%', left: '1%', size: 110, phase: 2, rotate: 18 },
  { image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', top: '42%', right: '1%', size: 115, phase: 2, rotate: -16 },
]

interface HomePageProps {
  categoryFilter?: string | null
  onCategoryChange?: (category: string | null) => void
}

export default function HomePage({ categoryFilter = null, onCategoryChange }: HomePageProps) {
  const { products } = useData()
  const productSectionRef = useRef<HTMLDivElement>(null)

  const [showProducts, setShowProducts] = useState(() => sessionStorage.getItem('showProducts') === 'true')
  const [animPhase, setAnimPhase] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [paused, setPaused] = useState(false)

  // Persist showProducts to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('showProducts', String(showProducts))
  }, [showProducts])

  // Auto-animate hero images on mount
  useEffect(() => {
    const t1 = setTimeout(() => setAnimPhase(1), 500)
    const t2 = setTimeout(() => setAnimPhase(2), 1500)
    const t3 = setTimeout(() => setAnimPhase(3), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Auto-play promo slider
  useEffect(() => {
    if (paused || !showProducts) return
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promoSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [paused, showProducts])

  const goSlide = useCallback((dir: number) => {
    setCurrentSlide(prev => (prev + dir + promoSlides.length) % promoSlides.length)
  }, [])

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

  if (showProducts) {
    return (
      <div className="min-h-screen bg-white animate-fade-in">
        {/* Promotion Slider */}
        <div className="relative w-full overflow-hidden" style={{ height: 300 }}>
          {/* Slides */}
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {promoSlides.map((slide, i) => (
              <div
                key={i}
                className={`w-full h-full flex-shrink-0 bg-gradient-to-r ${slide.bg} flex items-center justify-center`}
              >
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-between w-full">
                  <div className="space-y-3">
                    <p className={`text-sm font-medium ${slide.accent} opacity-70`}>{slide.subtitle}</p>
                    <h3 className={`text-3xl font-extrabold ${slide.accent} leading-tight`}>{slide.title}</h3>
                    <p className="text-gray-500 text-sm">{slide.description}</p>
                  </div>
                  <div className="flex gap-4">
                    {slide.cards.map((card, j) => (
                      <div
                        key={j}
                        className={`w-28 h-36 rounded-2xl ${card.color} flex flex-col items-center justify-center shadow-lg`}
                        style={{ transform: `rotate(${(j - 1) * 6}deg)` }}
                      >
                        <span className="text-3xl mb-2">{card.icon}</span>
                        <span className="text-xs font-bold">{card.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left/Right arrows */}
          <button
            onClick={() => goSlide(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            onClick={() => goSlide(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          >
            ›
          </button>

          {/* Bottom controls */}
          <div className="absolute bottom-4 right-6 flex items-center gap-2">
            <button
              onClick={() => setPaused(p => !p)}
              className="w-8 h-8 rounded-full bg-black/50 text-white text-xs flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              {paused ? '▶' : '❚❚'}
            </button>
            <div className="bg-black/50 text-white text-xs rounded-full px-3 py-1.5 flex items-center gap-1">
              <span className="font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
              <span className="opacity-50">/ {String(promoSlides.length).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section — full screen, auto-animated */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Auto-animated images */}
        {heroImages.map((img, i) => {
          const visible = animPhase >= img.phase
          const imgStyle: React.CSSProperties = {
            position: 'absolute',
            width: img.size,
            height: img.size,
            transform: visible ? `scale(1) rotate(${img.rotate}deg)` : 'scale(0) rotate(0deg)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease-out',
            transitionDelay: `${i * 80}ms`,
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

        {/* Center logo text + button */}
        <div className="relative z-10 text-center select-none px-4 flex flex-col items-center">
          <h2
            className="hero-logo text-gray-900 tracking-tighter pointer-events-none"
            style={{ fontSize: 'clamp(4rem, 15vw, 12rem)' }}
          >
            PORKULY
          </h2>
          <p
            className="text-gray-400 text-lg md:text-xl tracking-wide mt-2 pointer-events-none"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          >
            신선한 새벽, 당신의 식탁으로
          </p>

          {/* 쇼핑 시작하기 버튼 */}
          <div
            className="mt-8"
            style={{
              opacity: animPhase >= 3 ? 1 : 0,
              transform: `translateY(${animPhase >= 3 ? 0 : 20}px)`,
              transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
              pointerEvents: animPhase >= 3 ? 'auto' : 'none',
            }}
          >
            <button
              onClick={() => setShowProducts(true)}
              className="px-10 py-4 bg-gray-900 text-white rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
            >
              쇼핑 시작하기
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
