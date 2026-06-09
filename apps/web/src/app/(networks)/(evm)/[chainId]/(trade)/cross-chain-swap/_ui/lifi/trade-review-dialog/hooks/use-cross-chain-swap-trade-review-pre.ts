'use client'

import { useRef, useState } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { StepState } from '../../confirmation-dialog'
import type { UseLifiXSwapSelectedTradeRouteReturn } from '../../xswap-provider'

export function useCrossChainSwapTradeReviewPre<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>() {
  const [slippagePercent] = useSlippageTolerance()
  const routeRef = useRef<UseLifiXSwapSelectedTradeRouteReturn<
    TChainId0,
    TChainId1
  > | null>(null)
  const groupTs = useRef<number | undefined>(undefined)
  const [stepStates, setStepStates] = useState({
    source: StepState.NotStarted,
    bridge: StepState.NotStarted,
    dest: StepState.NotStarted,
  })

  return {
    slippagePercent,
    routeRef,
    groupTs,
    stepStates,
    setStepStates,
  }
}
