import {
  type TrendingTokensChainId,
  isTrendingTokensChainId,
} from '@sushiswap/graph-client/data-api'
import { TempChainIds } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import type { Type } from 'sushi/currency'
import { useTrendingTokensV2 } from '../hooks/use-trending-tokens-v2'
import {
  TokenSelectorCurrencyListLoadingV2,
  TokenSelectorCurrencyListV2,
} from './common/token-selector-currency-list-v2'

interface TokenSelectorTrendingTokensV2 {
  chainId?: TrendingTokensChainId
  onSelect(currency: Type): void
  onShowInfo(currency: Type | false): void
  selected: Type | undefined
  showChainOptions: boolean
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col">{children}</div>
}

const emptyMap = new Map()

export function TokenSelectorTrendingTokensV2({
  chainId,
  onSelect,
  onShowInfo,
  selected,
  showChainOptions,
}: TokenSelectorTrendingTokensV2) {
  const { data, priceMap, isError, isLoading } = useTrendingTokensV2({
    chainIds:
      chainId && isTrendingTokensChainId(chainId) ? [chainId] : TempChainIds,
    // chainIds: TempChainIds,
  })

  if (isLoading)
    return (
      <Shell>
        <TokenSelectorCurrencyListLoadingV2 count={20} />
      </Shell>
    )

  if (isError)
    return (
      <Shell>
        <div className="flex w-full justify-center pt-3">
          An error has occurred.
        </div>
      </Shell>
    )

  if (!data?.length)
    return (
      <Shell>
        <div className="flex w-full justify-center pt-3">No tokens found.</div>
      </Shell>
    )

  return (
    <Shell>
      <TokenSelectorCurrencyListV2
        id="trending"
        selected={selected}
        onSelect={onSelect}
        onShowInfo={onShowInfo}
        showChainOptions={showChainOptions}
        currencies={data}
        balancesMap={emptyMap}
        priceMap={priceMap}
        isBalanceLoading={false}
        bridgeInfoMap={emptyMap} // No bridge info for trending tokens
      />
    </Shell>
  )
}
