import { useState, useEffect } from 'react'

interface CouponModalProps {
  onClose: () => void
}

const coupons = [
  {
    title: '신규가입 환영 쿠폰',
    discount: '20% 할인',
    condition: '₩10,000 이상 구매시',
    period: '기간 제한없음',
  },
  {
    title: '첫 주문 할인 쿠폰',
    discount: '₩3,000 할인',
    condition: '₩15,000 이상 구매시',
    period: '기간 제한없음',
  },
  {
    title: '무료배송 쿠폰',
    discount: '배송비 무료',
    condition: '₩20,000 이상 구매시',
    period: '기간 제한없음',
  },
]

export default function CouponModal({ onClose }: CouponModalProps) {
  const [phase, setPhase] = useState<'fly' | 'list'>('fly')
  const [downloaded, setDownloaded] = useState<Set<number>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => setPhase('list'), 2200)
    return () => clearTimeout(timer)
  }, [])

  const handleDownload = (index: number) => {
    setDownloaded(prev => new Set(prev).add(index))
  }

  const handleDownloadAll = () => {
    setDownloaded(new Set(coupons.map((_, i) => i)))
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center animate-overlay-fade">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={phase === 'list' ? onClose : undefined}
      />

      {phase === 'fly' ? (
        /* Phase 1: Single coupon flying in */
        <div className="relative z-10 animate-coupon-fly">
          {/* Coupon ticket shape */}
          <div className="relative w-80 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl overflow-hidden animate-coupon-glow">
            {/* Notch left */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-black/50 rounded-full" />
            {/* Notch right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-black/50 rounded-full" />

            {/* Dashed line */}
            <div className="absolute left-8 right-8 top-1/2 border-t-2 border-dashed border-white/20" />

            {/* Content */}
            <div className="px-10 pt-8 pb-6 text-center text-white">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-black">P</span>
                </div>
                <span className="text-sm font-bold text-white/80">포컬리</span>
              </div>
              <p className="text-sm font-medium text-white/70 tracking-widest uppercase mb-3">
                New Member Coupon
              </p>
              <h2 className="text-4xl font-black mb-1 tracking-tight">
                신규고객 할인쿠폰
              </h2>
              <div className="mt-4 mb-4">
                <span className="text-6xl font-black leading-none">20</span>
                <span className="text-3xl font-black">%</span>
              </div>
              <p className="text-white/60 text-xs">가입 즉시 사용 가능</p>
            </div>

            {/* Bottom section */}
            <div className="bg-white/10 px-10 py-4 text-center">
              <p className="text-white/80 text-xs font-medium tracking-wider">
                CODE: <span className="font-bold text-white">WELCOME20</span>
              </p>
            </div>

            {/* Sparkle decorations */}
            <div className="absolute top-3 right-4 text-yellow-300/80 text-lg animate-pulse">*</div>
            <div className="absolute bottom-12 left-4 text-yellow-300/60 text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>*</div>
            <div className="absolute top-10 left-6 text-white/30 text-xs animate-pulse" style={{ animationDelay: '1s' }}>+</div>
          </div>
        </div>
      ) : (
        /* Phase 2: Coupon list modal */
        <div className="relative z-10 w-full max-w-md mx-4 animate-modal-slide">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">쿠폰 다운로드</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Coupon List */}
            <div className="px-6 py-4 space-y-3 max-h-80 overflow-y-auto">
              {coupons.map((coupon, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-200"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">{coupon.title}</h4>
                    <p className="text-base font-extrabold text-emerald-600 mt-0.5">{coupon.discount}</p>
                    <p className="text-xs text-gray-400 mt-1">{coupon.condition}</p>
                    <p className="text-xs text-gray-400">{coupon.period}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 flex-shrink-0 ml-3 ${
                      downloaded.has(i)
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-gray-100 text-gray-500 hover:bg-emerald-100 hover:text-emerald-600'
                    }`}
                  >
                    {downloaded.has(i) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2 space-y-3">
              <button className="text-sm text-gray-500 hover:text-emerald-600 transition-colors w-full text-center py-1 underline underline-offset-2">
                내 쿠폰 보기
              </button>
              <button
                onClick={handleDownloadAll}
                className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                전체 쿠폰 다운로드
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
