'use client'

import { ChainId } from 'sushi/chain'
import { Type } from 'sushi/currency'

import {
  isTokenListChainId,
  isTrendingTokensChainId,
} from '@sushiswap/graph-client/data-api'
import { DEFAULT_BASES } from 'sushi/config'
import type { Address } from 'viem'
import { useMyTokens } from './hooks/use-my-tokens'
import { useSearchTokens } from './hooks/use-search-tokens'
import { useTrendingTokens } from './hooks/use-trending-tokens'
import { TokenSelectorChipBar } from './token-lists/token-selector-chip-bar'
import { TokenSelectorCustomList } from './token-lists/token-selector-custom-list'
import { TokenSelectorMyTokens } from './token-lists/token-selector-my-tokens'
import { TokenSelectorSearch } from './token-lists/token-selector-search'
import { TokenSelectorTrendingTokens } from './token-lists/token-selector-trending-tokens'

interface TokenSelectorStates {
  selected: Type | undefined
  chainId: ChainId
  account?: Address
  onSelect(currency: Type): void
  currencies?: Type[]
  includeNative?: boolean
  hidePinnedTokens?: boolean
  search?: string
}

export function TokenSelectorStates({
  selected,
  chainId,
  account,
  onSelect,
  currencies,
  includeNative,
  hidePinnedTokens,
  search,
}: TokenSelectorStates) {
  // Ensure that the user's tokens are loaded
  useMyTokens({
    chainId: isTokenListChainId(chainId) ? chainId : undefined,
    account,
  })

  // Ensure that the trending tokens are loaded
  useTrendingTokens({
    chainId: isTrendingTokensChainId(chainId) ? chainId : undefined,
  })

  // Ensure that the search list is loaded if it's the first thing the user sees
  useSearchTokens({
    chainId:
      isTokenListChainId(chainId) && !isTrendingTokensChainId(chainId)
        ? chainId
        : undefined,
    search: '',
  })

  if (currencies) {
    return (
      <TokenSelectorCustomList
        chainId={chainId}
        account={account}
        currencies={currencies}
        onSelect={onSelect}
        selected={selected}
        search={search}
      />
    )
  }

  if (search && isTokenListChainId(chainId)) {
    return (
      <TokenSelectorSearch
        chainId={chainId}
        onSelect={onSelect}
        search={search}
        selected={selected}
      />
    )
  }

  if (!isTokenListChainId(chainId) && isTrendingTokensChainId(chainId)) {
    return (
      <>
        <TokenSelectorChipBar
          chainId={chainId}
          onSelect={onSelect}
          includeNative={includeNative}
          showPinnedTokens={!hidePinnedTokens}
        />
        <TokenSelectorTrendingTokens
          chainId={chainId}
          onSelect={onSelect}
          selected={selected}
        />
      </>
    )
  }

  if (isTokenListChainId(chainId) && !isTrendingTokensChainId(chainId)) {
    return (
      <>
        <TokenSelectorChipBar
          chainId={chainId}
          onSelect={onSelect}
          includeNative={includeNative}
          showPinnedTokens={!hidePinnedTokens}
        />

        {account ? (
          <TokenSelectorMyTokens
            chainId={chainId}
            onSelect={onSelect}
            selected={selected}
          />
        ) : null}

        <TokenSelectorSearch
          chainId={chainId}
          onSelect={onSelect}
          selected={selected}
          search={''}
        />
      </>
    )
  }

  if (isTokenListChainId(chainId) && isTrendingTokensChainId(chainId)) {
    return (
      <>
        <TokenSelectorChipBar
          chainId={chainId}
          onSelect={onSelect}
          includeNative={includeNative}
          showPinnedTokens={!hidePinnedTokens}
        />

        {account ? (
          <TokenSelectorMyTokens
            chainId={chainId}
            onSelect={onSelect}
            selected={selected}
            includeNative={includeNative}
          />
        ) : null}

        <TokenSelectorTrendingTokens
          chainId={chainId}
          onSelect={onSelect}
          selected={selected}
        />
      </>
    )
  }

  return (
    <TokenSelectorCustomList
      chainId={chainId}
      account={account}
      currencies={DEFAULT_BASES[chainId]}
      onSelect={onSelect}
      selected={selected}
      search={search}
    />
  )
}
