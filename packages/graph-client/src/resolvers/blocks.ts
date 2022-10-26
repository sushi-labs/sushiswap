import { BLOCKS_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-config'
import { addSeconds, getUnixTime, startOfHour, startOfMinute, startOfSecond, subDays } from 'date-fns'

import { Block, QueryResolvers, Resolvers } from '../../.graphclient'

const crossChainBlocks: QueryResolvers['crossChainBlocks'] = async (root, args, context, info): Promise<Block[]> => {
  return Promise.all<Block[]>(
    args.chainIds
      .filter((chainId): chainId is keyof typeof BLOCKS_SUBGRAPH_NAME => chainId in BLOCKS_SUBGRAPH_NAME)
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
        })
      })
  ).then((blocks) => blocks.flat())
}

export const resolvers: Resolvers = {
  Block: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainBlocks,
    oneDayBlocks: async (root, args, context, info) => {
      const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 1))))
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      const blocks = await crossChainBlocks(
        root,
        {
          ...args,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info
      )
      return blocks
    },
    twoDayBlocks: async (root, args, context, info) => {
      const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 2))))
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      const blocks = await crossChainBlocks(
        root,
        {
          ...args,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info
      )
      return blocks
    },
    oneWeekBlocks: async (root, args, context, info) => {
      const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 7))))
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      const blocks = await crossChainBlocks(
        root,
        {
          ...args,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info
      )
      return blocks
    },
    customBlocks: async (root, args, context, info) => {
      const start = args.timestamp
      const end = start + 600
      const blocks = await crossChainBlocks(
        root,
        {
          ...args,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info
      )
      return blocks
    },
  },
}
