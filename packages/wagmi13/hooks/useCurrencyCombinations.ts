import { getCurrencyCombinations, Token, Type } from '@sushiswap/currency'
import { useMemo } from 'react'

export function useCurrencyCombinations(chainId?: number, currencyA?: Type, currencyB?: Type): [Token, Token][] {
  return useMemo(
    () => (chainId && currencyA && currencyB ? getCurrencyCombinations(chainId, currencyA, currencyB) : []),
    [chainId, currencyA, currencyB]
  )
}
