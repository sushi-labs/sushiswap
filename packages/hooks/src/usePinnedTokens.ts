import { getAddress, isAddress } from '@ethersproject/address'
import { Type } from '@sushiswap/currency'
import { COMMON_BASES } from '@sushiswap/router-config'
import { useCallback, useMemo } from 'react'

import { useLocalStorage } from './useLocalStorage'

const COMMON_BASES_IDS = Object.values(COMMON_BASES).reduce<string[]>((acc, cur) => {
  acc.push(...cur.map((currency) => currency.wrapped.id))
  return acc
}, [])

export const usePinnedTokens = () => {
  const [value, setValue] = useLocalStorage<string[]>('sushi.pinnedTokens', COMMON_BASES_IDS)

  const set = useMemo(() => {
    const pinnedTokens = new Set<string>()
    value.forEach((token) => {
      pinnedTokens.add(token)
    })
    return pinnedTokens
  }, [value])

  const addPinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(':')
      set.add(`${chainId}:${getAddress(address)}`)
      setValue(Array.from(set))
    },
    [set, setValue]
  )

  const removePinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(':')
      set.delete(`${chainId}:${getAddress(address)}`)
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

        const [chainId, address] = currency.split(':')
        if (!isAddress(address)) {
          throw new Error('Address provided not a valid ERC20 address')
        }

        return set.has(`${chainId}:${getAddress(address)}`)
      }
      return !!set.has(currency.id)
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
