'use client'

import type { SushiSwapV4ChainId } from '@sushiswap/graph-client/data-api'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useCurrencyWithCache } from 'src/lib/wagmi/hooks/tokens/use-currency-with-cache'
import {
  EVM_DEFAULT_BASES,
  type EvmAddress,
  type EvmCurrency,
  getEvmCurrencyAddress,
  isEvmAddress,
} from 'sushi/evm'

const TOKEN_PARAMS = ['token0', 'token1'] as const

function parseAddressParam(value: string | null): EvmAddress | undefined {
  return value && isEvmAddress(value) ? value : undefined
}

interface V4UrlCurrencies {
  currencyA: EvmCurrency | undefined
  currencyB: EvmCurrency | undefined
  isCurrencyALoading: boolean
  isCurrencyBLoading: boolean
  setCurrencyA(currency: EvmCurrency): void
  setCurrencyB(currency: EvmCurrency): void
  switchTokens(): void
}

/**
 * The new pool form's tokens, kept in the `token0`/`token1` URL params the
 * pool list links with. As in the simple swap, picked currencies are cached
 * so they show at once; only addresses arriving through the URL are fetched.
 */
export function useV4UrlCurrencies(
  chainId: SushiSwapV4ChainId,
): V4UrlCurrencies {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pickedCache, setPickedCache] = useState(
    () => new Map<string, EvmCurrency>(),
  )

  // Without a token in the URL the form starts on the chain's default pair
  const hasUrlTokens = TOKEN_PARAMS.some((param) => searchParams.has(param))
  const address0 = parseAddressParam(searchParams.get(TOKEN_PARAMS[0]))
  const address1 = parseAddressParam(searchParams.get(TOKEN_PARAMS[1]))

  const cached0 = address0 && pickedCache.get(address0.toLowerCase())
  const cached1 = address1 && pickedCache.get(address1.toLowerCase())

  const fetched0 = useCurrencyWithCache({
    chainId,
    address: cached0 ? undefined : address0,
  })
  const fetched1 = useCurrencyWithCache({
    chainId,
    address: cached1 ? undefined : address1,
  })

  const [defaultA, defaultB] = EVM_DEFAULT_BASES[chainId]
  const currencyA = hasUrlTokens ? (cached0 ?? fetched0.data) : defaultA
  const currencyB = hasUrlTokens ? (cached1 ?? fetched1.data) : defaultB

  const setCurrencies = useCallback(
    (a: EvmCurrency | undefined, b: EvmCurrency | undefined) => {
      setPickedCache((current) => {
        const next = new Map(current)
        for (const currency of [a, b]) {
          if (currency) {
            next.set(getEvmCurrencyAddress(currency).toLowerCase(), currency)
          }
        }
        return next
      })

      const params = new URLSearchParams(searchParams)
      ;[a, b].forEach((currency, index) => {
        if (currency) {
          params.set(TOKEN_PARAMS[index], getEvmCurrencyAddress(currency))
        } else {
          params.delete(TOKEN_PARAMS[index])
        }
      })
      // Preserve Next's history state so form edits don't trigger navigation
      history.replaceState(history.state, '', `${pathname}?${params}`)
    },
    [pathname, searchParams],
  )

  return {
    currencyA,
    currencyB,
    isCurrencyALoading: hasUrlTokens && !cached0 && fetched0.isLoading,
    isCurrencyBLoading: hasUrlTokens && !cached1 && fetched1.isLoading,
    setCurrencyA: (currency) => setCurrencies(currency, currencyB),
    setCurrencyB: (currency) => setCurrencies(currencyA, currency),
    switchTokens: () => setCurrencies(currencyB, currencyA),
  }
}
