'use client'
import { Button, classNames } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { useLeaderboardState } from './leaderboard-provider'

const options = ['SEASON_1', 'SEASON_2'] as const

const seasonToLabel = {
  SEASON_1: 'Season 1',
  SEASON_2: 'Season 2',
}

export const LeaderboardSeasonOptions = () => {
  const {
    state: { seasonToView },
    mutate: { setSeasonToView },
  } = useLeaderboardState()

  return (
    <PerpsCard
      className="flex items-center gap-1 hide-scrollbar overflow-x-auto p-0.5"
      rounded="full"
    >
      {options.map((v) => (
        <Button
          key={v}
          size="xs"
          variant={v === seasonToView ? 'perps-secondary' : 'ghost'}
          onClick={() => setSeasonToView(v)}
          className={classNames(
            'w-full capitalize !text-xs !rounded-full  !border-0',
            v === seasonToView
              ? 'text-white bg-accent'
              : 'text-muted-foreground',
          )}
        >
          {seasonToLabel[v]}
        </Button>
      ))}
    </PerpsCard>
  )
}
