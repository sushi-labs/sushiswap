import { useLocalStorage } from '@sushiswap/hooks'
import { useCallback, useMemo } from 'react'
import {
  type StellarContractAddress,
  normalizeStellarAddress,
} from 'sushi/stellar'
import type { Token } from '../../types/token.type'

export const STELLAR_CUSTOM_TOKEN_KEY = 'sushi.stellar.custom-tokens'

export function useCustomTokens() {
  const [value, setValue] = useLocalStorage<
    Record<StellarContractAddress, Token>
  >(STELLAR_CUSTOM_TOKEN_KEY, {})

  const hydrate = useCallback((data: Record<StellarContractAddress, Token>) => {
    return Object.entries(data).reduce<Record<StellarContractAddress, Token>>(
      (acc, [k, token]) => {
        acc[k as StellarContractAddress] = { ...token }
        return acc
      },
      {},
    )
  }, [])

  const addCustomToken = useCallback(
    (token: Token) => {
      setValue((prev) => {
        const updated = { ...prev }
        updated[normalizeStellarAddress(token.contract)] = token
        return updated
      })
    },
    [setValue],
  )

  const removeCustomToken = useCallback(
    (currency: Token) => {
      setValue((prev) => {
        return Object.entries(prev).reduce<
          Record<StellarContractAddress, Token>
        >((acc, cur) => {
          if (cur[0].toUpperCase() === `${currency.contract}`.toUpperCase()) {
            return acc // filter
          }
          acc[cur[0] as StellarContractAddress] = cur[1] // add
          return acc
        }, {})
      })
    },
    [setValue],
  )

  const hasToken = useCallback(
    (currency: Token | StellarContractAddress) => {
      if (typeof currency === 'string') {
        return Boolean(value[normalizeStellarAddress(currency)])
      }
      return Boolean(value[normalizeStellarAddress(currency.contract)])
    },
    [value],
  )

  const mutate = useCallback(
    (type: 'add' | 'remove', currency: Token) => {
      if (type === 'add') addCustomToken(currency)
      if (type === 'remove') removeCustomToken(currency)
    },
    [addCustomToken, removeCustomToken],
  )

  return useMemo(() => {
    return {
      data: hydrate(value),
      mutate,
      hasToken,
    }
  }, [hydrate, mutate, hasToken, value])
}
