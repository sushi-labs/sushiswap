'use client'
import type {
  PerpsLeaderboardTimeframe,
  PerpsPointsSeason,
} from '@sushiswap/graph-client/data-api'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
import { getCurrentSeason } from '../season-constants'
interface State {
  mutate: {
    setSortBy: (sortBy: LeaderboardSortType) => void
    setTimeframe: (timeframe: LeaderboardTimeframeType) => void
    setSeasonToView: (season: PerpsPointsSeason) => void
  }
  state: {
    sortBy: LeaderboardSortType
    timeframe: LeaderboardTimeframeType
    seasonToView: PerpsPointsSeason
  }
}
export const LEADERBOARD_SORT_BY = ['PNL', 'points'] as const
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

const currentSeason = getCurrentSeason()

const LeaderboardStateProvider: FC<LeaderboardStateProviderProps> = ({
  children,
}) => {
  const [sortBy, setSortBy] = useState<LeaderboardSortType>('points')
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframeType>('season')
  const [seasonToView, setSeasonToView] =
    useState<PerpsPointsSeason>(currentSeason)
  return (
    <LeaderboardStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setSeasonToView,
            setSortBy,
            setTimeframe,
          },
          state: {
            seasonToView,
            sortBy,
            timeframe,
          },
        }
      }, [sortBy, timeframe, seasonToView])}
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
