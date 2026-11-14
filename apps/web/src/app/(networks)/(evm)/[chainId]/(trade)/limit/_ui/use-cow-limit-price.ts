'use client'

import { useDebounce } from '@sushiswap/hooks'
import type { UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import {
  type CowLimitPrice,
  getLimitBuyAmount,
  getOrderPrice,
  getPriceDifference,
  getUsdMarketPrice,
} from 'src/lib/swap/cow/amounts'
import {
  COW_NATIVE_BUY_ADDRESS,
  type CowLimitChainId,
} from 'src/lib/swap/cow/chains'
import { getCowErrorMessage } from 'src/lib/swap/cow/errors'
import type { CowQuote } from 'src/lib/swap/cow/orderbook'
import { Amount, type Fraction, Price } from 'sushi'
import { type EvmAddress, isEvmAddressEqual } from 'sushi/evm'
import { useCurrencyPrice } from '~evm/_common/ui/price-provider/price-provider/use-currency-price'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { useCowQuote } from './use-cow-quote'

// `quote` is CoW's own rate for this amount; `usd` is estimated from USD prices.
export type CowMarketSource = 'quote' | 'usd'

// Percent above market (below, in the inverted display); 0 is the market itself.
export type CowPricePreset = 0 | 5 | 10 | 20

// A discount in the inverted display increases the sell-to-buy limit.
function applyPreset(
  market: CowLimitPrice,
  percentage: CowPricePreset,
  inverted: boolean,
): CowLimitPrice {
  return new Price({
    base: market.base,
    quote: market.quote,
    numerator: market.numerator * BigInt(inverted ? 100 : 100 + percentage),
    denominator: market.denominator * BigInt(inverted ? 100 - percentage : 100),
  })
}

export interface CowLimitPricing {
  price: string
  inverted: boolean
  // The selected market preset, which the limit follows as the market moves.
  preset: CowPricePreset | undefined
  sellAddress: EvmAddress | undefined
  buyAddress: EvmAddress | undefined
  sellAmount: bigint | undefined
  buyAmount: bigint | undefined
  // The buy field's text: what the user typed, else the derived minimum.
  buyAmountString: string
  inputError: string | undefined
  marketPrice: CowLimitPrice | undefined
  marketSource: CowMarketSource | undefined
  belowMarket: boolean
  // Percent of the displayed limit vs the displayed market price.
  priceDifference: Fraction | undefined
  // USD value of one displayed base token at the limit price.
  limitPriceUsd: number | undefined
  quote: UseQueryResult<CowQuote>
  debouncedAmount: string
  setPrice(value: string): void
  setBuyAmount(value: string): void
  setLimitPrice(price: CowLimitPrice): void
  resetPrice(): void
  useMarket(percentage?: CowPricePreset): void
  invertPrice(): void
}

export function useCowLimitPrice(
  chainId: CowLimitChainId,
  owner: EvmAddress | undefined,
  disabled: boolean,
): CowLimitPricing {
  const {
    state: { token0, token1, swapAmount, swapAmountString },
  } = useDerivedStateSimpleSwap<CowLimitChainId>()
  const [price, setPrice] = useState('')
  const [inverted, setInverted] = useState(false)
  // Kept in sell-to-buy direction so formatting never changes the signed limit.
  const [exactPrice, setExactPrice] = useState<CowLimitPrice>()
  // A typed buy amount defines the limit together with the sell amount, until
  // the price is set directly again. Cleared with the pair, like the price.
  const [typedBuy, setTypedBuy] = useState<string>()
  const [preset, setPreset] = useState<CowPricePreset>()
  const pair = `${token0?.id}:${token1?.id}`
  const [previousPair, setPreviousPair] = useState(pair)
  const pairChanged = pair !== previousPair
  // Reset before committing the new pair with the previous pair's limit.
  if (pairChanged) {
    setPreviousPair(pair)
    resetPrice()
  }
  const debouncedAmount = useDebounce(swapAmountString, 400)
  const sellAddress = token0?.wrap().address
  const buyAddress = token1?.isNative
    ? COW_NATIVE_BUY_ADDRESS
    : token1?.wrap().address
  const sellAmount = swapAmount?.amount || undefined

  const quote = useCowQuote({
    chainId,
    owner,
    sellToken: sellAddress,
    buyToken: buyAddress,
    sellAmount:
      token0 && Amount.tryFromHuman(token0, debouncedAmount)?.amount.toString(),
    enabled: !disabled,
  })
  const { data: sellUsd } = useCurrencyPrice({ currency: token0 })
  const { data: buyUsd } = useCurrencyPrice({ currency: token1 })

  // CoW's quote reflects the entered size (or the previous one while the next
  // loads); USD prices cover the gap until any quote is available.
  const quotePrice =
    quote.data && !quote.isError && token0 && token1
      ? getOrderPrice(quote.data.quote, token0, token1)
      : undefined
  const usdPrice =
    token0 && token1
      ? getUsdMarketPrice(token0, token1, sellUsd, buyUsd)
      : undefined
  const marketPrice = quotePrice ?? usdPrice
  const marketSource: CowMarketSource | undefined = quotePrice
    ? 'quote'
    : usdPrice
      ? 'usd'
      : undefined

  // A selected preset keeps following the market until another input is used;
  // `exactPrice` holds its last value in case the market becomes unavailable.
  const presetPrice =
    preset !== undefined && marketPrice
      ? applyPreset(marketPrice, preset, inverted)
      : undefined
  if (!pairChanged && presetPrice && !exactPrice?.eq(presetPrice)) {
    setExactPrice(presetPrice)
  }

  function getLimitPrice(): CowLimitPrice | undefined {
    if (!token0 || !token1) return undefined
    if (typedBuy !== undefined) {
      const buy = Amount.tryFromHuman(token1, typedBuy)
      if (!swapAmount || !sellAmount || !buy || buy.amount <= 0n)
        return undefined
      return new Price({ baseAmount: swapAmount, quoteAmount: buy })
    }
    if (presetPrice) return presetPrice
    if (exactPrice) return exactPrice
    if (!price) return undefined
    return inverted
      ? Price.tryFromHuman(token1, token0, price)?.invert()
      : Price.tryFromHuman(token0, token1, price)
  }

  const limitPrice = getLimitPrice()
  const displayedPrice = inverted ? limitPrice?.invert() : limitPrice
  let buyAmount: bigint | undefined
  let inputError: string | undefined
  try {
    if (sellAmount && limitPrice) {
      buyAmount = getLimitBuyAmount(sellAmount, limitPrice)
      if (
        sellAddress &&
        buyAddress &&
        isEvmAddressEqual(sellAddress, buyAddress)
      )
        throw new Error('Choose two different tokens')
    }
  } catch (cause) {
    inputError = getCowErrorMessage(cause)
  }

  const belowMarket = Boolean(
    limitPrice && marketPrice && limitPrice.lt(marketPrice),
  )
  const displayedMarketPrice = inverted ? marketPrice?.invert() : marketPrice
  const priceDifference =
    displayedPrice && displayedMarketPrice
      ? getPriceDifference(displayedPrice, displayedMarketPrice)
      : undefined
  const displayedQuoteUsd = inverted ? sellUsd : buyUsd
  const limitPriceUsd =
    displayedPrice && displayedQuoteUsd
      ? displayedPrice.toNumber() * displayedQuoteUsd
      : undefined

  const setLimitPrice = useCallback((next: CowLimitPrice): void => {
    setPreset(undefined)
    setTypedBuy(undefined)
    setExactPrice(next)
    setInverted(false)
    setPrice(next.toSignificant(6))
  }, [])

  function updatePrice(value: string): void {
    setPreset(undefined)
    setTypedBuy(undefined)
    setPrice(value)
    setExactPrice(undefined)
  }
  function setBuyAmount(value: string): void {
    setPreset(undefined)
    setTypedBuy(value)
  }
  function resetPrice(): void {
    setPreset(undefined)
    setTypedBuy(undefined)
    setPrice('')
    setExactPrice(undefined)
    setInverted(false)
  }
  function useMarket(percentage: CowPricePreset = 0): void {
    if (!marketPrice) return
    const next = applyPreset(marketPrice, percentage, inverted)
    setPreset(percentage)
    setTypedBuy(undefined)
    setExactPrice(next)
    setPrice((inverted ? next.invert() : next).toSignificant(6))
  }
  function invertPrice(): void {
    // A preset's percentage means the opposite direction once inverted, so
    // freeze the current limit instead of reinterpreting it.
    setPreset(undefined)
    try {
      const current = getLimitPrice()
      setExactPrice(current)
      setPrice(
        current ? (inverted ? current : current.invert()).toSignificant(6) : '',
      )
    } catch {
      setPrice('')
    }
    setInverted(!inverted)
  }

  return {
    // A typed buy amount or a preset derives the price, so show that instead.
    price:
      typedBuy !== undefined || preset !== undefined
        ? displayedPrice
          ? displayedPrice.toSignificant(6)
          : ''
        : price,
    inverted,
    preset,
    sellAddress,
    buyAddress,
    sellAmount,
    buyAmount,
    buyAmountString:
      typedBuy !== undefined
        ? typedBuy
        : buyAmount && token1
          ? new Amount(token1, buyAmount).toSignificant(6)
          : '',
    inputError,
    marketPrice,
    marketSource,
    belowMarket,
    priceDifference,
    limitPriceUsd,
    quote,
    debouncedAmount,
    setPrice: updatePrice,
    setBuyAmount,
    setLimitPrice,
    resetPrice,
    useMarket,
    invertPrice,
  }
}
