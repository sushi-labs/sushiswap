// @ts-nocheck
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
  QueryliquidityPositionsByUsersArgs,
  RequireFields,
} from '../../.graphclient/index.js'
import { SushiSwapTypes } from '../../.graphclient/sources/SushiSwap/types.js'
import { TridentTypes } from '../../.graphclient/sources/Trident/types.js'

export const _liquidityPositionsByUsers = async (
  root = {},
  args: RequireFields<
    QueryliquidityPositionsByUsersArgs,
    'skip' | 'first' | 'users'
  >,
  context: SushiSwapTypes.Context & TridentTypes.Context,
  info: GraphQLResolveInfo,
) => {
  const liquidityPositions = await Promise.allSettled<
    Query['liquidityPositionsByUsers'][]
  >([
    ...args.users
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
            }
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
          return liquidityPositions.map((liquidityPosition) => ({
            ...liquidityPosition,
            chainId,
          }))
        }),
      ),
  ]).then((promiseSettledResults) => {
    if (!Array.isArray(promiseSettledResults)) {
      console.error('liquidityPositionsByUsers query failed')
      return []
    }
    return promiseSettledResults
      .flat()
      .filter(isPromiseFulfilled)
      .flatMap((promiseFulfilled) => promiseFulfilled.value)
  })

  return liquidityPositions
}

export const liquidityPositionsByUsers: QueryResolvers['liquidityPositionsByUsers'] =
  async (root, args, context, info) => {
    return _liquidityPositionsByUsers(root, args, context, info)
  }
