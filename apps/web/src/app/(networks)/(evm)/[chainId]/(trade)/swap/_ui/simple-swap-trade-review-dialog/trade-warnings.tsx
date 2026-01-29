'use client'

import React, { type FC } from 'react'
import { PriceImpactWarning } from 'src/app/(networks)/_ui/price-impact-warning'
import { SlippageWarning } from 'src/app/(networks)/_ui/slippage-warning'

export const TradeWarnings: FC<{
  showSlippageWarning: boolean
  showPriceImpactWarning: boolean
}> = ({ showSlippageWarning, showPriceImpactWarning }) => (
  <>
    {showSlippageWarning && <SlippageWarning />}
    {showPriceImpactWarning && <PriceImpactWarning />}
  </>
)
