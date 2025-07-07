'use client'

import { useCallback, useMemo } from 'react'
import type { ID } from 'sushi'
import type { Currency } from 'sushi/currency'
import { getAddress as _getAddress, isAddress } from 'viem/utils'
import { useLocalStorage } from './useLocalStorage'

function getAddress(address: string) {
  if (address === 'NATIVE') return 'NATIVE'
  return _getAddress(address)
}

export type PinnedTokenId = `${ID}:${string}` | `${string}:NATIVE:${string}` //ID:symbol

export const usePinnedTokens = () => {
  const [pinnedTokens, setPinnedTokens] = useLocalStorage(
    'sushi.pinned-tokens-advanced',
    {} as Record<string, string[]>,
  )

  const addPinnedToken = useCallback(
    (currencyId: PinnedTokenId) => {
      const [chainId, address, symbol] = currencyId.split(':')
      setPinnedTokens((value) => {
        value[chainId] = Array.from(
          new Set([
            ...(value[chainId] || []),
            `${chainId}:${getAddress(address)}:${symbol}`,
          ]),
        )
        return value
      })
    },
    [setPinnedTokens],
  )

  const removePinnedToken = useCallback(
    (currencyId: PinnedTokenId) => {
      const [chainId, address, symbol] = currencyId.split(':')
      setPinnedTokens((value) => {
        value[chainId] = Array.from(
          new Set(
            value[chainId].filter(
              (token) =>
                token !== `${chainId}:${getAddress(address)}:${symbol}`,
            ),
          ),
        )
        return value
      })
    },
    [setPinnedTokens],
  )

  const hasToken = useCallback(
    (currency: Currency | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }

        const [chainId, address, symbol] = currency.split(':')
        if (address !== 'NATIVE' && !isAddress(address)) {
          throw new Error('Address provided not a valid ERC20 address')
        }
        return pinnedTokens?.[chainId]?.includes(
          `${chainId}:${getAddress(address)}:${symbol}`,
        )
      }

      return !!pinnedTokens?.[currency.chainId]?.includes(
        `${currency.id}:${currency?.symbol}`,
      )
    },
    [pinnedTokens],
  )

  const mutate = useCallback(
    (type: 'add' | 'remove', currencyId: PinnedTokenId) => {
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
