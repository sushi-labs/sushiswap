'use client'
import { Button, classNames } from '@sushiswap/ui'
import {
  LEADERBOARD_TIMEFRAMES,
  useLeaderboardState,
} from './leaderboard-provider'

export const LeaderboardTimeframe = () => {
  const {
    state: { timeframe },
    mutate: { setTimeframe },
  } = useLeaderboardState()

  return (
    <div className="flex items-center gap-1">
      {LEADERBOARD_TIMEFRAMES.map((v) => (
        <Button
          key={v}
          size="xs"
          variant={v === timeframe ? 'perps-secondary' : 'ghost'}
          onClick={() => setTimeframe(v)}
          className={classNames(
            'w-full capitalize !text-xs !rounded-full  !border-0',
            v === timeframe
              ? 'text-white !bg-transparent !bg-gradient-to-t !from-transparent !to-transparent !border-none !shadow-none'
              : 'text-muted-foreground',
          )}
        >
          {v === 'season' ? 'Season 1' : v}
        </Button>
      ))}
    </div>
  )
}
