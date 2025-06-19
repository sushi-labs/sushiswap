import { useInfiniteQuery } from '@tanstack/react-query'
import type { KadenaPoolsApiResponse } from '~kadena/_common/types/get-all-pools-type'

export const useAllPools = ({
  first = 50,
  orderBy = 'TVL_USD_DESC',
}: {
  first?: number
  orderBy?: string
} = {}) => {
  console.log('useAllPools called with params:', { first, orderBy })

  return useInfiniteQuery({
    queryKey: ['kadena-pools', first, orderBy],
    queryFn: async ({
      pageParam = null,
    }): Promise<KadenaPoolsApiResponse['data']> => {
      const url = new URL('/kadena/api/pools', window.location.origin)
      url.searchParams.set('first', String(first))
      url.searchParams.set('orderBy', orderBy)
      if (pageParam) url.searchParams.set('after', String(pageParam))

      const res = await fetch(url.toString())
      const data = (await res.json()) as KadenaPoolsApiResponse

      if (!data.success) {
        console.error('Failed to fetch pools:', data)
        throw new Error('Failed to fetch pools')
      }

      return data.data
    },
    getNextPageParam: (lastPage: KadenaPoolsApiResponse['data']) => {
      const nextCursor = lastPage.pageInfo?.hasNextPage
        ? lastPage.pageInfo.endCursor
        : undefined
      return nextCursor
    },
    select: (data) => {
      const flat = data.pages.flatMap((p) => p.pools)
      return {
        ...data,
        pools: flat,
      }
    },
    initialPageParam: null,
    // staleTime: 5 * 60 * 1000,
    // gcTime: 10 * 60 * 1000,
  })
}
