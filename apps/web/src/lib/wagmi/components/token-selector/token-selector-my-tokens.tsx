import { usePrices } from '@sushiswap/react-query'
import { List } from '@sushiswap/ui'
import type { ChainId } from 'sushi/chain'
import type { Type } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { useMyTokens } from './hooks/use-my-tokens'
import {
  TokenSelectorCurrencyList,
  TokenSelectorCurrencyListLoading,
} from './token-selector-currency-list'

interface TokenSelectorMyTokens {
  chainId: ChainId
  onSelect(currency: Type): void
  selected: Type | undefined
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="text-sm">My Tokens</div>
      <List.Control className="flex flex-1">
        <div className="flex-1 block">{children}</div>
      </List.Control>
    </div>
  )
}

export function TokenSelectorMyTokens({
  chainId,
  onSelect,
  selected,
}: TokenSelectorMyTokens) {
  const { address } = useAccount()

  const { data, isError, isLoading } = useMyTokens({
    chainId,
    account: address,
  })

  const { data: pricesMap } = usePrices({
    chainId,
  })

  if (isLoading)
    return (
      <Shell>
        <TokenSelectorCurrencyListLoading count={10} />
      </Shell>
    )

  if (isError)
    return (
      <Shell>
        <div className="flex w-full justify-center py-3">
          An error has occurred.
        </div>
      </Shell>
    )

  if (!data.balanceMap?.size)
    return (
      <Shell>
        <div className="flex w-full justify-center py-3">
          No balances found.
        </div>
      </Shell>
    )

  return (
    <Shell>
      <TokenSelectorCurrencyList
        id="trending"
        selected={selected}
        onSelect={onSelect}
        // pin={{}}
        currencies={data.tokens}
        chainId={chainId}
        balancesMap={data.balanceMap}
        pricesMap={pricesMap}
        isBalanceLoading={!data.balanceMap}
      />
    </Shell>
  )
}
