import type { Token } from '~stellar/_common/lib/types/token.type'

/**
 * Represents a pool/liquidity vertex in the token graph
 */
export interface Vertex {
  pair: string // "tokenA|||tokenB"
  poolAddress: string
  token0: string
  token1: string
  reserve0: bigint
  reserve1: bigint
  fee: number
  liquidity: bigint
  sqrtPriceX96: bigint
  tick: number
}

/**
 * Represents a complete swap route
 */
export interface Route {
  route: string[] // Array of token addresses forming the path
  pools: string[] // Array of pool addresses used
  fees: number[] // Array of fee tiers
  amountOut: bigint
  priceImpact: number
  gasEstimate?: bigint
}

/**
 * Route with token objects
 */
export interface RouteWithTokens extends Route {
  tokens: Token[]
}
