import { type InfiniteData, useInfiniteQuery } from '@tanstack/react-query'

import {
  type GetPoolsOrderBy,
  type GetPoolsResponse,
  type KadenaPool,
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
