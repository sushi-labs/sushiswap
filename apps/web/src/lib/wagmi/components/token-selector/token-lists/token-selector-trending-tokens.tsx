import type { TrendingTokensChainId } from '@sushiswap/graph-client/data-api'
import type { EvmCurrency } from 'sushi/evm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useTrendingTokens } from '../hooks/use-trending-tokens'
import { TokenSelectorCurrencyList } from './common/token-selector-currency-list'
import { TokenSelectorCurrencyListLoadingV2 } from './common/token-selector-currency-list-v2'

interface TokenSelectorTrendingTokens {
  chainId: TrendingTokensChainId
  onSelect(currency: EvmCurrency): void
  onShowInfo(currency: EvmCurrency | false): void
  selected: EvmCurrency | undefined
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col">{children}</div>
}

const emptyMap = new Map()

export function TokenSelectorTrendingTokens({
  chainId,
  onSelect,
  onShowInfo,
  selected,
}: TokenSelectorTrendingTokens) {
  const { data, isError, isLoading } = useTrendingTokens({ chainId })

  const { data: pricesMap } = usePrices({ chainId })

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
