import {
  type GetMultiChainPools,
  getMultiChainPools,
} from '@sushiswap/graph-client/data-api'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useMultichainPoolsInfinite = (
  args: Omit<GetMultiChainPools, 'page'>,
) => {
  return useInfiniteQuery({
    queryKey: ['multichain-pools', args],
    queryFn: ({ pageParam: page }) => getMultiChainPools({ ...args, page }),
    initialPageParam: 1,
    getNextPageParam: (_, pages) => pages.length + 1,
  })
}
