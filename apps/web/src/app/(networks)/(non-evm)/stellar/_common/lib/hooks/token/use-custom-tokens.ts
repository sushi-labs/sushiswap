import { useLocalStorage } from '@sushiswap/hooks'
import { useCallback, useMemo } from 'react'
import {
  type SerializedStellarToken,
  type StellarContractAddress,
  StellarToken,
  normalizeStellarAddress,
} from 'sushi/stellar'

// v2 stores StellarToken's `toJSON()` form. v1 stored the legacy `Token`
// shape (`{contract, code, ...}`); keys are bumped on purpose so legacy
// imports are dropped rather than incorrectly hydrated.
export const STELLAR_CUSTOM_TOKEN_KEY = 'sushi.stellar.custom-tokens.v2'

export function useCustomTokens() {
  const [value, setValue] = useLocalStorage<
    Record<StellarContractAddress, SerializedStellarToken>
  >(STELLAR_CUSTOM_TOKEN_KEY, {})

  const hydrate = useCallback(
    (data: Record<StellarContractAddress, SerializedStellarToken>) => {
      return Object.entries(data).reduce<
        Record<StellarContractAddress, StellarToken>
      >((acc, [k, serialized]) => {
        acc[k as StellarContractAddress] = StellarToken.fromJSON(serialized)
        return acc
      }, {})
    },
    [],
  )

  const addCustomToken = useCallback(
    (token: StellarToken) => {
      setValue((prev) => {
        const updated = { ...prev }
        updated[token.address] = token.toJSON()
        return updated
      })
    },
    [setValue],
  )

  const removeCustomToken = useCallback(
    (currency: StellarToken) => {
      setValue((prev) => {
        const next = { ...prev }
        delete next[currency.address]
        return next
      })
    },
    [setValue],
  )

  const hasToken = useCallback(
    (currency: StellarToken | StellarContractAddress) => {
      const key =
        typeof currency === 'string'
          ? normalizeStellarAddress(currency)
          : currency.address
      return Boolean(value[key])
    },
    [value],
  )

  const mutate = useCallback(
    (type: 'add' | 'remove', currency: StellarToken) => {
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
