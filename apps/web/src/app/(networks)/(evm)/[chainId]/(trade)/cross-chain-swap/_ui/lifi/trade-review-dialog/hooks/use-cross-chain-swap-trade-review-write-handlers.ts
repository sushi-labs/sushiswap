import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  SwapEventName,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import { nanoid } from 'nanoid'
import { useCallback, useMemo } from 'react'
import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { sendDrilldownLog } from 'src/lib/drilldown-log'
import type { UseCrossChainTradeStepReturn } from 'src/lib/hooks/react-query'
import { logger } from 'src/lib/logger'
import { SvmTransactionFailedError } from 'src/lib/svm/wait-for-svm-signature'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import {
  TransactionReceiptRevertedError,
  TransactionReplacedError,
} from 'src/lib/wagmi/transactions/wait-for-successful-receipt'
import { useAccount } from 'src/lib/wallet'
import { Amount, getChainById } from 'sushi'
import { useDetailsInteractionTracker } from '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { StepState } from '../../confirmation-dialog'
import {
  type UseLifiXSwapSelectedTradeRouteReturn,
  useLifiXSwap,
} from '../../xswap-provider'

export type CrossChainSwapTradeReviewWriteHandlersParams<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
> = {
  routeRef: RefObject<UseLifiXSwapSelectedTradeRouteReturn<
    TChainId0,
    TChainId1
  > | null>
  groupTs: RefObject<number | undefined>
  setStepStates: Dispatch<
    SetStateAction<{
      source: StepState
      bridge: StepState
      dest: StepState
    }>
  >
  waitForReceipt: (hash: TxHashFor<TChainId0>) => Promise<unknown>
  step: UseCrossChainTradeStepReturn<TChainId0, TChainId1> | undefined
  shouldIgnoreWriteError?: (error: Error) => boolean
}

