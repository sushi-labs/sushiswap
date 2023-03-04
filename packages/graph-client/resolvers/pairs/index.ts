import { getBuiltGraphSDK, Query, QueryResolvers, Resolvers } from '../../.graphclient'
import { getFarms } from '../../lib/farms'
import { page } from '../../lib/page'
import { transformPair } from '../../transformers'
import { pairById } from './pairById'
import { _pairsByChainId, pairsByChainId } from './pairsByChainId'
import { _pairsByChainIds, pairsByChainIds } from './pairsByChainIds'
import { pairsByIds } from './pairsByIds'

const sdk = getBuiltGraphSDK()

export const pairsWithFarms: QueryResolvers['pairsWithFarms'] = async (
  root,
  args,
  context,
  info
): Promise<Query['pairsWithFarms']> => {
  // const { farms } = await sdk.FarmsV0()

  const farms = await getFarms()

  // console.log({ farms })

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
              block: {
                number: Number(oneDayBlocks?.find((block) => block.chainId === chainId)?.number),
              },
            },
            context,
            info
          )
        )
    ).then((value) => {
      if (!Array.isArray(value)) {
        console.error('PairsWithFarms query failed for 1d pools ', value)
      }
      return value.flat()
    }),
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
              block: {
                number: Number(twoDayBlocks?.find((block) => block.chainId === chainId)?.number),
              },
            },
            context,
            info
          )
        )
    ).then((value) => {
      if (!Array.isArray(value)) {
        console.error('PairsWithFarms query failed for 2d pools ', value)
      }
      return value.flat()
    }),
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
              block: {
                number: Number(oneWeekBlocks?.find((block) => block.chainId === chainId)?.number),
              },
            },
            context,
            info
          )
        )
    ).then((value) => {
      if (!Array.isArray(value)) {
        console.error('PairsWithFarms query failed for 1w pools', value)
      }
      return value.flat()
    }),
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
          return a['liquidityUSD'] - b['liquidityUSD']
        } else if (args.orderDirection === 'desc') {
          return b['liquidityUSD'] - a['liquidityUSD']
        }
        return 0
      }),
    args.pagination
  )
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

export const resolvers: Resolvers = {
  Pair: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
    // address: (root, args, context, info) => String(root.address || context.address),
  },
  Query: {
    pairById,
    pairsByIds,
    pairsByChainId,
    pairsByChainIds,
    pairsWithFarms,
  },
}
