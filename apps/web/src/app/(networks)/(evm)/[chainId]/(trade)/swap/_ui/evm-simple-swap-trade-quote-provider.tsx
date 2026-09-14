'use client'

import { type ReactElement, type ReactNode, useMemo } from 'react'
import { useEvmTradeQuote } from 'src/lib/hooks/react-query/trade/use-evm-trade-quote'
import {
  type CombinedEvmTradeQueryResult,
  combineEvmTradeQueries,
  useDirectPoolTradeQuote,
} from 'src/lib/swap/direct-pool'
import { SimpleSwapTradeQuoteContext } from './simple-swap-trade-quote-context'
import { useEvmSimpleSwapTradeParams } from './use-evm-simple-swap-trade-params'

export function EvmSimpleSwapTradeQuoteProvider({
  children,
}: { children: ReactNode }): ReactElement {
  const quote = useQuote()
  const value = useMemo(() => ({ namespace: 'evm' as const, quote }), [quote])
  return (
    <SimpleSwapTradeQuoteContext.Provider value={value}>
      {children}
    </SimpleSwapTradeQuoteContext.Provider>
  )
}

function useQuote(): CombinedEvmTradeQueryResult {
  const params = useEvmSimpleSwapTradeParams()
  const aggregatorQuote = useEvmTradeQuote(params)
  const directPoolQuote = useDirectPoolTradeQuote(params)

  return combineEvmTradeQueries(
    aggregatorQuote,
    directPoolQuote,
    Boolean(params.directPool),
  )
}
