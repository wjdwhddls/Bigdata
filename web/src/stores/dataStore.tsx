import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppData, Customer, Recommendation, AssociationRule, Product, Stats, RfmGrade } from '../types/data'

const DataContext = createContext<AppData | null>(null)

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('데이터 로딩 중')
  return ctx
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/data/customers.json').then(r => r.json()) as Promise<Customer[]>,
      fetch('/data/recommendations.json').then(r => r.json()) as Promise<Recommendation[]>,
      fetch('/data/association_rules.json').then(r => r.json()).catch(() => []) as Promise<AssociationRule[]>,
      fetch('/data/products.json').then(r => r.json()) as Promise<Product[]>,
      fetch('/data/stats.json').then(r => r.json()) as Promise<Stats>,
      fetch('/data/rfm_grades.json').then(r => r.json()).catch(() => []) as Promise<RfmGrade[]>,
    ]).then(([customers, recs, rules, products, stats, rfmGrades]) => {
      setData({
        customers: new Map(customers.map(c => [c.idUser, c])),
        recommendations: new Map(recs.map(r => [r.idUser, r])),
        rules,
        products,
        stats,
        rfmGrades: new Map(rfmGrades.map(g => [g.idUser, g])),
      })
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>
}
