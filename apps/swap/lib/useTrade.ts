import { useTrade as _useTrade } from '@sushiswap/react-query'
import { useFeeData } from 'wagmi'
import { useSwapState } from '../ui/trade/TradeProvider'
import { useCrossChainTrade } from './useCrossChainTrade'
import { useSlippageTolerance } from './useSlippageTolerance'
import { useCarbonOffset } from './useCarbonOffset'

export const useTrade = () => {
  const { token0, token1, network0, network1, amount, recipient } = useSwapState()
  const [slippageTolerance] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()

  const { data: feeData } = useFeeData()
  const sameChainTrade = _useTrade({
    chainId: network0,
    fromToken: token0,
    toToken: token1,
    amount: amount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice?.toNumber(),
    recipient,
    enabled: network0 === network1,
    carbonOffset,
  })

  const crossChainTrade = useCrossChainTrade({
    chainId: network0,
    fromToken: token0,
    toToken: token1,
    amount: amount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice?.toNumber(),
    recipient,
    enabled: network0 !== network1,
    carbonOffset,
  })

  if (network0 === network1) return sameChainTrade
  return crossChainTrade
}
