'use client'

import { useCallback, useMemo } from 'react'
import { EvmToken } from 'sushi/evm'
import { getAddress, isAddress } from 'viem/utils'

import type { EvmAddress, EvmChainId } from 'sushi/evm'
import { useLocalStorage } from './useLocalStorage'

type Data = {
  chainId: EvmChainId
  id: string
  address: EvmAddress
  decimals: number
  name: string
  symbol: string
  logoUrl: string | undefined
}

export const useCustomTokens = () => {
  const [value, setValue] = useLocalStorage<Record<string, Data>>(
    'sushi.customTokens',
    {},
  )

  const hydrate = useCallback((data: Record<string, Data>) => {
    return Object.entries(data).reduce<
      Record<string, EvmToken<{ logoUrl?: string; approved: boolean }>>
    >((acc, [k, { address, chainId, decimals, name, symbol, logoUrl }]) => {
      acc[k] = new EvmToken({
        address,
        chainId,
        decimals,
        name,
        symbol,
        metadata: {
          approved: false,
          logoUrl,
        },
      })
      return acc
    }, {})
  }, [])

  const addCustomToken = useCallback(
    (currencies: EvmToken<{ logoUrl?: string }>[]) => {
      const data: Data[] = currencies.map((currency) => ({
        chainId: currency.chainId,
        id: currency.id,
        address: currency.address,
        name: currency.name,
        symbol: currency.symbol,
        decimals: currency.decimals,
        logoUrl: currency.metadata.logoUrl,
      }))

      setValue((prev) => {
        return data.reduce(
          (acc, cur) => {
            acc[`${cur.chainId}:${cur.address}`] = cur
            return acc
          },
          { ...prev },
        )
      })
    },
    [setValue],
  )

  const removeCustomToken = useCallback(
    (currency: EvmToken<{ logoUrl?: string }>) => {
      setValue((prev) => {
        return Object.entries(prev).reduce<Record<string, Data>>((acc, cur) => {
          if (cur[0] === `${currency.chainId}:${currency.address}`) {
            return acc // filter
          }

          acc[cur[0]] = cur[1] // add
          return acc
        }, {})
      })
    },
    [setValue],
  )

  const hasToken = useCallback(
    (currency: EvmToken | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }

        const [_chainId, _currency] = currency.split(':')
        if (!isAddress(_currency)) {
          throw new Error('Address provided not a valid ERC20 address')
        }

        return !!value[`${_chainId}:${_currency}`]
      }
      return !!value[`${currency.chainId}:${currency.address}`]
    },
    [value],
  )

  const mutate = useCallback(
    (type: 'add' | 'remove', currency: EvmToken<{ logoUrl?: string }>[]) => {
      if (type === 'add') addCustomToken(currency)
      if (type === 'remove') removeCustomToken(currency[0])
    },
    [addCustomToken, removeCustomToken],
  )

  return useMemo(() => {
    return {
      data: hydrate(value),
      mutate,
      hasToken,
    }
  }, [hasToken, hydrate, mutate, value])
}
