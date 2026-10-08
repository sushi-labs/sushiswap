'use client'

import { type ReactNode, createContext, useContext } from 'react'
import type { TokenSelectorChainId } from './config'

type AdditionalCurrency = CurrencyFor<TokenSelectorChainId>
const AdditionalCurrenciesContext = createContext<
  readonly AdditionalCurrency[]
>([])

export function AdditionalCurrenciesProvider({
  currencies,
  children,
}: {
  currencies: readonly AdditionalCurrency[]
  children: ReactNode
}): ReactNode {
  return (
    <AdditionalCurrenciesContext.Provider value={currencies}>
      {children}
    </AdditionalCurrenciesContext.Provider>
  )
}

export function useAdditionalCurrencies(): readonly AdditionalCurrency[] {
  return useContext(AdditionalCurrenciesContext)
}
