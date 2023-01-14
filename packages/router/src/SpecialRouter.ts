import { Type } from '@sushiswap/currency'
import { RouteStatus } from '@sushiswap/tines'
import { BigNumber } from 'ethers'

import { DataFetcher } from './DataFetcher'
import { LiquidityProviders } from './liquidity-providers/LiquidityProviderMC'
import { Router } from './Router'

const PreferrableLiquidityProviders: LiquidityProviders[] = [LiquidityProviders.Sushiswap, LiquidityProviders.Trident]

// Makes the route using only Preferrable liquidity providers.
// If the result price impact % is more than maxPriceImpact, then remakes the route using all possible liquidity
export function findSpecialRoute(
  dataFetcher: DataFetcher,
  fromToken: Type,
  amountIn: BigNumber,
  toToken: Type,
  gasPrice: number,
  maxPriceImpact = 0.5 // 0.5%
) {
  const routePreferrable = Router.findBestRoute(
    dataFetcher,
    fromToken,
    amountIn,
    toToken,
    gasPrice,
    PreferrableLiquidityProviders
  )
  if (
    routePreferrable.status === RouteStatus.Success &&
    routePreferrable.priceImpact !== undefined &&
    routePreferrable.priceImpact < maxPriceImpact / 100
  ) {
    return routePreferrable
  }

  const routeAll = Router.findBestRoute(dataFetcher, fromToken, amountIn, toToken, gasPrice)
  return routeAll
}
