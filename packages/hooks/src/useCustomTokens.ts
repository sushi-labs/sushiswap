'use client'

import { useCallback, useMemo } from 'react'
import type { AddressFor, TokenFor } from 'sushi'
import { EvmToken, isEvmAddress, isEvmChainId } from 'sushi/evm'
import type { EvmChainId } from 'sushi/evm'
import {
  type SvmChainId,
  SvmToken,
  isSvmAddress,
  isSvmChainId,
} from 'sushi/svm'
import { isAddress } from 'viem/utils'
import { useLocalStorage } from './useLocalStorage'

type Data<TChainId extends EvmChainId | SvmChainId> = {
  chainId: TChainId
  id: string
  address: AddressFor<TChainId>
  decimals: number
  name: string
  symbol: string
  logoUrl: string | undefined
}

export function useCustomTokens<TChainId extends EvmChainId | SvmChainId>() {
  const [value, setValue] = useLocalStorage<Record<string, Data<TChainId>>>(
    'sushi.customTokens',
    {},
  )

  const hydrate = useCallback((data: Record<string, Data<TChainId>>) => {
    return Object.entries(data).reduce<
      Record<
        string,
        TokenFor<TChainId, { logoUrl?: string; approved: boolean }>
      >
    >((acc, [k, { address, chainId, decimals, name, symbol, logoUrl }]) => {
      if (isEvmChainId(chainId)) {
        acc[k] = new EvmToken({
          address: address as AddressFor<typeof chainId>,
          chainId,
          decimals,
          name,
          symbol,
          metadata: {
            approved: false,
            logoUrl,
          },
        }) as TokenFor<TChainId, { logoUrl?: string; approved: boolean }>
      } else if (isSvmChainId(chainId)) {
        acc[k] = new SvmToken({
          address: address as AddressFor<typeof chainId>,
          chainId,
          decimals,
          name,
          symbol,
          metadata: {
            approved: false,
            logoUrl,
          },
        }) as TokenFor<TChainId, { logoUrl?: string; approved: boolean }>
      }

      return acc
    }, {})
  }, [])

  const addCustomToken = useCallback(
    (currencies: TokenFor<TChainId, { logoUrl?: string }>[]) => {
      const data: Data<TChainId>[] = currencies.map((currency) => ({
        chainId: currency.chainId as TChainId,
        id: currency.id,
        address: currency.address as AddressFor<TChainId>,
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
    (currency: TokenFor<TChainId, { logoUrl?: string }>) => {
      setValue((prev) => {
        return Object.entries(prev).reduce<Record<string, Data<TChainId>>>(
          (acc, cur) => {
            if (cur[0] === `${currency.chainId}:${currency.address}`) {
              return acc // filter
            }

            acc[cur[0]] = cur[1] // add
            return acc
          },
          {},
        )
      })
    },
    [setValue],
  )

  const hasToken = useCallback(
    (currency: TokenFor<TChainId, { logoUrl?: string }> | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }

        const [_chainId, _currency] = currency.split(':')
        if (!isEvmAddress(_currency) && !isSvmAddress(_currency)) {
          throw new Error(
            'Address provided not a valid ERC20 or Solana address',
          )
        }

        return !!value[`${_chainId}:${_currency}`]
      }
      return !!value[`${currency.chainId}:${currency.address}`]
    },
    [value],
  )

  const mutate = useCallback(
    (
      type: 'add' | 'remove',
      currency: TokenFor<TChainId, { logoUrl?: string }>[],
    ) => {
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
