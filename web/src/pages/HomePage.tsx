import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useData } from '../stores/dataStore'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import ProductCard from '../components/ProductCard'

function ScrollSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1)
  return (
    <div ref={ref} className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

const bannerSlides = [
  {
    title: '오늘의 신선식품',
    subtitle: '매일 새벽, 산지에서 직송합니다',
    desc: '엄선된 제철 과일과 채소를 만나보세요',
    gradient: 'from-emerald-700 via-teal-600 to-emerald-800',
    emojis: ['🍎', '🥬', '🍇', '🍓', '🥝'],
  },
  {
    title: '이번 주 베스트',
    subtitle: '고객님들이 가장 많이 찾은 상품',
    desc: '인기 상품을 특별한 가격에 만나보세요',
    gradient: 'from-emerald-700 via-teal-600 to-emerald-800',
    emojis: ['🥩', '🐟', '🧀', '🍗', '🥚'],
  },
  {
    title: '맞춤 추천',
    subtitle: '나만을 위한 상품을 찾아드려요',
    desc: '로그인하고 맞춤 추천을 받아보세요',
    gradient: 'from-rose-700 via-pink-600 to-rose-800',
    emojis: ['🍜', '🍝', '☕', '🍞', '🍛'],
  },
]

export default function HomePage() {
  const { products } = useData()
  const [searchParams] = useSearchParams()
  const categoryFilter = searchParams.get('category')
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length)
    }, 5000)
    return () => clearInterval(timer)
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
  const slide = bannerSlides[currentSlide]

  return (
    <div className="min-h-screen">
      {/* Hero Banner Slider */}
      <section className={`bg-gradient-to-r ${slide.gradient} text-white relative overflow-hidden transition-all duration-1000`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {slide.emojis.map((e, i) => (
            <div
              key={`${currentSlide}-${i}`}
              className="absolute text-6xl opacity-[0.07] animate-float"
              style={{
                top: `${15 + i * 18}%`,
                left: `${10 + i * 18}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              {e}
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          <div className="max-w-xl">
            <p className="text-white/60 text-sm font-medium tracking-wider mb-3 animate-fade-in-up">
              {slide.subtitle}
            </p>
            <h2
              key={currentSlide}
              className="text-5xl font-extrabold mb-4 leading-tight animate-fade-in-up"
              style={{ animationDelay: '80ms' }}
            >
              {slide.title}
            </h2>
            <p className="text-white/70 text-lg mb-8 animate-fade-in-up" style={{ animationDelay: '160ms' }}>
              {slide.desc}
            </p>
          </div>

          {/* Slide indicators */}
          <div className="flex gap-2 mt-4">
            {bannerSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === currentSlide ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Category Icons */}
      <div className="max-w-6xl mx-auto px-4 py-10 bg-white/60">
        <div className="flex justify-center gap-12">
          {[
            { emoji: '🥬', label: '신선식품', cat: '신선식품' },
            { emoji: '🍜', label: '가공식품', cat: '가공식품' },
            { emoji: '🥤', label: '음료', cat: '음료' },
            { emoji: '💧', label: '생수', cat: '생수' },
          ].map(item => (
            <a
              key={item.cat}
              href={`/?category=${item.cat}`}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl group-hover:bg-emerald-50 group-hover:scale-110 transition-all duration-300 mx-auto shadow-sm">
                {item.emoji}
              </div>
              <p className="text-sm text-gray-600 mt-2 group-hover:text-emerald-700 font-medium transition-colors">{item.label}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-px bg-gray-100" />
      </div>

      {/* Product Sections */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {categoryOrder
          .filter(cat => grouped[cat])
          .map((category, catIdx) => (
            <ScrollSection key={category} className={`mb-14 rounded-3xl p-6 ${catIdx % 2 === 1 ? 'bg-emerald-50/40' : ''}`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                <span className="text-xs text-gray-400">{grouped[category].length}개 상품</span>
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
