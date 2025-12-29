import type { Token } from './token.type'

export interface PoolLiquidity {
  amount: string
}
export interface TokenReserve {
  code: string
  amount: string
}

export interface PoolReserves {
  token0: TokenReserve
  token1: TokenReserve
}

export interface PoolBalances {
  token0: PoolLiquidity
  token1: PoolLiquidity
}

export interface PoolInfo {
  name: string
  address: string
  token0: Token
  token1: Token
  fee: number
  tickSpacing: number
  liquidity: PoolLiquidity
  reserves: PoolReserves
  sqrtPriceX96: bigint
  tick: number
}
