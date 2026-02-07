import React, { type FC, memo, useMemo } from 'react'
import { type Amount, getNativeAddress } from 'sushi'
import type { EvmChainId, EvmToken } from 'sushi/evm'
import { useConnection } from 'wagmi'

import type { SvmChainId } from 'sushi/svm'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { TokenSelectorImportRow } from './token-selector-import-row'
import { TokenSelectorRow, TokenSelectorRowLoading } from './token-selector-row'

interface TokenSelectorCurrencyListGenericProps<
  TChainId extends EvmChainId | SvmChainId,
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

export const TokenSelectorCurrencyList: FC<
  TokenSelectorCurrencyListGenericProps<EvmChainId | SvmChainId>
> = memo(function TokenSelectorCurrencyList({
  onSelect,
  currencies,
  selected,
  pin,
  pricesMap,
  balancesMap,
  isBalanceLoading,
  importConfig,
  onShowInfo,
}) {
  const { address } = useConnection()
  const rowData = useMemo<TokenSelectorRow<EvmChainId | SvmChainId>[]>(() => {
    if (!currencies) return []

    return currencies.map((currency) => ({
      account: address,
      currency,
      balance: balancesMap?.get(
        currency.type === 'native'
          ? getNativeAddress(currency.chainId)
          : currency.address,
      ),
      price: pricesMap?.getFraction(currency.wrap().address),
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
    address,
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
    if (
      rowData.currency.type === 'token' &&
      importableSet?.has(rowData.currency.address)
    ) {
      return (
        <TokenSelectorImportRow
          key={rowData.currency.id}
          currency={rowData.currency}
          onImport={() => onImport(rowData.currency as EvmToken)}
        />
      )
    }

    return <TokenSelectorRow key={rowData.currency.id} {...rowData} />
  })
})

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
