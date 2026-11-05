'use client'

import { useDebounce } from '@sushiswap/hooks'
import type { UseQueryResult } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import {
  type CowLimitPrice,
  formatLimitPrice,
  getLimitBuyAmount,
  getOrderPrice,
} from 'src/lib/swap/cow/amounts'
import {
  COW_NATIVE_BUY_ADDRESS,
  type CowLimitChainId,
} from 'src/lib/swap/cow/chains'
import { getCowErrorMessage } from 'src/lib/swap/cow/errors'
import type { CowQuote } from 'src/lib/swap/cow/orderbook'
import { Amount, Price } from 'sushi'
import { type EvmAddress, isEvmAddressEqual } from 'sushi/evm'
import { useDerivedStateSimpleSwap } from '../../swap/_ui/derivedstate-simple-swap-provider'
import { useCowQuote } from './use-cow-quote'

export interface CowLimitPricing {
  price: string
  inverted: boolean
  sellAddress: EvmAddress | undefined
  buyAddress: EvmAddress | undefined
  sellAmount: bigint | undefined
  buyAmount: bigint | undefined
  inputError: string | undefined
  marketPrice: CowLimitPrice | undefined
  belowMarket: boolean
  quote: UseQueryResult<CowQuote>
  debouncedAmount: string
  setPrice(value: string): void
  setLimitPrice(price: CowLimitPrice): void
  resetPrice(): void
  useMarket(): void
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
  const debouncedAmount = useDebounce(swapAmountString, 400)
  const sellAddress = token0?.wrap().address
  const buyAddress = token1?.isNative
    ? COW_NATIVE_BUY_ADDRESS
    : token1?.wrap().address

  function getLimitPrice(): CowLimitPrice | undefined {
    if (!token0 || !token1) return undefined
    // The pair can change without a reset, e.g. through browser history.
    if (exactPrice?.base.isSame(token0) && exactPrice.quote.isSame(token1))
      return exactPrice
    if (!price) return undefined
    return inverted
      ? Price.tryFromHuman(token1, token0, price)?.invert()
      : Price.tryFromHuman(token0, token1, price)
  }

  const sellAmount = swapAmount?.amount || undefined
  const limitPrice = getLimitPrice()
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

  const quote = useCowQuote({
    chainId,
    owner,
    sellToken: sellAddress,
    buyToken: buyAddress,
    sellAmount:
      token0 && Amount.tryFromHuman(token0, debouncedAmount)?.amount.toString(),
    enabled: !disabled,
  })
  const marketPrice =
    quote.data && token0 && token1
      ? getOrderPrice(quote.data.quote, token0, token1)
      : undefined
  const belowMarket = Boolean(
    limitPrice && marketPrice && limitPrice.lt(marketPrice),
  )

  const setLimitPrice = useCallback((next: CowLimitPrice): void => {
    setExactPrice(next)
    setInverted(false)
    setPrice(formatLimitPrice(next))
  }, [])

  function updatePrice(value: string): void {
    setPrice(value)
    setExactPrice(undefined)
  }
  function resetPrice(): void {
    setPrice('')
    setExactPrice(undefined)
    setInverted(false)
  }
  function useMarket(): void {
    if (!marketPrice) return
    setExactPrice(marketPrice)
    setPrice(formatLimitPrice(inverted ? marketPrice.invert() : marketPrice))
  }
  function invertPrice(): void {
    try {
      const current = getLimitPrice()
      setExactPrice(current)
      setPrice(
        current ? formatLimitPrice(inverted ? current : current.invert()) : '',
      )
    } catch {
      setPrice('')
    }
    setInverted(!inverted)
  }

  return {
    price,
    inverted,
    sellAddress,
    buyAddress,
    sellAmount,
    buyAmount,
    inputError,
    marketPrice,
    belowMarket,
    quote,
    debouncedAmount,
    setPrice: updatePrice,
    setLimitPrice,
    resetPrice,
    useMarket,
    invertPrice,
  }
}
