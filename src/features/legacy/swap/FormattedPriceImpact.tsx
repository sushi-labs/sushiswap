import { Percent } from '@sushiswap/core-sdk'
import { warningSeverity } from 'app/functions/prices'
import React from 'react'

const SEVERITY = {
  0: 'text-green',
  1: 'text-high-emphesis',
  2: 'text-yellow',
  3: 'text-red',
  4: 'text-red',
}

export default function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
  return (
    <div className={`text-sm font-bold ${SEVERITY[warningSeverity(priceImpact)]}`}>
      {priceImpact ? `${priceImpact.multiply(-1).toFixed(2)}%` : '-'}
    </div>
  )
}
