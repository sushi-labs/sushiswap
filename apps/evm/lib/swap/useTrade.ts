import { useSlippageTolerance } from '@sushiswap/hooks'
import { useTrade as useApiTrade } from '@sushiswap/react-query'
import { isSushiXSwapChainId, SushiXSwapChainId } from '@sushiswap/sushixswap'
import { useFeeData } from '@sushiswap/wagmi'
import { useClientTrade } from '@sushiswap/wagmi/future/hooks'
import { useSignature } from '@sushiswap/wagmi/future/systems/Checker/Provider'
import { log } from 'next-axiom'
import { useMemo } from 'react'

import { useSwapActions, useSwapState } from '../../ui/swap/trade/TradeProvider'
import { APPROVE_XSWAP_TAG } from '../../ui/swap/widget/SwapButtonCrossChain'
import { useCarbonOffset } from './useCarbonOffset'
import { useCrossChainTrade } from './useCrossChainTrade/useCrossChainTrade'

type ObjectType<T> = T extends true ? ReturnType<typeof useCrossChainTrade> : ReturnType<typeof useApiTrade>

export function useTrade<T extends boolean>({
  crossChain,
  enabled = true,
}: {
  crossChain: T
  enabled?: boolean
}): ObjectType<T> {
  const { value, token0, token1, network0, network1, amount, recipient, tradeId, isFallback } = useSwapState()
  const { setFallback } = useSwapActions()
  const [slippageTolerance] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()
  const { signature } = useSignature(APPROVE_XSWAP_TAG)

  const { data: feeData } = useFeeData({ chainId: network0 })

  const sameChainApiTrade = useApiTrade({
    chainId: network0,
    fromToken: token0,
    toToken: token1,
    amount: amount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice || undefined,
    recipient,
    enabled: Boolean(enabled && !crossChain && network0 === network1 && !isFallback && value),
    carbonOffset,
    onError: () => {
      log.error('api trade error')
      setFallback(true)
    },
  })

  const sameChainClientTrade = useClientTrade({
    chainId: network0,
    fromToken: token0,
    toToken: token1,
    amount: amount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice || undefined,
    recipient,
    enabled: Boolean(enabled && !crossChain && network0 === network1 && isFallback && value),
    carbonOffset,
    onError: () => {
      log.error('client trade error')
    },
  })

  const crossChainTrade = useCrossChainTrade({
    tradeId,
    network0: network0 as SushiXSwapChainId,
    network1: network1 as SushiXSwapChainId,
    token0,
    token1,
    amount: amount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    recipient,
    enabled: Boolean(
      enabled &&
        crossChain &&
        network0 !== network1 &&
        isSushiXSwapChainId(network0) &&
        isSushiXSwapChainId(network1) &&
        value
    ),
    bentoboxSignature: signature,
  })

  return useMemo(() => {
    if (network0 !== network1) return crossChainTrade
    return isFallback ? sameChainClientTrade : sameChainApiTrade
  }, [crossChainTrade, isFallback, network0, network1, sameChainApiTrade, sameChainClientTrade]) as ObjectType<T>
}
