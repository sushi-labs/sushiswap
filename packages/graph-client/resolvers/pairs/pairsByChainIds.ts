import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { GraphQLResolveInfo } from 'graphql'

import { Query, QuerypairsByChainIdsArgs, QueryResolvers } from '../../.graphclient'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types'
import { TridentTypes } from '../../.graphclient/sources/Trident/types'

export const _pairsByChainIds = async (
  root = {},
  args: QuerypairsByChainIdsArgs,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo
): Promise<Query['pairsByChainIds']> => {
  return Promise.all<Query['pairsByChainIds'][]>([
    ...args.chainIds
      .filter((chainId): chainId is typeof SUSHISWAP_ENABLED_NETWORKS[number] =>
        SUSHISWAP_ENABLED_NETWORKS.includes(chainId)
      )
      .map((chainId) =>
        context.SushiSwap.Query.pairs({
          root,
          args: {
            ...args,
            where: args?.where?.type_in
              ? { ...args.where, type_in: args.where.type_in.filter((el) => el === 'CONSTANT_PRODUCT_POOL') }
              : args.where,
          },
          context: {
            ...context,
            chainId,
            subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((pairs: SushiSwapTypes.Pair[]) => {
          if (!Array.isArray(pairs)) {
            console.error(`SushiSwap pairs query failed on ${chainId}`, pairs)
            return []
          }
          // console.debug(`SushiSwap pairs ${chainId}`, pairs)
          return pairs.map((pair) => ({ ...pair, chainId, address: pair.id }))
        })
      ),
    ...args.chainIds
      .filter((chainId): chainId is typeof TRIDENT_ENABLED_NETWORKS[number] =>
        TRIDENT_ENABLED_NETWORKS.includes(chainId)
      )
      .map((chainId) =>
        context.Trident.Query.pairs({
          root,
          args,
          context: {
            ...context,
            chainId,
            subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((pairs: TridentTypes.Pair[]) => {
          if (!Array.isArray(pairs)) {
            console.error(`Trident pairs query failed on ${chainId}`, pairs)
            return []
          }
          // console.debug(`Trident pairs ${chainId}`, pairs)
          return pairs.map((pair) => ({ ...pair, chainId, address: pair.id }))
        })
      ),
  ]).then((promise) => promise.flatMap((pairs) => pairs))
}

export const pairsByChainIds: QueryResolvers['pairsByChainIds'] = async (
  root,
  args,
  context,
  info
): Promise<Query['pairsByChainIds']> => {
  return _pairsByChainIds(root, args, context, info)
}
