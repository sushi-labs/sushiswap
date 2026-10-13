import type { TokenListChainId } from '@sushiswap/graph-client/data-api'
import { List, classNames } from '@sushiswap/ui'
import { useEffect, useMemo } from 'react'
import { useAccount } from 'src/lib/wallet/hooks/use-account'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { useMyTokens } from '../hooks/use-my-tokens'
import { useTokenSelectorTheme } from '../token-selector-theme'
import {
  TokenSelectorCurrencyList,
  TokenSelectorCurrencyListLoading,
} from './common/token-selector-currency-list'
import { getTokenGroups } from './token-groups'

interface TokenSelectorMyTokens<TChainId extends TokenListChainId> {
  chainId: TChainId
  onSelect(currency: CurrencyFor<TChainId>): void
  onShowInfo(currency: CurrencyFor<TChainId> | false): void
  selected: CurrencyFor<TChainId> | undefined
  includeNative?: boolean
}

export function TokenSelectorMyTokensShell({
  children,
}: { children: React.ReactNode }): React.JSX.Element {
  const theme = useTokenSelectorTheme()

  return (
    <div className="flex flex-col space-y-2">
      <div className="text-sm">My Tokens</div>
      <List.Control
        className={classNames(
          'flex flex-1',
          theme === 'perps' &&
            '!border-white/[0.06] !bg-white/[0.02] shadow-none',
        )}
      >
        <div className="flex-1 block">{children}</div>
      </List.Control>
    </div>
  )
}

export function TokenSelectorMyTokens<TChainId extends TokenListChainId>({
  chainId,
  onSelect,
  onShowInfo,
  selected,
  includeNative,
}: TokenSelectorMyTokens<TChainId>) {
  const address = useAccount(chainId)

  const { data, isError, isLoading, refetch } = useMyTokens({
    chainId,
    account: address,
    includeNative,
  })

  useEffect(() => {
    refetch()
  }, [refetch])

  const { data: pricesMap } = usePrices({
    chainId,
  })

  const { myCurrencies } = useMemo(
    () =>
      getTokenGroups({
        currencies: data.tokens,
        balancesMap: data.balanceMap,
        pricesMap,
      }),
    [data.tokens, data.balanceMap, pricesMap],
  )

  if (isLoading)
    return (
      <TokenSelectorMyTokensShell>
        <TokenSelectorCurrencyListLoading count={10} />
      </TokenSelectorMyTokensShell>
    )

  if (isError)
    return (
      <TokenSelectorMyTokensShell>
        <div className="flex w-full justify-center py-3">
          An error has occurred.
        </div>
      </TokenSelectorMyTokensShell>
    )

  if (!myCurrencies.length)
    return (
      <TokenSelectorMyTokensShell>
        <div className="flex w-full justify-center py-3">
          No balances found.
        </div>
      </TokenSelectorMyTokensShell>
    )

  return (
    <TokenSelectorMyTokensShell>
      <TokenSelectorCurrencyList
        id="trending"
        selected={selected}
        onSelect={onSelect}
        onShowInfo={onShowInfo}
        // pin={{}}
        currencies={myCurrencies}
        chainId={chainId}
        balancesMap={data.balanceMap}
        pricesMap={pricesMap}
        isBalanceLoading={!data.balanceMap}
      />
    </TokenSelectorMyTokensShell>
  )
}
