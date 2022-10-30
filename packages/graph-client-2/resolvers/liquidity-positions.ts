import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { isPromiseFulfilled } from '@sushiswap/validate'

import { LiquidityPosition, QueryResolvers, Resolvers } from '../.graphclient'

export const _crossChainLiquidityPositions: QueryResolvers['crossChainLiquidityPositions'] = async (
  root,
  args,
  context,
  info
) => {
  const liquidityPositions = await Promise.allSettled<LiquidityPosition[][]>([
    ...args.chainIds
      .filter((el): el is typeof SUSHISWAP_ENABLED_NETWORKS[number] => SUSHISWAP_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.SushiSwap.Query.liquidityPositions({
          root,
          args,
          context: {
            ...context,
            chainId,
            subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((liquidityPositions) => {
          if (!Array.isArray(liquidityPositions)) {
            console.error(`SushiSwap liquidityPositions query failed on ${chainId}`, liquidityPositions)
            return []
          }
          return liquidityPositions.map((liquidityPosition) => ({ ...liquidityPosition, chainId }))
        })
      ),
    ...args.chainIds
      .filter((el): el is typeof TRIDENT_ENABLED_NETWORKS[number] => TRIDENT_ENABLED_NETWORKS.includes(el))
      .map((chainId) =>
        context.Trident.Query.liquidityPositions({
          root,
          args,
          context: {
            ...context,
            chainId,
            subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((liquidityPositions) => {
          if (!Array.isArray(liquidityPositions)) {
            console.error(`Trident liquidityPositions query failed on ${chainId}`, liquidityPositions)
            return []
          }
          return liquidityPositions.map((liquidityPosition) => ({ ...liquidityPosition, chainId }))
        })
      ),
  ]).then((promiseSettledResults) => {
    if (!Array.isArray(promiseSettledResults)) {
      console.error('crossChainLiquidityPositions query failed')
      return []
    }
    return promiseSettledResults
      .flat()
      .filter(isPromiseFulfilled)
      .flatMap((promiseFulfilled) => promiseFulfilled.value)
  })

  return liquidityPositions
}

export const resolvers: Resolvers = {
  LiquidityPosition: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainLiquidityPositions: _crossChainLiquidityPositions,
  },
}
