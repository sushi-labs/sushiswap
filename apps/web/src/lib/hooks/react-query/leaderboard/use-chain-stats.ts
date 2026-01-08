import { getChainStats } from '@sushiswap/graph-client/leaderboard'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'

export const useSeasonStats = ({
  season, //if season not provided, defaults to current active season
  enabled,
}: { season?: number; enabled: boolean }) => {
  return useQuery({
    queryKey: ['useSeasonStats', { enabled }],
    queryFn: async () => {
      return await getChainStats({
        season,
      })
    },
    staleTime: ms('1m'),
    enabled: Boolean(enabled),
  })
}
