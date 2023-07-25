import { getAddress as _getAddress, isAddress } from '@ethersproject/address'
import { ChainId } from '@sushiswap/chain'
import { Type } from '@sushiswap/currency'
import { COMMON_BASES } from '@sushiswap/router-config'
import { useCallback, useEffect, useMemo } from 'react'

import { useLocalStorage } from './useLocalStorage'

const COMMON_BASES_IDS = Object.entries(COMMON_BASES).reduce<Record<string, string[]>>((acc, [chain, tokens]) => {
  const chainId = chain
  acc[chainId] = Array.from(new Set(tokens.map((token) => token.id)))
  return acc
}, {} as Record<ChainId, string[]>)

function getAddress(address: string) {
  if (address === 'NATIVE') return 'NATIVE'
  return _getAddress(address)
}

export const usePinnedTokens = () => {
  const [value, setValue] = useLocalStorage('sushi.pinnedTokens', COMMON_BASES_IDS)

  useEffect(() => {
    Object.entries(COMMON_BASES_IDS).forEach(([chainId, tokens]) => {
      if (!value[chainId]) {
        value[chainId] = tokens
        setValue(value)
      }
    })
  }, [value])

  const addPinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(':')
      value[chainId] = Array.from(new Set([...value[chainId], `${chainId}:${getAddress(address)}`]))
      setValue(value)
    },
    [setValue]
  )

  const removePinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(':')
      value[chainId] = Array.from(
        new Set(value[chainId].filter((token) => token !== `${chainId}:${getAddress(address)}`))
      )
      setValue(value)
    },
    [setValue]
  )

  const hasToken = useCallback(
    (currency: Type | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }

        const [chainId, address] = currency.split(':')
        if (address !== 'NATIVE' && !isAddress(address)) {
          throw new Error('Address provided not a valid ERC20 address')
        }

        return value?.[chainId]?.includes(`${chainId}:${getAddress(address)}`)
      }

      return !!value?.[currency.chainId]?.includes(currency.id)
    },
    [value]
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
      data: value,
      mutate,
      hasToken,
    }
  }, [hasToken, mutate, value])
}
