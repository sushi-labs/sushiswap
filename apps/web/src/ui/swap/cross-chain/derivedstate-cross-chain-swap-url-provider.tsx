'use client'

import { nanoid } from 'nanoid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { isXSwapSupportedChainId } from 'src/config'
import { useCrossChainTradeRoutes as _useCrossChainTradeRoutes } from 'src/lib/hooks/react-query'
import { replaceNetworkSlug } from 'src/lib/network'
import type { CrossChainRouteOrder } from 'src/lib/swap/cross-chain'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { ChainKey, EvmChainId } from 'sushi/chain'
import { defaultQuoteCurrency } from 'sushi/config'
import { defaultCurrency } from 'sushi/config'
import { Native, type Type, tryParseAmount } from 'sushi/currency'
import { type Address, isAddress } from 'viem'
import { DerivedStateCrossChainSwapContext } from './derivedstate-cross-chain-swap-context'

const getTokenAsString = (token: Type | string) =>
  typeof token === 'string'
    ? token
    : token.isNative
      ? 'NATIVE'
      : token.wrapped.address
const getDefaultCurrency = (chainId: number) =>
  getTokenAsString(defaultCurrency[chainId as keyof typeof defaultCurrency])
const getQuoteCurrency = (chainId: number) =>
  getTokenAsString(
    defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency],
  )

interface DerivedStateCrossChainSwapUrlProviderProps {
  children: React.ReactNode
  defaultChainId: EvmChainId
}

/* Parses the URL and provides the chainId, token0, and token1 globally.
 * URL example:
 * /swap?chainId1=2token0=NATIVE&token1=0x6b3595068778dd592e39a122f4f5a5cf09c90fe2
 *
 * If no chainId is provided, it defaults to current connected chainId or Ethereum if wallet is not connected.
 */
export const DerivedstateCrossChainSwapUrlProvider: FC<
  DerivedStateCrossChainSwapUrlProviderProps
