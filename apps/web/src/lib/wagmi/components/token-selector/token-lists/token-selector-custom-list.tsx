import {
  type TokenListChainId,
  isTokenListChainId,
} from '@sushiswap/graph-client/data-api'
import { List, classNames } from '@sushiswap/ui'
import { type ReactNode, useEffect, useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { WalletAddressFor } from 'src/lib/wallet'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import type { TokenSelectorChainId } from '../config'
import { useMyTokens } from '../hooks/use-my-tokens'
import { useTokenSelectorTheme } from '../token-selector-theme'
import {
  TokenSelectorCurrencyList,
  TokenSelectorCurrencyListLoading,
} from './common/token-selector-currency-list'

export interface TokenSelectorCustomListOptions {
  emptyMessage?: ReactNode
  errorMessage?: ReactNode
  hasMore?: boolean
  isError?: boolean
  isLoading?: boolean
  isLoadingMore?: boolean
  onLoadMore?(): void
  showBalances?: boolean
  showPrices?: boolean
}

interface TokenSelectorCustomList<TChainId extends TokenSelectorChainId> {
  currencies: Readonly<CurrencyFor<TChainId>[]>
  chainId: TChainId
  account?: WalletAddressFor<TChainId>
  selected: CurrencyFor<TChainId> | undefined
  onSelect(currency: CurrencyFor<TChainId>): void
  search?: string
  includeNative?: boolean
  onShowInfo(currency: CurrencyFor<TChainId> | false): void
  options?: TokenSelectorCustomListOptions
}

export function TokenSelectorCustomList<TChainId extends TokenSelectorChainId>({
  currencies,
  chainId,
  account,
  selected,
  onSelect,
  search,
  includeNative,
  onShowInfo,
  options,
}: TokenSelectorCustomList<TChainId>) {
  const theme = useTokenSelectorTheme()
  const {
    emptyMessage = 'No tokens found.',
    errorMessage = 'Unable to load tokens.',
    hasMore = false,
    isError = false,
    isLoading = false,
    isLoadingMore = false,
    onLoadMore,
    showBalances = true,
    showPrices = true,
  } = options ?? {}
  const {
    data: { balanceMap },
    isLoading: isBalanceLoading,
  } = useMyTokens<TokenListChainId & TChainId>({
    chainId: showBalances && isTokenListChainId(chainId) ? chainId : undefined,
    account: showBalances ? account : undefined,
    includeNative,
  })

  const { data: pricesMap } = usePrices({
    chainId: showPrices ? chainId : undefined,
    enabled: showPrices,
  })

  const filteredCurrencies = useMemo(() => {
    if (!search) return currencies

    const searchLower = search.toLowerCase()

    const matchingCurrencies = currencies.filter((currency) => {
      if (currency.symbol?.toLowerCase().includes(searchLower)) return true
      if (currency.name?.toLowerCase().includes(searchLower)) return true

      return false
    })

    return matchingCurrencies
  }, [currencies, search])

  useEffect(() => {
    if (search && hasMore && !isLoadingMore) {
      onLoadMore?.()
    }
  }, [hasMore, isLoadingMore, onLoadMore, search])

  let content: ReactNode

  if (isLoading && currencies.length === 0) {
    content = <TokenSelectorCurrencyListLoading count={10} />
  } else if (isError && currencies.length === 0) {
    content = (
      <div className="flex justify-center px-3 py-6 text-sm text-muted-foreground">
        {errorMessage}
      </div>
    )
  } else if (filteredCurrencies.length === 0) {
    content = (
      <div className="flex justify-center px-3 py-6 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  } else {
    content = (
      <TokenSelectorCurrencyList
        id="custom"
        selected={selected}
        onSelect={onSelect}
        currencies={filteredCurrencies}
        chainId={chainId}
        balancesMap={showBalances ? balanceMap : undefined}
        pricesMap={showPrices ? pricesMap : undefined}
        isBalanceLoading={showBalances && isBalanceLoading}
        onShowInfo={onShowInfo}
      />
    )
  }

  const list = onLoadMore ? (
    <InfiniteScroll
      dataLength={currencies.length}
      hasMore={hasMore}
      loader={<TokenSelectorCurrencyListLoading count={10} />}
      next={onLoadMore}
      scrollThreshold="80%"
      scrollableTarget="token-list-container"
      className="!overflow-visible"
    >
      <div>{content}</div>
    </InfiniteScroll>
  ) : (
    content
  )

  return (
    <div className="flex flex-1 flex-col">
      <List.Control
        className={classNames(
          'flex flex-1',
          theme === 'perps' &&
            '!border-white/[0.06] !bg-white/[0.02] shadow-none',
        )}
      >
        <div className="flex-1 block">{list}</div>
      </List.Control>
    </div>
  )
}
