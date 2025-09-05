import {
  type TokenListV2ChainId,
  isTokenListV2ChainId,
} from '@sushiswap/graph-client/data-api'

import { useMemo } from 'react'
import { useNetworkOptions } from 'src/lib/hooks/useNetworkOptions'
import type { EvmCurrency } from 'sushi/evm'
import { useAccount } from 'wagmi'
import { useMyTokensV2 } from '../hooks/use-my-tokens-v2'
import {
  TokenSelectorCurrencyListLoadingV2,
  TokenSelectorCurrencyListV2,
} from './common/token-selector-currency-list-v2'

interface TokenSelectorMyTokens {
  chainId?: TokenListV2ChainId
  onSelect(currency: EvmCurrency): void
  onShowInfo(currency: EvmCurrency | false): void
  selected: EvmCurrency | undefined
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
  const { networkOptions } = useNetworkOptions()
  const myTokensChainIds = useMemo(
    () =>
      (chainId && isTokenListV2ChainId(chainId)
        ? [chainId]
        : networkOptions.filter(isTokenListV2ChainId)) as TokenListV2ChainId[],
    [chainId, networkOptions],
  )
  const { data, isError, isLoading } = useMyTokensV2({
    chainIds: myTokensChainIds,
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
