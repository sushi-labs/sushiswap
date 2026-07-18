import { createErrorToast } from '@sushiswap/notifications'
import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { DialogType, useDialog } from '@sushiswap/ui'
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import type { UseCrossChainTradeStepReturn } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import { logger } from 'src/lib/logger'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import { useAccount } from 'src/lib/wallet'
import { Amount } from 'sushi'
import { useDetailsInteractionTracker } from '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import {
  type UseLifiXSwapSelectedTradeRouteReturn,
  useLifiXSwap,
} from '../../xswap-provider'
import {
  type CrossChainSwapSubmission,
  crossChainSwapExecutionReducer,
  getCrossChainSwapStepStates,
  initialCrossChainSwapExecutionState,
} from '../cross-chain-swap-execution'
import {
  type SourceTransactionAdapter,
  useCrossChainSwapSourceTracking,
} from './use-cross-chain-swap-source-tracking'

interface UseCrossChainSwapExecutionParams<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> {
  source: SourceTransactionAdapter<TChainId0>
  step: UseCrossChainTradeStepReturn<TChainId0, TChainId1> | undefined
}

export function useCrossChainSwapExecution<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({ source, step }: UseCrossChainSwapExecutionParams<TChainId0, TChainId1>) {
  const {
    state: { chainId0, chainId1 },
    mutate: { setSwapAmount },
  } = useLifiXSwap<TChainId0, TChainId1>()
  const {
    state: { isDetailsCollapsed, wasDetailsTouched },
    mutate: { resetDetailsTrackedState },
  } = useDetailsInteractionTracker()
  const address = useAccount(chainId0)
  const { data: prices } = usePrices({ chainId: chainId0 })
  const { open: confirmDialogOpen } = useDialog(DialogType.Confirm)
  const wasConfirmDialogOpen = useRef(confirmDialogOpen)
  const [slippagePercent] = useSlippageTolerance()

  const [execution, dispatch] = useReducer(
    crossChainSwapExecutionReducer<TChainId0, TChainId1>,
    undefined,
    initialCrossChainSwapExecutionState<TChainId0, TChainId1>,
  )
  const { observeSourceTransaction, retrySourceTransaction } =
    useCrossChainSwapSourceTracking({ source, dispatch })

  const stepStates = useMemo(
    () => getCrossChainSwapStepStates(execution),
    [execution],
  )
  const feeData = useMemo(
    () => (step ? getCrossChainFeesBreakdown(step) : undefined),
    [step],
  )

  useEffect(() => {
    if (wasConfirmDialogOpen.current && !confirmDialogOpen) {
      dispatch({ type: 'DIALOG_CLOSED' })
    }
    wasConfirmDialogOpen.current = confirmDialogOpen
  }, [confirmDialogOpen])

  useEffect(() => {
    if (execution.phase !== 'bridging' || !execution.active) return
    setSwapAmount('')
    resetDetailsTrackedState()
  }, [
    execution.active,
    execution.phase,
    resetDetailsTrackedState,
    setSwapAmount,
  ])

  function startSigning() {
    dispatch({ type: 'START_SIGNING' })
  }

  function createSubmission(
    hash: TxHashFor<TChainId0>,
    route: UseLifiXSwapSelectedTradeRouteReturn<TChainId0, TChainId1>,
  ): CrossChainSwapSubmission<TChainId0, TChainId1> {
    const token0Usd =
      prices?.get(
        route.amountIn.currency.wrap().address as ContractAddressFor<TChainId0>,
      ) ?? 0
    const swapAmountUsd = Amount.tryFromHuman(
      route.amountIn.currency,
      route.amountIn.toString(),
    )?.mulHuman(token0Usd)

    return {
      id: `${chainId0}:${hash}`,
      hash,
      route,
      account: address,
      sourceChainId: chainId0,
      destinationChainId: chainId1,
      groupTimestamp: Date.now(),
      telemetry: {
        swapAmountUsd:
          swapAmountUsd && token0Usd ? swapAmountUsd.toString() : 'N/A',
        feeUsd: feeData?.uiFeesUSD ? feeData.uiFeesUSD.toString() : 'N/A',
        recipient: address ?? 'N/A',
        detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
        wasDetailsTouched: wasDetailsTouched ? 'yes' : 'no',
      },
    }
  }

  function onBroadcast(
    hash: TxHashFor<TChainId0>,
    route: UseLifiXSwapSelectedTradeRouteReturn<TChainId0, TChainId1>,
  ) {
    const submission = createSubmission(hash, route)
    dispatch({ type: 'BROADCAST', submission })
    observeSourceTransaction(submission)
  }

  function onWriteError(error: Error) {
    dispatch({ type: 'WRITE_FAILED' })
    if (source.shouldIgnoreWriteError(error)) return

    logger.error(error, {
      location: 'CrossChainSwapTradeReviewDialog',
      action: 'writeError',
    })
    createErrorToast(error.message, false)
    sendAnalyticsEvent(SwapEventName.XSWAP_ERROR, { error: error.message })
  }

  function retryReceiptObservation() {
    const submission = execution.submission
    if (!submission) return
    retrySourceTransaction(submission)
  }

  const completeLifi = useCallback(function completeLifi(
    submissionId: string,
    partial: boolean,
  ) {
    dispatch({ type: 'LIFI_COMPLETED', submissionId, partial })
  }, [])

  return {
    execution,
    submission: execution.submission,
    stepStates,
    slippagePercent,
    startSigning,
    onBroadcast,
    onWriteError,
    retryReceiptObservation,
    completeLifi,
  }
}
