'use client'

import { getBase64Encoder } from '@solana/codecs-strings'
import { useTransactionSigner } from '@solana/connector'
import { DialogType, useDialog } from '@sushiswap/ui'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { useCrossChainTradeStep } from 'src/lib/hooks/react-query'
import { useSvmSignAndSendTransaction } from 'src/lib/svm/hooks/use-svm-sign-and-send-transaction'
import { useSvmEstimateGas } from 'src/lib/svm/hooks/useSvmEstimateGas'
import { waitForSvmSignature } from 'src/lib/svm/wait-for-svm-signature'
import { useAccount } from 'src/lib/wallet'
import type { SvmChainId } from 'sushi/svm'
import { StepState } from '../../confirmation-dialog'
import {
  useLifiXSwap,
  useLifiXSwapSelectedTradeRoute,
} from '../../xswap-provider'
import type { CrossChainSwapTradeReviewBase } from '../types'
import { useCrossChainSwapTradeReviewPre } from './use-cross-chain-swap-trade-review-pre'
import { useCrossChainSwapTradeReviewWriteHandlers } from './use-cross-chain-swap-trade-review-write-handlers'

const base64Encoder = getBase64Encoder()

export function useSvmCrossChainSwapTradeReview<
  TChainId0 extends LifiXSwapSupportedChainId & SvmChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  enabled = true,
}: {
  enabled?: boolean
} = {}): CrossChainSwapTradeReviewBase<TChainId0, TChainId1> {
  const {
    state: { chainId0 },
  } = useLifiXSwap<TChainId0, TChainId1>()

  const address = useAccount(chainId0)
  const { signer } = useTransactionSigner()
  const { signAndSendTransaction } = useSvmSignAndSendTransaction()

  const { open: confirmDialogOpen } = useDialog(DialogType.Confirm)
  const { open: reviewDialogOpen } = useDialog(DialogType.Review)

  const { data: selectedRoute } = useLifiXSwapSelectedTradeRoute<
    TChainId0,
    TChainId1
  >()

  const { data: step, isError: isStepQueryError } = useCrossChainTradeStep({
    step: selectedRoute?.step,
    enabled: Boolean(
      enabled && address && (confirmDialogOpen || reviewDialogOpen),
    ),
  })

  const pre = useCrossChainSwapTradeReviewPre<TChainId0, TChainId1>()

  const {
    data: estGas,
    error: estGasError,
    isError: isEstGasError,
  } = useSvmEstimateGas({
    unsignedTx: step?.transactionRequest?.data,
    enabled: Boolean(enabled && step),
  })

  const preparedTx = useMemo(() => {
    return step?.transactionRequest && estGas
      ? { ...step.transactionRequest, gas: estGas }
      : undefined
  }, [step?.transactionRequest, estGas])

  const { onWriteSuccess, onWriteError } =
    useCrossChainSwapTradeReviewWriteHandlers({
      routeRef: pre.routeRef,
      groupTs: pre.groupTs,
      setStepStates: pre.setStepStates,
      waitForReceipt: (hash) => waitForSvmSignature(hash),
      step,
      shouldIgnoreWriteError: () => {
        return false
      },
    })

  const {
    mutateAsync: sendTransactionAsync,
    isPending: isWritePending,
    data: hash,
    reset,
  } = useMutation({
    mutationFn: async (unsignedTransaction: string) => {
      if (!signer) throw new Error('No signer available')

      const unsignedBytes = base64Encoder.encode(unsignedTransaction)

      const { base58TxSig: signature } =
        await signAndSendTransaction(unsignedBytes)

      return signature as unknown as TxHashFor<TChainId0>
    },
    onSuccess: onWriteSuccess,
    onError: onWriteError,
  })

  const write = useMemo(() => {
    if (!preparedTx) return undefined

    return async (confirm: () => void) => {
      pre.setStepStates({
        source: StepState.Sign,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })

      try {
        await sendTransactionAsync(preparedTx.data as string)
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
