import React from 'react'

import { QuarterlyBudget } from './QuarterlyBudget'
import { TreasuryOverview } from './TreasuryOverview'
import { getTreasuryHistoricalTvl, getTreasurySnapshot } from '../lib'

export default async function Finance() {
  const [treasurySnapshot, treasuryHistoricalTvl] = await Promise.all([
    getTreasurySnapshot(),
    getTreasuryHistoricalTvl(),
  ])

  return (
    <div className="space-y-20">
      <TreasuryOverview treasurySnapshot={treasurySnapshot} treasuryHistoricalTvl={treasuryHistoricalTvl} />
      <QuarterlyBudget />
    </div>
  )
}
