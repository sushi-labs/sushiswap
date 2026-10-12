'use client'

import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import { useCrossChainTradeStep } from 'src/lib/hooks/react-query/cross-chain-trade/use-cross-chain-trade-step'
import { logger } from 'src/lib/logger'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import { DialogType, useDialog } from 'src/lib/transaction-dialog'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useApproved } from 'src/lib/wagmi/systems/checker/provider'
import { getRobinhoodTransactionFees } from 'src/lib/wagmi/transactions/get-robinhood-transaction-fees'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import type { EvmAddress, EvmChainId } from 'sushi/evm'
import {
  useConnection,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import { StepState } from '../../confirmation-dialog'
import {
  useLifiXSwap,
  useLifiXSwapSelectedTradeRoute,
} from '../../xswap-provider'
import type { CrossChainSwapTradeReviewBase } from '../types'
import { useCrossChainSwapTradeReviewPre } from './use-cross-chain-swap-trade-review-pre'
import { useCrossChainSwapTradeReviewWriteHandlers } from './use-cross-chain-swap-trade-review-write-handlers'

function toBigInt(value: bigint | `0x${string}` | string | undefined) {
  if (value == null) return undefined
  return typeof value === 'bigint' ? value : BigInt(value)
}

export function useEvmCrossChainSwapTradeReview<
  TChainId0 extends LifiXSwapSupportedChainId & EvmChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  enabled = true,
}: {
  enabled?: boolean
} = {}): CrossChainSwapTradeReviewBase<TChainId0, TChainId1> {
  const { address, chain } = useConnection()
  const currentConnection = useRef({ address, chainId: chain?.id })
  currentConnection.current = { address, chainId: chain?.id }
  const {
    state: { chainId0 },
  } = useLifiXSwap<TChainId0, TChainId1>()

  const client0 = usePublicClient({
    chainId: enabled ? chainId0 : undefined,
  })

  const { approved } = useApproved(APPROVE_TAG_XSWAP)

  const { open: confirmDialogOpen } = useDialog(DialogType.Confirm)
  const { open: reviewDialogOpen } = useDialog(DialogType.Review)

  const { data: selectedRoute } = useLifiXSwapSelectedTradeRoute<
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
    useCrossChainSwapTradeReviewWriteHandlers<TChainId0, TChainId1>({
      routeRef: pre.routeRef,
      groupTs: pre.groupTs,
      setStepStates: pre.setStepStates,
      waitForReceipt: (hash) => waitForSuccessfulReceipt(client0, hash),
      step,
      shouldIgnoreWriteError: isUserRejectedError,
    })

  const [isPreparingFees, setIsPreparingFees] = useState(false)
  const isSubmitting = useRef(false)
  const {
    mutateAsync: sendTransactionAsync,
    isPending: isWritePending,
    data: _hash,
    reset,
  } = useSendTransaction({
    mutation: {
      onSuccess: (hash) => onWriteSuccess(hash as TxHashFor<TChainId0>),
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
      if (isSubmitting.current) return
      isSubmitting.current = true
      setIsPreparingFees(true)
      pre.setStepStates({
        source: StepState.Sign,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })

      try {
        const fees = await getRobinhoodTransactionFees(chainId0, client0)
        if (
          !preparedTx.from ||
          currentConnection.current.chainId !== chainId0 ||
          currentConnection.current.address?.toLowerCase() !==
            preparedTx.from.toLowerCase()
        ) {
          throw new Error(
            'The connected wallet changed. Review the swap again.',
          )
        }
        setIsPreparingFees(false)
        await sendTransactionAsync({
          ...preparedTx,
          account: preparedTx.from,
          ...fees,
        } as Parameters<typeof sendTransactionAsync>[0])
        confirm()
      } catch (error) {
        onWriteError(error instanceof Error ? error : new Error(String(error)))
      } finally {
        isSubmitting.current = false
        setIsPreparingFees(false)
      }
    }
  }, [pre, sendTransactionAsync, preparedTx, chainId0, client0, onWriteError])

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
    isWritePending: isWritePending || isPreparingFees,
    write,
    isEstGasError,
    estGasError,
    isStepQueryError,
  }
}
