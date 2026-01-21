'use client'

import { useCallback, useMemo } from 'react'
import { type EvmCurrency, type EvmID, isEvmAddress } from 'sushi/evm'
import {
  type SvmAddress,
  type SvmChainId,
  type SvmCurrency,
  isSvmAddress,
} from 'sushi/svm'
import { getAddress as _getAddress } from 'viem/utils'
import { useLocalStorage } from './useLocalStorage'

function getAddress(address: string) {
  if (address === 'NATIVE') return 'NATIVE'
  if (isSvmAddress(address)) return address
  return _getAddress(address)
}

type ID = EvmID | `${SvmChainId}:${SvmAddress}`

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
    (currencyId: ID) => {
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
    (currency: EvmCurrency | SvmCurrency | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }

        const [chainId, address] = currency.split(':')
        if (
          address !== 'NATIVE' &&
          !isEvmAddress(address) &&
          !isSvmAddress(address)
        ) {
          throw new Error('Address provided not a valid ERC20 or Solana address')
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
    (type: 'add' | 'remove', currencyId: ID) => {
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
