import { useTrade as _useTrade } from '@sushiswap/react-query'
import { useFeeData } from 'wagmi'
import { useSwapState } from '../ui/trade/TradeProvider'
import { useSlippageTolerance } from './useSlippageTolerance'
import { useCarbonOffset } from './useCarbonOffset'
import { useCrossChainTrade } from './useCrossChainTrade/useCrossChainTrade'
import { useMemo } from 'react'
import { isSushiXSwapChainId, SushiXSwapChainId } from '@sushiswap/sushixswap'

type ObjectType<T> = T extends true ? ReturnType<typeof useCrossChainTrade> : ReturnType<typeof _useTrade>

export function useTrade<T extends boolean>({ crossChain }: { crossChain: T }): ObjectType<T> {
  const { token0, token1, network0, network1, amount, recipient, bentoboxSignature, tradeId } = useSwapState()
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
    enabled: !crossChain && network0 === network1,
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
    return sameChainTrade
  }, [crossChainTrade, network0, network1, sameChainTrade]) as ObjectType<T>
}
