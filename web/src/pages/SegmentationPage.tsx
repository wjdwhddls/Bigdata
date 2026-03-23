import { useMemo, useState } from 'react'
import { useData } from '../stores/dataStore'
import { formatKRW } from '../utils/formatters'
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

const AGE_COLORS: Record<string, string> = {
  '20대': '#3b82f6',
  '30대': '#10b981',
  '40대': '#f59e0b',
  '50대': '#ef4444',
  '60대': '#10b981',
}

export default function SegmentationPage() {
  const { customers, stats } = useData()
  const [colorBy, setColorBy] = useState<'AgeGroup' | 'Gender'>('AgeGroup')

  const scatterData = useMemo(() => {
    const result: Record<string, { x: number; y: number; id: string; group: string }[]> = {}
    customers.forEach(c => {
      const group = colorBy === 'AgeGroup' ? c.AgeGroup : c.Gender
      if (!result[group]) result[group] = []
      result[group].push({
        x: c.total_order_count,
        y: c.total_spend,
        id: c.idUser,
        group,
      })
    })
    return result
  }, [customers, colorBy])

  // Radar data (normalized to 0-100 for comparability)
  const radarData = useMemo(() => {
    const metrics = ['avgOrderAmount', 'avgOrderCount', 'avgSpend', 'avgDelayRate', 'avgItemCount'] as const
    const labels = ['주문액', '주문횟수', '총지출', '지연율', '품목수']
    const maxVals = metrics.map(m =>
      Math.max(...Object.values(stats.ageGroupStats).map(s => s[m]))
    )
    return labels.map((label, i) => {
      const row: Record<string, string | number> = { metric: label }
      Object.entries(stats.ageGroupStats).forEach(([ag, s]) => {
        row[ag] = Math.round((s[metrics[i]] / maxVals[i]) * 100)
      })
      return row
    })
  }, [stats])

  // Spending tiers
  const tierData = useMemo(() => {
    const tiers = { '저소비': 0, '중소비': 0, '고소비': 0 }
    customers.forEach(c => {
      if (c.total_spend < 3000000) tiers['저소비']++
      else if (c.total_spend < 5500000) tiers['중소비']++
      else tiers['고소비']++
    })
    return Object.entries(tiers).map(([name, value]) => ({ name, value }))
  }, [customers])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">고객 세그먼트</h2>

      {/* Scatter Plot */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-gray-700">주문 횟수 vs 총 지출</h3>
          <select
            value={colorBy}
            onChange={e => setColorBy(e.target.value as 'AgeGroup' | 'Gender')}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm"
          >
            <option value="AgeGroup">연령대별</option>
            <option value="Gender">성별</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" name="주문 횟수" type="number" fontSize={11} label={{ value: '주문 횟수', position: 'bottom', fontSize: 12 }} />
            <YAxis dataKey="y" name="총 지출" type="number" fontSize={11} tickFormatter={v => `${(v / 10000).toFixed(0)}만`} />
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null
                const d = payload[0].payload
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border text-xs">
                    <p className="font-medium">{d.id} ({d.group})</p>
                    <p>주문 횟수: {d.x}회</p>
                    <p>총 지출: {formatKRW(d.y)}</p>
                  </div>
                )
              }}
            />
            <Legend />
            {Object.entries(scatterData).sort(([a], [b]) => a.localeCompare(b)).map(([group, data]) => (
              <Scatter
                key={group}
                name={group}
                data={data}
                fill={AGE_COLORS[group] || '#6b7280'}
                fillOpacity={0.5}
                r={3}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">연령대별 지표 비교 (레이더)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" fontSize={11} />
              <PolarRadiusAxis fontSize={10} />
              {Object.keys(stats.ageGroupStats).sort().map(ag => (
                <Radar
                  key={ag}
                  name={ag}
                  dataKey={ag}
                  stroke={AGE_COLORS[ag] || '#6b7280'}
                  fill={AGE_COLORS[ag] || '#6b7280'}
                  fillOpacity={0.1}
                />
              ))}
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Spending Tiers */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">소비 등급 분포</h3>
          <p className="text-xs text-gray-400 mb-4">저: ~300만 | 중: 300~550만 | 고: 550만~</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tierData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" name="고객 수" radius={[4, 4, 0, 0]}>
                {tierData.map((_, i) => {
                  const colors = ['#93c5fd', '#3b82f6', '#1d4ed8']
                  return <rect key={i} fill={colors[i]} />
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Age Group Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-700 px-5 pt-5 mb-4">연령대별 상세 비교</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">연령대</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">고객 수</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">평균 총지출</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">평균 주문액</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">평균 주문횟수</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">평균 품목 수</th>
              <th className="text-right px-4 py-3 text-gray-600 font-medium">배송 지연율</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.ageGroupStats).sort(([a], [b]) => a.localeCompare(b)).map(([ag, s]) => (
              <tr key={ag} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-2.5">
                  <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ background: AGE_COLORS[ag] }} />
                  {ag}
                </td>
                <td className="px-4 py-2.5 text-right">{s.count.toLocaleString()}명</td>
                <td className="px-4 py-2.5 text-right">{formatKRW(s.avgSpend)}</td>
                <td className="px-4 py-2.5 text-right">{formatKRW(s.avgOrderAmount)}</td>
                <td className="px-4 py-2.5 text-right">{s.avgOrderCount}회</td>
                <td className="px-4 py-2.5 text-right">{s.avgItemCount}개</td>
                <td className="px-4 py-2.5 text-right">{s.avgDelayRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
