import type { PoolId, Token } from 'sushi/types'

export type PoolBase<T extends PoolId = PoolId> = T & {
  name: string

  token0: Token
  token1: Token

  swapFee: number
  // twapEnabled: boolean

  reserve0: bigint
  reserve1: bigint
  liquidity: bigint

  liquidityUSD: number

  volumeUSD: number

  feesUSD: number

  token0Price: number
  token1Price: number

  txCount: number
}
