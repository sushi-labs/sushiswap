'use client'

import {
  type LaunchpadUserHoldingsType,
  getLaunchpadUserHoldings,
  getLaunchpadUserStats,
} from '@sushiswap/graph-client/data-api'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useMemo } from 'react'
import type { EvmAddress } from 'sushi/evm'
import type { LaunchpadChainId } from '../../constants'

const EMPTY_USER_HOLDINGS: LaunchpadUserHoldingsType = {
  edges: [],
  pageInfo: {
    endCursor: '',
    hasNextPage: false,
  },
  totalCount: 0,
}

interface LaunchpadPortfolioQueryOptions {
  chainId: LaunchpadChainId
  address: EvmAddress | undefined
}

export function useLaunchpadUserStats({
  chainId,
  address,
}: LaunchpadPortfolioQueryOptions) {
  return useQuery({
    queryKey: ['launchpad', 'portfolio', 'stats', chainId, address],
    queryFn: () => {
      if (!address) throw new Error('Wallet address is required')

      return getLaunchpadUserStats({ chainId, address })
    },
    enabled: Boolean(address),
    staleTime: ms('30s'),
  })
}

export function useLaunchpadUserHoldings({
  chainId,
  address,
}: LaunchpadPortfolioQueryOptions) {
  const query = useInfiniteQuery({
    queryKey: ['launchpad', 'portfolio', 'holdings', chainId, address],
    queryFn: ({ pageParam }) => {
      if (!address) throw new Error('Wallet address is required')

      return getLaunchpadUserHoldings({
        input: {
          chainId,
          address,
          first: 20,
          after: pageParam ?? undefined,
        },
      })
    },
    enabled: Boolean(address),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage
        ? (lastPage.pageInfo.endCursor ?? undefined)
        : undefined,
    staleTime: ms('30s'),
  })

  const data = useMemo<LaunchpadUserHoldingsType>(() => {
    const pages = query.data?.pages
    const firstPage = pages?.[0]
    const lastPage = pages?.at(-1)
    if (!pages || !firstPage || !lastPage) return EMPTY_USER_HOLDINGS

    return {
      edges: pages.flatMap((page) => page.edges),
      pageInfo: lastPage.pageInfo,
      totalCount: firstPage.totalCount,
    }
  }, [query.data?.pages])

  return { ...query, data }
}
