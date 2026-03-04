import { useMemo } from 'react'
import type { Currency } from 'sushi'
import { isNearIntentsChainId } from '../config'
import { useNearIntentsTokens } from './use-near-intents-tokens'

export const useNearAssetId = (currency: Currency | undefined) => {
  const query = useNearIntentsTokens()

  const data = useMemo(() => {
    const tokens = query.data
    if (!tokens || !currency) {
      return undefined
    }

    const chainId = currency.chainId

    if (!isNearIntentsChainId(chainId)) {
      return undefined
    }

    const chainTokens = tokens[chainId]

    if (!chainTokens) {
      return undefined
    }

    return chainTokens[currency.isNative ? 'NATIVE' : currency.address]?.assetId
  }, [query.data, currency])

  return {
    ...query,
    data,
  }
}
