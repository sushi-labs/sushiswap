import {
  addSeconds,
  getUnixTime,
  startOfHour,
  startOfMinute,
  startOfSecond,
  subDays,
  subHours,
  subMonths,
} from 'date-fns'

import type {
  Block,
  ResolverTypeWrapper,
  Resolvers,
} from '../../.graphclient/index.js'
import { _blocksByChainIds, blocksByChainIds } from './blocksByChainIds.js'

export const resolvers: Resolvers = {
  Block: {
    chainId: (root, _args, context, _info) =>
      Number(root.chainId || context.chainId || 1),
  },
  Query: {
    blocksByChainIds,
    oneHourBlocks: async (
      root,
      args,
      context,
      info,
    ): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(
        startOfMinute(startOfHour(subHours(Date.now(), 1))),
      )
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocksByChainIds(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info,
      )
    },
    twoHourBlocks: async (
      root,
      args,
      context,
      info,
    ): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(
        startOfMinute(startOfHour(subHours(Date.now(), 2))),
      )
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocksByChainIds(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info,
      )
    },
    oneDayBlocks: async (
      root,
      args,
      context,
      info,
    ): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(
        startOfMinute(startOfHour(subDays(Date.now(), 1))),
      )
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocksByChainIds(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info,
      )
    },
    twoDayBlocks: async (
      root,
      args,
      context,
      info,
    ): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(
        startOfMinute(startOfHour(subDays(Date.now(), 2))),
      )
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocksByChainIds(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info,
      )
    },
    oneWeekBlocks: async (
      root,
      args,
      context,
      info,
    ): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(
        startOfMinute(startOfHour(subDays(Date.now(), 7))),
      )
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocksByChainIds(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info,
      )
    },
    twoWeekBlocks: async (
      root,
      args,
      context,
      info,
    ): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(
        startOfMinute(startOfHour(subDays(Date.now(), 14))),
      )
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocksByChainIds(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info,
      )
    },
    oneMonthBlocks: async (
      root,
      args,
      context,
      info,
    ): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(
        startOfMinute(startOfHour(subMonths(Date.now(), 1))),
      )
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocksByChainIds(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info,
      )
    },
    twoMonthBlocks: async (
      root,
      args,
      context,
      info,
    ): Promise<ResolverTypeWrapper<Block>[]> => {
      const date = startOfSecond(
        startOfMinute(startOfHour(subMonths(Date.now(), 2))),
      )
      const start = getUnixTime(date)
      const end = getUnixTime(addSeconds(date, 600))
      return _blocksByChainIds(
        root,
        {
          ...args,
          first: 1,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info,
      )
    },
    customBlocks: async (
      root,
      args,
      context,
      info,
    ): Promise<ResolverTypeWrapper<Block>[]> => {
      const start = args.timestamp
      const end = start + 600
      return _blocksByChainIds(
        root,
        {
          ...args,
          where: { timestamp_gt: start, timestamp_lt: end },
        },
        context,
        info,
      )
    },
  },
}
