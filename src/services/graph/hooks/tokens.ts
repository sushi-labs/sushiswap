import { getTridentTokenPrices } from 'app/services/graph'
import useSWR from 'swr'

import { getTridentTokenPrice, getTridentTokens } from '../fetchers'

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTokens({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-tokens', chainId, variables] : null,
    () => getTridentTokens(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTokenPrices({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-prices', chainId, variables] : null,
    () => getTridentTokenPrices(chainId, variables),
    swrConfig
  )
}

// @ts-ignore TYPE NEEDS FIXING
export function useTridentTokenPrice({ chainId, variables, shouldFetch = true, swrConfig = undefined }) {
  return useSWR(
    shouldFetch && !!chainId ? ['trident-token-price', chainId, variables] : null,
    () => getTridentTokenPrice(chainId, variables),
    swrConfig
  )
}
