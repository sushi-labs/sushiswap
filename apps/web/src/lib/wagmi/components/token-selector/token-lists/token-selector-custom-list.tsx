import { isTokenListChainId } from '@sushiswap/graph-client/data-api'
import { List } from '@sushiswap/ui'
import { useMemo } from 'react'
import type { EvmAddress, EvmCurrency, EvmNative } from 'sushi/evm'
import type { EvmChainId } from 'sushi/evm'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useMyTokens } from '../hooks/use-my-tokens'
import { TokenSelectorCurrencyList } from './common/token-selector-currency-list'

interface TokenSelectorCustomList {
  currencies: Readonly<EvmCurrency<{ approved?: boolean }>[]>
  chainId: EvmChainId
  account?: EvmAddress
  selected: EvmCurrency | undefined
  onSelect(currency: EvmCurrency): void
  search?: string
  includeNative?: boolean
  onShowInfo(currency: EvmCurrency | false): void
}

export function TokenSelectorCustomList({
  currencies,
  chainId,
  account,
  selected,
  onSelect,
  search,
  includeNative,
  onShowInfo,
}: TokenSelectorCustomList) {
  const {
    data: { balanceMap },
    isLoading,
  } = useMyTokens({
    chainId: isTokenListChainId(chainId) ? chainId : undefined,
    account,
    includeNative,
  })

  const { data: pricesMap } = usePrices({
    chainId,
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

  return (
    <div className="flex flex-1 flex-col">
      <List.Control className="flex flex-1">
        <div className="flex-1 block">
          <TokenSelectorCurrencyList
            id="trending"
            selected={selected}
            onSelect={onSelect}
            currencies={filteredCurrencies}
            chainId={chainId}
            balancesMap={balanceMap}
            pricesMap={pricesMap}
            isBalanceLoading={isLoading}
            onShowInfo={onShowInfo}
          />
        </div>
      </List.Control>
    </div>
  )
}
