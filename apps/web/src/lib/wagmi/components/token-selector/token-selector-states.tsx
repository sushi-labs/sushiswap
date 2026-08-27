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
import type { TokenSelectorSelection } from './selection'
import { TokenSelectorChipBar } from './token-lists/token-selector-chip-bar'
import { TokenSelectorCustomList } from './token-lists/token-selector-custom-list'
import type { TokenSelectorCustomListOptions } from './token-lists/token-selector-custom-list'
import { TokenSelectorMyTokens } from './token-lists/token-selector-my-tokens'
import { TokenSelectorSearch } from './token-lists/token-selector-search'
import { TokenSelectorTrendingTokens } from './token-lists/token-selector-trending-tokens'

interface TokenSelectorStates<
  TChainId extends TokenSelectorChainId,
  TAllowPairSelection extends boolean = false,
> {
  selected: CurrencyFor<TChainId> | undefined
  chainId: TChainId
  account?: WalletAddressFor<TChainId>
  onSelect(
    selection: TokenSelectorSelection<TChainId, TAllowPairSelection>,
  ): void
  allowPairSelection?: TAllowPairSelection
  onShowInfo(currency: CurrencyFor<TChainId> | false): void
  currencies?: CurrencyFor<TChainId>[]
  includeNative?: boolean
  search?: string
  customListOptions?: TokenSelectorCustomListOptions
}

export function TokenSelectorStates<
  TChainId extends TokenSelectorChainId,
  TAllowPairSelection extends boolean = false,
>(props: TokenSelectorStates<TChainId, TAllowPairSelection>): React.JSX.Element
export function TokenSelectorStates<TChainId extends TokenSelectorChainId>(
  props: TokenSelectorStates<TChainId, boolean>,
) {
  const {
    selected,
    chainId,
    account,
    onSelect,
    allowPairSelection,
    onShowInfo,
    currencies,
    customListOptions,
    includeNative,
    search,
  } = props

  function onSelectCurrency(currency: CurrencyFor<TChainId>) {
    onSelect(currency)
  }

  // Ensure that the user's tokens are loaded
  useMyTokens({
    chainId: !currencies && isTokenListChainId(chainId) ? chainId : undefined,
    account,
    includeNative,
  })

  // Ensure that the trending tokens are loaded
  useTrendingTokens({
    chainId:
      !currencies && isTrendingTokensChainId(chainId) ? chainId : undefined,
  })

  // Ensure that the search list is loaded if it's the first thing the user sees
  useSearchTokens({
    chainId:
      !currencies &&
      isTokenListChainId(chainId) &&
      !isTrendingTokensChainId(chainId)
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
        onSelect={onSelectCurrency}
        selected={selected}
        search={search}
        includeNative={includeNative}
        onShowInfo={onShowInfo}
        options={customListOptions}
      />
    )
  }

  if (search && isTokenListChainId(chainId)) {
    return (
      <TokenSelectorSearch
        chainId={chainId}
        onSelect={onSelect}
        allowPairSelection={allowPairSelection}
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
          onSelect={onSelectCurrency}
          includeNative={includeNative}
        />

        {account ? (
          <TokenSelectorMyTokens
            chainId={chainId}
            onSelect={onSelectCurrency}
            onShowInfo={onShowInfo}
            selected={selected}
            includeNative={includeNative}
          />
        ) : null}

        <TokenSelectorSearch
          chainId={chainId}
          onSelect={onSelectCurrency}
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
          onSelect={onSelectCurrency}
          includeNative={includeNative}
        />

        {account ? (
          <TokenSelectorMyTokens
            chainId={chainId}
            onSelect={onSelectCurrency}
            onShowInfo={onShowInfo}
            selected={selected}
            includeNative={includeNative}
          />
        ) : null}

        <TokenSelectorTrendingTokens
          chainId={trendingChainId}
          onSelect={
            onSelectCurrency as (
              currency: CurrencyFor<TTrendingChainId>,
            ) => void
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
      onSelect={onSelectCurrency}
      selected={selected}
      search={search}
      includeNative={includeNative}
      onShowInfo={onShowInfo}
      options={customListOptions}
    />
  )
}
