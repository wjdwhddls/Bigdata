import { Link } from 'react-router-dom'
import { getProductVisual } from '../utils/productImages'

interface ProductCardProps {
  name: string
  subLabel?: string
  score?: number
  size?: 'sm' | 'md' | 'lg'
  delay?: number
  animated?: boolean
}

export default function ProductCard({ name, subLabel, score, size = 'md', delay = 0, animated = false }: ProductCardProps) {
  const { emoji, bgColor } = getProductVisual(name)

  const sizeClasses = {
    sm: { card: 'w-32', img: 'h-28 text-4xl', text: 'text-xs' },
    md: { card: 'w-full', img: 'h-40 text-5xl', text: 'text-sm' },
    lg: { card: 'w-56', img: 'h-52 text-7xl', text: 'text-base' },
  }
  const s = sizeClasses[size]

  return (
    <Link
      to={`/product/${encodeURIComponent(name)}`}
      className={`${s.card} group cursor-pointer flex-shrink-0 ${animated ? 'opacity-0 animate-fade-in-up' : ''}`}
      style={animated ? { animationDelay: `${delay}ms`, animationFillMode: 'forwards' } : undefined}
    >
      <div className="card-3d rounded-2xl overflow-hidden bg-white">
        <div
          className={`${s.img} flex items-center justify-center relative overflow-hidden`}
          style={{ backgroundColor: bgColor }}
        >
          <span className="select-none transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
            {emoji}
          </span>
          {/* Hover shimmer overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
          {score !== undefined && score > 0 && (
            <span className="absolute top-3 right-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg shadow-emerald-500/30">
              {(score * 100).toFixed(0)}%
            </span>
          )}
        </div>
        <div className="p-3">
          <p className={`${s.text} font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors duration-300`}>
            {name}
          </p>
          {subLabel && (
            <p className="text-xs text-gray-400 mt-0.5">{subLabel}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
