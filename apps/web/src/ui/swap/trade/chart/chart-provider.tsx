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
import { type ChainKey, getChainByKey } from 'sushi'
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
  const [localTokenCache, setLocalTokenCache] = useState<
    Map<string, EvmCurrency>
  >(new Map())
  const pathname = usePathname()
  const [storedValue, setValue] = useLocalStorage('chart-token', '')
  const isMounted = useIsMounted()
  const { createQuery } = useCreateQuery()

  const networkNameFromPath = pathname.split('/')[1]
  const chainIdFromPath = getChainByKey(
    networkNameFromPath as ChainKey,
  )?.chainId

  const chainId0 = (
    Number(searchParams.get('chainId0')) !== 0
      ? Number(searchParams.get('chainId0'))
      : chainIdFromPath
        ? chainIdFromPath
        : EvmChainId.ETHEREUM
  ) as EvmChainId

  const chainId1 = (
    Number(searchParams.get('chainId1')) !== 0
      ? Number(searchParams.get('chainId1'))
      : chainIdFromPath
        ? chainIdFromPath
        : EvmChainId.ETHEREUM
  ) as EvmChainId

  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)

    if (!params.has('token1')) {
      if (storedValue) {
        if (isMounted) params.set('token1', storedValue)
        return params
      }
      params.set('token1', getDefaultCurrency(chainId1))
    }
    if (params.get('token1')) {
      if (isMounted) setValue(params.get('token1') as string)
    }

    return params
  }, [chainId1, searchParams, storedValue, setValue, isMounted])

  const token0Param = defaultedParams.get('token0') as string
  const token0FromLocalCache = localTokenCache.get(token0Param)

  const { data: token0FromCache } = useTokenWithCache({
    chainId: chainId0,
    address: token0Param as Address,
    enabled: isEvmAddress(token0Param) && !token0FromLocalCache,
    keepPreviousData: false,
  })

  const token0 = token0FromLocalCache ?? token0FromCache

  const token1Param = defaultedParams.get('token1') as string
  const token1FromLocalCache = localTokenCache.get(token1Param)

  const { data: token1FromCache, isLoading: token1Loading } = useTokenWithCache(
    {
      chainId: chainId1,
      address: token1Param as Address,
      enabled: isEvmAddress(token1Param) && !token1FromLocalCache,
      keepPreviousData: false,
    },
  )
  const token1 = token1FromLocalCache ?? token1FromCache

  const push = useCallback((path: string) => {
    const newUrl = new URL(`${window.location.origin}${path}`).toString()
    window.history.pushState({}, '', newUrl)
  }, [])

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

  const setToken1 = useCallback<(_token1: string | EvmCurrency) => void>(
    async (_token1) => {
      // If entity is provided, parse it to a string
      let _chainId = ''
      const token1 = getTokenAsString(_token1)
      setValue(token1)

      if (typeof _token1 !== 'string') {
        setLocalTokenCache(localTokenCache.set(token1, _token1))
        _chainId = _token1.chainId.toString()
      }

      if (_chainId) {
        createQuery([
          { name: 'token1', value: token1 },
          { name: 'chainId1', value: _chainId },
        ])
      } else {
        push(
          `${pathname}?${createQueryString([{ name: 'token1', value: token1 }])}`,
        )
      }
    },
    [createQueryString, localTokenCache, pathname, push, setValue, createQuery],
  )

  return (
    <ChartContext.Provider
      value={useMemo(() => {
        const _token0 =
          defaultedParams.get('token0') === 'NATIVE' &&
          isWNativeSupported(chainId0 as EvmChainId)
            ? EvmNative.fromChainId(chainId0 as EvmChainId)
            : token0

        let _token1 =
          defaultedParams.get('token1') === 'NATIVE' &&
          isWNativeSupported(chainId1)
            ? EvmNative.fromChainId(chainId1)
            : token1

        if (isStable(_token1) && _token0 && !isStable(_token0)) {
          _token1 = _token0
        }

        return {
          mutate: {
            setToken1,
          },
          state: {
            chainId: chainId1,
            token1:
              _token1 ??
              defaultQuoteCurrency[
                chainId1 as keyof typeof defaultQuoteCurrency
              ],
            isLoading: token1Loading,
          },
        }
      }, [
        chainId1,
        defaultedParams,
        setToken1,
        token1,
        token1Loading,
        token0,
        chainId0,
      ])}
    >
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
