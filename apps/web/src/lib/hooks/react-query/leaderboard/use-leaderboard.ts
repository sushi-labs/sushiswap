import { getLeaderboard } from '@sushiswap/graph-client/leaderboard'
import { useInfiniteQuery } from '@tanstack/react-query'
import ms from 'ms'

export const useLeaderboard = ({
  page,
  pageSize,
  season, //if season not provided, defaults to current active season
  enabled,
}: { page: number; pageSize: number; season?: number; enabled: boolean }) => {
  return useInfiniteQuery({
    queryKey: ['useLeaderboard', { page, pageSize, season, enabled }],
    queryFn: async ({ pageParam }) => {
      if (pageSize !== 25 && pageSize !== 50) {
        throw new Error('Invalid pageSize, pageSize must be 25 or 50')
      }
      if (page < 1) {
        throw new Error('Invalid page, page must be >= 1')
      }
      if (season && season < 1) {
        throw new Error('Invalid season, season must be >= 1')
      }
      const _page = pageParam ?? page

      const res = await getLeaderboard({ page: _page, pageSize, season })

      return res
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages) => {
      if (!lastPage?.pageInfo.hasNextPage) {
        return undefined
      }
      return lastPage.pageInfo.currentPage + 1
    },
    refetchInterval: ms('5m'),
    enabled: Boolean(
      enabled && page >= 1 && (pageSize === 25 || pageSize === 50),
    ),
  })
}
