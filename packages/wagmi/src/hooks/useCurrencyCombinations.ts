'use client'

import { ChainId } from '@sushiswap/chain'
import { Token, Type } from '@sushiswap/currency'
import { getCurrencyCombinations } from '@sushiswap/router'
import { useMemo } from 'react'

export function useCurrencyCombinations(chainId?: ChainId, currencyA?: Type, currencyB?: Type): [Token, Token][] {
  return useMemo(
    () => (chainId && currencyA && currencyB ? getCurrencyCombinations(chainId, currencyA, currencyB) : []),
    [chainId, currencyA, currencyB]
  )
}
