import { UsePoolsParams } from '../types'
import { DataFetcher, LiquidityProviders, PoolCode } from '@sushiswap/router'
import { isRouteProcessor3ChainId } from '@sushiswap/route-processor'

const nullPoolCodeMap = new Map<string, PoolCode>()

export const getAllPoolsCodeMap = async ({ currencyA, currencyB, chainId }: Omit<UsePoolsParams, 'enabled'>) => {
  if (!currencyA || !currencyB || !chainId) {
    return nullPoolCodeMap
  }
  const dataFetcher = DataFetcher.onChain(chainId)
  const liquidityProviders = [
    LiquidityProviders.SushiSwap,
    LiquidityProviders.Trident,
    LiquidityProviders.UniswapV2,
    LiquidityProviders.QuickSwap,
    LiquidityProviders.ApeSwap,
    LiquidityProviders.SpookySwap,
    LiquidityProviders.TraderJoe,
    LiquidityProviders.PancakeSwap,
  ]
  if (isRouteProcessor3ChainId(chainId)) {
    liquidityProviders.push(LiquidityProviders.SushiSwapV3)
  }
  dataFetcher.startDataFetching(liquidityProviders)
  await dataFetcher.fetchPoolsForToken(currencyA, currencyB)
  dataFetcher.stopDataFetching()
  return dataFetcher.getCurrentPoolCodeMap(currencyA, currencyB)
}
