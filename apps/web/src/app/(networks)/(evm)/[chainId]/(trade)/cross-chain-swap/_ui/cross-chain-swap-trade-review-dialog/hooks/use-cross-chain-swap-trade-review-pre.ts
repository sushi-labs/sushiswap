'use client'

import { useRef, useState } from 'react'
import type { XSwapSupportedChainId } from 'src/config'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { StepState } from '../../cross-chain-swap-confirmation-dialog'
import type { UseSelectedCrossChainTradeRouteReturn } from '../../derivedstate-cross-chain-swap-provider'

export function useCrossChainSwapTradeReviewPre<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>() {
  const [slippagePercent] = useSlippageTolerance()
  const routeRef = useRef<UseSelectedCrossChainTradeRouteReturn<
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
