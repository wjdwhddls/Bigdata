import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useData } from '../stores/dataStore'
import { getProductVisual } from '../utils/productImages'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import ProductCard from '../components/ProductCard'

interface ProductPageProps {
  currentUserId?: string
}

function ScrollSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1)
  return (
    <div ref={ref} className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

export default function ProductPage({ currentUserId }: ProductPageProps) {
  const { name } = useParams<{ name: string }>()
  const productName = decodeURIComponent(name || '')
  const { products, rules, customers } = useData()

  const product = products.find(p => p.name === productName)
  const { emoji, bgColor } = getProductVisual(productName)

  const userAgeGroup = currentUserId
    ? customers.get(currentUserId)?.AgeGroup
    : undefined

  const associatedProducts = useMemo(() => {
    let matched = rules.filter(r =>
      r.antecedents.includes(productName) &&
      r.ageGroup === (userAgeGroup ? userAgeGroup : '전체')
    )

    if (matched.length === 0 && userAgeGroup) {
      matched = rules.filter(r =>
        r.antecedents.includes(productName) && r.ageGroup === '전체'
      )
    }

    if (matched.length === 0) {
      matched = rules.filter(r =>
        r.consequents.includes(productName) &&
        (r.ageGroup === (userAgeGroup || '전체') || r.ageGroup === '전체')
      )
      return matched
        .sort((a, b) => b.lift - a.lift)
        .slice(0, 12)
        .map(r => ({
          names: r.antecedents.filter(n => n !== productName),
          confidence: r.confidence,
          lift: r.lift,
          support: r.support,
          ageGroup: r.ageGroup,
        }))
    }

    return matched
      .sort((a, b) => b.lift - a.lift)
      .slice(0, 12)
      .map(r => ({
        names: r.consequents.filter(n => n !== productName),
        confidence: r.confidence,
        lift: r.lift,
        support: r.support,
        ageGroup: r.ageGroup,
      }))
  }, [rules, productName, userAgeGroup])

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center animate-fade-in">
        <p className="text-7xl mb-6">🔍</p>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">상품을 찾을 수 없습니다</h2>
        <Link to="/" className="bg-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-700 transition-all">
          홈으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-8 animate-fade-in-up">
        <Link to="/" className="hover:text-emerald-600 transition-colors">홈</Link>
        <span className="mx-2">/</span>
        <Link to={`/?category=${product.category}`} className="hover:text-emerald-600 transition-colors">{product.category}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">{productName}</span>
      </nav>

      {/* Product Detail */}
      <div className="flex gap-10 mb-16">
        <div
          className="w-96 h-96 rounded-3xl flex items-center justify-center flex-shrink-0 animate-scale-in relative overflow-hidden group"
          style={{ backgroundColor: bgColor }}
        >
          <span className="text-9xl select-none transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
            {emoji}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
        </div>

        <div className="flex-1 pt-4 animate-slide-right">
          <span className="inline-block text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full mb-4">
            {product.category} &gt; {product.subCategory}
          </span>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 tracking-tight">{productName}</h2>

          <div className="space-y-3 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-3">
              <span className="w-20 text-gray-400">상품 코드</span>
              <span className="font-mono text-gray-700 bg-gray-50 px-3 py-1 rounded">{product.code}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-gray-400">대분류</span>
              <span className="text-gray-700">{product.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-20 text-gray-400">중분류</span>
              <span className="text-gray-700">{product.subCategory}</span>
            </div>
          </div>

          {currentUserId ? (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
              <p className="text-sm text-emerald-700">
                <span className="font-bold">{currentUserId}</span>님, 이 상품과 함께 많이 구매하는 상품을 추천해드립니다
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <p className="text-sm text-gray-500">
                로그인하시면 맞춤 연관 상품을 확인할 수 있습니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Associated Products */}
      <ScrollSection className="mb-16">
        <div className="mb-8">
          <h3 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            이 상품과 함께 많이 구매한 상품
          </h3>
          <p className="text-sm text-gray-400 mt-2">
            {userAgeGroup
              ? `${userAgeGroup} 고객들이 많이 찾은 상품`
              : '고객들이 함께 많이 구매한 상품'}
          </p>
        </div>

        {associatedProducts.length > 0 ? (
          <div className="space-y-4">
            {associatedProducts.map((assoc, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-5 card-hover opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              >
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                  {i + 1}
                </span>
                <div className="flex gap-3 overflow-x-auto flex-1 py-1">
                  {assoc.names.map(n => (
                    <ProductCard key={n} name={n} size="sm" />
                  ))}
                </div>
                <div className="flex-shrink-0 text-right space-y-1.5">
                  <p className="text-xs text-gray-400">
                    함께 구매 <span className="font-bold text-emerald-600 text-sm">{(assoc.confidence * 100).toFixed(0)}%</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    연관도 <span className="font-bold text-gray-700">{(assoc.lift * 100).toFixed(0)}%</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-gray-500 font-medium mb-2">
              {rules.length === 0
                ? '연관규칙 데이터가 아직 없습니다'
                : '이 상품의 연관 규칙이 없습니다'}
            </p>
            {rules.length === 0 && (
              <p className="text-sm text-gray-400">
                연관분석.ipynb 노트북의 JSON 내보내기 셀을 실행해주세요
              </p>
            )}
          </div>
        )}
      </ScrollSection>

      {/* Back */}
      <div className="text-center pb-8">
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
        >
          ← 전체 상품 보기
        </Link>
      </div>
    </div>
  )
}
