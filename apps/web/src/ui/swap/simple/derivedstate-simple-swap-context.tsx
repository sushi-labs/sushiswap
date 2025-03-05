'use client'

import { createContext, useContext } from 'react'
import { useTrade, useTradeQuote } from 'src/lib/hooks/react-query'
import { useSlippageTolerance } from 'src/lib/hooks/useSlippageTolerance'
import type { EvmChainId } from 'sushi/chain'
import type { Amount, Type } from 'sushi/currency'
import { type Percent, ZERO } from 'sushi/math'
import type { Address } from 'viem'
import { useGasPrice } from 'wagmi'
import { useCarbonOffset } from '../../../lib/swap/useCarbonOffset'

interface State {
  mutate: {
    setToken0(token0: Type | string): void
    setToken1(token1: Type | string): void
    setTokens(token0: Type | string, token1: Type | string): void
    setSwapAmount(swapAmount: string): void
    switchTokens(): void
    setTokenTax(tax: Percent | false | undefined): void
  }
  state: {
    token0: Type | undefined
    token1: Type | undefined
    chainId: EvmChainId
    swapAmountString: string
    swapAmount: Amount<Type> | undefined
    recipient: string | undefined
    tokenTax: Percent | false | undefined
  }
  isLoading: boolean
  isToken0Loading: boolean
  isToken1Loading: boolean
}

export const DerivedStateSimpleSwapContext = createContext<State>({} as State)

export const useDerivedStateSimpleSwap = () => {
  const context = useContext(DerivedStateSimpleSwapContext)
  if (!context) {
    throw new Error(
      'Hook can only be used inside Simple Swap Derived State Context',
    )
  }

  return context
}

export const useSimpleSwapTrade = (enabled = true) => {
  const {
    state: { token0, chainId, swapAmount, token1, recipient },
  } = useDerivedStateSimpleSwap()

  const [slippagePercent] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()
  const { data: gasPrice } = useGasPrice({ chainId })

  const trade = useTrade({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage: slippagePercent.toFixed(2),
    gasPrice,
    recipient: recipient as Address,
    enabled: Boolean(enabled && swapAmount?.greaterThan(ZERO)),
    carbonOffset,
  })

  return trade
}

export const useSimpleSwapTradeQuote = () => {
  const {
    state: { token0, chainId, swapAmount, token1, recipient },
  } = useDerivedStateSimpleSwap()

  const [slippagePercent] = useSlippageTolerance()
  const [carbonOffset] = useCarbonOffset()
  const { data: gasPrice } = useGasPrice({ chainId })

  const quote = useTradeQuote({
    chainId,
    fromToken: token0,
    toToken: token1,
    amount: swapAmount,
    slippagePercentage: slippagePercent.toFixed(2),
    gasPrice,
    recipient: recipient as Address,
    enabled: Boolean(swapAmount?.greaterThan(ZERO)),
    carbonOffset,
  })

  return quote
}