> = ({ children, defaultChainId }) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tradeId, setTradeId] = useState(nanoid())
  const [chainId, setChainId] = useState<number>(defaultChainId)
  const [selectedBridge, setSelectedBridge] = useState<string | undefined>(
    undefined,
  )
  const [routeOrder, setRouteOrder] = useState<CrossChainRouteOrder>('CHEAPEST')

  const chainId0 = isXSwapSupportedChainId(chainId)
    ? chainId
    : EvmChainId.ETHEREUM

  // Get the searchParams and complete with defaults.
  // This handles the case where some params might not be provided by the user
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))

    if (!params.has('chainId1'))
      params.set(
        'chainId1',
        chainId0 === EvmChainId.ARBITRUM
          ? EvmChainId.ETHEREUM.toString()
          : EvmChainId.ARBITRUM.toString(),
      )
    if (!params.has('token0'))
      params.set('token0', getDefaultCurrency(chainId0))
    if (!params.has('token1'))
      params.set('token1', getQuoteCurrency(Number(params.get('chainId1'))))

    return params
  }, [chainId0, searchParams])

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

  // Switch token0 and token1
  const switchTokens = useCallback(() => {
    const params = new URLSearchParams(defaultedParams)
    const chainId1 = params.get('chainId1')
    const token0 = params.get('token0')
    const token1 = params.get('token1')

    const pathSegments = pathname.split('/')
    pathSegments[1] = ChainKey[Number(chainId1) as EvmChainId]

    // Can safely cast as defaultedParams are always defined
    history.pushState(
      null,
      '',
      `${replaceNetworkSlug(
        Number(chainId1) as EvmChainId,
        pathname,
      )}?${createQueryString([
        { name: 'swapAmount', value: null },
        { name: 'token0', value: token1 as string },
        { name: 'token1', value: token0 as string },
        { name: 'chainId1', value: chainId0.toString() },
      ])}`,
    )

    setChainId(Number(chainId1))
  }, [pathname, defaultedParams, chainId0, createQueryString])

  // Update the URL with new from chainId
  const setChainId0 = useCallback(
    (chainId: number) => {
      if (defaultedParams.get('chainId1') === chainId.toString()) {
        switchTokens()
      } else {
        history.pushState(
          null,
          '',
          `${replaceNetworkSlug(
            chainId as EvmChainId,
            pathname,
          )}?${createQueryString([
            { name: 'swapAmount', value: null },
            { name: 'token0', value: getDefaultCurrency(chainId0) },
          ])}`,
        )

        setChainId(chainId)
      }
    },
    [createQueryString, defaultedParams, pathname, switchTokens, chainId0],
  )

  // Update the URL with new to chainId
  const setChainId1 = useCallback(
    (chainId: number) => {
      if (chainId0 === chainId) {
        switchTokens()
      } else {
        push(
          `${pathname}?${createQueryString([
            { name: 'swapAmount', value: null },
            { name: 'chainId1', value: chainId.toString() },
            { name: 'token1', value: getQuoteCurrency(chainId) },
          ])}`,
          { scroll: false },
        )
      }
    },
    [createQueryString, pathname, push, switchTokens, chainId0],
  )

  // Update the URL with a new token0
  const setToken0 = useCallback(
    (_token0: string | Type) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(_token0)
      push(
        `${pathname}?${createQueryString([{ name: 'token0', value: token0 }])}`,
        { scroll: false },
      )
    },
    [createQueryString, pathname, push],
  )

  // Update the URL with a new token1
  const setToken1 = useCallback(
    (_token1: string | Type) => {
      // If entity is provided, parse it to a string
      const token1 = getTokenAsString(_token1)
      push(
        `${pathname}?${createQueryString([{ name: 'token1', value: token1 }])}`,
        { scroll: false },
      )
    },
    [createQueryString, pathname, push],
  )

  // Update the URL with both tokens
  const setTokens = useCallback(
    (_token0: string | Type, _token1: string | Type) => {
      // If entity is provided, parse it to a string
      const token0 = getTokenAsString(_token0)
      const token1 = getTokenAsString(_token1)

      push(
        `${pathname}?${createQueryString([
          { name: 'token0', value: token0 },
          { name: 'token1', value: token1 },
        ])}`,
        { scroll: false },
      )
    },
    [createQueryString, pathname, push],
  )

  // Update the URL with a new swapAmount
  const setSwapAmount = useCallback(
    (swapAmount: string) => {
      push(
        `${pathname}?${createQueryString([
          { name: 'swapAmount', value: swapAmount },
        ])}`,
        { scroll: false },
      )
    },
    [createQueryString, pathname, push],
  )

  // Derive chainId from defaultedParams
  const chainId1 = Number(defaultedParams.get('chainId1')) as EvmChainId

  // Derive token0
  const { data: token0, isInitialLoading: token0Loading } = useTokenWithCache({
    chainId: chainId0,
    address: defaultedParams.get('token0') as Address,
    enabled: isAddress(defaultedParams.get('token0') as string, {
      strict: false,
    }),
    keepPreviousData: false,
  })

  // Derive token1
  const { data: token1, isInitialLoading: token1Loading } = useTokenWithCache({
    chainId: chainId1,
    address: defaultedParams.get('token1') as Address,
    enabled: isAddress(defaultedParams.get('token1') as string, {
      strict: false,
    }),
    keepPreviousData: false,
  })

  const swapAmountString = defaultedParams.get('swapAmount') || ''

  const [_token0, _token1] = useMemo(
    () => [
      defaultedParams.get('token0') === 'NATIVE'
        ? Native.onChain(chainId0)
        : token0,
      defaultedParams.get('token1') === 'NATIVE'
        ? Native.onChain(chainId1)
        : token1,
    ],
    [defaultedParams, chainId0, chainId1, token0, token1],
  )

  const swapAmount = useMemo(
    () => tryParseAmount(swapAmountString, _token0),
    [_token0, swapAmountString],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setSelectedBridge(undefined)
  }, [swapAmount, routeOrder])

  return (
    <DerivedStateCrossChainSwapContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setChainId0,
            setChainId1,
            setToken0,
            setToken1,
            setTokens,
            setTradeId,
            switchTokens,
            setSwapAmount,
            setSelectedBridge,
            setRouteOrder,
          },
          state: {
            tradeId,
            recipient: undefined,
            chainId0,
            chainId1,
            swapAmountString,
            swapAmount,
            token0: _token0,
            token1: _token1,
            selectedBridge,
            routeOrder,
          },
          isLoading: token0Loading || token1Loading,
          isToken0Loading: token0Loading,
          isToken1Loading: token1Loading,
        }
      }, [
        chainId0,
        chainId1,
        setChainId0,
        setChainId1,
        setSwapAmount,
        setToken0,
        setToken1,
        setTokens,
        switchTokens,
        swapAmount,
        swapAmountString,
        _token0,
        token0Loading,
        _token1,
        token1Loading,
        tradeId,
        selectedBridge,
        routeOrder,
      ])}
    >
      {children}
    </DerivedStateCrossChainSwapContext.Provider>
  )
}
