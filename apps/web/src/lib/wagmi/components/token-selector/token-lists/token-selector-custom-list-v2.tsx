import { isTokenListV2ChainId } from '@sushiswap/graph-client/data-api'
import { List } from '@sushiswap/ui'
import { useMemo } from 'react'
import { TempChainIds } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import type { Address } from 'sushi'
import type { EvmChainId } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import { useMyTokensV2 } from '../hooks/use-my-tokens-v2'
import { TokenSelectorCurrencyListV2 } from './common/token-selector-currency-list-v2'

interface TokenSelectorCustomListV2 {
  currencies: Readonly<Type[]>
  chainId?: EvmChainId
  account?: Address
  selected: Type | undefined
  onSelect(currency: Type): void
  search?: string
  includeNative?: boolean
  onShowInfo(currency: Type | false): void
  showChainOptions: boolean
}

export function TokenSelectorCustomListV2({
  currencies,
  chainId,
  account,
  selected,
  onSelect,
  search,
  includeNative,
  onShowInfo,
  showChainOptions,
}: TokenSelectorCustomListV2) {
  const {
    data: { balanceMap, priceMap },
    isLoading,
  } = useMyTokensV2({
    chainIds:
      chainId && isTokenListV2ChainId(chainId) ? [chainId] : TempChainIds,
    account,
    includeNative,
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
            balancesMap={balanceMap}
            pricesMap={priceMap}
            isBalanceLoading={isLoading}
            onShowInfo={onShowInfo}
          />
        </div>
      </List.Control>
    </div>
  )
}
