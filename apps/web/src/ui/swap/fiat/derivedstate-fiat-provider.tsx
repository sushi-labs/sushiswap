'use client'

import { useParams, usePathname, useSearchParams } from 'next/navigation'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { EvmChainId } from 'sushi/chain'
import { defaultQuoteCurrency, isWNativeSupported } from 'sushi/config'
import { Native, type Type } from 'sushi/currency'
import { type Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { type SupportedChainId, isSupportedChainId } from '../../../config'

const getTokenAsString = (token: Type | string) =>
  typeof token === 'string'
    ? token
    : token.isNative
      ? 'NATIVE'
      : token.wrapped.address
const getCurrencyAsString = (token: FiatCurrency | string) =>
  typeof token === 'string' ? token : token.code
// const getDefaultCurrency = (chainId: number) =>
//   getTokenAsString(defaultCurrency[chainId as keyof typeof defaultCurrency])
const getQuoteCurrency = (chainId: number) =>
  getTokenAsString(
    defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency],
  )

export type FiatCurrency = {
  flag: string
  symbol: string
  name: string
  code: string
}

export type FiatPaymentType = 'debit' | 'credit' | 'apple-pay'

interface State {
  mutate: {
    setToken0(token0: FiatCurrency): void
    setToken1(token1: Type | string): void
    setTokens(token0: FiatCurrency | string, token1: Type | string): void
    setSwapAmount(swapAmount: string): void
    setPaymentType(type: null | FiatPaymentType): void
  }
  state: {
    token0: FiatCurrency | undefined
    token1: Type | undefined
    chainId: EvmChainId
    swapAmountString: string
    recipient: string | undefined
    paymentType: FiatPaymentType | null
  }
  isLoading: boolean
  isToken1Loading: boolean
}

const DerivedStateFiatContext = createContext<State>({} as State)

interface DerivedStateFiatProviderProps {
  children: React.ReactNode
}

/* Parses the URL and provides the chainId, token0, and token1 globally.
 * URL example:
 * /swap?token0=NATIVE&token1=0x6b3595068778dd592e39a122f4f5a5cf09c90fe2
 */
const DerivedStateFiatProvider: FC<DerivedStateFiatProviderProps> = ({
  children,
}) => {
  const push = useCallback((path: string) => {
    const newUrl = new URL(`${window.location.origin}${path}`).toString()
    window.history.pushState({}, '', newUrl)
  }, [])
  const { chainId: _chainId } = useParams()
  const { address } = useAccount()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [localTokenCache, setLocalTokenCache] = useState<Map<string, Type>>(
    new Map(),
  )
  const [localFiatCache, setLocalFiatCache] = useState<
    Map<string, FiatCurrency>
  >(new Map())
  const [paymentType, _setPaymentType] = useState<FiatPaymentType | null>(null)

  const chainId =
    _chainId && isSupportedChainId(+_chainId)
      ? (+_chainId as SupportedChainId)
      : EvmChainId.ETHEREUM

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)

    if (!params.has('fiatIn')) {
      params.set('fiatIn', 'US')
      params.set('swapAmount', '')
    }
    if (!params.has('token1')) {
      params.set('token1', getQuoteCurrency(chainId))
    }
    return params
  }, [chainId, searchParams])

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(defaultedParams)
      values.forEach(({ name, value }) => {
        if (value === null) {
          params.delete(name)
        } else {
          params.set(name, value)
        }
      })
      return params.toString()
    },
    [defaultedParams],
  )

  // Update the URL with a new token0
  const setPaymentType = useCallback<(_type: null | FiatPaymentType) => void>(
    (_type) => {
      // If entity is provided, parse it to a string

      if (typeof _type === 'string') {
        push(
          `${pathname}?${createQueryString([{ name: 'paymentType', value: _type }])}`,
        )
      }
      _setPaymentType(_type)
    },
    [createQueryString, pathname, push],
  )

  // Update the URL with a new token0
  const setToken0 = useCallback<(_token0: string | FiatCurrency) => void>(
    (_token0) => {
      // If entity is provided, parse it to a string
      const token0 = getCurrencyAsString(_token0)

      if (typeof _token0 !== 'string') {
        setLocalFiatCache(localFiatCache.set(token0, _token0))
      }

      push(
        `${pathname}?${createQueryString([{ name: 'fiatIn', value: token0 }])}`,
      )
    },
    [createQueryString, localFiatCache, pathname, push],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback<(_token1: string | Type) => void>(
    (_token1) => {
      // If entity is provided, parse it to a string
      const token1 = getTokenAsString(_token1)

      if (typeof _token1 !== 'string') {
        setLocalTokenCache(localTokenCache.set(token1, _token1))
      }

      push(
        `${pathname}?${createQueryString([{ name: 'token1', value: token1 }])}`,
      )
    },
    [createQueryString, localTokenCache, pathname, push],
  )

  // Update the URL with both tokens
  const setTokens = useCallback<
    (_token0: string | FiatCurrency, _token1: string | Type) => void
  >(
    (_token0, _token1) => {
      // If entity is provided, parse it to a string
      const token0 = getCurrencyAsString(_token0)
      const token1 = getTokenAsString(_token1)

      push(
        `${pathname}?${createQueryString([
          { name: 'fiatIn', value: token0 },
          { name: 'token1', value: token1 },
        ])}`,
      )
    },
    [createQueryString, pathname, push],
  )

  // Update the URL with a new swapAmount
  const setSwapAmount = useCallback<(value: string) => void>(
    (value) => {
      push(
        `${pathname}?${createQueryString([{ name: 'swapAmount', value: value }])}`,
      )
    },
    [createQueryString, pathname, push],
  )

  const token0Param = defaultedParams.get('fiatIn') as string
  const token1Param = defaultedParams.get('token1') as string

  const token0FromLocalCache = localFiatCache.get(token0Param)
  const token1FromLocalCache = localTokenCache.get(token1Param)

  // Derive token1
  const { data: token1FromCache, isInitialLoading: token1Loading } =
    useTokenWithCache({
      chainId,
      address: token1Param as Address,
      enabled:
        isAddress(token1Param, { strict: false }) && !token1FromLocalCache,
      keepPreviousData: false,
    })

  const token0 = token0FromLocalCache ?? defaultFiatCurrency
  const token1 = token1FromLocalCache ?? token1FromCache

  return (
    <DerivedStateFiatContext.Provider
      value={useMemo(() => {
        const swapAmountString = defaultedParams.get('swapAmount') || ''
        const _token0 = token0
        const _token1 =
          defaultedParams.get('token1') === 'NATIVE' &&
          isWNativeSupported(chainId)
            ? Native.onChain(chainId)
            : token1

        return {
          mutate: {
            setToken0,
            setToken1,
            setTokens,
            setSwapAmount,
            setPaymentType,
          },
          state: {
            recipient: address ?? '',
            chainId,
            swapAmountString,
            token0: _token0,
            token1: _token1,
            paymentType,
          },
          isLoading: token1Loading,

          isToken1Loading: token1Loading,
        }
      }, [
        address,
        chainId,
        defaultedParams,
        setSwapAmount,
        setToken0,
        setToken1,
        setTokens,
        token0,
        token1,
        token1Loading,
        paymentType,
        setPaymentType,
      ])}
    >
      {children}
    </DerivedStateFiatContext.Provider>
  )
}

