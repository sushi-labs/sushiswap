import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
  TRIDENT_ENABLED_NETWORKS,
  TRIDENT_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { GraphQLResolveInfo } from 'graphql'

import {
  getBuiltGraphSDK,
  Query,
  QuerypairsByChainIdArgs,
  QuerypairsByChainIdsArgs,
  QueryResolvers,
  Resolvers,
} from '../../.graphclient'
import { page } from '../../lib/page'
import { transformPair } from '../../transformers'
import { SushiSwapTypes } from '.graphclient/sources/SushiSwap/types'
import { TridentTypes } from '.graphclient/sources/Trident/types'

const sdk = getBuiltGraphSDK()

export const pairsWithFarms: QueryResolvers['pairsWithFarms'] = async (
  root,
  args,
  context,
  info
): Promise<Query['pairsWithFarms']> => {
  const { farms } = await sdk.FarmsV0()

  const pools = await (args?.farmsOnly
    ? Promise.all(
        args.chainIds
          // filter down to call only on chains where there are actually farms
          .filter((chainId) => chainId in farms)
          .map((chainId) =>
            _pairsByChainId(
              root,
              {
                ...args,
                chainId,
                where: { id_in: Object.keys(farms?.[chainId]?.farms) },
              },
              context,
              info
            )
          )
      ).then((value) => value.flat())
    : _pairsByChainIds(root, args, context, info))

  const [{ oneDayBlocks }, { twoDayBlocks }, { oneWeekBlocks }] = await Promise.all([
    sdk.OneDayBlocks({ chainIds: args.chainIds }),
    sdk.TwoDayBlocks({ chainIds: args.chainIds }),
    sdk.OneWeekBlocks({ chainIds: args.chainIds }),
  ])

  const [pools1d, pools2d, pools1w] = await Promise.all([
    Promise.all(
      args.chainIds
        .filter((chainId) => oneDayBlocks.some((block) => block.chainId === chainId))
        .map((chainId) =>
          _pairsByChainId(
            root,
            {
              ...args,
              chainId,
              where: {
                id_in: pools.filter((pool) => pool.chainId === chainId).map(({ id }) => id),
              },
              block: { number: Number(oneDayBlocks?.find((block) => block.chainId === chainId)?.number) },
            },
            context,
            info
          )
        )
    ).then((value) => value.flat()),
    Promise.all(
      args.chainIds
        .filter((chainId) => twoDayBlocks.some((block) => block.chainId === chainId))
        .map((chainId) =>
          _pairsByChainId(
            root,
            {
              ...args,
              chainId,
              where: {
                id_in: pools.filter((pool) => pool.chainId === chainId).map(({ id }) => id),
              },
              block: { number: Number(twoDayBlocks?.find((block) => block.chainId === chainId)?.number) },
            },
            context,
            info
          )
        )
    ).then((value) => value.flat()),
    Promise.all(
      args.chainIds
        .filter((chainId) => oneWeekBlocks.some((block) => block.chainId === chainId))
        .map((chainId) =>
          _pairsByChainId(
            root,
            {
              ...args,
              chainId,
              where: {
                id_in: pools.filter((pool) => pool.chainId === chainId).map(({ id }) => id),
              },
              block: { number: Number(oneWeekBlocks?.find((block) => block.chainId === chainId)?.number) },
            },
            context,
            info
          )
        )
    ).then((value) => value.flat()),
  ])

  return page(
    pools
      .map((pool) =>
        transformPair({
          pair: pool,
          pair1d: Array.isArray(pools1d) ? pools1d?.find((pool1d) => pool1d.id === pool.id) : undefined,
          pair2d: Array.isArray(pools2d) ? pools2d?.find((pool2d) => pool2d.id === pool.id) : undefined,
          pair1w: Array.isArray(pools1w) ? pools1w?.find((pool1w) => pool1w.id === pool.id) : undefined,
          farm: farms?.[pool.chainId]?.farms?.[pool.id.toLowerCase()],
        })
      )
      .sort((a, b) => {
        if (args.orderDirection === 'asc') {
          return a[args.orderBy || 'liquidityUSD'] - b[args.orderBy || 'liquidityUSD']
        } else if (args.orderDirection === 'desc') {
          return b[args.orderBy || 'liquidityUSD'] - a[args.orderBy || 'liquidityUSD']
        }
        return 0
      }),
    args.pagination
  )
}

const _pairsByChainIds = async (
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
        }).then((pairs) => {
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
        }).then((pairs) => {
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

export const _pairsByChainId = async (
  root = {},
  args: QuerypairsByChainIdArgs,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo
): Promise<Query['pairsByChainId']> => {
  return _pairsByChainIds(root, { ...args, chainIds: [args.chainId] }, context, info)
}

export const pairsByChainId: QueryResolvers['pairsByChainId'] = async (
  root,
  args,
  context,
  info
): Promise<Query['pairsByChainId']> => {
  return _pairsByChainId(root, args, context, info)
}

// Farm only
// export const incentivisedPairsByChainIds: QueryResolvers['incentivisedPairsByChainIds'] = async (
//   root,
//   args,
//   context,
//   info
// ): Promise<Query['incentivisedPairsByChainIds']> => {
//   const farms = await context.FarmsV0.Query.farmsv0(root, args, context, info)

//   const farmChainIds = Object.keys(farms)
//     .map(Number)
//     .filter((chainId) => args.chainIds.includes(chainId))

//   const farmPoolAddresses = Object.fromEntries(
//     farmChainIds.map((chainId) => [chainId, Object.keys(farms?.[chainId]?.farms)])
//   )

//   return Promise.all(
//     args.chainIds.map((chainId) =>
//       _pairsByChainId(
//         root,
//         {
//           ...args,
//           where: {
//             ...args.where,
//             id_in: farmPoolAddresses[chainId],
//           },
//         },
//         context,
//         info
//       )
//     )
//   ).then((value) =>
//     value.flat().map((pair) => ({
//       ...pair,
//       farm: transformFarm(farms?.[pair.chainId]?.farms?.[pair.id.toLowerCase()]),
//     }))
//   )
// }

// const _pairsByIds = async (
//   root = {},
//   args: QuerypairsByIdsArgs,
//   context: SushiSwapTypes.Context & TridentTypes.Context,
//   info: GraphQLResolveInfo
// ): Promise<Query['pairsByIds']> => {

// }

export const resolvers: Resolvers = {
  Pair: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    // address: (root, args, context, info) => String(root.address || context.address),
  },
  Query: {
    // pairsByIds,
    pairsByChainId,
    pairsByChainIds,
    pairsWithFarms,
  },
}
