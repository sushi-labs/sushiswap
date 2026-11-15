/** @vitest-environment jsdom */

import { act, useEffect, useLayoutEffect } from 'react'
import { type Root, createRoot } from 'react-dom/client'
import { type CowLimitPrice, getOrderPrice } from 'src/lib/swap/cow/amounts'
import { Amount } from 'sushi'
import { type EvmCurrency, EvmNative, EvmToken, USDC, WETH9 } from 'sushi/evm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type CowLimitPricing, useCowLimitPrice } from './use-cow-limit-price'

const sell = EvmNative.fromChainId(1)
const buy = USDC[1]
let swapState: {
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  swapAmountString: string
}
const mocks = vi.hoisted(() => ({
  available: true,
  isError: false,
  buyAmount: '2000000',
  usd: new Map<boolean, number>(),
}))

vi.mock('../../swap/_ui/derivedstate-simple-swap-provider', () => ({
  useDerivedStateSimpleSwap: () => ({
    state: {
      ...swapState,
      swapAmount:
        swapState.token0 &&
        Amount.tryFromHuman(swapState.token0, swapState.swapAmountString),
    },
  }),
}))
vi.mock('./use-cow-quote', () => ({
  useCowQuote: () => ({
    data: mocks.available
      ? {
          quote: {
            sellAmount: '1000000000000000000',
            buyAmount: mocks.buyAmount,
          },
        }
      : undefined,
    isError: mocks.isError,
  }),
}))

vi.mock(
  '~evm/_common/ui/price-provider/price-provider/use-currency-price',
  () => ({
    useCurrencyPrice: ({ currency }: { currency?: { isNative: boolean } }) => ({
      data: currency ? mocks.usd.get(currency.isNative) : undefined,
    }),
  }),
)

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