export function useCrossChainSwapTradeReviewWriteHandlers<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  routeRef,
  groupTs,
  setStepStates,
  waitForReceipt,
  step,
  shouldIgnoreWriteError,
}: CrossChainSwapTradeReviewWriteHandlersParams<TChainId0, TChainId1>) {
  const {
    state: { chainId0, chainId1 },
    mutate: { setSwapAmount, setTradeId },
  } = useLifiXSwap<TChainId0, TChainId1>()
  const {
    state: { isDetailsCollapsed, wasDetailsTouched },
    mutate: { resetDetailsTrackedState },
  } = useDetailsInteractionTracker()

  const address = useAccount(chainId0)

  const { refetchChain: refetchBalances } = useRefetchBalances()
  const { data: prices } = usePrices({ chainId: chainId0 })

  const trace = useTrace()

  const feeData = useMemo(
    () => (step ? getCrossChainFeesBreakdown(step) : undefined),
    [step],
  )

  const onWriteSuccess = useCallback(
    async (hash: TxHashFor<TChainId0>) => {
      setStepStates({
        source: StepState.Pending,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })

      setSwapAmount('')

      if (!routeRef.current || !chainId0) return

      sendAnalyticsEvent(SwapEventName.XSWAP_SIGNED, {
        ...trace,
        txHash: hash,
      })

      const receiptPromise = waitForReceipt(hash)

      groupTs.current = new Date().getTime()
      const destinationChainName = routeRef.current?.toChainId
        ? getChainById(routeRef.current.toChainId as LifiXSwapSupportedChainId)
            .name
        : 'destination chain'

      void createToast({
        account: address,
        type: 'swap',
        chainId: chainId0,
        txHash: hash,
        promise: receiptPromise,
        summary:
          routeRef?.current?.step?.includedStepsWithoutFees?.[0]?.type ===
          'cross'
            ? {
                pending: `Sending ${routeRef?.current?.amountIn?.toSignificant(
                  6,
                )} ${routeRef?.current?.amountIn?.currency.symbol} to ${
                  destinationChainName
                }`,
                completed: `Sent ${routeRef?.current?.amountIn?.toSignificant(
                  6,
                )} ${routeRef?.current?.amountIn?.currency.symbol} to ${
                  destinationChainName
                }`,
                failed: `Something went wrong when trying to send ${
                  routeRef?.current?.amountIn?.currency.symbol
                } to ${destinationChainName}`,
              }
            : {
                pending: `Swapping ${routeRef.current?.amountIn?.toSignificant(
                  6,
                )} ${
                  routeRef?.current?.amountIn?.currency.symbol
                } to bridge token ${
                  routeRef?.current?.amountOut.currency.symbol
                }`,
                completed: `Swapped ${routeRef?.current?.amountIn?.toSignificant(
                  6,
                )} ${
                  routeRef?.current?.amountIn?.currency.symbol
                } to bridge token ${
                  routeRef?.current?.amountOut.currency.symbol
                }`,
                failed: `Something went wrong when trying to swap ${
                  routeRef?.current?.amountIn?.currency.symbol
                } to bridge token`,
              },
        timestamp: groupTs.current,
        groupTimestamp: groupTs.current,
      })

      try {
        await receiptPromise
        const trade = routeRef.current
        sendAnalyticsEvent(SwapEventName.XSWAP_SRC_TRANSACTION_COMPLETED, {
          txHash: hash,
          address,
          src_chain_id: trade?.amountIn?.currency?.chainId,
          dst_chain_id: trade?.amountOut?.currency?.chainId,
        })
        if (trade?.amountIn?.currency && trade?.amountOut?.currency) {
          const token0Usd =
            prices?.get(
              trade?.amountIn?.currency.wrap()
                .address as ContractAddressFor<TChainId0>,
            ) ?? 0
          const swapAmountUsd = Amount.tryFromHuman(
            trade?.amountIn?.currency,
            trade?.amountIn?.toString(),
          )?.mulHuman(token0Usd)
          const swapDetails = {
            location: '_CrossChainSwapTradeReviewDialog',
            action: 'onWriteSuccess',
            chainId: String(chainId0),
            chainId1: String(chainId1),
            token0:
              trade?.amountIn?.currency.type === 'native'
                ? 'native'
                : trade?.amountIn?.currency.address,
            token0Symbol: trade?.amountIn?.currency.symbol ?? 'N/A',
            token1:
              trade?.amountOut?.currency.type === 'native'
                ? 'native'
                : trade?.amountOut?.currency.address,
            token1Symbol: trade?.amountOut?.currency.symbol ?? 'N/A',
            swapAmount: trade?.amountIn?.toString(),
            swapAmountUsd:
              swapAmountUsd && token0Usd ? swapAmountUsd?.toString() : 'N/A',
            feeUsd: feeData?.uiFeesUSD ? feeData?.uiFeesUSD.toString() : 'N/A',
            recipient: address ? address : 'N/A',
            timestamp: Date.now().toString(),
            detailsCollapsedState: isDetailsCollapsed ? 'closed' : 'open',
            wasDetailsTouched: wasDetailsTouched ? 'yes' : 'no',
          }
          await sendDrilldownLog({
            dataForLog: swapDetails,
            extraFields: {
              detailsCollapsedState: swapDetails.detailsCollapsedState,
              feeUsd: swapDetails.feeUsd,
              chainId: swapDetails.chainId,
              wasDetailsTouched: swapDetails.wasDetailsTouched,
              recipient: swapDetails.recipient,
            },
            logLevel: 'info',
          })
        }

        setStepStates({
          source: StepState.Success,
          bridge: StepState.Pending,
          dest: StepState.NotStarted,
        })
      } catch (error) {
        if (
          error instanceof SvmTransactionFailedError ||
          error instanceof TransactionReceiptRevertedError ||
          error instanceof TransactionReplacedError
        ) {
          const trade = routeRef.current
          sendAnalyticsEvent(SwapEventName.XSWAP_SRC_TRANSACTION_FAILED, {
            txHash: hash,
            address,
            src_chain_id: trade?.amountIn?.currency?.chainId,
            dst_chain_id: trade?.amountOut?.currency?.chainId,
          })
        }

        logger.error(error, {
          location: 'CrossChainSwapTradeReviewDialog',
          action: 'waitForReceipt',
        })

        setStepStates({
          source: StepState.Failed,
          bridge: StepState.NotStarted,
          dest: StepState.NotStarted,
        })
      } finally {
        refetchBalances(chainId0)
        setTradeId(nanoid())
        resetDetailsTrackedState()
      }
    },
    [
      trace,
      setStepStates,
      setSwapAmount,
      chainId0,
      chainId1,
      address,
      routeRef,
      groupTs,
      waitForReceipt,
      refetchBalances,
      setTradeId,
      resetDetailsTrackedState,
      feeData,
      prices,
      isDetailsCollapsed,
      wasDetailsTouched,
    ],
  )

  const onWriteError = useCallback(
    (error: Error) => {
      console.log(error)

      setStepStates({
        source: StepState.Failed,
        bridge: StepState.NotStarted,
        dest: StepState.NotStarted,
      })

      if (shouldIgnoreWriteError?.(error)) {
        return
      }

      logger.error(error, {
        location: 'CrossChainSwapTradeReviewDialog',
        action: 'writeError',
      })
      createErrorToast(error.message, false)

      sendAnalyticsEvent(SwapEventName.XSWAP_ERROR, {
        error: error instanceof Error ? error.message : undefined,
      })
    },
    [setStepStates, shouldIgnoreWriteError],
  )

  return {
    onWriteSuccess,
    onWriteError,
  }
}
