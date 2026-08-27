'use client'

import { useParams, usePathname, useSearchParams } from 'next/navigation'
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  type CrossmintSupportedChainId,
  type CrossmintSupportedFiatCurrency,
  isCrossmintSupportedChainId,
  isCrossmintSupportedFiatCurrency,
} from 'src/config'
import type { CrossmintCheckoutTokenEntry } from 'src/lib/crossmint'
import { ChainId } from 'sushi'

const FIAT_AMOUNT_QUERY_PARAM = 'fiatAmount'
const PAYMENT_CURRENCY_QUERY_PARAM = 'paymentCurrency'

interface State {
  mutate: {
    setFiatAmount(fiatAmount: string): void
    setPaymentCurrency(currency: CrossmintSupportedFiatCurrency): void
    setToken(token: CrossmintCheckoutTokenEntry): void
  }
  state: {
    chainId: CrossmintSupportedChainId
    fiatAmountString: string
    paymentCurrency: CrossmintSupportedFiatCurrency
    token: CrossmintCheckoutTokenEntry | undefined
  }
}

const DerivedStateFiatBuyContext = createContext<State | undefined>(undefined)

interface DerivedStateFiatBuyProviderProps {
  children: ReactNode
  chainId?: CrossmintSupportedChainId
}

function isValidFiatAmount(value: string): boolean {
  return /^\d*(?:\.\d*)?$/.test(value)
}

function DerivedstateFiatBuyProvider({
  children,
  chainId: providedChainId,
}: DerivedStateFiatBuyProviderProps) {
  const { chainId: routeChainId } = useParams<{ chainId: string }>()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [token, setToken] = useState<CrossmintCheckoutTokenEntry>()
  const parsedRouteChainId = Number(routeChainId)
  const chainId =
    providedChainId ??
    (isCrossmintSupportedChainId(parsedRouteChainId)
      ? parsedRouteChainId
      : ChainId.ETHEREUM)
  const fiatAmountParam = searchParams.get(FIAT_AMOUNT_QUERY_PARAM)
  const paymentCurrencyParam = searchParams.get(PAYMENT_CURRENCY_QUERY_PARAM)

  const fiatAmountString =
    fiatAmountParam !== null && isValidFiatAmount(fiatAmountParam)
      ? fiatAmountParam
      : '50'
  const paymentCurrency =
    paymentCurrencyParam !== null &&
    isCrossmintSupportedFiatCurrency(paymentCurrencyParam)
      ? paymentCurrencyParam
      : 'usd'

  const updateSearchParam = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams)

      if (value === null) {
        params.delete(name)
      } else {
        params.set(name, value)
      }

      const queryString = params.toString()
      history.pushState(
        null,
        '',
        queryString ? `${pathname}?${queryString}` : pathname,
      )
    },
    [pathname, searchParams],
  )

  const setFiatAmount = useCallback(
    (fiatAmount: string) => {
      if (!isValidFiatAmount(fiatAmount)) return

      updateSearchParam(FIAT_AMOUNT_QUERY_PARAM, fiatAmount)
    },
    [updateSearchParam],
  )

  const setPaymentCurrency = useCallback(
    (currency: CrossmintSupportedFiatCurrency) => {
      updateSearchParam(PAYMENT_CURRENCY_QUERY_PARAM, currency)
    },
    [updateSearchParam],
  )

  const value = useMemo<State>(
    () => ({
      mutate: {
        setFiatAmount,
        setPaymentCurrency,
        setToken,
      },
      state: {
        chainId,
        fiatAmountString,
        paymentCurrency,
        token,
      },
    }),
    [
      chainId,
      fiatAmountString,
      paymentCurrency,
      setFiatAmount,
      setPaymentCurrency,
      token,
    ],
  )

  return (
    <DerivedStateFiatBuyContext.Provider value={value}>
      {children}
    </DerivedStateFiatBuyContext.Provider>
  )
}

function useDerivedStateFiatBuy(): State {
  const context = useContext(DerivedStateFiatBuyContext)

  if (!context) {
    throw new Error(
      'Hook can only be used inside Fiat Buy Derived State Context',
    )
  }

  return context
}

export { DerivedstateFiatBuyProvider, useDerivedStateFiatBuy }
