import { getUserReferralStats } from '@sushiswap/graph-client/leaderboard'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

export const useUserReferralStats = ({
  address,
  seasons,
  enabled,
}: {
  address: EvmAddress | undefined
  seasons?: number[]
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['useUserReferralStats', { address, seasons, enabled }],
    queryFn: async () => {
      if (!address) return null
      const stats = await getUserReferralStats({
        address,
        seasons,
      })
      const totals = stats.reduce(
        (acc, stat) => {
          acc.points += stat.totalReferralPoints
          acc.volumeUsd += stat.totalReferralVolumeUsd
          return acc
        },
        { points: 0, volumeUsd: 0 },
      )
      const ranksBySeason = new Map<number, number | null>()
      seasons?.forEach((season) => {
        const stat = stats.find((s) => s.season.number === season)
        ranksBySeason.set(season, stat ? stat.rank : null)
      })
      return {
        stats,
        currentRank: stats?.[stats?.length - 1]?.rank ?? null,
        totalPoints: totals.points,
        totalVolumeUsd: totals.volumeUsd,
        ranksBySeason,
      }
    },

    enabled: Boolean(enabled && address),
  })
}
