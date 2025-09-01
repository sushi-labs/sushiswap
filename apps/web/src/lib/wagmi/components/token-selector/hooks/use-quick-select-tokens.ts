import type {
  RecentSwaps,
  SearchTokens,
} from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import { useRecentSwaps } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import { useSearchTokens } from 'src/lib/hooks/react-query/search-tokens/useSearchTokens'
import { useNetworkOptions } from 'src/lib/hooks/useNetworkOptions'
import {
  EVM_DEFAULT_BASES,
  type EvmChainId,
  type EvmCurrency,
  type EvmID,
  EvmToken,
} from 'sushi/evm'
import type { Address } from 'viem'

//  use default list of USDC/USDT/ETH/DAI for fresh user or most often used assets for common user
const symbolOrder = ['USDC', 'USDT', 'ETH', 'DAI']

const getDefaultTokens = (chainIds: EvmChainId[]) => {
  const tokensByChain = chainIds
    .map((chainId) => {
      const base = EVM_DEFAULT_BASES[chainId]
      if (!base) return null
      return base.filter(
        (token) =>
          token.symbol === 'USDC' ||
          token.symbol === 'USDT' ||
          token.symbol === 'DAI' ||
          token.symbol === 'ETH',
      )
    })
    .filter(Boolean)

  //group the tokens by symbol
  const groupedTokens = new Map<string, EvmCurrency[]>()
  tokensByChain.forEach((tokens) => {
    tokens?.forEach((token) => {
      if (!groupedTokens.has(token.symbol!)) {
        groupedTokens.set(token.symbol!, [])
      }
      groupedTokens.get(token.symbol!)?.push(token)
    })
  })
  const orderedTokensBySymbolPriority = symbolOrder
    .map((symbol) => groupedTokens.get(symbol))
    .filter((tokens): tokens is EvmCurrency[] => !!tokens)

  return orderedTokensBySymbolPriority
}

const getMostSwappedTokens = (
  recentSwaps: RecentSwaps,
  optionCount: number,
): EvmID[] => {
  if (!recentSwaps || recentSwaps.length === 0) return []

  const tokenOutCounts = new Map<EvmID, number>()

  recentSwaps.forEach((swap) => {
    const _tokenOut = swap.tokenOut
    const tokenOut: EvmID =
      `${_tokenOut.chainId}:${_tokenOut?.address}` as EvmID
    if (tokenOut) {
      const currentCount = tokenOutCounts.get(tokenOut) || 0
      tokenOutCounts.set(tokenOut, currentCount + 1)
    }
  })
  const sortedTokens = Array.from(tokenOutCounts.entries()).sort(
    ([, countA], [, countB]) => countB - countA,
  )

  return sortedTokens.slice(0, optionCount).map(([symbol]) => symbol)
}

const getAllOptionsForTokens = (
  tokens: SearchTokens,
  chainIds: EvmChainId[],
) => {
  if (!tokens || tokens.length === 0) return []
  const groupedTokens = new Map<string, EvmCurrency[]>()
  tokens?.forEach((token) => {
    if (!groupedTokens.has(token?.symbol)) {
      groupedTokens.set(token.symbol, [])
    }
    if (chainIds.includes(token.chainId as EvmChainId)) {
      groupedTokens.get(token.symbol)?.push(
        new EvmToken({
          chainId: token.chainId as EvmChainId,
          address: token.address as Address,
          decimals: token.decimals,
          symbol: token.symbol,
          name: token.name,
        }),
      )
    }
    token?.bridgeInfo?.forEach((bridgeInfo) => {
      if (chainIds.includes(bridgeInfo.chainId as EvmChainId)) {
        groupedTokens.get(token.symbol)?.push(
          new EvmToken({
            chainId: bridgeInfo.chainId as EvmChainId,
            address: bridgeInfo.address as Address,
            decimals: bridgeInfo.decimals,
            symbol: token.symbol,
            name: token.name,
          }),
        )
      }
    })
  })
  const orderedTokensBySymbolPriority = symbolOrder
    .map(
      (symbol, idx) =>
        groupedTokens.get(symbol) ??
        groupedTokens.values().find((_, index) => idx === index),
    )
    .filter((tokens): tokens is EvmCurrency[] => !!tokens)

  return orderedTokensBySymbolPriority
}

export const useQuickSelectTokens = ({
  account,
  optionCount = 4,
}: {
  account: Address | undefined
  optionCount?: 1 | 2 | 3 | 4
}) => {
  const { networkOptions } = useNetworkOptions()
  const firstTenChainIds = networkOptions.slice(0, 10)

  const { data: recentSwaps, isLoading: isRecentSwapsLoading } = useRecentSwaps(
    {
      walletAddress: account,
      chainIds: [1, 8453, 42161, 137],
      // chainIds:  networkOptions as TempTokenListV2ChainId,
    },
  )

  const defaultTokens = useMemo(() => {
    return getDefaultTokens(firstTenChainIds).slice(0, optionCount)
  }, [firstTenChainIds, optionCount])

  const mostSwappedTokens = useMemo(() => {
    if (!recentSwaps || recentSwaps.length === 0) return []
    //filter out default tokens from recent swaps so no duplicates of default tokens
    const filteredSwaps = recentSwaps.filter((swap) => {
      const tokenOut = swap.tokenOut
      return !defaultTokens.some((tokens) =>
        tokens.some((token) => token.symbol === tokenOut.symbol),
      )
    })
    if (filteredSwaps.length === 0) return []
    const fourMostSwapped = getMostSwappedTokens(filteredSwaps, optionCount)
    return fourMostSwapped?.map((token) => {
      const [chainId, address] = token.split(':')
      const chainIdNumber = Number(chainId) as EvmChainId
      return {
        chainId: chainIdNumber,
        address: address as Address,
      }
    })
  }, [recentSwaps, defaultTokens, optionCount])

  const { data: search, isLoading: isSearchLoading } = useSearchTokens({
    walletAddress: account,
    chainIds: [1, 8453, 42161, 137],
    // chainIds:  firstTenChainIds as TempTokenListV2ChainId,
    search: undefined,
    first: optionCount,
    tokens: mostSwappedTokens,
  })

  const quickSelectBasedOnSwaps = useMemo(() => {
    return getAllOptionsForTokens(search, firstTenChainIds)
  }, [search, firstTenChainIds])

  const quickSelectTokens = useMemo(() => {
    if (!quickSelectBasedOnSwaps || quickSelectBasedOnSwaps.length === 0) {
      return defaultTokens
    }
    if (quickSelectBasedOnSwaps.length < optionCount) {
      const remainingTokens = defaultTokens.splice(
        0,
        optionCount - quickSelectBasedOnSwaps.length,
      )
      return [...quickSelectBasedOnSwaps, ...remainingTokens]
    }
    if (quickSelectBasedOnSwaps.length === optionCount) {
      return quickSelectBasedOnSwaps
    }
    if (quickSelectBasedOnSwaps.length > optionCount) {
      return quickSelectBasedOnSwaps.slice(0, optionCount)
    }

    return defaultTokens
  }, [quickSelectBasedOnSwaps, defaultTokens, optionCount])

  const isLoading = isRecentSwapsLoading || isSearchLoading

  return {
    quickSelectTokens,
    isLoading,
  }
}
