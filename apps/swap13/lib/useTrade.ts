import { useSlippageTolerance, useTrade as _useTrade } from '@sushiswap/react-query'
import { useBlockNumber, useFeeData } from 'wagmi'
import { useSwapState } from '../ui/TradeProvider'

export const useTrade = () => {
  const { token0, token1, network0, valueAsAmount } = useSwapState()
  const { data: slippageTolerance } = useSlippageTolerance()
  const { data } = useFeeData()
  const { data: blockNumber } = useBlockNumber({ chainId: network0, watch: true })
  return _useTrade({
    chainId: network0,
    fromToken: token0,
    toToken: token1,
    amount: valueAsAmount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: data?.gasPrice?.toNumber(),
    blockNumber,
  })
}
