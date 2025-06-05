import { isTokenListChainId } from '@sushiswap/graph-client/data-api'
import { List } from '@sushiswap/ui'
import { useMemo } from 'react'
import type { Address } from 'sushi'
import type { EvmChainId } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useMyTokens } from '../hooks/use-my-tokens'
import { TokenSelectorCurrencyListV2 } from './common/token-selector-currency-list-v2'

interface TokenSelectorCustomList {
  currencies: Readonly<Type[]>
  chainId: EvmChainId
  account?: Address
  selected: Type | undefined
  onSelect(currency: Type): void
  search?: string
  includeNative?: boolean
  onShowInfo(currency: Type | false): void
  showChainOptions: boolean
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
  showChainOptions,
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
          <TokenSelectorCurrencyListV2
            showChainOptions={showChainOptions}
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
