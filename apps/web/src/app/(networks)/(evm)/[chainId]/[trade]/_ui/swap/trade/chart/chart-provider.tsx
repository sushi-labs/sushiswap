'use client'

import { useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import type { ChainId } from 'sushi'
import { EvmChainId, STABLES, isEvmAddress } from 'sushi/evm'
import { defaultQuoteCurrency, isWNativeSupported } from 'sushi/evm'
import { type EvmCurrency, EvmNative } from 'sushi/evm'
import type { Address } from 'viem'

const getTokenAsString = (token: EvmCurrency | string) =>
  typeof token === 'string'
    ? token
    : token.isNative
      ? 'NATIVE'
      : token.wrap().address
const getDefaultCurrency = (chainId: number) =>
  getTokenAsString(
    defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency],
  )

const isStable = (token: EvmCurrency | undefined): boolean => {
  if (!token || !token.symbol) return false
  const stables = STABLES[token.chainId]
  if (stables.some((stable) => stable.address === token.wrap().address)) {
    return true
  }
  return false
}

interface State {
  mutate: {
    setToken1(token1: EvmCurrency | string): void
  }
  state: {
    token1: EvmCurrency
    chainId: EvmChainId
    isLoading: boolean
  }
}

const ChartContext = createContext<State>({} as State)

interface ChartProviderProps {
  children: React.ReactNode
}

/* Parses the URL and provides the chainId, token0, and token1 globally.
 * URL example:
 * /swap?token0=NATIVE
 */
const ChartProvider: FC<ChartProviderProps> = ({ children }) => {
  const { chainId: _chainId } = useParams()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [localTokenCache, setLocalTokenCache] = useState<
    Map<string, EvmCurrency>
  >(new Map())
  const [storedValue, setValue] = useLocalStorage('chart-token', '')
  const isMounted = useIsMounted()
  const { createQuery } = useCreateQuery()
  const chainIdFromPath = Number(_chainId) as ChainId

  const chainId0 = (
    Number(searchParams.get('chainId0')) !== 0
      ? Number(searchParams.get('chainId0'))
      : chainIdFromPath || EvmChainId.ETHEREUM
  ) as EvmChainId

  const chainId1 = (
    Number(searchParams.get('chainId1')) !== 0
      ? Number(searchParams.get('chainId1'))
      : chainIdFromPath || EvmChainId.ETHEREUM
  ) as EvmChainId

  // Only a string, not a whole URLSearchParams object
  const token1Param = useMemo(() => {
    const current = searchParams.get('token1')
    if (current) {
      // persist once mounted (won’t change on every render)
      if (isMounted) setValue(current)
      return current
    }
    const def = storedValue || getDefaultCurrency(chainId1)
    if (isMounted && !current) setValue(def)
    return def
    // Depend on primitives; avoid defaultedParams identity churn
  }, [chainId1, isMounted, searchParams, storedValue, setValue])

  const token0Param = useMemo(
    () => searchParams.get('token0') ?? '',
    [searchParams],
  )

  const token0FromLocalCache = localTokenCache.get(token0Param)
  const { data: token0FromCache } = useTokenWithCache({
    chainId: chainId0,
    address: token0Param as Address,
    enabled: isEvmAddress(token0Param) && !token0FromLocalCache,
    keepPreviousData: false,
  })
  const token0 = token0FromLocalCache ?? token0FromCache

  const token1FromLocalCache = localTokenCache.get(token1Param)
  const { data: token1FromCache, isLoading: token1Loading } = useTokenWithCache(
    {
      chainId: chainId1,
      address: token1Param as Address,
      enabled: isEvmAddress(token1Param) && !token1FromLocalCache,
      keepPreviousData: false,
    },
  )
  const token1Fetched = token1FromLocalCache ?? token1FromCache

  // Memoize the native token so it doesn't become a new object each render
  const nativeToken1 = useMemo(() => {
    if (isWNativeSupported(chainId1)) {
      return EvmNative.fromChainId(chainId1)
    }
    return undefined
  }, [chainId1])

  const token1Resolved: EvmCurrency | undefined = useMemo(() => {
    const resolved = token1Param === 'NATIVE' ? nativeToken1 : token1Fetched

    if (resolved && token0 && isStable(resolved) && !isStable(token0)) {
      return token0
    }
    return resolved
  }, [token1Param, nativeToken1, token1Fetched, token0])

  const push = useCallback((path: string) => {
    const newUrl = new URL(`${window.location.origin}${path}`).toString()
    window.history.pushState({}, '', newUrl)
  }, [])

  const baseParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams],
  )

  const createQueryString = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(baseParamsString)
      for (const { name, value } of values) {
        if (value === null) params.delete(name)
        else params.set(name, value)
      }
      return params.toString()
    },
    [baseParamsString],
  )

  const setToken1 = useCallback(
    (_token1: string | EvmCurrency) => {
      const str = getTokenAsString(_token1)
      setValue(str)
      //if new token is token0 return early
      if (str === token0Param) {
        return
      }

      if (typeof _token1 !== 'string') {
        // don't mutate the same Map reference; create a new Map to avoid subtle effects
        setLocalTokenCache((prev) => {
          const next = new Map(prev)
          next.set(str, _token1)
          return next
        })
        const _chainId = String(_token1.chainId)
        createQuery([
          { name: 'token1', value: str },
          { name: 'chainId1', value: _chainId },
        ])
        return
      }

      // string path update
      push(`${pathname}?${createQueryString([{ name: 'token1', value: str }])}`)
    },
    [createQuery, createQueryString, pathname, token0Param, push, setValue],
  )

  const contextValue = useMemo<State>(() => {
    const effectiveToken1 =
      token1Resolved ??
      defaultQuoteCurrency[chainId1 as keyof typeof defaultQuoteCurrency]

    return {
      mutate: { setToken1 },
      state: {
        chainId: chainId1,
        token1: effectiveToken1,
        isLoading: token1Loading,
      },
    }
  }, [chainId1, token1Resolved, token1Loading, setToken1])

  return (
    <ChartContext.Provider value={contextValue}>
      {children}
    </ChartContext.Provider>
  )
}

const useChartContext = () => {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error('Hook can only be used inside Chart Provider')
  }

  return context
}

export { useChartContext, ChartProvider }
