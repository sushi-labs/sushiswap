import { UsePoolsParams } from '../types'
import { DataFetcher, LiquidityProviders } from '@sushiswap/router'
import { isRouteProcessor3ChainId } from '@sushiswap/route-processor'

export const getAllPoolsCodeMap = async (variables: Omit<UsePoolsParams, 'enabled'>) => {
  const dataFetcher = DataFetcher.onChain(variables.chainId)
  const liquidityProviders = [LiquidityProviders.SushiSwap, LiquidityProviders.Trident]
  if (isRouteProcessor3ChainId(variables.chainId)) {
    liquidityProviders.push(LiquidityProviders.SushiSwapV3)
  }
  dataFetcher.startDataFetching(liquidityProviders)
  await dataFetcher.fetchPoolsForToken(variables.currencyA!, variables.currencyB!)
  dataFetcher.stopDataFetching()
  return dataFetcher.getCurrentPoolCodeMap(variables.currencyA!, variables.currencyB!)
}
