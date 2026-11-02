'use client'
import { Button, classNames } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common'
import { PERPS_POINTS_SEASONS, getSeasonText } from '../season-constants'
import { useLeaderboardState } from './leaderboard-provider'

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
      {PERPS_POINTS_SEASONS.map((season) => (
        <Button
          key={season}
          size="xs"
          variant={season === seasonToView ? 'perps-secondary' : 'ghost'}
          aria-pressed={season === seasonToView}
          onClick={() => setSeasonToView(season)}
          className={classNames(
            'w-full capitalize !text-xs !rounded-full  !border-0',
            season === seasonToView
              ? 'text-white bg-accent'
              : 'text-muted-foreground',
          )}
        >
          {getSeasonText(season)}
        </Button>
      ))}
    </PerpsCard>
  )
}
