import { isAddress } from '@ethersproject/address'
import { Type } from '@sushiswap/currency'
import { useCallback, useMemo } from 'react'

import { useLocalStorage } from './useLocalStorage'

export const usePinnedTokens = () => {
  const [value, setValue] = useLocalStorage<string[]>('sushi.pinnedTokens', [])

  const set = useMemo(() => {
    const pinnedTokens = new Set<string>()
    value.forEach((token) => {
      pinnedTokens.add(token.toLowerCase())
    })
    return pinnedTokens
  }, [value])

  const addPinnedToken = useCallback(
    (currencyId: string) => {
      set.add(currencyId.toLowerCase())
      setValue(Array.from(set))
    },
    [set, setValue]
  )

  const removePinnedToken = useCallback(
    (currencyId: string) => {
      set.delete(currencyId.toLowerCase())
      setValue(Array.from(set))
    },
    [set, setValue]
  )

  const hasToken = useCallback(
    (currency: Type | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }

        const [, _currency] = currency.split(':')
        if (!isAddress(_currency)) {
          throw new Error('Address provided not a valid ERC20 address')
        }

        return set.has(currency.toLowerCase())
      }
      return !!set.has(currency.id.toLowerCase())
    },
    [set]
  )

  const mutate = useCallback(
    (type: 'add' | 'remove', currencyId: string) => {
      if (type === 'add') addPinnedToken(currencyId)
      if (type === 'remove') removePinnedToken(currencyId)
    },
    [addPinnedToken, removePinnedToken]
  )

  return useMemo(() => {
    return {
      data: set,
      mutate,
      hasToken,
    }
  }, [hasToken, mutate, set])
}
