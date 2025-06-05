import React, { type FC, memo, useMemo } from 'react'
import { NativeAddress } from 'src/lib/constants'
import type { ChainId } from 'sushi/chain'
import { type Amount, Native, type Type } from 'sushi/currency'
import { useAccount } from 'wagmi'

import type { Token } from 'sushi/currency'
import type { Address } from 'viem'
import type { PriceMap } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { TokenSelectorImportRow } from './token-selector-import-row'
import {
  TokenSelectorRowLoadingV2,
  TokenSelectorRowV2,
} from './token-selector-row-v2'

interface TokenSelectorCurrencyListV2Props {
  id: string
  currencies: Readonly<Type[]> | undefined
  chainId: ChainId
  onSelect(currency: Type): void
  pin?: {
    isPinned: (currencyId: string) => boolean
    onPin: (currencyId: string) => void
  }
  selected: Type | undefined
  balancesMap: Map<string, Amount<Type>> | undefined
  pricesMap: PriceMap | undefined
  isBalanceLoading: boolean
  importConfig?: {
    onImport: (currency: Token) => void
    importableSet: Set<Address>
  }
  onShowInfo(currency: Type | false): void
  showChainOptions: boolean
}

export const TokenSelectorCurrencyListV2: FC<TokenSelectorCurrencyListV2Props> =
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
    showChainOptions,
  }) {
    const { address } = useAccount()
    const rowData = useMemo<TokenSelectorRowV2[]>(() => {
      if (!currencies) return []

      return currencies.map((currency) => ({
        account: address,
        currency,
        balance: balancesMap?.get(
          currency.isNative ? NativeAddress : currency.address,
        ),
        price: pricesMap?.getFraction(
          currency.isNative
            ? Native.onChain(currency.chainId).wrapped.address
            : currency.address,
        ),
        showWarning: currency.approved === false,
        onSelect: () => onSelect(currency),
        pin: pin
          ? {
              onPin: () => pin?.onPin(currency.id),
              isPinned: pin.isPinned(currency.id),
            }
          : undefined,
        selected: selected
          ? (currency.isNative === true && selected.isNative === true) ||
            (selected.isToken &&
              currency.isToken &&
              currency.wrapped.address === selected.wrapped.address)
          : false,
        isBalanceLoading,
        onShowInfo: () => onShowInfo(currency),
        showChainOptions,
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
      showChainOptions,
    ])

    if (!importConfig) {
      return rowData.map((rowData) => (
        <TokenSelectorRowV2 key={rowData.currency.id} {...rowData} />
      ))
    }

    const { onImport, importableSet } = importConfig

    return rowData.map((rowData) => {
      if (
        !rowData.currency.isNative &&
        importableSet?.has(rowData.currency.address.toLowerCase() as Address)
      ) {
        return (
          <TokenSelectorImportRow
            key={rowData.currency.id}
            currency={rowData.currency}
            onImport={() => onImport(rowData.currency as Token)}
          />
        )
      }

      return <TokenSelectorRowV2 key={rowData.currency.id} {...rowData} />
    })
  })

interface TokenSelectorCurrencyListLoading {
  count: number
}

export function TokenSelectorCurrencyListLoadingV2({
  count,
}: TokenSelectorCurrencyListLoading) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <TokenSelectorRowLoadingV2 key={i} />
      ))}
    </>
  )
}
