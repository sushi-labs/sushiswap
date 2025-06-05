import type { TokenListChainId } from '@sushiswap/graph-client/data-api'

import type { Type } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useMyTokens } from '../hooks/use-my-tokens'

import {
  TokenSelectorCurrencyListLoadingV2,
  TokenSelectorCurrencyListV2,
} from './common/token-selector-currency-list-v2'

interface TokenSelectorMyTokens {
  chainId: TokenListChainId
  onSelect(currency: Type): void
  onShowInfo(currency: Type | false): void
  selected: Type | undefined
  includeNative?: boolean
  showChainOptions: boolean
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col">{children}</div>
}

export function TokenSelectorMyTokens({
  chainId,
  onSelect,
  onShowInfo,
  selected,
  includeNative,
  showChainOptions,
}: TokenSelectorMyTokens) {
  const { address } = useAccount()

  const { data, isError, isLoading } = useMyTokens({
    chainId,
    account: address,
    includeNative,
  })

  const { data: pricesMap } = usePrices({
    chainId,
  })

  if (isLoading)
    return (
      <Shell>
        <TokenSelectorCurrencyListLoadingV2 count={10} />
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
      <TokenSelectorCurrencyListV2
        id="trending"
        selected={selected}
        onSelect={onSelect}
        onShowInfo={onShowInfo}
        showChainOptions={showChainOptions}
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
