'use client'

import { createContext, useContext } from 'react'
import type { useSvmTradeQuote } from 'src/lib/hooks/react-query/trade/use-svm-trade-quote'
import type { CombinedEvmTradeQueryResult } from 'src/lib/swap/direct-pool'

type SvmTradeQuote = ReturnType<typeof useSvmTradeQuote>
type SimpleSwapTradeQuoteState =
  | { namespace: 'evm'; quote: CombinedEvmTradeQueryResult }
  | { namespace: 'svm'; quote: SvmTradeQuote }

export const SimpleSwapTradeQuoteContext = createContext<
  SimpleSwapTradeQuoteState | undefined
>(undefined)

function useSimpleSwapTradeQuoteContext(): SimpleSwapTradeQuoteState {
  const context = useContext(SimpleSwapTradeQuoteContext)
  if (!context) {
    throw new Error(
      'Swap quote hooks must be used inside a simple swap runtime',
    )
  }
  return context
}

export function useSimpleSwapTradeQuote(): SimpleSwapTradeQuoteState['quote'] {
  return useSimpleSwapTradeQuoteContext().quote
}

export function useEvmSimpleSwapTradeQuote(): CombinedEvmTradeQueryResult {
  const context = useSimpleSwapTradeQuoteContext()
  if (context.namespace !== 'evm') {
    throw new Error('useEvmSimpleSwapTradeQuote is EVM-only')
  }
  return context.quote
}

export function useSvmSimpleSwapTradeQuote(): SvmTradeQuote {
  const context = useSimpleSwapTradeQuoteContext()
  if (context.namespace !== 'svm') {
    throw new Error('useSvmSimpleSwapTradeQuote is SVM-only')
  }
  return context.quote
}
