import { BLOCKS_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'
import { addSeconds, getUnixTime, startOfHour, startOfMinute, startOfSecond, subDays } from 'date-fns'
import { GraphQLResolveInfo } from 'graphql'

import {
  Block,
  QuerycrossChainBlocksArgs,
  QueryResolvers,
  RequireFields,
  Resolvers,
  ResolverTypeWrapper,
} from '../../.graphclient'
import { BlocksTypes } from '../../.graphclient/sources/Blocks/types'

export const _blocks: QueryResolvers['crossChainBlocks'] = async (
  root = {},
  args: RequireFields<QuerycrossChainBlocksArgs, 'skip' | 'first' | 'chainIds'>,
  context: BlocksTypes.Context,
  info: GraphQLResolveInfo
): Promise<ResolverTypeWrapper<Block>[]> => {
  return Promise.all<ResolverTypeWrapper<Block>[][]>(
    args.chainIds
      .filter((chainId) => chainId in BLOCKS_SUBGRAPH_NAME)
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
      })
  ).then((blocks) => blocks.flat())
}

export const resolvers: Resolvers = {
  Block: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainBlocks: async (root, args, context, info): Promise<ResolverTypeWrapper<Block>[]> =>
      _blocks(root, args, context, info),
    oneDayBlocks: async (root, args, context, info): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 1))))
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocks(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info
      )
    },
    twoDayBlocks: async (root, args, context, info): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 2))))
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocks(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info
      )
    },
    oneWeekBlocks: async (root, args, context, info): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 7))))
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocks(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info
      )
    },
    customBlocks: async (root, args, context, info): Promise<ResolverTypeWrapper<Block>[]> => {
      const start = args.timestamp
      const end = start + 600
      return _blocks(
        root,
        {
          ...args,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info
      )
    },
  },
}
