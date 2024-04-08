// @ts-nocheck
import { BLOCKS_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'
import { GraphQLResolveInfo } from 'graphql'

import {
  Query,
  QueryResolvers,
  QueryblocksByChainIdsArgs,
  RequireFields,
} from '../../.graphclient/index.js'
import { BlocksTypes } from '../../.graphclient/sources/Blocks/types.js'

export const _blocksByChainIds = async (
  root: any,
  args: RequireFields<QueryblocksByChainIdsArgs, 'skip' | 'first' | 'chainIds'>,
  context: BlocksTypes.Context,
  info: GraphQLResolveInfo,
): Promise<Query['blocksByChainIds']> => {
  return Promise.all<Query['blocksByChainIds'][]>(
    args.chainIds
      .filter(
        (
          chainId,
        ): chainId is keyof typeof BLOCKS_SUBGRAPH_NAME &
          keyof typeof SUBGRAPH_HOST => chainId in BLOCKS_SUBGRAPH_NAME,
      )
      .map((chainId) => {
        return context.Blocks.Query.blocks({
          root,
          args,
          context: {
            ...context,
            chainId,
            subgraphName: BLOCKS_SUBGRAPH_NAME[chainId],
            subgraphHost: SUBGRAPH_HOST[chainId],
          },
          info,
        }).then((blocks: BlocksTypes.Block[]) => {
          if (!Array.isArray(blocks)) {
            console.error(`Blocks query failed on ${chainId}`, blocks)
            return []
          }
          // console.debug(`Blocks ${chainId}`, blocks)
          return blocks.map((block) => ({ ...block, chainId }))
        })
      }),
  ).then((blocks) => blocks.flat())
}

export const blocksByChainIds: QueryResolvers['blocksByChainIds'] = async (
  root,
  args,
  context,
  info,
): Promise<Query['blocksByChainIds']> =>
  _blocksByChainIds(root, args, context, info)
