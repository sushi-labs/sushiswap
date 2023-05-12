import React from 'react'

import { QuarterlyBudget } from './QuarterlyBudget'
import { TreasuryOverview } from './TreasuryOverview'

export default function Finance() {
  return (
    <div className="space-y-20">
      {/* @ts-expect-error Async Server Component */}
      <TreasuryOverview />
      <QuarterlyBudget />
    </div>
  )
}
