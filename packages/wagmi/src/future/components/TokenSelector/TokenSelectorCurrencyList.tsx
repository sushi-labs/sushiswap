import { ChainId } from '@sushiswap/chain'
import { Native, Type } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui/components/currency'
import React, { FC, memo, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { TokenSelectorRow } from './TokenSelectorRow'
import { NativeAddress, useBalances, usePrices } from '@sushiswap/react-query'

interface TokenSelectorCurrencyListProps {
  id: string
  currencies: Type[] | undefined
  chainId: ChainId
  onSelect(currency: Type): void
  pin?: {
    pinnedSet: Set<string>
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
      onSelect: () => onSelect(currency),
      pin: pin
        ? {
            onPin: () => pin?.onPin(currency.wrapped.id),
            pinned: pin.pinnedSet.has(currency.wrapped.id.toLowerCase()),
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
