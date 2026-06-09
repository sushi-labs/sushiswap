import type { StellarContractAddress, StellarToken } from 'sushi/stellar'

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
  address: StellarContractAddress
  token0: StellarToken
  token1: StellarToken
  fee: number
  tickSpacing: number
  liquidity: PoolLiquidity
  reserves: PoolReserves
  sqrtPriceX96: bigint
  tick: number
}