const useDerivedStateFiat = () => {
  const context = useContext(DerivedStateFiatContext)
  if (!context) {
    throw new Error('Hook can only be used inside Fiat Derived State Context')
  }

  return context
}

export { DerivedStateFiatProvider, useDerivedStateFiat }

const defaultFiatCurrency: FiatCurrency = {
  symbol: 'USD',
  flag: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAALESURBVHja7Jc/aBNxFMc/l0STtqYtihgkYLOYitjuFuwiUgfBUOgSOqS6CNqmRRqLmyjBBDQ4FLRL/TOokEEhgyC4O7RSB0MHWxEtWLGtrW2Su/s9h8ZeUlF7rV4XHzy+995v+d77vnf3fpqIsJ3mYpvtPwENcAPeMjppJlD0APXHj9/44nZvrhh3d45tsvYuAk9GdwM0nTiRkZmZb3L9+jPbuBUDmjyA1zAUIyMviMXaSaVzDPSfJJ3O0V+JqRz9A1acSufQgC+XrlpvJRXCVua06nNXYz36m0kArwtAKUVPTzvJ5FPifR0kk0/pW4/x6jje10GhoEOhaHmx7OtzP50XQDfWOIbb2lISjz+SqakFicVGN4yx2OhWJQh7AAzDJB7vYHDwEclkF4nExnBo6DGz3Rfs959/F8aHGQDKBBSJxEOuXeuit/cemUz3hhBA6d82NfxSKlkStLZekcnJeTl2LC35/Jwt/CsS6LpJT88d7oycJRod5sH9c0Sjw9z/A4Lw8egp0MptLmI9V8br8prPB8WCJYGuK27fPkPk9E2y2T5ORzJks71EIqtxZC2uznd23kJ8y9Vj9zv7MZKGjlROQSg0JKHQZZmYmJVgMLFhDAYTW5YAIBwMJmR8/JPU1Z2XsTF7OL3nkH0PtMj7g20ChDUgHAhczC8tlTAM03ZD52ue258CjwfNX8eBty+bNSBsmmbe5XL2z6yUwu12N3sApve34jFMpKQ7swPs3IGxw2NNgTINRARRpv1tQtbFld3+q3VT3CjTsAgE34/j8/kclWBlZQVqa1cJTO89TI3XiyyvOCNBbQ3LpaK1E5pKVX/B/jkDDaWkQoKPr2hoaHBUgoWFBWhsXCXwLtBCY73fUQJzXxfXKmDqfpPPMu8oAfEDBUwN2AccAfY6vJbPAq+18p3AX0YnrQgsav8vp9tN4PsALYQJa7MTgzkAAAAASUVORK5CYII=',
  name: 'United States',
  code: 'US',
}
