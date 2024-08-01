import { GetCrossChainTradeParams } from './getCrossChainTrade'
import { getSquidCrossChainTrade } from './getSquidCrossChainTrade'
import { getStargateCrossChainTrade } from './getStargateCrossChainTrade'

export const getCrossChainTrades = async (params: GetCrossChainTradeParams) => {
  return (
    await Promise.all([
      getSquidCrossChainTrade(params),
      getStargateCrossChainTrade(params),
    ])
  ).filter((resp) => !!resp)
}
