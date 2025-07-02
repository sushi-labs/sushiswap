'use client'

import type { Type } from 'sushi/currency'

import {
  type TokenListV2ChainId,
  type TrendingTokensChainId,
  isTokenListV2ChainId,
  isTrendingTokensChainId,
} from '@sushiswap/graph-client/data-api'
import { classNames } from '@sushiswap/ui'
import { useNetworkOptions } from 'src/lib/hooks/useNetworkOptions'
import type { Address } from 'viem'
import { useMyTokensV2 } from './hooks/use-my-tokens-v2'
import { useSearchTokensV2 } from './hooks/use-search-tokens-v2'
import { useTrendingTokensV2 } from './hooks/use-trending-tokens-v2'
import { TokenSelectorChipBarV2 } from './token-lists/token-selector-chip-bar-v2'
import { TokenSelectorCustomListV2 } from './token-lists/token-selector-custom-list-v2'
import { TokenSelectorMyTokensV2 } from './token-lists/token-selector-my-tokens-v2'
import { TokenSelectorSearchV2 } from './token-lists/token-selector-search-v2'
import { TokenSelectorTrendingTokensV2 } from './token-lists/token-selector-trending-tokens-v2'
import type { TokenSelectorV2Type } from './token-selector-v2'

interface TokenSelectorStates {
  selected: Type | undefined
  selectedNetwork?: TokenListV2ChainId
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
  selectedNetwork,
  account,
  onSelect,
  onShowInfo,
  currencies,
  includeNative,
  hidePinnedTokens,
  search,
  type,
}: TokenSelectorStates) {
  const { networkOptions } = useNetworkOptions()
  // Ensure that the user's tokens are loaded
  useMyTokensV2({
    chainIds:
      selectedNetwork && isTokenListV2ChainId(selectedNetwork)
        ? [selectedNetwork]
        : networkOptions.filter(isTokenListV2ChainId),
    account,
    includeNative,
  })

  // Ensure that the trending tokens are loaded
  useTrendingTokensV2({
    chainIds:
      selectedNetwork && isTrendingTokensChainId(selectedNetwork)
        ? [selectedNetwork]
        : (networkOptions.filter(
            isTrendingTokensChainId,
          ) as TrendingTokensChainId[]),
  })

  // Ensure that the search list is loaded if it's the first thing the user sees
  useSearchTokensV2({
    chainIds:
      selectedNetwork && isTokenListV2ChainId(selectedNetwork)
        ? [selectedNetwork]
        : networkOptions.filter(isTokenListV2ChainId),
    search: '',
  })

  if (currencies) {
    return (
      <TokenSelectorCustomListV2
        chainId={selectedNetwork}
        account={account}
        currencies={currencies}
        onSelect={onSelect}
        selected={selected}
        search={search}
        includeNative={includeNative}
        onShowInfo={onShowInfo}
        showChainOptions={type === 'buy'}
      />
    )
  }

  if (search) {
    return (
      <>
        <Title />
        <TokenSelectorSearchV2
          chainId={selectedNetwork}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
          search={search}
          selected={selected}
          showChainOptions={false}
        />
      </>
    )
  }

  if (
    selectedNetwork &&
    !isTokenListV2ChainId(selectedNetwork) &&
    isTrendingTokensChainId(selectedNetwork)
  ) {
    return (
      <>
        {type === 'buy' ? (
          <TokenSelectorChipBarV2
            chainIds={selectedNetwork ? [selectedNetwork] : networkOptions}
            onSelect={onSelect}
            includeNative={includeNative}
            showPinnedTokens={!hidePinnedTokens}
          />
        ) : null}
        <Title />

        <TokenSelectorTrendingTokensV2
          chainId={selectedNetwork}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
          selected={selected}
          showChainOptions={type === 'buy'}
        />
      </>
    )
  }

  if (
    selectedNetwork &&
    isTokenListV2ChainId(selectedNetwork) &&
    !isTrendingTokensChainId(selectedNetwork)
  ) {
    return (
      <>
        {type === 'buy' ? (
          <TokenSelectorChipBarV2
            chainIds={selectedNetwork ? [selectedNetwork] : networkOptions}
            onSelect={onSelect}
            includeNative={includeNative}
            showPinnedTokens={!hidePinnedTokens}
          />
        ) : null}
        <Title />

        {account ? (
          <TokenSelectorMyTokensV2
            chainId={selectedNetwork}
            onSelect={onSelect}
            onShowInfo={onShowInfo}
            selected={selected}
            showChainOptions={type === 'buy'}
          />
        ) : null}

        <TokenSelectorSearchV2
          chainId={selectedNetwork}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
          selected={selected}
          search={''}
          showChainOptions={type === 'buy'}
        />
      </>
    )
  }

  return (
    <>
      {type === 'buy' ? (
        <TokenSelectorChipBarV2
          chainIds={selectedNetwork ? [selectedNetwork] : networkOptions}
          onSelect={onSelect}
          includeNative={includeNative}
          showPinnedTokens={!hidePinnedTokens}
        />
      ) : null}
      <Title className={type === 'sell' ? '!mt-0' : ''} />

      {account ? (
        <TokenSelectorMyTokensV2
          chainId={selectedNetwork}
          onSelect={onSelect}
          onShowInfo={onShowInfo}
          selected={selected}
          includeNative={includeNative}
          showChainOptions={type === 'buy'}
        />
      ) : null}

      <TokenSelectorTrendingTokensV2
        chainId={selectedNetwork}
        onSelect={onSelect}
        onShowInfo={onShowInfo}
        selected={selected}
        showChainOptions={type === 'buy'}
      />
    </>
  )
}

const Title = ({ className }: { className?: string }) => (
  <p
    className={classNames(
      'mt-4 mb-2 text-xs font-medium text-slate-450 dark:text-slate-500',
      className ?? '',
    )}
  >
    Tokens
  </p>
)
