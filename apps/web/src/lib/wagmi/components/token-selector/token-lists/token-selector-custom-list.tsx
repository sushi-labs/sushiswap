import {
  type TokenListChainId,
  isTokenListChainId,
} from '@sushiswap/graph-client/data-api'
import { List, classNames } from '@sushiswap/ui'
import { useMemo } from 'react'
import type { WalletAddressFor } from 'src/lib/wallet'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import type { TokenSelectorChainId } from '../config'
import { matchesCurrencySearch } from '../hooks/additional-search-tokens'
import { useMyTokens } from '../hooks/use-my-tokens'
import { useTokenListCurrencies } from '../hooks/use-token-list-currencies'
import { useTokenSelectorTheme } from '../token-selector-theme'
import {
  TokenSelectorCurrencyList,
  TokenSelectorCurrencyListLoading,
} from './common/token-selector-currency-list'
import { getTokenGroups } from './token-groups'
import { TokenSelectorMyTokensShell } from './token-selector-my-tokens'

interface TokenSelectorCustomList<TChainId extends TokenSelectorChainId> {
  currencies: Readonly<CurrencyFor<TChainId, { approved?: boolean }>[]>
  chainId: TChainId
  account?: WalletAddressFor<TChainId>
  selected: CurrencyFor<TChainId> | undefined
  onSelect(currency: CurrencyFor<TChainId>): void
  search?: string
  includeNative?: boolean
  onShowInfo(currency: CurrencyFor<TChainId> | false): void
}

export function TokenSelectorCustomList<TChainId extends TokenSelectorChainId>({
  currencies,
  chainId,
  account,
  selected,
  onSelect,
  search,
  includeNative,
  onShowInfo,
}: TokenSelectorCustomList<TChainId>): React.JSX.Element {
  const theme = useTokenSelectorTheme()
  const {
    data: { balanceMap },
    isLoading,
    isError,
  } = useMyTokens<TokenListChainId & TChainId>({
    chainId: isTokenListChainId(chainId) ? chainId : undefined,
    account,
    includeNative,
  })

  const { data: pricesMap } = usePrices({
    chainId,
  })

  const filteredCurrencies = useMemo(() => {
    return currencies.filter((currency) =>
      matchesCurrencySearch(currency, search),
    )
  }, [currencies, search])

  const { data: listedCurrencies, isLoading: isApprovalLoading } =
    useTokenListCurrencies({ chainId, currencies: filteredCurrencies })

  const showMyTokens = Boolean(
    account && isTokenListChainId(chainId) && !search,
  )
  const { myCurrencies, otherCurrencies } = useMemo(
    () =>
      getTokenGroups({
        currencies: listedCurrencies,
        balancesMap: showMyTokens && !isError ? balanceMap : undefined,
        pricesMap,
      }),
    [listedCurrencies, showMyTokens, isError, balanceMap, pricesMap],
  )

  return (
    <div className="flex flex-1 flex-col gap-5">
      {showMyTokens ? (
        <TokenSelectorMyTokensShell>
          {isLoading || isApprovalLoading ? (
            <TokenSelectorCurrencyListLoading count={10} />
          ) : isError ? (
            <div className="flex w-full justify-center py-3">
              An error has occurred.
            </div>
          ) : !myCurrencies.length ? (
            <div className="flex w-full justify-center py-3">
              No balances found.
            </div>
          ) : (
            <TokenSelectorCurrencyList
              id="my-tokens"
              selected={selected}
              onSelect={onSelect}
              currencies={myCurrencies}
              chainId={chainId}
              balancesMap={balanceMap}
              pricesMap={pricesMap}
              isBalanceLoading={isLoading}
              onShowInfo={onShowInfo}
            />
          )}
        </TokenSelectorMyTokensShell>
      ) : null}
      {otherCurrencies.length ? (
        <List.Control
          className={classNames(
            'flex flex-1',
            theme === 'perps' &&
              '!border-white/[0.06] !bg-white/[0.02] shadow-none',
          )}
        >
          <div className="flex-1 block">
            {isApprovalLoading ? (
              <TokenSelectorCurrencyListLoading
                count={Math.min(otherCurrencies.length, 20)}
              />
            ) : (
              <TokenSelectorCurrencyList
                id="trending"
                selected={selected}
                onSelect={onSelect}
                currencies={otherCurrencies}
                chainId={chainId}
                balancesMap={balanceMap}
                pricesMap={pricesMap}
                isBalanceLoading={isLoading}
                onShowInfo={onShowInfo}
              />
            )}
          </div>
        </List.Control>
      ) : null}
    </div>
  )
}
