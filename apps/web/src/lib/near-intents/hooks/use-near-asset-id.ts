import { useMemo } from 'react'
import type { Currency } from 'sushi'
import { StellarChainId } from 'sushi/stellar'
import type { Token as StellarToken } from '~stellar/_common/lib/types/token.type'
import { isNearIntentsChainId } from '../config'
import { useNearIntentsTokens } from './use-near-intents-tokens'

export const useNearAssetId = (
  currency: Currency | StellarToken | undefined,
) => {
  const query = useNearIntentsTokens()

  const data = useMemo(() => {
    const tokens = query.data
    if (!tokens || !currency) {
      return undefined
    }

    const chainId =
      'chainId' in currency ? currency.chainId : StellarChainId.STELLAR

    if (!isNearIntentsChainId(chainId)) {
      return undefined
    }

    const chainTokens = tokens[chainId]

    if (!chainTokens) {
      return undefined
    }

    return chainTokens[
      'chainId' in currency
        ? currency.isNative
          ? 'NATIVE'
          : currency.address.toLowerCase()
        : currency.contract.toLowerCase()
    ]?.assetId
  }, [query.data, currency])

  return {
    ...query,
    data,
  }
}
