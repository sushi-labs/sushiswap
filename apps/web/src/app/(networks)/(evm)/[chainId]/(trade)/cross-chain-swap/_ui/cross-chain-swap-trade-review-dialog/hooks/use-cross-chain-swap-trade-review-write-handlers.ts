import { createErrorToast, createToast } from '@sushiswap/notifications'
import {
  SwapEventName,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import { nanoid } from 'nanoid'
import { useCallback, useMemo } from 'react'
import type { Dispatch, RefObject, SetStateAction } from 'react'
import type { XSwapSupportedChainId } from 'src/config'
import { sendDrilldownLog } from 'src/lib/drilldown-log'
import type { UseCrossChainTradeStepReturn } from 'src/lib/hooks/react-query'
import { logger } from 'src/lib/logger'
import { getCrossChainFeesBreakdown } from 'src/lib/swap/cross-chain'
import { useAccount } from 'src/lib/wallet'
import { Amount, getChainById } from 'sushi'
import { useDetailsInteractionTracker } from '~evm/[chainId]/(trade)/_ui/details-interaction-tracker-provider'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { StepState } from '../../cross-chain-swap-confirmation-dialog'
import {
  type UseSelectedCrossChainTradeRouteReturn,
  useDerivedStateCrossChainSwap,
} from '../../derivedstate-cross-chain-swap-provider'

export type CrossChainSwapWriteReceiptInfo = {
  status: 'success' | 'failed'
}

export type CrossChainSwapTradeReviewWriteHandlersParams<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
  TReceipt,
> = {
  routeRef: RefObject<UseSelectedCrossChainTradeRouteReturn<
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
  waitForReceipt: (hash: TxHashFor<TChainId0>) => Promise<TReceipt>
  getReceiptInfo: (receipt: TReceipt) => CrossChainSwapWriteReceiptInfo
  step: UseCrossChainTradeStepReturn<TChainId0, TChainId1> | undefined
  shouldIgnoreWriteError?: (error: Error) => boolean
}

export function useCrossChainSwapTradeReviewWriteHandlers<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
  TReceipt,
>({
  routeRef,
  groupTs,
  setStepStates,
  waitForReceipt,
  getReceiptInfo,
  step,
  shouldIgnoreWriteError,
}: CrossChainSwapTradeReviewWriteHandlersParams<
  TChainId0,
  TChainId1,
  TReceipt
>) {
  const {
    state: { chainId0, chainId1 },
    mutate: { setSwapAmount, setTradeId },
  } = useDerivedStateCrossChainSwap<TChainId0, TChainId1>()
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
        ? getChainById(routeRef.current.toChainId as XSwapSupportedChainId).name
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
                  routeRef?.current?.step?.includedStepsWithoutFees?.[0]?.action
                    .toToken.symbol
                }`,
                completed: `Swapped ${routeRef?.current?.amountIn?.toSignificant(
                  6,
                )} ${
                  routeRef?.current?.amountIn?.currency.symbol
                } to bridge token ${
                  routeRef?.current?.step?.includedStepsWithoutFees?.[0]?.action
                    .toToken.symbol
                }`,
                failed: `Something went wrong when trying to swap ${
                  routeRef?.current?.amountIn?.currency.symbol
                } to bridge token`,
              },
        timestamp: groupTs.current,
        groupTimestamp: groupTs.current,
      })

      try {
        const receipt = await receiptPromise
        const trade = routeRef.current
        const receiptInfo = getReceiptInfo(receipt)

        if (receiptInfo.status === 'success') {
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
                  .address as AddressFor<TChainId0>,
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
              feeUsd: feeData?.uiFeesUSD
                ? feeData?.uiFeesUSD.toString()
                : 'N/A',
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
        } else {
          sendAnalyticsEvent(SwapEventName.XSWAP_SRC_TRANSACTION_FAILED, {
            txHash: hash,
            address,
            src_chain_id: trade?.amountIn?.currency?.chainId,
            dst_chain_id: trade?.amountOut?.currency?.chainId,
          })

          setStepStates({
            source: StepState.Failed,
            bridge: StepState.NotStarted,
            dest: StepState.NotStarted,
          })
        }

        setStepStates({
          source: StepState.Success,
          bridge: StepState.Pending,
          dest: StepState.NotStarted,
        })
      } catch (error) {
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
      getReceiptInfo,
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
