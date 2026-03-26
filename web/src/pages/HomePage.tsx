import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useData } from '../stores/dataStore'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import ProductCard from '../components/ProductCard'
import { getProductVisual } from '../utils/productImages'
import VoteModal from '../components/VoteModal'

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

const bundleDeals = [
  { items: ['돼지고기', '상추'], discount: 15 },
  { items: ['라면', '김치'], discount: 10 },
  { items: ['북어', '콩나물'], discount: 12 },
]

const promoSlides = [
  {
    title: '신선식품 100% 만족 보장',
    subtitle: '첫 주문 고객 특별 약속',
    description: '신선식품이 기대 이하라면 100% 환불 + 재배송해 드립니다',
    bg: 'from-emerald-100 to-emerald-50',
    accent: 'text-emerald-900',
    custom: true as const,
    cards: [],
  },
  {
    title: '건강기능식품 출시!',
    subtitle: '포컬리 신규 카테고리',
    description: '건강기능식품 20% 할인',
    bg: 'from-teal-100 to-blue-50',
    accent: 'text-teal-900',
    custom: true as const,
    customType: 'health' as const,
    cards: [],
  },
  {
    title: '등급별 할인 혜택',
    subtitle: '포컬리 멤버 전용',
    description: '등급이 올라갈수록 더 큰 할인!',
    bg: 'from-purple-100 to-purple-50',
    accent: 'text-purple-900',
    custom: true as const,
    customType: 'gradeDiscount' as const,
    cards: [],
  },
  {
    title: '첫 구매 혜택',
    subtitle: '가입하고 바로 받는 할인',
    description: '최대 20% 할인 쿠폰팩',
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
  currentUserId?: string
  newUserAgeGroup?: string
}

export default function HomePage({ categoryFilter = null, onCategoryChange, currentUserId, newUserAgeGroup }: HomePageProps) {
  const { products, recommendations } = useData()
  const productSectionRef = useRef<HTMLDivElement>(null)

  const rec = currentUserId ? recommendations.get(currentUserId) : null

  const ageProducts = useMemo(() => {
    if (!newUserAgeGroup) return []
    const scoreMap: Record<string, { total: number; count: number }> = {}
    recommendations.forEach(r => {
      if (r.ageGroup === newUserAgeGroup) {
        r.recommendations.forEach(item => {
          if (!scoreMap[item.name]) scoreMap[item.name] = { total: 0, count: 0 }
          scoreMap[item.name].total += item.score
          scoreMap[item.name].count++
        })
      }
    })
    const sorted = Object.entries(scoreMap)
      .map(([name, s]) => ({ name, score: s.total }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
    const maxScore = sorted[0]?.score || 1
    return sorted.map(item => ({ ...item, score: item.score / maxScore }))
  }, [newUserAgeGroup, recommendations])

  const [showProducts, setShowProducts] = useState(() => sessionStorage.getItem('showProducts') === 'true' || !!currentUserId)
  const [animPhase, setAnimPhase] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [doorPhase, setDoorPhase] = useState<'idle' | 'closed' | 'opening' | 'done'>('idle')
  const [showVoteModal, setShowVoteModal] = useState(() => {
    if (!currentUserId || newUserAgeGroup) return false
    return sessionStorage.getItem(`hasVoted_${currentUserId}`) !== 'true'
  })
  // Auto-show products when logged in + auto-show vote modal per user (not for new signups)
  useEffect(() => {
    // Clean up old global key
    sessionStorage.removeItem('hasVoted')

    if (currentUserId) {
      setShowProducts(true)
      const voted = sessionStorage.getItem(`hasVoted_${currentUserId}`) === 'true'
      setShowVoteModal(!voted && !newUserAgeGroup)
    } else {
      setShowVoteModal(false)
    }
  }, [currentUserId, newUserAgeGroup])

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

  // Auto-slide promo slides
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % promoSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPaused])


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

  const categoryOrder = ['신선식품', '가공식품', '음료', '생수', '건강기능식품']

  if (showProducts) {
    return (
      <>
      {/* 마트 자동문 오버레이 */}
      {doorPhase !== 'idle' && doorPhase !== 'done' && (
        <div className="door-overlay">
          <div className={`door-panel door-panel-left ${doorPhase === 'opening' ? 'door-open' : ''}`}>
            <div className="door-frame-top" />
            <div className="door-frame-bottom" />
            <div className="door-handle" />
          </div>
          <div className={`door-panel door-panel-right ${doorPhase === 'opening' ? 'door-open' : ''}`}>
            <div className="door-frame-top" />
            <div className="door-frame-bottom" />
            <div className="door-handle" />
          </div>
        </div>
      )}
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
                {'custom' in slide && slide.custom ? (
                  'customType' in slide && slide.customType === 'gradeDiscount' ? (
                  /* Custom: 등급별 할인 혜택 슬라이드 */
                  <div className="max-w-6xl mx-auto px-4 flex items-center justify-between w-full">
                    <div className="space-y-4 max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-black">P</span>
                        </div>
                        <span className="text-base font-bold text-purple-800">포컬리</span>
                      </div>
                      <p className="text-sm font-semibold text-purple-600 tracking-wide">포컬리 멤버 전용</p>
                      <h3 className="text-5xl font-black text-purple-900 leading-tight">
                        등급별 할인 혜택
                      </h3>
                      <p className="text-lg text-purple-700">
                        등급이 올라갈수록 더 큰 할인!
                      </p>
                    </div>
                    <div className="flex items-end gap-5">
                      {/* VIP Card */}
                      <div className="flex flex-col items-center">
                        <div className="w-36 h-44 rounded-2xl bg-gradient-to-b from-red-400 to-rose-600 flex flex-col items-center justify-center shadow-xl text-white relative overflow-hidden" style={{ transform: 'rotate(-3deg)' }}>
                          <div className="absolute inset-0 bg-white/5 rounded-2xl" />
                          <span className="text-3xl mb-2">🎖️</span>
                          <span className="text-2xl font-black">VIP</span>
                          <div className="mt-2 bg-white/20 rounded-full px-4 py-1">
                            <span className="text-lg font-extrabold">10% 할인</span>
                          </div>
                          <span className="text-[10px] mt-1 opacity-70">모든 상품 적용</span>
                        </div>
                      </div>
                      {/* Gold Card */}
                      <div className="flex flex-col items-center">
                        <div className="w-36 h-44 rounded-2xl bg-gradient-to-b from-amber-400 to-yellow-600 flex flex-col items-center justify-center shadow-xl text-white relative overflow-hidden" style={{ transform: 'rotate(3deg)' }}>
                          <div className="absolute inset-0 bg-white/5 rounded-2xl" />
                          <span className="text-3xl mb-2">🏅</span>
                          <span className="text-2xl font-black">Gold</span>
                          <div className="mt-2 bg-white/20 rounded-full px-4 py-1">
                            <span className="text-lg font-extrabold">5% 할인</span>
                          </div>
                          <span className="text-[10px] mt-1 opacity-70">모든 상품 적용</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : 'customType' in slide && slide.customType === 'health' ? (
                  /* Custom: 건강기능식품 출시 슬라이드 */
                  <div className="max-w-6xl mx-auto px-4 flex items-center justify-between w-full">
                    <div className="space-y-4 max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-black">P</span>
                        </div>
                        <span className="text-base font-bold text-teal-800">포컬리</span>
                      </div>
                      <p className="text-sm font-semibold text-teal-600 tracking-wide">포컬리 신규 카테고리</p>
                      <h3 className="text-5xl font-black text-teal-900 leading-tight">
                        건강기능식품 출시!
                      </h3>
                      <div className="flex gap-3 pt-2">
                        <span className="text-xl font-extrabold text-teal-900">
                          건강기능식품 20% 할인
                        </span>
                      </div>
                    </div>
                    {/* 제품 이미지들 */}
                    <div className="flex items-end gap-3">
                      {[
                        { src: `${import.meta.env.BASE_URL}images/products/홍삼.jpg`, name: '홍삼' },
                        { src: `${import.meta.env.BASE_URL}images/products/비타민C.jpg`, name: '비타민C' },
                        { src: `${import.meta.env.BASE_URL}images/products/유산균.avif`, name: '유산균' },
                        { src: `${import.meta.env.BASE_URL}images/products/프로폴리스.jpg`, name: '프로폴리스' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center" style={{ transform: `translateY(${idx % 2 === 0 ? -8 : 8}px)` }}>
                          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-100">
                            <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-xs font-bold text-teal-700 mt-1.5">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  ) : (
                  /* Custom: 신선식품 100% 환불보장 슬라이드 */
                  <div className="max-w-6xl mx-auto px-4 flex items-center justify-between w-full">
                    <div className="space-y-4 max-w-md">
                      <p className="text-sm font-semibold text-emerald-600 tracking-widest uppercase">First Order Guarantee</p>
                      <h3 className="text-4xl font-extrabold text-emerald-900 leading-tight">
                        포컬리의 약속
                      </h3>
                      <p className="text-lg text-emerald-800 leading-relaxed">
                        신선식품이 기대 이하라면<br />
                        <span className="font-extrabold text-emerald-950 text-xl">100% 환불</span> + <span className="font-extrabold text-emerald-950 text-xl">재배송</span>해 드립니다
                      </p>
                      <div className="flex gap-3 pt-2">
                        <span className="bg-emerald-200/60 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full border border-emerald-300/50">첫 주문 고객 대상</span>
                        <span className="bg-emerald-200/60 text-emerald-800 text-xs font-bold px-4 py-2 rounded-full border border-emerald-300/50">신선식품 전품목</span>
                      </div>
                    </div>
                    {/* 보증서 카드 */}
                    <div className="relative">
                      {/* 장식 원 */}
                      <div className="absolute -top-4 -left-6 w-16 h-16 bg-emerald-300/30 rounded-full" />
                      <div className="absolute -bottom-3 -right-4 w-12 h-12 bg-emerald-400/20 rounded-full" />
                      <div className="absolute top-1/2 -right-8 w-8 h-8 bg-yellow-300/40 rounded-full" />
                      {/* 카드 본체 */}
                      <div className="relative bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 px-10 py-8 text-center w-64 border border-emerald-100">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-black">P</span>
                          </div>
                          <span className="text-sm font-bold text-gray-700">포컬리</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">신선식품 만족 보장!</p>
                        <div className="mb-2">
                          <span className="text-6xl font-black bg-gradient-to-b from-emerald-500 to-emerald-700 bg-clip-text text-transparent leading-none">100</span>
                          <span className="text-2xl font-black text-emerald-600">%</span>
                        </div>
                        <p className="text-lg font-extrabold text-gray-800 tracking-wider">환불보장제</p>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <p className="text-[10px] text-gray-300">환불 | 재배송 | 신선보장</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                ) : (
                  /* Default slide template */
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
                )}
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
              onClick={() => setIsPaused(p => !p)}
              className="w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors text-xs"
            >
              {isPaused ? '▶' : '❚❚'}
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
              { emoji: '💊', label: '건강기능식품', cat: '건강기능식품' },
            ].map(item => (
              <button
                key={item.cat}
                onClick={() => {
                  onCategoryChange?.(categoryFilter === item.cat ? null : item.cat)
                  setTimeout(() => {
                    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 50)
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

        {/* User Recommendations (existing customer) */}
        {currentUserId && rec?.recommendations.length ? (
          <div className="max-w-6xl mx-auto px-4 pb-10">
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl px-6 py-5 mb-6 border border-emerald-100/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/50">
                  <span className="text-white text-lg">✦</span>
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight">
                    <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent">{currentUserId}</span>
                    <span className="text-gray-800">님을 위한 추천 상품</span>
                  </h3>
                  <p className="text-sm text-emerald-600/70 mt-0.5 font-medium">
                    구매 이력을 바탕으로 선별한 맞춤 상품입니다
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-5">
              {rec.recommendations.map((item, i) => (
                <div key={i} className="relative">
                  {i === 0 && (
                    <span className="absolute -top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-lg animate-pulse">
                      BEST
                    </span>
                  )}
                  <ProductCard
                    name={item.name}
                    subLabel={`추천도 ${(item.score * 100).toFixed(0)}%`}
                    score={item.score}
                    size="md"
                    animated
                    delay={i * 100}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* New user: age-group recommendations */}
        {currentUserId && !rec && newUserAgeGroup && ageProducts.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 pb-10">
            {/* Notice banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl p-5 mb-8 flex items-center gap-4">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="text-sm font-bold text-emerald-800">
                  {currentUserId}님, 환영합니다!
                </p>
                <p className="text-sm text-emerald-600 mt-0.5">
                  첫 주문을 완료하면 구매 이력 기반 <span className="font-bold">맞춤 추천상품</span>이 제공됩니다.
                </p>
              </div>
            </div>

            {/* Age group products */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                  {newUserAgeGroup} 고객이 많이 구매한 상품
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  같은 연령대 고객들에게 인기 있는 상품입니다
                </p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-5">
              {ageProducts.map((item, i) => (
                <div key={i} className="relative">
                  {i === 0 && (
                    <span className="absolute -top-3 left-3 z-10 bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-lg">
                      TOP
                    </span>
                  )}
                  <ProductCard
                    name={item.name}
                    subLabel={`인기도 ${(item.score * 100).toFixed(0)}%`}
                    score={item.score}
                    size="md"
                    animated
                    delay={i * 100}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vote Modal (overlay on main page) */}
        {showVoteModal && (
          <VoteModal
            onClose={() => setShowVoteModal(false)}
            onVoteComplete={() => {
              if (currentUserId) sessionStorage.setItem(`hasVoted_${currentUserId}`, 'true')
            }}
          />
        )}

        {/* Bundle Deals */}
        <ScrollSection>
          <div className="max-w-6xl mx-auto px-4 pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-red-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-200/50">
                <span className="text-white text-base font-bold">%</span>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">특가 묶음상품</h3>
                <p className="text-sm text-gray-400">함께 사면 더 저렴하게!</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {bundleDeals.map((bundle, idx) => (
                <div
                  key={idx}
                  className="relative bg-gradient-to-br from-white to-orange-50 rounded-2xl border border-orange-100 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Discount badge */}
                  <span className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {bundle.discount}% OFF
                  </span>

                  {/* Product images */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {bundle.items.map((item, i) => {
                      const visual = getProductVisual(item)
                      return (
                        <div key={item} className="flex items-center gap-3">
                          {i > 0 && (
                            <span className="text-2xl font-bold text-orange-300">+</span>
                          )}
                          <div className="flex flex-col items-center">
                            <div
                              className="w-20 h-20 rounded-xl overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300"
                              style={{ backgroundColor: visual.bgColor }}
                            >
                              {visual.image ? (
                                <img src={visual.image} alt={item} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">
                                  {visual.emoji}
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-semibold text-gray-700 mt-1.5">{item}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Bundle label */}
                  <div className="text-center">
                    <p className="text-base font-bold text-gray-800">
                      {bundle.items.join(' + ')}
                    </p>
                    <p className="text-sm text-orange-500 font-semibold mt-1">
                      함께 구매 시 {bundle.discount}% 할인
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>

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
      </>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 마트 자동문 오버레이 */}
      {doorPhase !== 'idle' && doorPhase !== 'done' && (
        <div className="door-overlay">
          <div className={`door-panel door-panel-left ${doorPhase === 'opening' ? 'door-open' : ''}`}>
            <div className="door-frame-top" />
            <div className="door-frame-bottom" />
            <div className="door-handle" />
          </div>
          <div className={`door-panel door-panel-right ${doorPhase === 'opening' ? 'door-open' : ''}`}>
            <div className="door-frame-top" />
            <div className="door-frame-bottom" />
            <div className="door-handle" />
          </div>
        </div>
      )}

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
              onClick={() => {
                setDoorPhase('closed')
                setTimeout(() => setShowProducts(true), 300)
                setTimeout(() => setDoorPhase('opening'), 400)
                setTimeout(() => setDoorPhase('done'), 1800)
              }}
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
