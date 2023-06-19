import { BigNumber } from 'ethers'
import { Pool, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'

export interface ConcentratedLiquidityPosition {
  id: string
  address: string
  chainId: SushiSwapV3ChainId
  nonce: BigNumber
  tokenId: BigNumber
  operator: string
  token0: string
  token1: string
  fee: number
  fees: BigNumber[] | undefined
  tickLower: number
  tickUpper: number
  liquidity: BigNumber
  feeGrowthInside0LastX128: BigNumber
  feeGrowthInside1LastX128: BigNumber
  tokensOwed0: BigNumber
  tokensOwed1: BigNumber
}

export interface ConcentratedLiquidityPositionWithV3Pool {
  id: string
  address: string
  chainId: SushiSwapV3ChainId
  nonce: BigNumber
  tokenId: BigNumber
  operator: string
  token0: string
  token1: string
  fee: number
  pool: Pool
  fees: BigNumber[] | undefined
  tickLower: number
  tickUpper: number
  liquidity: BigNumber
  feeGrowthInside0LastX128: BigNumber
  feeGrowthInside1LastX128: BigNumber
  tokensOwed0: BigNumber
  tokensOwed1: BigNumber
}
