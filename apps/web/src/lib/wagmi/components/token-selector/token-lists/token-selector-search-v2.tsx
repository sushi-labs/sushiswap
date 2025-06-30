import {
  type TokenListV2ChainId,
  isTokenListV2ChainId,
} from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { TempChainIds } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import type { Type } from 'sushi/currency'
import type { Address } from 'viem'
import { useSearchTokensV2 } from '../hooks/use-search-tokens-v2'
import {
  TokenSelectorCurrencyListLoadingV2,
  TokenSelectorCurrencyListV2,
} from './common/token-selector-currency-list-v2'

interface TokenSelectorSearch {
  chainId?: TokenListV2ChainId
  search: string
  onSelect(currency: Type): void
  onShowInfo(currency: Type | false): void
  selected: Type | undefined
  showChainOptions: boolean
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col">{children}</div>
}

const emptyMap = new Map()
const pageSize = 20

export function TokenSelectorSearchV2({
  chainId,
  search,
  selected,
  onSelect,
  onShowInfo,
  showChainOptions,
}: TokenSelectorSearch) {
  const { data, priceMap, isError, isLoading, fetchNextPage, hasMore } =
    useSearchTokensV2({
      chainIds:
        chainId && isTokenListV2ChainId(chainId)
          ? [chainId]
          : chainId && !isTokenListV2ChainId(chainId)
            ? []
            : TempChainIds,
      search,
      pagination: {
        initialPage: 0,
        pageSize,
      },
    })

  // const { data: pricesMap } = usePrices({ chainId });

  const { data: _customTokens, mutate } = useCustomTokens()
  const customTokens = useMemo(
    () =>
      Object.values(_customTokens)
        .filter((t) => t.chainId === chainId)
        .map((t) => t.address),
    [_customTokens, chainId],
  )

  const importableSet = useMemo(() => {
    const set = new Set<Address>()

    if (data) {
      data.forEach((token) => {
        if (!customTokens.includes(token.address) && token.approved === false) {
          set.add(token.address.toLowerCase() as Address)
        }
      })
    }

    return set
  }, [customTokens, data])

  if (isLoading) {
    return (
      <Shell>
        <TokenSelectorCurrencyListLoadingV2 count={20} />
      </Shell>
    )
  }

  if (isError) {
    return (
      <Shell>
        <div className="flex w-full justify-center pt-3">
          An error has occurred.
        </div>
      </Shell>
    )
  }

  if (!data || !data.length) {
    return (
      <Shell>
        <div className="flex w-full justify-center pt-3">No tokens found.</div>
      </Shell>
    )
  }

  return (
    <Shell>
      <InfiniteScroll
        dataLength={data.length}
        hasMore={hasMore}
        loader={<TokenSelectorCurrencyListLoadingV2 count={pageSize} />}
        next={fetchNextPage}
        // 3/4 of the last page
        scrollThreshold={`${64 * (pageSize + 5)}px`}
        scrollableTarget="token-list-container"
        className="!overflow-visible"
      >
        <div>
          <TokenSelectorCurrencyListV2
            id="trending"
            selected={selected}
            onSelect={onSelect}
            onShowInfo={onShowInfo}
            showChainOptions={showChainOptions}
            currencies={data}
            balancesMap={emptyMap}
            priceMap={priceMap}
            bridgeInfoMap={emptyMap}
            isBalanceLoading={false}
            importConfig={{
              importableSet,
              onImport: (token) => {
                mutate('add', [token])
                onSelect(token)
              },
            }}
          />
        </div>
      </InfiniteScroll>
    </Shell>
  )
}
