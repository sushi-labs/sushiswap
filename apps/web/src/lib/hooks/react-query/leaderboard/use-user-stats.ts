import {
  type UserStats,
  getUserStats,
} from '@sushiswap/graph-client/leaderboard'
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
      //@ts-expect-error - leaderboard introspection is broken atm, will remove this once fixed
      return stats?.[0] as UserStats | null
    },

    enabled: Boolean(enabled && address),
  })
}
