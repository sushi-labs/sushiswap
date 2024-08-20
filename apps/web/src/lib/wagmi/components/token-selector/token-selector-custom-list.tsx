import { usePrices } from '@sushiswap/react-query'
import { List } from '@sushiswap/ui'
import { Address } from 'sushi'
import type { ChainId } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import { useMyTokens } from './hooks/use-my-tokens'
import { TokenSelectorCurrencyList } from './token-selector-currency-list'

interface TokenSelectorCustomList {
  currencies: Type[]
  chainId: ChainId
  account?: Address
  selected: Type | undefined
  onSelect(currency: Type): void
}

export function TokenSelectorCustomList({
  currencies,
  chainId,
  account,
  selected,
  onSelect,
}: TokenSelectorCustomList) {
  const {
    data: { balanceMap },
    isLoading,
  } = useMyTokens({ chainId, account })

  const { data: pricesMap } = usePrices({
    chainId,
  })

  return (
    <div className="flex flex-1 flex-col">
      <List.Control className="flex flex-1">
        <div className="flex-1 block">
          <TokenSelectorCurrencyList
            id="trending"
            selected={selected}
            onSelect={onSelect}
            currencies={currencies}
            chainId={chainId}
            balancesMap={balanceMap}
            pricesMap={pricesMap}
            isBalanceLoading={isLoading}
          />
        </div>
      </List.Control>
    </div>
  )
}
