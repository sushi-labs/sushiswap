'use client'

import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'

export function TradeWarnings({
  showSlippageWarning,
  showPriceImpactWarning,
}: {
  showSlippageWarning: boolean
  showPriceImpactWarning: boolean
}) {
  return (
    <>
      {showSlippageWarning && <SlippageWarning />}
      {showPriceImpactWarning && <PriceImpactWarning />}
    </>
  )
}
