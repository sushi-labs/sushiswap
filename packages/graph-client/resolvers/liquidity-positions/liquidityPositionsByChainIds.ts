// @ts-nocheck
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { isPromiseFulfilled } from 'sushi'
import { GraphQLResolveInfo } from 'graphql'

import {
  Query,
  QueryliquidityPositionsByChainIdsArgs,
  QueryResolvers,
  RequireFields,
} from '../../.graphclient/index.js'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js'
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js'

export const _liquidityPositionsByChainIds = async (
  root = {},
  args: RequireFields<QueryliquidityPositionsByChainIdsArgs, 'skip' | 'first' | 'chainIds'>,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo
) => {
  const liquidityPositions = await Promise.allSettled<Query['liquidityPositionsByChainIds'][]>([
    ...args.chainIds
      .filter((el): el is (typeof SUSHISWAP_ENABLED_NETWORKS)[number] => SUSHISWAP_ENABLED_NETWORKS.includes(el))
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
        }).then((liquidityPositions: SushiSwapTypes.LiquidityPosition[]) => {
          if (!Array.isArray(liquidityPositions)) {
            console.error(`SushiSwap liquidityPositions query failed on ${chainId}`, liquidityPositions)
            return []
          }
          return liquidityPositions.map((liquidityPosition) => ({
            ...liquidityPosition,
            chainId,
          }))
        })
      ),
    ...args.chainIds
      .filter((el): el is (typeof TRIDENT_ENABLED_NETWORKS)[number] => TRIDENT_ENABLED_NETWORKS.includes(el))
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
        }).then((liquidityPositions: TridentTypes.LiquidityPosition[]) => {
          if (!Array.isArray(liquidityPositions)) {
            console.error(`Trident liquidityPositions query failed on ${chainId}`, liquidityPositions)
            return []
          }
          return liquidityPositions.map((liquidityPosition) => ({
            ...liquidityPosition,
            chainId,
          }))
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

export const liquidityPositionsByChainIds: QueryResolvers['liquidityPositionsByChainIds'] = async (
  root,
  args,
  context,
  info
) => {
  return _liquidityPositionsByChainIds(root, args, context, info)
}
