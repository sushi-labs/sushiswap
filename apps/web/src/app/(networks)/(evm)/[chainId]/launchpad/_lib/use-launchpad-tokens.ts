'use client'

import {
  type LaunchpadTokenConnection,
  getLaunchpadTokens,
} from '@sushiswap/graph-client/data-api'
import { useInfiniteQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useMemo } from 'react'
import type { LaunchpadTokensInput } from '../types'
import { EMPTY_LAUNCHPAD_TOKEN_CONNECTION } from './launchpad-query-fallbacks'

export function useLaunchpadTokens(input: LaunchpadTokensInput, live = false) {
  const query = useInfiniteQuery({
    queryKey: ['launchpad', 'tokens', input],
    queryFn: ({ pageParam }) => {
      const { after: _after, ...baseInput } = input
      return getLaunchpadTokens({
        input: pageParam ? { ...baseInput, after: pageParam } : baseInput,
      })
    },
    initialPageParam: input.after ?? null,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage
        ? (lastPage.pageInfo.endCursor ?? undefined)
        : undefined,
    staleTime: ms('10s'),
    refetchInterval: live ? ms('10s') : false,
  })

  const data = useMemo<LaunchpadTokenConnection>(() => {
    const pages = query.data?.pages
    const firstPage = pages?.[0]
    const lastPage = pages?.at(-1)
    if (!pages || !firstPage || !lastPage) {
      return EMPTY_LAUNCHPAD_TOKEN_CONNECTION
    }

    return {
      edges: pages.flatMap((page) => page.edges),
      pageInfo: lastPage.pageInfo,
      totalCount: firstPage.totalCount,
    }
  }, [query.data?.pages])

  return { ...query, data }
}
