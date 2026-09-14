'use client'

import { type ReactElement, type ReactNode, useMemo } from 'react'
import { useSvmTradeQuote } from 'src/lib/hooks/react-query/trade/use-svm-trade-quote'
import { useSlippageTolerance } from 'src/lib/hooks/use-slippage-tolerance'
import { ZERO } from 'sushi'
import { type SvmChainId, isSvmChainId } from 'sushi/svm'
import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'
import { SimpleSwapTradeQuoteContext } from './simple-swap-trade-quote-context'

export function SvmSimpleSwapTradeQuoteProvider({
  children,
}: { children: ReactNode }): ReactElement {
  const quote = useQuote()
  const value = useMemo(() => ({ namespace: 'svm' as const, quote }), [quote])
  return (
    <SimpleSwapTradeQuoteContext.Provider value={value}>
      {children}
    </SimpleSwapTradeQuoteContext.Provider>
  )
}

function useQuote(): ReturnType<typeof useSvmTradeQuote> {
  const { state } = useDerivedStateSimpleSwap<SvmChainId>()

  const [slippagePercent] = useSlippageTolerance(
    state.slippageToleranceOptions?.storageKey,
    state.slippageToleranceOptions?.defaultValue,
  )

  const params = useMemo(() => {
    if (isSvmChainId(state.chainId)) {
      return {
        chainId: state.chainId,
        fromToken: state.token0,
        toToken: state.token1,
        amount: state.swapAmount,
        slippagePercentage: slippagePercent.toString({ fixed: 2 }),
        recipient: state.recipient,
        enabled: Boolean(state.swapAmount?.gt(ZERO)),
      }
    }

    return undefined
  }, [state, slippagePercent])

  return useSvmTradeQuote(params)
}
