import React, { type FC, memo, useMemo } from 'react'
import type { Amount } from 'sushi'
import type { EvmCurrency } from 'sushi/evm'
import { useAccount } from 'wagmi'

import type { TokenListBalanceV2 } from '@sushiswap/graph-client/data-api'
import type { EvmToken } from 'sushi/evm'
import type { Address } from 'viem'
import { TokenSelectorImportRow } from './token-selector-import-row'
import {
  TokenSelectorRowLoadingV2,
  TokenSelectorRowV2,
} from './token-selector-row-v2'

interface TokenSelectorCurrencyListV2Props {
  id: string
  currencies: Readonly<EvmCurrency[]> | undefined
  onSelect(currency: EvmCurrency): void
  selected: EvmCurrency | undefined
  balancesMap: Map<string, Amount<EvmCurrency>> | undefined
  priceMap: Map<string, number> | undefined
  bridgeInfoMap:
    | Map<string, TokenListBalanceV2['bridgeInfo'] | null>
    | undefined
  isBalanceLoading: boolean
  importConfig?: {
    onImport: (currency: EvmToken) => void
    importableSet: Set<Address>
  }
  onShowInfo(currency: EvmCurrency | false): void
  showChainOptions: boolean
}

export const TokenSelectorCurrencyListV2: FC<TokenSelectorCurrencyListV2Props> =
  memo(function TokenSelectorCurrencyList({
    onSelect,
    currencies,
    selected,
    priceMap,
    balancesMap,
    isBalanceLoading,
    importConfig,
    onShowInfo,
    showChainOptions,
    bridgeInfoMap,
  }) {
    const { address } = useAccount()
    const rowData = useMemo<TokenSelectorRowV2[]>(() => {
      if (!currencies) return []

      return currencies.map((currency) => ({
        account: address,
        currency,
        balance: balancesMap?.get(currency.id),
        price: priceMap?.get(currency.id),
        showWarning:
          currency.type === 'token' && currency.metadata.approved === false,
        onSelect,
        selected: selected ? currency.isSame(selected) : false,
        isBalanceLoading,
        onShowInfo: () => onShowInfo(currency),
        showChainOptions,
        bridgeInfo: bridgeInfoMap?.get(currency.id) ?? null,
      }))
    }, [
      isBalanceLoading,
      address,
      balancesMap,
      currencies,
      onSelect,
      priceMap,
      selected,
      onShowInfo,
      showChainOptions,
      bridgeInfoMap,
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
