import { type GetPools, getPools } from '@sushiswap/graph-client/data-api'
import { useInfiniteQuery } from '@tanstack/react-query'

export const usePoolsInfinite = (args: Omit<GetPools, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['pools', args],
    queryFn: ({ pageParam: page }) => getPools({ ...args, page }),
    initialPageParam: 1,
    getNextPageParam: (_, pages) => pages.length + 1,
  })
}
