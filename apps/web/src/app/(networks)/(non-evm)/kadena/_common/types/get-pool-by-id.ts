export type PoolChartData = {
  timestamp: string
  value: string
}

export type PoolTransaction = {
  id: string
  maker: string
  amount0In: string
  amount1In: string
  amount0Out: string
  amount1Out: string
  amountUsd: string
  timestamp: string
  transactionType: string
  requestkey: string
}

export type PoolTransactions = {
  totalCount: number
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string | null
    endCursor: string | null
  }
  transactions: PoolTransaction[]
}
