import type { DailySalesSummary, SortOrder } from '../types/sales'

interface FetchParams {
  startDate?: string
  endDate?: string
  sort?: SortOrder
}

export async function fetchDailySummary(params: FetchParams): Promise<DailySalesSummary[]> {
  const query = new URLSearchParams()
  if (params.startDate) query.set('startDate', params.startDate)
  if (params.endDate)   query.set('endDate',   params.endDate)
  if (params.sort)      query.set('sort',       params.sort)

  const res = await fetch(`/api/sales/daily-summary?${query}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}
