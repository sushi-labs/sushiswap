'use client'

import type { ReactNode } from 'react'
import type { ValueTransferTrade } from 'src/lib/swap/value-transfer/trade'
import { CrossChainSwapConfirmationDialog } from '../cross-chain-swap-confirmation-dialog'
import { CrossChainSwapConfirmationContent } from '../lifi/confirmation-dialog'
import { getLayerZeroExecutionStepStates } from './execution-step-states'
import { getLayerZeroTradeAmounts } from './get-trade-amounts'
import type { LayerZeroTrackedExecution } from './hooks/use-layerzero-executions'

export function LayerZeroExecutionConfirmation({
  execution,
  fallbackQuote,
  error: mutationError,
  isSubmitting,
}: {
  execution: LayerZeroTrackedExecution | undefined
  fallbackQuote?: ValueTransferTrade
  error?: string
  isSubmitting: boolean
}): ReactNode {
  const submittedQuote = execution?.quote ?? fallbackQuote
  const submittedAmounts = submittedQuote
    ? getLayerZeroTradeAmounts(submittedQuote)
    : undefined
  const error = execution
    ? execution.delivery?.status === 'SUCCESS'
      ? undefined
      : execution.error
    : mutationError
  const stepStates = getLayerZeroExecutionStepStates(execution, Boolean(error))
  const bridgeUrl =
    execution?.delivery?.explorerUrl ??
    (execution?.txHash
      ? `https://layerzeroscan.com/tx/${encodeURIComponent(execution.txHash)}`
      : undefined)

  return (
    <CrossChainSwapConfirmationDialog
      stepStates={stepStates}
      closeDisabled={
        isSubmitting && !execution?.txHash && !execution?.submitted
      }
      description={
        execution?.delivery?.status === 'ACTION_REQUIRED' ? (
          'This transfer needs attention. Open the transfer explorer for recovery details.'
        ) : submittedQuote ? (
          <CrossChainSwapConfirmationContent
            chainId0={submittedQuote.fromChainId}
            chainId1={submittedQuote.toChainId}
            txHash={execution?.txHash}
            dstTxHash={execution?.delivery?.destinationTxHash}
            bridgeUrl={bridgeUrl}
            dialogState={stepStates}
            recipient={submittedQuote.recipient}
            amountIn={submittedAmounts?.amountIn.toSignificant(6)}
            amountOut={submittedAmounts?.amountOut.toSignificant(6)}
            token0Symbol={submittedAmounts?.amountIn.currency.symbol}
            token1Symbol={submittedAmounts?.amountOut.currency.symbol}
          />
        ) : (
          'Please sign order with your wallet.'
        )
      }
    >
      {bridgeUrl ? (
        <a
          href={bridgeUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue text-sm text-center"
        >
          Track transfer ↗
        </a>
      ) : null}
    </CrossChainSwapConfirmationDialog>
  )
}
