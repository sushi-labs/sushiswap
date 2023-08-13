import { SushiSwapV3ChainId } from '@sushiswap/v3-sdk'

import { useConcentratedLiquidityPositions } from './hooks'

export interface ConcentratedLiquidityPosition {
  id: string
  address: string
  chainId: SushiSwapV3ChainId
  nonce: bigint
  tokenId: bigint
  operator: string
  token0: string
  token1: string
  fee: number
  fees: bigint[] | undefined
  tickLower: number
  tickUpper: number
  liquidity: bigint
  feeGrowthInside0LastX128: bigint
  feeGrowthInside1LastX128: bigint
  tokensOwed0: bigint
  tokensOwed1: bigint
}

export type ConcentratedLiquidityPositionWithV3Pool = NonNullable<
  ReturnType<typeof useConcentratedLiquidityPositions>['data']
>[number]
