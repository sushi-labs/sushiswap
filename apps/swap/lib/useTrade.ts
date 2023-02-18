import { useTrade as _useTrade } from '@sushiswap/react-query'
import { useFeeData } from 'wagmi'
import { useSwapState } from '../ui/trade/TradeProvider'
import { useSlippageTolerance } from './useSlippageTolerance'
import { useCarbonOffset } from './useCarbonOffset'
import { useCrossChainTrade } from './useCrossChainTrade/useCrossChainTrade'
import { useMemo } from 'react'

type ObjectType<T> = T extends true ? ReturnType<typeof useCrossChainTrade> : ReturnType<typeof _useTrade>

export function useTrade<T extends boolean>({ crossChain }: { crossChain: T }): ObjectType<T> {
  const { token0, token1, network0, network1, amount, recipient, bentoboxSignature } = useSwapState()
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
    network0,
    network1,
    token0,
    token1,
    amount: amount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    recipient,
    enabled: crossChain && network0 !== network1,
    bentoboxSignature,
  })

  return useMemo(() => {
    if (crossChain) return crossChainTrade
    return sameChainTrade
  }, [crossChain, crossChainTrade, sameChainTrade]) as ObjectType<T>
}
