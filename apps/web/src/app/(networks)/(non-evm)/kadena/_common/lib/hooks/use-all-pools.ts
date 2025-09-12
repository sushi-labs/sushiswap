import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import {
  type GetPoolsOrderBy,
  getAllPools,
} from '@sushiswap/graph-client/kadena'
import { useCallback } from 'react'

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
          pools: {
            fees24hUsd: number
            apr24h: number
            transactionCount24h: number
            volume7dUsd: number
            volume24hUsd: number
            tvlUsd: number
            token1: {
              address: string
              chainId: string
              name: string
              id: string
            }
            token0: {
              address: string
              chainId: string
              name: string
              id: string
            }
            address: string
            id: string
          }[]
          pageInfo: {
            endCursor: string
            hasNextPage: boolean
          }
          totalCount: number
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
      const data = await getAllPools({
        first: first,
        orderBy: orderBy,
        after: pageParam ?? undefined,
      })

      if (!data) {
        console.error('Failed to fetch pools:', data)
        throw new Error('Failed to fetch pools')
      }

      return {
        pools: data?.edges?.map((edge) => edge?.node),
        pageInfo: data?.pageInfo,
        totalCount: data?.totalCount,
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
