import { useLocalStorage } from '@sushiswap/hooks'
import { useCallback, useMemo } from 'react'
import type { KadenaToken } from '~kadena/_common/types/token-type'

const localStorageKey = 'sushi.customTokens.kadena'

export const useCustomTokens = () => {
  const [value, setValue] = useLocalStorage<Record<string, KadenaToken>>(
    localStorageKey,
    {},
  )

  const hydrate = useCallback((data: Record<string, KadenaToken>) => {
    return Object.entries(data).reduce<Record<string, KadenaToken>>(
      (acc, [k, { tokenAddress, name, tokenSymbol, tokenDecimals }]) => {
        acc[k] = {
          tokenAddress,
          tokenSymbol,
          tokenDecimals,
          name,
          tokenImage: data[k].tokenImage,
          validated: data[k].validated,
          tokenInfo: data[k].tokenInfo,
        }
        return acc
      },
      {},
    )
  }, [])

  const addCustomToken = useCallback(
    (currencies: KadenaToken[]) => {
      const data: KadenaToken[] = currencies.map((currency) => ({
        tokenAddress: currency.tokenAddress,
        tokenSymbol: currency.tokenSymbol,
        tokenDecimals: currency.tokenDecimals,
        tokenImage: currency.tokenImage,
        name: currency.name,
        validated: currency.validated,
        tokenInfo: currency.tokenInfo,
      }))

      setValue((prev) => {
        return data.reduce(
          (acc, cur) => {
            acc[`${cur.tokenAddress}`] = cur
            return acc
          },
          { ...prev },
        )
      })
    },
    [setValue],
  )

  const removeCustomToken = useCallback(
    (currency: KadenaToken) => {
      setValue((prev) => {
        return Object.entries(prev).reduce<Record<string, KadenaToken>>(
          (acc, cur) => {
            if (cur[0] === `${currency.tokenAddress}`) {
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
    (currency: string | KadenaToken): boolean => {
      const address =
        typeof currency === 'string' ? currency : currency.tokenAddress
      if (address === 'KDA') return false
      // @TODO: replace with kadena address validation
      // if (!isAddress(currency.tokenAddress)) {
      //   throw new Error('Invalid address')
      // }

      return !!value[address]
    },
    [value],
  )

  const addOrRemoveToken = useCallback(
    (type: 'add' | 'remove', currency: KadenaToken[]) => {
      if (type === 'add') addCustomToken(currency)
      if (type === 'remove') removeCustomToken(currency[0])
    },
    [addCustomToken, removeCustomToken],
  )

  return useMemo(() => {
    return {
      customTokens: hydrate(value),
      addOrRemoveToken,
      hasToken,
    }
  }, [hydrate, addOrRemoveToken, hasToken, value])
}
