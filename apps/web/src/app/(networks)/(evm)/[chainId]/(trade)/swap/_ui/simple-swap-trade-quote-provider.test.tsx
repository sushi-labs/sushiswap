/** @vitest-environment jsdom */

import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it } from 'vitest'
import {
  SimpleSwapTradeQuoteContext,
  useEvmSimpleSwapTradeQuote,
  useSimpleSwapTradeQuote,
  useSvmSimpleSwapTradeQuote,
} from './simple-swap-trade-quote-context'

const queryClients: QueryClient[] = []

function createQuote(fee: string) {
  const client = new QueryClient({
    defaultOptions: { queries: { gcTime: Number.POSITIVE_INFINITY } },
  })
  queryClients.push(client)
  const trade = {
    fee,
    amountIn: undefined,
    amountOut: undefined,
    gasSpent: undefined,
    gasSpentUsd: undefined,
    minAmountOut: undefined,
    priceImpact: undefined,
    route: undefined,
    routingSource: undefined,
    status: undefined,
    swapPrice: undefined,
    tokenTax: undefined,
    tx: undefined,
    type: undefined,
  }
  const queryKey = ['quote-fixture', fee]
  client.setQueryData(queryKey, trade)
  return new QueryObserver<typeof trade>(client, {
    queryKey,
    enabled: false,
  }).getCurrentResult()
}

function QuoteConsumer() {
  const quote = useSimpleSwapTradeQuote()
  return <output>{quote.data?.fee}</output>
}

function EvmQuoteConsumer() {
  const quote = useEvmSimpleSwapTradeQuote()
  return <output>{quote.data?.fee}</output>
}

function SvmQuoteConsumer() {
  const quote = useSvmSimpleSwapTradeQuote()
  return <output>{quote.data?.fee}</output>
}

describe('simple swap trade quote context', () => {
  afterEach(() => {
    queryClients.splice(0).forEach((client) => client.clear())
  })

  it('shares the selected runtime quote with every generic consumer', () => {
    const quote = createQuote('evm-quote')
    const html = renderToStaticMarkup(
      <SimpleSwapTradeQuoteContext.Provider value={{ namespace: 'evm', quote }}>
        <QuoteConsumer />
        <QuoteConsumer />
      </SimpleSwapTradeQuoteContext.Provider>,
    )

    expect(html).toBe('<output>evm-quote</output><output>evm-quote</output>')
  })

  it.each([QuoteConsumer, EvmQuoteConsumer, SvmQuoteConsumer])(
    'rejects %s outside a swap runtime',
    (Consumer) => {
      expect(() => renderToStaticMarkup(<Consumer />)).toThrow(
        'Swap quote hooks must be used inside a simple swap runtime',
      )
    },
  )

  it('rejects namespace-specific readers under the other runtime', () => {
    const evmQuote = createQuote('evm-quote')
    const svmQuote = createQuote('svm-quote')

    expect(() =>
      renderToStaticMarkup(
        <SimpleSwapTradeQuoteContext.Provider
          value={{ namespace: 'svm', quote: svmQuote }}
        >
          <EvmQuoteConsumer />
        </SimpleSwapTradeQuoteContext.Provider>,
      ),
    ).toThrow('useEvmSimpleSwapTradeQuote is EVM-only')

    expect(() =>
      renderToStaticMarkup(
        <SimpleSwapTradeQuoteContext.Provider
          value={{ namespace: 'evm', quote: evmQuote }}
        >
          <SvmQuoteConsumer />
        </SimpleSwapTradeQuoteContext.Provider>,
      ),
    ).toThrow('useSvmSimpleSwapTradeQuote is SVM-only')
  })
})
