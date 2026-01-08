import { getUserStats } from '@sushiswap/graph-client/leaderboard'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

export const useUserStats = ({
  address,
  seasons,
  enabled,
}: {
  address: EvmAddress | undefined
  seasons?: number[]
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['useUserStats', { address, seasons, enabled }],
    queryFn: async () => {
      if (!address) return null
      const stats = await getUserStats({
        address,
        seasons,
      })
      const totals = stats.reduce(
        (acc, stat) => {
          acc.points += stat.points
          acc.volumeUsd += stat.volumeUsd
          return acc
        },
        { points: 0, volumeUsd: 0 },
      )
      return {
        stats,
        totalPoints: totals.points,
        totalVolumeUsd: totals.volumeUsd,
      }
    },

    enabled: Boolean(enabled && address),
  })
}
