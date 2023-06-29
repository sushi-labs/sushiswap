import { AppType } from '@sushiswap/ui/types'
import { FC } from 'react'

import { useSwapState } from './TradeProvider'
import { TradeReviewDialogCrossChain } from './TradeReviewDialogCrossChain'
import { TradeReviewDialogSameChain } from './TradeReviewDialogSameChain'

export const TradeReviewDialog: FC = () => {
  const { appType } = useSwapState()

  if (appType === AppType.Swap) return <TradeReviewDialogSameChain />
  return <TradeReviewDialogCrossChain />
}
