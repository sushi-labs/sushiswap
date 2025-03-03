'use client'

import { nanoid } from 'nanoid'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { isXSwapSupportedChainId } from 'src/config'
import type { CrossChainRouteOrder } from 'src/lib/swap/cross-chain'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { EvmChainId } from 'sushi/chain'
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

interface DerivedStateCrossChainSwapProviderProps {
  children: React.ReactNode
  defaultChainId: EvmChainId
  defaultToken0?: string
}

export const DerivedstateCrossChainSwapProvider: FC<
  DerivedStateCrossChainSwapProviderProps
> = ({ children, defaultChainId, defaultToken0 }) => {
  const [tradeId, setTradeId] = useState(nanoid())
  const [chainId, setChainId] = useState<number>(defaultChainId)
  const [selectedBridge, setSelectedBridge] = useState<string | undefined>(
    undefined,
  )
  const [routeOrder, setRouteOrder] = useState<CrossChainRouteOrder>('CHEAPEST')
  const [swapAmountString, setSwapAmountString] = useState('')

  const chainId0 = isXSwapSupportedChainId(chainId)
    ? chainId
    : EvmChainId.ETHEREUM
  const [chainId1, setChainId1] = useState<EvmChainId>(
    chainId0 === EvmChainId.ARBITRUM
      ? EvmChainId.ETHEREUM
      : EvmChainId.ARBITRUM,
  )

  const [token0String, setToken0String] = useState(() => {
    if (defaultToken0) {
      return defaultToken0
    }
    return getDefaultCurrency(chainId0)
  })
  const [token1String, setToken1String] = useState(() =>
    getQuoteCurrency(chainId1),
  )

  // Switch token0 and token1
  const switchTokens = useCallback(() => {
    const tempToken = token0String

    setChainId(chainId1)
    setToken0String(token1String)
    setToken1String(tempToken)
    setSwapAmountString('')
  }, [chainId1, token0String, token1String])

  // Update chainId0
  const setChainId0 = useCallback(
    (newChainId: number) => {
      if (chainId1 === newChainId) {
        switchTokens()
      } else {
        setChainId(newChainId)
        setToken0String(getDefaultCurrency(newChainId))
        setSwapAmountString('')
      }
    },
    [chainId1, switchTokens],
  )

  // Update chainId1
  const setChainId1Callback = useCallback(
    (newChainId: number) => {
      if (chainId0 === newChainId) {
        switchTokens()
      } else {
        setChainId1(newChainId as EvmChainId)
        setToken1String(getQuoteCurrency(newChainId))
        setSwapAmountString('')
      }
    },
    [chainId0, switchTokens],
  )

  // Update token0
  const setToken0 = useCallback((_token0: string | Type) => {
    const token0 = getTokenAsString(_token0)
    setToken0String(token0)
  }, [])

  // Update token1
  const setToken1 = useCallback((_token1: string | Type) => {
    const token1 = getTokenAsString(_token1)
    setToken1String(token1)
  }, [])

  // Update both tokens
  const setTokens = useCallback(
    (_token0: string | Type, _token1: string | Type) => {
      const token0 = getTokenAsString(_token0)
      const token1 = getTokenAsString(_token1)
      setToken0String(token0)
      setToken1String(token1)
    },
    [],
  )

  // Derive token0
  const { data: token0FromCache, isInitialLoading: token0Loading } =
    useTokenWithCache({
      chainId: chainId0,
      address: token0String as Address,
      enabled: isAddress(token0String, { strict: false }),
      keepPreviousData: false,
    })

  // Derive token1
  const { data: token1FromCache, isInitialLoading: token1Loading } =
    useTokenWithCache({
      chainId: chainId1,
      address: token1String as Address,
      enabled: isAddress(token1String, { strict: false }),
      keepPreviousData: false,
    })

  const [_token0, _token1] = useMemo(
    () => [
      token0String === 'NATIVE' ? Native.onChain(chainId0) : token0FromCache,
      token1String === 'NATIVE' ? Native.onChain(chainId1) : token1FromCache,
    ],
    [
      token0String,
      token1String,
      chainId0,
      chainId1,
      token0FromCache,
      token1FromCache,
    ],
  )

  const swapAmount = useMemo(
    () => tryParseAmount(swapAmountString, _token0),
    [_token0, swapAmountString],
  )

  // Reset selected bridge when amount or route order changes
  useEffect(() => {
    setSelectedBridge(undefined)
  }, [swapAmount, routeOrder])

  return (
    <DerivedStateCrossChainSwapContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setChainId0,
            setChainId1: setChainId1Callback,
            setToken0,
            setToken1,
            setTokens,
            setTradeId,
            switchTokens,
            setSwapAmount: setSwapAmountString,
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
        setChainId1Callback,
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
