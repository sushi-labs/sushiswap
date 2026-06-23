'use client'

import {
  type TrendingTokensChainId,
  isTokenListChainId,
  isTrendingTokensChainId,
} from '@sushiswap/graph-client/data-api'
import { useMemo } from 'react'
import type { WalletAddressFor } from 'src/lib/wallet'
import { EVM_DEFAULT_BASES, isEvmChainId } from 'sushi/evm'
import { STELLAR_DEFAULT_BASES, isStellarChainId } from 'sushi/stellar'
import { SVM_DEFAULT_BASES, isSvmChainId } from 'sushi/svm'
import type { TokenSelectorChainId } from './config'
import { useMyTokens } from './hooks/use-my-tokens'
import { useSearchTokens } from './hooks/use-search-tokens'
import { useTrendingTokens } from './hooks/use-trending-tokens'
import { TokenSelectorChipBar } from './token-lists/token-selector-chip-bar'
import { TokenSelectorCustomList } from './token-lists/token-selector-custom-list'
import { TokenSelectorMyTokens } from './token-lists/token-selector-my-tokens'
import { TokenSelectorSearch } from './token-lists/token-selector-search'
import { TokenSelectorTrendingTokens } from './token-lists/token-selector-trending-tokens'

interface TokenSelectorStates<TChainId extends TokenSelectorChainId> {
  selected: CurrencyFor<TChainId> | undefined
  chainId: TChainId
  account?: WalletAddressFor<TChainId>
  onSelect(currency: CurrencyFor<TChainId>): void
  onShowInfo(currency: CurrencyFor<TChainId> | false): void
  currencies?: CurrencyFor<TChainId, { approved?: boolean }>[]
  includeNative?: boolean
  search?: string
}

export function TokenSelectorStates<TChainId extends TokenSelectorChainId>({
  selected,
  chainId,
  account,
  onSelect,
  onShowInfo,
  currencies,
  includeNative,
  search,
}: TokenSelectorStates<TChainId>) {
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

  const defaultBases = useMemo(() => {
    if (isEvmChainId(chainId)) {
      return EVM_DEFAULT_BASES[chainId]
    }
    if (isSvmChainId(chainId)) {
      return SVM_DEFAULT_BASES[chainId]
    }
    if (isStellarChainId(chainId)) {
      return STELLAR_DEFAULT_BASES[chainId]
    }

    throw new Error('Unsupported chainId')
  }, [chainId]) as unknown as Readonly<CurrencyFor<TChainId>[]>

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

  if (isTokenListChainId(chainId) && !isTrendingTokensChainId(chainId)) {
    return (
      <>
        <TokenSelectorChipBar
          chainId={chainId}
          onSelect={onSelect}
          includeNative={includeNative}
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

  if (isTrendingTokensChainId(chainId)) {
    type TTrendingChainId = Extract<TChainId, TrendingTokensChainId>
    const trendingChainId = chainId as TTrendingChainId

    return (
      <>
        <TokenSelectorChipBar
          chainId={chainId}
          onSelect={onSelect}
          includeNative={includeNative}
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
          chainId={trendingChainId}
          onSelect={
            onSelect as (currency: CurrencyFor<TTrendingChainId>) => void
          }
          onShowInfo={
            onShowInfo as (
              currency: CurrencyFor<TTrendingChainId> | false,
            ) => void
          }
          selected={selected as CurrencyFor<TTrendingChainId> | undefined}
        />
      </>
    )
  }

  return (
    <TokenSelectorCustomList
      chainId={chainId}
      account={account}
      currencies={defaultBases}
      onSelect={onSelect}
      selected={selected}
      search={search}
      includeNative={includeNative}
      onShowInfo={onShowInfo}
    />
  )
}
