import { useSlippageTolerance, useTrade as _useTrade } from '@sushiswap/react-query'
import { useFeeData } from 'wagmi'
import { useSwapState } from '../ui/trade/TradeProvider'

export const useTrade = () => {
  const { token0, token1, network0, amount, recipient } = useSwapState()

  const { data: slippageTolerance } = useSlippageTolerance()
  const { data: feeData } = useFeeData()

  return _useTrade({
    chainId: network0,
    fromToken: token0,
    toToken: token1,
    amount: amount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice?.toNumber(),
    recipient,
  })
}
