'use client'

import { Epochs } from './epochs'
import { Multiplier } from './mulitplier'
import { Overview } from './overview'

export function PointsSummaryCards() {
  return (
    <div className="grid w-full gap-2 md:grid-cols-3">
      <Overview />
      <Multiplier />
      <Epochs />
    </div>
  )
}
