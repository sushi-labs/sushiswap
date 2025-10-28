// import { TokenListV2ChainIds } from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import { SUPPORTED_CHAIN_IDS } from 'src/config'
import {
  filterLocalRecentSwapsByAccountAndChainIds,
  useLocalRecentSwaps,
} from 'src/lib/hooks/react-query/recent-swaps/useLocalRecentSwaps'
// import { useRecentSwaps } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import { type EvmCurrency, EvmNative, EvmToken } from 'sushi/evm'
import type { Address } from 'viem'

const allowedSymbols = ['USDC', 'USDT', 'DAI']

// const validChainIds = [...TokenListV2ChainIds]

export const useQuickSelectTokens = ({
  account,
  optionCount = 3,
}: {
  account: Address | undefined
  optionCount?: 1 | 2 | 3
}) => {
  // const { data: recentSwaps, isLoading: isRecentSwapsLoading } = useRecentSwaps(
  //   {
  //     walletAddress: account,
  //     chainIds: validChainIds,
  //   },
  // )
  const { data: _localRecentSwaps } = useLocalRecentSwaps()

  const localRecentSwaps = useMemo(() => {
    if (!_localRecentSwaps || !account) return []
    return filterLocalRecentSwapsByAccountAndChainIds({
      account,
      chainIds: SUPPORTED_CHAIN_IDS,
      swaps: _localRecentSwaps,
    })
  }, [account, _localRecentSwaps])

  const mostSwappedStableTokens = useMemo(() => {
    if (!localRecentSwaps || localRecentSwaps.length === 0) return []
    //filter out default tokens from recent swaps so no duplicates of default tokens
    const filteredSwaps = localRecentSwaps.filter((swap) => {
      const tokenOut = swap.token1
      return allowedSymbols.includes(tokenOut.symbol)
    })
    if (filteredSwaps.length === 0) return []
    const groupedTokens = new Map<string, EvmCurrency[]>()
    filteredSwaps.forEach((swap) => {
      const token =
        swap.token1.type === 'native'
          ? EvmNative.fromChainId(swap.token1.chainId)
          : new EvmToken({
              chainId: swap.token1.chainId,
              address: swap.token1.address,
              decimals: (swap.token1 as EvmToken).decimals,
              symbol: (swap.token1 as EvmToken).symbol,
              name: (swap.token1 as EvmToken).name,
            })
      if (!groupedTokens.has(token?.symbol)) {
        groupedTokens.set(token.symbol, [])
      }

      groupedTokens.get(token.symbol)?.push(token)
    })

    const orderedTokensBySymbolPriority = allowedSymbols
      .map(
        (symbol, idx) =>
          groupedTokens.get(symbol) ??
          groupedTokens.values().find((_, index) => idx === index),
      )
      .filter((tokens): tokens is EvmCurrency[] => !!tokens)

    return orderedTokensBySymbolPriority
  }, [localRecentSwaps])

  const quickSelectTokens = useMemo(() => {
    if (!mostSwappedStableTokens || mostSwappedStableTokens.length === 0) {
      return []
    }

    if (mostSwappedStableTokens.length > optionCount) {
      return mostSwappedStableTokens.slice(0, optionCount)
    }

    return mostSwappedStableTokens
  }, [mostSwappedStableTokens, optionCount])

  return {
    quickSelectTokens,
    isLoading: false,
  }
}
