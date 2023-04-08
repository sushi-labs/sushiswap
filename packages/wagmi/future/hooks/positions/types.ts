import { BigNumber } from 'ethers'
import { ChainId } from '@sushiswap/chain'
import { V3ChainId } from '@sushiswap/v3-sdk'

export interface ConcentratedLiquidityPosition {
  id: string
  address: string
  chainId: V3ChainId
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
