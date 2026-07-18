'use client'

import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { DialogType, useDialog } from '@sushiswap/ui'
import { useEffect, useMemo } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { APPROVE_TAG_XSWAP } from 'src/lib/constants'
import { useCrossChainTradeStep } from 'src/lib/hooks/react-query'
import { logger } from 'src/lib/logger'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import { isUserRejectedError } from 'src/lib/wagmi/errors'
import { useApproved } from 'src/lib/wagmi/systems/Checker/provider'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import type { EvmChainId } from 'sushi/evm'
import {
  useConnection,
  useEstimateGas,
  usePublicClient,
  useSendTransaction,
} from 'wagmi'
import {
  useLifiXSwap,
  useLifiXSwapSelectedTradeRoute,
} from '../../xswap-provider'
import type { CrossChainSwapTradeReviewBase } from '../types'
import { useCrossChainSwapExecution } from './use-cross-chain-swap-execution'

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

  const execution = useCrossChainSwapExecution<TChainId0, TChainId1>({
    source: {
      waitForReceipt: (hash) => waitForSuccessfulReceipt(client0, hash),
      shouldIgnoreWriteError: isUserRejectedError,
    },
    step,
  })

  const { mutateAsync: sendTransactionAsync, isPending: isWritePending } =
    useSendTransaction()

  const write =
    preparedTx && selectedRoute
      ? async (confirm: () => void) => {
          execution.startSigning()

          try {
            const hash = await sendTransactionAsync(
              preparedTx as Parameters<typeof sendTransactionAsync>[0],
            )
            execution.onBroadcast(hash as TxHashFor<TChainId0>, selectedRoute)
            confirm()
          } catch (error) {
            execution.onWriteError(
              error instanceof Error
                ? error
                : new Error('Failed to send transaction'),
            )
          }
        }
      : undefined

  return {
    step: enabled ? step : undefined,
    execution: execution.execution,
    submission: execution.submission,
    stepStates: execution.stepStates,
    hash: execution.submission?.hash,
    route: execution.submission?.route,
    tracking: {
      completeLifi: execution.completeLifi,
    },
    slippagePercent: execution.slippagePercent,
    isWritePending: enabled ? isWritePending : false,
    write: enabled ? write : undefined,
    retryReceiptObservation: enabled
      ? execution.retryReceiptObservation
      : () => {},
    isEstGasError: enabled ? isEstGasError : false,
    estGasError: enabled ? estGasError : null,
    isStepQueryError: enabled ? isStepQueryError : false,
  }
}
