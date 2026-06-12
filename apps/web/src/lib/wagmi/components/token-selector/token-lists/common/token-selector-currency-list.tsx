import { memo, useMemo } from 'react'
import { type Amount, getNativeAddress } from 'sushi'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import type { TokenSelectorChainId } from '../../config'
import { TokenSelectorImportRow } from './token-selector-import-row'
import { TokenSelectorRow, TokenSelectorRowLoading } from './token-selector-row'

interface TokenSelectorCurrencyListGenericProps<
  TChainId extends TokenSelectorChainId,
> {
  id: string
  currencies: Readonly<
    CurrencyFor<TChainId, { approved?: boolean }>[] | undefined
  >

  chainId: TChainId
  onSelect(currency: CurrencyFor<TChainId>): void
  pin?: {
    isPinned: (currencyId: string) => boolean
    onPin: (currencyId: string) => void
  }
  selected: CurrencyFor<TChainId> | undefined
  balancesMap: Map<string, Amount<CurrencyFor<TChainId>>> | undefined
  pricesMap: PriceMap<TChainId> | undefined
  isBalanceLoading: boolean
  importConfig?: {
    onImport: (currency: TokenFor<TChainId>) => void
    importableSet: Set<AddressFor<TChainId>> | undefined
  }
  onShowInfo(currency: CurrencyFor<TChainId> | false): void
}

function TokenSelectorCurrencyListBase<TChainId extends TokenSelectorChainId>({
  onSelect,
  currencies,
  selected,
  pin,
  pricesMap,
  balancesMap,
  isBalanceLoading,
  importConfig,
  onShowInfo,
}: TokenSelectorCurrencyListGenericProps<TChainId>) {
  const rowData = useMemo<TokenSelectorRow<TChainId>[]>(() => {
    if (!currencies) return []

    return currencies.map((currency) => ({
      currency,
      balance: balancesMap?.get(
        currency.type === 'native'
          ? getNativeAddress(currency.chainId)
          : currency.address,
      ),
      price: pricesMap?.getFraction(
        currency.wrap().address as ContractAddressFor<TChainId>,
      ),
      showWarning:
        currency.type === 'token' && currency.metadata.approved === false,
      onSelect: () => onSelect(currency),
      pin: pin
        ? {
            onPin: () => pin?.onPin(currency.id),
            isPinned: pin.isPinned(currency.id),
          }
        : undefined,
      selected: selected
        ? (currency.type === 'native' && selected.type === 'native') ||
          (selected.type === 'token' &&
            currency.type === 'token' &&
            currency.wrap().address === selected.wrap().address)
        : false,
      isBalanceLoading,
      onShowInfo: () => onShowInfo(currency),
    }))
  }, [
    isBalanceLoading,
    balancesMap,
    currencies,
    onSelect,
    pricesMap,
    selected,
    pin,
    onShowInfo,
  ])

  if (!importConfig) {
    return rowData.map((rowData) => (
      <TokenSelectorRow key={rowData.currency.id} {...rowData} />
    ))
  }

  const { onImport, importableSet } = importConfig

  return rowData.map((rowData) => {
    if (rowData.currency.type === 'token') {
      const token = rowData.currency as TokenFor<TChainId>

      if (!importableSet?.has(token.address as AddressFor<TChainId>)) {
        return <TokenSelectorRow key={rowData.currency.id} {...rowData} />
      }

      return (
        <TokenSelectorImportRow
          key={token.id}
          currency={token}
          onImport={() => onImport(token)}
        />
      )
    }

    return <TokenSelectorRow key={rowData.currency.id} {...rowData} />
  })
}

export const TokenSelectorCurrencyList = memo(
  TokenSelectorCurrencyListBase,
) as unknown as typeof TokenSelectorCurrencyListBase

interface TokenSelectorCurrencyListLoading {
  count: number
}

export function TokenSelectorCurrencyListLoading({
  count,
}: TokenSelectorCurrencyListLoading) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <TokenSelectorRowLoading key={i} />
      ))}
    </>
  )
}
