// @ts-nocheck
import { GraphQLResolveInfo } from 'graphql'
import { isPromiseFulfilled } from 'sushi/validate'

import {
  Query,
  QueryResolvers,
  QueryliquidityPositionsByChainIdsArgs,
  RequireFields,
} from '../../.graphclient/index.js'
import { SushiSwapV2Types } from '../../.graphclient/sources/SushiSwapV2/types.js'
import { SUSHISWAP_V2_SUPPORTED_CHAIN_IDS } from 'sushi/config'

export const _liquidityPositionsByChainIds = async (
  root = {},
  args: RequireFields<
    QueryliquidityPositionsByChainIdsArgs,
    'skip' | 'first' | 'chainIds'
  >,
  context: SushiSwapV2Types.Context,
  info: GraphQLResolveInfo,
) => {
  const liquidityPositions = await Promise.allSettled<
    Query['liquidityPositionsByChainIds'][]
  >([
    ...args.chainIds
      .filter((el): el is (typeof SUSHISWAP_V2_SUPPORTED_CHAIN_IDS)[number] =>
        SUSHISWAP_V2_SUPPORTED_CHAIN_IDS.includes(el),
      )
      .map((chainId) =>
        context.SushiSwapV2.Query.liquidityPositions({
          root,
          args,
          context: {
            ...context,
            chainId,
            url: SUSHISWAP_V2_SUBGRAPH_URL[chainId],
          },
          info,
        }).then((liquidityPositions: SushiSwapV2Types.LiquidityPosition[]) => {
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

export const liquidityPositionsByChainIds: QueryResolvers['liquidityPositionsByChainIds'] =
  async (root, args, context, info) => {
    return _liquidityPositionsByChainIds(root, args, context, info)
  }
