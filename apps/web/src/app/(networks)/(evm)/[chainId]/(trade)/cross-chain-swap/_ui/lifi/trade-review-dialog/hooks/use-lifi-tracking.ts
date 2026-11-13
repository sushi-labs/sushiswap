import { createInfoToast, createToast } from '@sushiswap/notifications'
import { SwapEventName, sendAnalyticsEvent } from '@sushiswap/telemetry'
import { useCallback, useEffect, useRef } from 'react'
import type { LifiXSwapSupportedChainId } from 'src/config'
import { waitForSvmSignature } from 'src/lib/svm/wait-for-svm-signature'
import { useLiFiStatus } from 'src/lib/swap/cross-chain'
import { getChainById } from 'sushi'
import { type EvmChainId, isEvmChainId } from 'sushi/evm'
import { isSvmChainId } from 'sushi/svm'
import { usePublicClient } from 'wagmi'
import { useRefetchBalances } from '~evm/_common/ui/balance-provider/use-refetch-balances'
import { StepState } from '../../confirmation-dialog'
import type { UseLifiXSwapSelectedTradeRouteReturn } from '../../xswap-provider'

export interface LifiTrackingStepStates {
  source: StepState
  bridge: StepState
  dest: StepState
}

export function useLifiTracking<
  TChainId0 extends LifiXSwapSupportedChainId,
  TChainId1 extends LifiXSwapSupportedChainId,
>({
  tradeId,
  hash,
  route,
  chainId0,
  chainId1,
  account,
  groupTimestamp,
  sourceState,
  reset,
  setStepStates,
  enabled,
  effectsEnabled = true,
}: {
  tradeId: string
  hash: TxHashFor<TChainId0> | undefined
  route: UseLifiXSwapSelectedTradeRouteReturn<TChainId0, TChainId1> | null
  chainId0: TChainId0
  chainId1: TChainId1
  account: WalletAddressFor<TChainId0> | undefined
  groupTimestamp: number | undefined
  sourceState: StepState
  reset(): void
  setStepStates?(states: LifiTrackingStepStates): void
  enabled: boolean
  effectsEnabled?: boolean
}): ReturnType<typeof useLiFiStatus<TChainId0, TChainId1>>['data'] {
  const { data: lifiData } = useLiFiStatus<TChainId0, TChainId1>({
    tradeId,
    txHash: hash,
    enabled,
  })
  const evmClient = usePublicClient({
    chainId: isEvmChainId(chainId1) ? chainId1 : undefined,
  })
  const { refetchChain } = useRefetchBalances()
  const destinationNotified = useRef<TxHashFor<TChainId1> | undefined>(
    undefined,
  )
  const bridgeNotified = useRef<string | undefined>(undefined)
  const waitForSignature = useCallback(
    async (txHash: TxHashFor<TChainId1>) => {
      if (isSvmChainId(chainId1)) return waitForSvmSignature(txHash)
      return evmClient.waitForTransactionReceipt({
        hash: txHash as TxHashFor<EvmChainId>,
      })
    },
    [evmClient, chainId1],
  )

  useEffect(() => {
    const txHash = lifiData?.receiving?.txHash
    if (
      !effectsEnabled ||
      !groupTimestamp ||
      !txHash ||
      !route ||
      destinationNotified.current === txHash
    )
      return
    destinationNotified.current = txHash

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

    const promise = waitForSignature(txHash)
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
      account,
      type: 'swap',
      chainId: chainId1,
      txHash,
      promise,
      summary,
      timestamp: new Date().getTime(),
      groupTimestamp,
    })
  }, [
    lifiData?.receiving?.txHash,
    effectsEnabled,
    groupTimestamp,
    route,
    account,
    chainId1,
    refetchChain,
    reset,
    waitForSignature,
  ])

  useEffect(() => {
    if (!setStepStates || lifiData?.status !== 'DONE') return
    if (lifiData.substatus === 'COMPLETED') {
      setStepStates({
        source: StepState.Success,
        bridge: StepState.Success,
        dest: StepState.Success,
      })
    }
    if (lifiData.substatus === 'PARTIAL') {
      setStepStates({
        source: StepState.Success,
        bridge: StepState.Success,
        dest: StepState.PartialSuccess,
      })
    }
  }, [lifiData?.status, lifiData?.substatus, setStepStates])

  useEffect(() => {
    if (
      !effectsEnabled ||
      !lifiData?.lifiExplorerLink ||
      !groupTimestamp ||
      sourceState !== StepState.Success ||
      bridgeNotified.current === lifiData.lifiExplorerLink
    )
      return
    bridgeNotified.current = lifiData.lifiExplorerLink

    void createInfoToast({
      account,
      type: 'xswap',
      chainId: chainId0,
      href: lifiData.lifiExplorerLink,
      summary: `Bridging ${route?.fromToken?.symbol} from ${
        getChainById(chainId0).name
      } to ${getChainById(chainId1)?.name}`,
      timestamp: new Date().getTime(),
      groupTimestamp,
    })
  }, [
    lifiData?.lifiExplorerLink,
    effectsEnabled,
    groupTimestamp,
    sourceState,
    account,
    chainId0,
    chainId1,
    route,
  ])

  return lifiData
}
