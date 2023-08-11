import { useSlippageTolerance } from '@sushiswap/hooks'
import { ZERO } from '@sushiswap/math'
import { useTrade as useApiTrade } from '@sushiswap/react-query'
import { useAccount, useFeeData } from '@sushiswap/wagmi'
import { useClientTrade } from '@sushiswap/wagmi/future/hooks'
import { useState } from 'react'
import { useDerivedStateSimpleSwap } from 'ui/swap/simple/derivedstate-simpleswap-provider'

import { useCarbonOffset } from './useCarbonOffset'

export const useSimpleSwapTrade = () => {
  const [isFallback, setIsFallback] = useState(false)
  const { address } = useAccount()
  const {
    state: { token0, chainId, swapAmount, token1 },
  } = useDerivedStateSimpleSwap()

  const [slippageTolerance] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()
  const { data: feeData } = useFeeData({ chainId })

  const apiTrade = useApiTrade({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice?.toNumber(),
    recipient: address,
    enabled: Boolean(!isFallback && swapAmount?.greaterThan(ZERO)),
    carbonOffset,
    onError: () => setIsFallback(true),
  })

  const clientTrade = useClientTrade({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage: slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance,
    gasPrice: feeData?.gasPrice?.toNumber(),
    recipient: address,
    enabled: Boolean(isFallback && swapAmount?.greaterThan(ZERO)),
    carbonOffset,
  })

  return (isFallback ? clientTrade : apiTrade) as ReturnType<typeof useApiTrade>
}
