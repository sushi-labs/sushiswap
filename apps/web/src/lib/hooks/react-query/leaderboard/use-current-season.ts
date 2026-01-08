import { getCurrentSeason } from '@sushiswap/graph-client/leaderboard'
import { useQuery } from '@tanstack/react-query'

export const useCurrentSeason = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['useCurrentSeason', { enabled }],
    queryFn: async () => {
      return await getCurrentSeason()
    },

    enabled: Boolean(enabled),
  })
}
