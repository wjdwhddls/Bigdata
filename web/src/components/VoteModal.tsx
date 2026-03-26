import { useState, useEffect, useRef } from 'react'

interface VoteModalProps {
  onClose: () => void
  onVoteComplete: () => void
}

const newProducts = [
  {
    name: '트러플 올리브오일',
    emoji: '🫒',
    category: '고급 식재료',
    description: '이탈리아산 블랙 트러플 향을 담은 프리미엄 올리브오일',
    bgColor: 'from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    accentColor: 'text-amber-700',
    ringColor: 'ring-amber-400',
    checkColor: 'bg-amber-500',
  },
  {
    name: '유기농 아사이볼 믹스',
    emoji: '🫐',
    category: '건강식품',
    description: '브라질산 유기농 아사이베리와 슈퍼푸드 블렌드',
    bgColor: 'from-purple-50 to-violet-50',
    borderColor: 'border-purple-200',
    accentColor: 'text-purple-700',
    ringColor: 'ring-purple-400',
    checkColor: 'bg-purple-500',
  },
  {
    name: '제주 감귤 콤부차',
    emoji: '🍊',
    category: '음료',
    description: '제주 유기농 감귤로 발효한 수제 콤부차',
    bgColor: 'from-orange-50 to-red-50',
    borderColor: 'border-orange-200',
    accentColor: 'text-orange-700',
    ringColor: 'ring-orange-400',
    checkColor: 'bg-orange-500',
  },
]

export default function VoteModal({ onClose, onVoteComplete }: VoteModalProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [phase, setPhase] = useState<'vote' | 'coupon' | 'flying'>('vote')
  const couponRef = useRef<HTMLDivElement>(null)

  const handleVote = () => {
    if (selected === null) return
    setPhase('coupon')
  }

  // Coupon fly-to-mypage animation
  useEffect(() => {
    if (phase !== 'coupon') return

    const timer = setTimeout(() => {
      const couponEl = couponRef.current
      const mypageBtn = document.getElementById('mypage-btn')

      if (!couponEl) {
        onVoteComplete()
        onClose()
        return
      }

      // Calculate target position (mypage button or fallback to top-right corner)
      const couponRect = couponEl.getBoundingClientRect()
      let dx: number, dy: number

      if (mypageBtn) {
        const targetRect = mypageBtn.getBoundingClientRect()
        dx = targetRect.left + targetRect.width / 2 - (couponRect.left + couponRect.width / 2)
        dy = targetRect.top + targetRect.height / 2 - (couponRect.top + couponRect.height / 2)
      } else {
        // Fallback: fly to top-right area where mypage button would be
        dx = window.innerWidth * 0.7 - (couponRect.left + couponRect.width / 2)
        dy = 28 - (couponRect.top + couponRect.height / 2)
      }

      // Fade out overlay during flying
      const overlayEl = document.querySelector('[data-vote-overlay]') as HTMLElement
      if (overlayEl) {
        overlayEl.style.transition = 'opacity 0.8s ease'
        overlayEl.style.opacity = '0'
      }

      couponEl.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.8s ease-in'
      couponEl.style.transform = `translate(${dx}px, ${dy}px) scale(0.1)`
      couponEl.style.opacity = '0'

      setPhase('flying')

      setTimeout(() => {
        // Flash the mypage button
        if (mypageBtn) {
          mypageBtn.style.transition = 'all 0.3s ease'
          mypageBtn.style.transform = 'scale(1.3)'
          mypageBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)'
          setTimeout(() => {
            mypageBtn.style.transform = 'scale(1)'
            mypageBtn.style.boxShadow = 'none'
          }, 400)
        }

        onVoteComplete()
        onClose()
      }, 850)
    }, 1800)

    return () => clearTimeout(timer)
  }, [phase, onClose, onVoteComplete])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-overlay-fade">
      {/* Overlay */}
      <div
        data-vote-overlay
        className="absolute inset-0 bg-black/50"
        onClick={phase === 'vote' ? onClose : undefined}
      />

      {phase === 'vote' ? (
        /* ===== Vote Phase ===== */
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-modal-slide">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-8 py-6 text-white text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">🗳️</span>
              <h2 className="text-xl font-extrabold">신제품 투표</h2>
            </div>
            <p className="text-violet-100 text-sm">
              포컬리에서 출시했으면 하는 신제품에 투표해주세요!
            </p>
          </div>

          {/* Products */}
          <div className="px-6 py-6 space-y-3">
            {newProducts.map((product, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-300 ${
                  selected === i
                    ? `${product.borderColor} bg-gradient-to-r ${product.bgColor} ring-2 ${product.ringColor} shadow-md scale-[1.02]`
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                    selected === i ? `bg-white shadow-sm` : 'bg-gray-50'
                  }`}>
                    {product.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold ${selected === i ? product.accentColor : 'text-gray-800'}`}>
                        {product.name}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        selected === i
                          ? `${product.checkColor} text-white`
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">{product.description}</p>
                  </div>
                  {/* Radio indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selected === i
                      ? `${product.checkColor} border-transparent`
                      : 'border-gray-300'
                  }`}>
                    {selected === i && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <button
              onClick={handleVote}
              disabled={selected === null}
              className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all duration-300 ${
                selected !== null
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              투표완료
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              투표 완료 시 <span className="font-bold text-emerald-600">무료배송 쿠폰</span>이 지급됩니다
            </p>
          </div>

          {/* 닫기 버튼 */}
          <div className="border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-4 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200"
            >
              닫기
            </button>
          </div>
        </div>
      ) : (
        /* ===== Coupon Phase ===== */
        <div className="relative flex items-center justify-center">
          {/* Confetti particles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * 360
            const rad = (angle * Math.PI) / 180
            const dist = 80 + Math.random() * 60
            return (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-confetti"
                style={{
                  '--tx': `${Math.cos(rad) * dist}px`,
                  '--ty': `${Math.sin(rad) * dist}px`,
                  backgroundColor: ['#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#ef4444'][i % 6],
                  animationDelay: `${i * 40}ms`,
                } as React.CSSProperties}
              />
            )
          })}

          {/* Coupon card */}
          <div
            ref={couponRef}
            className="animate-coupon-appear"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-72 border border-emerald-100">
              {/* Top section */}
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 px-6 py-5 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <p className="text-emerald-100 text-xs font-medium mb-1">투표 감사 쿠폰</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black">무료배송</span>
                </div>
                <p className="text-emerald-100 text-xs mt-2">FREE DELIVERY COUPON</p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-black/50 rounded-full" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-black/50 rounded-full" />
                <div className="border-t-2 border-dashed border-gray-200 mx-6" />
              </div>

              {/* Bottom section */}
              <div className="px-6 py-4 text-center">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-emerald-600">₩20,000</span> 이상 구매 시
                </p>
                <p className="text-xs text-gray-400 mt-1">기간 제한 없음</p>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-emerald-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="animate-checkmark" />
                  </svg>
                  <span className="text-xs font-bold">마이페이지에 저장됩니다</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
