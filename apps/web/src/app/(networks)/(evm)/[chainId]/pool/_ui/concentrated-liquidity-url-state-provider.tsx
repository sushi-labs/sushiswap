'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { useTokenWithCache } from 'src/lib/wagmi/hooks/tokens/useTokenWithCache'
import {
  EvmChainId,
  type EvmCurrency,
  EvmNative,
  type EvmToken,
  SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
  type SushiSwapV3ChainId,
  SushiSwapV3FeeAmount,
  currencyFromShortCurrencyName,
  isShortCurrencyName,
  isWNativeSupported,
} from 'sushi/evm'
import { type Address, isAddress } from 'viem'
import * as z from 'zod'

export const queryParamsSchema = z.object({
  fromCurrency: z.nullable(z.string()).transform((value) => value ?? 'NATIVE'),
  toCurrency: z.nullable(z.string()).transform((value) => value ?? 'SUSHI'),
  feeAmount: z.coerce
    .number()
    .int()
    .default(SushiSwapV3FeeAmount.MEDIUM)
    .transform((fee) => fee as SushiSwapV3FeeAmount),
  tokenId: z.coerce
    .number()
    .int()
    .nullable()
    .transform((val) => val?.toString())
    .optional(),
})

type State = {
  tokenId: string | undefined
  chainId: SushiSwapV3ChainId
  token0: EvmCurrency | undefined
  token1: EvmCurrency | undefined
  tokensLoading: boolean
  feeAmount: SushiSwapV3FeeAmount
  setToken0(currency: EvmCurrency): void
  setToken1(currency: EvmCurrency): void
  setFeeAmount(feeAmount: SushiSwapV3FeeAmount): void
  switchTokens(): void
}

export const ConcentratedLiquidityUrlStateContext = createContext<State>(
  {} as State,
)

interface ConcentratedLiquidityURLStateProvider {
  children: ReactNode | ((state: State) => ReactNode)
  chainId: SushiSwapV3ChainId
  supportedNetworks?: EvmChainId[]
}

const getTokenFromUrl = (
  chainId: EvmChainId,
  currencyId: string | undefined | null,
  token: EvmToken | undefined,
  isLoading: boolean,
) => {
  if (isLoading) {
    return undefined
  } else if (currencyId && isShortCurrencyName(chainId, currencyId)) {
    return currencyFromShortCurrencyName(chainId, currencyId)
  } else if (currencyId && isAddress(currencyId) && token) {
    return token
  } else if (!currencyId || !isWNativeSupported(chainId)) {
    return undefined
  } else {
    return EvmNative.fromChainId(chainId ? chainId : EvmChainId.ETHEREUM)
  }
}

export const ConcentratedLiquidityURLStateProvider: FC<
  ConcentratedLiquidityURLStateProvider
> = ({
  children,
  chainId,
  supportedNetworks = SUSHISWAP_V3_SUPPORTED_CHAIN_IDS,
}) => {
  const { push } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()!

  const { fromCurrency, toCurrency, feeAmount, tokenId } =
    queryParamsSchema.parse({
      fromCurrency: searchParams.get('fromCurrency'),
      toCurrency: searchParams.get('toCurrency'),
      feeAmount: searchParams.get('feeAmount'),
      tokenId: searchParams.get('tokenId'),
    })

  const _chainId = supportedNetworks?.includes(chainId)
    ? chainId
    : EvmChainId.ETHEREUM

  const { data: tokenFrom, isInitialLoading: isTokenFromLoading } =
    useTokenWithCache({
      chainId: _chainId,
      address: fromCurrency as Address,
      enabled: isAddress(fromCurrency, { strict: false }),
    })

  const { data: tokenTo, isInitialLoading: isTokenToLoading } =
    useTokenWithCache({
      chainId: _chainId,
      address: toCurrency as Address,
      enabled: isAddress(toCurrency, { strict: false }),
    })

  const state = useMemo(() => {
    const token0 = getTokenFromUrl(
      _chainId,
      fromCurrency,
      tokenFrom,
      isTokenFromLoading,
    )
    let token1 = getTokenFromUrl(
      _chainId,
      toCurrency,
      tokenTo,
      isTokenToLoading,
    )

    // Cant have two of the same tokens
    if (
      token1?.wrap().address === token0?.wrap().address ||
      (token0 && token1 && token0.chainId !== token1.chainId)
    ) {
      token1 = undefined
    }

    const setToken0 = (currency: EvmCurrency) => {
      const same = currency.wrap().address === token1?.wrap().address
      const _fromCurrency =
        currency.type === 'native' ? 'NATIVE' : currency.wrap().address
      const _searchParams = new URLSearchParams(
        Array.from(searchParams.entries()),
      )
      _searchParams.set('fromCurrency', _fromCurrency)
      if (toCurrency) {
        _searchParams.set(
          'toCurrency',
          toCurrency === _fromCurrency || same ? fromCurrency : toCurrency,
        )
      }
      void push(`${pathname}?${_searchParams.toString()}`, { scroll: false })
    }
    const setToken1 = (currency: EvmCurrency) => {
      const same = currency.wrap().address === token0?.wrap().address
      const _toCurrency =
        currency.type === 'native' ? 'NATIVE' : currency.wrap().address
      const _searchParams = new URLSearchParams(
        Array.from(searchParams.entries()),
      )
      _searchParams.set('toCurrency', _toCurrency)
      if (fromCurrency) {
        _searchParams.set(
          'fromCurrency',
          fromCurrency === _toCurrency || same ? toCurrency : fromCurrency,
        )
      }
      void push(`${pathname}?${_searchParams.toString()}`, { scroll: false })
    }
    const setFeeAmount = (feeAmount: SushiSwapV3FeeAmount) => {
      const _searchParams = new URLSearchParams(
        Array.from(searchParams.entries()),
      )
      _searchParams.set('feeAmount', feeAmount.toString())
      void push(`${pathname}?${_searchParams.toString()}`, { scroll: false })
    }
    const switchTokens = () => {
      const _searchParams = new URLSearchParams(
        Array.from(searchParams.entries()),
      )
      _searchParams.set(
        'fromCurrency',
        !token1 || token1.type === 'native' ? 'NATIVE' : token1.wrap().address,
      )
      _searchParams.set(
        'toCurrency',
        !token0 || token0.type === 'native' ? 'NATIVE' : token0.wrap().address,
      )
      void push(`${pathname}?${_searchParams.toString()}`, { scroll: false })
    }

    return {
      tokenId,
      feeAmount,
      token0,
      token1,
      chainId: _chainId,
      tokensLoading: isTokenFromLoading || isTokenToLoading,
      setToken0,
      setToken1,
      setFeeAmount,
      switchTokens,
    }
  }, [
    _chainId,
    fromCurrency,
    tokenFrom,
    isTokenFromLoading,
    toCurrency,
    tokenTo,
    isTokenToLoading,
    tokenId,
    feeAmount,
    searchParams,
    push,
    pathname,
  ])

  return (
    <ConcentratedLiquidityUrlStateContext.Provider value={state}>
      {typeof children === 'function' ? children(state) : children}
    </ConcentratedLiquidityUrlStateContext.Provider>
  )
}

export const useConcentratedLiquidityURLState = () => {
  const context = useContext(ConcentratedLiquidityUrlStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside Token State Context')
  }

  return context
}
