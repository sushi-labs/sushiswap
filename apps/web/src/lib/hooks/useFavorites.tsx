'use client'

import {
  type TokenListV2ChainId,
  isTokenListV2ChainId,
} from '@sushiswap/graph-client/data-api'
import { usePinnedTokens } from '@sushiswap/hooks'
import { useMemo } from 'react'
import type { ChainId } from 'sushi'
import { type EvmChainId, EvmNative } from 'sushi/evm'
import type { Address } from 'viem'
import { formatUnits, isAddress } from 'viem/utils'
import { useAccount } from 'wagmi'
import { useNetworkContext } from '~evm/[chainId]/[trade]/_ui/swap/trade/favorite-recent/network-provider'
import { NativeAddress } from '../constants'
import { useMyTokensV2 } from '../wagmi/components/token-selector/hooks/use-my-tokens-v2'
import { useSearchTokens } from './react-query/search-tokens/useSearchTokens'

export const useFavorites = () => {
  const { address } = useAccount()
  const { data: _pinnedTokens } = usePinnedTokens()
  const {
    state: { selectedNetwork },
  } = useNetworkContext()

  const { supportedTokens, uniqueChainIds, unsupportedTokens, natives } =
    useMemo(() => {
      const tokens = Object.values(_pinnedTokens)
        .flat()
        .map((i) => {
          const currencyId = i
          const [chainId, _contractAddress, symbol] = currencyId.split(':')
          const contractAddress =
            _contractAddress === 'NATIVE' ? NativeAddress : _contractAddress
          if (!isAddress(contractAddress)) {
            throw new Error(`Invalid address: ${contractAddress}`)
          }

          return {
            chainId: Number(chainId),
            address: contractAddress,
            isSupported:
              isTokenListV2ChainId(Number(chainId) as ChainId) &&
              contractAddress !== NativeAddress,
            symbol: symbol,
          }
        })
        .filter((i) => i !== undefined)

      const uniqueChainIds = Array.from(
        new Set(tokens.map((token) => Number(token.chainId))),
      ).filter((chainId) => isTokenListV2ChainId(chainId as ChainId))

      const supportedTokens = tokens
        .filter((token) => token.isSupported)
        .map((token) => ({
          address: token.address,
          chainId: token.chainId as TokenListV2ChainId,
        }))

      const unsupportedTokens = tokens
        .filter(
          (token) => !token.isSupported && token.address !== NativeAddress,
        )
        .map((token) => ({
          address: token.address,
          chainId: token.chainId as TokenListV2ChainId,
          symbol: token.symbol,
        }))

      const natives = tokens
        .filter((token) => token.address === NativeAddress)
        .map((token) => ({
          address: EvmNative.fromChainId(token.chainId as EvmChainId).wrap()
            .address,
          chainId: token.chainId as TokenListV2ChainId,
          symbol: EvmNative.fromChainId(token.chainId as EvmChainId).wrap()
            .symbol,
        }))

      return { supportedTokens, uniqueChainIds, unsupportedTokens, natives }
    }, [_pinnedTokens])

  const {
    data: _favorites,
    isLoading: isLoadingTokens,
    isError: isErrorTokens,
  } = useSearchTokens({
    walletAddress: address,
    chainIds: uniqueChainIds as TokenListV2ChainId[],
    search: '',
    tokens: supportedTokens,
    first: supportedTokens?.length,
  })

  const {
    data: _nativeTokens,
    isLoading: isLoadingNative,
    isError: isErrorMyTokens,
  } = useMyTokensV2({
    chainIds: uniqueChainIds as TokenListV2ChainId[],
    account: address as Address,
    includeNative: true,
  })

  const favorites = useMemo(() => {
    const favArr = _favorites.map((token) => ({
      ...token,
      balance: formatUnits(BigInt(token.balance), token.decimals),
    }))
    unsupportedTokens.forEach((token) => {
      const priceUsd =
        _nativeTokens?.priceMap?.get(`${token.chainId}:${token.address}`) ?? 0
      const balance =
        _nativeTokens?.balanceMap
          ?.get(`${token.chainId}:${token.address}`)
          ?.toString({ fixed: 6 }) ?? '0'
      const balanceUsd = priceUsd * Number(balance)
      favArr.push({
        chainId: token.chainId,
        address: token.address,
        decimals: 18,
        name: '',
        symbol: token.symbol,
        bridgeInfo: [],
        balance: balance,
        balanceUSD: balanceUsd,
        priceUSD: priceUsd,
        priceChange1d: 0,
        approved: false,
      })
    })

    const nativesOnList = _nativeTokens.tokens.filter((token) => {
      return natives?.some(
        (nativeToken) =>
          nativeToken.chainId === token.chainId && token.isNative,
      )
    })

    nativesOnList.forEach((token) => {
      if (token.isNative) {
        const _native = EvmNative.fromChainId(token.chainId)
        const priceUsd =
          _nativeTokens?.priceMap?.get(`${token.chainId}:NATIVE`) ?? 0
        const balance =
          _nativeTokens?.balanceMap
            ?.get(`${token.chainId}:NATIVE`)
            ?.toString({ fixed: 6 }) ?? '0'
        const balanceUsd = priceUsd * Number(balance)
        favArr.push({
          chainId: token.chainId as TokenListV2ChainId,
          address: _native.wrap().address,
          decimals: _native.wrap().decimals,
          name: _native.name,
          symbol: _native.symbol,
          bridgeInfo: [],
          balance: balance,
          balanceUSD: balanceUsd,
          priceUSD: priceUsd,
          priceChange1d: 0,
          approved: false,
        })
      }
    })

    return favArr.sort((a, b) => {
      //sort by balanceUSD descending, then by symbol ascending
      if (a.balanceUSD < b.balanceUSD) return 1
      if (a.balanceUSD > b.balanceUSD) return -1
      if (a.symbol.toLowerCase() < b.symbol.toLowerCase()) return -1
      if (a.symbol.toLowerCase() > b.symbol.toLowerCase()) return 1
      return 0
    })
  }, [_favorites, unsupportedTokens, _nativeTokens, natives])

  const isLoading = isLoadingTokens || isLoadingNative
  const isError = isErrorTokens || isErrorMyTokens

  return useMemo(() => {
    let _favs = favorites
    if (selectedNetwork) {
      _favs = _favs.filter((fav) => fav.chainId === selectedNetwork)
    }

    return {
      favorites: _favs,
      isLoading,
      isError,
    }
  }, [favorites, isLoading, isError, selectedNetwork])
}
