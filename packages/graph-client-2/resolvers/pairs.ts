import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { fetchFarms } from 'actions'

import { getBuiltGraphSDK, Pair, Query, QueryResolvers, Resolvers } from '../.graphclient'

export const crossChainPairsWithFarms: QueryResolvers['crossChainPairsWithFarms'] = async (
  root,
  args,
  context,
  info
): Promise<Query['crossChainPairsWithFarms']> => {
  const sdk = getBuiltGraphSDK()

  // console.log('farms', [await context.Farm.Query.farms({ root, args, context, info })])

  const [{ crossChainPairs: pairs }, farms, { oneDayBlocks }, { oneWeekBlocks }] = await Promise.all([
    sdk.CrossChainPairs({ chainIds: args.chainIds }),
    fetchFarms(),
    // sdk.Farms(),
    sdk.OneDayBlocks({ chainIds: args.chainIds }),
    sdk.OneWeekBlocks({ chainIds: args.chainIds }),
  ])

  console.log('FARMS', JSON.stringify(farms))

  return [] as Query['crossChainPairsWithFarms']
}

export const crossChainPairs: QueryResolvers['crossChainPairs'] = async (
  root,
  args,
  context,
  info
): Promise<Query['crossChainPairs']> => {
  return Promise.all<Query['crossChainPairs'][]>([
    ...args.chainIds
      .filter((chainId): chainId is typeof SUSHISWAP_ENABLED_NETWORKS[number] =>
        SUSHISWAP_ENABLED_NETWORKS.includes(chainId)
      )
      .map((chainId) => {
        return context.SushiSwap.Query.pairs({
          root,
          args: {
            ...args,
            where: { ...args.where, type_in: ['CONSTANT_PRODUCT_POOL'] },
          },
          context: {
            ...context,
            chainId,
            subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((pairs) => {
          if (!Array.isArray(pairs)) {
            console.error(`SushiSwap pairs query failed on ${chainId}`, pairs)
            return []
          }
          // console.debug(`SushiSwap pairs ${chainId}`, pairs)
          return pairs.map((pair) => ({ ...pair, chainId }))
        })
      }),
    ...args.chainIds
      .filter((chainId): chainId is typeof TRIDENT_ENABLED_NETWORKS[number] =>
        TRIDENT_ENABLED_NETWORKS.includes(chainId)
      )
      .map((chainId) => {
        return context.Trident.Query.pairs({
          root,
          args,
          context: {
            ...context,
            chainId,
            subgraphName: TRIDENT_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((pairs) => {
          if (!Array.isArray(pairs)) {
            console.error(`Trident pairs query failed on ${chainId}`, pairs)
            return []
          }
          // console.debug(`Trident pairs ${chainId}`, pairs)
          return pairs.map((pair) => ({ ...pair, chainId }))
        })
      }),
  ]).then((pairs) => pairs.flat())
}

export const crossChainPair: QueryResolvers['crossChainPair'] = async (root, args, context, info): Promise<Pair> => {
  // const farms = await context.Farm.Query.farms()
  // console.log({ farms })

  return {} as Pair
}

export const resolvers: Resolvers = {
  Pair: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainPair,
    crossChainPairs,
    crossChainPairsWithFarms,
  },
}
