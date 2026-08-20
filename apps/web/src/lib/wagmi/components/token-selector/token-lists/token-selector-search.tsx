import type { TokenListChainId } from '@sushiswap/graph-client/data-api'
import { useCustomTokens } from '@sushiswap/hooks'
import { List, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { isEvmAddress, isEvmChainId } from 'sushi/evm'
import { getAddress } from 'viem'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { usePoolAddress } from '../hooks/use-pool-address'
import { useSearchTokens } from '../hooks/use-search-tokens'
import type { TokenSelectorSelection } from '../selection'
import { useTokenSelectorTheme } from '../token-selector-theme'
import {
  TokenSelectorCurrencyList,
  TokenSelectorCurrencyListLoading,
} from './common/token-selector-currency-list'
import { TokenSelectorPoolRow } from './token-selector-pool-row'

interface TokenSelectorSearch<
  TChainId extends TokenListChainId,
  TAllowPairSelection extends boolean = false,
> {
  chainId: TChainId
  search: string
  onSelect(
    selection: TokenSelectorSelection<TChainId, TAllowPairSelection>,
  ): void
  allowPairSelection?: TAllowPairSelection
  onShowInfo(currency: CurrencyFor<TChainId> | false): void
  selected: CurrencyFor<TChainId> | undefined
}

function Shell({ children }: { children: React.ReactNode }) {
  const theme = useTokenSelectorTheme()

  return (
    <div className="flex flex-1 flex-col">
      <List.Control
        className={classNames(
          'flex flex-1',
          theme === 'perps' &&
            '!border-white/[0.06] !bg-white/[0.02] shadow-none',
        )}
      >
        <div className="block max-w-full flex-1">{children}</div>
      </List.Control>
    </div>
  )
}

const emptyMap = new Map()
const pageSize = 20

export function TokenSelectorSearch<
  TChainId extends TokenListChainId,
  TAllowPairSelection extends boolean = false,
>(props: TokenSelectorSearch<TChainId, TAllowPairSelection>): React.JSX.Element
export function TokenSelectorSearch<TChainId extends TokenListChainId>(
  props: TokenSelectorSearch<TChainId, boolean>,
) {
  const { chainId, search, selected, allowPairSelection, onShowInfo } = props
  const searchAddress =
    isEvmChainId(chainId) && isEvmAddress(search.trim())
      ? getAddress(search.trim())
      : undefined
  const poolAddress = allowPairSelection ? searchAddress : undefined
  const { data: pool, isLoading: isPoolLoading } = usePoolAddress({
    chainId: isEvmChainId(chainId) ? chainId : undefined,
    address: poolAddress,
    enabled: allowPairSelection,
  })
  const {
    data: searchResults,
    isError,
    isLoading,
    fetchNextPage,
    hasMore,
  } = useSearchTokens({
    chainId,
    search,
    pagination: {
      initialPage: 0,
      pageSize,
    },
  })

  const data = useMemo(() => {
    if (!searchAddress) return searchResults

    return searchResults?.filter(
      (token) => token.address.toLowerCase() === searchAddress.toLowerCase(),
    )
  }, [searchAddress, searchResults])

  const { data: pricesMap } = usePrices({
    chainId,
  })

  const { data: _customTokens, mutate } = useCustomTokens({ chainId })
  const customTokens = useMemo(
    () =>
      Object.values(_customTokens)
        .filter((t) => t.chainId === chainId)
        .map((t) => t.address),
    [_customTokens, chainId],
  )

  const importableSet = useMemo(() => {
    const set = new Set<AddressFor<TChainId>>()

    if (data) {
      data.forEach((token) => {
        if (
          !customTokens.includes(token.address) &&
          token.metadata.approved === false
        ) {
          set.add(token.address as AddressFor<TChainId>)
        }
      })
    }

    return set
  }, [customTokens, data])

  if (pool) {
    return (
      <Shell>
        <TokenSelectorPoolRow
          pool={pool}
          onSelect={(token0, token1) => props.onSelect([token0, token1])}
        />
      </Shell>
    )
  }

  if (isLoading || (searchAddress && isPoolLoading)) {
    return (
      <Shell>
        <TokenSelectorCurrencyListLoading count={searchAddress ? 1 : 20} />
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
        hasMore={searchAddress ? false : hasMore}
        loader={<TokenSelectorCurrencyListLoading count={pageSize} />}
        next={fetchNextPage}
        // 3/4 of the last page
        scrollThreshold={`${64 * (pageSize + 5)}px`}
        scrollableTarget="token-list-container"
        className="!overflow-visible"
      >
        <div>
          <TokenSelectorCurrencyList
            id="trending"
            selected={selected}
            onSelect={props.onSelect}
            onShowInfo={onShowInfo}
            // pin={{}}
            currencies={data}
            chainId={chainId}
            balancesMap={emptyMap}
            pricesMap={pricesMap}
            isBalanceLoading={false}
            importConfig={{
              importableSet,
              onImport: (token) => {
                mutate('add', [token])
                props.onSelect(token)
              },
            }}
          />
        </div>
      </InfiniteScroll>
    </Shell>
  )
}
