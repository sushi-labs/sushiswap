import { useLocalStorage } from '@sushiswap/hooks'
import { useCallback, useMemo } from 'react'
import type { Token } from '../../types/token.type'

export const STELLAR_CUSTOM_TOKEN_KEY = 'sushi.stellar.custom-tokens'

export function useCustomTokens() {
  const [value, setValue] = useLocalStorage<Record<string, Token>>(
    STELLAR_CUSTOM_TOKEN_KEY,
    {},
  )

  const hydrate = useCallback((data: Record<string, Token>) => {
    return Object.entries(data).reduce<Record<string, Token>>(
      (acc, [k, token]) => {
        acc[k] = { ...token }
        return acc
      },
      {},
    )
  }, [])

  const addCustomToken = useCallback(
    (token: Token) => {
      setValue((prev) => {
        const updated = { ...prev }
        updated[token.contract.toUpperCase()] = token
        return updated
      })
    },
    [setValue],
  )

  const removeCustomToken = useCallback(
    (currency: Token) => {
      setValue((prev) => {
        return Object.entries(prev).reduce<Record<string, Token>>(
          (acc, cur) => {
            if (cur[0].toUpperCase() === `${currency.contract}`.toUpperCase()) {
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
    (currency: Token | string) => {
      if (typeof currency === 'string') {
        return Boolean(value[currency.toUpperCase()])
      }
      return Boolean(value[currency.contract.toUpperCase()])
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
