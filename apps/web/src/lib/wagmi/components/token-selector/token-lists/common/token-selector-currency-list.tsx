import React, { type FC, memo, useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import type { Amount, ChainId } from 'sushi'
import { type EvmCurrency, EvmNative, type EvmToken } from 'sushi/evm'
import { useAccount } from 'wagmi'

import type { Address } from 'viem'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { TokenSelectorImportRow } from './token-selector-import-row'
import { TokenSelectorRow, TokenSelectorRowLoading } from './token-selector-row'

interface TokenSelectorCurrencyListProps {
  id: string
  currencies: Readonly<EvmCurrency<{ approved?: boolean }>[]> | undefined
  chainId: ChainId
  onSelect(currency: EvmCurrency): void
  pin?: {
    isPinned: (currencyId: string) => boolean
    onPin: (currencyId: string) => void
  }
  selected: EvmCurrency | undefined
  balancesMap: Map<string, Amount<EvmCurrency>> | undefined
  pricesMap: PriceMap | undefined
  isBalanceLoading: boolean
  importConfig?: {
    onImport: (currency: EvmToken) => void
    importableSet: Set<Address>
  }
  onShowInfo(currency: EvmCurrency | false): void
}

export const TokenSelectorCurrencyList: FC<TokenSelectorCurrencyListProps> =
  memo(function TokenSelectorCurrencyList({
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
    const { address } = useAccount()
    const rowData = useMemo<TokenSelectorRow[]>(() => {
      if (!currencies) return []

      return currencies.map((currency) => ({
        account: address,
        currency,
        balance: balancesMap?.get(
          currency.type === 'native' ? NativeAddress : currency.address,
        ),
        price: pricesMap?.getFraction(
          currency.type === 'native'
            ? EvmNative.fromChainId(currency.chainId).wrap().address
            : currency.address,
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
        importableSet?.has(rowData.currency.address.toLowerCase() as Address)
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
