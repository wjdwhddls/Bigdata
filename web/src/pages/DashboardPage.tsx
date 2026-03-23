import { useData } from '../stores/dataStore'
import { formatKRW, formatNumber, formatPercent } from '../utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#10b981']

export default function DashboardPage() {
  const { stats } = useData()

  const ageData = Object.entries(stats.ageDistribution)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({ name, value }))

  const genderData = Object.entries(stats.genderDistribution)
    .map(([name, value]) => ({ name, value }))

  const spendData = stats.spendDistribution.counts.map((count, i) => ({
    name: `${(stats.spendDistribution.bins[i] / 10000).toFixed(0)}만`,
    count,
  }))

  const delayData = stats.delayRateDistribution.counts.map((count, i) => ({
    name: `${stats.delayRateDistribution.bins[i]}%`,
    count,
  }))

  const ageGroupStatsData = Object.entries(stats.ageGroupStats)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, s]) => ({
      name,
      평균지출: s.avgSpend,
      평균주문액: s.avgOrderAmount,
      평균주문횟수: s.avgOrderCount,
      지연율: s.avgDelayRate,
    }))

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">대시보드</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: '총 고객 수', value: formatNumber(stats.totalCustomers) + '명', color: 'blue' },
          { label: '총 매출', value: formatKRW(stats.totalRevenue), color: 'green' },
          { label: '평균 주문액', value: formatKRW(stats.avgOrderAmount), color: 'emerald' },
          { label: '평균 주문 횟수', value: `${stats.avgOrderCount}회`, color: 'amber' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* 연령대 분포 */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">연령대 분포</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} name="고객 수" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 성별 분포 */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">성별 분포</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 지출 분포 */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">고객별 총 지출 분포</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={spendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} name="고객 수" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 배송 지연율 분포 */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">배송 지연율 분포</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={delayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" radius={[4, 4, 0, 0]} name="고객 수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 연령대별 비교 */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">연령대별 평균 지표 비교</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageGroupStatsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(v, name) => {
              const n = Number(v)
              return name === '평균지출' ? formatKRW(n) :
              name === '평균주문액' ? formatKRW(n) :
              name === '지연율' ? formatPercent(n) : n
            }} />
            <Legend />
            <Bar yAxisId="left" dataKey="평균주문액" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="평균주문횟수" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="지연율" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
