export type SortOrder = 'dateDesc' | 'dateAsc'

export interface DailySalesSummary {
  salesDate: string
  areaName: string
  branchName: string
  budgetAmount: number
  actualAmount: number
}
