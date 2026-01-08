'use client'

import { useUserStats } from 'src/lib/hooks/react-query/leaderboard/use-user-stats'
import { useAccount } from 'wagmi'
import { NoPointsState } from './no-points-state'
import { UnconnectedState } from './unconnected-state'

export const UserTier = () => {
  const { address, isConnected } = useAccount()
  const { data: userStats, isLoading } = useUserStats({
    address,
    enabled: Boolean(address),
  })

  if (!isConnected) {
    return <UnconnectedState />
  }
  if (isLoading) {
    return 'todo skeleton'
  }

  if (!userStats?.points || userStats?.points === 0) {
    return <NoPointsState />
  }

  return 'todo user tier display'
}