describe('CoW limit price controls', () => {
  let container: HTMLDivElement
  let root: Root
  let pricing: CowLimitPricing
  let committedPrices: string[]

  function difference(): string | undefined {
    return pricing.priceDifference?.toString({ maxFixed: 2 })
  }

  function Harness({ orderPrice }: { orderPrice?: CowLimitPrice }): null {
    pricing = useCowLimitPrice(1, undefined, false)
    useLayoutEffect(() => {
      committedPrices.push(pricing.price)
    })
    const { setLimitPrice } = pricing
    useEffect(() => {
      if (orderPrice) setLimitPrice(orderPrice)
    }, [orderPrice, setLimitPrice])
    return null
  }

  beforeEach(() => {
    mocks.available = true
    mocks.isError = false
    mocks.buyAmount = '2000000'
    mocks.usd.clear()
    swapState = { token0: sell, token1: buy, swapAmountString: '1' }
    committedPrices = []
    container = document.createElement('div')
    root = createRoot(container)
    act(() => root.render(<Harness />))
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it.each([5, 10, 20] as const)('sets a limit %s%% above market', (percent) => {
    act(() => pricing.useMarket(percent))
    expect(pricing.price).toBe(String(2 * (1 + percent / 100)))
    expect(pricing.buyAmount).toBe(BigInt(2_000_000 + 20_000 * percent))
    expect(difference()).toBe(String(percent))
    expect(pricing.belowMarket).toBe(false)
  })

  it('applies an inverted discount and preserves the exact minimum when toggled', () => {
    act(() => pricing.invertPrice())
    act(() => pricing.useMarket(10))
    expect(pricing.price).toBe('0.45')
    expect(difference()).toBe('-10')
    expect(pricing.buyAmount).toBe(2_222_223n)
    expect(pricing.belowMarket).toBe(false)
    act(() => pricing.invertPrice())
    act(() => pricing.invertPrice())
    expect(pricing.price).toBe('0.45')
    expect(pricing.buyAmount).toBe(2_222_223n)
    act(() => pricing.useMarket())
    expect(pricing.price).toBe('0.5')
    expect(pricing.buyAmount).toBe(2_000_000n)
  })

  it('keeps edited-order precision through inversion and clears it on a pair reset', () => {
    act(() =>
      pricing.setLimitPrice(
        getOrderPrice(
          { sellAmount: '3000000000000000000', buyAmount: '1000000' },
          sell,
          buy,
        ),
      ),
    )
    expect(pricing.price).toBe('0.333333')
    expect(pricing.buyAmount).toBe(333_334n)
    act(() => pricing.invertPrice())
    expect(pricing.price).toBe('3')
    act(() => pricing.invertPrice())
    expect(pricing.price).toBe('0.333333')
    expect(pricing.buyAmount).toBe(333_334n)
    act(() => pricing.resetPrice())
    expect(pricing.price).toBe('')
    expect(pricing.buyAmount).toBeUndefined()
    expect(pricing.inverted).toBe(false)
  })

  it('preserves the precision of a manually entered price', () => {
    act(() => pricing.setPrice('0.123456789'))
    expect(pricing.price).toBe('0.123456789')
    expect(pricing.buyAmount).toBe(123_457n)
    act(() => pricing.invertPrice())
    expect(pricing.price).toBe('8.1')
    act(() => pricing.invertPrice())
    expect(pricing.price).toBe('0.123457')
    expect(pricing.buyAmount).toBe(123_457n)
  })

  it.each([
    { name: 'sell token', token0: WETH9[1], token1: buy },
    { name: 'buy token', token0: sell, token1: WETH9[1] },
    { name: 'pair direction', token0: buy, token1: sell },
    { name: 'loading token', token0: undefined, token1: buy },
  ])('clears the old limit before committing a changed $name', (pair) => {
    act(() => pricing.setPrice('3'))
    act(() => pricing.invertPrice())
    expect(pricing.buyAmount).toBe(3_000_000n)
    committedPrices = []
    swapState = { ...swapState, token0: pair.token0, token1: pair.token1 }
    act(() => root.render(<Harness />))
    expect(committedPrices).toEqual([''])
    expect(pricing.price).toBe('')
    expect(pricing.buyAmountString).toBe('')
    expect(pricing.buyAmount).toBeUndefined()
    expect(pricing.inverted).toBe(false)
    swapState = { ...swapState, token0: sell, token1: buy }
    act(() => root.render(<Harness />))
    expect(pricing.buyAmount).toBeUndefined()
  })

  it.each(['preset', 'buy amount'])(
    'clears a selected %s on a pair change',
    (input) => {
      act(() => {
        if (input === 'preset') pricing.useMarket(10)
        else pricing.setBuyAmount('2.5')
      })
      expect(pricing.buyAmount).toBeDefined()
      swapState.token0 = WETH9[1]
      act(() => root.render(<Harness />))
      expect(pricing.price).toBe('')
      expect(pricing.preset).toBeUndefined()
      expect(pricing.buyAmountString).toBe('')
      expect(pricing.buyAmount).toBeUndefined()
    },
  )

  it('keeps the limit when the amount or metadata changes for the same pair', () => {
    act(() => pricing.setPrice('3'))
    swapState.swapAmountString = '2'
    swapState.token1 = new EvmToken({
      chainId: buy.chainId,
      address: buy.address,
      decimals: buy.decimals,
      symbol: buy.symbol,
      name: buy.name,
    })
    act(() => root.render(<Harness />))
    expect(pricing.price).toBe('3')
    expect(pricing.buyAmount).toBe(6_000_000n)
  })

  it('preserves the edited-order price populated after changing pairs', () => {
    act(() => pricing.setPrice('3'))
    swapState.token0 = WETH9[1]
    const orderPrice = getOrderPrice(
      { sellAmount: '3000000000000000000', buyAmount: '1000000' },
      WETH9[1],
      buy,
    )
    act(() => root.render(<Harness orderPrice={orderPrice} />))
    expect(pricing.price).toBe('0.333333')
    expect(pricing.buyAmount).toBe(333_334n)
    act(() => root.render(<Harness orderPrice={orderPrice} />))
    expect(pricing.buyAmount).toBe(333_334n)
  })

  it('keeps the immediate-fill warning correct in either display direction', () => {
    act(() => pricing.setPrice('1'))
    expect(difference()).toBe('-50')
    expect(pricing.belowMarket).toBe(true)
    act(() => pricing.invertPrice())
    expect(difference()).toBe('100')
    expect(pricing.belowMarket).toBe(true)
  })

  it.each(['unavailable', 'failed'])('ignores a %s market quote', (status) => {
    act(() => pricing.setPrice('3'))
    mocks.available = status !== 'unavailable'
    mocks.isError = status === 'failed'
    act(() => root.render(<Harness />))
    act(() => pricing.useMarket(10))
    expect(pricing.price).toBe('3')
    expect(pricing.buyAmount).toBe(3_000_000n)
  })

  it('derives the limit from a typed buy amount until the price is edited', () => {
    act(() => pricing.setBuyAmount('2.5'))
    expect(pricing.buyAmountString).toBe('2.5')
    expect(pricing.buyAmount).toBe(2_500_000n)
    expect(pricing.price).toBe('2.5')
    expect(difference()).toBe('25')
    act(() => pricing.invertPrice())
    expect(pricing.price).toBe('0.4')
    expect(pricing.buyAmount).toBe(2_500_000n)
    act(() => pricing.setPrice('0.5'))
    expect(pricing.buyAmountString).toBe('2')
    expect(pricing.buyAmount).toBe(2_000_000n)
  })

  it('falls back to USD prices without a quote and values the limit in USD', () => {
    mocks.available = false
    mocks.usd.set(true, 3000).set(false, 1)
    act(() => root.render(<Harness />))
    expect(pricing.marketSource).toBe('usd')
    act(() => pricing.useMarket(10))
    expect(pricing.price).toBe('3300')
    expect(pricing.buyAmount).toBe(3_300_000_000n)
    expect(pricing.limitPriceUsd).toBeCloseTo(3300)
    mocks.available = true
    act(() => root.render(<Harness />))
    expect(pricing.marketSource).toBe('quote')
    expect(pricing.belowMarket).toBe(false)
  })

  it('keeps a selected preset following the market until the price is typed', () => {
    act(() => pricing.useMarket(10))
    expect(pricing.preset).toBe(10)
    expect(pricing.buyAmount).toBe(2_200_000n)
    mocks.buyAmount = '3000000'
    act(() => root.render(<Harness />))
    expect(pricing.price).toBe('3.3')
    expect(pricing.buyAmount).toBe(3_300_000n)
    act(() => pricing.setPrice('4'))
    expect(pricing.preset).toBeUndefined()
    mocks.buyAmount = '2000000'
    act(() => root.render(<Harness />))
    expect(pricing.price).toBe('4')
    expect(pricing.buyAmount).toBe(4_000_000n)
  })

  it('holds the last followed preset limit when the market disappears', () => {
    act(() => pricing.useMarket(5))
    mocks.buyAmount = '3000000'
    act(() => root.render(<Harness />))
    expect(pricing.price).toBe('3.15')
    mocks.available = false
    act(() => root.render(<Harness />))
    expect(pricing.price).toBe('3.15')
    expect(pricing.buyAmount).toBe(3_150_000n)
    act(() => pricing.invertPrice())
    act(() => pricing.invertPrice())
    expect(pricing.buyAmount).toBe(3_150_000n)
  })

  it('keeps a cleared buy amount empty instead of re-deriving it', () => {
    act(() => pricing.setPrice('3'))
    act(() => pricing.setBuyAmount(''))
    expect(pricing.buyAmountString).toBe('')
    expect(pricing.buyAmount).toBeUndefined()
  })

  it('freezes a preset when the market disappears or the price is inverted', () => {
    act(() => pricing.useMarket(5))
    mocks.available = false
    act(() => root.render(<Harness />))
    expect(pricing.buyAmount).toBe(2_100_000n)
    mocks.available = true
    act(() => root.render(<Harness />))
    act(() => pricing.invertPrice())
    expect(pricing.preset).toBeUndefined()
    mocks.buyAmount = '3000000'
    act(() => root.render(<Harness />))
    expect(pricing.buyAmount).toBe(2_100_000n)
  })
})
