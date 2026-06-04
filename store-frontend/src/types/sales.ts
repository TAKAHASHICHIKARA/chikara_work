export type SortOrder = 'dateDesc' | 'dateAsc'

export interface DailySalesSummary {
  salesDate: string
  areaName: string
  branchName: string
  budgetAmount: number
  actualAmount: number
}

export interface BranchSummary {
  branchName: string
  areaName: string
  totalBudget: number
  totalActual: number
}
