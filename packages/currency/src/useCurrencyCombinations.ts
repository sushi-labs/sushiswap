import { useMemo } from 'react'

import { getCurrencyCombinations } from './getCurrencyCombinations'
import { Token } from './Token'
import { Type } from './Type'

export function useCurrencyCombinations(chainId?: number, currencyA?: Type, currencyB?: Type): [Token, Token][] {
  return useMemo(
    () => (chainId && currencyA && currencyB ? getCurrencyCombinations(chainId, currencyA, currencyB) : []),
    [chainId, currencyA, currencyB],
  )
}
