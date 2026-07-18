import { createInfoToast, createToast } from '@sushiswap/notifications'
import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { useCallback, useEffect } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { waitForSvmSignature } from 'src/lib/svm/wait-for-svm-signature'
import { useLiFiStatus } from 'src/lib/swap/cross-chain'
import { waitForSuccessfulReceipt } from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { getChainById } from 'sushi'
import { type EvmChainId, isEvmChainId } from 'sushi/evm'
import { isSvmChainId } from 'sushi/svm'
import { usePublicClient } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { StepState } from '../cross-chain-swap-execution'
import type { CrossChainSwapTradeReviewBase } from '../types'

export function useCrossChainSwapTradeReviewTracking<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>(tradeReview: CrossChainSwapTradeReviewBase<TChainId0, TChainId1>) {
  const { submission } = tradeReview
  const { completeLifi } = tradeReview.tracking

  const { data: lifiData } = useLiFiStatus<TChainId0, TChainId1>({
    chainId: submission?.sourceChainId,
    txHash: submission?.hash,
    enabled: Boolean(
      submission && tradeReview.stepStates.source === StepState.Success,
    ),
  })

  const destinationChainId = submission?.destinationChainId
  const evmClient = usePublicClient({
    chainId:
      destinationChainId !== undefined && isEvmChainId(destinationChainId)
        ? destinationChainId
        : undefined,
  })

  const waitForDestinationReceipt = useCallback(
    async (txHash: TxHashFor<TChainId1>) => {
      if (
        destinationChainId !== undefined &&
        isSvmChainId(destinationChainId)
      ) {
        return waitForSvmSignature(txHash)
      }

      return waitForSuccessfulReceipt(
        evmClient,
        txHash as TxHashFor<EvmChainId>,
      )
    },
    [destinationChainId, evmClient],
  )

  const { refetchChain } = useRefetchBalances()

  useEffect(() => {
    const txHash = lifiData?.receiving?.txHash
    if (!submission || !txHash) return

    const { destinationChainId, route } = submission
    const destinationChainName =
      (getChainById(destinationChainId) as { name?: string } | undefined)
        ?.name ?? 'Destination chain'
    const destinationSwapStep = [
      route.step?.includedStepsWithoutFees?.[1],
      route.step?.includedStepsWithoutFees?.[2],
    ].find((step) => step?.type === 'swap')
    const destinationSwapToken = destinationSwapStep?.action.fromToken

    const summary = destinationSwapStep
      ? {
          pending: `Swapping ${destinationSwapToken?.symbol} to ${route.amountOut.toSignificant(6)} ${route.amountOut.currency.symbol}`,
          completed: `Swapped ${destinationSwapToken?.symbol} to ${route.amountOut.toSignificant(6)} ${route.amountOut.currency.symbol}`,
          failed: `Something went wrong when trying to swap ${destinationSwapToken?.symbol} to ${route.amountOut.toSignificant(6)} ${route.amountOut.currency.symbol}`,
        }
      : {
          pending: `Receiving ${route.amountOut.toSignificant(6)} ${route.amountOut.currency.symbol} on ${destinationChainName}`,
          completed: `Received ${route.amountOut.toSignificant(6)} ${route.amountOut.currency.symbol} on ${destinationChainName}`,
          failed: `Something went wrong when trying to receive ${route.amountOut.toSignificant(6)} ${route.amountOut.currency.symbol} on ${destinationChainName}`,
        }

    const promise = waitForDestinationReceipt(txHash)
      .catch((error) => {
        sendAnalyticsEvent(SwapEventName.XSWAP_DST_TRANSACTION_FAILED, {
          chain_id: destinationChainId,
          txHash,
          error: error instanceof Error ? error.message : undefined,
        })
        throw error
      })
      .then(() => {
        sendAnalyticsEvent(SwapEventName.XSWAP_DST_TRANSACTION_COMPLETED, {
          chain_id: destinationChainId,
          txHash,
        })
        refetchChain(destinationChainId)
      })

    void createToast({
      account: submission.account,
      type: 'swap',
      chainId: destinationChainId,
      txHash,
      promise,
      summary,
      timestamp: Date.now(),
      groupTimestamp: submission.groupTimestamp,
    })
  }, [
    lifiData?.receiving?.txHash,
    refetchChain,
    submission,
    waitForDestinationReceipt,
  ])

  useEffect(() => {
    if (!submission || lifiData?.status !== 'DONE') return

    completeLifi(submission.id, lifiData.substatus === 'PARTIAL')
  }, [completeLifi, lifiData?.status, lifiData?.substatus, submission])

  useEffect(() => {
    if (
      !submission ||
      !lifiData?.lifiExplorerLink ||
      tradeReview.stepStates.source !== StepState.Success
    ) {
      return
    }

    void createInfoToast({
      account: submission.account,
      type: 'xswap',
      chainId: submission.sourceChainId,
      href: lifiData.lifiExplorerLink,
      summary: `Bridging ${submission.route.fromToken.symbol} from ${
        getChainById(submission.sourceChainId).name
      } to ${getChainById(submission.destinationChainId)?.name}`,
      timestamp: Date.now(),
      groupTimestamp: submission.groupTimestamp,
    })
  }, [lifiData?.lifiExplorerLink, submission, tradeReview.stepStates.source])

  return { lifiData }
}
