import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import {
  type GetPoolsOrderBy,
  type GetPoolsResponse,
  type KadenaPool,
  getAllPools,
} from '@sushiswap/graph-client/kadena'
import { useCallback } from 'react'

import { z } from 'zod'

const poolsResponseSchema = z.object({
  totalCount: z.number(),
  pageInfo: z.object({
    endCursor: z.string(),
    hasNextPage: z.boolean(),
  }),
  edges: z.array(
    z.object({
      node: z.object({
        fees24hUsd: z.number(),
        apr24h: z.number(),
        transactionCount24h: z.number(),
        volume7dUsd: z.number(),
        volume24hUsd: z.number(),
        tvlUsd: z.number(),
        token1: z.object({
          address: z.string(),
          chainId: z.string(),
          name: z.string(),
          id: z.string(),
        }),
        token0: z.object({
          address: z.string(),
          chainId: z.string(),
          name: z.string(),
          id: z.string(),
        }),
        address: z.string(),
        id: z.string(),
      }),
    }),
  ),
})

export const useAllPools = ({
  first = 50,
  orderBy = 'TVL_USD_DESC',
}: {
  first?: number
  orderBy?: GetPoolsOrderBy
} = {}) => {
  const select = useCallback(
    (
      data: InfiniteData<
        {
          pools: KadenaPool[]
          pageInfo: GetPoolsResponse['pageInfo']
          totalCount: GetPoolsResponse['totalCount']
        },
        string | null
      >,
    ) => {
      const flat = data.pages.flatMap((p) => p.pools)
      return {
        ...data,
        pools: flat,
        count: data.pages[0].totalCount,
      }
    },
    [],
  )

  return useInfiniteQuery({
    queryKey: ['kadena-pools', first, orderBy],
    queryFn: async ({ pageParam = null }: { pageParam: string | null }) => {
      const url = new URL('/kadena/api/pools/all-pools', window.location.origin)
      url.searchParams.set('orderBy', orderBy)
      url.searchParams.set('first', String(first))
      if (pageParam) {
        url.searchParams.set('pageParam', pageParam)
      }
      const res = await fetch(url.toString())
      const data = await res.json()

      const parsed = poolsResponseSchema.safeParse(data)

      if (!parsed.success) {
        throw new Error('Failed to parse pools response')
      }

      return {
        pools: parsed?.data?.edges?.map((edge) => edge?.node),
        pageInfo: parsed?.data?.pageInfo,
        totalCount: parsed?.data?.totalCount,
      }
    },
    getNextPageParam: (lastPage) => {
      const nextCursor = lastPage.pageInfo?.hasNextPage
        ? lastPage.pageInfo.endCursor
        : undefined
      return nextCursor
    },
    select,
    initialPageParam: null,
  })
}
