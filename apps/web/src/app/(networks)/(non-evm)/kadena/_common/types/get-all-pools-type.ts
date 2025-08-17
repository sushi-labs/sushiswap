type TokenRef = {
  id: string
  name: string
  address: string
  chainId: string
}

export type Pool = {
  id: string
  address: string
  token0: TokenRef
  token1: TokenRef
  tvlUsd: number
  volume24hUsd: number
  volume7dUsd: number
  transactionCount24h: number
  apr24h: number
  fees24hUsd: number
}

export type KadenaPoolsApiResponse = {
  success: boolean
  data: {
    pools: Pool[]
    pageInfo: {
      hasNextPage: boolean
      endCursor: string | null
    }
    totalCount: number
  }
}
