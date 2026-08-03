'use client'
import { useState } from 'react'

import type { PerpsPointsSeason } from '@sushiswap/graph-client/data-api'
import { getCurrentSeason } from '~evm/perps/leaderboard/season-constants'
import { Epochs } from './epochs'
import { Multiplier } from './multiplier'
import { Overview } from './overview'

const current = getCurrentSeason()
export function PointsSummaryCards() {
  const [season, setSeason] = useState<PerpsPointsSeason>(current)
  return (
    <div className="grid w-full gap-2 lg:grid-cols-3">
      <Overview season={season} />
      <Multiplier season={season} />
      <Epochs season={season} setSeason={setSeason} />
    </div>
  )
}
