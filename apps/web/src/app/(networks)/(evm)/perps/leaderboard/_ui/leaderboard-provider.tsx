'use client'
import type { PerpsLeaderboardTimeframe } from '@sushiswap/graph-client/data-api'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
interface State {
  mutate: {
    setSortBy: (sortBy: LeaderboardSortType) => void
    setTimeframe: (timeframe: LeaderboardTimeframeType) => void
  }
  state: {
    sortBy: LeaderboardSortType
    timeframe: LeaderboardTimeframeType
  }
}
export const LEADERBOARD_SORT_BY = ['volume', 'PNL', 'points'] as const
export type LeaderboardSortType = (typeof LEADERBOARD_SORT_BY)[number]

export const LEADERBOARD_TIMEFRAMES = ['24h', '7d', 'season'] as const
export type LeaderboardTimeframeType = (typeof LEADERBOARD_TIMEFRAMES)[number]

export const TimeframeToPerpsTimeframe: Record<
  LeaderboardTimeframeType,
  PerpsLeaderboardTimeframe
> = {
  '24h': 'DAY',
  '7d': 'WEEK',
  season: 'SEASON',
}

const LeaderboardStateContext = createContext<State>({} as State)

interface LeaderboardStateProviderProps {
  children: React.ReactNode
}

const LeaderboardStateProvider: FC<LeaderboardStateProviderProps> = ({
  children,
}) => {
  const [sortBy, setSortBy] = useState<LeaderboardSortType>('points')
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframeType>('season')
  return (
    <LeaderboardStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setSortBy,
            setTimeframe,
          },
          state: {
            sortBy,
            timeframe,
          },
        }
      }, [sortBy, timeframe])}
    >
      {children}
    </LeaderboardStateContext.Provider>
  )
}

const useLeaderboardState = () => {
  const context = useContext(LeaderboardStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside LeaderboardState Context')
  }

  return context
}

export { LeaderboardStateProvider, useLeaderboardState }
