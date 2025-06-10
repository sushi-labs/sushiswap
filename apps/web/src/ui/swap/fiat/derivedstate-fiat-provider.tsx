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

interface State {
  mutate: {
    setToken0(token0: FiatCurrency): void
    setToken1(token1: Type | string): void
    setTokens(token0: FiatCurrency | string, token1: Type | string): void
    setSwapAmount(swapAmount: string): void
  }
  state: {
    token0: FiatCurrency | undefined
    token1: Type | undefined
    chainId: EvmChainId
    swapAmountString: string
    recipient: string | undefined
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

  const chainId =
    _chainId && isSupportedChainId(+_chainId)
      ? (+_chainId as SupportedChainId)
      : EvmChainId.ETHEREUM

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)

    if (!params.has('token0')) {
      params.set('token0', 'US')
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
  const setToken0 = useCallback<(_token0: string | FiatCurrency) => void>(
    (_token0) => {
      // If entity is provided, parse it to a string
      const token0 = getCurrencyAsString(_token0)

      if (typeof _token0 !== 'string') {
        setLocalFiatCache(localFiatCache.set(token0, _token0))
      }

      push(
        `${pathname}?${createQueryString([{ name: 'token0', value: token0 }])}`,
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
          { name: 'token0', value: token0 },
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

  const token0Param = defaultedParams.get('token0') as string
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

  const token0 = token0FromLocalCache
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
          },
          state: {
            recipient: address ?? '',
            chainId,
            swapAmountString,
            token0: _token0,
            token1: _token1,
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
