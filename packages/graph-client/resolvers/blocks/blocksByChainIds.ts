// @ts-nocheck
import { GraphQLResolveInfo } from 'graphql'

import {
  Query,
  QueryResolvers,
  QueryblocksByChainIdsArgs,
  RequireFields,
} from '../../.graphclient/index.js'
import { BlocksTypes } from '../../.graphclient/sources/Blocks/types.js'
import { BLOCKS_SUBGRAPH_URL } from 'sushi/config/subgraph'

export const _blocksByChainIds = async (
  root = {},
  args: RequireFields<QueryblocksByChainIdsArgs, 'skip' | 'first' | 'chainIds'>,
  context: BlocksTypes.Context,
  info: GraphQLResolveInfo,
): Promise<Query['blocksByChainIds']> => {
  return Promise.all<Query['blocksByChainIds'][]>(
    args.chainIds
      .filter(
        (
          chainId,
        ): chainId is keyof typeof BLOCKS_SUBGRAPH_URL &
          keyof typeof BENTOBOX_SUBGRAPH_URL => chainId in BLOCKS_SUBGRAPH_URL,
      )
      .map((chainId) => {
        return context.Blocks.Query.blocks({
          root,
          args,
          context: {
            ...context,
            chainId,
            url: BLOCKS_SUBGRAPH_URL[chainId],
          },
          info,
        }).then((blocks: BlocksTypes.Block[]) => {
          if (!Array.isArray(blocks)) {
            // console.error(`Blocks query failed on ${chainId}`, blocks)
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
