import { createToast } from '@sushiswap/notifications'
import {
  SwapEventName,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import { useQueryClient } from '@tanstack/react-query'
import type { Dispatch } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { sendDrilldownLog } from 'src/lib/drilldown-log'
import { logger } from 'src/lib/logger'
import { SvmTransactionFailedError } from 'src/lib/svm/wait-for-svm-signature'
import {
  fetchTransactionReceipt,
  refetchTransactionReceipt,
} from 'src/lib/transactions/transaction-receipt-query'
import { isTerminalReceiptObservationError } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { getChainById } from 'sushi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import type {
  CrossChainSwapExecutionEvent,
  CrossChainSwapSubmission,
} from '../cross-chain-swap-execution'

export interface SourceTransactionAdapter<
  TChainId0 extends LifiXSwapSupportedChainId,
> {
  waitForReceipt(hash: TxHashFor<TChainId0>): Promise<unknown>
  shouldIgnoreWriteError(error: Error): boolean
}

interface UseCrossChainSwapSourceTrackingParams<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> {
  source: SourceTransactionAdapter<TChainId0>
  dispatch: Dispatch<CrossChainSwapExecutionEvent<TChainId0, TChainId1>>
}

function isTerminalSourceReceiptError(error: unknown) {
  return (
    error instanceof SvmTransactionFailedError ||
    isTerminalReceiptObservationError(error)
  )
}

export function useCrossChainSwapSourceTracking<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  source,
  dispatch,
}: UseCrossChainSwapSourceTrackingParams<TChainId0, TChainId1>) {
  const queryClient = useQueryClient()
  const { refetchChain: refetchBalances } = useRefetchBalances()
  const trace = useTrace()

  function observeSourceTransaction(
    submission: CrossChainSwapSubmission<TChainId0, TChainId1>,
  ) {
    const receiptPromise = fetchTransactionReceipt({
      queryClient,
      chainId: submission.sourceChainId,
      hash: submission.hash,
      isTerminalError: isTerminalSourceReceiptError,
      queryFn: () => source.waitForReceipt(submission.hash),
      onAttempt: () => {
        dispatch({
          type: 'RECEIPT_ATTEMPT',
          submissionId: submission.id,
        })
      },
      onRetry: (error) => {
        logger.error(error, {
          location: 'CrossChainSwapTradeReviewDialog',
          action: 'waitForReceipt',
          txHash: submission.hash,
        })
        dispatch({
          type: 'RECEIPT_UNAVAILABLE',
          submissionId: submission.id,
        })
      },
    })

    sendAnalyticsEvent(SwapEventName.XSWAP_SIGNED, {
      ...trace,
      txHash: submission.hash,
    })

    const destinationChainName = getChainById(
      submission.destinationChainId,
    ).name
    const isSend =
      submission.route.step?.includedStepsWithoutFees?.[0]?.type === 'cross'
    const amount = submission.route.amountIn.toSignificant(6)
    const fromSymbol = submission.route.amountIn.currency.symbol
    const toSymbol = submission.route.amountOut.currency.symbol

    void createToast({
      account: submission.account,
      type: 'swap',
      chainId: submission.sourceChainId,
      txHash: submission.hash,
      promise: receiptPromise,
      summary: isSend
        ? {
            pending: `Sending ${amount} ${fromSymbol} to ${destinationChainName}`,
            completed: `Sent ${amount} ${fromSymbol} to ${destinationChainName}`,
            failed: `Something went wrong when trying to send ${fromSymbol} to ${destinationChainName}`,
          }
        : {
            pending: `Swapping ${amount} ${fromSymbol} to bridge token ${toSymbol}`,
            completed: `Swapped ${amount} ${fromSymbol} to bridge token ${toSymbol}`,
            failed: `Something went wrong when trying to swap ${fromSymbol} to bridge token`,
          },
      timestamp: submission.groupTimestamp,
      groupTimestamp: submission.groupTimestamp,
    })

    void receiptPromise.then(
      () => {
        dispatch({
          type: 'SOURCE_CONFIRMED',
          submissionId: submission.id,
        })
        refetchBalances(submission.sourceChainId)

        sendAnalyticsEvent(SwapEventName.XSWAP_SRC_TRANSACTION_COMPLETED, {
          txHash: submission.hash,
          address: submission.account,
          src_chain_id: submission.sourceChainId,
          dst_chain_id: submission.destinationChainId,
        })

        const { amountIn, amountOut } = submission.route
        const swapDetails = {
          location: '_CrossChainSwapTradeReviewDialog',
          action: 'onWriteSuccess',
          chainId: String(submission.sourceChainId),
          chainId1: String(submission.destinationChainId),
          token0:
            amountIn.currency.type === 'native'
              ? 'native'
              : amountIn.currency.address,
          token0Symbol: amountIn.currency.symbol ?? 'N/A',
          token1:
            amountOut.currency.type === 'native'
              ? 'native'
              : amountOut.currency.address,
          token1Symbol: amountOut.currency.symbol ?? 'N/A',
          swapAmount: amountIn.toString(),
          timestamp: Date.now().toString(),
          ...submission.telemetry,
        }
        void sendDrilldownLog({
          dataForLog: swapDetails,
          extraFields: {
            detailsCollapsedState: swapDetails.detailsCollapsedState,
            feeUsd: swapDetails.feeUsd,
            chainId: swapDetails.chainId,
            wasDetailsTouched: swapDetails.wasDetailsTouched,
            recipient: swapDetails.recipient,
          },
          logLevel: 'info',
        }).catch((error: unknown) => {
          logger.error(error, {
            location: 'CrossChainSwapTradeReviewDialog',
            action: 'sendDrilldownLog',
            txHash: submission.hash,
          })
        })
      },
      (error: unknown) => {
        logger.error(error, {
          location: 'CrossChainSwapTradeReviewDialog',
          action: 'waitForReceipt',
          txHash: submission.hash,
        })
        if (!isTerminalSourceReceiptError(error)) return

        dispatch({ type: 'SOURCE_FAILED', submissionId: submission.id })
        sendAnalyticsEvent(SwapEventName.XSWAP_SRC_TRANSACTION_FAILED, {
          txHash: submission.hash,
          address: submission.account,
          src_chain_id: submission.sourceChainId,
          dst_chain_id: submission.destinationChainId,
        })
        refetchBalances(submission.sourceChainId)
      },
    )
  }

  function retrySourceTransaction(
    submission: CrossChainSwapSubmission<TChainId0, TChainId1>,
  ) {
    void refetchTransactionReceipt(
      queryClient,
      submission.sourceChainId,
      submission.hash,
    )
  }

  return { observeSourceTransaction, retrySourceTransaction }
}
