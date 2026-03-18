import type { TrendingTokensChainId } from '@sushiswap/graph-client/data-api'
import { List } from '@sushiswap/ui'
import type { EvmCurrency } from 'sushi/evm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useTrendingTokens } from '../hooks/use-trending-tokens'
import {
  TokenSelectorCurrencyList,
  TokenSelectorCurrencyListLoading,
} from './common/token-selector-currency-list'

interface TokenSelectorTrendingTokens<TChainId extends TrendingTokensChainId> {
  chainId: TChainId
  onSelect(currency: CurrencyFor<TChainId>): void
  onShowInfo(currency: CurrencyFor<TChainId> | false): void
  selected: CurrencyFor<TChainId> | undefined
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="text-sm">Trending Tokens</div>
      <List.Control className="flex flex-1">
        <div className="flex-1 block">{children}</div>
      </List.Control>
    </div>
  )
}

const emptyMap = new Map()

export function TokenSelectorTrendingTokens<
  TChainId extends TrendingTokensChainId,
>({
  chainId,
  onSelect,
  onShowInfo,
  selected,
}: TokenSelectorTrendingTokens<TChainId>) {
  const { data, isError, isLoading } = useTrendingTokens({ chainId })

  const { data: pricesMap } = usePrices({ chainId })

  if (isLoading)
    return (
      <Shell>
        <TokenSelectorCurrencyListLoading count={20} />
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
      <TokenSelectorCurrencyList
        id="trending"
        selected={selected}
        onSelect={onSelect}
        onShowInfo={onShowInfo}
        // pin={{}}
        currencies={data}
        chainId={chainId}
        balancesMap={emptyMap}
        pricesMap={pricesMap}
        isBalanceLoading={false}
      />
    </Shell>
  )
}
