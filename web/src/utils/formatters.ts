export function formatKRW(value: number): string {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억원`
  if (value >= 10000) return `${Math.round(value / 10000).toLocaleString()}만원`
  return `${value.toLocaleString()}원`
}

export function formatNumber(value: number): string {
  return value.toLocaleString('ko-KR')
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
