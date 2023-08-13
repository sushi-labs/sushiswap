import { ChainId } from '@sushiswap/chain'
import { Native, Type } from '@sushiswap/currency'
import { NativeAddress, useBalances, usePrices } from '@sushiswap/react-query'
import { Currency } from '@sushiswap/ui/components/currency'
import React, { FC, memo, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { TokenSelectorRow } from './TokenSelectorRow'

interface TokenSelectorCurrencyListProps {
  id: string
  currencies: Type[] | undefined
  chainId: ChainId
  officialTokenIds: string[]
  onSelect(currency: Type): void
  pin?: {
    isPinned: (currencyId: string) => boolean
    onPin: (currencyId: string) => void
  }
  selected: Type | undefined
}

export const TokenSelectorCurrencyList: FC<TokenSelectorCurrencyListProps> = memo(function TokenSelectorCurrencyList({
  id,
  onSelect,
  currencies,
  chainId,
  selected,
  pin,
  officialTokenIds,
}) {
  const { address } = useAccount()
  const { data: pricesMap } = usePrices({ chainId })
  const { data: balancesMap } = useBalances({ chainId, account: address })

  const rowData = useMemo<TokenSelectorRow[]>(() => {
    if (!currencies) return []

    return currencies.map((currency) => ({
      id: id,
      account: address,
      currency,
      balance: balancesMap?.[currency.isNative ? NativeAddress : currency.address],
      price: pricesMap?.[currency.isNative ? Native.onChain(currency.chainId).wrapped.address : currency.address],
      showWarning: currency.isNative ? false : !officialTokenIds.includes(currency.address),
      onSelect: () => onSelect(currency),
      pin: pin
        ? {
            onPin: () => pin?.onPin(currency.id),
            isPinned: pin.isPinned(currency.id),
          }
        : undefined,
      selected: selected
        ? (currency.isNative === true && selected.isNative === true) ||
          (selected.isToken && currency.isToken && currency.wrapped.address === selected.wrapped.address)
        : false,
    }))
  }, [address, balancesMap, currencies, id, onSelect, pricesMap, selected, pin])

  return <Currency.List className="scroll" rowHeight={64} rowRenderer={TokenSelectorRow} rowData={rowData} />
})
