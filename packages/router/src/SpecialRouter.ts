import { Type } from '@sushiswap/currency'
import { RouteStatus } from '@sushiswap/tines'
import { BigNumber } from 'ethers'

import { DataFetcher } from './DataFetcher'
import { LiquidityProviders } from './liquidity-providers/LiquidityProvider'
import { Router } from './Router'

export const PreferrableLiquidityProviders: LiquidityProviders[] = [
  LiquidityProviders.Sushiswap,
  LiquidityProviders.Trident,
]

// Makes the route using only Preferrable liquidity providers.
// If the result price impact % is more than maxPriceImpact, then remakes the route using all possible liquidity
export function findSpecialRoute(
  dataFetcher: DataFetcher,
  fromToken: Type,
  amountIn: BigNumber,
  toToken: Type,
  gasPrice: number,
  maxPriceImpact = 1 // 1%
) {
  // Find preferrable route
  const preferrableRoute = Router.findBestRoute(
    dataFetcher,
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
  return Router.findBestRoute(dataFetcher, fromToken, amountIn, toToken, gasPrice)
}
