'use client'

import {
  isTokenListChainId,
  isTrendingTokensChainId,
} from '@sushiswap/graph-client/data-api'
import { EVM_DEFAULT_BASES, type EvmChainId, type EvmCurrency } from 'sushi/evm'
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
  selected: EvmCurrency | undefined
  chainId: EvmChainId
  account?: Address
  onSelect(currency: EvmCurrency): void
  onShowInfo(currency: EvmCurrency | false): void
  currencies?: EvmCurrency<{ approved?: boolean }>[]
  includeNative?: boolean
  hidePinnedTokens?: boolean
  search?: string
}

export function TokenSelectorStates({
  selected,
  chainId,
  account,
  onSelect,
  onShowInfo,
  currencies,
  includeNative,
  hidePinnedTokens,
  search,
}: TokenSelectorStates) {
  // Ensure that the user's tokens are loaded
  useMyTokens({
    chainId: isTokenListChainId(chainId) ? chainId : undefined,
    account,
    includeNative,
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
        includeNative={includeNative}
        onShowInfo={onShowInfo}
      />
    )
  }

  if (search && isTokenListChainId(chainId)) {
    return (
      <TokenSelectorSearch
        chainId={chainId}
        onSelect={onSelect}
        onShowInfo={onShowInfo}
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
          onShowInfo={onShowInfo}
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
            onShowInfo={onShowInfo}
            selected={selected}
          />
        ) : null}

        <TokenSelectorSearch
          chainId={chainId}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
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
            onShowInfo={onShowInfo}
            selected={selected}
            includeNative={includeNative}
          />
        ) : null}

        <TokenSelectorTrendingTokens
          chainId={chainId}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
          selected={selected}
        />
      </>
    )
  }

  return (
    <TokenSelectorCustomList
      chainId={chainId}
      account={account}
      currencies={EVM_DEFAULT_BASES[chainId]}
      onSelect={onSelect}
      selected={selected}
      search={search}
      includeNative={includeNative}
      onShowInfo={onShowInfo}
    />
  )
}
