import type { CurrentSeason } from '@sushiswap/graph-client/leaderboard'
import { SeasonBadge } from './_ui/season-badge'
import { SeasonSwapVolume } from './_ui/season-swap-volume'

export const Hero = ({ currentSeason }: { currentSeason: CurrentSeason }) => {
  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
          <h1 className="text-5xl font-bold ">Points Leaderboard</h1>
          <SeasonBadge seasonName={currentSeason?.name} />
        </div>
        <p className="text-base md:text-xl max-w-[430px] md:max-w-[630px] text-muted-foreground">
          Welcome to {currentSeason?.name}! Earn points by trading on SushiSwap
          across EVM networks. Keep trading to climb the leaderboard.
        </p>
      </div>
      <SeasonSwapVolume seasonName={currentSeason?.name} />
    </section>
  )
}
