'use client'

import type { EvmChainId } from 'sushi/chain'
import type { Type } from 'sushi/currency'

import {
  isTokenListChainId,
  isTrendingTokensChainId,
} from '@sushiswap/graph-client/data-api'
import { EVM_DEFAULT_BASES } from 'sushi/config'
import type { Address } from 'viem'
import { useMyTokens } from './hooks/use-my-tokens'
import { useSearchTokens } from './hooks/use-search-tokens'
import { useTrendingTokens } from './hooks/use-trending-tokens'
import { TokenSelectorChipBar } from './token-lists/token-selector-chip-bar'
import { TokenSelectorCustomList } from './token-lists/token-selector-custom-list'
import { TokenSelectorMyTokens } from './token-lists/token-selector-my-tokens'
import { TokenSelectorSearch } from './token-lists/token-selector-search'
import { TokenSelectorTrendingTokens } from './token-lists/token-selector-trending-tokens'
import type { TokenSelectorV2Type } from './token-selector-v2'

interface TokenSelectorStates {
  selected: Type | undefined
  chainId: EvmChainId
  account?: Address
  onSelect(currency: Type): void
  onShowInfo(currency: Type | false): void
  currencies?: Type[]
  includeNative?: boolean
  hidePinnedTokens?: boolean
  search?: string
  type: TokenSelectorV2Type
}

export function TokenSelectorStatesV2({
  selected,
  chainId,
  account,
  onSelect,
  onShowInfo,
  currencies,
  includeNative,
  hidePinnedTokens,
  search,
  type,
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
        showChainOptions={type === 'sell'}
      />
    )
  }

  if (search && isTokenListChainId(chainId)) {
    return (
      <>
        <Title />
        <TokenSelectorSearch
          chainId={chainId}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
          search={search}
          selected={selected}
          showChainOptions={false}
        />
      </>
    )
  }

  if (!isTokenListChainId(chainId) && isTrendingTokensChainId(chainId)) {
    return (
      <>
        {type !== 'buy' ? (
          <TokenSelectorChipBar
            chainId={chainId}
            onSelect={onSelect}
            includeNative={includeNative}
            showPinnedTokens={!hidePinnedTokens}
          />
        ) : null}
        <Title />
        <TokenSelectorTrendingTokens
          chainId={chainId}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
          selected={selected}
          showChainOptions={type === 'sell'}
        />
      </>
    )
  }

  if (isTokenListChainId(chainId) && !isTrendingTokensChainId(chainId)) {
    return (
      <>
        {type !== 'buy' ? (
          <TokenSelectorChipBar
            chainId={chainId}
            onSelect={onSelect}
            includeNative={includeNative}
            showPinnedTokens={!hidePinnedTokens}
          />
        ) : null}
        <Title />
        {account ? (
          <TokenSelectorMyTokens
            chainId={chainId}
            onSelect={onSelect}
            onShowInfo={onShowInfo}
            selected={selected}
            showChainOptions={type === 'sell'}
          />
        ) : null}

        <TokenSelectorSearch
          chainId={chainId}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
          selected={selected}
          search={''}
          showChainOptions={type === 'sell'}
        />
      </>
    )
  }

  if (isTokenListChainId(chainId) && isTrendingTokensChainId(chainId)) {
    return (
      <>
        {type !== 'buy' ? (
          <TokenSelectorChipBar
            chainId={chainId}
            onSelect={onSelect}
            includeNative={includeNative}
            showPinnedTokens={!hidePinnedTokens}
          />
        ) : null}
        <Title />

        {account ? (
          <TokenSelectorMyTokens
            chainId={chainId}
            onSelect={onSelect}
            onShowInfo={onShowInfo}
            selected={selected}
            includeNative={includeNative}
            showChainOptions={type === 'sell'}
          />
        ) : null}

        <TokenSelectorTrendingTokens
          chainId={chainId}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
          selected={selected}
          showChainOptions={type === 'sell'}
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
      showChainOptions={false}
    />
  )
}

const Title = () => (
  <p className="mb-2 mt-4 text-xs text-slate-450 dark:text-slate-500">Tokens</p>
)
