import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../stores/dataStore'
import { formatKRW, formatPercent } from '../utils/formatters'
import { useScrollAnimation, useCountUp } from '../hooks/useScrollAnimation'
import ProductCard from '../components/ProductCard'

interface MyPageProps {
  onUserChange: (id: string) => void
}

function CountUpStat({ value, label, icon, sub }: { value: number; label: string; icon: string; sub: string }) {
  const { count, ref } = useCountUp(value, 1200)
  return (
    <div ref={ref} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 card-hover">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-extrabold text-gray-800">{count.toLocaleString()}</p>
      <p className="text-xs text-gray-400 mt-2">{sub}</p>
    </div>
  )
}

function ScrollSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1)
  return (
    <div ref={ref} className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

const gradeConfig = {
  VIP:    { label: 'VIP',    gradient: 'from-red-500 via-rose-600 to-red-700',           tagBg: 'bg-red-400/20 text-red-200 border-red-400/30',          subtextColor: 'text-red-200' },
  Gold:   { label: 'Gold',   gradient: 'from-amber-600 via-yellow-700 to-amber-700',    tagBg: 'bg-amber-400/20 text-amber-200 border-amber-400/30',    subtextColor: 'text-amber-200' },
  Silver: { label: 'Silver', gradient: 'from-gray-400 via-slate-500 to-gray-600',        tagBg: 'bg-gray-300/20 text-gray-200 border-gray-300/30',       subtextColor: 'text-gray-300' },
  Bronze: { label: 'Bronze', gradient: 'from-orange-700 via-amber-800 to-orange-800',    tagBg: 'bg-orange-400/20 text-orange-200 border-orange-400/30', subtextColor: 'text-orange-200' },
} as const

export default function MyPage({ onUserChange }: MyPageProps) {
  const { userId } = useParams<{ userId: string }>()
  const { customers, recommendations, stats, rfmGrades } = useData()

  const customer = userId ? customers.get(userId) : null
  const rec = userId ? recommendations.get(userId) : null
  const rfm = userId ? rfmGrades.get(userId) : null
  const grade = rfm?.grade ?? 'Bronze'
  const gc = gradeConfig[grade]

  useEffect(() => {
    if (userId) onUserChange(userId)
  }, [userId, onUserChange])

  if (!customer) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center animate-fade-in">
        <p className="text-7xl mb-6">😢</p>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">고객을 찾을 수 없습니다</h2>
        <p className="text-gray-400 mb-8">"{userId}" 에 해당하는 고객이 없습니다.</p>
        <Link to="/" className="bg-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-500/30">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  const getPercentile = (value: number, field: 'total_spend' | 'total_order_count') => {
    let count = 0
    customers.forEach(c => { if (c[field] <= value) count++ })
    return Math.round((count / customers.size) * 100)
  }

  const spendRank = 100 - getPercentile(customer.total_spend, 'total_spend')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Profile Header */}
      <div className={`bg-gradient-to-r ${gc.gradient} rounded-3xl p-8 text-white mb-10 relative overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-8 w-56 h-56 bg-white/5 rounded-full" />

        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl shadow-lg">
            {customer.Gender === '여성' ? '👩' : '👨'}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight">{customer.idUser}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-white/15 backdrop-blur rounded-full px-3 py-1 text-sm">{customer.AgeGroup}</span>
              <span className="bg-white/15 backdrop-blur rounded-full px-3 py-1 text-sm">{customer.Gender}</span>
              <span className="bg-white/15 backdrop-blur rounded-full px-3 py-1 text-sm">가족 {customer.FamilyCount}명</span>
              <span className={`backdrop-blur rounded-full px-3 py-1 text-sm font-bold border ${gc.tagBg}`}>
                {gc.label}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className={`${gc.subtextColor} text-sm mb-1`}>누적 결제</p>
            <p className="text-3xl font-extrabold">{formatKRW(customer.total_spend)}</p>
            <p className={`${gc.subtextColor} text-sm mt-1`}>상위 {spendRank}% 고객</p>
          </div>
        </div>
      </div>

      {/* Grade Discount Banner + VIP Progress */}
      {(() => {
        const vipThreshold = 5000000
        const progress = Math.min((customer.total_spend / vipThreshold) * 100, 100)
        const remaining = Math.max(vipThreshold - customer.total_spend, 0)
        const isVIP = grade === 'VIP'
        const isGold = grade === 'Gold'
        return (
          <div className={`mb-6 rounded-2xl p-5 border ${
            isVIP
              ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200/60'
              : isGold
              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/60'
              : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200/60'
          }`}>
            {/* Discount info for VIP/Gold */}
            {(isVIP || isGold) && (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{isVIP ? '🎖️' : '🏅'}</span>
                <div>
                  <span className={`text-sm font-bold ${isVIP ? 'text-red-600' : 'text-amber-700'}`}>
                    {grade} 등급 혜택
                  </span>
                  <p className={`text-lg font-extrabold ${isVIP ? 'text-red-700' : 'text-amber-800'}`}>
                    모든 상품 {isVIP ? '10%' : '5%'} 할인 적용 중
                  </p>
                </div>
              </div>
            )}

            {/* VIP Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold ${isVIP ? 'text-red-600' : 'text-gray-600'}`}>
                  {isVIP ? 'VIP 달성 완료!' : `VIP까지 ${formatKRW(remaining)} 남았습니다`}
                </span>
                <span className="text-xs text-gray-400">
                  {formatKRW(customer.total_spend)} / {formatKRW(vipThreshold)}
                </span>
              </div>
              <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )
      })()}

      {/* Quick Stats */}
      <ScrollSection className="mb-12">
        <div className="grid grid-cols-4 gap-5">
          <CountUpStat
            value={customer.total_order_count}
            label="총 주문"
            icon="📦"
            sub={`평균 ${stats.avgOrderCount}회`}
          />
          <CountUpStat
            value={Math.round(customer.avg_order_amount)}
            label="평균 주문액"
            icon="💰"
            sub={`평균 ${formatKRW(stats.avgOrderAmount)}`}
          />
          <CountUpStat
            value={Math.round(customer.avg_order_item_count * 10)}
            label="주문당 품목 (x10)"
            icon="🛒"
            sub={`실제 ${customer.avg_order_item_count.toFixed(1)}개`}
          />
          <CountUpStat
            value={Math.round(customer.delay_rate * 10)}
            label="지연율 (x10)"
            icon="🚚"
            sub={`실제 ${formatPercent(customer.delay_rate)} | 평균 ${formatPercent(stats.avgDelayRate)}`}
          />
        </div>
      </ScrollSection>

      {/* CF Recommendations */}
      <ScrollSection className="mb-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              {customer.idUser}님을 위한 추천 상품
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              구매 이력을 바탕으로 선별한 맞춤 상품입니다
            </p>
          </div>
        </div>

        {rec?.recommendations.length ? (
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
        ) : (
          <p className="text-gray-400">추천 데이터가 없습니다</p>
        )}
      </ScrollSection>

      {/* Explore */}
      <ScrollSection>
        <div className="bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 rounded-3xl p-10 text-center text-white">
          <h3 className="text-2xl font-extrabold mb-3">상품을 둘러보세요</h3>
          <p className="text-emerald-200 mb-6">상품을 클릭하면 함께 많이 구매한 상품을 확인할 수 있습니다</p>
          <Link
            to="/#products"
            className="inline-block bg-white text-emerald-700 px-8 py-3 rounded-full font-bold hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
          >
            전체 상품 보기 →
          </Link>
        </div>
      </ScrollSection>
    </div>
  )
}
