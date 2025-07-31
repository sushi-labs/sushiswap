'use client'

import { useCallback, useMemo } from 'react'
import type { EvmCurrency, EvmID } from 'sushi/evm'
import { getAddress as _getAddress, isAddress } from 'viem/utils'
import { useLocalStorage } from './useLocalStorage'

function getAddress(address: string) {
  if (address === 'NATIVE') return 'NATIVE'
  return _getAddress(address)
}

export const usePinnedTokens = () => {
  const [pinnedTokens, setPinnedTokens] = useLocalStorage(
    'sushi.pinned-tokens',
    {} as Record<string, string[]>,
  )

  const addPinnedToken = useCallback(
    (currencyId: string) => {
      const [chainId, address] = currencyId.split(':')
      setPinnedTokens((value) => {
        value[chainId] = Array.from(
          new Set([
            ...(value[chainId] || []),
            `${chainId}:${getAddress(address)}`,
          ]),
        )
        return value
      })
    },
    [setPinnedTokens],
  )

  const removePinnedToken = useCallback(
    (currencyId: EvmID) => {
      const [chainId, address] = currencyId.split(':')
      setPinnedTokens((value) => {
        value[chainId] = Array.from(
          new Set(
            value[chainId].filter(
              (token) => token !== `${chainId}:${getAddress(address)}`,
            ),
          ),
        )
        return value
      })
    },
    [setPinnedTokens],
  )

  const hasToken = useCallback(
    (currency: EvmCurrency | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }

        const [chainId, address] = currency.split(':')
        if (address !== 'NATIVE' && !isAddress(address)) {
          throw new Error('Address provided not a valid ERC20 address')
        }

        return pinnedTokens?.[chainId]?.includes(
          `${chainId}:${getAddress(address)}`,
        )
      }

      return !!pinnedTokens?.[currency.chainId]?.includes(currency.id)
    },
    [pinnedTokens],
  )

  const mutate = useCallback(
    (type: 'add' | 'remove', currencyId: EvmID) => {
      if (type === 'add') addPinnedToken(currencyId)
      if (type === 'remove') removePinnedToken(currencyId)
    },
    [addPinnedToken, removePinnedToken],
  )

  return useMemo(() => {
    return {
      data: pinnedTokens,
      mutate,
      hasToken,
    }
  }, [hasToken, mutate, pinnedTokens])
}
