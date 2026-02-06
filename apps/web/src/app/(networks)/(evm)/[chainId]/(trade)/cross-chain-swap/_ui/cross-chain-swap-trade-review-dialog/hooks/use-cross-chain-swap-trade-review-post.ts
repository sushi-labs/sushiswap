import { createInfoToast, createToast } from '@sushiswap/notifications'
import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { useCallback, useEffect, useMemo } from 'react'
import type { XSwapSupportedChainId } from 'src/config'
import { nativeFromChainId } from 'src/lib/currency-from-chain-id'
import { waitForSvmSignature } from 'src/lib/svm/wait-for-svm-signature'
import {
  getCrossChainFeesBreakdown,
  useLiFiStatus,
} from 'src/lib/swap/cross-chain'
import { warningSeverity } from 'src/lib/swap/warningSeverity'
import { SLIPPAGE_WARNING_THRESHOLD } from 'src/lib/wagmi/systems/Checker/slippage'
import { useAccount } from 'src/lib/wallet'
import { Amount, getChainById } from 'sushi'
import { type EvmChainId, isEvmChainId } from 'sushi/evm'
import { isSvmChainId } from 'sushi/svm'
import { usePublicClient } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { StepState } from '../../cross-chain-swap-confirmation-dialog'
import { useDerivedStateCrossChainSwap } from '../../derivedstate-cross-chain-swap-provider'
import type {
  CrossChainSwapTradeReviewBase,
  CrossChainSwapTradeReviewWithWarnings,
} from '../types'

export function useCrossChainSwapTradeReviewPost<
  TChainId0 extends XSwapSupportedChainId,
  TChainId1 extends XSwapSupportedChainId,
