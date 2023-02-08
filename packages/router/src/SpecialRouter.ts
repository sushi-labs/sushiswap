import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { RouteStatus } from '@sushiswap/tines'
import { BigNumber } from 'ethers'

import { LiquidityProviders } from './liquidity-providers/LiquidityProvider'
import { PoolCode } from './pools/PoolCode'
import { Router } from './Router'

export const PreferrableLiquidityProviders: LiquidityProviders[] = [
  LiquidityProviders.NativeWrap,
  LiquidityProviders.SushiSwap,
  LiquidityProviders.TridentCP,
  LiquidityProviders.TridentStable
]

// Makes the route using only Preferrable liquidity providers.
// If the result price impact % is more than maxPriceImpact, then remakes the route using all possible liquidity
export function findSpecialRoute(
  poolCodesMap: Map<string, PoolCode>,
  chainId: ChainId,
  fromToken: Type,
  amountIn: BigNumber,
  toToken: Type,
  gasPrice: number,
  maxPriceImpact = 1 // 1%
) {
  // Find preferrable route
  const preferrableRoute = Router.findBestRoute(
    poolCodesMap,
    chainId,
    fromToken,
    amountIn,
    toToken,
    gasPrice,
    PreferrableLiquidityProviders
  )
  // If the route is successful and the price impact is less than maxPriceImpact, then return the route
  if (
    preferrableRoute.status === RouteStatus.Success &&
    preferrableRoute.priceImpact !== undefined &&
    preferrableRoute.priceImpact < maxPriceImpact / 100
  ) {
    return preferrableRoute
  }
  // Otherwise, find the route using all possible liquidity providers
  return Router.findBestRoute(poolCodesMap, chainId, fromToken, amountIn, toToken, gasPrice)
}
