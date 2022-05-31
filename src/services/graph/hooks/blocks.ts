import { ChainId } from '@sushiswap/core-sdk'
import { getAverageBlockTime, getBlock, getMassBlocks } from 'app/services/graph/fetchers'
import {
  addSeconds,
  getUnixTime,
  startOfHour,
  startOfMinute,
  startOfSecond,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns'
import stringify from 'fast-json-stable-stringify'
import useSWR from 'swr'

import { GraphProps } from '../interfaces'

export function useOneYearBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subYears(Date.now(), 1))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useSixMonthBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subMonths(Date.now(), 6))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useThreeMonthBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subMonths(Date.now(), 3))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useOneMonthBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subMonths(Date.now(), 1))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useOneDayBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 1))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useTwoDayBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subDays(Date.now(), 2))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useOneWeekBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subWeeks(Date.now(), 1))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useTwoWeekBlock({ chainId = ChainId.ETHEREUM, shouldFetch = true, swrConfig = undefined }) {
  const date = startOfSecond(startOfMinute(startOfHour(subWeeks(Date.now(), 2))))
  const start = getUnixTime(date)
  const end = getUnixTime(addSeconds(date, 600))
  return useBlock({
    chainId,
    variables: {
      where: {
        timestamp_gt: start,
        timestamp_lt: end,
      },
    },
    shouldFetch,
    swrConfig,
  })
}

export function useBlock({
  chainId = ChainId.ETHEREUM,
  variables,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  return useSWR(
    shouldFetch ? ['block', chainId, stringify(variables)] : null,
    (_, chainId) => getBlock(chainId, variables),
    swrConfig
  )
}

export function useMassBlocks({
  chainId,
  timestamps,
  swrConfig = undefined,
}: GraphProps & { timestamps: number[] | string[] }) {
  return useSWR(
    chainId ? ['massBlocks', chainId, stringify(timestamps)] : null,
    (_, chainId) => getMassBlocks(chainId, timestamps),
    swrConfig
  )
}

export function useAverageBlockTime({
  chainId = ChainId.ETHEREUM,
  shouldFetch = true,
  swrConfig = undefined,
}: GraphProps) {
  return useSWR(chainId ? ['averageBlockTime', chainId] : null, (_, chainId) => getAverageBlockTime(chainId), swrConfig)
}
