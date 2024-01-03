//@ts-nocheck
import {
  SUBGRAPH_HOST,
  SUSHISWAP_ENABLED_NETWORKS,
  SUSHISWAP_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import { GraphQLResolveInfo } from 'graphql'
import { isPromiseFulfilled } from 'sushi/validate'

import {
  Query,
  QueryResolvers,
  QueryliquidityPositionsByMakersArgs,
  RequireFields,
  getBuiltGraphSDK,
} from '../../.graphclient/index.js'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js'
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js'

export const _liquidityPositionsByMakers = async (
  root = {},
  args: RequireFields<
    QueryliquidityPositionsByMakersArgs,
    'skip' | 'first' | 'users'
  >,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo,
) => {
  const liquidityPositions = await Promise.allSettled<
    Query['liquidityPositionsByMakers'][]
  >(
    args.users
      .filter((user) =>
        SUSHISWAP_ENABLED_NETWORKS.includes(user.chainId),
      )
      .map(({ id, chainId }) =>
        context.SushiSwap.Query.liquidityPositions({
          root,
          args: {
            ...args,
            where: {
              ...args?.where,
              user: id
            },
          },
          context: {
            ...context,
            chainId,
            subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((liquidityPositions: SushiSwapTypes.LiquidityPosition[]) => {
          if (!Array.isArray(liquidityPositions)) {
            console.error(
              `SushiSwap liquidityPositions query failed on ${chainId}`,
              liquidityPositions,
            )
            return []
          }

          const sdk = getBuiltGraphSDK({
            subgraphHost: SUBGRAPH_HOST[chainId],
            subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
          })
          
          return (!liquidityPositions.length ? (Promise.resolve([])) : 
          
          sdk.V2Burns({
            where: {
              sender: id,
              pair_: {
                id_in: liquidityPositions.map((lp) => lp.pair.id)
              }
            },
          })

          ).then(({ burns }: { burns: SushiSwapTypes.V2Burn[] }) => {
            const burnsMap = burns?.reduce((accum, cur) => {
              accum[cur.pair.id] = accum[cur.pair.id] ?? cur
              return accum
            }, {}) ?? {}

            return liquidityPositions.map((liquidityPosition) => ({
              ...liquidityPosition,
              chainId,
              lastDistributedTimestamp: burnsMap[liquidityPosition.pair.id]?.transaction?.createdAtTimestamp,
              lastDistributedTx: burnsMap[liquidityPosition.pair.id]?.transaction?.id
            }))
          })
        }),
      ),
  ).then((promiseSettledResults) => {
    if (!Array.isArray(promiseSettledResults)) {
      console.error('liquidityPositionsByMakers query failed')
      return []
    }
    return promiseSettledResults
      .flat()
      .filter(isPromiseFulfilled)
      .flatMap((promiseFulfilled) => promiseFulfilled.value)
  })

  return liquidityPositions
}

export const liquidityPositionsByMakers: QueryResolvers['liquidityPositionsByMakers'] =
  async (root, args, context, info) => {
    return _liquidityPositionsByMakers(root, args, context, info)
  }
