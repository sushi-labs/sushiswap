'use client'
import { Button, classNames } from '@sushiswap/ui'
import { PerpsCard } from '~evm/perps/_ui/_common'
import {
  LEADERBOARD_SORT_BY,
  useLeaderboardState,
} from './leaderboard-provider'

export const LeaderboardSortBy = () => {
  const {
    state: { sortBy },
    mutate: { setSortBy },
  } = useLeaderboardState()

  return (
    <PerpsCard
      className="flex items-center gap-1 hide-scrollbar overflow-x-auto p-0.5"
      rounded="full"
    >
      {LEADERBOARD_SORT_BY.map((v) => (
        <Button
          key={v}
          size="xs"
          variant={v === sortBy ? 'perps-secondary' : 'ghost'}
          onClick={() => setSortBy(v)}
          className={classNames(
            'w-full capitalize !text-xs !rounded-full  !border-0',
            v === sortBy ? 'text-white bg-accent' : 'text-muted-foreground',
          )}
        >
          {v}
        </Button>
      ))}
    </PerpsCard>
  )
}
