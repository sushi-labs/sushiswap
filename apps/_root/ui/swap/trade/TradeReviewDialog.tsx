import { FC } from 'react'
import { useSwapState } from './TradeProvider'
import { TradeReviewDialogSameChain } from './TradeReviewDialogSameChain'
import { TradeReviewDialogCrossChain } from './TradeReviewDialogCrossChain'
import { AppType } from '@sushiswap/ui/types'

export const TradeReviewDialog: FC = () => {
  const { appType } = useSwapState()

  if (appType === AppType.Swap) return <TradeReviewDialogSameChain />
  return <TradeReviewDialogCrossChain />
}
