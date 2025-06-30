import {
  type TokenListChainId,
  isTokenListV2ChainId,
} from '@sushiswap/graph-client/data-api'
import { TempChainIds } from 'src/lib/hooks/react-query/recent-swaps/useRecentsSwaps'
import type { Type } from 'sushi/currency'
import { useAccount } from 'wagmi'
import { useMyTokensV2 } from '../hooks/use-my-tokens-v2'
import {
  TokenSelectorCurrencyListLoadingV2,
  TokenSelectorCurrencyListV2,
} from './common/token-selector-currency-list-v2'

interface TokenSelectorMyTokens {
  chainId?: TokenListChainId
  onSelect(currency: Type): void
  onShowInfo(currency: Type | false): void
  selected: Type | undefined
  includeNative?: boolean
  showChainOptions: boolean
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 flex flex-col">{children}</div>
}

export function TokenSelectorMyTokensV2({
  chainId,
  onSelect,
  onShowInfo,
  selected,
  includeNative,
  showChainOptions,
}: TokenSelectorMyTokens) {
  const { address } = useAccount()

  const { data, isError, isLoading } = useMyTokensV2({
    chainIds:
      chainId && isTokenListV2ChainId(chainId) ? [chainId] : TempChainIds,
    account: address,
    includeNative,
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
        currencies={data.tokens}
        balancesMap={data.balanceMap}
        priceMap={data.priceMap}
        isBalanceLoading={!data.balanceMap}
        bridgeInfoMap={data.bridgeInfoMap}
      />
    </Shell>
  )
}
