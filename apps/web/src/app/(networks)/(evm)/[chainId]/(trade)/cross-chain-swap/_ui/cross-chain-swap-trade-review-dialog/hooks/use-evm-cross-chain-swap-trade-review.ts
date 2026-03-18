'use client'

import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { DialogType, useDialog } from '@sushiswap/ui'
import { useEffect, useMemo } from 'react'
import type { XSwapSupportedChainId } from 'src/config'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import { useCrossChainTradeStep } from 'src/lib/hooks/react-query'
import { logger } from 'src/lib/logger'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useApproved } from 'src/lib/wagmi/systems/Checker/provider'
import type { EvmAddress, EvmChainId } from 'sushi/evm'
import {
  useConnection,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { StepState } from '../../cross-chain-swap-confirmation-dialog'
import {
  useDerivedStateCrossChainSwap,
  useSelectedCrossChainTradeRoute,
} from '../../derivedstate-cross-chain-swap-provider'
import type { CrossChainSwapTradeReviewBase } from '../types'
import { useCrossChainSwapTradeReviewPre } from './use-cross-chain-swap-trade-review-pre'
import { useCrossChainSwapTradeReviewWriteHandlers } from './use-cross-chain-swap-trade-review-write-handlers'

function toBigInt(value: bigint | `0x${string}` | string | undefined) {
  if (value == null) return undefined
  return typeof value === 'bigint' ? value : BigInt(value)
}

export function useEvmCrossChainSwapTradeReview<
  TChainId0 extends XSwapSupportedChainId & EvmChainId,
  TChainId1 extends XSwapSupportedChainId,
>({
  enabled = true,
}: {
  enabled?: boolean
} = {}): CrossChainSwapTradeReviewBase<TChainId0, TChainId1> {
  const { address, chain } = useConnection()
  const {
    state: { chainId0 },
  } = useDerivedStateCrossChainSwap<TChainId0, TChainId1>()

  const client0 = usePublicClient({
    chainId: enabled ? chainId0 : undefined,
  })

  const { approved } = useApproved(APPROVE_TAG_XSWAP)

  const { open: confirmDialogOpen } = useDialog(DialogType.Confirm)
  const { open: reviewDialogOpen } = useDialog(DialogType.Review)

  const { data: selectedRoute } = useSelectedCrossChainTradeRoute<
    TChainId0,
    TChainId1
  >()

  const { data: step, isError: isStepQueryError } = useCrossChainTradeStep({
    step: selectedRoute?.step,
    enabled: Boolean(
      enabled && approved && address && (confirmDialogOpen || reviewDialogOpen),
    ),
  })

  const pre = useCrossChainSwapTradeReviewPre<TChainId0, TChainId1>()

  const {
    data: estGas,
    isError: isEstGasError,
    error: estGasError,
  } = useEstimateGas({
    chainId: chainId0,
    to: step?.transactionRequest?.to,
    data: step?.transactionRequest?.data,
    value: toBigInt(step?.transactionRequest?.value),
    account: step?.transactionRequest?.from,
    query: {
      enabled: Boolean(enabled && chain?.id === chainId0 && approved),
    },
  })

  const preparedTx = useMemo(() => {
    return step?.transactionRequest && estGas
      ? {
          ...step.transactionRequest,
          chainId: chainId0,
          gas: estGas,
          value: toBigInt(step.transactionRequest.value),
          gasPrice: toBigInt(step.transactionRequest.gasPrice),
        }
      : undefined
  }, [chainId0, step?.transactionRequest, estGas])

  // onSimulateError
  useEffect(() => {
    if (estGasError) {
      if (estGasError.message.startsWith('user rejected transaction')) return

      logger.error(estGasError, {
        location: 'CrossChainSwapTradeReviewDialog',
        action: 'prepareTransaction',
      })

      sendAnalyticsEvent(SwapEventName.XSWAP_ESTIMATE_GAS_CALL_FAILED, {
        error: estGasError.message,
      })
    }
  }, [estGasError])

  const { onWriteSuccess, onWriteError } =
    useCrossChainSwapTradeReviewWriteHandlers<
      TChainId0,
      TChainId1,
      {
        status: 'success' | 'reverted'
      }
    >({
      routeRef: pre.routeRef,
      groupTs: pre.groupTs,
      setStepStates: pre.setStepStates,
      waitForReceipt: (hash) => client0.waitForTransactionReceipt({ hash }),
      getReceiptInfo: (receipt) => ({
        status: receipt.status === 'success' ? 'success' : 'failed',
      }),
      step,
      shouldIgnoreWriteError: isUserRejectedError,
    })

  const {
    mutateAsync: sendTransactionAsync,
    isPending: isWritePending,
    data: _hash,
    reset,
  } = useSendTransaction({
    mutation: {
      onSuccess: (hash) => onWriteSuccess(hash as TxHashFor<TChainId0>),
      onError: onWriteError,
      onMutate: () => {
        if (pre.routeRef && selectedRoute) {
          pre.routeRef.current = selectedRoute
        }
      },
    },
  })

  const hash = _hash as TxHashFor<TChainId0> | undefined

  const write = useMemo(() => {
    if (!preparedTx) return undefined

    return async (confirm: () => void) => {
      pre.setStepStates({
        source: StepState.Sign,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })

      try {
        await sendTransactionAsync(
          preparedTx as Parameters<typeof sendTransactionAsync>[0],
        )
        confirm()
      } catch (e) {
        console.log(e)
      }
    }
  }, [pre, sendTransactionAsync, preparedTx])

  if (!enabled) {
    return {
      step: undefined,
      stepStates: pre.stepStates,
      hash: undefined,
      routeRef: pre.routeRef,
      tracking: {
        groupTs: pre.groupTs,
        reset: () => {},
        setStepStates: pre.setStepStates,
      },
      slippagePercent: pre.slippagePercent,
      isWritePending: false,
      write: undefined,
      isEstGasError: false,
      estGasError: null,
      isStepQueryError: false,
    }
  }

  return {
    step,
    stepStates: pre.stepStates,
    hash,
    routeRef: pre.routeRef,
    tracking: {
      groupTs: pre.groupTs,
      reset,
      setStepStates: pre.setStepStates,
    },
    slippagePercent: pre.slippagePercent,
    isWritePending,
    write,
    isEstGasError,
    estGasError,
    isStepQueryError,
  }
}
