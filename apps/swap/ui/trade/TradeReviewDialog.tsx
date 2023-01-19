import { FC } from 'react'
import { useSwapState } from './TradeProvider'
import { TradeReviewDialogSameChain } from './TradeReviewDialogSameChain'
import { TradeReviewDialogCrossChain } from './TradeReviewDialogCrossChain'

export const TradeReviewDialog: FC = () => {
  const { network0, network1 } = useSwapState()

  if (network0 === network1) return <TradeReviewDialogSameChain />
  return <TradeReviewDialogCrossChain />
}