>(
  tradeReview: CrossChainSwapTradeReviewBase<TChainId0, TChainId1>,
): CrossChainSwapTradeReviewWithWarnings<TChainId0, TChainId1> {
  const {
    state: { token1, chainId0, chainId1, tradeId },
  } = useDerivedStateCrossChainSwap<TChainId0, TChainId1>()
  const address = useAccount(chainId0)

  const { tracking, step } = tradeReview
  const { groupTs, reset } = tracking
  const trackingEnabled = Boolean(tradeId && tradeReview.hash)

  const { data: lifiData } = useLiFiStatus<TChainId0, TChainId1>({
    tradeId,
    txHash: tradeReview.hash,
    enabled: trackingEnabled,
  })

  const evmClient = usePublicClient({
    chainId:
      chainId1 !== undefined && isEvmChainId(chainId1) ? chainId1 : undefined,
  })

  const waitForSignature = useCallback(
    async (txHash: TxHashFor<TChainId1>) => {
      if (isSvmChainId(chainId1)) {
        return waitForSvmSignature(txHash)
      }

      return evmClient.waitForTransactionReceipt({
        hash: txHash as TxHashFor<EvmChainId>,
      })
    },
    [evmClient, chainId1],
  )

  const { refetchChain } = useRefetchBalances()

  //biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const txHash = lifiData?.receiving?.txHash
    const route = tradeReview.routeRef.current

    if (!chainId1 || !groupTs.current || !txHash || !route) return

    const destinationChainName =
      (getChainById(route.toChainId) as { name?: string } | undefined)?.name ??
      'Destination chain'

    const summary =
      route.step?.includedStepsWithoutFees?.[1]?.type === 'swap' ||
      route.step?.includedStepsWithoutFees?.[2]?.type === 'swap'
        ? {
            pending: `Swapping ${
              route.step?.includedStepsWithoutFees[2]?.action.fromToken?.symbol
            } to ${route.amountOut?.toSignificant(
              6,
            )} ${route.amountOut?.currency.symbol}`,
            completed: `Swapped ${
              route.step?.includedStepsWithoutFees[2]?.action.fromToken?.symbol
            } to ${route.amountOut?.toSignificant(
              6,
            )} ${route.amountOut?.currency.symbol}`,
            failed: `Something went wrong when trying to swap ${
              route.step?.includedStepsWithoutFees[2]?.action.fromToken?.symbol
            } to ${route.amountOut?.toSignificant(
              6,
            )} ${route.amountOut?.currency.symbol}`,
          }
        : {
            pending: `Receiving ${route.amountOut?.toSignificant(6)} ${
              route.amountOut?.currency.symbol
            } on ${destinationChainName}`,
            completed: `Received ${route.amountOut?.toSignificant(6)} ${
              route.amountOut?.currency.symbol
            } on ${destinationChainName}`,
            failed: `Something went wrong when trying to receive ${route.amountOut?.toSignificant(
              6,
            )} ${route.amountOut?.currency.symbol} on ${destinationChainName}`,
          }

    const waitPromise = waitForSignature(txHash)

    const promise = waitPromise
      .catch((error) => {
        sendAnalyticsEvent(SwapEventName.XSWAP_DST_TRANSACTION_FAILED, {
          chain_id: chainId1,
          txHash,
          error: error instanceof Error ? error.message : undefined,
        })
        throw error
      })
      .then(() => {
        sendAnalyticsEvent(SwapEventName.XSWAP_DST_TRANSACTION_COMPLETED, {
          chain_id: chainId1,
          txHash,
        })
        refetchChain(chainId1)
      })
      .then(reset)

    void createToast({
      account: address,
      type: 'swap',
      chainId: chainId1,
      txHash,
      promise,
      summary,
      timestamp: new Date().getTime(),
      groupTimestamp: groupTs.current,
    })
  }, [lifiData?.receiving?.txHash])

  useEffect(() => {
    if (lifiData?.status !== 'DONE') return

    if (lifiData?.substatus === 'COMPLETED') {
      tracking.setStepStates({
        source: StepState.Success,
        bridge: StepState.Success,
        dest: StepState.Success,
      })
    }

    if (lifiData?.substatus === 'PARTIAL') {
      tracking.setStepStates({
        source: StepState.Success,
        bridge: StepState.Success,
        dest: StepState.PartialSuccess,
      })
    }
  }, [lifiData?.status, lifiData?.substatus, tracking.setStepStates])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      !lifiData?.lifiExplorerLink ||
      !groupTs.current ||
      tradeReview.stepStates.source !== StepState.Success ||
      !chainId0 ||
      !chainId1
    ) {
      return
    }

    void createInfoToast({
      account: address,
      type: 'xswap',
      chainId: chainId0,
      href: lifiData.lifiExplorerLink,
      summary: `Bridging ${tradeReview.routeRef?.current?.fromToken?.symbol} from ${
        getChainById(chainId0 as XSwapSupportedChainId).name
      } to ${getChainById(chainId1 as XSwapSupportedChainId)?.name}`,
      timestamp: new Date().getTime(),
      groupTimestamp: groupTs.current,
    })
  }, [lifiData?.lifiExplorerLink])

  const { showPriceImpactWarning } = useMemo(() => {
    const priceImpactSeverity = warningSeverity(tradeReview.step?.priceImpact)
    return {
      showPriceImpactWarning: priceImpactSeverity > 3,
      priceImpactSeverity,
    }
  }, [tradeReview.step?.priceImpact])

  const showSlippageWarning = useMemo(() => {
    return !tradeReview.slippagePercent.lt(SLIPPAGE_WARNING_THRESHOLD)
  }, [tradeReview.slippagePercent])

  const { data: price, isLoading: isPriceLoading } = usePrice({
    chainId: token1?.chainId,
    address: token1?.wrap().address,
  })

  const amountOutUSD = useMemo(() => {
    const amountOut = tradeReview.step?.amountOut
    if (!price || !amountOut) return undefined

    return `${(
      (price * Number(amountOut.amount)) / 10 ** amountOut.currency.decimals
    ).toFixed(2)}`
  }, [price, tradeReview.step?.amountOut])

  const amountOutMinUSD = useMemo(() => {
    const amountOutMin = tradeReview.step?.amountOutMin
    if (!price || !amountOutMin) return undefined

    return `${(
      (price * Number(amountOutMin.amount)) /
        10 ** amountOutMin.currency.decimals
    ).toFixed(2)}`
  }, [price, tradeReview.step?.amountOutMin])

  const { executionDuration, feesBreakdown, totalFeesUSD, chainId0Fees } =
    useMemo(() => {
      if (!step)
        return {
          executionDuration: undefined,
          feesBreakdown: undefined,
          gasFeesUSD: undefined,
          protocolFeesUSD: undefined,
          totalFeesUSD: undefined,
        }

      const executionDurationSeconds = step.estimate.executionDuration
      const executionDurationMinutes = Math.floor(executionDurationSeconds / 60)

      const executionDuration =
        executionDurationSeconds < 60
          ? `${executionDurationSeconds} seconds`
          : `${executionDurationMinutes} minutes`

      const { feesBreakdown, totalFeesUSD } = getCrossChainFeesBreakdown([step])

      const chainId0Fees = (
        feesBreakdown.gas.get(chainId0)?.amount ??
        new Amount(nativeFromChainId(chainId0), 0)
      )
        .add(
          feesBreakdown.protocol.get(chainId0)?.amount ??
            new Amount(nativeFromChainId(chainId0), 0),
        )
        .toString()

      return {
        executionDuration,
        feesBreakdown,
        totalFeesUSD,
        chainId0Fees,
      }
    }, [chainId0, step])

  return {
    ...tradeReview,
    executionDuration,
    feesBreakdown,
    totalFeesUSD,
    chainId0Fees,
    lifiData,
    amountOutUSD,
    amountOutMinUSD,
    price,
    isPriceLoading,
    showPriceImpactWarning,
    showSlippageWarning,
  }
}
