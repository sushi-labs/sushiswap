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
import {
  useLifiXSwap,
  useLifiXSwapSelectedTradeRoute,
} from '../../xswap-provider'
import type { CrossChainSwapTradeReviewBase } from '../types'
import { useCrossChainSwapExecution } from './use-cross-chain-swap-execution'

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

  const execution = useCrossChainSwapExecution<TChainId0, TChainId1>({
    source: {
      waitForReceipt: (hash) => waitForSvmSignature(hash),
      shouldIgnoreWriteError: () => false,
    },
    step,
  })

  const { mutateAsync: sendTransactionAsync, isPending: isWritePending } =
    useMutation({
      mutationFn: async (unsignedTransaction: string) => {
        if (!signer) throw new Error('No signer available')

        const unsignedBytes = base64Encoder.encode(unsignedTransaction)

        const { base58TxSig: signature } =
          await signAndSendTransaction(unsignedBytes)

        return signature as unknown as TxHashFor<TChainId0>
      },
    })

  const write =
    preparedTx && selectedRoute
      ? async (confirm: () => void) => {
          execution.startSigning()

          try {
            const hash = await sendTransactionAsync(preparedTx.data as string)
            execution.onBroadcast(hash, selectedRoute)
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
