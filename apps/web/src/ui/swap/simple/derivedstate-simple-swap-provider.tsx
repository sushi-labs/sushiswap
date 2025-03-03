'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import { EvmChainId } from 'sushi/chain'
import {
  defaultCurrency,
  defaultQuoteCurrency,
  isWNativeSupported,
} from 'sushi/config'
import { Native, type Type, tryParseAmount } from 'sushi/currency'
import type { Percent } from 'sushi/math'
import { type Address, isAddress } from 'viem'
import { useAccount } from 'wagmi'
import { type SupportedChainId, isSupportedChainId } from '../../../config'
import { DerivedStateSimpleSwapContext } from './derivedstate-simple-swap-context'

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

interface DerivedStateSimpleSwapProviderProps {
  children: React.ReactNode
  chainId?: SupportedChainId
  defaultToken0?: string
}

export const DerivedstateSimpleSwapProvider: FC<
  DerivedStateSimpleSwapProviderProps
> = ({ children, chainId: providedChainId, defaultToken0 }) => {
  const { address } = useAccount()
  const [tokenTax, setTokenTax] = useState<Percent | false | undefined>(
    undefined,
  )
  const [localTokenCache, setLocalTokenCache] = useState<Map<string, Type>>(
    new Map(),
  )
  const [swapAmountString, setSwapAmountString] = useState('')
  const [token0String, setToken0String] = useState(() => {
    if (defaultToken0) {
      return defaultToken0
    }
    return getDefaultCurrency(providedChainId ?? EvmChainId.ETHEREUM)
  })
  const [token1String, setToken1String] = useState(() =>
    getQuoteCurrency(providedChainId ?? EvmChainId.ETHEREUM),
  )

  const chainId =
    providedChainId && isSupportedChainId(providedChainId)
      ? providedChainId
      : EvmChainId.ETHEREUM

  const token0FromLocalCache = localTokenCache.get(token0String)
  const token1FromLocalCache = localTokenCache.get(token1String)

  // Derive token0
  const { data: token0FromCache, isInitialLoading: token0Loading } =
    useTokenWithCache({
      chainId,
      address: token0String as Address,
      enabled:
        isAddress(token0String, { strict: false }) && !token0FromLocalCache,
      keepPreviousData: false,
    })

  // Derive token1
  const { data: token1FromCache, isInitialLoading: token1Loading } =
    useTokenWithCache({
      chainId,
      address: token1String as Address,
      enabled:
        isAddress(token1String, { strict: false }) && !token1FromLocalCache,
      keepPreviousData: false,
    })

  const token0 = token0FromLocalCache ?? token0FromCache
  const token1 = token1FromLocalCache ?? token1FromCache

  // Switch token0 and token1
  const switchTokens = useCallback(() => {
    setToken0String(token1String)
    setToken1String(token0String)
    setSwapAmountString('')
  }, [token0String, token1String])

  // Update token0
  const setToken0 = useCallback<(_token0: string | Type) => void>(
    (_token0) => {
      const token0 = getTokenAsString(_token0)

      if (typeof _token0 !== 'string') {
        setLocalTokenCache(new Map(localTokenCache.set(token0, _token0)))
      }

      if (token1String.toLowerCase() === token0.toLowerCase()) {
        switchTokens()
      } else {
        setToken0String(token0)
      }
    },
    [localTokenCache, switchTokens, token1String],
  )

  // Update token1
  const setToken1 = useCallback<(_token1: string | Type) => void>(
    (_token1) => {
      const token1 = getTokenAsString(_token1)

      if (typeof _token1 !== 'string') {
        setLocalTokenCache(new Map(localTokenCache.set(token1, _token1)))
      }

      if (token0String.toLowerCase() === token1.toLowerCase()) {
        switchTokens()
      } else {
        setToken1String(token1)
      }
    },
    [localTokenCache, switchTokens, token0String],
  )

  // Update both tokens
  const setTokens = useCallback<
    (_token0: string | Type, _token1: string | Type) => void
  >(
    (_token0, _token1) => {
      const token0 = getTokenAsString(_token0)
      const token1 = getTokenAsString(_token1)

      if (typeof _token0 !== 'string') {
        setLocalTokenCache(new Map(localTokenCache.set(token0, _token0)))
      }
      if (typeof _token1 !== 'string') {
        setLocalTokenCache(new Map(localTokenCache.set(token1, _token1)))
      }

      setToken0String(token0)
      setToken1String(token1)
    },
    [localTokenCache],
  )

  return (
    <DerivedStateSimpleSwapContext.Provider
      value={useMemo(() => {
        const _token0 =
          token0String === 'NATIVE' && isWNativeSupported(chainId)
            ? Native.onChain(chainId)
            : token0
        const _token1 =
          token1String === 'NATIVE' && isWNativeSupported(chainId)
            ? Native.onChain(chainId)
            : token1

        return {
          mutate: {
            setToken0,
            setToken1,
            setTokens,
            switchTokens,
            setSwapAmount: setSwapAmountString,
            setTokenTax,
          },
          state: {
            recipient: address ?? '',
            chainId,
            swapAmountString,
            swapAmount: tryParseAmount(swapAmountString, _token0),
            token0: _token0,
            token1: _token1,
            tokenTax,
          },
          isLoading: token0Loading || token1Loading,
          isToken0Loading: token0Loading,
          isToken1Loading: token1Loading,
        }
      }, [
        setToken0,
        setToken1,
        setTokens,
        switchTokens,
        token0String,
        token1String,
        token0,
        token1,
        token0Loading,
        token1Loading,
        chainId,
        address,
        tokenTax,
        swapAmountString,
      ])}
    >
      {children}
    </DerivedStateSimpleSwapContext.Provider>
  )
}
