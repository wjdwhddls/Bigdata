import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { CartItem } from '../App'
import { getProductVisual } from '../utils/productImages'

interface CartPageProps {
  cartItems: CartItem[]
  onRemoveFromCart: (code: string) => void
  onClearCart: () => void
}

export default function CartPage({ cartItems, onRemoveFromCart }: CartPageProps) {
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(
    () => new Set(cartItems.map(i => i.code))
  )

  const allSelected = cartItems.length > 0 && selectedCodes.size === cartItems.length

  const toggleAll = () => {
    if (allSelected) {
      setSelectedCodes(new Set())
    } else {
      setSelectedCodes(new Set(cartItems.map(i => i.code)))
    }
  }

  const toggleItem = (code: string) => {
    setSelectedCodes(prev => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  const removeSelected = () => {
    selectedCodes.forEach(code => onRemoveFromCart(code))
    setSelectedCodes(new Set())
  }

  const selectedCount = selectedCodes.size

  const selectedItems = useMemo(
    () => cartItems.filter(i => selectedCodes.has(i.code)),
    [cartItems, selectedCodes]
  )

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <h2 className="text-2xl font-extrabold text-gray-800 mb-3">장바구니가 비어있습니다</h2>
        <p className="text-gray-400 mb-8">상품을 장바구니에 담아보세요</p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
        >
          쇼핑하러 가기
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 tracking-tight">장바구니</h1>

      <div className="flex gap-8">
        {/* Left: Cart items */}
        <div className="flex-1">
          {/* Select all / delete bar */}
          <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3 border border-gray-100 mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <span className="text-sm font-semibold text-gray-700">
                전체선택 ({selectedCount}/{cartItems.length})
              </span>
            </label>
            <button
              onClick={removeSelected}
              disabled={selectedCount === 0}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-default"
            >
              선택삭제
            </button>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {cartItems.map((item, i) => {
              const { emoji, bgColor, image } = getProductVisual(item.name)
              const isSelected = selectedCodes.has(item.code)
              return (
                <div
                  key={item.code}
                  className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-5 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItem(item.code)}
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer flex-shrink-0 accent-emerald-600"
                  />
                  <Link
                    to={`/product/${encodeURIComponent(item.name)}`}
                    className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden group"
                    style={{ backgroundColor: bgColor }}
                  >
                    {image ? (
                      <img src={image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${encodeURIComponent(item.name)}`}
                      className="text-base font-bold text-gray-800 hover:text-emerald-600 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-400 mt-1">{item.category} &gt; {item.subCategory}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{item.code}</p>
                  </div>
                  <button
                    onClick={() => {
                      onRemoveFromCart(item.code)
                      setSelectedCodes(prev => {
                        const next = new Set(prev)
                        next.delete(item.code)
                        return next
                      })
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex-shrink-0"
                    title="삭제"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
            <h3 className="text-lg font-extrabold text-gray-800 mb-5">주문 정보</h3>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">선택 상품</span>
                <span className="font-bold text-gray-700">{selectedCount}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">배송비</span>
                <span className="font-bold text-emerald-600">무료</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="text-gray-700 font-bold">총 상품</span>
                <span className="text-xl font-extrabold text-gray-800">{selectedCount}개</span>
              </div>
            </div>
            <button
              onClick={() => alert('주문 기능은 준비 중입니다.')}
              disabled={selectedCount === 0}
              className="w-full py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-teal-500 hover:to-emerald-600 transition-all duration-300 active:scale-[0.98] shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-default disabled:active:scale-100"
            >
              주문하기 ({selectedCount}개)
            </button>
          </div>
        </div>
      </div>

      {/* Recommended products section */}
      {selectedItems.length > 0 && (
        <div className="mt-16">
          <h3 className="text-xl font-extrabold text-gray-800 mb-6 tracking-tight">
            함께 보면 좋은 상품
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {cartItems.slice(0, 6).map(item => {
              const { emoji, bgColor, image } = getProductVisual(item.name)
              return (
                <Link
                  key={item.code}
                  to={`/product/${encodeURIComponent(item.name)}`}
                  className="flex-shrink-0 w-40 bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-full h-32 flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                    {image ? (
                      <img src={image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-gray-700 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.category}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
