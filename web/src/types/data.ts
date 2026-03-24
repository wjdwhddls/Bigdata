export interface Customer {
  idUser: string
  avg_order_amount: number
  avg_order_item_count: number
  total_order_count: number
  total_spend: number
  max_order_amount: number
  min_order_amount: number
  order_amount_std: number
  order_amount_range: number
  delay_count: number
  delay_rate: number
  on_time_count: number
  Gender: string
  Age: number
  FamilyCount: number
  MemberYN: string
  AgeGroup: string
}

export interface Recommendation {
  idUser: string
  ageGroup: string
  purchaseCount: number
  recommendations: { name: string; score: number }[]
}

export interface AssociationRule {
  antecedents: string[]
  consequents: string[]
  support: number
  confidence: number
  lift: number
  ageGroup: string
}

export interface Product {
  name: string
  category: string
  subCategory: string
  code: string
}

export interface AgeGroupStat {
  count: number
  avgSpend: number
  avgOrderCount: number
  avgOrderAmount: number
  avgDelayRate: number
  avgItemCount: number
}

export interface Stats {
  totalCustomers: number
  totalRevenue: number
  avgOrderAmount: number
  avgOrderCount: number
  avgDelayRate: number
  ageDistribution: Record<string, number>
  genderDistribution: Record<string, number>
  spendDistribution: { bins: number[]; counts: number[] }
  delayRateDistribution: { bins: number[]; counts: number[] }
  ageGroupStats: Record<string, AgeGroupStat>
}

export interface RfmGrade {
  idUser: string
  grade: 'VIP' | 'Gold' | 'Silver' | 'Bronze'
  compositeScore: number
  rScore: number
  fScore: number
  mScore: number
}

export interface AppData {
  customers: Map<string, Customer>
  recommendations: Map<string, Recommendation>
  rules: AssociationRule[]
  products: Product[]
  stats: Stats
  rfmGrades: Map<string, RfmGrade>
}
