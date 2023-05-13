import { ChainId } from '@sushiswap/chain'
import { Native, Type } from '@sushiswap/currency'
import { Currency } from '@sushiswap/ui/future/components/currency'
import React, { FC, memo, useMemo } from 'react'
import { useAccount } from 'wagmi'

import { TokenSelectorRow } from './TokenSelectorRow'
import { NativeAddress, useBalances, usePrices } from '@sushiswap/react-query'

interface TokenSelectorCurrencyListProps {
  id: string
  currencies: Type[] | undefined
  chainId: ChainId
  onSelect(currency: Type): void
  selected: Type | undefined
}

export const TokenSelectorCurrencyList: FC<TokenSelectorCurrencyListProps> = memo(function TokenSelectorCurrencyList({
  id,
  onSelect,
  currencies,
  chainId,
  selected,
}) {
  const { address } = useAccount()
  const { data: pricesMap } = usePrices({ chainId })
  const { data: balancesMap } = useBalances({ chainId, account: address })

  const rowData: TokenSelectorRow[] = useMemo(() => {
    if (!currencies) return []

    return currencies.map((currency) => ({
      id: id,
      account: address,
      currency,
      balance: balancesMap?.[currency.isNative ? NativeAddress : currency.address],
      price: pricesMap?.[currency.isNative ? Native.onChain(currency.chainId).wrapped.address : currency.address],
      onSelect: () => onSelect(currency),
      selected: selected
        ? (currency.isNative === true && selected.isNative === true) ||
          (selected.isToken && currency.isToken && currency.wrapped.address === selected.wrapped.address)
        : false,
    }))
  }, [address, balancesMap, currencies, id, onSelect, pricesMap, selected])

  return <Currency.List className="scroll" rowHeight={64} rowRenderer={TokenSelectorRow} rowData={rowData} />
})
