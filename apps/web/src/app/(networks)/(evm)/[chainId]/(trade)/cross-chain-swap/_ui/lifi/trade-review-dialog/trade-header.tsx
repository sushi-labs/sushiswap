'use client'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
  SkeletonText,
} from '@sushiswap/ui'
import type { LifiXSwapSupportedChainId } from 'src/config'
import type { UseCrossChainTradeStepReturn } from 'src/lib/hooks/react-query'
import { useLifiXSwap } from '../xswap-provider'

export function TradeHeader<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  step,
}: {
  step: UseCrossChainTradeStepReturn<TChainId0, TChainId1> | undefined
}) {
  const {
    state: { token0, token1, swapAmount },
  } = useLifiXSwap<TChainId0, TChainId1>()

  return (
    <DialogHeader className="!text-left">
      <DialogTitle>
        {!step?.amountOut ? (
          <SkeletonText fontSize="xs" className="w-2/3" />
        ) : (
          `Receive ${step.amountOut.toSignificant(6)} ${token1?.symbol}`
        )}
      </DialogTitle>
      <DialogDescription>
        Swap {swapAmount?.toSignificant(6)} {token0?.symbol}{' '}
      </DialogDescription>
    </DialogHeader>
  )
}
