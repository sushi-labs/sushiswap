'use client'

import { getCurrencyCombinations } from '@sushiswap/router'
import { useMemo } from 'react'
import { ChainId } from 'sushi/chain'
import { Token, Type } from 'sushi/currency'

export function useCurrencyCombinations(
  chainId?: ChainId,
  currencyA?: Type,
  currencyB?: Type,
): [Token, Token][] {
  return useMemo(
    () =>
      chainId && currencyA && currencyB
        ? getCurrencyCombinations(chainId, currencyA, currencyB)
        : [],
    [chainId, currencyA, currencyB],
  )
}
