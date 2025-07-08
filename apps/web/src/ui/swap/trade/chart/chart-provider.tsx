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
// import { type SupportedChainId, isSupportedChainId } from "src/config";
import { useCreateQuery } from 'src/lib/hooks/useCreateQuery'
import { getNetworkKey } from 'src/lib/network'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { type ChainId, ChainNetworkNameKey, EvmChainId } from 'sushi'
import { isEvmChainId } from 'sushi/chain'
import {
  defaultCurrency,
  defaultQuoteCurrency,
  isWNativeSupported,
} from 'sushi/config'
import { Native, type Type } from 'sushi/currency'
import { type Address, isAddress } from 'viem'
import { useSwitchChain } from 'wagmi'

const getTokenAsString = (token: Type | string) =>
  typeof token === 'string'
    ? token
    : token.isNative
      ? 'NATIVE'
      : token.wrapped.address
const getDefaultCurrency = (chainId: number) =>
  getTokenAsString(defaultCurrency[chainId as keyof typeof defaultCurrency])

interface State {
  mutate: {
    setToken0(token0: Type | string): void
  }
  state: {
    token0: Type
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
  // const chainId =
  //   _chainId && isSupportedChainId(+_chainId)
  //     ? (+_chainId as SupportedChainId)
  //     : EvmChainId.ETHEREUM

  const searchParams = useSearchParams()
  const [localTokenCache, setLocalTokenCache] = useState<Map<string, Type>>(
    new Map(),
  )
  const pathname = usePathname()
  const [storedValue, setValue] = useLocalStorage('chart-token', '')
  const isMounted = useIsMounted()
  const { switchChainAsync } = useSwitchChain()
  const { createQuery } = useCreateQuery()

  const networkNameFromPath = pathname.split('/')[1]
  const chainIdFromPath =
    ChainNetworkNameKey[networkNameFromPath as keyof typeof ChainNetworkNameKey]

  const chainId = (
    Number(searchParams.get('chainId0')) !== 0
      ? Number(searchParams.get('chainId0'))
      : chainIdFromPath
        ? chainIdFromPath
        : EvmChainId.ETHEREUM
  ) as EvmChainId

  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)

    if (!params.has('token0')) {
      if (storedValue) {
        if (isMounted) params.set('token0', storedValue)
        return params
      }
      params.set('token0', getDefaultCurrency(chainId))
    }
    if (params.get('token0')) {
      if (isMounted) setValue(params.get('token0') as string)
    }

    return params
  }, [chainId, searchParams, storedValue, setValue, isMounted])

  const token0Param = defaultedParams.get('token0') as string
  const token0FromLocalCache = localTokenCache.get(token0Param)

  const { data: token0FromCache, isLoading: token0Loading } = useTokenWithCache(
    {
      chainId: chainId,
      address: token0Param as Address,
      enabled:
        isAddress(token0Param, { strict: false }) && !token0FromLocalCache,
      keepPreviousData: false,
    },
  )

  const token0 = token0FromLocalCache ?? token0FromCache

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

  const setToken0 = useCallback<(_token0: string | Type) => void>(
    async (_token0) => {
      // If entity is provided, parse it to a string
      let _chainId = ''
      const token0 = getTokenAsString(_token0)
      setValue(token0)

      if (typeof _token0 !== 'string') {
        setLocalTokenCache(localTokenCache.set(token0, _token0))
        _chainId = _token0.chainId.toString()
      }

      if (_chainId) {
        if (isEvmChainId(Number(_chainId))) {
          await switchChainAsync({ chainId: Number(_chainId) as EvmChainId })
        }
        createQuery(
          [
            { name: 'token0', value: token0 },
            { name: 'chainId0', value: _chainId },
            { name: 'swapAmount', value: null },
          ],
          `/${getNetworkKey(Number(_chainId) as ChainId)}/swap/advanced`,
        )
      } else {
        push(
          `${pathname}?${createQueryString([{ name: 'token0', value: token0 }])}`,
        )
      }
    },
    [
      createQueryString,
      localTokenCache,
      pathname,
      push,
      setValue,
      createQuery,
      switchChainAsync,
    ],
  )

  return (
    <ChartContext.Provider
      value={useMemo(() => {
        const _token0 =
          defaultedParams.get('token0') === 'NATIVE' &&
          isWNativeSupported(chainId)
            ? Native.onChain(chainId)
            : token0

        return {
          mutate: {
            setToken0,
          },
          state: {
            chainId,
            token0: _token0 ?? defaultCurrency[chainId],
            isLoading: token0Loading,
          },
        }
      }, [chainId, defaultedParams, setToken0, token0, token0Loading])}
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
