import { useTrade as _useTrade } from '@sushiswap/react-query'
import { useFeeData } from '@sushiswap/wagmi'
import { useSwapActions, useSwapState } from '../ui/trade/TradeProvider'
import { useCarbonOffset } from './useCarbonOffset'
import { useCrossChainTrade } from './useCrossChainTrade/useCrossChainTrade'
import { useMemo } from 'react'
import { isSushiXSwapChainId, SushiXSwapChainId } from '@sushiswap/sushixswap'
import { useClientTrade } from '@sushiswap/wagmi/future/hooks'
import { useSlippageTolerance } from '@sushiswap/hooks'

type ObjectType<T> = T extends true ? ReturnType<typeof useCrossChainTrade> : ReturnType<typeof _useTrade>

export function useTrade<T extends boolean>({ crossChain }: { crossChain: T }): ObjectType<T> {
  const { token0, token1, network0, network1, amount, recipient, bentoboxSignature, tradeId, isFallback } =
    useSwapState()
  const { setFallback } = useSwapActions()
  const [slippageTolerance] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()

  const { data: feeData } = useFeeData({ chainId: network0 })
  const sameChainTrade = _useTrade({
    chainId: network0,
    fromToken: token0,
    toToken: token1,
    amount: amount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice?.toNumber(),
    recipient,
    enabled: !crossChain && network0 === network1 && !isFallback,
    carbonOffset,
    onError: () => setFallback(true),
  })

  const sameChainTradeFallback = useClientTrade({
    chainId: network0,
    fromToken: token0,
    toToken: token1,
    amount: amount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice?.toNumber(),
    recipient,
    enabled: isFallback,
    carbonOffset,
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
    enabled: crossChain && network0 !== network1 && isSushiXSwapChainId(network0) && isSushiXSwapChainId(network1),
    bentoboxSignature,
  })

  return useMemo(() => {
    if (network0 !== network1) return crossChainTrade
    return isFallback ? sameChainTradeFallback : sameChainTrade
  }, [crossChainTrade, isFallback, network0, network1, sameChainTrade, sameChainTradeFallback]) as ObjectType<T>
}
