'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { listCrossmintOrders } from '../actions/list-crossmint-orders'

export const DEFAULT_CROSSMINT_ORDERS_PAGE_SIZE = 30

export interface UseCrossmintOrdersInput {
  enabled?: boolean
  limit?: number
  recipientAddress?: readonly string[]
}

export function useCrossmintOrders({
  enabled = true,
  limit = DEFAULT_CROSSMINT_ORDERS_PAGE_SIZE,
  recipientAddress = [],
}: UseCrossmintOrdersInput = {}) {
  const query = useInfiniteQuery({
    queryKey: ['crossmint', 'orders', { limit, recipientAddress }],
    queryFn: ({ pageParam }) =>
      listCrossmintOrders({
        cursor: pageParam ?? undefined,
        limit,
        recipientAddress,
        sort: 'desc',
      }),
    enabled: enabled && recipientAddress.length > 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null as string | null,
    staleTime: 30_000,
  })

  const data = useMemo(
    () => query.data?.pages.flatMap((page) => page.data),
    [query.data],
  )
  const environment = query.data?.pages[0]?.environment

  return { ...query, data, environment }
}
