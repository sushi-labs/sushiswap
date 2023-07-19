import { useLocalStorage } from '@sushiswap/hooks'
import { Data } from './useTokens'
import { useCallback, useMemo } from 'react'
import { Token } from './tokenType'

export function useCustomTokens() {
  const [value, setValue] = useLocalStorage<Record<string, Data>>('sushi.customTokens.aptos', {})

  const hydrate = useCallback((data: Record<string, Data>) => {
    return Object.entries(data).reduce<Record<string, Token>>(
      (acc, [k, { address, chainId, decimals, name, symbol }]) => {
        acc[k] = { address, chainId, decimals, name: String(name), symbol: String(symbol) }
        return acc
      },
      {}
    )
  }, [])

  const addCustomToken = useCallback(
    (currencies: Token[]) => {
      const data: Data[] = currencies.map((currency) => ({
        chainId: currency.chainId,
        // id: 'currency.id',
        address: currency.address,
        name: currency.name,
        symbol: currency.symbol,
        decimals: currency.decimals,
      }))

      // customTokenMutate('add', [currency])
      setValue((prev) => {
        return data.reduce(
          (acc, cur) => {
            acc[`${cur.chainId}:${cur.address}`] = cur
            return acc
          },
          { ...prev }
        )
      })
    },
    [setValue]
  )

  const removeCustomToken = useCallback(
    (currency: Token) => {
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
    [setValue]
  )

  const hasToken = useCallback(
    (currency: Token | string) => {
      if (typeof currency === 'string') {
        if (!currency.includes(':')) {
          throw new Error('Address provided instead of id')
        }
        const [_chainId, ..._currency] = currency.split(':')
        return !!value[`${_chainId}:${_currency.join(':')}`]
      }
      return !!value[`${currency.chainId}:${currency.address}`]
    },
    [value]
  )

  const mutate = useCallback(
    (type: 'add' | 'remove', currency: Token[]) => {
      if (type === 'add') addCustomToken(currency)
      if (type === 'remove') removeCustomToken(currency[0])
    },
    [addCustomToken]
  )

  return useMemo(() => {
    return {
      data: hydrate(value),
      mutate,
      hasToken,
    }
  }, [hydrate, mutate, hasToken])
}
