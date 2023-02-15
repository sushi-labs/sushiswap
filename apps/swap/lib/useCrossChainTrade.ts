import { useTrade, UseTradeParams } from '@sushiswap/react-query'

export const useCrossChainTrade = (params: UseTradeParams) => {
  // TODO change to cross-chain hook
  // @ts-ignore
  return useTrade(params)
}
