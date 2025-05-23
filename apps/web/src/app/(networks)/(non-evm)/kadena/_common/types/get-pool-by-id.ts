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

export type PoolByIdResponse = {
  id: string
  address: string
  token0: {
    id: string
    name: string
  }
  token1: {
    id: string
    name: string
  }
  reserve0: string
  reserve1: string
  totalSupply: string
  tvlUsd: string
  tvlChange24h: number
  volume24hUsd: string
  volumeChange24h: number
  volume7dUsd: string
  fees24hUsd: string
  feesChange24h: number
  transactionCount24h: number
  transactionCountChange24h: number
  apr24h: string
  charts: {
    volume: PoolChartData[]
    tvl: PoolChartData[]
    fees: PoolChartData[]
  }

  transactions: PoolTransactions
}
