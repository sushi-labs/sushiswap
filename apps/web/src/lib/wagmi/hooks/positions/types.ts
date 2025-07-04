import type { SushiSwapV3ChainId } from 'sushi/evm'

import type { Address } from 'viem'
import type { useConcentratedLiquidityPositions } from './hooks/useConcentratedLiquidityPositions'

export interface ConcentratedLiquidityPosition {
  id: string
  address: string
  chainId: SushiSwapV3ChainId
  nonce: bigint
  tokenId: bigint
  operator: string
  token0: Address
  token1: Address
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
